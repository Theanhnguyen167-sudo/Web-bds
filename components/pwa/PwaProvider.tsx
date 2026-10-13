'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Share, PlusSquare, Sparkles, Wifi, WifiOff } from 'lucide-react';
import Image from 'next/image';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export function PwaProvider({ children }: { children: React.ReactNode }) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [showOnlineToast, setShowOnlineToast] = useState(false);

  // 1. Service Worker Registration & Online/Offline Events
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Online / Offline tracking
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      setShowOnlineToast(true);
      setTimeout(() => setShowOnlineToast(false), 3500);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Register Service Worker in production or supporting browser
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js', { scope: '/' })
          .then((registration) => {
            // Check for updates
            registration.onupdatefound = () => {
              const installingWorker = registration.installing;
              if (installingWorker) {
                installingWorker.onstatechange = () => {
                  if (
                    installingWorker.state === 'installed' &&
                    navigator.serviceWorker.controller
                  ) {
                    // New content is available; can show toast if desired
                  }
                };
              }
            };
          })
          .catch((err) => {
            console.warn('[PWA] Service worker registration failed:', err);
          });
      });
    }

    // Check if already installed / standalone
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;

    if (isStandalone) {
      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }

    // Check if user dismissed prompt recently
    const dismissedTime = localStorage.getItem('pwa_prompt_dismissed');
    if (dismissedTime && Date.now() - parseInt(dismissedTime, 10) < 3 * 24 * 60 * 60 * 1000) {
      // Dismissed within last 3 days
      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }

    // Check for iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent) && !(window as unknown as { MSStream?: unknown }).MSStream;
    setIsIOS(isIosDevice);

    if (isIosDevice) {
      // Delay showing prompt slightly for better UX
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 5000);
      return () => clearTimeout(timer);
    }

    // Standard Chromium / Android beforeinstallprompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Wait 3s after page load before displaying prompt
      setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Custom event to manually open install prompt (from Navbar or settings)
    const handleManualOpen = () => {
      setShowPrompt(true);
      if (isIosDevice) {
        setShowIOSGuide(true);
      }
    };
    window.addEventListener('open_pwa_install', handleManualOpen);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('open_pwa_install', handleManualOpen);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSGuide(true);
      return;
    }

    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setShowPrompt(false);
      }
    } catch (err) {
      console.error('[PWA] Error prompting install:', err);
    } finally {
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setShowIOSGuide(false);
    try {
      localStorage.setItem('pwa_prompt_dismissed', Date.now().toString());
    } catch {
      // ignore localStorage errors
    }
  };

  return (
    <>
      {children}

      {/* Online / Offline Floating Notification */}
      <AnimatePresence>
        {!isOnline && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className="fixed top-3 left-1/2 -translate-x-1/2 z-[9999] px-4 py-2 rounded-full bg-slate-900/95 border border-amber-500/30 text-amber-300 text-xs font-semibold shadow-xl backdrop-blur-md flex items-center gap-2 pointer-events-none"
          >
            <WifiOff className="w-3.5 h-3.5 animate-pulse text-amber-400" />
            <span>Đang ở chế độ ngoại tuyến (Offline) - Đang dùng dữ liệu cache</span>
          </motion.div>
        )}

        {showOnlineToast && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className="fixed top-3 left-1/2 -translate-x-1/2 z-[9999] px-4 py-2 rounded-full bg-slate-900/95 border border-emerald-500/30 text-emerald-300 text-xs font-semibold shadow-xl backdrop-blur-md flex items-center gap-2 pointer-events-none"
          >
            <Wifi className="w-3.5 h-3.5 text-emerald-400" />
            <span>Đã khôi phục kết nối Internet</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PWA Floating Install Banner */}
      <AnimatePresence>
        {showPrompt && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:w-[400px] z-[9990] bg-slate-900/95 dark:bg-slate-950/95 border border-slate-700/80 rounded-2xl p-4 shadow-2xl backdrop-blur-xl text-white select-none ring-1 ring-white/10"
          >
            <div className="flex items-start gap-3">
              {/* App Icon */}
              <div className="relative w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 overflow-hidden shrink-0 flex items-center justify-center shadow-md">
                <Image
                  src="/icons/icon-192.png"
                  alt="HaNoi Realty Icon"
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Text Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <h3 className="font-bold text-sm text-white truncate">HaNoi Realty App</h3>
                  <span className="px-1.5 py-0.2 bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded text-[10px] font-semibold flex items-center gap-0.5">
                    <Sparkles className="w-2.5 h-2.5" /> PWA
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-snug">
                  Cài đặt vào màn hình chính để tra cứu quy hoạch, định vị GPS và xem BĐS mượt mà không cần mở trình duyệt.
                </p>
              </div>

              {/* Close Button */}
              <button
                onClick={handleDismiss}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
                aria-label="Đóng thông báo"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Action Buttons */}
            <div className="mt-3 pt-3 border-t border-slate-800 flex items-center gap-2">
              <button
                onClick={handleInstallClick}
                className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-xs shadow-md shadow-orange-500/20 flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
              >
                <Download className="w-3.5 h-3.5" />
                Cài đặt ngay
              </button>
              <button
                onClick={handleDismiss}
                className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
              >
                Để sau
              </button>
            </div>

            {/* iOS Specific Instructions Modal / Subview */}
            {showIOSGuide && (
              <div className="mt-3 pt-3 border-t border-slate-700/80 text-xs text-slate-300 space-y-2 bg-slate-800/60 p-3 rounded-xl">
                <p className="font-bold text-orange-400 flex items-center gap-1.5">
                  <Share className="w-3.5 h-3.5" /> Hướng dẫn cài đặt trên iOS (Safari):
                </p>
                <ol className="list-decimal list-inside space-y-1 text-slate-300 leading-relaxed text-[11px]">
                  <li>
                    Nhấn vào nút <span className="font-semibold text-white">Chia sẻ</span> (biểu tượng hình vuông có mũi tên trỏ lên) ở thanh dưới cùng Safari.
                  </li>
                  <li>
                    Cuộn xuống và chọn <span className="font-semibold text-white">Thêm vào MH chính</span> (<PlusSquare className="inline w-3 h-3 text-orange-400" /> Add to Home Screen).
                  </li>
                  <li>Nhấn <span className="font-semibold text-white">Thêm</span> ở góc trên bên phải để hoàn tất.</li>
                </ol>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
