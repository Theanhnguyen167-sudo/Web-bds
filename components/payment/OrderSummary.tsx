'use client';

import React, { useState } from 'react';
import { formatCurrencyVND } from '@/lib/utils';
import { useApp } from '@/lib/context/AppContext';
import {
  Check,
  Tag,
  ShieldCheck,
  Lock,
  Sparkles,
  Percent,
  CheckCircle2,
  XCircle
} from 'lucide-react';

interface OrderSummaryProps {
  packageId: string;
  packageName: string;
  priceMonth: number;
  priceYear: number;
  billing: 'monthly' | 'yearly';
  onToggleBilling: (b: 'monthly' | 'yearly') => void;
  features: string[];
  discountAmount: number;
  onApplyPromoCode: (code: string) => void;
  promoApplied?: boolean;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  packageId,
  packageName,
  priceMonth,
  priceYear,
  billing,
  onToggleBilling,
  features,
  discountAmount,
  onApplyPromoCode,
  promoApplied = false,
}) => {
  const { addToast } = useApp();
  const [promoInput, setPromoInput] = useState('');

  const basePrice = billing === 'yearly' ? priceYear : priceMonth;
  const priceAfterDiscount = Math.max(basePrice - discountAmount, 0);
  const vatAmount = Math.round(priceAfterDiscount * 0.1);
  const totalAmount = priceAfterDiscount + vatAmount;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    onApplyPromoCode(promoInput.trim().toUpperCase());
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xl space-y-6 sticky top-24">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <h3 className="font-black text-base text-navy">Đơn hàng của bạn</h3>
        <span className="px-2.5 py-1 rounded-full text-xs font-black bg-orange-500 text-white">
          Gói {packageName}
        </span>
      </div>

      {/* Billing Cycle Toggle */}
      <div className="bg-slate-100 p-1 rounded-2xl flex items-center text-xs font-bold">
        <button
          type="button"
          onClick={() => onToggleBilling('monthly')}
          className={`flex-1 py-2 rounded-xl transition-all ${
            billing === 'monthly'
              ? 'bg-white text-navy shadow-xs'
              : 'text-slate-500 hover:text-navy'
          }`}
        >
          Theo tháng
        </button>
        <button
          type="button"
          onClick={() => onToggleBilling('yearly')}
          className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1 ${
            billing === 'yearly'
              ? 'bg-white text-navy shadow-xs'
              : 'text-slate-500 hover:text-navy'
          }`}
        >
          <span>Theo năm</span>
          <span className="bg-emerald-100 text-emerald-700 text-[10px] px-1.5 py-0.2 rounded font-extrabold">
            -20%
          </span>
        </button>
      </div>

      {/* Package Price Highlight */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
        <span className="text-xs text-slate-500 font-medium">Chi phí gói:</span>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-navy">
            {formatCurrencyVND(basePrice)}
          </span>
          <span className="text-xs text-slate-500 font-semibold">
            {billing === 'monthly' ? '/ tháng' : '/ năm'}
          </span>
        </div>
        {billing === 'yearly' && (
          <p className="text-[11px] text-emerald-600 font-bold">
            🎉 Bạn đã tiết kiệm được {formatCurrencyVND(priceMonth * 12 - priceYear)} so với thanh toán từng tháng!
          </p>
        )}
      </div>

      {/* Promo Code Input */}
      <form onSubmit={handleApplyPromo} className="space-y-2 text-xs">
        <label className="font-bold text-navy flex items-center gap-1">
          <Tag className="h-3.5 w-3.5 text-orange-500" />
          <span>Mã ưu đãi / Voucher (VIP2025)</span>
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={promoInput}
            onChange={(e) => setPromoInput(e.target.value)}
            placeholder="Nhập mã giảm giá..."
            className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl uppercase font-mono font-bold outline-none focus:border-orange-500 focus:bg-white"
          />
          <button
            type="submit"
            className="px-4 py-2.5 bg-navy hover:bg-slate-800 text-white font-bold rounded-xl transition-colors shrink-0"
          >
            Áp dụng
          </button>
        </div>

        {promoApplied && (
          <p className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Đã áp dụng giảm giá {formatCurrencyVND(discountAmount)}!
          </p>
        )}
      </form>

      {/* Line Items Calculations */}
      <div className="space-y-2 text-xs text-slate-600 pt-3 border-t border-slate-100">
        <div className="flex justify-between">
          <span>Gói {packageName} ({billing === 'monthly' ? '1 tháng' : '1 năm'}):</span>
          <span className="font-semibold text-navy">{formatCurrencyVND(basePrice)}</span>
        </div>

        {discountAmount > 0 && (
          <div className="flex justify-between text-emerald-600 font-bold">
            <span>Giảm giá khuyến mãi:</span>
            <span>-{formatCurrencyVND(discountAmount)}</span>
          </div>
        )}

        <div className="flex justify-between">
          <span>Thuế VAT (10%):</span>
          <span className="font-semibold text-navy">{formatCurrencyVND(vatAmount)}</span>
        </div>

        <div className="flex justify-between items-baseline pt-3 border-t border-slate-200">
          <span className="font-extrabold text-navy text-sm">Tổng thanh toán:</span>
          <span className="font-black text-2xl text-orange-600">
            {formatCurrencyVND(totalAmount)}
          </span>
        </div>
      </div>

      {/* Features List */}
      <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
        <p className="font-bold text-navy text-[11px] uppercase tracking-wider">
          Quyền lợi bao gồm trong gói:
        </p>
        <ul className="space-y-1.5 text-slate-600">
          {features.slice(0, 5).map((f, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Security Badges */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
        <span className="flex items-center gap-1">
          <Lock className="h-3.5 w-3.5 text-emerald-500" /> SSL Secure 256-bit
        </span>
        <span>·</span>
        <span>VNPay & MoMo Partner</span>
      </div>
    </div>
  );
};
