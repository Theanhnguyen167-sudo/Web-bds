'use client';

import React, { useState } from 'react';
import {
  Wallet,
  Building2,
  FileText,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  X,
  Send,
  Loader2,
  Info,
} from 'lucide-react';
import { FinancialTransaction, PaymentInstallment } from '@/types/finance';
import { OwnerFinanceView } from './OwnerFinanceView';
import { BrokerFinanceView } from './BrokerFinanceView';
import { BuyerFinanceView } from './BuyerFinanceView';
import { AdminFinanceView } from './AdminFinanceView';
import { TransactionDetailModal } from './TransactionDetailModal';
import { PaymentInstructionModal } from './PaymentInstructionModal';
import { useApp } from '@/lib/context/AppContext';

interface FinancesTabProps {
  user: any;
}

export function FinancesTab({ user }: FinancesTabProps) {
  const { addToast } = useApp();

  const [selectedTx, setSelectedTx] = useState<FinancialTransaction | null>(null);
  const [activePaymentInstallment, setActivePaymentInstallment] = useState<PaymentInstallment | null>(null);
  const [reconcileModalTx, setReconcileModalTx] = useState<FinancialTransaction | null | 'general'>(null);
  const [reconcileContent, setReconcileContent] = useState('');
  const [reconcileSubmitting, setReconcileSubmitting] = useState(false);

  // Xác định vai trò hiện tại
  const role = user?.role || 'buyer';
  const isOwner = role === 'owner';
  const isAgent = role === 'agent' || role === 'broker' || role === 'agency';
  const isAdmin = role === 'admin';
  const isBuyer = !isOwner && !isAgent && !isAdmin;

  const handleSendReconciliation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reconcileContent.trim()) return;

    setReconcileSubmitting(true);
    setTimeout(() => {
      setReconcileSubmitting(false);
      setReconcileModalTx(null);
      setReconcileContent('');
      addToast('✓ Đã gửi yêu cầu đối chiếu tới Phòng Kế toán & Pháp chế HaNoi Realty!', 'success');
    }, 600);
  };

  return (
    <div className="space-y-6 animate-in fade-in-50">
      {/* HEADER GỌN GÀNG, TRỰC QUAN */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-slate-200/60">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
            <Wallet className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-slate-900">
                Tiền &amp; Thanh toán
              </h2>
              <span className="rounded-full bg-slate-100 text-slate-700 px-2.5 py-0.5 text-xs font-bold">
                {isOwner && 'Chủ nhà'}
                {isAgent && 'Môi giới / TPKD'}
                {isBuyer && 'Người mua'}
                {isAdmin && 'Quản trị viên'}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Quản lý dòng tiền và đối soát giao dịch bảo chứng qua Ngân hàng trung gian
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold self-start sm:self-auto">
          <Building2 className="h-3.5 w-3.5 text-blue-600" />
          <span>Bảo chứng: Vietcombank Escrow</span>
        </div>
      </div>

      {/* HIỂN THỊ NỘI DUNG THEO TỪNG VAI TRÒ */}
      {isOwner && (
        <OwnerFinanceView
          user={user}
          onSelectTransaction={(tx) => setSelectedTx(tx)}
          onRequestReconcile={(tx) => setReconcileModalTx(tx || 'general')}
        />
      )}

      {isAgent && (
        <BrokerFinanceView
          user={user}
          onSelectTransaction={(tx) => setSelectedTx(tx)}
          onRequestReconcile={(tx) => setReconcileModalTx(tx || 'general')}
        />
      )}

      {isBuyer && (
        <BuyerFinanceView
          user={user}
          onSelectTransaction={(tx) => setSelectedTx(tx)}
          onOpenPaymentInstruction={(inst) => setActivePaymentInstallment(inst)}
        />
      )}

      {isAdmin && (
        <AdminFinanceView
          onSelectTransaction={(tx) => setSelectedTx(tx)}
          onApproveTransaction={(id) => {
            addToast(`✓ Đã duyệt lệnh giải ngân cho giao dịch #${id}!`, 'success');
          }}
          onRejectTransaction={(id, reason) => {
            addToast(`Đã từ chối giao dịch #${id} với lý do: "${reason}"`, 'info');
          }}
        />
      )}

      {/* MODAL CHI TIẾT GIAO DỊCH */}
      {selectedTx && (
        <TransactionDetailModal
          transaction={selectedTx}
          onClose={() => setSelectedTx(null)}
          onRequestReconcile={(tx) => {
            setSelectedTx(null);
            setReconcileModalTx(tx);
          }}
        />
      )}

      {/* MODAL HƯỚNG DẪN THANH TOÁN (VIETQR KHỚP CHUẨN) */}
      {activePaymentInstallment && (
        <PaymentInstructionModal
          installmentTitle={activePaymentInstallment.title}
          amount={activePaymentInstallment.grossAmount}
          onClose={() => setActivePaymentInstallment(null)}
          onSubmitProof={async (proofUrl, note) => {
            addToast('✓ Đã tải chứng từ chuyển tiền lên hệ thống đối soát!', 'success');
          }}
        />
      )}

      {/* MODAL GỬI YÊU CẦU ĐỐI CHIẾU */}
      {reconcileModalTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Send className="h-4 w-4 text-orange-500" />
                <h3 className="text-sm font-black text-slate-900">Gửi yêu cầu đối chiếu số liệu</h3>
              </div>
              <button
                type="button"
                onClick={() => setReconcileModalTx(null)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSendReconciliation} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nội dung cần đối chiếu / giải trình:
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Nhập chi tiết thắc mắc về đợt thanh toán, số tiền khấu trừ hoặc tiến độ giải ngân..."
                  value={reconcileContent}
                  onChange={(e) => setReconcileContent(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="text-[11px] text-slate-500 leading-relaxed">
                Yêu cầu của bạn sẽ được chuyển thẳng tới Bộ phận Kế toán &amp; Pháp chế sàn để kiểm tra sổ phụ ngân hàng và phản hồi trong vòng 24 giờ làm việc.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setReconcileModalTx(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={reconcileSubmitting || !reconcileContent.trim()}
                  className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  {reconcileSubmitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                  <span>Gửi yêu cầu</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default FinancesTab;

