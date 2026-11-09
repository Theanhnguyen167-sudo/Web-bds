import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hanoirealty.vn';

  // 1. Danh sách các URL SEO cốt lõi cần đảm bảo Googlebot và các Search Engine crawl và index
  const seoAllowList = [
    '/',
    // Category, Location & Listing Mua bán
    '/mua-ban',
    '/mua-ban/*',
    // Category, Location & Listing Cho thuê
    '/cho-thue',
    '/cho-thue/*',
    // Dự án Bất động sản (Projects)
    '/du-an',
    '/du-an/*',
    // Trung tâm khu vực & Tuyến phố (Locations & Streets)
    '/khu-vuc',
    '/khu-vuc/*',
    '/streets',
    '/streets/*',
    // Tin tức & Cẩm nang thị trường (News)
    '/news',
    '/news/*',
    // Bản đồ quy hoạch & Dữ liệu quy hoạch (Planning & Land Use)
    '/planning',
    '/planning/*',
    // Báo cáo thị trường & Phân tích hạ tầng (Market Reports)
    '/reports',
    '/reports/*',
    // Legacy URLs để crawler tiếp nhận Redirect 308 sang Canonical SEO URLs
    '/listings',
    '/listings/*',
    // Trang tĩnh thông tin doanh nghiệp
    '/about',
    '/pricing',
  ];

  // 2. Danh sách các URL private, trang nội bộ và bẫy lọc tham số (Faceted Filter Query Traps)
  const seoDisallowList = [
    // Trang quản trị & User Dashboard
    '/admin',
    '/admin/*',
    '/dashboard',
    '/dashboard/*',
    '/post-property',
    '/post-property/*',
    // API & Auth Endpoints
    '/api/*',
    '/auth/*',
    '/(auth)/*',
    // Cổng thanh toán nhạy cảm
    '/payment/*',
    '/payment/checkout',
    '/payment/processing',
    '/payment/momo/*',
    '/payment/vnpay/*',
    // Trang tìm kiếm nội bộ (Google Search Central khuyến nghị không crawl/index internal search)
    '/search',
    '/search/*',
    // Spider Trap Prevention (Bảo toàn Crawl Budget): Chặn các tham số query lọc sâu không có giá trị SEO
    '/*?*minPrice=*',
    '/*?*maxPrice=*',
    '/*?*minArea=*',
    '/*?*maxArea=*',
    '/*?*beds=*',
    '/*?*baths=*',
    '/*?*direction=*',
    '/*?*ward=*',
    '/*?*street=*',
    '/*?*sort=*',
    '/*?*view=*',
    '/*?*filter=*',
    '/*?*q=*',
  ];

  return {
    rules: [
      {
        userAgent: '*',
        allow: seoAllowList,
        disallow: seoDisallowList,
      },
      {
        userAgent: 'Googlebot',
        allow: seoAllowList,
        disallow: seoDisallowList,
      },
      {
        userAgent: 'Googlebot-Image',
        allow: [
          '/images/*',
          '/geojson/*',
          '/leaflet/*',
          '/uploads/*',
          '/*.png',
          '/*.jpg',
          '/*.jpeg',
          '/*.webp',
          '/*.svg',
        ],
        disallow: ['/admin/*', '/dashboard/*', '/api/*'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}

