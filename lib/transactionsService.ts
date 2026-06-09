import { supabase } from './supabase';
import { getCurrentUserProfile } from './userService';

export interface Transaction {
  id: string;
  user_id: number;
  user_goals_id?: number;
  description: string;
  amount: number;
  date: string;
  category: string;
  type: 'ingreso' | 'gasto';
}

export const transactionsService = {
  async getTransactions(): Promise<Transaction[]> {
    const profile = await getCurrentUserProfile();

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', profile.id)
      .order('date', { ascending: false });

    if (error) throw error;
    return (data as Transaction[]) || [];
  },

  async createTransaction(payload: Omit<Transaction, 'id' | 'user_id'>): Promise<void> {
    const profile = await getCurrentUserProfile();
    const userId = profile.id;

    let goalId: number | null = null;
    if (payload.category === 'Ahorro' || payload.category === 'Deuda') {
      const { data: goals, error: goalsError } = await supabase
        .from('user_goals')
        .select('id, current_amount')
        .eq('user_id', userId)
        .eq('name', payload.description)
        .eq('type', payload.category)
        .limit(1);

      if (goalsError) throw goalsError;

      if (goals?.length) {
        goalId = goals[0].id;
        const updatedAmount = (goals[0].current_amount ?? 0) + payload.amount;

        const { error: updateError } = await supabase
          .from('user_goals')
          .update({ current_amount: updatedAmount })
          .eq('id', goalId);

        if (updateError) throw updateError;
      }
    }

    const { error: insertError } = await supabase.from('transactions').insert({
      user_id: userId,
      user_goals_id: goalId,
      description: payload.description,
      amount: payload.amount,
      date: payload.date,
      category: payload.category,
      type: payload.type,
    });

    if (insertError) throw insertError;
  },

  async getTransactionById(id: string): Promise<Transaction> {
    const profile = await getCurrentUserProfile();

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', id)
      .eq('user_id', profile.id)
      .single();

    if (error) throw error;
    if (!data) throw new Error('Transaction not found');

    return data as Transaction;
  },

  async deleteTransaction(id: string): Promise<void> {
    const profile = await getCurrentUserProfile();

    const { data: transaction, error: fetchError } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', id)
      .eq('user_id', profile.id)
      .single();

    if (fetchError) throw fetchError;
    if (!transaction) throw new Error('Transaction not found');

    const typedTransaction = transaction as Transaction;

    if ((typedTransaction.category === 'Ahorro' || typedTransaction.category === 'Deuda') && typedTransaction.user_goals_id) {
      const { data: goal, error: goalError } = await supabase
        .from('user_goals')
        .select('current_amount')
        .eq('id', transaction.user_goals_id)
        .single();

      if (goalError && goalError.code !== 'PGRST116') throw goalError;

      if (goal) {
        const newAmount = Math.max((goal.current_amount ?? 0) - transaction.amount, 0);
        const { error: updateError } = await supabase
          .from('user_goals')
          .update({ current_amount: newAmount })
          .eq('id', typedTransaction.user_goals_id);

        if (updateError) throw updateError;
      }
    }

    const { error: deleteError } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)
      .eq('user_id', profile.id);

    if (deleteError) throw deleteError;
  },
};
