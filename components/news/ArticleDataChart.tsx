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
  Cell,
  Legend,
} from 'recharts';
import { BarChart3, AlertCircle, Info } from 'lucide-react';

interface ArticleDataChartProps {
  type: 'inventory_q3_2026' | 'transactions_distribution' | string;
}

export const ArticleDataChart: React.FC<ArticleDataChartProps> = ({ type }) => {
  if (type === 'inventory_q3_2026') {
    const data = [
      {
        name: 'Đất nền',
        count: 19542,
        growth: '+75,3%',
        share: '37,6%',
        fill: '#ea580c', // orange-600
        desc: 'Tồn đọng sau các đợt sốt đấu giá vùng ven',
      },
      {
        name: 'Nhà ở riêng lẻ',
        count: 17089,
        growth: '+11,6%',
        share: '32,9%',
        fill: '#2563eb', // blue-600
        desc: 'Liền kề, biệt thự giá cao thiếu tiện ích kết nối',
      },
      {
        name: 'Chung cư',
        count: 15319,
        growth: '+19,5%',
        share: '29,5%',
        fill: '#4f46e5', // indigo-600
        desc: 'Chủ yếu ở phân khúc cao cấp, thiếu căn hộ vừa túi tiền',
      },
    ];

    const CustomTooltip = ({ active, payload }: any) => {
      if (active && payload && payload.length) {
        const item = payload[0].payload;
        return (
          <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs space-y-1 z-50">
            <p className="font-bold text-sm text-orange-400">{item.name}</p>
            <p className="font-medium">
              Số lượng tồn kho: <strong className="text-white font-bold">{item.count.toLocaleString('vi-VN')}</strong> căn/nền
            </p>
            <p className="text-slate-300">
              Tỷ trọng cơ cấu: <strong className="text-emerald-400 font-bold">{item.share}</strong>
            </p>
            <p className="text-slate-300">
              Biến động so với Q2: <strong className="text-amber-300 font-bold">{item.growth}</strong>
            </p>
            <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-800 italic">
              {item.desc}
            </p>
          </div>
        );
      }
      return null;
    };

    return (
      <div className="my-8 rounded-2xl border border-slate-200/90 bg-gradient-to-b from-white to-slate-50/50 p-4 sm:p-6 shadow-sm space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
              <BarChart3 className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-slate-900">
                Biểu đồ: Cơ cấu tồn kho bất động sản Quý III/2026 theo phân khúc
              </h4>
              <p className="text-[11px] text-slate-500">
                Tổng hợp từ báo cáo chính thức của 27/34 địa phương gửi Ban Chỉ đạo Trung ương & Bộ Xây dựng
              </p>
            </div>
          </div>
          <span className="self-start sm:self-center text-[10px] font-bold text-orange-700 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200 shrink-0">
            Tổng cộng: 51.950 căn/nền (+32,2%)
          </span>
        </div>

        {/* Biểu đồ thanh tương tác */}
        <div className="h-64 sm:h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 20, left: 0, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis
                dataKey="name"
                tickLine={false}
                stroke="#64748b"
                fontSize={12}
                fontWeight={600}
              />
              <YAxis
                tickLine={false}
                stroke="#64748b"
                fontSize={11}
                tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="count"
                name="Lượng tồn kho (căn/nền)"
                radius={[6, 6, 0, 0]}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Chú giải phân bổ nhanh */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
          {data.map((item, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">{item.name}</span>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                  {item.share}
                </span>
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-base font-extrabold text-slate-900">
                  {item.count.toLocaleString('vi-VN')}
                </span>
                <span className="text-[11px] font-medium text-orange-600">
                  Tăng {item.growth}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Ghi chú phương pháp luận bắt buộc */}
        <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/70 text-[11px] text-amber-900 flex items-start gap-2">
          <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <strong className="font-bold block">Lưu ý phương pháp luận và nguồn gốc dữ liệu:</strong>
            <p className="leading-relaxed">
              Số liệu trên được tổng hợp từ báo cáo của <strong>27/34 địa phương</strong> có văn bản gửi về Bộ Xây dựng trước ngày 13/10/2026. Tuyệt đối không suy diễn thành số liệu tổng thể của 34 tỉnh/thành phố trên cả nước. Đồng thời, đây là lượng tồn kho do <strong>chủ đầu tư tại các dự án báo cáo</strong> (chưa bao gồm hàng dở dang chưa hoàn thiện pháp lý và các giao dịch thứ cấp của nhà đầu tư cá nhân).
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

