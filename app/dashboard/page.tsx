'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { useApp } from '@/lib/context/AppContext';
import { formatCurrencyVND } from '@/lib/utils';
import {
  Home,
  Sparkles,
  Heart,
  Tag,
  PlusCircle,
  Trash2,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react';

export default function DashboardPage() {
  const { user, listings, setListings, savedListingIds, toggleSaveListing, addToast } = useApp();
  const [activeTab, setActiveTab] = useState<'listings' | 'reports' | 'saved' | 'packages'>('listings');

  // Lọc tin đăng của người dùng hiện tại (nếu có userId/authorEmail), hoặc hiển thị danh sách tin cá nhân bao gồm tin Chờ duyệt (pending)
  const userListings = listings.filter((l) => {
    if (l.userId && user?.id && l.userId === user.id) return true;
    if (l.authorEmail && user?.email && l.authorEmail === user.email) return true;
    if (l.id && l.id.startsWith('lst_')) return true; // Tin tạo từ máy này
    if (l.status === 'pending') return true; // Hiển thị các tin vừa đăng đang chờ duyệt
    return false;
  }).concat(listings.filter(l => !l.id?.startsWith('lst_') && !l.userId && l.status === 'active').slice(0, 3)); // Kèm các tin mẫu ban đầu

  // Danh sách bất động sản đã bấm lưu tim
  const savedListings = listings.filter((l) => savedListingIds.includes(l.id));

  const handleDeleteListing = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setListings((prev) => prev.filter((l) => l.id !== id));
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('hanoi_platform_user_listings');
        if (raw) {
          const parsed = JSON.parse(raw);
          localStorage.setItem('hanoi_platform_user_listings', JSON.stringify(parsed.filter((item: any) => item.id !== id)));
        }
      } catch {}
    }
    addToast('🗑️ Đã xoá tin đăng thành công', 'info');
  };

  const menuItems = [
    { id: 'listings', label: 'Quản lý tin đăng', icon: Home, count: userListings.length },
    { id: 'reports', label: 'Báo cáo AI đã tạo', icon: Sparkles, count: user?.aiReportsUsed || 8 },
    { id: 'saved', label: 'Tin đã lưu', icon: Heart, count: savedListingIds.length },
    { id: 'packages', label: 'Gói dịch vụ VIP', icon: Tag, badge: user?.package?.toUpperCase() || 'PRO' },
  ];

  return (
    <div className="min-h-screen bg-page-bg flex flex-col">
      <Navbar />

      <main className="flex-1 container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        
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
                <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-extrabold flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3 text-emerald-600" />
                  Đã xác thực
                </span>
              </div>
              <p className="text-xs text-text-secondary mt-0.5">{user?.email || 'an@example.com'}</p>
              <p className="text-[11px] text-text-muted mt-1">Hạn gói: {user?.packageExpiry || '2026-12-31'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-page-bg px-4 py-3 text-xs font-bold text-text-primary hover:bg-slate-100 transition-all"
            >
              <Tag className="h-4 w-4 text-accent" />
              <span>Gói hội viên VIP</span>
            </Link>

            <Link
              href="/listings/create"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 text-xs font-black text-white shadow-lg shadow-accent/25 hover:bg-accent-hover transition-all"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Đăng tin BĐS mới</span>
            </Link>
          </div>
        </div>

        {/* Dashboard Grid: Sidebar Menu (Left) | Main Panel Content (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Menu Tabs */}
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`relative flex w-full items-center justify-between rounded-2xl p-4 text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-white text-text-secondary hover:bg-slate-50 border border-border'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-4 w-4 ${isActive ? 'text-accent' : 'text-text-muted'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.count !== undefined && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-text-secondary'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}

                  {item.badge && (
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                      item.badge === 'CONNECTED' ? 'bg-emerald-500 text-white' : 'bg-accent text-white'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Main Content */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
                <span className="text-[11px] text-text-muted font-semibold">Tin bất động sản</span>
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
                <p className="text-2xl font-black text-rose-500 mt-1">{savedListingIds.length}</p>
                <span className="text-[10px] text-rose-600 font-bold mt-1 flex items-center gap-1">
                  <Heart className="h-3 w-3 fill-rose-500" /> BĐS theo dõi
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
                    <h3 className="text-sm font-extrabold text-text-primary">
                      Danh sách tin đăng bất động sản ({userListings.length})
                    </h3>
                    <Link
                      href="/listings/create"
                      className="text-xs font-bold text-accent hover:underline flex items-center gap-1"
                    >
                      <PlusCircle className="h-3.5 w-3.5" />
                      <span>Đăng tin mới</span>
                    </Link>
                  </div>

                  <div className="space-y-3">
                    {userListings.map((listing) => (
                      <div
                        key={listing.id}
                        onClick={() => window.location.href = `/listings/${listing.id}`}
                        className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-border p-4 hover:border-accent hover:bg-orange-50/15 transition-all cursor-pointer shadow-sm"
                      >
                        <div className="flex items-center gap-3.5">
                          <img
                            src={listing.images[0]}
                            alt={listing.title}
                            className="h-16 w-24 rounded-xl object-cover shrink-0"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-black text-accent">
                                {formatCurrencyVND(listing.price)}
                              </span>
                              <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold text-text-secondary">
                                {listing.area}m²
                              </span>
                              <span className="rounded bg-emerald-50 text-emerald-700 px-1.5 py-0.5 text-[9px] font-bold">
                                {listing.planningZone}
                              </span>
                              {listing.status === 'pending' ? (
                                <span className="rounded-full bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 text-[9px] font-extrabold flex items-center gap-1 animate-pulse">
                                  ⏳ Chờ Admin duyệt
                                </span>
                              ) : (
                                <span className="rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[9px] font-extrabold flex items-center gap-1">
                                  ✓ Đã duyệt (Đang hiển thị)
                                </span>
                              )}
                            </div>
                            <h4 className="text-xs font-bold text-text-primary group-hover:text-accent transition-colors line-clamp-1 mt-1">
                              {listing.title}
                            </h4>
                            <p className="text-[11px] text-text-muted mt-0.5">{listing.district}, Hà Nội</p>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                          <Link
                            href={`/reports/${listing.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1 rounded-lg bg-accent/10 px-3 py-1.5 text-xs font-bold text-accent hover:bg-accent hover:text-white transition-colors"
                          >
                            <Sparkles className="h-3.5 w-3.5" />
                            <span>Báo cáo AI</span>
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
                    ))}
                  </div>
                </motion.div>
              )}

              {/* TAB 2: REPORTS */}
              {activeTab === 'reports' && (
                <motion.div
                  key="tab-reports"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-3xl border border-border bg-white p-6 shadow-sm space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-border pb-4">
                    <h3 className="text-sm font-extrabold text-text-primary">Báo cáo Thẩm định AI gần đây</h3>
                    <span className="text-xs text-text-muted">Đã sử dụng {user?.aiReportsUsed || 8}/30 lượt</span>
                  </div>

                  <div className="space-y-3">
                    <div className="rounded-2xl bg-page-bg p-4 border border-border flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-accent" />
                          <span className="text-xs font-bold text-text-primary">Phố Hào Nam, Đống Đa</span>
                          <span className="rounded bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-bold">
                            Điểm 82/100
                          </span>
                        </div>
                        <p className="text-[11px] text-text-muted">Tạo ngày 2025-08-20 · Được hưởng lợi từ Metro 2A Cát Linh - Hà Đông</p>
                      </div>

                      <Link
                        href="/reports/1"
                        className="rounded-lg bg-accent px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-accent-hover transition-colors"
                      >
                        Xem chi tiết
                      </Link>
                    </div>

                    <div className="rounded-2xl bg-page-bg p-4 border border-border flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-accent" />
                          <span className="text-xs font-bold text-text-primary">Võ Chí Công, Tây Hồ</span>
                          <span className="rounded bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-bold">
                            Điểm 91/100
                          </span>
                        </div>
                        <p className="text-[11px] text-text-muted">Tạo ngày 2025-08-18 · Đất ở hỗn hợp, tiềm năng tăng giá cao</p>
                      </div>

                      <Link
                        href="/reports/2"
                        className="rounded-lg bg-accent px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-accent-hover transition-colors"
                      >
                        Xem chi tiết
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 3: SAVED */}
              {activeTab === 'saved' && (
                <motion.div
                  key="tab-saved"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-3xl border border-border bg-white p-6 shadow-sm space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-border pb-4">
                    <div>
                      <h3 className="text-sm font-extrabold text-text-primary">
                        Bất động sản đã lưu ({savedListings.length})
                      </h3>
                      <p className="text-xs text-text-secondary mt-0.5">
                        Các bất động sản bạn đã đánh dấu để theo dõi biến động giá và thông tin quy hoạch.
                      </p>
                    </div>
                    <Link
                      href="/search"
                      className="text-xs font-bold text-accent hover:underline flex items-center gap-1"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      <span>Xem thêm BĐS</span>
                    </Link>
                  </div>

                  {savedListings.length === 0 ? (
                    <div className="py-12 text-center space-y-3">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
                        <Heart className="h-7 w-7" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-text-primary">Bạn chưa lưu bất động sản nào</p>
                        <p className="text-xs text-text-muted">Bấm vào biểu tượng trái tim khi xem tin để lưu lại theo dõi tại đây.</p>
                      </div>
                      <Link
                        href="/search"
                        className="inline-block rounded-xl bg-accent px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-accent/20 hover:bg-accent-hover transition-colors"
                      >
                        Khám phá danh sách nhà đất
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {savedListings.map((listing) => (
                        <div
                          key={listing.id}
                          onClick={() => window.location.href = `/listings/${listing.id}`}
                          className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-border p-4 hover:border-accent hover:bg-orange-50/15 transition-all cursor-pointer shadow-sm"
                        >
                          <div className="flex items-center gap-3.5">
                            <img
                              src={listing.images[0]}
                              alt={listing.title}
                              className="h-16 w-24 rounded-xl object-cover shrink-0"
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-black text-accent">
                                  {formatCurrencyVND(listing.price)}
                                </span>
                                <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold text-text-secondary">
                                  {listing.area}m²
                                </span>
                                <span className="rounded bg-emerald-50 text-emerald-700 px-1.5 py-0.5 text-[9px] font-bold">
                                  {listing.planningZone}
                                </span>
                              </div>
                              <h4 className="text-xs font-bold text-text-primary group-hover:text-accent transition-colors line-clamp-1 mt-1">
                                {listing.title}
                              </h4>
                              <p className="text-[11px] text-text-muted mt-0.5">{listing.district}, Hà Nội</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                            <Link
                              href={`/reports/${listing.id}`}
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center gap-1 rounded-lg bg-accent/10 px-3 py-1.5 text-xs font-bold text-accent hover:bg-accent hover:text-white transition-colors"
                            >
                              <Sparkles className="h-3.5 w-3.5" />
                              <span>Báo cáo AI</span>
                            </Link>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleSaveListing(listing.id);
                                addToast('Đã bỏ lưu bất động sản', 'info');
                              }}
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                              title="Bỏ lưu"
                            >
                              <Heart className="h-4 w-4 fill-rose-500" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* TAB 4: PACKAGES */}
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
                      <span className="text-xs font-extrabold text-accent">GÓI PRO (599.000 đ/tháng)</span>
                      <span className="text-[11px] font-bold text-success">Đang hoạt động</span>
                    </div>
                    <p className="text-xs text-text-secondary">Đã kích hoạt quyền lợi đăng 50 tin và 30 Báo cáo AI chuyên sâu mỗi tháng.</p>
                    <Link
                      href="/pricing"
                      className="inline-block rounded-xl bg-accent px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-accent-hover transition-colors"
                    >
                      Gia hạn hoặc Nâng cấp Agency
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

        </div>
      </main>
    </div>
  );
}
