'use client';

import { useState } from 'react';
import {
  Camera,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Phone,
  Sparkles,
  PlusCircle,
  Check,
  X,
  RefreshCw
} from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';

interface SurveyItem {
  id: string;
  propertyCode: string;
  propertyTitle: string;
  address: string;
  date: string;
  timeSlot: string;
  specialistName: string;
  specialistPhone: string;
  services: string[];
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  notes?: string;
}

const DEFAULT_SURVEYS: SurveyItem[] = [
  {
    id: 'srv_01',
    propertyCode: 'HR-PROP-8821',
    propertyTitle: 'Nhà phố Hàng Bông, Phường Hàng Bông, Hoàn Kiếm',
    address: 'Số 48 Phố Hàng Bông, Hoàn Kiếm, Hà Nội',
    date: '2026-11-12',
    timeSlot: '09:30 - 11:30 (Buổi Sáng)',
    specialistName: 'Hoàng Văn Đức (Kỹ thuật viên Media & GIS)',
    specialistPhone: '0983.222.111',
    services: ['Chụp ảnh HDR nội ngoại thất', 'Quay Flycam trên cao toàn cảnh ngõ', 'Dựng Virtual Tour 3D VR (Matterport)'],
    status: 'confirmed',
    notes: 'Chủ nhà có mặt tại nhà, mang sẵn bản vẽ trích lục địa chính.',
  },
];

export function OwnerSurveysTab() {
  const { addToast } = useApp();

  const [surveys, setSurveys] = useState<SurveyItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('hanoi_owner_surveys');
        if (stored) return JSON.parse(stored);
      } catch {}
    }
    return DEFAULT_SURVEYS;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rescheduleItem, setRescheduleItem] = useState<SurveyItem | null>(null);

  // Form đặt lịch mới
  const [formData, setFormData] = useState({
    propertyTitle: 'Nhà phố Hàng Bông, Hoàn Kiếm',
    propertyCode: 'HR-PROP-8821',
    address: 'Số 48 Phố Hàng Bông, Hoàn Kiếm, Hà Nội',
    date: '2026-11-15',
    timeSlot: '09:00 - 11:00 (Buổi Sáng)',
    notes: '',
    hdrPhotos: true,
    flycam: true,
    vrTour: true,
  });

  const saveSurveys = (newSurveys: SurveyItem[]) => {
    setSurveys(newSurveys);
    if (typeof window !== 'undefined') {
      localStorage.setItem('hanoi_owner_surveys', JSON.stringify(newSurveys));
    }
  };

  const handleCreateSurvey = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedServices: string[] = [];
    if (formData.hdrPhotos) selectedServices.push('Chụp ảnh HDR nội ngoại thất');
    if (formData.flycam) selectedServices.push('Quay Flycam góc rộng');
    if (formData.vrTour) selectedServices.push('Dựng Virtual Tour 3D VR');

    const newSurvey: SurveyItem = {
      id: `srv_${Date.now()}`,
      propertyCode: formData.propertyCode,
      propertyTitle: formData.propertyTitle,
      address: formData.address,
      date: formData.date,
      timeSlot: formData.timeSlot,
      specialistName: 'Trần Quang Hưng (Chuyên viên Media HaNoi Realty)',
      specialistPhone: '0978.333.555',
      services: selectedServices,
      status: 'pending',
      notes: formData.notes,
    };

    const updated = [newSurvey, ...surveys];
    saveSurveys(updated);
    setIsModalOpen(false);
    addToast('🎉 Đã đặt lịch khảo sát & quay chụp thành công! Chuyên viên sẽ liên hệ trước 2 giờ.', 'success');
  };

  const handleCancelSurvey = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn huỷ lịch khảo sát này?')) {
      const updated = surveys.map((s) => (s.id === id ? { ...s, status: 'cancelled' as const } : s));
      saveSurveys(updated);
      addToast('Đã huỷ lịch hẹn khảo sát', 'info');
    }
  };

  const handleConfirmReschedule = () => {
    if (!rescheduleItem) return;
    const updated = surveys.map((s) => (s.id === rescheduleItem.id ? rescheduleItem : s));
    saveSurveys(updated);
    setRescheduleItem(null);
    addToast('✅ Đã cập nhật ngày giờ lịch khảo sát thành công!', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header Giới Thiệu */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Lịch khảo sát & quay chụp BĐS</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Dịch vụ quay flycam 4K, chụp ảnh HDR và dựng 3D Virtual Tour miễn phí 100% cho chủ nhà
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 text-white text-xs font-bold shadow-md hover:bg-orange-700 transition-all shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Đặt lịch quay chụp mới</span>
        </button>
      </div>

      {/* Danh Sách Lịch Khảo Sát */}
      <div className="space-y-4">
        {surveys.map((survey) => (
          <div
            key={survey.id}
            className={`rounded-3xl border p-6 transition-all ${
              survey.status === 'confirmed'
                ? 'bg-white border-amber-200 shadow-sm'
                : survey.status === 'completed'
                ? 'bg-slate-50 border-slate-200 opacity-90'
                : survey.status === 'cancelled'
                ? 'bg-red-50/40 border-red-100 opacity-70'
                : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-100 text-slate-700">
                    Mã BĐS: {survey.propertyCode}
                  </span>
                  {survey.status === 'confirmed' && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Đã xác nhận lịch
                    </span>
                  )}
                  {survey.status === 'pending' && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-700 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Chờ chuyên viên xác nhận
                    </span>
                  )}
                  {survey.status === 'cancelled' && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-700">
                      Đã huỷ lịch
                    </span>
                  )}
                </div>
                <h3 className="text-base font-bold text-slate-900">{survey.propertyTitle}</h3>
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{survey.address}</span>
                </p>
              </div>

              {/* Ngày giờ & chuyên viên */}
              <div className="flex flex-wrap items-center gap-4 text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Thời gian hẹn</div>
                  <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-orange-600" />
                    <span>{survey.date}</span>
                  </div>
                  <div className="text-slate-600">{survey.timeSlot}</div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Kỹ thuật viên phụ trách</div>
                  <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>{survey.specialistName}</span>
                  </div>
                  <a
                    href={`tel:${survey.specialistPhone}`}
                    className="text-orange-600 font-bold hover:underline flex items-center gap-1"
                  >
                    <Phone className="w-3 h-3" />
                    <span>{survey.specialistPhone}</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Gói dịch vụ quay chụp */}
            <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Hạng mục sản xuất:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {survey.services.map((srv, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-orange-50 text-orange-800 border border-orange-100 flex items-center gap-1.5"
                    >
                      <Check className="w-3 h-3 text-orange-600" />
                      <span>{srv}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Nút thao tác */}
              {survey.status !== 'cancelled' && (
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setRescheduleItem(survey)}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Đổi lịch</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCancelSurvey(survey.id)}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-100 transition-all"
                  >
                    Huỷ lịch
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal Đặt Lịch Mới */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Đặt lịch quay chụp & 3D Tour</h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSurvey} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Chọn BĐS cần quay chụp</label>
                <input
                  type="text"
                  value={formData.propertyTitle}
                  onChange={(e) => setFormData({ ...formData, propertyTitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Ngày mong muốn</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Khung giờ</label>
                  <select
                    value={formData.timeSlot}
                    onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 bg-white"
                  >
                    <option value="09:00 - 11:00 (Buổi Sáng)">09:00 - 11:00 (Buổi Sáng)</option>
                    <option value="14:00 - 16:00 (Buổi Chiều)">14:00 - 16:00 (Buổi Chiều)</option>
                    <option value="16:30 - 18:00 (Hoàng hôn / Chiều tà)">16:30 - 18:00 (Hoàng hôn)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Gói công nghệ miễn phí đi kèm</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.hdrPhotos}
                      onChange={(e) => setFormData({ ...formData, hdrPhotos: e.target.checked })}
                      className="rounded-md text-orange-600 focus:ring-orange-500"
                    />
                    <span>Chụp ảnh HDR 20+ góc chuẩn kiến trúc</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.flycam}
                      onChange={(e) => setFormData({ ...formData, flycam: e.target.checked })}
                      className="rounded-md text-orange-600 focus:ring-orange-500"
                    />
                    <span>Quay Flycam độ phân giải 4K (Bao quát ngõ & tiện ích xung quanh)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.vrTour}
                      onChange={(e) => setFormData({ ...formData, vrTour: e.target.checked })}
                      className="rounded-md text-orange-600 focus:ring-orange-500"
                    />
                    <span>Dựng Virtual Tour 3D VR (Khách mua đi lại trong nhà như thật)</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Ghi chú cho kỹ thuật viên</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Ví dụ: Gọi trước 30 phút, ngõ rộng ô tô vào được..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-orange-600 text-white font-bold hover:bg-orange-700 shadow-md"
                >
                  Xác nhận đặt lịch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Đổi Lịch */}
      {rescheduleItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-100 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Thay đổi ngày giờ khảo sát</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Ngày mới</label>
                <input
                  type="date"
                  value={rescheduleItem.date}
                  onChange={(e) => setRescheduleItem({ ...rescheduleItem, date: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Khung giờ mới</label>
                <select
                  value={rescheduleItem.timeSlot}
                  onChange={(e) => setRescheduleItem({ ...rescheduleItem, timeSlot: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="09:00 - 11:00 (Buổi Sáng)">09:00 - 11:00 (Buổi Sáng)</option>
                  <option value="14:00 - 16:00 (Buổi Chiều)">14:00 - 16:00 (Buổi Chiều)</option>
                  <option value="16:30 - 18:00 (Hoàng hôn)">16:30 - 18:00 (Hoàng hôn)</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRescheduleItem(null)}
                className="px-4 py-2 rounded-xl text-slate-600 font-bold"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleConfirmReschedule}
                className="px-4 py-2 rounded-xl bg-orange-600 text-white font-bold hover:bg-orange-700"
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

