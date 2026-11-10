'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Bookmark, 
  BookmarkCheck, 
  Share2, 
  Sparkles, 
  CalendarDays, 
  Lock, 
  ShieldCheck, 
  Check, 
  Copy, 
  Coins, 
  Maximize2,
  Compass,
  Layers,
  BedDouble,
  Bath
} from 'lucide-react';
import { BrokerListing } from '@/types/broker-listing';
import { BrokerProfile } from '@/types/broker-nav';
import { formatCurrencyVND } from '@/lib/utils';

interface BrokerListingCardProps {
  listing: BrokerListing;
  profile: BrokerProfile;
  viewMode: 'grid' | 'list';
  onToggleCurate: (id: string) => void;
  onOpenMarketingKit: (listing: BrokerListing) => void;
  onRestrictedClick: (featureName: string) => void;
}

export const BrokerListingCard: React.FC<BrokerListingCardProps> = ({
  listing,
  profile,
  viewMode,
  onToggleCurate,
  onOpenMarketingKit,
  onRestrictedClick,
}) => {
  const [copied, setCopied] = useState(false);

  // Điều kiện được xem thông tin nội bộ & sử dụng công cụ chuyên sâu
  const isEligible = profile.verificationStatus === 'verified' && profile.subscriptionTier !== 'expired';

  const handleCopyLink = async () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://hanoirealty.vn';
    const refLink = `${origin}/listings/${listing.id}?ref=${encodeURIComponent(profile.referralCode || profile.brokerCode)}`;
    
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(refLink);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarketingKitClick = () => {
    if (!isEligible) {
      onRestrictedClick('Tải Marketing Kit & Bộ ảnh sạch');
      return;
    }
    onOpenMarketingKit(listing);
  };

  const handleCurateClick = () => {
    if (!isEligible && !listing.isCurated) {
      onRestrictedClick('Lưu BĐS vào Tủ hàng cá nhân');
      return;
    }
    onToggleCurate(listing.id);
  };

  // 1. DẠNG DANH SÁCH (LIST VIEW)
  if (viewMode === 'list') {
    return (
      <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all hover:border-blue-400 hover:shadow-md flex flex-col md:flex-row gap-4">
        {/* Thumbnail */}
        <div className="relative h-48 md:h-auto md:w-64 shrink-0 overflow-hidden rounded-xl bg-slate-100">
          <img
            src={listing.images[0]}
            alt={listing.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <span className="absolute top-2.5 left-2.5 rounded-lg bg-slate-900/80 px-2 py-0.5 font-mono text-[11px] font-bold text-white backdrop-blur-xs">
            {listing.propertyCode}
          </span>
          <span className="absolute bottom-2.5 right-2.5 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] text-white">
            {listing.images.length} ảnh
          </span>
        </div>

        {/* Thông tin chính */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-bold text-slate-900 text-sm md:text-base leading-snug line-clamp-2">
                {listing.title}
              </h3>
              <div className="text-right shrink-0">
                <div className="text-base font-extrabold text-blue-700">
                  {formatCurrencyVND(listing.price)}
                </div>
                <div className="text-[11px] text-slate-500 font-medium">
                  {(listing.pricePerM2 / 1_000_000).toFixed(1)} tr/m²
                </div>
              </div>
            </div>

            <p className="mt-1 text-xs text-slate-500 line-clamp-1">
              📍 {listing.address}
            </p>

            {/* Thông số kỹ thuật */}
            <div className="mt-2.5 flex flex-wrap items-center gap-3 text-xs text-slate-600 bg-slate-50 p-2 rounded-xl">
              <span className="font-semibold text-slate-900">{listing.area} m²</span>
              <span>•</span>
              <span>{listing.floors || 4} tầng</span>
              <span>•</span>
              <span>{listing.bedrooms || 3} PN</span>
              <span>•</span>
              <span>{listing.bathrooms || 3} WC</span>
              <span>•</span>
              <span>Hướng {listing.direction || 'Đông Nam'}</span>
              {listing.frontageWidth && (
                <>
                  <span>•</span>
                  <span>MT {listing.frontageWidth}m</span>
                </>
              )}
            </div>

            {/* Thông tin nội bộ môi giới: Hoa hồng & Pháp lý */}
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-2.5">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  {listing.legalStatus}
                </span>
                <span className="inline-flex items-center text-[10px] text-slate-500">
                  {listing.planningZone}
                </span>
              </div>

              {/* Box Hoa hồng nội bộ */}
              {isEligible ? (
                <div className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-900 border border-amber-200">
                  <Coins className="h-3.5 w-3.5 text-amber-600" />
                  <span>HH: {listing.commissionRate}%</span>
                  <span className="text-amber-700 font-normal">
                    (~{formatCurrencyVND(listing.estimatedCommissionAmount)})
                  </span>
                </div>
              ) : (
                <div
                  onClick={() => onRestrictedClick('Thông tin hoa hồng nội bộ')}
                  className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500 cursor-pointer hover:bg-slate-200"
                >
                  <Lock className="h-3 w-3 text-slate-400" />
                  <span>Khóa hoa hồng (Cần duyệt hồ sơ)</span>
                </div>
              )}
            </div>
          </div>

          {/* Hàng nút hành động */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCurateClick}
                className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                  listing.isCurated
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {listing.isCurated ? (
                  <>
                    <BookmarkCheck className="h-3.5 w-3.5 text-amber-600" />
                    <span>Đã trong tủ hàng</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="h-3.5 w-3.5" />
                    <span>Lưu vào tủ</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleMarketingKitClick}
                className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100"
              >
                <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                <span>Marketing Kit</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Share2 className="h-3.5 w-3.5" />}
                <span>{copied ? 'Đã chép link' : 'Copy link'}</span>
              </button>

              <Link
                href={`/dashboard/broker/appointments?listingId=${listing.id}`}
                className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-blue-500 shadow-xs"
              >
                <CalendarDays className="h-3.5 w-3.5" />
                <span>Đặt lịch xem</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. DẠNG LƯỚI (GRID VIEW)
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white overflow-hidden transition-all hover:border-blue-400 hover:shadow-md flex flex-col justify-between">
      <div>
        {/* Ảnh đại diện & Mã BĐS */}
        <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-100">
          <img
            src={listing.images[0]}
            alt={listing.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
            <span className="rounded-lg bg-slate-900/80 px-2 py-0.5 font-mono text-[11px] font-bold text-white backdrop-blur-xs">
              {listing.propertyCode}
            </span>
          </div>
          <span className="absolute bottom-2.5 right-2.5 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] text-white">
            {listing.images.length} ảnh
          </span>
        </div>

        {/* Nội dung thông tin */}
        <div className="p-4 space-y-2.5">
          {/* Giá & Diện tích */}
          <div className="flex items-baseline justify-between">
            <div className="text-lg font-extrabold text-blue-700">
              {formatCurrencyVND(listing.price)}
            </div>
            <div className="text-xs font-bold text-slate-800">
              {listing.area} m²{' '}
              <span className="text-[11px] font-normal text-slate-500">
                ({(listing.pricePerM2 / 1_000_000).toFixed(1)} tr/m²)
              </span>
            </div>
          </div>

          {/* Tiêu đề & Địa chỉ */}
          <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 h-10">
            {listing.title}
          </h3>
          <p className="text-xs text-slate-500 truncate">
            📍 {listing.district}, Hà Nội
          </p>

          {/* Thông số kỹ thuật thu gọn */}
          <div className="grid grid-cols-3 gap-1.5 py-1.5 border-y border-slate-100 text-[11px] text-slate-600">
            <div className="flex items-center gap-1">
              <Layers className="h-3 w-3 text-slate-400" />
              <span>{listing.floors || 4} tầng</span>
            </div>
            <div className="flex items-center gap-1">
              <BedDouble className="h-3 w-3 text-slate-400" />
              <span>{listing.bedrooms || 3} PN</span>
            </div>
            <div className="flex items-center gap-1">
              <Compass className="h-3 w-3 text-slate-400" />
              <span className="truncate">{listing.direction || 'Đ.Nam'}</span>
            </div>
          </div>

          {/* Thông tin hoa hồng nội bộ */}
          <div className="pt-1">
            {isEligible ? (
              <div className="flex items-center justify-between rounded-xl bg-amber-50 px-2.5 py-1.5 text-xs font-bold text-amber-900 border border-amber-200">
                <span className="flex items-center gap-1">
                  <Coins className="h-3.5 w-3.5 text-amber-600" />
                  Hoa hồng: {listing.commissionRate}%
                </span>
                <span className="text-amber-700 text-[11px]">
                  ~{formatCurrencyVND(listing.estimatedCommissionAmount)}
                </span>
              </div>
            ) : (
              <div
                onClick={() => onRestrictedClick('Thông tin hoa hồng nội bộ')}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-100 px-2.5 py-1.5 text-[11px] font-semibold text-slate-500 cursor-pointer hover:bg-slate-200"
              >
                <Lock className="h-3 w-3 text-slate-400" />
                <span>Khóa hoa hồng (Cần duyệt hồ sơ)</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Action buttons */}
      <div className="p-4 pt-0 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleCurateClick}
            className={`inline-flex items-center justify-center gap-1 rounded-xl py-1.5 text-xs font-semibold transition-all ${
              listing.isCurated
                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {listing.isCurated ? (
              <>
                <BookmarkCheck className="h-3.5 w-3.5 text-amber-600" />
                <span>Đã lưu tủ</span>
              </>
            ) : (
              <>
                <Bookmark className="h-3.5 w-3.5" />
                <span>Lưu tủ</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleMarketingKitClick}
            className="inline-flex items-center justify-center gap-1 rounded-xl border border-blue-200 bg-blue-50 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100"
          >
            <Sparkles className="h-3.5 w-3.5 text-blue-600" />
            <span>Marketing Kit</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyLink}
            className="flex-1 inline-flex items-center justify-center gap-1 rounded-xl border border-slate-200 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? 'Đã chép' : 'Copy link'}</span>
          </button>

          <Link
            href={`/dashboard/broker/appointments?listingId=${listing.id}`}
            className="flex-1 inline-flex items-center justify-center gap-1 rounded-xl bg-blue-600 py-1.5 text-xs font-bold text-white hover:bg-blue-500 shadow-xs"
          >
            <CalendarDays className="h-3.5 w-3.5" />
            <span>Đặt lịch xem</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

