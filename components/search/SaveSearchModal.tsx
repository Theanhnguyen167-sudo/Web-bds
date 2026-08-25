'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchFilters } from '@/lib/search/filterListings';
import { Bell, X, Check, Bookmark } from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';

interface SaveSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: SearchFilters;
  activeCount: number;
}

export const SaveSearchModal: React.FC<SaveSearchModalProps> = ({
  isOpen,
  onClose,
  filters,
  activeCount,
}) => {
  const { user, addToast } = useApp();
  const [searchName, setSearchName] = useState(
    filters.district
      ? `BĐS Quận ${filters.district}`
      : filters.type !== 'all'
      ? `Tìm kiếm ${filters.type}`
      : 'Tìm kiếm BĐS Hà Nội'
  );
  const [frequency, setFrequency] = useState<'instant' | 'daily' | 'weekly'>('daily');
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      addToast('Vui lòng đăng nhập để lưu tìm kiếm', 'warning');
      return;
    }
    setIsSaved(true);
    addToast(`Đã lưu tìm kiếm "${searchName}" thành công!`, 'success');
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-100 dark:border-slate-800 max-w-sm w-full space-y-4 relative"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 rounded-full p-1 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-orange-100 dark:bg-orange-950/40 text-orange-500 flex items-center justify-center">
            <Bell className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-navy dark:text-white">
              Lưu bộ lọc tìm kiếm
            </h3>
            <p className="text-xs text-slate-400">
              Nhận thông báo khi có bất động sản mới phù hợp
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-3.5 text-xs">
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Tên bộ tìm kiếm:
            </label>
            <input
              type="text"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="VD: Nhà phố Đống Đa 3-5 tỷ..."
              required
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-orange-500 font-semibold"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
              Tần suất nhận thông báo:
            </label>
            <div className="grid grid-cols-3 gap-1.5 font-semibold text-center">
              {[
                { id: 'instant', label: 'Tức thì' },
                { id: 'daily', label: 'Hàng ngày' },
                { id: 'weekly', label: 'Hàng tuần' },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFrequency(f.id as any)}
                  className={`py-2 rounded-xl border transition-all ${
                    frequency === f.id
                      ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/30 text-orange-600 font-bold'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSaved}
              className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-1.5"
            >
              {isSaved ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Đã lưu thành công!</span>
                </>
              ) : (
                <>
                  <Bookmark className="h-4 w-4" />
                  <span>Lưu tìm kiếm</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
