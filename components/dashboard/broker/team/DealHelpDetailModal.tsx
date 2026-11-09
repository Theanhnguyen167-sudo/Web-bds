'use client';

import React, { useState } from 'react';
import {
  X,
  AlertCircle,
  Phone,
  MessageSquare,
  Building2,
  CheckCircle2,
  ShieldCheck,
  Crown,
  FileCheck2,
  ArrowRight
} from 'lucide-react';
import { TeamMember } from '@/types/broker-team';

interface DealHelpDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: TeamMember | null;
  onAcceptHelp?: (memberId: string, dealCode: string) => void;
}

export const DealHelpDetailModal: React.FC<DealHelpDetailModalProps> = ({
  isOpen,
  onClose,
  member,
  onAcceptHelp,
}) => {
  const [isAccepted, setIsAccepted] = useState(false);
  const [actionNote, setActionNote] = useState('');

  if (!isOpen || !member) return null;

  const handleAccept = () => {
    setIsAccepted(true);
    if (onAcceptHelp && member.pendingHelpDealCode) {
      onAcceptHelp(member.id, member.pendingHelpDealCode);
    }
  };

  const handleClose = () => {
    setIsAccepted(false);
    setActionNote('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl bg-white shadow-2xl overflow-hidden">
        
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b border-amber-200 bg-amber-50/70 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Yêu Cầu Hỗ Trợ Deal Vướng Mắc
              </h3>
              <p className="text-xs text-amber-800 font-medium">
                Thành viên: <span className="font-bold">{member.fullName}</span> ({member.brokerCode})
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

        {isAccepted ? (
          <div className="p-8 text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">
              Đã Tiếp Nhận Hỗ Trợ Deal Thành Công!
            </h4>
            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              Nhiệm vụ hỗ trợ deal <strong>{member.pendingHelpDealCode}</strong> đã được ghi nhận vào Bảng kê Thù lao Quản lý của bạn. Hệ thống đã gửi thông báo đến CTV {member.fullName} để phối hợp tại hiện trường.
            </p>
            <div className="pt-2">
              <button
                onClick={handleClose}
                className="px-6 py-2.5 rounded-xl bg-purple-600 text-xs font-bold text-white hover:bg-purple-500 shadow-sm"
              >
                Đóng cửa sổ
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-5 text-xs">
            
            {/* Thông tin deal và vấn đề */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Mã giao dịch
                </span>
                <span className="font-mono font-bold text-xs bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-md border border-blue-200">
                  {member.pendingHelpDealCode || 'DEAL-2026-0389'}
                </span>
              </div>

              <div>
                <span className="text-slate-500 block text-[11px] font-medium">Nội dung vướng mắc cần TPKD vào cuộc:</span>
                <p className="text-slate-900 font-semibold mt-1 bg-white p-3 rounded-lg border border-slate-200 leading-relaxed">
                  "{member.pendingHelpTopic || 'Cần TPKD hỗ trợ đàm phán trực tiếp với chủ nhà và người mua để tháo gỡ điều khoản cọc.'}"
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[10px]">CTV phụ trách:</span>
                  <span className="font-bold text-slate-800">{member.fullName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Số điện thoại:</span>
                  <span className="font-bold text-blue-700">{member.phone}</span>
                </div>
              </div>
            </div>

            {/* Cơ chế Thù lao Quản lý minh bạch */}
            <div className="rounded-xl border border-purple-200 bg-purple-50/60 p-3.5 text-purple-950 flex items-start gap-2.5">
              <Crown className="h-4 w-4 text-purple-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed text-[11px]">
                <strong>Ghi nhận Thù lao Quản lý (Management Override):</strong> Khi TPKD tham gia hỗ trợ trực tiếp và deal chốt cọc thành công, TPKD sẽ được giải ngân khoản thù lao từ <strong>5.000.000đ – 15.000.000đ</strong> dựa trên nghiệm thu đóng góp thực tế, không trừ vào hoa hồng của CTV.
              </div>
            </div>

            {/* Kế hoạch hành động của TPKD */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-800 block">
                Ghi chú phương án hỗ trợ của TPKD (Hiển thị cho CTV)
              </label>
              <textarea
                value={actionNote}
                onChange={(e) => setActionNote(e.target.value)}
                placeholder="VD: Anh sẽ trực tiếp có mặt tại hiện trường cùng em lúc 15h30 để rà soát bản vẽ quy hoạch và chủ trì cuộc họp 3 bên..."
                rows={3}
                className="w-full rounded-xl border border-slate-300 p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-purple-600 focus:outline-none focus:ring-1 focus:ring-purple-600"
              />
            </div>

            {/* Nút hành động */}
            <div className="border-t border-slate-100 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <a
                  href={`tel:${member.phone.replace(/[^0-9]/g, '')}`}
                  className="px-3 py-2 rounded-xl border border-slate-200 bg-white font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
                >
                  <Phone className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Gọi cho CTV</span>
                </a>
                <a
                  href={`https://zalo.me/${member.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 rounded-xl border border-blue-200 bg-blue-50/60 font-semibold text-blue-700 hover:bg-blue-100 flex items-center gap-1.5"
                >
                  <MessageSquare className="h-3.5 w-3.5 text-blue-600" />
                  <span>Nhắn Zalo</span>
                </a>
              </div>

              <div className="flex items-center gap-2 justify-end">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Để sau
                </button>
                <button
                  type="button"
                  onClick={handleAccept}
                  className="px-4 py-2 rounded-xl bg-purple-600 font-bold text-white hover:bg-purple-500 shadow-sm flex items-center gap-1.5"
                >
                  <FileCheck2 className="h-4 w-4" />
                  <span>Tiếp nhận hỗ trợ deal</span>
                </button>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

