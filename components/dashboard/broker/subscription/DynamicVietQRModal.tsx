'use client';

import React, { useState } from 'react';
import {
  X,
  QrCode,
  Copy,
  Check,
  Download,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  Building2,
  RefreshCw,
  Info
} from 'lucide-react';
import { SubscriptionPlan, BillingCycle } from '@/types/broker-subscription';
import { formatCurrencyVND } from '@/lib/utils';

interface DynamicVietQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: SubscriptionPlan;
  brokerCode: string;
  cycle?: BillingCycle;
  onPaymentSuccess?: (planId: string) => void;
}

export const DynamicVietQRModal: React.FC<DynamicVietQRModalProps> = ({
  isOpen,
  onClose,
  plan,
  brokerCode,
  cycle = '1_month',
  onPaymentSuccess,
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  // Xác định số tiền chuẩn: CTV (189.000đ) hoặc TPKD (499.000đ)
  // Nếu có chu kỳ nhân tháng:
  const monthsMultiplier = cycle === '12_months' ? 12 : cycle === '6_months' ? 6 : cycle === '3_months' ? 3 : 1;
  const discountPercent = cycle === '12_months' ? 20 : cycle === '6_months' ? 15 : cycle === '3_months' ? 5 : 0;
  
  const rawTotal = plan.price * monthsMultiplier;
  const discountAmount = Math.round((rawTotal * discountPercent) / 100);
  const finalAmount = rawTotal - discountAmount;

  // Chuẩn hóa tên gói: CTV hoặc TPKD
  const planTag = plan.id === 'tpkd_monthly' ? 'TPKD' : 'CTV';
  // Chuẩn hóa mã môi giới (loại bỏ khoảng trắng, dấu gạch nối)
  const cleanBrokerCode = brokerCode.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  // Cú pháp chuyển khoản chuẩn: HR [MÃ_CTV] GOI [TÊN_GÓI]
  const transferContent = `HR ${cleanBrokerCode} GOI ${planTag}`;

  const bankAccount = {
    bankCode: 'MB',
    bankName: 'Ngân hàng TMCP Quân Đội (MB Bank)',
    accountNumber: '888809129999',
    accountName: 'CONG TY CP CONG NGHE BDS HANOI REALTY',
    branch: 'Sở Giao Dịch Ba Đình - Hà Nội',
  };

  // VietQR QuickLink chuẩn NAPAS 247
  const vietQrUrl = `https://img.vietqr.io/image/${bankAccount.bankCode}-${bankAccount.accountNumber}-compact2.png?amount=${finalAmount}&addInfo=${encodeURIComponent(
    transferContent
  )}&accountName=${encodeURIComponent(bankAccount.accountName)}`;

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleDownloadQR = () => {
    const link = document.createElement('a');
    link.href = vietQrUrl;
    link.download = `VietQR_HaNoiRealty_${cleanBrokerCode}_${planTag}.png`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleConfirmTransfer = () => {
    setIsVerifying(true);
    // Giả lập hệ thống Webhook IPN kiểm tra số dư và kích hoạt gói tức thì
    setTimeout(() => {
      setIsVerifying(false);
      setIsSuccess(true);
      if (onPaymentSuccess) {
        onPaymentSuccess(plan.id);
      }
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-3 sm:p-4 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl border border-slate-100 overflow-hidden my-6">
        
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-xs text-blue-300">
              <QrCode className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold leading-tight">
                Thanh Toán VietQR Tự Động
              </h2>
              <p className="text-xs text-blue-200 font-medium">
                Gói {plan.name} • {monthsMultiplier} tháng
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-blue-200 hover:bg-white/10 hover:text-white transition-colors"
            aria-label="Đóng"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {isSuccess ? (
          /* Màn hình thông báo thanh toán thành công */
          <div className="p-8 text-center space-y-5">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-inner animate-bounce">
              <CheckCircle2 className="h-12 w-12" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-900">
                Kích Hoạt Gói Thành Công!
              </h3>
              <p className="mt-1.5 text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                Hệ thống HaNoi Realty đã nhận được khoản thanh toán cho gói{' '}
                <strong className="text-blue-700 font-bold">{plan.name}</strong> ({cleanBrokerCode}). Hạn sử dụng của bạn đã được gia hạn tự động.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 text-left space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Số tiền thanh toán:</span>
                <span className="font-mono font-bold text-slate-900">{formatCurrencyVND(finalAmount)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Cú pháp ghi nhận:</span>
                <span className="font-mono font-bold text-blue-700">{transferContent}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Trạng thái:</span>
                <span className="font-bold text-emerald-700">Đã kích hoạt quyền lợi</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full rounded-xl bg-blue-600 py-3 text-xs font-bold text-white shadow-md hover:bg-blue-500 transition-all"
            >
              Hoàn tất & Tiếp tục khai thác kho hàng
            </button>
          </div>
        ) : (
          /* Màn hình hiển thị QR & Thông tin chuyển khoản */
          <div className="p-5 sm:p-6 space-y-5 max-h-[85vh] overflow-y-auto">
            
            {/* Tag Cảnh báo quan trọng về nội dung chuyển khoản */}
            <div className="rounded-2xl bg-amber-50 border border-amber-200 p-3.5 text-xs text-amber-900 flex items-start gap-2.5">
              <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <strong>Lưu ý quan trọng:</strong> Vui lòng giữ <strong>chính xác nội dung chuyển khoản</strong> bên dưới để hệ thống đối soát tự động kích hoạt tài khoản trong vòng 30 giây.
              </div>
            </div>

            {/* Khung hiển thị VietQR QuickLink */}
            <div className="flex flex-col items-center justify-center p-4 rounded-3xl bg-gradient-to-b from-slate-50 to-blue-50/40 border border-blue-100 shadow-xs">
              <div className="relative group bg-white p-3 rounded-2xl shadow-sm border border-slate-200">
                {/* Ảnh QR sinh động từ API Napas VietQR */}
                <img
                  src={vietQrUrl}
                  alt={`Mã VietQR ${planTag} ${cleanBrokerCode}`}
                  className="w-56 h-auto sm:w-64 object-contain rounded-xl"
                />
              </div>

              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadQR}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 shadow-2xs transition-colors"
                >
                  <Download className="h-3.5 w-3.5 text-blue-600" />
                  <span>Tải ảnh mã QR</span>
                </button>
                <span className="text-[11px] text-slate-500 font-medium">
                  Quét bằng mọi App Ngân hàng & MoMo
                </span>
              </div>
            </div>

            {/* Chi tiết thông tin chuyển khoản 1-Click Copy */}
            <div className="space-y-2.5">
              
              {/* Số tiền cần chuyển */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Số tiền thanh toán
                  </span>
                  <div className="text-base sm:text-lg font-black font-mono text-blue-700">
                    {formatCurrencyVND(finalAmount)}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(finalAmount.toString(), 'amount')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 shadow-2xs transition-all"
                >
                  {copiedField === 'amount' ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Đã chép</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Sao chép</span>
                    </>
                  )}
                </button>
              </div>

              {/* Nội dung chuyển khoản */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-blue-50/60 border border-blue-200">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block">
                    Nội dung chuyển khoản (bắt buộc)
                  </span>
                  <div className="text-sm sm:text-base font-black font-mono text-slate-900 tracking-wider">
                    {transferContent}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(transferContent, 'content')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 shadow-xs transition-all"
                >
                  {copiedField === 'content' ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-300" />
                      <span>Đã chép!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Sao chép</span>
                    </>
                  )}
                </button>
              </div>

              {/* Tài khoản thụ hưởng */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                  <span className="text-slate-500">Ngân hàng thụ hưởng:</span>
                  <strong className="font-bold text-slate-900 text-right">{bankAccount.bankName}</strong>
                </div>

                <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                  <span className="text-slate-500">Số tài khoản:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-extrabold text-slate-900 text-sm">
                      {bankAccount.accountNumber}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(bankAccount.accountNumber, 'acc')}
                      className="text-blue-600 hover:text-blue-700"
                      title="Sao chép số tài khoản"
                    >
                      {copiedField === 'acc' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Chủ tài khoản:</span>
                  <strong className="font-bold text-slate-900">{bankAccount.accountName}</strong>
                </div>
              </div>

            </div>

            {/* Nút xác nhận thanh toán */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleConfirmTransfer}
                disabled={isVerifying}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-blue-600 py-3.5 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-blue-500 disabled:opacity-50 transition-all"
              >
                {isVerifying ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin text-white" />
                    <span>Đang kiểm tra giao dịch qua Webhook Napas 247...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Tôi đã chuyển khoản thành công</span>
                  </>
                )}
              </button>
              <p className="mt-2 text-center text-[11px] text-slate-400">
                Hệ thống ngân hàng tự động cập nhật trong 10 - 30 giây. Hỗ trợ 24/7: 1900.6868
              </p>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

