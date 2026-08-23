'use client';

import React, { useState, useEffect } from 'react';

interface PaymentTimerProps {
  initialSeconds?: number;
  onExpire?: () => void;
}

export const PaymentTimer: React.FC<PaymentTimerProps> = ({
  initialSeconds = 15 * 60, // 15 minutes
  onExpire,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  useEffect(() => {
    if (secondsLeft <= 0) {
      onExpire?.();
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft, onExpire]);

  const minutes = Math.floor(secondsLeft / 60);
  const remainingSeconds = secondsLeft % 60;
  const progressPercent = (secondsLeft / initialSeconds) * 100;

  // Color transitions
  const getColorClass = () => {
    if (secondsLeft < 60) return 'text-rose-500 stroke-rose-500';
    if (secondsLeft < 5 * 60) return 'text-amber-500 stroke-amber-500';
    return 'text-emerald-500 stroke-emerald-500';
  };

  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-4 py-2 rounded-2xl shadow-2xs">
      <div className="relative w-12 h-12 flex items-center justify-center">
        <svg className="w-12 h-12 -rotate-90 transform" viewBox="0 0 56 56">
          <circle
            cx="28"
            cy="28"
            r={radius}
            className="stroke-slate-200"
            strokeWidth="4"
            fill="transparent"
          />
          <circle
            cx="28"
            cy="28"
            r={radius}
            className={`${getColorClass()} transition-all duration-1000 ease-linear`}
            strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>
        <span className={`absolute text-[11px] font-black ${getColorClass()}`}>
          {minutes}:{remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds}
        </span>
      </div>

      <div className="text-left">
        <p className="text-xs font-bold text-navy">Thời gian hoàn tất giao dịch</p>
        <p className="text-[11px] text-slate-400">Đơn hàng tự động hết hạn sau 15 phút</p>
      </div>
    </div>
  );
};
