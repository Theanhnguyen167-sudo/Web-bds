import React from 'react';
import { BarChart3, TrendingUp, Calendar } from 'lucide-react';

export default function BrokerTeamReportsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-purple-600" />
          Báo Cáo Hiệu Suất Đội Nhóm
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Tổng hợp số lượng BĐS khai thác, khách hàng mới ghi nhận và giao dịch thành công trong tháng của đội nhóm.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xs">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
          <BarChart3 className="h-7 w-7" />
        </div>
        <h3 className="mt-4 text-base font-bold text-slate-900">
          Báo Cáo Hoạt Động Tháng Này
        </h3>
        <p className="mt-1 text-xs text-slate-500 max-w-md mx-auto">
          Dữ liệu trực quan hóa về tiến độ dẫn khách và doanh số giao dịch của từng thành viên CTV.
        </p>
      </div>
    </div>
  );
}

