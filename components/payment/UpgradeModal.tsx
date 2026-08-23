'use client';

import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Check, X, ShieldCheck, Zap } from 'lucide-react';
import { formatCurrencyVND } from '@/lib/utils';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureTitle?: string;
  featureDescription?: string;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({
  isOpen,
  onClose,
  featureTitle = 'Tính năng cao cấp VIP',
  featureDescription = 'Vui lòng nâng cấp gói thành viên để sử dụng tính năng báo cáo AI chuyên sâu và đăng tin nổi bật.',
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative space-y-6"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:bg-slate-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Header */}
          <div className="text-center space-y-2">
            <div className="h-12 w-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto shadow-md">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-black text-navy">{featureTitle}</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {featureDescription}
            </p>
          </div>

          {/* 2 Package Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Basic */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col justify-between space-y-3">
              <div>
                <span className="font-bold text-xs text-navy block">Gói Basic</span>
                <span className="text-lg font-black text-navy">{formatCurrencyVND(299000)}/th</span>
                <ul className="space-y-1 text-[11px] text-slate-600 mt-2">
                  <li className="flex items-center gap-1.5"><Check className="h-3 w-3 text-emerald-500" /> 20 tin đăng BĐS</li>
                  <li className="flex items-center gap-1.5"><Check className="h-3 w-3 text-emerald-500" /> 5 Báo cáo AI/tháng</li>
                </ul>
              </div>
              <Link
                href="/payment/checkout?packageId=basic&billing=monthly"
                onClick={onClose}
                className="w-full py-2 bg-slate-200 hover:bg-slate-300 text-navy font-bold text-xs rounded-xl text-center transition-colors block"
              >
                Chọn Basic
              </Link>
            </div>

            {/* Pro */}
            <div className="p-4 rounded-2xl border-2 border-orange-500 bg-orange-50/50 flex flex-col justify-between space-y-3 relative shadow-md">
              <span className="absolute -top-2.5 right-3 bg-orange-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                Khuyên dùng ⭐
              </span>
              <div>
                <span className="font-bold text-xs text-navy block">Gói Pro</span>
                <span className="text-lg font-black text-orange-600">{formatCurrencyVND(599000)}/th</span>
                <ul className="space-y-1 text-[11px] text-slate-600 mt-2">
                  <li className="flex items-center gap-1.5"><Check className="h-3 w-3 text-emerald-500" /> 50 tin đăng BĐS</li>
                  <li className="flex items-center gap-1.5"><Check className="h-3 w-3 text-emerald-500" /> 30 Báo cáo AI/tháng</li>
                  <li className="flex items-center gap-1.5"><Check className="h-3 w-3 text-emerald-500" /> 10 tin VIP nổi bật</li>
                </ul>
              </div>
              <Link
                href="/payment/checkout?packageId=pro&billing=monthly"
                onClick={onClose}
                className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl text-center shadow-md shadow-orange-500/20 transition-colors block"
              >
                Chọn Pro →
              </Link>
            </div>
          </div>

          <div className="text-center pt-1">
            <button
              onClick={onClose}
              className="text-xs text-slate-400 hover:text-slate-600 font-semibold"
            >
              Để sau
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
