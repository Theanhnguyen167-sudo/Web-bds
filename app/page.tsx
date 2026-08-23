'use client';

import React, { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { useApp } from '@/lib/context/AppContext';
import { MapPin, List, Layers } from 'lucide-react';
import { motion } from 'framer-motion';

const HybridMap = dynamic(() => import('@/components/map/HybridMap'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-900 animate-pulse rounded-xl 
                    flex items-center justify-center">
      <p className="text-white/50 text-sm">Đang tải bản đồ...</p>
    </div>
  )
});

export default function HomePage() {
  const { listings, activeListingId, setActiveListingId } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('Tất cả quận');
  const [selectedType, setSelectedType] = useState('all');
  const [maxPrice, setMaxPrice] = useState(50000000000);
  const [mobileView, setMobileView] = useState<'split' | 'map' | 'list'>('split');

  // Filter listings based on current filters
  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      // Search term
      if (
        searchTerm &&
        !item.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !item.address.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !item.district.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }

      // District filter
      if (selectedDistrict !== 'Tất cả quận' && item.district !== selectedDistrict) {
        return false;
      }

      // Type filter
      if (selectedType !== 'all' && item.type !== selectedType) {
        return false;
      }

      // Price filter
      if (item.price > maxPrice) {
        return false;
      }

      return true;
    });
  }, [listings, searchTerm, selectedDistrict, selectedType, maxPrice]);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-page-bg">
      <Navbar />

      {/* Main Split Layout: Sidebar + Simulated Interactive Map */}
      <div className="relative flex flex-1 overflow-hidden pt-16">
        
        {/* Left Side: Sidebar Feed */}
        <section
          className={`h-full w-full md:w-[50%] lg:w-[52%] xl:w-[48%] flex flex-col z-10 ${
            mobileView === 'map' ? 'hidden md:flex' : 'flex'
          }`}
        >
          <Sidebar
            listings={listings}
            filteredListings={filteredListings}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedDistrict={selectedDistrict}
            setSelectedDistrict={setSelectedDistrict}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
          />
        </section>

        {/* Right Side: Map Container */}
        <section
          id="planning-view"
          className={`h-full flex-1 relative ${
            mobileView === 'list' ? 'hidden md:flex' : 'flex'
          }`}
        >
          <HybridMap
            listings={filteredListings}
            onListingClick={(id) => setActiveListingId(id)}
            selectedListingId={activeListingId}
          />
        </section>

        {/* Mobile Floating View Switcher Button (Map / List) */}
        <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
          <motion.div
            whileTap={{ scale: 0.95 }}
            className="flex items-center rounded-full bg-primary p-1 shadow-2xl border border-slate-700 text-white"
          >
            <button
              onClick={() => setMobileView('list')}
              className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-colors ${
                mobileView === 'list' ? 'bg-accent text-white' : 'text-slate-300'
              }`}
            >
              <List className="h-4 w-4" />
              <span>Danh sách</span>
            </button>
            <button
              onClick={() => setMobileView('map')}
              className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-colors ${
                mobileView === 'map' ? 'bg-accent text-white' : 'text-slate-300'
              }`}
            >
              <MapPin className="h-4 w-4" />
              <span>Bản đồ</span>
            </button>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
