'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { ListingCard } from '@/components/listing/ListingCard';
import { useApp } from '@/lib/context/AppContext';
import { formatCurrencyVND } from '@/lib/utils';
import {
  Search,
  MapPin,
  Sparkles,
  Layers,
  ShieldCheck,
  Building,
  Home,
  Trees,
  Landmark,
  ArrowRight,
  TrendingUp,
  Award,
  Users,
  Compass,
  CheckCircle2,
  Phone,
  FileCheck,
  ChevronRight
} from 'lucide-react';

const HANOI_DISTRICTS = [
  'Đống Đa',
  'Cầu Giấy',
  'Tây Hồ',
  'Hoàn Kiếm',
  'Nam Từ Liêm',
  'Thanh Xuân',
  'Ba Đình',
  'Long Biên',
  'Hai Bà Trưng',
  'Hà Đông',
];

const PROPERTY_TYPES = [
  { id: 'all', label: 'Tất cả BĐS', icon: Compass },
  { id: 'house', label: 'Nhà phố', icon: Home },
  { id: 'apartment', label: 'Chung cư', icon: Building },
  { id: 'land', label: 'Đất nền', icon: Trees },
  { id: 'villa', label: 'Biệt thự', icon: Landmark },
];

export default function LandingPage() {
  const router = useRouter();
  const { listings } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('Tất cả quận');
  const [selectedType, setSelectedType] = useState('all');

  const featuredListings = listings.filter((l) => l.isFeatured).slice(0, 4);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (selectedDistrict && selectedDistrict !== 'Tất cả quận') params.set('district', selectedDistrict);
    if (selectedType && selectedType !== 'all') params.set('type', selectedType);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-page-bg flex flex-col">
      <Navbar />

      {/* ── 1. HERO SECTION ── */}
      <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden bg-[#0e1726] text-white">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-orange-500/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[300px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Top Pill */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold mb-6"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Nền tảng BĐS & Bản đồ Quy hoạch Số 1 Hà Nội</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight max-w-4xl mx-auto leading-tight"
          >
            Khám phá BĐS Hà Nội <br />
            <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 bg-clip-text text-transparent">
              Tích hợp Quy hoạch 2030 & Định giá AI
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed"
          >
            Tra cứu pháp lý minh bạch, trực quan hoá các tuyến Metro, đường vành đai và xem thẩm định độc lập từ Google Gemini AI trước khi xuống tiền.
          </motion.p>

          {/* Search Box Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 max-w-4xl mx-auto bg-white rounded-2xl p-4 sm:p-5 shadow-2xl text-slate-900 border border-slate-200/80"
          >
            {/* Property Types Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-3 border-b border-gray-100 scrollbar-none">
              {PROPERTY_TYPES.map((type) => {
                const Icon = type.icon;
                const isSelected = selectedType === type.id;
                return (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/30'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{type.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Input & Filters Grid */}
            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              {/* Keyword input */}
              <div className="sm:col-span-6 relative">
                <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Nhập tên đường, khu đô thị, dự án..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:border-orange-500 bg-gray-50/50"
                />
              </div>

              {/* District select */}
              <div className="sm:col-span-4 relative">
                <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-orange-500 pointer-events-none" />
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full pl-10 pr-8 py-3 rounded-xl border border-gray-200 text-xs font-bold focus:outline-none focus:border-orange-500 bg-gray-50/50 appearance-none cursor-pointer"
                >
                  <option value="Tất cả quận">Tất cả quận Hà Nội</option>
                  {HANOI_DISTRICTS.map((d) => (
                    <option key={d} value={d}>
                      Quận {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* Submit Button */}
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-orange-500/30 transition-all flex items-center justify-center gap-1.5"
                >
                  <Search className="h-4 w-4" />
                  <span>Tìm kiếm</span>
                </button>
              </div>
            </form>

            {/* Quick Keyword Suggestions */}
            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2 text-[11px] text-gray-500 overflow-x-auto scrollbar-none">
              <span className="font-semibold text-gray-400 flex-shrink-0">Gợi ý tìm kiếm:</span>
              {['Văn Miếu Đống Đa', 'Hồ Tây view đẹp', 'Biệt thự Starlake', 'Chung cư Vinhomes Smart City', 'Mặt phố Hoàn Kiếm'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    setSearchTerm(tag);
                    router.push(`/search?search=${encodeURIComponent(tag)}`);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-orange-50 hover:text-orange-600 text-gray-600 transition-colors flex-shrink-0"
                >
                  {tag}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Quick Metrics Bar */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { val: '1,200+', lbl: 'Tin BĐS xác minh' },
              { val: '30 Quận/Huyện', lbl: 'Bản đồ quy hoạch 2030' },
              { val: '100% Số hoá', lbl: 'Hạ tầng & Tuyến Metro' },
              { val: '98.5%', lbl: 'Độ chính xác định giá AI' },
            ].map((stat, i) => (
              <div key={i} className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <p className="text-xl sm:text-2xl font-black text-orange-400">{stat.val}</p>
                <p className="text-xs text-slate-400 mt-0.5">{stat.lbl}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 2. FEATURED LISTINGS SECTION ── */}
      <section className="py-16 bg-white">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-orange-500 font-bold text-xs uppercase tracking-wider mb-1">
                <Sparkles className="h-4 w-4" />
                <span>Bất động sản tâm điểm</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-navy tracking-tight">
                Tin đăng nổi bật tại Hà Nội
              </h2>
            </div>

            <Link
              href="/search"
              className="flex items-center gap-1.5 text-xs font-bold text-orange-500 hover:text-orange-600 transition-colors"
            >
              <span>Xem toàn bộ tin đăng ({listings.length})</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredListings.map((item) => (
              <ListingCard key={item.id} listing={item} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. MAP PLANNING & SATELLITE TEASER ── */}
      <section className="py-16 bg-slate-900 text-white relative overflow-hidden">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                <Layers className="h-3.5 w-3.5" />
                <span>Bản đồ Vệ tinh & Phân khu 2030</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-snug">
                Kiểm tra quy hoạch chuẩn xác trước khi mua nhà
              </h2>

              <p className="text-sm text-slate-300 leading-relaxed">
                Tích hợp dữ liệu địa không gian PostGIS, bản đồ vệ tinh độ nét cao và phân khu chức năng (Đất ở đô thị, TMD, Giao thông, Công cộng). Vẽ vùng tìm kiếm tự do (Lasso Search) và đo khoảng cách đến các ga Metro.
              </p>

              <div className="space-y-3 text-xs text-slate-300">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Chế độ xem Hybrid Vệ tinh kết hợp tên đường & địa danh</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Tra cứu bán kính ảnh hưởng từ các dự án Metro & Bệnh viện mới</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Vẽ hình đa giác tự do để lọc BĐS trong khu vực quan tâm</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  href="/planning"
                  className="px-5 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-lg shadow-orange-500/30 transition-all flex items-center gap-2"
                >
                  <Layers className="h-4 w-4" />
                  <span>Khám phá bản đồ quy hoạch</span>
                </Link>
                <Link
                  href="/search"
                  className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/10 transition-all flex items-center gap-2"
                >
                  <Search className="h-4 w-4" />
                  <span>Tìm BĐS trên bản đồ</span>
                </Link>
              </div>
            </div>

            {/* Map Preview Box */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 aspect-[4/3] shadow-2xl flex items-center justify-center">
              <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_20px] opacity-20" />
              <div className="text-center p-6 space-y-3 z-10">
                <div className="w-14 h-14 rounded-2xl bg-orange-500/20 border border-orange-500/40 text-orange-400 flex items-center justify-center mx-auto animate-pulse">
                  <Compass className="h-7 w-7" />
                </div>
                <h3 className="text-base font-bold text-white">Tra cứu Quy hoạch Hà Nội 2030 - 2050</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Dữ liệu phân khu 12 quận nội thành và các huyện ven đô sẵn sàng cho bạn khám phá.
                </p>
                <Link
                  href="/planning"
                  className="inline-block px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors shadow-md"
                >
                  Mở bản đồ toàn màn hình →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. AI VALUATION & PDF REPORT TEASER ── */}
      <section className="py-16 bg-white">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-br from-navy via-slate-900 to-navy text-white p-8 sm:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              <div className="lg:col-span-8 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Trí tuệ nhân tạo Gemini 1.5 Pro</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-snug">
                  Báo cáo Thẩm định BĐS & Xuất file PDF Chuyên Nghiệp
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                  Tổng hợp đa nguồn dữ liệu gồm giá thị trường lân cận, quy hoạch phân khu, hạ tầng kết nối và chấm điểm tiềm năng thanh khoản. Hỗ trợ tải xuống file PDF 4 trang chuẩn pháp lý.
                </p>
                <div className="pt-2 flex flex-wrap gap-3">
                  <Link
                    href="/reports/1"
                    className="px-5 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-lg shadow-orange-500/30 transition-all flex items-center gap-2"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>Xem báo cáo mẫu</span>
                  </Link>
                  <Link
                    href="/pricing"
                    className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/10 transition-all"
                  >
                    Bảng giá gói thành viên
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-4 flex justify-center">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 w-full max-w-sm space-y-3 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <span className="font-bold text-orange-400">Điểm AI Tổng Hợp</span>
                    <span className="text-lg font-black text-white">82 / 100</span>
                  </div>
                  <div className="space-y-1.5 text-slate-300">
                    <div className="flex justify-between"><span>Đất ở đô thị:</span><strong className="text-emerald-400">An toàn 100%</strong></div>
                    <div className="flex justify-between"><span>Ga Metro gần nhất:</span><strong>Ga Cát Linh (800m)</strong></div>
                    <div className="flex justify-between"><span>Thanh khoản dự phóng:</span><strong className="text-orange-400">Rất Cao</strong></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. FOOTER ── */}
      <footer className="bg-navy text-slate-400 text-xs py-12 border-t border-slate-800">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-orange-500 text-white flex items-center justify-center font-black">
                🏠
              </div>
              <span className="text-base font-extrabold text-white">
                HaNoi <span className="text-orange-500">Realty</span>
              </span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Nền tảng công nghệ bất động sản và bản đồ quy hoạch số hoá hàng đầu tại thủ đô Hà Nội.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3">Khám phá</h4>
            <ul className="space-y-2">
              <li><Link href="/search" className="hover:text-white transition-colors">Tìm kiếm BĐS</Link></li>
              <li><Link href="/planning" className="hover:text-white transition-colors">Tra cứu quy hoạch 2030</Link></li>
              <li><Link href="/streets" className="hover:text-white transition-colors">Hạ tầng & Tuyến đường</Link></li>
              <li><Link href="/reports/1" className="hover:text-white transition-colors">Báo cáo thẩm định AI</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3">Dịch vụ & Gói</h4>
            <ul className="space-y-2">
              <li><Link href="/pricing" className="hover:text-white transition-colors">Bảng giá gói đăng tin</Link></li>
              <li><Link href="/listings/create" className="hover:text-white transition-colors">Đăng tin bất động sản</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition-colors">Bảng điều khiển cá nhân</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3">Liên hệ hỗ trợ</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed mb-2">
              Hotline: 0988 123 456 (24/7)<br />
              Email: support@hanoirealty.vn<br />
              Địa chỉ: Quận Đống Đa, Hà Nội
            </p>
          </div>
        </div>

        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <p>© 2026 HaNoi Realty. Toàn bộ bản quyền thuộc về HaNoi Realty.</p>
          <div className="flex gap-4">
            <Link href="/" className="hover:text-white">Điều khoản sử dụng</Link>
            <Link href="/" className="hover:text-white">Chính sách bảo mật</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
