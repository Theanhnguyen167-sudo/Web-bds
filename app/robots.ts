import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hanoirealty.vn';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/*',
          '/api/*',
          '/auth/*',
          '/dashboard',
          '/dashboard/*',
          '/payment/checkout',
          '/payment/processing',
          '/payment/momo/*',
          '/payment/vnpay/*',
          // Patent 90: Spider Trap Prevention - Chặn bẫy crawl vô tận với các tham số lọc sâu kết hợp
          '/search?*minPrice=*',
          '/search?*maxPrice=*',
          '/search?*minArea=*',
          '/search?*maxArea=*',
          '/search?*beds=*',
          '/search?*direction=*',
          '/search?*ward=*',
          '/search?*street=*',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin/*', '/api/*', '/dashboard/*', '/payment/*'],
      },
      {
        userAgent: 'Googlebot-Image',
        allow: ['/images/*', '/geojson/*', '/leaflet/*'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
