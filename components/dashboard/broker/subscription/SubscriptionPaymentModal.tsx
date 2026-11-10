'use client';

import React, { useState } from 'react';
import {
  X,
  QrCode,
  CreditCard,
  Wallet,
  CheckCircle2,
  Copy,
  Check,
  Download,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Clock
} from 'lucide-react';
import {
  SubscriptionPlan,
  BillingCycle,
  PaymentMethod
} from '@/types/broker-subscription';
import { MOCK_BILLING_CYCLES } from '@/lib/data/broker-mock-subscriptions';

interface SubscriptionPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: SubscriptionPlan;
  brokerCode: string;
  onPaymentSuccess?: (planId: string, cycle: BillingCycle) => void;
}

export const SubscriptionPaymentModal: React.FC<SubscriptionPaymentModalProps> = ({
  isOpen,
  onClose,
  selectedPlan,
  brokerCode,
  onPaymentSuccess,
}) => {
  const [selectedCycle, setSelectedCycle] = useState<BillingCycle>('3_months');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('vietqr');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const currentCycleOpt = MOCK_BILLING_CYCLES.find((c) => c.cycle === selectedCycle) || MOCK_BILLING_CYCLES[0];
  
  // Tính tổng số tiền dựa trên chu kỳ và chiết khấu
  const rawTotal = selectedPlan.price * currentCycleOpt.months;
  const discountAmount = Math.round((rawTotal * currentCycleOpt.discountPercent) / 100);
  const finalAmount = rawTotal - discountAmount;

  // Cú pháp chuyển khoản định danh chuẩn Napas VietQR: HR [MÃ_CTV] GOI [TÊN_GÓI]
  const planTag = selectedPlan.id === 'tpkd_monthly' ? 'TPKD' : 'CTV';
  const cleanBrokerCode = brokerCode.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  const transferContent = `HR ${cleanBrokerCode} GOI ${planTag}`;
  const bankInfo = {
    bankName: 'Ngân hàng TMCP Quân Đội (MB Bank)',
    accountNumber: '888809129999',
    accountName: 'CONG TY CP CONG NGHE BĐS HANOI REALTY',
    branch: 'Chi nhánh Ba Đình - Hà Nội',
  };

  // URL VietQR tạo mã động theo chuẩn NAPAS 247
  const vietQrUrl = `https://img.vietqr.io/image/MB-${bankInfo.accountNumber}-compact2.png?amount=${finalAmount}&addInfo=${encodeURIComponent(
    transferContent
  )}&accountName=${encodeURIComponent(bankInfo.accountName)}`;

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      if (onPaymentSuccess) {
        onPaymentSuccess(selectedPlan.id, selectedCycle);
      }
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/70 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Thanh Toán Đăng Ký / Gia Hạn Gói Dịch Vụ
              </h2>
              <p className="text-xs text-slate-500">
                Mã môi giới: <span className="font-semibold text-blue-600">{brokerCode}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {isSuccess ? (
          /* Màn hình thông báo thành công */
          <div className="p-8 text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 animate-bounce">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Kích Hoạt Gói Dịch Vụ Thành Công!
            </h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Bạn đã kích hoạt thành công <strong>{selectedPlan.name}</strong> ({currentCycleOpt.label}). Hệ thống đã cộng thêm thời hạn vào tài khoản và gửi biên nhận điện tử qua email.
            </p>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 max-w-md mx-auto text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Gói đăng ký:</span>
                <span className="font-semibold text-slate-900">{selectedPlan.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Thời gian hiệu lực:</span>
                <span className="font-semibold text-slate-900">{currentCycleOpt.months} tháng</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Số tiền thanh toán:</span>
                <span className="font-bold text-emerald-600">{finalAmount.toLocaleString('vi-VN')} đ</span>
              </div>
            </div>
            <div className="pt-4">
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 font-semibold text-white hover:bg-blue-500 shadow-sm transition-colors text-sm"
              >
                Hoàn tất & Tiếp tục làm việc
              </button>
            </div>
          </div>
        ) : (
          /* Màn hình chọn chu kỳ & thanh toán */
          <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            
            {/* Tóm tắt gói đang chọn */}
            <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">
                  Gói dịch vụ đã chọn
                </span>
                <h4 className="text-lg font-bold text-slate-900">{selectedPlan.name}</h4>
                <p className="text-xs text-slate-600 mt-0.5">{selectedPlan.description}</p>
              </div>
              <div className="text-right shrink-0">
                <div className="text-xs text-slate-500">Đơn giá tiêu chuẩn</div>
                <div className="text-lg font-extrabold text-blue-700">{selectedPlan.priceFormatted}{selectedPlan.period}</div>
              </div>
            </div>

            {/* Bước 1: Chọn chu kỳ thanh toán */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                1. Chọn chu kỳ thanh toán
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {MOCK_BILLING_CYCLES.map((cycle) => {
                  const isCurrent = selectedCycle === cycle.cycle;
                  return (
                    <button
                      key={cycle.cycle}
                      type="button"
                      onClick={() => setSelectedCycle(cycle.cycle)}
                      className={`relative rounded-xl border p-3 text-left transition-all ${
                        isCurrent
                          ? 'border-blue-600 bg-blue-50/60 shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      {cycle.discountPercent > 0 && (
                        <span className="absolute -top-2 right-2 rounded-full bg-emerald-600 px-1.5 py-0.2 text-[10px] font-bold text-white">
                          -{cycle.discountPercent}%
                        </span>
                      )}
                      <div className="text-xs font-bold text-slate-900">{cycle.label}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{cycle.bonusText}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bước 2: Chọn phương thức thanh toán */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                2. Chọn phương thức thanh toán
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('vietqr')}
                  className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-all ${
                    paymentMethod === 'vietqr'
                      ? 'border-blue-600 bg-blue-50/60 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <QrCode className="h-5 w-5 text-blue-600" />
                  <span className="text-xs font-bold text-slate-900">VietQR Tự Động</span>
                  <span className="text-[10px] text-slate-500">Khuyên dùng • Nhanh nhất</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('vnpay')}
                  className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-all ${
                    paymentMethod === 'vnpay'
                      ? 'border-blue-600 bg-blue-50/60 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <CreditCard className="h-5 w-5 text-indigo-600" />
                  <span className="text-xs font-bold text-slate-900">Cổng VNPAY</span>
                  <span className="text-[10px] text-slate-500">Thẻ ATM / QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('momo')}
                  className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-all ${
                    paymentMethod === 'momo'
                      ? 'border-blue-600 bg-blue-50/60 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <Wallet className="h-5 w-5 text-pink-600" />
                  <span className="text-xs font-bold text-slate-900">Ví MoMo</span>
                  <span className="text-[10px] text-slate-500">Quét app MoMo</span>
                </button>
              </div>
            </div>

            {/* Chi tiết thanh toán */}
            {paymentMethod === 'vietqr' ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <QrCode className="h-4 w-4 text-blue-600" />
                  Quét mã VietQR chuyển khoản (Hệ thống tự động kích hoạt sau 10s)
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  {/* Mã QR */}
                  <div className="sm:col-span-5 flex flex-col items-center justify-center p-3 rounded-xl bg-white border border-slate-200 shadow-xs">
                    <img
                      src={vietQrUrl}
                      alt="VietQR Hanoi Realty"
                      className="w-44 h-44 object-contain rounded-lg"
                    />
                    <div className="text-[10px] text-slate-500 mt-2 text-center flex items-center gap-1">
                      <Clock className="h-3 w-3 text-amber-500" /> Mã có hiệu lực trong 15 phút
                    </div>
                  </div>

                  {/* Thông tin chuyển khoản sao chép */}
                  <div className="sm:col-span-7 space-y-2.5 text-xs">
                    <div>
                      <span className="text-slate-500 block text-[11px]">Ngân hàng thụ hưởng:</span>
                      <span className="font-bold text-slate-900">{bankInfo.bankName}</span>
                    </div>

                    <div>
                      <span className="text-slate-500 block text-[11px]">Số tài khoản:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-blue-700">{bankInfo.accountNumber}</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(bankInfo.accountNumber, 'acc')}
                          className="p-1 text-slate-500 hover:text-blue-600 rounded bg-white border border-slate-200"
                          title="Sao chép STK"
                        >
                          {copiedField === 'acc' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <span className="text-slate-500 block text-[11px]">Chủ tài khoản:</span>
                      <span className="font-semibold text-slate-800">{bankInfo.accountName}</span>
                    </div>

                    <div>
                      <span className="text-slate-500 block text-[11px]">Số tiền cần chuyển:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-extrabold text-base text-emerald-600">
                          {finalAmount.toLocaleString('vi-VN')} đ
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(finalAmount.toString(), 'amount')}
                          className="p-1 text-slate-500 hover:text-blue-600 rounded bg-white border border-slate-200"
                          title="Sao chép số tiền"
                        >
                          {copiedField === 'amount' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <span className="text-slate-500 block text-[11px]">Nội dung chuyển khoản (bắt buộc):</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-300">
                          {transferContent}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(transferContent, 'content')}
                          className="p-1 text-slate-500 hover:text-blue-600 rounded bg-white border border-slate-200"
                          title="Sao chép nội dung"
                        >
                          {copiedField === 'content' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Cổng thanh toán trực tuyến */
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-6 text-center space-y-3">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  {paymentMethod === 'vnpay' ? <CreditCard className="h-6 w-6" /> : <Wallet className="h-6 w-6" />}
                </div>
                <h5 className="font-bold text-slate-900 text-sm">
                  Thanh toán qua cổng {paymentMethod === 'vnpay' ? 'VNPAY-QR / Thẻ nội địa' : 'Ví điện tử MoMo'}
                </h5>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Bạn sẽ được chuyển hướng tới cổng thanh toán an toàn để xác nhận giao dịch số tiền{' '}
                  <strong className="text-slate-900">{finalAmount.toLocaleString('vi-VN')} đ</strong>.
                </p>
              </div>
            )}

            {/* Tóm tắt thanh toán & Nút hành động */}
            <div className="border-t border-slate-200 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="text-xs text-slate-500">Tổng tiền thanh toán ({currentCycleOpt.label})</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-extrabold text-blue-700">
                    {finalAmount.toLocaleString('vi-VN')} đ
                  </span>
                  {discountAmount > 0 && (
                    <span className="text-xs text-slate-400 line-through">
                      {rawTotal.toLocaleString('vi-VN')} đ
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleSimulatePayment}
                  disabled={isProcessing}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 font-semibold text-white hover:bg-blue-500 shadow-sm transition-colors text-xs flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isProcessing ? (
                    'Đang kiểm tra giao dịch...'
                  ) : (
                    <>
                      <span>Xác nhận thanh toán</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              Giao dịch được mã hóa và bảo mật theo chuẩn NAPAS 247 & SSL 256-bit.
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

