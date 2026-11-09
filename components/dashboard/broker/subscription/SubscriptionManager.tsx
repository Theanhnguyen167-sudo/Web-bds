'use client';

import React, { useState } from 'react';
import {
  CreditCard,
  Check,
  ShieldAlert,
  Sparkles,
  Crown,
  AlertTriangle,
  Calendar,
  Receipt,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { BrokerProfile, SubscriptionTier } from '@/types/broker-nav';
import { SubscriptionPlan, BillingCycle } from '@/types/broker-subscription';
import {
  MOCK_SUBSCRIPTION_PLANS,
  MOCK_CURRENT_SUBSCRIPTION,
  MOCK_SUBSCRIPTION_INVOICES
} from '@/lib/data/broker-mock-subscriptions';
import { SubscriptionPaymentModal } from './SubscriptionPaymentModal';
import { SubscriptionBillingHistory } from './SubscriptionBillingHistory';

interface SubscriptionManagerProps {
  profile?: BrokerProfile;
}

export const SubscriptionManager: React.FC<SubscriptionManagerProps> = ({ profile }) => {
  // Trạng thái tier hiện tại lấy từ props hoặc mock
  const currentTier: SubscriptionTier = profile?.subscriptionTier || 'ctv_monthly';
  const isExpired = currentTier === 'expired';
  const brokerCode = profile?.brokerCode || 'CTV-HN1089';

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedPlanForPayment, setSelectedPlanForPayment] = useState<SubscriptionPlan>(
    MOCK_SUBSCRIPTION_PLANS[1]
  );
  const [invoices, setInvoices] = useState(MOCK_SUBSCRIPTION_INVOICES);

  // Xử lý khi thanh toán thành công
  const handlePaymentSuccess = (planId: string, cycle: BillingCycle) => {
    const targetPlan = MOCK_SUBSCRIPTION_PLANS.find((p) => p.id === planId) || MOCK_SUBSCRIPTION_PLANS[1];
    const newInvoice = {
      id: `sub-inv-${Date.now()}`,
      invoiceCode: `INV-2026-SUB${Math.floor(100 + Math.random() * 900)}`,
      planId: targetPlan.id,
      planName: `${targetPlan.name} (${cycle.replace('_', ' ')})`,
      cycle,
      cycleText: cycle === '1_month' ? '1 Tháng' : cycle === '3_months' ? '3 Tháng' : cycle === '6_months' ? '6 Tháng' : '12 Tháng',
      amount: targetPlan.price * (cycle === '1_month' ? 1 : cycle === '3_months' ? 3 : cycle === '6_months' ? 6 : 12),
      paymentMethod: 'vietqr' as const,
      paymentMethodTitle: 'VietQR - Quét mã ngân hàng',
      paidAt: new Date().toISOString(),
      validFrom: new Date().toISOString(),
      validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'paid' as const,
      receiptPdfUrl: '/receipts/inv-new.pdf',
      transactionRef: `FT${Date.now()}`,
    };
    setInvoices([newInvoice, ...invoices]);
  };

  const handleOpenPayment = (plan: SubscriptionPlan) => {
    setSelectedPlanForPayment(plan);
    setPaymentModalOpen(true);
  };

  // Xác định tên hiển thị của gói hiện tại
  const getTierDisplayInfo = () => {
    if (isExpired) {
      return {
        title: 'Gói Đã Hết Hạn',
        badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
        cardBg: 'bg-gradient-to-r from-rose-50 to-orange-50 border-rose-200',
        expiresDateText: 'Đã hết hạn vào 31/03/2026',
      };
    }
    if (currentTier === 'tpkd_monthly' || profile?.role === 'tpkd') {
      return {
        title: 'Gói TPKD Quản Trị',
        badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
        cardBg: 'bg-gradient-to-r from-purple-50 via-indigo-50 to-white border-purple-200',
        expiresDateText: 'Có hiệu lực đến 01/10/2026 (Còn 174 ngày)',
      };
    }
    if (currentTier === 'free') {
      return {
        title: 'CTV Free Trải Nghiệm',
        badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
        cardBg: 'bg-gradient-to-r from-blue-50 to-slate-50 border-blue-200',
        expiresDateText: 'Có hiệu lực đến 15/05/2026 (Còn 35 ngày)',
      };
    }
    return {
      title: 'Gói CTV Tiêu Chuẩn',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      cardBg: 'bg-gradient-to-r from-blue-50 via-emerald-50 to-white border-emerald-200',
      expiresDateText: 'Có hiệu lực đến 01/06/2026 (Còn 52 ngày)',
    };
  };

  const tierInfo = getTierDisplayInfo();

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Banner Sticky Cảnh Báo Nếu Hết Hạn Gói */}
      {isExpired && (
        <div className="sticky top-16 z-30 rounded-2xl border-2 border-rose-400 bg-rose-50/95 backdrop-blur-md p-4 sm:p-5 shadow-lg animate-in slide-in-from-top-2 duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-600 text-white shadow-md">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-rose-950 flex items-center gap-2">
                  Gói dịch vụ của bạn đã hết hạn sử dụng
                  <span className="rounded-full bg-rose-200 px-2.5 py-0.5 text-[11px] font-bold text-rose-800">
                    Expired
                  </span>
                </h3>
                <p className="text-xs text-rose-800 mt-1 leading-relaxed">
                  <strong>Cam kết bảo lưu quyền lợi HaNoi Realty:</strong> Toàn bộ hoa hồng và hồ sơ khách hàng đã phát sinh trước đây vẫn được giữ nguyên vẹn 100%. Vui lòng gia hạn gói để mở lại quyền khai thác kho nhà mở và tính năng đăng ký bảo lưu mới.
                </p>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={() => handleOpenPayment(MOCK_SUBSCRIPTION_PLANS[1])}
                className="rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-rose-500 shadow-md transition-colors flex items-center gap-1.5"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Gia hạn gói ngay (189k)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header Phân Hệ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <CreditCard className="h-6 w-6 text-blue-600" />
            Gói Dịch Vụ Môi Giới & Đội Nhóm
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Lựa chọn gói công cụ khai thác kho nhà và điều hành đội nhóm minh bạch, tối ưu chi phí.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Mã môi giới:</span>
          <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-lg">
            {brokerCode}
          </span>
        </div>
      </div>

      {/* Quy Chuẩn & Lưu Ý Bắt Buộc Của Sàn */}
      <div className="rounded-2xl bg-amber-50/80 border border-amber-200 p-4 text-xs text-amber-950 flex items-start gap-3">
        <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="font-bold">Quy chuẩn tính minh bạch của HaNoi Realty:</strong> Việc mua gói dịch vụ công cụ là chi phí duy trì phần mềm và hệ thống tra cứu. <em>Mua gói không tự động thay thế cho chứng chỉ hành nghề môi giới BĐS</em>. Mọi giao dịch cọc và hoa hồng đều tuân thủ thỏa thuận độc lập từng căn nhà.
        </div>
      </div>

      {/* THẺ HIỂN THỊ GÓI HIỆN TẠI (Current Plan Card) */}
      <div className={`rounded-2xl border p-6 shadow-xs ${tierInfo.cardBg} transition-all`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className={`text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${tierInfo.badgeColor}`}>
                {tierInfo.title}
              </span>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                {tierInfo.expiresDateText}
              </span>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                {isExpired ? 'Tài khoản đang tạm dừng gói công cụ' : 'Bạn đang có toàn quyền truy cập gói công cụ'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Biên nhận thanh toán gần nhất:{' '}
                <span className="font-mono font-bold text-slate-800">
                  {MOCK_CURRENT_SUBSCRIPTION.lastInvoiceCode}
                </span>{' '}
                • Trạng thái tự động gia hạn: <span className="font-medium text-slate-600">Tắt (Chủ động kiểm soát)</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {isExpired ? (
              <button
                onClick={() => handleOpenPayment(MOCK_SUBSCRIPTION_PLANS[1])}
                className="px-5 py-2.5 rounded-xl bg-rose-600 text-xs font-bold text-white hover:bg-rose-500 shadow-md transition-colors flex items-center gap-1.5"
              >
                <RefreshCw className="h-4 w-4" />
                Gia hạn gói ngay
              </button>
            ) : (
              <>
                <button
                  onClick={() => handleOpenPayment(MOCK_SUBSCRIPTION_PLANS[1])}
                  className="px-4 py-2 rounded-xl bg-white border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <RefreshCw className="h-3.5 w-3.5 text-slate-500" />
                  Gia hạn thêm kỳ mới
                </button>
                <button
                  onClick={() => handleOpenPayment(MOCK_SUBSCRIPTION_PLANS[2])}
                  className="px-4 py-2 rounded-xl bg-purple-600 text-xs font-bold text-white hover:bg-purple-500 shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <Crown className="h-3.5 w-3.5" />
                  Nâng cấp TPKD (499k)
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* BẢNG SO SÁNH 3 GÓI DỊCH VỤ */}
      <div className="space-y-4">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <h3 className="text-lg font-bold text-slate-900">
            Bảng So Sánh Quyền Lợi Các Gói Môi Giới
          </h3>
          <p className="text-xs text-slate-500">
            Mọi gói đều bảo lưu 100% quyền hoa hồng từ các giao dịch thành công theo quy chế sàn.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {MOCK_SUBSCRIPTION_PLANS.map((plan) => {
            const isPlanCurrent = !isExpired && currentTier === plan.id;
            const isPlanTpkd = plan.id === 'tpkd_monthly';

            return (
              <div
                key={plan.id}
                className={`rounded-2xl p-6 flex flex-col justify-between transition-all bg-white relative ${
                  plan.popular
                    ? 'border-2 border-blue-600 shadow-xl ring-2 ring-blue-600/10'
                    : isPlanTpkd
                    ? 'border-2 border-purple-400 shadow-md'
                    : 'border border-slate-200 shadow-xs'
                }`}
              >
                {/* Badge nổi bật */}
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-3 py-0.5 text-[10px] font-extrabold text-white uppercase tracking-wider shadow-sm">
                    {plan.badge}
                  </span>
                )}
                {isPlanTpkd && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-purple-600 px-3 py-0.5 text-[10px] font-extrabold text-white uppercase tracking-wider shadow-sm">
                    {plan.badge}
                  </span>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                      {plan.name}
                      {isPlanTpkd && <Crown className="h-4 w-4 text-purple-600" />}
                    </h4>
                    {isPlanCurrent && (
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                        Đang dùng
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 mt-1 min-h-[36px]">{plan.description}</p>

                  <div className="my-5 border-y border-slate-100 py-3">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                        {plan.priceFormatted}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">{plan.period}</span>
                    </div>
                  </div>

                  {/* Danh sách quyền lợi */}
                  <div className="space-y-2.5 text-xs">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Quyền lợi bao gồm:
                    </div>
                    {plan.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2 text-slate-700">
                        <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}

                    {/* Giới hạn nếu có */}
                    {plan.limitations && plan.limitations.length > 0 && (
                      <div className="pt-2 space-y-1.5 border-t border-slate-100">
                        {plan.limitations.map((lim, lIdx) => (
                          <div key={lIdx} className="flex items-start gap-2 text-slate-400 text-[11px]">
                            <span className="text-slate-300">•</span>
                            <span>{lim}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    type="button"
                    onClick={() => handleOpenPayment(plan)}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      isPlanCurrent
                        ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        : isPlanTpkd
                        ? 'bg-purple-600 text-white hover:bg-purple-500 shadow-md'
                        : plan.popular
                        ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-md'
                        : 'bg-slate-900 text-white hover:bg-slate-800'
                    }`}
                  >
                    <span>{isPlanCurrent ? 'Gia hạn gói này' : plan.ctaText}</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* BẢNG LỊCH SỬ CÁC KỲ THANH TOÁN GÓI */}
      <SubscriptionBillingHistory invoices={invoices} />

      {/* MODAL THANH TOÁN VIETQR / VNPAY / MOMO */}
      <SubscriptionPaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        selectedPlan={selectedPlanForPayment}
        brokerCode={brokerCode}
        onPaymentSuccess={handlePaymentSuccess}
      />

    </div>
  );
};
