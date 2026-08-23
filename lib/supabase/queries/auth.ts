import { createClient } from '@/lib/supabase/client';

export async function signUpWithEmail(email: string, password: string, fullName: string) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } }
  });

  if (data.user) {
    await supabase.from('users').insert({
      id: data.user.id,
      email,
      full_name: fullName,
      role: 'user'
    });
  }

  return { data, error };
}

export async function signInWithEmail(email: string, password: string) {
  const supabase = createClient();
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signInWithGoogle() {
  const supabase = createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  return supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${siteUrl}/auth/callback` }
  });
}

export async function signOut() {
  const supabase = createClient();
  return supabase.auth.signOut();
}
