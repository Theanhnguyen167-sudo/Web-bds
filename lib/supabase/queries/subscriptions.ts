import { createClient } from '@/lib/supabase/client';

export async function getUserSubscription(userId: string) {
  const supabase = createClient();
  return supabase
    .from('subscriptions')
    .select('*, packages(*)')
    .eq('user_id', userId)
    .eq('status', 'active')
    .gt('end_date', new Date().toISOString())
    .single();
}

export async function checkAIReportQuota(userId: string): Promise<{
  allowed: boolean;
  used: number;
  limit: number;
}> {
  const supabase = createClient();
  const { data: sub } = await getUserSubscription(userId);
  if (!sub || !(sub as any).packages) return { allowed: false, used: 0, limit: 0 };

  const pkg = (sub as any).packages;
  const { count } = await supabase
    .from('ai_reports')
    .select('id', { count: 'exact' })
    .eq('user_id', userId)
    .gte('generated_at', new Date(sub.start_date).toISOString());

  const features = typeof pkg.features === 'object' && pkg.features !== null ? (pkg.features as any) : {};
  const limit = pkg.has_ai_report ? (features.ai_reports_limit ?? 30) : 0;
  const used = count ?? 0;

  return { allowed: used < limit || limit === -1, used, limit };
}
