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

  // Trạng thái ĐÃ XÁC NHẬN: Hiển thị người hiện tại, không cho phép tự sửa/ghi đè
  if (confirmedCode) {
    return (
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50/50 p-6 sm:p-7 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 border border-emerald-200">
              <UserCheck className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span className="text-xs font-bold text-emerald-900 uppercase tracking-wide">
                  Môi giới giới thiệu bạn
                </span>
              </div>
              <p className="text-base font-black text-slate-900 mt-0.5">
                {confirmedName || 'Chuyên viên tư vấn HaNoi Realty'}
              </p>
              <p className="text-xs text-slate-600 mt-0.5">
                Trạng thái: <span className="font-semibold text-emerald-700">Đã xác nhận liên kết chính thức</span>
              </p>
            </div>
          </div>
          <CodeBadge code={confirmedCode} label="Mã CTV & Giới thiệu" />
        </div>

        <div className="rounded-2xl border border-emerald-200/70 bg-white/80 p-3.5 text-xs text-slate-600 space-y-1">
          <p className="font-semibold text-slate-700">
            ℹ️ Quy định bảo vệ liên kết:
          </p>
          <p className="text-[11.5px] leading-relaxed">
            Hệ thống không tự ý thay đổi hoặc ghi đè chuyên viên đã xác nhận. Nếu bạn cần đổi người hỗ trợ, vui lòng liên hệ bộ phận Chăm sóc khách hàng của HaNoi Realty (Hotline: <strong className="text-slate-800">1900 6868</strong> hoặc <strong className="text-slate-800">cskh@hanoirealty.vn</strong>) để được hỗ trợ điều chỉnh.
          </p>
        </div>
      </div>
    );
  }

  // Trạng thái CHƯA XÁC NHẬN: Cho phép nhập mã, bấm Kiểm tra, xem tên rồi Xác nhận
  return (
    <div className="rounded-3xl border border-border bg-white p-6 sm:p-7 shadow-xs space-y-5">
      <div className="flex items-center gap-2.5">
        <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
          <UserCheck className="h-4 w-4" />
        </div>
        <div>
          <h4 className="text-sm sm:text-base font-extrabold text-slate-900">
            Môi giới giới thiệu bạn
          </h4>
          <p className="text-xs text-slate-500">
            Kết nối với chuyên viên tư vấn qua mã định danh MG-XXXXX
          </p>
        </div>
      </div>

      <p className="text-xs text-slate-600 leading-relaxed">
        Nếu bạn được chuyên viên môi giới hoặc Trưởng phòng kinh doanh (TPKD) giới thiệu, hãy nhập mã <strong className="font-mono text-slate-800">MG-XXXXX</strong> vào ô dưới đây và bấm <strong className="text-slate-800">“Kiểm tra”</strong>. Sau khi đối chiếu đúng tên chuyên viên, bấm <strong className="text-slate-800">“Xác nhận người giới thiệu”</strong> để hoàn tất liên kết.
      </p>

      {/* Form nhập mã */}
      {!previewAgent && (
        <form onSubmit={handleCheckAgent} className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Nhập mã môi giới (VD: MG-00102)..."
              value={inputCode}
              onChange={(e) => {
                setInputCode(e.target.value);
                if (error) setError(null);
              }}
              className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-mono font-medium focus:outline-none focus:border-orange-500 bg-slate-50 uppercase placeholder:normal-case placeholder:font-sans transition-colors"
            />
            {loading && (
              <Loader2 className="h-4 w-4 animate-spin text-orange-500 absolute right-3.5 top-3" />
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !inputCode.trim()}
            className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-xs sm:text-sm font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <Search className="h-4 w-4" />
            <span>Kiểm tra</span>
          </button>
        </form>
      )}

      {/* Thông báo lỗi nếu có */}
      {error && (
        <div className="flex items-center gap-2 text-xs font-semibold text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-100">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Thẻ xem trước tên môi giới trước khi bấm Xác nhận */}
      {previewAgent && (
        <div className="rounded-2xl border border-orange-200 bg-orange-50/70 p-5 space-y-4 animate-in fade-in-50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3.5">
              <img
                src={previewAgent.avatarUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80'}
                alt={previewAgent.fullName}
                className="h-12 w-12 rounded-full object-cover border-2 border-orange-300 shadow-xs"
              />
              <div>
                <p className="text-[11px] font-semibold text-orange-800 uppercase tracking-wide">
                  Thông tin chuyên viên hỗ trợ
                </p>
                <p className="text-sm sm:text-base font-black text-slate-900">{previewAgent.fullName}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Chỉ hiển thị thông tin phục vụ kết nối hỗ trợ, không công khai hồ sơ riêng tư.
                </p>
              </div>
            </div>
            <CodeBadge code={previewAgent.agentCode} label="Mã MG" />
          </div>

          <div className="flex items-center gap-2.5 pt-2 border-t border-orange-200/80 justify-end">
            <button
              type="button"
              onClick={() => {
                setPreviewAgent(null);
                setInputCode('');
              }}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-black/5 cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="button"
              disabled={confirming}
              onClick={handleConfirmAgent}
              className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white text-xs sm:text-sm font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
            >
              {confirming ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
              <span>Xác nhận người giới thiệu</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
export default ReferralAgentConnect;

