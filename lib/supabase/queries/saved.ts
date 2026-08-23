import { createClient } from '@/lib/supabase/client';

export async function toggleSavedListing(userId: string, listingId: string) {
  const supabase = createClient();
  const { data: existing } = await supabase
    .from('saved_listings')
    .select()
    .eq('user_id', userId)
    .eq('listing_id', listingId)
    .single();

  if (existing) {
    return supabase
      .from('saved_listings')
      .delete()
      .eq('user_id', userId)
      .eq('listing_id', listingId);
  } else {
    return supabase
      .from('saved_listings')
      .insert({ user_id: userId, listing_id: listingId });
  }
}

export async function getSavedListings(userId: string) {
  const supabase = createClient();
  return supabase
    .from('saved_listings')
    .select('*, listings(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
}
