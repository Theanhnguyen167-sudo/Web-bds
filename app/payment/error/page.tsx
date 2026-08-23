'use client';

import React, { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  XCircle,
  RotateCcw,
  CreditCard,
  Home,
  PhoneCall,
  Mail,
  ChevronDown,
  Loader2,
  AlertTriangle
} from 'lucide-react';

function ErrorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const reason = searchParams.get('reason') || 'Giao dịch bị hủy hoặc xảy ra lỗi kết nối với cổng thanh toán.';
  const method = searchParams.get('method') || 'vnpay';
  const orderId = searchParams.get('orderId') || '';

  return (
    <div className="min-h-screen bg-page-bg py-12 px-4 flex flex-col justify-center items-center relative">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl p-8 border border-slate-200 shadow-2xl space-y-6 text-center"
      >
        {/* Animated Error Icon */}
        <motion.div
          animate={{ rotate: [-8, 8, -4, 4, 0] }}
          transition={{ duration: 0.5 }}
          className="h-16 w-16 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 mx-auto shadow-md shadow-rose-500/20"
        >
          <XCircle className="h-10 w-10 stroke-[2.5]" />
        </motion.div>

        <div className="space-y-1">
          <h2 className="text-xl font-black text-rose-600">Thanh toán chưa hoàn tất</h2>
          <p className="text-xs text-slate-500">{reason}</p>
          {orderId && (
            <p className="text-[11px] font-mono text-slate-400">
              Mã giao dịch: {orderId}
            </p>
          )}
        </div>

        {/* Common Reasons Accordion Box */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs text-left space-y-2">
          <div className="flex items-center gap-1.5 font-bold text-navy">
            <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
            <span>Nguyên nhân phổ biến có thể do:</span>
          </div>
          <ul className="list-disc list-inside text-slate-600 text-[11px] space-y-1 pl-1">
            <li>Số dư tài khoản ví / thẻ không đủ thanh toán</li>
            <li>Thẻ ATM chưa kích hoạt thanh toán Internet Banking</li>
            <li>Quá thời gian 15 phút xác nhận mã OTP hoặc QR</li>
            <li>Người dùng chủ động bấm Hủy trên ứng dụng</li>
          </ul>
        </div>

        {/* Retry & Alternate Buttons */}
        <div className="space-y-2 pt-2">
          <button
            type="button"
            onClick={() => router.push('/payment/checkout')}
            className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Thử lại giao dịch</span>
          </button>

          <Link
            href="/payment/checkout"
            className="w-full py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
          >
            <CreditCard className="h-4 w-4" />
            <span>Đổi phương thức thanh toán khác</span>
          </Link>

          <Link
            href="/"
            className="w-full py-2 text-xs font-semibold text-slate-400 hover:text-navy transition-colors flex items-center justify-center gap-1"
          >
            <Home className="h-3.5 w-3.5" />
            <span>Quay lại Trang chủ</span>
          </Link>
        </div>

        {/* Support Hotline */}
        <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 space-y-1">
          <p className="font-bold text-navy">Cần hỗ trợ thanh toán khẩn cấp?</p>
          <div className="flex items-center justify-center gap-4 text-slate-600 font-semibold">
            <span className="flex items-center gap-1">
              <PhoneCall className="h-3 w-3 text-orange-500" /> 1800 6868
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Mail className="h-3 w-3 text-orange-500" /> support@hanoirealty.vn
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function PaymentErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
        </div>
      }
    >
      <ErrorContent />
    </Suspense>
  );
}
