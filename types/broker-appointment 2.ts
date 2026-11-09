/**
 * HaNoi Realty - Types cho phân hệ Quản lý lịch hẹn dẫn khách môi giới
 * Định vị: XÁC THỰC – RÕ RÀNG – MINH BẠCH – BẢO VỆ QUYỀN LỢI CÁC BÊN
 */

export type AppointmentStatus =
  | 'pending_host'       // Chờ chủ nhà xác nhận
  | 'confirmed'          // Chủ nhà đã xác nhận đón tiếp
  | 'completed'          // Đã hoàn thành buổi dẫn xem
  | 'cancelled'          // Đã hủy lịch
  | 'rescheduled';       // Đã đổi khung giờ

export type ClientInterestLevel = 'high' | 'medium' | 'low';

export interface VisitOutcome {
  interestLevel: ClientInterestLevel;
  feedbackNote: string;
  proposedPrice?: number; // Mức giá khách đề xuất (VND)
  advanceToNegotiation: boolean; // Chuyển sang giai đoạn đàm phán cọc
  checkinPhotoUrl?: string; // Ảnh check-in hoặc chứng từ xác nhận
  recordedAt: string; // ISO
}

export interface AppointmentItem {
  id: string;
  leadId?: string;
  leadName: string;
  leadPhone: string; // VD: 0912.xxx.789
  rawLeadPhone?: string;
  listingId: string;
  propertyCode: string; // VD: HR-BDS-1024
  listingTitle: string;
  meetingAddress: string;
  scheduledDate: string; // YYYY-MM-DD
  scheduledTimeSlot: string; // VD: "09:00 - 10:00"
  scheduledTimestamp: string; // ISO String for countdown
  status: AppointmentStatus;
  hostName: string;
  hostPhone?: string;
  hostConfirmedAt?: string;
  noteToHost?: string;
  brokerNotes?: string;
  outcome?: VisitOutcome;
  createdAt: string;
}

export interface CreateAppointmentFormData {
  leadId: string;
  propertyCode: string;
  scheduledDate: string;
  scheduledTimeSlot: string;
  noteToHost: string;
}

