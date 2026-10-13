import { createBrowserClient } from '@supabase/ssr';
import { Database } from './database.types';

const isPlaceholder = (val?: string) => !val || val.includes('your-project-id') || val.includes('your-');

export const createClient = () => {
  const url = isPlaceholder(process.env.NEXT_PUBLIC_SUPABASE_URL)
    ? 'https://xdqfxsszpglbgvpcqfss.supabase.co'
    : process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anonKey = isPlaceholder(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    ? 'sb_publishable_hOfzwTGd3VBWbXF1ur0JLw_9lLyM9ju'
    : (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
       process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
       'sb_publishable_hOfzwTGd3VBWbXF1ur0JLw_9lLyM9ju');

  return createBrowserClient<Database>(url, anonKey);
};
