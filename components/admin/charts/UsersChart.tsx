'use client';

import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from 'recharts';

const packageData = [
  { name: 'Free', value: 8430, color: '#94a3b8' },
  { name: 'Basic', value: 1120, color: '#3b82f6' },
  { name: 'Pro', value: 560, color: '#f97316' },
  { name: 'Agency', value: 137, color: '#eab308' },
];

export const PackageDonutChart: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
      <h3 className="font-bold text-sm text-navy">Doanh thu theo gói dịch vụ</h3>
      <p className="text-xs text-slate-400">Tỷ trọng người dùng theo các hạng thành viên</p>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={packageData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {packageData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderRadius: '12px',
                border: 'none',
                color: '#fff',
                fontSize: '12px',
              }}
              formatter={(val: number, name: string) => [
                `${val.toLocaleString()} người dùng`,
                `Gói ${name}`,
              ]}
            />
            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              iconType="circle"
              formatter={(val: string) => <span className="text-xs text-slate-600 font-semibold">{val}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
