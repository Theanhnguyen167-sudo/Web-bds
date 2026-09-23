'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { formatCurrencyVND } from '@/lib/utils';
import { useApp } from '@/lib/context/AppContext';
import {
  Building2,
  Copy,
  Check,
  Download,
  ShieldCheck,
  Smartphone,
  ExternalLink,
  QrCode,
  ArrowRight
} from 'lucide-react';

interface VietQRCodeProps {
  amount: number;
  orderId: string;
  onConfirmPayment: () => void;
  isProcessing?: boolean;
}

export const VietQRCode: React.FC<VietQRCodeProps> = ({
  amount,
  orderId,
  onConfirmPayment,
  isProcessing = false,
}) => {
  const { addToast } = useApp();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const bankInfo = {
    bankName: 'Ngân hàng TMCP Ngoại Thương Việt Nam (Vietcombank)',
    shortBankName: 'Vietcombank (VCB)',
    branch: 'Chi nhánh Thăng Long, Hà Nội',
    accountNumber: '1234567890123',
    accountName: 'CÔNG TY CP HANOI REALTY',
    amount: amount,
    transferContent: `HNREALTY ${orderId.slice(0, 10).toUpperCase()}`,
  };

  // Official VietQR API format for auto-filled transaction
  // Format: https://api.vietqr.io/image/<BANK_BIN>-<ACCOUNT_NUMBER>-<TEMPLATE>.jpg?amount=<AMOUNT>&addInfo=<CONTENT>&accountName=<NAME>
  // 970436 is Vietcombank BIN code
  const vietQrUrl = `https://api.vietqr.io/image/970436-${bankInfo.accountNumber}-compact2.jpg?amount=${amount}&addInfo=${encodeURIComponent(
    bankInfo.transferContent
  )}&accountName=${encodeURIComponent(bankInfo.accountName)}`;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    addToast?.(`Đã sao chép ${label}!`, 'success');
    setTimeout(() => setCopiedField(null), 2500);
  };

  const handleDownloadQR = () => {
    const link = document.createElement('a');
    link.href = vietQrUrl;
    link.download = `VietQR_${orderId.slice(0, 8)}.jpg`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast?.('Đang tải mã VietQR về thiết bị...', 'info');
  };

  return (
    <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xl space-y-5 mx-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-sm shadow-md">
            VCB
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-navy flex items-center gap-1.5">
              Chuyển khoản VietQR 24/7
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Napas 247
              </span>
            </h3>
            <p className="text-[11px] text-slate-500">
              Quét mã bằng bất kỳ Ứng dụng Ngân hàng nào
            </p>
          </div>
        </div>

        <button
          onClick={handleDownloadQR}
          className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1.5 rounded-xl border border-emerald-200 transition-colors"
          title="Tải ảnh mã QR"
        >
          <Download className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Lưu mã QR</span>
        </button>
      </div>

      {/* QR Code Container with subtle laser animation */}
      <div className="flex flex-col items-center justify-center">
        <div className="relative p-3.5 rounded-2xl bg-white border-2 border-emerald-200 shadow-inner overflow-hidden">
          {/* Subtle scanning laser */}
          <motion.div
            animate={{ y: [0, 190, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-500 to-transparent shadow-[0_0_8px_#10b981] z-10"
          />

          <img
            src={vietQrUrl}
            alt="VietQR Chuyển Khoản HaNoi Realty"
            className="w-52 h-52 sm:w-56 sm:h-56 object-contain rounded-xl"
            onError={(e) => {
              // Fallback to QR server if external VietQR has network timeout
              (e.target as HTMLImageElement).src = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
                `00020101021238570010A000000727012700069704360113${bankInfo.accountNumber}0208QRIBFTTA5204${amount}53037045802VN5921${bankInfo.accountName}6005HANOI62220818${bankInfo.transferContent}6304`
              )}`;
            }}
          />
        </div>

        <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1">
          <QrCode className="h-3.5 w-3.5 text-emerald-600" />
          <span>Mã QR tự động điền đúng số tiền và nội dung chuyển khoản</span>
        </p>
      </div>

      {/* Structured Account Information Box */}
      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2.5 text-xs text-left">
        
        {/* Bank */}
        <div className="flex justify-between items-center">
          <span className="text-slate-500">Ngân hàng:</span>
          <span className="font-bold text-navy text-right">
            {bankInfo.shortBankName}
          </span>
        </div>

        {/* Account Name */}
        <div className="flex justify-between items-center">
          <span className="text-slate-500">Chủ tài khoản:</span>
          <span className="font-bold text-navy text-right">
            {bankInfo.accountName}
          </span>
        </div>

        {/* Account Number with Copy */}
        <div className="flex justify-between items-center pt-1 border-t border-slate-200/80">
          <span className="text-slate-500">Số tài khoản:</span>
          <div className="flex items-center gap-1.5">
            <span className="font-mono font-black text-emerald-700 text-sm tracking-wide">
              {bankInfo.accountNumber}
            </span>
            <button
              type="button"
              onClick={() => handleCopy(bankInfo.accountNumber, 'Số tài khoản')}
              className="p-1.5 rounded-lg bg-white hover:bg-slate-200 text-slate-600 border border-slate-200 transition-colors"
              title="Sao chép số tài khoản"
            >
              {copiedField === 'Số tài khoản' ? (
                <Check className="h-3.5 w-3.5 text-emerald-600" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Amount with Copy */}
        <div className="flex justify-between items-center">
          <span className="text-slate-500">Số tiền chính xác:</span>
          <div className="flex items-center gap-1.5">
            <span className="font-black text-orange-600 text-base">
              {formatCurrencyVND(amount)}
            </span>
            <button
              type="button"
              onClick={() => handleCopy(amount.toString(), 'Số tiền')}
              className="p-1.5 rounded-lg bg-white hover:bg-slate-200 text-slate-600 border border-slate-200 transition-colors"
              title="Sao chép số tiền"
            >
              {copiedField === 'Số tiền' ? (
                <Check className="h-3.5 w-3.5 text-emerald-600" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Transfer Content with Copy */}
        <div className="flex justify-between items-center pt-1 border-t border-slate-200/80">
          <span className="text-slate-500">Nội dung CK:</span>
          <div className="flex items-center gap-1.5">
            <span className="font-mono font-bold text-navy bg-white px-2 py-0.5 rounded-md border border-slate-300">
              {bankInfo.transferContent}
            </span>
            <button
              type="button"
              onClick={() => handleCopy(bankInfo.transferContent, 'Nội dung chuyển khoản')}
              className="p-1.5 rounded-lg bg-white hover:bg-slate-200 text-slate-600 border border-slate-200 transition-colors"
              title="Sao chép nội dung chuyển khoản"
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

      {/* 4 Steps Instruction */}
      <div className="bg-emerald-50/60 p-3.5 rounded-2xl border border-emerald-100 text-xs text-slate-700 space-y-1.5 text-left">
        <div className="flex items-center gap-2">
          <span className="h-4 w-4 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
            1
          </span>
          <span>Mở <strong>App Ngân hàng bất kỳ</strong> trên điện thoại</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-4 w-4 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
            2
          </span>
          <span>Chọn <strong>Quét mã QR</strong> trên màn hình (Hệ thống tự điền)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-4 w-4 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
            3
          </span>
          <span>Kiểm tra đúng số tiền và bấm <strong>Xác nhận chuyển tiền</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-4 w-4 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
            4
          </span>
          <span>Bấm nút <strong>"Tôi đã hoàn tất chuyển khoản"</strong> bên dưới</span>
        </div>
      </div>

      {/* Action Button: Confirm Transfer */}
      <div className="pt-1">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={onConfirmPayment}
          disabled={isProcessing}
          className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
        >
          <Check className="h-4 w-4 stroke-[3]" />
          <span>Tôi đã hoàn tất chuyển khoản →</span>
        </motion.button>
      </div>

    </div>
  );
};
