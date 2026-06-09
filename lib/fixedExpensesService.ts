import { supabase } from './supabase';
import { getCurrentUserProfile } from './userService';

export interface FixedExpense {
  id: number;
  user_id: number;
  concepto: string;
  monto: number;
  frecuencia: string;
}

export type FixedExpenseInsert = Omit<FixedExpense, 'id' | 'user_id'>;

export const fixedExpensesService = {
  async getFixedExpenses(): Promise<FixedExpense[]> {
    const profile = await getCurrentUserProfile();
    const { data, error } = await supabase
      .from('fixed_expenses')
      .select('*')
      .eq('user_id', profile.id)
      .order('id', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async createFixedExpense(expense: FixedExpenseInsert): Promise<FixedExpense> {
    const profile = await getCurrentUserProfile();
    
    // Validación de datos (similar a la ruta Next.js)
    const monto = parseFloat(expense.monto as unknown as string);
    if (isNaN(monto) || monto <= 0) {
      throw new Error('El monto debe ser un número válido mayor a cero');
    }

    const { data, error } = await supabase
      .from('fixed_expenses')
      .insert({
        user_id: profile.id,
        concepto: expense.concepto,
        monto: monto,
        frecuencia: expense.frecuencia,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateFixedExpense(id: number, updates: Partial<FixedExpenseInsert>): Promise<FixedExpense> {
    const profile = await getCurrentUserProfile();
    
    // Validación opcional si envían monto
    if (updates.monto !== undefined) {
      const monto = parseFloat(updates.monto as unknown as string);
      if (isNaN(monto) || monto <= 0) {
        throw new Error('El monto debe ser un número válido mayor a cero');
      }
      updates.monto = monto;
    }

    const { data, error } = await supabase
      .from('fixed_expenses')
      .update(updates)
      .eq('id', id)
      .eq('user_id', profile.id) // Seguridad adicional
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteFixedExpense(id: number): Promise<void> {
    const profile = await getCurrentUserProfile();
    const { error } = await supabase
      .from('fixed_expenses')
      .delete()
      .eq('id', id)
      .eq('user_id', profile.id); // Seguridad adicional

    if (error) throw error;
  },
};
