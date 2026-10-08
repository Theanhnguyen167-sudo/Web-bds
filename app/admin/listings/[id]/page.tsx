'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { formatCurrencyVND } from '@/lib/utils';
import { useApp } from '@/lib/context/AppContext';
import {
  getLocalListings,
  getListingByIdFromStore,
  approveListingRecord,
  rejectListingRecord,
  toggleHideListingRecord,
  updateListingRecord,
  deleteListingRecord,
} from '@/lib/services/listing-service';
import { ListingItem } from '@/lib/mock-data';
import {
  ArrowLeft,
  Save,
  Trash2,
  MapPin,
  Image as ImageIcon,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  ExternalLink,
  ShieldCheck,
  Building,
  User,
  Phone,
  Mail,
  Calendar,
  Clock,
  Home,
  Compass,
  FileText,
  AlertTriangle,
  Layers,
  Bed,
  Bath,
  Maximize2,
  Briefcase,
  Star
} from 'lucide-react';

export default function AdminListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToast } = useApp();
  const listingId = params.id as string;

  const [listing, setListing] = useState<ListingItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Form edit states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [propertyType, setPropertyType] = useState<'house' | 'apartment' | 'land' | 'villa'>('house');
  
  const [price, setPrice] = useState<string>('0');
  const [area, setArea] = useState<string>('0');
  const [floors, setFloors] = useState<string>('1');
  const [bedrooms, setBedrooms] = useState<string>('1');
  const [bathrooms, setBathrooms] = useState<string>('1');
  const [direction, setDirection] = useState('Đông Nam');
  const [legalStatus, setLegalStatus] = useState('Sổ đỏ chính chủ');

  const [address, setAddress] = useState('');
  const [district, setDistrict] = useState('Cầu Giấy');
  const [ward, setWard] = useState('');
  const [city, setCity] = useState('Hà Nội');
  const [lat, setLat] = useState<number>(21.0315);
  const [lng, setLng] = useState<number>(105.7825);

  const [sellerName, setSellerName] = useState('');
  const [sellerPhone, setSellerPhone] = useState('');
  const [sellerEmail, setSellerEmail] = useState('');
  const [sellerType, setSellerType] = useState('Chính chủ');
  const [companyName, setCompanyName] = useState('');
  const [contactAddress, setContactAddress] = useState('');

  const [status, setStatus] = useState<ListingItem['status']>('pending');
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [customRejectReason, setCustomRejectReason] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Nạp dữ liệu từ Single Source of Truth
  useEffect(() => {
    let found = getListingByIdFromStore(listingId);
    if (!found) {
      const all = getLocalListings();
      found = all.find((l) => l.id === listingId) || null;
    }

    if (found) {
      applyListingData(found);
      setIsLoading(false);
    } else {
      // Fallback: Thử gọi API nếu chưa có ở client
      fetch(`/api/listings/${listingId}`)
        .then((res) => res.json())
        .then((json) => {
          if (json.success && json.data) {
            applyListingData(json.data);
          }
        })
        .finally(() => setIsLoading(false));
    }
  }, [listingId]);

  const applyListingData = (item: ListingItem) => {
    setListing(item);
    setTitle(item.title || '');
    setDescription(item.description || '');
    setPropertyType(item.type || (item.propertyType as any) || 'house');
    setPrice(item.price ? item.price.toString() : '0');
    setArea(item.area ? item.area.toString() : '0');
    setFloors(item.floors ? item.floors.toString() : '1');
    setBedrooms(item.bedrooms ? item.bedrooms.toString() : '1');
    setBathrooms(item.bathrooms ? item.bathrooms.toString() : '1');
    setDirection(item.direction || 'Đông Nam');
    setLegalStatus(item.legalStatus || 'Sổ đỏ chính chủ');
    setAddress(item.address || '');
    setDistrict(item.district || 'Cầu Giấy');
    setWard(item.ward || '');
    setCity(item.city || 'Hà Nội');
    setLat(item.lat || 21.0315);
    setLng(item.lng || 105.7825);
    setSellerName(item.seller?.fullName || item.authorName || '');
    setSellerPhone(item.seller?.phone || item.authorPhone || '');
    setSellerEmail(item.seller?.email || item.authorEmail || '');
    setSellerType(item.seller?.sellerType || item.sellerType || 'Chính chủ');
    setCompanyName(item.seller?.companyName || item.companyName || '');
    setContactAddress(item.seller?.contactAddress || item.contactAddress || '');
    setStatus(item.status);
    setRejectionReason(item.rejectionReason || '');
  };

  // Duyệt tin đăng (Section 8)
  const handleApprove = async () => {
    if (!listing) return;
    const updated = await approveListingRecord(listing.id);
    if (updated) {
      applyListingData(updated);
      addToast(`🎉 Đã duyệt tin đăng "${updated.title}"! Đã gửi thông báo riêng đến tài khoản ${updated.ownerId}.`, 'success');
    }
  };

  // Từ chối tin đăng (Section 9)
  const handleRejectConfirm = async () => {
    if (!listing) return;
    const finalReason = customRejectReason.trim() || rejectionReason.trim() || 'Thông tin chưa đầy đủ hoặc thiếu căn cứ pháp lý';
    const updated = await rejectListingRecord(listing.id, finalReason);
    if (updated) {
      applyListingData(updated);
      setShowRejectModal(false);
      setCustomRejectReason('');
      addToast(`Đã từ chối tin đăng. Lý do: "${finalReason}". Đã gửi thông báo tới người đăng.`, 'warning');
    }
  };

  // Ẩn / Bỏ ẩn tin (Section 10)
  const handleToggleHide = async () => {
    if (!listing) return;
    const isHidden = listing.status === 'hidden';
    const updated = await toggleHideListingRecord(listing.id, !isHidden);
    if (updated) {
      applyListingData(updated);
      addToast(
        !isHidden
          ? `Đã ẩn tin đăng: "${listing.title}"`
          : `Đã kích hoạt hiển thị lại tin: "${listing.title}"`,
        'info'
      );
    }
  };

  // Lưu chỉnh sửa thông tin (Section 11)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!listing) return;
    setIsSaving(true);
    try {
      const numPrice = Number(price) || listing.price;
      const numArea = Number(area) || listing.area;
      const pricePerM2 = Math.round(numPrice / (numArea || 1));

      const updates: Partial<ListingItem> = {
        title,
        description,
        type: propertyType,
        propertyType,
        price: numPrice,
        area: numArea,
        pricePerM2,
        floors: Number(floors) || 1,
        bedrooms: Number(bedrooms) || 1,
        bathrooms: Number(bathrooms) || 1,
        direction,
        legalStatus,
        address,
        district,
        ward,
        city,
        lat,
        lng,
        status,
        seller: {
          fullName: sellerName,
          phone: sellerPhone,
          email: sellerEmail,
          sellerType,
          companyName,
          contactAddress,
          showPhone: listing.seller?.showPhone ?? true,
          allowEmailContact: listing.seller?.allowEmailContact ?? true,
          showCompany: listing.seller?.showCompany ?? false,
          isPhoneVerified: listing.seller?.isPhoneVerified ?? false,
        },
        authorName: sellerName,
        authorPhone: sellerPhone,
        authorEmail: sellerEmail,
        sellerType,
        companyName,
        contactAddress,
      };

      const updated = await updateListingRecord(listing.id, updates, null, true);
      if (updated) {
        applyListingData(updated);
        addToast('Đã lưu các thay đổi của bất động sản thành công!', 'success');
      }
    } catch {
      addToast('Có lỗi xảy ra khi lưu thông tin', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    if (!listing) return;
    deleteListingRecord(listing.id);
    addToast('Đã xóa vĩnh viễn tin đăng thành công', 'warning');
    router.push('/admin/listings');
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col">
        <AdminHeader title="Chi tiết tin đăng" breadcrumb="Tin đăng / Đang tải" />
        <div className="p-12 text-center text-xs text-slate-400">
          <div className="h-6 w-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <span>Đang nạp thông tin tin đăng từ hệ thống...</span>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="flex-1 flex flex-col">
        <AdminHeader title="Không tìm thấy tin đăng" breadcrumb="Tin đăng / Lỗi" />
        <div className="p-12 text-center max-w-md mx-auto space-y-4">
          <div className="p-3 rounded-full bg-rose-50 text-rose-600 w-fit mx-auto">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <h3 className="font-extrabold text-navy text-base">Không tìm thấy mã tin #{listingId}</h3>
          <p className="text-xs text-slate-500">
            Tin đăng có thể đã bị xóa hoặc mã ID không chính xác. Vui lòng quay lại danh sách quản lý.
          </p>
          <Link
            href="/admin/listings"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-navy text-white text-xs font-bold"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Quay lại danh sách tin đăng</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col pb-16">
      <AdminHeader
        title={`Chi tiết tin đăng: #${listing.id}`}
        breadcrumb={`Tin đăng / ${listing.id}`}
      />

      <main className="p-6 space-y-6 max-w-6xl mx-auto w-full">
        {/* ── TOP ACTION BAR ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <Link
            href="/admin/listings"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-orange-500 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Quay lại Quản lý tin đăng</span>
          </Link>

          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href={`/listings/${listing.id}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
              <span>Xem trực tiếp trên Web</span>
            </Link>

            {listing.status === 'pending' && (
              <>
                <button
                  type="button"
                  onClick={handleApprove}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Duyệt tin (Xuất bản)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowRejectModal(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600 text-xs font-bold transition-all cursor-pointer"
                >
                  <XCircle className="h-4 w-4" />
                  <span>Từ chối duyệt</span>
                </button>
              </>
            )}

            {listing.status === 'active' && (
              <button
                type="button"
                onClick={handleToggleHide}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold transition-all cursor-pointer"
              >
                <EyeOff className="h-3.5 w-3.5" />
                <span>Ẩn tin đăng</span>
              </button>
            )}

            {listing.status === 'hidden' && (
              <button
                type="button"
                onClick={handleToggleHide}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-all cursor-pointer"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Bỏ ẩn (Hiển thị lại)</span>
              </button>
            )}

            {listing.status === 'rejected' && (
              <button
                type="button"
                onClick={handleApprove}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Duyệt lại tin này</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleDelete}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600 text-xs font-bold transition-all cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Xóa</span>
            </button>
          </div>
        </div>

        {/* ── BANNER TRẠNG THÁI (SECTION 7) ── */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <StatusBadge status={listing.status as any} />
            <div>
              <p className="text-xs font-bold text-navy">
                Mã định danh duy nhất: <span className="font-mono text-orange-600">{listing.id}</span>
              </p>
              <p className="text-[11px] text-slate-400">
                Chủ sở hữu (ownerId): <span className="font-mono text-slate-700 font-bold">{listing.ownerId || listing.userId || 'N/A'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-500 divide-x divide-slate-200">
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              <span>Tạo: {listing.createdAt}</span>
            </div>
            {listing.updatedAt && (
              <div className="pl-4 flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                <span>Cập nhật: {listing.updatedAt.split('T')[0]}</span>
              </div>
            )}
            {listing.publishedAt && (
              <div className="pl-4 flex items-center gap-1 text-emerald-700 font-medium">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>Xuất bản: {listing.publishedAt.split('T')[0]}</span>
              </div>
            )}
          </div>
        </div>

        {listing.status === 'rejected' && listing.rejectionReason && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-rose-800">Lý do từ chối tin đăng:</h4>
              <p className="text-xs text-rose-700 mt-0.5 leading-relaxed">{listing.rejectionReason}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* ── SECTION 1: THÔNG TIN CƠ BẢN ── */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Home className="h-4 w-4 text-orange-500" />
              <h3 className="font-extrabold text-sm text-navy uppercase tracking-wide">
                1. Thông tin cơ bản
              </h3>
            </div>

            <div>
              <label className="block text-xs font-bold text-navy mb-1.5">Tiêu đề tin đăng</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 outline-none font-semibold text-slate-800"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-navy mb-1.5">Loại hình BĐS</label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value as any)}
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 outline-none font-semibold cursor-pointer"
                >
                  <option value="house">Nhà phố / Nhà riêng</option>
                  <option value="apartment">Chung cư cao cấp</option>
                  <option value="land">Đất nền / Đất thổ cư</option>
                  <option value="villa">Biệt thự / Shophouse</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy mb-1.5">Trạng thái tin</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 outline-none font-bold text-orange-600 cursor-pointer"
                >
                  <option value="pending">Chờ duyệt (pending)</option>
                  <option value="active">Đang hiển thị (active)</option>
                  <option value="rejected">Bị từ chối (rejected)</option>
                  <option value="hidden">Đã ẩn (hidden)</option>
                  <option value="expired">Hết hạn (expired)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-navy mb-1.5">Mô tả chi tiết</label>
              <textarea
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 outline-none font-medium text-slate-700 leading-relaxed"
              />
            </div>
          </div>

          {/* ── SECTION 2: GIÁ & THÔNG SỐ ── */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Maximize2 className="h-4 w-4 text-orange-500" />
              <h3 className="font-extrabold text-sm text-navy uppercase tracking-wide">
                2. Giá & Thông số kỹ thuật
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-navy mb-1.5">Giá bán (VNĐ)</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 outline-none font-bold text-orange-600"
                  required
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  {formatCurrencyVND(Number(price) || 0)}
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy mb-1.5">Diện tích (m²)</label>
                <input
                  type="number"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 outline-none font-bold"
                  required
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Đơn giá: {Math.round((Number(price) || 0) / (Number(area) || 1) / 1000000)} tr/m²
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy mb-1.5">Số tầng</label>
                <input
                  type="number"
                  value={floors}
                  onChange={(e) => setFloors(e.target.value)}
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 outline-none font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy mb-1.5">Hướng nhà</label>
                <select
                  value={direction}
                  onChange={(e) => setDirection(e.target.value)}
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 outline-none font-semibold cursor-pointer"
                >
                  <option value="Đông Nam">Đông Nam</option>
                  <option value="Đông">Đông</option>
                  <option value="Tây">Tây</option>
                  <option value="Nam">Nam</option>
                  <option value="Bắc">Bắc</option>
                  <option value="Tây Nam">Tây Nam</option>
                  <option value="Đông Bắc">Đông Bắc</option>
                  <option value="Tây Bắc">Tây Bắc</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-navy mb-1.5">Phòng ngủ</label>
                <input
                  type="number"
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 outline-none font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy mb-1.5">Phòng tắm / WC</label>
                <input
                  type="number"
                  value={bathrooms}
                  onChange={(e) => setBathrooms(e.target.value)}
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 outline-none font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy mb-1.5">Tình trạng pháp lý</label>
                <input
                  type="text"
                  value={legalStatus}
                  onChange={(e) => setLegalStatus(e.target.value)}
                  placeholder="VD: Sổ đỏ chính chủ, sẵn sàng công chứng"
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 outline-none font-semibold"
                />
              </div>
            </div>
          </div>

          {/* ── SECTION 3: VỊ TRÍ & BẢN ĐỒ ── */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <MapPin className="h-4 w-4 text-orange-500" />
              <h3 className="font-extrabold text-sm text-navy uppercase tracking-wide">
                3. Vị trí & Tọa độ bản đồ
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-navy mb-1.5">Địa chỉ đầy đủ</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 outline-none font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy mb-1.5">Quận / Huyện</label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 outline-none font-semibold cursor-pointer"
                >
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

              <div>
                <label className="block text-xs font-bold text-navy mb-1.5">Phường / Xã</label>
                <input
                  type="text"
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  placeholder="VD: Phường Dịch Vọng"
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 outline-none font-semibold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-navy mb-1.5">Thành phố</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 outline-none font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy mb-1.5">Vĩ độ (Latitude)</label>
                <input
                  type="number"
                  step="any"
                  value={lat}
                  onChange={(e) => setLat(parseFloat(e.target.value) || 0)}
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy mb-1.5">Kinh độ (Longitude)</label>
                <input
                  type="number"
                  step="any"
                  value={lng}
                  onChange={(e) => setLng(parseFloat(e.target.value) || 0)}
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 outline-none font-mono"
                />
              </div>
            </div>
          </div>

          {/* ── SECTION 4: HÌNH ẢNH & GALLERY ── */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <ImageIcon className="h-4 w-4 text-orange-500" />
              <h3 className="font-extrabold text-sm text-navy uppercase tracking-wide">
                4. Hình ảnh do người bán tải lên ({listing.images.length} ảnh)
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {listing.images.map((img, index) => (
                <div
                  key={index}
                  className="group relative rounded-xl overflow-hidden aspect-4/3 bg-slate-100 border border-slate-200"
                >
                  <img
                    src={img}
                    alt={`Ảnh ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {index === 0 && (
                    <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded bg-orange-600 text-white font-bold text-[9px] shadow-sm flex items-center gap-0.5">
                      <Star className="h-2.5 w-2.5" />
                      <span>Ảnh chính</span>
                    </span>
                  )}
                  <span className="absolute bottom-1 right-1 px-1.5 py-0.2 rounded bg-black/60 text-white text-[9px] font-mono">
                    #{index + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── SECTION 5: THÔNG TIN NGƯỜI ĐĂNG (SECTION 20) ── */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <User className="h-4 w-4 text-orange-500" />
              <h3 className="font-extrabold text-sm text-navy uppercase tracking-wide">
                5. Thông tin người đăng (Seller Snapshot)
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-navy mb-1.5">Họ và tên người đăng</label>
                <input
                  type="text"
                  value={sellerName}
                  onChange={(e) => setSellerName(e.target.value)}
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 outline-none font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy mb-1.5">Số điện thoại liên hệ</label>
                <input
                  type="text"
                  value={sellerPhone}
                  onChange={(e) => setSellerPhone(e.target.value)}
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 outline-none font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy mb-1.5">Email</label>
                <input
                  type="email"
                  value={sellerEmail}
                  onChange={(e) => setSellerEmail(e.target.value)}
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 outline-none font-semibold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-navy mb-1.5">Loại người đăng</label>
                <select
                  value={sellerType}
                  onChange={(e) => setSellerType(e.target.value)}
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 outline-none font-semibold cursor-pointer"
                >
                  <option value="Chính chủ">Chính chủ</option>
                  <option value="Môi giới">Môi giới</option>
                  <option value="Nhân viên sàn giao dịch">Nhân viên sàn giao dịch</option>
                  <option value="Chủ đầu tư">Chủ đầu tư</option>
                  <option value="Người được ủy quyền">Người được ủy quyền</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy mb-1.5">Công ty / Sàn giao dịch</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Tên công ty nếu có"
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 outline-none font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy mb-1.5">Địa chỉ liên hệ</label>
                <input
                  type="text"
                  value={contactAddress}
                  onChange={(e) => setContactAddress(e.target.value)}
                  placeholder="Địa chỉ làm việc hoặc liên hệ"
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 outline-none font-semibold"
                />
              </div>
            </div>
          </div>

          {/* ── FORM SUBMIT BAR ── */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-navy hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              <span>{isSaving ? 'Đang lưu...' : 'Lưu tất cả thay đổi'}</span>
            </button>
          </div>
        </form>
      </main>

      {/* ── MODAL TỪ CHỐI DUYỆT (SECTION 9) ── */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-2.5 rounded-full bg-rose-50">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-navy text-sm">Từ chối duyệt bài đăng</h4>
                <p className="text-[11px] text-slate-400">Chủ tin: {listing.ownerId}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600">
              Vui lòng chọn hoặc nhập lý do từ chối. Lý do này sẽ được gửi thông báo trực tiếp đến tài khoản người bán.
            </p>

            <div className="space-y-2 text-xs">
              {[
                'Thiếu thông tin pháp lý hoặc sổ đỏ rõ ràng',
                'Ảnh chụp mờ, sai thực tế hoặc có watermark',
                'Mức giá bán bất thường hoặc sai lệch quá lớn',
                'Địa chỉ không tồn tại hoặc sai vị trí trên bản đồ',
                'Nội dung mô tả vi phạm điều khoản đăng tin',
              ].map((reason) => (
                <label key={reason} className="flex items-center gap-2 text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="modalRejectReason"
                    checked={rejectionReason === reason}
                    onChange={() => {
                      setRejectionReason(reason);
                      setCustomRejectReason('');
                    }}
                    className="text-rose-600"
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-navy mb-1">
                Lý do tùy chỉnh khác:
              </label>
              <textarea
                rows={2}
                value={customRejectReason}
                onChange={(e) => setCustomRejectReason(e.target.value)}
                placeholder="Nhập yêu cầu bổ sung cụ thể..."
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-rose-500 outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleRejectConfirm}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs cursor-pointer"
              >
                Xác nhận từ chối & Thông báo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
