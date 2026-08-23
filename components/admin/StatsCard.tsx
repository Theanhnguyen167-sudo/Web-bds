'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral' | 'urgent';
  icon: React.ReactNode;
  sparklineData?: number[];
  badge?: string;
  onClick?: () => void;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  trend,
  trendDirection = 'up',
  icon,
  sparklineData,
  badge,
  onClick,
}) => {
  return (
    <motion.div
      whileHover={onClick ? { y: -3, transition: { duration: 0.2 } } : {}}
      onClick={onClick}
      className={`bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm transition-all flex flex-col justify-between ${
        onClick ? 'cursor-pointer hover:border-orange-300 hover:shadow-md' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          {title}
        </span>
        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-700">
          {icon}
        </div>
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <span className="text-2xl sm:text-3xl font-black text-navy tracking-tight">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </span>

        {badge && (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-orange-100 text-orange-600 animate-pulse border border-orange-200">
            {badge}
          </span>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        {trend && (
          <div className="flex items-center gap-1">
            {trendDirection === 'up' && (
              <span className="flex items-center gap-0.5 text-emerald-600 font-bold">
                <TrendingUp className="h-3.5 w-3.5" />
                {trend}
              </span>
            )}
            {trendDirection === 'down' && (
              <span className="flex items-center gap-0.5 text-rose-600 font-bold">
                <TrendingDown className="h-3.5 w-3.5" />
                {trend}
              </span>
            )}
            {trendDirection === 'urgent' && (
              <span className="flex items-center gap-0.5 text-orange-600 font-bold">
                <AlertCircle className="h-3.5 w-3.5" />
                {trend}
              </span>
            )}
            {trendDirection === 'neutral' && (
              <span className="text-slate-500 font-medium">{trend}</span>
            )}
          </div>
        )}

        {/* Optional Mini SVG Sparkline */}
        {sparklineData && sparklineData.length > 0 && (
          <div className="w-20 h-6">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 80 24">
              <path
                d={`M ${sparklineData
                  .map((val, idx) => {
                    const x = (idx / (sparklineData.length - 1)) * 80;
                    const max = Math.max(...sparklineData);
                    const min = Math.min(...sparklineData);
                    const y = 22 - ((val - min) / (max - min || 1)) * 18;
                    return `${x},${y}`;
                  })
                  .join(' L ')}`}
                fill="none"
                stroke="#f97316"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
      </div>
    </motion.div>
  );
};
