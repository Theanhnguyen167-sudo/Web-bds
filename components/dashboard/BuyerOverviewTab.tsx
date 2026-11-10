'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ClipboardList,
  Heart,
  CalendarDays,
  UserCheck,
  Handshake,
  ArrowRight,
  CheckCircle2,
  Clock,
  Search,
  PlusCircle,
} from 'lucide-react';
import { formatCurrencyVND } from '@/lib/utils';
import { getListingUrl } from '@/lib/listing-slug';
import { ListingItem } from '@/lib/mock-data';

interface BuyerOverviewTabProps {
  user: any;
  buyerRequests: any[];
  savedListings: ListingItem[];
  appointments: any[];
  onNavigateTab: (tab: any) => void;
}

export const BuyerOverviewTab: React.FC<BuyerOverviewTabProps> = ({
  user,
  buyerRequests,
  savedListings,
  appointments,
  onNavigateTab,
}) => {
  // Lịch hẹn xem nhà sắp tới (chưa bị hủy)
  const upcomingAppointments = appointments.filter(
    (a) => a.status !== 'cancelled'
  );

  // Xác định tiến độ 4 bước
  const hasRequest = buyerRequests.length > 0;
  const hasAgent = Boolean(user?.referredByAgentCode);
  const hasAppt = upcomingAppointments.length > 0;
  const hasDeal = false; // Mặc định đang tìm hiểu giao dịch

  return (
    <div className="space-y-6">
      {/* 1. BANNER CHÀO MỪNG & TIẾN ĐỘ TÌM MUA */}
      <div className="rounded-3xl border border-slate-200/80 bg-gradient-to-br from-orange-50/60 via-white to-amber-50/40 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-600 text-white">
                Khách hàng
              </span>
              <span className="text-xs font-semibold text-slate-500">
                Tiến trình tìm mua BĐS Hà Nội
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              Xin chào, {user?.name || 'Quý khách'}!
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              HaNoi Realty đang đồng hành giúp bạn tìm kiếm, thẩm định quy hoạch và mua nhà an toàn.
            </p>
          </div>

          <Link
            href="/buyer-request"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-slate-950 hover:bg-slate-800 text-white font-medium text-xs sm:text-sm transition-all shadow-sm shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Đăng nhu cầu mua mới</span>
          </Link>
        </div>

        {/* LỘ TRÌNH 4 BƯỚC MUA NHÀ */}
        <div className="pt-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
            Lộ trình sở hữu ngôi nhà phù hợp
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            {/* B1: Nhu cầu & ngân sách */}
            <div
              onClick={() => onNavigateTab('buyer-requests')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                hasRequest
                  ? 'bg-emerald-50/70 border-emerald-200 hover:border-emerald-300'
                  : 'bg-white border-slate-200 hover:border-orange-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400">Bước 1</span>
                {hasRequest ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Clock className="w-4 h-4 text-orange-500" />
                )}
              </div>
              <h4 className="text-sm font-bold text-slate-900 mt-2">Nhu cầu mua</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                {hasRequest
                  ? `Đã đăng ${buyerRequests.length} nhu cầu`
                  : 'Chưa đăng nhu cầu tìm nhà'}
              </p>
            </div>

            {/* B2: Chuyên viên CTV khu vực */}
            <div
              onClick={() => onNavigateTab('referral')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                hasAgent
                  ? 'bg-emerald-50/70 border-emerald-200 hover:border-emerald-300'
                  : 'bg-white border-slate-200 hover:border-orange-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400">Bước 2</span>
                {hasAgent ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Clock className="w-4 h-4 text-slate-300" />
                )}
              </div>
              <h4 className="text-sm font-bold text-slate-900 mt-2">Môi giới hỗ trợ</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                {hasAgent
                  ? `Mã: ${user?.referredByAgentCode}`
                  : 'Chưa liên kết chuyên viên'}
              </p>
            </div>

            {/* B3: Xem nhà thực tế */}
            <div
              onClick={() => onNavigateTab('appointments')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                hasAppt
                  ? 'bg-emerald-50/70 border-emerald-200 hover:border-emerald-300'
                  : 'bg-white border-slate-200 hover:border-orange-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400">Bước 3</span>
                {hasAppt ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Clock className="w-4 h-4 text-slate-300" />
                )}
              </div>
              <h4 className="text-sm font-bold text-slate-900 mt-2">Xem nhà thực tế</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                {hasAppt
                  ? `${upcomingAppointments.length} lịch hẹn đã tạo`
                  : 'Chưa có lịch hẹn xem nhà'}
              </p>
            </div>

            {/* B4: Đặt cọc & Giao dịch */}
            <div
              onClick={() => onNavigateTab('contracts')}
              className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-orange-300 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400">Bước 4</span>
                <Handshake className="w-4 h-4 text-slate-400" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 mt-2">Giao dịch & Cọc</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Kiểm tra hợp đồng & đặt cọc
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. 4 THẺ THỐNG KÊ NHANH */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Nhu cầu mua */}
        <div
          onClick={() => onNavigateTab('buyer-requests')}
          className="rounded-2xl border border-slate-200/80 bg-white p-4.5 hover:shadow-sm transition-all cursor-pointer space-y-1.5"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Nhu cầu mua</span>
            <div className="w-7 h-7 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
              <ClipboardList className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{buyerRequests.length}</p>
          <span className="text-[11px] font-medium text-orange-600 block">
            {buyerRequests.filter((r) => r.status === 'pending').length > 0
              ? `${buyerRequests.filter((r) => r.status === 'pending').length} đang chờ kết nối`
              : 'Đang theo dõi'}
          </span>
        </div>

        {/* BĐS yêu thích */}
        <div
          onClick={() => onNavigateTab('saved')}
          className="rounded-2xl border border-slate-200/80 bg-white p-4.5 hover:shadow-sm transition-all cursor-pointer space-y-1.5"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">BĐS yêu thích</span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <Heart className="w-4 h-4 fill-rose-500" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{savedListings.length}</p>
          <span className="text-[11px] font-medium text-slate-500 block">
            Căn nhà đã lưu theo dõi
          </span>
        </div>

        {/* Lịch xem nhà */}
        <div
          onClick={() => onNavigateTab('appointments')}
          className="rounded-2xl border border-slate-200/80 bg-white p-4.5 hover:shadow-sm transition-all cursor-pointer space-y-1.5"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Lịch xem nhà</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <CalendarDays className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{appointments.length}</p>
          <span className="text-[11px] font-medium text-blue-600 block">
            {upcomingAppointments.length} lịch hẹn hiện có
          </span>
        </div>

        {/* Chuyên viên hỗ trợ */}
        <div
          onClick={() => onNavigateTab('referral')}
          className="rounded-2xl border border-slate-200/80 bg-white p-4.5 hover:shadow-sm transition-all cursor-pointer space-y-1.5"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Chuyên viên hỗ trợ</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-sm font-bold text-slate-900 mt-2 truncate">
            {user?.referredByAgentCode ? user.referredByAgentCode : 'Chưa liên kết'}
          </p>
          <span className="text-[11px] font-medium text-emerald-600 block">
            {user?.referredByAgentCode ? 'Đã gán CTV phụ trách' : 'Nhấp để kết nối'}
          </span>
        </div>
      </div>

      {/* 3. VIỆC CẦN LÀM & NHẮC NHỞ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cột trái: Việc cần làm */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span>Việc cần làm hôm nay</span>
          </h3>

          <div className="space-y-3">
            {!hasRequest && (
              <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200/80 flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-900">
                    Chưa đăng tiêu chí tìm nhà
                  </h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Đăng ngân sách &amp; khu vực mong muốn để hệ thống tự động lọc nhà đạt chuẩn quy hoạch.
                  </p>
                </div>
                <Link
                  href="/buyer-request"
                  className="px-3 py-1.5 rounded-full bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs whitespace-nowrap shrink-0 transition-colors"
                >
                  Đăng ngay
                </Link>
              </div>
            )}

            {!hasAgent && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-900">
                    Kết nối chuyên viên tư vấn khu vực
                  </h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Nhập mã giới thiệu CTV để được hỗ trợ kiểm tra thực địa và hồ sơ pháp lý miễn phí.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigateTab('referral')}
                  className="px-3 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs whitespace-nowrap shrink-0 transition-colors"
                >
                  Kết nối
                </button>
              </div>
            )}

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-3">
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-900">
                  Tra cứu quy hoạch phân khu Hà Nội
                </h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Kiểm tra ranh giới quy hoạch, chỉ giới đường đỏ và mật độ xây dựng trước khi xuống tiền.
                </p>
              </div>
              <Link
                href="/quy-hoach"
                className="px-3 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs whitespace-nowrap shrink-0 transition-colors"
              >
                Tra cứu
              </Link>
            </div>
          </div>
        </div>

        {/* Cột phải: Lịch xem nhà gần nhất hoặc Nhà yêu thích */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              {upcomingAppointments.length > 0 ? 'Lịch hẹn xem nhà sắp tới' : 'BĐS yêu thích gần đây'}
            </h3>
            <button
              type="button"
              onClick={() => onNavigateTab(upcomingAppointments.length > 0 ? 'appointments' : 'saved')}
              className="text-xs font-semibold text-orange-600 hover:underline flex items-center gap-1"
            >
              <span>Xem tất cả</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {upcomingAppointments.length > 0 ? (
            <div className="space-y-3">
              {upcomingAppointments.slice(0, 2).map((appt, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                      <Clock className="w-3 h-3" /> {appt.time} • {appt.date}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      {appt.status === 'confirmed' ? 'Đã xác nhận' : 'Chờ xác nhận'}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 truncate">
                    {appt.listingTitle || 'BĐS đang hẹn xem'}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Người đón tiếp: {appt.sellerName || 'Chủ nhà / Môi giới phụ trách'}
                  </p>
                </div>
              ))}
            </div>
          ) : savedListings.length > 0 ? (
            <div className="space-y-3">
              {savedListings.slice(0, 2).map((item) => (
                <Link
                  key={item.id}
                  href={getListingUrl(item)}
                  className="flex items-center gap-3 p-3 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors group"
                >
                  <img
                    src={item.images?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&auto=format&fit=crop&q=80'}
                    alt={item.title}
                    className="w-16 h-14 rounded-xl object-cover shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-orange-600 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      📍 {item.district}, Hà Nội
                    </p>
                    <p className="text-xs font-bold text-orange-600 mt-1">
                      {formatCurrencyVND(item.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-slate-400 space-y-2">
              <Search className="w-8 h-8 mx-auto stroke-1" />
              <p className="text-xs">Bạn chưa lưu BĐS nào vào danh sách yêu thích.</p>
              <Link
                href="/search"
                className="inline-block text-xs font-semibold text-orange-600 hover:underline pt-1"
              >
                Khám phá kho nhà Hà Nội ngay →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

