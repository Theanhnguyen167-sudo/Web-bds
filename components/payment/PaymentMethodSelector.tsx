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
  QrCode,
  ArrowRight
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
    addToast?.(`Đã sao chép ${fieldName}!`, 'success');
    setTimeout(() => setCopiedField(null), 2500);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-extrabold text-sm text-navy uppercase tracking-wider">
          Chọn phương thức thanh toán
        </h3>
        <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
          <ShieldCheck className="h-3.5 w-3.5" /> Bảo mật SSL 256-bit
        </span>
      </div>

      {/* ═══════════════════════════════════════════════════════
          1. VÍ ĐIỆN TỬ MOMO
          ═══════════════════════════════════════════════════════ */}
      <div
        onClick={() => onSelectMethod('momo')}
        className={`rounded-2xl border-2 transition-all p-5 cursor-pointer ${
          selectedMethod === 'momo'
            ? 'border-[#ae2070] bg-pink-50/40 shadow-md ring-2 ring-pink-500/10'
            : 'border-slate-200 bg-white hover:border-pink-300'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-[#ae2070] text-white flex items-center justify-center font-black text-lg shadow-md shrink-0">
              M
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-sm text-navy">Ví MoMo (MoMo QR & App)</h4>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-pink-100 text-[#ae2070]">
                  ⚡ Tức thì
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Quét mã QR động qua ứng dụng MoMo hoặc thanh toán 1 chạm trên điện thoại
              </p>
            </div>
          </div>

          <div
            className={`h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
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
              className="mt-4 pt-4 border-t border-pink-200/70 text-xs space-y-2.5 text-slate-700"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="bg-white p-2.5 rounded-xl border border-pink-100 text-center">
                  <span className="text-[10px] text-slate-400 block">Thời gian xử lý</span>
                  <strong className="text-[#ae2070] text-xs">5 - 10 giây</strong>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-pink-100 text-center">
                  <span className="text-[10px] text-slate-400 block">Phí giao dịch</span>
                  <strong className="text-emerald-600 text-xs">Miễn phí (0đ)</strong>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-pink-100 text-center">
                  <span className="text-[10px] text-slate-400 block">Hạn mức</span>
                  <strong className="text-navy text-xs">50.000.000đ/ngày</strong>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-white p-3 rounded-xl border border-pink-100">
                <QrCode className="h-4 w-4 text-[#ae2070] shrink-0" />
                <span className="text-[11px] text-slate-600">
                  Bước tiếp theo: Hệ thống sẽ hiển thị <strong>Mã MoMo QR Động</strong> và liên kết mở App MoMo để bạn xác nhận ngay.
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ═══════════════════════════════════════════════════════
          2. CỔNG THANH TOÁN VNPAY
          ═══════════════════════════════════════════════════════ */}
      <div
        onClick={() => onSelectMethod('vnpay')}
        className={`rounded-2xl border-2 transition-all p-5 cursor-pointer ${
          selectedMethod === 'vnpay'
            ? 'border-[#0066cc] bg-blue-50/40 shadow-md ring-2 ring-blue-500/10'
            : 'border-slate-200 bg-white hover:border-blue-300'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-red-500 to-blue-600 text-white flex items-center justify-center font-black text-sm shadow-md shrink-0">
              VNP
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-sm text-navy">Cổng thanh toán VNPay</h4>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-[#0066cc]">
                  🏦 40+ Ngân hàng
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                VNPAY-QR, Thẻ ATM Nội địa (Napas), Mobile Banking, Thẻ Visa/Mastercard/JCB
              </p>
            </div>
          </div>

          <div
            className={`h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
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
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-navy">
                  Chọn ngân hàng của bạn (hoặc giữ mặc định):
                </p>
                <span className="text-[11px] text-slate-500">Phí: 0đ</span>
              </div>

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

              <p className="text-[11px] text-slate-500 bg-white p-2.5 rounded-xl border border-blue-100">
                Bước tiếp theo: Bạn sẽ được chuyển tiếp an toàn sang Cổng thanh toán quốc gia VNPay để xác thực OTP SMS hoặc quét VNPAY-QR.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ═══════════════════════════════════════════════════════
          3. CHUYỂN KHOẢN NGÂN HÀNG (VIETQR 24/7)
          ═══════════════════════════════════════════════════════ */}
      <div
        onClick={() => onSelectMethod('bank_transfer')}
        className={`rounded-2xl border-2 transition-all p-5 cursor-pointer ${
          selectedMethod === 'bank_transfer'
            ? 'border-emerald-600 bg-emerald-50/40 shadow-md ring-2 ring-emerald-500/10'
            : 'border-slate-200 bg-white hover:border-emerald-300'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-sm shadow-md shrink-0">
              VCB
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-sm text-navy">Chuyển khoản Ngân hàng (VietQR 24/7)</h4>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                  Napas 247
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Quét mã VietQR trên mọi App Ngân hàng, tự động điền STK, số tiền & nội dung
              </p>
            </div>
          </div>

          <div
            className={`h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
              selectedMethod === 'bank_transfer'
                ? 'border-emerald-600 bg-emerald-600'
                : 'border-slate-300'
            }`}
          >
            {selectedMethod === 'bank_transfer' && (
              <span className="h-2 w-2 rounded-full bg-white" />
            )}
          </div>
        </div>

        {/* Bank Account Info Preview */}
        <AnimatePresence>
          {selectedMethod === 'bank_transfer' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-emerald-200/70 space-y-3 text-xs"
            >
              <div className="bg-white p-3.5 rounded-xl border border-emerald-200 space-y-2 text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-500">Ngân hàng thụ hưởng:</span>
                  <strong className="text-navy font-bold">Vietcombank (VCB) - CN Thăng Long</strong>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Chủ tài khoản:</span>
                  <strong className="text-navy font-bold">CÔNG TY CP HANOI REALTY</strong>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Số tài khoản:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-black text-emerald-700 text-sm">1234 5678 9012 3</span>
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
                  <span className="font-mono font-bold text-navy bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                    HNREALTY {userId.slice(0, 6).toUpperCase()} {packageId.toUpperCase()}
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                Bước tiếp theo: Hệ thống sẽ tạo <strong>Mã VietQR Napas 247</strong> chuẩn xác kèm số tiền đơn hàng để bạn quét trên bất kỳ App Ngân hàng nào.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
};
