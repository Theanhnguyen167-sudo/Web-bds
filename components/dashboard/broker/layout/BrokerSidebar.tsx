'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  BookmarkCheck,
  Users,
  CalendarDays,
  ArrowLeftRight,
  FileCheck2,
  Coins,
  CreditCard,
  Settings,
  Users2,
  BarChart3,
  CheckSquare,
  ShieldAlert,
  ChevronRight,
  Building,
  HelpCircle,
  X
} from 'lucide-react';
import { BrokerProfile, BrokerRole } from '@/types/broker-nav';
import { cn } from '@/lib/utils';

interface BrokerSidebarProps {
  profile: BrokerProfile;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

interface NavItemConfig {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeType?: 'amber' | 'emerald' | 'blue' | 'purple' | 'slate';
  tooltip?: string;
}

export const BrokerSidebar: React.FC<BrokerSidebarProps> = ({
  profile,
  isOpenMobile,
  onCloseMobile,
}) => {
  const pathname = usePathname();

  // Danh sách mục điều hướng tiêu chuẩn của môi giới
  const standardNavItems: NavItemConfig[] = [
    {
      title: 'Tổng quan',
      href: '/dashboard/broker',
      icon: LayoutDashboard,
    },
    {
      title: 'Kho nhà chung',
      href: '/dashboard/broker/inventory',
      icon: Building2,
      badge: 'Kho mở',
      badgeType: 'emerald',
      tooltip: 'Kho nguồn mở chung cho toàn bộ CTV đủ điều kiện',
    },
    {
      title: 'Tủ hàng cá nhân',
      href: '/dashboard/broker/my-listings',
      icon: BookmarkCheck,
      tooltip: 'BĐS bạn đã đăng ký khai thác & theo dõi',
    },
    {
      title: 'Khách hàng & CRM',
      href: '/dashboard/broker/crm',
      icon: Users,
      tooltip: 'Quản lý phễu khách hàng & ghi nhận gắn mã môi giới',
    },
    {
      title: 'Lịch hẹn',
      href: '/dashboard/broker/appointments',
      icon: CalendarDays,
      tooltip: 'Lịch dẫn khách xem nhà & điều phối các bên',
    },
    {
      title: 'Giao dịch',
      href: '/dashboard/broker/transactions',
      icon: ArrowLeftRight,
      tooltip: 'Theo dõi tiến độ giao dịch và thỏa thuận',
    },
    {
      title: 'Hợp đồng',
      href: '/dashboard/broker/contracts',
      icon: FileCheck2,
      tooltip: 'Hồ sơ pháp lý & hợp đồng môi giới',
    },
    {
      title: 'Thu nhập (5 trạng thái)',
      href: '/dashboard/broker/income',
      icon: Coins,
      badge: 'Minh bạch',
      badgeType: 'amber',
      tooltip: 'Dự kiến • Đủ điều kiện • Chờ đối soát • Đã chi • Tranh chấp',
    },
    {
      title: 'Gói dịch vụ',
      href: '/dashboard/broker/subscription',
      icon: CreditCard,
      tooltip: 'Gói Free tháng đầu, CTV 189k, TPKD 499k',
    },
    {
      title: 'Cài đặt',
      href: '/dashboard/broker/settings',
      icon: Settings,
      tooltip: 'Hồ sơ chứng chỉ & thông tin cá nhân',
    },
  ];

  // Khối mục dành riêng cho Trưởng phòng kinh doanh (TPKD)
  const tpkdNavItems: NavItemConfig[] = [
    {
      title: 'Thành viên nhóm',
      href: '/dashboard/broker/team/members',
      icon: Users2,
      tooltip: 'Danh sách và hoạt động của CTV trong đội nhóm',
    },
    {
      title: 'Báo cáo đội nhóm',
      href: '/dashboard/broker/team/reports',
      icon: BarChart3,
      tooltip: 'Hiệu suất khai thác & tiến độ giao dịch của nhóm',
    },
    {
      title: 'Phân bổ nhiệm vụ',
      href: '/dashboard/broker/team/tasks',
      icon: CheckSquare,
      tooltip: 'Giao chỉ tiêu, kế hoạch khảo sát và dẫn khách',
    },
  ];

  const renderBadge = (text?: string, type: string = 'slate') => {
    if (!text) return null;
    const colors: Record<string, string> = {
      emerald: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      amber: 'bg-amber-100 text-amber-800 border-amber-200',
      blue: 'bg-blue-100 text-blue-800 border-blue-200',
      purple: 'bg-purple-100 text-purple-800 border-purple-200',
      slate: 'bg-slate-100 text-slate-700 border-slate-200',
    };

    return (
      <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded border leading-none', colors[type] || colors.slate)}>
        {text}
      </span>
    );
  };

  const isLinkActive = (href: string) => {
    if (href === '/dashboard/broker') {
      return pathname === '/dashboard/broker';
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Backdrop trên màn hình điện thoại / máy tính bảng */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-white border-r border-slate-200 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0',
          isOpenMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        )}
      >
        {/* Logo & Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5">
          <Link href="/dashboard/broker" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white shadow-md">
              <Building className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-slate-900 tracking-tight text-base leading-tight">
                HaNoi Realty
              </span>
              <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                Phân hệ Môi giới
              </span>
            </div>
          </Link>

          {/* Nút đóng trên mobile */}
          <button
            onClick={onCloseMobile}
            className="lg:hidden rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            aria-label="Đóng bảng điều khiển"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nội dung danh mục cuộn (Scrollable Navigation) */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-6">
          
          {/* Nhóm điều hướng chính */}
          <div>
            <div className="px-2.5 mb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
              Không gian làm việc
            </div>
            <nav className="space-y-1">
              {standardNavItems.map((item) => {
                const active = isLinkActive(item.href);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => onCloseMobile()}
                    title={item.tooltip}
                    className={cn(
                      'group flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition-colors',
                      active
                        ? 'bg-blue-600 text-white shadow-sm font-semibold'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    )}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon
                        className={cn(
                          'h-4.5 w-4.5 shrink-0 transition-colors',
                          active ? 'text-white' : 'text-slate-400 group-hover:text-slate-700'
                        )}
                      />
                      <span className="truncate">{item.title}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {item.badge && !active && renderBadge(item.badge, item.badgeType)}
                      {active && <ChevronRight className="h-4 w-4 text-white/80" />}
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* KHỐI ĐIỀU HƯỚNG QUẢN TRỊ ĐỘI NHÓM - CHỈ RENDER KHI ROLE === 'tpkd' */}
          {profile.role === 'tpkd' && (
            <div className="rounded-2xl border-2 border-purple-400/80 bg-gradient-to-b from-purple-50/80 via-purple-50/40 to-white p-2.5 shadow-sm">
              <div className="flex items-center justify-between px-2 py-1.5 mb-1.5">
                <span className="text-[11px] font-bold tracking-wider text-purple-900 uppercase flex items-center gap-1.5">
                  <span className="flex h-2 w-2 rounded-full bg-purple-600" />
                  Quản trị đội nhóm
                </span>
                <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-purple-200 text-purple-800">
                  TPKD
                </span>
              </div>

              <nav className="space-y-1">
                {tpkdNavItems.map((item) => {
                  const active = isLinkActive(item.href);
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => onCloseMobile()}
                      title={item.tooltip}
                      className={cn(
                        'group flex items-center justify-between rounded-xl px-2.5 py-2 text-xs sm:text-sm font-medium transition-colors',
                        active
                          ? 'bg-purple-600 text-white shadow-sm font-semibold'
                          : 'text-purple-950 hover:bg-purple-100/70 hover:text-purple-900'
                      )}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon
                          className={cn(
                            'h-4 w-4 shrink-0 transition-colors',
                            active ? 'text-white' : 'text-purple-600 group-hover:text-purple-800'
                          )}
                        />
                        <span className="truncate">{item.title}</span>
                      </div>

                      {active && <ChevronRight className="h-3.5 w-3.5 text-white/80" />}
                    </Link>
                  );
                })}
              </nav>
            </div>
          )}

        </div>

        {/* Chân trang Sidebar (Footer & Cam kết định vị) */}
        <div className="border-t border-slate-200 p-3.5 bg-slate-50/70">
          <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xs">
            <div className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
              <span className="flex h-2 w-2 rounded-full bg-blue-600" />
              Định vị HaNoi Realty
            </div>
            <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
              Xác thực • Rõ ràng • Minh bạch • Bảo vệ quyền lợi các bên.
            </p>
          </div>
        </div>

      </aside>
    </>
  );
};

