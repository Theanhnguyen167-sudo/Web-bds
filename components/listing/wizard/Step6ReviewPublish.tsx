'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Home,
  Building2,
  Trees,
  Landmark,
  MapPin,
  Image as ImageIcon,
  DollarSign,
  Maximize2,
  Bed,
  Bath,
  Building,
  Compass,
  ShieldCheck,
  CheckCircle2,
  Pencil,
  Eye,
  User,
  Phone,
  Mail,
  Lock,
  Star,
  FileText,
  AlertCircle,
  HelpCircle,
  Bookmark,
  Share2,
  Check
} from 'lucide-react';
import { formatCurrencyVND, formatPricePerM2 } from '@/lib/utils';
import { PostingData } from './PostingDataTypes';
import { TermsModal } from './TermsModal';

interface Step6ReviewPublishProps {
  data: PostingData;
  onEditStep: (stepNumber: number) => void;
  isCommitted: boolean;
  setIsCommitted: (val: boolean) => void;
}

const PROPERTY_TYPE_NAMES: Record<string, string> = {
  house: 'Nhà phố / Nhà riêng',
  apartment: 'Chung cư cao cấp',
  land: 'Đất nền / Đất thổ cư',
  villa: 'Biệt thự / Shophouse',
};

export const Step6ReviewPublish: React.FC<Step6ReviewPublishProps> = ({
  data,
  onEditStep,
  isCommitted,
  setIsCommitted,
}) => {
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

  const displayTitle =
    data.title ||
    `Bán ${PROPERTY_TYPE_NAMES[data.propertyType] || 'BĐS'} ${data.area}m² tại ${data.location.district}`;

  const fullAddress = `${data.location.addressNumber} ${data.location.street}, ${data.location.ward}, ${data.location.district}, Hà Nội`;

  return (
    <motion.div
      key="step6"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Tiêu đề Step 6 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 className="text-xl font-black text-text-primary">Bước 6: Kiểm tra & xuất bản</h2>
          <p className="text-xs text-text-secondary mt-1">
            Kiểm tra lại thông tin trước khi đăng tin bất động sản.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 w-fit">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Bước cuối cùng
        </span>
      </div>

      {/* Banner Sẵn sàng xuất bản */}
      <div className="rounded-2xl border border-emerald-300 bg-gradient-to-r from-emerald-50 via-teal-50/50 to-emerald-50 p-4 sm:p-5 shadow-xs">
        <div className="flex items-start gap-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-600/25">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-black text-emerald-950 flex items-center gap-1.5">
              <span>✅ Tin đăng đã sẵn sàng</span>
            </h4>
            <p className="text-xs font-medium text-emerald-800 leading-relaxed">
              Bạn đã hoàn tất tất cả thông tin từ Bước 1 đến Bước 5. Hãy rà soát 6 mục bên dưới trước khi bấm xuất bản.
            </p>
          </div>
        </div>
      </div>

      {/* 6 SECTIONS REVIEW CÓ NÚT [CHỈNH SỬA] CHO MỖI SECTION */}
      <div className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-wider text-text-muted">
          Chi tiết 6 phần thông tin tin đăng
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* SECTION 1: Thông tin bất động sản */}
          <div className="rounded-2xl border border-border bg-page-bg/60 p-4 sm:p-5 space-y-3 flex flex-col justify-between hover:border-slate-300 transition-colors">
            <div className="space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-border/70">
                <span className="text-xs font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                  <Home className="h-3.5 w-3.5 text-accent" />
                  1. Thông tin bất động sản
                </span>
                <button
                  type="button"
                  onClick={() => onEditStep(1)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-accent hover:underline hover:text-accent-hover transition-colors"
                >
                  <Pencil className="h-3 w-3" />
                  <span>Chỉnh sửa</span>
                </button>
              </div>

              <div className="space-y-1.5 text-xs">
                <div>
                  <span className="text-text-muted">Loại hình:</span>{' '}
                  <strong className="text-text-primary font-bold">
                    {PROPERTY_TYPE_NAMES[data.propertyType] || data.propertyType}
                  </strong>
                </div>
                <div>
                  <span className="text-text-muted">Tiêu đề tin:</span>{' '}
                  <p className="font-bold text-text-primary text-xs leading-snug mt-0.5">
                    {displayTitle}
                  </p>
                </div>
                {data.description && (
                  <div>
                    <span className="text-text-muted">Mô tả:</span>{' '}
                    <p className="text-[11px] text-text-secondary line-clamp-2 mt-0.5 bg-white p-2 rounded-lg border border-border/60">
                      {data.description}
                    </p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <span className="text-text-muted">Hướng chính:</span>{' '}
                    <strong className="text-text-primary">{data.direction || 'Đông Nam'}</strong>
                  </div>
                  <div>
                    <span className="text-text-muted">Pháp lý:</span>{' '}
                    <strong className="text-text-primary">{data.legalStatus || 'Sổ đỏ chính chủ'}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: Vị trí */}
          <div className="rounded-2xl border border-border bg-page-bg/60 p-4 sm:p-5 space-y-3 flex flex-col justify-between hover:border-slate-300 transition-colors">
            <div className="space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-border/70">
                <span className="text-xs font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-accent" />
                  2. Vị trí & Bản đồ
                </span>
                <button
                  type="button"
                  onClick={() => onEditStep(2)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-accent hover:underline hover:text-accent-hover transition-colors"
                >
                  <Pencil className="h-3 w-3" />
                  <span>Chỉnh sửa</span>
                </button>
              </div>

              <div className="space-y-1.5 text-xs">
                <div>
                  <span className="text-text-muted">Địa chỉ chi tiết:</span>
                  <p className="font-bold text-text-primary leading-snug mt-0.5">
                    {fullAddress}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                  <div>
                    <span className="text-text-muted">Quận / Huyện:</span>{' '}
                    <strong className="text-text-primary">{data.location.district}</strong>
                  </div>
                  <div>
                    <span className="text-text-muted">Phường / Xã:</span>{' '}
                    <strong className="text-text-primary">{data.location.ward || 'Chưa rõ'}</strong>
                  </div>
                </div>
                <div className="rounded-lg bg-emerald-50/70 border border-emerald-200/80 p-2 text-[10px] text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>Toạ độ WGS84: {data.location.lat.toFixed(4)}, {data.location.lng.toFixed(4)} (đã ghim bản đồ quy hoạch)</span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: Hình ảnh */}
          <div className="rounded-2xl border border-border bg-page-bg/60 p-4 sm:p-5 space-y-3 flex flex-col justify-between hover:border-slate-300 transition-colors">
            <div className="space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-border/70">
                <span className="text-xs font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                  <ImageIcon className="h-3.5 w-3.5 text-accent" />
                  3. Hình ảnh bất động sản ({data.images.length})
                </span>
                <button
                  type="button"
                  onClick={() => onEditStep(3)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-accent hover:underline hover:text-accent-hover transition-colors"
                >
                  <Pencil className="h-3 w-3" />
                  <span>Chỉnh sửa</span>
                </button>
              </div>

              {/* Ảnh thu nhỏ thumbnail */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
                {data.images.slice(0, 4).map((img, idx) => (
                  <div
                    key={idx}
                    className={`relative h-14 w-20 shrink-0 rounded-lg overflow-hidden border ${
                      idx === 0 ? 'ring-2 ring-accent border-accent' : 'border-border'
                    }`}
                  >
                    <img src={img} alt={`thumb-${idx}`} className="h-full w-full object-cover" />
                    {idx === 0 && (
                      <span className="absolute bottom-0 inset-x-0 bg-accent/90 text-white text-[8px] font-bold text-center py-0.5">
                        Ảnh bìa
                      </span>
                    )}
                  </div>
                ))}
                {data.images.length > 4 && (
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-slate-200 text-xs font-black text-text-secondary">
                    +{data.images.length - 4}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 4: Giá & thông số */}
          <div className="rounded-2xl border border-border bg-page-bg/60 p-4 sm:p-5 space-y-3 flex flex-col justify-between hover:border-slate-300 transition-colors">
            <div className="space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-border/70">
                <span className="text-xs font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                  <DollarSign className="h-3.5 w-3.5 text-accent" />
                  4. Giá & Thông số chi tiết
                </span>
                <button
                  type="button"
                  onClick={() => onEditStep(4)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-accent hover:underline hover:text-accent-hover transition-colors"
                >
                  <Pencil className="h-3 w-3" />
                  <span>Chỉnh sửa</span>
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-baseline justify-between">
                  <span className="text-lg font-black text-accent">
                    {formatCurrencyVND(data.price)}
                  </span>
                  <span className="text-[11px] font-bold text-text-secondary bg-white px-2 py-0.5 rounded-md border border-border">
                    {formatPricePerM2(data.price, data.area)}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[11px] pt-1">
                  <div className="bg-white p-1.5 rounded-lg border border-border/70 text-center">
                    <span className="text-text-muted block text-[10px]">Diện tích</span>
                    <strong className="text-text-primary">{data.area} m²</strong>
                  </div>
                  <div className="bg-white p-1.5 rounded-lg border border-border/70 text-center">
                    <span className="text-text-muted block text-[10px]">Số tầng</span>
                    <strong className="text-text-primary">{data.floors} tầng</strong>
                  </div>
                  <div className="bg-white p-1.5 rounded-lg border border-border/70 text-center">
                    <span className="text-text-muted block text-[10px]">PN / PT</span>
                    <strong className="text-text-primary">{data.bedrooms}PN / {data.bathrooms}PT</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 5: Thông tin người đăng */}
          <div className="rounded-2xl border border-border bg-page-bg/60 p-4 sm:p-5 space-y-3 flex flex-col justify-between hover:border-slate-300 transition-colors">
            <div className="space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-border/70">
                <span className="text-xs font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-accent" />
                  5. Thông tin người đăng
                </span>
                <button
                  type="button"
                  onClick={() => onEditStep(5)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-accent hover:underline hover:text-accent-hover transition-colors"
                >
                  <Pencil className="h-3 w-3" />
                  <span>Chỉnh sửa</span>
                </button>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-text-primary text-sm">{data.seller.fullName}</span>
                  <span className="text-[10px] font-bold text-accent bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
                    {data.seller.sellerType}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-text-muted">SĐT:</span>
                  <strong className="text-text-primary font-mono">{data.seller.phone}</strong>
                  {data.seller.isPhoneVerified && (
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                      ✓ Đã xác thực
                    </span>
                  )}
                </div>
                {data.seller.email && (
                  <div>
                    <span className="text-text-muted">Email:</span>{' '}
                    <span className="text-text-primary">{data.seller.email}</span>
                  </div>
                )}
                {data.seller.companyName && (
                  <div>
                    <span className="text-text-muted">Công ty / Sàn:</span>{' '}
                    <strong className="text-text-primary">{data.seller.companyName}</strong>
                  </div>
                )}
                {data.seller.contactAddress && (
                  <div>
                    <span className="text-text-muted">Địa chỉ liên hệ:</span>{' '}
                    <span className="text-text-secondary">{data.seller.contactAddress}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 6: Cài đặt hiển thị liên hệ */}
          <div className="rounded-2xl border border-border bg-page-bg/60 p-4 sm:p-5 space-y-3 flex flex-col justify-between hover:border-slate-300 transition-colors">
            <div className="space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-border/70">
                <span className="text-xs font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                  <Eye className="h-3.5 w-3.5 text-accent" />
                  6. Cài đặt hiển thị liên hệ
                </span>
                <button
                  type="button"
                  onClick={() => onEditStep(5)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-accent hover:underline hover:text-accent-hover transition-colors"
                >
                  <Pencil className="h-3 w-3" />
                  <span>Chỉnh sửa</span>
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-border/70">
                  <span className="text-text-secondary">Hiển thị số điện thoại:</span>
                  <span className={`font-bold text-[11px] ${data.seller.showPhone ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {data.seller.showPhone ? '✓ Hiển thị' : 'Ẩn số'}
                  </span>
                </div>
                <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-border/70">
                  <span className="text-text-secondary">Liên hệ qua email:</span>
                  <span className={`font-bold text-[11px] ${data.seller.allowEmailContact ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {data.seller.allowEmailContact ? '✓ Cho phép' : 'Tắt'}
                  </span>
                </div>
                <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-border/70">
                  <span className="text-text-secondary">Hiển thị tên công ty / sàn:</span>
                  <span className={`font-bold text-[11px] ${data.seller.showCompany ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {data.seller.showCompany ? '✓ Hiển thị' : 'Ẩn'}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 9. PREVIEW TIN ĐĂNG TRỰC QUAN NHƯ TRÊN WEBSITE */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-text-primary flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/20 text-accent text-xs">👁️</span>
            <span>Xem trước tin đăng thực tế trên Hanoi Realty</span>
          </h3>
          <span className="text-[11px] text-text-secondary hidden sm:inline">
            Giao diện khách hàng sẽ nhìn thấy khi xem tin
          </span>
        </div>

        {/* Real-life Property Card Preview Container */}
        <div className="rounded-2xl border-2 border-orange-200/80 bg-white p-4 sm:p-6 shadow-md overflow-hidden space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            
            {/* Ảnh đại diện bên trái preview (5 cols) */}
            <div className="lg:col-span-5 space-y-2">
              <div className="relative aspect-[16/11] w-full overflow-hidden rounded-xl border border-border bg-slate-100 shadow-inner group">
                <img
                  src={data.images[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80'}
                  alt="Ảnh xem trước"
                  className="h-full w-full object-cover"
                />
                <span className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 rounded-md bg-accent/90 backdrop-blur-xs px-2.5 py-1 text-[10px] font-bold text-white shadow-md">
                  <Star className="h-3 w-3 fill-white" />
                  {PROPERTY_TYPE_NAMES[data.propertyType] || 'BĐS Hà Nội'}
                </span>
                <span className="absolute bottom-2.5 right-2.5 rounded-md bg-black/70 backdrop-blur-xs px-2 py-0.5 text-[10px] font-bold text-white">
                  1 / {data.images.length} ảnh
                </span>
              </div>

              {/* Dải ảnh nhỏ */}
              {data.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {data.images.slice(0, 4).map((img, i) => (
                    <div key={i} className="h-12 w-16 shrink-0 rounded-lg overflow-hidden border border-border">
                      <img src={img} alt="mini" className="h-full w-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Nội dung bên phải preview (7 cols) */}
            <div className="lg:col-span-7 space-y-3.5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="rounded bg-orange-100 text-accent px-2 py-0.5 text-[10px] font-extrabold uppercase">
                    Quy hoạch đất ở đô thị
                  </span>
                  <span className="text-[11px] text-text-muted">• {data.location.district}, Hà Nội</span>
                </div>
                <h4 className="text-base sm:text-lg font-black text-text-primary leading-snug">
                  {displayTitle}
                </h4>
                <p className="text-xs text-text-secondary mt-1 flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-accent shrink-0" />
                  <span>{fullAddress}</span>
                </p>
              </div>

              {/* Mức giá to */}
              <div className="flex items-baseline gap-3 flex-wrap bg-orange-50/50 p-3 rounded-xl border border-orange-100">
                <span className="text-2xl font-black text-accent tracking-tight">
                  {formatCurrencyVND(data.price)}
                </span>
                <span className="text-xs font-bold text-text-secondary">
                  Đơn giá: <strong className="text-text-primary">{formatPricePerM2(data.price, data.area)}</strong>
                </span>
              </div>

              {/* Thông số Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2 rounded-lg bg-page-bg border border-border/80 flex items-center gap-1.5">
                  <Maximize2 className="h-3.5 w-3.5 text-accent" />
                  <span><strong>{data.area}</strong> m²</span>
                </div>
                <div className="p-2 rounded-lg bg-page-bg border border-border/80 flex items-center gap-1.5">
                  <Building className="h-3.5 w-3.5 text-accent" />
                  <span><strong>{data.floors}</strong> tầng</span>
                </div>
                <div className="p-2 rounded-lg bg-page-bg border border-border/80 flex items-center gap-1.5">
                  <Bed className="h-3.5 w-3.5 text-accent" />
                  <span><strong>{data.bedrooms}</strong> PN</span>
                </div>
                <div className="p-2 rounded-lg bg-page-bg border border-border/80 flex items-center gap-1.5">
                  <Bath className="h-3.5 w-3.5 text-accent" />
                  <span><strong>{data.bathrooms}</strong> PT</span>
                </div>
              </div>

              {/* Mô tả tóm tắt */}
              {data.description && (
                <div className="text-xs text-text-secondary line-clamp-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200/70 leading-relaxed">
                  {data.description}
                </div>
              )}

              {/* Card Liên hệ xem trước (áp dụng quyền hiển thị) */}
              <div className="rounded-xl border border-border bg-white p-3.5 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-white font-bold text-xs shadow-xs">
                      {data.seller.fullName.slice(0, 1).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-text-primary flex items-center gap-1.5">
                        <span>{data.seller.fullName}</span>
                        <span className="text-[10px] font-semibold text-accent bg-orange-50 px-1.5 py-0.2 rounded border border-orange-200">
                          {data.seller.sellerType}
                        </span>
                      </p>
                      {data.seller.showCompany && data.seller.companyName && (
                        <p className="text-[10px] text-text-secondary flex items-center gap-1">
                          <Building className="h-2.5 w-2.5 text-accent" />
                          <span>{data.seller.companyName}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Nút bấm liên hệ theo quyền */}
                  <div className="flex items-center gap-2">
                    {data.seller.showPhone ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold shadow-sm">
                        <Phone className="h-3.5 w-3.5" />
                        <span>{data.seller.phone}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 text-text-muted text-[11px] font-semibold">
                        <Lock className="h-3 w-3" />
                        <span>SĐT ẩn theo yêu cầu</span>
                      </span>
                    )}

                    {data.seller.allowEmailContact && data.seller.email && (
                      <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border text-text-primary text-xs font-semibold">
                        <Mail className="h-3 w-3 text-accent" />
                        <span>Gửi email</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>

      {/* 10. CAM KẾT THÔNG TIN */}
      <div className="rounded-2xl border border-slate-300 bg-page-bg/80 p-4 sm:p-5 space-y-2">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={isCommitted}
            onChange={(e) => setIsCommitted(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-slate-300 text-accent focus:ring-accent accent-orange-500 cursor-pointer"
          />
          <div className="space-y-1">
            <span className="text-xs sm:text-sm font-bold text-text-primary block leading-snug">
              Tôi cam kết các thông tin trong tin đăng là chính xác và tôi có quyền đăng thông tin bất động sản này.
            </span>
            <p className="text-[11px] text-text-secondary leading-relaxed">
              Bằng việc tích chọn, bạn đồng ý tuân thủ{' '}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsTermsModalOpen(true);
                }}
                className="font-bold text-accent hover:underline inline-flex items-center gap-0.5"
              >
                Quy định đăng tin bất động sản
              </button>{' '}
              của Hanoi Realty. Tin sai phạm sẽ bị gỡ bỏ theo quy định.
            </p>
          </div>
        </label>
      </div>

      {/* Modal quy định đăng tin */}
      <TermsModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
      />
    </motion.div>
  );
};
