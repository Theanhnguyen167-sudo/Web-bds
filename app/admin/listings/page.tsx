'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { DataTable, Column } from '@/components/admin/DataTable';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { mockAdminListings, AdminListing } from '@/lib/admin-data';
import { formatCurrencyVND, parseLocationCoordinates } from '@/lib/utils';
import { useApp } from '@/lib/context/AppContext';
import {
  Search,
  PlusCircle,
  Download,
  Filter,
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
  Bed,
  CheckSquare,
  AlertCircle,
  ChevronDown,
  Building2,
  FileText
} from 'lucide-react';

export default function AdminListingsPage() {
  const router = useRouter();
  const { addToast, refreshListings, updateListingStatus, listings: appListings } = useApp();
  const [listings, setListings] = useState<AdminListing[]>(mockAdminListings);
  const [activeStatusTab, setActiveStatusTab] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  // Dropdown "+ Đăng tin mới" state
  const [showCreateDropdown, setShowCreateDropdown] = useState(false);

  // Delete modal state
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Review Drawer State
  const [reviewListing, setReviewListing] = useState<AdminListing | null>(null);
  const [rejectionReason, setRejectionReason] = useState('Ảnh không phù hợp');
  const [isRejecting, setIsRejecting] = useState(false);

  // Tải danh sách tin đăng từ Supabase + LocalStorage người dùng vừa tạo
  const fetchAdminListings = async () => {
    setIsLoading(true);
    try {
      // 1. Lấy tin từ API Supabase
      let remoteListings: AdminListing[] = [];
      try {
        const res = await fetch('/api/listings?status=all');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            remoteListings = json.data.map((r: any) => {
              const coords = parseLocationCoordinates(r.location, r.district);
              const lat = typeof r.lat === 'number' && !isNaN(r.lat) && r.lat !== 0 ? r.lat : coords.lat;
              const lng = typeof r.lng === 'number' && !isNaN(r.lng) && r.lng !== 0 ? r.lng : coords.lng;
              return {
                id: r.id,
                title: r.title,
                price: r.price,
                area: r.area,
                type: r.property_type || 'house',
                district: r.district,
                address: r.address,
                authorName: r.users?.full_name || 'Khách hàng',
                authorPhone: r.users?.phone || '0988 123 456',
                authorAvatar: r.users?.avatar_url,
                status: r.status || 'pending',
                createdAt: r.created_at ? r.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
                expiresAt: '2026-12-31',
                images: r.images && r.images.length > 0 ? r.images : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80'],
                views: r.views || 1,
                planningZone: 'Đất ở đô thị',
                isFeatured: r.is_featured || false,
                lat,
                lng,
              };
            });
          }
        }
      } catch (err) {
        console.warn('Cannot fetch remote listings in admin:', err);
      }

      // 2. Lấy tin người dùng vừa tạo từ LocalStorage (đảm bảo tin mới luôn hiện dù Supabase chưa mở RLS)
      let localListings: AdminListing[] = [];
      if (typeof window !== 'undefined') {
        try {
          const raw = localStorage.getItem('hanoi_platform_user_listings');
          if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
              localListings = parsed.map((item: any) => {
                let lat = item.lat;
                let lng = item.lng;
                if (!lat || !lng || (item.district && item.district !== 'Cầu Giấy' && Math.abs(lat - 21.0315) < 0.002 && Math.abs(lng - 105.7825) < 0.002)) {
                  const c = parseLocationCoordinates(null, item.district);
                  lat = c.lat;
                  lng = c.lng;
                }
                return {
                  id: item.id,
                  title: item.title,
                  price: item.price,
                  area: item.area,
                  type: item.type || 'house',
                  district: item.district,
                  address: item.address,
                  authorName: item.authorName || 'Cozy Hollys',
                  authorPhone: item.authorPhone || '0988 123 456',
                  authorAvatar: item.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
                  status: item.status || 'pending',
                  createdAt: item.createdAt || new Date().toISOString().split('T')[0],
                  expiresAt: '2026-12-31',
                  images: item.images && item.images.length > 0 ? item.images : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80'],
                  views: item.views || 1,
                  planningZone: item.planningZone || 'Đất ở đô thị',
                  isFeatured: false,
                  lat,
                  lng,
                };
              });
            }
          }
        } catch (e) {
          console.warn('Lỗi đọc local listings trong admin:', e);
        }
      }

      // 3. Hợp nhất: Remote ưu tiên -> Local người dùng -> Mocks mẫu
      const existingIds = new Set<string>();
      const combined: AdminListing[] = [];

      for (const item of remoteListings) {
        existingIds.add(item.id);
        combined.push(item);
      }

      for (const item of localListings) {
        if (!existingIds.has(item.id)) {
          existingIds.add(item.id);
          combined.push(item);
        }
      }

      for (const item of mockAdminListings) {
        if (!existingIds.has(item.id)) {
          existingIds.add(item.id);
          combined.push(item);
        }
      }

      setListings(combined);
    } catch (e) {
      console.warn('Lỗi khi tải tin quản trị:', e);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchAdminListings();
  }, [appListings]);

  // Filter listings
  const filteredListings = listings.filter((l) => {
    if (activeStatusTab !== 'all' && l.status !== activeStatusTab) return false;
    if (selectedDistrict !== 'all' && l.district !== selectedDistrict) return false;
    if (selectedType !== 'all' && l.type !== selectedType) return false;
    if (
      searchTerm &&
      !l.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !l.address.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const pendingCount = listings.filter((l) => l.status === 'pending').length;

  const handleApprove = async (id: string) => {
    // 1. Cập nhật giao diện quản trị ngay lập tức
    setListings((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: 'active' as const } : l))
    );
    addToast('🎉 Đã phê duyệt! Tin đăng đã xuất bản và thông báo đã được gửi đến tài khoản người dùng.', 'success');
    setReviewListing(null);
    setIsRejecting(false);

    // 2. Cập nhật qua AppContext (đồng bộ state toàn app + localStorage + Supabase PATCH)
    await updateListingStatus(id, 'active');
    await refreshListings();
  };

  const handleReject = async (id: string) => {
    setListings((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: 'rejected' as const } : l))
    );
    addToast(`Đã từ chối tin đăng. Lý do: ${rejectionReason}`, 'warning');
    setReviewListing(null);
    setIsRejecting(false);

    await updateListingStatus(id, 'rejected', rejectionReason);
    await refreshListings();
  };

  const handleToggleHide = async (listing: AdminListing) => {
    const nextStatus = listing.status === 'expired' ? 'active' : 'expired';
    setListings((prev) =>
      prev.map((l) => (l.id === listing.id ? { ...l, status: nextStatus as any } : l))
    );
    addToast(
      nextStatus === 'expired'
        ? `Đã ẩn tin đăng: "${listing.title}"`
        : `Đã kích hoạt hiển thị lại tin: "${listing.title}"`,
      'info'
    );
    await updateListingStatus(listing.id, nextStatus === 'active' ? 'active' : 'rejected');
  };

  const handlePublish = async (listing: AdminListing) => {
    setListings((prev) =>
      prev.map((l) => (l.id === listing.id ? { ...l, status: 'active' as const } : l))
    );
    addToast(`Đã xuất bản tin đăng: "${listing.title}"`, 'success');
    await updateListingStatus(listing.id, 'active');
    await refreshListings();
  };

  const handleDelete = (id: string) => {
    setListings((prev) => prev.filter((l) => l.id !== id));
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('hanoi_platform_user_listings');
        if (raw) {
          const list = JSON.parse(raw);
          if (Array.isArray(list)) {
            const filtered = list.filter((item: any) => item.id !== id);
            localStorage.setItem('hanoi_platform_user_listings', JSON.stringify(filtered));
          }
        }
      } catch {}
    }
    setDeleteConfirmId(null);
    addToast('Đã xóa vĩnh viễn tin đăng khỏi hệ thống', 'success');
  };

  const columns: Column<AdminListing>[] = [
    {
      key: 'title',
      header: 'Bất động sản',
      sortable: true,
      render: (l) => (
        <div className="flex items-center gap-3">
          <img
            src={l.images[0]}
            alt={l.title}
            className="h-12 w-16 rounded-xl object-cover shrink-0 bg-slate-100 ring-1 ring-slate-200"
          />
          <div className="min-w-0">
            <Link
              href={`/admin/listings/${l.id}`}
              className="font-bold text-navy hover:text-orange-500 transition-colors block truncate max-w-xs"
            >
              {l.title}
            </Link>
            <p className="text-[11px] text-slate-400 truncate flex items-center gap-1">
              <MapPin className="h-3 w-3 text-orange-400" />
              {l.address}
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
        const types = { house: 'Nhà phố', apartment: 'Chung cư', land: 'Đất nền', villa: 'Biệt thự' };
        return <span className="font-semibold text-slate-700">{types[l.type]}</span>;
      },
    },
    {
      key: 'price',
      header: 'Mức giá',
      sortable: true,
      render: (l) => (
        <div>
          <span className="font-extrabold text-orange-600 block">
            {formatCurrencyVND(l.price)}
          </span>
          <span className="text-[10px] text-slate-400">{l.area} m²</span>
        </div>
      ),
    },
    {
      key: 'authorName',
      header: 'Người đăng',
      sortable: true,
      render: (l) => (
        <div>
          <p className="font-bold text-navy">{l.authorName}</p>
          <p className="text-[11px] text-slate-400">{l.authorPhone}</p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Trạng thái',
      sortable: true,
      render: (l) => <StatusBadge status={l.status} />,
    },
    {
      key: 'createdAt',
      header: 'Ngày đăng',
      sortable: true,
      render: (l) => <span className="text-slate-400">{l.createdAt}</span>,
    },
  ];

  return (
    <div className="flex-1 flex flex-col relative">
      <AdminHeader title="Quản lý Tin đăng" breadcrumb="Tin đăng" />

      <main className="p-6 space-y-5 max-w-7xl">
        {/* ── HEADER ROW ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-extrabold text-navy">
              Tất cả Tin đăng ({listings.length.toLocaleString()})
            </h2>
            <p className="text-xs text-slate-500">
              Kiểm duyệt, chỉnh sửa nội dung và quản lý trạng thái tin bất động sản.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => addToast('Đang xuất danh sách tin đăng...', 'info')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-2xs transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export</span>
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
                    href="/admin/listings/create"
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
                        Quy trình chuẩn 6 bước: Vị trí, hình ảnh, thông số & bản đồ
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

        {/* ── STATUS TABS ── */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1">
          {[
            { id: 'all', label: `Tất cả (${listings.length})` },
            {
              id: 'pending',
              label: `Chờ duyệt (${pendingCount})`,
              badge: pendingCount > 0,
            },
            { id: 'active', label: 'Đang hiển thị' },
            { id: 'expired', label: 'Hết hạn' },
            { id: 'rejected', label: 'Bị từ chối' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveStatusTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeStatusTab === tab.id
                  ? 'bg-navy text-white shadow-2xs'
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

        {/* ── FILTER & SEARCH BAR ── */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-6 relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm theo tiêu đề, địa chỉ..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 focus:bg-white"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500"
            >
              <option value="all">Tất cả quận</option>
              <option value="Đống Đa">Đống Đa</option>
              <option value="Tây Hồ">Tây Hồ</option>
              <option value="Cầu Giấy">Cầu Giấy</option>
              <option value="Nam Từ Liêm">Nam Từ Liêm</option>
              <option value="Ba Đình">Ba Đình</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500"
            >
              <option value="all">Tất cả loại BĐS</option>
              <option value="house">Nhà phố</option>
              <option value="apartment">Chung cư</option>
              <option value="land">Đất nền</option>
              <option value="villa">Biệt thự</option>
            </select>
          </div>
        </div>

        {/* ── LISTINGS DATA TABLE ── */}
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
                  className="px-2.5 py-1 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center gap-1 shadow-2xs"
                  title="Duyệt tin đăng"
                >
                  <Eye className="h-3 w-3" />
                  <span>Duyệt tin</span>
                </button>
              )}

              {listing.status === 'active' ? (
                <button
                  type="button"
                  onClick={() => handleToggleHide(listing)}
                  className="p-1.5 rounded-lg hover:bg-amber-50 text-slate-400 hover:text-amber-600 transition-colors"
                  title="Ẩn tin đăng"
                >
                  <EyeOff className="h-3.5 w-3.5" />
                </button>
              ) : (
                listing.status !== 'pending' && (
                  <button
                    type="button"
                    onClick={() => handlePublish(listing)}
                    className="p-1.5 rounded-lg hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 transition-colors"
                    title="Xuất bản lại tin đăng"
                  >
                    <CheckCircle className="h-3.5 w-3.5" />
                  </button>
                )
              )}

              <Link
                href={`/listings/${listing.id}`}
                target="_blank"
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-orange-500 transition-colors"
                title="Xem tin đăng trực tiếp trên web"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>

              <Link
                href={`/admin/listings/${listing.id}`}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-navy transition-colors"
                title="Chỉnh sửa chi tiết"
              >
                <Edit className="h-3.5 w-3.5" />
              </Link>

              <button
                type="button"
                onClick={() => setDeleteConfirmId(listing.id)}
                className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                title="Xóa tin đăng"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        />
      </main>

      {/* ── SLIDE-OVER QUICK REVIEW DRAWER ── */}
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
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col overflow-hidden"
            >
              {/* Drawer Header */}
              <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <div>
                  <h3 className="font-extrabold text-sm text-navy">Xem xét tin đăng</h3>
                  <p className="text-[11px] text-slate-400">Mã tin: #{reviewListing.id}</p>
                </div>
                <button
                  onClick={() => setReviewListing(null)}
                  className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
                {/* Images */}
                <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                  <img
                    src={reviewListing.images[0]}
                    alt={reviewListing.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="space-y-2">
                  <Link
                    href={`/listings/${reviewListing.id}`}
                    target="_blank"
                    className="font-bold text-sm text-navy hover:text-orange-600 transition-colors flex items-center justify-between gap-2"
                  >
                    <span>{reviewListing.title}</span>
                    <ExternalLink className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                  </Link>
                  <p className="text-slate-500 flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-orange-500" />
                    {reviewListing.address}
                  </p>
                  <div className="flex items-center gap-4 pt-1">
                    <span className="text-base font-black text-orange-600">
                      {formatCurrencyVND(reviewListing.price)}
                    </span>
                    <span className="text-slate-500 font-semibold">
                      {reviewListing.area} m²
                    </span>
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-600 font-bold text-[10px]">
                      {reviewListing.planningZone}
                    </span>
                  </div>
                </div>

                {/* Checklist */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <p className="font-bold text-navy">Tiêu chuẩn kiểm duyệt:</p>
                  {[
                    'Ảnh thực tế, không vi phạm bản quyền',
                    'Thông tin địa chỉ chính xác trên bản đồ',
                    'Giá hợp lý so với thị trường',
                    'Mô tả không chứa nội dung spam / lừa đảo',
                    'Pháp lý được nêu rõ ràng',
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

                {/* Rejection Reasons Options */}
                {isRejecting && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-4 rounded-xl bg-rose-50 border border-rose-200 space-y-2"
                  >
                    <p className="font-bold text-rose-700">Chọn lý do từ chối:</p>
                    {[
                      'Ảnh không phù hợp',
                      'Thông tin sai lệch',
                      'Vi phạm điều khoản đăng tin',
                      'Spam / lừa đảo',
                    ].map((reason) => (
                      <label key={reason} className="flex items-center gap-2 text-slate-700 cursor-pointer">
                        <input
                          type="radio"
                          name="reject"
                          checked={rejectionReason === reason}
                          onChange={() => setRejectionReason(reason)}
                          className="text-rose-600"
                        />
                        <span>{reason}</span>
                      </label>
                    ))}
                  </motion.div>
                )}
              </div>

              {/* Drawer Footer Actions */}
              <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-2">
                {!isRejecting ? (
                  <>
                    <button
                      onClick={() => handleApprove(reviewListing.id)}
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Phê duyệt tin đăng</span>
                    </button>

                    <button
                      onClick={() => setIsRejecting(true)}
                      className="w-full py-2.5 border border-rose-200 hover:bg-rose-50 text-rose-600 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
                    >
                      <XCircle className="h-4 w-4" />
                      <span>Từ chối và thông báo</span>
                    </button>
                  </>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsRejecting(false)}
                      className="flex-1 py-2.5 border border-slate-200 bg-white text-slate-700 font-bold text-xs rounded-xl"
                    >
                      Quay lại
                    </button>
                    <button
                      onClick={() => handleReject(reviewListing.id)}
                      className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl"
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
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs"
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
