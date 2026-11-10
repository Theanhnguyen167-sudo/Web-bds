'use client';

import Link from 'next/link';
import {
  Home,
  Camera,
  CalendarDays,
  Users,
  Handshake,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  PlusCircle,
  ChevronRight,
  TrendingUp,
  PhoneCall,
  MessageSquare
} from 'lucide-react';

interface OwnerOverviewTabProps {
  user: any;
  userListings: any[];
  appointments: any[];
  onNavigateTab: (tabId: any) => void;
}

export function OwnerOverviewTab({
  user,
  userListings,
  appointments,
  onNavigateTab,
}: OwnerOverviewTabProps) {
  // Lấy dữ liệu mock hoặc từ props
  const totalListings = userListings.length > 0 ? userListings.length : 1;
  const pendingAppointments = appointments.filter((a) => a.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Banner Chào Mừng & Trạng Thái Bán Nhà */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 p-6 sm:p-8 text-white shadow-lg">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold mb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            <span>Tài khoản Chủ nhà đã xác thực chính chủ</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Xin chào, {user?.name || 'Phạm Quốc Dũng'}!
          </h2>
          <p className="mt-2 text-sm sm:text-base text-orange-100 leading-relaxed">
            Hệ thống HaNoi Realty đang hỗ trợ bạn tiếp thị BĐS tới hơn 15,000+ nhà đầu tư và khách mua thật tại Hà Nội.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/listings/create"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-orange-950 shadow-md hover:bg-orange-50 transition-all"
            >
              <PlusCircle className="w-4 h-4 text-orange-600" />
              <span>Gửi bán BĐS mới</span>
            </Link>
            <button
              type="button"
              onClick={() => onNavigateTab('owner-surveys')}
              className="inline-flex items-center gap-2 rounded-xl bg-orange-800/60 backdrop-blur-md px-4 py-2.5 text-xs font-bold text-white hover:bg-orange-800/90 transition-all border border-white/20"
            >
              <Camera className="w-4 h-4" />
              <span>Đặt lịch quay chụp & 3D Tour</span>
            </button>
          </div>
        </div>

        {/* Nền hiệu ứng mờ trang trí */}
        <div className="absolute -right-8 -bottom-10 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      </div>

      {/* 4 Thẻ Thống Kê Chính */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Thẻ 1: BĐS Đang Bán */}
        <div
          onClick={() => onNavigateTab('listings')}
          className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-sm hover:border-orange-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold">BĐS của tôi</span>
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-colors">
              <Home className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{totalListings}</span>
            <span className="text-xs text-slate-500 font-medium">căn đang bán</span>
          </div>
          <div className="mt-2 flex items-center text-[11px] font-bold text-emerald-600">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
            <span>1 căn đã xác minh sổ đỏ</span>
          </div>
        </div>

        {/* Thẻ 2: Lịch Khảo Sát Sắp Tới */}
        <div
          onClick={() => onNavigateTab('owner-surveys')}
          className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-sm hover:border-orange-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold">Lịch quay chụp</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-colors">
              <Camera className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">1</span>
            <span className="text-xs text-slate-500 font-medium">lịch hẹn tới</span>
          </div>
          <div className="mt-2 flex items-center text-[11px] font-bold text-amber-600">
            <Clock className="w-3.5 h-3.5 mr-1" />
            <span>09:30 ngày 12/11/2026</span>
          </div>
        </div>

        {/* Thẻ 3: Lịch Khách Xem Nhà */}
        <div
          onClick={() => onNavigateTab('appointments')}
          className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-sm hover:border-orange-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold">Khách xem nhà</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors">
              <CalendarDays className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{appointments.length || 2}</span>
            <span className="text-xs text-slate-500 font-medium">lượt đăng ký</span>
          </div>
          <div className="mt-2 flex items-center text-[11px] font-bold text-blue-600">
            <Clock className="w-3.5 h-3.5 mr-1" />
            <span>{pendingAppointments > 0 ? `${pendingAppointments} lịch chờ duyệt` : 'Đã xác nhận 2 lịch'}</span>
          </div>
        </div>

        {/* Thẻ 4: Đề Nghị Mua & Đàm Phán */}
        <div
          onClick={() => onNavigateTab('owner-leads')}
          className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-sm hover:border-orange-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold">Đề nghị mua</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">2</span>
            <span className="text-xs text-slate-500 font-medium">khách gửi offer</span>
          </div>
          <div className="mt-2 flex items-center text-[11px] font-bold text-emerald-600">
            <TrendingUp className="w-3.5 h-3.5 mr-1" />
            <span>Giá cao nhất: 15.8 tỷ</span>
          </div>
        </div>
      </div>

      {/* Việc Cần Xử Lý Ngay (Action Items) */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse" />
            <h3 className="text-base font-bold text-slate-900">Công việc cần xử lý ngay</h3>
          </div>
          <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full">
            3 việc ưu tiên
          </span>
        </div>

        <div className="space-y-3">
          {/* Việc 1 */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-50/80 border border-slate-100 hover:border-orange-200 hover:bg-orange-50/30 transition-all">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 mt-0.5">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Xác nhận lịch khảo sát thực địa & quay flycam 3D
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Chuyên viên Hoàng Văn Đức (0983.222.111) đã hẹn vào 09:30 Thứ Tư (12/11/2026).
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('owner-surveys')}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-orange-600 text-white hover:bg-orange-700 shadow-sm transition-all self-end sm:self-center"
            >
              <span>Xem & xác nhận</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Việc 2 */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-50/80 border border-slate-100 hover:border-orange-200 hover:bg-orange-50/30 transition-all">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Phản hồi đề nghị mua 15.8 tỷ từ khách Nguyễn Văn An
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Khách sẵn sàng đặt cọc 500 triệu và thanh toán trong 20 ngày. Đề nghị hết hạn sau 24h.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('owner-leads')}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 shadow-sm transition-all self-end sm:self-center"
            >
              <span>Đàm phán ngay</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Việc 3 */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-50/80 border border-slate-100 hover:border-orange-200 hover:bg-orange-50/30 transition-all">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                <CalendarDays className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Thiết lập khung giờ trống cho tuần này
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Cập nhật các khung giờ bạn có nhà để CTV dẫn khách đúng hẹn, không bị trùng lịch sinh hoạt.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('appointments')}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white text-slate-800 border border-slate-200 hover:bg-slate-100 shadow-sm transition-all self-end sm:self-center"
            >
              <span>Cài đặt giờ trống</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Bất Động Sản Đang Gửi Bán Nổi Bật */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Bất động sản đang gửi bán</h3>
            <p className="text-xs text-slate-500 mt-0.5">Hồ sơ pháp lý và tiến độ hiển thị trên cổng thông tin</p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('listings')}
            className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
          >
            <span>Xem tất cả ({totalListings})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white">
          <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&auto=format&fit=crop&q=80"
                alt="BĐS của tôi"
                className="w-24 h-24 rounded-2xl object-cover shrink-0 border border-slate-100"
              />
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-orange-100 text-orange-700">
                    Mã BĐS: HR-PROP-8821
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-700 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    Đã xác minh sổ đỏ & quy hoạch
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-900 leading-snug">
                  Nhà phố Hàng Bông, Phường Hàng Bông, Quận Hoàn Kiếm, Hà Nội
                </h4>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <span>Diện tích: <strong>68 m²</strong></span>
                  <span>•</span>
                  <span>Kết cấu: <strong>5 tầng</strong></span>
                  <span>•</span>
                  <span>Mặt tiền: <strong>4.8m</strong></span>
                </div>
              </div>
            </div>

            <div className="flex flex-row md:flex-col md:items-end justify-between items-center gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
              <div className="text-left md:text-right">
                <span className="text-xs text-slate-400 block font-medium">Giá gửi bán</span>
                <span className="text-xl font-black text-orange-600">16.5 tỷ</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onNavigateTab('owner-surveys')}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-orange-50 text-orange-700 hover:bg-orange-100 transition-colors"
                >
                  Lịch quay chụp
                </button>
                <button
                  type="button"
                  onClick={() => onNavigateTab('listings')}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                >
                  Chi tiết hồ sơ
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Thông Tin Chuyên Viên Hỗ Trợ Riêng Cho Chủ Nhà */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
            <Handshake className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              Chuyên viên tư vấn độc quyền của bạn: Luật sư Vũ Đức Mạnh
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Hỗ trợ check quy hoạch phân khu 1/500, thủ tục công chứng, giải quyết tranh chấp và bảo toàn giá bán.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <a
            href="tel:0969888777"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm transition-all"
          >
            <PhoneCall className="w-4 h-4" />
            <span>0969.888.777</span>
          </a>
          <button
            type="button"
            onClick={() => onNavigateTab('owner-support')}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Gửi yêu cầu hỗ trợ</span>
          </button>
        </div>
      </div>
    </div>
  );
}

