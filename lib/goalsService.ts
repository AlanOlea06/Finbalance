import { supabase } from './supabase';
import { getCurrentUserProfile } from './userService';

export interface Goal {
  id: number;
  user_id: number;
  name: string;
  type: string;
  total_amount: number;
  current_amount: number;
  target_date: string;
}

export const goalsService = {
  async getGoals(): Promise<Goal[]> {
    const profile = await getCurrentUserProfile();

    const { data, error } = await supabase
      .from<Goal>('user_goals')
      .select('*')
      .eq('user_id', profile.id)
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async updateGoalProgress(goalId: string, newAmount: number): Promise<void> {
    const profile = await getCurrentUserProfile();

    const { error } = await supabase
      .from('user_goals')
      .update({ current_amount: newAmount })
      .eq('id', goalId)
      .eq('user_id', profile.id);

    if (error) throw error;
  },
};
