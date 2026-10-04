'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, Palette, X, Layers } from 'lucide-react';
import { PLANNING_STANDARD_SYMBOLS } from '@/lib/planning/hanoi-planning-db';

export const PlanningLegend: React.FC = () => {
  const [showLegend, setShowLegend] = useState(false);

  const standardZones = Object.values(PLANNING_STANDARD_SYMBOLS);

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
            className="absolute bottom-12 left-0 mb-1 w-80 max-h-[75vh] flex flex-col rounded-2xl border border-slate-700/60 bg-slate-900/95 p-3.5 text-white shadow-2xl backdrop-blur-xl"
          >
            <div className="flex items-center justify-between border-b border-slate-700/70 pb-2 mb-2">
              <div className="flex items-center gap-2">
                <Palette className="h-4 w-4 text-orange-400 shrink-0" />
                <span className="text-xs font-extrabold tracking-tight">
                  Ký hiệu màu quy hoạch (QCVN 01:2021)
                </span>
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

            <div className="space-y-1.5 overflow-y-auto pr-1 text-[11px] max-h-[50vh]">
              {standardZones.map((zone) => (
                <div
                  key={zone.code}
                  className="flex items-start justify-between gap-2 p-1 rounded-lg hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="h-3 w-3 rounded-xs shrink-0 shadow-sm border border-white/20"
                      style={{ backgroundColor: zone.color }}
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-black text-amber-400 text-[10px]">
                          {zone.code}
                        </span>
                        <span className="text-slate-200 font-semibold truncate text-[11px]">
                          {zone.name}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 line-clamp-1">{zone.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
              <div className="flex items-center gap-1">
                <Info className="h-3 w-3 shrink-0 text-orange-400" />
                <span>Viện QHXD Hà Nội</span>
              </div>
              <span className="font-mono text-[9px] text-slate-500">WGS84 PostGIS</span>
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
            ? 'bg-orange-600 text-white border-orange-400 ring-2 ring-orange-400/40'
            : 'bg-slate-900/90 text-slate-200 border-slate-700 hover:text-white hover:border-slate-500'
        }`}
      >
        <Palette className="h-4 w-4" />
        {!showLegend && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-slate-900 p-0.5 shadow-xs">
            <span className="h-full w-full rounded-full bg-gradient-to-tr from-orange-500 via-amber-500 to-purple-500" />
          </span>
        )}
      </motion.button>
    </motion.div>
  );
};
