'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/lib/context/AppContext';
import { CheckCircle2, AlertCircle, Info, X, XCircle } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -20, scale: 0.95, x: 20 }}
            animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
            exit={{ opacity: 0, y: -20, scale: 0.9, x: 20 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="pointer-events-auto flex items-center justify-between gap-3 rounded-xl border border-border/80 bg-white/95 p-3.5 shadow-lg backdrop-blur-md text-sm text-text-primary"
          >
            <div className="flex items-center gap-2.5">
              {toast.type === 'success' && (
                <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
              )}
              {toast.type === 'warning' && (
                <AlertCircle className="h-5 w-5 text-warning shrink-0" />
              )}
              {toast.type === 'error' && (
                <XCircle className="h-5 w-5 text-danger shrink-0" />
              )}
              {toast.type === 'info' && (
                <Info className="h-5 w-5 text-accent shrink-0" />
              )}
              <span className="font-medium text-xs leading-snug">{toast.message}</span>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-text-secondary hover:text-text-primary p-1 rounded-md transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
