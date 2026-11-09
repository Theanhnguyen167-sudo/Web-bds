'use client';

import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Phone,
  MessageSquare,
  AlertTriangle,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { TeamMember } from '@/types/broker-team';

interface TeamMemberTableProps {
  members: TeamMember[];
  onOpenDealHelp: (member: TeamMember) => void;
}

export const TeamMemberTable: React.FC<TeamMemberTableProps> = ({
  members,
  onOpenDealHelp,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTier, setFilterTier] = useState<string>('all');

  const filteredMembers = members.filter((m) => {
    const matchSearch =
      m.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.brokerCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.phone.includes(searchQuery);

    const matchTier =
      filterTier === 'all'
        ? true
        : filterTier === 'active'
        ? m.subscriptionTier === 'ctv_monthly'
        : filterTier === 'free'
        ? m.subscriptionTier === 'free'
        : filterTier === 'expired'
        ? m.subscriptionTier === 'expired'
        : true;

    return matchSearch && matchTier;
  });

  const renderTierBadge = (tier: string) => {
    switch (tier) {
      case 'ctv_monthly':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Gói CTV 189k
          </span>
        );
      case 'free':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-200">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            CTV Free
          </span>
        );
      case 'expired':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-[10px] font-bold text-rose-700 border border-rose-200">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
            Hết hạn gói
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2 py-0.5 text-[10px] font-bold text-slate-600 border border-slate-200">
            {tier}
          </span>
        );
    }
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-4">
      {/* Thanh tìm kiếm & lọc thành viên */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên CTV, mã môi giới (CTV-HN...) hoặc SĐT..."
            className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-purple-600 focus:outline-none focus:ring-1 focus:ring-purple-600"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Lọc gói:</span>
          <select
            value={filterTier}
            onChange={(e) => setFilterTier(e.target.value)}
            className="rounded-xl border border-slate-200 py-2 px-3 text-xs text-slate-700 font-medium bg-white focus:border-purple-600 focus:outline-none"
          >
            <option value="all">Tất cả ({members.length})</option>
            <option value="active">Gói 189k đang chạy</option>
            <option value="free">CTV Free tháng đầu</option>
            <option value="expired">Đã hết hạn gói</option>
          </select>
        </div>
      </div>

      {/* Bảng danh sách CTV */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="border-b border-purple-100 bg-purple-50/50 text-[11px] font-bold text-purple-950 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Môi Giới (CTV)</th>
                <th className="px-5 py-3.5">Trạng Thái Gói</th>
                <th className="px-5 py-3.5 text-center">Tủ Hàng</th>
                <th className="px-5 py-3.5 text-center">Khách CRM</th>
                <th className="px-5 py-3.5">Lịch Dẫn Xem Gần Nhất</th>
                <th className="px-5 py-3.5 text-center">Đã Chốt</th>
                <th className="px-5 py-3.5 text-right">Tác Vụ Hỗ Trợ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400">
                    Không tìm thấy thành viên CTV nào phù hợp.
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => (
                  <tr
                    key={member.id}
                    className={`hover:bg-purple-50/30 transition-colors ${
                      member.hasPendingHelpRequest ? 'bg-amber-50/40' : ''
                    }`}
                  >
                    {/* Tên & Mã CTV */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-100 font-bold text-purple-700 text-xs">
                          {member.fullName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            {member.fullName}
                            {member.role === 'ctv_senior' && (
                              <span className="text-[9px] font-bold bg-purple-100 text-purple-800 px-1.5 py-0.2 rounded">
                                Senior
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500">
                            <span className="font-mono text-blue-700 font-semibold">{member.brokerCode}</span>
                            <span>• Tham gia {formatDate(member.joinedAt)}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Trạng thái gói dịch vụ */}
                    <td className="px-5 py-4">
                      {renderTierBadge(member.subscriptionTier)}
                    </td>

                    {/* Số căn tủ hàng */}
                    <td className="px-5 py-4 text-center">
                      <span className="inline-flex items-center gap-1 font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-lg">
                        <Building2 className="h-3 w-3 text-slate-500" />
                        {member.activeCuratedListings} căn
                      </span>
                    </td>

                    {/* Số khách đang chăm */}
                    <td className="px-5 py-4 text-center">
                      <span className="inline-flex items-center gap-1 font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-lg">
                        <Users className="h-3 w-3 text-slate-500" />
                        {member.activeLeadsCount} khách
                      </span>
                    </td>

                    {/* Lịch dẫn xem gần nhất */}
                    <td className="px-5 py-4">
                      {member.lastAppointment ? (
                        <div>
                          <div className="flex items-center gap-1 font-bold text-slate-800 text-[11px]">
                            <Clock className="h-3 w-3 text-purple-600" />
                            {member.lastAppointment.dateText}
                          </div>
                          <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5" title={member.lastAppointment.location}>
                            {member.lastAppointment.location}
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px] italic">Chưa có lịch tuần này</span>
                      )}
                    </td>

                    {/* Deal đã chốt */}
                    <td className="px-5 py-4 text-center">
                      <span className="font-bold text-emerald-700 text-xs">
                        {member.totalClosedDeals} deal
                      </span>
                    </td>

                    {/* Tác vụ hỗ trợ */}
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {member.hasPendingHelpRequest ? (
                          <button
                            type="button"
                            onClick={() => onOpenDealHelp(member)}
                            className="rounded-xl bg-amber-500 px-2.5 py-1.5 text-[11px] font-bold text-white hover:bg-amber-600 shadow-xs flex items-center gap-1 animate-pulse"
                            title="Có deal vướng cần TPKD hỗ trợ"
                          >
                            <AlertTriangle className="h-3.5 w-3.5" />
                            <span>Xem Deal vướng</span>
                          </button>
                        ) : null}

                        <a
                          href={`https://zalo.me/${member.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-lg p-1.5 text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          title={`Nhắn Zalo: ${member.phone}`}
                        >
                          <MessageSquare className="h-4 w-4" />
                        </a>

                        <a
                          href={`tel:${member.phone.replace(/[^0-9]/g, '')}`}
                          className="rounded-lg p-1.5 text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                          title={`Gọi điện: ${member.phone}`}
                        >
                          <Phone className="h-4 w-4" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

