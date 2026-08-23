'use client';

import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';

const listingTrendData = [
  { month: 'T3', house: 220, apartment: 180, land: 90, villa: 35 },
  { month: 'T4', house: 260, apartment: 210, land: 110, villa: 42 },
  { month: 'T5', house: 310, apartment: 250, land: 140, villa: 50 },
  { month: 'T6', house: 340, apartment: 290, land: 160, villa: 58 },
  { month: 'T7', house: 390, apartment: 320, land: 190, villa: 65 },
  { month: 'T8', house: 450, apartment: 380, land: 220, villa: 72 },
];

export const ListingsChart: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
      <div>
        <h3 className="font-bold text-sm text-navy">Tin đăng theo loại hình BĐS</h3>
        <p className="text-xs text-slate-400">Xu hướng phân bổ tin đăng 6 tháng gần nhất</p>
      </div>

      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={listingTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="month" tickLine={false} stroke="#94a3b8" fontSize={11} />
            <YAxis tickLine={false} stroke="#94a3b8" fontSize={11} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderRadius: '12px',
                border: 'none',
                color: '#fff',
                fontSize: '12px',
              }}
            />
            <Legend verticalAlign="top" height={36} iconType="circle" />
            <Bar dataKey="house" name="Nhà phố" fill="#f97316" radius={[4, 4, 0, 0]} />
            <Bar dataKey="apartment" name="Chung cư" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="land" name="Đất nền" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="villa" name="Biệt thự" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
