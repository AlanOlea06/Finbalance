import { supabase } from './supabase';
import { getCurrentUserProfile } from './userService';

export interface FixedIncome {
  id: number;
  user_id: number;
  concepto: string;
  monto: number;
  frecuencia: string;
  pay_day_weekly?: number | null;
  pay_day_monthly1?: number | null;
  pay_day_monthly2?: number | null;
}

export type FixedIncomeInsert = Omit<FixedIncome, 'id' | 'user_id'>;

export const fixedIncomesService = {
  async getFixedIncomes(): Promise<FixedIncome[]> {
    const profile = await getCurrentUserProfile();
    const { data, error } = await supabase
      .from('fixed_incomes')
      .select('*')
      .eq('user_id', profile.id)
      .order('id', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async createFixedIncome(income: FixedIncomeInsert): Promise<FixedIncome> {
    const profile = await getCurrentUserProfile();
    
    const monto = parseFloat(income.monto as unknown as string);
    if (isNaN(monto) || monto <= 0) {
      throw new Error('El monto debe ser un número válido mayor a cero');
    }

    const { data, error } = await supabase
      .from('fixed_incomes')
      .insert({
        user_id: profile.id,
        concepto: income.concepto,
        monto: monto,
        frecuencia: income.frecuencia,
        pay_day_weekly: income.pay_day_weekly ?? null,
        pay_day_monthly1: income.pay_day_monthly1 ?? null,
        pay_day_monthly2: income.pay_day_monthly2 ?? null,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateFixedIncome(id: number, updates: Partial<FixedIncomeInsert>): Promise<FixedIncome> {
    const profile = await getCurrentUserProfile();
    
    if (updates.monto !== undefined) {
      const monto = parseFloat(updates.monto as unknown as string);
      if (isNaN(monto) || monto <= 0) {
        throw new Error('El monto debe ser un número válido mayor a cero');
      }
      updates.monto = monto;
    }

    const { data, error } = await supabase
      .from('fixed_incomes')
      .update(updates)
      .eq('id', id)
      .eq('user_id', profile.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteFixedIncome(id: number): Promise<void> {
    const profile = await getCurrentUserProfile();
    const { error } = await supabase
      .from('fixed_incomes')
      .delete()
      .eq('id', id)
      .eq('user_id', profile.id);

    if (error) throw error;
  },
};
