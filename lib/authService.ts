import { supabase } from './supabase';

export interface EmployeeInput {
  nombre: string;
  puesto: string;
  sueldo: string;
  frecuencia: string;
}

export interface FixedExpenseInput {
  concepto: string;
  monto: string;
  frecuencia: string;
}

export interface RegistrationData {
  nombre: string;
  email: string;
  password: string;
  confirmPassword: string;
  pais: string;
  ciudad: string;
  moneda: string;
  useType: 'personal' | 'negocio';
  employees: EmployeeInput[];
  fixedExpenses: FixedExpenseInput[];
  hasFixedSalary: 'yes' | 'no';
  fixedSalaryAmount: string;
  fixedSalaryFrequency: 'semanal' | 'quincenal' | 'mensual';
  payDayWeekly: string;
  payDayMonthly1: string;
  payDayMonthly2: string;
}

export const authService = {
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  async signUp(payload: RegistrationData) {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: payload.email,
      password: payload.password,
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('No se pudo crear el usuario en Supabase Auth');

    const { data: newUser, error: userInsertError } = await supabase
      .from('users')
      .insert({
        nombre: payload.nombre,
        email: payload.email,
        password: '',
        pais: payload.pais,
        ciudad: payload.ciudad,
        moneda: payload.moneda,
        use_type: payload.useType,
      })
      .select('id')
      .single();

    if (userInsertError || !newUser) {
      throw userInsertError ?? new Error('Error al crear el perfil del usuario');
    }

    const userId = newUser.id;

    if (payload.hasFixedSalary === 'yes' && parseFloat(payload.fixedSalaryAmount) > 0) {
      const { error: incomeError } = await supabase.from('fixed_incomes').insert({
        user_id: userId,
        concepto: 'Salario Principal',
        monto: parseFloat(payload.fixedSalaryAmount),
        frecuencia: payload.fixedSalaryFrequency,
        pay_day_weekly:
          payload.fixedSalaryFrequency === 'semanal'
            ? parseInt(payload.payDayWeekly, 10)
            : null,
        pay_day_monthly1:
          payload.fixedSalaryFrequency === 'quincenal'
            ? parseInt(payload.payDayMonthly1, 10)
            : null,
        pay_day_monthly2:
          payload.fixedSalaryFrequency === 'quincenal'
            ? parseInt(payload.payDayMonthly2, 10)
            : null,
      });
      if (incomeError) throw incomeError;
    }

    if (payload.useType === 'negocio' && payload.employees.length > 0) {
      const employeeRows = payload.employees.map((employee) => ({
        user_id: userId,
        nombre: employee.nombre,
        puesto: employee.puesto,
        sueldo: parseFloat(employee.sueldo),
        frecuencia: employee.frecuencia,
      }));

      const { error: employeeError } = await supabase.from('employees').insert(employeeRows);
      if (employeeError) throw employeeError;
    }

    if (payload.fixedExpenses.length > 0) {
      const expenseRows = payload.fixedExpenses.map((expense) => ({
        user_id: userId,
        concepto: expense.concepto,
        monto: parseFloat(expense.monto),
        frecuencia: expense.frecuencia,
      }));

      const { error: expenseError } = await supabase.from('fixed_expenses').insert(expenseRows);
      if (expenseError) throw expenseError;
    }

    return newUser;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },
};
