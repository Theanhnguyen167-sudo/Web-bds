'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import FloatingContactWidget from '@/components/contact/FloatingContactWidget';
import BookingModal from '@/components/contact/BookingModal';
import { useApp } from '@/lib/context/AppContext';
import { mockListings, mockUser, ListingItem } from '@/lib/mock-data';
import PropertyAmenities from '@/components/listing/PropertyAmenities';
import { formatCurrencyVND, formatPricePerM2, getOptimizedImageUrl } from '@/lib/utils';
import { getListingSiloData } from '@/lib/listing-slug';
import { ListingCard } from '@/components/listing/ListingCard';
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

interface SellerContactCardProps {
  sellerAvatar: string;
  sellerName: string;
  sellerPhone: string;
  cleanSellerPhone: string;
  district?: string;
  onOpenBookingModal: () => void;
  className?: string;
}

function SellerContactCard({
  sellerAvatar,
  sellerName,
  sellerPhone,
  cleanSellerPhone,
  district,
  onOpenBookingModal,
  className = '',
}: SellerContactCardProps) {
  const [isCommitmentExpanded, setIsCommitmentExpanded] = useState(false);

  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] space-y-4 max-h-[calc(100vh-6.5rem)] overflow-y-auto no-scrollbar ${className}`}
    >
      {/* A. THÔNG TIN NGƯỜI BÁN */}
      <div className="flex items-start gap-3.5">
        {/* Ảnh đại diện hình tròn bên trái + Chấm trạng thái trực tuyến */}
        <div className="relative shrink-0">
          <img
            src={sellerAvatar}
            alt={sellerName}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover ring-2 ring-slate-100 border border-slate-200/90 shadow-2xs"
          />
          <span
            className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-white"
            title="Đang trực tuyến"
          />
        </div>

        {/* Thông tin người bán bên phải */}
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-center justify-between gap-1.5 flex-wrap">
            <h3 className="text-base sm:text-[17px] font-bold text-[#172B4D] tracking-tight truncate">
              {sellerName}
            </h3>
            <span className="inline-flex items-center gap-1 text-[10.5px] font-medium text-emerald-700 bg-emerald-50/90 border border-emerald-200/60 px-2 py-0.5 rounded-full shrink-0">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Trực tuyến
            </span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold bg-amber-50 text-amber-800 border border-amber-200/70 px-2 py-0.5 rounded-md">
              <Award className="h-3 w-3 text-amber-600" />
              Môi giới uy tín
            </span>
          </div>

          <p className="text-xs text-[#64748B] font-medium line-clamp-1">
            Chuyên viên tư vấn BĐS · Phụ trách {district || 'Hà Nội'}
          </p>

          <div className="flex items-center gap-1.5 pt-0.5 text-xs text-[#64748B]">
            <div className="flex items-center text-amber-500 font-semibold gap-0.5">
              <Star className="h-3.5 w-3.5 fill-amber-400" />
              <span>4.9 / 5.0</span>
            </div>
            <span className="text-slate-300">·</span>
            <span>52 giao dịch</span>
          </div>
        </div>
      </div>

      {/* B. PHẦN CHỈ SỐ UY TÍN (3 CỘT) */}
      <div className="grid grid-cols-3 divide-x divide-slate-100 rounded-xl bg-slate-50/80 border border-slate-100 py-2.5 px-1 sm:px-2 text-center">
        <div className="px-1 space-y-0.5">
          <span className="text-[11px] text-[#64748B] font-medium block">Tin đã đăng</span>
          <span className="text-xs sm:text-sm font-bold text-[#172B4D] block">18+ tin</span>
        </div>
        <div className="px-1 space-y-0.5">
          <span className="text-[11px] text-[#64748B] font-medium block">Tỷ lệ phản hồi</span>
          <span className="text-xs sm:text-sm font-bold text-emerald-600 block">100%</span>
        </div>
        <div className="px-1 space-y-0.5">
          <span className="text-[11px] text-[#64748B] font-medium block">Phản hồi</span>
          <span className="text-xs sm:text-sm font-bold text-[#F97316] block">&lt; 5 phút</span>
        </div>
      </div>

      {/* C. CÁC NÚT LIÊN HỆ */}
      <div className="space-y-2">
        {/* Nút Gọi ngay - CTA chính */}
        <a
          href={`tel:${cleanSellerPhone}`}
          className="w-full h-11 sm:h-12 flex items-center justify-center gap-2 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-sm sm:text-base shadow-sm hover:shadow-md transition-all active:scale-[0.99]"
        >
          <Phone className="h-4.5 w-4.5" />
          <span>Gọi ngay: {sellerPhone}</span>
        </a>

        {/* Nút CTA phụ (Zalo + Hẹn xem nhà) */}
        <div className="grid grid-cols-2 gap-2">
          <a
            href={`https://zalo.me/${cleanSellerPhone}`}
            target="_blank"
            rel="noopener noreferrer"
            className="h-10 sm:h-11 flex items-center justify-center gap-1.5 rounded-xl bg-[#0068FF] hover:bg-[#0055d4] text-white text-xs sm:text-sm font-semibold shadow-2xs transition-colors"
          >
            <MessageSquare className="h-4 w-4" />
            <span>Chat qua Zalo</span>
          </a>

          <button
            type="button"
            onClick={onOpenBookingModal}
            className="h-10 sm:h-11 flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-[#172B4D] text-xs sm:text-sm font-semibold shadow-2xs transition-colors cursor-pointer"
            title="Đặt lịch hẹn xem nhà trực tiếp với người bán"
          >
            <Calendar className="h-4 w-4 text-[#F97316]" />
            <span>Hẹn xem nhà</span>
          </button>
        </div>
      </div>

      {/* D. PHẦN CAM KẾT NGƯỜI BÁN */}
      <div className="rounded-xl bg-[#F0FDF4] border border-emerald-100 p-3 space-y-2 text-xs">
        <div
          className="flex items-center justify-between font-bold text-emerald-900 cursor-pointer select-none"
          onClick={() => setIsCommitmentExpanded(!isCommitmentExpanded)}
        >
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
            <span className="text-xs font-bold text-emerald-900">Cam kết người bán</span>
          </div>
          <button
            type="button"
            className="text-emerald-700 hover:text-emerald-900 p-0.5 rounded transition-colors"
            aria-label={isCommitmentExpanded ? 'Thu gọn' : 'Xem thêm'}
          >
            {isCommitmentExpanded ? (
              <ChevronUp className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
          </button>
        </div>

        <ul className="space-y-1.5 text-[11.5px] text-[#64748B] leading-relaxed">
          <li className="flex items-start gap-1.5">
            <span className="text-emerald-500 font-bold mt-0.5">•</span>
            <span>Bất động sản chính chủ, hình ảnh & vị trí thực tế 100%.</span>
          </li>
          <li className="flex items-start gap-1.5">
            <span className="text-emerald-500 font-bold mt-0.5">•</span>
            <span>Dẫn xem nhà trực tiếp miễn phí, không phát sinh phụ phí.</span>
          </li>
          {isCommitmentExpanded && (
            <li className="flex items-start gap-1.5 pt-1 border-t border-emerald-100/70">
              <span className="text-emerald-500 font-bold mt-0.5">•</span>
              <span>Hỗ trợ thủ tục pháp lý, kiểm tra quy hoạch và sang tên sổ đỏ.</span>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

const POPULAR_DISTRICTS = [
  { slug: 'dong-da', name: 'Đống Đa' },
  { slug: 'cau-giay', name: 'Cầu Giấy' },
  { slug: 'ba-dinh', name: 'Ba Đình' },
  { slug: 'thanh-xuan', name: 'Thanh Xuân' },
  { slug: 'tay-ho', name: 'Tây Hồ' },
  { slug: 'hai-ba-trung', name: 'Hai Bà Trưng' },
  { slug: 'nam-tu-liem', name: 'Nam Từ Liêm' },
  { slug: 'hoan-kiem', name: 'Hoàn Kiếm' },
  { slug: 'long-bien', name: 'Long Biên' },
];

const SILO_PROPERTY_TYPES = [
  { slug: 'nha-pho', name: 'Nhà phố' },
  { slug: 'chung-cu', name: 'Chung cư' },
  { slug: 'biet-thu', name: 'Biệt thự' },
  { slug: 'dat-nen', name: 'Đất nền' },
  { slug: 'nha-mat-pho', name: 'Nhà mặt phố' },
];

interface ListingDetailClientProps {
  listingId: string;
  initialListing?: ListingItem | null;
}

export default function ListingDetailClient({ listingId, initialListing }: ListingDetailClientProps) {
  const router = useRouter();
  const { user, listings, savedListingIds, toggleSaveListing, addToast } = useApp();

  const [activeListing, setActiveListing] = useState<ListingItem | null>(() => {
    if (initialListing) return initialListing;
    const found = listings.find((l) => l.id === listingId) || mockListings.find((l) => l.id === listingId);
    if (found) return found;
    return null;
  });

  const [isLoading, setIsLoading] = useState<boolean>(!activeListing);

  // Đồng bộ và tải chi tiết bài đăng từ API nếu chưa có sẵn
  useEffect(() => {
    // 1. Kiểm tra trong listings từ context
    const foundInListings = listings.find((l) => l.id === listingId);
    if (foundInListings) {
      setActiveListing(foundInListings);
      setIsLoading(false);
      return;
    }

    // 2. Kiểm tra initialListing từ server
    if (initialListing && initialListing.id === listingId) {
      setActiveListing(initialListing);
      setIsLoading(false);
      return;
    }

    // 3. Tự động fetch từ API /api/listings/[id]
    let isMounted = true;
    setIsLoading(true);

    fetch(`/api/listings/${listingId}`)
      .then((res) => res.json())
      .then((json) => {
        if (!isMounted) return;
        if (json.success && json.data) {
          setActiveListing(json.data);
        } else {
          // Thử tìm trong mockListings
          const mockFound = mockListings.find((m) => m.id === listingId);
          if (mockFound) {
            setActiveListing(mockFound);
          }
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.warn('Lỗi khi fetch chi tiết tin đăng:', err);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [listingId, listings, initialListing]);

  // Luôn tự động cuộn lên đầu trang khi mở trang chi tiết bất động sản mới (ngoại trừ khi bấm Quay lại)
  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('hanoi_bds_is_popstate') === '1') {
      return;
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [listingId]);

  const rawListing =
    activeListing ||
    initialListing ||
    listings.find((l) => l.id === listingId) ||
    mockListings.find((l) => l.id === listingId) ||
    (isLoading ? null : (listings[0] || mockListings[0]));

  const listing: ListingItem = {
    id: rawListing?.id || listingId,
    title: rawListing?.title || 'Bất động sản Hà Nội',
    price: typeof rawListing?.price === 'number' && !isNaN(rawListing.price) ? rawListing.price : 8500000000,
    area: typeof rawListing?.area === 'number' && !isNaN(rawListing.area) ? rawListing.area : 75,
    pricePerM2: Math.round((typeof rawListing?.price === 'number' ? rawListing.price : 8500000000) / (typeof rawListing?.area === 'number' && rawListing.area > 0 ? rawListing.area : 75)),
    address: rawListing?.address || `${rawListing?.district || 'Cầu Giấy'}, Hà Nội`,
    district: rawListing?.district || 'Cầu Giấy',
    ward: rawListing?.ward || '',
    type: (rawListing?.type as any) || 'house',
    description: rawListing?.description || '',
    images: Array.isArray(rawListing?.images) && rawListing.images.length > 0
      ? rawListing.images
      : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80'],
    lat: typeof rawListing?.lat === 'number' && !isNaN(rawListing.lat) && rawListing.lat !== 0 ? rawListing.lat : 21.0285,
    lng: typeof rawListing?.lng === 'number' && !isNaN(rawListing.lng) && rawListing.lng !== 0 ? rawListing.lng : 105.8542,
    planningZone: rawListing?.planningZone || 'Đất ở đô thị',
    planningYear: rawListing?.planningYear || 2030,
    bedrooms: typeof rawListing?.bedrooms === 'number' ? rawListing.bedrooms : 3,
    bathrooms: typeof rawListing?.bathrooms === 'number' ? rawListing.bathrooms : 2,
    floors: typeof rawListing?.floors === 'number' ? rawListing.floors : 4,
    direction: rawListing?.direction || 'Đông Nam',
    legalStatus: rawListing?.legalStatus || 'Sổ đỏ chính chủ',
    isFeatured: Boolean(rawListing?.isFeatured),
    status: (rawListing?.status as any) || 'active',
    views: rawListing?.views || 150,
    createdAt: rawListing?.createdAt || '2026-09-20',
    userId: rawListing?.userId,
    authorName: rawListing?.authorName,
    authorPhone: rawListing?.authorPhone,
    authorAvatar: rawListing?.authorAvatar,
    authorEmail: rawListing?.authorEmail,
    purpose: (rawListing?.purpose as any) || 'sale',
    slug: rawListing?.slug,
    city: rawListing?.city || 'Hà Nội',
  };

  // Cấu trúc phân cấp dữ liệu Silo động cho Breadcrumb và URL chuẩn SEO
  const silo = getListingSiloData(listing);

  // 1. Lọc và xếp hạng BĐS tương tự theo Semantic Silo:
  // Tiêu chí ưu tiên: cùng mục đích giao dịch, cùng loại BĐS, cùng khu vực, gần mức giá, gần diện tích
  const similarListings = useMemo(() => {
    const allPool = listings.length > 0 ? listings : mockListings;
    const currentPurpose = listing.purpose || 'sale';
    const currentType = (listing.type || (listing as any).propertyType || 'house').toLowerCase();
    const currentDistrict = (listing.district || '').toLowerCase();
    const currentPrice = listing.price || 0;
    const currentArea = listing.area || 0;

    return allPool
      .filter((item) => item.id !== listing.id && (item.status === 'active' || !item.status))
      .map((candidate) => {
        let score = 0;
        const candidatePurpose = candidate.purpose || 'sale';
        const candidateType = (candidate.type || candidate.propertyType || 'house').toLowerCase();
        const candidateDistrict = (candidate.district || '').toLowerCase();

        // 1. Cùng mục đích giao dịch (mua bán hoặc cho thuê)
        if (candidatePurpose === currentPurpose) {
          score += 100;
        }

        // 2. Cùng loại BĐS (nhà phố, chung cư, biệt thự...)
        if (candidateType === currentType) {
          score += 60;
        }

        // 3. Cùng khu vực (quận/huyện)
        if (
          currentDistrict &&
          candidateDistrict &&
          (candidateDistrict.includes(currentDistrict) || currentDistrict.includes(candidateDistrict))
        ) {
          score += 50;
        }

        // 4. Gần mức giá (chênh lệch phần trăm)
        if (currentPrice > 0 && candidate.price > 0) {
          const priceDiffRatio = Math.abs(candidate.price - currentPrice) / currentPrice;
          if (priceDiffRatio <= 0.2) score += 30;
          else if (priceDiffRatio <= 0.4) score += 20;
          else if (priceDiffRatio <= 0.7) score += 10;
          else if (priceDiffRatio <= 1.2) score += 5;
        }

        // 5. Gần diện tích (chênh lệch phần trăm)
        if (currentArea > 0 && candidate.area > 0) {
          const areaDiffRatio = Math.abs(candidate.area - currentArea) / currentArea;
          if (areaDiffRatio <= 0.2) score += 20;
          else if (areaDiffRatio <= 0.4) score += 12;
          else if (areaDiffRatio <= 0.7) score += 6;
        }

        return { candidate, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((item) => item.candidate);
  }, [listing, listings]);

  // 2. Lọc các loại hình BĐS khác tại cùng quận (loại trừ loại hiện tại)
  const otherTypesInDistrict = useMemo(() => {
    return SILO_PROPERTY_TYPES.filter((t) => t.slug !== silo.propertyTypeSlug).slice(0, 4);
  }, [silo.propertyTypeSlug]);

  // 3. Lọc các quận lân cận cho cùng loại hình BĐS (loại trừ quận hiện tại)
  const nearbyDistricts = useMemo(() => {
    return POPULAR_DISTRICTS.filter((d) => d.slug !== silo.districtSlug).slice(0, 5);
  }, [silo.districtSlug]);

  // Đồng bộ thông tin người đăng bán với tài khoản đăng nhập:
  const isOwner = Boolean(
    user && (listing.userId === user.id || listing.authorEmail === user.email)
  );

  const hasOtherSpecificAuthor = Boolean(
    listing.userId && user && listing.userId !== user.id && (listing.authorAvatar || (listing as any).users?.avatar_url)
  );

  const rawSellerAvatar =
    (hasOtherSpecificAuthor
      ? (listing.authorAvatar || (listing as any).users?.avatar_url)
      : (user?.avatar || listing.authorAvatar || (listing as any).users?.avatar_url || mockUser.avatar)
    );

  const rawSellerName =
    (hasOtherSpecificAuthor
      ? (listing.authorName || (listing as any).users?.full_name)
      : (user?.name || listing.authorName || (listing as any).users?.full_name || mockUser.name)
    );

  const rawSellerPhone =
    (hasOtherSpecificAuthor
      ? (listing.authorPhone || (listing as any).users?.phone)
      : (user?.phone || listing.authorPhone || (listing as any).users?.phone || mockUser.phone)
    );

  const sellerAvatar =
    rawSellerAvatar ||
    mockUser.avatar ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80';
  const sellerName = rawSellerName || 'Chuyên viên BĐS Hà Nội';
  const sellerPhone = rawSellerPhone || '0988 123 456';
  const cleanSellerPhone = (sellerPhone || '0988123456').replace(/\s+/g, '');

  const images: string[] = listing.images && listing.images.length > 0
    ? listing.images
    : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80'];

  // Lightbox State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Mobile selected preview
  const [mobileSelectedImageIndex, setMobileSelectedImageIndex] = useState(0);

  // Description expand state (mặc định mở rộng để người dùng luôn đọc được toàn bộ nội dung chi tiết)
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(true);

  // AI Report Generation state
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [currentStepProgress, setCurrentStepProgress] = useState(0);

  // Booking Modal State (Hẹn xem nhà)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

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
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-medium text-slate-500 overflow-x-auto no-scrollbar whitespace-nowrap py-1">
            <Link href="/" className="hover:text-slate-900 transition-colors flex items-center gap-1 shrink-0">
              <Home className="h-3.5 w-3.5 text-slate-400" />
              <span>Trang chủ</span>
            </Link>
            <ChevronRight className="h-3 w-3 text-slate-400 shrink-0" />
            <Link
              href={`/${silo.transactionType}`}
              className="hover:text-slate-900 transition-colors shrink-0"
            >
              {silo.transactionName} BĐS
            </Link>
            <ChevronRight className="h-3 w-3 text-slate-400 shrink-0" />
            <Link
              href={`/${silo.transactionType}/${silo.propertyTypeSlug}`}
              className="hover:text-slate-900 transition-colors shrink-0"
            >
              {silo.propertyTypeName}
            </Link>
            <ChevronRight className="h-3 w-3 text-slate-400 shrink-0" />
            <Link
              href={`/${silo.transactionType}/${silo.propertyTypeSlug}/${silo.districtSlug}`}
              className="hover:text-slate-900 transition-colors shrink-0"
            >
              {silo.district}
            </Link>
            <ChevronRight className="h-3 w-3 text-slate-400 shrink-0" />
            <Link
              href={silo.url}
              aria-current="page"
              className="text-slate-800 font-semibold truncate max-w-[180px] sm:max-w-[260px] md:max-w-[360px] hover:text-orange-600 transition-colors shrink-0"
              title={listing.title}
            >
              {listing.title}
            </Link>
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
          {/* Badge phân khu, quy hoạch & Liên kết chuẩn Semantic Silo */}
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

            {/* 1. Liên kết Loại BĐS trong Semantic Silo */}
            <Link
              href={`/${silo.transactionType}/${silo.propertyTypeSlug}`}
              className="inline-flex items-center gap-1 rounded-md bg-orange-50 hover:bg-orange-100 px-2.5 py-1 text-xs font-semibold text-orange-700 border border-orange-200/80 transition-colors"
              title={`Xem tất cả tin ${silo.propertyTypeName}`}
            >
              <Building className="h-3 w-3 text-orange-600" />
              <span>{silo.propertyTypeName}</span>
            </Link>

            {/* 2. Liên kết Khu vực trong Semantic Silo */}
            <Link
              href={`/${silo.transactionType}/${silo.propertyTypeSlug}/${silo.districtSlug}`}
              className="inline-flex items-center gap-1 rounded-md bg-slate-100 hover:bg-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 border border-slate-200 transition-colors"
              title={`Xem ${silo.propertyTypeName} tại ${silo.district}`}
            >
              <MapPin className="h-3 w-3 text-slate-500" />
              <span>{silo.district}</span>
            </Link>
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

          {/* Địa chỉ bài đăng với liên kết Semantic Silo khu vực */}
          <div className="flex items-center gap-2 text-sm sm:text-base text-slate-700 font-medium">
            <MapPin className="h-4 w-4 text-orange-500 shrink-0" />
            <span>
              {listing.district && listing.address.includes(listing.district) ? (
                <>
                  {listing.address.split(listing.district)[0]}
                  <Link
                    href={`/${silo.transactionType}/${silo.propertyTypeSlug}/${silo.districtSlug}`}
                    className="text-slate-900 font-bold hover:text-orange-600 transition-colors underline underline-offset-4 decoration-slate-300 hover:decoration-orange-500"
                    title={`Xem ${silo.propertyTypeName} tại ${silo.district}`}
                  >
                    {listing.district}
                  </Link>
                  {listing.address.split(listing.district)[1]}
                </>
              ) : (
                listing.address
              )}
            </span>
          </div>
        </div>

        {/* ════════════ BỐ CỤC CHÍNH 2 CỘT: CHI TIẾT BÀI ĐĂNG (8 CỘT) & STICKY SIDEBAR LIÊN HỆ (4 CỘT) ════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start mb-10">
          
          {/* ── CỘT TRÁI (lg:col-span-8): TOÀN BỘ NỘI DUNG CHI TIẾT BÀI ĐĂNG ── */}
          <div className="lg:col-span-8 flex flex-col space-y-6 min-w-0">
            {/* 1. KHỐI ẢNH CỦA BÀI ĐĂNG */}
            <div className="flex flex-col gap-3">
              {/* Ảnh lớn chính (LCP Element - Patent 86) */}
              <div
                onClick={() => openLightbox(activeImageIndex)}
                className="relative w-full h-[360px] sm:h-[450px] rounded-2xl overflow-hidden cursor-pointer group bg-slate-950 shadow-md border border-slate-200/80"
              >
                <img
                  src={getOptimizedImageUrl(images[activeImageIndex] || images[0], 1200, 85)}
                  srcSet={`
                    ${getOptimizedImageUrl(images[activeImageIndex] || images[0], 640, 80)} 640w,
                    ${getOptimizedImageUrl(images[activeImageIndex] || images[0], 1024, 85)} 1024w,
                    ${getOptimizedImageUrl(images[activeImageIndex] || images[0], 1440, 85)} 1440w
                  `}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 70vw, 840px"
                  alt={listing.title}
                  // @ts-ignore
                  fetchPriority="high"
                  decoding="async"
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
                  {images.map((img: string, idx: number) => (
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
                        src={getOptimizedImageUrl(img, 240, 75)}
                        alt={`thumb-${idx}`}
                        loading="lazy"
                        decoding="async"
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

            {/* THẺ LIÊN HỆ NGƯỜI BÁN TRÊN THIẾT BỊ DI ĐỘNG (< lg) */}
            <div className="block lg:hidden">
              <SellerContactCard
                sellerAvatar={sellerAvatar}
                sellerName={sellerName}
                sellerPhone={sellerPhone}
                cleanSellerPhone={cleanSellerPhone}
                district={listing.district}
                onOpenBookingModal={() => setIsBookingModalOpen(true)}
              />
            </div>

            {/* 2. BANNER THẨM ĐỊNH QUY HOẠCH & ĐỊNH GIÁ AI */}
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

            {/* 3. ĐẶC ĐIỂM BẤT ĐỘNG SẢN */}
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
                    {listing.floors || 4} tầng
                  </p>
                </div>

                {/* Phòng ngủ / Phòng tắm */}
                <div className="space-y-1">
                  <span className="text-xs font-normal text-slate-500 block">Phòng ngủ / Tắm</span>
                  <p className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                    <Bed className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    {listing.bedrooms || 3} PN / {listing.bathrooms || 2} PT
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

            {/* 4. PHẦN MÔ TẢ CHI TIẾT */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm space-y-3">
              <h3 className="text-base font-bold text-slate-900">Mô tả chi tiết</h3>

              <div className="relative">
                <p
                  className={`text-[14px] sm:text-[15px] leading-[1.65] text-slate-700 whitespace-pre-line ${
                    !isDescriptionExpanded ? 'line-clamp-5' : ''
                  }`}
                >
                  {listing.description && listing.description.trim().length > 15
                    ? listing.description
                    : `${listing.title?.toLowerCase().startsWith('bán') ? listing.title : `Bán ${listing.title || 'bất động sản'}`} vị trí đắc địa tại ${listing.address || listing.district || 'Hà Nội'}.
- Diện tích: ${listing.area}m², mặt tiền rộng thoáng, ô tô đỗ cửa hoặc vào nhà thuận tiện.
- Thiết kế hiện đại ${listing.floors || 4} tầng kiên cố, công năng tối ưu gồm ${listing.bedrooms || 3} phòng ngủ, ${listing.bathrooms || 2} phòng tắm khép kín, phòng khách và bếp sang trọng.
- Vị trí trung tâm quận ${listing.district || 'Hà Nội'}, hạ tầng đồng bộ, gần trường học các cấp, bệnh viện, siêu thị và công viên cây xanh.
- Pháp lý: ${listing.legalStatus || 'Sổ đỏ chính chủ, pháp lý minh bạch'}, sẵn sàng công chứng sang tên ngay trong ngày.
- Phù hợp an cư lâu dài, làm văn phòng công ty hoặc đầu tư cho thuê sinh lời cao.`}
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

            {/* 5. TIỆN ÍCH & DỊCH VỤ XUNG QUANH BẤT ĐỘNG SẢN (ĐỊNH VỊ GOOGLE MAPS) */}
            <PropertyAmenities
              district={listing.district}
              lat={listing.lat || 21.0280}
              lng={listing.lng || 105.8350}
              listingAddress={listing.address}
            />

            {/* 6. VỊ TRÍ & BẢN ĐỒ QUY HOẠCH KHU VỰC */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm space-y-3">
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
                  height="320px"
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

          {/* ── CỘT PHẢI (lg:col-span-4): STICKY SIDEBAR CỐ ĐỊNH KHI CUỘN TRÊN DESKTOP ── */}
          <aside className="hidden lg:block lg:col-span-4 lg:sticky lg:top-24 self-start">
            <SellerContactCard
              sellerAvatar={sellerAvatar}
              sellerName={sellerName}
              sellerPhone={sellerPhone}
              cleanSellerPhone={cleanSellerPhone}
              district={listing.district}
              onOpenBookingModal={() => setIsBookingModalOpen(true)}
            />
          </aside>

        </div>

        {/* ════════════ 3. BĐS TƯƠNG TỰ THEO SEMANTIC SILO ════════════ */}
        {similarListings.length > 0 && (
          <section className="mt-12 pt-8 border-t border-slate-200/80 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Building className="h-5 w-5 text-orange-500" />
                  <span>BĐS tương tự tại {silo.district}</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Các bất động sản {silo.propertyTypeName.toLowerCase()} cùng phân khúc giá và khu vực {silo.district}
                </p>
              </div>

              <Link
                href={`/${silo.transactionType}/${silo.propertyTypeSlug}/${silo.districtSlug}`}
                className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-orange-600 hover:text-orange-700 transition-colors shrink-0 group"
              >
                <span>Xem tất cả {silo.propertyTypeName} {silo.district}</span>
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {similarListings.map((simListing) => (
                <ListingCard key={simListing.id} listing={simListing} />
              ))}
            </div>
          </section>
        )}

        {/* ════════════ 4. CÁC TRANG LIÊN QUAN TRONG CÙNG SEMANTIC SILO ════════════ */}
        <section className="mt-10 pt-8 border-t border-slate-200/80 space-y-6">
          <div className="flex items-center gap-2">
            <Compass className="h-5 w-5 text-orange-500" />
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Khám phá liên quan trong cùng Semantic Silo
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs">
            {/* Cột 1: Các loại hình BĐS khác tại cùng quận */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Bất động sản khác tại {silo.district}
              </h4>
              <div className="flex flex-wrap gap-2">
                {otherTypesInDistrict.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/${silo.transactionType}/${item.slug}/${silo.districtSlug}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-orange-50 text-slate-700 hover:text-orange-700 text-xs font-semibold border border-slate-200/70 hover:border-orange-200 transition-all shadow-xs"
                  >
                    <span>{item.name} tại {silo.district}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Cột 2: Cùng loại BĐS tại các quận lân cận */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {silo.propertyTypeName} tại các quận lân cận
              </h4>
              <div className="flex flex-wrap gap-2">
                {nearbyDistricts.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/${silo.transactionType}/${silo.propertyTypeSlug}/${item.slug}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-orange-50 text-slate-700 hover:text-orange-700 text-xs font-semibold border border-slate-200/70 hover:border-orange-200 transition-all shadow-xs"
                  >
                    <MapPin className="h-3 w-3 text-slate-400" />
                    <span>{silo.propertyTypeName} {item.name}</span>
                  </Link>
                ))}
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
              {images.map((img: string, idx: number) => (
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

      {/* Booking Appointment Modal */}
      <AnimatePresence>
        {isBookingModalOpen && (
          <BookingModal
            agentName={sellerName}
            agentPhone={sellerPhone}
            agentAvatar={sellerAvatar}
            listingTitle={listing.title}
            listingId={listing.id}
            sellerId={listing.ownerId || listing.userId || (listing as any).createdBy}
            sellerEmail={listing.authorEmail}
            onClose={() => setIsBookingModalOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Floating Contact Widget & Appointment Booking */}
      <FloatingContactWidget
        agentPhone={sellerPhone}
        agentName={sellerName}
        agentZalo={sellerPhone}
        listingTitle={listing.title}
        listingId={listing.id}
        sellerId={listing.ownerId || listing.userId || (listing as any).createdBy}
        sellerEmail={listing.authorEmail}
      />
    </div>
  );
}
