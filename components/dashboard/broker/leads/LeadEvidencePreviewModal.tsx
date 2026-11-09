'use client';

import React from 'react';
import { X, ExternalLink, ShieldCheck, Download, FileText } from 'lucide-react';
import { LeadItem } from '@/types/broker-lead';

interface LeadEvidencePreviewModalProps {
  lead: LeadItem | null;
  onClose: () => void;
}

export const LeadEvidencePreviewModal: React.FC<LeadEvidencePreviewModalProps> = ({
  lead,
  onClose,
}) => {
  if (!lead) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative flex flex-col w-full max-w-xl max-h-[90vh] rounded-2xl bg-white shadow-2xl border border-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3.5 bg-slate-50">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
              <ShieldCheck className="h-4 w-4" />
            </span>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-tight">
                Bằng Chứng Kết Nối Khách Hàng
              </h3>
              <p className="text-slate-500 text-xs">
                Khách: <strong>{lead.fullName}</strong> ({lead.maskedPhone}) • BĐS: <strong>{lead.targetPropertyCode}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200/60"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-700 border border-slate-200">
            <strong>Ghi chú bằng chứng:</strong> {lead.evidenceNote || 'Ảnh chụp màn hình trao đổi hẹn xem nhà'}
          </div>

          <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-100 aspect-4/3 flex items-center justify-center">
            {lead.evidenceUrl ? (
              <img
                src={lead.evidenceUrl}
                alt="Bằng chứng kết nối"
                className="h-full w-full object-contain"
              />
            ) : (
              <div className="text-center text-slate-400 text-xs">
                <FileText className="h-8 w-8 mx-auto mb-1 text-slate-300" />
                Chưa có hình ảnh bằng chứng đính kèm
              </div>
            )}
          </div>

          <div className="text-[11px] text-slate-500 italic">
            * Bằng chứng này được bộ phận kiểm duyệt HaNoi Realty thẩm định để bảo vệ độc quyền hoa hồng trong thời hạn bảo lưu.
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-slate-200 bg-slate-50 px-5 py-3">
          {lead.evidenceUrl && (
            <a
              href={lead.evidenceUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Mở ảnh gốc</span>
            </a>
          )}
          <button
            onClick={onClose}
            className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500 shadow-xs"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
};

