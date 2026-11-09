import React from 'react';
import { CalendarDays, Plus, Clock, MapPin } from 'lucide-react';

export default function BrokerAppointmentsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <CalendarDays className="h-6 w-6 text-indigo-600" />
            Lịch Hẹn & Dẫn Khách Xem Nhà
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Điều phối lịch giữa Chủ nhà, Môi giới và Khách mua để đảm bảo minh bạch và lưu bằng chứng dẫn khách.
          </p>
        </div>
        <button className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 shadow-sm">
          <Plus className="h-4 w-4" />
          Tạo lịch hẹn mới
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xs">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
          <CalendarDays className="h-7 w-7" />
        </div>
        <h3 className="mt-4 text-base font-bold text-slate-900">
          Lịch dẫn khách tuần này (4 cuộc hẹn)
        </h3>
        <p className="mt-1 text-xs text-slate-500 max-w-md mx-auto">
          Các lịch hẹn đã được chủ nhà xác nhận thời gian để đón tiếp khách hàng.
        </p>
      </div>
    </div>
  );
}

