'use client';

import React, { useState } from 'react';
import {
  Wallet,
  Clock,
  ShieldCheck,
  Percent,
  FileText,
  Building2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Send,
  MessageSquare,
} from 'lucide-react';
import { formatCurrencyVND } from '@/lib/utils';
import { CodeBadge } from '@/components/common/CodeBadge';
import {
  MOCK_ROLE_FINANCIAL_SUMMARIES,
  MOCK_CONTRACT_INSTALLMENTS,
  MOCK_FINANCIAL_TRANSACTIONS,
  MOCK_USER_BANK_ACCOUNTS,
} from '@/lib/data/mock-finance-data';
import { UserBankAccountsCard } from './UserBankAccountsCard';
import { FinancialTransaction, PaymentInstallment } from '@/types/finance';

interface OwnerFinanceViewProps {
  user: any;
  onSelectTransaction: (tx: FinancialTransaction) => void;
  onRequestReconcile: (tx: FinancialTransaction | null) => void;
}

export function OwnerFinanceView({
  user,
  onSelectTransaction,
  onRequestReconcile,
}: OwnerFinanceViewProps) {
  const summary = MOCK_ROLE_FINANCIAL_SUMMARIES.owner;
  const installments = MOCK_CONTRACT_INSTALLMENTS;
  const transactions = MOCK_FINANCIAL_TRANSACTIONS.filter(
    (t) => t.category === 'deal_escrow' || t.category === 'deal_installment' || t.category === 'brokerage_fee'
  );
  const bankAccounts = MOCK_USER_BANK_ACCOUNTS.owner;

  return (
    <div className="space-y-6">
      {/* 4 Ô TỔNG HỢP TIỀN CHO CHỦ NHÀ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Đã nhận */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11.5px] font-bold uppercase tracking-wider text-slate-400">Đã nhận thực tế</span>
            <div className="h-8 w-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900">
            {formatCurrencyVND(summary.ownerReceived || 0)}
          </p>
          <p className="text-[11px] text-slate-500">Đã giải ngân về tài khoản ngân hàng</p>
        </div>

        {/* 2. Chờ nhận */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11.5px] font-bold uppercase tracking-wider text-slate-400">Chờ nhận theo HĐ</span>
            <div className="h-8 w-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-amber-600">
            {formatCurrencyVND(summary.ownerPending || 0)}
          </p>
          <p className="text-[11px] text-slate-500">Các đợt tiếp theo của hợp đồng HD-00035</p>
        </div>

        {/* 3. Đang phong tỏa tại ngân hàng */}
        <div className="rounded-3xl border border-blue-200 bg-blue-50/50 p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11.5px] font-bold uppercase tracking-wider text-blue-900">Đang phong tỏa</span>
            <div className="h-8 w-8 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-blue-700">
            {formatCurrencyVND(summary.ownerEscrowed || 0)}
          </p>
          <p className="text-[11px] text-blue-800">Tại Vietcombank Escrow (Đợt 1 cọc)</p>
        </div>

        {/* 4. Phí môi giới phải trả */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11.5px] font-bold uppercase tracking-wider text-slate-400">Phí môi giới phải trả</span>
            <div className="h-8 w-8 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
              <Percent className="h-4 w-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-rose-600">
            {formatCurrencyVND(summary.ownerBrokerFeePayable || 0)}
          </p>
          <p className="text-[11px] text-slate-500">2.0% giá trị hợp đồng (trừ khi công chứng)</p>
        </div>
      </div>

      {/* CHI TIẾT TỪNG ĐỢT THANH TOÁN THEO HỢP ĐỒNG HD-00035 */}
      <div className="rounded-3xl border border-border bg-white p-6 sm:p-7 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CodeBadge code="HD-00035" label="Mã HĐ" />
              <CodeBadge code="BDS-00125" label="Mã căn" />
              <h3 className="text-sm sm:text-base font-black text-slate-900">
                Lộ trình thanh toán: Nhà phố Đống Đa 5 tầng
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              Giá trị hợp đồng: <strong>6.800.000.000 đ</strong> · Chuyên viên phụ trách: <strong>MG-00102</strong>
            </p>
          </div>

          <button
            type="button"
            onClick={() => onRequestReconcile(null)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-orange-200 bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs font-bold transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Send className="h-3.5 w-3.5" />
            <span>Gửi yêu cầu đối chiếu</span>
          </button>
        </div>

        {/* Danh sách đợt */}
        <div className="space-y-3">
          {installments.map((inst) => (
            <div
              key={inst.installmentNumber}
              className="rounded-2xl border border-slate-200 p-4 sm:p-5 bg-slate-50/50 hover:border-orange-300 transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="h-6 w-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">
                    {inst.installmentNumber}
                  </span>
                  <div>
                    <h4 className="text-xs sm:text-sm font-extrabold text-slate-900">{inst.title}</h4>
                    <span className="text-[11px] text-slate-500">Hạn chót: {inst.dueDate}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {inst.status === 'bank_escrowed' && (
                    <span className="text-[11px] font-bold text-blue-700 bg-blue-100 border border-blue-200 px-3 py-1 rounded-full flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Vietcombank Escrow đang phong tỏa
                    </span>
                  )}
                  {inst.status === 'pending_payment' && (
                    <span className="text-[11px] font-bold text-slate-600 bg-slate-200 px-3 py-1 rounded-full">
                      Chờ đến hạn thanh toán
                    </span>
                  )}
                </div>
              </div>

              {/* Phân tách: Tiền gộp - Khoản phí - Thực nhận */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-white border border-slate-200/80 text-xs">
                <div>
                  <span className="text-slate-400 font-semibold text-[11px]">Tiền người mua trả:</span>
                  <p className="font-extrabold text-slate-900 mt-0.5">{formatCurrencyVND(inst.grossAmount)}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold text-[11px]">Khấu trừ phí môi giới / Thuế:</span>
                  <p className="font-extrabold text-rose-600 mt-0.5">
                    {inst.deductionFee > 0 ? `-${formatCurrencyVND(inst.deductionFee)}` : '0 đ'}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold text-[11px]">Chủ nhà thực nhận:</span>
                  <p className="font-black text-emerald-600 mt-0.5">{formatCurrencyVND(inst.netAmount)}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11.5px] text-slate-500 pt-1">
                <span className="italic">Điều kiện: {inst.conditions}</span>
                {inst.proofUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      const matchTx = transactions.find((t) => t.contractCode === 'HD-00035');
                      if (matchTx) onSelectTransaction(matchTx);
                    }}
                    className="inline-flex items-center gap-1 font-bold text-orange-600 hover:underline cursor-pointer shrink-0"
                  >
                    <span>Xem chứng từ chuyển tiền</span>
                    <ChevronRight className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TÀI KHOẢN NGÂN HÀNG CỦA CHỦ NHÀ */}
      <UserBankAccountsCard accounts={bankAccounts} />
    </div>
  );
}

export default OwnerFinanceView;

