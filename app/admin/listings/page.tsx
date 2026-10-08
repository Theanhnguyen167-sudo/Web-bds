'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { DataTable, Column } from '@/components/admin/DataTable';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { formatCurrencyVND } from '@/lib/utils';
import { useApp } from '@/lib/context/AppContext';
import {
  getLocalListings,
  approveListingRecord,
  rejectListingRecord,
  toggleHideListingRecord,
  deleteListingRecord,
  getListingCounts,
  EVENT_LISTINGS_UPDATED,
} from '@/lib/services/listing-service';
import { ListingItem } from '@/lib/mock-data';
import {
  Search,
  PlusCircle,
  Download,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  X,
  ExternalLink,
  MapPin,
  Maximize2,
  Building2,
  FileText,
  User,
  Phone,
  Mail,
  Calendar,
  AlertTriangle,
  RefreshCw,
  ChevronDown
} from 'lucide-react';

export default function AdminListingsPage() {
  const router = useRouter();
  const { addToast, listings: contextListings, refreshListings } = useApp();
  
  // Single Source of Truth
  const [listings, setListings] = useState<ListingItem[]>(() => getLocalListings());
  const [activeStatusTab, setActiveStatusTab] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Dropdown "+ Đăng tin mới" state
  const [showCreateDropdown, setShowCreateDropdown] = useState(false);

  // Delete modal state
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Review Drawer State
  const [reviewListing, setReviewListing] = useState<ListingItem | null>(null);
  const [rejectionReason, setRejectionReason] = useState('Thiếu thông tin pháp lý hoặc sổ đỏ rõ ràng');
  const [customRejectionReason, setCustomRejectionReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);

  // Đồng bộ Single Source of Truth khi AppContext hoặc Storage thay đổi
  useEffect(() => {
    const syncFromStore = () => {
      setListings(getLocalListings());
    };
    syncFromStore();

    window.addEventListener(EVENT_LISTINGS_UPDATED, syncFromStore);
    window.addEventListener('storage', syncFromStore);

    return () => {
      window.removeEventListener(EVENT_LISTINGS_UPDATED, syncFromStore);
      window.removeEventListener('storage', syncFromStore);
    };
  }, [contextListings]);

  // Đếm số lượng động từ dữ liệu thật (Section 14)
  const counts = getListingCounts(listings);

  const statusTabs = [
    { id: 'all', label: `Tất cả (${counts.total})` },
    {
      id: 'pending',
      label: `Chờ duyệt (${counts.pending})`,
      badge: counts.pending > 0,
    },
    { id: 'active', label: `Đang hiển thị (${counts.active})` },
    { id: 'rejected', label: `Bị từ chối (${counts.rejected})` },
    { id: 'hidden', label: `Đã ẩn (${counts.hidden})` },
    { id: 'expired', label: `Hết hạn (${counts.expired})` },
  ];

  // Lọc và Tìm kiếm theo Section 15 (Tiêu đề, Địa chỉ, Người đăng, SĐT, ID tin)
  const filteredListings = listings.filter((l) => {
    if (activeStatusTab !== 'all' && l.status !== activeStatusTab) return false;
    if (selectedDistrict !== 'all' && l.district !== selectedDistrict) return false;
    if (selectedType !== 'all' && l.type !== selectedType) return false;
    
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      const matchTitle = l.title?.toLowerCase().includes(q);
      const matchAddress = l.address?.toLowerCase().includes(q);
      const matchId = l.id?.toLowerCase().includes(q);
      const sellerName = (l.seller?.fullName || l.authorName || '').toLowerCase();
      const sellerPhone = l.seller?.phone || l.authorPhone || '';
      const sellerEmail = (l.seller?.email || l.authorEmail || '').toLowerCase();

      if (!matchTitle && !matchAddress && !matchId && !sellerName.includes(q) && !sellerPhone.includes(q) && !sellerEmail.includes(q)) {
        return false;
      }
    }
    return true;
  });

  // Admin Duyệt tin (Section 8)
  const handleApprove = async (id: string) => {
    const updated = await approveListingRecord(id);
    if (updated) {
      setListings(getLocalListings());
      addToast(`🎉 Đã duyệt tin "${updated.title}"! Thông báo đã gửi riêng đến chủ tin.`, 'success');
    }
    setReviewListing(null);
    setIsRejecting(false);
  };

  // Admin Từ chối tin (Section 9)
  const handleReject = async (id: string) => {
    const finalReason = customRejectionReason.trim() || rejectionReason;
    const updated = await rejectListingRecord(id, finalReason);
    if (updated) {
      setListings(getLocalListings());
      addToast(`Đã từ chối tin đăng. Lý do: "${finalReason}". Đã gửi thông báo đến chủ tin.`, 'warning');
    }
    setReviewListing(null);
    setIsRejecting(false);
    setCustomRejectionReason('');
  };

  // Admin Ẩn / Bỏ ẩn tin (Section 10)
  const handleToggleHide = async (listing: ListingItem) => {
    const isHidden = listing.status === 'hidden';
    const updated = await toggleHideListingRecord(listing.id, !isHidden);
    if (updated) {
      setListings(getLocalListings());
      addToast(
        !isHidden
          ? `Đã ẩn tin đăng: "${listing.title}"`
          : `Đã kích hoạt hiển thị lại tin: "${listing.title}"`,
        'info'
      );
    }
  };

  // Admin Xóa tin
  const handleDelete = (id: string) => {
    deleteListingRecord(id);
    setListings(getLocalListings());
    setDeleteConfirmId(null);
    addToast('Đã xóa vĩnh viễn tin đăng khỏi hệ thống', 'success');
  };

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshListings();
      setListings(getLocalListings());
      addToast('Đã làm mới danh sách tin đăng từ hệ thống', 'info');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Cấu hình các cột Bảng Admin (Section 6)
  const columns: Column<ListingItem>[] = [
    {
      key: 'title',
      header: 'Bất động sản',
      sortable: true,
      render: (l) => (
        <div className="flex items-center gap-3">
          <img
            src={l.images[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80'}
            alt={l.title}
            className="h-12 w-16 rounded-xl object-cover shrink-0 bg-slate-100 ring-1 ring-slate-200"
          />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                #{l.id}
              </span>
              <span className="text-[10px] font-semibold text-orange-600 bg-orange-50 px-1.5 py-0.2 rounded">
                Owner: {l.ownerId || l.userId || 'Chưa gán'}
              </span>
            </div>
            <Link
              href={`/admin/listings/${l.id}`}
              className="font-bold text-navy hover:text-orange-500 transition-colors block truncate max-w-xs text-xs"
              title={l.title}
            >
              {l.title}
            </Link>
            <p className="text-[11px] text-slate-400 truncate flex items-center gap-1 mt-0.5">
              <MapPin className="h-3 w-3 text-orange-400 shrink-0" />
              <span>{l.address}</span>
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Loại hình',
      sortable: true,
      render: (l) => {
        const types: Record<string, string> = {
          house: 'Nhà phố',
          apartment: 'Chung cư',
          land: 'Đất nền',
          villa: 'Biệt thự',
        };
        return <span className="font-semibold text-slate-700 text-xs">{types[l.type] || l.type}</span>;
      },
    },
    {
      key: 'price',
      header: 'Mức giá / DT',
      sortable: true,
      render: (l) => (
        <div>
          <span className="font-extrabold text-orange-600 block text-xs">
            {formatCurrencyVND(l.price)}
          </span>
          <span className="text-[11px] text-slate-500 font-medium">
            {l.area} m² ({Math.round(l.price / (l.area || 1) / 1000000)} tr/m²)
          </span>
        </div>
      ),
    },
    {
      key: 'authorName',
      header: 'Người đăng',
      sortable: true,
      render: (l) => {
        const sellerName = l.seller?.fullName || l.authorName || 'Chưa cập nhật';
        const sellerPhone = l.seller?.phone || l.authorPhone || '';
        const sellerEmail = l.seller?.email || l.authorEmail || '';
        const sellerType = l.seller?.sellerType || l.sellerType || 'Chính chủ';

        return (
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <p className="font-bold text-navy text-xs">{sellerName}</p>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 border border-blue-200">
                {sellerType}
              </span>
            </div>
            {sellerPhone && (
              <p className="text-[11px] text-slate-500 flex items-center gap-1">
                <Phone className="h-2.5 w-2.5 text-slate-400" />
                <span>{sellerPhone}</span>
              </p>
            )}
            {sellerEmail && (l.seller?.allowEmailContact ?? true) && (
              <p className="text-[10px] text-slate-400 truncate max-w-[140px]">
                {sellerEmail}
              </p>
            )}
          </div>
        );
      },
    },
    {
      key: 'status',
      header: 'Trạng thái',
      sortable: true,
      render: (l) => (
        <div className="space-y-1">
          <StatusBadge status={l.status as any} />
          {l.status === 'rejected' && l.rejectionReason && (
            <p className="text-[10px] text-rose-600 truncate max-w-[150px]" title={l.rejectionReason}>
              Lý do: {l.rejectionReason}
            </p>
          )}
        </div>
      ),
    },
    {
      key: 'createdAt',
      header: 'Thời gian',
      sortable: true,
      render: (l) => (
        <div className="text-[11px] text-slate-500 space-y-0.5">
          <p title="Ngày đăng">Tạo: {l.createdAt}</p>
          {l.updatedAt && l.updatedAt.split('T')[0] !== l.createdAt && (
            <p className="text-slate-400 text-[10px]" title="Ngày cập nhật gần nhất">
              Sửa: {l.updatedAt.split('T')[0]}
            </p>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="flex-1 flex flex-col relative">
      <AdminHeader title="Quản lý Tin đăng" breadcrumb="Tin đăng" />

      <main className="p-6 space-y-5 max-w-7xl">
        {/* ── HEADER ROW ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-extrabold text-navy flex items-center gap-2">
              <span>Tất cả Tin đăng Bất động sản</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-navy text-white font-black">
                {listings.length}
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Dữ liệu đồng bộ trực tiếp hai chiều với Seller Portal. Admin duyệt, từ chối hoặc quản lý trạng thái.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
              title="Đồng bộ lại danh sách tin đăng"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin text-orange-500' : ''}`} />
              <span>Làm mới</span>
            </button>

            {/* Dropdown Menu "+ Đăng tin mới" */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowCreateDropdown(!showCreateDropdown)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-md shadow-orange-500/20 transition-all cursor-pointer"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span>+ Đăng tin mới</span>
                <ChevronDown className={`h-3 w-3 ml-0.5 transition-transform ${showCreateDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showCreateDropdown && (
                <div className="absolute right-0 top-full mt-2 z-40 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 space-y-1 animate-in fade-in zoom-in-95">
                  <Link
                    href="/post-property"
                    onClick={() => setShowCreateDropdown(false)}
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-orange-50/60 transition-colors group"
                  >
                    <div className="p-2 rounded-lg bg-orange-100 text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                      <Building2 className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-navy group-hover:text-orange-600">
                        + Đăng tin bất động sản
                      </p>
                      <p className="text-[10px] text-slate-400">
                        Wizard chuẩn 6 bước: Vị trí, hình ảnh, thông số & người đăng
                      </p>
                    </div>
                  </Link>

                  <Link
                    href="/admin/articles/new"
                    onClick={() => setShowCreateDropdown(false)}
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-blue-50/60 transition-colors group"
                  >
                    <div className="p-2 rounded-lg bg-blue-100 text-blue-600 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-navy group-hover:text-blue-600">
                        + Tạo bài viết / tin tức
                      </p>
                      <p className="text-[10px] text-slate-400">
                        CMS chuyên nghiệp, Rich Text Editor & khối nội dung
                      </p>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── STATUS TABS (ĐẾM ĐỘNG CHUẨN TỪ DỮ LIỆU THẬT, SECTION 14) ── */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {statusTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveStatusTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeStatusTab === tab.id
                  ? 'bg-navy text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
              )}
            </button>
          ))}
        </div>

        {/* ── FILTER & SEARCH BAR (SECTION 15) ── */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-6 relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo tiêu đề, địa chỉ, người đăng, SĐT hoặc ID..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 focus:bg-white font-medium"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 cursor-pointer"
            >
              <option value="all">Tất cả quận / huyện</option>
              <option value="Cầu Giấy">Cầu Giấy</option>
              <option value="Đống Đa">Đống Đa</option>
              <option value="Tây Hồ">Tây Hồ</option>
              <option value="Ba Đình">Ba Đình</option>
              <option value="Nam Từ Liêm">Nam Từ Liêm</option>
              <option value="Bắc Từ Liêm">Bắc Từ Liêm</option>
              <option value="Hoàn Kiếm">Hoàn Kiếm</option>
              <option value="Hai Bà Trưng">Hai Bà Trưng</option>
              <option value="Thanh Xuân">Thanh Xuân</option>
              <option value="Hà Đông">Hà Đông</option>
              <option value="Hoàng Mai">Hoàng Mai</option>
              <option value="Long Biên">Long Biên</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 cursor-pointer"
            >
              <option value="all">Tất cả loại BĐS</option>
              <option value="house">Nhà phố / Nhà riêng</option>
              <option value="apartment">Chung cư cao cấp</option>
              <option value="land">Đất nền / Đất thổ cư</option>
              <option value="villa">Biệt thự / Shophouse</option>
            </select>
          </div>
        </div>

        {/* ── LISTINGS DATA TABLE (SECTION 6 & 7) ── */}
        <DataTable
          columns={columns}
          data={filteredListings}
          keyExtractor={(l) => l.id}
          itemsPerPage={10}
          actions={(listing) => (
            <div className="flex items-center gap-1">
              {listing.status === 'pending' && (
                <button
                  type="button"
                  onClick={() => {
                    setReviewListing(listing);
                    setIsRejecting(false);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center gap-1 shadow-2xs cursor-pointer"
                  title="Xem xét và duyệt tin đăng"
                >
                  <Eye className="h-3 w-3" />
                  <span>Duyệt tin</span>
                </button>
              )}

              {listing.status === 'active' ? (
                <button
                  type="button"
                  onClick={() => handleToggleHide(listing)}
                  className="p-1.5 rounded-lg hover:bg-amber-50 text-slate-400 hover:text-amber-600 transition-colors cursor-pointer"
                  title="Ẩn tin đăng khỏi trang công khai"
                >
                  <EyeOff className="h-3.5 w-3.5" />
                </button>
              ) : (
                listing.status === 'hidden' && (
                  <button
                    type="button"
                    onClick={() => handleToggleHide(listing)}
                    className="p-1.5 rounded-lg hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer"
                    title="Bỏ ẩn - hiển thị lại tin đăng"
                  >
                    <CheckCircle className="h-3.5 w-3.5" />
                  </button>
                )
              )}

              <Link
                href={`/listings/${listing.id}`}
                target="_blank"
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-orange-500 transition-colors"
                title="Xem tin đăng trên trang người dùng"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>

              <Link
                href={`/admin/listings/${listing.id}`}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-navy transition-colors"
                title="Xem & Chỉnh sửa chi tiết đầy đủ (Section 7)"
              >
                <Edit className="h-3.5 w-3.5" />
              </Link>

              <button
                type="button"
                onClick={() => setDeleteConfirmId(listing.id)}
                className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                title="Xóa tin đăng"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        />
      </main>

      {/* ── SLIDE-OVER QUICK REVIEW DRAWER (SECTION 8 & 9) ── */}
      <AnimatePresence>
        {reviewListing && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setReviewListing(null)}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50"
            />

            {/* Slide Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-white shadow-2xl z-50 flex flex-col overflow-hidden"
            >
              {/* Drawer Header */}
              <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <div>
                  <h3 className="font-extrabold text-sm text-navy">Kiểm duyệt tin đăng BĐS</h3>
                  <p className="text-[11px] text-slate-400">
                    Mã tin: #{reviewListing.id} • Chủ tin: {reviewListing.ownerId}
                  </p>
                </div>
                <button
                  onClick={() => setReviewListing(null)}
                  className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
                {/* Images Gallery */}
                <div className="space-y-2">
                  <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                    <img
                      src={reviewListing.images[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80'}
                      alt={reviewListing.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {reviewListing.images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {reviewListing.images.slice(1).map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`Gallery ${idx + 2}`}
                          className="h-14 w-20 rounded-lg object-cover ring-1 ring-slate-200 shrink-0"
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="space-y-2">
                  <Link
                    href={`/admin/listings/${reviewListing.id}`}
                    className="font-bold text-sm text-navy hover:text-orange-600 transition-colors flex items-center justify-between gap-2"
                  >
                    <span>{reviewListing.title}</span>
                    <ExternalLink className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                  </Link>
                  <p className="text-slate-500 flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-orange-500 shrink-0" />
                    <span>{reviewListing.address}</span>
                  </p>
                  <div className="flex items-center gap-4 pt-1">
                    <span className="text-base font-black text-orange-600">
                      {formatCurrencyVND(reviewListing.price)}
                    </span>
                    <span className="text-slate-500 font-semibold">
                      {reviewListing.area} m²
                    </span>
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-600 font-bold text-[10px]">
                      {reviewListing.planningZone || 'Đất ở đô thị'}
                    </span>
                  </div>
                </div>

                {/* Seller Snapshot Section (Section 20) */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <p className="font-bold text-navy flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-orange-500" />
                    <span>Thông tin người đăng (Seller Snapshot):</span>
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-slate-400">Họ và tên:</span>
                      <p className="font-semibold text-slate-700">
                        {reviewListing.seller?.fullName || reviewListing.authorName || 'Chưa cập nhật'}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-400">Số điện thoại:</span>
                      <p className="font-semibold text-slate-700">
                        {reviewListing.seller?.phone || reviewListing.authorPhone || 'Chưa cập nhật'}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-400">Email:</span>
                      <p className="font-semibold text-slate-700 truncate">
                        {reviewListing.seller?.email || reviewListing.authorEmail || 'Chưa cập nhật'}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-400">Loại người đăng:</span>
                      <p className="font-semibold text-slate-700">
                        {reviewListing.seller?.sellerType || reviewListing.sellerType || 'Chính chủ'}
                      </p>
                    </div>
                    {reviewListing.seller?.companyName && (
                      <div className="col-span-2">
                        <span className="text-slate-400">Công ty / Sàn:</span>
                        <p className="font-semibold text-slate-700">
                          {reviewListing.seller.companyName}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Checklist */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <p className="font-bold text-navy">Tiêu chuẩn kiểm duyệt:</p>
                  {[
                    'Ảnh thực tế, không vi phạm bản quyền',
                    'Thông tin địa chỉ chính xác trên bản đồ Hà Nội',
                    'Giá hợp lý so với mặt bằng thị trường quận',
                    'Mô tả không chứa nội dung spam / lừa đảo',
                    'Pháp lý được nêu rõ ràng (Sổ đỏ / Sổ hồng)',
                  ].map((item, i) => (
                    <label key={i} className="flex items-center gap-2 text-slate-600 cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>{item}</span>
                    </label>
                  ))}
                </div>

                {/* Rejection Reasons Options (Section 9) */}
                {isRejecting && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-4 rounded-xl bg-rose-50 border border-rose-200 space-y-3"
                  >
                    <div className="flex items-center gap-1.5 text-rose-700 font-bold">
                      <AlertTriangle className="h-4 w-4" />
                      <span>Nhập / Chọn lý do từ chối tin đăng:</span>
                    </div>

                    <div className="space-y-1.5">
                      {[
                        'Thiếu thông tin pháp lý hoặc sổ đỏ rõ ràng',
                        'Ảnh chụp mờ, sai thực tế hoặc dính watermark sàn khác',
                        'Mức giá bán bất thường hoặc sai lệch quá lớn',
                        'Địa chỉ không tồn tại hoặc sai vị trí trên bản đồ',
                        'Vi phạm quy chuẩn ngôn từ quảng cáo / spam',
                      ].map((reason) => (
                        <label key={reason} className="flex items-center gap-2 text-slate-700 cursor-pointer text-xs">
                          <input
                            type="radio"
                            name="rejectReason"
                            checked={rejectionReason === reason}
                            onChange={() => {
                              setRejectionReason(reason);
                              setCustomRejectionReason('');
                            }}
                            className="text-rose-600"
                          />
                          <span>{reason}</span>
                        </label>
                      ))}
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-rose-800 mb-1">
                        Hoặc nhập lý do cụ thể khác:
                      </label>
                      <textarea
                        rows={2}
                        value={customRejectionReason}
                        onChange={(e) => setCustomRejectionReason(e.target.value)}
                        placeholder="Nhập chi tiết yêu cầu người bán bổ sung..."
                        className="w-full p-2 text-xs bg-white border border-rose-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 font-medium"
                      />
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Drawer Footer Actions */}
              <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-2">
                {!isRejecting ? (
                  <>
                    <button
                      onClick={() => handleApprove(reviewListing.id)}
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Phê duyệt tin đăng (Xuất bản)</span>
                    </button>

                    <button
                      onClick={() => setIsRejecting(true)}
                      className="w-full py-2.5 border border-rose-200 hover:bg-rose-50 text-rose-600 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <XCircle className="h-4 w-4" />
                      <span>Từ chối duyệt và thông báo</span>
                    </button>
                  </>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsRejecting(false)}
                      className="flex-1 py-2.5 border border-slate-200 bg-white text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-100 cursor-pointer"
                    >
                      Quay lại
                    </button>
                    <button
                      onClick={() => handleReject(reviewListing.id)}
                      className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-sm cursor-pointer"
                    >
                      Xác nhận từ chối
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── MODAL XÁC NHẬN XÓA TIN ĐĂNG ── */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-2.5 rounded-full bg-rose-50">
                <Trash2 className="h-6 w-6" />
              </div>
              <h4 className="font-bold text-navy text-sm">Xác nhận xóa tin đăng?</h4>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Thao tác này sẽ xóa tin đăng bất động sản khỏi hệ thống quản lý. Bạn có chắc chắn muốn tiếp tục?
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs cursor-pointer"
              >
                Xóa tin đăng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
