'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockListings, mockUser, ListingItem } from '@/lib/mock-data';
import { createClient } from '@/lib/supabase/client';
import { toggleSavedListing, getSavedListings } from '@/lib/supabase/queries/saved';
import { PlanningZoneItem, DEFAULT_PLANNING_ZONES } from '@/lib/planning/planning-utils';
import { getAllHanoiPlanningZones } from '@/lib/planning/hanoi-planning-db';
import {
  getPlanningZonesFromSupabase,
  savePlanningZoneToSupabase,
  deletePlanningZoneFromSupabase,
} from '@/lib/supabase/queries/planning';
import { auth as firebaseAuth } from '@/lib/firebase/config';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { parseLocationCoordinates } from '@/lib/utils';

import {
  getLocalListings,
  saveLocalListings,
  createListingRecord,
  updateListingRecord,
  approveListingRecord,
  rejectListingRecord,
  toggleHideListingRecord,
  deleteListingRecord,
  EVENT_LISTINGS_UPDATED,
  TEST_SELLERS,
  TEST_SELLERS_LIST,
} from '@/lib/services/listing-service';

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
  updateListing: (id: string, updates: Partial<ListingItem>) => Promise<ListingItem | null>;
  deleteListing: (id: string) => Promise<void>;
  hideListing: (id: string, forceHidden?: boolean) => Promise<void>;
  updateListingStatus: (
    id: string,
    status: 'active' | 'pending' | 'rejected' | 'hidden' | 'expired' | 'sold',
    reason?: string
  ) => Promise<void>;
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
  return getLocalListings();
};

export const saveStoredUserListings = (items: ListingItem[]) => {
  saveLocalListings(items);
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<typeof mockUser | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('hanoi_current_user');
        if (stored) return JSON.parse(stored);
      } catch {}
    }
    const defaultSeller = TEST_SELLERS_LIST[0];
    return {
      id: defaultSeller.id,
      name: defaultSeller.name,
      email: defaultSeller.email,
      phone: defaultSeller.phone,
      role: 'agent',
      package: 'pro',
      packageExpiry: '2026-12-31',
      aiReportsUsed: 3,
      aiReportsLimit: 30,
      listingsCount: 2,
      activeListings: 1,
      avatar: defaultSeller.avatar,
    };
  });

  // Tự động lưu user vào localStorage khi user thay đổi để duy trì session giữa các portal
  useEffect(() => {
    if (user && typeof window !== 'undefined') {
      try {
        localStorage.setItem('hanoi_current_user', JSON.stringify(user));
      } catch {}
    }
  }, [user]);

  const [listings, setListings] = useState<ListingItem[]>(() => {
    return getLocalListings();
  });

  // Lắng nghe cập nhật real-time từ Single Source of Truth
  useEffect(() => {
    const handleSync = () => {
      setListings(getLocalListings());
    };
    window.addEventListener(EVENT_LISTINGS_UPDATED, handleSync);
    window.addEventListener('storage', (e) => {
      if (e.key === USER_LISTINGS_STORAGE_KEY) handleSync();
    });
    return () => {
      window.removeEventListener(EVENT_LISTINGS_UPDATED, handleSync);
    };
  }, []);
  const [savedListingIds, setSavedListingIds] = useState<string[]>(['1', '3']);
  const [activeListingId, setActiveListingId] = useState<string | null>(null);
  const [hoveredListingId, setHoveredListingId] = useState<string | null>(null);
  const [showPlanningOverlay, setShowPlanningOverlay] = useState<boolean>(true);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [planningZones, setPlanningZones] = useState<PlanningZoneItem[]>(() => {
    try {
      const all = getAllHanoiPlanningZones();
      return all.length > 0 ? all : DEFAULT_PLANNING_ZONES;
    } catch {
      return DEFAULT_PLANNING_ZONES;
    }
  });
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

  // Hàm tải các tin đăng từ Supabase (cả active và pending của người dùng)
  const refreshListings = async () => {
    try {
      const res = await fetch('/api/listings?status=all');
      let supabaseListings: ListingItem[] = [];
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data && json.data.length > 0) {
          supabaseListings = json.data.map((row: any) => {
            const coords = parseLocationCoordinates(row.location, row.district);
            const lat = typeof row.lat === 'number' && !isNaN(row.lat) && row.lat !== 0 ? row.lat : coords.lat;
            const lng = typeof row.lng === 'number' && !isNaN(row.lng) && row.lng !== 0 ? row.lng : coords.lng;

            const area = Number(row.area) || 75;
            const price = Number(row.price) || 8500000000;
            const pricePerM2 = row.price_per_m2 || Math.round(price / (area || 1));

            const rawTitle = row.title?.trim() || 'bất động sản';
            const formattedTitle = rawTitle.toLowerCase().startsWith('bán') ? rawTitle : `Bán ${rawTitle}`;

            const autoDesc =
              row.description && row.description.trim().length > 10
                ? row.description
                : `${formattedTitle} vị trí đắc địa tại ${row.address || row.district || 'Hà Nội'}.
- Diện tích: ${area}m², mặt tiền rộng thoáng, ô tô đỗ cửa hoặc vào nhà thuận tiện.
- Thiết kế hiện đại ${row.floors || 4} tầng kiên cố, công năng tối ưu gồm ${row.bedrooms || 3} phòng ngủ, ${row.bathrooms || 2} phòng tắm khép kín, phòng khách và phòng bếp sang trọng.
- Vị trí trung tâm khu vực ${row.district || 'Hà Nội'}, hạ tầng đồng bộ, gần trường học các cấp, bệnh viện, chợ dân sinh và trung tâm thương mại.
- Pháp lý: ${row.legal_status || 'Sổ đỏ chính chủ, pháp lý minh bạch'}, sẵn sàng công chứng sang tên ngay trong ngày.
- Thích hợp an cư lâu dài, mở văn phòng đại diện hoặc đầu tư cho thuê sinh lời cao.`;

            return {
              id: row.id,
              title: row.title,
              price,
              pricePerM2,
              area,
              floors: row.floors || 4,
              bedrooms: row.bedrooms || 3,
              bathrooms: row.bathrooms || 2,
              address: row.address,
              district: row.district,
              ward: row.ward || '',
              lat,
              lng,
              type: row.property_type || 'house',
              images: row.images && row.images.length > 0 ? row.images : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80'],
              status: row.status || 'active',
              isFeatured: row.is_featured || false,
              views: row.views || 48,
              createdAt: row.created_at ? row.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
              planningZone: row.planning_zone || 'Đất ở đô thị',
              planningYear: 2030,
              legalStatus: row.legal_status || 'Sổ đỏ chính chủ',
              direction: row.direction || 'Đông Nam',
              description: autoDesc,
              userId: row.user_id,
              ownerId: row.user_id,
              createdBy: row.user_id,
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
    const created = await createListingRecord(newListingData, user);
    setListings(getLocalListings());
    addToast('⏳ Tin đăng đã gửi thành công và đang chờ Admin kiểm duyệt!', 'info');
    return created.id;
  };

  const updateListing = async (id: string, updates: Partial<ListingItem>): Promise<ListingItem | null> => {
    const updated = await updateListingRecord(id, updates, user, user?.role === 'admin');
    if (updated) {
      setListings(getLocalListings());
      if (updated.status === 'pending') {
        addToast('Tin đăng đã được cập nhật và chuyển sang trạng thái Chờ duyệt lại', 'info');
      } else {
        addToast('Đã lưu thay đổi tin đăng thành công', 'success');
      }
    }
    return updated;
  };

  const deleteListing = async (id: string): Promise<void> => {
    deleteListingRecord(id);
    setListings(getLocalListings());
    addToast('Đã xóa tin đăng thành công', 'info');
  };

  const hideListing = async (id: string, forceHidden?: boolean): Promise<void> => {
    await toggleHideListingRecord(id, forceHidden);
    setListings(getLocalListings());
    addToast('Đã cập nhật trạng thái hiển thị của tin đăng', 'info');
  };

  const updateListingStatus = async (
    id: string,
    status: 'active' | 'pending' | 'rejected' | 'hidden' | 'expired' | 'sold',
    reason?: string
  ): Promise<void> => {
    if (status === 'active') {
      await approveListingRecord(id);
    } else if (status === 'rejected') {
      await rejectListingRecord(id, reason || 'Thông tin chưa đạt yêu cầu kiểm duyệt');
    } else if (status === 'hidden') {
      await toggleHideListingRecord(id, true);
    } else {
      await updateListingRecord(id, { status }, user, true);
    }
    setListings(getLocalListings());
  };

  // Load planning zones from Supabase (fallback to localStorage / DEFAULT_PLANNING_ZONES)
  useEffect(() => {
    let isMounted = true;
    async function loadPlanning() {
      try {
        const dbZones = await getPlanningZonesFromSupabase();
        if (isMounted && dbZones && dbZones.length > 0) {
          setPlanningZones(dbZones);
          if (typeof window !== 'undefined') {
            localStorage.setItem('hanoi_planning_zones', JSON.stringify(dbZones));
          }
          return;
        }
      } catch (err) {
        console.warn('Lỗi lấy quy hoạch từ Supabase, fallback về localStorage:', err);
      }

      // Fallback nếu Supabase trống hoặc chưa có mạng
      try {
        if (typeof window !== 'undefined') {
          const saved = localStorage.getItem('hanoi_planning_zones');
          if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0 && isMounted) {
              setPlanningZones(parsed);
            }
          }
        }
      } catch (e) {
        console.warn('Failed to parse planning zones from localStorage', e);
      }
    }

    loadPlanning();
    return () => {
      isMounted = false;
    };
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
    const id = zone.id || 'zone_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
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

    // Đồng bộ lên Supabase PostGIS nền
    savePlanningZoneToSupabase(newZone).then((res) => {
      if (res.success) {
        console.log('[Supabase] Đã đồng bộ phân khu quy hoạch:', newZone.name);
      } else {
        console.warn('[Supabase] Lưu quy hoạch thất bại (sẽ lưu offline):', res.error);
      }
    });

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

    // Đồng bộ hàng loạt lên Supabase
    Promise.all(newZones.map((z) => savePlanningZoneToSupabase(z))).then(() => {
      console.log(`[Supabase] Đã đồng bộ ${newZones.length} phân khu lên Database.`);
    });

    addToast(`🎉 Đã nhập thành công ${newZones.length} phân khu quy hoạch vào bản đồ!`, 'success');
    return newZones.length;
  };

  const deletePlanningZone = (id: string) => {
    const updated = planningZones.filter((z) => z.id !== id);
    savePlanningZonesToStorage(updated);
    if (selectedPlanningZoneId === id) {
      setSelectedPlanningZoneId(null);
    }

    // Xóa trên Supabase
    deletePlanningZoneFromSupabase(id).then((ok) => {
      if (ok) console.log('[Supabase] Đã xóa phân khu ID:', id);
    });

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
        updateListing,
        deleteListing,
        hideListing,
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
