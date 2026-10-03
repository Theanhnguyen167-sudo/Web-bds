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
