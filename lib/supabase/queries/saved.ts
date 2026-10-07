import { createClient } from '@/lib/supabase/client';

export async function toggleSavedListing(userId: string, listingId: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  
  const authUserId = user.id;

  const { data: existing } = await supabase
    .from('saved_listings')
    .select()
    .eq('user_id', authUserId)
    .eq('listing_id', listingId)
    .single();

  if (existing) {
    return supabase
      .from('saved_listings')
      .delete()
      .eq('user_id', authUserId)
      .eq('listing_id', listingId);
  } else {
    return (supabase
      .from('saved_listings') as any)
      .insert({ user_id: authUserId, listing_id: listingId });
  }
}

export async function getSavedListings(userId: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  
  return supabase
    .from('saved_listings')
    .select('*, listings(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });
}
