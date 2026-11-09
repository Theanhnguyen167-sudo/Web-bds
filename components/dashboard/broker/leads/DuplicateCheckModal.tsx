'use client';

import React, { useState } from 'react';
import { 
  X, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  ArrowRight,
  HelpCircle,
  FileText
} from 'lucide-react';
import { BROKER_MOCK_LEADS } from '@/lib/data/broker-mock-leads';
import { LeadDisputeModal } from './LeadDisputeModal';

interface DuplicateCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DuplicateCheckModal: React.FC<DuplicateCheckModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [phoneQuery, setPhoneQuery] = useState('');
  const [result, setResult] = useState<{
    checked: boolean;
    isDuplicate: boolean;
    propertyCode?: string;
    expiresAt?: string;
    daysRemaining?: number;
    leadName?: string;
  } | null>(null);
  const [isDisputeOpen, setIsDisputeOpen] = useState(false);

  if (!isOpen) return null;

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phoneQuery.trim().replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 9) return;

    // Tra cứu trong mock data
    const found = BROKER_MOCK_LEADS.find(
      (l) => l.rawPhone?.includes(cleanPhone) || l.maskedPhone.replace(/\D/g, '').includes(cleanPhone)
    );

    if (found && found.protectionStatus === 'active') {
      setResult({
        checked: true,
        isDuplicate: true,
        propertyCode: found.targetPropertyCode,
        expiresAt: new Date(found.protectionExpiresAt).toLocaleDateString('vi-VN'),
        daysRemaining: found.protectionDaysRemaining,
        leadName: found.fullName.split(' ')[0] + ' ***',
      });
    } else {
      setResult({
        checked: true,
        isDuplicate: false,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative flex flex-col w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3.5 bg-slate-50">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
              <Search className="h-4 w-4" />
            </span>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-tight">
                Tra Cứu & Đối Soát Trùng Khách
              </h3>
              <p className="text-slate-500 text-xs">
                Kiểm tra tình trạng bảo lưu độc quyền theo từng căn BĐS
              </p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200/60">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nội dung */}
        <div className="p-5 space-y-4">
          <form onSubmit={handleCheck} className="space-y-3">
            <label className="block text-xs font-semibold text-slate-700">
              Nhập số điện thoại khách hàng cần tra cứu:
            </label>
            <div className="flex gap-2">
              <input
                type="tel"
                placeholder="Ví dụ: 0912345789 hoặc 0988112345..."
                value={phoneQuery}
                onChange={(e) => setPhoneQuery(e.target.value)}
                className="flex-1 rounded-xl border border-slate-300 px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500 shadow-xs"
              >
                Tra cứu ngay
              </button>
            </div>
          </form>

          {/* Kết quả tra cứu */}
          {result && (
            <div className="animate-in fade-in duration-200">
              {result.isDuplicate ? (
                <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-xs text-amber-900 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-amber-800">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <span>Khách hàng đang được bảo lưu với 1 BĐS!</span>
                  </div>
                  <p className="leading-relaxed">
                    Khách hàng <strong>{result.leadName}</strong> đang được CTV khác bảo lưu hợp lệ đối với BĐS{' '}
                    <strong className="font-mono text-blue-700">{result.propertyCode}</strong>.
                    Thời hạn bảo lưu còn: <strong>{result.daysRemaining} ngày</strong> (đến {result.expiresAt}).
                  </p>
                  <div className="rounded-lg bg-white/80 p-2.5 text-[11px] text-slate-700 border border-amber-200">
                    <strong>Lưu ý quan trọng:</strong> Bạn vẫn <strong>hoàn toàn có quyền</strong> giới thiệu và đăng ký bảo lưu khách hàng này với <em>bất kỳ căn BĐS nào khác</em> trong kho nhà chung!
                  </div>
                  <div className="pt-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setIsDisputeOpen(true)}
                      className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 font-bold text-white text-[11px] shadow-xs flex items-center gap-1 transition-colors"
                    >
                      <AlertTriangle className="h-3.5 w-3.5" />
                      <span>Nộp khiếu nại nếu bạn có bằng chứng sớm hơn</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-xs text-emerald-900 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-emerald-800">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>Số điện thoại khả dụng!</span>
                  </div>
                  <p className="leading-relaxed">
                    Khách hàng này hiện chưa bị trùng bảo lưu với bất kỳ BĐS nào. Bạn có thể tiến hành nộp bằng chứng để đăng ký bảo lưu ngay.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Hướng dẫn quy chế minh bạch HaNoi Realty */}
          <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200/80 text-[11px] text-slate-600 space-y-1.5">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
              Nguyên tắc đối soát trùng khách HaNoi Realty
            </div>
            <p>1. Quyền bảo lưu được gắn chặt theo cặp <strong>Khách hàng – Căn BĐS cụ thể</strong>.</p>
            <p>2. Khách đổi CTV không tự động xóa quyền giới thiệu hợp lệ đã phát sinh trước đó.</p>
            <p>3. Trong trường hợp xảy ra khiếu nại, ban quản trị sẽ đối soát dựa trên thời gian và bằng chứng dẫn xem thực tế.</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end border-t border-slate-200 bg-slate-50 px-5 py-3">
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-800 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-700"
          >
            Đóng
          </button>
        </div>

      </div>

      <LeadDisputeModal
        isOpen={isDisputeOpen}
        onClose={() => setIsDisputeOpen(false)}
        propertyCode={result?.propertyCode || 'HN-BĐS'}
        customerName={result?.leadName || 'Khách hàng'}
        phone={phoneQuery}
        onDisputeSubmitted={() => {
          setIsDisputeOpen(false);
          onClose();
        }}
      />
    </div>
  );
};

