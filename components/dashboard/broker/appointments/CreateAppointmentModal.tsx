'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  CalendarDays,
  Clock,
  User,
  Building2,
  MapPin,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  UserPlus,
  Plus
} from 'lucide-react';
import { AppointmentItem, CreateAppointmentFormData } from '@/types/broker-appointment';
import { LeadItem } from '@/types/broker-lead';
import { BROKER_MOCK_LISTINGS } from '@/lib/data/broker-mock-listings';
import {
  getBrokerLeads,
  saveBrokerLead,
  saveBrokerAppointment
} from '@/lib/services/broker-state-service';

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
  const [leadsList, setLeadsList] = useState<LeadItem[]>([]);
  const [isQuickAddLead, setIsQuickAddLead] = useState(false);
  const [newLeadName, setNewLeadName] = useState('');
  const [newLeadPhone, setNewLeadPhone] = useState('');

  const [selectedLeadId, setSelectedLeadId] = useState('');
  const [selectedPropCode, setSelectedPropCode] = useState('');
  const [scheduledDate, setScheduledDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [scheduledSlot, setScheduledSlot] = useState(TIME_SLOTS[1]);
  const [noteToHost, setNoteToHost] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load danh sách khách hàng mới nhất
  useEffect(() => {
    if (isOpen) {
      const leads = getBrokerLeads();
      setLeadsList(leads);

      const targetLead = leads.find((l) => l.id === presetLeadId) || leads[0];
      const targetListing = BROKER_MOCK_LISTINGS.find((l) => l.id === presetListingId) || BROKER_MOCK_LISTINGS[0];

      if (targetLead) setSelectedLeadId(targetLead.id);
      if (targetListing) setSelectedPropCode(targetListing.propertyCode);
    }
  }, [isOpen, presetLeadId, presetListingId]);

  if (!isOpen) return null;

  const currentLead = leadsList.find((l) => l.id === selectedLeadId);
  const currentListing = BROKER_MOCK_LISTINGS.find((l) => l.propertyCode === selectedPropCode);

  // Xử lý tạo nhanh khách hàng mới ngay trong modal
  const handleQuickCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadName.trim() || !newLeadPhone.trim()) {
      setErrorMessage('Vui lòng nhập tên và số điện thoại khách hàng.');
      return;
    }

    const cleanPhone = newLeadPhone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage('Số điện thoại không hợp lệ (tối thiểu 10 chữ số).');
      return;
    }

    const maskedPhone = cleanPhone.slice(0, 4) + '.xxx.' + cleanPhone.slice(-3);
    const newLead: LeadItem = {
      id: `lead_quick_${Date.now()}`,
      fullName: newLeadName.trim(),
      maskedPhone,
      rawPhone: cleanPhone,
      targetListingId: currentListing?.id || 'bds_default',
      targetPropertyCode: selectedPropCode || 'HR-BDS-1024',
      targetListingTitle: currentListing?.title || 'BĐS Hà Nội',
      stage: 'consulting',
      protectionStatus: 'active',
      protectionExpiresAt: new Date(Date.now() + 45 * 86400000).toISOString(),
      protectionDaysRemaining: 45,
      lastContactAt: 'Vừa tạo',
      nextAction: 'Dẫn khách xem nhà thực tế',
      timeline: [
        {
          id: `log_init_${Date.now()}`,
          createdAt: new Date().toISOString(),
          type: 'note',
          title: 'Đăng ký nhanh',
          content: 'Khách hàng được tạo nhanh khi xếp lịch hẹn xem nhà.',
          authorName: 'Chuyên viên CTV',
        },
      ],
      createdAt: new Date().toISOString(),
    };

    const updated = saveBrokerLead(newLead);
    setLeadsList(updated);
    setSelectedLeadId(newLead.id);
    setIsQuickAddLead(false);
    setNewLeadName('');
    setNewLeadPhone('');
    setErrorMessage(null);
  };

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

      // Lưu bền vững vào state service & localStorage
      saveBrokerAppointment(createdItem);

      setIsSubmitting(false);
      onSuccess(createdItem);
      onClose();
  }, 400);
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

        {/* 1. Chọn khách hàng từ CRM kèm nút thêm nhanh */}
        <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">
                1. Khách hàng phụ trách (Từ CRM) (*):
              </label>
              <button
                type="button"
                onClick={() => setIsQuickAddLead(!isQuickAddLead)}
                className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
              {isQuickAddLead ? 'Đóng tạo nhanh' : '+ Thêm khách mới'}
            </button>
          </div>

          {isQuickAddLead ? (
            /* Khung tạo nhanh khách hàng mới */
            <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200 space-y-2 mb-2 animate-in fade-in">
              <span className="text-[11px] font-bold text-blue-900 block">
                Nhập thông tin khách hàng mới:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Họ tên khách (*)"
                  value={newLeadName}
                  onChange={(e) => setNewLeadName(e.target.value)}
                  className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="tel"
                  placeholder="Số điện thoại (*)"
                  value={newLeadPhone}
                  onChange={(e) => setNewLeadPhone(e.target.value)}
                  className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => setIsQuickAddLead(false)}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 text-[11px] text-slate-600 bg-white"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleQuickCreateLead}
                  className="px-3 py-1 rounded-lg bg-blue-600 text-white text-[11px] font-bold hover:bg-blue-500"
                >
                  Lưu & Chọn khách này
                </button>
              </div>
            </div>
          ) : (
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <select
                value={selectedLeadId}
                onChange={(e) => setSelectedLeadId(e.target.value)}
                className="w-full rounded-xl border border-slate-300 pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {leadsList.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.fullName} ({l.maskedPhone}) • BĐS quan tâm: {l.targetPropertyCode}
                  </option>
                ))}
              </select>
            </div>
          )}
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

        {/* Thẻ tóm tắt thông tin điểm đón */}
        {currentListing && (
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 text-xs space-y-1">
            <div className="flex items-start gap-1.5 text-slate-700">
              <MapPin className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
              <span>
                <strong>Điểm đón tiếp:</strong> {currentListing.address}
              </span>
            </div>
            <div className="text-[11px] text-slate-500 pl-5">
              Chủ nhà đã ủy quyền sàn điều phối đón tiếp. Vui lòng có mặt đúng giờ.
            </div>
          </div>
        )}

        {/* Ghi chú gửi chủ nhà */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            5. Ghi chú gửi chủ nhà / Điều phối viên:
          </label>
          <textarea
            rows={2}
            placeholder="VD: Khách đi xe ô tô 4 chỗ, cần hỗ trợ mở cửa ngõ trước 5 phút..."
            value={noteToHost}
            onChange={(e) => setNoteToHost(e.target.value)}
            className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

          {/* Footer nút hành động */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 text-xs font-bold text-white hover:bg-blue-500 shadow disabled:opacity-50"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>{isSubmitting ? 'Đang gửi...' : 'Xác nhận tạo lịch hẹn'}</span>
            </button>
          </div>

      </form>

    </div>
  </div>
);
};
