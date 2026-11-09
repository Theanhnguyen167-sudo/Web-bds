'use client';

import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Landmark, 
  FileText, 
  Download, 
  Upload, 
  Check, 
  ShieldCheck, 
  Coins, 
  CreditCard,
  ExternalLink,
  Receipt
} from 'lucide-react';
import { CommissionRecord } from '@/types/broker-finance';
import { BROKER_DEFAULT_BENEFICIARY } from '@/lib/data/broker-mock-finances';
import { formatCurrencyVND } from '@/lib/utils';
import { STATUS_METADATA } from './CommissionLedger';

interface SettlementDetailDrawerProps {
  record: CommissionRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitDisputeEvidence?: (recordId: string, note: string) => void;
}

export const SettlementDetailDrawer: React.FC<SettlementDetailDrawerProps> = ({
  record,
  isOpen,
  onClose,
  onSubmitDisputeEvidence,
}) => {
  const [disputeNote, setDisputeNote] = useState('');
  const [evidencePreview, setEvidencePreview] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen || !record) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setEvidencePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleDisputeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disputeNote.trim()) return;

    if (onSubmitDisputeEvidence) {
      onSubmitDisputeEvidence(record.id, disputeNote.trim());
    }
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setDisputeNote('');
      setEvidencePreview(null);
    }, 2000);
  };

  const meta = STATUS_METADATA[record.status];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        <aside className="w-screen max-w-xl bg-white shadow-2xl border-l border-slate-200 flex flex-col">
          
          {/* Header Drawer */}
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 bg-slate-50">
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${meta.badgeColor}`}>
                  {meta.label}
                </span>
                <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {record.dealCode}
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base mt-1 line-clamp-1">
                {record.listingTitle}
              </h3>
            </div>

            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200/60 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
            
            {/* Box giải thích điều kiện thực tế trạng thái hiện tại */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">Điều kiện thực tế: {meta.shortCondition}</span>
                <span className="text-[10px] text-slate-400 font-mono">Quy chuẩn HaNoi Realty</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                {meta.fullCondition}
              </p>
            </div>
            
            {/* THẺ TỔNG HỢP SỐ TIỀN THỰC NHẬN */}
            <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 p-5 text-white space-y-3 shadow-md">
              <span className="text-[11px] font-semibold text-blue-200 uppercase tracking-wider block">
                Bóc tách chi tiết hoa hồng
              </span>

              <div className="flex items-baseline justify-between border-b border-white/10 pb-2.5">
                <span className="text-slate-300">Giá trị giao dịch chốt:</span>
                <span className="font-mono font-bold text-white text-sm">
                  {formatCurrencyVND(record.transactionValue)}
                </span>
              </div>

              <div className="flex items-baseline justify-between border-b border-white/10 pb-2.5">
                <span className="text-slate-300">Tổng phí môi giới ({record.totalCommissionRate}%):</span>
                <span className="font-mono text-blue-300">
                  {formatCurrencyVND(record.totalCommissionAmount)}
                </span>
              </div>

              <div className="flex items-baseline justify-between border-b border-white/10 pb-2.5">
                <span className="text-slate-300">Phần trăm CTV ({record.brokerShareRate}% theo {record.agreementVersion}):</span>
                <span className="font-mono font-bold text-amber-300">
                  {formatCurrencyVND(record.brokerShareAmount)}
                </span>
              </div>

              <div className="rounded-lg bg-white/5 p-2 text-[10px] text-slate-300 flex items-center gap-1.5 border border-white/10">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>Phiên bản thỏa thuận <strong>{record.agreementVersion}</strong> đã khóa cứng, bảo vệ hoa hồng không bị ảnh hưởng bởi thay đổi biểu phí sau này.</span>
              </div>

              {record.taxWithholding ? (
                <div className="flex items-baseline justify-between border-b border-white/10 pb-2.5 text-rose-300">
                  <span>Khấu trừ thuế TNCN (10% tạm tính):</span>
                  <span className="font-mono">- {formatCurrencyVND(record.taxWithholding)}</span>
                </div>
              ) : null}

              <div className="flex items-baseline justify-between pt-1">
                <div>
                  <span className="text-xs font-extrabold text-white block">
                    Số tiền thực chuyển về tài khoản:
                  </span>
                  <span className="text-[10px] text-slate-300">
                    {record.status === 'paid' ? 'Đã thanh toán đủ' : 'Ước tính thực nhận'}
                  </span>
                </div>
                <span className="text-2xl font-black text-emerald-400 font-mono">
                  {formatCurrencyVND(record.netPayoutAmount)}
                </span>
              </div>
            </div>

            {/* THÔNG TIN TÀI KHOẢN NGÂN HÀNG THỤ HƯỞNG CỦA MÔI GIỚI */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-2">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Landmark className="h-4 w-4 text-blue-600" />
                  Tài khoản ngân hàng nhận tiền thụ hưởng:
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  <ShieldCheck className="h-3 w-3" />
                  Đã xác thực
                </span>
              </div>

              <div className="space-y-1 text-slate-700 pt-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Ngân hàng:</span>
                  <strong className="text-slate-900">{BROKER_DEFAULT_BENEFICIARY.bankName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Số tài khoản:</span>
                  <strong className="font-mono text-blue-700 text-sm tracking-wider">
                    {BROKER_DEFAULT_BENEFICIARY.accountNumber}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Chủ tài khoản:</span>
                  <strong className="font-mono">{BROKER_DEFAULT_BENEFICIARY.accountHolder}</strong>
                </div>
                <div className="flex justify-between text-slate-500 text-[11px]">
                  <span>Chi nhánh:</span>
                  <span>{BROKER_DEFAULT_BENEFICIARY.bankBranch}</span>
                </div>
              </div>
            </div>

            {/* CHỨNG TỪ THANH TOÁN (NẾU ĐÃ CHI TRẢ) */}
            {record.status === 'paid' && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                    <Receipt className="h-4 w-4 text-emerald-600" />
                    Chứng từ Ủy nhiệm chi (UNC):
                  </span>
                  <span className="font-mono text-emerald-800 font-bold">
                    {record.paymentReferenceCode}
                  </span>
                </div>
                <p className="text-emerald-900 text-[11px]">
                  Tiền đã được giải ngân thành công vào ngày{' '}
                  <strong>{record.paidAt ? new Date(record.paidAt).toLocaleDateString('vi-VN') : ''}</strong>.
                </p>
                {record.paymentProofUrl && (
                  <div className="pt-2">
                    <a
                      href={record.paymentProofUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-white px-3 py-1.5 text-xs font-bold text-emerald-800 hover:bg-emerald-50 shadow-2xs"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Xem bản scan Ủy nhiệm chi ngân hàng</span>
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* DÒNG THỜI GIAN ĐỐI SOÁT 5 BƯỚC */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                Dòng thời gian chuyển trạng thái khoản tiền:
              </h4>

              <div className="relative border-l-2 border-slate-200 ml-2.5 space-y-3.5">
                {record.timeline.map((step, idx) => (
                  <div key={idx} className="relative pl-5">
                    <span
                      className={`absolute -left-2 top-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold ring-4 ring-white ${
                        step.isCompleted ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-white'
                      }`}
                    >
                      {step.isCompleted ? '✓' : idx + 1}
                    </span>

                    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-2xs space-y-1">
                      <div className="flex items-center justify-between font-bold text-slate-800">
                        <span>{step.title}</span>
                        {step.timestamp && (
                          <span className="font-mono text-[10px] text-slate-400 font-normal">
                            {new Date(step.timestamp).toLocaleDateString('vi-VN')}
                          </span>
                        )}
                      </div>
                      {step.note && (
                        <p className="text-slate-600 text-[11px] leading-relaxed">{step.note}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* KHU VỰC GIẢI TRÌNH (KHI BỊ TRANH CHẤP) */}
            {record.status === 'disputed' && (
              <div className="rounded-xl border border-rose-300 bg-rose-50/70 p-4 space-y-3">
                <div className="flex items-start gap-2 text-rose-900">
                  <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-sm">Khoản tiền đang được đối soát tranh chấp</h5>
                    <p className="mt-1 text-[11px] leading-relaxed">{record.disputeReason}</p>
                  </div>
                </div>

                {isSubmitted ? (
                  <div className="rounded-lg bg-emerald-100 p-3 text-center text-emerald-800 font-bold">
                    ✓ Đã gửi tài liệu giải trình tới Ban Pháp chế. Quản trị viên sẽ phản hồi trong 24h làm việc.
                  </div>
                ) : (
                  <form onSubmit={handleDisputeSubmit} className="space-y-2.5 pt-2 border-t border-rose-200">
                    <label className="block font-bold text-rose-950 text-[11px]">
                      Gửi bằng chứng bổ sung chứng minh quyền hưởng hoa hồng:
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Trình bày chi tiết quá trình dẫn khách, thời gian gặp mặt, tin nhắn xác nhận của chủ nhà..."
                      value={disputeNote}
                      onChange={(e) => setDisputeNote(e.target.value)}
                      className="w-full rounded-xl border border-rose-300 bg-white p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />

                    <div className="border border-dashed border-rose-300 rounded-xl p-3 text-center bg-white cursor-pointer relative hover:bg-rose-50/50">
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleFileUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      {evidencePreview ? (
                        <div className="flex items-center justify-center gap-2 text-emerald-700 font-bold">
                          <Check className="h-4 w-4" /> Đã chọn ảnh bằng chứng
                        </div>
                      ) : (
                        <div className="text-slate-500 text-[11px]">
                          <Upload className="h-4 w-4 mx-auto mb-1 text-slate-400" />
                          Tải ảnh chụp check-in thực tế hoặc nhật ký cuộc gọi
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="rounded-xl bg-rose-600 px-4 py-2 font-bold text-white hover:bg-rose-500 shadow"
                      >
                        Gửi giải trình cho Ban Pháp chế
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

          </div>

          {/* Footer Drawer */}
          <div className="border-t border-slate-200 bg-slate-50 p-4 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">
              Mã BĐS: <strong className="font-mono text-slate-800">{record.propertyCode}</strong>
            </span>
            <button
              onClick={onClose}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              Đóng
            </button>
          </div>

        </aside>
      </div>
    </div>
  );
};

