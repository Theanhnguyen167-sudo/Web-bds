'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import FloatingContactWidget from '@/components/contact/FloatingContactWidget';
import { useApp } from '@/lib/context/AppContext';
import { mockListings, mockUser } from '@/lib/mock-data';
import PropertyAmenities from '@/components/listing/PropertyAmenities';
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
  ChevronDown,
  ChevronUp,
  X,
  ChevronLeft,
  Image as ImageIcon,
  ExternalLink,
  Map,
  Award,
  Star,
  UserCheck,
  MessageSquare,
} from 'lucide-react';

const ListingDetailMap = dynamic(
  () => import('@/components/map/ListingDetailMap'),
  {
    ssr: false,
    loading: () => (
      <div className="h-[280px] w-full rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse flex items-center justify-center">
        <span className="text-xs text-slate-400">Đang nạp bản đồ vị trí...</span>
      </div>
    ),
  }
);

interface ListingDetailClientProps {
  listingId: string;
}

export default function ListingDetailClient({ listingId }: ListingDetailClientProps) {
  const router = useRouter();
  const { listings, savedListingIds, toggleSaveListing, addToast } = useApp();

  const listing =
    listings.find((l) => l.id === listingId) ||
    mockListings.find((l) => l.id === listingId) ||
    listings[0];

  const images = listing.images && listing.images.length > 0
    ? listing.images
    : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80'];

  // Lightbox State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Mobile selected preview
  const [mobileSelectedImageIndex, setMobileSelectedImageIndex] = useState(0);

  // Description expand state
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  // AI Report Generation state
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
    addToast('🔗 Đã sao chép liên kết bất động sản vào clipboard', 'info');
  };

  const openLightbox = (index: number) => {
    setActiveImageIndex(index);
    setLightboxOpen(true);
  };

  const nextLightboxImage = useCallback(() => {
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevLightboxImage = useCallback(() => {
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowRight') nextLightboxImage();
      if (e.key === 'ArrowLeft') prevLightboxImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, nextLightboxImage, prevLightboxImage]);

  // Extra images count for 4th image overlay
  const remainingImagesCount = images.length > 4 ? images.length - 4 : 0;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col selection:bg-orange-100 selection:text-orange-900">
      <Navbar />

      <main className="flex-1 w-full max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        
        {/* ── BREADCRUMB & TOP ACTIONS ── */}
        <div className="flex items-center justify-between gap-4 py-4">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-medium text-slate-500 truncate">
            <Link href="/" className="hover:text-slate-900 transition-colors flex items-center gap-1 shrink-0">
              <Home className="h-3.5 w-3.5" />
              <span>Trang chủ</span>
            </Link>
            <ChevronRight className="h-3 w-3 text-slate-400 shrink-0" />
            <Link href="/" className="hover:text-slate-900 transition-colors shrink-0">
              Hà Nội
            </Link>
            <ChevronRight className="h-3 w-3 text-slate-400 shrink-0" />
            <Link href={`/search?district=${encodeURIComponent(listing.district)}`} className="text-slate-700 hover:text-slate-900 font-semibold transition-colors shrink-0">
              {listing.district}
            </Link>
            <ChevronRight className="h-3 w-3 text-slate-400 shrink-0" />
            <span className="text-slate-400 truncate max-w-[150px] sm:max-w-[220px]">
              Mã #{listing.id}
            </span>
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => toggleSaveListing(listing.id)}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all shadow-sm ${
                isSaved
                  ? 'border-red-200 bg-red-50 text-red-600 hover:bg-red-100'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Heart className={`h-3.5 w-3.5 ${isSaved ? 'fill-red-600 text-red-600' : 'text-slate-500'}`} />
              <span>{isSaved ? 'Đã lưu' : 'Lưu tin'}</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 shadow-sm transition-all"
            >
              <Share2 className="h-3.5 w-3.5 text-slate-500" />
              <span>Chia sẻ</span>
            </button>
          </div>
        </div>

        {/* ── HEADER BÀI ĐĂNG (TIÊU ĐỀ, GIÁ, ĐỊA CHỈ, THÔNG SỐ CỐT LÕI) ── */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-7 shadow-sm space-y-4 mb-6">
          {/* Badge phân khu & quy hoạch */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 border border-blue-200/60">
              <Layers className="h-3 w-3" />
              {listing.planningZone || 'Đất ở đô thị'}
            </span>
            <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
              Quy hoạch {listing.planningYear || 2030}
            </span>
            {listing.isFeatured && (
              <span className="rounded-md bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 border border-amber-200 flex items-center gap-1">
                <span>⭐</span> Tin nổi bật
              </span>
            )}
          </div>

          {/* Tiêu đề bài đăng */}
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
            {listing.title}
          </h1>

          {/* Giá + thông tin ngày đăng / lượt xem */}
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2 pt-0.5 border-b border-slate-100 pb-4">
            <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-rose-600 tracking-tight">
              {formatCurrencyVND(listing.price)}
            </span>
            <span className="text-sm sm:text-base font-semibold text-slate-500">
              · {formatPricePerM2(listing.price, listing.area)}
            </span>
            <div className="flex items-center gap-3 text-xs text-slate-400 ml-auto pt-1 sm:pt-0">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                Đăng ngày {listing.createdAt || '2025-08-18'}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" />
                {listing.views || 234} lượt xem
              </span>
            </div>
          </div>

          {/* Địa chỉ bài đăng */}
          <div className="flex items-center gap-2 text-sm sm:text-base text-slate-700 font-medium">
            <MapPin className="h-4 w-4 text-orange-500 shrink-0" />
            <span>{listing.address}</span>
          </div>
        </div>

        {/* ════════════ 1. KHỐI ẢNH (60%) & NGƯỜI ĐĂNG BÁN (40%) ════════════ */}
        <section className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 items-start mb-10">
          
          {/* ── BÊN TRÁI (60% / lg:col-span-3): ẢNH CỦA BÀI ĐĂNG ── */}
          <div className="lg:col-span-3 flex flex-col gap-3">
            {/* Ảnh lớn chính */}
            <div
              onClick={() => openLightbox(activeImageIndex)}
              className="relative w-full h-[360px] sm:h-[450px] rounded-2xl overflow-hidden cursor-pointer group bg-slate-950 shadow-md border border-slate-200/80"
            >
              <img
                src={images[activeImageIndex] || images[0]}
                alt={listing.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Lớp phủ gradient nhẹ khi hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Nút lướt ảnh Trước / Sau trực tiếp trên ảnh lớn */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/45 hover:bg-black/75 text-white flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all shadow-md z-10"
                    title="Ảnh trước"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveImageIndex((prev) => (prev + 1) % images.length);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/45 hover:bg-black/75 text-white flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all shadow-md z-10"
                    title="Ảnh sau"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}

              {/* Badge số thứ tự ảnh */}
              <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm">
                <ImageIcon className="h-3.5 w-3.5 text-orange-400" />
                <span>
                  {activeImageIndex + 1} / {images.length} ảnh
                </span>
              </div>

              {/* Nút phóng to toàn màn hình */}
              <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md hover:bg-black/80 text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 shadow-sm transition-colors">
                <Maximize2 className="h-3.5 w-3.5 text-orange-400" />
                <span>Phóng to toàn màn hình</span>
              </div>
            </div>

            {/* Dải ảnh thumbnails trượt bên dưới */}
            {images.length > 1 && (
              <div className="flex items-center gap-2.5 overflow-x-auto pb-1.5 pt-0.5 no-scrollbar">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative h-18 w-24 sm:h-20 sm:w-28 shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-200 group ${
                      activeImageIndex === idx
                        ? 'border-orange-500 ring-2 ring-orange-200 opacity-100 shadow-sm'
                        : 'border-slate-200 opacity-60 hover:opacity-100 hover:border-slate-400'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`thumb-${idx}`}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                    />
                    {idx === 4 && remainingImagesCount > 0 && (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          openLightbox(4);
                        }}
                        className="absolute inset-0 bg-slate-950/75 backdrop-blur-[1px] flex flex-col items-center justify-center text-white"
                      >
                        <span className="text-xs font-bold">+{remainingImagesCount}</span>
                        <span className="text-[9px] text-slate-300">Xem tất cả</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── BÊN PHẢI (40% / lg:col-span-2): THÔNG TIN CHI TIẾT CỦA NGƯỜI ĐĂNG BÁN ── */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-sm flex flex-col justify-between space-y-4">
            {/* Header thông tin người đăng bán */}
            <div>
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-orange-600 flex items-center gap-1.5">
                  <UserCheck className="h-3.5 w-3.5" />
                  Thông tin người đăng bán
                </span>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  Đang trực tuyến
                </span>
              </div>

              {/* Thông tin cá nhân & Avatar */}
              <div className="flex items-start gap-4 sm:gap-5 mt-4">
                {/* Avatar khống chế kích thước chuẩn đẹp */}
                <div className="relative shrink-0">
                  <img
                    src={(listing as any).users?.avatar_url || mockUser.avatar}
                    alt={(listing as any).users?.full_name || mockUser.name}
                    className="w-20 h-20 sm:w-22 sm:h-22 rounded-full object-cover ring-4 ring-orange-50 border-2 border-orange-400 shadow-md"
                    style={{ width: '84px', height: '84px' }}
                  />
                  <span
                    className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-white"
                    title="Đang trực tuyến"
                  />
                </div>

                {/* Tên & chức danh */}
                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                      {(listing as any).users?.full_name || mockUser.name || 'Nguyễn Văn Minh'}
                    </h3>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-md">
                      <Award className="h-3 w-3 text-amber-600" />
                      Môi giới uy tín
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-500 font-medium">
                    Chuyên viên tư vấn BĐS · Phụ trách khu vực {listing.district}
                  </p>

                  <div className="flex items-center gap-2 pt-0.5">
                    <div className="flex items-center text-amber-500 text-xs font-bold gap-0.5">
                      <Star className="h-3.5 w-3.5 fill-amber-400" />
                      <span>4.9 / 5.0</span>
                    </div>
                    <span className="text-slate-300">·</span>
                    <span className="text-xs text-slate-500 font-medium">52 giao dịch thành công</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Các chỉ số uy tín người bán */}
            <div className="grid grid-cols-3 gap-2.5 p-3 rounded-xl bg-slate-50/90 border border-slate-100 text-center">
              <div className="space-y-0.5">
                <span className="text-xs font-medium text-slate-500 block">Tin đã đăng</span>
                <span className="text-sm sm:text-base font-extrabold text-slate-900">18+ tin</span>
              </div>
              <div className="space-y-0.5 border-x border-slate-200">
                <span className="text-xs font-medium text-slate-500 block">Tỷ lệ phản hồi</span>
                <span className="text-sm sm:text-base font-extrabold text-emerald-600">100%</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-medium text-slate-500 block">Thời gian phản hồi</span>
                <span className="text-sm sm:text-base font-extrabold text-orange-600">&lt; 5 phút</span>
              </div>
            </div>

            {/* Kênh liên hệ & CTA gọi / nhắn tin */}
            <div className="space-y-2.5">
              <a
                href={`tel:${((listing as any).users?.phone || mockUser.phone || '0988123456').replace(/\s+/g, '')}`}
                className="w-full flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 py-3.5 px-4 text-white font-bold text-base shadow-md hover:shadow-lg transition-all"
              >
                <Phone className="h-5 w-5" />
                <span>Gọi ngay: {(listing as any).users?.phone || mockUser.phone || '0988 123 456'}</span>
              </a>

              <div className="grid grid-cols-2 gap-2.5">
                <a
                  href={`https://zalo.me/${((listing as any).users?.phone || mockUser.phone || '0988123456').replace(/\s+/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#0068FF] hover:bg-[#0055d4] text-white py-2.5 px-3 text-xs sm:text-sm font-bold shadow-xs transition-colors"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>Chat qua Zalo</span>
                </a>

                <button
                  onClick={() =>
                    addToast(
                      `Đã gửi yêu cầu hẹn lịch xem nhà tới ${(listing as any).users?.full_name || mockUser.name}!`,
                      'success'
                    )
                  }
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 py-2.5 px-3 text-xs sm:text-sm font-semibold text-slate-700 shadow-xs transition-colors"
                >
                  <Calendar className="h-4 w-4 text-orange-500" />
                  <span>Hẹn xem nhà</span>
                </button>
              </div>
            </div>

            {/* Cam kết minh bạch từ người bán */}
            <div className="rounded-xl bg-emerald-50/70 border border-emerald-200/80 p-3 space-y-1 text-xs text-slate-600">
              <div className="flex items-center gap-2 font-bold text-emerald-800">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Cam kết minh bạch từ người đăng bán</span>
              </div>
              <p className="text-[11px] text-emerald-900/80 leading-relaxed">
                • Bất động sản chính chủ, ảnh chụp và vị trí thực tế 100%.<br />
                • Dẫn xem nhà trực tiếp miễn phí, không phát sinh phụ phí với khách mua.<br />
                • Hỗ trợ thủ tục pháp lý, kiểm tra quy hoạch và sang tên sổ đỏ trọn gói.
              </p>
            </div>
          </div>

        </section>

        {/* ════════════ 2. KHỐI DƯỚI (BOTTOM SECTION): TOÀN BỘ THÔNG TIN CHI TIẾT BÀI ĐĂNG ════════════ */}
        <section className="space-y-6 pt-4 border-t border-slate-200">
          
          {/* ── BANNER THẨM ĐỊNH QUY HOẠCH & ĐỊNH GIÁ AI ── */}
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/90 p-4 sm:p-5 shadow-sm transition-all">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-600 mt-0.5">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-sm font-bold text-slate-800">
                    Thẩm Định Quy Hoạch & Định Giá AI
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
                    Hệ thống AI phân tích tự động dữ liệu quy hoạch đất 2030, hạ tầng giao thông và tính thanh khoản bất động sản này.
                  </p>
                </div>
              </div>

              <button
                disabled={isGeneratingReport}
                onClick={handleGenerateAIReport}
                className="flex items-center justify-center gap-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 text-xs font-semibold shadow-sm transition-all shrink-0 disabled:opacity-75 self-start sm:self-center"
              >
                {isGeneratingReport ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Đang phân tích AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5 text-orange-400" />
                    <span>Tạo báo cáo AI ngay</span>
                  </>
                )}
              </button>
            </div>

            {/* Progress steps animation */}
            <AnimatePresence>
              {isGeneratingReport && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3.5 border-t border-slate-200/80 pt-3 space-y-1.5"
                >
                  {progressSteps.map((stepText, stepIdx) => (
                    <div
                      key={stepIdx}
                      className={`flex items-center gap-2 text-xs transition-opacity duration-300 ${
                        currentStepProgress > stepIdx
                          ? 'font-medium text-emerald-600'
                          : currentStepProgress === stepIdx + 1
                          ? 'font-semibold text-orange-600 animate-pulse'
                          : 'opacity-40 text-slate-400'
                      }`}
                    >
                      {currentStepProgress > stepIdx ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      ) : (
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-orange-500 shrink-0" />
                      )}
                      <span>{stepText}</span>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── LƯỚI CHI TIẾT (2 CỘT: TRÁI 62% ĐẶC ĐIỂM + MÔ TẢ + PHÁP LÝ, PHẢI 38% BẢN ĐỒ) ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Cột trái (lg:col-span-7): Đặc điểm BĐS & Mô tả chi tiết */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Đặc điểm bất động sản */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-orange-500" />
                  <span>Đặc điểm bất động sản</span>
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-y-5 gap-x-6 pt-1">
                  {/* Diện tích */}
                  <div className="space-y-1">
                    <span className="text-xs font-normal text-slate-500 block">Diện tích</span>
                    <p className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                      <Maximize2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      {listing.area} m²
                    </p>
                  </div>

                  {/* Mức giá / m² */}
                  <div className="space-y-1">
                    <span className="text-xs font-normal text-slate-500 block">Mức giá / m²</span>
                    <p className="text-sm font-semibold text-rose-600">
                      {formatPricePerM2(listing.price, listing.area)}
                    </p>
                  </div>

                  {/* Số tầng */}
                  <div className="space-y-1">
                    <span className="text-xs font-normal text-slate-500 block">Số tầng</span>
                    <p className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                      <Building className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      {listing.floors} tầng
                    </p>
                  </div>

                  {/* Phòng ngủ / Phòng tắm */}
                  <div className="space-y-1">
                    <span className="text-xs font-normal text-slate-500 block">Phòng ngủ / Tắm</span>
                    <p className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                      <Bed className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      {listing.bedrooms} PN / {listing.bathrooms} PT
                    </p>
                  </div>

                  {/* Hướng nhà */}
                  <div className="space-y-1">
                    <span className="text-xs font-normal text-slate-500 block">Hướng nhà</span>
                    <p className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                      <Compass className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      {listing.direction || 'Đông Nam'}
                    </p>
                  </div>

                  {/* Tình trạng pháp lý & Sang tên */}
                  <div className="space-y-1">
                    <span className="text-xs font-normal text-slate-500 block">Pháp lý & Sang tên</span>
                    <p className="text-sm font-bold text-emerald-700 flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                      {listing.legalStatus ? `${listing.legalStatus} · Sang tên ngay` : 'Sổ đỏ chính chủ · Sang tên ngay'}
                    </p>
                  </div>

                  {/* Quy hoạch sử dụng */}
                  <div className="space-y-1">
                    <span className="text-xs font-normal text-slate-500 block">Quy hoạch sử dụng</span>
                    <p className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                      <Layers className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      {listing.planningZone || 'Đất ở đô thị'}
                    </p>
                  </div>

                  {/* Năm quy hoạch */}
                  <div className="space-y-1">
                    <span className="text-xs font-normal text-slate-500 block">Năm quy hoạch</span>
                    <p className="text-sm font-semibold text-slate-900">
                      Đến năm {listing.planningYear || 2030}
                    </p>
                  </div>
                </div>

                {/* Cam kết pháp lý & sang tên */}
                <div className="mt-4 rounded-xl bg-emerald-50/80 border border-emerald-200/80 p-3.5 flex items-start sm:items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white font-black shadow-sm">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div className="text-xs min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-extrabold text-emerald-950">
                        Cam kết pháp lý chuẩn 100% · Sẵn sàng công chứng sang tên ngay
                      </p>
                      <span className="inline-flex px-2 py-0.5 rounded-full bg-emerald-200/80 text-emerald-900 text-[10px] font-extrabold uppercase">
                        Đã thẩm định
                      </span>
                    </div>
                    <p className="text-emerald-800/90 text-[11px] mt-0.5">
                      Hồ sơ sổ đỏ/sổ hồng hoàn thiện, không tranh chấp, không vướng quy hoạch treo, bảo đảm giao dịch an toàn và hoàn tất thủ tục chuyển nhượng nhanh chóng.
                    </p>
                  </div>
                </div>
              </div>

              {/* Phần mô tả chi tiết */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm space-y-3">
                <h3 className="text-base font-bold text-slate-900">Mô tả chi tiết</h3>

                <div className="relative">
                  <p
                    className={`text-[14px] sm:text-[15px] leading-[1.65] text-slate-700 whitespace-pre-line ${
                      !isDescriptionExpanded ? 'line-clamp-5' : ''
                    }`}
                  >
                    {listing.description ||
                      `Cần bán gấp bất động sản toạ lạc tại vị trí cực đẹp ${listing.address}.
                      - Diện tích ${listing.area}m², mặt tiền rộng, thoáng trước sau.
                      - Giao thông thuận tiện kết nối các trục đường huyết mạch quận ${listing.district}.
                      - Khu dân trí cao, an ninh tốt, tiện ích xung quanh đầy đủ: trường học, siêu thị, bệnh viện.
                      - Sổ đỏ chính chủ, pháp lý minh bạch sẵn sàng sang tên ngay.`}
                  </p>

                  {/* Gradient fade khi thu gọn */}
                  {!isDescriptionExpanded && (
                    <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                  )}
                </div>

                {/* Nút Xem thêm / Thu gọn */}
                <button
                  onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700 transition-colors pt-1"
                >
                  <span>{isDescriptionExpanded ? 'Thu gọn nội dung' : 'Xem thêm mô tả'}</span>
                  {isDescriptionExpanded ? (
                    <ChevronUp className="h-3.5 w-3.5" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>

              {/* ── TIỆN ÍCH & DỊCH VỤ XUNG QUANH BẤT ĐỘNG SẢN (ĐỊNH VỊ GOOGLE MAPS) ── */}
              <PropertyAmenities
                district={listing.district}
                lat={listing.lat || 21.0280}
                lng={listing.lng || 105.8350}
                listingAddress={listing.address}
              />

            </div>

            {/* Cột phải (lg:col-span-5): Bản đồ vị trí & Quy hoạch khu vực */}
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-orange-500" />
                    <span>Vị trí & Quy hoạch khu vực</span>
                  </h4>
                  <Link
                    href={`/search?district=${encodeURIComponent(listing.district)}`}
                    className="text-xs font-semibold text-orange-600 hover:text-orange-700 transition-colors flex items-center gap-0.5"
                  >
                    <span>Xem bản đồ lớn</span>
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>

                {/* Bản đồ định vị */}
                <div className="overflow-hidden rounded-xl border border-slate-100">
                  <ListingDetailMap
                    lat={listing.lat || 21.0285}
                    lng={listing.lng || 105.8542}
                    title={listing.title}
                    address={listing.address}
                    price={listing.price}
                    district={listing.district}
                    planningZone={listing.planningZone}
                    planningYear={listing.planningYear}
                    height="280px"
                  />
                </div>

                {/* Nút xem nhanh bản đồ hạ tầng & tiện ích Google Maps */}
                <Link
                  href={`/reports/${listing.id}`}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-800 transition-colors border border-orange-200/60 text-xs font-bold shadow-xs"
                >
                  <div className="flex items-center gap-2">
                    <Compass className="h-4 w-4 text-orange-600 shrink-0" />
                    <span>Xem Hạ Tầng & Tiện Ích Google Maps</span>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-orange-600 shrink-0" />
                </Link>

                {/* Bên dưới: Địa chỉ & Action links */}
                <div className="pt-1 space-y-2">
                  <p className="text-xs text-slate-600 flex items-center gap-1.5 truncate">
                    <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{listing.address}</span>
                  </p>

                  <div className="flex items-center justify-between border-t border-slate-100 pt-2 text-xs font-semibold">
                    <Link
                      href={`/search?district=${encodeURIComponent(listing.district)}`}
                      className="text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1"
                    >
                      <Map className="h-3.5 w-3.5 text-slate-400" />
                      <span>Mở bản đồ quy hoạch</span>
                    </Link>
                    <Link
                      href="/planning"
                      className="text-orange-600 hover:text-orange-700 transition-colors flex items-center gap-1"
                    >
                      <span>Tra cứu chi tiết</span>
                      <ChevronRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </section>
      </main>

      {/* ── LIGHTBOX MODAL TOÀN MÀN HÌNH KHI XEM ẢNH ── */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6"
          >
            {/* Top Bar of Modal */}
            <div className="flex items-center justify-between text-white pb-4 border-b border-white/10">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <ImageIcon className="h-4 w-4 text-orange-400" />
                <span>
                  Ảnh {activeImageIndex + 1} / {images.length}
                </span>
                <span className="text-white/40 hidden sm:inline">|</span>
                <span className="text-white/70 text-xs hidden sm:inline truncate max-w-md">
                  {listing.title}
                </span>
              </div>
              <button
                onClick={() => setLightboxOpen(false)}
                className="rounded-full bg-white/10 hover:bg-white/20 p-2 text-white transition-colors"
                title="Đóng (Esc)"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Main Image Area with Previous/Next Controls */}
            <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
              <button
                onClick={prevLightboxImage}
                className="absolute left-2 sm:left-4 z-10 rounded-full bg-black/50 hover:bg-black/80 text-white p-2.5 sm:p-3 transition-colors backdrop-blur-sm"
                title="Ảnh trước"
              >
                <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>

              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImageIndex}
                  src={images[activeImageIndex]}
                  alt={`Slide-${activeImageIndex}`}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.2 }}
                  className="max-h-[75vh] max-w-full rounded-xl object-contain shadow-2xl"
                />
              </AnimatePresence>

              <button
                onClick={nextLightboxImage}
                className="absolute right-2 sm:right-4 z-10 rounded-full bg-black/50 hover:bg-black/80 text-white p-2.5 sm:p-3 transition-colors backdrop-blur-sm"
                title="Ảnh sau"
              >
                <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </div>

            {/* Bottom Thumbnail Bar */}
            <div className="flex justify-center gap-2 overflow-x-auto py-2 border-t border-white/10 no-scrollbar">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative h-12 w-16 sm:h-14 sm:w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                    activeImageIndex === idx
                      ? 'border-orange-500 scale-105 opacity-100 shadow-md'
                      : 'border-transparent opacity-50 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`mini-${idx}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
