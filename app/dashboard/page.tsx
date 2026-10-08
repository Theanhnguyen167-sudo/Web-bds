'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { useApp } from '@/lib/context/AppContext';
import { formatCurrencyVND, formatPricePerM2 } from '@/lib/utils';
import {
  LayoutDashboard,
  Home,
  Sparkles,
  Heart,
  HeartCrack,
  Tag,
  Settings,
  PlusCircle,
  Eye,
  Trash2,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Clock,
  CheckCircle2,
  Layers,
  RefreshCw,
  Cpu,
  Key,
  Check,
  MapPin,
  Maximize2,
  Bed,
  Bath,
  Building,
  ArrowRight,
  Search,
  Bell,
  Calendar,
  Phone,
  MessageSquare,
  User,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Filter,
  AlertCircle
} from 'lucide-react';
import { NotificationBell } from '@/components/notification/NotificationBell';

import { TEST_SELLERS_LIST, DemoSeller } from '@/lib/services/listing-service';
import { Pencil } from 'lucide-react';

type TabType = 'listings' | 'appointments' | 'reports' | 'saved' | 'packages' | 'notifications';

const VALID_TABS: TabType[] = ['listings', 'appointments', 'reports', 'saved', 'packages', 'notifications'];

interface MenuItem {
  id: TabType;
  label: string;
  icon: any;
  count?: number;
  badge?: string;
}

interface MenuGroup {
  title: string;
  items: MenuItem[];
}

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabQuery = searchParams.get('tab') as TabType | null;

  const { user, setUser, listings, setListings, savedListingIds, toggleSaveListing, addToast, deleteListing } = useApp();
  const [activeTab, setActiveTab] = useState<TabType>(
    tabQuery && VALID_TABS.includes(tabQuery)
      ? tabQuery
      : 'listings'
  );
  const [unreadNotifCount, setUnreadNotifCount] = useState<number>(3);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [appointmentFilter, setAppointmentFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');
  const [appointmentSearch, setAppointmentSearch] = useState<string>('');
  const [appointmentViewMode, setAppointmentViewMode] = useState<'list' | 'calendar'>('calendar');
  const [selectedScheduleDate, setSelectedScheduleDate] = useState<Date>(new Date());
  const [selectedScheduleListingId, setSelectedScheduleListingId] = useState<string>('all');

  // Sync tab with URL query parameter on load
  useEffect(() => {
    if (tabQuery && VALID_TABS.includes(tabQuery)) {
      setActiveTab(tabQuery);
    }
  }, [tabQuery]);

  // Load and sync appointments for the current user
  useEffect(() => {
    const syncAppointments = () => {
      try {
        const raw = localStorage.getItem('hanoi_realty_appointments');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            setAppointments(parsed);
          }
        }
      } catch {}
    };

    syncAppointments();
    window.addEventListener('hanoi_appointments_updated', syncAppointments);
    window.addEventListener('storage', syncAppointments);
    return () => {
      window.removeEventListener('hanoi_appointments_updated', syncAppointments);
      window.removeEventListener('storage', syncAppointments);
    };
  }, []);

  // Sync unread notification count CHỈ cho tài khoản hiện tại từ localStorage
  useEffect(() => {
    const syncUnreadCount = () => {
      try {
        const raw = localStorage.getItem('hanoi_realty_notifications');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            if (user) {
              const userEmail = user.email?.toLowerCase();
              const myIds = new Set(listings.filter(l => l.ownerId === user.id || l.userId === user.id || (userEmail && l.authorEmail?.toLowerCase() === userEmail)).map(l => l.id));
              const count = parsed.filter(
                (n: any) =>
                  !n.isRead &&
                  (n.recipientUserId === user.id ||
                   (userEmail && n.recipientUserId?.toLowerCase() === userEmail) ||
                   (n.listingId && myIds.has(n.listingId)) ||
                   n.recipientUserId === 'all')
              ).length;
              setUnreadNotifCount(count);
            } else {
              setUnreadNotifCount(0);
            }
          }
        }
      } catch {}
    };
    syncUnreadCount();
    window.addEventListener('hanoi_notifications_updated', syncUnreadCount);
    window.addEventListener('storage', syncUnreadCount);
    window.addEventListener('hanoi_new_notification', syncUnreadCount);
    return () => {
      window.removeEventListener('hanoi_notifications_updated', syncUnreadCount);
      window.removeEventListener('storage', syncUnreadCount);
      window.removeEventListener('hanoi_new_notification', syncUnreadCount);
    };
  }, [user, listings]);

  const handleSelectTab = (tabId: TabType) => {
    setActiveTab(tabId);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', tabId);
      window.history.replaceState({}, '', url.toString());
    }
  };

  // SECTION 4 & SECTION 16: PHÂN QUYỀN SELLER
  // Chỉ hiển thị các tin thuộc về ownerId === currentUser.id
  const userListings = listings.filter((l) => {
    if (!user?.id) return false;
    return l.ownerId === user.id || l.userId === user.id || l.createdBy === user.id;
  });
  const savedListings = listings.filter((l) => savedListingIds.includes(l.id));

  // Chuyển đổi nhanh tài khoản Seller để test Section 23
  const handleSwitchSeller = (seller: DemoSeller) => {
    const updatedUser: any = {
      id: seller.id,
      name: seller.name,
      email: seller.email,
      phone: seller.phone,
      role: 'agent',
      package: (seller.package || 'pro').toLowerCase(),
      packageExpiry: '2026-12-31',
      aiReportsUsed: 3,
      aiReportsLimit: 30,
      listingsCount: listings.filter((l) => l.ownerId === seller.id).length,
      activeListings: listings.filter((l) => l.ownerId === seller.id && l.status === 'active').length,
      avatar: seller.avatar,
    };
    setUser(updatedUser);
    addToast(`👤 Đã chuyển phiên làm việc sang: ${seller.name} (${seller.id.toUpperCase()})`, 'info');
  };

  const handleDeleteListing = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Bạn có chắc chắn muốn xóa tin đăng này?')) {
      await deleteListing(id);
    }
  };

  // Lọc danh sách lịch hẹn thuộc về các bài đăng hoặc tài khoản của người dùng hiện tại
  const rawUserAppointments = appointments.filter((appt) => {
    if (!user) return false;
    const userEmail = user.email?.toLowerCase();
    if (appt.sellerId && appt.sellerId === user.id) return true;
    if (appt.sellerEmail && userEmail && appt.sellerEmail.toLowerCase() === userEmail) return true;
    // Kiểm tra theo ID bài đăng người dùng sở hữu
    if (appt.listingId && userListings.some((l) => l.id === appt.listingId)) return true;
    return false;
  });

  const userAppointments = rawUserAppointments.filter((appt) => {
    if (appointmentFilter === 'pending' && appt.status && appt.status !== 'pending') return false;
    if (appointmentFilter === 'confirmed' && appt.status !== 'confirmed') return false;
    if (appointmentFilter === 'cancelled' && appt.status !== 'cancelled') return false;
    if (appointmentSearch.trim()) {
      const q = appointmentSearch.toLowerCase().trim();
      const matchName = appt.buyerName?.toLowerCase().includes(q);
      const matchPhone = appt.buyerPhone?.includes(q);
      const matchTitle = appt.listingTitle?.toLowerCase().includes(q);
      if (!matchName && !matchPhone && !matchTitle) return false;
    }
    return true;
  });

  const handleUpdateAppointmentStatus = (apptId: string, newStatus: 'confirmed' | 'cancelled') => {
    const updated = appointments.map((a) => (a.id === apptId ? { ...a, status: newStatus } : a));
    setAppointments(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('hanoi_realty_appointments', JSON.stringify(updated));

      // Đồng bộ cập nhật trạng thái trong danh sách thông báo
      try {
        const notifsRaw = localStorage.getItem('hanoi_realty_notifications');
        if (notifsRaw) {
          const notifs = JSON.parse(notifsRaw);
          if (Array.isArray(notifs)) {
            const updatedNotifs = notifs.map((n: any) => {
              if (n.appointmentId === apptId || n.appointmentData?.id === apptId) {
                return {
                  ...n,
                  appointmentData: {
                    ...n.appointmentData,
                    status: newStatus
                  }
                };
              }
              return n;
            });
            localStorage.setItem('hanoi_realty_notifications', JSON.stringify(updatedNotifs));
            window.dispatchEvent(new Event('hanoi_notifications_updated'));
          }
        }
      } catch {}

      window.dispatchEvent(new Event('hanoi_appointments_updated'));
    }
    addToast(
      newStatus === 'confirmed'
        ? '✅ Đã xác nhận lịch hẹn xem nhà thành công'
        : '❌ Đã cập nhật huỷ lịch hẹn',
      newStatus === 'confirmed' ? 'success' : 'info'
    );
  };

  // Sidebar Menu categorized
  const menuGroups: MenuGroup[] = [
    {
      title: 'QUẢN LÝ',
      items: [
        { id: 'listings', label: 'Quản lý tin đăng', icon: Home, count: userListings.length },
        {
          id: 'appointments',
          label: 'Lịch hẹn xem nhà',
          icon: CalendarDays,
          count: userAppointments.length,
          badge: userAppointments.filter((a) => a.status === 'pending').length > 0
            ? `${userAppointments.filter((a) => a.status === 'pending').length} MỚI`
            : undefined,
        },
        { id: 'saved', label: 'Tin đã lưu', icon: Heart, count: savedListingIds.length },
        { id: 'reports', label: 'Báo cáo AI', icon: Sparkles, count: user?.aiReportsUsed || 8 },
      ],
    },
    {
      title: 'TÀI KHOẢN & DỊCH VỤ',
      items: [
        {
          id: 'notifications',
          label: 'Thông báo',
          icon: Bell,
          badge: unreadNotifCount > 0 ? `${unreadNotifCount} MỚI` : undefined,
        },
        { id: 'packages', label: 'Gói VIP', icon: Tag, badge: user?.package?.toUpperCase() || 'PRO' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-page-bg flex flex-col">
      <Navbar />

      <main className="flex-1 container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">

        {/* SECTION 23: MULTI-SELLER QUICK TEST SWITCHER */}
        <div className="mb-6 rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50/90 via-sky-50/60 to-purple-50/60 p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs shadow-xs">
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-black text-[10px] uppercase tracking-wider shadow-2xs">
              🧪 Kiểm thử Multi-Seller
            </span>
            <div>
              <p className="font-bold text-slate-800">
                Đang đăng nhập: <span className="text-indigo-600 font-black">{user?.name}</span> (ID: <code className="bg-white px-1.5 py-0.5 rounded border border-indigo-100 font-mono text-[11px] text-indigo-700">{user?.id}</code>)
              </p>
              <p className="text-[11px] text-slate-500">Chuyển đổi seller để kiểm tra tính năng phân quyền, chỉ thấy tin của mình và nhận notification riêng biệt:</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {TEST_SELLERS_LIST.map((s: DemoSeller) => {
              const isSelected = user?.id === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleSwitchSeller(s)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 text-xs ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-400/50 scale-[1.02]'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-emerald-300' : 'bg-slate-300'}`} />
                  <span>{s.id === 'seller_a' ? 'Seller A' : s.id === 'seller_b' ? 'Seller B' : 'Seller C'}</span>
                  <span className="text-[10px] opacity-80">({s.name.split(' ').slice(-2).join(' ')})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* User Profile Header Banner */}
        <div className="rounded-3xl border border-border bg-white p-6 sm:p-8 shadow-sm mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'}
              alt="avatar"
              className="h-16 w-16 rounded-2xl object-cover ring-4 ring-accent/20"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-text-primary">{user?.name || 'Môi giới BĐS'}</h1>
                <span className="rounded-full bg-accent/15 px-2.5 py-0.5 text-[10px] font-extrabold text-accent uppercase">
                  Gói {user?.package || 'Pro'} VIP
                </span>
              </div>
              <p className="text-xs text-text-secondary mt-0.5">{user?.email || 'an@example.com'}</p>
              <p className="text-[11px] text-text-muted mt-1">Hạn gói: {user?.packageExpiry || '2026-09-15'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/listings/create"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 text-xs font-black text-white shadow-lg shadow-accent/25 hover:bg-accent-hover transition-all"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Đăng tin BĐS mới</span>
            </Link>
          </div>
        </div>

        {/* Dashboard Grid: Grouped Sidebar Menu (Left) | Main Panel Content (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Left Menu Categorized Tabs */}
          <div className="space-y-5">
            {menuGroups.map((group) => (
              <div key={group.title} className="space-y-1.5">
                <div className="px-3 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  {group.title}
                </div>

                <div className="space-y-1.5">
                  {menuGroups.find(g => g.title === group.title)?.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;

                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelectTab(item.id)}
                        className={`group relative flex w-full items-center justify-between rounded-2xl p-3.5 text-xs font-bold transition-all ${isActive
                            ? 'bg-primary text-white shadow-md'
                            : 'bg-white text-text-secondary hover:bg-slate-50 border border-border'
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon
                            className={`h-4 w-4 transition-colors ${isActive ? 'text-accent' : 'text-text-muted group-hover:text-primary'
                              }`}
                          />
                          <span>{item.label}</span>
                        </div>

                        {item.count !== undefined && (
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold transition-colors ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-text-secondary'
                              }`}
                          >
                            {item.count}
                          </span>
                        )}

                        {item.badge && (
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${item.badge === 'CONNECTED'
                                ? 'bg-emerald-500 text-white'
                                : 'bg-accent text-white'
                              }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Right Main Content */}
          <div className="lg:col-span-3 space-y-6">

            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
                <span className="text-[11px] text-text-muted font-semibold">Tin bất động sản của bạn</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <p className="text-2xl font-black text-text-primary">{userListings.length}</p>
                  {userListings.some(l => l.status === 'pending') && (
                    <span className="text-[10px] font-extrabold text-amber-700 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full animate-pulse">
                      {userListings.filter(l => l.status === 'pending').length} chờ duyệt
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-success font-bold flex items-center gap-1 mt-1">
                  <CheckCircle2 className="h-3 w-3" /> Chuẩn quy hoạch
                </span>
              </div>

              <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
                <span className="text-[11px] text-text-muted font-semibold">Tổng lượt xem tin</span>
                <p className="text-2xl font-black text-accent mt-1">2,840</p>
                <span className="text-[10px] text-success font-bold flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" /> +18% tuần này
                </span>
              </div>

              <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
                <span className="text-[11px] text-text-muted font-semibold">Báo cáo AI đã dùng</span>
                <p className="text-2xl font-black text-text-primary mt-1">8 / 30</p>
                <span className="text-[10px] text-text-muted mt-1">Còn lại 22 lượt</span>
              </div>

              <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
                <span className="text-[11px] text-text-muted font-semibold">Tin đã lưu</span>
                <p className="text-2xl font-black text-rose-600 mt-1">{savedListingIds.length}</p>
                <span className="text-[10px] text-rose-600 font-bold mt-1 flex items-center gap-1">
                  <Heart className="h-3 w-3 fill-rose-600" /> Đang theo dõi
                </span>
              </div>
            </div>

            {/* Tabbed Content Area */}
            <AnimatePresence mode="wait">
              {/* TAB 1: LISTINGS */}
              {activeTab === 'listings' && (
                <motion.div
                  key="tab-listings"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-3xl border border-border bg-white p-6 shadow-sm space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-border pb-4">
                    <div>
                      <h3 className="text-sm font-extrabold text-text-primary">
                        Quản lý tin đăng bất động sản ({userListings.length})
                      </h3>
                      <p className="text-xs text-text-secondary mt-0.5">
                        Chỉ hiển thị các tin thuộc sở hữu tài khoản của bạn (ownerId: <code className="font-mono text-accent">{user?.id}</code>)
                      </p>
                    </div>
                    <Link
                      href="/listings/create"
                      className="text-xs font-bold text-accent hover:underline flex items-center gap-1"
                    >
                      <PlusCircle className="h-3.5 w-3.5" />
                      <span>Đăng tin mới</span>
                    </Link>
                  </div>

                  {userListings.length === 0 ? (
                    <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50">
                      <Home className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                      <h4 className="font-bold text-sm text-slate-700">Tài khoản này chưa có tin đăng nào</h4>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                        Tạo tin đăng mới ngay để tiếp cận hàng nghìn khách hàng tiềm năng tại Hà Nội.
                      </p>
                      <Link
                        href="/listings/create"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-bold shadow-sm transition-all"
                      >
                        <PlusCircle className="w-4 h-4" />
                        Đăng tin đầu tiên
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {userListings.map((listing) => (
                        <div
                          key={listing.id}
                          className="group flex flex-col gap-3 rounded-2xl border border-border p-4 hover:border-accent hover:bg-orange-50/10 transition-all shadow-sm"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3.5">
                              <Link
                                href={`/listings/${listing.id}`}
                                className="shrink-0 block"
                              >
                                <img
                                  src={listing.images[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400'}
                                  alt={listing.title}
                                  className="h-16 w-24 rounded-xl object-cover hover:opacity-90 transition-opacity"
                                />
                              </Link>
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-xs font-black text-accent">
                                    {formatCurrencyVND(listing.price)}
                                  </span>
                                  <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold text-text-secondary">
                                    {listing.area}m²
                                  </span>
                                  <span className="rounded bg-emerald-50 text-emerald-700 px-1.5 py-0.5 text-[9px] font-bold">
                                    {listing.planningZone || 'Đất ở đô thị'}
                                  </span>

                                  {/* Trạng thái tin đăng theo chuẩn Section 8, 9, 10 */}
                                  {listing.status === 'pending' ? (
                                    <span className="rounded-full bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 text-[9px] font-extrabold flex items-center gap-1 animate-pulse">
                                      ⏳ Chờ Admin duyệt
                                    </span>
                                  ) : listing.status === 'rejected' ? (
                                    <span className="rounded-full bg-rose-100 text-rose-800 border border-rose-300 px-2 py-0.5 text-[9px] font-extrabold flex items-center gap-1">
                                      ❌ Bị từ chối
                                    </span>
                                  ) : listing.status === 'hidden' ? (
                                    <span className="rounded-full bg-slate-100 text-slate-700 border border-slate-300 px-2 py-0.5 text-[9px] font-extrabold flex items-center gap-1">
                                      👁️ Đã ẩn (Tạm ngưng)
                                    </span>
                                  ) : listing.status === 'expired' ? (
                                    <span className="rounded-full bg-gray-100 text-gray-700 border border-gray-300 px-2 py-0.5 text-[9px] font-extrabold flex items-center gap-1">
                                      ⌛ Hết hạn
                                    </span>
                                  ) : (
                                    <span className="rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[9px] font-extrabold flex items-center gap-1">
                                      ✓ Đã duyệt (Đang hiển thị)
                                    </span>
                                  )}
                                </div>
                                <Link
                                  href={`/listings/${listing.id}`}
                                  className="text-xs font-bold text-text-primary hover:text-accent transition-colors line-clamp-1 mt-1 block cursor-pointer"
                                >
                                  {listing.title}
                                </Link>
                                <p className="text-[11px] text-text-muted mt-0.5">{listing.district}, Hà Nội • Mã: <span className="font-mono text-[10px] text-slate-500">{listing.id}</span></p>
                              </div>
                            </div>

                            {/* Action buttons */}
                            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                              {/* Nút Chỉnh sửa tin (Section 11) */}
                              <Link
                                href={`/listings/create?editId=${listing.id}`}
                                className="flex items-center gap-1 rounded-lg bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 text-xs font-bold text-text-primary transition-colors"
                                title="Chỉnh sửa tin"
                              >
                                <Pencil className="h-3.5 w-3.5 text-slate-600" />
                                <span>Sửa</span>
                              </Link>

                              <Link
                                href={`/reports/${listing.id}`}
                                className="flex items-center gap-1 rounded-lg bg-accent/10 px-2.5 py-1.5 text-xs font-bold text-accent hover:bg-accent hover:text-white transition-colors"
                              >
                                <Sparkles className="h-3.5 w-3.5" />
                                <span>AI</span>
                              </Link>

                              <button
                                onClick={(e) => handleDeleteListing(listing.id, e)}
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted hover:bg-red-50 hover:text-danger transition-colors"
                                title="Xoá tin"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>

                          {/* Báo lỗi từ chối nếu tin bị rejected theo Section 9 */}
                          {listing.status === 'rejected' && (
                            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div className="flex items-start gap-2">
                                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                                <div>
                                  <span className="font-bold text-[11px] text-rose-900">Lý do từ chối của Admin:</span>
                                  <p className="text-[11px] text-rose-700 mt-0.5">
                                    {listing.rejectionReason || 'Thông tin tin đăng chưa đáp ứng tiêu chuẩn kiểm duyệt.'}
                                  </p>
                                </div>
                              </div>
                              <Link
                                href={`/listings/create?editId=${listing.id}`}
                                className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] shrink-0 transition-colors shadow-2xs"
                              >
                                <Pencil className="w-3 h-3" />
                                <span>Sửa & Gửi duyệt lại</span>
                              </Link>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* TAB: LỊCH HẸN XEM NHÀ (DÀNH CHO CHỦ TIN ĐĂNG) */}
              {activeTab === 'appointments' && (
                <motion.div
                  key="tab-appointments"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-3xl border border-border bg-white p-6 shadow-sm space-y-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-5 w-5 text-accent" />
                        <h3 className="text-base font-extrabold text-text-primary">
                          Khách đăng ký lịch hẹn xem nhà
                        </h3>
                        <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-black text-accent">
                          {rawUserAppointments.length} lịch hẹn
                        </span>
                      </div>
                      <p className="text-xs text-text-secondary mt-1">
                        Danh sách các khách hàng đã đặt lịch xem trực tiếp các bất động sản do bạn đăng bán.
                      </p>
                    </div>

                    {/* Tìm kiếm & Lọc nhanh */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <div className="relative">
                        <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          placeholder="Tìm theo tên, SĐT, BĐS..."
                          value={appointmentSearch}
                          onChange={(e) => setAppointmentSearch(e.target.value)}
                          className="pl-8 pr-3 py-1.5 rounded-xl border border-border text-xs bg-page-bg focus:border-accent focus:outline-none w-full sm:w-56 font-medium shadow-2xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Filter Status Pills */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                    <button
                      type="button"
                      onClick={() => setAppointmentFilter('all')}
                      className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                        appointmentFilter === 'all'
                          ? 'bg-primary text-white shadow-xs'
                          : 'bg-slate-100 text-text-secondary hover:bg-slate-200'
                      }`}
                    >
                      Tất cả ({rawUserAppointments.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setAppointmentFilter('pending')}
                      className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                        appointmentFilter === 'pending'
                          ? 'bg-amber-500 text-white shadow-xs'
                          : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                      }`}
                    >
                      <span>⏳ Chờ xác nhận</span>
                      <span className="rounded-full bg-black/10 px-1.5 py-0.2 text-[10px]">
                        {rawUserAppointments.filter((a) => !a.status || a.status === 'pending').length}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAppointmentFilter('confirmed')}
                      className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                        appointmentFilter === 'confirmed'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                      }`}
                    >
                      <span>✓ Đã xác nhận</span>
                      <span className="rounded-full bg-black/10 px-1.5 py-0.2 text-[10px]">
                        {rawUserAppointments.filter((a) => a.status === 'confirmed').length}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAppointmentFilter('cancelled')}
                      className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                        appointmentFilter === 'cancelled'
                          ? 'bg-slate-700 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <span>✕ Đã huỷ</span>
                      <span className="rounded-full bg-black/10 px-1.5 py-0.2 text-[10px]">
                        {rawUserAppointments.filter((a) => a.status === 'cancelled').length}
                      </span>
                    </button>
                  </div>

                  {/* Switch View Mode & Quick Actions */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50 p-2.5 rounded-2xl border border-slate-200">
                    {/* View Switcher Buttons */}
                    <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
                      <button
                        type="button"
                        onClick={() => setAppointmentViewMode('calendar')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          appointmentViewMode === 'calendar'
                            ? 'bg-accent text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                        }`}
                      >
                        <Clock className="h-3.5 w-3.5" />
                        <span>Bảng khung giờ & Ngày</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setAppointmentViewMode('list')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          appointmentViewMode === 'list'
                            ? 'bg-accent text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                        }`}
                      >
                        <Layers className="h-3.5 w-3.5" />
                        <span>Danh sách thẻ ({userAppointments.length})</span>
                      </button>
                    </div>

                    {/* Lọc theo bài đăng BĐS cụ thể */}
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-slate-500 whitespace-nowrap">Xem theo BĐS:</span>
                      <select
                        value={selectedScheduleListingId}
                        onChange={(e) => setSelectedScheduleListingId(e.target.value)}
                        className="py-1.5 px-2.5 rounded-xl border border-slate-300 text-xs font-semibold bg-white text-slate-800 focus:outline-none focus:border-accent max-w-[220px] truncate shadow-2xs cursor-pointer"
                      >
                        <option value="all">Tất cả bài đăng ({userListings.length} tin)</option>
                        {userListings.map((l) => (
                          <option key={l.id} value={l.id}>
                            {l.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* ══════ VIEW 1: BẢNG KHUNG GIỜ THEO NGÀY (TIME-SLOT MATRIX) ══════ */}
                  {appointmentViewMode === 'calendar' && (
                    <div className="space-y-4">
                      {/* Date Navigator Bar */}
                      <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-2xs space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-100 text-orange-600 font-extrabold text-xs">
                              📅
                            </span>
                            <div>
                              <h4 className="text-xs font-extrabold text-slate-900">
                                Lịch trình ngày: {selectedScheduleDate.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}
                              </h4>
                              <p className="text-[10px] text-slate-500">
                                Kiểm tra các khung giờ đã kín lịch, khách hẹn và bài đăng tương ứng
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                const prev = new Date(selectedScheduleDate);
                                prev.setDate(prev.getDate() - 1);
                                setSelectedScheduleDate(prev);
                              }}
                              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
                              title="Ngày hôm trước"
                            >
                              <ChevronLeft className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setSelectedScheduleDate(new Date())}
                              className="px-2.5 py-1 rounded-lg border border-slate-200 text-[11px] font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                            >
                              Hôm nay
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const next = new Date(selectedScheduleDate);
                                next.setDate(next.getDate() + 1);
                                setSelectedScheduleDate(next);
                              }}
                              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
                              title="Ngày kế tiếp"
                            >
                              <ChevronRight className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        {/* Thanh chọn 7 ngày liên tiếp */}
                        <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5 pt-1">
                          {Array.from({ length: 7 }, (_, i) => {
                            const d = new Date();
                            d.setDate(d.getDate() + i);
                            const isSelected = d.toDateString() === selectedScheduleDate.toDateString();
                            const isToday = d.toDateString() === new Date().toDateString();

                            // Đếm số lịch hẹn trong ngày này
                            const dayDateStr = d.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' });
                            const dayCount = rawUserAppointments.filter((a) => a.date === dayDateStr && a.status !== 'cancelled').length;

                            return (
                              <button
                                key={d.toISOString()}
                                type="button"
                                onClick={() => setSelectedScheduleDate(d)}
                                className={`p-2 rounded-xl text-center border transition-all relative ${
                                  isSelected
                                    ? 'border-accent bg-accent text-white shadow-sm ring-2 ring-accent/25'
                                    : 'border-slate-200 bg-slate-50/80 text-slate-700 hover:bg-slate-100'
                                }`}
                              >
                                <span className="block text-[10px] uppercase font-bold opacity-80">
                                  {isToday ? 'Hôm nay' : d.toLocaleDateString('vi-VN', { weekday: 'short' })}
                                </span>
                                <span className="block text-sm font-black mt-0.5">
                                  {d.getDate()}/{d.getMonth() + 1}
                                </span>
                                {dayCount > 0 && (
                                  <span className={`inline-block px-1.5 py-0.2 rounded-full text-[9px] font-extrabold mt-1 ${
                                    isSelected ? 'bg-white text-accent' : 'bg-orange-500 text-white'
                                  }`}>
                                    {dayCount} lịch
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Khung giờ chi tiết (Sáng - Chiều - Tối) */}
                      {(() => {
                        const targetDateStr = selectedScheduleDate.toLocaleDateString('vi-VN', {
                          weekday: 'long',
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        });

                        const ALL_SLOTS = [
                          { session: 'Sáng', slots: ['08:30', '09:30', '10:30', '11:15'] },
                          { session: 'Chiều', slots: ['14:00', '15:00', '16:00', '17:00'] },
                          { session: 'Tối', slots: ['17:45', '18:30', '19:15'] },
                        ];

                        // Lọc các lịch hẹn khớp với ngày đang chọn và BĐS đang chọn
                        const apptsForDay = rawUserAppointments.filter((a) => {
                          if (a.date !== targetDateStr) return false;
                          if (selectedScheduleListingId !== 'all' && a.listingId !== selectedScheduleListingId) return false;
                          return true;
                        });

                        const totalBooked = apptsForDay.filter((a) => a.status !== 'cancelled').length;

                        return (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between px-1">
                              <span className="text-xs font-bold text-slate-700">
                                Danh sách các mốc thời gian ({targetDateStr})
                              </span>
                              <span className="text-[11px] font-extrabold text-orange-600 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-lg">
                                {totalBooked > 0 ? `Đã kín ${totalBooked} khung giờ` : 'Chưa có giờ nào bị đặt'}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              {ALL_SLOTS.map((group) => (
                                <div
                                  key={group.session}
                                  className="rounded-2xl border border-slate-200 bg-slate-50/50 p-3.5 space-y-2.5"
                                >
                                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
                                    <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                                      <Clock className="h-3.5 w-3.5 text-accent" />
                                      <span>Buổi {group.session}</span>
                                    </span>
                                    <span className="text-[10px] text-slate-400 font-semibold">
                                      {group.slots.length} mốc giờ
                                    </span>
                                  </div>

                                  <div className="space-y-2">
                                    {group.slots.map((slot) => {
                                      // Tìm xem khung giờ này có khách nào đặt chưa
                                      const matchedAppt = apptsForDay.find(
                                        (a) => a.time === slot && a.status !== 'cancelled'
                                      );

                                      if (matchedAppt) {
                                        const isConfirmed = matchedAppt.status === 'confirmed';
                                        const cleanPhone = (matchedAppt.buyerPhone || '').replace(/\D/g, '');

                                        return (
                                          <div
                                            key={slot}
                                            className={`rounded-xl border p-2.5 transition-all space-y-1.5 ${
                                              isConfirmed
                                                ? 'border-emerald-300 bg-emerald-50/60 shadow-2xs'
                                                : 'border-orange-300 bg-orange-50/70 shadow-2xs'
                                            }`}
                                          >
                                            <div className="flex items-center justify-between">
                                              <span className="text-xs font-black text-slate-900 flex items-center gap-1">
                                                <Clock className="h-3 w-3 text-orange-600" />
                                                <span>{slot}</span>
                                              </span>
                                              <span className={`rounded-full px-1.5 py-0.2 text-[9px] font-extrabold ${
                                                isConfirmed ? 'bg-emerald-200 text-emerald-900' : 'bg-amber-200 text-amber-900 animate-pulse'
                                              }`}>
                                                {isConfirmed ? '✓ Đã kín lịch' : '⏳ Chờ duyệt'}
                                              </span>
                                            </div>

                                            {/* Tên khách & SĐT */}
                                            <div className="text-[11px] text-slate-800">
                                              <span className="font-extrabold text-slate-900">{matchedAppt.buyerName}</span>
                                              <span className="text-slate-400 mx-1">•</span>
                                              <span className="font-mono font-bold text-emerald-700">{matchedAppt.buyerPhone}</span>
                                            </div>

                                            {/* BĐS hẹn xem */}
                                            <div className="text-[10px] text-slate-600 truncate font-medium bg-white/70 px-1.5 py-1 rounded-md border border-slate-200/60">
                                              🏠 {matchedAppt.listingTitle}
                                            </div>

                                            {/* Quick Actions */}
                                            <div className="pt-1 flex items-center gap-1.5 border-t border-slate-200/60">
                                              {cleanPhone && (
                                                <a
                                                  href={`tel:${cleanPhone}`}
                                                  className="flex-1 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[9px] flex items-center justify-center gap-1 transition-colors"
                                                >
                                                  <Phone className="h-2.5 w-2.5" />
                                                  <span>Gọi</span>
                                                </a>
                                              )}
                                              {cleanPhone && (
                                                <a
                                                  href={`https://zalo.me/${cleanPhone}`}
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  className="flex-1 py-1 rounded-md bg-[#0068FF] hover:bg-[#0055d4] text-white font-bold text-[9px] flex items-center justify-center gap-1 transition-colors"
                                                >
                                                  <MessageSquare className="h-2.5 w-2.5" />
                                                  <span>Zalo</span>
                                                </a>
                                              )}
                                              {matchedAppt.status !== 'confirmed' && (
                                                <button
                                                  type="button"
                                                  onClick={() => handleUpdateAppointmentStatus(matchedAppt.id, 'confirmed')}
                                                  className="px-2 py-1 rounded-md bg-accent hover:bg-accent-hover text-white font-bold text-[9px] transition-colors"
                                                >
                                                  Duyệt
                                                </button>
                                              )}
                                              <button
                                                type="button"
                                                onClick={() => handleUpdateAppointmentStatus(matchedAppt.id, 'cancelled')}
                                                className="px-1.5 py-1 rounded-md bg-white hover:bg-red-50 text-slate-400 hover:text-red-500 text-[9px] font-semibold border border-slate-200"
                                                title="Huỷ lịch"
                                              >
                                                Huỷ
                                              </button>
                                            </div>
                                          </div>
                                        );
                                      }

                                      // Slot còn trống (Chưa có khách đặt)
                                      return (
                                        <div
                                          key={slot}
                                          className="rounded-xl border border-dashed border-slate-200 bg-white p-2.5 flex items-center justify-between text-xs text-slate-400 hover:border-slate-300 transition-colors"
                                        >
                                          <div className="flex items-center gap-1.5 font-bold text-slate-600">
                                            <Clock className="h-3 w-3 text-slate-400" />
                                            <span>{slot}</span>
                                          </div>
                                          <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                                            Trống lịch
                                          </span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  {/* ══════ VIEW 2: DANH SÁCH THẺ TRUYỀN THỐNG ══════ */}
                  {appointmentViewMode === 'list' && (
                    <>
                      {userAppointments.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-border bg-slate-50/60 p-10 text-center space-y-3">
                          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm border border-border text-slate-400">
                            <Calendar className="h-7 w-7 text-slate-300" />
                          </div>
                          <div className="space-y-1">
                            <h4 className="text-sm font-bold text-text-primary">Chưa có lịch hẹn xem nhà nào</h4>
                            <p className="text-xs text-text-muted max-w-sm mx-auto">
                              Khi có khách hàng bấm "Đặt lịch xem nhà" trên bài đăng BĐS của bạn, thông tin liên hệ và thời gian hẹn sẽ xuất hiện tại đây ngay lập tức.
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3.5">
                      {userAppointments.map((appt) => {
                        const isPending = !appt.status || appt.status === 'pending';
                        const isConfirmed = appt.status === 'confirmed';
                        const isCancelled = appt.status === 'cancelled';
                        const cleanPhone = (appt.buyerPhone || '').replace(/\D/g, '');

                        return (
                          <div
                            key={appt.id}
                            className={`rounded-2xl border p-4 sm:p-5 transition-all ${
                              isPending
                                ? 'border-orange-200 bg-orange-50/20 shadow-xs'
                                : isConfirmed
                                ? 'border-emerald-200 bg-emerald-50/15'
                                : 'border-slate-200 bg-slate-50/50 opacity-75'
                            }`}
                          >
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                              <div className="space-y-2 flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-orange-500/10 text-orange-700 px-2.5 py-1 text-xs font-black">
                                    <Clock className="h-3.5 w-3.5 text-orange-600" />
                                    <span>{appt.time} • {appt.date}</span>
                                  </span>

                                  {isPending && (
                                    <span className="rounded-full bg-amber-100 text-amber-800 border border-amber-300 px-2.5 py-0.5 text-[10px] font-extrabold flex items-center gap-1 animate-pulse">
                                      ⏳ Chờ xác nhận
                                    </span>
                                  )}
                                  {isConfirmed && (
                                    <span className="rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 text-[10px] font-extrabold flex items-center gap-1">
                                      ✓ Đã xác nhận đón khách
                                    </span>
                                  )}
                                  {isCancelled && (
                                    <span className="rounded-full bg-slate-200 text-slate-700 px-2.5 py-0.5 text-[10px] font-extrabold">
                                      ✕ Đã huỷ
                                    </span>
                                  )}

                                  {appt.purpose && (
                                    <span className="rounded-md bg-slate-100 text-slate-600 text-[10px] font-semibold px-2 py-0.5">
                                      Mục đích: {appt.purpose}
                                    </span>
                                  )}
                                </div>

                                <h4 className="text-sm font-extrabold text-text-primary line-clamp-1">
                                  {appt.listingTitle}
                                </h4>

                                <div className="flex items-center gap-3 text-xs text-text-secondary flex-wrap">
                                  <span className="flex items-center gap-1 font-bold text-text-primary">
                                    <User className="h-3.5 w-3.5 text-slate-400" />
                                    <span>{appt.buyerName}</span>
                                  </span>
                                  <span>•</span>
                                  <span className="font-mono font-bold text-emerald-600">
                                    {appt.buyerPhone}
                                  </span>
                                </div>

                                {appt.note && (
                                  <p className="text-xs text-text-muted italic bg-white/80 p-2.5 rounded-xl border border-slate-200/80">
                                    "{appt.note}"
                                  </p>
                                )}
                              </div>

                              {/* Action buttons */}
                              <div className="flex items-center gap-2 shrink-0 flex-wrap">
                                {cleanPhone && (
                                  <>
                                    <a
                                      href={`tel:${cleanPhone}`}
                                      className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-3 py-2 text-xs font-bold text-white transition-colors shadow-xs"
                                    >
                                      <Phone className="h-3.5 w-3.5" />
                                      <span>Gọi ngay</span>
                                    </a>
                                    <a
                                      href={`https://zalo.me/${cleanPhone}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#0068FF] hover:bg-[#0055d4] px-3 py-2 text-xs font-bold text-white transition-colors shadow-xs"
                                    >
                                      <MessageSquare className="h-3.5 w-3.5" />
                                      <span>Zalo</span>
                                    </a>
                                  </>
                                )}

                                {isPending && (
                                  <button
                                    onClick={() => handleUpdateAppointmentStatus(appt.id, 'confirmed')}
                                    className="inline-flex items-center gap-1 rounded-xl bg-accent hover:bg-accent-hover px-3 py-2 text-xs font-bold text-white transition-colors shadow-xs"
                                  >
                                    <Check className="h-3.5 w-3.5" />
                                    <span>Xác nhận</span>
                                  </button>
                                )}

                                {!isCancelled && (
                                  <button
                                    onClick={() => handleUpdateAppointmentStatus(appt.id, 'cancelled')}
                                    className="rounded-xl border border-slate-200 bg-white hover:bg-red-50 hover:text-danger px-2.5 py-2 text-xs font-bold text-text-muted transition-colors"
                                    title="Huỷ lịch hẹn này"
                                  >
                                    Huỷ
                                  </button>
                                )}

                                {appt.listingId && (
                                  <Link
                                    href={`/listings/${appt.listingId}`}
                                    className="rounded-xl border border-slate-200 bg-white hover:border-accent hover:text-accent p-2 text-text-muted transition-colors"
                                    title="Xem tin đăng BĐS"
                                  >
                                    <ExternalLink className="h-4 w-4" />
                                  </Link>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </motion.div>
          )}

          {/* TAB 2: SAVED LISTINGS (REAL DATA & CONTROLS) */}
              {activeTab === 'saved' && (
                <motion.div
                  key="tab-saved"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-3xl border border-border bg-white p-6 shadow-sm space-y-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <Heart className="h-5 w-5 text-red-500 fill-red-500" />
                        <h3 className="text-base font-extrabold text-text-primary">
                          Bất động sản đã lưu
                        </h3>
                        <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-black text-accent">
                          {savedListings.length} tin
                        </span>
                      </div>
                      <p className="text-xs text-text-secondary mt-1">
                        Các bất động sản bạn đang theo dõi biến động giá và tiến độ quy hoạch thực tế tại Hà Nội.
                      </p>
                    </div>

                    <Link
                      href="/search"
                      className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-page-bg px-3.5 py-2 text-xs font-bold text-text-primary hover:border-accent hover:text-accent transition-colors self-start sm:self-center"
                    >
                      <Search className="h-3.5 w-3.5 text-accent" />
                      <span>Tìm thêm BĐS</span>
                    </Link>
                  </div>

                  {savedListings.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-border bg-slate-50/60 p-10 text-center space-y-3">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm border border-border text-slate-400">
                        <Heart className="h-7 w-7 text-slate-300" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-text-primary">Chưa có bất động sản nào được lưu</h4>
                        <p className="text-xs text-text-secondary max-w-md mx-auto">
                          Hãy duyệt qua kho dữ liệu quy hoạch và danh sách tin đăng, nhấn biểu tượng trái tim để lưu lại theo dõi.
                        </p>
                      </div>
                      <Link
                        href="/search"
                        className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-xs font-extrabold text-white shadow-md shadow-accent/20 hover:bg-accent-hover transition-all mt-2"
                      >
                        <Search className="h-4 w-4" />
                        <span>Khám phá tin đăng ngay</span>
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {savedListings.map((listing) => (
                        <div
                          key={listing.id}
                          onClick={() => router.push(`/listings/${listing.id}`)}
                          className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm hover:shadow-md hover:border-accent/60 transition-all cursor-pointer"
                        >
                          {/* Card Thumbnail */}
                          <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                            <img
                              src={listing.images[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80'}
                              alt={listing.title}
                              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />

                            {/* Planning & Featured Badges */}
                            <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 pointer-events-none">
                              {listing.isFeatured && (
                                <span className="rounded-md bg-accent px-2 py-0.5 text-[10px] font-extrabold text-white shadow-md">
                                  ⭐ Nổi bật
                                </span>
                              )}
                              <span className="rounded-md bg-primary/85 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-white">
                                {listing.planningZone}
                              </span>
                            </div>

                            {/* Floating Heart Unsave button on photo */}
                            <motion.button
                              whileTap={{ scale: 0.85 }}
                              whileHover={{ scale: 1.1 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleSaveListing(listing.id);
                              }}
                              className="absolute top-2.5 right-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-sm transition-colors hover:bg-white text-red-500"
                              title="Bỏ lưu bất động sản này"
                            >
                              <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                            </motion.button>

                            {/* Price Overlay */}
                            <div className="absolute bottom-2.5 left-2.5 rounded-lg bg-primary/90 px-2.5 py-1 text-xs font-black text-white shadow-md backdrop-blur-sm">
                              {formatCurrencyVND(listing.price)}
                              <span className="ml-1 text-[10px] font-normal text-slate-300">
                                ({formatPricePerM2(listing.price, listing.area)})
                              </span>
                            </div>
                          </div>

                          {/* Card Body */}
                          <div className="flex flex-1 flex-col p-4">
                            {/* Title */}
                            <Link
                              href={`/listings/${listing.id}`}
                              onClick={(e) => e.stopPropagation()}
                              className="text-xs sm:text-sm font-bold leading-snug text-text-primary hover:text-accent transition-colors line-clamp-2 block cursor-pointer"
                            >
                              {listing.title}
                            </Link>

                            {/* Address */}
                            <div className="mt-2 flex items-center gap-1 text-[11px] text-text-secondary">
                              <MapPin className="h-3.5 w-3.5 shrink-0 text-accent" />
                              <span className="truncate">
                                {listing.address || `${listing.ward ? `${listing.ward}, ` : ''}${listing.district}, Hà Nội`}
                              </span>
                            </div>

                            {/* Specs Row: Area, Bedrooms, Bathrooms, Floors */}
                            <div className="mt-3 flex items-center justify-between border-t border-border/80 pt-2.5 text-[11px] text-text-secondary">
                              <div className="flex items-center gap-1 font-bold text-text-primary">
                                <Maximize2 className="h-3.5 w-3.5 text-accent" />
                                <span>{listing.area} m²</span>
                              </div>

                              <div className="flex items-center gap-1">
                                <Bed className="h-3.5 w-3.5 text-slate-400" />
                                <span>{listing.bedrooms} PN</span>
                              </div>

                              <div className="flex items-center gap-1">
                                <Bath className="h-3.5 w-3.5 text-slate-400" />
                                <span>{listing.bathrooms} PT</span>
                              </div>

                              {listing.floors > 0 && (
                                <div className="flex items-center gap-1">
                                  <Building className="h-3.5 w-3.5 text-slate-400" />
                                  <span>{listing.floors} tầng</span>
                                </div>
                              )}
                            </div>

                            {/* Bottom Card Actions */}
                            <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleSaveListing(listing.id);
                                }}
                                className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50/80 hover:bg-red-100 px-3 py-1.5 text-xs font-bold text-red-600 transition-colors"
                                title="Bỏ lưu tin này"
                              >
                                <HeartCrack className="h-3.5 w-3.5" />
                                <span>Bỏ lưu</span>
                              </button>

                              <div className="flex items-center gap-2">
                                <Link
                                  href={`/reports/${listing.id}`}
                                  onClick={(e) => e.stopPropagation()}
                                  className="inline-flex items-center gap-1 rounded-xl bg-accent/10 px-2.5 py-1.5 text-xs font-bold text-accent hover:bg-accent hover:text-white transition-colors"
                                  title="Xem thẩm định quy hoạch & giá AI"
                                >
                                  <Sparkles className="h-3 w-3" />
                                  <span>Báo cáo AI</span>
                                </Link>

                                <span className="inline-flex items-center gap-0.5 text-xs font-bold text-primary group-hover:text-accent group-hover:translate-x-0.5 transition-all">
                                  <span>Chi tiết</span>
                                  <ArrowRight className="h-3.5 w-3.5" />
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* TAB 3: REPORTS */}
              {activeTab === 'reports' && (
                <motion.div
                  key="tab-reports"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-3xl border border-border bg-white p-6 shadow-sm space-y-4"
                >
                  <h3 className="text-sm font-extrabold text-text-primary">Báo cáo Thẩm định AI gần đây</h3>
                  <div className="rounded-2xl bg-page-bg p-4 border border-border flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-accent" />
                        <span className="text-xs font-bold text-text-primary">Phố Hào Nam, Đống Đa</span>
                        <span className="rounded bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-bold">
                          Điểm 82/100
                        </span>
                      </div>
                      <p className="text-[11px] text-text-muted">Tạo ngày 2025-08-20 · Được hưởng lợi từ Metro 2A</p>
                    </div>

                    <Link
                      href="/reports/1"
                      className="rounded-lg bg-accent px-3 py-1.5 text-xs font-bold text-white shadow-sm"
                    >
                      Xem chi tiết
                    </Link>
                  </div>
                </motion.div>
              )}

              {/* TAB 5: PACKAGES */}
              {activeTab === 'packages' && (
                <motion.div
                  key="tab-packages"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-3xl border border-border bg-white p-6 shadow-sm space-y-4"
                >
                  <h3 className="text-sm font-extrabold text-text-primary">Thông tin gói hội viên PRO</h3>
                  <div className="rounded-2xl bg-orange-50/40 border border-orange-200 p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-accent">GÓI PRO (799.000 đ/tháng)</span>
                      <span className="text-[11px] font-bold text-success">Đang hoạt động</span>
                    </div>
                    <p className="text-xs text-text-secondary">Đã kích hoạt quyền lợi đăng 50 tin và 30 Báo cáo AI chuyên sâu mỗi tháng.</p>
                    <Link
                      href="/pricing"
                      className="inline-block rounded-xl bg-accent px-4 py-2 text-xs font-bold text-white shadow-sm"
                    >
                      Gia hạn hoặc Nâng cấp Agency
                    </Link>
                  </div>
                </motion.div>
              )}

              {/* TAB 6: NOTIFICATIONS */}
              {activeTab === 'notifications' && (
                <motion.div
                  key="tab-notifications"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <NotificationBell
                    variant="embedded"
                    onUnreadCountChange={setUnreadNotifCount}
                  />
                </motion.div>
              )}
            </AnimatePresence>

          </div>

        </div>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-page-bg flex items-center justify-center text-xs font-bold text-text-muted">Đang tải bảng điều khiển...</div>}>
      <DashboardContent />
    </Suspense>
  );
}

