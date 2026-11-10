'use client';

import React, { useState } from 'react';
import { 
  X, 
  FileCheck, 
  ThumbsUp, 
  ThumbsDown, 
  HelpCircle, 
  Coins, 
  Upload, 
  Check, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { AppointmentItem, VisitOutcome, ClientInterestLevel } from '@/types/broker-appointment';

interface UpdateVisitOutcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: AppointmentItem | null;
  onSaveOutcome: (aptId: string, outcome: VisitOutcome) => void;
}

export const UpdateVisitOutcomeModal: React.FC<UpdateVisitOutcomeModalProps> = ({
  isOpen,
  onClose,
  appointment,
  onSaveOutcome,
}) => {
  const existingOutcome = appointment?.outcome;

  const [interestLevel, setInterestLevel] = useState<ClientInterestLevel>(
    existingOutcome?.interestLevel || 'high'
  );
  const [feedbackNote, setFeedbackNote] = useState(
    existingOutcome?.feedbackNote || ''
  );
  const [proposedPrice, setProposedPrice] = useState<number | undefined>(
    existingOutcome?.proposedPrice
  );
  const [advanceToNegotiation, setAdvanceToNegotiation] = useState(
    existingOutcome?.advanceToNegotiation || false
  );
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    existingOutcome?.checkinPhotoUrl || null
  );

  if (!isOpen || !appointment) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackNote.trim()) return;

    const outcomeData: VisitOutcome = {
      interestLevel,
      feedbackNote: feedbackNote.trim(),
      proposedPrice: proposedPrice ? Number(proposedPrice) : undefined,
      advanceToNegotiation,
      checkinPhotoUrl: photoPreview || undefined,
      recordedAt: new Date().toISOString(),
    };

    onSaveOutcome(appointment.id, outcomeData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative flex flex-col w-full max-w-lg max-h-[92vh] rounded-2xl bg-white shadow-2xl border border-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3.5 bg-slate-50">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 text-purple-700">
              <FileCheck className="h-4 w-4" />
            </span>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-tight">
                Ghi Nhận Kết Quả Buổi Dẫn Xem Nhà
              </h3>
              <p className="text-slate-500 text-xs">
                Khách: <strong>{appointment.leadName}</strong> • BĐS: <strong>{appointment.propertyCode}</strong>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200/60">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          
          {/* 1. Mức độ quan tâm của khách */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              1. Mức độ hài lòng & quan tâm của khách hàng (*):
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {[
                { key: 'high', label: 'Rất thích & Ưng ý', icon: ThumbsUp, color: 'text-emerald-700 border-emerald-300 bg-emerald-50' },
                { key: 'medium', label: 'Đang cân nhắc thêm', icon: HelpCircle, color: 'text-amber-700 border-amber-300 bg-amber-50' },
                { key: 'low', label: 'Không phù hợp', icon: ThumbsDown, color: 'text-slate-700 border-slate-300 bg-slate-50' },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = interestLevel === item.key;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setInterestLevel(item.key as any)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                      isSelected
                        ? `${item.color} ring-2 ring-blue-500 font-bold shadow-xs`
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="h-5 w-5 mb-1 opacity-90" />
                    <span className="text-[11px] leading-tight">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Giá khách đề xuất */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              2. Mức giá khách muốn thương lượng (VND - Nếu có):
            </label>
            <div className="relative">
              <Coins className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="number"
                placeholder="VD: 8200000000 (8.2 tỷ)"
                value={proposedPrice || ''}
                onChange={(e) => setProposedPrice(e.target.value ? Number(e.target.value) : undefined)}
                className="w-full rounded-xl border border-slate-300 pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* 3. Ghi chú chi tiết buổi xem */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              3. Chi tiết phản hồi của khách sau khi xem thực tế (*):
            </label>
            <textarea
              required
              rows={3}
              placeholder="VD: Khách ưng mặt tiền và kết cấu nhà, nhưng muốn chủ nhà bớt thêm 100tr chi phí sang tên..."
              value={feedbackNote}
              onChange={(e) => setFeedbackNote(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
            />
          </div>

          {/* 4. Checkbox chuyển sang Thương lượng */}
          <div className="rounded-xl bg-purple-50 border border-purple-200 p-3">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={advanceToNegotiation}
                onChange={(e) => setAdvanceToNegotiation(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-[11px] text-purple-950 font-medium leading-relaxed">
                Chuyển khách hàng sang giai đoạn <strong>&quot;Đang thương lượng / Đàm phán giao dịch&quot;</strong> trong CRM để bộ phận Pháp chế chuẩn bị biểu mẫu đặt cọc 3 bên.
              </span>
            </label>
          </div>

          {/* 5. Đính kèm ảnh check-in / biên bản xem nhà */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              5. Ảnh check-in hoặc chứng từ xác nhận buổi xem (Tùy chọn):
            </label>
            <div className="border border-dashed border-slate-300 rounded-xl p-3.5 text-center bg-slate-50 relative cursor-pointer hover:bg-slate-100 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              {photoPreview ? (
                <div className="flex items-center justify-center gap-3">
                  <img src={photoPreview} alt="Check-in preview" className="h-14 w-20 object-cover rounded-lg border border-slate-200" />
                  <div className="text-left text-xs">
                    <span className="font-bold text-emerald-600 flex items-center gap-1">
                      <Check className="h-3.5 w-3.5" /> Đã đính kèm ảnh
                    </span>
                    <span className="text-[11px] text-slate-400 block">Nhấp để đổi ảnh khác</span>
                  </div>
                </div>
              ) : (
                <div>
                  <Upload className="h-5 w-5 text-slate-400 mx-auto mb-1" />
                  <span className="text-xs font-semibold text-slate-700">Tải ảnh chụp check-in hoặc biên bản</span>
                </div>
              )}
            </div>
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
              className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white hover:bg-blue-500 shadow"
            >
              Lưu kết quả buổi xem
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

