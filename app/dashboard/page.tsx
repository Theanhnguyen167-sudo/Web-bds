'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { useApp } from '@/lib/context/AppContext';
import { formatCurrencyVND } from '@/lib/utils';
import { ListingItem } from '@/lib/mock-data';
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
  Eye,
  Maximize2,
  X,
  ArrowRight,
  MapPin,
  Bed,
  Bath,
  Compass,
  Building,
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { user, listings, setListings, savedListingIds, toggleSaveListing, addToast } = useApp();
  const [activeTab, setActiveTab] = useState<'listings' | 'reports' | 'saved' | 'packages'>('listings');
  const [quickViewListing, setQuickViewListing] = useState<ListingItem | null>(null);
  const [activeQuickViewImgIndex, setActiveQuickViewImgIndex] = useState(0);

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

  const isFree = !user?.package || user.package.toLowerCase() === 'free';
  const aiLimit = user?.aiReportsLimit ?? (isFree ? 1 : user?.package?.toLowerCase() === 'basic' ? 10 : user?.package?.toLowerCase() === 'agency' ? 100 : 30);
  const aiUsed = user?.aiReportsUsed ?? 0;
  const aiRemaining = Math.max(0, aiLimit - aiUsed);

  const menuItems = [
    { id: 'listings', label: 'Quản lý tin đăng', icon: Home, count: userListings.length },
    { id: 'reports', label: 'Báo cáo AI đã tạo', icon: Sparkles, count: aiUsed },
    { id: 'saved', label: 'Tin đã lưu', icon: Heart, count: savedListingIds.length },
    { id: 'packages', label: 'Gói dịch vụ', icon: Tag, badge: user?.package?.toUpperCase() || 'FREE' },
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
                <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase ${
                  !isFree
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : 'bg-slate-100 text-slate-700 border border-slate-200'
                }`}>
                  Gói {user?.package || 'Free'}{!isFree ? ' VIP' : ''}
                </span>
                <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-extrabold flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3 text-emerald-600" />
                  Đã xác thực
                </span>
              </div>
              <p className="text-xs text-text-secondary mt-0.5">{user?.email || 'an@example.com'}</p>
              <p className="text-[11px] text-text-muted mt-1">Hạn gói: {!isFree ? (user?.packageExpiry || '30 ngày') : 'Miễn phí vĩnh viễn'}</p>
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
                <p className="text-2xl font-black text-text-primary mt-1">{aiUsed} / {aiLimit}</p>
                <span className="text-[10px] text-text-muted mt-1">Còn lại {aiRemaining} lượt</span>
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
                        onClick={() => router.push(`/listings/${listing.id}`)}
                        className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-border p-4 hover:border-accent hover:bg-orange-50/15 hover:shadow-md transition-all cursor-pointer bg-white"
                      >
                        <div className="flex items-center gap-3.5">
                          {/* Clickable Image */}
                          <Link
                            href={`/listings/${listing.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="relative h-18 w-24 sm:h-20 sm:w-28 rounded-xl overflow-hidden shrink-0 block group/img border border-slate-100 shadow-xs"
                            title="Bấm để xem chi tiết bài đăng"
                          >
                            <img
                              src={listing.images[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80'}
                              alt={listing.title}
                              className="h-full w-full object-cover group-hover/img:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/5 group-hover/img:bg-transparent transition-colors" />
                          </Link>

                          <div>
                            <div className="flex flex-wrap items-center gap-2">
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

                            {/* Clickable Title */}
                            <Link
                              href={`/listings/${listing.id}`}
                              onClick={(e) => e.stopPropagation()}
                              className="text-xs sm:text-sm font-bold text-text-primary group-hover:text-accent hover:underline transition-colors line-clamp-1 mt-1 block"
                              title="Bấm để xem chi tiết bài đăng"
                            >
                              {listing.title}
                            </Link>

                            <p className="text-[11px] text-text-muted mt-0.5">{listing.district}, Hà Nội</p>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                          {/* Nút Xem bài viết tin đăng */}
                          <Link
                            href={`/listings/${listing.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1.5 rounded-xl bg-primary text-white px-3.5 py-2 text-xs font-bold hover:bg-slate-800 shadow-xs transition-all"
                            title="Xem trang chi tiết bài đăng"
                          >
                            <Eye className="h-3.5 w-3.5 text-accent" />
                            <span>Xem tin</span>
                          </Link>

                          {/* Nút Xem nhanh popup */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveQuickViewImgIndex(0);
                              setQuickViewListing(listing);
                            }}
                            className="flex items-center gap-1 rounded-xl border border-border bg-slate-50 text-text-secondary hover:text-text-primary hover:bg-slate-100 px-3 py-2 text-xs font-bold transition-colors"
                            title="Xem nhanh thông tin bài đăng"
                          >
                            <Maximize2 className="h-3.5 w-3.5 text-text-muted" />
                            <span className="hidden sm:inline">Xem nhanh</span>
                          </button>

                          {/* Nút Báo cáo AI */}
                          <Link
                            href={`/reports/${listing.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1 rounded-lg bg-accent/10 px-3 py-1.5 text-xs font-bold text-accent hover:bg-accent hover:text-white transition-colors"
                            title="Xem Báo cáo Thẩm định AI"
                          >
                            <Sparkles className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Báo cáo AI</span>
                          </Link>

                          {/* Nút Xóa tin */}
                          <button
                            type="button"
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
                    <span className="text-xs text-text-muted">Đã sử dụng {aiUsed}/{aiLimit} lượt</span>
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
                  <h3 className="text-sm font-extrabold text-text-primary">
                    Thông tin gói hội viên: {user?.package || 'Free'}
                  </h3>
                  {!isFree ? (
                    <div className="rounded-2xl bg-amber-50/50 border border-amber-200 p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-amber-700 uppercase">
                          GÓI {user?.package} VIP
                        </span>
                        <span className="text-[11px] font-bold text-success">Đang hoạt động</span>
                      </div>
                      <p className="text-xs text-text-secondary">
                        Đã kích hoạt quyền lợi gói {user?.package} VIP: Đăng tin ưu tiên và {aiLimit} Báo cáo AI chuyên sâu. Hạn sử dụng: {user?.packageExpiry || '30 ngày'}.
                      </p>
                      <Link
                        href="/pricing"
                        className="inline-block rounded-xl bg-accent px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-accent-hover transition-colors"
                      >
                        Gia hạn hoặc Nâng cấp gói cao hơn
                      </Link>
                    </div>
                  ) : (
                    <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-slate-700 uppercase">
                          GÓI MIỄN PHÍ (FREE)
                        </span>
                        <span className="text-[11px] font-semibold text-slate-500">Mặc định</span>
                      </div>
                      <p className="text-xs text-text-secondary">
                        Bạn đang sử dụng tài khoản Miễn phí. Giới hạn 3 tin đăng thường và 1 báo cáo phân tích AI cơ bản.
                      </p>
                      <div className="pt-2">
                        <Link
                          href="/pricing"
                          className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-xs font-black text-white shadow-lg shadow-accent/25 hover:bg-accent-hover transition-all"
                        >
                          <Tag className="h-4 w-4" />
                          <span>Nâng cấp lên gói VIP (Basic / Pro / Agency)</span>
                        </Link>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

          </div>

        </div>
      </main>

      {/* ── QUICK VIEW MODAL (XEM NHANH BÀI ĐĂNG) ── */}
      <AnimatePresence>
        {quickViewListing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-3xl rounded-3xl bg-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-slate-50/80">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-black text-accent">
                    Xem nhanh Bất động sản
                  </span>
                  {quickViewListing.status === 'pending' ? (
                    <span className="rounded-full bg-amber-100 text-amber-800 border border-amber-300 px-2.5 py-0.5 text-xs font-bold flex items-center gap-1">
                      ⏳ Đang chờ duyệt
                    </span>
                  ) : (
                    <span className="rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 text-xs font-bold flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Đã duyệt công khai
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setQuickViewListing(null)}
                  className="rounded-full p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
                  title="Đóng"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Scrollable Body */}
              <div className="overflow-y-auto p-6 space-y-6">
                {/* Image Gallery */}
                <div className="space-y-2">
                  <div className="relative h-64 sm:h-80 w-full overflow-hidden rounded-2xl bg-slate-100">
                    <img
                      src={quickViewListing.images[activeQuickViewImgIndex] || quickViewListing.images[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80'}
                      alt={quickViewListing.title}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute bottom-3 right-3 rounded-lg bg-black/60 backdrop-blur-md px-2.5 py-1 text-xs font-bold text-white">
                      {activeQuickViewImgIndex + 1} / {quickViewListing.images.length || 1}
                    </div>
                  </div>
                  {quickViewListing.images.length > 1 && (
                    <div className="flex items-center gap-2 overflow-x-auto pb-1">
                      {quickViewListing.images.map((img, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setActiveQuickViewImgIndex(idx)}
                          className={`relative h-16 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all cursor-pointer ${
                            activeQuickViewImgIndex === idx ? 'border-accent shadow-sm' : 'border-transparent opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img src={img} alt="" className="h-full w-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-4">
                    <div>
                      <h3 className="text-lg font-extrabold text-text-primary leading-snug">
                        {quickViewListing.title}
                      </h3>
                      <p className="text-xs text-text-muted mt-1 flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-accent shrink-0" />
                        <span>{quickViewListing.address || `${quickViewListing.district}, Hà Nội`}</span>
                      </p>
                    </div>
                    <div className="sm:text-right shrink-0">
                      <span className="text-xl font-black text-accent block">
                        {formatCurrencyVND(quickViewListing.price)}
                      </span>
                      <span className="text-xs text-text-muted font-bold">
                        ~{Math.round(quickViewListing.price / quickViewListing.area / 1000000)} tr/m²
                      </span>
                    </div>
                  </div>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="rounded-xl border border-border bg-slate-50 p-3 text-center">
                      <span className="text-[10px] text-text-muted block font-semibold">Diện tích</span>
                      <span className="text-sm font-extrabold text-text-primary">{quickViewListing.area} m²</span>
                    </div>
                    <div className="rounded-xl border border-border bg-slate-50 p-3 text-center">
                      <span className="text-[10px] text-text-muted block font-semibold">Phòng ngủ</span>
                      <span className="text-sm font-extrabold text-text-primary">{quickViewListing.bedrooms || 3} PN</span>
                    </div>
                    <div className="rounded-xl border border-border bg-slate-50 p-3 text-center">
                      <span className="text-[10px] text-text-muted block font-semibold">Phòng tắm</span>
                      <span className="text-sm font-extrabold text-text-primary">{quickViewListing.bathrooms || 2} PT</span>
                    </div>
                    <div className="rounded-xl border border-border bg-slate-50 p-3 text-center">
                      <span className="text-[10px] text-text-muted block font-semibold">Quy hoạch</span>
                      <span className="text-xs font-bold text-emerald-700 truncate block mt-0.5">{quickViewListing.planningZone || 'Đất ở đô thị'}</span>
                    </div>
                  </div>

                  {/* Description */}
                  {quickViewListing.description && (
                    <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4 space-y-1.5">
                      <h4 className="text-xs font-extrabold text-text-primary">Mô tả chi tiết</h4>
                      <p className="text-xs text-text-secondary leading-relaxed whitespace-pre-line">
                        {quickViewListing.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 sm:px-6 border-t border-border bg-slate-50">
                <button
                  type="button"
                  onClick={() => setQuickViewListing(null)}
                  className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold text-text-secondary hover:text-text-primary rounded-xl hover:bg-slate-200/60 transition-colors cursor-pointer"
                >
                  Đóng cửa sổ
                </button>
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <Link
                    href={`/reports/${quickViewListing.id}`}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 px-4 py-2.5 text-xs font-bold hover:bg-purple-100 transition-colors"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>Báo cáo AI</span>
                  </Link>
                  <Link
                    href={`/listings/${quickViewListing.id}`}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-xl bg-accent hover:bg-accent-hover text-white px-5 py-2.5 text-xs font-bold shadow-md shadow-accent/20 transition-all"
                  >
                    <Eye className="h-4 w-4" />
                    <span>Xem trang đầy đủ</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
