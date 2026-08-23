'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { DataTable, Column } from '@/components/admin/DataTable';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { mockAdminUsers, AdminUser } from '@/lib/admin-data';
import { useApp } from '@/lib/context/AppContext';
import {
  Search,
  Download,
  UserPlus,
  Mail,
  Lock,
  Unlock,
  Eye,
  Edit,
  MoreHorizontal,
  Filter,
  CheckCircle,
  X
} from 'lucide-react';

export default function AdminUsersPage() {
  const router = useRouter();
  const { addToast } = useApp();
  const [users, setUsers] = useState<AdminUser[]>(mockAdminUsers);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [activePackageTab, setActivePackageTab] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const filteredUsers = users.filter((u) => {
    if (activePackageTab !== 'all' && u.package !== activePackageTab) return false;
    if (selectedStatus !== 'all' && u.status !== selectedStatus) return false;
    if (
      searchTerm &&
      !u.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !u.email.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !u.phone.includes(searchTerm)
    ) {
      return false;
    }
    return true;
  });

  const handleToggleLock = (id: string, name: string, currentStatus: string) => {
    const newStatus = currentStatus === 'locked' ? 'active' : 'locked';
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: newStatus as any } : u))
    );
    addToast(
      `Đã ${newStatus === 'locked' ? 'khóa' : 'mở khóa'} tài khoản: ${name}`,
      newStatus === 'locked' ? 'warning' : 'success'
    );
  };

  const handleBulkLock = () => {
    setUsers((prev) =>
      prev.map((u) =>
        selectedKeys.includes(u.id) ? { ...u, status: 'locked' as const } : u
      )
    );
    addToast(`Đã khóa hàng loạt ${selectedKeys.length} tài khoản`, 'warning');
    setSelectedKeys([]);
  };

  const columns: Column<AdminUser>[] = [
    {
      key: 'name',
      header: 'Người dùng',
      sortable: true,
      render: (user) => (
        <div className="flex items-center gap-3">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="h-8 w-8 rounded-full object-cover shrink-0 ring-1 ring-slate-200"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-orange-100 text-orange-600 font-black text-xs flex items-center justify-center shrink-0">
              {user.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
            </div>
          )}
          <div className="min-w-0">
            <Link
              href={`/admin/users/${user.id}`}
              className="font-bold text-navy hover:text-orange-500 transition-colors block truncate"
            >
              {user.name}
            </Link>
            <span className="text-[11px] text-slate-400 capitalize">{user.role}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'email',
      header: 'Email',
      sortable: true,
      render: (u) => <span className="text-slate-600 truncate block">{u.email}</span>,
    },
    {
      key: 'phone',
      header: 'Số điện thoại',
      render: (u) => <span className="font-mono text-slate-600">{u.phone}</span>,
    },
    {
      key: 'package',
      header: 'Gói dịch vụ',
      sortable: true,
      render: (u) => {
        const colors = {
          Free: 'bg-slate-100 text-slate-600 border-slate-200',
          Basic: 'bg-blue-50 text-blue-600 border-blue-200',
          Pro: 'bg-orange-50 text-orange-600 border-orange-200',
          Agency: 'bg-amber-50 text-amber-600 border-amber-200',
        };
        return (
          <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${colors[u.package]}`}>
            {u.package}
          </span>
        );
      },
    },
    {
      key: 'joinedDate',
      header: 'Ngày tham gia',
      sortable: true,
      render: (u) => <span className="text-slate-400">{u.joinedDate}</span>,
    },
    {
      key: 'status',
      header: 'Trạng thái',
      sortable: true,
      render: (u) => <StatusBadge status={u.status} />,
    },
    {
      key: 'listingsCount',
      header: 'Số tin',
      sortable: true,
      render: (u) => <span className="font-bold text-navy">{u.listingsCount}</span>,
    },
  ];

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader title="Quản lý Người dùng" breadcrumb="Người dùng" />

      <main className="p-6 space-y-5 max-w-7xl">
        {/* ── TOP HEADER ROW ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-extrabold text-navy">
              Danh sách Người dùng ({users.length.toLocaleString()})
            </h2>
            <p className="text-xs text-slate-500">
              Quản lý phân quyền, gói thành viên và trạng thái tài khoản
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => addToast('Đang xuất file Excel dữ liệu người dùng...', 'info')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-2xs transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export Excel</span>
            </button>

            <button
              onClick={() => addToast('Mở form tạo tài khoản quản trị viên', 'info')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-md shadow-orange-500/20 transition-colors"
            >
              <UserPlus className="h-3.5 w-3.5" />
              <span>+ Thêm Admin</span>
            </button>
          </div>
        </div>

        {/* ── FILTER & SEARCH BAR ── */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm theo email, tên, số điện thoại..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
              />
            </div>

            {/* Status Select */}
            <div className="flex items-center gap-2">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 cursor-pointer"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Hoạt động</option>
                <option value="pending">Chờ xác thực</option>
                <option value="locked">Bị khóa</option>
              </select>
            </div>
          </div>

          {/* Package Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-1 border-t border-slate-100">
            {['all', 'Free', 'Basic', 'Pro', 'Agency'].map((pkg) => (
              <button
                key={pkg}
                onClick={() => setActivePackageTab(pkg)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  activePackageTab === pkg
                    ? 'bg-navy text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                {pkg === 'all' ? 'Tất cả gói' : `Gói ${pkg}`}
              </button>
            ))}
          </div>
        </div>

        {/* ── BULK ACTIONS FLOATING BAR ── */}
        {selectedKeys.length > 0 && (
          <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-xl text-xs font-bold text-orange-900 animate-in fade-in slide-in-from-top-2">
            <span className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-orange-500" />
              Đang chọn {selectedKeys.length} người dùng
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => addToast('Mở trình gửi email hàng loạt', 'info')}
                className="px-3 py-1.5 bg-white border border-orange-200 rounded-lg hover:bg-orange-100 text-orange-700 transition-colors flex items-center gap-1"
              >
                <Mail className="h-3.5 w-3.5" /> Gửi email
              </button>
              <button
                onClick={handleBulkLock}
                className="px-3 py-1.5 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors flex items-center gap-1"
              >
                <Lock className="h-3.5 w-3.5" /> Khóa hàng loạt
              </button>
              <button
                onClick={() => setSelectedKeys([])}
                className="p-1.5 hover:bg-orange-100 rounded-lg text-slate-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* ── USERS DATA TABLE ── */}
        <DataTable
          columns={columns}
          data={filteredUsers}
          keyExtractor={(u) => u.id}
          selectedKeys={selectedKeys}
          onSelectKeys={setSelectedKeys}
          itemsPerPage={10}
          actions={(user) => (
            <div className="flex items-center gap-1">
              <Link
                href={`/admin/users/${user.id}`}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-navy transition-colors"
                title="Xem chi tiết"
              >
                <Eye className="h-3.5 w-3.5" />
              </Link>
              <button
                onClick={() => handleToggleLock(user.id, user.name, user.status)}
                className={`p-1.5 rounded-lg transition-colors ${
                  user.status === 'locked'
                    ? 'hover:bg-emerald-50 text-emerald-600'
                    : 'hover:bg-rose-50 text-rose-500'
                }`}
                title={user.status === 'locked' ? 'Mở khóa' : 'Khóa tài khoản'}
              >
                {user.status === 'locked' ? (
                  <Unlock className="h-3.5 w-3.5" />
                ) : (
                  <Lock className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
          )}
        />
      </main>
    </div>
  );
}
