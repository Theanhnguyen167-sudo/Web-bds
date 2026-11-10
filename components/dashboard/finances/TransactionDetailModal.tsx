'use client';

import React from 'react';
import {
  X,
  FileText,
  Building2,
  User,
  ShieldCheck,
  Calendar,
  AlertCircle,
  ExternalLink,
  Copy,
  Check,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { FinancialTransaction } from '@/types/finance';
import { CodeBadge } from '@/components/common/CodeBadge';
import { formatCurrencyVND } from '@/lib/utils';

interface TransactionDetailModalProps {
  transaction: FinancialTransaction | null;
  onClose: () => void;
  onRequestReconcile?: (tx: FinancialTransaction) => void;
}

export function TransactionDetailModal({
  transaction,
  onClose,
  onRequestReconcile,
}: TransactionDetailModalProps) {
  const [copiedField, setCopiedField] = React.useState<string | null>(null);

  if (!transaction) return null;

  const handleCopy = (text: string, field: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'bank_escrowed':
        return {
          bg: 'bg-blue-100 text-blue-800 border-blue-200',
          label: '🔒 Ngân hàng xác nhận phong tỏa bảo chứng',
        };
      case 'approved':
        return {
          bg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          label: '✓ Đã duyệt chi chờ giải ngân',
        };
      case 'completed':
        return {
          bg: 'bg-green-100 text-green-800 border-green-200',
          label: '✓ Đã nhận tiền thành công',
        };
      case 'pending_confirmation':
        return {
          bg: 'bg-amber-100 text-amber-800 border-amber-200',
          label: '⏳ Chờ đối soát chứng từ',
        };
      case 'rejected':
        return {
          bg: 'bg-rose-100 text-rose-800 border-rose-200',
          label: '✕ Đã từ chối',
        };
      default:
        return {
          bg: 'bg-slate-100 text-slate-800 border-slate-200',
          label: '⏳ Chờ thanh toán',
        };
    }
  };

  const statusBadge = getStatusBadge(transaction.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-slate-500">Mã giao dịch:</span>
              <span className="text-sm font-mono font-black text-slate-900">{transaction.transactionCode}</span>
            </div>
            <p className="text-xs text-slate-500">
              Chi tiết bút toán thu chi và trạng thái phong tỏa bảo chứng
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* Trạng thái & Số tiền nổi bật */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Số tiền thực thanh toán</p>
              <p className="text-2xl font-black text-orange-600 mt-0.5">
                {formatCurrencyVND(transaction.netAmount)}
              </p>
              {transaction.deductionFee > 0 && (
                <p className="text-[11px] text-slate-500 mt-0.5">
                  (Tiền gộp: {formatCurrencyVND(transaction.grossAmount)} - Khấu trừ: {formatCurrencyVND(transaction.deductionFee)})
                </p>
              )}
            </div>
            <div className={`px-3 py-1.5 rounded-full border text-xs font-bold self-start sm:self-auto ${statusBadge.bg}`}>
              {statusBadge.label}
            </div>
          </div>

          {/* Liên kết Mã BĐS & Mã Hợp đồng */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-2xl border border-slate-200 p-3.5 space-y-1.5 bg-white">
              <p className="text-[11px] font-bold text-slate-400 uppercase">Hợp đồng liên kết:</p>
              <div className="flex items-center gap-2">
                {transaction.contractCode ? (
                  <CodeBadge code={transaction.contractCode} label="Mã HĐ" />
                ) : (
                  <span className="text-slate-500 font-semibold">Giao dịch dịch vụ sàn</span>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 p-3.5 space-y-1.5 bg-white">
              <p className="text-[11px] font-bold text-slate-400 uppercase">Bất động sản:</p>
              <div className="flex items-center gap-2">
                {transaction.listingCode ? (
                  <>
                    <CodeBadge code={transaction.listingCode} label="Mã căn" />
                    <span className="font-bold text-slate-800 truncate">{transaction.listingTitle}</span>
                  </>
                ) : (
                  <span className="text-slate-500 font-semibold">Không liên kết căn nhà</span>
                )}
              </div>
            </div>
          </div>

          {/* Bên chuyển & Bên nhận */}
          <div className="rounded-2xl border border-slate-200 p-4 space-y-3 bg-white">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Luồng chuyển tiền giữa các bên:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-slate-500 font-medium">Bên chuyển tiền (Người trả):</p>
                <div className="flex items-center gap-1.5">
                  {transaction.payerCode && (
                    <CodeBadge code={transaction.payerCode} size="sm" />
                  )}
                  <span className="font-extrabold text-slate-900">{transaction.payerName}</span>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-slate-500 font-medium">Bên nhận tiền (Người thụ hưởng):</p>
                <div className="flex items-center gap-1.5">
                  {transaction.receiverCode && (
                    <CodeBadge code={transaction.receiverCode} size="sm" />
                  )}
                  <span className="font-extrabold text-slate-900">{transaction.receiverName}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Ngân hàng phong tỏa trung gian (Escrow) */}
          {transaction.escrowBankName && (
            <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-blue-700" />
                <span className="text-xs font-black text-blue-950 uppercase tracking-wide">
                  Ngân hàng trung gian phong tỏa bảo chứng
                </span>
              </div>
              <p className="text-xs font-bold text-slate-800">{transaction.escrowBankName}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11.5px] pt-1 border-t border-blue-200/60 text-slate-600">
                <div>
                  <span className="text-slate-500">Số tài khoản ký quỹ: </span>
                  <span className="font-mono font-bold text-slate-900">
                    {transaction.beneficiaryAccount || '9999 **** 8888'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">Tên tài khoản: </span>
                  <span className="font-bold text-slate-900">HANOI REALTY ESCROW ACCOUNT</span>
                </div>
              </div>
              {transaction.releaseConditions && (
                <div className="pt-2 text-[11px] text-blue-900 border-t border-blue-200/60">
                  <span className="font-bold">Điều kiện giải ngân: </span>
                  <span>{transaction.releaseConditions}</span>
                </div>
              )}
            </div>
          )}

          {/* Thông tin chuyển khoản & Cú pháp */}
          {transaction.transferSyntax && (
            <div className="rounded-2xl border border-slate-200 p-4 space-y-2 bg-slate-50/60">
              <p className="text-[11px] font-bold text-slate-400 uppercase">Nội dung chuyển khoản chuẩn:</p>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200">
                <span className="font-mono font-bold text-slate-900">{transaction.transferSyntax}</span>
                <button
                  type="button"
                  onClick={() => handleCopy(transaction.transferSyntax!, 'syntax')}
                  className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700"
                >
                  {copiedField === 'syntax' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedField === 'syntax' ? 'Đã sao chép' : 'Sao chép'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Chứng từ thanh toán */}
          {transaction.proofImageUrl && (
            <div className="rounded-2xl border border-slate-200 p-4 space-y-2 bg-white">
              <p className="text-[11px] font-bold text-slate-400 uppercase">Chứng từ chuyển khoản / Ủy nhiệm chi:</p>
              <div className="relative rounded-xl overflow-hidden border border-slate-200 max-h-48 group">
                <img
                  src={transaction.proofImageUrl}
                  alt="Chứng từ chuyển khoản"
                  className="w-full h-48 object-cover"
                />
                <a
                  href={transaction.proofImageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-bold text-xs"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Xem ảnh kích thước gốc</span>
                </a>
              </div>
            </div>
          )}

          {/* Ghi chú kế toán / Quản trị viên */}
          {transaction.adminNote && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-[11px] text-slate-600 space-y-1">
              <p className="font-bold text-slate-800">Ghi chú đối soát hệ thống:</p>
              <p>{transaction.adminNote}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2 text-slate-400 text-[11px]">
            <Calendar className="h-3.5 w-3.5" />
            <span>Ngày tạo: {new Date(transaction.createdAt).toLocaleDateString('vi-VN')}</span>
          </div>

          <div className="flex items-center gap-2">
            {onRequestReconcile && (
              <button
                type="button"
                onClick={() => onRequestReconcile(transaction)}
                className="px-4 py-2 rounded-xl border border-orange-200 bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold text-xs transition-colors cursor-pointer"
              >
                Gửi yêu cầu đối chiếu
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs transition-colors cursor-pointer"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TransactionDetailModal;

