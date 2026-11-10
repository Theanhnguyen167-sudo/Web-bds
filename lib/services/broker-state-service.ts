/**
 * HaNoi Realty - Dịch vụ điều phối trạng thái bền vững & Workflow phân hệ Môi giới
 * Định vị: XÁC THỰC – RÕ RÀNG – MINH BẠCH – BẢO VỆ QUYỀN LỢI CÁC BÊN
 */

import { AppointmentItem, VisitOutcome } from '@/types/broker-appointment';
import { LeadItem } from '@/types/broker-lead';
import { DealItem, DealStage } from '@/types/broker-deal';
import { BrokerProfile } from '@/types/broker-nav';
import { BROKER_MOCK_APPOINTMENTS } from '@/lib/data/broker-mock-appointments';
import { BROKER_MOCK_LEADS } from '@/lib/data/broker-mock-leads';
import { BROKER_MOCK_DEALS } from '@/lib/data/broker-mock-deals';

const STORAGE_KEYS = {
  APPOINTMENTS: 'hanoi_broker_appointments',
  LEADS: 'hanoi_broker_leads',
  DEALS: 'hanoi_broker_deals',
  PROFILE: 'hanoi_broker_profile',
};

export const DEFAULT_BROKER_PROFILE: BrokerProfile = {
  id: 'usr_broker_01',
  fullName: 'Nguyễn Thế Anh',
  brokerCode: 'CTV-HN1089',
  email: 'theanh.nguyen@hanoirealty.vn',
  phone: '0912 888 999',
  role: 'ctv',
  verificationStatus: 'verified',
  subscriptionTier: 'ctv_monthly',
  referralCode: 'CTV-HN1089',
  teamName: 'Đội nhóm Tây Hồ - Cầu Giấy',
};

/* ==================== 1. PROFILE & SUBSCRIPTION ==================== */

export function getBrokerProfile(): BrokerProfile {
  if (typeof window === 'undefined') return DEFAULT_BROKER_PROFILE;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return DEFAULT_BROKER_PROFILE;
}

export function saveBrokerProfile(profile: BrokerProfile): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    window.dispatchEvent(new CustomEvent('hanoi_broker_profile_updated', { detail: profile }));
  } catch (e) {
    console.error(e);
  }
}

export function activateBrokerSubscription(tier: 'ctv_monthly' | 'tpkd_monthly'): BrokerProfile {
  const current = getBrokerProfile();
  const updated: BrokerProfile = {
    ...current,
    verificationStatus: 'verified',
    subscriptionTier: tier,
    role: tier === 'tpkd_monthly' ? 'tpkd' : 'ctv',
  };
  saveBrokerProfile(updated);
  return updated;
}

/* ==================== 2. APPOINTMENTS (LỊCH HẸN) ==================== */

export function getBrokerAppointments(): AppointmentItem[] {
  if (typeof window === 'undefined') return BROKER_MOCK_APPOINTMENTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error(e);
  }
  return BROKER_MOCK_APPOINTMENTS;
}

export function saveBrokerAppointment(newApt: AppointmentItem): AppointmentItem[] {
  const list = getBrokerAppointments();
  const updated = [newApt, ...list.filter((item) => item.id !== newApt.id)];
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('hanoi_broker_appointments_updated', { detail: updated }));
    } catch (e) {
      console.error(e);
    }
  }
  return updated;
}

export function updateAppointmentOutcomeAndTriggerDeal(
  aptId: string,
  outcome: VisitOutcome
): { updatedAppointments: AppointmentItem[]; createdDeal?: DealItem } {
  const list = getBrokerAppointments();
  const targetApt = list.find((a) => a.id === aptId);
  let createdDeal: DealItem | undefined;

  const updatedAppointments = list.map((item) => {
    if (item.id === aptId) {
      return {
        ...item,
        status: 'completed' as const,
        outcome,
      };
    }
    return item;
  });

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(updatedAppointments));
      window.dispatchEvent(new CustomEvent('hanoi_broker_appointments_updated', { detail: updatedAppointments }));
    } catch (e) {
      console.error(e);
    }
  }

  // Tự động kích hoạt tạo Deal mới nếu khách muốn cọc / đàm phán giá
  if (outcome.advanceToNegotiation && targetApt) {
    createdDeal = createDealFromAppointment(targetApt, outcome);
  }

  return { updatedAppointments, createdDeal };
}

/* ==================== 3. LEADS (CRM KHÁCH HÀNG) ==================== */

export function getBrokerLeads(): LeadItem[] {
  if (typeof window === 'undefined') return BROKER_MOCK_LEADS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LEADS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error(e);
  }
  return BROKER_MOCK_LEADS;
}

export function saveBrokerLead(newLead: LeadItem): LeadItem[] {
  const list = getBrokerLeads();
  const updated = [newLead, ...list.filter((l) => l.id !== newLead.id)];
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('hanoi_broker_leads_updated', { detail: updated }));
    } catch (e) {
      console.error(e);
    }
  }
  return updated;
}

/* ==================== 4. DEALS (PHÒNG GIAO DỊCH DEAL ROOM) ==================== */

export function getBrokerDeals(): DealItem[] {
  if (typeof window === 'undefined') return BROKER_MOCK_DEALS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DEALS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error(e);
  }
  return BROKER_MOCK_DEALS;
}

export function saveBrokerDeals(deals: DealItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.DEALS, JSON.stringify(deals));
    window.dispatchEvent(new CustomEvent('hanoi_broker_deals_updated', { detail: deals }));
  } catch (e) {
    console.error(e);
  }
}

export function createDealFromAppointment(apt: AppointmentItem, outcome: VisitOutcome): DealItem {
  const existingDeals = getBrokerDeals();
  const dealNumber = 2050 + existingDeals.length;
  const agreedPrice = outcome.proposedPrice || 6800000000;
  const totalCommissionRate = 1.5;
  const brokerShareRate = 60;
  const totalCommissionAmount = Math.round((agreedPrice * totalCommissionRate) / 100);
  const brokerCommissionShare = Math.round((totalCommissionAmount * brokerShareRate) / 100);

  const newDeal: DealItem = {
    id: `deal_hn_${Date.now()}`,
    dealCode: `DEAL-HN-${dealNumber}`,
    propertyCode: apt.propertyCode,
    listingTitle: apt.listingTitle,
    listingAddress: apt.meetingAddress,
    agreedPrice,
    stage: 'negotiation',
    stageLabel: '1. Đang thương lượng giá',
    expectedCompletionDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],

    // Thông tin 3 bên
    buyerName: apt.leadName,
    buyerMaskedPhone: apt.leadPhone,
    sellerName: apt.hostName,
    sellerPhone: apt.hostPhone || '0903.xxx.123',
    adminCoordinator: 'Lê Hoàng Quân - Ban Pháp chế',

    // Biểu phí hoa hồng
    totalCommissionRate,
    totalCommissionAmount,
    brokerCommissionShare,
    agreementVersion: 'Thỏa thuận HĐMG v2.4 (2026)',
    escrowBankName: 'MB Bank Ba Đình (Ủy thác giao dịch)',

    milestones: [
      {
        stage: 'negotiation',
        title: 'Bắt đầu đàm phán giá',
        isCompleted: true,
        completedAt: new Date().toISOString(),
        note: `Khách hàng ${apt.leadName} đề xuất mức giá ${agreedPrice.toLocaleString('vi-VN')} đ sau buổi dẫn xem.`,
      },
      {
        stage: 'deposit_agreement',
        title: 'Thỏa thuận cọc thiện chí',
        isCompleted: false,
        targetDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
        note: 'Chuẩn bị hợp đồng cọc 3 bên và xác nhận tài khoản phong tỏa.',
      },
      {
        stage: 'notarization',
        title: 'Ký công chứng chuyển nhượng',
        isCompleted: false,
        targetDate: new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0],
      },
      {
        stage: 'handover_settlement',
        title: 'Bàn giao nhà & Giải ngân hoa hồng',
        isCompleted: false,
        targetDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      },
    ],
    documents: [
      {
        id: `doc_${Date.now()}_1`,
        name: `Biên bản xem nhà xác thực #${apt.propertyCode}.pdf`,
        docType: 'handover_minute',
        docTypeLabel: 'Biên bản dẫn khách',
        fileUrl: '#',
        fileSize: '1.2 MB',
        uploadedAt: new Date().toISOString().split('T')[0],
        uploadedBy: 'Hệ thống tự động',
      },
    ],
    chatLogs: [
      {
        id: `chat_${Date.now()}_init`,
        senderName: 'Hệ thống HaNoi Realty',
        senderRole: 'admin',
        senderRoleLabel: 'Tự động kích hoạt',
        content: `Khách hàng ${apt.leadName} đã xem nhà ngày ${apt.scheduledDate} và có phản hồi tích cực. Phòng deal chính thức được mở để hỗ trợ chuyên viên đàm phán cọc.`,
        timestamp: 'Vừa xong',
      },
    ],
    createdAt: new Date().toISOString(),
  };

  const updatedDeals = [newDeal, ...existingDeals];
  saveBrokerDeals(updatedDeals);
  return newDeal;
}

export function advanceDealStage(dealId: string, nextStage: DealStage): DealItem[] {
  const deals = getBrokerDeals();
  const updated = deals.map((d) => (d.id === dealId ? { ...d, stage: nextStage } : d));
  saveBrokerDeals(updated);
  return updated;
}