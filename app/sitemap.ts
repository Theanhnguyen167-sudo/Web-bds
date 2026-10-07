import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';
import { mockListings } from '@/lib/mock-data';
import { HANOI_DISTRICTS_HUB_DATA } from '@/lib/data/hanoi-districts-hub';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hanoirealty.vn';
  const currentDate = new Date().toISOString();

  // 1. Các trang tĩnh cố định (Core Static Pages)
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: currentDate,
      changeFrequency: 'hourly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/planning`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/news`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/reports`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/streets`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    // Topic Hubs theo Quận/Huyện Hà Nội (Patent 46, 54)
    ...Object.keys(HANOI_DISTRICTS_HUB_DATA).map((slug) => ({
      url: `${baseUrl}/khu-vuc/${slug}`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    })),
  ];

  // 2. Thu thập danh sách tin đăng động từ Supabase + Mock fallback
  let dynamicListingRoutes: MetadataRoute.Sitemap = [];

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xdqfxsszpglbgvpcqfss.supabase.co';
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.SUPABASE_SERVICE_ROLE_KEY !== 'your-supabase-service-role-key'
        ? process.env.SUPABASE_SERVICE_ROLE_KEY
        : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_hOfzwTGd3VBWbXF1ur0JLw_9lLyM9ju';

    const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });

    const { data: listings } = await supabase
      .from('listings')
      .select('id, updated_at, created_at, status')
      .eq('status', 'active')
      .limit(1000);

    if (listings && listings.length > 0) {
      dynamicListingRoutes = listings.map((item) => ({
        url: `${baseUrl}/listings/${item.id}`,
        lastModified: item.updated_at || item.created_at || currentDate,
        changeFrequency: 'daily',
        priority: 0.85,
      }));
    }
  } catch (error) {
    console.warn('Lỗi khi fetch dynamic listings cho sitemap:', error);
  }

  // 3. Bổ sung các mock listings nếu chưa có trong DB để đảm bảo bot luôn có link crawl
  const existingIds = new Set(dynamicListingRoutes.map((r) => r.url.split('/').pop()));
  for (const mock of mockListings) {
    if (!existingIds.has(mock.id)) {
      dynamicListingRoutes.push({
        url: `${baseUrl}/listings/${mock.id}`,
        lastModified: mock.createdAt || currentDate,
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    }
  }

  return [...staticRoutes, ...dynamicListingRoutes];
}
