import React from 'react';
import { CheckSquare, Plus, Clock } from 'lucide-react';

export default function BrokerTeamTasksPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <CheckSquare className="h-6 w-6 text-purple-600" />
            Phân Bổ Nhiệm Vụ & Kế Hoạch Đội Nhóm
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Giao kế hoạch khảo sát khu vực thực địa, phân công trực dẫn khách và hỗ trợ thành viên mới.
          </p>
        </div>
        <button className="inline-flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white hover:bg-purple-500 shadow-sm">
          <Plus className="h-4 w-4" />
          Tạo nhiệm vụ mới
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xs">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
          <CheckSquare className="h-7 w-7" />
        </div>
        <h3 className="mt-4 text-base font-bold text-slate-900">
          Nhiệm Vụ Đang Thực Hiện Trong Tuần
        </h3>
        <p className="mt-1 text-xs text-slate-500 max-w-md mx-auto">
          Danh sách công việc khảo sát BĐS thực địa và tiếp đón khách hàng theo khu vực quận/huyện.
        </p>
      </div>
    </div>
  );
}

