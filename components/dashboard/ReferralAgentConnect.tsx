'use client';

import React, { useState, useEffect } from 'react';
import { UserCheck, Search, Loader2, CheckCircle2, ShieldAlert, AlertCircle } from 'lucide-react';
import { CodeBadge } from '@/components/common/CodeBadge';
import { formatMgCode } from '@/lib/identification';

interface ReferralAgentConnectProps {
  buyerEmail?: string;
  buyerId?: string;
  initialAgentCode?: string | null;
  onSuccess?: (agentCode: string) => void;
}

export function ReferralAgentConnect({
  buyerEmail,
  buyerId,
  initialAgentCode,
  onSuccess,
}: ReferralAgentConnectProps) {
  const [inputCode, setInputCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewAgent, setPreviewAgent] = useState<{
    agentCode: string;
    fullName: string;
    avatarUrl?: string | null;
  } | null>(null);
  const [confirmedCode, setConfirmedCode] = useState<string | null>(initialAgentCode || null);
  const [confirmedName, setConfirmedName] = useState<string | null>(null);

  // Tra cứu thông tin người giới thiệu nếu đã có mã ban đầu
  useEffect(() => {
    if (initialAgentCode) {
      setConfirmedCode(initialAgentCode);
      fetch(`/api/referral?code=${encodeURIComponent(initialAgentCode)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.data) {
            setConfirmedName(data.data.fullName);
          }
        })
        .catch(() => {});
    }
  }, [initialAgentCode]);

  // 1. Kiểm tra mã môi giới
  const handleCheckAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPreviewAgent(null);

    const clean = inputCode.trim();
    if (!clean) {
      setError('Vui lòng nhập mã môi giới (VD: MG-00102)');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/referral?code=${encodeURIComponent(clean)}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Không tìm thấy môi giới với mã này');
        return;
      }

      setPreviewAgent(data.data);
    } catch {
      setError('Lỗi kết nối mạng khi kiểm tra mã. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Xác nhận liên kết môi giới hỗ trợ
  const handleConfirmAgent = async () => {
    if (!previewAgent) return;
    setError(null);
    setConfirming(true);

    try {
      const res = await fetch('/api/referral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyerEmail,
          buyerId,
          agentCode: previewAgent.agentCode,
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Không thể liên kết chuyên viên');
        return;
      }

      setConfirmedCode(previewAgent.agentCode);
      setConfirmedName(previewAgent.fullName);
      setPreviewAgent(null);
      if (onSuccess) onSuccess(previewAgent.agentCode);
    } catch {
      setError('Lỗi khi gửi xác nhận. Vui lòng thử lại.');
    } finally {
      setConfirming(false);
    }
  };

  // Trạng thái ĐÃ XÁC NHẬN: Không cho phép nhập đè
  if (confirmedCode) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span className="text-xs font-bold text-emerald-900">
                Chuyên viên tư vấn hỗ trợ của bạn:
              </span>
            </div>
            <p className="text-sm font-extrabold text-slate-800">
              {confirmedName || 'Chuyên viên HaNoi Realty'}
            </p>
            <p className="text-[11px] text-slate-500">
              Mã giới thiệu đã được xác nhận cố định trong hồ sơ.
            </p>
          </div>
          <CodeBadge code={confirmedCode} label="Mã CTV" />
        </div>
      </div>
    );
  }

  // Trạng thái CHƯA XÁC NHẬN: Cho phép nhập mã, xem tên rồi xác nhận
  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-xs space-y-4">
      <div className="flex items-center gap-2">
        <UserCheck className="h-4 w-4 text-orange-500" />
        <h4 className="text-xs sm:text-sm font-extrabold text-slate-900">
          Chuyên viên môi giới hỗ trợ (Mã giới thiệu)
        </h4>
      </div>

      <p className="text-[11.5px] text-slate-500 leading-relaxed">
        Nếu bạn được chuyên viên môi giới hoặc TPKD hỗ trợ, hãy nhập mã <strong className="font-mono text-slate-700">MG-XXXXX</strong> dưới đây để kết nối. Thao tác này giúp chuyên viên theo sát hỗ trợ bạn và hoàn toàn <strong>không phát sinh chi phí hay hoa hồng</strong> nào.
      </p>

      {/* Form nhập mã */}
      {!previewAgent && (
        <form onSubmit={handleCheckAgent} className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Nhập mã môi giới (VD: MG-00102)..."
              value={inputCode}
              onChange={(e) => {
                setInputCode(e.target.value);
                if (error) setError(null);
              }}
              className="w-full pl-3.5 pr-9 py-2 rounded-xl border border-slate-200 text-xs font-mono font-medium focus:outline-none focus:border-orange-500 bg-slate-50 uppercase placeholder:normal-case placeholder:font-sans"
            />
            {loading && (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-400 absolute right-3 top-2.5" />
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !inputCode.trim()}
            className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Search className="h-3.5 w-3.5" />
            <span>Kiểm tra mã</span>
          </button>
        </form>
      )}

      {/* Thông báo lỗi */}
      {error && (
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-100">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Thẻ xem trước tên môi giới trước khi bấm Xác nhận */}
      {previewAgent && (
        <div className="rounded-xl border border-orange-200 bg-orange-50/60 p-4 space-y-3 animate-in fade-in-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={previewAgent.avatarUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80'}
                alt={previewAgent.fullName}
                className="h-10 w-10 rounded-full object-cover border border-orange-200"
              />
              <div>
                <p className="text-xs text-slate-500">Chuyên viên hỗ trợ:</p>
                <p className="text-sm font-extrabold text-slate-900">{previewAgent.fullName}</p>
              </div>
            </div>
            <CodeBadge code={previewAgent.agentCode} label="Mã MG" />
          </div>

          <div className="flex items-center gap-2 pt-1 border-t border-orange-200/60 justify-end">
            <button
              type="button"
              onClick={() => {
                setPreviewAgent(null);
                setInputCode('');
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-black/5"
            >
              Hủy
            </button>
            <button
              type="button"
              disabled={confirming}
              onClick={handleConfirmAgent}
              className="px-4 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              {confirming ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
              <span>Xác nhận kết nối</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
export default ReferralAgentConnect;

