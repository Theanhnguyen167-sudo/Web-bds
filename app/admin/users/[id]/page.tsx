'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { mockAdminUsers } from '@/lib/admin-data';
import { formatCurrencyVND } from '@/lib/utils';
import { useApp } from '@/lib/context/AppContext';
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Shield,
  CreditCard,
  Building2,
  Sparkles,
  Lock,
  Trash2,
  Save,
  CheckCircle2,
  Clock,
  ChevronRight
} from 'lucide-react';

export default function AdminUserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToast } = useApp();
  const userId = params.id as string;

  const user = mockAdminUsers.find((u) => u.id === userId) || mockAdminUsers[0];

  const [selectedPackage, setSelectedPackage] = useState(user.package);
  const [internalNote, setInternalNote] = useState(
    'Khách hàng thân thiết, thường xuyên tra cứu quy hoạch khu vực Đống Đa.'
  );

  const handleSaveNote = () => {
    addToast('Đã lưu ghi chú nội bộ thành công', 'success');
  };

  const handlePackageChange = () => {
    addToast(`Đã chuyển gói của ${user.name} sang ${selectedPackage}`, 'success');
  };

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader
        title={`Chi tiết: ${user.name}`}
        breadcrumb={`Người dùng / ${user.name}`}
      />

      <main className="p-6 space-y-6 max-w-7xl">
        {/* Back Link */}
        <div>
          <Link
            href="/admin/users"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-orange-500 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Quay lại danh sách người dùng</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* ── LEFT 65%: Details, History, Logs ── */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Profile Overview Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-16 w-16 rounded-2xl object-cover ring-2 ring-slate-100 shrink-0"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-2xl bg-orange-500 text-white font-black text-xl flex items-center justify-center shrink-0 shadow-md">
                    {user.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                  </div>
                )}

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-navy truncate">{user.name}</h2>
                    <StatusBadge status={user.status} />
                  </div>
                  <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Mail className="h-3.5 w-3.5 text-slate-400" />
                      {user.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5 text-slate-400" />
                      {user.phone}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      Tham gia: {user.joinedDate}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Listing History */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-navy flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-orange-500" />
                  <span>Tin đăng đã xuất bản ({user.listingsCount})</span>
                </h3>
                <Link href="/admin/listings" className="text-xs font-bold text-orange-500 hover:underline">
                  Xem tất cả
                </Link>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                <div className="py-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-bold text-navy">Nhà phố Đống Đa 5 tầng, mặt tiền 6m</p>
                    <p className="text-[11px] text-slate-400">Đăng ngày: 18/08/2025 · 8.5 Tỷ</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600">
                    Đang hiển thị
                  </span>
                </div>
                <div className="py-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-bold text-navy">Đất phân lô kinh doanh Cầu Giấy, ngõ 8m</p>
                    <p className="text-[11px] text-slate-400">Đăng ngày: 23/08/2025 · 12.5 Tỷ</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-600">
                    Chờ duyệt
                  </span>
                </div>
              </div>
            </div>

            {/* Payment History */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
              <h3 className="font-bold text-sm text-navy flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-emerald-500" />
                <span>Lịch sử giao dịch thanh toán</span>
              </h3>

              <div className="divide-y divide-slate-100 text-xs">
                <div className="py-3 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-navy">Gia hạn gói Pro (3 tháng)</p>
                    <p className="text-[11px] text-slate-400">22/08/2025 14:15 · VNPay</p>
                  </div>
                  <div className="text-right">
                    <p className="font-extrabold text-navy">1.599.000đ</p>
                    <span className="text-[10px] font-bold text-emerald-600">Thành công</span>
                  </div>
                </div>
                <div className="py-3 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-navy">Mua 10 Báo cáo AI định giá bổ sung</p>
                    <p className="text-[11px] text-slate-400">10/07/2025 09:30 · MoMo</p>
                  </div>
                  <div className="text-right">
                    <p className="font-extrabold text-navy">198.000đ</p>
                    <span className="text-[10px] font-bold text-emerald-600">Thành công</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* ── RIGHT 35%: Quick Actions, Stats, Notes ── */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Stats Card */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">
                Thống kê người dùng
              </h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-slate-400">Tổng tin đăng</p>
                  <p className="text-lg font-black text-navy">{user.listingsCount}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-slate-400">Báo cáo AI</p>
                  <p className="text-lg font-black text-navy">{user.aiReportsUsed}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl col-span-2">
                  <p className="text-slate-400">Tổng chi tiêu</p>
                  <p className="text-lg font-black text-orange-500">
                    {formatCurrencyVND(user.totalSpent)}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-4">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">
                Thao tác quản trị
              </h3>

              {/* Change Package */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-navy">Gói thành viên</label>
                <div className="flex gap-2">
                  <select
                    value={selectedPackage}
                    onChange={(e) => setSelectedPackage(e.target.value as any)}
                    className="flex-1 px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl outline-none cursor-pointer"
                  >
                    <option value="Free">Gói Free</option>
                    <option value="Basic">Gói Basic</option>
                    <option value="Pro">Gói Pro</option>
                    <option value="Agency">Gói Agency</option>
                  </select>
                  <button
                    onClick={handlePackageChange}
                    className="px-3 py-2 bg-navy text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors"
                  >
                    Đổi
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => addToast('Mở trình soạn email', 'info')}
                  className="w-full py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Mail className="h-3.5 w-3.5" /> Gửi email thông báo
                </button>

                <button
                  onClick={() => addToast('Đã đổi trạng thái tài khoản', 'warning')}
                  className="w-full py-2.5 px-3 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Lock className="h-3.5 w-3.5" /> Khóa tài khoản
                </button>

                <button
                  onClick={() => addToast('Yêu cầu xác nhận xóa tài khoản', 'info')}
                  className="w-full py-2.5 px-3 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Xóa vĩnh viễn
                </button>
              </div>
            </div>

            {/* Internal Notes */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">
                Ghi chú nội bộ Admin
              </h3>
              <textarea
                rows={3}
                value={internalNote}
                onChange={(e) => setInternalNote(e.target.value)}
                placeholder="Ghi chú về khách hàng..."
                className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500 focus:bg-white resize-none"
              />
              <button
                onClick={handleSaveNote}
                className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <Save className="h-3.5 w-3.5" /> Lưu ghi chú
              </button>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
