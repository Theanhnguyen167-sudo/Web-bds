import type { Metadata, Viewport } from 'next';
import { Suspense } from 'react';
import './globals.css';
import { AppProvider } from '@/lib/context/AppContext';
import { ToastContainer } from '@/components/ui/Toast';
import { AdminFloatingSwitch } from '@/components/admin/AdminFloatingSwitch';
import { PwaProvider } from '@/components/pwa/PwaProvider';
import { GlobalScrollRestoration } from '@/components/layout/GlobalScrollRestoration';

export const viewport: Viewport = {
  themeColor: '#ea580c',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export const metadata: Metadata = {
  title: 'HaNoi Realty - Nền tảng BĐS & Tra cứu Quy hoạch Hà Nội',
  description: 'Nền tảng tìm kiếm BĐS thông minh, tra cứu quy hoạch đất Hà Nội 2030-2045 và thẩm định tiềm năng đầu tư AI chuyên sâu.',
  manifest: '/manifest.webmanifest',
  applicationName: 'HaNoi Realty',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'HaNoi Realty',
  },
  formatDetection: {
    telephone: true,
  },
  icons: {
    icon: [
      { url: '/icons/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  keywords: [
    'HaNoi Realty',
    'Bất động sản Hà Nội',
    'Quy hoạch Hà Nội 2030',
    'AI định giá nhà đất',
    'Bản đồ quy hoạch Hà Nội',
    'Mua bán nhà đất Hà Nội'
  ],
  authors: [{ name: 'HaNoi Realty Team' }],
  openGraph: {
    title: 'HaNoi Realty - Nền tảng BĐS & Quy hoạch Hà Nội AI',
    description: 'Tra cứu quy hoạch, định giá AI và tìm kiếm nhà đất chính xác tại Hà Nội.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="HaNoi Realty" />
      </head>
      <body className="font-sans bg-page-bg text-text-primary antialiased selection:bg-accent selection:text-white">
        <AppProvider>
          <PwaProvider>
            <Suspense fallback={null}>
              <GlobalScrollRestoration />
            </Suspense>
            {children}
            <ToastContainer />
            <AdminFloatingSwitch />
          </PwaProvider>
        </AppProvider>
      </body>
    </html>
  );
}
