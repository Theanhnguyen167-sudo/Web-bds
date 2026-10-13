import { createClient } from '@/lib/supabase/client';

export async function signUpWithEmail(email: string, password: string, fullName: string) {
  try {
    const supabase = createClient();
    const timeoutPromise = new Promise<{ data: any; error: any }>((_, reject) =>
      setTimeout(() => reject(new Error('Supabase Auth timeout')), 2000)
    );
    const authPromise = supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } }
    });

    const { data, error } = (await Promise.race([authPromise, timeoutPromise])) as any;

    if (data?.user) {
      await (supabase.from('users') as any).insert({
        id: data.user.id,
        email,
        full_name: fullName,
        role: 'user'
      }).catch(() => {});
    }

    return { data, error };
  } catch (err: any) {
    return { data: null, error: err };
  }
}

export async function signInWithEmail(email: string, password: string) {
  try {
    const supabase = createClient();
    const timeoutPromise = new Promise<{ data: any; error: any }>((_, reject) =>
      setTimeout(() => reject(new Error('Supabase Auth timeout')), 2000)
    );
    const authPromise = supabase.auth.signInWithPassword({ email, password });
    return (await Promise.race([authPromise, timeoutPromise])) as any;
  } catch (err: any) {
    return { data: null, error: err };
  }
}

export async function signInWithGoogle() {
  const supabase = createClient();
  const origin = typeof window !== 'undefined' ? window.location.origin : (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000');
  const res = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/auth/callback`,
    }
  });

  if (res.data?.url && typeof window !== 'undefined') {
    window.location.href = res.data.url;
  }

  return res;
}

export async function signInWithFacebook() {
  const supabase = createClient();
  const origin = typeof window !== 'undefined' ? window.location.origin : (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000');
  return supabase.auth.signInWithOAuth({
    provider: 'facebook',
    options: { redirectTo: `${origin}/auth/callback` }
  });
}

export async function signInWithApple() {
  const supabase = createClient();
  const origin = typeof window !== 'undefined' ? window.location.origin : (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000');
  return supabase.auth.signInWithOAuth({
    provider: 'apple',
    options: { redirectTo: `${origin}/auth/callback` }
  });
}

export async function signOut() {
  const supabase = createClient();
  return supabase.auth.signOut();
}
