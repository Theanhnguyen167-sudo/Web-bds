'use client';

import React, { useState } from 'react';
import {
  ShieldAlert,
  Building2,
  DollarSign,
  TrendingUp,
  Filter,
  CheckCircle2,
  XCircle,
  FileCheck,
  Search,
  History,
  AlertTriangle,
  Send,
  Eye,
  Check,
  X,
} from 'lucide-react';
import { formatCurrencyVND } from '@/lib/utils';
import { CodeBadge } from '@/components/common/CodeBadge';
import {
  MOCK_ROLE_FINANCIAL_SUMMARIES,
  MOCK_FINANCIAL_TRANSACTIONS,
} from '@/lib/data/mock-finance-data';
import { FinancialTransaction } from '@/types/finance';

interface AdminFinanceViewProps {
  onSelectTransaction: (tx: FinancialTransaction) => void;
  onApproveTransaction?: (id: string) => void;
  onRejectTransaction?: (id: string, reason: string) => void;
}

export function AdminFinanceView({
  onSelectTransaction,
  onApproveTransaction,
  onRejectTransaction,
}: AdminFinanceViewProps) {
  const summary = MOCK_ROLE_FINANCIAL_SUMMARIES.admin;
  const [transactions, setTransactions] = useState<FinancialTransaction[]>(MOCK_FINANCIAL_TRANSACTIONS);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchCode, setSearchCode] = useState<string>('');
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState<string>('');

  const filteredTransactions = transactions.filter((t) => {
    if (filterCategory !== 'all' && t.category !== filterCategory) return false;
    if (searchCode.trim()) {
      const q = searchCode.toLowerCase().trim();
      const matchContract = t.contractCode?.toLowerCase().includes(q);
      const matchListing = t.listingCode?.toLowerCase().includes(q);
      const matchPayer = t.payerCode?.toLowerCase().includes(q) || t.payerName.toLowerCase().includes(q);
      const matchReceiver = t.receiverCode?.toLowerCase().includes(q) || t.receiverName.toLowerCase().includes(q);
      const matchCode = t.transactionCode.toLowerCase().includes(q);
      if (!matchContract && !matchListing && !matchPayer && !matchReceiver && !matchCode) return false;
    }
    return true;
  });

  const handleApprove = (id: string) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'completed', statusLabel: 'Đã hoàn tất chi' } : t))
    );
    if (onApproveTransaction) onApproveTransaction(id);
  };

  const handleRejectConfirm = (id: string) => {
    if (!rejectReason.trim()) return;
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status: 'rejected',
              statusLabel: 'Bị từ chối',
              adminNote: `Từ chối duyệt: ${rejectReason}`,
            }
          : t
      )
    );
    if (onRejectTransaction) onRejectTransaction(id, rejectReason);
    setRejectingId(null);
    setRejectReason('');
  };

  return (
    <div className="space-y-6">
      {/* 3 KHỐI DÒNG TIỀN TÁCH BIỆT (ADMIN GOVERNANCE) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 1. Tiền giao dịch BĐS đang giữ hộ (Escrow) */}
        <div className="rounded-3xl border border-blue-200 bg-blue-50/60 p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11.5px] font-bold uppercase tracking-wider text-blue-900">
              Tiền giao dịch BĐS giữ hộ (Escrow)
            </span>
            <div className="h-8 w-8 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700">
              <Building2 className="h-4 w-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-blue-700">
            {formatCurrencyVND(summary.adminEscrowHolding || 0)}
          </p>
          <p className="text-[11px] text-blue-800 font-medium">
            🔒 Phong tỏa tại Vietcombank Escrow (<strong>Không tính vào doanh thu sàn</strong>)
          </p>
        </div>

        {/* 2. Doanh thu nền tảng (Phí gói + Phí sàn) */}
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50/60 p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11.5px] font-bold uppercase tracking-wider text-emerald-900">
              Doanh thu dịch vụ nền tảng
            </span>
            <div className="h-8 w-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-emerald-700">
            {formatCurrencyVND(summary.adminPlatformRevenue || 0)}
          </p>
          <p className="text-[11px] text-emerald-800">136 tr phí môi giới sàn + 998k phí gói cước hội viên</p>
        </div>

        {/* 3. Hoa hồng CTV chờ chi trả */}
        <div className="rounded-3xl border border-orange-200 bg-orange-50/60 p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11.5px] font-bold uppercase tracking-wider text-orange-900">
              Hoa hồng CTV chờ chi trả
            </span>
            <div className="h-8 w-8 rounded-xl bg-orange-100 flex items-center justify-center text-orange-700">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-orange-600">
            {formatCurrencyVND(summary.adminCommissionPayable || 0)}
          </p>
          <p className="text-[11px] text-orange-800">Đã phê duyệt bảng kê, chờ lệnh giải ngân ngân hàng</p>
        </div>
      </div>

      {/* CẢNH BÁO BẢO VỆ TOÀN VẸN SỐ DƯ */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600 flex items-start gap-2.5">
        <ShieldAlert className="h-5 w-5 text-slate-500 shrink-0 mt-0.5" />
        <div className="space-y-0.5 leading-relaxed">
          <p className="font-bold text-slate-800">Quy định kiểm soát tài chính &amp; Phân quyền kế toán:</p>
          <p>
            Hệ thống <strong>không cho phép sửa trực tiếp số dư</strong> của bất kỳ tài khoản nào. Mọi biến động tiền phải được phát sinh từ giao dịch hợp đồng, phí gói cước hoặc bảng kê chi trả hoa hồng có chứng từ và lưu vết kiểm toán (Audit Trail) đầy đủ.
          </p>
        </div>
      </div>

      {/* BỘ LỌC VÀ DANH SÁCH BÚT TOÁN TOÀN HỆ THỐNG */}
      <div className="rounded-3xl border border-border bg-white p-6 sm:p-7 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-sm sm:text-base font-black text-slate-900">
              Sổ cái giao dịch &amp; Bút toán tài chính sàn
            </h3>
            <p className="text-xs text-slate-500">
              Đối soát chứng từ, phê duyệt giải ngân và kiểm soát dòng tiền
            </p>
          </div>

          {/* Lọc danh mục */}
          <div className="flex items-center gap-2">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="p-2 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50 focus:outline-none focus:border-orange-500"
            >
              <option value="all">Tất cả danh mục</option>
              <option value="deal_escrow">Tiền cọc / Escrow BĐS</option>
              <option value="broker_commission">Hoa hồng CTV / TPKD</option>
              <option value="package_fee">Phí gói cước</option>
            </select>
          </div>
        </div>

        {/* Thanh tìm kiếm theo mã HĐ, BĐS, MG, CN */}
        <div className="relative">
          <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Lọc theo mã HĐ (HD-00035), mã căn (BDS-00125), mã CTV (MG-00102), chủ nhà (CN-00086)..."
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:outline-none focus:border-orange-500"
          />
        </div>

        {/* Danh sách bảng giao dịch */}
        <div className="space-y-3">
          {filteredTransactions.map((tx) => (
            <div
              key={tx.id}
              className="rounded-2xl border border-slate-200 p-4 sm:p-5 bg-white hover:border-orange-300 transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs text-slate-500">{tx.transactionCode}</span>
                  {tx.contractCode && <CodeBadge code={tx.contractCode} label="Mã HĐ" size="sm" />}
                  {tx.listingCode && <CodeBadge code={tx.listingCode} label="Mã căn" size="sm" />}
                  <span className="text-xs font-bold text-slate-800">{tx.listingTitle || 'Thanh toán phí dịch vụ'}</span>
                </div>

                <span className="text-xs font-black text-slate-900">{formatCurrencyVND(tx.netAmount)}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs pt-2 border-t border-slate-100 text-slate-600">
                <div>
                  <span className="text-slate-400">Bên trả: </span>
                  <strong>{tx.payerName}</strong> {tx.payerCode && `(${tx.payerCode})`}
                </div>
                <div>
                  <span className="text-slate-400">Bên nhận: </span>
                  <strong>{tx.receiverName}</strong> {tx.receiverCode && `(${tx.receiverCode})`}
                </div>
                <div>
                  <span className="text-slate-400">Trạng thái: </span>
                  <span className="font-bold text-slate-800">{tx.statusLabel}</span>
                </div>
              </div>

              {/* Khu vực phê duyệt / từ chối của Admin */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => onSelectTransaction(tx)}
                  className="text-xs font-bold text-orange-600 hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>Xem hồ sơ &amp; chứng từ chi tiết</span>
                </button>

                {tx.status === 'approved' && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setRejectingId(tx.id)}
                      className="px-3 py-1.5 rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold transition-colors cursor-pointer"
                    >
                      Từ chối
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApprove(tx.id)}
                      className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Check className="h-3.5 w-3.5" />
                      <span>Xác nhận giải ngân</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Form nhập lý do từ chối */}
              {rejectingId === tx.id && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 space-y-2 mt-2">
                  <label className="block text-xs font-bold text-rose-900">
                    Nhập lý do từ chối duyệt khoản chi:
                  </label>
                  <input
                    type="text"
                    placeholder="VD: Chứng từ mờ, số tài khoản thụ hưởng không khớp..."
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="w-full p-2 rounded-lg border border-rose-300 text-xs bg-white focus:outline-none"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setRejectingId(null)}
                      className="px-3 py-1 rounded-lg text-xs font-semibold text-slate-600 hover:bg-black/5"
                    >
                      Hủy
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRejectConfirm(tx.id)}
                      className="px-3.5 py-1 rounded-lg bg-rose-600 text-white text-xs font-bold"
                    >
                      Xác nhận từ chối
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminFinanceView;

