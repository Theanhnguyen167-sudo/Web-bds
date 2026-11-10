'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Users2,
  Crown,
  UserPlus,
  CalendarDays,
  ArrowLeftRight,
  AlertTriangle,
  ShieldAlert,
  Sparkles,
  Lock,
  Layers,
  Coins,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
  RefreshCw,
  FileCheck2
} from 'lucide-react';
import { BrokerProfile } from '@/types/broker-nav';
import { TeamMember, ManagementReward, TeamStats } from '@/types/broker-team';
import {
  MOCK_TEAM_MEMBERS,
  MOCK_MANAGEMENT_REWARDS,
  MOCK_TEAM_STATS
} from '@/lib/data/broker-mock-team';
import { TeamMemberTable } from './TeamMemberTable';
import { ManagementOverridesTable } from './ManagementOverridesTable';
import { InviteMemberModal } from './InviteMemberModal';
import { DealHelpDetailModal } from './DealHelpDetailModal';

interface TeamManagementBoardProps {
  profile?: BrokerProfile;
  initialTab?: 'members' | 'overrides' | 'tasks';
}

export const TeamManagementBoard: React.FC<TeamManagementBoardProps> = ({
  profile,
  initialTab = 'members',
}) => {
  // Kiểm tra vai trò TPKD
  const isTpkd = profile?.role === 'tpkd';
  const isExpired = profile?.subscriptionTier === 'expired';

  const [activeTab, setActiveTab] = useState<'members' | 'overrides' | 'tasks'>(initialTab);
  const [members, setMembers] = useState<TeamMember[]>(MOCK_TEAM_MEMBERS);
  const [rewards, setRewards] = useState<ManagementReward[]>(MOCK_MANAGEMENT_REWARDS);
  const [stats, setStats] = useState<TeamStats>(MOCK_TEAM_STATS);

  // Modal states
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [selectedMemberForHelp, setSelectedMemberForHelp] = useState<TeamMember | null>(null);

  // Xử lý khi TPKD nhận hỗ trợ 1 deal
  const handleAcceptDealHelp = (memberId: string, dealCode: string) => {
    // Cập nhật member không còn pending
    setMembers((prev) =>
      prev.map((m) =>
        m.id === memberId
          ? { ...m, hasPendingHelpRequest: false }
          : m
      )
    );

    // Thêm nhiệm vụ thù lao quản lý mới
    const targetMember = members.find((m) => m.id === memberId);
    if (targetMember) {
      const newReward: ManagementReward = {
        id: `rew-${Date.now()}`,
        taskCode: `TASK-TPKD-2026-${Math.floor(100 + Math.random() * 900)}`,
        dealCode,
        propertyCode: targetMember.lastAppointment?.propertyCode || 'HN-DDA-092',
        propertyTitle: targetMember.lastAppointment?.location || 'BĐS đang hỗ trợ đàm phán',
        ctvCode: targetMember.brokerCode,
        ctvName: targetMember.fullName,
        contributionType: 'negotiation_support',
        contributionTitle: 'Tiếp nhận hỗ trợ đàm phán cọc & tháo gỡ vướng mắc 3 bên',
        notes: `TPKD ${profile?.fullName || 'Nguyễn Văn Minh'} đã tiếp nhận yêu cầu hỗ trợ và đang phối hợp tại thực địa.`,
        rewardAmount: 6000000,
        status: 'in_progress',
        createdAt: new Date().toISOString(),
      };
      setRewards([newReward, ...rewards]);
      setStats((prev) => ({
        ...prev,
        dealsRequiringHelpCount: Math.max(0, prev.dealsRequiringHelpCount - 1),
      }));
    }
  };

  // MÀN HÌNH NẾU USER KHÔNG PHẢI TPKD (Phân quyền bảo vệ)
  if (!isTpkd) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100 text-purple-600 shadow-inner">
          <Lock className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-purple-800">
            <Crown className="h-3.5 w-3.5" />
            Phân Hệ Quản Trị Đội Nhóm TPKD
          </span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Bạn Đang Sử Dụng Tài Khoản Môi Giới (CTV)
          </h2>
          <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
            Khu vực Quản trị Đội nhóm chỉ dành cho vai trò <strong>Trưởng phòng kinh doanh (TPKD)</strong>. TPKD phụ trách điều phối, hỗ trợ CTV giải quyết deal vướng và nhận Thù lao Quản lý theo nhiệm vụ thực tế.
          </p>
        </div>

        <div className="rounded-2xl border border-purple-200 bg-purple-50/50 p-6 text-left max-w-lg mx-auto space-y-3 text-xs">
          <div className="font-bold text-purple-950 text-sm">Quyền lợi khi nâng cấp vai trò TPKD:</div>
          <div className="space-y-2 text-slate-700">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-purple-600 shrink-0" />
              <span>Bảng điều khiển quản lý danh sách CTV trực thuộc</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-purple-600 shrink-0" />
              <span>Gửi lời mời thành viên CTV gia nhập nhóm (xác nhận 2 chiều)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-purple-600 shrink-0" />
              <span>Nhận Thù lao Quản lý (5 - 15 triệu/deal) khi hỗ trợ CTV chốt giao dịch</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-purple-600 shrink-0" />
              <span>Kênh kết nối ưu tiên trực tiếp với Ban Pháp lý & Kế toán sàn</span>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <Link
            href="/dashboard/broker/subscription"
            className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-3 text-xs font-bold text-white hover:bg-purple-500 shadow-md transition-all"
          >
            <Crown className="h-4 w-4" />
            <span>Nâng cấp Gói TPKD (499.000 đ/tháng)</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* CẢNH BÁO NẾU GÓI TPKD BỊ HẾT HẠN (EXPIRED) */}
      {isExpired && (
        <div className="rounded-2xl border-2 border-rose-400 bg-rose-50/95 p-4 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-rose-950 font-bold block text-sm">
                Gói TPKD của bạn đã hết hạn: Đang tạm khóa tính năng mời thành viên mới
              </strong>
              <span className="text-rose-800">
                Toàn bộ dữ liệu thành viên đội nhóm cũ và bảng kê thù lao quản lý đã phát sinh vẫn được <strong>bảo toàn nguyên vẹn 100%</strong>. Vui lòng gia hạn gói để tiếp tục gửi lời mời CTV mới.
              </span>
            </div>
          </div>
          <Link
            href="/dashboard/broker/subscription"
            className="shrink-0 px-3.5 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-500 self-end sm:self-center flex items-center gap-1.5"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Gia hạn gói TPKD
          </Link>
        </div>
      )}

      {/* HEADER PHÂN HỆ TPKD (Tông tím Manager Accent) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-purple-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="rounded-md bg-purple-600 px-2.5 py-0.5 text-[10px] font-extrabold text-white uppercase tracking-wider shadow-xs">
              TPKD Manager Accent
            </span>
            <span className="text-xs text-purple-700 font-semibold">
              Khu vực quản trị điều phối
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Users2 className="h-6 w-6 text-purple-600" />
            Bảng Quản Trị Đội Nhóm Môi Giới
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Theo dõi hoạt động, phân bổ nhiệm vụ và ghi nhận thù lao hỗ trợ deal của các CTV trực thuộc.
          </p>
        </div>

        {/* Nút tác vụ mời thành viên */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setInviteModalOpen(true)}
            disabled={isExpired}
            className="px-4 py-2.5 rounded-xl bg-purple-600 text-xs font-bold text-white hover:bg-purple-500 shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
            title={isExpired ? 'Cần gia hạn gói TPKD để mời thành viên mới' : 'Mời CTV gia nhập đội nhóm'}
          >
            <UserPlus className="h-4 w-4" />
            <span>+ Mời CTV vào nhóm</span>
          </button>
        </div>
      </div>

      {/* 4 THẺ THỐNG KÊ ĐỘI NHÓM */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Tổng thành viên */}
        <div className="rounded-2xl border border-purple-200 bg-gradient-to-b from-purple-50/60 to-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Tổng CTV Trong Nhóm
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
              <Users2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-purple-950">
            {stats.totalMembers} <span className="text-xs font-normal text-slate-500">thành viên</span>
          </div>
          <div className="text-[11px] text-purple-700 mt-1 font-medium flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            Đầy đủ hồ sơ xác minh
          </div>
        </div>

        {/* Card 2: CTV Active tuần này */}
        <div className="rounded-2xl border border-blue-200 bg-gradient-to-b from-blue-50/60 to-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              CTV Active Tuần Này
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-blue-950">
            {stats.activeWeeklyMembers}/{stats.totalMembers}{' '}
            <span className="text-xs font-normal text-slate-500">hoạt động</span>
          </div>
          <div className="text-[11px] text-blue-700 mt-1 font-medium">
            Có phát sinh lịch xem / cập nhật CRM
          </div>
        </div>

        {/* Card 3: Tổng lịch dẫn xem */}
        <div className="rounded-2xl border border-emerald-200 bg-gradient-to-b from-emerald-50/60 to-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Lịch Dẫn Xem Tuần Này
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <CalendarDays className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-emerald-950">
            {stats.weeklyAppointmentsCount}{' '}
            <span className="text-xs font-normal text-slate-500">lượt hẹn</span>
          </div>
          <div className="text-[11px] text-emerald-700 mt-1 font-medium">
            Tập trung Đống Đa, Cầu Giấy, Nam Từ Liêm
          </div>
        </div>

        {/* Card 4: Deal nhóm cần hỗ trợ */}
        <div className="rounded-2xl border border-amber-200 bg-gradient-to-b from-amber-50/60 to-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Deal Cần TPKD Hỗ Trợ
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-amber-950">
            {stats.dealsRequiringHelpCount}{' '}
            <span className="text-xs font-normal text-slate-500">yêu cầu</span>
          </div>
          <div className="text-[11px] text-amber-800 mt-1 font-medium flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping" />
            Cần TPKD tháo gỡ cọc & đàm phán
          </div>
        </div>

      </div>

      {/* THANH TABS CHUYỂN ĐỔI GÓC NHÌN */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('members')}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-bold transition-colors ${
            activeTab === 'members'
              ? 'border-purple-600 text-purple-700 bg-purple-50/40 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users2 className="h-4 w-4" />
          <span>Danh Sách CTV Trực Thuộc ({members.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('overrides')}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-bold transition-colors ${
            activeTab === 'overrides'
              ? 'border-purple-600 text-purple-700 bg-purple-50/40 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Crown className="h-4 w-4" />
          <span>Thù Lao Quản Lý ({rewards.length})</span>
          <span className="rounded-full bg-purple-100 px-2 py-0.2 text-[10px] text-purple-800 font-extrabold">
            36.5tr
          </span>
        </button>

        <button
          onClick={() => setActiveTab('tasks')}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-bold transition-colors ${
            activeTab === 'tasks'
              ? 'border-purple-600 text-purple-700 bg-purple-50/40 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileCheck2 className="h-4 w-4" />
          <span>Kế Hoạch & Phân Bổ Nhiệm Vụ</span>
        </button>
      </div>

      {/* NỘI DUNG TỪNG TAB */}
      {activeTab === 'members' && (
        <TeamMemberTable
          members={members}
          onOpenDealHelp={(m) => setSelectedMemberForHelp(m)}
        />
      )}

      {activeTab === 'overrides' && (
        <ManagementOverridesTable rewards={rewards} />
      )}

      {activeTab === 'tasks' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Phân Bổ Kế Hoạch Khảo Sát & Trực Thực Địa Tuần Này
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Kế hoạch điều phối nhân sự theo địa bàn quận/huyện phục vụ tiếp đón khách xem nhà.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="rounded-xl border border-purple-200 bg-purple-50/40 p-4 space-y-2">
              <span className="font-bold text-purple-900 block text-sm">Quận Đống Đa & Ba Đình</span>
              <p className="text-slate-600 text-[11px]">
                Phụ trách: <strong>Trần Minh Đức, Bùi Quỳnh Mai</strong>
              </p>
              <div className="text-slate-500 text-[11px]">
                Mục tiêu tuần: Khảo sát 6 căn ngõ ô tô phân khúc 12 - 20 tỷ khu Hoàng Cầu, Giảng Võ.
              </div>
            </div>

            <div className="rounded-xl border border-blue-200 bg-blue-50/40 p-4 space-y-2">
              <span className="font-bold text-blue-900 block text-sm">Quận Cầu Giấy & Nam Từ Liêm</span>
              <p className="text-slate-600 text-[11px]">
                Phụ trách: <strong>Nguyễn Thu Trang, Hoàng Văn Lâm</strong>
              </p>
              <div className="text-slate-500 text-[11px]">
                Mục tiêu tuần: Trực đón khách chung cư Masteri West Heights & Smart City.
              </div>
            </div>

            <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4 space-y-2">
              <span className="font-bold text-emerald-900 block text-sm">Long Biên & Tây Hồ</span>
              <p className="text-slate-600 text-[11px]">
                Phụ trách: <strong>Lê Phương Anh, Vũ Thùy Linh</strong>
              </p>
              <div className="text-slate-500 text-[11px]">
                Mục tiêu tuần: Thẩm định 2 biệt thự phân khu Vinhomes Riverside và Starlake.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL MỜI CTV VÀO NHÓM */}
      <InviteMemberModal
        isOpen={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        isExpired={isExpired}
        onInviteSuccess={(payload) => {
          // Thêm CTV vào danh sách ở trạng thái chờ xác nhận
          const newMember: TeamMember = {
            id: `tm-${Date.now()}`,
            brokerCode: payload.brokerCodeOrEmail.startsWith('CTV-')
              ? payload.brokerCodeOrEmail
              : `CTV-HN${Math.floor(1180 + Math.random() * 20)}`,
            fullName: payload.brokerCodeOrEmail.includes('@')
              ? payload.brokerCodeOrEmail.split('@')[0]
              : 'Thành viên mới (Chờ CTV duyệt)',
            phone: '09xx.xxx.xxx',
            email: payload.brokerCodeOrEmail.includes('@')
              ? payload.brokerCodeOrEmail
              : 'ctv.new@hanoirealty.vn',
            role: 'ctv',
            status: 'pending_invite',
            subscriptionTier: 'free',
            joinedAt: new Date().toISOString(),
            activeCuratedListings: 0,
            activeLeadsCount: 0,
            totalClosedDeals: 0,
          };
          setMembers([...members, newMember]);
          setStats((prev) => ({ ...prev, totalMembers: prev.totalMembers + 1 }));
        }}
      />

      {/* MODAL CHI TIẾT DEAL VƯỚNG & HỖ TRỢ */}
      <DealHelpDetailModal
        isOpen={!!selectedMemberForHelp}
        onClose={() => setSelectedMemberForHelp(null)}
        member={selectedMemberForHelp}
        onAcceptHelp={handleAcceptDealHelp}
      />

    </div>
  );
};

