'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, Palette, X } from 'lucide-react';

export const PlanningLegend: React.FC = () => {
  const [showLegend, setShowLegend] = useState(false);

  const zones = [
    { name: 'Đất ở đô thị (ODT)', color: '#3b82f6', desc: 'Quy hoạch nhà ở & chỉnh trang' },
    { name: 'Thương mại dịch vụ (TMD)', color: '#ef4444', desc: 'TTTM, văn phòng, shophouse' },
    { name: 'Cây xanh & Công viên (CX)', color: '#10b981', desc: 'Không gian sinh thái công cộng' },
    { name: 'Hạ tầng giao thông / Metro', color: '#f59e0b', desc: 'Tuyến đường sắt & trục mở rộng' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className="absolute bottom-6 left-6 z-30"
    >
      <AnimatePresence>
        {showLegend && (
          <motion.div
            key="planning-legend-popover"
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
            className="absolute bottom-12 left-0 mb-1 w-72 rounded-2xl border border-slate-700/60 bg-primary/95 p-3.5 text-white shadow-2xl backdrop-blur-xl"
          >
            <div className="flex items-center justify-between border-b border-slate-700 pb-2 mb-2.5">
              <div className="flex items-center gap-2">
                <Palette className="h-4 w-4 text-emerald-400 shrink-0" />
                <span className="text-xs font-bold tracking-tight">Chú giải màu quy hoạch</span>
              </div>
              <button
                type="button"
                onClick={() => setShowLegend(false)}
                aria-label="Đóng bảng chú giải"
                title="Đóng"
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
              >
                <X className="h-3.5 w-3.5" />
              </button>
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
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setShowLegend((prev) => !prev)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-expanded={showLegend}
        aria-label="Chú giải màu sắc quy hoạch"
        title="Chú giải màu sắc quy hoạch"
        className={`relative flex h-10 w-10 items-center justify-center rounded-2xl border shadow-xl backdrop-blur-md transition-all cursor-pointer ${
          showLegend
            ? 'bg-emerald-600 text-white border-emerald-400 ring-2 ring-emerald-400/40'
            : 'bg-primary/90 text-slate-200 border-slate-700 hover:text-white hover:border-slate-500'
        }`}
      >
        <Palette className="h-4 w-4" />
        {!showLegend && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-slate-900 p-0.5 shadow-xs">
            <span className="h-full w-full rounded-full bg-gradient-to-tr from-emerald-500 via-blue-500 to-amber-500" />
          </span>
        )}
      </motion.button>
    </motion.div>
  );
};
