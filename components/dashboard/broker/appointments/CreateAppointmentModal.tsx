'use client';

import React, { useState } from 'react';
import { 
  X, 
  CalendarDays, 
  Clock, 
  User, 
  Building2, 
  MapPin, 
  ShieldCheck, 
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { AppointmentItem, CreateAppointmentFormData } from '@/types/broker-appointment';
import { BROKER_MOCK_LEADS } from '@/lib/data/broker-mock-leads';
import { BROKER_MOCK_LISTINGS } from '@/lib/data/broker-mock-listings';

interface CreateAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newApt: AppointmentItem) => void;
  presetLeadId?: string;
  presetListingId?: string;
}

const TIME_SLOTS = [
  '08:30 - 09:30',
  '09:30 - 10:30',
  '10:30 - 11:30',
  '14:00 - 15:00',
  '15:00 - 16:00',
  '16:30 - 17:30',
  '18:00 - 19:00',
];

export const CreateAppointmentModal: React.FC<CreateAppointmentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  presetLeadId,
  presetListingId,
}) => {
  const initialLead = BROKER_MOCK_LEADS.find((l) => l.id === presetLeadId) || BROKER_MOCK_LEADS[0];
  const initialListing = BROKER_MOCK_LISTINGS.find((l) => l.id === presetListingId) || BROKER_MOCK_LISTINGS[0];

  const [selectedLeadId, setSelectedLeadId] = useState(initialLead?.id || '');
  const [selectedPropCode, setSelectedPropCode] = useState(initialListing?.propertyCode || '');
  const [scheduledDate, setScheduledDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [scheduledSlot, setScheduledSlot] = useState(TIME_SLOTS[1]);
  const [noteToHost, setNoteToHost] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentLead = BROKER_MOCK_LEADS.find((l) => l.id === selectedLeadId);
  const currentListing = BROKER_MOCK_LISTINGS.find((l) => l.propertyCode === selectedPropCode);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLeadId || !selectedPropCode || !scheduledDate || !scheduledSlot) {
      setErrorMessage('Vui lòng điền đầy đủ các thông tin hẹn bắt buộc.');
      return;
    }

    // Kiểm tra ngày không được ở quá khứ
    const selectedDateTime = new Date(`${scheduledDate}T12:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDateTime < today) {
      setErrorMessage('Ngày hẹn phải là ngày hôm nay hoặc trong tương lai.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    setTimeout(() => {
      const createdItem: AppointmentItem = {
        id: `apt_hn_${Date.now()}`,
        leadId: currentLead?.id,
        leadName: currentLead?.fullName || 'Khách hàng',
        leadPhone: currentLead?.maskedPhone || '0912.xxx.789',
        rawLeadPhone: currentLead?.rawPhone,
        listingId: currentListing?.id || 'bds_default',
        propertyCode: selectedPropCode,
        listingTitle: currentListing?.title || 'BĐS Hà Nội',
        meetingAddress: currentListing?.address || 'Hà Nội',
        scheduledDate,
        scheduledTimeSlot: scheduledSlot,
        scheduledTimestamp: `${scheduledDate}T${scheduledSlot.split(' - ')[0]}:00+07:00`,
        status: 'pending_host', // Chờ chủ nhà xác nhận
        hostName: 'Chủ nhà (Điều phối qua sàn)',
        noteToHost: noteToHost.trim() || 'Chuyên viên dẫn khách xem nhà thực tế theo lịch hẹn.',
        createdAt: new Date().toISOString(),
      };

      setIsSubmitting(false);
      onSuccess(createdItem);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative flex flex-col w-full max-w-lg max-h-[92vh] rounded-2xl bg-white shadow-2xl border border-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3.5 bg-slate-50">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
              <CalendarDays className="h-4 w-4" />
            </span>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-tight">
                Tạo Lịch Hẹn Xem Nhà Mới
              </h3>
              <p className="text-slate-500 text-xs">
                Điều phối 3 bên: Chuyên viên – Khách mua – Chủ nhà
              </p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200/60">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          
          {errorMessage && (
            <div className="rounded-xl border border-rose-300 bg-rose-50 p-3 text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* 1. Chọn khách hàng từ CRM */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              1. Khách hàng phụ trách (Từ CRM) (*):
            </label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <select
                value={selectedLeadId}
                onChange={(e) => setSelectedLeadId(e.target.value)}
                className="w-full rounded-xl border border-slate-300 pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {BROKER_MOCK_LEADS.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.fullName} ({l.maskedPhone}) • BĐS quan tâm: {l.targetPropertyCode}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 2. Chọn BĐS dẫn xem */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              2. Căn BĐS cần dẫn xem (*):
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <select
                value={selectedPropCode}
                onChange={(e) => setSelectedPropCode(e.target.value)}
                className="w-full rounded-xl border border-slate-300 pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {BROKER_MOCK_LISTINGS.map((p) => (
                  <option key={p.propertyCode} value={p.propertyCode}>
                    [{p.propertyCode}] - {p.title.slice(0, 48)}... ({p.district})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 3. Chọn ngày & Khung giờ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                3. Ngày hẹn xem (*):
              </label>
              <input
                type="date"
                required
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                4. Khung giờ hẹn (*):
              </label>
              <select
                value={scheduledSlot}
                onChange={(e) => setScheduledSlot(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {TIME_SLOTS.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 4. Ghi chú gửi chủ nhà */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              5. Ghi chú gửi chủ nhà trước khi đến:
            </label>
            <textarea
              rows={2}
              placeholder="VD: Khách đi cùng gia đình, xin chủ nhà mở cửa và chuẩn bị sẵn sổ đỏ gốc để khách xem..."
              value={noteToHost}
              onChange={(e) => setNoteToHost(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Banner thông báo cơ chế xác nhận */}
          <div className="rounded-xl bg-blue-50 border border-blue-200 p-3 text-[11px] text-blue-900 flex items-start gap-2">
            <ShieldCheck className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
            <span>
              Sau khi bạn tạo lịch, bộ phận điều phối sàn HaNoi Realty sẽ liên hệ chủ nhà để chốt thời gian đón tiếp và gửi tin nhắn xác nhận cho bạn.
            </span>
          </div>

          {/* Footer Submit */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white hover:bg-blue-500 shadow disabled:bg-slate-300"
            >
              {isSubmitting ? 'Đang tạo lịch...' : 'Tạo lịch hẹn ngay'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

