import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from './database.types';

const isPlaceholder = (val?: string) => !val || val.includes('your-project-id') || val.includes('your-');

export const createServerSupabaseClient = () => {
  const cookieStore = cookies();
  const url = isPlaceholder(process.env.NEXT_PUBLIC_SUPABASE_URL)
    ? 'https://xdqfxsszpglbgvpcqfss.supabase.co'
    : process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anonKey = isPlaceholder(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    ? 'sb_publishable_hOfzwTGd3VBWbXF1ur0JLw_9lLyM9ju'
    : (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
       process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
       'sb_publishable_hOfzwTGd3VBWbXF1ur0JLw_9lLyM9ju');

  return createServerClient<Database>(
    url,
    anonKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // The `set` method was called from a Server Component.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            // The `delete` method was called from a Server Component.
          }
        },
      },
    }
  );
};
