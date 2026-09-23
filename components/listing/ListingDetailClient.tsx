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

        {/* ── 1. GALLERY ẢNH (ƯU TIÊN CAO NHẤT) ── */}
        <section className="mb-6">
          {/* Desktop & Tablet Gallery Layout (70% main left + 30% side right) */}
          <div className="hidden md:flex gap-2.5 h-[380px] lg:h-[450px] w-full">
            {/* Ảnh 1: Ảnh chính chiếm 70% chiều rộng */}
            <div
              onClick={() => openLightbox(0)}
              className={`relative overflow-hidden rounded-2xl cursor-pointer group bg-slate-900 ${
                images.length === 1 ? 'w-full' : 'w-[70%]'
              }`}
            >
              <img
                src={images[0]}
                alt={listing.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5">
                <ImageIcon className="h-3.5 w-3.5" />
                <span>Xem ảnh lớn</span>
              </div>
            </div>

            {/* Cột ảnh phụ chiếm 30% chiều rộng */}
            {images.length > 1 && (
              <div className="w-[30%] flex flex-col gap-2.5 h-full">
                {/* Trường hợp 2 ảnh: Chỉ có 1 ảnh phụ (100% height cột phụ) */}
                {images.length === 2 && (
                  <div
                    onClick={() => openLightbox(1)}
                    className="relative h-full w-full overflow-hidden rounded-2xl cursor-pointer group bg-slate-900"
                  >
                    <img
                      src={images[1]}
                      alt="Ảnh phụ 1"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors" />
                  </div>
                )}

                {/* Trường hợp 3 ảnh: Có 2 ảnh phụ (mỗi ảnh 50% trừ gap) */}
                {images.length === 3 && (
                  <>
                    <div
                      onClick={() => openLightbox(1)}
                      className="relative h-[calc(50%-5px)] w-full overflow-hidden rounded-xl cursor-pointer group bg-slate-900"
                    >
                      <img
                        src={images[1]}
                        alt="Ảnh phụ 1"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors" />
                    </div>
                    <div
                      onClick={() => openLightbox(2)}
                      className="relative h-[calc(50%-5px)] w-full overflow-hidden rounded-xl cursor-pointer group bg-slate-900"
                    >
                      <img
                        src={images[2]}
                        alt="Ảnh phụ 2"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors" />
                    </div>
                  </>
                )}

                {/* Trường hợp 4 ảnh hoặc nhiều hơn: Cột phụ chia đều 3 ảnh (Ảnh 2, 3, 4) */}
                {images.length >= 4 && (
                  <>
                    {/* Ảnh 2: nhỏ bên phải phía trên */}
                    <div
                      onClick={() => openLightbox(1)}
                      className="relative h-[calc(33.333%-7px)] w-full overflow-hidden rounded-xl cursor-pointer group bg-slate-900"
                    >
                      <img
                        src={images[1]}
                        alt="Ảnh phụ 1"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors" />
                    </div>

                    {/* Ảnh 3: nhỏ bên phải ở giữa */}
                    <div
                      onClick={() => openLightbox(2)}
                      className="relative h-[calc(33.333%-7px)] w-full overflow-hidden rounded-xl cursor-pointer group bg-slate-900"
                    >
                      <img
                        src={images[2]}
                        alt="Ảnh phụ 2"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors" />
                    </div>

                    {/* Ảnh 4: nhỏ bên phải phía dưới + overlay nếu > 4 ảnh */}
                    <div
                      onClick={() => openLightbox(3)}
                      className="relative h-[calc(33.333%-7px)] w-full overflow-hidden rounded-xl cursor-pointer group bg-slate-900"
                    >
                      <img
                        src={images[3]}
                        alt="Ảnh phụ 3"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                      
                      {remainingImagesCount > 0 ? (
                        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[1px] flex flex-col items-center justify-center text-white transition-colors group-hover:bg-slate-950/70">
                          <span className="text-base lg:text-lg font-bold">+{remainingImagesCount} ảnh</span>
                          <span className="text-[11px] text-slate-200 mt-0.5">Xem tất cả</span>
                        </div>
                      ) : (
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors" />
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Mobile Gallery Layout (Single hero image + horizontal thumbnail scroller) */}
          <div className="block md:hidden space-y-2.5">
            <div
              onClick={() => openLightbox(mobileSelectedImageIndex)}
              className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-slate-900 shadow-sm cursor-pointer"
            >
              <img
                src={images[mobileSelectedImageIndex] || images[0]}
                alt={listing.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute bottom-3 right-3 bg-black/65 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1">
                <ImageIcon className="h-3 w-3" />
                <span>
                  {mobileSelectedImageIndex + 1}/{images.length} ảnh
                </span>
              </div>
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setMobileSelectedImageIndex(idx)}
                    className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                      mobileSelectedImageIndex === idx
                        ? 'border-orange-500 opacity-100 shadow-sm'
                        : 'border-transparent opacity-65 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`thumb-${idx}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── 3. LAYOUT TOÀN TRANG: MAIN CONTENT (68%) & SIDEBAR (32%) ── */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          
          {/* ════════════ MAIN CONTENT (68-70%) ════════════ */}
          <div className="w-full lg:w-[68%] space-y-6">
            
            {/* ── 2. HEADER THÔNG TIN BÀI ĐĂNG ── */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm space-y-3.5">
              {/* Badge trạng thái */}
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

              {/* Tiêu đề: 24-28px desktop, font-weight 700, max 2 lines */}
              <h1 className="text-xl sm:text-2xl lg:text-[26px] font-bold text-slate-900 tracking-tight leading-snug line-clamp-2">
                {listing.title}
              </h1>

              {/* Giá + thông tin chính (Nổi bật, không dùng cam quá mạnh) */}
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 pt-0.5">
                <span className="text-2xl lg:text-3xl font-black text-rose-600 tracking-tight">
                  {formatCurrencyVND(listing.price)}
                </span>
                <span className="text-sm font-semibold text-slate-500">
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

              {/* Địa chỉ: icon location nhỏ, màu xám xanh */}
              <div className="flex items-center gap-1.5 text-sm text-slate-600 font-medium pt-1">
                <MapPin className="h-4 w-4 text-slate-500 shrink-0" />
                <span>{listing.address}</span>
              </div>

              {/* Các thông số cơ bản: 1 hàng rõ ràng, khoảng cách đều nhau */}
              <div className="pt-3 border-t border-slate-100">
                <div className="hidden sm:flex items-center gap-4 text-sm text-slate-700 font-medium">
                  <span className="font-semibold text-slate-900">{listing.area} m²</span>
                  <span className="text-slate-300">|</span>
                  <span className="font-semibold text-slate-900">{listing.floors} tầng</span>
                  <span className="text-slate-300">|</span>
                  <span className="font-semibold text-slate-900">{listing.bedrooms} PN</span>
                  <span className="text-slate-300">|</span>
                  <span className="font-semibold text-slate-900">{listing.bathrooms} PT</span>
                  {listing.direction && (
                    <>
                      <span className="text-slate-300">|</span>
                      <span className="text-slate-600">
                        Hướng <strong className="text-slate-900 font-semibold">{listing.direction}</strong>
                      </span>
                    </>
                  )}
                  {listing.legalStatus && (
                    <>
                      <span className="text-slate-300">|</span>
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        {listing.legalStatus} · Sang tên ngay
                      </span>
                    </>
                  )}
                </div>

                {/* Mobile 2-column specs */}
                <div className="grid grid-cols-2 sm:hidden gap-2 text-xs font-medium text-slate-700">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                    <span className="text-slate-500">Diện tích</span>
                    <span className="font-bold text-slate-900">{listing.area} m²</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                    <span className="text-slate-500">Số tầng</span>
                    <span className="font-bold text-slate-900">{listing.floors} tầng</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                    <span className="text-slate-500">Phòng ngủ</span>
                    <span className="font-bold text-slate-900">{listing.bedrooms} PN</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                    <span className="text-slate-500">Phòng tắm</span>
                    <span className="font-bold text-slate-900">{listing.bathrooms} PT</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── 8. AI / QUY HOẠCH BANNER (GIẢM NỔI BẬT ĐỂ KHÔNG TRANH CHẤP VỚI GỌI NGAY) ── */}
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

            {/* ── 6. ĐẶC ĐIỂM BẤT ĐỘNG SẢN (INFORMATION GRID HIỆN ĐẠI) ── */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900">Đặc điểm bất động sản</h3>
              
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

              {/* Khẳng định cam kết pháp lý & sang tên */}
              <div className="mt-5 rounded-xl bg-emerald-50/80 border border-emerald-200/80 p-3.5 flex items-start sm:items-center gap-3">
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

            {/* ── 7. PHẦN MÔ TẢ CHI TIẾT ── */}
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

                {/* Gradient fade when collapsed */}
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

          </div>

          {/* ════════════ SIDEBAR (30-32%) ════════════ */}
          <div className="w-full lg:w-[32%] space-y-6 lg:sticky lg:top-24">
            
            {/* ── 4. CARD MÔI GIỚI (GỌN GÀNG, CAO CẤP) ── */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
              {/* Avatar + Tên + Chức vụ + Trạng thái online */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={mockUser.avatar}
                    alt={mockUser.name}
                    className="h-13 w-13 rounded-full object-cover ring-2 ring-slate-100 border border-slate-200"
                  />
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-base font-bold text-slate-900 truncate">{mockUser.name}</h4>
                  <p className="text-xs text-slate-500 font-medium truncate">
                    Chuyên viên BĐS {listing.district}
                  </p>
                  <div className="mt-0.5 inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Đang trực tuyến</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Primary CTA "Gọi ngay" (cam) & Secondary "Nhắn tin" */}
              <div className="space-y-2 pt-1">
                <a
                  href="tel:0988123456"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 hover:bg-orange-600 py-3 px-4 text-sm font-bold text-white shadow-sm hover:shadow transition-all"
                >
                  <Phone className="h-4 w-4" />
                  <span>Gọi ngay: 0988 123 456</span>
                </a>

                <button
                  onClick={() => addToast('Đã gửi yêu cầu tư vấn đến chuyên viên môi giới!', 'success')}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 py-2.5 px-4 text-xs font-semibold text-slate-700 transition-colors"
                >
                  <Mail className="h-3.5 w-3.5 text-slate-500" />
                  <span>Nhắn tin / Yêu cầu tư vấn</span>
                </button>
              </div>

              {/* Trust Signals nhỏ phía dưới */}
              <div className="border-t border-slate-100 pt-3 space-y-2 text-[11px] text-slate-500">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span className="font-bold text-emerald-700">Khẳng định pháp lý sạch 100% · Sẵn sàng sang tên ngay</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>Thông tin quy hoạch được xác thực số hóa</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>Cam kết không thu phí người mua</span>
                </div>
              </div>
            </div>

            {/* ── 5. CARD BẢN ĐỒ (VỊ TRÍ & QUY HOẠCH KHU VỰC) ── */}
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

              {/* Bản đồ chiếm phần lớn card */}
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
