'use client';

import React, { useState } from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { ListingsChart } from '@/components/admin/charts/ListingsChart';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  AreaChart,
  Area
} from 'recharts';

const dailyUsersData = [
  { date: '17/08', newUsers: 45, total: 10100 },
  { date: '18/08', newUsers: 52, total: 10152 },
  { date: '19/08', newUsers: 38, total: 10190 },
  { date: '20/08', newUsers: 65, total: 10255 },
  { date: '21/08', newUsers: 58, total: 10313 },
  { date: '22/08', newUsers: 72, total: 10385 },
  { date: '23/08', newUsers: 84, total: 10469 },
];

const packageDistData = [
  { name: 'Free', count: 8430, pct: '82%' },
  { name: 'Basic', count: 1120, pct: '11%' },
  { name: 'Pro', count: 560, pct: '5.5%' },
  { name: 'Agency', count: 137, pct: '1.5%' },
];

const annualRevenueComp = [
  { month: 'T1', y2024: 18, y2025: 32 },
  { month: 'T2', y2024: 22, y2025: 36 },
  { month: 'T3', y2024: 25, y2025: 41 },
  { month: 'T4', y2024: 28, y2025: 45 },
  { month: 'T5', y2024: 30, y2025: 49 },
  { month: 'T6', y2024: 35, y2025: 54 },
  { month: 'T7', y2024: 38, y2025: 58 },
  { month: 'T8', y2024: 42, y2025: 65 },
];

const aiReportsByDate = [
  { date: '17/08', count: 110 },
  { date: '18/08', count: 135 },
  { date: '19/08', count: 98 },
  { date: '20/08', count: 145 },
  { date: '21/08', count: 160 },
  { date: '22/08', count: 175 },
  { date: '23/08', count: 192 },
];

const topDistrictsReports = [
  { district: 'Đống Đa', count: 320 },
  { district: 'Cầu Giấy', count: 290 },
  { district: 'Tây Hồ', count: 245 },
  { district: 'Nam Từ Liêm', count: 210 },
  { district: 'Hoàn Kiếm', count: 180 },
];

const districtHeatmap = [
  { name: 'Đống Đa', listings: 1240, intensity: 'bg-orange-600 text-white' },
  { name: 'Cầu Giấy', listings: 1150, intensity: 'bg-orange-500 text-white' },
  { name: 'Tây Hồ', listings: 980, intensity: 'bg-orange-500 text-white' },
  { name: 'Nam Từ Liêm', listings: 850, intensity: 'bg-orange-400 text-white' },
  { name: 'Hoàn Kiếm', listings: 720, intensity: 'bg-orange-400 text-white' },
  { name: 'Thanh Xuân', listings: 680, intensity: 'bg-orange-300 text-navy' },
  { name: 'Ba Đình', listings: 640, intensity: 'bg-orange-300 text-navy' },
  { name: 'Long Biên', listings: 550, intensity: 'bg-orange-200 text-navy' },
  { name: 'Hai Bà Trưng', listings: 510, intensity: 'bg-orange-200 text-navy' },
  { name: 'Hà Đông', listings: 480, intensity: 'bg-orange-100 text-navy' },
  { name: 'Hoàng Mai', listings: 390, intensity: 'bg-orange-100 text-navy' },
  { name: 'Gia Lâm', listings: 250, intensity: 'bg-orange-50 text-navy' },
];

export default function AdminAnalyticsPage() {
  const [period, setPeriod] = useState('30d');

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader title="Phân tích & Thống kê" breadcrumb="Phân tích" />

      <main className="p-6 space-y-8 max-w-7xl">
        {/* ── PERIOD SELECTOR ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-extrabold text-navy">Trung tâm Dữ liệu Thị trường</h2>
            <p className="text-xs text-slate-500">Biểu đồ trực quan hoá lưu lượng, tin đăng và doanh thu</p>
          </div>

          <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 text-xs font-bold shadow-2xs">
            {[
              { id: '7d', label: '7 ngày' },
              { id: '30d', label: '30 ngày' },
              { id: '3m', label: '3 tháng' },
              { id: '6m', label: '6 tháng' },
              { id: '1y', label: 'Năm nay' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setPeriod(p.id)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  period === p.id
                    ? 'bg-orange-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-navy'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── ROW 1: USER ANALYTICS ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-4">
            <h3 className="font-bold text-sm text-navy">Người dùng mới mỗi ngày</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyUsersData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '12px', border: 'none' }}
                  />
                  <Line
                    type="monotone"
                    name="Đăng ký mới"
                    dataKey="newUsers"
                    stroke="#f97316"
                    strokeWidth={3}
                    dot={{ fill: '#f97316', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-4">
            <h3 className="font-bold text-sm text-navy">Phân bố gói dịch vụ</h3>
            <div className="space-y-3 pt-2 text-xs">
              {packageDistData.map((item) => (
                <div key={item.name} className="space-y-1">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-700">Gói {item.name}</span>
                    <span className="text-orange-600 font-bold">{item.count.toLocaleString()} ({item.pct})</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-orange-500 h-full rounded-full"
                      style={{ width: item.pct }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── ROW 2: LISTING ANALYTICS & HEATMAP ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <ListingsChart />
          </div>

          <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-4">
            <h3 className="font-bold text-sm text-navy">Mật độ tin đăng theo Quận</h3>
            <p className="text-xs text-slate-400">Mức độ hoạt động thị trường theo khu vực Hà Nội</p>

            <div className="grid grid-cols-3 gap-2 text-xs pt-1">
              {districtHeatmap.map((d) => (
                <div
                  key={d.name}
                  className={`p-3 rounded-xl ${d.intensity} flex flex-col items-center justify-center text-center shadow-2xs transition-transform hover:scale-105 cursor-pointer`}
                  title={`${d.name}: ${d.listings} tin đăng`}
                >
                  <span className="font-bold">{d.name}</span>
                  <span className="text-[10px] opacity-90 font-semibold">{d.listings} tin</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── ROW 3: REVENUE COMPARISON (MULTI-LINE) ── */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-4">
          <div>
            <h3 className="font-bold text-sm text-navy">So sánh Doanh thu Năm (2024 vs 2025)</h3>
            <p className="text-xs text-slate-400">Tăng trưởng doanh thu lũy kế qua các tháng (Đơn vị: Triệu VNĐ)</p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={annualRevenueComp}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '12px', border: 'none' }}
                  formatter={(v: number) => [`${v} Triệu VNĐ`, '']}
                />
                <Legend verticalAlign="top" height={36} />
                <Line
                  type="monotone"
                  name="Năm 2025 (Hiện tại)"
                  dataKey="y2025"
                  stroke="#f97316"
                  strokeWidth={3}
                />
                <Line
                  type="monotone"
                  name="Năm 2024"
                  dataKey="y2024"
                  stroke="#94a3b8"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── ROW 4: AI REPORTS ANALYTICS ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3">
            <h3 className="font-bold text-sm text-navy">Báo cáo AI theo ngày</h3>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={aiReportsByDate}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '12px', border: 'none' }} />
                  <Bar dataKey="count" name="Số báo cáo" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3">
            <h3 className="font-bold text-sm text-navy">Top khu vực được xem báo cáo nhiều nhất</h3>
            <div className="space-y-2 pt-2 text-xs">
              {topDistrictsReports.map((d, i) => (
                <div key={d.district} className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
                  <span className="font-bold text-navy">#{i + 1} {d.district}</span>
                  <span className="text-purple-600 font-bold">{d.count} báo cáo</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── ROW 5: SEARCH ANALYTICS ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3">
            <h3 className="font-bold text-sm text-navy">Top từ khóa tìm kiếm</h3>
            <div className="flex flex-wrap gap-2 pt-1 text-xs">
              {[
                { tag: 'Văn Miếu Đống Đa', count: 1420 },
                { tag: 'Hồ Tây view đẹp', count: 1180 },
                { tag: 'Biệt thự Starlake', count: 960 },
                { tag: 'Chung cư The Matrix One', count: 850 },
                { tag: 'Mặt phố Hoàn Kiếm', count: 740 },
                { tag: 'Đất đấu giá Cầu Giấy', count: 620 },
              ].map((k) => (
                <span
                  key={k.tag}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-semibold flex items-center gap-1.5"
                >
                  <span>{k.tag}</span>
                  <strong className="text-orange-500 font-bold">({k.count})</strong>
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3">
            <h3 className="font-bold text-sm text-navy">Top quận được tìm kiếm nhiều nhất</h3>
            <div className="space-y-2 text-xs">
              {[
                { name: 'Quận Đống Đa', count: 4820, pct: '92%' },
                { name: 'Quận Cầu Giấy', count: 4310, pct: '85%' },
                { name: 'Quận Tây Hồ', count: 3950, pct: '78%' },
              ].map((item) => (
                <div key={item.name} className="space-y-1">
                  <div className="flex justify-between font-semibold">
                    <span>{item.name}</span>
                    <span className="text-orange-600 font-bold">{item.count} lượt</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-orange-500 h-full rounded-full" style={{ width: item.pct }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
