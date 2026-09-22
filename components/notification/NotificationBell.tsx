'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  CheckCheck,
  Trash2,
  Settings,
  X,
  MapPin,
  MessageSquare,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Check,
  ExternalLink,
  ChevronRight,
  BellOff,
  Sliders,
  Send,
  Volume2
} from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';
import { NotificationItem, NotificationCategory, NotificationPreferences } from '@/types/notification';

const STORAGE_KEY_NOTIFICATIONS = 'hanoi_realty_notifications';
const STORAGE_KEY_PREFS = 'hanoi_realty_notification_prefs';

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Cập nhật Quy hoạch Phân khu H2-2 Cầu Giấy',
    content: 'Đồ án điều chỉnh quy hoạch chi tiết 1/2000 khu đô thị mới Cầu Giấy vừa được UBND Hà Nội phê duyệt.',
    category: 'planning',
    createdAt: '5 phút trước',
    timestamp: Date.now() - 5 * 60 * 1000,
    isRead: false,
    link: '/planning',
    tag: 'Quy hoạch'
  },
  {
    id: 'notif-2',
    title: 'Khách hẹn xem nhà mới',
    content: 'Khách hàng Hoàng Nam gửi yêu cầu hẹn xem căn "Nhà phố phân lô Dịch Vọng 65m²" vào 14:30 ngày mai.',
    category: 'message',
    createdAt: '25 phút trước',
    timestamp: Date.now() - 25 * 60 * 1000,
    isRead: false,
    link: '/dashboard',
    tag: 'Khách hàng'
  },
  {
    id: 'notif-3',
    title: 'Báo cáo AI Thẩm định hoàn tất',
    content: 'Gemini AI 1.5 Pro đã hoàn tất định giá tự động và rà soát pháp lý cho bất động sản tại Nam Từ Liêm.',
    category: 'ai',
    createdAt: '1 giờ trước',
    timestamp: Date.now() - 60 * 60 * 1000,
    isRead: false,
    link: '/reports',
    tag: 'Thẩm định AI'
  },
  {
    id: 'notif-4',
    title: 'Biến động giá khu vực quan tâm',
    content: 'Chỉ số giá đất ở tại quận Tây Hồ tăng 2.3% so với quý trước, đạt mức trung bình 285 triệu/m².',
    category: 'listing',
    createdAt: '3 giờ trước',
    timestamp: Date.now() - 3 * 3600 * 1000,
    isRead: true,
    link: '/search',
    tag: 'Thị trường'
  },
  {
    id: 'notif-5',
    title: 'Tin đăng BĐS đã duyệt thành công',
    content: 'Tin đăng "Biệt thự Gamuda Yên Sở 220m²" của bạn đã được kiểm duyệt hợp lệ và hiển thị ưu tiên trên bản đồ.',
    category: 'system',
    createdAt: '1 ngày trước',
    timestamp: Date.now() - 24 * 3600 * 1000,
    isRead: true,
    link: '/listings',
    tag: 'Hệ thống'
  }
];

const DEFAULT_PREFS: NotificationPreferences = {
  browserPush: false,
  planningUpdates: true,
  priceAlerts: true,
  inquiriesAndVisits: true,
  aiValuationReady: true,
  weeklyEmailDigest: true
};

export const NotificationBell: React.FC = () => {
  const router = useRouter();
  const { addToast } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'settings'>('list');
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'planning' | 'listings'>('all');
  const [notifications, setNotifications] = useState<NotificationItem[]>(DEFAULT_NOTIFICATIONS);
  const [preferences, setPreferences] = useState<NotificationPreferences>(DEFAULT_PREFS);
  const [browserPermission, setBrowserPermission] = useState<NotificationPermission>('default');
  const containerRef = useRef<HTMLDivElement>(null);

  // Load from LocalStorage
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const savedNotifs = localStorage.getItem(STORAGE_KEY_NOTIFICATIONS);
        if (savedNotifs) {
          setNotifications(JSON.parse(savedNotifs));
        }

        const savedPrefs = localStorage.getItem(STORAGE_KEY_PREFS);
        if (savedPrefs) {
          setPreferences(JSON.parse(savedPrefs));
        }

        if ('Notification' in window) {
          setBrowserPermission(Notification.permission);
        }
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  // Save to LocalStorage
  const saveNotifications = (newNotifs: NotificationItem[]) => {
    setNotifications(newNotifs);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY_NOTIFICATIONS, JSON.stringify(newNotifs));
      }
    } catch {
      // Ignore
    }
  };

  const savePreferences = (newPrefs: NotificationPreferences) => {
    setPreferences(newPrefs);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY_PREFS, JSON.stringify(newPrefs));
      }
    } catch {
      // Ignore
    }
  };

  // Close on outside click or ESC
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('touchstart', handleOutsideClick);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Audio Chime using Web Audio API
  const playChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.08); // A5
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {
      // Silent fallback
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Filtered Notifications
  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === 'unread') return !n.isRead;
    if (activeFilter === 'planning') return n.category === 'planning';
    if (activeFilter === 'listings') return ['listing', 'message', 'ai'].includes(n.category);
    return true;
  });

  // Mark single as read
  const handleMarkAsRead = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const updated = notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n));
    saveNotifications(updated);
  };

  // Toggle read status
  const handleToggleRead = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const updated = notifications.map((n) => (n.id === id ? { ...n, isRead: !n.isRead } : n));
    saveNotifications(updated);
  };

  // Mark all as read
  const handleMarkAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, isRead: true }));
    saveNotifications(updated);
    addToast('Đã đánh dấu tất cả thông báo là đã đọc', 'info');
  };

  // Delete notification
  const handleDeleteNotification = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const updated = notifications.filter((n) => n.id !== id);
    saveNotifications(updated);
    addToast('Đã xoá thông báo', 'info');
  };

  // Clear all notifications
  const handleClearAll = () => {
    saveNotifications([]);
    addToast('Đã xoá toàn bộ danh sách thông báo', 'info');
  };

  // Click on a notification item
  const handleItemClick = (notif: NotificationItem) => {
    handleMarkAsRead(notif.id);
    setIsOpen(false);
    if (notif.link) {
      router.push(notif.link);
    }
  };

  // Request browser push notification permission
  const handleRequestBrowserPermission = async () => {
    if (!('Notification' in window)) {
      addToast('Trình duyệt của bạn chưa hỗ trợ thông báo Web Push', 'warning');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setBrowserPermission(permission);
      if (permission === 'granted') {
        savePreferences({ ...preferences, browserPush: true });
        addToast('🎉 Đã bật thông báo trình duyệt thành công!', 'success');
        new Notification('HaNoi Realty PropTech', {
          body: 'Bạn đã kích hoạt thành công thông báo thời gian thực về Quy hoạch & BĐS Hà Nội!',
          icon: '/favicon.ico'
        });
      } else {
        savePreferences({ ...preferences, browserPush: false });
        addToast('Quyền nhận thông báo trên trình duyệt đã bị từ chối', 'warning');
      }
    } catch {
      addToast('Không thể kích hoạt quyền thông báo', 'error');
    }
  };

  // Simulate receiving a demo real-time notification
  const handleSimulateDemoNotification = () => {
    playChime();

    const sampleNotifications: Omit<NotificationItem, 'id' | 'createdAt' | 'timestamp' | 'isRead'>[] = [
      {
        title: 'Bản đồ quy hoạch Nam Từ Liêm vừa cập nhật',
        content: 'Tuyến đường kết nối Lê Quang Đạo kéo dài đến Vành Đai 3.5 đã có dữ liệu toạ độ quy hoạch chi tiết.',
        category: 'planning',
        link: '/planning',
        tag: 'Quy hoạch'
      },
      {
        title: 'Khách hàng quan tâm BĐS Cầu Giấy',
        content: 'Có khách hàng vừa lưu tin đăng của bạn và để lại số điện thoại liên hệ qua Zalo.',
        category: 'message',
        link: '/dashboard',
        tag: 'Khách hàng'
      },
      {
        title: 'AI cảnh báo giá: Đất phân lô Đống Đa',
        content: 'Biến động giá tăng 1.8% trong tuần qua dựa trên 45 giao dịch thực tế đã công chứng.',
        category: 'ai',
        link: '/reports',
        tag: 'Thẩm định AI'
      }
    ];

    const randomTemplate = sampleNotifications[Math.floor(Math.random() * sampleNotifications.length)];
    const newNotif: NotificationItem = {
      ...randomTemplate,
      id: `notif-${Date.now()}`,
      createdAt: 'Vừa xong',
      timestamp: Date.now(),
      isRead: false
    };

    saveNotifications([newNotif, ...notifications]);
    addToast(`🔔 Thông báo mới: ${newNotif.title}`, 'info');

    // Show native notification if permission granted
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(newNotif.title, {
          body: newNotif.content,
          icon: '/favicon.ico'
        });
      } catch {
        // Ignore native error
      }
    }

    // Switch back to list view to highlight it
    setViewMode('list');
    setActiveFilter('all');
  };

  // Helper for Category Icon & Styling
  const getCategoryDetails = (category: NotificationCategory) => {
    switch (category) {
      case 'planning':
        return {
          icon: MapPin,
          label: 'Quy hoạch',
          badgeClass: 'bg-blue-500/15 text-blue-400 border border-blue-500/30',
          iconBg: 'bg-blue-500/20 text-blue-400'
        };
      case 'message':
        return {
          icon: MessageSquare,
          label: 'Khách hàng',
          badgeClass: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
          iconBg: 'bg-emerald-500/20 text-emerald-400'
        };
      case 'ai':
        return {
          icon: Sparkles,
          label: 'AI Gemini',
          badgeClass: 'bg-purple-500/15 text-purple-400 border border-purple-500/30',
          iconBg: 'bg-purple-500/20 text-purple-400'
        };
      case 'listing':
        return {
          icon: TrendingUp,
          label: 'Thị trường',
          badgeClass: 'bg-orange-500/15 text-orange-400 border border-orange-500/30',
          iconBg: 'bg-orange-500/20 text-orange-400'
        };
      default:
        return {
          icon: ShieldCheck,
          label: 'Hệ thống',
          badgeClass: 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30',
          iconBg: 'bg-cyan-500/20 text-cyan-400'
        };
    }
  };

  return (
    <div className="relative inline-block" ref={containerRef}>
      {/* ── TRIGGER BELL BUTTON ── */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        aria-label="Quản lý và nhận thông báo"
        className={`relative flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200 border cursor-pointer select-none ${
          isOpen
            ? 'bg-accent text-white border-accent shadow-md shadow-accent/25'
            : 'bg-primary-light/60 border-slate-700 text-slate-200 hover:text-white hover:bg-primary-light hover:border-slate-500'
        }`}
        title="Thông báo hệ thống, quy hoạch và BĐS"
      >
        <Bell className="h-4 w-4 transition-transform duration-200" />

        {/* Unread Counter Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-accent px-1 text-[10px] font-extrabold text-white shadow-md shadow-accent/40 ring-2 ring-primary">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}

        {/* Subtle Pulse Ring when unread exists */}
        {unreadCount > 0 && !isOpen && (
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-accent/40 animate-ping pointer-events-none" />
        )}
      </button>

      {/* ── DROPDOWN POPOVER PANEL ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="absolute right-0 top-full mt-2.5 w-[360px] sm:w-[410px] max-w-[calc(100vw-24px)] rounded-2xl border border-slate-700 bg-slate-900 text-slate-100 shadow-2xl z-[9999] overflow-hidden ring-1 ring-white/10"
          >
            {/* Popover Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700/70 bg-slate-950/60">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/20 text-accent">
                  <Bell className="h-3.5 w-3.5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white flex items-center gap-1.5 leading-none">
                    <span>Thông báo</span>
                    {unreadCount > 0 && (
                      <span className="rounded-full bg-accent/20 border border-accent/40 px-1.5 py-0.2 text-[10px] font-extrabold text-accent">
                        {unreadCount} mới
                      </span>
                    )}
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Quy hoạch, BĐS & Thẩm định AI</p>
                </div>
              </div>

              {/* Header Actions */}
              <div className="flex items-center gap-1.5">
                {viewMode === 'list' ? (
                  <>
                    <button
                      type="button"
                      onClick={handleSimulateDemoNotification}
                      className="flex items-center gap-1 rounded-lg bg-accent/20 border border-accent/40 px-2 py-1 text-[10px] font-bold text-accent hover:bg-accent hover:text-white transition-all shadow-xs"
                      title="Bấm để nhận ngay 1 thông báo demo thời gian thực"
                    >
                      <span>⚡ Test nhận tin</span>
                    </button>
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={handleMarkAllAsRead}
                        className="flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                        title="Đánh dấu tất cả là đã đọc"
                      >
                        <CheckCheck className="h-3.5 w-3.5 text-accent" />
                        <span className="hidden sm:inline">Đọc hết</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setViewMode('settings')}
                      className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                      title="Quản lý nhận thông báo"
                    >
                      <Sliders className="h-3.5 w-3.5" />
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setViewMode('list')}
                    className="flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold text-accent hover:bg-accent/10 transition-colors"
                  >
                    <span>Quay lại</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors ml-1"
                  aria-label="Đóng"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* ── VIEW 1: NOTIFICATIONS LIST ── */}
            {viewMode === 'list' ? (
              <>
                {/* Filter Pills */}
                <div className="flex items-center gap-1 px-3 py-2 border-b border-slate-700/60 bg-primary/20 overflow-x-auto text-[11px]">
                  <button
                    type="button"
                    onClick={() => setActiveFilter('all')}
                    className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-all ${
                      activeFilter === 'all'
                        ? 'bg-accent text-white shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    Tất cả ({notifications.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveFilter('unread')}
                    className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-all ${
                      activeFilter === 'unread'
                        ? 'bg-accent text-white shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    Chưa đọc ({unreadCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveFilter('planning')}
                    className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-all ${
                      activeFilter === 'planning'
                        ? 'bg-accent text-white shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    🗺️ Quy hoạch
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveFilter('listings')}
                    className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-all ${
                      activeFilter === 'listings'
                        ? 'bg-accent text-white shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    🏡 BĐS & Tin
                  </button>
                </div>

                {/* Notifications Scroll Container */}
                <div className="max-h-[350px] sm:max-h-[380px] overflow-y-auto divide-y divide-slate-700/50">
                  {filteredNotifications.length > 0 ? (
                    filteredNotifications.map((item) => {
                      const details = getCategoryDetails(item.category);
                      const Icon = details.icon;

                      return (
                        <div
                          key={item.id}
                          onClick={() => handleItemClick(item)}
                          className={`group relative flex items-start gap-3 p-3.5 transition-colors cursor-pointer ${
                            item.isRead
                              ? 'hover:bg-slate-800/40 text-slate-300'
                              : 'bg-primary-light/30 hover:bg-primary-light/50 text-white'
                          }`}
                        >
                          {/* Unread Glowing Dot */}
                          {!item.isRead && (
                            <span className="absolute left-1.5 top-5 h-2 w-2 rounded-full bg-accent ring-2 ring-accent/30" />
                          )}

                          {/* Category Icon */}
                          <div
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${details.iconBg} mt-0.5 border border-white/5 shadow-xs`}
                          >
                            <Icon className="h-4 w-4" />
                          </div>

                          {/* Text Content */}
                          <div className="flex-1 min-w-0 pr-1">
                            <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                              <span
                                className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${details.badgeClass}`}
                              >
                                {item.tag || details.label}
                              </span>
                              <span className="text-[10px] text-slate-400 font-normal">
                                {item.createdAt}
                              </span>
                            </div>

                            <h4
                              className={`text-xs font-semibold leading-snug ${
                                item.isRead ? 'text-slate-200' : 'text-white font-bold'
                              }`}
                            >
                              {item.title}
                            </h4>

                            <p className="text-[11px] text-slate-300 line-clamp-2 mt-1 leading-relaxed">
                              {item.content}
                            </p>

                            {/* Quick Link Hint */}
                            {item.link && (
                              <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-accent opacity-90 group-hover:opacity-100 transition-opacity">
                                <span>Xem chi tiết</span>
                                <ChevronRight className="h-3 w-3" />
                              </div>
                            )}
                          </div>

                          {/* Quick Actions (Appear on Hover) */}
                          <div className="shrink-0 flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity self-start">
                            <button
                              type="button"
                              onClick={(e) => handleToggleRead(item.id, e)}
                              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                              title={item.isRead ? 'Đánh dấu chưa đọc' : 'Đánh dấu đã đọc'}
                            >
                              <Check className={`h-3.5 w-3.5 ${item.isRead ? 'text-slate-500' : 'text-accent'}`} />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => handleDeleteNotification(item.id, e)}
                              className="p-1 rounded-md text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                              title="Xoá thông báo"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    /* Empty State */
                    <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800/80 text-slate-500 mb-3 border border-slate-700">
                        <BellOff className="h-6 w-6" />
                      </div>
                      <p className="text-xs font-bold text-slate-200">Không có thông báo nào</p>
                      <p className="text-[11px] text-slate-400 max-w-[220px] mt-1">
                        {activeFilter === 'unread'
                          ? 'Bạn đã đọc hết tất cả thông báo!'
                          : 'Các cập nhật quy hoạch và BĐS sẽ xuất hiện tại đây.'}
                      </p>
                      <button
                        type="button"
                        onClick={handleSimulateDemoNotification}
                        className="mt-3.5 flex items-center gap-1.5 rounded-lg bg-accent/20 border border-accent/40 px-3 py-1.5 text-[11px] font-bold text-accent hover:bg-accent hover:text-white transition-all"
                      >
                        <Volume2 className="h-3.5 w-3.5" />
                        <span>Gửi thử thông báo demo</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Popover Footer */}
                <div className="flex items-center justify-between px-3.5 py-2.5 bg-primary/70 border-t border-slate-700/70 text-[11px]">
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      router.push('/dashboard');
                    }}
                    className="flex items-center gap-1 font-semibold text-accent hover:text-accent-hover transition-colors"
                  >
                    <span>Xem bảng điều khiển</span>
                    <ExternalLink className="h-3 w-3" />
                  </button>

                  {notifications.length > 0 && (
                    <button
                      type="button"
                      onClick={handleClearAll}
                      className="text-slate-400 hover:text-rose-400 transition-colors font-medium text-[10px]"
                    >
                      Xoá tất cả
                    </button>
                  )}
                </div>
              </>
            ) : (
              /* ── VIEW 2: SETTINGS & PREFERENCES ("Quản lý nhận thông báo") ── */
              <div className="p-4 space-y-4 max-h-[420px] overflow-y-auto">
                <div>
                  <h4 className="text-xs font-bold text-white">Quản lý nhận thông báo</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Tuỳ chỉnh các kênh và chủ đề thông báo bạn muốn nhận trên nền tảng.
                  </p>
                </div>

                {/* Web Push Notification Banner */}
                <div className="rounded-xl bg-gradient-to-r from-orange-500/15 to-primary-light/40 border border-orange-500/30 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>🔔 Thông báo đẩy trình duyệt (Web Push)</span>
                      </p>
                      <p className="text-[10px] text-slate-300 mt-1">
                        Nhận tin tức quy hoạch và biến động giá ngay lập tức cả khi đóng website.
                      </p>
                    </div>
                  </div>
                  <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-white/10">
                    <span className="text-[10px] font-medium text-slate-300">
                      Trạng thái: <strong className="text-accent">{browserPermission === 'granted' ? 'Đã cấp quyền' : 'Chưa bật'}</strong>
                    </span>
                    {browserPermission !== 'granted' ? (
                      <button
                        type="button"
                        onClick={handleRequestBrowserPermission}
                        className="rounded-lg bg-accent px-2.5 py-1 text-[11px] font-bold text-white hover:bg-accent-hover transition-colors shadow-sm"
                      >
                        Bật thông báo
                      </button>
                    ) : (
                      <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                        <Check className="h-3 w-3" /> Đang hoạt động
                      </span>
                    )}
                  </div>
                </div>

                {/* Notification Topic Toggles */}
                <div className="space-y-2 text-xs">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Chủ đề nhận thông báo
                  </p>

                  {/* Toggle 1: Quy hoạch */}
                  <label className="flex items-center justify-between p-2 rounded-xl bg-slate-800/40 border border-slate-700/60 cursor-pointer hover:bg-slate-800/70 transition-colors">
                    <div>
                      <span className="font-semibold text-slate-200 block text-xs">🗺️ Cập nhật Quy hoạch mới</span>
                      <span className="text-[10px] text-slate-400">Đồ án phân khu 1/2000 & 1/500 Hà Nội</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.planningUpdates}
                      onChange={(e) =>
                        savePreferences({ ...preferences, planningUpdates: e.target.checked })
                      }
                      className="h-4 w-4 rounded accent-orange-500 cursor-pointer"
                    />
                  </label>

                  {/* Toggle 2: Biến động giá */}
                  <label className="flex items-center justify-between p-2 rounded-xl bg-slate-800/40 border border-slate-700/60 cursor-pointer hover:bg-slate-800/70 transition-colors">
                    <div>
                      <span className="font-semibold text-slate-200 block text-xs">📈 Cảnh báo Biến động giá BĐS</span>
                      <span className="text-[10px] text-slate-400">Khi giá khu vực theo dõi thay đổi</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.priceAlerts}
                      onChange={(e) =>
                        savePreferences({ ...preferences, priceAlerts: e.target.checked })
                      }
                      className="h-4 w-4 rounded accent-orange-500 cursor-pointer"
                    />
                  </label>

                  {/* Toggle 3: Khách hàng */}
                  <label className="flex items-center justify-between p-2 rounded-xl bg-slate-800/40 border border-slate-700/60 cursor-pointer hover:bg-slate-800/70 transition-colors">
                    <div>
                      <span className="font-semibold text-slate-200 block text-xs">💬 Khách hỏi mua & Hẹn xem nhà</span>
                      <span className="text-[10px] text-slate-400">Thông báo từ khách quan tâm tin đăng</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.inquiriesAndVisits}
                      onChange={(e) =>
                        savePreferences({ ...preferences, inquiriesAndVisits: e.target.checked })
                      }
                      className="h-4 w-4 rounded accent-orange-500 cursor-pointer"
                    />
                  </label>

                  {/* Toggle 4: AI Định giá */}
                  <label className="flex items-center justify-between p-2 rounded-xl bg-slate-800/40 border border-slate-700/60 cursor-pointer hover:bg-slate-800/70 transition-colors">
                    <div>
                      <span className="font-semibold text-slate-200 block text-xs">🤖 Báo cáo Định giá AI</span>
                      <span className="text-[10px] text-slate-400">Thông báo khi thẩm định AI hoàn thành</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.aiValuationReady}
                      onChange={(e) =>
                        savePreferences({ ...preferences, aiValuationReady: e.target.checked })
                      }
                      className="h-4 w-4 rounded accent-orange-500 cursor-pointer"
                    />
                  </label>

                  {/* Toggle 5: Email Digest */}
                  <label className="flex items-center justify-between p-2 rounded-xl bg-slate-800/40 border border-slate-700/60 cursor-pointer hover:bg-slate-800/70 transition-colors">
                    <div>
                      <span className="font-semibold text-slate-200 block text-xs">📧 Email báo cáo tuần</span>
                      <span className="text-[10px] text-slate-400">Bản tin thị trường gửi sáng thứ Hai</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.weeklyEmailDigest}
                      onChange={(e) =>
                        savePreferences({ ...preferences, weeklyEmailDigest: e.target.checked })
                      }
                      className="h-4 w-4 rounded accent-orange-500 cursor-pointer"
                    />
                  </label>
                </div>

                {/* Simulate / Test Button */}
                <div className="pt-2 border-t border-slate-700/70 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={handleSimulateDemoNotification}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-accent px-3 py-2 text-xs font-bold text-white hover:bg-accent-hover transition-colors shadow-md shadow-accent/25"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>⚡ Gửi thử 1 thông báo demo ngay</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setViewMode('list')}
                    className="w-full rounded-xl bg-slate-800 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                  >
                    Quay lại danh sách
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
