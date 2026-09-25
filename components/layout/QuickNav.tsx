'use client';

import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
}

const navItems: NavItem[] = [
  { id: 'categories', label: 'Danh mục BĐS' },
  { id: 'featured', label: 'BĐS Nổi bật' },
  { id: 'map-search', label: 'Bản đồ Hà Nội' },
  { id: 'roadmap', label: 'Tầm nhìn & Lộ trình' },
];

export function QuickNav() {
  const [activeId, setActiveId] = useState<string>('categories');
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      const categoriesEl = document.getElementById('categories');
      const marketUpdatesEl =
        document.getElementById('market-updates') ||
        document.getElementById('market-news');

      if (!categoriesEl) return;

      const scrollY = window.scrollY;
      const categoriesTop = categoriesEl.getBoundingClientRect().top + scrollY;
      const startThreshold = Math.max(0, categoriesTop - 200);

      const marketUpdatesTop = marketUpdatesEl
        ? marketUpdatesEl.getBoundingClientRect().top + scrollY
        : document.documentElement.scrollHeight;
      const endThreshold = marketUpdatesTop - 150;

      // Check visibility bounds: only visible between #categories and #market-updates
      const inBounds = scrollY >= startThreshold && scrollY < endThreshold;
      setIsVisible(inBounds);

      // Determine active item among the 4 nav items
      const scrollPosition = scrollY + 250;
      for (let i = navItems.length - 1; i >= 0; i--) {
        const section = document.getElementById(navItems[i].id);
        if (section) {
          const sectionTop = section.getBoundingClientRect().top + scrollY;
          if (scrollPosition >= sectionTop) {
            setActiveId(navItems[i].id);
            return;
          }
        }
      }
      if (navItems.length > 0) {
        setActiveId(navItems[0].id);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -70; // offset for sticky navbar
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <aside
      aria-label="Điều hướng nhanh trang chủ"
      className={`fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-end select-none transition-all duration-300 ease-in-out ${
        isVisible
          ? 'opacity-100 pointer-events-auto translate-x-0'
          : 'opacity-0 pointer-events-none translate-x-3'
      }`}
    >
      <div className="bg-white/70 backdrop-blur-md border border-slate-200/80 shadow-sm rounded-xl p-2.5 flex flex-col gap-1 w-[156px]">
        
        {/* Navigation Items */}
        <div className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = activeId === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToSection(item.id)}
                className="text-left px-1.5 py-1 transition-colors cursor-pointer group flex items-center"
              >
                <span
                  className={`text-xs transition-all inline-block ${
                    isActive
                      ? 'border-b-2 border-orange-500 text-slate-800 font-medium pb-0.5'
                      : 'text-slate-400 hover:text-slate-700 pb-0.5 border-b-2 border-transparent transition-colors'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Subtle Divider */}
        <div className="w-full h-px bg-slate-200/60 my-1" />

        {/* Back to Top Button */}
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center justify-center p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100/60 transition-colors w-full cursor-pointer group"
          title="Trở về đầu trang"
          aria-label="Trở về đầu trang"
        >
          <ChevronUp className="w-4 h-4 transition-transform group-hover:-translate-y-0.5 text-slate-400 group-hover:text-slate-700" />
        </button>

      </div>
    </aside>
  );
}

export default QuickNav;
