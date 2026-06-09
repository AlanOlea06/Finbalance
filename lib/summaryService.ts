import { supabase } from './supabase';
import { getCurrentUserProfile } from './userService';

export interface SummaryData {
  totalIncomes: number;
  totalFixedExpenses: number;
  totalGoalPayments: number;
  totalAntExpenses: number;
  totalSavingsCurrent: number;
  totalSavingsGoal: number;
  availableForAntSpending: number;
}

function parseNumber(value: number | string | null | undefined): number {
  return typeof value === 'number' ? value : parseFloat(String(value ?? '0')) || 0;
}

function getDateRange(period: 'semana' | 'mes') {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  if (period === 'semana') {
    const day = now.getDay();
    const start = new Date(now);
    start.setDate(now.getDate() - day);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }

  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  return { start, end };
}

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function calculateFixedIncomeAmount(
  amount: number,
  frequency: string,
  period: 'semana' | 'mes',
  payDayWeekly?: number | null,
) {
  if (period === 'semana') {
    if (frequency === 'semanal') {
      const today = new Date().getDay();
      if (payDayWeekly !== null && payDayWeekly !== undefined && today >= payDayWeekly) {
        return amount;
      }
      return 0;
    }
    if (frequency === 'quincenal') return amount / 2;
    if (frequency === 'mensual') return amount / 4;
    return 0;
  }

  if (period === 'mes') {
    if (frequency === 'semanal') return amount * 4;
    if (frequency === 'quincenal') return amount * 2;
    if (frequency === 'mensual') return amount;
  }

  return 0;
}

function calculateFixedExpenseAmount(amount: number, frequency: string, period: 'semana' | 'mes') {
  if (period === 'semana') {
    if (frequency === 'semanal') return amount;
    if (frequency === 'quincenal') return amount / 2;
    if (frequency === 'mensual') return amount / 4;
    if (frequency === 'anual') return amount / 48;
  }

  if (period === 'mes') {
    if (frequency === 'semanal') return amount * 4;
    if (frequency === 'quincenal') return amount * 2;
    if (frequency === 'mensual') return amount;
    if (frequency === 'anual') return amount / 12;
  }

  return 0;
}

export const summaryService = {
  async getSummary(period: 'semana' | 'mes'): Promise<SummaryData> {
    const profile = await getCurrentUserProfile();
    const { start, end } = getDateRange(period);
    const startDate = formatDate(start);
    const endDate = formatDate(end);

    const [fixedIncomesResult, fixedExpensesResult, manualIncomesResult, antExpensesResult, goalPaymentsResult, savingsResult] = await Promise.all([
      supabase
        .from('fixed_incomes')
        .select('monto, frecuencia, pay_day_weekly')
        .eq('user_id', profile.id),
      supabase
        .from('fixed_expenses')
        .select('monto, frecuencia')
        .eq('user_id', profile.id),
      supabase
        .from('transactions')
        .select('amount')
        .eq('user_id', profile.id)
        .eq('type', 'ingreso')
        .gte('date', startDate)
        .lte('date', endDate),
      supabase
        .from('transactions')
        .select('amount')
        .eq('user_id', profile.id)
        .eq('type', 'gasto')
        .not('category', 'in', '(Ahorro,Deuda)')
        .gte('date', startDate)
        .lte('date', endDate),
      supabase
        .from('transactions')
        .select('amount')
        .eq('user_id', profile.id)
        .eq('type', 'gasto')
        .in('category', ['Ahorro', 'Deuda'])
        .gte('date', startDate)
        .lte('date', endDate),
      supabase
        .from('user_goals')
        .select('current_amount, total_amount')
        .eq('user_id', profile.id),
    ]);

    if (fixedIncomesResult.error) throw fixedIncomesResult.error;
    if (fixedExpensesResult.error) throw fixedExpensesResult.error;
    if (manualIncomesResult.error) throw manualIncomesResult.error;
    if (antExpensesResult.error) throw antExpensesResult.error;
    if (goalPaymentsResult.error) throw goalPaymentsResult.error;
    if (savingsResult.error) throw savingsResult.error;

    const fixedIncomes = fixedIncomesResult.data || [];
    const fixedExpenses = fixedExpensesResult.data || [];
    const manualIncomes = manualIncomesResult.data || [];
    const antExpenses = antExpensesResult.data || [];
    const goalPayments = goalPaymentsResult.data || [];
    const savings = savingsResult.data || [];

    const totalFixedIncome = fixedIncomes.reduce((sum, item) => {
      return sum + calculateFixedIncomeAmount(
        parseNumber(item.monto),
        item.frecuencia,
        period,
        item.pay_day_weekly,
      );
    }, 0);

    const totalFixedExpenses = fixedExpenses.reduce((sum, item) => {
      return sum + calculateFixedExpenseAmount(parseNumber(item.monto), item.frecuencia, period);
    }, 0);

    const totalManualIncomes = manualIncomes.reduce((sum, item) => sum + parseNumber(item.amount), 0);
    const totalAntExpenses = antExpenses.reduce((sum, item) => sum + parseNumber(item.amount), 0);
    const totalGoalPayments = goalPayments.reduce((sum, item) => sum + parseNumber(item.amount), 0);

    const totalSavingsCurrent = savings.reduce((sum, item) => sum + parseNumber(item.current_amount), 0);
    const totalSavingsGoal = savings.reduce((sum, item) => sum + parseNumber(item.total_amount), 0);

    const availableForAntSpending = Math.max(
      0,
      totalFixedIncome + totalManualIncomes - totalFixedExpenses - totalGoalPayments - totalAntExpenses,
    );

    return {
      totalIncomes: totalFixedIncome + totalManualIncomes,
      totalFixedExpenses,
      totalGoalPayments,
      totalAntExpenses,
      totalSavingsCurrent,
      totalSavingsGoal,
      availableForAntSpending,
    };
  },
};
