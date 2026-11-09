'use client';

import React, { useState } from 'react';
import { Copy, Check, Home, UserCheck, Key, FileText } from 'lucide-react';

interface CodeBadgeProps {
  code: string;
  label?: string;
  className?: string;
  size?: 'sm' | 'md';
  showLabel?: boolean;
}

export function CodeBadge({
  code,
  label,
  className = '',
  size = 'md',
  showLabel = true,
}: CodeBadgeProps) {
  const [copied, setCopied] = useState(false);

  const prefix = code.split('-')[0]?.toUpperCase();

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  // Icon theo từng loại mã
  const renderIcon = () => {
    switch (prefix) {
      case 'BDS':
        return <Home className={size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5'} />;
      case 'MG':
        return <UserCheck className={size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5'} />;
      case 'CN':
        return <Key className={size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5'} />;
      case 'HD':
        return <FileText className={size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5'} />;
      default:
        return null;
    }
  };

  // Tone màu tương ứng
  const getColorClasses = () => {
    switch (prefix) {
      case 'BDS':
        return 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800';
      case 'MG':
        return 'bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800';
      case 'CN':
        return 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'HD':
        return 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      default:
        return 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 border rounded-lg font-mono font-bold tracking-tight select-all transition-all ${
        size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'
      } ${getColorClasses()} ${className}`}
      title={copied ? 'Đã sao chép mã!' : `Nhấp để sao chép mã ${code}`}
    >
      <span className="opacity-80 flex items-center">{renderIcon()}</span>
      {showLabel && label && <span className="font-sans font-medium text-[10.5px] opacity-75">{label}:</span>}
      <span className="font-extrabold">{code}</span>

      <button
        type="button"
        onClick={handleCopy}
        className="ml-0.5 p-0.5 rounded hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 transition-all text-current cursor-pointer"
        aria-label="Sao chép mã"
      >
        {copied ? (
          <Check className="h-3 w-3 text-emerald-600 animate-in zoom-in-50" />
        ) : (
          <Copy className="h-3 w-3 opacity-60 hover:opacity-100" />
        )}
      </button>
    </span>
  );
}
export default CodeBadge;

