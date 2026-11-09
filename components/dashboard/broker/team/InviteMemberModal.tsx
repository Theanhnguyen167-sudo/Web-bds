'use client';

import React, { useState } from 'react';
import {
  X,
  UserPlus,
  Mail,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Info
} from 'lucide-react';
import { TeamInvitePayload } from '@/types/broker-team';

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInviteSuccess?: (payload: TeamInvitePayload) => void;
  isExpired?: boolean;
}

export const InviteMemberModal: React.FC<InviteMemberModalProps> = ({
  isOpen,
  onClose,
  onInviteSuccess,
  isExpired = false,
}) => {
  const [identifier, setIdentifier] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setError('Vui lòng nhập Mã CTV (VD: CTV-HN1180) hoặc Email đăng ký');
      return;
    }
    setError(null);
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      if (onInviteSuccess) {
        onInviteSuccess({ brokerCodeOrEmail: identifier, note });
      }
    }, 1000);
  };

  const handleReset = () => {
    setIdentifier('');
    setNote('');
    setError(null);
    setIsSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden">
        
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b border-purple-100 bg-purple-50/70 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Gửi Lời Mời Gia Nhập Đội Nhóm
              </h3>
              <p className="text-xs text-purple-700 font-medium">
                Dành cho Trưởng phòng kinh doanh (TPKD)
              </p>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">
              Đã Gửi Lời Mời Thành Công!
            </h4>
            <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
              Hệ thống đã gửi thông báo đến tài khoản <strong>{identifier}</strong>. Theo quy chế sàn, CTV sẽ chính thức được ghi nhận vào nhóm khi bấm <strong>[Đồng ý tham gia]</strong>.
            </p>
            <div className="pt-2">
              <button
                onClick={handleReset}
                className="px-5 py-2.5 rounded-xl bg-purple-600 text-xs font-bold text-white hover:bg-purple-500 shadow-sm"
              >
                Đóng cửa sổ
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            
            {/* Cảnh báo gói hết hạn nếu có */}
            {isExpired && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-rose-800 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Gói TPKD của bạn đã hết hạn:</strong> Bạn không thể gửi thêm lời mời mới. Vui lòng gia hạn gói để tiếp tục tuyển dụng và mở rộng nhóm.
                </div>
              </div>
            )}

            {/* Quy chuẩn xác nhận 2 chiều */}
            <div className="rounded-xl border border-purple-200 bg-purple-50/50 p-3.5 text-purple-950 flex items-start gap-2.5">
              <Info className="h-4 w-4 text-purple-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed text-[11px]">
                <strong>Nguyên tắc tôn trọng tự nguyện của HaNoi Realty:</strong> CTV không thể bị tự ý thêm vào đội nhóm. CTV được mời sẽ nhận được thông báo trong bảng điều khiển và tự quyết định xác nhận tham gia.
              </div>
            </div>

            {/* Ô nhập thông tin định danh */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-800 block">
                Mã CTV hoặc Email đăng ký của Môi giới <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="VD: CTV-HN1180 hoặc email@hanoirealty.vn"
                  disabled={isExpired}
                  className="w-full rounded-xl border border-slate-300 py-2.5 pl-3.5 pr-10 text-xs text-slate-900 placeholder:text-slate-400 focus:border-purple-600 focus:outline-none focus:ring-1 focus:ring-purple-600 disabled:bg-slate-100 disabled:text-slate-400"
                />
                <Mail className="absolute right-3 top-2.5 h-4 w-4 text-slate-400" />
              </div>
              {error && <p className="text-[11px] font-medium text-rose-600">{error}</p>}
            </div>

            {/* Lời nhắn TPKD */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-800 block">
                Lời nhắn / Giới thiệu khu vực phụ trách (Tùy chọn)
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="VD: Chào bạn, mời bạn gia nhập Đội nhóm phụ trách BĐS quận Đống Đa - Ba Đình cùng hỗ trợ khảo sát và đàm phán cọc..."
                rows={3}
                disabled={isExpired}
                className="w-full rounded-xl border border-slate-300 p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-purple-600 focus:outline-none focus:ring-1 focus:ring-purple-600 disabled:bg-slate-100"
              />
            </div>

            <div className="border-t border-slate-100 pt-4 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 rounded-xl border border-slate-200 font-semibold text-slate-700 hover:bg-slate-50"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isExpired || isSubmitting}
                className="px-5 py-2.5 rounded-xl bg-purple-600 font-bold text-white hover:bg-purple-500 shadow-sm transition-colors flex items-center gap-1.5 disabled:opacity-50"
              >
                {isSubmitting ? (
                  'Đang gửi lời mời...'
                ) : (
                  <>
                    <UserPlus className="h-4 w-4" />
                    <span>Gửi lời mời vào nhóm</span>
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

