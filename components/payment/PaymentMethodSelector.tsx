'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PaymentMethod } from '@/lib/payment/types';
import { VNPAY_BANK_CODES } from '@/lib/payment/vnpay';
import { useApp } from '@/lib/context/AppContext';
import {
  Smartphone,
  CreditCard,
  Building2,
  CheckCircle2,
  Copy,
  Check,
  Zap,
  ShieldCheck,
  QrCode
} from 'lucide-react';

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod;
  onSelectMethod: (method: PaymentMethod) => void;
  selectedBank?: string;
  onSelectBank?: (bankCode: string) => void;
  orderAmount: number;
  userId?: string;
  packageId?: string;
}

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedMethod,
  onSelectMethod,
  selectedBank = 'ALL',
  onSelectBank,
  orderAmount,
  userId = 'user_01',
  packageId = 'pro',
}) => {
  const { addToast } = useApp();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    addToast(`Đã sao chép ${fieldName} vào bộ nhớ tạm!`, 'success');
    setTimeout(() => setCopiedField(null), 2500);
  };

  return (
    <div className="space-y-4">
      <h3 className="font-extrabold text-sm text-navy uppercase tracking-wider">
        Chọn phương thức thanh toán
      </h3>

      {/* ── 1. MOMO CARD ── */}
      <div
        onClick={() => onSelectMethod('momo')}
        className={`rounded-2xl border-2 transition-all p-5 cursor-pointer ${
          selectedMethod === 'momo'
            ? 'border-[#ae2070] bg-pink-50/50 shadow-md ring-2 ring-pink-500/10'
            : 'border-slate-200 bg-white hover:border-pink-300'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-[#ae2070] text-white flex items-center justify-center font-black text-lg shadow-md shrink-0">
              M
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-sm text-navy">Ví MoMo</h4>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-pink-100 text-[#ae2070]">
                  ⚡ Tức thì
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Thanh toán nhanh qua Quét mã QR hoặc Ứng dụng MoMo
              </p>
            </div>
          </div>

          <div
            className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
              selectedMethod === 'momo'
                ? 'border-[#ae2070] bg-[#ae2070]'
                : 'border-slate-300'
            }`}
          >
            {selectedMethod === 'momo' && (
              <span className="h-2 w-2 rounded-full bg-white" />
            )}
          </div>
        </div>

        {/* Expanded Content when Selected */}
        <AnimatePresence>
          {selectedMethod === 'momo' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-pink-200/70 text-xs space-y-2 text-slate-700"
            >
              <div className="flex items-center gap-2 bg-white p-3 rounded-xl border border-pink-100 shadow-2xs">
                <QrCode className="h-4 w-4 text-[#ae2070] shrink-0" />
                <span>
                  Hệ thống sẽ tạo <strong>Mã QR Động</strong> để bạn mở app MoMo quét và thanh toán ngay lập tức.
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
                <span>Hạn mức: Lên đến 50.000.000đ/ngày</span>
                <span className="text-emerald-600 font-bold">Phí giao dịch: Miễn phí (0đ)</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── 2. VNPAY CARD ── */}
      <div
        onClick={() => onSelectMethod('vnpay')}
        className={`rounded-2xl border-2 transition-all p-5 cursor-pointer ${
          selectedMethod === 'vnpay'
            ? 'border-[#0066cc] bg-blue-50/50 shadow-md ring-2 ring-blue-500/10'
            : 'border-slate-200 bg-white hover:border-blue-300'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-red-500 to-blue-600 text-white flex items-center justify-center font-black text-sm shadow-md shrink-0">
              VNP
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-sm text-navy">Cổng thanh toán VNPay</h4>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-[#0066cc]">
                  🏦 40+ Ngân hàng
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Thẻ ATM Nội địa, Mobile Banking, Visa, Mastercard, JCB
              </p>
            </div>
          </div>

          <div
            className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
              selectedMethod === 'vnpay'
                ? 'border-[#0066cc] bg-[#0066cc]'
                : 'border-slate-300'
            }`}
          >
            {selectedMethod === 'vnpay' && (
              <span className="h-2 w-2 rounded-full bg-white" />
            )}
          </div>
        </div>

        {/* Expanded Bank Selector */}
        <AnimatePresence>
          {selectedMethod === 'vnpay' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-blue-200/70 space-y-3"
            >
              <p className="text-xs font-bold text-navy">
                Chọn ngân hàng hoặc hình thức thanh toán (tùy chọn):
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {VNPAY_BANK_CODES.map((bank) => (
                  <button
                    key={bank.code}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectBank?.(bank.code);
                    }}
                    className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all text-left ${
                      selectedBank === bank.code
                        ? 'border-[#0066cc] bg-blue-100/70 text-[#0066cc] shadow-2xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span>{bank.logo}</span>
                    <span className="truncate text-[11px]">{bank.name}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── 3. BANK TRANSFER CARD ── */}
      <div
        onClick={() => onSelectMethod('bank_transfer')}
        className={`rounded-2xl border-2 transition-all p-5 cursor-pointer ${
          selectedMethod === 'bank_transfer'
            ? 'border-orange-500 bg-orange-50/50 shadow-md ring-2 ring-orange-500/10'
            : 'border-slate-200 bg-white hover:border-orange-300'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-orange-500 text-white flex items-center justify-center font-black text-lg shadow-md shrink-0">
              🏛️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-sm text-navy">Chuyển khoản Ngân hàng</h4>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                  Xử lý 1-4 giờ
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Chuyển khoản trực tiếp tới tài khoản công ty HaNoi Realty
              </p>
            </div>
          </div>

          <div
            className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
              selectedMethod === 'bank_transfer'
                ? 'border-orange-500 bg-orange-500'
                : 'border-slate-300'
            }`}
          >
            {selectedMethod === 'bank_transfer' && (
              <span className="h-2 w-2 rounded-full bg-white" />
            )}
          </div>
        </div>

        {/* Bank Account Info */}
        <AnimatePresence>
          {selectedMethod === 'bank_transfer' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-orange-200/70 space-y-3 text-xs"
            >
              <div className="bg-white p-4 rounded-xl border border-orange-200 space-y-2.5 shadow-2xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Ngân hàng:</span>
                  <strong className="text-navy font-bold">Vietcombank - CN Thăng Long</strong>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Chủ tài khoản:</span>
                  <strong className="text-navy font-bold">CÔNG TY CP HANOI REALTY</strong>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Số tài khoản:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-orange-600 text-sm">1234 5678 9012 3</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy('1234567890123', 'Số tài khoản');
                      }}
                      className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600"
                      title="Sao chép"
                    >
                      {copiedField === 'Số tài khoản' ? (
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Nội dung CK:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-navy bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                      HNREALTY {userId.slice(0, 6).toUpperCase()} {packageId.toUpperCase()}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(`HNREALTY ${userId.slice(0, 6).toUpperCase()} ${packageId.toUpperCase()}`, 'Nội dung chuyển khoản');
                      }}
                      className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600"
                      title="Sao chép"
                    >
                      {copiedField === 'Nội dung chuyển khoản' ? (
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-amber-700 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                ⚠️ Lưu ý: Gói dịch vụ sẽ được kích hoạt tự động ngay sau khi bộ phận kế toán xác nhận giao dịch (tối đa 4 giờ làm việc).
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
