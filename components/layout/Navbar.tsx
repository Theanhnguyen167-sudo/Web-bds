'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/lib/context/AppContext';
import {
  Home,
  Layers,
  Sparkles,
  Tag,
  PlusCircle,
  User,
  LogOut,
  Menu,
  X,
  Search,
  LayoutDashboard,
  Navigation,
  ChevronDown
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, setUser, addToast } = useApp();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Trang chủ', href: '/' },
    { name: 'Tuyến đường', href: '/streets' },
    { name: 'Quy hoạch', href: '/planning' },
    { name: 'Báo cáo AI', href: '/reports/1' },
    { name: 'Bảng giá VIP', href: '/pricing' },
  ];

  const handleLogout = () => {
    setUser(null);
    setUserDropdownOpen(false);
    addToast('Đã đăng xuất thành công', 'info');
  };

  const handlePostListingClick = () => {
    if (!user) {
      addToast('Vui lòng đăng nhập để đăng tin', 'info');
      router.push('/login');
    } else {
      router.push('/listings/create');
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-primary/95 shadow-md backdrop-blur-md border-b border-primary-light'
          : 'bg-primary border-b border-primary/50'
      }`}
    >
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo Left */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <motion.div
            whileHover={{ scale: 1.08, rotate: -4 }}
            whileTap={{ scale: 0.95 }}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-white shadow-md shadow-accent/20"
          >
            <Home className="h-5 w-5" />
          </motion.div>
          <div className="flex flex-col">
            <span className="text-lg font-extrabold tracking-tight text-white flex items-center gap-1">
              HaNoi <span className="text-accent font-black">Realty</span>
            </span>
            <span className="text-[10px] font-medium text-slate-300 uppercase tracking-widest -mt-1">
              PropTech & Quy Hoạch
            </span>
          </div>
        </Link>

        {/* Center Nav Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className="relative px-3.5 py-2 text-xs font-semibold text-slate-200 transition-colors hover:text-white"
              >
                <span>{link.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-accent"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Section Actions */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Post Listing Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handlePostListingClick}
            className="flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-xs font-bold text-white shadow-md shadow-accent/20 hover:bg-accent-hover transition-all"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Đăng tin</span>
          </motion.button>

          {/* Auth State / Dropdown */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 rounded-xl bg-primary-light/60 p-1.5 pr-2.5 text-white hover:bg-primary-light transition-all border border-slate-700"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-7 w-7 rounded-lg object-cover ring-1 ring-accent"
                />
                <span className="text-xs font-semibold max-w-[100px] truncate">{user.name}</span>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </button>

              {/* User Dropdown Menu */}
              <AnimatePresence>
                {userDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-2 text-text-primary shadow-xl z-50"
                  >
                    <div className="px-3 py-2 border-b border-slate-100 mb-1">
                      <p className="text-xs font-bold text-text-primary truncate">{user.name}</p>
                      <p className="text-[11px] text-text-secondary truncate">{user.email}</p>
                      <div className="mt-1.5 flex items-center gap-1.5">
                        <span className="rounded bg-accent/10 px-1.5 py-0.5 text-[10px] font-bold text-accent uppercase">
                          Gói {user.package}
                        </span>
                        <span className="text-[10px] text-text-muted">HSD: {user.packageExpiry}</span>
                      </div>
                    </div>

                    <Link
                      href="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-text-primary hover:bg-slate-50 transition-colors"
                    >
                      <LayoutDashboard className="h-4 w-4 text-accent" />
                      <span>Bảng điều khiển</span>
                    </Link>

                    <Link
                      href="/pricing"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-text-primary hover:bg-slate-50 transition-colors"
                    >
                      <Tag className="h-4 w-4 text-emerald-600" />
                      <span>Nâng cấp gói VIP</span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-danger hover:bg-red-50 transition-colors mt-1 border-t border-slate-100"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Đăng xuất</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/login"
                className="flex items-center gap-1.5 rounded-lg border border-slate-600 bg-primary-light/40 px-3.5 py-2 text-xs font-semibold text-white hover:bg-primary-light transition-all"
              >
                <User className="h-4 w-4" />
                <span>Đăng nhập</span>
              </Link>
            </motion.div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={handlePostListingClick}
            className="rounded-lg bg-accent px-2.5 py-1.5 text-xs font-bold text-white"
          >
            Đăng tin
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-white hover:bg-primary-light"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden border-t border-primary-light bg-primary px-4 py-4 text-white shadow-xl"
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg px-3 py-2 text-xs font-semibold hover:bg-primary-light"
                >
                  {link.name}
                </Link>
              ))}

              <div className="border-t border-slate-700 pt-3 mt-1 flex flex-col gap-2">
                {user ? (
                  <>
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 rounded-lg bg-primary-light/60 px-3 py-2 text-xs font-semibold"
                    >
                      <LayoutDashboard className="h-4 w-4 text-accent" />
                      <span>Dashboard ({user.name})</span>
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-danger"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Đăng xuất</span>
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-lg bg-primary-light px-3 py-2 text-xs font-semibold"
                  >
                    <User className="h-4 w-4" />
                    <span>Đăng nhập / Đăng ký</span>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
