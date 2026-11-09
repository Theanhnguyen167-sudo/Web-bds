'use client';

import React from 'react';
import { 
  Building2, 
  User, 
  ShieldCheck, 
  Clock, 
  Calendar, 
  Coins, 
  ArrowRight, 
  CheckCircle2, 
  FileText,
  Briefcase
} from 'lucide-react';
import { DealItem, DealStage } from '@/types/broker-deal';
import { formatCurrencyVND } from '@/lib/utils';

interface DealCardProps {
  deal: DealItem;
  onSelect: (deal: DealItem) => void;
}

export const DealCard: React.FC<DealCardProps> = ({ deal, onSelect }) => {
  const getStageBadge = (stage: DealStage) => {
    switch (stage) {
      case 'negotiation':
        return {
          label: '1. Đang thương lượng giá',
          color: 'bg-blue-50 text-blue-700 border-blue-200',
        };
      case 'deposit_agreement':
        return {
          label: '2. Thỏa thuận cọc',
          color: 'bg-amber-50 text-amber-700 border-amber-200',
        };
      case 'notarization':
        return {
          label: '3. Công chứng pháp lý',
          color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        };
      case 'handover_settlement':
        return {
          label: '4. Bàn giao & Đối soát',
          color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        };
    }
  };

  const stageBadge = getStageBadge(deal.stage);

  return (
    <div
      onClick={() => onSelect(deal)}
      className="group rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs hover:border-blue-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4"
    >
      <div>
        {/* Header Thẻ: Mã Deal + Mã BĐS + Badge tiến độ */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              {deal.dealCode}
            </span>
            <span className="font-mono text-xs font-semibold text-slate-500">
              #{deal.propertyCode}
            </span>
          </div>

          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold border ${stageBadge.color}`}>
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {stageBadge.label}
          </span>
        </div>

        {/* Tiêu đề & Giá trị giao dịch */}
        <div className="mt-3">
          <h4 className="font-bold text-slate-900 text-sm leading-snug line-clamp-1 group-hover:text-blue-600 transition-colors">
            {deal.listingTitle}
          </h4>

          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-xs text-slate-500 font-medium">Giá trị chốt giao dịch:</span>
            <span className="text-lg font-black text-slate-900">
              {formatCurrencyVND(deal.agreedPrice)}
            </span>
          </div>
        </div>

        {/* Tóm tắt 3 bên tham gia */}
        <div className="mt-3 rounded-xl bg-slate-50 p-2.5 space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Khách mua:</span>
            <span className="font-semibold text-slate-800">
              {deal.buyerName} <span className="font-mono text-[11px] text-slate-500">({deal.buyerMaskedPhone})</span>
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">Chủ nhà:</span>
            <span className="font-semibold text-slate-800">{deal.sellerName}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">Admin hỗ trợ:</span>
            <span className="text-blue-700 font-medium truncate max-w-[170px]">{deal.adminCoordinator}</span>
          </div>
        </div>

        {/* Hoa hồng được bảo lưu cho môi giới */}
        <div className="mt-3 rounded-xl bg-amber-50/80 border border-amber-200/70 p-2.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-amber-900 font-bold">
            <Coins className="h-4 w-4 text-amber-600 shrink-0" />
            <span>Hoa hồng bảo lưu:</span>
          </div>
          <div className="text-right">
            <div className="text-sm font-black text-amber-800 font-mono">
              {formatCurrencyVND(deal.brokerCommissionShare)}
            </div>
            <div className="text-[10px] text-amber-700">Theo phiên bản thỏa thuận</div>
          </div>
        </div>
      </div>

      {/* Footer Card */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-slate-400 text-[11px] flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          Dự kiến xong: <strong>{new Date(deal.expectedCompletionDate).toLocaleDateString('vi-VN')}</strong>
        </span>

        <button
          type="button"
          className="inline-flex items-center gap-1 font-bold text-blue-600 hover:text-blue-700 group-hover:translate-x-0.5 transition-transform"
        >
          <span>Vào phòng deal</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};

