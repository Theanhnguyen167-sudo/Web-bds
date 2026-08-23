'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import FloatingContactWidget from '@/components/contact/FloatingContactWidget';
import { useApp } from '@/lib/context/AppContext';
import { mockListings, mockUser } from '@/lib/mock-data';
import { formatCurrencyVND, formatPricePerM2 } from '@/lib/utils';
import {
  Home,
  MapPin,
  Maximize2,
  Building,
  Bed,
  Bath,
  Compass,
  FileText,
  Sparkles,
  Heart,
  Share2,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Phone,
  Mail,
  Calendar,
  Eye,
  ChevronRight,
  Layers,
} from 'lucide-react';

interface ListingDetailClientProps {
  listingId: string;
}

export default function ListingDetailClient({ listingId }: ListingDetailClientProps) {
  const router = useRouter();
  const { listings, savedListingIds, toggleSaveListing, addToast } = useApp();

  const listing = listings.find((l) => l.id === listingId) || mockListings.find(l => l.id === listingId) || listings[0];

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [currentStepProgress, setCurrentStepProgress] = useState(0);

  const isSaved = savedListingIds.includes(listing.id);

  const progressSteps = [
    'Đang lấy thông tin quy hoạch phân khu...',
    'Đang phân tích dự án hạ tầng & Metro lân cận...',
    'Đang tổng hợp dữ liệu với Gemini AI...',
    'Đang khởi tạo cấu trúc báo cáo định giá...',
  ];

  const handleGenerateAIReport = async () => {
    setIsGeneratingReport(true);
    setCurrentStepProgress(1);

    setTimeout(() => setCurrentStepProgress(2), 700);
    setTimeout(() => setCurrentStepProgress(3), 1500);
    setTimeout(() => setCurrentStepProgress(4), 2200);

    setTimeout(() => {
      setIsGeneratingReport(false);
      addToast('✅ Báo cáo AI đã được tạo thành công!', 'success');
      router.push(`/reports/${listing.id}`);
    }, 2900);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    addToast('🔗 Đã sao chép link bất động sản vào clipboard', 'info');
  };

  return (
    <div className="min-h-screen bg-page-bg flex flex-col">
      <Navbar />

      <main className="flex-1 container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        
        {/* Breadcrumb Navigation */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-xs font-semibold text-text-muted mb-4"
        >
          <Link href="/" className="hover:text-accent transition-colors flex items-center gap-1">
            <Home className="h-3.5 w-3.5" />
            <span>Trang chủ</span>
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/" className="hover:text-accent transition-colors">
            Hà Nội
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-accent">{listing.district}</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-text-primary truncate max-w-[200px]">Mã #{listing.id}</span>
        </motion.div>

        {/* Top Action Bar & Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="rounded-md bg-accent px-2.5 py-0.5 text-xs font-extrabold text-white">
                {listing.planningZone}
              </span>
              <span className="rounded-md bg-slate-200 px-2 py-0.5 text-xs font-semibold text-text-secondary">
                Quy hoạch {listing.planningYear}
              </span>
              {listing.isFeatured && (
                <span className="rounded-md bg-amber-500 px-2 py-0.5 text-xs font-extrabold text-white">
                  ⭐ Tin nổi bật
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-text-primary tracking-tight leading-snug">
              {listing.title}
            </h1>
            <div className="flex items-center gap-4 mt-2 text-xs text-text-secondary">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4 text-accent" />
                {listing.address}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                Đăng ngày {listing.createdAt}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" />
                {listing.views} lượt xem
              </span>
            </div>
          </div>

          {/* Quick Buttons: Save & Share */}
          <div className="flex items-center gap-2 shrink-0">
            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => toggleSaveListing(listing.id)}
              className={`flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-bold transition-all shadow-sm ${
                isSaved
                  ? 'border-red-300 bg-red-50 text-red-500'
                  : 'border-border bg-white text-text-primary hover:bg-slate-50'
              }`}
            >
              <Heart className={`h-4 w-4 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
              <span>{isSaved ? 'Đã lưu' : 'Lưu tin'}</span>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              onClick={handleShare}
              className="flex items-center gap-1.5 rounded-xl border border-border bg-white px-3.5 py-2 text-xs font-bold text-text-primary hover:bg-slate-50 shadow-sm"
            >
              <Share2 className="h-4 w-4" />
              <span>Chia sẻ</span>
            </motion.button>
          </div>
        </div>

        {/* Main 2-Column Grid: Image Gallery & Content | Sidebar Box */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column (Images + Specs + Description + AI CTA) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Image Gallery */}
            <div className="space-y-3">
              {/* Main Hero Image */}
              <motion.div
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-slate-900 shadow-md"
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={selectedImageIndex}
                    src={listing.images[selectedImageIndex] || listing.images[0]}
                    alt={listing.title}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="h-full w-full object-cover"
                  />
                </AnimatePresence>

                {/* Price pill */}
                <div className="absolute bottom-4 left-4 rounded-xl bg-primary/95 px-4 py-2 text-base font-black text-white shadow-xl backdrop-blur-md">
                  {formatCurrencyVND(listing.price)}
                  <span className="ml-2 text-xs font-normal text-slate-300">
                    ({formatPricePerM2(listing.price, listing.area)})
                  </span>
                </div>
              </motion.div>

              {/* Thumbnails row */}
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {listing.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                      selectedImageIndex === idx
                        ? 'border-accent shadow-md scale-105'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumb" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* AI Report Generator Banner CTA */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl border border-orange-200 bg-gradient-to-r from-orange-50 via-amber-50 to-orange-100/60 p-5 shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-white shadow-md">
                      <Sparkles className="h-4 w-4" />
                    </span>
                    <h3 className="text-sm font-extrabold text-primary">
                      Thẩm Định Quy Hoạch & Định Giá AI
                    </h3>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Hệ thống AI phân tích tự động dữ liệu quy hoạch đất 2030, các dự án hạ tầng lân cận và tính thanh khoản bất động sản này.
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  disabled={isGeneratingReport}
                  onClick={handleGenerateAIReport}
                  className="flex items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 text-xs font-black text-white shadow-lg shadow-accent/25 hover:bg-accent-hover transition-all shrink-0 disabled:opacity-80"
                >
                  {isGeneratingReport ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Đang phân tích AI...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      <span>Tạo báo cáo AI ngay</span>
                    </>
                  )}
                </motion.button>
              </div>

              {/* Progress steps animation when generating */}
              <AnimatePresence>
                {isGeneratingReport && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 border-t border-orange-200/80 pt-3 space-y-2"
                  >
                    {progressSteps.map((stepText, stepIdx) => (
                      <div
                        key={stepIdx}
                        className={`flex items-center gap-2 text-xs transition-opacity duration-300 ${
                          currentStepProgress > stepIdx
                            ? 'font-bold text-success'
                            : currentStepProgress === stepIdx + 1
                            ? 'font-semibold text-accent animate-pulse'
                            : 'opacity-40 text-text-muted'
                        }`}
                      >
                        {currentStepProgress > stepIdx ? (
                          <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                        ) : (
                          <Loader2 className="h-4 w-4 animate-spin text-accent shrink-0" />
                        )}
                        <span>{stepText}</span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Key Specs Matrix */}
            <div className="rounded-2xl border border-border bg-white p-5 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-text-primary">Đặc điểm bất động sản</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div className="rounded-xl bg-page-bg p-3 space-y-1">
                  <span className="text-text-muted text-[11px]">Diện tích</span>
                  <p className="text-sm font-bold text-text-primary flex items-center gap-1.5">
                    <Maximize2 className="h-4 w-4 text-accent" />
                    {listing.area} m²
                  </p>
                </div>

                <div className="rounded-xl bg-page-bg p-3 space-y-1">
                  <span className="text-text-muted text-[11px]">Mức giá / m²</span>
                  <p className="text-sm font-bold text-accent">
                    {formatPricePerM2(listing.price, listing.area)}
                  </p>
                </div>

                <div className="rounded-xl bg-page-bg p-3 space-y-1">
                  <span className="text-text-muted text-[11px]">Số tầng</span>
                  <p className="text-sm font-bold text-text-primary flex items-center gap-1.5">
                    <Building className="h-4 w-4 text-accent" />
                    {listing.floors} tầng
                  </p>
                </div>

                <div className="rounded-xl bg-page-bg p-3 space-y-1">
                  <span className="text-text-muted text-[11px]">Phòng ngủ / Tắm</span>
                  <p className="text-sm font-bold text-text-primary flex items-center gap-1.5">
                    <Bed className="h-4 w-4 text-accent" />
                    {listing.bedrooms} PN / {listing.bathrooms} PT
                  </p>
                </div>

                <div className="rounded-xl bg-page-bg p-3 space-y-1">
                  <span className="text-text-muted text-[11px]">Hướng nhà</span>
                  <p className="text-sm font-bold text-text-primary flex items-center gap-1.5">
                    <Compass className="h-4 w-4 text-accent" />
                    {listing.direction || 'Đông Nam'}
                  </p>
                </div>

                <div className="rounded-xl bg-page-bg p-3 space-y-1">
                  <span className="text-text-muted text-[11px]">Tình trạng pháp lý</span>
                  <p className="text-sm font-bold text-success flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-success" />
                    {listing.legalStatus}
                  </p>
                </div>

                <div className="rounded-xl bg-page-bg p-3 space-y-1">
                  <span className="text-text-muted text-[11px]">Quy hoạch sử dụng</span>
                  <p className="text-sm font-bold text-text-primary flex items-center gap-1.5">
                    <Layers className="h-4 w-4 text-accent" />
                    {listing.planningZone}
                  </p>
                </div>

                <div className="rounded-xl bg-page-bg p-3 space-y-1">
                  <span className="text-text-muted text-[11px]">Năm quy hoạch</span>
                  <p className="text-sm font-bold text-text-primary">
                    Đến năm {listing.planningYear}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="rounded-2xl border border-border bg-white p-5 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-text-primary">Mô tả chi tiết</h3>
              <p className="text-xs leading-relaxed text-text-secondary whitespace-pre-line">
                {listing.description ||
                  `Cần bán gấp bất động sản toạ lạc tại vị trí cực đẹp ${listing.address}.
                  - Diện tích ${listing.area}m², mặt tiền rộng, thoáng trước sau.
                  - Giao thông thuận tiện kết nối các trục đường huyết mạch quận ${listing.district}.
                  - Khu dân trí cao, an ninh tốt, tiện ích xung quanh đầy đủ: trường học, siêu thị, bệnh viện.
                  - Sổ đỏ chính chủ, pháp lý minh bạch sẵn sàng sang tên ngay.`}
              </p>
            </div>
          </div>

          {/* Right Column: Agent Contact Card + Security Box */}
          <div className="space-y-6">
            
            {/* Agent Contact Box */}
            <div className="rounded-2xl border border-border bg-white p-6 shadow-sm space-y-5">
              <div className="flex items-center gap-3">
                <img
                  src={mockUser.avatar}
                  alt={mockUser.name}
                  className="h-14 w-14 rounded-2xl object-cover ring-2 ring-accent"
                />
                <div>
                  <h4 className="text-sm font-extrabold text-text-primary">{mockUser.name}</h4>
                  <p className="text-xs font-semibold text-accent">Chuyên viên BĐS {listing.district}</p>
                  <div className="mt-1 flex items-center gap-1 text-[11px] text-text-muted">
                    <ShieldCheck className="h-3.5 w-3.5 text-success" />
                    <span>Môi giới đã xác minh</span>
                  </div>
                </div>
              </div>

              {/* Action Contact buttons */}
              <div className="space-y-2">
                <a
                  href="tel:0988123456"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 px-4 text-xs font-bold text-white shadow-md hover:bg-primary-hover transition-colors"
                >
                  <Phone className="h-4 w-4 text-accent" />
                  <span>Gọi ngay: 0988 123 456</span>
                </a>

                <button
                  onClick={() => addToast('Đã gửi yêu cầu tư vấn đến môi giới!', 'success')}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-input bg-page-bg py-3 px-4 text-xs font-bold text-text-primary hover:bg-slate-100 transition-colors"
                >
                  <Mail className="h-4 w-4 text-accent" />
                  <span>Yêu cầu tư vấn / Xem nhà</span>
                </button>
              </div>

              {/* Trust badges */}
              <div className="border-t border-border/80 pt-4 space-y-2 text-[11px] text-text-secondary">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                  <span>Thông tin quy hoạch được xác thực số hóa</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                  <span>Cam kết không thu phí người mua</span>
                </div>
              </div>
            </div>

            {/* Quick Map Location Preview */}
            <div className="rounded-2xl border border-border bg-white p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-text-primary flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-accent" />
                  Vị trí trên bản đồ
                </h4>
                <Link href="/" className="text-[11px] font-bold text-accent hover:underline">
                  Xem bản đồ lớn
                </Link>
              </div>
              <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-slate-900 flex items-center justify-center text-white">
                <div className="text-center p-3">
                  <MapPin className="h-6 w-6 text-accent mx-auto mb-1 animate-bounce" />
                  <span className="text-xs font-bold">{listing.district}, Hà Nội</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </main>

      {/* Floating Contact Widget & Appointment Booking */}
      <FloatingContactWidget
        agentPhone={(listing as any).users?.phone || mockUser.phone || '0988123456'}
        agentName={(listing as any).users?.full_name || mockUser.name || 'Nguyễn Văn Minh'}
        agentZalo={(listing as any).users?.phone || mockUser.phone || '0988123456'}
        listingTitle={listing.title}
        listingId={listing.id}
      />
    </div>
  );
}
