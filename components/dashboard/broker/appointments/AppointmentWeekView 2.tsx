'use client';

import React from 'react';
import { AppointmentItem } from '@/types/broker-appointment';
import { Clock, MapPin, User, CheckCircle2 } from 'lucide-react';

interface AppointmentWeekViewProps {
  appointments: AppointmentItem[];
  onOpenOutcomeModal: (item: AppointmentItem) => void;
}

export const AppointmentWeekView: React.FC<AppointmentWeekViewProps> = ({
  appointments,
  onOpenOutcomeModal,
}) => {
  // Tạo danh sách 7 ngày trong tuần hiện tại
  const daysOfWeek = [
    { name: 'Thứ Hai', dateStr: '2026-11-09' },
    { name: 'Thứ Ba', dateStr: '2026-11-10' },
    { name: 'Thứ Tư', dateStr: '2026-11-11' },
    { name: 'Thứ Năm', dateStr: '2026-11-12' },
    { name: 'Thứ Sáu', dateStr: '2026-11-13' },
    { name: 'Thứ Bảy', dateStr: '2026-11-14' },
    { name: 'Chủ Nhật', dateStr: '2026-11-15' },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
      <div className="grid grid-cols-1 md:grid-cols-7 divide-y md:divide-y-0 md:divide-x divide-slate-100 min-h-[420px]">
        {daysOfWeek.map((day) => {
          const dayApts = appointments.filter((a) => a.scheduledDate === day.dateStr);
          const isToday = day.dateStr === '2026-11-09';

          return (
            <div key={day.dateStr} className={`flex flex-col p-3 ${isToday ? 'bg-blue-50/30' : 'bg-white'}`}>
              
              {/* Day header */}
              <div className="border-b border-slate-100 pb-2 mb-2 text-center">
                <span className={`text-[11px] font-bold block ${isToday ? 'text-blue-700' : 'text-slate-600'}`}>
                  {day.name}
                </span>
                <span className={`text-xs font-mono font-extrabold px-2 py-0.5 rounded-full inline-block mt-0.5 ${
                  isToday ? 'bg-blue-600 text-white' : 'text-slate-900 bg-slate-100'
                }`}>
                  {new Date(day.dateStr).getDate()}/{new Date(day.dateStr).getMonth() + 1}
                </span>
              </div>

              {/* Appointments list in this day */}
              <div className="flex-1 space-y-2">
                {dayApts.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-center text-[10px] text-slate-300 py-6">
                    Trống lịch
                  </div>
                ) : (
                  dayApts.map((apt) => (
                    <div
                      key={apt.id}
                      onClick={() => onOpenOutcomeModal(apt)}
                      className="rounded-xl border border-blue-200 bg-blue-50/70 p-2 text-xs hover:border-blue-500 hover:shadow-xs transition-all cursor-pointer space-y-1"
                    >
                      <div className="font-mono text-[10px] font-bold text-blue-700 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {apt.scheduledTimeSlot}
                      </div>

                      <div className="font-bold text-slate-900 line-clamp-1 text-[11px]">
                        [{apt.propertyCode}]
                      </div>

                      <div className="text-[10px] text-slate-600 truncate flex items-center gap-1">
                        <User className="h-3 w-3 text-slate-400" />
                        {apt.leadName}
                      </div>

                      <div className="pt-1 border-t border-blue-100/80 flex items-center justify-between text-[9px]">
                        <span className="font-medium text-blue-800">
                          {apt.status === 'confirmed' ? 'Đã duyệt' : apt.status === 'completed' ? 'Đã xem' : 'Chờ duyệt'}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};

