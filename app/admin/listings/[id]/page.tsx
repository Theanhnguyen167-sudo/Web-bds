'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { mockAdminListings } from '@/lib/admin-data';
import { formatCurrencyVND } from '@/lib/utils';
import { useApp } from '@/lib/context/AppContext';
import {
  ArrowLeft,
  Save,
  Trash2,
  MapPin,
  Image as ImageIcon,
  CheckCircle2,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';

export default function AdminListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToast } = useApp();
  const listingId = params.id as string;

  const initialListing =
    mockAdminListings.find((l) => l.id === listingId) || mockAdminListings[0];

  const [title, setTitle] = useState(initialListing.title);
  const [price, setPrice] = useState(initialListing.price.toString());
  const [area, setArea] = useState(initialListing.area.toString());
  const [district, setDistrict] = useState(initialListing.district);
  const [address, setAddress] = useState(initialListing.address);
  const [type, setType] = useState(initialListing.type);
  const [status, setStatus] = useState(initialListing.status);
  const [planningZone, setPlanningZone] = useState(initialListing.planningZone);
  const [isFeatured, setIsFeatured] = useState(initialListing.isFeatured);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('Đã lưu thay đổi thông tin bất động sản', 'success');
  };

  const handleDelete = () => {
    addToast('Đã xóa tin đăng thành công', 'warning');
    router.push('/admin/listings');
  };

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader
        title={`Chỉnh sửa: ${initialListing.title}`}
        breadcrumb={`Tin đăng / ${initialListing.id}`}
      />

      <main className="p-6 space-y-6 max-w-5xl">
        <Link
          href="/admin/listings"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-orange-500 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Quay lại danh sách tin đăng</span>
        </Link>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-5">
            <h3 className="font-extrabold text-sm text-navy border-b border-slate-100 pb-3">
              Thông tin chung Bất động sản
            </h3>

            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-navy mb-1.5">Tiêu đề tin đăng</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 outline-none font-semibold"
              />
            </div>

            {/* Price & Area & Type */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-navy mb-1.5">Giá bán (VNĐ)</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 outline-none font-bold text-orange-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy mb-1.5">Diện tích (m²)</label>
                <input
                  type="number"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy mb-1.5">Loại hình</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 outline-none font-semibold cursor-pointer"
                >
                  <option value="house">Nhà phố</option>
                  <option value="apartment">Chung cư</option>
                  <option value="land">Đất nền</option>
                  <option value="villa">Biệt thự</option>
                </select>
              </div>
            </div>

            {/* District & Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-navy mb-1.5">Quận / Huyện</label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 outline-none font-semibold cursor-pointer"
                >
                  <option value="Đống Đa">Đống Đa</option>
                  <option value="Tây Hồ">Tây Hồ</option>
                  <option value="Cầu Giấy">Cầu Giấy</option>
                  <option value="Nam Từ Liêm">Nam Từ Liêm</option>
                  <option value="Ba Đình">Ba Đình</option>
                  <option value="Hoàn Kiếm">Hoàn Kiếm</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy mb-1.5">Địa chỉ chi tiết</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 outline-none"
                />
              </div>
            </div>

            {/* Status & Planning Zone & Featured Toggle */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-navy mb-1.5">Trạng thái duyệt</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 outline-none font-bold"
                >
                  <option value="active">Đang hiển thị (Active)</option>
                  <option value="pending">Chờ duyệt (Pending)</option>
                  <option value="expired">Hết hạn (Expired)</option>
                  <option value="rejected">Bị từ chối (Rejected)</option>
                  <option value="sold">Đã bán (Sold)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy mb-1.5">Phân khu quy hoạch</label>
                <select
                  value={planningZone}
                  onChange={(e) => setPlanningZone(e.target.value)}
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 outline-none font-semibold"
                >
                  <option value="Đất ở đô thị">Đất ở đô thị</option>
                  <option value="Đất ở hỗn hợp">Đất ở hỗn hợp</option>
                  <option value="Đất thương mại dịch vụ">Đất thương mại dịch vụ</option>
                  <option value="Đất sinh thái du lịch">Đất sinh thái du lịch</option>
                </select>
              </div>

              <div className="flex flex-col justify-center pt-5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="h-4 w-4 rounded text-orange-500 focus:ring-orange-500"
                  />
                  <span className="text-xs font-bold text-navy">⭐ Đánh dấu Tin VIP Nổi bật</span>
                </label>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-2.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="h-3.5 w-3.5" /> Xóa tin đăng
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-md shadow-orange-500/20 transition-all flex items-center gap-1.5"
            >
              <Save className="h-3.5 w-3.5" /> Lưu thay đổi
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
