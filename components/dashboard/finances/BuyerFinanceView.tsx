'use client';

import React, { useState } from 'react';
import {
  Wallet,
  Clock,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  FileText,
  CreditCard,
  QrCode,
  Info,
  ChevronRight,
  ExternalLink,
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

interface BuyerFinanceViewProps {
  user: any;
  onSelectTransaction: (tx: FinancialTransaction) => void;
  onOpenPaymentInstruction: (installment: PaymentInstallment) => void;
}

export function BuyerFinanceView({
  user,
  onSelectTransaction,
  onOpenPaymentInstruction,
}: BuyerFinanceViewProps) {
  const summary = MOCK_ROLE_FINANCIAL_SUMMARIES.buyer;
  const installments = MOCK_CONTRACT_INSTALLMENTS;
  const transactions = MOCK_FINANCIAL_TRANSACTIONS.filter((t) => t.category === 'deal_escrow');
  const bankAccounts = MOCK_USER_BANK_ACCOUNTS.buyer;

  return (
    <div className="space-y-6">
      {/* 4 Ô TỔNG HỢP TIỀN CHO NGƯỜI MUA */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Cần thanh toán */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11.5px] font-bold uppercase tracking-wider text-slate-400">Cần thanh toán</span>
            <div className="h-8 w-8 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900">
            {formatCurrencyVND(summary.buyerPayable || 0)}
          </p>
          <p className="text-[11px] text-slate-500">Đợt 2 (6 tỷ) + Đợt 3 (700 tr) của hợp đồng</p>
        </div>

        {/* 2. Đã thanh toán */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11.5px] font-bold uppercase tracking-wider text-slate-400">Đã thanh toán</span>
            <div className="h-8 w-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-emerald-600">
            {formatCurrencyVND(summary.buyerPaid || 0)}
          </p>
          <p className="text-[11px] text-slate-500">Tiền đặt cọc bảo chứng đợt 1</p>
        </div>

        {/* 3. Đang phong tỏa tại ngân hàng bảo chứng */}
        <div className="rounded-3xl border border-blue-200 bg-blue-50/50 p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11.5px] font-bold uppercase tracking-wider text-blue-900">Đang phong tỏa</span>
            <div className="h-8 w-8 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-blue-700">
            {formatCurrencyVND(summary.buyerEscrowed || 0)}
          </p>
          <p className="text-[11px] text-blue-800 font-medium">
            Tại Vietcombank Escrow · <em>(Nằm trong tiền đã trả)</em>
          </p>
        </div>

        {/* 4. Chờ hoàn tiền */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11.5px] font-bold uppercase tracking-wider text-slate-400">Chờ hoàn tiền</span>
            <div className="h-8 w-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
              <RotateCcw className="h-4 w-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-700">
            {formatCurrencyVND(summary.buyerPendingRefund || 0)}
          </p>
          <p className="text-[11px] text-slate-500">Không có khoản cọc nào chờ hoàn</p>
        </div>
      </div>

      {/* TIẾN ĐỘ THANH TOÁN HỢP ĐỒNG HD-00035 */}
      <div className="rounded-3xl border border-border bg-white p-6 sm:p-7 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CodeBadge code="HD-00035" label="Mã HĐ" />
              <CodeBadge code="BDS-00125" label="Mã căn" />
              <h3 className="text-sm sm:text-base font-black text-slate-900">
                Lộ trình thanh toán mua nhà: Nhà phố Đống Đa 5 tầng
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              Chủ sở hữu: <strong>CN-00086</strong> (Phạm Quốc Dũng) · Tổng giá trị: <strong>6.800.000.000 đ</strong>
            </p>
          </div>
        </div>

        {/* Các đợt thanh toán */}
        <div className="space-y-3.5">
          {installments.map((inst) => (
            <div
              key={inst.installmentNumber}
              className="rounded-2xl border border-slate-200 p-5 bg-slate-50/50 hover:border-orange-300 transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="h-6 w-6 rounded-full bg-slate-200 text-slate-800 flex items-center justify-center font-bold text-xs">
                    {inst.installmentNumber}
                  </span>
                  <div>
                    <h4 className="text-xs sm:text-sm font-extrabold text-slate-900">{inst.title}</h4>
                    <span className="text-[11px] text-slate-500">Hạn chót thanh toán: {inst.dueDate}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm sm:text-base font-black text-slate-900">
                    {formatCurrencyVND(inst.grossAmount)}
                  </span>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200/80 bg-white p-3 text-xs text-slate-600 space-y-1">
                <span className="font-semibold text-slate-700">Điều kiện &amp; Quy định:</span>
                <p className="text-[11.5px] leading-relaxed">{inst.conditions}</p>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <div>
                  {inst.status === 'bank_escrowed' && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-100 border border-blue-200 px-3 py-1 rounded-full">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Ngân hàng xác nhận phong tỏa bảo chứng
                    </span>
                  )}
                  {inst.status === 'pending_payment' && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-100 border border-amber-200 px-3 py-1 rounded-full">
                      <Clock className="h-3.5 w-3.5" />
                      Chờ thanh toán đợt này
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  {inst.status === 'pending_payment' && (
                    <button
                      type="button"
                      onClick={() => onOpenPaymentInstruction(inst)}
                      className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <QrCode className="h-3.5 w-3.5" />
                      <span>Xem hướng dẫn &amp; Lấy mã QR</span>
                    </button>
                  )}
                  {inst.proofUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        const tx = transactions.find((t) => t.contractCode === 'HD-00035');
                        if (tx) onSelectTransaction(tx);
                      }}
                      className="px-3.5 py-2 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-700 font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span>Xem chứng từ</span>
                      <ExternalLink className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TÀI KHOẢN NGÂN HÀNG CỦA NGƯỜI MUA (DÙNG ĐỂ NHẬN HOÀN CỌC NẾU CÓ) */}
      <UserBankAccountsCard accounts={bankAccounts} />
    </div>
  );
}

export default BuyerFinanceView;

