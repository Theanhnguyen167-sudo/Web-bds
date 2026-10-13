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
  AlertCircle,
  Users,
  Crown,
  Zap,
  Lock,
  Building2,
  Mail,
  Smartphone,
  Award,
  ChevronDown,
  UserCheck,
  X,
} from 'lucide-react';
import { NotificationBell } from '@/components/notification/NotificationBell';

import { TEST_SELLERS_LIST, DemoSeller, getListingExpiryInfo } from '@/lib/services/listing-service';
import { Pencil } from 'lucide-react';
import {
  getPackageDefinition,
  DEFAULT_AGENCY_TEAM,
  DEFAULT_DEDICATED_MANAGER,
  AgencyTeamMember,
  PackageTierId,
} from '@/lib/packages/package-config';

type TabType = 'listings' | 'appointments' | 'reports' | 'saved' | 'packages' | 'notifications' | 'agency-team';

const VALID_TABS: TabType[] = ['listings', 'appointments', 'reports', 'saved', 'packages', 'notifications', 'agency-team'];

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

  const {
    user,
    setUser,
    listings,
    setListings,
    savedListingIds,
    toggleSaveListing,
    addToast,
    deleteListing,
    renewListing,
    toggleFeaturedListing,
    upgradeUserPackage,
  } = useApp();
  const pkgDef = getPackageDefinition(user?.package);
  const maxListings = user?.listingsLimit ?? pkgDef.limits.maxListings;

  const [teamMembers, setTeamMembers] = useState<AgencyTeamMember[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('hanoi_agency_team');
        if (stored) return JSON.parse(stored);
      } catch {}
    }
    return DEFAULT_AGENCY_TEAM;
  });
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [newMemberForm, setNewMemberForm] = useState({
    name: '',
    phone: '',
    email: '',
    role: 'agent' as 'leader' | 'agent' | 'assistant',
    maxListingsQuota: 50,
  });

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberForm.name.trim() || !newMemberForm.phone.trim()) {
      addToast('Vui lòng nhập họ tên và số điện thoại môi giới', 'warning');
      return;
    }
    const member: AgencyTeamMember = {
      id: `agent_${Date.now()}`,
      name: newMemberForm.name.trim(),
      phone: newMemberForm.phone.trim(),
      email: newMemberForm.email.trim() || `${newMemberForm.phone.trim()}@agency.vn`,
      role: newMemberForm.role,
      assignedListings: 0,
      maxListingsQuota: Number(newMemberForm.maxListingsQuota) || 50,
      activeListings: 0,
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80`,
      joinedDate: new Date().toISOString().split('T')[0],
    };
    const updated = [member, ...teamMembers];
    setTeamMembers(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('hanoi_agency_team', JSON.stringify(updated));
    }
    setIsAddMemberModalOpen(false);
    setNewMemberForm({ name: '', phone: '', email: '', role: 'agent', maxListingsQuota: 50 });
    addToast(`🎉 Đã thêm môi giới ${member.name} vào sàn thành công!`, 'success');
  };

  const handleDeleteMember = (memberId: string, memberName: string) => {
    const updated = teamMembers.filter((m) => m.id !== memberId);
    setTeamMembers(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('hanoi_agency_team', JSON.stringify(updated));
    }
    addToast(`Đã xoá môi giới ${memberName} khỏi sàn`, 'info');
  };

  const handleQuickSwitchPackage = (packageId: string) => {
    upgradeUserPackage(packageId);
    const def = getPackageDefinition(packageId);
    addToast(`⚡ Đã kích hoạt nhanh Gói ${def.name}! Toàn bộ hạn mức và đặc quyền công nghệ đã được nạp.`, 'success');
  };

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

  const remainingListings = Math.max(0, maxListings - userListings.length);
  const featuredUsed = userListings.filter((l) => l.isFeatured).length;
  const remainingFeatured = Math.max(0, pkgDef.limits.featuredListings - featuredUsed);
  const aiReportsUsed = user?.aiReportsUsed || 0;
  const aiReportsLimit = user?.aiReportsLimit ?? pkgDef.limits.aiReports;
  const remainingAiReports = Math.max(0, aiReportsLimit - aiReportsUsed);

  // Chuyển đổi nhanh tài khoản Seller để test Section 23
  const handleSwitchSeller = (seller: DemoSeller) => {
    const sPkgDef = getPackageDefinition(seller.package || 'pro');
    const updatedUser: any = {
      id: seller.id,
      name: seller.name,
      email: seller.email,
      phone: seller.phone,
      role: 'agent',
      package: sPkgDef.name,
      packageExpiry: '2026-12-31',
      aiReportsUsed: 3,
      aiReportsLimit: sPkgDef.limits.aiReports,
      listingsCount: listings.filter((l) => l.ownerId === seller.id).length,
      listingsLimit: sPkgDef.limits.maxListings,
      listingDurationDays: sPkgDef.limits.listingDurationDays,
      featuredListingsUsed: 1,
      featuredListingsLimit: sPkgDef.limits.featuredListings,
      activeListings: listings.filter((l) => l.ownerId === seller.id && l.status === 'active').length,
      avatar: seller.avatar,
    };
    setUser(updatedUser);
    addToast(`👤 Đã chuyển phiên làm việc sang: ${seller.name} (${sPkgDef.name.toUpperCase()})`, 'info');
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
        {
          id: 'packages',
          label: 'Gói Hội Viên',
          icon: Tag,
          badge: user?.package?.toUpperCase() || 'FREE',
        },
        {
          id: 'agency-team',
          label: 'Đội Ngũ Môi Giới',
          icon: Users,
          badge: user?.package?.toLowerCase() === 'agency' ? 'AGENCY' : 'VIP',
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-page-bg flex flex-col">
      <Navbar />

      <main className="flex-1 container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">

        {/* SECTION 23: MULTI-SELLER & PACKAGE TESTING HUB */}
        <div className="mb-6 rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50/90 via-sky-50/60 to-purple-50/60 p-4 space-y-3 text-xs shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-black text-[10px] uppercase tracking-wider shadow-2xs">
                🧪 Testing Hub
              </span>
              <div>
                <p className="font-bold text-slate-800">
                  Đang đăng nhập: <span className="text-indigo-600 font-black">{user?.name}</span> · Gói: <span className="font-black text-orange-600">{pkgDef.name}</span>
                </p>
                <p className="text-[11px] text-slate-500">Chuyển nhanh tài khoản hoặc gói cước để kiểm thử hạn mức và đặc quyền:</p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold text-slate-500">Seller:</span>
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
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Package Switcher */}
          <div className="pt-2 border-t border-indigo-100 flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
              <Zap className="h-3 w-3 text-amber-500" />
              <span>Thử nhanh gói:</span>
            </span>
            {(['free', 'basic', 'pro', 'agency'] as PackageTierId[]).map((pKey) => {
              const isCur = pkgDef.id === pKey;
              return (
                <button
                  key={pKey}
                  type="button"
                  onClick={() => handleQuickSwitchPackage(pKey)}
                  className={`px-3 py-1 rounded-lg text-xs font-black transition-all ${
                    isCur
                      ? 'bg-orange-600 text-white shadow-sm ring-2 ring-orange-400/60'
                      : 'bg-white text-slate-700 hover:bg-orange-50 border border-slate-200'
                  }`}
                >
                  {pKey === 'free' ? 'Free (3 tin)' : pKey === 'basic' ? 'Basic (20 tin)' : pKey === 'pro' ? 'Pro (50 tin)' : 'Agency (250 tin)'}
                  {isCur && ' ✓'}
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
                <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase ${
                  pkgDef.id === 'agency'
                    ? 'bg-indigo-900 text-amber-300'
                    : pkgDef.id === 'pro'
                    ? 'bg-orange-500 text-white'
                    : pkgDef.id === 'basic'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-200 text-slate-700'
                }`}>
                  Gói {pkgDef.name} {pkgDef.badgeLabel}
                </span>
              </div>
              <p className="text-xs text-text-secondary mt-0.5">{user?.email || 'an@example.com'}</p>
              <p className="text-[11px] text-text-muted mt-1">Hạn gói: {user?.packageExpiry || '2026-12-31'}</p>
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
              {/* Thẻ 1: Hạn mức tin đăng & Lượt còn lại */}
              <div className="rounded-2xl border border-border bg-white p-4 shadow-sm space-y-1">
                <div className="flex items-center justify-between text-[11px] text-text-muted font-semibold">
                  <span>Hạn mức tin ({pkgDef.name})</span>
                  <span className="text-[10px] font-black uppercase px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
                    {pkgDef.badgeLabel}
                  </span>
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <p className="text-2xl font-black text-text-primary">
                    {userListings.length} / {maxListings}
                  </p>
                  {userListings.some(l => l.status === 'pending') && (
                    <span className="text-[10px] font-extrabold text-amber-700 bg-amber-100 border border-amber-300 px-1.5 py-0.2 rounded-full animate-pulse">
                      {userListings.filter(l => l.status === 'pending').length} chờ duyệt
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between text-[10px] font-bold pt-1">
                  <span className={remainingListings > 0 ? "text-emerald-600" : "text-rose-600"}>
                    {remainingListings > 0 ? `Còn lại ${remainingListings} lượt đăng` : 'Đã hết hạn mức'}
                  </span>
                  <span className="text-slate-400">Hạn: {pkgDef.limits.listingDurationDays} ngày/tin</span>
                </div>
              </div>

              {/* Thẻ 2: Tin nổi bật / VIP (Top 1 Tìm Kiếm) */}
              <div className="rounded-2xl border border-border bg-white p-4 shadow-sm space-y-1">
                <div className="flex items-center justify-between text-[11px] text-text-muted font-semibold">
                  <span>Tin nổi bật (Top 1)</span>
                  <span className="text-[10px] font-bold text-amber-600 flex items-center gap-0.5">
                    <Crown className="h-3 w-3" /> VIP
                  </span>
                </div>
                <p className="text-2xl font-black text-amber-500 mt-1">
                  {featuredUsed} / {pkgDef.limits.featuredListings}
                </p>
                <div className="flex items-center justify-between text-[10px] font-bold pt-1">
                  <span className={remainingFeatured > 0 ? "text-amber-600" : "text-slate-500"}>
                    {pkgDef.limits.featuredListings > 0 ? `Còn ${remainingFeatured} lượt đẩy Top` : 'Gói Free (0 tin)'}
                  </span>
                  <span className="text-slate-400">Ghim đầu tìm kiếm</span>
                </div>
              </div>

              {/* Thẻ 3: Thời hạn hiển thị tin theo gói */}
              <div className="rounded-2xl border border-border bg-white p-4 shadow-sm space-y-1">
                <span className="text-[11px] text-text-muted font-semibold">Thời hạn hiển thị tin</span>
                <p className="text-2xl font-black text-indigo-600 mt-1">
                  {pkgDef.limits.listingDurationDays} <span className="text-xs font-bold text-slate-500">ngày/tin</span>
                </p>
                <div className="text-[10px] font-bold text-slate-500 pt-1 flex items-center gap-1">
                  <Clock className="h-3 w-3 text-slate-400" />
                  <span className="truncate">
                    {pkgDef.id === 'free' ? 'Sau 7 ngày tự động ẩn' : `Gói ${pkgDef.name} (${pkgDef.limits.listingDurationDays} ngày/tin)`}
                  </span>
                </div>
              </div>

              {/* Thẻ 4: Báo cáo AI & Tin đã lưu */}
              <div className="rounded-2xl border border-border bg-white p-4 shadow-sm space-y-1">
                <div className="flex items-center justify-between text-[11px] text-text-muted font-semibold">
                  <span>Báo cáo AI ({aiReportsLimit} lượt)</span>
                  <span className="text-rose-600 font-bold flex items-center gap-0.5">
                    <Heart className="h-2.5 w-2.5 fill-rose-600" /> {savedListingIds.length}
                  </span>
                </div>
                <p className="text-2xl font-black text-text-primary mt-1">
                  {aiReportsUsed} / {aiReportsLimit}
                </p>
                <div className="flex items-center justify-between text-[10px] font-bold pt-1">
                  <span className="text-emerald-600">Còn lại {remainingAiReports} lượt AI</span>
                  <span className="text-slate-400">{savedListingIds.length} tin đã lưu</span>
                </div>
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

                  {/* Banner Hạn Mức Gói Cước & Thời Hạn Hiển Thị */}
                  <div className="rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50/80 via-sky-50/50 to-orange-50/30 p-4 space-y-2.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-indigo-600 text-white font-black text-[11px] uppercase tracking-wider">
                            <Layers className="w-3 h-3" />
                            Gói {pkgDef.name} ({pkgDef.badgeLabel})
                          </span>
                          <span className="text-xs font-bold text-slate-800">
                            • Còn lại: <strong className={remainingListings > 0 ? "text-emerald-600 font-black" : "text-rose-600 font-black"}>{remainingListings}</strong> / {maxListings} lượt đăng
                          </span>
                          <span className="text-xs font-bold text-slate-800">
                            • Thời hạn: <strong className="text-indigo-600 font-black">{pkgDef.limits.listingDurationDays} ngày/tin</strong>
                          </span>
                          {pkgDef.limits.featuredListings > 0 && (
                            <span className="text-xs font-bold text-amber-700 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-md flex items-center gap-1">
                              <Crown className="w-3 h-3 text-amber-600" />
                              Còn {remainingFeatured} / {pkgDef.limits.featuredListings} lượt Top 1
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          {pkgDef.id === 'free' ? (
                            <span>
                              ⚠️ <strong>Quy định Gói Free:</strong> Mỗi tin đăng có thời hạn <strong>7 ngày</strong>. Sau 7 ngày, tin sẽ tự động hết hạn và không hiển thị trên bản đồ quy hoạch cũng như bộ lọc tìm kiếm của khách hàng. Nâng cấp lên gói trả phí để có thời hạn 30 - 90 ngày và quyền ghim tin lên <strong>TOP 1 Tìm Kiếm</strong>.
                            </span>
                          ) : (
                            <span>
                              ✨ <strong>Đặc quyền Gói {pkgDef.name}:</strong> Thời hạn tin đăng lên đến <strong>{pkgDef.limits.listingDurationDays} ngày</strong>. Được cấp <strong>{pkgDef.limits.featuredListings} lượt đẩy Top 1</strong> ưu tiên đứng đầu kết quả tìm kiếm khi có khách hàng lọc mua bán đất/nhà phù hợp!
                            </span>
                          )}
                        </p>
                      </div>

                      <div className="shrink-0 flex items-center gap-2">
                        {pkgDef.id === 'free' ? (
                          <button
                            type="button"
                            onClick={() => handleSelectTab('packages')}
                            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5"
                          >
                            <Crown className="w-3.5 h-3.5 text-yellow-200" />
                            <span>Nâng cấp để giữ tin 90 ngày & Đẩy Top 1</span>
                          </button>
                        ) : remainingListings === 0 ? (
                          <button
                            type="button"
                            onClick={() => handleSelectTab('packages')}
                            className="px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-sm transition-all"
                          >
                            Hết hạn mức - Nâng cấp gói
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  {userListings.length === 0 ? (
                    <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50">
                      <Home className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                      <h4 className="font-bold text-sm text-slate-700">Tài khoản này chưa có tin đăng nào</h4>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                        Tạo tin đăng mới ngay để tiếp cận hàng nghìn khách hàng tiềm năng tại Hà Nội ({pkgDef.limits.listingDurationDays} ngày hiển thị/tin).
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
                      {userListings.map((listing) => {
                        const expiry = getListingExpiryInfo(listing);
                        const isFeatured = Boolean(listing.isFeatured);

                        return (
                          <div
                            key={listing.id}
                            className={`group flex flex-col gap-3 rounded-2xl border p-4 transition-all shadow-sm ${
                              isFeatured
                                ? 'border-amber-300 bg-amber-50/20 hover:border-amber-400'
                                : expiry.isExpired
                                ? 'border-rose-200 bg-rose-50/15'
                                : 'border-border hover:border-accent hover:bg-orange-50/10'
                            }`}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div className="flex items-center gap-3.5">
                                <Link
                                  href={`/listings/${listing.id}`}
                                  className="shrink-0 block relative"
                                >
                                  <img
                                    src={listing.images[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400'}
                                    alt={listing.title}
                                    className="h-16 w-24 rounded-xl object-cover hover:opacity-90 transition-opacity"
                                  />
                                  {isFeatured && (
                                    <span className="absolute top-1 left-1 bg-amber-500 text-white text-[8px] font-black px-1.5 py-0.2 rounded shadow-xs flex items-center gap-0.5">
                                      <Crown className="w-2 h-2" /> Top 1
                                    </span>
                                  )}
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

                                    {/* Huy hiệu Top 1 VIP nếu được ghim nổi bật */}
                                    {isFeatured && (
                                      <span className="rounded-full bg-amber-500 text-white px-2 py-0.5 text-[9px] font-black flex items-center gap-1 shadow-2xs">
                                        <Crown className="h-2.5 w-2.5 fill-white" /> TOP 1 TÌM KIẾM
                                      </span>
                                    )}

                                    {/* Trạng thái duyệt của tin đăng */}
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
                                    ) : expiry.isExpired ? (
                                      <span className="rounded-full bg-rose-100 text-rose-800 border border-rose-300 px-2 py-0.5 text-[9px] font-extrabold flex items-center gap-1">
                                        ⌛ Hết hạn (Đã tự động ẩn)
                                      </span>
                                    ) : (
                                      <span className="rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[9px] font-extrabold flex items-center gap-1">
                                        ✓ Đang hiển thị
                                      </span>
                                    )}

                                    {/* Huy hiệu đếm ngược thời hạn tin đăng */}
                                    {expiry.isExpired ? (
                                      <span className="rounded-full bg-slate-100 text-slate-700 border border-slate-300 px-2 py-0.5 text-[9px] font-semibold flex items-center gap-1">
                                        Hết hạn: {expiry.formattedExpiry}
                                      </span>
                                    ) : expiry.daysRemaining <= 3 ? (
                                      <span className="rounded-full bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 text-[9px] font-extrabold flex items-center gap-1">
                                        ⚠️ Sắp hết hạn: Còn {expiry.daysRemaining} ngày
                                      </span>
                                    ) : (
                                      <span className="rounded-full bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 text-[9px] font-semibold flex items-center gap-1">
                                        <Clock className="h-2.5 w-2.5" /> Còn {expiry.daysRemaining} ngày hiển thị (Hạn: {expiry.formattedExpiry})
                                      </span>
                                    )}
                                  </div>

                                  <Link
                                    href={`/listings/${listing.id}`}
                                    className="text-xs font-bold text-text-primary hover:text-accent transition-colors line-clamp-1 mt-1 block cursor-pointer"
                                  >
                                    {listing.title}
                                  </Link>
                                  <div className="flex items-center gap-2 text-[11px] text-text-muted mt-0.5 flex-wrap">
                                    <span>{listing.district}, Hà Nội</span>
                                    <span>•</span>
                                    <span>Ngày đăng: <strong>{listing.createdAt ? new Date(listing.createdAt).toLocaleDateString('vi-VN') : 'Mới đăng'}</strong></span>
                                    <span>•</span>
                                    <span>Mã: <code className="font-mono text-[10px] text-slate-500">{listing.id}</code></span>
                                  </div>
                                </div>
                              </div>

                              {/* Action buttons */}
                              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center flex-wrap">
                                {/* Nút Ghim / Bỏ Ghim TOP 1 TÌM KIẾM */}
                                {isFeatured ? (
                                  <button
                                    type="button"
                                    onClick={async (e) => {
                                      e.stopPropagation();
                                      await toggleFeaturedListing(listing.id, false);
                                    }}
                                    className="flex items-center gap-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 px-2.5 py-1.5 text-xs font-bold transition-all shadow-2xs"
                                    title="Tin đang ghim ở vị trí Top 1 khi khách tìm mua theo nhu cầu. Nhấn để hủy ghim."
                                  >
                                    <Crown className="h-3.5 w-3.5 text-amber-600 fill-amber-500" />
                                    <span>Đang Top 1</span>
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={async (e) => {
                                      e.stopPropagation();
                                      if (pkgDef.limits.featuredListings === 0) {
                                        addToast('Gói Free không có lượt đẩy Top 1. Vui lòng nâng cấp gói Basic, Pro hoặc Agency!', 'warning');
                                        handleSelectTab('packages');
                                        return;
                                      }
                                      if (remainingFeatured <= 0) {
                                        addToast(`Bạn đã sử dụng hết ${pkgDef.limits.featuredListings} lượt đẩy Top 1 của gói. Vui lòng nâng cấp thêm!`, 'warning');
                                        return;
                                      }
                                      await toggleFeaturedListing(listing.id, true);
                                    }}
                                    className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-bold transition-all ${
                                      pkgDef.limits.featuredListings > 0 && remainingFeatured > 0
                                        ? 'bg-amber-50 hover:bg-amber-500 hover:text-white text-amber-700 border border-amber-200'
                                        : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                                    }`}
                                    title="Đẩy tin lên vị trí Top 1 khi khách hàng tìm kiếm hoặc lọc theo nhu cầu phù hợp"
                                  >
                                    <Crown className="h-3.5 w-3.5" />
                                    <span>Đẩy Top 1</span>
                                  </button>
                                )}

                                {/* Nút Gia hạn tin đăng (+durationDays) */}
                                <button
                                  type="button"
                                  onClick={async (e) => {
                                    e.stopPropagation();
                                    await renewListing(listing.id, pkgDef.limits.listingDurationDays);
                                  }}
                                  className="flex items-center gap-1 rounded-lg bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 border border-emerald-200 px-2.5 py-1.5 text-xs font-bold transition-all"
                                  title={`Gia hạn thêm ${pkgDef.limits.listingDurationDays} ngày hiển thị theo gói ${pkgDef.name}`}
                                >
                                  <RefreshCw className="h-3.5 w-3.5" />
                                  <span>Gia hạn (+{pkgDef.limits.listingDurationDays} ngày)</span>
                                </button>

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
                                  title="Báo cáo phân tích AI"
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

                            {/* Cảnh báo tin hết hạn và nút Gia hạn nhanh */}
                            {expiry.isExpired && (
                              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div className="flex items-start gap-2">
                                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                                  <div>
                                    <span className="font-bold text-[11px] text-rose-900">Tin đã hết hạn ngày {expiry.formattedExpiry}:</span>
                                    <p className="text-[11px] text-rose-700 mt-0.5">
                                      Tin đăng này đã tự động ẩn khỏi kết quả tìm kiếm công khai và bản đồ quy hoạch. Nhấn &quot;Gia hạn ngay&quot; để tiếp tục hiển thị thêm {pkgDef.limits.listingDurationDays} ngày.
                                    </p>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={async (e) => {
                                    e.stopPropagation();
                                    await renewListing(listing.id, pkgDef.limits.listingDurationDays);
                                  }}
                                  className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shrink-0 transition-colors shadow-2xs cursor-pointer"
                                >
                                  <RefreshCw className="w-3.5 h-3.5" />
                                  <span>Gia hạn ngay (+{pkgDef.limits.listingDurationDays} ngày)</span>
                                </button>
                              </div>
                            )}

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
                        );
                      })}
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
                  className="rounded-3xl border border-border bg-white p-6 sm:p-8 shadow-sm space-y-6"
                >
                  {/* Active Package Banner */}
                  <div className={`rounded-3xl p-6 sm:p-8 border shadow-sm relative overflow-hidden ${
                    pkgDef.id === 'agency'
                      ? 'bg-gradient-to-br from-[#0a1128] via-[#141e3d] to-[#1e1b4b] text-white border-indigo-900'
                      : pkgDef.id === 'pro'
                      ? 'bg-gradient-to-br from-orange-50 via-white to-amber-50 border-orange-300 ring-2 ring-orange-500/20'
                      : pkgDef.id === 'basic'
                      ? 'bg-gradient-to-br from-blue-50 via-white to-sky-50 border-blue-300'
                      : 'bg-gradient-to-br from-slate-50 via-white to-gray-50 border-slate-200'
                  }`}>
                    {/* Background Glow */}
                    <div className="absolute top-0 right-0 w-80 h-80 bg-orange-400/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-black/10 dark:border-white/10">
                      <div>
                        <div className="flex items-center gap-2.5 mb-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                            pkgDef.id === 'agency'
                              ? 'bg-amber-400 text-slate-950'
                              : pkgDef.id === 'pro'
                              ? 'bg-orange-500 text-white'
                              : pkgDef.id === 'basic'
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-200 text-slate-700'
                          }`}>
                            {pkgDef.badgeLabel}
                          </span>
                          <span className={`inline-flex items-center gap-1.5 text-xs font-bold ${
                            pkgDef.id === 'agency' ? 'text-emerald-400' : 'text-emerald-600'
                          }`}>
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            Đang hoạt động
                          </span>
                        </div>

                        <h2 className={`text-2xl sm:text-3xl font-black tracking-tight ${
                          pkgDef.id === 'agency' ? 'text-white' : 'text-[#0a1128]'
                        }`}>
                          Gói {pkgDef.name} ({pkgDef.subtitle})
                        </h2>

                        <p className={`text-xs mt-1 font-medium ${
                          pkgDef.id === 'agency' ? 'text-slate-300' : 'text-slate-600'
                        }`}>
                          {pkgDef.monthlyPrice === 0
                            ? 'Miễn phí trải nghiệm cá nhân'
                            : `${pkgDef.monthlyPrice.toLocaleString('vi-VN')} đ/tháng · Hạn dùng: ${user?.packageExpiry || '2026-12-31'}`}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 flex-wrap">
                        <Link
                          href="/pricing"
                          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs shadow-lg shadow-orange-500/25 transition-all flex items-center gap-2"
                        >
                          <Crown className="h-4 w-4" />
                          <span>{pkgDef.id === 'agency' ? 'Gia hạn gói' : 'Nâng cấp gói cao hơn'}</span>
                        </Link>
                      </div>
                    </div>

                    {/* 4 Live Quota Progress Meters */}
                    <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
                      {/* Metric 1: Tin đăng BĐS */}
                      <div className={`p-4 rounded-2xl border ${
                        pkgDef.id === 'agency' ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'
                      }`}>
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="font-bold flex items-center gap-1.5">
                            <Home className="h-3.5 w-3.5 text-orange-500" />
                            Tin đăng BĐS
                          </span>
                          <span className="font-black">
                            {userListings.length}/{maxListings}
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-200/50 overflow-hidden mb-1.5">
                          <div
                            className="h-full bg-orange-500 rounded-full"
                            style={{ width: `${Math.min(100, Math.round((userListings.length / maxListings) * 100))}%` }}
                          />
                        </div>
                        <p className="text-[10px] text-slate-500">
                          Thời hạn hiển thị <strong>{pkgDef.limits.listingDurationDays} ngày</strong>/tin
                        </p>
                      </div>

                      {/* Metric 2: Tin nổi bật */}
                      <div className={`p-4 rounded-2xl border ${
                        pkgDef.id === 'agency' ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'
                      }`}>
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="font-bold flex items-center gap-1.5">
                            <Crown className="h-3.5 w-3.5 text-amber-500" />
                            Tin nổi bật tháng
                          </span>
                          <span className="font-black">
                            {user?.featuredListingsUsed || 0}/{pkgDef.limits.featuredListings}
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-200/50 overflow-hidden mb-1.5">
                          <div
                            className="h-full bg-amber-500 rounded-full"
                            style={{
                              width: pkgDef.limits.featuredListings > 0
                                ? `${Math.min(100, Math.round(((user?.featuredListingsUsed || 0) / pkgDef.limits.featuredListings) * 100))}%`
                                : '0%'
                            }}
                          />
                        </div>
                        <p className="text-[10px] text-slate-500">
                          {pkgDef.limits.featuredListings > 0
                            ? `Còn ${Math.max(0, pkgDef.limits.featuredListings - (user?.featuredListingsUsed || 0))} lượt ghim VIP`
                            : 'Không có (Mở từ Basic)'}
                        </p>
                      </div>

                      {/* Metric 3: Báo cáo AI */}
                      <div className={`p-4 rounded-2xl border ${
                        pkgDef.id === 'agency' ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'
                      }`}>
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="font-bold flex items-center gap-1.5">
                            <Sparkles className="h-3.5 w-3.5 text-accent" />
                            Báo cáo AI & Định giá
                          </span>
                          <span className="font-black">
                            {user?.aiReportsUsed || 0}/{user?.aiReportsLimit ?? pkgDef.limits.aiReports}
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-200/50 overflow-hidden mb-1.5">
                          <div
                            className="h-full bg-purple-500 rounded-full"
                            style={{
                              width: (user?.aiReportsLimit ?? pkgDef.limits.aiReports) > 0
                                ? `${Math.min(100, Math.round(((user?.aiReportsUsed || 0) / (user?.aiReportsLimit ?? pkgDef.limits.aiReports)) * 100))}%`
                                : '0%'
                            }}
                          />
                        </div>
                        <p className="text-[10px] text-slate-500">
                          {pkgDef.limits.aiReports > 0
                            ? `Còn ${Math.max(0, (user?.aiReportsLimit ?? pkgDef.limits.aiReports) - (user?.aiReportsUsed || 0))} lượt phân tích`
                            : 'Không có (Mở từ Basic)'}
                        </p>
                      </div>

                      {/* Metric 4: Đặc quyền quy hoạch */}
                      <div className={`p-4 rounded-2xl border ${
                        pkgDef.id === 'agency' ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'
                      }`}>
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="font-bold flex items-center gap-1.5">
                            <Layers className="h-3.5 w-3.5 text-blue-500" />
                            Cấp độ Bản đồ
                          </span>
                          <span className="font-black text-[11px] text-emerald-500">
                            {pkgDef.features.planningLevel === 'basic' ? 'Cơ bản' : pkgDef.features.planningLevel === 'detailed' ? 'Chi tiết' : '2030 & Giá đất'}
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-200/50 overflow-hidden mb-1.5">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{
                              width: pkgDef.features.planningLevel === 'basic' ? '33%' : pkgDef.features.planningLevel === 'detailed' ? '66%' : '100%'
                            }}
                          />
                        </div>
                        <p className="text-[10px] text-slate-500 truncate">
                          {pkgDef.features.canExportPDF ? 'Hỗ trợ Xuất file PDF' : 'Chưa hỗ trợ PDF'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Privileges Checklist Section */}
                  <div className="rounded-3xl border border-slate-200 p-6 space-y-4">
                    <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-emerald-600" />
                      <span>Đặc quyền đã được kích hoạt cho Gói {pkgDef.name}</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {pkgDef.privilegesDisplay.map((priv, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200"
                        >
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                          <span className="font-bold text-slate-800">{priv}</span>
                        </div>
                      ))}
                      <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                        <span className="font-bold text-slate-800">
                          Kênh hỗ trợ: {pkgDef.features.supportLevel}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Dev Sandbox Quick Package Tester */}
                  <div className="rounded-2xl border border-dashed border-slate-300 p-4 bg-slate-50/80 space-y-2.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-700 flex items-center gap-1.5">
                        <Zap className="h-3.5 w-3.5 text-amber-500" />
                        <span>Kích hoạt nhanh các gói để kiểm thử tính năng (Dev Sandbox):</span>
                      </span>
                      <span className="text-[11px] text-slate-500">Áp dụng tức thì vào tài khoản</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {(['free', 'basic', 'pro', 'agency'] as PackageTierId[]).map((pkgKey) => {
                        const isCurrent = pkgDef.id === pkgKey;
                        return (
                          <button
                            key={pkgKey}
                            type="button"
                            onClick={() => handleQuickSwitchPackage(pkgKey)}
                            className={`p-2.5 rounded-xl font-bold transition-all text-xs flex items-center justify-center gap-1.5 ${
                              isCurrent
                                ? 'bg-orange-600 text-white shadow-sm ring-2 ring-orange-400'
                                : 'bg-white text-slate-700 hover:bg-orange-50 border border-slate-200'
                            }`}
                          >
                            <span>{pkgKey === 'free' ? 'Gói Free' : pkgKey === 'basic' ? 'Gói Basic' : pkgKey === 'pro' ? 'Gói Pro' : 'Gói Agency'}</span>
                            {isCurrent && <span className="text-[10px] bg-white text-orange-600 px-1 rounded font-black">✓</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 7: AGENCY TEAM */}
              {activeTab === 'agency-team' && (
                <motion.div
                  key="tab-agency-team"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  {pkgDef.id === 'agency' || user?.role === 'admin' ? (
                    <div className="space-y-6">
                      {/* Agency Header & Actions */}
                      <div className="rounded-3xl border border-indigo-200 bg-gradient-to-r from-indigo-900 via-[#0a1128] to-purple-950 p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black uppercase mb-2">
                            <Building2 className="h-3.5 w-3.5" />
                            <span>Đặc Quyền Gói Agency</span>
                          </div>
                          <h2 className="text-2xl font-black">Quản Trị Đội Ngũ Môi Giới & Sàn Giao Dịch</h2>
                          <p className="text-xs text-slate-300 mt-1 max-w-xl">
                            Phân bổ hạn mức 250 tin đăng, 40 tin nổi bật và 150 báo cáo AI cho các chuyên viên môi giới trực thuộc sàn.
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => setIsAddMemberModalOpen(true)}
                          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-slate-950 font-black text-xs shadow-md transition-all flex items-center justify-center gap-1.5 shrink-0"
                        >
                          <PlusCircle className="h-4 w-4" />
                          <span>+ Thêm Môi Giới Vào Sàn</span>
                        </button>
                      </div>

                      {/* Dedicated Account Manager Card */}
                      <div className="rounded-3xl border border-amber-200 bg-gradient-to-r from-amber-50/80 via-orange-50/40 to-amber-50/80 p-6 shadow-sm">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <img
                              src={DEFAULT_DEDICATED_MANAGER.avatar}
                              alt={DEFAULT_DEDICATED_MANAGER.name}
                              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-amber-400 shadow-md shrink-0"
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-amber-500 text-white">
                                  Dedicated VIP Manager
                                </span>
                                <h3 className="text-base font-black text-slate-900">{DEFAULT_DEDICATED_MANAGER.name}</h3>
                              </div>
                              <p className="text-xs text-slate-600 mt-0.5">{DEFAULT_DEDICATED_MANAGER.title}</p>
                              <div className="flex items-center gap-4 text-xs font-bold text-slate-800 mt-2 flex-wrap">
                                <span className="flex items-center gap-1">
                                  <Phone className="h-3.5 w-3.5 text-amber-600" />
                                  <span>{DEFAULT_DEDICATED_MANAGER.hotlineVip}</span>
                                </span>
                                <span className="flex items-center gap-1">
                                  <Mail className="h-3.5 w-3.5 text-amber-600" />
                                  <span>{DEFAULT_DEDICATED_MANAGER.email}</span>
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="inline-block px-3 py-1 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs">
                              Hỗ trợ trực tiếp 24/7 (Phản hồi &lt;5p)
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Team Members List Table */}
                      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                            <Users className="h-4 w-4 text-indigo-600" />
                            <span>Danh sách Chuyên viên Môi giới ({teamMembers.length} thành viên)</span>
                          </h3>
                          <button
                            type="button"
                            onClick={() => setIsAddMemberModalOpen(true)}
                            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                          >
                            <PlusCircle className="h-3.5 w-3.5" />
                            <span>Thêm môi giới</span>
                          </button>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200">
                              <tr>
                                <th className="p-3">Họ Tên & Avatar</th>
                                <th className="p-3">Vai Trò</th>
                                <th className="p-3">Liên Hệ</th>
                                <th className="p-3">Hạn Mức Đăng Tin</th>
                                <th className="p-3">Tin Đang Hoạt Động</th>
                                <th className="p-3 text-right">Thao Tác</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {teamMembers.map((member) => (
                                <tr key={member.id} className="hover:bg-slate-50/80 transition-colors">
                                  <td className="p-3 flex items-center gap-3">
                                    <img
                                      src={member.avatar}
                                      alt={member.name}
                                      className="w-9 h-9 rounded-xl object-cover border border-slate-200"
                                    />
                                    <div>
                                      <p className="font-bold text-slate-900">{member.name}</p>
                                      <p className="text-[10px] text-slate-400">Tham gia: {member.joinedDate}</p>
                                    </div>
                                  </td>
                                  <td className="p-3">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                                      member.role === 'leader'
                                        ? 'bg-amber-100 text-amber-800'
                                        : 'bg-blue-100 text-blue-800'
                                    }`}>
                                      {member.role === 'leader' ? 'Trưởng nhóm' : 'Môi giới'}
                                    </span>
                                  </td>
                                  <td className="p-3">
                                    <p className="font-semibold text-slate-700">{member.phone}</p>
                                    <p className="text-[10px] text-slate-400">{member.email}</p>
                                  </td>
                                  <td className="p-3">
                                    <div className="space-y-1 max-w-[140px]">
                                      <div className="flex justify-between text-[11px] font-bold">
                                        <span>{member.assignedListings}/{member.maxListingsQuota} tin</span>
                                      </div>
                                      <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                                        <div
                                          className="h-full bg-indigo-600 rounded-full"
                                          style={{ width: `${Math.round((member.assignedListings / member.maxListingsQuota) * 100)}%` }}
                                        />
                                      </div>
                                    </div>
                                  </td>
                                  <td className="p-3">
                                    <span className="font-black text-emerald-600">{member.activeListings} tin</span>
                                  </td>
                                  <td className="p-3 text-right">
                                    <div className="flex items-center justify-end gap-1.5">
                                      <button
                                        type="button"
                                        onClick={() => addToast(`Đang phân bổ lại hạn mức cho ${member.name}`, 'info')}
                                        className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 font-bold text-[11px] text-slate-700 transition-colors cursor-pointer"
                                      >
                                        Phân bổ chỉ tiêu
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteMember(member.id, member.name)}
                                        className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                        title="Xoá môi giới"
                                      >
                                        <Trash2 className="h-3.5 w-3.5" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Locked Teaser for non-Agency */
                    <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 text-center space-y-6 shadow-sm">
                      <div className="w-16 h-16 rounded-3xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center mx-auto shadow-sm">
                        <Lock className="h-8 w-8" />
                      </div>

                      <div className="max-w-md mx-auto space-y-2">
                        <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-indigo-100 text-indigo-800">
                          Đặc quyền Gói Agency (Doanh Nghiệp)
                        </span>
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                          Quản Trị Đội Ngũ Môi Giới & Sàn BĐS
                        </h2>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          Tính năng cho phép chủ sàn phân bổ hạn mức 250 tin đăng, 40 tin nổi bật và quản lý hiệu suất bán hàng của từng môi giới, cùng sự hỗ trợ của Chuyên viên tài khoản riêng Dedicated Account Manager 24/7.
                        </p>
                      </div>

                      <div className="flex items-center justify-center gap-3">
                        <Link
                          href="/payment/checkout?packageId=agency&billing=monthly"
                          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#0a1128] via-indigo-900 to-purple-900 hover:from-black hover:to-indigo-950 text-white font-black text-xs shadow-lg transition-all flex items-center gap-2"
                        >
                          <Crown className="h-4 w-4 text-amber-400" />
                          <span>Nâng Cấp Gói Agency Ngay (1.999.000 đ/tháng) →</span>
                        </Link>
                      </div>
                    </div>
                  )}
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
      {/* Modal Thêm Môi Giới Cho Sàn (Agency Only) */}
      <AnimatePresence>
        {isAddMemberModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center">
                    <Users className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">Thêm Môi Giới Vào Sàn</h3>
                    <p className="text-[10px] text-slate-400">Phân quyền và hạn mức đăng tin gói Agency</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddMemberModalOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleAddMember} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Họ và tên môi giới *</label>
                  <input
                    type="text"
                    required
                    value={newMemberForm.name}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, name: e.target.value })}
                    placeholder="VD: Nguyễn Văn Bình"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Số điện thoại *</label>
                    <input
                      type="tel"
                      required
                      value={newMemberForm.phone}
                      onChange={(e) => setNewMemberForm({ ...newMemberForm, phone: e.target.value })}
                      placeholder="0987..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={newMemberForm.email}
                      onChange={(e) => setNewMemberForm({ ...newMemberForm, email: e.target.value })}
                      placeholder="email@..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Vai trò</label>
                    <select
                      value={newMemberForm.role}
                      onChange={(e) => setNewMemberForm({ ...newMemberForm, role: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                    >
                      <option value="agent">Môi giới viên</option>
                      <option value="leader">Trưởng nhóm kinh doanh</option>
                      <option value="assistant">Trợ lý sàn</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Chỉ tiêu tin đăng</label>
                    <input
                      type="number"
                      min={1}
                      max={250}
                      value={newMemberForm.maxListingsQuota}
                      onChange={(e) => setNewMemberForm({ ...newMemberForm, maxListingsQuota: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsAddMemberModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Huỷ
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span>Xác nhận thêm</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
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

