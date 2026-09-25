'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockListings, mockUser, ListingItem } from '@/lib/mock-data';
import { createClient } from '@/lib/supabase/client';
import { toggleSavedListing, getSavedListings } from '@/lib/supabase/queries/saved';
import { PlanningZoneItem, DEFAULT_PLANNING_ZONES } from '@/lib/planning/planning-utils';
import { auth as firebaseAuth } from '@/lib/firebase/config';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { parseLocationCoordinates } from '@/lib/utils';

export interface ToastItem {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'warning' | 'error';
}

interface AppContextType {
  user: typeof mockUser | null;
  setUser: React.Dispatch<React.SetStateAction<typeof mockUser | null>>;
  listings: ListingItem[];
  setListings: React.Dispatch<React.SetStateAction<ListingItem[]>>;
  savedListingIds: string[];
  toggleSaveListing: (id: string) => Promise<void>;
  activeListingId: string | null;
  setActiveListingId: (id: string | null) => void;
  hoveredListingId: string | null;
  setHoveredListingId: (id: string | null) => void;
  showPlanningOverlay: boolean;
  setShowPlanningOverlay: React.Dispatch<React.SetStateAction<boolean>>;
  toasts: ToastItem[];
  addToast: (message: string, type?: ToastItem['type']) => void;
  removeToast: (id: string) => void;
  addNewListing: (listing: Partial<ListingItem>) => Promise<string>;
  updateListingStatus: (id: string, status: 'active' | 'pending' | 'rejected') => Promise<void>;
  refreshListings: () => Promise<void>;
  planningZones: PlanningZoneItem[];
  setPlanningZones: React.Dispatch<React.SetStateAction<PlanningZoneItem[]>>;
  selectedPlanningZoneId: string | null;
  setSelectedPlanningZoneId: (id: string | null) => void;
  addPlanningZone: (zone: Partial<PlanningZoneItem>) => string;
  importPlanningZones: (newZones: PlanningZoneItem[]) => number;
  deletePlanningZone: (id: string) => void;
  resetPlanningZonesToDefault: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const USER_LISTINGS_STORAGE_KEY = 'hanoi_platform_user_listings';

export const getStoredUserListings = (): ListingItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(USER_LISTINGS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveStoredUserListings = (items: ListingItem[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(USER_LISTINGS_STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.warn('Failed to save user listings to localStorage:', e);
  }
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<typeof mockUser | null>(null);
  const [listings, setListings] = useState<ListingItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(USER_LISTINGS_STORAGE_KEY);
        if (stored) {
          const parsed: ListingItem[] = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const parsedIds = new Set(parsed.map(p => p.id));
            return [...parsed, ...mockListings.filter(m => !parsedIds.has(m.id))];
          }
        }
      } catch {}
    }
    return mockListings;
  });
  const [savedListingIds, setSavedListingIds] = useState<string[]>(['1', '3']);
  const [activeListingId, setActiveListingId] = useState<string | null>(null);
  const [hoveredListingId, setHoveredListingId] = useState<string | null>(null);
  const [showPlanningOverlay, setShowPlanningOverlay] = useState<boolean>(true);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [planningZones, setPlanningZones] = useState<PlanningZoneItem[]>(DEFAULT_PLANNING_ZONES);
  const [selectedPlanningZoneId, setSelectedPlanningZoneId] = useState<string | null>(null);

  // Helper function to sync user profile from Supabase
  const syncSupabaseUser = async (sessionUser: any) => {
    if (!sessionUser) return;
    try {
      const supabase = createClient();
      // Try to fetch custom profile from public.users table
      const { data } = await supabase
        .from('users')
        .select('*')
        .eq('id', sessionUser.id)
        .maybeSingle();
      const profile = data as any;

      const fullName =
        profile?.full_name ||
        sessionUser.user_metadata?.full_name ||
        sessionUser.user_metadata?.name ||
        sessionUser.email?.split('@')[0] ||
        'Thành viên';

      const avatar =
        profile?.avatar_url ||
        sessionUser.user_metadata?.avatar_url ||
        sessionUser.user_metadata?.picture ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80';

      const userRole = (profile?.role as any) || (sessionUser.email?.includes('admin') ? 'admin' : 'user');

      // Gói dịch vụ: Mặc định luôn là 'Free'. Chỉ nhận gói cao hơn nếu user đã thanh toán trong DB hoặc là admin
      let userPackage = 'Free';
      let packageExpiry = 'Vĩnh viễn';
      let aiReportsLimit = 1;

      if (userRole === 'admin') {
        userPackage = 'Agency';
        packageExpiry = '2026-12-31';
        aiReportsLimit = 100;
      } else if (profile?.package && profile.package.toLowerCase() !== 'free') {
        userPackage = profile.package;
        packageExpiry = profile.package_expires_at || profile.packageExpiry || '2026-12-31';
        const pkgLow = userPackage.toLowerCase();
        aiReportsLimit = pkgLow === 'agency' ? 50 : pkgLow === 'pro' ? 20 : 5;
      }

      setUser({
        id: sessionUser.id,
        name: fullName,
        email: sessionUser.email || 'user@example.com',
        phone: profile?.phone || sessionUser.user_metadata?.phone || '',
        role: userRole,
        avatar: avatar,
        package: userPackage,
        packageExpiry: packageExpiry,
        listingsCount: 0,
        activeListings: 0,
        aiReportsUsed: 0,
        aiReportsLimit: aiReportsLimit,
      });

      // Fetch saved listings from Supabase
      try {
        const { data: savedData } = await getSavedListings(sessionUser.id);
        if (savedData && savedData.length > 0) {
          setSavedListingIds(savedData.map((s: any) => s.listing_id));
        }
      } catch {
        // Keep local saved state
      }
    } catch (e) {
      console.error('Error syncing Supabase user:', e);
    }
  };

  const syncFirebaseUser = async (fbUser: FirebaseUser) => {
    try {
      const email = fbUser.email || 'user@example.com';
      const fullName = fbUser.displayName || email.split('@')[0];
      const avatar = fbUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(fullName)}`;
      const userRole = email.includes('admin') ? 'admin' : 'user';

      let userPackage = 'Free';
      let packageExpiry = 'Vĩnh viễn';
      let aiReportsLimit = 1;

      if (userRole === 'admin') {
        userPackage = 'Agency';
        packageExpiry = '2026-12-31';
        aiReportsLimit = 100;
      }

      // Đồng bộ thông tin người dùng lên bảng public.users của Supabase qua API an toàn
      try {
        const syncRes = await fetch('/api/sync-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: fbUser.uid,
            email: email,
            full_name: fullName,
            avatar_url: avatar,
            phone: fbUser.phoneNumber || '',
            role: userRole,
          }),
        });
        const syncJson = await syncRes.json();
        const dbUser = syncJson?.data;

        if (userRole !== 'admin' && dbUser?.package && dbUser.package.toLowerCase() !== 'free') {
          userPackage = dbUser.package;
          packageExpiry = dbUser.package_expires_at || dbUser.packageExpiry || '2026-12-31';
          const pkgLow = userPackage.toLowerCase();
          aiReportsLimit = pkgLow === 'agency' ? 50 : pkgLow === 'pro' ? 20 : 5;
        }
      } catch (dbErr) {
        console.warn('Sync to Supabase users table notice:', dbErr);
      }

      setUser({
        id: fbUser.uid,
        name: fullName,
        email: email,
        phone: fbUser.phoneNumber || '',
        role: userRole,
        avatar: avatar,
        package: userPackage,
        packageExpiry: packageExpiry,
        listingsCount: 0,
        activeListings: 0,
        aiReportsUsed: 0,
        aiReportsLimit: aiReportsLimit,
      });
    } catch (e) {
      console.error('Error syncing Firebase user:', e);
    }
  };

  // Auth State Listeners (Supabase & Firebase)
  useEffect(() => {
    // 1. Firebase Auth listener
    let unsubscribeFb: (() => void) | undefined;
    try {
      unsubscribeFb = onAuthStateChanged(firebaseAuth, (fbUser: FirebaseUser | null) => {
        if (fbUser) {
          syncFirebaseUser(fbUser);
        }
      });
    } catch (fbErr) {
      console.warn('Firebase auth listener error:', fbErr);
    }

    // 2. Supabase Auth listener
    let unsubscribeSb: (() => void) | undefined;
    try {
      const supabase = createClient();

      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user && !firebaseAuth.currentUser) {
          syncSupabaseUser(session.user);
        }
      });

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          await syncSupabaseUser(session.user);
        } else if (event === 'SIGNED_OUT' && !firebaseAuth.currentUser) {
          setUser(null);
        }
      });
      unsubscribeSb = () => subscription.unsubscribe();
    } catch {
      // Offline fallback
    }

    return () => {
      if (unsubscribeFb) unsubscribeFb();
      if (unsubscribeSb) unsubscribeSb();
    };
  }, []);

  const addToast = (message: string, type: ToastItem['type'] = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto dismiss after 3.5s
    setTimeout(() => {
      removeToast(id);
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleToggleSaveListing = async (id: string) => {
    if (!user) {
      addToast('Đăng nhập để lưu bất động sản này', 'warning');
      return;
    }
    const isSaved = savedListingIds.includes(id);
    if (isSaved) {
      setSavedListingIds((prev) => prev.filter((item) => item !== id));
      addToast('Đã bỏ lưu bất động sản khỏi danh sách', 'info');
    } else {
      setSavedListingIds((prev) => [...prev, id]);
      addToast('❤️ Đã lưu vào danh sách yêu thích', 'success');
    }

    // Attempt Supabase sync if user logged in
    try {
      const supabase = createClient();
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData?.session?.user) {
        await toggleSavedListing(sessionData.session.user.id, id);
      }
    } catch {
      // Local state already updated
    }
  };

  // Hàm tải các tin đăng đã được duyệt (status === 'active') từ Supabase
  const refreshListings = async () => {
    try {
      const res = await fetch('/api/listings?status=active');
      let supabaseListings: ListingItem[] = [];
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data && json.data.length > 0) {
          supabaseListings = json.data.map((row: any) => {
            const coords = parseLocationCoordinates(row.location, row.district);
            const lat = typeof row.lat === 'number' && !isNaN(row.lat) && row.lat !== 0 ? row.lat : coords.lat;
            const lng = typeof row.lng === 'number' && !isNaN(row.lng) && row.lng !== 0 ? row.lng : coords.lng;

            return {
              id: row.id,
              title: row.title,
              price: row.price,
              pricePerM2: row.price_per_m2 || Math.round(row.price / (row.area || 1)),
              area: row.area,
              floors: 3,
              bedrooms: 3,
              bathrooms: 2,
              address: row.address,
              district: row.district,
              ward: row.ward || '',
              lat,
              lng,
              type: row.property_type || 'house',
              images: row.images && row.images.length > 0 ? row.images : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80'],
              status: 'active',
              isFeatured: row.is_featured || false,
              views: row.views || 1,
              createdAt: row.created_at ? row.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
              planningZone: row.planning_zone || 'Đất ở đô thị',
              planningYear: 2030,
              legalStatus: row.legal_status || 'Sổ đỏ chính chủ',
              direction: row.direction || 'Đông Nam',
              description: row.description || '',
              userId: row.user_id,
              authorName: row.users?.full_name || row.author_name,
              authorPhone: row.users?.phone || row.author_phone,
              authorEmail: row.author_email,
              authorAvatar: row.users?.avatar_url || row.author_avatar,
              users: row.users,
            };
          });
        }
      }

      // Giữ nguyên các tin do người dùng đã đăng lưu ở localStorage
      const localStored = getStoredUserListings();
      const sbMap = new Map(supabaseListings.map(s => [s.id, s]));
      const mergedLocals = localStored.map(item => {
        if (sbMap.has(item.id)) {
          const remote = sbMap.get(item.id)!;
          return {
            ...item,
            ...remote,
            lat: remote.lat || item.lat,
            lng: remote.lng || item.lng,
          };
        }
        // Tự động sửa các tin local cũ nếu bị dính default Cầu Giấy (21.0315, 105.7825) dù quận khác
        if (
          item.district &&
          item.district !== 'Cầu Giấy' &&
          Math.abs(item.lat - 21.0315) < 0.002 &&
          Math.abs(item.lng - 105.7825) < 0.002
        ) {
          const corrected = parseLocationCoordinates(null, item.district);
          return { ...item, lat: corrected.lat, lng: corrected.lng };
        }
        return item;
      });
      saveStoredUserListings(mergedLocals);

      const allKnownIds = new Set<string>();
      const combinedList: ListingItem[] = [];

      for (const item of mergedLocals) {
        allKnownIds.add(item.id);
        combinedList.push(item);
      }

      for (const item of supabaseListings) {
        if (!allKnownIds.has(item.id)) {
          allKnownIds.add(item.id);
          combinedList.push(item);
        }
      }

      for (const item of mockListings) {
        if (!allKnownIds.has(item.id)) {
          allKnownIds.add(item.id);
          combinedList.push(item);
        }
      }

      setListings(combinedList);
    } catch (e) {
      console.warn('Cannot fetch remote listings:', e);
    }
  };

  // Tải danh sách tin đã được duyệt khi mở web
  useEffect(() => {
    refreshListings();
  }, []);

  const addNewListing = async (newListingData: Partial<ListingItem>): Promise<string> => {
    let newId = 'lst_' + Date.now();

    const pricePerM2 = newListingData.pricePerM2 || (newListingData.price ? Math.round(newListingData.price / (newListingData.area || 50)) : 100000000);

    const numLat = Number(newListingData.lat);
    const numLng = Number(newListingData.lng);
    const hasValidCoords = !isNaN(numLat) && !isNaN(numLng) && numLat >= -90 && numLat <= 90 && numLng >= -180 && numLng <= 180 && numLat !== 0 && numLng !== 0;
    const fallbackCoords = parseLocationCoordinates(null, newListingData.district);
    const finalLat = hasValidCoords ? numLat : fallbackCoords.lat;
    const finalLng = hasValidCoords ? numLng : fallbackCoords.lng;

    const pendingItem: ListingItem = {
      id: newId,
      title: newListingData.title || 'BĐS mới đăng tại Hà Nội',
      price: newListingData.price || 5000000000,
      pricePerM2,
      area: newListingData.area || 50,
      floors: newListingData.floors || 3,
      bedrooms: newListingData.bedrooms || 3,
      bathrooms: newListingData.bathrooms || 2,
      address: newListingData.address || 'Hà Nội',
      district: newListingData.district || 'Cầu Giấy',
      ward: newListingData.ward || 'Dịch Vọng',
      lat: finalLat,
      lng: finalLng,
      type: newListingData.type || 'house',
      images: newListingData.images && newListingData.images.length > 0
        ? newListingData.images
        : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80'],
      status: 'pending', // Đánh dấu đang chờ duyệt
      isFeatured: false,
      views: 1,
      createdAt: new Date().toISOString().split('T')[0],
      planningZone: 'Đất ở đô thị',
      planningYear: 2030,
      legalStatus: newListingData.legalStatus || 'Sổ đỏ chính chủ',
      direction: newListingData.direction || 'Đông Nam',
      description: newListingData.description || 'Bất động sản vị trí đẹp.',
      userId: user?.id,
      authorName: user?.name || 'Cozy Hollys',
      authorEmail: user?.email || 'cozyhollys@gmail.com',
      authorPhone: user?.phone || '0988 123 456',
      authorAvatar: user?.avatar,
      users: user ? {
        full_name: user.name,
        avatar_url: user.avatar,
        phone: user.phone || '0988 123 456',
        role: user.role,
      } : undefined,
    };

    // 1. Lưu ngay vào localStorage để không bao giờ bị mất khi refresh hay chuyển trang
    const currentStored = getStoredUserListings();
    const updatedStored = [pendingItem, ...currentStored.filter(l => l.id !== newId)];
    saveStoredUserListings(updatedStored);

    // 2. Thêm ngay vào state của app để người dùng thấy ngay trên Dashboard cá nhân
    setListings((prev) => [pendingItem, ...prev.filter(l => l.id !== newId)]);

    // 3. Gửi lên Supabase API với status: 'pending' (Chờ Admin phê duyệt)
    try {
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user?.id,
          author_email: user?.email || 'cozyhollys@gmail.com',
          title: newListingData.title,
          description: newListingData.description,
          property_type: newListingData.type || 'house',
          price: newListingData.price,
          area: newListingData.area,
          address: newListingData.address,
          district: newListingData.district,
          ward: newListingData.ward,
          lat: finalLat,
          lng: finalLng,
          images: newListingData.images,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data?.id) {
          const remoteId = json.data.id;
          // Cập nhật lại ID chuẩn từ Supabase
          const syncedStored = getStoredUserListings().map(l => l.id === newId ? { ...l, id: remoteId } : l);
          saveStoredUserListings(syncedStored);
          setListings((prev) => prev.map(l => l.id === newId ? { ...l, id: remoteId } : l));
          newId = remoteId;
        }
      }
    } catch (apiErr) {
      console.warn('Sync to Supabase listings notice:', apiErr);
    }

    addToast('⏳ Tin đăng đã gửi thành công và đang chờ Admin kiểm duyệt!', 'info');
    return newId;
  };

  // Hàm cập nhật trạng thái tin đăng (Duyệt tin: 'active', Từ chối: 'rejected')
  const updateListingStatus = async (id: string, status: 'active' | 'pending' | 'rejected') => {
    // 1. Cập nhật state listings trong app
    setListings((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));

    // 2. Cập nhật localStorage
    const currentStored = getStoredUserListings();
    let targetItem: any = listings.find((l) => l.id === id) || currentStored.find((l) => l.id === id);
    if (!targetItem) {
      try {
        const { mockAdminListings } = await import('@/lib/admin-data');
        targetItem = mockAdminListings.find((l) => l.id === id);
      } catch {}
    }
    let updatedStored = currentStored.map((l) => (l.id === id ? { ...l, status } : l));
    if (!currentStored.some((l) => l.id === id)) {
      if (targetItem) {
        updatedStored = [{ ...targetItem, status }, ...updatedStored];
      }
    }
    saveStoredUserListings(updatedStored);

    // 3. TỰ ĐỘNG TẠO THÔNG BÁO CHO TÀI KHOẢN NGƯỜI DÙNG KHI ADMIN DUYỆT BÀI ĐĂNG
    if (typeof window !== 'undefined') {
      try {
        const STORAGE_KEY_NOTIFICATIONS = 'hanoi_realty_notifications';
        const title = targetItem?.title || 'Bất động sản của bạn';

        if (status === 'active') {
          const newNotif = {
            id: `notif-approved-${id}-${Date.now()}`,
            title: 'Tin đăng BĐS đã duyệt thành công',
            content: `Tin đăng "${title}" của bạn đã được Admin kiểm duyệt thành công và chính thức hiển thị trên bản đồ!`,
            category: 'listing' as const,
            createdAt: 'Vừa xong',
            timestamp: Date.now(),
            isRead: false,
            link: `/listings/${id}`,
            tag: 'Đã duyệt'
          };

          const existingRaw = localStorage.getItem(STORAGE_KEY_NOTIFICATIONS);
          const existingNotifs = existingRaw ? JSON.parse(existingRaw) : [];
          const updatedNotifs = [newNotif, ...existingNotifs.filter((n: any) => n.id !== newNotif.id)];
          localStorage.setItem(STORAGE_KEY_NOTIFICATIONS, JSON.stringify(updatedNotifs));

          // Phát sự kiện toàn cục để chuông thông báo (NotificationBell) cập nhật tức thì
          window.dispatchEvent(new CustomEvent('hanoi_new_notification', { detail: newNotif }));
        } else if (status === 'rejected') {
          const newNotif = {
            id: `notif-rejected-${id}-${Date.now()}`,
            title: 'Tin đăng cần chỉnh sửa lại',
            content: `Tin đăng "${title}" của bạn chưa được duyệt. Vui lòng kiểm tra lại thông tin mô tả và hình ảnh.`,
            category: 'listing' as const,
            createdAt: 'Vừa xong',
            timestamp: Date.now(),
            isRead: false,
            link: '/dashboard',
            tag: 'Cần sửa'
          };

          const existingRaw = localStorage.getItem(STORAGE_KEY_NOTIFICATIONS);
          const existingNotifs = existingRaw ? JSON.parse(existingRaw) : [];
          const updatedNotifs = [newNotif, ...existingNotifs.filter((n: any) => n.id !== newNotif.id)];
          localStorage.setItem(STORAGE_KEY_NOTIFICATIONS, JSON.stringify(updatedNotifs));

          window.dispatchEvent(new CustomEvent('hanoi_new_notification', { detail: newNotif }));
        }
      } catch (notifErr) {
        console.warn('Lỗi ghi nhận thông báo duyệt tin:', notifErr);
      }
    }

    // 4. Gửi lệnh cập nhật lên Supabase Database
    try {
      await fetch('/api/listings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
    } catch (err) {
      console.warn('Lỗi đồng bộ trạng thái tin lên Supabase:', err);
    }
  };

  // Load planning zones from localStorage
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('hanoi_planning_zones');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setPlanningZones(parsed);
          }
        }
      }
    } catch (e) {
      console.warn('Failed to parse planning zones from localStorage', e);
    }
  }, []);

  const savePlanningZonesToStorage = (zones: PlanningZoneItem[]) => {
    setPlanningZones(zones);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('hanoi_planning_zones', JSON.stringify(zones));
      }
    } catch (e) {
      console.warn('Failed to save planning zones to localStorage', e);
    }
  };

  const addPlanningZone = (zone: Partial<PlanningZoneItem>): string => {
    const id = 'zone_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
    const newZone: PlanningZoneItem = {
      id,
      code: zone.code || 'ODT-NEW',
      name: zone.name || 'Phân khu quy hoạch mới',
      district: zone.district || 'Cầu Giấy',
      color: zone.color || '#3b82f6',
      areaHa: zone.areaHa || 100,
      maxFloors: zone.maxFloors ?? 5,
      density: zone.density || '60%',
      status: zone.status || 'published',
      type: zone.type || 'residential',
      planYear: zone.planYear || 2030,
      coordinates: zone.coordinates && zone.coordinates.length >= 3 ? zone.coordinates : [
        [21.0300, 105.7800],
        [21.0400, 105.7900],
        [21.0350, 105.8000],
        [21.0250, 105.7900],
      ],
      sourceFile: zone.sourceFile,
      floorAreaRatio: zone.floorAreaRatio || 3.5,
      maxHeight: zone.maxHeight || (zone.maxFloors ? `${zone.maxFloors} tầng` : 'Không áp dụng'),
    };
    const updated = [newZone, ...planningZones];
    savePlanningZonesToStorage(updated);
    setSelectedPlanningZoneId(id);
    addToast(`🎉 Đã thêm phân khu "${newZone.name}" vào bản đồ quy hoạch!`, 'success');
    return id;
  };

  const importPlanningZones = (newZones: PlanningZoneItem[]): number => {
    if (!newZones.length) return 0;
    const updated = [...newZones, ...planningZones];
    savePlanningZonesToStorage(updated);
    if (newZones[0]?.id) {
      setSelectedPlanningZoneId(newZones[0].id);
    }
    addToast(`🎉 Đã nhập thành công ${newZones.length} phân khu quy hoạch vào bản đồ!`, 'success');
    return newZones.length;
  };

  const deletePlanningZone = (id: string) => {
    const updated = planningZones.filter((z) => z.id !== id);
    savePlanningZonesToStorage(updated);
    if (selectedPlanningZoneId === id) {
      setSelectedPlanningZoneId(null);
    }
    addToast('Đã xóa phân khu khỏi bản đồ', 'info');
  };

  const resetPlanningZonesToDefault = () => {
    savePlanningZonesToStorage(DEFAULT_PLANNING_ZONES);
    setSelectedPlanningZoneId(null);
    addToast('Đã khôi phục dữ liệu quy hoạch mặc định', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        listings,
        setListings,
        savedListingIds,
        toggleSaveListing: handleToggleSaveListing,
        activeListingId,
        setActiveListingId,
        hoveredListingId,
        setHoveredListingId,
        showPlanningOverlay,
        setShowPlanningOverlay,
        toasts,
        addToast,
        removeToast,
        addNewListing,
        updateListingStatus,
        refreshListings,
        planningZones,
        setPlanningZones,
        selectedPlanningZoneId,
        setSelectedPlanningZoneId,
        addPlanningZone,
        importPlanningZones,
        deletePlanningZone,
        resetPlanningZonesToDefault,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
