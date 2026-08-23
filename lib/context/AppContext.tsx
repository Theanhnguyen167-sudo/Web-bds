'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockListings, mockUser, ListingItem } from '@/lib/mock-data';

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
  toggleSaveListing: (id: string) => void;
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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<typeof mockUser | null>(mockUser);
  const [listings, setListings] = useState<ListingItem[]>(mockListings);
  const [savedListingIds, setSavedListingIds] = useState<string[]>(['1', '3']);
  const [activeListingId, setActiveListingId] = useState<string | null>(null);
  const [hoveredListingId, setHoveredListingId] = useState<string | null>(null);
  const [showPlanningOverlay, setShowPlanningOverlay] = useState<boolean>(true);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

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

  const toggleSaveListing = (id: string) => {
    setSavedListingIds((prev) => {
      const isSaved = prev.includes(id);
      if (isSaved) {
        addToast('Đã bỏ lưu bất động sản khỏi danh sách', 'info');
        return prev.filter((item) => item !== id);
      } else {
        addToast('❤️ Đã lưu vào danh sách yêu thích', 'success');
        return [...prev, id];
      }
    });
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

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        listings,
        setListings,
        savedListingIds,
        toggleSaveListing,
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
