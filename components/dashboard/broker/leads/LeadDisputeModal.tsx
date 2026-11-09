'use client';

import React, { useState } from 'react';
import {
  X,
  AlertTriangle,
  UploadCloud,
  FileCheck2,
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Image as ImageIcon,
  MessageSquare,
  MapPin,
  UserCheck,
  Info
} from 'lucide-react';
import { LeadDisputePayload } from '@/types/broker-system';

interface LeadDisputeModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyCode: string;
  customerName: string;
  phone: string;
  currentProtectedBrokerCode?: string;
  onDisputeSubmitted?: (payload: LeadDisputePayload) => void;
}

export const LeadDisputeModal: React.FC<LeadDisputeModalProps> = ({
  isOpen,
  onClose,
  propertyCode,
  customerName,
  phone,
  currentProtectedBrokerCode,
  onDisputeSubmitted,
}) => {
  // 3 Bằng chứng bắt buộc
  const [proof1Time, setProof1Time] = useState('');
  const [proof1Preview, setProof1Preview] = useState<string | null>(null);
  const [proof2Preview, setProof2Preview] = useState<string | null>(null);
  const [proof3Preview, setProof3Preview] = useState<string | null>(null);

  const [explanationNote, setExplanationNote] = useState('');
  const [commitChecked, setCommitChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (preview: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setter(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proof1Preview && !proof2Preview && !proof3Preview) {
      setErrorMsg('Vui lòng tải lên ít nhất một bằng chứng xác thực (ưu tiên tin nhắn tương tác đầu tiên).');
      return;
    }
    if (!commitChecked) {
      setErrorMsg('Bạn cần tích xác nhận cam kết tính trung thực của hồ sơ khiếu nại.');
      return;
    }

    setErrorMsg(null);
    setIsSubmitting(true);

    const disputeCode = `DISPUTE-2026-${Math.floor(100 + Math.random() * 900)}`;

    const payload: LeadDisputePayload = {
      disputeCode,
      propertyCode,
      customerName,
      phone,
      currentProtectedBrokerCode,
      proof1InitialContactUrl: proof1Preview || undefined,
      proof2ActualShowingUrl: proof2Preview || undefined,
      proof3CustomerAffirmationUrl: proof3Preview || undefined,
      explanationNote,
      submittedAt: new Date().toISOString(),
    };

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      if (onDisputeSubmitted) {
        onDisputeSubmitted(payload);
      }
    }, 1200);
  };

  const handleClose = () => {
    setProof1Preview(null);
    setProof2Preview(null);
    setProof3Preview(null);
    setExplanationNote('');
    setCommitChecked(false);
    setIsSuccess(false);
    setErrorMsg(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b border-rose-200 bg-rose-50/70 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-700">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Nộp Hồ Sơ Khiếu Nại Trùng Khách Hàng
              </h3>
              <p className="text-xs text-rose-800 font-medium">
                Cơ chế đối soát bằng chứng số minh bạch • Bảo vệ quyền lợi Môi giới
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {isSuccess ? (
          /* Màn hình thông báo gửi thành công */
          <div className="p-8 text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 animate-bounce">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h4 className="text-xl font-bold text-slate-900">
              Đã Tiếp Nhận Hồ Sơ Khiếu Nại Thành Công!
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Hệ thống đã chuyển trạng thái hồ sơ khách hàng <strong>{customerName}</strong> sang{' '}
              <span className="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                Đang tranh chấp (Disputed)
              </span>
              . Ban Pháp chế & Đối soát của HaNoi Realty sẽ rà soát bằng chứng và phản hồi kết quả trong vòng <strong>24 giờ làm việc</strong>.
            </p>
            <div className="pt-3">
              <button
                onClick={handleClose}
                className="px-6 py-2.5 rounded-xl bg-slate-900 text-xs font-bold text-white hover:bg-slate-800 shadow-sm"
              >
                Đóng & Quay lại danh sách CRM
              </button>
            </div>
          </div>
        ) : (
          /* Form nộp 3 bằng chứng */
          <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs max-h-[80vh] overflow-y-auto">
            
            {/* Box tóm tắt vụ việc trùng khách */}
            <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-amber-800 font-bold uppercase tracking-wider">
                  Thông tin đối soát trùng lặp
                </span>
                <span className="font-mono font-bold text-slate-700">
                  Mã BĐS: <strong className="text-blue-700">{propertyCode || 'HN-DDA-092'}</strong>
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-1 text-slate-800">
                <div>
                  <span className="text-slate-500 block text-[11px]">Khách hàng khiếu nại:</span>
                  <span className="font-bold">{customerName || 'Khách hàng'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Số điện thoại:</span>
                  <span className="font-mono font-bold text-blue-700">{phone || '0912.xxx.xxx'}</span>
                </div>
              </div>
              {currentProtectedBrokerCode && (
                <div className="text-[11px] text-amber-900 bg-white/70 p-2 rounded-lg border border-amber-200">
                  CTV đang được hệ thống ưu tiên tạm thời: <strong>{currentProtectedBrokerCode}</strong>. Sau khi nộp khiếu nại, quyền bảo lưu sẽ được tạm khóa để chuyển sang chế độ Admin thẩm định.
                </div>
              )}
            </div>

            {/* BẰNG CHỨNG 1: TIN NHẮN TƯƠNG TÁC ĐẦU TIÊN */}
            <div className="rounded-xl border border-slate-200 p-4 space-y-3 bg-slate-50/40">
              <div className="flex items-start gap-2.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700 font-bold text-xs">
                  1
                </div>
                <div>
                  <h5 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <MessageSquare className="h-3.5 w-3.5 text-blue-600" />
                    Tin nhắn tương tác đầu tiên (Ảnh chụp Zalo/SMS/Cuộc gọi)
                  </h5>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Ảnh chụp màn hình có hiển thị rõ ngày giờ trao đổi về căn nhà này trước mốc thời gian của CTV kia.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center pt-1">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Mốc thời gian tương tác đầu tiên:
                  </label>
                  <input
                    type="text"
                    placeholder="VD: 05/04/2026 09:30 sáng"
                    value={proof1Time}
                    onChange={(e) => setProof1Time(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Tải ảnh chụp tin nhắn:
                  </label>
                  <label className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-white p-2 text-slate-600 hover:border-blue-500 cursor-pointer">
                    <UploadCloud className="h-4 w-4 text-blue-600" />
                    <span className="text-[11px] font-medium">Chọn ảnh chụp...</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, setProof1Preview)}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {proof1Preview && (
                <div className="mt-2 relative w-32 h-20 rounded-lg overflow-hidden border border-slate-200">
                  <img src={proof1Preview} alt="Proof 1" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            {/* BẰNG CHỨNG 2: ẢNH / PHIẾU DẪN XEM THỰC TẾ */}
            <div className="rounded-xl border border-slate-200 p-4 space-y-3 bg-slate-50/40">
              <div className="flex items-start gap-2.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 font-bold text-xs">
                  2
                </div>
                <div>
                  <h5 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                    Ảnh hoặc Phiếu dẫn xem thực tế tại căn nhà
                  </h5>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Ảnh chụp check-in tại hiện trường, phiếu ký xác nhận dẫn xem hoặc định vị thực tế có khách hàng.
                  </p>
                </div>
              </div>

              <div>
                <label className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-white p-2.5 text-slate-600 hover:border-emerald-500 cursor-pointer">
                  <UploadCloud className="h-4 w-4 text-emerald-600" />
                  <span className="text-[11px] font-medium">Tải lên ảnh check-in / phiếu dẫn xem...</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, setProof2Preview)}
                    className="hidden"
                  />
                </label>
              </div>

              {proof2Preview && (
                <div className="mt-2 relative w-32 h-20 rounded-lg overflow-hidden border border-slate-200">
                  <img src={proof2Preview} alt="Proof 2" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            {/* BẰNG CHỨNG 3: XÁC NHẬN TỪ KHÁCH HÀNG */}
            <div className="rounded-xl border border-slate-200 p-4 space-y-3 bg-slate-50/40">
              <div className="flex items-start gap-2.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-700 font-bold text-xs">
                  3
                </div>
                <div>
                  <h5 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <UserCheck className="h-3.5 w-3.5 text-purple-600" />
                    Xác nhận từ khách hàng
                  </h5>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Tin nhắn khách xác nhận chọn bạn là môi giới đại diện đàm phán, hoặc ghi chú cuộc gọi đối chất.
                  </p>
                </div>
              </div>

              <div>
                <label className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-white p-2.5 text-slate-600 hover:border-purple-500 cursor-pointer">
                  <UploadCloud className="h-4 w-4 text-purple-600" />
                  <span className="text-[11px] font-medium">Tải lên xác nhận của khách hàng...</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, setProof3Preview)}
                    className="hidden"
                  />
                </label>
              </div>

              {proof3Preview && (
                <div className="mt-2 relative w-32 h-20 rounded-lg overflow-hidden border border-slate-200">
                  <img src={proof3Preview} alt="Proof 3" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            {/* LỜI GIẢI TRÌNH CỦA MÔI GIỚI */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800">
                Ghi chú giải trình chi tiết vụ việc gửi Ban Pháp chế:
              </label>
              <textarea
                value={explanationNote}
                onChange={(e) => setExplanationNote(e.target.value)}
                placeholder="VD: Tôi đã chăm sóc anh Thắng từ ngày 05/04 và trực tiếp dẫn xem nhà vào chiều cùng ngày. Đến ngày 08/04 khách yêu cầu làm việc lại về giá thì xuất hiện CTV khác nhập thông tin..."
                rows={3}
                className="w-full rounded-xl border border-slate-300 p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-rose-500 focus:outline-none"
              />
            </div>

            {/* CHECKBOX CAM KẾT TRUNG THỰC */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-[11px] text-slate-700 flex items-start gap-2.5">
              <input
                type="checkbox"
                id="commitCheck"
                checked={commitChecked}
                onChange={(e) => setCommitChecked(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
              />
              <label htmlFor="commitCheck" className="cursor-pointer leading-relaxed">
                <strong>Cam kết trung thực theo Quy chế HaNoi Realty:</strong> Tôi cam đoan toàn bộ chứng từ nộp trên là hình ảnh thật, không chỉnh sửa cắt ghép. Nếu vi phạm, tôi chấp nhận bị tước quyền môi giới và khóa tài khoản vĩnh viễn.
              </label>
            </div>

            {errorMsg && (
              <p className="text-xs font-semibold text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-200">
                {errorMsg}
              </p>
            )}

            {/* Nút hành động */}
            <div className="border-t border-slate-100 pt-4 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 font-bold text-white text-xs shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                {isSubmitting ? (
                  'Đang gửi hồ sơ...'
                ) : (
                  <>
                    <FileCheck2 className="h-4 w-4" />
                    <span>Nộp hồ sơ khiếu nại (Chuyển Tranh Chấp)</span>
                  </>
                )}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
