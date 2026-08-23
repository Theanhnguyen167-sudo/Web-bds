import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/lib/context/AppContext';
import { ToastContainer } from '@/components/ui/Toast';
import { AdminFloatingSwitch } from '@/components/admin/AdminFloatingSwitch';

export const metadata: Metadata = {
  title: 'HaNoi Realty - Nền tảng BĐS & Tra cứu Quy hoạch Hà Nội',
  description: 'Nền tảng tìm kiếm BĐS thông minh, tra cứu quy hoạch đất Hà Nội 2030-2045 và thẩm định tiềm năng đầu tư AI chuyên sâu.',
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
      </head>
      <body className="font-sans bg-page-bg text-text-primary antialiased selection:bg-accent selection:text-white">
        <AppProvider>
          {children}
          <ToastContainer />
          <AdminFloatingSwitch />
        </AppProvider>
      </body>
    </html>
  );
}
