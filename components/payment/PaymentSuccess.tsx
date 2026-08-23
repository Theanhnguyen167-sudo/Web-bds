'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { formatCurrencyVND } from '@/lib/utils';
import {
  CheckCircle2,
  Building2,
  Sparkles,
  ArrowRight,
  LayoutDashboard,
  PlusCircle,
  Download,
  Mail,
  ShieldCheck
} from 'lucide-react';

interface PaymentSuccessProps {
  orderId: string;
  method: string;
  amount: number;
  packageName?: string;
  userEmail?: string;
}

export const PaymentSuccess: React.FC<PaymentSuccessProps> = ({
  orderId,
  method,
  amount,
  packageName = 'Pro (1 tháng)',
  userEmail = 'user@example.com',
}) => {
  const methodLabel =
    method === 'momo'
      ? '🌸 Ví MoMo'
      : method === 'vnpay'
      ? '🏦 Cổng VNPay'
      : '🏛️ Chuyển khoản';

  const today = new Date().toLocaleString('vi-VN');
  const expiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('vi-VN');

  return (
    <div className="w-full max-w-lg bg-white rounded-3xl p-8 border border-slate-200 shadow-2xl space-y-6 text-center mx-auto">
      {/* Animated Success Checkmark */}
      <div className="flex justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 12, stiffness: 200 }}
          className="h-20 w-20 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-lg shadow-emerald-500/20"
        >
          <CheckCircle2 className="h-12 w-12 stroke-[2.5]" />
        </motion.div>
      </div>

      <div className="space-y-1">
        <h2 className="text-2xl font-black text-navy">Thanh toán thành công!</h2>
        <p className="text-xs text-slate-500">
          Gói <strong className="text-orange-600">{packageName}</strong> đã được kích hoạt thành công cho tài khoản của bạn.
        </p>
      </div>

      {/* Receipt Card */}
      <div className="bg-slate-50 rounded-2xl p-5 border border-dashed border-slate-300 text-xs space-y-2.5 text-left">
        <div className="flex justify-between">
          <span className="text-slate-500">Mã giao dịch:</span>
          <span className="font-mono font-bold text-navy">{orderId}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-500">Phương thức:</span>
          <span className="font-bold text-slate-700">{methodLabel}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-500">Số tiền:</span>
          <span className="font-black text-orange-600 text-sm">
            {formatCurrencyVND(amount)}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-500">Thời gian:</span>
          <span className="text-slate-700">{today}</span>
        </div>

        <div className="flex justify-between pt-2 border-t border-slate-200">
          <span className="text-slate-500">Thời hạn gói đến:</span>
          <strong className="text-emerald-600 font-bold">{expiryDate}</strong>
        </div>
      </div>

      {/* Feature Badges */}
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="p-2.5 rounded-xl bg-orange-50 border border-orange-100 text-center">
          <span className="font-black text-orange-600 block">50 tin</span>
          <span className="text-[10px] text-slate-500">Đăng BĐS</span>
        </div>
        <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-100 text-center">
          <span className="font-black text-purple-600 block">30 lượt</span>
          <span className="text-[10px] text-slate-500">Báo cáo AI</span>
        </div>
        <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-100 text-center">
          <span className="font-black text-blue-600 block">10 tin</span>
          <span className="text-[10px] text-slate-500">VIP Nổi bật</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-2">
        <Link
          href="/listings/create"
          className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-1.5"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Bắt đầu đăng tin ngay →</span>
        </Link>

        <Link
          href="/dashboard"
          className="w-full py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
        >
          <LayoutDashboard className="h-4 w-4" />
          <span>Về Dashboard cá nhân</span>
        </Link>
      </div>

      <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
        <Mail className="h-3.5 w-3.5 text-slate-400" />
        Hóa đơn điện tử đã được gửi đến: <strong>{userEmail}</strong>
      </p>
    </div>
  );
};
