'use client';

import React from 'react';
import {
  Crown,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Coins,
  FileCheck2,
  ExternalLink,
  Receipt,
  AlertCircle
} from 'lucide-react';
import { ManagementReward } from '@/types/broker-team';

interface ManagementOverridesTableProps {
  rewards: ManagementReward[];
}

export const ManagementOverridesTable: React.FC<ManagementOverridesTableProps> = ({
  rewards,
}) => {
  const totalAmount = rewards.reduce((sum, r) => sum + r.rewardAmount, 0);
  const disbursedAmount = rewards
    .filter((r) => r.status === 'disbursed')
    .reduce((sum, r) => sum + r.rewardAmount, 0);
  const pendingAmount = totalAmount - disbursedAmount;

  const formatDate = (isoString?: string) => {
    if (!isoString) return '—';
    return new Date(isoString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'disbursed':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="h-3 w-3" />
            Đã giải ngân
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-200">
            <FileCheck2 className="h-3 w-3" />
            Đã nghiệm thu
          </span>
        );
      case 'in_progress':
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-200">
            <Clock className="h-3 w-3" />
            Đang thực hiện
          </span>
        );
    }
  };

  const getContributionTypeLabel = (type: string) => {
    switch (type) {
      case 'legal_appraisal':
        return 'Thẩm định pháp lý & quy hoạch';
      case 'negotiation_support':
        return 'Hỗ trợ đàm phán cọc';
      case 'dispute_resolution':
        return 'Hòa giải tranh chấp 3 bên';
      case 'notary_closing':
        return 'Hỗ trợ công chứng & bàn giao';
      default:
        return 'Nhiệm vụ quản lý thực địa';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Khối Cam Kết Chuẩn Mực Nghiệp Vụ HaNoi Realty */}
      <div className="rounded-2xl border border-purple-200 bg-gradient-to-r from-purple-50 via-indigo-50 to-white p-4 sm:p-5 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-600 text-white shadow-xs">
            <Crown className="h-5 w-5" />
          </div>
          <div className="text-xs space-y-1">
            <h4 className="font-bold text-purple-950 text-sm flex items-center gap-2">
              Bảng Kê Thù Lao Quản Lý (Management Overrides)
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.2 rounded-full bg-purple-200 text-purple-800">
                Chuẩn Mực Sàn
              </span>
            </h4>
            <p className="text-purple-900 leading-relaxed text-[11px]">
              <strong>Nguyên tắc đạo đức cốt lõi:</strong> Thù lao quản lý là khoản ngân sách sàn chi trả cho TPKD dựa trên <em>nhiệm vụ hỗ trợ và đóng góp thực tế được nghiệm thu</em> (thẩm định pháp lý, đàm phán, hòa giải). Khoản tiền này <strong>tách biệt 100% với hoa hồng cá nhân</strong> của TPKD và <strong>tuyệt đối không có hoa hồng tuyển dụng</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* 3 Thẻ tóm tắt tài chính thù lao */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-purple-200 bg-white p-4 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Tổng thù lao phát sinh</div>
          <div className="text-2xl font-black text-purple-900 mt-1">
            {totalAmount.toLocaleString('vi-VN')} đ
          </div>
          <div className="text-[11px] text-purple-700 mt-1 font-medium">
            Tích lũy từ {rewards.length} nhiệm vụ hỗ trợ
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-white p-4 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Đã giải ngân thực nhận</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            {disbursedAmount.toLocaleString('vi-VN')} đ
          </div>
          <div className="text-[11px] text-emerald-700 mt-1 font-medium">
            Đã chuyển khoản qua Ủy nhiệm chi (UNC)
          </div>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-white p-4 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Chờ hoàn tất & Nghiệm thu</div>
          <div className="text-2xl font-black text-amber-600 mt-1">
            {pendingAmount.toLocaleString('vi-VN')} đ
          </div>
          <div className="text-[11px] text-amber-700 mt-1 font-medium">
            Đang trong tiến trình giải quyết deal
          </div>
        </div>
      </div>

      {/* Bảng kê chi tiết nhiệm vụ */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="border-b border-purple-100 bg-purple-50/50 text-[11px] font-bold text-purple-950 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Mã Nhiệm Vụ & Giao Dịch</th>
                <th className="px-5 py-3.5">CTV Được Hỗ Trợ</th>
                <th className="px-5 py-3.5">Nội Dung Đóng Góp Thực Tế</th>
                <th className="px-5 py-3.5 text-right">Mức Thù Lao</th>
                <th className="px-5 py-3.5 text-center">Trạng Thái</th>
                <th className="px-5 py-3.5">Mã Chứng Từ (UNC)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {rewards.map((reward) => (
                <tr key={reward.id} className="hover:bg-purple-50/30 transition-colors">
                  
                  {/* Mã Nhiệm Vụ & Deal */}
                  <td className="px-5 py-4">
                    <div className="font-mono font-bold text-purple-700 text-xs">
                      {reward.taskCode}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5 text-[11px]">
                      <span className="font-mono text-blue-600 font-semibold">{reward.dealCode}</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-600 line-clamp-1">{reward.propertyTitle}</span>
                    </div>
                  </td>

                  {/* CTV hỗ trợ */}
                  <td className="px-5 py-4">
                    <div className="font-bold text-slate-900">{reward.ctvName}</div>
                    <div className="text-[11px] font-mono text-slate-500">{reward.ctvCode}</div>
                  </td>

                  {/* Nội dung đóng góp */}
                  <td className="px-5 py-4 max-w-xs">
                    <span className="inline-block rounded bg-purple-100 text-purple-800 text-[10px] font-bold px-1.5 py-0.2 mb-1">
                      {getContributionTypeLabel(reward.contributionType)}
                    </span>
                    <div className="font-semibold text-slate-800 text-[11px] leading-tight">
                      {reward.contributionTitle}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">
                      {reward.notes}
                    </p>
                  </td>

                  {/* Mức thù lao */}
                  <td className="px-5 py-4 text-right font-extrabold text-sm text-purple-900">
                    {reward.rewardAmount.toLocaleString('vi-VN')} đ
                  </td>

                  {/* Trạng thái */}
                  <td className="px-5 py-4 text-center">
                    {renderStatusBadge(reward.status)}
                  </td>

                  {/* Chứng từ */}
                  <td className="px-5 py-4">
                    {reward.voucherCode ? (
                      <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                        {reward.voucherCode}
                      </span>
                    ) : (
                      <span className="text-slate-400 italic text-[11px]">Chờ hoàn tất deal</span>
                    )}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

