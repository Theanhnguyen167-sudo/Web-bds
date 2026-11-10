'use client';

import React, { useState } from 'react';
import {
  Building2,
  CheckCircle2,
  Clock,
  Plus,
  ShieldCheck,
  AlertCircle,
  Copy,
  Check,
  Lock,
  X,
  CreditCard,
} from 'lucide-react';
import { BankAccountItem } from '@/types/finance';

interface UserBankAccountsCardProps {
  accounts: BankAccountItem[];
  onAddAccount?: (account: Partial<BankAccountItem>) => void;
  className?: string;
}

export function UserBankAccountsCard({
  accounts,
  onAddAccount,
  className = '',
}: UserBankAccountsCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bankName, setBankName] = useState('Vietcombank');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolder, setAccountHolder] = useState('');
  const [branch, setBranch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [localAccounts, setLocalAccounts] = useState<BankAccountItem[]>(accounts);

  const handleCopy = (text: string, id: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountNumber.trim() || !accountHolder.trim()) return;

    const masked = accountNumber.length > 8
      ? `${accountNumber.slice(0, 4)} **** ${accountNumber.slice(-4)}`
      : `${accountNumber.slice(0, 2)} ****`;

    const newAcc: BankAccountItem = {
      id: `bank-${Date.now()}`,
      bankName: bankName,
      bankCode: bankName.split(' ')[0],
      accountHolder: accountHolder.toUpperCase().trim(),
      accountNumberMasked: masked,
      accountNumberFull: accountNumber.trim(),
      branch: branch.trim() || 'Hà Nội',
      isDefault: localAccounts.length === 0,
      isVerified: false, // Cần đối chiếu
    };

    setLocalAccounts((prev) => [...prev, newAcc]);
    if (onAddAccount) onAddAccount(newAcc);
    setIsModalOpen(false);
    setAccountNumber('');
    setAccountHolder('');
    setBranch('');
  };

  return (
    <div className={`rounded-3xl border border-border bg-white p-5 sm:p-6 shadow-xs space-y-4 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600 border border-sky-100">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-900">Tài khoản ngân hàng nhận tiền</h4>
            <p className="text-[11.5px] text-slate-500">
              Dùng để nhận tiền giải ngân hợp đồng, thanh toán hoa hồng và đối soát
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs font-bold transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Thêm tài khoản</span>
        </button>
      </div>

      {/* Danh sách thẻ tài khoản */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
        {localAccounts.map((acc) => (
          <div
            key={acc.id}
            className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 relative space-y-2.5 hover:border-orange-300 transition-all"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-0.5">
                <span className="text-xs font-black text-slate-800">{acc.bankName}</span>
                {acc.branch && (
                  <p className="text-[11px] text-slate-500">{acc.branch}</p>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                {acc.isDefault && (
                  <span className="text-[10px] font-bold text-orange-700 bg-orange-100 px-2 py-0.5 rounded-full">
                    Mặc định
                  </span>
                )}
                {acc.isVerified ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="h-2.5 w-2.5" />
                    Đã xác minh
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                    <Clock className="h-2.5 w-2.5" />
                    Chờ đối soát
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-slate-200/80">
              <div>
                <p className="text-[10.5px] uppercase tracking-wider text-slate-400 font-bold">Chủ tài khoản</p>
                <p className="text-xs font-black text-slate-800 tracking-wide">{acc.accountHolder}</p>
              </div>
              <div className="text-right">
                <p className="text-[10.5px] uppercase tracking-wider text-slate-400 font-bold">Số tài khoản</p>
                <div className="flex items-center gap-1.5 justify-end">
                  <span className="text-xs font-mono font-bold text-slate-800">{acc.accountNumberMasked}</span>
                  {acc.accountNumberFull && (
                    <button
                      type="button"
                      onClick={() => handleCopy(acc.accountNumberFull!, acc.id)}
                      className="text-slate-400 hover:text-slate-600 transition-colors p-0.5"
                      title="Sao chép số tài khoản"
                    >
                      {copiedId === acc.id ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cảnh báo an toàn dữ liệu */}
      <div className="rounded-xl bg-blue-50/70 border border-blue-100 p-3 text-[11px] text-blue-900 flex items-start gap-2">
        <Lock className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5 leading-relaxed">
          <p className="font-bold text-blue-950">Cam kết an toàn bảo mật ngân hàng:</p>
          <p>
            Hệ thống chỉ lưu số tài khoản thụ hưởng để lập lệnh giải ngân hoặc đối chiếu chuyển tiền. HaNoi Realty <strong>tuyệt đối KHÔNG BAO GIỜ</strong> yêu cầu mật khẩu đăng nhập ngân hàng, mã PIN hay mã OTP của bạn.
          </p>
        </div>
      </div>

      {/* Modal Thêm tài khoản ngân hàng */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-orange-500" />
                <h3 className="text-sm font-black text-slate-900">Thêm tài khoản ngân hàng</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Ngân hàng:</label>
                <select
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50 focus:outline-none focus:border-orange-500"
                >
                  <option value="Vietcombank (VCB)">Vietcombank (Ngoại thương)</option>
                  <option value="BIDV (Đầu tư và Phát triển)">BIDV (Đầu tư và Phát triển)</option>
                  <option value="Techcombank (TCB)">Techcombank (Kỹ thương)</option>
                  <option value="VietinBank (CTG)">VietinBank (Công thương)</option>
                  <option value="MBBank (MB)">MBBank (Quân đội)</option>
                  <option value="ACB (Á Châu)">ACB (Á Châu)</option>
                  <option value="VPBank (Việt Nam Thịnh Vượng)">VPBank (Việt Nam Thịnh Vượng)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Số tài khoản:</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: 0011000866789"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold bg-slate-50 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tên chủ tài khoản (in hoa không dấu, đúng tên trên CCCD):
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: NGUYEN VAN A"
                  value={accountHolder}
                  onChange={(e) => setAccountHolder(e.target.value.toUpperCase())}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold uppercase bg-slate-50 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Chi nhánh (tùy chọn):</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Chi nhánh Thăng Long, Hà Nội"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Xác nhận lưu tài khoản
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserBankAccountsCard;

