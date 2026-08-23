'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { QrCode, Smartphone, RefreshCw } from 'lucide-react';
import { formatCurrencyVND } from '@/lib/utils';

interface MoMoQRCodeProps {
  qrCodeUrl?: string;
  amount: number;
  orderId: string;
  isExpired?: boolean;
  onRefreshQR?: () => void;
}

export const MoMoQRCode: React.FC<MoMoQRCodeProps> = ({
  qrCodeUrl,
  amount,
  orderId,
  isExpired = false,
  onRefreshQR,
}) => {
  const qrImage =
    qrCodeUrl ||
    `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=momo://pay?orderId=${orderId}&amount=${amount}`;

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xl flex flex-col items-center text-center space-y-4 max-w-sm mx-auto">
      {/* MoMo Header */}
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-xl bg-[#ae2070] text-white font-black text-sm flex items-center justify-center shadow-md">
          M
        </div>
        <span className="font-black text-sm text-navy">Thanh toán MoMo QR</span>
      </div>

      {/* QR Code Container with Scanning line */}
      <div className="relative p-4 rounded-2xl bg-white border-2 border-pink-200 shadow-inner overflow-hidden">
        {/* Animated Scanning Line */}
        {!isExpired && (
          <motion.div
            animate={{ y: [0, 180, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#ae2070] to-transparent shadow-[0_0_8px_#ae2070] z-10"
          />
        )}

        {/* QR Image */}
        <div className={`relative ${isExpired ? 'filter grayscale opacity-30' : ''}`}>
          <img
            src={qrImage}
            alt="MoMo QR Code"
            className="w-48 h-48 object-contain rounded-xl"
          />
        </div>

        {/* Expired Overlay */}
        {isExpired && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-white z-20 space-y-2">
            <span className="text-xs font-bold text-rose-300">Mã QR đã hết hạn</span>
            <button
              onClick={onRefreshQR}
              className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 rounded-xl text-xs font-bold flex items-center gap-1 shadow-md"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Tạo lại mã
            </button>
          </div>
        )}
      </div>

      {/* Amount Display */}
      <div className="space-y-0.5">
        <span className="text-xs text-slate-400 font-medium">Số tiền thanh toán:</span>
        <p className="text-2xl font-black text-orange-600">
          {formatCurrencyVND(amount)}
        </p>
      </div>

      {/* 3 Step Instruction */}
      <div className="w-full bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs text-slate-600 space-y-1 text-left">
        <div className="flex items-center gap-2">
          <span className="h-5 w-5 rounded-full bg-pink-100 text-[#ae2070] font-bold text-[10px] flex items-center justify-center shrink-0">
            1
          </span>
          <span>Mở ứng dụng <strong>MoMo</strong> trên điện thoại</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-5 w-5 rounded-full bg-pink-100 text-[#ae2070] font-bold text-[10px] flex items-center justify-center shrink-0">
            2
          </span>
          <span>Chọn biểu tượng <strong>Quét mã QR</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-5 w-5 rounded-full bg-pink-100 text-[#ae2070] font-bold text-[10px] flex items-center justify-center shrink-0">
            3
          </span>
          <span>Xác nhận giao dịch để hoàn tất</span>
        </div>
      </div>
    </div>
  );
};
