'use client';

import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  ShieldCheck, 
  AlertTriangle, 
  Check, 
  Building2, 
  User, 
  Phone, 
  Coins, 
  FileText,
  CheckCircle2
} from 'lucide-react';
import { NewLeadFormData, LeadItem } from '@/types/broker-lead';
import { BROKER_MOCK_LISTINGS } from '@/lib/data/broker-mock-listings';
import { BROKER_MOCK_LEADS } from '@/lib/data/broker-mock-leads';

interface RegisterLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newLead: LeadItem) => void;
  presetPropertyCode?: string;
}

export const RegisterLeadModal: React.FC<RegisterLeadModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  presetPropertyCode,
}) => {
  const [formData, setFormData] = useState<NewLeadFormData>({
    fullName: '',
    phone: '',
    email: '',
    budget: undefined,
    targetPropertyCode: presetPropertyCode || BROKER_MOCK_LISTINGS[0].propertyCode,
    note: '',
    termsAgreed: false,
  });

  const [evidencePreview, setEvidencePreview] = useState<string | null>(null);
  const [conflictWarning, setConflictWarning] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  // Kiểm tra trùng lặp thời gian thực khi nhập SĐT & chọn BĐS
  const handlePhoneChange = (phoneVal: string) => {
    setFormData((prev) => ({ ...prev, phone: phoneVal }));
    const clean = phoneVal.replace(/\D/g, '');
    if (clean.length >= 10) {
      const duplicate = BROKER_MOCK_LEADS.find(
        (l) =>
          l.targetPropertyCode === formData.targetPropertyCode &&
          (l.rawPhone?.includes(clean) || l.maskedPhone.replace(/\D/g, '').includes(clean))
      );
      if (duplicate && duplicate.protectionStatus === 'active') {
        setConflictWarning(
          `Cảnh báo: Khách hàng với SĐT này đã được đăng ký bảo lưu với BĐS ${formData.targetPropertyCode} bởi CTV khác (còn ${duplicate.protectionDaysRemaining} ngày).`
        );
      } else {
        setConflictWarning(null);
      }
    } else {
      setConflictWarning(null);
    }
  };

  const handlePropertyChange = (propCode: string) => {
    setFormData((prev) => ({ ...prev, targetPropertyCode: propCode }));
    const clean = formData.phone.replace(/\D/g, '');
    if (clean.length >= 10) {
      const duplicate = BROKER_MOCK_LEADS.find(
        (l) =>
          l.targetPropertyCode === propCode &&
          (l.rawPhone?.includes(clean) || l.maskedPhone.replace(/\D/g, '').includes(clean))
      );
      if (duplicate && duplicate.protectionStatus === 'active') {
        setConflictWarning(
          `Cảnh báo: Khách hàng với SĐT này đã được bảo lưu với BĐS ${propCode} bởi CTV khác.`
        );
      } else {
        setConflictWarning(null);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, evidenceFile: file }));
      const reader = new FileReader();
      reader.onload = () => setEvidencePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.termsAgreed) {
      return;
    }

    if (conflictWarning) {
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const targetListing = BROKER_MOCK_LISTINGS.find(
        (l) => l.propertyCode === formData.targetPropertyCode
      );

      const raw = formData.phone.replace(/\D/g, '');
      const masked = raw.length >= 10 
        ? `${raw.slice(0, 4)}.xxx.${raw.slice(-3)}`
        : formData.phone;

      const createdLead: LeadItem = {
        id: `lead_hn_${Date.now()}`,
        fullName: formData.fullName,
        maskedPhone: masked,
        rawPhone: raw,
        email: formData.email,
        budget: formData.budget,
        targetListingId: targetListing?.id || 'bds_default',
        targetPropertyCode: formData.targetPropertyCode,
        targetListingTitle: targetListing?.title || 'BĐS Hà Nội',
        stage: 'pending_confirmation',
        protectionStatus: 'active',
        protectionDaysRemaining: 30,
        protectionExpiresAt: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
        evidenceUrl: evidencePreview || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
        evidenceNote: formData.note || 'Bằng chứng đăng ký mới từ chuyên viên',
        lastContactAt: 'Vừa xong',
        nextAction: 'Chờ ban quản trị thẩm định bằng chứng',
        createdAt: new Date().toISOString(),
        timeline: [
          {
            id: `log_${Date.now()}`,
            createdAt: new Date().toISOString(),
            type: 'status_change',
            title: 'Gửi đăng ký bảo lưu mới',
            content: `Khởi tạo hồ sơ khách hàng gắn với căn ${formData.targetPropertyCode}. Đang chờ thẩm định.`,
            authorName: 'Hệ thống tự động',
          },
        ],
      };

      setIsSubmitting(false);
      setIsSuccess(true);

      setTimeout(() => {
        onSuccess(createdLead);
        onClose();
      }, 1200);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative flex flex-col w-full max-w-xl max-h-[92vh] rounded-2xl bg-white shadow-2xl border border-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3.5 bg-slate-50">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
              <ShieldCheck className="h-4 w-4" />
            </span>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-tight">
                Đăng Ký Bảo Lưu Quyền Lợi Khách Hàng
              </h3>
              <p className="text-slate-500 text-xs">
                Gắn chặt 5 yếu tố: Khách – BĐS – Môi giới – Thời gian – Bằng chứng
              </p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200/60">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nội dung form */}
        <div className="flex-1 overflow-y-auto p-5">
          {isSuccess ? (
            <div className="py-12 text-center space-y-3">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                <CheckCircle2 className="h-8 w-8 animate-bounce" />
              </div>
              <h4 className="text-base font-bold text-slate-900">
                Đăng ký bảo lưu thành công!
              </h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Hồ sơ đã được ghi nhận vào CRM với thời hạn bảo lưu 30 ngày. Ban quản trị sẽ đối soát bằng chứng trong 24h.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Chọn BĐS từ kho hàng */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  1. Chọn BĐS mục tiêu từ kho nhà chung (*):
                </label>
                <select
                  value={formData.targetPropertyCode}
                  onChange={(e) => handlePropertyChange(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {BROKER_MOCK_LISTINGS.map((l) => (
                    <option key={l.propertyCode} value={l.propertyCode}>
                      [{l.propertyCode}] - {l.title.slice(0, 50)}... ({l.district})
                    </option>
                  ))}
                </select>
              </div>

              {/* Thông tin khách hàng */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    2. Họ tên khách hàng (*):
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="VD: Nguyễn Văn Nam"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    3. Số điện thoại (*):
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="tel"
                      required
                      placeholder="VD: 0912 345 678"
                      value={formData.phone}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Cảnh báo trùng khách nếu có */}
              {conflictWarning && (
                <div className="rounded-xl border border-rose-300 bg-rose-50 p-3 text-xs text-rose-900 flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{conflictWarning}</span>
                </div>
              )}

              {/* Ngân sách ước tính */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  4. Ngân sách dự kiến (VND - Tùy chọn):
                </label>
                <div className="relative">
                  <Coins className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="number"
                    placeholder="VD: 8500000000 (8.5 tỷ)"
                    value={formData.budget || ''}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full rounded-xl border border-slate-300 pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Upload Bằng chứng kết nối */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  5. Tải lên Bằng chứng kết nối (Ảnh chụp tin nhắn Zalo/SMS hẹn xem):
                </label>
                <div className="border border-dashed border-slate-300 rounded-xl p-4 text-center bg-slate-50/70 hover:bg-slate-50 transition-colors cursor-pointer relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  {evidencePreview ? (
                    <div className="flex items-center justify-center gap-3">
                      <img src={evidencePreview} alt="Preview" className="h-16 w-24 object-cover rounded-lg border border-slate-200" />
                      <div className="text-left">
                        <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                          <Check className="h-3.5 w-3.5" /> Đã chọn ảnh bằng chứng
                        </span>
                        <span className="text-[11px] text-slate-500 block">Nhấp để thay đổi ảnh khác</span>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <Upload className="h-6 w-6 text-slate-400 mx-auto mb-1" />
                      <div className="text-xs font-semibold text-slate-700">Kéo thả hoặc nhấp để tải ảnh tin nhắn hẹn</div>
                      <p className="text-[10px] text-slate-500 mt-0.5">Hỗ trợ PNG, JPG, JPEG (tối đa 5MB)</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Ghi chú thêm */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  6. Ghi chú yêu cầu đặc biệt của khách:
                </label>
                <textarea
                  rows={2}
                  placeholder="Khách cần xem vào cuối tuần, thích nhà hướng Đông Nam..."
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Cam kết tính xác thực */}
              <div className="rounded-xl bg-blue-50/70 border border-blue-200/80 p-3">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={formData.termsAgreed}
                    onChange={(e) => setFormData({ ...formData, termsAgreed: e.target.checked })}
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-[11px] text-slate-700 leading-relaxed">
                    Tôi cam kết thông tin khách hàng và bằng chứng kết nối là <strong>chính xác và có thật</strong> theo Quy chế bảo vệ quyền lợi môi giới HaNoi Realty. Mọi hành vi tạo khách ảo hoặc spam số điện thoại sẽ bị thu hồi quyền CTV.
                  </span>
                </label>
              </div>

              {/* Nút submit */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !!conflictWarning || !formData.termsAgreed}
                  className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white hover:bg-blue-500 shadow disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? 'Đang xác thực...' : 'Xác nhận đăng ký bảo lưu (30 ngày)'}
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};

