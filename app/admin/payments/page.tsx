'use client';

import React, { useState } from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { StatsCard } from '@/components/admin/StatsCard';
import { DataTable, Column } from '@/components/admin/DataTable';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { mockAdminTransactions, AdminTransaction } from '@/lib/admin-data';
import { formatCurrencyVND } from '@/lib/utils';
import { useApp } from '@/lib/context/AppContext';
import {
  DollarSign,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  Filter,
  RefreshCw,
  FileText,
  RotateCcw,
  PhoneCall,
  Search
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';

const paymentMethodTrend = [
  { date: '17/08', vnpay: 3.2, momo: 1.8 },
  { date: '18/08', vnpay: 4.1, momo: 2.2 },
  { date: '19/08', vnpay: 2.8, momo: 1.5 },
  { date: '20/08', vnpay: 5.4, momo: 3.1 },
  { date: '21/08', vnpay: 4.9, momo: 2.9 },
  { date: '22/08', vnpay: 6.2, momo: 3.8 },
  { date: '23/08', vnpay: 7.1, momo: 4.2 },
];

export default function AdminPaymentsPage() {
  const { addToast } = useApp();
  const [transactions, setTransactions] = useState<AdminTransaction[]>(mockAdminTransactions);
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTransactions = transactions.filter((t) => {
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    if (methodFilter !== 'all' && t.method !== methodFilter) return false;
    if (
      searchTerm &&
      !t.userName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !t.id.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !t.txnRef.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const columns: Column<AdminTransaction>[] = [
    {
      key: 'id',
      header: 'Mã GD',
      sortable: true,
      render: (t) => <span className="font-mono font-bold text-navy">{t.id}</span>,
    },
    {
      key: 'userName',
      header: 'Khách hàng',
      sortable: true,
      render: (t) => (
        <div>
          <p className="font-bold text-navy">{t.userName}</p>
          <p className="text-[11px] text-slate-400">{t.userEmail}</p>
        </div>
      ),
    },
    {
      key: 'package',
      header: 'Gói dịch vụ',
      render: (t) => <span className="font-semibold text-slate-700">{t.package}</span>,
    },
    {
      key: 'amount',
      header: 'Số tiền',
      sortable: true,
      render: (t) => (
        <span className="font-extrabold text-navy">
          {formatCurrencyVND(t.amount)}
        </span>
      ),
    },
    {
      key: 'method',
      header: 'Cổng TT',
      render: (t) => (
        <span className="uppercase text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
          {t.method}
        </span>
      ),
    },
    {
      key: 'txnRef',
      header: 'Mã tham chiếu',
      render: (t) => <span className="font-mono text-[11px] text-slate-500">{t.txnRef}</span>,
    },
    {
      key: 'createdAt',
      header: 'Thời gian',
      sortable: true,
      render: (t) => <span className="text-slate-400">{t.createdAt}</span>,
    },
    {
      key: 'status',
      header: 'Trạng thái',
      sortable: true,
      render: (t) => <StatusBadge status={t.status} />,
    },
  ];

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader title="Giao dịch Thanh toán" breadcrumb="Thanh toán" />

      <main className="p-6 space-y-6 max-w-7xl">
        {/* ── SUMMARY CARDS ROW ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Doanh thu tháng này"
            value="48.5M đ"
            trend="+12% tăng trưởng"
            trendDirection="up"
            icon={<DollarSign className="h-5 w-5 text-emerald-500" />}
          />
          <StatsCard
            title="Giao dịch thành công"
            value="234"
            trend="Tỷ lệ: 94.2%"
            trendDirection="up"
            icon={<CheckCircle2 className="h-5 w-5 text-blue-500" />}
          />
          <StatsCard
            title="Giao dịch thất bại"
            value="14"
            trend="Tỷ lệ: 5.8%"
            trendDirection="down"
            icon={<XCircle className="h-5 w-5 text-rose-500" />}
          />
          <StatsCard
            title="Đang chờ xử lý"
            value="3"
            trend="Cần kiểm tra"
            trendDirection="urgent"
            badge="PENDING"
            icon={<Clock className="h-5 w-5 text-amber-500" />}
          />
        </div>

        {/* ── FILTER & SEARCH BAR ── */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm theo mã GD, người dùng, mã VNPay/MoMo..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 focus:bg-white"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value)}
                className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl outline-none"
              >
                <option value="all">Tất cả phương thức</option>
                <option value="vnpay">VNPay</option>
                <option value="momo">MoMo</option>
                <option value="bank">Chuyển khoản</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pt-1 border-t border-slate-100">
            {['all', 'success', 'failed', 'pending', 'refunded'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === st
                    ? 'bg-navy text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st === 'all'
                  ? 'Tất cả'
                  : st === 'success'
                  ? 'Thành công'
                  : st === 'failed'
                  ? 'Thất bại'
                  : st === 'pending'
                  ? 'Đang xử lý'
                  : 'Hoàn tiền'}
              </button>
            ))}
          </div>
        </div>

        {/* ── TRANSACTIONS TABLE ── */}
        <DataTable
          columns={columns}
          data={filteredTransactions}
          keyExtractor={(t) => t.id}
          itemsPerPage={10}
          actions={(tx) => (
            <div className="flex items-center gap-1">
              {tx.status === 'success' && (
                <>
                  <button
                    onClick={() => addToast(`Đang tải hóa đơn cho ${tx.id}`, 'info')}
                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
                    title="Xuất hóa đơn"
                  >
                    <FileText className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => addToast(`Yêu cầu hoàn tiền GD ${tx.id}`, 'warning')}
                    className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-500"
                    title="Hoàn tiền"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                  </button>
                </>
              )}
              {tx.status === 'failed' && (
                <button
                  onClick={() => addToast(`Đang kết nối lại cổng thanh toán cho ${tx.id}`, 'info')}
                  className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500"
                  title="Thử lại"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          )}
        />

        {/* ── REVENUE BY METHOD CHART ── */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3">
          <h3 className="font-bold text-sm text-navy">Doanh thu theo Cổng thanh toán (7 ngày gần nhất)</h3>
          <p className="text-xs text-slate-400">So sánh lưu lượng MoMo vs VNPay (Đơn vị: Triệu VNĐ)</p>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={paymentMethodTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" tickLine={false} stroke="#94a3b8" fontSize={11} />
                <YAxis tickLine={false} stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '12px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                  formatter={(v: number) => [`${v} Triệu VNĐ`, '']}
                />
                <Legend verticalAlign="top" height={36} />
                <Area
                  type="monotone"
                  name="VNPay"
                  dataKey="vnpay"
                  stackId="1"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.4}
                />
                <Area
                  type="monotone"
                  name="MoMo"
                  dataKey="momo"
                  stackId="1"
                  stroke="#ec4899"
                  fill="#ec4899"
                  fillOpacity={0.4}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
}
