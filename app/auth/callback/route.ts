import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') || '/';

  if (code) {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data?.user) {
      const user = data.user;
      const fullName =
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        user.email?.split('@')[0] ||
        'Người dùng';
      const avatarUrl =
        user.user_metadata?.avatar_url ||
        user.user_metadata?.picture ||
        null;

      // Upsert user into public.users table so they appear in Admin Users List
      try {
        await (supabase.from('users') as any).upsert({
          id: user.id,
          email: user.email!,
          full_name: fullName,
          avatar_url: avatarUrl,
          role: 'user',
        });
      } catch (e) {
        console.error('Failed to sync OAuth user to public.users table:', e);
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return the user to login page on error
  return NextResponse.redirect(`${origin}/login?error=oauth_callback_failed`);
}
