/**
 * HaNoi Realty - Types cho phân hệ Gói Dịch Vụ Môi Giới (Subscription)
 * Định vị: XÁC THỰC – RÕ RÀNG – MINH BẠCH – BẢO VỆ QUYỀN LỢI CÁC BÊN
 */

import { SubscriptionTier, BrokerRole } from './broker-nav';

export type SubscriptionPlanId = 'free' | 'ctv_monthly' | 'tpkd_monthly';

export type BillingCycle = '1_month' | '3_months' | '6_months' | '12_months';

export type PaymentMethod = 'vietqr' | 'vnpay' | 'momo';

export type SubscriptionInvoiceStatus = 'paid' | 'pending' | 'failed' | 'refunded';

export interface SubscriptionPlan {
  id: SubscriptionPlanId;
  name: string;
  price: number; // VNĐ
  priceFormatted: string; // VD: "189.000 đ"
  period: string; // VD: "/tháng", "tháng đầu"
  roleTarget: BrokerRole;
  description: string;
  popular?: boolean;
  features: string[];
  limitations?: string[];
  ctaText: string;
  badge?: string;
}

export interface SubscriptionInvoice {
  id: string;
  invoiceCode: string; // VD: "INV-2026-SUB034"
  planId: SubscriptionPlanId;
  planName: string;
  cycle: BillingCycle;
  cycleText: string;
  amount: number; // VNĐ
  paymentMethod: PaymentMethod;
  paymentMethodTitle: string;
  paidAt: string; // ISO
  validFrom: string; // ISO
  validUntil: string; // ISO
  status: SubscriptionInvoiceStatus;
  receiptPdfUrl?: string;
  transactionRef?: string;
}

export interface CurrentSubscriptionInfo {
  tier: SubscriptionTier;
  tierName: string;
  priceFormatted: string;
  validFrom: string;
  expiresAt: string;
  daysRemaining: number;
  isExpired: boolean;
  lastInvoiceCode: string;
  autoRenew: boolean;
  role: BrokerRole;
}

export interface BillingCycleOption {
  cycle: BillingCycle;
  label: string;
  months: number;
  discountPercent: number;
  bonusText?: string;
}
