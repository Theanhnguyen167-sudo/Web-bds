'use client';

import React from 'react';
import Link from 'next/link';
import { WifiOff, RefreshCw, Home, MapPin, Compass } from 'lucide-react';

export default function OfflinePage() {
  const handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 relative overflow-hidden select-none">
      {/* Background ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-md w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl text-center flex flex-col items-center">
        {/* Animated Icon Circle */}
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-500 shadow-inner">
            <WifiOff className="w-10 h-10 animate-pulse" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate-900 border-2 border-slate-800 flex items-center justify-center text-[10px]">
            ⚡
          </div>
        </div>

        {/* Title & Description */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold mb-3">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
          Chế độ Ngoại Tuyến (Offline)
        </div>

        <h1 className="text-2xl font-black tracking-tight text-white mb-2">
          Mất kết nối Internet
        </h1>

        <p className="text-sm text-slate-400 leading-relaxed mb-6">
          Ứng dụng HaNoi Realty không thể kết nối tới máy chủ lúc này. Tuy nhiên, các trang và bản đồ quy hoạch bạn đã xem trước đó vẫn được lưu trong bộ nhớ máy.
        </p>

        {/* Action Buttons */}
        <div className="w-full space-y-3">
          <button
            onClick={handleReload}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-sm shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <RefreshCw className="w-4 h-4" />
            Thử tải lại kết nối
          </button>

          <Link
            href="/"
            className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700/80 text-slate-200 font-semibold text-sm border border-slate-700 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <Home className="w-4 h-4 text-orange-400" />
            Quay về Trang chủ đã lưu
          </Link>
        </div>

        {/* Quick Tips */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 w-full text-left">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-orange-400" /> Mẹo sử dụng ngoại tuyến
          </h2>
          <ul className="text-xs text-slate-500 space-y-1.5 list-disc list-inside">
            <li>Dữ liệu bản đồ & quy hoạch gần nhất đã được lưu cache.</li>
            <li>Kiểm tra lại kết nối Wifi hoặc dữ liệu 4G/5G trên thiết bị.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
