'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Clock,
  CheckCircle2,
  DollarSign,
  Users,
  Tag,
  FileText,
  Calendar,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { formatCurrencyVND } from '@/lib/utils';
import { CodeBadge } from '@/components/common/CodeBadge';
import {
  MOCK_ROLE_FINANCIAL_SUMMARIES,
  MOCK_FINANCIAL_TRANSACTIONS,
  MOCK_USER_BANK_ACCOUNTS,
} from '@/lib/data/mock-finance-data';
import { UserBankAccountsCard } from './UserBankAccountsCard';
import { FinancialTransaction } from '@/types/finance';

interface BrokerFinanceViewProps {
  user: any;
  onSelectTransaction: (tx: FinancialTransaction) => void;
  onRequestReconcile: (tx: FinancialTransaction | null) => void;
}

export function BrokerFinanceView({
  user,
  onSelectTransaction,
  onRequestReconcile,
}: BrokerFinanceViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'commission' | 'packages'>('commission');

  const summary = MOCK_ROLE_FINANCIAL_SUMMARIES.agent;
  const commissionTxs = MOCK_FINANCIAL_TRANSACTIONS.filter(
    (t) => t.category === 'broker_commission'
  );
  const packageTxs = MOCK_FINANCIAL_TRANSACTIONS.filter(
    (t) => t.category === 'package_fee'
  );
  const bankAccounts = MOCK_USER_BANK_ACCOUNTS.agent;

  const isTPKD = user?.package?.toLowerCase() === 'agency' || user?.role === 'agency';

  return (
    <div className="space-y-6">
      {/* 4 Ô TỔNG HỢP HOA HỒNG CTV */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Hoa hồng dự kiến */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11.5px] font-bold uppercase tracking-wider text-slate-400">Hoa hồng dự kiến</span>
            <div className="h-8 w-8 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900">
            {formatCurrencyVND(summary.brokerExpected || 0)}
          </p>
          <p className="text-[11px] text-slate-500">Căn BDS-00125 đang thực hiện hợp đồng</p>
        </div>

        {/* 2. Chờ đối soát */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11.5px] font-bold uppercase tracking-wider text-slate-400">Chờ đối soát hồ sơ</span>
            <div className="h-8 w-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-amber-600">
            {formatCurrencyVND(summary.brokerReconciling || 0)}
          </p>
          <p className="text-[11px] text-slate-500">Đã công chứng, đang kiểm tra chứng từ</p>
        </div>

        {/* 3. Đã duyệt chờ trả */}
        <div className="rounded-3xl border border-blue-200 bg-blue-50/50 p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11.5px] font-bold uppercase tracking-wider text-blue-900">Đã duyệt chờ trả</span>
            <div className="h-8 w-8 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-blue-700">
            {formatCurrencyVND(summary.brokerApprovedPending || 0)}
          </p>
          <p className="text-[11px] text-blue-800">Thực nhận sau thuế TNCN 10% (Chờ lệnh UNC)</p>
        </div>

        {/* 4. Đã nhận */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11.5px] font-bold uppercase tracking-wider text-slate-400">Đã nhận thực tế</span>
            <div className="h-8 w-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-emerald-600">
            {formatCurrencyVND(summary.brokerReceived || 0)}
          </p>
          <p className="text-[11px] text-slate-500">Đã giải ngân về tài khoản Techcombank</p>
        </div>
      </div>

      {/* PHÂN ĐỊNH RÕ RÀNG DÀNH CHO TRƯỞNG PHÒNG KINH DOANH (TPKD / AGENCY) */}
      {isTPKD && (
        <div className="rounded-3xl border border-indigo-200 bg-indigo-50/50 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-black text-indigo-950 uppercase tracking-wide">
                  Phân tích thu nhập & Kết quả đội nhóm (TPKD)
                </h4>
                <p className="text-xs text-indigo-800">
                  Tách bạch hoàn toàn thu nhập cá nhân và doanh số KPI quản lý đội ngũ
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Thu nhập cá nhân của TPKD */}
            <div className="rounded-2xl border border-indigo-200 bg-white p-4 space-y-2 shadow-xs">
              <span className="text-[11px] font-bold uppercase text-slate-400">Thu nhập cá nhân của tôi (TPKD)</span>
              <p className="text-xl font-black text-slate-900">
                {formatCurrencyVND((summary.brokerApprovedPending || 0) + (summary.brokerReceived || 0))}
              </p>
              <p className="text-[11.5px] text-slate-600">
                Hoa hồng trực tiếp từ các căn nhà do bạn đại diện ký gửi và chốt khách thành công.
              </p>
            </div>

            {/* Kết quả đội nhóm */}
            <div className="rounded-2xl border border-indigo-200 bg-white p-4 space-y-2 shadow-xs">
              <span className="text-[11px] font-bold uppercase text-slate-400">Kết quả đội nhóm kinh doanh (KPI)</span>
              <p className="text-xl font-black text-indigo-700">
                {formatCurrencyVND(summary.teamTotalCommission || 0)}
              </p>
              <p className="text-[11.5px] text-indigo-950 font-medium">
                Tổng doanh số chốt: {formatCurrencyVND(summary.teamTotalSales || 0)} (6 thành viên).
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-indigo-200/80 bg-white/70 p-3 text-xs text-indigo-900 flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Nguyên tắc minh bạch:</strong> Hoa hồng của thành viên trong nhóm thuộc về quyền lợi sở hữu riêng của từng thành viên đó. HaNoi Realty không cộng gộp doanh thu của các thành viên vào số dư thực nhận của TPKD.
            </p>
          </div>
        </div>
      )}

      {/* TABS CON: HOA HỒNG GIAO DỊCH VÀ LỊCH SỬ GÓI HỘI VIÊN */}
      <div className="rounded-3xl border border-border bg-white p-6 sm:p-7 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveSubTab('commission')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSubTab === 'commission'
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Hoa hồng giao dịch BĐS ({commissionTxs.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('packages')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSubTab === 'packages'
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Lịch sử mua &amp; gia hạn gói ({packageTxs.length})
            </button>
          </div>

          <span className="text-xs text-slate-400 font-medium">
            Mã CTV định danh: <strong className="text-slate-800 font-mono">MG-00102</strong>
          </span>
        </div>

        {/* TAB 1: HOA HỒNG GIAO DỊCH */}
        {activeSubTab === 'commission' && (
          <div className="space-y-3">
            {commissionTxs.map((tx) => (
              <div
                key={tx.id}
                onClick={() => onSelectTransaction(tx)}
                className="rounded-2xl border border-slate-200 p-4 sm:p-5 hover:border-orange-300 transition-all cursor-pointer bg-slate-50/40 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <CodeBadge code={tx.contractCode!} label="Mã HĐ" />
                    <CodeBadge code={tx.listingCode!} label="Mã căn" />
                    <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 truncate">
                      {tx.listingTitle}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                      {tx.statusLabel}
                    </span>
                  </div>
                </div>

                {/* Cơ sở tính toán minh bạch */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-white border border-slate-200/80 text-xs">
                  <div>
                    <span className="text-slate-400 font-semibold text-[11px]">Giá trị chốt căn nhà:</span>
                    <p className="font-extrabold text-slate-800 mt-0.5">6.800.000.000 đ</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold text-[11px]">Phí sàn (2.0%):</span>
                    <p className="font-extrabold text-slate-800 mt-0.5">136.000.000 đ</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold text-[11px]">Tỷ lệ CTV (75% gộp):</span>
                    <p className="font-extrabold text-slate-900 mt-0.5">{formatCurrencyVND(tx.grossAmount)}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold text-[11px]">Thực nhận (Sau thuế TNCN 10%):</span>
                    <p className="font-black text-emerald-600 mt-0.5">{formatCurrencyVND(tx.netAmount)}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>Điều kiện: {tx.releaseConditions}</span>
                  <span className="font-bold text-orange-600 hover:underline inline-flex items-center gap-0.5">
                    Xem chi tiết <ChevronRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: LỊCH SỬ MUA / GIA HẠN GÓI HỘI VIÊN */}
        {activeSubTab === 'packages' && (
          <div className="space-y-3">
            {packageTxs.map((tx) => (
              <div
                key={tx.id}
                onClick={() => onSelectTransaction(tx)}
                className="rounded-2xl border border-slate-200 p-4 hover:border-orange-300 transition-all cursor-pointer bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
                    <Tag className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">Gói hội viên Pro (VIP 60 ngày)</span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        Đã thanh toán
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 font-mono">
                      Mã bút toán: {tx.transactionCode} · Ngày thanh toán: {new Date(tx.createdAt).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <span className="text-sm font-black text-slate-900">{formatCurrencyVND(tx.netAmount)}</span>
                  <button
                    type="button"
                    className="px-3 py-1.5 rounded-xl border border-slate-200 hover:border-orange-500 text-[11px] font-bold text-slate-700"
                  >
                    Xem hóa đơn
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* TÀI KHOẢN NGÂN HÀNG CỦA MÔI GIỚI */}
      <UserBankAccountsCard accounts={bankAccounts} />
    </div>
  );
}

export default BrokerFinanceView;

