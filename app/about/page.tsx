'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, useInView } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import {
  sectionVariants,
  staggerContainer,
  cardVariant,
  useCountUp
} from '@/lib/hooks/useScrollAnimation';
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
  FileCheck,
  ChevronDown,
  ChevronRight,
  Play,
  FileText,
  CreditCard,
  Target,
  Rocket,
  Lock,
  Globe,
  Star,
  Check,
  BarChart3,
  Calendar,
  Building2,
  Cpu,
  Zap,
  PhoneCall,
  Mail,
  Map
} from 'lucide-react';

/* ── STATS SECTION COMPONENT WITH COUNT UP ── */
function StatsCounterItem({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const { count, ref } = useCountUp(value, 1600);
  return (
    <div ref={ref} className="flex flex-col items-center text-center p-4">
      <span className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
        {count.toLocaleString()}{suffix}
      </span>
      <span className="text-white/85 text-xs sm:text-sm font-medium mt-1">
        {label}
      </span>
    </div>
  );
}

export default function AboutPage() {
  const router = useRouter();

  // Search preview states
  const [quickType, setQuickType] = useState('all');
  const [quickDistrict, setQuickDistrict] = useState('Đống Đa');
  const [priceMin, setPriceMin] = useState('3');
  const [priceMax, setPriceMax] = useState('12');

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (quickType !== 'all') params.set('type', quickType);
    if (quickDistrict && quickDistrict !== 'Tất cả quận') params.set('district', quickDistrict);
    if (priceMin) params.set('minPrice', (Number(priceMin) * 1e9).toString());
    if (priceMax) params.set('maxPrice', (Number(priceMax) * 1e9).toString());
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-page-bg text-text-primary overflow-x-hidden font-sans">
      <Navbar />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          📌 SECTION 1 — HERO (Full viewport height)
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden bg-gradient-to-b from-[#0a0f1e] via-[#0e1726] to-[#1a2744] text-white pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        {/* Subtle dot grid pattern */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:28px_28px] pointer-events-none" />

        {/* 6 Floating blurred orange circles */}
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 left-10 w-72 h-72 rounded-full bg-orange-500/10 blur-[100px] pointer-events-none"
        />
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-1/4 right-10 w-96 h-96 rounded-full bg-orange-500/15 blur-[120px] pointer-events-none"
        />
        <motion.div
          animate={{ x: [0, 20, 0], y: [0, 30, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/3 right-1/4 w-60 h-60 rounded-full bg-blue-500/10 blur-[90px] pointer-events-none"
        />
        <motion.div
          animate={{ x: [0, -20, 0], y: [0, -20, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-10 left-1/3 w-80 h-80 rounded-full bg-orange-400/10 blur-[110px] pointer-events-none"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-20 right-1/3 w-40 h-40 rounded-full bg-amber-500/05 blur-[80px] pointer-events-none"
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-orange-500/10 blur-[140px] pointer-events-none"
        />

        {/* Center Content Container */}
        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6 sm:space-y-8">
          
          {/* 1. Announcement Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 border border-orange-500/30 bg-orange-500/10 text-orange-400 rounded-full px-4 py-1.5 text-xs sm:text-sm font-semibold shadow-inner"
          >
            <span>🏆</span>
            <span>Nền tảng PropTech #1 Hà Nội 2025</span>
          </motion.div>

          {/* 2. Main Headline */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="space-y-1"
          >
            <motion.h1
              variants={cardVariant}
              className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-[1.15]"
            >
              Khám phá Bất động sản
            </motion.h1>
            <motion.h1
              variants={cardVariant}
              className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 bg-clip-text text-transparent leading-[1.15]"
            >
              Hà Nội Thông Minh Hơn
            </motion.h1>
          </motion.div>

          {/* 3. Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-base sm:text-xl text-white/70 max-w-2xl mx-auto text-center font-normal leading-relaxed"
          >
            Kết hợp dữ liệu quy hoạch thực tế, phân tích AI và bản đồ tương tác — để mọi quyết định BĐS của bạn đều được hỗ trợ bởi thông tin chính xác nhất.
          </motion.p>

          {/* 4. CTA Button Row */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/search"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-2xl text-base sm:text-lg font-bold shadow-2xl shadow-orange-500/40 transition-colors"
              >
                <Search className="h-5 w-5" />
                <span>Tìm kiếm BĐS ngay</span>
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/reports"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border-2 border-white/20 hover:border-white/40 text-white/80 hover:text-white px-8 py-4 rounded-2xl text-base sm:text-lg font-medium backdrop-blur-sm transition-all"
              >
                <Sparkles className="h-5 w-5 text-orange-400" />
                <span>Xem báo cáo AI mẫu</span>
              </Link>
            </motion.div>
          </motion.div>

          {/* 5. Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="pt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-white/50 text-xs sm:text-sm font-medium"
          >
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              10,000+ tin đăng
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              500+ báo cáo AI/tháng
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              Dữ liệu 29 quận/huyện
            </span>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-6 flex flex-col items-center gap-1 text-white/40 text-xs pointer-events-none"
        >
          <span>Khám phá thêm</span>
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          📌 SECTION 2 — STATS BAR (số liệu nổi bật)
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="bg-orange-500 py-10 shadow-lg relative z-20">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/20">
            <StatsCounterItem value={10000} suffix="+" label="Tin đăng BĐS" />
            <StatsCounterItem value={500} suffix="+" label="Báo cáo AI mỗi tháng" />
            <StatsCounterItem value={29} suffix="" label="Quận/huyện có dữ liệu" />
            <StatsCounterItem value={98} suffix="%" label="Khách hàng hài lòng" />
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          📌 SECTION 3 — GIỚI THIỆU DOANH NGHIỆP (About)
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section id="about" className="py-24 bg-white">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Left Column (Text) */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <span className="text-orange-500 font-extrabold text-xs tracking-widest uppercase">
                VỀ CHÚNG TÔI
              </span>
              
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-navy leading-tight">
                Tiên phong trong PropTech Hà Nội
              </h2>

              <div className="space-y-4 text-gray-600 leading-relaxed text-base sm:text-lg">
                <p>
                  HaNoi Realty được thành lập năm 2024 với sứ mệnh số hóa và minh bạch hóa thị trường bất động sản Hà Nội. Chúng tôi kết hợp công nghệ AI tiên tiến với dữ liệu quy hoạch chính thức từ Sở Quy hoạch Kiến trúc Hà Nội để tạo ra nền tảng thông tin BĐS toàn diện nhất thị trường.
                </p>
                <p>
                  Với đội ngũ hơn 20 kỹ sư công nghệ và chuyên gia BĐS dày dạn kinh nghiệm, chúng tôi cam kết mang đến dữ liệu chính xác, phân tích sâu sắc và trải nghiệm người dùng tốt nhất.
                </p>
              </div>

              {/* Achievement Pills */}
              <div className="flex flex-wrap gap-2.5 pt-2">
                <span className="bg-navy/5 text-navy text-xs sm:text-sm font-bold px-4 py-2 rounded-full border border-navy/10">
                  🏆 Top 10 Startup Việt Nam 2024
                </span>
                <span className="bg-navy/5 text-navy text-xs sm:text-sm font-bold px-4 py-2 rounded-full border border-navy/10">
                  🤖 AI Innovation Award 2025
                </span>
                <span className="bg-navy/5 text-navy text-xs sm:text-sm font-bold px-4 py-2 rounded-full border border-navy/10">
                  📊 500K+ người dùng
                </span>
              </div>

              <div>
                <Link
                  href="/planning"
                  className="text-orange-500 font-semibold hover:text-orange-600 underline-offset-4 hover:underline inline-flex items-center gap-1.5 mt-4 text-base"
                >
                  <span>Tìm hiểu thêm về chúng tôi</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>

            {/* Right Column (Glassmorphism Visual Card) */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              {/* Main Card */}
              <div className="bg-navy rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-slate-700/50 space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="h-10 w-10 rounded-xl bg-orange-500 flex items-center justify-center font-black text-lg">
                      🏠
                    </div>
                    <div>
                      <h3 className="font-extrabold text-lg text-white">HaNoi Realty</h3>
                      <p className="text-xs text-orange-400 font-semibold">PropTech Ecosystem</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-500/20 text-emerald-400 text-xs px-3 py-1 font-bold border border-emerald-500/30">
                    Live Hệ thống
                  </span>
                </div>

                {/* 3 Mini Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-orange-500/20 border border-orange-500/30 rounded-2xl p-4 space-y-1">
                    <span className="text-2xl">🗺️</span>
                    <p className="font-bold text-xs text-white">Dữ liệu quy hoạch</p>
                    <p className="text-[11px] text-white/60">Cập nhật liên tục</p>
                  </div>

                  <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-2xl p-4 space-y-1">
                    <span className="text-2xl">🤖</span>
                    <p className="font-bold text-xs text-white">AI Gemini 1.5 Pro</p>
                    <p className="text-[11px] text-white/60">Phân tích chuyên sâu</p>
                  </div>

                  <div className="bg-blue-500/20 border border-blue-500/30 rounded-2xl p-4 space-y-1">
                    <span className="text-2xl">💳</span>
                    <p className="font-bold text-xs text-white">Thanh toán an toàn</p>
                    <p className="text-[11px] text-white/60">MoMo · VNPay · Visa</p>
                  </div>
                </div>

                <div className="pt-2 text-xs text-slate-300 flex items-center justify-between">
                  <span>Toạ độ WGS84 Hà Nội</span>
                  <span className="font-mono text-orange-400 font-bold">105.8342° E, 21.0278° N</span>
                </div>
              </div>

              {/* Floating Mini Growth Card */}
              <div className="absolute -bottom-6 -right-2 sm:-right-6 bg-white shadow-2xl rounded-2xl p-4 border border-gray-100 z-10">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                  <span className="text-xs font-bold text-emerald-600">Giá tăng 8% Q3/2025</span>
                </div>
                {/* CSS Bar chart visualization */}
                <div className="flex items-end gap-1.5 h-10 w-36 pt-1">
                  <div className="flex-1 bg-gray-200 rounded-t h-4" />
                  <div className="flex-1 bg-gray-200 rounded-t h-6" />
                  <div className="flex-1 bg-gray-300 rounded-t h-5" />
                  <div className="flex-1 bg-orange-400 rounded-t h-8" />
                  <div className="flex-1 bg-orange-500 rounded-t h-10" />
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          📌 SECTION 4 — TẦM NHÌN, SỨ MỆNH, GIÁ TRỊ CỐT LÕI
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-24 bg-slate-50">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-orange-500 font-extrabold text-xs tracking-widest uppercase">
              KIM CHỈ NAM PHÁT TRIỂN
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-navy">
              Tầm nhìn · Sứ mệnh · Giá trị
            </h2>
            <p className="text-sm text-gray-500">
              Những nguyên tắc định hướng mọi hoạt động của HaNoi Realty
            </p>
          </div>

          {/* 3 Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-14">
            
            {/* Card 1: Vision */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center text-2xl">
                  🔭
                </div>
                <span className="text-xs font-bold text-orange-500 uppercase tracking-wide block">
                  Tầm nhìn 2030
                </span>
                <h3 className="text-xl font-bold text-navy">
                  Nền tảng PropTech #1 Đông Nam Á
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Trở thành hệ sinh thái bất động sản toàn diện nhất khu vực, kết nối hàng triệu giao dịch BĐS được hỗ trợ bởi dữ liệu và AI mỗi năm.
                </p>
              </div>
              <div className="mt-6 bg-orange-50 border-l-4 border-orange-500 p-3 rounded-r-xl">
                <p className="text-xs font-bold text-orange-700">
                  🎯 Mục tiêu: 1 triệu người dùng vào 2027
                </p>
              </div>
            </motion.div>

            {/* Card 2: Mission */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-2xl">
                  🎯
                </div>
                <span className="text-xs font-bold text-blue-500 uppercase tracking-wide block">
                  Sứ mệnh
                </span>
                <h3 className="text-xl font-bold text-navy">
                  Minh bạch hóa thị trường BĐS Hà Nội
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Cung cấp thông tin quy hoạch chính xác, phân tích AI khách quan và dữ liệu thị trường minh bạch — giúp mọi người Hà Nội đưa ra quyết định BĐS thông minh và an toàn hơn.
                </p>
              </div>
              <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-3 rounded-r-xl">
                <p className="text-xs font-bold text-blue-700">
                  ⚡ Mỗi ngày 500+ người nhận báo cáo AI
                </p>
              </div>
            </motion.div>

            {/* Card 3: Core Values */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center text-2xl">
                  💎
                </div>
                <span className="text-xs font-bold text-emerald-500 uppercase tracking-wide block">
                  Giá trị cốt lõi
                </span>
                <h3 className="text-xl font-bold text-navy">
                  4 nguyên tắc bất biến
                </h3>
                <div className="space-y-2 pt-1 text-sm text-gray-700">
                  <div className="flex items-start gap-2.5 py-1.5 border-b border-gray-100">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span><strong>Minh bạch:</strong> Dữ liệu luôn chính xác, cập nhật</span>
                  </div>
                  <div className="flex items-start gap-2.5 py-1.5 border-b border-gray-100">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span><strong>Đổi mới:</strong> Ứng dụng công nghệ tiên tiến nhất</span>
                  </div>
                  <div className="flex items-start gap-2.5 py-1.5 border-b border-gray-100">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span><strong>Tin cậy:</strong> Bảo mật thông tin tuyệt đối</span>
                  </div>
                  <div className="flex items-start gap-2.5 py-1.5">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span><strong>Tận tâm:</strong> Hỗ trợ 24/7, phản hồi trong 2 giờ</span>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          📌 SECTION 5 — TÍNH NĂNG NỔI BẬT
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-24 bg-white">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-orange-500 font-extrabold text-xs tracking-widest uppercase">
              TÍNH NĂNG
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-navy">
              Tại sao chọn HaNoi Realty?
            </h2>
            <p className="text-sm text-gray-500">
              Công nghệ hiện đại kết hợp dữ liệu thực tế
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-14">
            
            {/* Feature 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-white border border-gray-100 rounded-2xl p-6 hover:border-orange-200 hover:shadow-lg transition-all space-y-3"
            >
              <div className="w-11 h-11 rounded-xl bg-orange-100 text-orange-500 flex items-center justify-center text-xl">
                🗺️
              </div>
              <h3 className="font-bold text-base text-navy">Bản đồ Quy hoạch Thực tế</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Xem layer quy hoạch Hà Nội 2030 trực tiếp trên bản đồ. Toggle ON/OFF các phân khu màu sắc chuẩn Sở QHKT.
              </p>
              <Link href="/planning" className="text-xs font-bold text-orange-500 hover:underline inline-flex items-center gap-1 pt-1">
                <span>Xem bản đồ</span> <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-white border border-gray-100 rounded-2xl p-6 hover:border-purple-200 hover:shadow-lg transition-all space-y-3"
            >
              <div className="w-11 h-11 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center text-xl">
                🤖
              </div>
              <h3 className="font-bold text-base text-navy">Báo cáo AI Chuyên sâu</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Gemini 1.5 Pro phân tích toàn diện: quy hoạch, tiềm năng tăng giá, rủi ro pháp lý, tiện ích xung quanh trong 2 phút.
              </p>
              <Link href="/reports" className="text-xs font-bold text-purple-600 hover:underline inline-flex items-center gap-1 pt-1">
                <span>Thử miễn phí</span> <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="bg-white border border-gray-100 rounded-2xl p-6 hover:border-blue-200 hover:shadow-lg transition-all space-y-3"
            >
              <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-xl">
                📊
              </div>
              <h3 className="font-bold text-base text-navy">Dữ liệu Thị trường Live</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Chỉ số giá BĐS theo từng phường, quận được cập nhật hàng tuần từ 10,000+ giao dịch thực tế.
              </p>
              <Link href="/streets" className="text-xs font-bold text-blue-600 hover:underline inline-flex items-center gap-1 pt-1">
                <span>Khám phá dữ liệu</span> <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </motion.div>

            {/* Feature 4 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="bg-white border border-gray-100 rounded-2xl p-6 hover:border-emerald-200 hover:shadow-lg transition-all space-y-3"
            >
              <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-xl">
                🔍
              </div>
              <h3 className="font-bold text-base text-navy">Tìm kiếm Thông minh</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Vẽ vùng tìm kiếm tự do trên bản đồ (Lasso Search), lọc theo quy hoạch, bán kính tiện ích, tiềm năng AI.
              </p>
              <Link href="/search" className="text-xs font-bold text-emerald-600 hover:underline inline-flex items-center gap-1 pt-1">
                <span>Vẽ vùng tìm kiếm</span> <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </motion.div>

            {/* Feature 5 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="bg-white border border-gray-100 rounded-2xl p-6 hover:border-red-200 hover:shadow-lg transition-all space-y-3"
            >
              <div className="w-11 h-11 rounded-xl bg-red-100 text-red-600 flex items-center justify-center text-xl">
                📄
              </div>
              <h3 className="font-bold text-base text-navy">Xuất PDF Chuyên nghiệp</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Báo cáo 4 trang A4 đẹp chuẩn nghiệp vụ môi giới — gửi ngay cho khách qua Zalo/Email.
              </p>
              <Link href="/reports" className="text-xs font-bold text-red-600 hover:underline inline-flex items-center gap-1 pt-1">
                <span>Xem mẫu PDF</span> <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </motion.div>

            {/* Feature 6 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.6 }}
              className="bg-white border border-gray-100 rounded-2xl p-6 hover:border-teal-200 hover:shadow-lg transition-all space-y-3"
            >
              <div className="w-11 h-11 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center text-xl">
                💳
              </div>
              <h3 className="font-bold text-base text-navy">Thanh toán Linh hoạt</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Hỗ trợ MoMo, VNPay, chuyển khoản ngân hàng. Hủy bất kỳ lúc nào, hoàn tiền trong 7 ngày.
              </p>
              <Link href="/pricing" className="text-xs font-bold text-teal-600 hover:underline inline-flex items-center gap-1 pt-1">
                <span>Bảng giá dịch vụ</span> <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          📌 SECTION 6 — MỤC TIÊU PHÁT TRIỂN (Timeline)
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section id="careers" className="py-24 bg-navy text-white relative overflow-hidden">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-16">
            <span className="text-orange-400 font-extrabold text-xs tracking-widest uppercase">
              LỘ TRÌNH
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Mục tiêu Phát triển
            </h2>
            <p className="text-sm text-slate-400">
              Hành trình xây dựng nền tảng PropTech hàng đầu
            </p>
          </div>

          {/* Timeline list */}
          <div className="relative border-l-2 border-slate-700 ml-4 sm:ml-32 space-y-10">
            
            {/* 2024 */}
            <div className="relative pl-6 sm:pl-8">
              <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-navy" />
              <div className="sm:absolute sm:-left-32 sm:top-1 text-xs font-bold text-emerald-400 uppercase">
                2024 · COMPLETED
              </div>
              <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700 space-y-1.5">
                <h3 className="text-base font-bold text-white">Thành lập & Ra mắt MVP</h3>
                <p className="text-xs sm:text-sm text-slate-300">
                  Khởi chạy nền tảng với bản đồ quy hoạch, hệ thống đăng tin BĐS, tích hợp AI Gemini.
                </p>
                <p className="text-xs font-semibold text-orange-400 pt-1">📈 1,000 tin đăng đầu tiên</p>
              </div>
            </div>

            {/* 2025 Q1 */}
            <div className="relative pl-6 sm:pl-8">
              <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-navy" />
              <div className="sm:absolute sm:-left-32 sm:top-1 text-xs font-bold text-emerald-400 uppercase">
                2025 Q1 · COMPLETED
              </div>
              <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700 space-y-1.5">
                <h3 className="text-base font-bold text-white">Mở rộng dữ liệu 29 quận/huyện</h3>
                <p className="text-xs sm:text-sm text-slate-300">
                  Hoàn thiện dữ liệu quy hoạch toàn bộ Hà Nội, ra mắt báo cáo AI PDF chuyên nghiệp.
                </p>
                <p className="text-xs font-semibold text-orange-400 pt-1">📈 10,000 người dùng</p>
              </div>
            </div>

            {/* 2025 Q4 */}
            <div className="relative pl-6 sm:pl-8">
              <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-orange-500 ring-4 ring-navy animate-pulse" />
              <div className="sm:absolute sm:-left-32 sm:top-1 text-xs font-bold text-orange-400 uppercase">
                2025 Q4 · IN PROGRESS
              </div>
              <div className="bg-slate-800/80 rounded-2xl p-5 border border-orange-500/40 space-y-1.5 shadow-lg shadow-orange-500/10">
                <h3 className="text-base font-bold text-white">Tích hợp thanh toán & Gói thành viên</h3>
                <p className="text-xs sm:text-sm text-slate-300">
                  Ra mắt MoMo, VNPay, hệ thống subscription, admin portal đầy đủ.
                </p>
                <p className="text-xs font-semibold text-orange-400 pt-1">🎯 Mục tiêu: 50,000 người dùng</p>
              </div>
            </div>

            {/* 2026 */}
            <div className="relative pl-6 sm:pl-8">
              <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-blue-500 ring-4 ring-navy" />
              <div className="sm:absolute sm:-left-32 sm:top-1 text-xs font-bold text-blue-400 uppercase">
                2026 · PLANNED
              </div>
              <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700 space-y-1.5">
                <h3 className="text-base font-bold text-white">Mobile App iOS & Android</h3>
                <p className="text-xs sm:text-sm text-slate-300">
                  Ứng dụng di động native, push notification biến động giá, AR xem nhà ảo.
                </p>
                <p className="text-xs font-semibold text-blue-400 pt-1">🎯 Mục tiêu: 200,000 người dùng</p>
              </div>
            </div>

            {/* 2027 */}
            <div className="relative pl-6 sm:pl-8">
              <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-purple-500 ring-4 ring-navy" />
              <div className="sm:absolute sm:-left-32 sm:top-1 text-xs font-bold text-purple-400 uppercase">
                2027 · VISION
              </div>
              <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700 space-y-1.5">
                <h3 className="text-base font-bold text-white">Mở rộng toàn quốc</h3>
                <p className="text-xs sm:text-sm text-slate-300">
                  HCM, Đà Nẵng, Nha Trang, Phú Quốc — PropTech #1 Việt Nam.
                </p>
                <p className="text-xs font-semibold text-purple-400 pt-1">🚀 Mục tiêu: 1 triệu người dùng</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          📌 SECTION 7 — ĐỘI NGŨ LÃNH ĐẠO
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section id="team" className="py-24 bg-slate-50">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-14">
            <span className="text-orange-500 font-extrabold text-xs tracking-widest uppercase">
              CON NGƯỜI
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-navy">
              Đội ngũ Sáng lập
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Member 1 */}
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-lg border border-gray-100 transition-all space-y-3"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-white font-black text-xl flex items-center justify-center mx-auto shadow-md">
                NTA
              </div>
              <div>
                <h3 className="font-bold text-base text-navy">Nguyễn Thanh An</h3>
                <p className="text-xs font-semibold text-orange-500">CEO & Co-founder</p>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                15 năm kinh nghiệm BĐS Hà Nội. Cựu Giám đốc CBRE Việt Nam.
              </p>
              <span className="inline-block bg-orange-50 text-orange-600 text-[11px] font-bold px-2.5 py-1 rounded-full">
                🏠 BĐS Expert
              </span>
            </motion.div>

            {/* Member 2 */}
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-lg border border-gray-100 transition-all space-y-3"
            >
              <div className="w-20 h-20 rounded-full bg-blue-500 text-white font-black text-xl flex items-center justify-center mx-auto shadow-md">
                TBM
              </div>
              <div>
                <h3 className="font-bold text-base text-navy">Trần Bảo Minh</h3>
                <p className="text-xs font-semibold text-blue-500">CTO & Co-founder</p>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                Kỹ sư AI tại Google (2018-2023). Chuyên gia Computer Vision và GIS.
              </p>
              <span className="inline-block bg-blue-50 text-blue-600 text-[11px] font-bold px-2.5 py-1 rounded-full">
                🤖 AI Engineer
              </span>
            </motion.div>

            {/* Member 3 */}
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-lg border border-gray-100 transition-all space-y-3"
            >
              <div className="w-20 h-20 rounded-full bg-emerald-500 text-white font-black text-xl flex items-center justify-center mx-auto shadow-md">
                LTH
              </div>
              <div>
                <h3 className="font-bold text-base text-navy">Lê Thị Hương</h3>
                <p className="text-xs font-semibold text-emerald-600">Head of Data</p>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                Tiến sĩ Quy hoạch đô thị, ĐH Kiến trúc Hà Nội.
              </p>
              <span className="inline-block bg-emerald-50 text-emerald-600 text-[11px] font-bold px-2.5 py-1 rounded-full">
                📊 Data Science
              </span>
            </motion.div>

            {/* Member 4 */}
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-lg border border-gray-100 transition-all space-y-3"
            >
              <div className="w-20 h-20 rounded-full bg-purple-500 text-white font-black text-xl flex items-center justify-center mx-auto shadow-md">
                PVK
              </div>
              <div>
                <h3 className="font-bold text-base text-navy">Phạm Văn Khải</h3>
                <p className="text-xs font-semibold text-purple-600">Head of Product</p>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                Ex-Product Lead tại VNPay. UX/UI specialist.
              </p>
              <span className="inline-block bg-purple-50 text-purple-600 text-[11px] font-bold px-2.5 py-1 rounded-full">
                🎨 Product Design
              </span>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          📌 SECTION 8 — ĐÁNH GIÁ KHÁCH HÀNG (Marquee)
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
          <span className="text-orange-500 font-extrabold text-xs tracking-widest uppercase">
            ĐÁNH GIÁ
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-navy mt-1">
            Khách hàng nói gì về chúng tôi?
          </h2>
        </div>

        {/* Marquee Container */}
        <div className="space-y-4 group">
          {/* Row 1 (scroll left) */}
          <div className="flex gap-4 w-max animate-[marquee_40s_linear_infinite] group-hover:[animation-play-state:paused]">
            {[
              {
                text: 'Báo cáo AI cực kỳ chi tiết, giúp tôi quyết định mua căn nhà Đống Đa nhanh hơn nhiều!',
                name: 'Nguyễn Minh T.',
                role: 'Nhà đầu tư',
              },
              {
                text: 'Layer quy hoạch 2030 là tính năng tôi cần nhất. Không còn mua phải đất quy hoạch nữa!',
                name: 'Trần Thu H.',
                role: 'Môi giới BĐS',
              },
              {
                text: 'Giao diện đẹp, dữ liệu chuẩn, PDF báo cáo gửi cho khách rất chuyên nghiệp.',
                name: 'Lê Văn D.',
                role: 'Sàn BĐS ABC',
              },
              {
                text: 'Đặt lịch xem nhà qua Zalo tích hợp rất tiện. Tiết kiệm được rất nhiều thời gian.',
                name: 'Phạm Thị M.',
                role: 'Chủ nhà',
              },
              {
                text: 'Dữ liệu các tuyến Metro và đường vành đai hiển thị trực quan nhất tôi từng thấy.',
                name: 'Hoàng Anh K.',
                role: 'Chuyên gia phân tích',
              },
              {
                text: 'Tính năng vẽ vùng Lasso Search lọc nhà đất siêu nhanh và chính xác.',
                name: 'Vũ Quốc B.',
                role: 'Khách mua nhà',
              },
            ].concat([
              {
                text: 'Báo cáo AI cực kỳ chi tiết, giúp tôi quyết định mua căn nhà Đống Đa nhanh hơn nhiều!',
                name: 'Nguyễn Minh T.',
                role: 'Nhà đầu tư',
              },
              {
                text: 'Layer quy hoạch 2030 là tính năng tôi cần nhất. Không còn mua phải đất quy hoạch nữa!',
                name: 'Trần Thu H.',
                role: 'Môi giới BĐS',
              },
            ]).map((t, idx) => (
              <div
                key={idx}
                className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm min-w-[320px] max-w-[360px] space-y-3"
              >
                <div className="flex items-center gap-1 text-amber-400 text-sm">
                  ⭐⭐⭐⭐⭐
                  <span className="text-[10px] text-gray-400 ml-auto">Tháng 8/2025</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed italic">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-2.5 pt-1 border-t border-gray-50">
                  <div className="w-7 h-7 rounded-full bg-orange-500/10 text-orange-600 font-bold text-xs flex items-center justify-center">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-navy">{t.name}</p>
                    <p className="text-[10px] text-gray-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Row 2 (scroll right) */}
          <div className="flex gap-4 w-max animate-[marquee-reverse_40s_linear_infinite] group-hover:[animation-play-state:paused]">
            {[
              {
                text: 'Tính năng vẽ vùng Lasso Search lọc nhà đất siêu nhanh và chính xác.',
                name: 'Vũ Quốc B.',
                role: 'Khách mua nhà',
              },
              {
                text: 'Dữ liệu các tuyến Metro và đường vành đai hiển thị trực quan nhất tôi từng thấy.',
                name: 'Hoàng Anh K.',
                role: 'Chuyên gia phân tích',
              },
              {
                text: 'Đặt lịch xem nhà qua Zalo tích hợp rất tiện. Tiết kiệm được rất nhiều thời gian.',
                name: 'Phạm Thị M.',
                role: 'Chủ nhà',
              },
              {
                text: 'Giao diện đẹp, dữ liệu chuẩn, PDF báo cáo gửi cho khách rất chuyên nghiệp.',
                name: 'Lê Văn D.',
                role: 'Sàn BĐS ABC',
              },
              {
                text: 'Layer quy hoạch 2030 là tính năng tôi cần nhất. Không còn mua phải đất quy hoạch nữa!',
                name: 'Trần Thu H.',
                role: 'Môi giới BĐS',
              },
              {
                text: 'Báo cáo AI cực kỳ chi tiết, giúp tôi quyết định mua căn nhà Đống Đa nhanh hơn nhiều!',
                name: 'Nguyễn Minh T.',
                role: 'Nhà đầu tư',
              },
            ].map((t, idx) => (
              <div
                key={idx}
                className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm min-w-[320px] max-w-[360px] space-y-3"
              >
                <div className="flex items-center gap-1 text-amber-400 text-sm">
                  ⭐⭐⭐⭐⭐
                  <span className="text-[10px] text-gray-400 ml-auto">Tháng 8/2025</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed italic">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-2.5 pt-1 border-t border-gray-50">
                  <div className="w-7 h-7 rounded-full bg-blue-500/10 text-blue-600 font-bold text-xs flex items-center justify-center">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-navy">{t.name}</p>
                    <p className="text-[10px] text-gray-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          📌 SECTION 9 — ĐỐI TÁC & CHỨNG NHẬN
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-16 bg-slate-50 border-y border-gray-200/60">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-gray-400">
            Đối tác & Chứng nhận Công nghệ
          </h3>

          {/* Partner Logos */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
            {['Sở QHKT Hà Nội', 'Google Cloud', 'VNPay', 'MoMo', 'Supabase', 'Vercel'].map((name) => (
              <div
                key={name}
                className="rounded-xl bg-white p-4 shadow-sm border border-gray-100 flex items-center justify-center h-14 w-36 text-gray-500 hover:text-navy font-bold text-xs transition-colors hover:shadow-md"
              >
                {name}
              </div>
            ))}
          </div>

          {/* Certifications Row */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-semibold text-gray-600">
            <span className="flex items-center gap-1.5">
              <Lock className="h-4 w-4 text-orange-500" />
              Bảo mật ISO 27001
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              Dữ liệu được kiểm định
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              <Award className="h-4 w-4 text-blue-500" />
              Đăng ký Bộ TTTT
            </span>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          📌 SECTION 10 — BẢN ĐỒ TÌM KIẾM PREVIEW
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-24 bg-navy text-white relative">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left 45%: Quick Search Form */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-orange-400 font-extrabold text-xs tracking-widest uppercase">
                TRY IT NOW
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                Khám phá BĐS Hà Nội ngay hôm nay
              </h2>
              <p className="text-sm text-slate-300">
                Hơn 10,000 tin đăng với đầy đủ thông tin quy hoạch, phân tích AI và bản đồ tương tác.
              </p>

              {/* Quick Search Form Card */}
              <form onSubmit={handleQuickSearch} className="bg-white rounded-2xl p-6 text-slate-900 shadow-2xl space-y-4">
                <h3 className="font-bold text-sm text-navy">Tìm kiếm nhanh</h3>

                {/* Row 1: Type */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1">Loại BĐS</label>
                  <select
                    value={quickType}
                    onChange={(e) => setQuickType(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 p-2.5 text-xs font-bold focus:outline-none focus:border-orange-500 bg-gray-50 cursor-pointer"
                  >
                    <option value="all">Tất cả loại hình</option>
                    <option value="house">Nhà phố</option>
                    <option value="apartment">Chung cư</option>
                    <option value="land">Đất nền</option>
                    <option value="villa">Biệt thự</option>
                  </select>
                </div>

                {/* Row 2: District */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1">Quận / Huyện</label>
                  <select
                    value={quickDistrict}
                    onChange={(e) => setQuickDistrict(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 p-2.5 text-xs font-bold focus:outline-none focus:border-orange-500 bg-gray-50 cursor-pointer"
                  >
                    {['Đống Đa', 'Hoàn Kiếm', 'Cầu Giấy', 'Tây Hồ', 'Long Biên', 'Nam Từ Liêm', 'Ba Đình', 'Thanh Xuân', 'Hai Bà Trưng', 'Hà Đông', 'Hoàng Mai', 'Gia Lâm', 'Đông Anh', 'Bắc Từ Liêm'].map((d) => (
                      <option key={d} value={d}>Quận {d}</option>
                    ))}
                  </select>
                </div>

                {/* Row 3: Price Range */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1">Khoảng giá (tỷ VNĐ)</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={priceMin}
                      onChange={(e) => setPriceMin(e.target.value)}
                      placeholder="Từ"
                      className="w-full rounded-xl border border-gray-200 p-2.5 text-xs font-bold focus:outline-none focus:border-orange-500 bg-gray-50"
                    />
                    <input
                      type="number"
                      value={priceMax}
                      onChange={(e) => setPriceMax(e.target.value)}
                      placeholder="Đến"
                      className="w-full rounded-xl border border-gray-200 p-2.5 text-xs font-bold focus:outline-none focus:border-orange-500 bg-gray-50"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-1.5"
                >
                  <Search className="h-4 w-4" />
                  <span>🔍 Tìm kiếm BĐS</span>
                </button>
              </form>

              {/* Popular links */}
              <div className="pt-2">
                <p className="text-xs text-slate-400 mb-2">Hoặc tìm kiếm theo khu vực phổ biến:</p>
                <div className="flex flex-wrap gap-2">
                  {['Hoàn Kiếm', 'Đống Đa', 'Cầu Giấy', 'Tây Hồ', 'Ba Đình', 'Hai Bà Trưng'].map((d) => (
                    <Link
                      key={d}
                      href={`/search?district=${encodeURIComponent(d)}`}
                      className="text-xs px-3 py-1 rounded-lg bg-white/10 hover:bg-orange-500 hover:text-white transition-colors"
                    >
                      {d}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Right 55%: Simulated Map Preview */}
            <div className="lg:col-span-7">
              <div className="relative rounded-3xl overflow-hidden border border-slate-700 bg-slate-950 aspect-[16/11] shadow-2xl flex items-center justify-center group">
                <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-30" />
                
                {/* SVG Mock Map Contours */}
                <svg className="absolute inset-0 w-full h-full opacity-40 pointer-events-none" viewBox="0 0 600 400">
                  <path d="M 100 50 Q 250 180, 450 200 T 600 350" fill="none" stroke="#38bdf8" strokeWidth="12" opacity="0.3" />
                  <polygon points="120,80 240,60 210,180 110,150" fill="#22c55e" fillOpacity="0.2" stroke="#22c55e" strokeWidth="1" />
                  <polygon points="280,120 400,100 370,220 260,200" fill="#ef4444" fillOpacity="0.2" stroke="#ef4444" strokeWidth="1" />
                  <polygon points="180,240 320,230 300,340 160,310" fill="#3b82f6" fillOpacity="0.2" stroke="#3b82f6" strokeWidth="1" />
                </svg>

                {/* Floating Pulsing Marker 1 */}
                <div className="absolute top-[35%] left-[30%] -translate-x-1/2 -translate-y-1/2">
                  <div className="relative flex items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-orange-400 opacity-75" />
                    <span className="relative inline-flex rounded-full px-2 py-1 bg-orange-500 text-white font-bold text-[10px] shadow-lg">
                      8.5 tỷ · Đống Đa
                    </span>
                  </div>
                </div>

                {/* Floating Marker 2 */}
                <div className="absolute top-[55%] left-[65%] -translate-x-1/2 -translate-y-1/2">
                  <div className="relative flex items-center justify-center">
                    <span className="relative inline-flex rounded-full px-2 py-1 bg-primary text-white font-bold text-[10px] shadow-lg border border-slate-600">
                      12.8 tỷ · Cầu Giấy
                    </span>
                  </div>
                </div>

                {/* Floating Marker 3 */}
                <div className="absolute top-[25%] left-[75%] -translate-x-1/2 -translate-y-1/2">
                  <div className="relative flex items-center justify-center">
                    <span className="relative inline-flex rounded-full px-2 py-1 bg-primary text-white font-bold text-[10px] shadow-lg border border-slate-600">
                      24.5 tỷ · Hồ Tây
                    </span>
                  </div>
                </div>

                {/* Play Button Overlay */}
                <Link
                  href="/search"
                  className="z-20 flex items-center gap-2 px-6 py-3 rounded-2xl bg-orange-500/90 hover:bg-orange-500 text-white font-bold text-sm shadow-2xl backdrop-blur-md transition-transform group-hover:scale-105"
                >
                  <Play className="h-4 w-4 fill-white" />
                  <span>▶ Xem demo bản đồ tương tác</span>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          📌 SECTION 11 — CTA CUỐI TRANG
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-20 bg-gradient-to-r from-orange-500 via-orange-500 to-orange-600 text-white text-center relative overflow-hidden">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <div className="text-4xl sm:text-5xl">🚀</div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Bắt đầu ngay hôm nay — Miễn phí
          </h2>
          <p className="text-sm sm:text-base text-white/90 max-w-xl mx-auto">
            Không cần thẻ tín dụng · Dùng thử đầy đủ tính năng 7 ngày
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/search"
              className="w-full sm:w-auto px-8 py-4 bg-white text-orange-600 hover:bg-orange-50 font-black rounded-2xl text-base shadow-xl transition-all"
            >
              🔍 Tìm kiếm BĐS miễn phí
            </Link>

            <Link
              href="/pricing"
              className="w-full sm:w-auto px-8 py-4 border-2 border-white text-white hover:bg-white/10 font-bold rounded-2xl text-base transition-all"
            >
              💎 Xem các gói dịch vụ
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-4 text-xs font-semibold text-white/80">
            <span>✅ Không cần thẻ</span>
            <span>·</span>
            <span>✅ Hủy bất kỳ lúc nào</span>
            <span>·</span>
            <span>✅ Hoàn tiền 7 ngày</span>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          📌 FOOTER (Full width)
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <footer className="bg-[#0a0f1e] text-slate-400 text-xs py-16 border-t border-slate-800">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Col 1 - Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-orange-500 text-white flex items-center justify-center font-black text-lg shadow-md">
                🏠
              </div>
              <span className="text-lg font-black text-white">
                HaNoi <span className="text-orange-500">Realty</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Nền tảng BĐS thông minh nhất Hà Nội. Tiên phong ứng dụng dữ liệu quy hoạch và định giá AI.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-2 pt-1">
              {['Facebook', 'YouTube', 'TikTok', 'LinkedIn'].map((social) => (
                <div
                  key={social}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xs cursor-pointer transition-colors"
                  title={social}
                >
                  {social[0]}
                </div>
              ))}
            </div>
          </div>

          {/* Col 2 - Sản phẩm */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase text-xs tracking-wider">Sản phẩm & Hệ thống</h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link href="/search" className="hover:text-white transition-colors">Tìm kiếm BĐS</Link></li>
              <li><Link href="/planning" className="hover:text-white transition-colors">Bản đồ quy hoạch</Link></li>
              <li><Link href="/reports" className="hover:text-white transition-colors">Báo cáo AI</Link></li>
              <li><Link href="/listings/create" className="hover:text-white transition-colors">Đăng tin BĐS</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition-colors">Gói thành viên</Link></li>
              <li><Link href="/admin" className="text-orange-400 hover:text-white transition-colors font-bold flex items-center gap-1">🛡️ Admin Portal</Link></li>
            </ul>
          </div>

          {/* Col 3 - Công ty */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase text-xs tracking-wider">Công ty</h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link href="/about" className="hover:text-white transition-colors">Về chúng tôi</Link></li>
              <li><Link href="/about#team" className="hover:text-white transition-colors">Đội ngũ</Link></li>
              <li><Link href="/about#careers" className="hover:text-white transition-colors">Tuyển dụng</Link></li>
              <li><Link href="/streets" className="hover:text-white transition-colors">Blog & Tin tức</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition-colors">Liên hệ</Link></li>
            </ul>
          </div>

          {/* Col 4 - Liên hệ & Hỗ trợ */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase text-xs tracking-wider">Liên hệ</h4>
            <div className="space-y-2 text-slate-400 text-xs">
              <p className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-orange-400 shrink-0" />
                <span>support@hanoirealty.vn</span>
              </p>
              <p className="flex items-center gap-2">
                <PhoneCall className="h-3.5 w-3.5 text-orange-400 shrink-0" />
                <span>1800 6868 (miễn phí)</span>
              </p>
              <p className="flex items-start gap-2">
                <MapPin className="h-3.5 w-3.5 text-orange-400 shrink-0 mt-0.5" />
                <span>Tầng 12, Tòa nhà Handico, Phạm Hùng, Nam Từ Liêm, Hà Nội</span>
              </p>
              <p className="text-[11px] text-slate-500 pt-1">
                ⏰ T2-T6: 8:00-18:00 | T7: 8:00-12:00
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2025 HaNoi Realty. Bảo lưu mọi quyền.</p>
          <div className="flex gap-4">
            <Link href="/about" className="hover:text-slate-300 transition-colors">Chính sách bảo mật</Link>
            <span>·</span>
            <Link href="/about" className="hover:text-slate-300 transition-colors">Điều khoản sử dụng</Link>
            <span>·</span>
            <Link href="/about" className="hover:text-slate-300 transition-colors">Cookies</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
