'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { useApp } from '@/lib/context/AppContext';
import { formatCurrencyVND, formatPricePerM2 } from '@/lib/utils';
import { CodeBadge } from '@/components/common/CodeBadge';
import { ReferralAgentConnect } from '@/components/dashboard/ReferralAgentConnect';
import { MyClientsTab } from '@/components/dashboard/MyClientsTab';
import { FinancesTab } from '@/components/dashboard/finances/FinancesTab';
import { getUserAgentCode, getUserOwnerCode } from '@/lib/identification';
import {
  Home,
  Sparkles,
  Heart,
  HeartCrack,
  Tag,
  PlusCircle,
  Trash2,
  ExternalLink,
  ShieldCheck,
  Clock,
  CheckCircle2,
  Layers,
  RefreshCw,
  Check,
  MapPin,
  Maximize2,
  Bed,
  Bath,
  Building,
  UserCheck,
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
  ChevronDown,
  FileText,
  Wallet,
  X,
  LayoutGrid,
  ClipboardList,
  Handshake,
  Camera,
  Briefcase,
  Headphones,
  Pencil,
} from 'lucide-react';
import { NotificationBell } from '@/components/notification/NotificationBell';
import { BuyerOverviewTab } from '@/components/dashboard/BuyerOverviewTab';
import { OwnerOverviewTab } from '@/components/dashboard/OwnerOverviewTab';
import { OwnerSurveysTab } from '@/components/dashboard/OwnerSurveysTab';
import { OwnerLeadsTab } from '@/components/dashboard/OwnerLeadsTab';
import { OwnerBrokersTab } from '@/components/dashboard/OwnerBrokersTab';
import { OwnerProfileTab } from '@/components/dashboard/OwnerProfileTab';
import { OwnerSupportTab } from '@/components/dashboard/OwnerSupportTab';

import { getListingExpiryInfo } from '@/lib/services/listing-service';
import { getListingUrl } from '@/lib/listing-slug';
import { mockListings } from '@/lib/mock-data';
import {
  getPackageDefinition,
  DEFAULT_AGENCY_TEAM,
  DEFAULT_DEDICATED_MANAGER,
  AgencyTeamMember,
  PackageTierId,
} from '@/lib/packages/package-config';

type TabType =
  | 'overview'
  | 'listings'
  | 'appointments'
  | 'reports'
  | 'saved'
  | 'packages'
  | 'notifications'
  | 'agency-team'
  | 'contracts'
  | 'referral'
  | 'clients'
  | 'finances'
  | 'buyer-requests'
  | 'owner-overview'
  | 'owner-surveys'
  | 'owner-leads'
  | 'owner-brokers'
  | 'owner-profile'
  | 'owner-support';

const VALID_TABS: TabType[] = [
  'overview',
  'listings',
  'appointments',
  'reports',
  'saved',
  'packages',
  'notifications',
  'agency-team',
  'contracts',
  'referral',
  'clients',
  'finances',
  'buyer-requests',
  'owner-overview',
  'owner-surveys',
  'owner-leads',
  'owner-brokers',
  'owner-profile',
  'owner-support',
];

interface MenuItem {
  id: TabType;
  label: string;
  sublabel?: string;
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

  const queryRole = searchParams.get('role');

  // Nhận diện vai trò chuẩn xác và linh hoạt theo query param hoặc thuộc tính user
  const isOwnerUser =
    queryRole === 'owner' ||
    (!queryRole && (user?.role === 'owner' || user?.email === 'chunha@hanoirealty.vn' || Boolean(user?.name && user.name.includes('Chủ nhà'))));

  const isBuyerUser =
    !isOwnerUser &&
    (queryRole === 'buyer' ||
      (!queryRole && (user?.role === 'buyer' || user?.role === 'user' || user?.role === 'customer' || user?.email === 'khachhang@hanoirealty.vn' || Boolean(user?.name && user.name.includes('Khách mua')))) ||
      (!queryRole && !user?.role));

  const isAgentUser = !isOwnerUser && !isBuyerUser;

  // Chuyển đổi vai trò nhanh để kiểm thử trực quan tức thì
  const handleSwitchDemoRole = (targetRole: 'buyer' | 'owner' | 'agent') => {
    let demoName = 'Nguyễn Minh Tuấn (Khách mua)';
    let demoEmail = 'khachhang@hanoirealty.vn';
    let demoPhone = '0912 345 678';
    let demoPackage = 'Free';
    let defaultTab: TabType = 'overview';

    if (targetRole === 'owner') {
      demoName = 'Phạm Quốc Dũng';
      demoEmail = 'chunha@hanoirealty.vn';
      demoPhone = '0988 765 432';
      demoPackage = 'Free';
      defaultTab = 'owner-overview';
    } else if (targetRole === 'agent') {
      demoName = 'Trần Thị Thu Hà (Môi giới VIP)';
      demoEmail = 'moigioi@hanoirealty.vn';
      demoPhone = '0977 889 900';
      demoPackage = 'Pro';
      defaultTab = 'listings';
    }

    const updatedUser = {
      ...(user || {}),
      id: `${targetRole}_demo_01`,
      name: demoName,
      email: demoEmail,
      phone: demoPhone,
      role: targetRole,
      package: demoPackage,
      agentCode: targetRole === 'agent' ? 'MG-00102' : undefined,
      ownerCode: targetRole === 'owner' ? 'CN-00086' : undefined,
    };

    setUser(updatedUser as any);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('hanoi_current_user', JSON.stringify(updatedUser));
      } catch {}
      const url = new URL(window.location.href);
      url.searchParams.set('role', targetRole);
      url.searchParams.set('tab', defaultTab);
      window.history.replaceState({}, '', url.toString());
    }

    setActiveTab(defaultTab);
    addToast(
      `Đã chuyển sang vai trò: ${targetRole === 'buyer' ? 'Khách hàng (Buyer)' : targetRole === 'owner' ? 'Chủ nhà (Owner)' : 'Môi giới (Agent)'}`,
      'info'
    );
  };

  const [activeTab, setActiveTab] = useState<TabType>(() => {
    if (tabQuery && VALID_TABS.includes(tabQuery)) {
      return tabQuery;
    }
    if (isOwnerUser) return 'owner-overview';
    if (isBuyerUser) return 'overview';
    return 'listings';
  });
  const [unreadNotifCount, setUnreadNotifCount] = useState<number>(3);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [appointmentFilter, setAppointmentFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');
  const [appointmentSearch, setAppointmentSearch] = useState<string>('');
  const [appointmentViewMode, setAppointmentViewMode] = useState<'list' | 'calendar'>('calendar');
  const [selectedScheduleDate, setSelectedScheduleDate] = useState<Date>(new Date());
  const [selectedScheduleListingId, setSelectedScheduleListingId] = useState<string>('all');
  const [buyerRequests, setBuyerRequests] = useState<any[]>([]);

  // Sync tab with URL query parameter on load
  useEffect(() => {
    if (tabQuery && VALID_TABS.includes(tabQuery)) {
      setActiveTab(tabQuery);
    } else if (isOwnerUser && (activeTab === 'overview' || activeTab === 'listings')) {
      setActiveTab('owner-overview');
    } else if (isBuyerUser && (activeTab === 'listings' || activeTab === 'owner-overview')) {
      setActiveTab('overview');
    }
  }, [tabQuery, isOwnerUser, isBuyerUser]);

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

  // Load and sync buyer requests từ API có kiểm thực quyền và fallback
  const [buyerRequestsLoading, setBuyerRequestsLoading] = useState<boolean>(false);

  const fetchBuyerRequests = useCallback(async () => {
    if (!user) {
      setBuyerRequests([]);
      return;
    }
    setBuyerRequestsLoading(true);
    try {
      const headers: Record<string, string> = {
        'x-user-id': user.id,
        'x-user-role': user.role || 'buyer',
      };
      if (user.email) headers['x-user-email'] = user.email;

      const res = await fetch(`/api/buyer-requests?userId=${encodeURIComponent(user.id)}&role=${encodeURIComponent(user.role || 'buyer')}`, {
        headers,
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setBuyerRequests(json.data);
          return;
        }
      }
    } catch (err) {
      console.error('Error fetching buyer requests:', err);
    } finally {
      setBuyerRequestsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchBuyerRequests();
    window.addEventListener('hanoi_buyer_requests_updated', fetchBuyerRequests);
    window.addEventListener('storage', fetchBuyerRequests);
    return () => {
      window.removeEventListener('hanoi_buyer_requests_updated', fetchBuyerRequests);
      window.removeEventListener('storage', fetchBuyerRequests);
    };
  }, [fetchBuyerRequests]);

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

  // MENU DÀNH RIÊNG CHO KHÁCH HÀNG (7 CHỨC NĂNG THEO MẪU ẢNH 2)
  const buyerMenuItems: MenuItem[] = [
    {
      id: 'overview',
      label: 'Tổng quan',
      sublabel: 'Tiến độ tìm mua và việc cần làm',
      icon: LayoutGrid,
    },
    {
      id: 'buyer-requests',
      label: 'Nhu cầu mua của tôi',
      sublabel: 'Đăng, sửa, quản lý nhu cầu',
      icon: ClipboardList,
      count: buyerRequests.length,
      badge: buyerRequests.filter((r: any) => r.status === 'pending').length > 0
        ? `${buyerRequests.filter((r: any) => r.status === 'pending').length} CHỜ`
        : undefined,
    },
    {
      id: 'saved',
      label: 'BĐS yêu thích',
      sublabel: 'Lưu nhà và theo dõi thay đổi',
      icon: Heart,
      count: savedListingIds.length,
    },
    {
      id: 'appointments',
      label: 'Lịch xem nhà',
      sublabel: 'Đặt lịch, xác nhận, đổi lịch',
      icon: CalendarDays,
      count: userAppointments.length,
      badge: userAppointments.filter((a) => a.status === 'pending').length > 0
        ? `${userAppointments.filter((a) => a.status === 'pending').length} MỚI`
        : undefined,
    },
    {
      id: 'referral',
      label: 'Môi giới hỗ trợ tôi',
      sublabel: 'CTV phụ trách và lịch sử hỗ trợ',
      icon: UserCheck,
      badge: user?.referredByAgentCode ? 'ĐÃ KẾT NỐI' : undefined,
    },
    {
      id: 'contracts',
      label: 'Giao dịch của tôi',
      sublabel: 'Đề nghị mua, hợp đồng, đặt cọc',
      icon: Handshake,
      count: 1,
      badge: 'HD',
    },
    {
      id: 'notifications',
      label: 'Thông báo & tài khoản',
      sublabel: 'Cập nhật và thông tin cá nhân',
      icon: Bell,
      badge: unreadNotifCount > 0 ? `${unreadNotifCount} MỚI` : undefined,
    },
  ];

  // MENU DÀNH RIÊNG CHO CHỦ NHÀ (11 CHỨC NĂNG THEO MẪU ẢNH CHỦ NHÀ)
  const ownerMenuGroups: MenuGroup[] = [
    {
      title: 'QUẢN LÝ BÁN BẤT ĐỘNG SẢN',
      items: [
        {
          id: 'owner-overview',
          label: 'Tổng quan',
          sublabel: 'Tiến độ bán nhà và công việc cần xử lý',
          icon: LayoutGrid,
        },
        {
          id: 'listings',
          label: 'Bất động sản của tôi',
          sublabel: 'Gửi bán, hồ sơ và tình trạng xác minh',
          icon: Home,
          count: userListings.length > 0 ? userListings.length : 1,
        },
        {
          id: 'owner-surveys',
          label: 'Lịch khảo sát & quay chụp',
          sublabel: 'Đặt lịch, xác nhận và thay đổi lịch',
          icon: Camera,
        },
        {
          id: 'appointments',
          label: 'Lịch xem nhà',
          sublabel: 'Thiết lập giờ trống, xác nhận khách đến xem',
          icon: CalendarDays,
          count: userAppointments.length || 2,
          badge: userAppointments.filter((a) => a.status === 'pending').length > 0
            ? `${userAppointments.filter((a) => a.status === 'pending').length} MỚI`
            : undefined,
        },
        {
          id: 'owner-leads',
          label: 'Khách quan tâm & đề nghị mua',
          sublabel: 'Theo dõi khách, phản hồi giá, thương lượng',
          icon: Users,
          count: 2,
        },
        {
          id: 'owner-brokers',
          label: 'Hoạt động môi giới',
          sublabel: 'Theo dõi CTV đang khai thác BĐS',
          icon: Briefcase,
        },
        {
          id: 'contracts',
          label: 'Giao dịch của tôi',
          sublabel: 'Hợp đồng, đặt cọc, công chứng, bàn giao',
          icon: Handshake,
          count: 1,
          badge: 'HD',
        },
        {
          id: 'finances',
          label: 'Phí môi giới & thanh toán',
          sublabel: 'Phí dịch vụ, công nợ và chứng từ',
          icon: Wallet,
        },
      ],
    },
    {
      title: 'TÀI KHOẢN & HỖ TRỢ',
      items: [
        {
          id: 'notifications',
          label: 'Thông báo',
          sublabel: 'Lịch hẹn, hồ sơ, đề nghị mua và giao dịch',
          icon: Bell,
          badge: unreadNotifCount > 0 ? `${unreadNotifCount} MỚI` : undefined,
        },
        {
          id: 'owner-profile',
          label: 'Tài khoản cá nhân',
          sublabel: 'Thông tin, xác minh danh tính và bảo mật',
          icon: User,
        },
        {
          id: 'owner-support',
          label: 'Hỗ trợ & khiếu nại',
          sublabel: 'Gửi yêu cầu hỗ trợ và theo dõi xử lý',
          icon: Headphones,
        },
      ],
    },
  ];

  // Sidebar Menu categorized (DÀNH CHO MÔI GIỚI / ADMIN)
  const menuGroups: MenuGroup[] = [
    {
      title: 'QUẢN LÝ',
      items: [
        ...(isAgentUser
          ? [
              { id: 'clients' as TabType, label: 'Khách hàng của tôi', icon: Users },
            ]
          : []),
        { id: 'finances' as TabType, label: 'Tiền & thanh toán', icon: Wallet },
        { id: 'listings', label: isOwnerUser ? 'BĐS đã gửi bán' : 'Quản lý tin đăng', icon: Home, count: userListings.length },
        {
          id: 'buyer-requests' as TabType,
          label: 'Nhu cầu mua của tôi',
          icon: Search,
          count: buyerRequests.length,
          badge: buyerRequests.filter((r: any) => r.status === 'pending').length > 0
            ? `${buyerRequests.filter((r: any) => r.status === 'pending').length} CHỜ`
            : undefined,
        },
        {
          id: 'appointments',
          label: 'Lịch hẹn xem nhà',
          icon: CalendarDays,
          count: userAppointments.length,
          badge: userAppointments.filter((a) => a.status === 'pending').length > 0
            ? `${userAppointments.filter((a) => a.status === 'pending').length} MỚI`
            : undefined,
        },
        { id: 'saved', label: 'Tin đã lưu & Giỏ nhà', icon: Heart, count: savedListingIds.length },
        { id: 'contracts', label: 'Hợp đồng & Đặt cọc', icon: FileText, count: 1, badge: 'HD' },
      ],
    },
    {
      title: 'TÀI KHOẢN & DỊCH VỤ',
      items: [
        ...(isBuyerUser
          ? [
              {
                id: 'referral' as TabType,
                label: 'Môi giới giới thiệu bạn',
                icon: UserCheck,
                badge: user?.referredByAgentCode ? 'ĐÃ KẾT NỐI' : undefined,
              },
            ]
          : []),
        {
          id: 'notifications',
          label: 'Thông báo',
          icon: Bell,
          badge: unreadNotifCount > 0 ? `${unreadNotifCount} MỚI` : undefined,
        },
        ...(isAgentUser
          ? [
              {
                id: 'packages' as TabType,
                label: 'Gói Hội Viên',
                icon: Tag,
                badge: user?.package?.toUpperCase() || 'FREE',
              },
              {
                id: 'agency-team' as TabType,
                label: 'Đội Ngũ Môi Giới',
                icon: Users,
                badge: user?.package?.toLowerCase() === 'agency' ? 'AGENCY' : 'VIP',
              },
            ]
          : []),
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-page-bg flex flex-col">
      <Navbar />

      <main className="flex-1 container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        {/* THANH CHUYỂN NHANH VAI TRÒ ĐỂ KIỂM TRA PHÂN QUYỀN TRỰC TIẾP */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-xs font-bold text-slate-500">Chế độ xem vai trò:</span>
            <div className="inline-flex rounded-xl bg-slate-100 p-1 gap-1">
              <button
                type="button"
                onClick={() => handleSwitchDemoRole('buyer')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isBuyerUser
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <span>👤 Khách hàng (Buyer)</span>
              </button>
              <button
                type="button"
                onClick={() => handleSwitchDemoRole('owner')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isOwnerUser
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <span>🏠 Chủ nhà (Owner)</span>
              </button>
              <button
                type="button"
                onClick={() => handleSwitchDemoRole('agent')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isAgentUser
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <span>💼 Môi giới (Agent)</span>
              </button>
            </div>
          </div>

          <div className="text-[11px] font-semibold text-slate-400">
            {isBuyerUser && '✓ Đang hiển thị 7 chức năng dành riêng cho Khách hàng'}
            {isOwnerUser && '✓ Đang hiển thị giao diện dành riêng cho Chủ nhà BĐS'}
            {isAgentUser && '✓ Đang hiển thị giao diện dành riêng cho CTV / Môi giới'}
          </div>
        </div>

        {/* User Profile Header Banner */}
        <div className="rounded-3xl border border-border bg-white p-6 sm:p-8 shadow-sm mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={
                isOwnerUser
                  ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80'
                  : user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
              }
              alt="avatar"
              className="h-16 w-16 rounded-2xl object-cover ring-4 ring-accent/20"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-text-primary">
                  {isOwnerUser ? 'Phạm Quốc Dũng' : user?.name || 'Môi giới BĐS'}
                </h1>
                {isOwnerUser ? (
                  <span className="rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase bg-orange-100 text-orange-700">
                    Chủ nhà BĐS
                  </span>
                ) : isBuyerUser ? (
                  <span className="rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase bg-slate-100 text-slate-700">
                    Khách mua cá nhân
                  </span>
                ) : (
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
                )}
              </div>
              <p className="text-xs text-text-secondary mt-0.5">
                {isOwnerUser ? 'chunha@hanoirealty.vn' : user?.email || 'an@example.com'}
              </p>
              <p className="text-[11px] text-text-muted mt-1">Hạn gói: {user?.packageExpiry || '2026-12-31'}</p>

              {/* Mã định danh tài khoản: mỗi tài khoản CHỈ có 1 mã duy nhất theo đúng loại vai trò đăng ký */}
              <div className="flex flex-wrap items-center gap-2 mt-2">
                {isOwnerUser ? (
                  <CodeBadge code="CN-00086" label="Mã Chủ nhà" size="sm" />
                ) : (
                  <>
                    {user && (user.role === 'agent' || user.role === 'broker' || user.role === 'agency') && getUserAgentCode(user) && (
                      <CodeBadge code={getUserAgentCode(user)!} label="Mã CTV & Giới thiệu" size="sm" />
                    )}
                    {user && user.role === 'owner' && getUserOwnerCode(user) && (
                      <CodeBadge code={getUserOwnerCode(user)!} label="Mã Chủ nhà" size="sm" />
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href={isBuyerUser ? "/buyer-request" : "/listings/create"}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 text-xs font-black text-white shadow-lg shadow-accent/25 hover:bg-accent-hover transition-all"
            >
              {isBuyerUser ? <Search className="h-4 w-4" /> : <PlusCircle className="h-4 w-4" />}
              <span>{isBuyerUser ? "Đăng tìm BĐS" : isOwnerUser ? "Gửi bán BĐS mới" : "Đăng tin BĐS mới"}</span>
            </Link>
          </div>
        </div>

        {/* Banner điều hướng sang Bàn làm việc Môi giới (Broker Workspace) */}
        <div className="rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-4 sm:p-5 text-white mb-8 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-blue-800/50">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md text-blue-300 shrink-0">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold leading-tight flex items-center gap-2">
                <span>Bàn Làm Việc Môi Giới & Kho Nhà Mở (CTV / TPKD)</span>
                <span className="rounded-full bg-blue-500/30 px-2 py-0.5 text-[10px] font-extrabold text-blue-200 border border-blue-400/40">Kho mở</span>
              </h2>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Khai thác kho nguồn mở không chia địa bàn, bảo lưu khách hàng bằng chứng từ số, quản lý lịch hẹn dẫn khách & ví hoa hồng 5 trạng thái.
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/broker"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-2.5 text-xs font-bold text-white shadow-md transition-all shrink-0 self-start sm:self-auto"
          >
            <span>Vào Bàn Làm Việc Môi Giới</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Dashboard Grid: Grouped Sidebar Menu (Left) | Main Panel Content (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Left Menu Categorized Tabs */}
          <div className="space-y-4">
            {isOwnerUser ? (
              // GIAO DIỆN MENU DÀNH RIÊNG CHO CHỦ NHÀ (11 CHỨC NĂNG CHUẨN MOCKUP)
              <div className="rounded-3xl border border-slate-200/90 bg-white p-3 shadow-xs space-y-2">
                {/* Profile Header Đầu Menu Theo Đúng Mockup */}
                <div className="flex items-center gap-3 p-2.5">
                  <div className="w-11 h-11 rounded-full bg-orange-50 border border-orange-200/80 text-orange-600 flex items-center justify-center shrink-0">
                    <Home className="w-5 h-5 stroke-[1.8]" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-slate-900 leading-tight truncate">
                      Phạm Quốc Dũng
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">
                      Chủ nhà BĐS • Mã CN-00086
                    </p>
                  </div>
                </div>

                <div className="h-px bg-slate-100 my-1 mx-1" />

                {/* 2 Nhóm Menu Chủ Nhà */}
                {ownerMenuGroups.map((group, gIdx) => (
                  <div key={group.title} className="space-y-1">
                    {gIdx > 0 && <div className="h-px bg-slate-100 my-2 mx-1" />}
                    <div className="px-2.5 pt-1 pb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      {group.title}
                    </div>

                    <div className="space-y-1">
                      {group.items.map((item) => {
                        const Icon = item.icon;
                        const isActive =
                          activeTab === item.id ||
                          (item.id === 'owner-overview' && activeTab === 'overview');

                        return (
                          <button
                            key={item.id}
                            onClick={() => handleSelectTab(item.id)}
                            className={`group relative flex w-full items-center justify-between rounded-2xl p-2.5 text-left transition-all ${
                              isActive
                                ? 'bg-[#fff8f5] border border-orange-100/90 text-orange-950 shadow-sm'
                                : 'bg-transparent text-slate-700 hover:bg-slate-50 border border-transparent'
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div
                                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                                  isActive
                                    ? 'bg-white text-orange-600 shadow-xs border border-orange-100/70'
                                    : 'text-slate-500 group-hover:text-slate-800'
                                }`}
                              >
                                <Icon className="w-5 h-5 stroke-[1.8]" />
                              </div>

                              <div className="min-w-0">
                                <h4
                                  className={`text-sm font-bold leading-tight ${
                                    isActive ? 'text-slate-900' : 'text-slate-800'
                                  }`}
                                >
                                  {item.label}
                                </h4>
                                <p
                                  className={`text-xs mt-0.5 leading-snug truncate ${
                                    isActive ? 'text-slate-600' : 'text-slate-400'
                                  }`}
                                >
                                  {item.sublabel}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0 pl-2">
                              {item.count !== undefined && item.count > 0 && (
                                <span
                                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                    isActive
                                      ? 'bg-orange-100 text-orange-700'
                                      : 'bg-slate-100 text-slate-600'
                                  }`}
                                >
                                  {item.count}
                                </span>
                              )}
                              {item.badge && (
                                <span className="rounded-full px-2 py-0.5 text-[10px] font-extrabold bg-orange-500 text-white">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {/* Nút mũi tên cuộn ở đáy card theo đúng mockup */}
                <div className="pt-2 pb-1 flex justify-center">
                  <div className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ) : isBuyerUser ? (
              // GIAO DIỆN RIÊNG DÀNH CHO KHÁCH HÀNG (7 CHỨC NĂNG THEO MẪU ẢNH 2)
              <div className="space-y-2">
                <div className="space-y-2">
                  {buyerMenuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;

                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelectTab(item.id)}
                        className={`group relative flex w-full items-center justify-between rounded-2xl p-3 text-left transition-all ${
                          isActive
                            ? 'bg-slate-900 text-white shadow-md'
                            : 'bg-white text-slate-800 hover:bg-slate-50 border border-slate-200/80'
                        }`}
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          {/* Khung icon bo góc mềm theo đúng Ảnh 2 */}
                          <div
                            className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${
                              isActive
                                ? 'bg-white/15 text-white'
                                : 'bg-slate-100 text-slate-700 group-hover:bg-slate-200'
                            }`}
                          >
                            <Icon className="w-5 h-5 stroke-[1.8]" />
                          </div>

                          <div className="min-w-0">
                            <h4
                              className={`text-sm font-bold leading-tight ${
                                isActive ? 'text-white' : 'text-slate-900'
                              }`}
                            >
                              {item.label}
                            </h4>
                            <p
                              className={`text-xs mt-0.5 leading-snug truncate ${
                                isActive ? 'text-slate-300' : 'text-slate-500'
                              }`}
                            >
                              {item.sublabel}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0 pl-2">
                          {item.count !== undefined && item.count > 0 && (
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                isActive
                                  ? 'bg-white/20 text-white'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {item.count}
                            </span>
                          )}

                          {item.badge && (
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                                item.badge.includes('CHỜ')
                                  ? 'bg-orange-500 text-white'
                                  : item.badge === 'ĐÃ KẾT NỐI'
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-orange-500 text-white'
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              // GIỮ NGUYÊN GIAO DIỆN CỦA CÁC VAI TRÒ KHÁC (CHỦ NHÀ, MÔI GIỚI, ADMIN)
              menuGroups.map((group) => (
                <div key={group.title} className="space-y-1.5">
                  <div className="px-3 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                    {group.title}
                  </div>

                  <div className="space-y-1.5">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;

                      return (
                        <button
                          key={item.id}
                          onClick={() => handleSelectTab(item.id)}
                          className={`group relative flex w-full items-center justify-between rounded-2xl p-3.5 text-xs font-bold transition-all ${
                            isActive
                              ? 'bg-primary text-white shadow-md'
                              : 'bg-white text-text-secondary hover:bg-slate-50 border border-border'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon
                              className={`h-4 w-4 transition-colors ${
                                isActive ? 'text-accent' : 'text-text-muted group-hover:text-primary'
                              }`}
                            />
                            <span>{item.label}</span>
                          </div>

                          {item.count !== undefined && (
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-bold transition-colors ${
                                isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-text-secondary'
                              }`}
                            >
                              {item.count}
                            </span>
                          )}

                          {item.badge && (
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                                item.badge === 'CONNECTED'
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
              ))
            )}
          </div>

          {/* Right Main Content */}
          <div className="lg:col-span-3 space-y-6">

            {/* Quick Metrics Cards: CHỈ hiển thị khi ở tab Quản lý tin đăng và KHÔNG dành cho khách mua */}
            {activeTab === 'listings' && !isBuyerUser && (
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

                {/* Thẻ 4: Tin đã lưu */}
                <div className="rounded-2xl border border-border bg-white p-4 shadow-sm space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-text-muted font-semibold">
                    <span>Tin BĐS đã lưu</span>
                    <span className="text-rose-600 font-bold flex items-center gap-0.5">
                      <Heart className="h-2.5 w-2.5 fill-rose-600" /> {savedListingIds.length}
                    </span>
                  </div>
                  <p className="text-2xl font-black text-text-primary mt-1">
                    {savedListingIds.length} <span className="text-xs font-normal text-slate-400">tin</span>
                  </p>
                  <div className="flex items-center justify-between text-[10px] font-bold pt-1">
                    <span className="text-emerald-600">Đang theo dõi</span>
                    <span className="text-slate-400">Cập nhật giá</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tabbed Content Area */}
            <AnimatePresence mode="wait">
              {/* TAB OVERVIEW CHO CHỦ NHÀ */}
              {(activeTab === 'owner-overview' || (activeTab === 'overview' && isOwnerUser)) && (
                <motion.div
                  key="tab-owner-overview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <OwnerOverviewTab
                    user={user}
                    userListings={userListings}
                    appointments={userAppointments}
                    onNavigateTab={handleSelectTab}
                  />
                </motion.div>
              )}

              {/* TAB 0: OVERVIEW (DÀNH CHO KHÁCH HÀNG THEO MẪU ẢNH 2) */}
              {activeTab === 'overview' && !isOwnerUser && (
                <motion.div
                  key="tab-overview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <BuyerOverviewTab
                    user={user}
                    buyerRequests={buyerRequests}
                    savedListings={savedListings}
                    appointments={userAppointments}
                    onNavigateTab={handleSelectTab}
                  />
                </motion.div>
              )}

              {/* TAB CHỦ NHÀ: LỊCH KHẢO SÁT & QUAY CHỤP */}
              {activeTab === 'owner-surveys' && (
                <motion.div
                  key="tab-owner-surveys"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <OwnerSurveysTab />
                </motion.div>
              )}

              {/* TAB CHỦ NHÀ: KHÁCH QUAN TÂM & ĐỀ NGHỊ MUA */}
              {activeTab === 'owner-leads' && (
                <motion.div
                  key="tab-owner-leads"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <OwnerLeadsTab />
                </motion.div>
              )}

              {/* TAB CHỦ NHÀ: HOẠT ĐỘNG MÔI GIỚI */}
              {activeTab === 'owner-brokers' && (
                <motion.div
                  key="tab-owner-brokers"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <OwnerBrokersTab />
                </motion.div>
              )}

              {/* TAB CHỦ NHÀ: TÀI KHOẢN CÁ NHÂN */}
              {activeTab === 'owner-profile' && (
                <motion.div
                  key="tab-owner-profile"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <OwnerProfileTab />
                </motion.div>
              )}

              {/* TAB CHỦ NHÀ: HỖ TRỢ & KHIẾU NẠI */}
              {activeTab === 'owner-support' && (
                <motion.div
                  key="tab-owner-support"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <OwnerSupportTab />
                </motion.div>
              )}
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
                                  href={getListingUrl(listing)}
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
                                    href={getListingUrl(listing)}
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
                                        addToast('Gói Free không có lượt đẩy Top 1. Vui lòng nâng cấp gói CTV hoặc TPKD!', 'warning');
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

              {/* TAB: NHU CẦU MUA CỦA TÔI (DÀNH CHO NGƯỜI MUA BĐS) */}
              {activeTab === 'buyer-requests' && (
                <motion.div
                  key="tab-buyer-requests"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-3xl border border-border bg-white p-6 shadow-sm space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-4 gap-3">
                    <div>
                      <h3 className="text-sm font-extrabold text-text-primary flex items-center gap-2">
                        <span>Nhu cầu mua BĐS của tôi</span>
                        <span className="rounded-full bg-orange-100 text-orange-700 px-2 py-0.5 text-[10px] font-black">
                          {buyerRequests.length} yêu cầu
                        </span>
                      </h3>
                      <p className="text-xs text-text-secondary mt-0.5">
                        Theo dõi danh sách tiêu chí tìm mua nhà đất đã gửi tới HaNoi Realty (Hoàn toàn miễn phí)
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {(isAgentUser || user?.role === 'admin') && (
                        <Link
                          href="/admin/buyer-requests"
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all"
                        >
                          <ShieldCheck className="h-4 w-4 text-amber-400" />
                          <span>Bàn tiếp nhận vận hành</span>
                        </Link>
                      )}
                      <Link
                        href="/buyer-request"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-600/20 transition-all"
                      >
                        <PlusCircle className="h-4 w-4" />
                        <span>Đăng nhu cầu mới</span>
                      </Link>
                    </div>
                  </div>

                  {buyerRequests.length === 0 ? (
                    <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50">
                      <Search className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                      <h4 className="font-bold text-sm text-slate-700">Chưa có nhu cầu tìm mua nào</h4>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                        Đăng ký tiêu chí căn nhà mơ ước (khu vực, tài chính, hướng nhà) để HaNoi Realty lọc nguồn hàng chính chủ đã xác thực quy hoạch giúp bạn.
                      </p>
                      <Link
                        href="/buyer-request"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-md shadow-orange-600/25 transition-all"
                      >
                        <PlusCircle className="w-4 h-4" />
                        Đăng nhu cầu tìm mua ngay (Miễn phí)
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {buyerRequests.map((req: any) => {
                        const isPaused = req.status === 'cancelled' || req.status === 'paused';
                        return (
                          <div
                            key={req.id || req.code}
                            className={`rounded-2xl border p-4 transition-all shadow-xs space-y-3 ${
                              isPaused
                                ? 'border-slate-200 bg-slate-50/70 opacity-75'
                                : 'border-orange-100 bg-orange-50/20 hover:border-orange-300'
                            }`}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-mono text-xs font-black text-orange-600 bg-orange-100 px-2 py-0.5 rounded-md">
                                  {req.code}
                                </span>
                                <span className="text-xs font-bold text-slate-800">
                                  Khu vực: {Array.isArray(req.target_districts) ? req.target_districts.join(', ') : req.target_districts || 'Hà Nội'}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                  req.status === 'pending'
                                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                    : req.status === 'matched'
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                    : req.status === 'contacted'
                                    ? 'bg-blue-100 text-blue-800 border border-blue-300'
                                    : req.status === 'completed'
                                    ? 'bg-purple-100 text-purple-800 border border-purple-300'
                                    : 'bg-slate-200 text-slate-700'
                                }`}>
                                  {req.status === 'pending'
                                    ? 'Chờ xử lý'
                                    : req.status === 'matched'
                                    ? 'Đã khớp căn'
                                    : req.status === 'contacted'
                                    ? 'Đang liên hệ'
                                    : req.status === 'completed'
                                    ? 'Đã hoàn tất'
                                    : 'Đã tạm dừng'}
                                </span>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                              <div>
                                <span className="text-slate-400 block text-[10px]">Tài chính</span>
                                <strong className="text-orange-600">
                                  {formatCurrencyVND(req.budget_min || 0)} – {formatCurrencyVND(req.budget_max || 0)}
                                </strong>
                              </div>
                              <div>
                                <span className="text-slate-400 block text-[10px]">Loại hình</span>
                                <span className="font-semibold text-slate-700">
                                  {Array.isArray(req.property_types) ? req.property_types.join(', ') : req.property_types || 'Nhà đất'}
                                </span>
                              </div>
                              <div>
                                <span className="text-slate-400 block text-[10px]">Tiêu chí</span>
                                <span className="font-semibold text-slate-700">
                                  Tối thiểu {req.min_area || 30}m² • {req.min_bedrooms || 1} PN
                                </span>
                              </div>
                              <div>
                                <span className="text-slate-400 block text-[10px]">Người liên hệ</span>
                                <span className="font-semibold text-slate-700 truncate block">
                                  {req.contact_name} ({req.contact_phone})
                                </span>
                              </div>
                            </div>

                            {req.notes && (
                              <p className="text-[11px] text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200">
                                <strong>Ghi chú:</strong> {req.notes}
                              </p>
                            )}

                            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                              <span className="text-[10px] text-slate-400">
                                Ngày đăng: {new Date(req.created_at || Date.now()).toLocaleDateString('vi-VN')}
                              </span>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={async () => {
                                    const nextStatus = isPaused ? 'pending' : 'cancelled';
                                    try {
                                      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
                                      if (user) {
                                        headers['x-user-id'] = user.id;
                                        headers['x-user-role'] = user.role || 'buyer';
                                      }
                                      const res = await fetch('/api/buyer-requests', {
                                        method: 'PATCH',
                                        headers,
                                        body: JSON.stringify({ id: req.id, status: nextStatus }),
                                      });
                                      if (res.ok) {
                                        fetchBuyerRequests();
                                        addToast(isPaused ? '▶️ Đã tiếp tục kích hoạt tìm kiếm BĐS' : '⏸️ Đã tạm dừng yêu cầu', 'info');
                                      } else {
                                        addToast('Không thể cập nhật trạng thái', 'error');
                                      }
                                    } catch {
                                      addToast('Lỗi kết nối khi cập nhật', 'error');
                                    }
                                  }}
                                  className="px-2.5 py-1 rounded-lg border border-slate-300 hover:bg-slate-100 font-bold text-[11px] text-slate-700 transition-colors"
                                >
                                  {isPaused ? 'Tiếp tục tìm' : 'Tạm dừng'}
                                </button>
                                <button
                                  type="button"
                                  onClick={async () => {
                                    if (confirm('Bạn có chắc chắn muốn huỷ yêu cầu tìm mua này?')) {
                                      try {
                                        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
                                        if (user) {
                                          headers['x-user-id'] = user.id;
                                          headers['x-user-role'] = user.role || 'buyer';
                                        }
                                        const res = await fetch('/api/buyer-requests', {
                                          method: 'PATCH',
                                          headers,
                                          body: JSON.stringify({ id: req.id, status: 'cancelled' }),
                                        });
                                        if (res.ok) {
                                          fetchBuyerRequests();
                                          addToast('Đã huỷ yêu cầu tìm mua', 'info');
                                        } else {
                                          addToast('Không thể huỷ yêu cầu', 'error');
                                        }
                                      } catch {
                                        addToast('Lỗi kết nối khi huỷ', 'error');
                                      }
                                    }
                                  }}
                                  className="px-2.5 py-1 rounded-lg text-rose-600 hover:bg-rose-50 font-bold text-[11px] transition-colors"
                                >
                                  Huỷ
                                </button>
                              </div>
                            </div>
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

                                {appt.listingId && (() => {
                                  const apptListing = (userListings || []).find((l: any) => l.id === appt.listingId) || mockListings.find((l) => l.id === appt.listingId);
                                  return (
                                    <Link
                                      href={apptListing ? getListingUrl(apptListing) : `/listings/${appt.listingId}`}
                                      className="rounded-xl border border-slate-200 bg-white hover:border-accent hover:text-accent p-2 text-text-muted transition-colors"
                                      title="Xem tin đăng BĐS"
                                    >
                                      <ExternalLink className="h-4 w-4" />
                                    </Link>
                                  );
                                })()}
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
                          onClick={() => router.push(getListingUrl(listing))}
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
                              href={getListingUrl(listing)}
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

                      {/* Metric 3: Tin đã lưu */}
                      <div className={`p-4 rounded-2xl border ${
                        pkgDef.id === 'agency' ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'
                      }`}>
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="font-bold flex items-center gap-1.5">
                            <Heart className="h-3.5 w-3.5 text-rose-500" />
                            Tin BĐS đã lưu
                          </span>
                          <span className="font-black">
                            {savedListingIds.length} tin
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-200/50 overflow-hidden mb-1.5">
                          <div
                            className="h-full bg-rose-500 rounded-full"
                            style={{
                              width: `${Math.min(100, savedListingIds.length * 10)}%`
                            }}
                          />
                        </div>
                        <p className="text-[10px] text-slate-400">
                          Lưu trữ &amp; theo dõi biến động giá
                        </p>
                      </div>

                      {/* Metric 4: Thời hạn hiển thị */}
                      <div className={`p-4 rounded-2xl border ${
                        pkgDef.id === 'agency' ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'
                      }`}>
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="font-bold flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-blue-500" />
                            Thời hạn hiển thị
                          </span>
                          <span className="font-black text-[11px] text-emerald-500">
                            {pkgDef.limits.listingDurationDays} ngày
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-200/50 overflow-hidden mb-1.5">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{
                              width: `${Math.min(100, (pkgDef.limits.listingDurationDays / 90) * 100)}%`
                            }}
                          />
                        </div>
                        <p className="text-[10px] text-slate-500 truncate">
                          Tự động gia hạn theo gói
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

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {(['ctv_free', 'ctv', 'tpkd'] as PackageTierId[]).map((pkgKey) => {
                        const isCurrent = pkgDef.id === pkgKey;
                        const label =
                          pkgKey === 'ctv_free'
                            ? 'CTV Free (0 đ)'
                            : pkgKey === 'ctv'
                            ? 'Gói CTV (189k)'
                            : 'Gói TPKD (499k)';
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
                            <span>{label}</span>
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
                  {/* Khối Mã Định Danh CTV / TPKD & Mã Giới Thiệu Cố Định */}
                  <div className="rounded-2xl border border-orange-200 bg-orange-50/70 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-orange-950 flex items-center gap-1.5">
                        <UserCheck className="h-4 w-4 text-orange-600" />
                        <span>Mã định danh CTV / TPKD &amp; Mã giới thiệu khách hàng:</span>
                      </p>
                      <p className="text-[11.5px] text-slate-600">
                        Mã này được cấp cố định từ Supabase. Khi đổi gói hội viên hoặc thăng cấp lên TPKD, mã vẫn được giữ nguyên vĩnh viễn.
                      </p>
                    </div>
                    <CodeBadge code={(user ? getUserAgentCode(user) : null) || 'MG-00102'} label="Mã CTV & Giới thiệu" />
                  </div>

                  {pkgDef.id === 'agency' || pkgDef.id === 'tpkd' || user?.role === 'admin' ? (
                    <div className="space-y-6">
                      {/* Agency/TPKD Header & Actions */}
                      <div className="rounded-3xl border border-indigo-200 bg-gradient-to-r from-indigo-900 via-[#0a1128] to-purple-950 p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black uppercase mb-2">
                            <Building2 className="h-3.5 w-3.5" />
                            <span>{pkgDef.id === 'tpkd' ? 'Đặc Quyền Gói TPKD Quản Trị' : 'Đặc Quyền Quản Trị Đội Nhóm'}</span>
                          </div>
                          <h2 className="text-2xl font-black">Quản Trị Đội Ngũ Môi Giới & Sàn Giao Dịch</h2>
                          <p className="text-xs text-slate-300 mt-1 max-w-xl">
                            Phân bổ hạn mức 250 tin đăng và 40 tin nổi bật cho các chuyên viên môi giới trực thuộc sàn.
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
                    /* Locked Teaser for non-TPKD / non-Agency */
                    <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 text-center space-y-6 shadow-sm">
                      <div className="w-16 h-16 rounded-3xl bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center mx-auto shadow-sm">
                        <Lock className="h-8 w-8" />
                      </div>

                      <div className="max-w-md mx-auto space-y-2">
                        <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-purple-100 text-purple-800">
                          Đặc quyền Gói Quản Trị TPKD
                        </span>
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                          Quản Trị Đội Nhóm CTV & Môi Giới
                        </h2>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          Tính năng cho phép Trưởng phòng kinh doanh quản lý và điều phối các CTV thành viên, theo dõi tiến độ và nhận thù lao quản lý theo từng giao dịch thành công. Quyền TPKD cần xét duyệt hồ sơ quản trị trước khi cấp quyền.
                        </p>
                      </div>

                      <div className="flex items-center justify-center gap-3">
                        <Link
                          href="/danh-cho-moi-gioi#tpkd"
                          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-800 via-indigo-900 to-purple-950 hover:from-purple-900 hover:to-black text-white font-black text-xs shadow-lg transition-all flex items-center gap-2"
                        >
                          <Crown className="h-4 w-4 text-amber-400" />
                          <span>Tìm hiểu gói TPKD (499.000 đ/tháng) →</span>
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

              {/* TAB: CONTRACTS (HỢP ĐỒNG & ĐẶT CỌC - MÃ HD-XXXXX) */}
              {activeTab === 'contracts' && (
                <motion.div
                  key="tab-contracts"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-3xl border border-border bg-white p-6 sm:p-8 shadow-sm space-y-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-accent" />
                        <h3 className="text-base font-extrabold text-text-primary">
                          Hợp đồng &amp; Thỏa thuận đặt cọc
                        </h3>
                      </div>
                      <p className="text-xs text-text-secondary mt-1">
                        Danh sách các hợp đồng, biên bản đặt cọc có mã định danh HD-XXXXX bảo chứng qua HaNoi Realty.
                      </p>
                    </div>
                  </div>

                  {/* Danh sách hợp đồng mẫu có liên kết mã căn nhà BDS-00125 */}
                  <div className="space-y-3">
                    <div className="rounded-2xl border border-slate-200 p-5 hover:border-orange-300 transition-all bg-slate-50/50 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <CodeBadge code="HD-00035" label="Mã HĐ" />
                          <span className="rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-[10.5px] font-bold">
                            ✓ Đã xác nhận bảo chứng sàn
                          </span>
                        </div>
                        <span className="text-xs font-semibold text-slate-500">Ngày lập: 08/11/2026</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-200/80 text-xs">
                        <div>
                          <p className="text-slate-400 font-medium">BĐS liên kết:</p>
                          <div className="mt-1 flex items-center gap-1.5 font-bold text-slate-800">
                            <CodeBadge code="BDS-00125" label="Mã căn" size="sm" />
                            <span className="truncate">Nhà phố Đống Đa 5 tầng</span>
                          </div>
                        </div>

                        <div>
                          <p className="text-slate-400 font-medium">Tiền đặt cọc bảo chứng:</p>
                          <p className="mt-1 font-extrabold text-rose-600">100.000.000 đ</p>
                        </div>

                        <div>
                          <p className="text-slate-400 font-medium">Chuyên viên phụ trách:</p>
                          <div className="mt-1 flex items-center gap-1 font-semibold text-slate-700">
                            <CodeBadge code="MG-00102" label="Mã CTV" size="sm" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB: REFERRAL (MÔI GIỚI GIỚI THIỆU BẠN - DÀNH CHO KHÁCH MUA) */}
              {activeTab === 'referral' && (
                <motion.div
                  key="tab-referral"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <ReferralAgentConnect
                    buyerEmail={user?.email}
                    buyerId={user?.id}
                    initialAgentCode={user?.referredByAgentCode}
                    onSuccess={(agentCode) => {
                      if (user) {
                        setUser({
                          ...user,
                          referredByAgentCode: agentCode,
                        });
                      }
                    }}
                  />
                </motion.div>
              )}

              {/* TAB: CLIENTS (KHÁCH HÀNG CỦA TÔI - DÀNH CHO MÔI GIỚI / TPKD) */}
              {activeTab === 'clients' && (
                <motion.div
                  key="tab-clients"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <MyClientsTab user={user} appointments={appointments} />
                </motion.div>
              )}

              {/* TAB: FINANCES (TIỀN & THANH TOÁN - CHỦ NHÀ, CTV/TPKD, NGƯỜI MUA, ADMIN) */}
              {activeTab === 'finances' && (
                <motion.div
                  key="tab-finances"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <FinancesTab user={user} />
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

