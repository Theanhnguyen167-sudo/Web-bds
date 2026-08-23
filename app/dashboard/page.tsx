'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { useApp } from '@/lib/context/AppContext';
import { formatCurrencyVND } from '@/lib/utils';
import {
  LayoutDashboard,
  Home,
  Sparkles,
  Heart,
  Tag,
  Settings,
  PlusCircle,
  Eye,
  Trash2,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Clock,
  CheckCircle2,
  Layers,
  RefreshCw,
  Cpu,
  Key,
  Check
} from 'lucide-react';

export default function DashboardPage() {
  const { user, listings, setListings, savedListingIds, addToast } = useApp();
  const [activeTab, setActiveTab] = useState<'listings' | 'reports' | 'saved' | 'stitch' | 'packages'>('listings');
  const [isSyncingStitch, setIsSyncingStitch] = useState(false);
  const [stitchApiKey, setStitchApiKey] = useState('AQ.Ab8RN6IZHLmSH1J7xdlYndtnZm6fJi2_YExaS4HA6Fqfr7YlTw');

  const userListings = listings.slice(0, 5); // Simulated user listings

  const handleDeleteListing = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setListings((prev) => prev.filter((l) => l.id !== id));
    addToast('🗑️ Đã xoá tin đăng thành công', 'info');
  };

  const handleSyncStitch = async () => {
    setIsSyncingStitch(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsSyncingStitch(false);
      addToast('✨ Đã đồng bộ thành công toàn bộ UI Screens & Tokens từ Google Stitch!', 'success');
    } catch {
      setIsSyncingStitch(false);
      addToast('Có lỗi xảy ra khi đồng bộ Stitch', 'error');
    }
  };

  const menuItems = [
    { id: 'listings', label: 'Quản lý tin đăng', icon: Home, count: userListings.length },
    { id: 'reports', label: 'Báo cáo AI đã tạo', icon: Sparkles, count: user?.aiReportsUsed || 8 },
    { id: 'saved', label: 'Tin đã lưu', icon: Heart, count: savedListingIds.length },
    { id: 'stitch', label: 'Đồng bộ Google Stitch', icon: Cpu, badge: 'CONNECTED' },
    { id: 'packages', label: 'Gói dịch vụ VIP', icon: Tag, badge: user?.package?.toUpperCase() || 'PRO' },
  ];

  const stitchScreens = [
    { id: 's1', name: 'HaNoi Realty - Homepage Split Map', category: 'Main Layout', status: 'Đã đồng bộ', components: 14 },
    { id: 's2', name: 'Property Detail & AI Scorecard', category: 'Listing', status: 'Đã đồng bộ', components: 9 },
    { id: 's3', name: '5-Step Create Listing Wizard', category: 'Forms', status: 'Đã đồng bộ', components: 12 },
    { id: 's4', name: 'AI Valuation & Planning Report', category: 'AI Intelligence', status: 'Đã đồng bộ', components: 8 },
    { id: 's5', name: 'Membership Pricing & VIP Table', category: 'Monetization', status: 'Đã đồng bộ', components: 6 },
    { id: 's6', name: 'User Management Dashboard', category: 'Management', status: 'Đã đồng bộ', components: 11 },
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
                <span className="rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-[10px] font-extrabold flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Stitch Connected
                </span>
              </div>
              <p className="text-xs text-text-secondary mt-0.5">{user?.email || 'an@example.com'}</p>
              <p className="text-[11px] text-text-muted mt-1">Hạn gói: {user?.packageExpiry || '2026-09-15'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setActiveTab('stitch')}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-page-bg px-4 py-3 text-xs font-bold text-text-primary hover:bg-slate-100 transition-all"
            >
              <Cpu className="h-4 w-4 text-accent" />
              <span>Stitch API: AQ.Ab8...</span>
            </button>

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
                <span className="text-[11px] text-text-muted font-semibold">Tin đang hoạt động</span>
                <p className="text-2xl font-black text-text-primary mt-1">{userListings.length}</p>
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
                <span className="text-[11px] text-text-muted font-semibold">Stitch UI Sync</span>
                <p className="text-2xl font-black text-emerald-600 mt-1">6 / 6</p>
                <span className="text-[10px] text-emerald-600 font-bold mt-1">Màn hình đồng bộ</span>
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

              {/* TAB 2: GOOGLE STITCH DESIGN SYNC (ACTIVE KEY MANAGEMENT) */}
              {activeTab === 'stitch' && (
                <motion.div
                  key="tab-stitch"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-3xl border border-border bg-white p-6 shadow-sm space-y-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <Cpu className="h-5 w-5 text-accent" />
                        <h3 className="text-base font-extrabold text-text-primary">
                          Google Stitch AI Design System Sync
                        </h3>
                      </div>
                      <p className="text-xs text-text-secondary mt-1">
                        Kết nối và đồng bộ tự động thiết kế UI, components và Design Tokens từ Google Stitch
                      </p>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={isSyncingStitch}
                      onClick={handleSyncStitch}
                      className="flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-xs font-extrabold text-white shadow-md shadow-accent/20 hover:bg-accent-hover transition-all disabled:opacity-75 shrink-0"
                    >
                      <RefreshCw className={`h-4 w-4 ${isSyncingStitch ? 'animate-spin' : ''}`} />
                      <span>{isSyncingStitch ? 'Đang đồng bộ...' : 'Đồng bộ từ Stitch ngay'}</span>
                    </motion.button>
                  </div>

                  {/* Active Key Box */}
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Key className="h-4 w-4 text-emerald-700" />
                        <span className="text-xs font-extrabold text-emerald-900">
                          Khóa Xác Thực Google Stitch Đang Hoạt Động
                        </span>
                      </div>
                      <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white">
                        ACTIVE · CONNECTED
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={stitchApiKey}
                        className="w-full rounded-xl border border-emerald-300 bg-white px-3 py-2 text-xs font-mono font-bold text-slate-800 focus:outline-none select-all"
                      />
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(stitchApiKey);
                          addToast('Đã sao chép khóa Stitch API Key!', 'success');
                        }}
                        className="rounded-xl bg-emerald-700 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-800 transition-colors shrink-0"
                      >
                        Sao chép
                      </button>
                    </div>
                    <p className="text-[11px] text-emerald-700">
                      Khóa này đã được liên kết với Antigravity MCP Server proxy và hệ thống runtime của website.
                    </p>
                  </div>

                  {/* Synchronized Screens List */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">
                      Màn hình & Components Đã Đồng Bộ
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {stitchScreens.map((sc) => (
                        <div
                          key={sc.id}
                          className="flex items-center justify-between rounded-2xl bg-page-bg p-3.5 border border-border"
                        >
                          <div className="space-y-0.5">
                            <h5 className="text-xs font-bold text-text-primary">{sc.name}</h5>
                            <span className="text-[10px] text-text-muted">{sc.category} · {sc.components} UI widgets</span>
                          </div>

                          <span className="rounded-md bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-bold flex items-center gap-1">
                            <Check className="h-3 w-3" />
                            {sc.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 3: REPORTS */}
              {activeTab === 'reports' && (
                <motion.div
                  key="tab-reports"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-3xl border border-border bg-white p-6 shadow-sm space-y-4"
                >
                  <h3 className="text-sm font-extrabold text-text-primary">Báo cáo Thẩm định AI gần đây</h3>
                  <div className="rounded-2xl bg-page-bg p-4 border border-border flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-accent" />
                        <span className="text-xs font-bold text-text-primary">Phố Hào Nam, Đống Đa</span>
                        <span className="rounded bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-bold">
                          Điểm 82/100
                        </span>
                      </div>
                      <p className="text-[11px] text-text-muted">Tạo ngày 2025-08-20 · Được hưởng lợi từ Metro 2A</p>
                    </div>

                    <Link
                      href="/reports/1"
                      className="rounded-lg bg-accent px-3 py-1.5 text-xs font-bold text-white shadow-sm"
                    >
                      Xem chi tiết
                    </Link>
                  </div>
                </motion.div>
              )}

              {/* TAB 4: SAVED */}
              {activeTab === 'saved' && (
                <motion.div
                  key="tab-saved"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-3xl border border-border bg-white p-6 shadow-sm space-y-4"
                >
                  <h3 className="text-sm font-extrabold text-text-primary">Bất động sản yêu thích ({savedListingIds.length})</h3>
                  <p className="text-xs text-text-secondary">
                    Các bất động sản bạn đã bấm lưu tim để theo dõi biến động giá và tiến độ quy hoạch.
                  </p>
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
                      className="inline-block rounded-xl bg-accent px-4 py-2 text-xs font-bold text-white shadow-sm"
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
