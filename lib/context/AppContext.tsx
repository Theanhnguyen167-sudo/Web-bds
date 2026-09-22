'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockListings, mockUser, ListingItem } from '@/lib/mock-data';
import { createClient } from '@/lib/supabase/client';
import { toggleSavedListing, getSavedListings } from '@/lib/supabase/queries/saved';
import { PlanningZoneItem, DEFAULT_PLANNING_ZONES } from '@/lib/planning/planning-utils';

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
  addNewListing: (listing: Partial<ListingItem>) => string;
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

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<typeof mockUser | null>(null);
  const [listings, setListings] = useState<ListingItem[]>(mockListings);
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
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', sessionUser.id)
        .maybeSingle();

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

      setUser({
        id: sessionUser.id,
        name: fullName,
        email: sessionUser.email || 'user@example.com',
        phone: profile?.phone || sessionUser.user_metadata?.phone || '',
        role: userRole,
        avatar: avatar,
        package: userRole === 'admin' ? 'Agency' : 'Pro',
        packageExpiry: '2026-12-31',
        listingsCount: 0,
        activeListings: 0,
        aiReportsUsed: 0,
        aiReportsLimit: 30,
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

  // Supabase Auth State Listener & Initial Session Check
  useEffect(() => {
    try {
      const supabase = createClient();

      // Check current session on initial load
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          syncSupabaseUser(session.user);
        }
      });

      // Listen for auth changes (login, logout, OAuth callback)
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          await syncSupabaseUser(session.user);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    } catch {
      // Offline / dev fallback
    }
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

  const addNewListing = (newListingData: Partial<ListingItem>): string => {
    const newId = (listings.length + 1).toString();
    const created: ListingItem = {
      id: newId,
      title: newListingData.title || 'BĐS mới đăng tại Hà Nội',
      price: newListingData.price || 5000000000,
      pricePerM2: newListingData.pricePerM2 || (newListingData.price ? newListingData.price / (newListingData.area || 50) : 100000000),
      area: newListingData.area || 50,
      floors: newListingData.floors || 3,
      bedrooms: newListingData.bedrooms || 3,
      bathrooms: newListingData.bathrooms || 2,
      address: newListingData.address || 'Hà Nội',
      district: newListingData.district || 'Cầu Giấy',
      ward: newListingData.ward || 'Dịch Vọng',
      lat: newListingData.lat || 21.0315,
      lng: newListingData.lng || 105.7825,
      type: newListingData.type || 'house',
      images: newListingData.images && newListingData.images.length > 0
        ? newListingData.images
        : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80'],
      status: 'active',
      isFeatured: false,
      views: 1,
      createdAt: new Date().toISOString().split('T')[0],
      planningZone: 'Đất ở đô thị',
      planningYear: 2030,
      legalStatus: newListingData.legalStatus || 'Sổ đỏ chính chủ',
      direction: newListingData.direction || 'Đông Nam',
      description: newListingData.description || 'Bất động sản vị trí đẹp.',
    };

    setListings((prev) => [created, ...prev]);
    addToast('🎉 Đăng tin thành công! Tin của bạn đã hiển thị trên bản đồ.', 'success');
    return newId;
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
