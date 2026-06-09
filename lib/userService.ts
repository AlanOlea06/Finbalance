import { supabase } from './supabase';

export interface UserProfile {
  id: number;
  nombre: string;
  email: string;
  pais?: string;
  ciudad?: string;
  moneda?: string;
  use_type: 'personal' | 'negocio';
}

export async function getCurrentAuthUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) throw error;
  if (!user) throw new Error('Unauthorized');
  if (!user.email) throw new Error('Authenticated user has no email');

  return user;
}

export async function getCurrentUserProfile(): Promise<UserProfile> {
  const authUser = await getCurrentAuthUser();
  const email = authUser.email;

  const { data, error } = await supabase
    .from('users')
    .select('id, nombre, email, pais, ciudad, moneda, use_type')
    .eq('email', email)
    .single();

  if (error) throw error;
  if (!data) throw new Error('User profile not found');

  return data;
}

export async function updateUserProfile(profileId: number, updates: Partial<Omit<UserProfile, 'id' | 'email'>>): Promise<UserProfile> {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', profileId)
    .select()
    .single();

  if (error) throw error;
  if (!data) throw new Error('Failed to update profile');

  return data;
}
