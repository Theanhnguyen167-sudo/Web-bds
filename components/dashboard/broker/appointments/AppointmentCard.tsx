'use client';

import React from 'react';
import Link from 'next/link';
import { 
  CalendarDays, 
  Clock, 
  MapPin, 
  User, 
  CheckCircle2, 
  AlertCircle, 
  Navigation, 
  Edit3, 
  FileCheck, 
  XCircle, 
  Coins,
  ThumbsUp,
  ThumbsDown,
  HelpCircle,
  Building2
} from 'lucide-react';
import { AppointmentItem, AppointmentStatus } from '@/types/broker-appointment';
import { formatCurrencyVND } from '@/lib/utils';
import { VisitCheckinButton } from './VisitCheckinButton';

interface AppointmentCardProps {
  item: AppointmentItem;
  onOpenOutcomeModal: (item: AppointmentItem) => void;
  onCancelOrReschedule: (item: AppointmentItem) => void;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  item,
  onOpenOutcomeModal,
  onCancelOrReschedule,
}) => {
  // Tính toán thời gian đếm ngược hoặc trạng thái ngày
  const formatCountdown = (isoString: string) => {
    const target = new Date(isoString).getTime();
    const now = new Date().getTime();
    const diffHours = Math.round((target - now) / (1000 * 3600));

    if (diffHours < 0) return 'Đã diễn ra';
    if (diffHours === 0) return 'Đang diễn ra ngay bây giờ';
    if (diffHours <= 24) return `Sắp diễn ra (trong ${diffHours} giờ tới)`;
    const diffDays = Math.ceil(diffHours / 24);
    return `Còn ${diffDays} ngày nữa`;
  };

  const renderStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            Chủ nhà đã xác nhận
          </span>
        );
      case 'pending_host':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-700 border border-amber-200 animate-pulse">
            <Clock className="h-3.5 w-3.5 text-amber-600" />
            Chờ chủ nhà xác nhận
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-bold text-purple-700 border border-purple-200">
            <FileCheck className="h-3.5 w-3.5 text-purple-600" />
            Đã hoàn thành buổi xem
          </span>
        );
      case 'rescheduled':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-bold text-orange-700 border border-orange-200">
            <AlertCircle className="h-3.5 w-3.5 text-orange-600" />
            Đã đổi khung giờ
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-bold text-rose-700 border border-rose-200">
            <XCircle className="h-3.5 w-3.5 text-rose-600" />
            Đã hủy hẹn
          </span>
        );
    }
  };

  // Google Maps URL
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    item.meetingAddress
  )}`;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between space-y-4">
      {/* Header Thẻ: Mốc giờ + Badge trạng thái */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-700 font-extrabold text-sm">
              <CalendarDays className="h-5 w-5" />
            </span>
            <div>
              <div className="text-xs font-bold text-slate-900">
                {new Date(item.scheduledDate).toLocaleDateString('vi-VN', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'numeric',
                  year: 'numeric',
                })}
              </div>
              <div className="font-mono text-[11px] font-semibold text-blue-700 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {item.scheduledTimeSlot}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1">
            {renderStatusBadge(item.status)}
            <span className="text-[10px] text-slate-400 font-medium">
              {formatCountdown(item.scheduledTimestamp)}
            </span>
          </div>
        </div>

        {/* Thông tin BĐS & Địa chỉ */}
        <div className="mt-3 space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              {item.propertyCode}
            </span>
            <span className="font-bold text-slate-900 text-sm line-clamp-1">
              {item.listingTitle}
            </span>
          </div>

          <div className="flex items-start gap-1.5 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl">
            <MapPin className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
            <span className="line-clamp-2">
              <strong>Điểm đón tiếp:</strong> {item.meetingAddress}
            </span>
          </div>
        </div>

        {/* Thông tin khách hàng & Chủ nhà */}
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className="rounded-lg border border-slate-100 bg-white p-2">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Khách hàng:</span>
            <div className="font-bold text-slate-800 flex items-center gap-1">
              <User className="h-3.5 w-3.5 text-slate-400" />
              <span>{item.leadName}</span>
              <span className="font-mono text-[11px] text-slate-500 font-normal">({item.leadPhone})</span>
            </div>
          </div>

          <div className="rounded-lg border border-slate-100 bg-white p-2">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Chủ nhà đón tiếp:</span>
            <div className="font-bold text-slate-800 flex items-center gap-1">
              <Building2 className="h-3.5 w-3.5 text-slate-400" />
              <span>{item.hostName}</span>
            </div>
          </div>
        </div>

        {/* Ghi chú gửi chủ nhà nếu có */}
        {item.noteToHost && (
          <div className="mt-2 text-[11px] text-slate-500 italic px-1">
            &quot;{item.noteToHost}&quot;
          </div>
        )}

        {/* Khối hiển thị kết quả buổi xem (nếu đã hoàn thành) */}
        {item.outcome && (
          <div className="mt-3 rounded-xl bg-purple-50/70 border border-purple-200 p-3 text-xs text-purple-950 space-y-1">
            <div className="flex items-center justify-between font-bold">
              <span className="flex items-center gap-1">
                {item.outcome.interestLevel === 'high' ? (
                  <ThumbsUp className="h-3.5 w-3.5 text-emerald-600" />
                ) : (
                  <ThumbsDown className="h-3.5 w-3.5 text-amber-600" />
                )}
                <span>
                  Đánh giá khách:{' '}
                  {item.outcome.interestLevel === 'high'
                    ? 'Rất thích'
                    : item.outcome.interestLevel === 'medium'
                    ? 'Đang cân nhắc'
                    : 'Không phù hợp'}
                </span>
              </span>
              {item.outcome.proposedPrice && (
                <span className="font-mono text-purple-800">
                  Giá đề xuất: {formatCurrencyVND(item.outcome.proposedPrice)}
                </span>
              )}
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              {item.outcome.feedbackNote}
            </p>
          </div>
        )}
      </div>

      {/* Footer Hành động */}
      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 p-1"
          >
            <Navigation className="h-3.5 w-3.5" />
            <span>Chỉ đường</span>
          </a>

          {/* Nút Check-in GPS hiện trường chống luồn cò */}
          <VisitCheckinButton
            appointmentId={item.id}
            propertyCode={item.propertyCode}
            propertyTitle={item.listingTitle}
            meetingAddress={item.meetingAddress}
            targetCoordinates={item.targetCoordinates}
            initialCheckin={item.checkinRecord || item.outcome?.checkinRecord}
          />
        </div>

        <div className="flex items-center gap-2">
          {item.status !== 'completed' && item.status !== 'cancelled' && (
            <button
              type="button"
              onClick={() => onCancelOrReschedule(item)}
              className="rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Đổi/Hủy lịch
            </button>
          )}

          <button
            type="button"
            onClick={() => onOpenOutcomeModal(item)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-blue-500 shadow-2xs"
          >
            <FileCheck className="h-3.5 w-3.5" />
            <span>{item.outcome ? 'Sửa kết quả' : 'Cập nhật kết quả'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

