'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ListingItem } from '@/lib/mock-data';
import { formatCurrencyVND, formatPricePerM2 } from '@/lib/utils';
import { getListingUrl } from '@/lib/listing-slug';
import { getListingIdentifier } from '@/lib/identification';
import { CodeBadge } from '@/components/common/CodeBadge';
import { LightboxModal } from '@/components/home/LightboxModal';
import { PropertyImage } from '@/components/common/PropertyImage';
import { normalizeListingImages } from '@/lib/listing-images';
import {
  X,
  MapPin,
  Maximize2,
  Building,
  Bed,
  Bath,
  Compass,
  FileText,
  ShieldCheck,
  Heart,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Share2,
  Phone,
  Calendar,
  AlertCircle,
  Clock,
  Layers,
  ArrowRight,
  Sparkles,
  UserCheck,
} from 'lucide-react';

interface SearchDetailPreviewProps {
  listing: ListingItem | null;
  isLoading?: boolean;
  error?: string | null;
  onClose: () => void;
  isSaved?: boolean;
  onSaveToggle?: (id: string) => void;
  isMobile?: boolean;
}

export const SearchDetailPreview: React.FC<SearchDetailPreviewProps> = ({
  listing,
  isLoading,
  error,
  onClose,
  isSaved = false,
  onSaveToggle,
  isMobile = false,
}) => {
  const router = useRouter();
  const [currentImageIdx, setCurrentImageIdx] = useState<number>(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState<boolean>(false);
  const [copyFeedback, setCopyFeedback] = useState<boolean>(false);

  // 1. TRẠNG THÁI ĐANG TẢI (LOADING SKELETON)
  if (isLoading) {
    return (
      <div className="h-full flex flex-col bg-white dark:bg-slate-900 overflow-y-auto p-4 sm:p-6 space-y-5 animate-pulse">
        {/* Header bar skeleton */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="h-5 w-32 bg-slate-200 dark:bg-slate-800 rounded-lg" />
          <div className="h-8 w-8 bg-slate-200 dark:bg-slate-800 rounded-full" />
        </div>
        {/* Photo skeleton */}
        <div className="w-full aspect-video bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        {/* Price & Title skeleton */}
        <div className="space-y-3">
          <div className="h-7 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg" />
          <div className="h-6 w-full bg-slate-200 dark:bg-slate-800 rounded-lg" />
          <div className="h-4 w-2/3 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        </div>
        {/* Specs grid skeleton */}
        <div className="grid grid-cols-3 gap-2.5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-16 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          ))}
        </div>
        {/* CTA skeleton */}
        <div className="h-12 w-full bg-slate-200 dark:bg-slate-800 rounded-xl mt-auto" />
      </div>
    );
  }

  // 2. TRẠNG THÁI KHÔNG TÌM THẤY BĐS HOẶC LỖI (NOT FOUND / ERROR)
  if (error || !listing) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-white dark:bg-slate-900 p-6 sm:p-8 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center text-3xl shadow-inner border border-amber-200/80">
          <AlertCircle className="h-8 w-8" />
        </div>
        <div className="space-y-1.5 max-w-sm">
          <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
            Không tìm thấy thông tin bất động sản
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            {error || 'Bất động sản này không tồn tại trong danh sách, đã giao dịch thành công hoặc đã ngừng hiển thị.'}
          </p>
        </div>
        <div className="flex gap-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs transition-all shadow-md cursor-pointer"
          >
            Quay lại danh sách tìm kiếm
          </button>
        </div>
      </div>
    );
  }

  // 3. DỮ LIỆU BĐS HỢP LỆ
  const images = normalizeListingImages(listing.images);

  const isRent =
    listing.purpose === 'rent' ||
    listing.title?.toLowerCase().includes('cho thuê') ||
    listing.title?.toLowerCase().includes('thuê');

  const basePriceText = formatCurrencyVND(listing.price);
  const displayPrice = isRent ? `${basePriceText}/tháng` : basePriceText;
  const pricePerM2Text = !isRent && listing.area > 0 ? formatPricePerM2(listing.price, listing.area) : null;
  const listingUrl = getListingUrl(listing);

  const isVerified =
    listing.verificationStatus === 'verified' ||
    listing.verificationStatus === 'Đã kiểm tra' ||
    (listing as any).isVerified;

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window !== 'undefined') {
      const fullUrl = `${window.location.origin}${listingUrl}`;
      navigator.clipboard?.writeText(fullUrl);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    }
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIdx((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIdx((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-900 overflow-hidden text-slate-800 dark:text-slate-100">
      {/* ── TOP ACTION BAR ── */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0 z-10">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
            title="Đóng bảng xem trước"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>{isMobile ? 'Đóng' : 'Đóng xem trước'}</span>
          </button>
          <CodeBadge code={getListingIdentifier(listing)} size="sm" showLabel={false} />
        </div>

        <div className="flex items-center gap-2">
          {/* Nút Chia sẻ */}
          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
            title="Sao chép liên kết chia sẻ"
          >
            <Share2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{copyFeedback ? 'Đã chép link!' : 'Chia sẻ'}</span>
          </button>

          {/* Nút Lưu BĐS */}
          {onSaveToggle && (
            <button
              type="button"
              onClick={() => onSaveToggle(listing.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isSaved
                  ? 'bg-rose-50 border border-rose-200 text-rose-600 dark:bg-rose-950/40 dark:border-rose-900'
                  : 'border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
              title={isSaved ? 'Bỏ lưu tin' : 'Lưu bất động sản'}
            >
              <Heart className={`h-3.5 w-3.5 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span className="hidden sm:inline">{isSaved ? 'Đã lưu' : 'Lưu tin'}</span>
            </button>
          )}

          {/* Nút Đóng X */}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Đóng"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* ── SCROLLABLE PREVIEW CONTENT ── */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 space-y-6">
        
        {/* A. BỘ ẢNH BẤT ĐỘNG SẢN (IMAGE GALLERY & CAROUSEL) */}
        <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 group border border-slate-200/80 dark:border-slate-700">
          <PropertyImage
            src={images[currentImageIdx] || null}
            alt={listing.title}
            propertyType={listing.type}
            width={1200}
            quality={85}
            onClick={() => images.length > 0 && setIsLightboxOpen(true)}
            className="transition-transform duration-300"
          />

          {/* Badges trên ảnh */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 pointer-events-none z-10">
            <span
              className={`px-2.5 py-1 rounded-lg text-[11px] font-black tracking-wide uppercase shadow-md ${
                isRent
                  ? 'bg-purple-600 text-white'
                  : 'bg-orange-600 text-white'
              }`}
            >
              {isRent ? 'Cho thuê' : 'Đang bán'}
            </span>

            {isVerified && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-600/95 backdrop-blur-md text-[10.5px] font-bold text-white shadow-md">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Đã kiểm tra thực tế</span>
              </span>
            )}
          </div>

          {/* Bộ đếm ảnh (Image Counter) */}
          {images.length > 0 && (
            <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-[11px] font-bold z-10">
              {currentImageIdx + 1} / {images.length} ảnh
            </div>
          )}

          {/* Nút chuyển ảnh Prev/Next */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 dark:bg-slate-900/90 shadow-md flex items-center justify-center text-slate-700 dark:text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 cursor-pointer"
                title="Ảnh trước"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 dark:bg-slate-900/90 shadow-md flex items-center justify-center text-slate-700 dark:text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 cursor-pointer"
                title="Ảnh tiếp theo"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </>
          )}

          {/* Thumbnail Strip dưới đáy ảnh */}
          {images.length > 1 && (
            <div className="absolute bottom-2.5 inset-x-2.5 flex items-center justify-center gap-1.5 overflow-x-auto py-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIdx(idx);
                  }}
                  className={`w-10 h-7 rounded-md overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                    currentImageIdx === idx
                      ? 'border-orange-500 scale-105 shadow-md'
                      : 'border-white/70 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* B. GIÁ VÀ TIÊU ĐỀ BĐS */}
        <div className="space-y-2">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-2xl sm:text-3xl font-black text-orange-600 dark:text-orange-400 tracking-tight">
              {displayPrice}
            </span>
            {pricePerM2Text && (
              <span className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
                ({pricePerM2Text})
              </span>
            )}
          </div>

          <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-snug">
            {listing.title}
          </h2>

          <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            <MapPin className="h-4 w-4 shrink-0 text-orange-500" />
            <span className="font-medium">
              {listing.address || `${listing.ward ? `${listing.ward}, ` : ''}${listing.district}, Hà Nội`}
            </span>
          </div>
        </div>

        {/* C. THÔNG SỐ CỐT LÕI (SPECS GRID) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
          {/* Diện tích */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center gap-2.5">
            <Maximize2 className="h-4 w-4 text-orange-500 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 font-medium block">Diện tích</span>
              <strong className="font-bold text-slate-900 dark:text-white">
                {listing.area > 0 ? `${listing.area} m²` : 'Chưa cập nhật'}
              </strong>
            </div>
          </div>

          {/* Số tầng */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center gap-2.5">
            <Building className="h-4 w-4 text-blue-500 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 font-medium block">Số tầng</span>
              <strong className="font-bold text-slate-900 dark:text-white">
                {listing.floors > 0 ? `${listing.floors} tầng` : 'Chưa cập nhật'}
              </strong>
            </div>
          </div>

          {/* Phòng ngủ */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center gap-2.5">
            <Bed className="h-4 w-4 text-emerald-500 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 font-medium block">Phòng ngủ</span>
              <strong className="font-bold text-slate-900 dark:text-white">
                {listing.bedrooms > 0 ? `${listing.bedrooms} PN` : 'Chưa cập nhật'}
              </strong>
            </div>
          </div>

          {/* Phòng tắm */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center gap-2.5">
            <Bath className="h-4 w-4 text-cyan-500 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 font-medium block">Phòng tắm</span>
              <strong className="font-bold text-slate-900 dark:text-white">
                {listing.bathrooms > 0 ? `${listing.bathrooms} PT` : 'Chưa cập nhật'}
              </strong>
            </div>
          </div>

          {/* Hướng nhà */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center gap-2.5">
            <Compass className="h-4 w-4 text-indigo-500 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 font-medium block">Hướng nhà</span>
              <strong className="font-bold text-slate-900 dark:text-white">
                {listing.direction || 'Chưa cập nhật'}
              </strong>
            </div>
          </div>

          {/* Pháp lý */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center gap-2.5">
            <FileText className="h-4 w-4 text-amber-500 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 font-medium block">Pháp lý</span>
              <strong className="font-bold text-slate-900 dark:text-white truncate block">
                {listing.legalStatus || 'Chưa cập nhật'}
              </strong>
            </div>
          </div>
        </div>

        {/* D. TRẠNG THÁI XÁC MINH & QUY HOẠCH */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-50 to-orange-50/40 dark:from-slate-800/70 dark:to-orange-950/20 border border-slate-200/80 dark:border-slate-700/80 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
              <ShieldCheck className={`h-4 w-4 ${isVerified ? 'text-emerald-500' : 'text-slate-400'}`} />
              <span>{isVerified ? 'Hồ sơ đã kiểm tra thực tế' : 'Đang chờ thẩm định thực tế'}</span>
            </div>
            {listing.planningZone && (
              <span className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-[10.5px] font-semibold text-slate-700 dark:text-slate-300">
                {listing.planningZone}
              </span>
            )}
          </div>
          <p className="text-[11.5px] text-slate-500 dark:text-slate-400 leading-relaxed">
            {isVerified
              ? 'Tọa độ vị trí, hiện trạng nhà đất và giấy tờ pháp lý đã được đối chiếu trực tiếp bởi HaNoi Realty.'
              : 'Tin đăng từ cộng đồng đang trong quá trình xác minh giấy tờ và tọa độ thực tế.'}
          </p>
        </div>

        {/* E. MÔ TẢ NGẮN (DESCRIPTION) */}
        {listing.description && (
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
              Mô tả bất động sản
            </h4>
            <div className="relative">
              <p
                className={`text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line ${
                  !isDescriptionExpanded ? 'line-clamp-4' : ''
                }`}
              >
                {listing.description}
              </p>
              {listing.description.length > 200 && (
                <button
                  type="button"
                  onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                  className="mt-1 text-xs font-bold text-orange-600 hover:text-orange-700 cursor-pointer"
                >
                  {isDescriptionExpanded ? 'Thu gọn ▲' : 'Xem thêm toàn bộ mô tả ▼'}
                </button>
              )}
            </div>
          </div>
        )}

      </div>

      {/* ── STICKY BOTTOM ACTION CTA ── */}
      <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0 shadow-lg flex items-center gap-3">
        {listing.authorPhone && (
          <a
            href={`tel:${listing.authorPhone.replace(/\D/g, '')}`}
            className="h-11 px-4 rounded-xl border-2 border-orange-500 bg-orange-50 hover:bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
            title={`Gọi ngay: ${listing.authorPhone}`}
          >
            <Phone className="h-4 w-4" />
            <span className="hidden sm:inline">Gọi điện</span>
          </a>
        )}

        <Link
          href={listingUrl}
          className="flex-1 h-11 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-[0.99] text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-orange-500/20 transition-all cursor-pointer"
        >
          <span>Xem trang chi tiết đầy đủ</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Lightbox phóng to ảnh toàn màn hình */}
      <LightboxModal
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        images={images}
        propertyTitle={listing.title}
        propertyPrice={displayPrice}
      />
    </div>
  );
};

