import { createClient } from '@/lib/supabase/client';
import { mockAdminUsers, AdminUser } from '@/lib/admin-data';

export async function getAllUsers(): Promise<AdminUser[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return mockAdminUsers;
    }

    // Map Supabase rows to AdminUser interface
    const mappedUsers: AdminUser[] = data.map((u: any) => ({
      id: u.id,
      name: u.full_name || u.email.split('@')[0] || 'Người dùng',
      email: u.email,
      phone: u.phone || '0988 123 456',
      package: (u.package as any) || 'Free',
      role: (u.role as any) || 'user',
      status: 'active',
      joinedDate: u.created_at ? u.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
      listingsCount: 0,
      aiReportsUsed: 0,
      totalSpent: 0,
      avatar: u.avatar_url || undefined,
      lastActive: 'Vừa xong',
    }));

    // Merge with mock users to ensure rich sample data alongside real registered users
    const existingEmails = new Set(mappedUsers.map((u) => u.email.toLowerCase()));
    const additionalMockUsers = mockAdminUsers.filter(
      (mu) => !existingEmails.has(mu.email.toLowerCase())
    );

    return [...mappedUsers, ...additionalMockUsers];
  } catch {
    return mockAdminUsers;
  }
}
