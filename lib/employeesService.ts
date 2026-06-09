import { supabase } from './supabase';
import { getCurrentUserProfile } from './userService';

export interface Employee {
  id: number;
  user_id: number;
  nombre: string;
  puesto: string;
  sueldo: number;
  frecuencia: string;
}

export type EmployeeInsert = Omit<Employee, 'id' | 'user_id'>;

export const employeesService = {
  async getEmployees(): Promise<Employee[]> {
    const profile = await getCurrentUserProfile();
    
    // Solo permitimos empleados para cuentas de tipo negocio
    if (profile.use_type !== 'negocio') {
      return [];
    }

    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('user_id', profile.id)
      .order('id', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async createEmployee(employee: EmployeeInsert): Promise<Employee> {
    const profile = await getCurrentUserProfile();
    
    if (profile.use_type !== 'negocio') {
      throw new Error('Solo las cuentas de negocio pueden agregar empleados');
    }

    const sueldo = parseFloat(employee.sueldo as unknown as string);
    if (isNaN(sueldo) || sueldo <= 0) {
      throw new Error('El sueldo debe ser un número válido mayor a cero');
    }

    const { data, error } = await supabase
      .from('employees')
      .insert({
        user_id: profile.id,
        nombre: employee.nombre,
        puesto: employee.puesto,
        sueldo: sueldo,
        frecuencia: employee.frecuencia,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateEmployee(id: number, updates: Partial<EmployeeInsert>): Promise<Employee> {
    const profile = await getCurrentUserProfile();

    if (updates.sueldo !== undefined) {
      const sueldo = parseFloat(updates.sueldo as unknown as string);
      if (isNaN(sueldo) || sueldo <= 0) {
        throw new Error('El sueldo debe ser un número válido mayor a cero');
      }
      updates.sueldo = sueldo;
    }

    const { data, error } = await supabase
      .from('employees')
      .update(updates)
      .eq('id', id)
      .eq('user_id', profile.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteEmployee(id: number): Promise<void> {
    const profile = await getCurrentUserProfile();
    const { error } = await supabase
      .from('employees')
      .delete()
      .eq('id', id)
      .eq('user_id', profile.id);

    if (error) throw error;
  },
};
