'use client';

import React, { useState } from 'react';
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

const data30Days = [
  { date: '01/08', actual: 1.2, target: 1.0 },
  { date: '04/08', actual: 2.1, target: 1.8 },
  { date: '08/08', actual: 1.8, target: 2.0 },
  { date: '12/08', actual: 3.4, target: 2.5 },
  { date: '16/08', actual: 2.8, target: 2.7 },
  { date: '20/08', actual: 4.2, target: 3.2 },
  { date: '24/08', actual: 3.9, target: 3.5 },
  { date: '28/08', actual: 5.1, target: 4.0 },
  { date: '31/08', actual: 4.8, target: 4.2 },
];

export const RevenueChart: React.FC = () => {
  const [period, setPeriod] = useState<'7d' | '30d' | '3m' | '1y'>('30d');

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-bold text-sm text-navy">Doanh thu 30 ngày gần nhất</h3>
          <p className="text-xs text-slate-400">Đơn vị tính: Triệu VNĐ</p>
        </div>

        {/* Period Selector Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          {[
            { id: '7d', label: '7 ngày' },
            { id: '30d', label: '30 ngày' },
            { id: '3m', label: '3 tháng' },
            { id: '1y', label: '1 năm' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setPeriod(tab.id as any)}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                period === tab.id
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-slate-600 hover:text-navy'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data30Days} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#94a3b8" stopOpacity={0.0} />
              </linearGradient>
            </defs>
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
              formatter={(val: any) => [`${val} Triệu VNĐ`, '']}
            />
            <Legend verticalAlign="top" height={36} iconType="circle" />
            <Area
              type="monotone"
              name="Doanh thu thực"
              dataKey="actual"
              stroke="#f97316"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorActual)"
            />
            <Area
              type="monotone"
              name="Mục tiêu (Target)"
              dataKey="target"
              stroke="#94a3b8"
              strokeWidth={2}
              strokeDasharray="4 4"
              fillOpacity={1}
              fill="url(#colorTarget)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
