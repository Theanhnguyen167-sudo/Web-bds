'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Info } from 'lucide-react';

export const PlanningLegend: React.FC = () => {
  const zones = [
    { name: 'Đất ở đô thị (ODT)', color: '#3b82f6', desc: 'Quy hoạch nhà ở & chỉnh trang' },
    { name: 'Thương mại dịch vụ (TMD)', color: '#ef4444', desc: 'TTTM, văn phòng, shophouse' },
    { name: 'Cây xanh & Công viên (CX)', color: '#10b981', desc: 'Không gian sinh thái công cộng' },
    { name: 'Hạ tầng giao thông / Metro', color: '#f59e0b', desc: 'Tuyến đường sắt & trục mở rộng' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      className="absolute bottom-6 left-6 z-30 rounded-2xl border border-slate-700/60 bg-primary/95 p-3.5 text-white shadow-2xl backdrop-blur-xl max-w-xs"
    >
      <div className="flex items-center justify-between border-b border-slate-700 pb-2 mb-2">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-emerald-400" />
          <span className="text-xs font-bold tracking-tight">Quy hoạch Hà Nội 2030 - 2045</span>
        </div>
        <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
      </div>

      <div className="space-y-1.5 text-[11px]">
        {zones.map((zone) => (
          <div key={zone.name} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-sm shadow-sm shrink-0"
                style={{ backgroundColor: zone.color }}
              />
              <span className="text-slate-200 font-medium">{zone.name}</span>
            </div>
            <span className="text-[10px] text-slate-400 truncate max-w-[110px]">{zone.desc}</span>
          </div>
        ))}
      </div>

      <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center gap-1.5 text-[10px] text-slate-400">
        <Info className="h-3 w-3 shrink-0 text-accent" />
        <span>Nguồn: Viện Quy hoạch Xây dựng Hà Nội</span>
      </div>
    </motion.div>
  );
};
