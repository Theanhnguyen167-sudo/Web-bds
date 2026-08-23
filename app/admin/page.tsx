'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { StatsCard } from '@/components/admin/StatsCard';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { RevenueChart } from '@/components/admin/charts/RevenueChart';
import { PackageDonutChart } from '@/components/admin/charts/UsersChart';
import { mockAdminListings, mockAdminTransactions } from '@/lib/admin-data';
import { formatCurrencyVND } from '@/lib/utils';
import { useApp } from '@/lib/context/AppContext';
import {
  Users,
  Building2,
  DollarSign,
  Clock,
  Sparkles,
  CreditCard,
  AlertTriangle,
  Activity,
  CheckCircle,
  XCircle,
  ArrowRight,
  RefreshCw,
  Eye
} from 'lucide-react';

export default function AdminOverviewPage() {
  const router = useRouter();
  const { addToast } = useApp();
  const [dateRange, setDateRange] = useState<'today' | '7d' | '30d' | 'this_month'>('this_month');
  const [pendingListings, setPendingListings] = useState(
    mockAdminListings.filter((l) => l.status === 'pending')
  );

  const handleApprove = (id: string, title: string) => {
    setPendingListings((prev) => prev.filter((item) => item.id !== id));
    addToast(`Đã duyệt thành công: "${title}"`, 'success');
  };

  const handleReject = (id: string, title: string) => {
    setPendingListings((prev) => prev.filter((item) => item.id !== id));
    addToast(`Đã từ chối tin đăng: "${title}"`, 'info');
  };

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader title="Tổng quan hệ thống" breadcrumb="Dashboard" />

      <main className="p-6 space-y-6 max-w-7xl">
        {/* ── TOP ACTION BAR: Date Range Picker ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-extrabold text-navy">Chỉ số vận hành cốt lõi</h2>
            <p className="text-xs text-slate-500">Cập nhật tự động theo thời gian thực</p>
          </div>

          <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs text-xs font-bold">
            {[
              { id: 'today', label: 'Hôm nay' },
              { id: '7d', label: '7 ngày' },
              { id: '30d', label: '30 ngày' },
              { id: 'this_month', label: 'Tháng này' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setDateRange(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  dateRange === tab.id
                    ? 'bg-orange-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-navy hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── ROW 1: 8 KPI CARDS (2x4 Grid) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Tổng người dùng"
            value="10,247"
            trend="+234 tuần này"
            trendDirection="up"
            icon={<Users className="h-5 w-5 text-blue-500" />}
            sparklineData={[40, 45, 55, 60, 75, 80, 95]}
            onClick={() => router.push('/admin/users')}
          />

          <StatsCard
            title="Tổng tin đăng"
            value="8,432"
            trend="+89 hôm nay"
            trendDirection="up"
            icon={<Building2 className="h-5 w-5 text-indigo-500" />}
            onClick={() => router.push('/admin/listings')}
          />

          <StatsCard
            title="Doanh thu tháng này"
            value="48.5M đ"
            trend="+12% vs tháng trước"
            trendDirection="up"
            icon={<DollarSign className="h-5 w-5 text-emerald-500" />}
            onClick={() => router.push('/admin/payments')}
          />

          <StatsCard
            title="Chờ duyệt tin"
            value="23"
            trend="Khẩn cấp"
            trendDirection="urgent"
            badge="URGENT"
            icon={<Clock className="h-5 w-5 text-orange-500" />}
            onClick={() => router.push('/admin/listings')}
          />

          <StatsCard
            title="Báo cáo AI hôm nay"
            value="156"
            trend="+23%"
            trendDirection="up"
            icon={<Sparkles className="h-5 w-5 text-purple-500" />}
            onClick={() => router.push('/admin/reports')}
          />

          <StatsCard
            title="Giao dịch hôm nay"
            value="12 (7.2M đ)"
            trend="100% thành công"
            trendDirection="up"
            icon={<CreditCard className="h-5 w-5 text-teal-500" />}
            onClick={() => router.push('/admin/payments')}
          />

          <StatsCard
            title="Lỗi hệ thống"
            value="2"
            trend="Cần xử lý"
            trendDirection="down"
            icon={<AlertTriangle className="h-5 w-5 text-amber-500" />}
            onClick={() => router.push('/admin/settings')}
          />

          <StatsCard
            title="Active users"
            value="342"
            trend="Đang online"
            trendDirection="up"
            icon={
              <div className="relative">
                <Activity className="h-5 w-5 text-emerald-500" />
                <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              </div>
            }
          />
        </div>

        {/* ── ROW 2: TWO CHARTS (60/40) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <RevenueChart />
          </div>
          <div className="lg:col-span-5">
            <PackageDonutChart />
          </div>
        </div>

        {/* ── ROW 3: TWO TABLES (50/50) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Left: Pending Approval Listings */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-navy flex items-center gap-2">
                  <span>Tin đăng chờ duyệt</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-600">
                    {pendingListings.length} tin
                  </span>
                </h3>
                <p className="text-xs text-slate-400">Ưu tiên xử lý trong 2 giờ</p>
              </div>

              <Link
                href="/admin/listings"
                className="text-xs font-bold text-orange-500 hover:text-orange-600 flex items-center gap-1"
              >
                <span>Xem tất cả</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {pendingListings.length > 0 ? (
                pendingListings.slice(0, 4).map((listing) => (
                  <div key={listing.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={listing.images[0]}
                        alt={listing.title}
                        className="h-10 w-12 rounded-lg object-cover bg-slate-100 shrink-0"
                      />
                      <div className="min-w-0">
                        <Link
                          href={`/admin/listings/${listing.id}`}
                          className="font-bold text-xs text-navy hover:text-orange-500 truncate block"
                        >
                          {listing.title}
                        </Link>
                        <p className="text-[11px] text-slate-400">
                          {listing.authorName} · {formatCurrencyVND(listing.price)} · {listing.district}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleApprove(listing.id, listing.title)}
                        className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                        title="Duyệt nhanh"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleReject(listing.id, listing.title)}
                        className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                        title="Từ chối"
                      >
                        <XCircle className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-xs text-slate-400">
                  🎉 Không còn tin đăng nào cần phê duyệt!
                </div>
              )}
            </div>

            <Link
              href="/admin/listings"
              className="w-full py-2 rounded-xl bg-slate-50 hover:bg-orange-50 text-slate-600 hover:text-orange-600 text-xs font-bold text-center transition-colors block"
            >
              Xem tất cả 23 tin chờ duyệt →
            </Link>
          </div>

          {/* Right: Recent Transactions */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-navy">Giao dịch gần nhất</h3>
                <p className="text-xs text-slate-400">Lịch sử nạp tiền & gói thành viên</p>
              </div>

              <Link
                href="/admin/payments"
                className="text-xs font-bold text-orange-500 hover:text-orange-600 flex items-center gap-1"
              >
                <span>Xem tất cả</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {mockAdminTransactions.slice(0, 4).map((tx) => (
                <div key={tx.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div className="min-w-0">
                    <p className="font-bold text-navy truncate">{tx.userName}</p>
                    <p className="text-[11px] text-slate-400">
                      {tx.package} · {tx.createdAt}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="font-extrabold text-navy">{formatCurrencyVND(tx.amount)}</p>
                    <StatusBadge status={tx.status} />
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/admin/payments"
              className="w-full py-2 rounded-xl bg-slate-50 hover:bg-orange-50 text-slate-600 hover:text-orange-600 text-xs font-bold text-center transition-colors block"
            >
              Xem toàn bộ giao dịch thanh toán →
            </Link>
          </div>

        </div>

        {/* ── ROW 4: ACTIVITY FEED (Real-time style) ── */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-navy flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Hoạt động hệ thống gần đây</span>
            </h3>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <RefreshCw className="h-3.5 w-3.5" />
              Tự động cập nhật 30s
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-base">🟢</span>
              <div className="flex-1">
                <span className="font-bold text-navy">Nguyễn Văn An</span> đăng ký gói{' '}
                <strong className="text-orange-600">Pro</strong> · 599.000đ
              </div>
              <span className="text-slate-400 text-[11px]">2 phút trước</span>
            </div>

            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-base">🔵</span>
              <div className="flex-1">
                Tin đăng <strong className="text-navy">#l1</strong> được duyệt tự động bởi hệ thống AI
              </div>
              <span className="text-slate-400 text-[11px]">5 phút trước</span>
            </div>

            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-base">🟡</span>
              <div className="flex-1">
                Giao dịch <strong className="text-navy">#TXN-90231</strong> thất bại · VNPay timeout
              </div>
              <span className="text-slate-400 text-[11px]">12 phút trước</span>
            </div>

            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-base">🔴</span>
              <div className="flex-1">
                Tài khoản <strong className="text-navy">user_901</strong> bị cảnh báo spam đăng tin
              </div>
              <span className="text-slate-400 text-[11px]">30 phút trước</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
