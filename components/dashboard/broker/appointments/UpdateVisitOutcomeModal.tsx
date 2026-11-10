'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Briefcase
} from 'lucide-react';
import { AppointmentItem, VisitOutcome, ClientInterestLevel } from '@/types/broker-appointment';
import { DealItem } from '@/types/broker-deal';
import { updateAppointmentOutcomeAndTriggerDeal } from '@/lib/services/broker-state-service';

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

  const [createdDeal, setCreatedDeal] = useState<DealItem | null>(null);

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

    // Gọi service cập nhật bền vững & tự động tạo Deal nếu advanceToNegotiation
    const result = updateAppointmentOutcomeAndTriggerDeal(appointment.id, outcomeData);
    onSaveOutcome(appointment.id, outcomeData);

    if (result.createdDeal) {
      setCreatedDeal(result.createdDeal);
    } else {
      onClose();
    }
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

              {createdDeal ? (
          /* Màn hình thông báo tự động kích hoạt Deal Room */
          <div className="p-6 text-center space-y-4 animate-in fade-in zoom-in-95">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 shadow-sm animate-bounce">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <div>
              <h4 className="text-lg font-extrabold text-slate-900">
                Đã Mở Phòng Deal Room Thành Công!
              </h4>
              <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto leading-relaxed">
                Giao dịch của khách <strong>{appointment.leadName}</strong> cho căn{' '}
                <strong className="text-blue-700">#{appointment.propertyCode}</strong> đã được chuyển sang giai đoạn thương lượng giá cọc.
              </p>
            </div>

                  <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 text-left space-y-2 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Mã giao dịch:</span>
                      <span className="font-mono font-bold text-blue-700">{createdDeal.dealCode}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Mức giá đề xuất:</span>
                      <span className="font-mono font-bold text-slate-900">
                        {createdDeal.agreedPrice.toLocaleString('vi-VN')} đ
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Hoa hồng bảo lưu:</span>
                      <span className="font-mono font-bold text-emerald-700">
                        ~{createdDeal.brokerCommissionShare.toLocaleString('vi-VN')} đ
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Đóng
                    </button>
                    <Link
                      href="/dashboard/broker/deals"
                      onClick={onClose}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white hover:bg-blue-500 shadow-md"
                    >
                      <Briefcase className="h-4 w-4" />
                      <span>Vào Deal Room ngay</span>
                    </Link>
                  </div>
                </div>
                ) : (
                /* Form Ghi nhận kết quả */
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">

                  {/* 1. Mức độ quan tâm của khách */}
                  <div>
                    <label className="block font-bold text-slate-800 mb-2">
                      1. Đánh giá mức độ quan tâm của khách hàng (*):
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setInterestLevel('high')}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-bold transition-all ${interestLevel === 'high'
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-800 shadow-xs'
                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                          }`}
                      >
                        <ThumbsUp className="h-5 w-5 text-emerald-600 mb-1" />
                        <span>Rất thích</span>
                      </button>

                <button
                            type="button"
                            onClick={() => setInterestLevel('medium')}
                            className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-bold transition-all ${interestLevel === 'medium'
                                ? 'border-amber-500 bg-amber-50 text-amber-800 shadow-xs'
                                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                              }`}
                          >
                            <HelpCircle className="h-5 w-5 text-amber-600 mb-1" />
                            <span>Đang cân nhắc</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setInterestLevel('low')}
                            className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-bold transition-all ${interestLevel === 'low'
                                ? 'border-rose-500 bg-rose-50 text-rose-800 shadow-xs'
                                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                              }`}
                          >
                            <ThumbsDown className="h-5 w-5 text-rose-600 mb-1" />
                            <span>Chưa phù hợp</span>
                          </button>
                      </div>
                    </div>

                    {/* 2. Mức giá khách mong muốn/đề xuất */}
                    <div>
                      <label className="block font-bold text-slate-800 mb-1">
                        2. Mức giá khách muốn đàm phán (VND) (Nếu có):
                      </label>
                      <div className="relative">
                        <Coins className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <input
                          type="number"
                          placeholder="VD: 6500000000 (6.5 tỷ)"
                          value={proposedPrice || ''}
                          onChange={(e) => setProposedPrice(e.target.value ? Number(e.target.value) : undefined)}
                          className="w-full rounded-xl border border-slate-300 pl-9 pr-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                        />
                      </div>
                    </div>

                    {/* 3. Ý kiến & Ghi chú của khách */}
                    <div>
                      <label className="block font-bold text-slate-800 mb-1">
                        3. Chi tiết phản hồi & Ghi chú buổi xem (*):
                      </label>
                      <textarea
                        required
                        rows={3}
                        placeholder="VD: Khách khen nhà thoáng đẹp, ưng phòng khách, muốn gặp chủ nhà đàm phán bớt lộc và gia hạn thanh toán sang tuần sau..."
                        value={feedbackNote}
                        onChange={(e) => setFeedbackNote(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
                      />
              </div>

                        {/* 4. Tải ảnh check-in hiện trường */}
                        <div>
                          <label className="block font-bold text-slate-800 mb-1">
                            4. Ảnh chụp bằng chứng buổi dẫn khách (tùy chọn):
                          </label>
                          <div className="border border-dashed border-slate-300 rounded-xl p-3 text-center bg-slate-50/50 hover:bg-slate-50 cursor-pointer relative">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleFileUpload}
                              className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                            {photoPreview ? (
                              <div className="flex items-center justify-center gap-2 text-emerald-700 font-bold">
                                <Check className="h-4 w-4" /> Đã đính kèm ảnh check-in
                              </div>
                          ) : (
                          <div className="text-slate-500 text-[11px]">
                            <Upload className="h-4 w-4 mx-auto mb-1 text-slate-400" />
                            Bấm để tải ảnh check-in trước cổng nhà hoặc phòng khách
                          </div>
                )}
                        </div>
                      </div>

                      {/* 5. Tự động chuyển sang Deal Room */}
                      <div className="rounded-xl bg-purple-50 border border-purple-200 p-3.5 space-y-1.5">
                        <label className="flex items-start gap-2.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={advanceToNegotiation}
                            onChange={(e) => setAdvanceToNegotiation(e.target.checked)}
                            className="mt-0.5 rounded border-purple-300 text-purple-600 focus:ring-purple-500 h-4 w-4"
                          />
                          <div>
                            <span className="font-bold text-purple-950 block">
                              Khách thiện chí, tự động mở Phòng Giao Dịch (Deal Room)
                            </span>
                            <p className="text-[11px] text-purple-800 leading-relaxed">
                              Hệ thống sẽ tạo Deal mới trong phòng giao dịch, phân rã biểu phí hoa hồng bảo lưu và kết nối hỗ trợ pháp lý đàm phán cọc.
                            </p>
                          </div>
                        </label>
                      </div>

                  {/* Footer nút hành động */}
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 rounded-xl border border-slate-300 font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-purple-600 font-bold text-white hover:bg-purple-500 shadow-md"
                    >
                      <Check className="h-4 w-4" />
                      <span>Lưu kết quả buổi xem</span>
                    </button>
                  </div>

              </form>
        )}

            </div>
          </div>
          );
};
