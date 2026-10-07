'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Clock,
  ExternalLink,
  LayoutDashboard,
  Home,
  Tag,
  Share2,
  Sparkles,
  FileCheck
} from 'lucide-react';
import { formatCurrencyVND } from '@/lib/utils';
import { PostingData } from './PostingDataTypes';

interface PublishSuccessViewProps {
  listingId: string;
  data: PostingData;
}

export const PublishSuccessView: React.FC<PublishSuccessViewProps> = ({
  listingId,
  data,
}) => {
  const displayTitle =
    data.title ||
    `Bán ${data.propertyType === 'house' ? 'Nhà riêng' : data.propertyType === 'apartment' ? 'Chung cư' : data.propertyType === 'land' ? 'Đất nền' : 'Biệt thự'} ${data.area}m² tại ${data.location.district}`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 py-2"
    >
      {/* Icon & Heading */}
      <div className="text-center space-y-2">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 shadow-md shadow-emerald-500/20 ring-4 ring-emerald-50">
          <CheckCircle2 className="h-9 w-9" />
        </div>
        <h2 className="text-2xl font-black text-text-primary">Đăng tin thành công!</h2>
        <p className="text-xs sm:text-sm text-text-secondary max-w-md mx-auto">
          Tin đăng của bạn đã được gửi và đang chờ hệ thống kiểm duyệt.
        </p>
      </div>

      {/* Card Tóm tắt thông tin tin đăng */}
      <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50/60 via-white to-orange-50/30 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-border/80 gap-2">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-text-muted">
              Mã tin đăng
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-mono text-sm font-black text-accent">{listingId}</span>
              <span className="rounded-full bg-amber-100 border border-amber-200 px-2.5 py-0.5 text-[10px] font-bold text-amber-800 flex items-center gap-1">
                <Clock className="h-3 w-3 animate-pulse text-amber-600" />
                Chờ duyệt
              </span>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-text-muted">
              Mức giá chào bán
            </span>
            <p className="text-base font-black text-accent mt-0.5">
              {formatCurrencyVND(data.price)}
            </p>
          </div>
        </div>

        {/* Tiêu đề & Địa chỉ */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-text-muted">
            Tên tin đăng
          </span>
          <h3 className="text-sm font-bold text-text-primary leading-snug">
            {displayTitle}
          </h3>
          <p className="text-xs text-text-secondary">
            📍 {data.location.addressNumber} {data.location.street}, {data.location.ward}, {data.location.district}, Hà Nội
          </p>
        </div>

        {/* Người đăng & thời gian */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-border/60 text-xs">
          <div>
            <span className="text-text-muted">Người đăng tin:</span>{' '}
            <strong className="text-text-primary font-bold">{data.seller.fullName}</strong>{' '}
            <span className="text-[10px] font-semibold text-accent bg-orange-50 px-1.5 py-0.5 rounded border border-orange-200">
              {data.seller.sellerType}
            </span>
          </div>
          <div className="sm:text-right">
            <span className="text-text-muted">Thời gian gửi:</span>{' '}
            <strong className="text-text-primary font-bold">
              {new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}, {new Date().toLocaleDateString('vi-VN')}
            </strong>
          </div>
        </div>
      </div>

      {/* Thông tin hỗ trợ */}
      <div className="rounded-xl border border-slate-200 bg-page-bg p-3.5 text-xs text-text-secondary flex items-start gap-2.5">
        <Sparkles className="h-4 w-4 text-accent shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          Đội ngũ kiểm duyệt Hanoi Realty sẽ xem xét và đối chiếu dữ liệu quy hoạch phân khu trong vòng <strong>15–30 phút</strong>. Khi được duyệt, tin đăng sẽ tự động xuất hiện trên bản đồ vệ tinh và mục tìm kiếm.
        </p>
      </div>

      {/* 3 Buttons Hành động */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        {/* 1. Xem tin đăng */}
        <Link
          href={`/listings/${listingId}`}
          className="flex items-center justify-center gap-1.5 rounded-xl bg-accent px-4 py-3 text-xs font-bold text-white shadow-md shadow-accent/20 hover:bg-accent-hover transition-all text-center"
        >
          <ExternalLink className="h-4 w-4" />
          <span>Xem tin đăng</span>
        </Link>

        {/* 2. Quản lý tin đăng */}
        <Link
          href="/dashboard?tab=listings"
          className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-3 text-xs font-bold text-text-primary shadow-xs hover:bg-slate-50 hover:border-slate-400 transition-all text-center"
        >
          <LayoutDashboard className="h-4 w-4 text-accent" />
          <span>Quản lý tin đăng</span>
        </Link>

        {/* 3. Về trang chủ */}
        <Link
          href="/"
          className="flex items-center justify-center gap-1.5 rounded-xl border border-border bg-page-bg px-4 py-3 text-xs font-bold text-text-secondary hover:text-text-primary hover:bg-slate-100 transition-all text-center"
        >
          <Home className="h-4 w-4" />
          <span>Về trang chủ</span>
        </Link>
      </div>
    </motion.div>
  );
};
