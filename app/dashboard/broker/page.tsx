import React from 'react';
import Link from 'next/link';
import {
  Building2,
  Users,
  Coins,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Calendar,
  Sparkles,
  ShieldCheck,
  Plus
} from 'lucide-react';
import { formatCurrencyVND } from '@/lib/utils';

export default function BrokerOverviewPage() {
  // Dữ liệu mẫu 5 trạng thái thu nhập theo chuẩn HaNoi Realty
  const incomeStats = [
    {
      key: 'estimated',
      label: 'Dự kiến',
      amount: 45000000,
      count: 2,
      desc: 'Giao dịch đang tiến hành cọc/hồ sơ',
      color: 'bg-blue-50 border-blue-200 text-blue-700',
      icon: Clock,
    },
    {
      key: 'eligible',
      label: 'Đủ điều kiện',
      amount: 32000000,
      count: 1,
      desc: 'Đã hoàn tất công chứng & nghĩa vụ',
      color: 'bg-emerald-50 border-emerald-200 text-emerald-700',
      icon: CheckCircle2,
    },
    {
      key: 'auditing',
      label: 'Chờ đối soát',
      amount: 18000000,
      count: 1,
      desc: 'Kế toán đang rà soát hồ sơ giao dịch',
      color: 'bg-amber-50 border-amber-200 text-amber-700',
      icon: FileText,
    },
    {
      key: 'paid',
      label: 'Đã chi',
      amount: 125000000,
      count: 5,
      desc: 'Đã thanh toán về tài khoản ngân hàng',
      color: 'bg-purple-50 border-purple-200 text-purple-700',
      icon: Coins,
    },
    {
      key: 'disputed',
      label: 'Tranh chấp',
      amount: 0,
      count: 0,
      desc: 'Đang giải quyết đối chiếu hồ sơ/trùng khách',
      color: 'bg-rose-50 border-rose-200 text-rose-700',
      icon: AlertCircle,
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Banner chào mừng & Giới thiệu cơ chế */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 sm:p-8 text-white shadow-lg">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur-md mb-3 text-blue-200 border border-white/10">
            <ShieldCheck className="h-3.5 w-3.5 text-blue-400" />
            Cơ chế kho mở & Bảo vệ quyền lợi minh bạch
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Chào mừng trở lại, Bàn làm việc Môi giới HaNoi Realty!
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed">
            Kho nguồn hàng mở sẵn sàng cho toàn bộ CTV đủ điều kiện khai thác mà không chia địa bàn độc quyền. 
            Mọi căn nhà được bảo đảm 1 mã BĐS duy nhất, minh bạch thông tin và bảo vệ quyền hoa hồng theo thỏa thuận.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/dashboard/broker/inventory"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow hover:bg-blue-500 transition-colors"
            >
              <Building2 className="h-4 w-4" />
              Khám phá Kho nhà chung
            </Link>
            <Link
              href="/dashboard/broker/crm"
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white backdrop-blur-md hover:bg-white/20 transition-colors border border-white/15"
            >
              <Users className="h-4 w-4" />
              Quản lý Khách hàng & CRM
            </Link>
          </div>
        </div>

        {/* Nền hiệu ứng trang trí nhẹ */}
        <div className="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* KHỐI 1: 5 TRẠNG THÁI THU NHẬP MINH BẠCH */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Coins className="h-5 w-5 text-amber-500" />
              Thu nhập Môi giới (5 trạng thái minh bạch)
            </h2>
            <p className="text-xs text-slate-500">
              Rõ ràng từng bước: Dự kiến ➔ Đủ điều kiện ➔ Chờ đối soát ➔ Đã chi (hoặc Tranh chấp)
            </p>
          </div>
          <Link
            href="/dashboard/broker/income"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            Chi tiết đối soát
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          {incomeStats.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.key}
                className={`rounded-2xl border p-4 transition-all hover:shadow-md ${item.color}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider">{item.label}</span>
                  <Icon className="h-4 w-4 opacity-80" />
                </div>
                <div className="mt-2 text-xl font-extrabold">
                  {formatCurrencyVND(item.amount)}
                </div>
                <div className="mt-1 flex items-center justify-between text-[11px] opacity-90">
                  <span>{item.count} giao dịch</span>
                </div>
                <p className="mt-2 text-[10px] opacity-75 line-clamp-2">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* KHỐI 2: CHỈ SỐ HOẠT ĐỘNG VÀ PHÍM TẮT NHANH */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Tủ hàng cá nhân */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tủ hàng cá nhân</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Building2 className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900">18 BĐS</div>
          <p className="text-xs text-slate-500 mt-1">Đang chọn khai thác & lưu trữ từ kho mở</p>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <Link
              href="/dashboard/broker/my-listings"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              Vào tủ hàng của bạn
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Khách hàng CRM */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Khách hàng trong CRM</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <Users className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900">26 khách</div>
          <p className="text-xs text-slate-500 mt-1">Gắn chặt Khách – BĐS – Thời gian – Bằng chứng</p>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <Link
              href="/dashboard/broker/crm"
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              Xem phễu chăm sóc
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Lịch hẹn & Dẫn khách */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Lịch dẫn khách tuần này</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <Calendar className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900">4 cuộc hẹn</div>
          <p className="text-xs text-slate-500 mt-1">Đã được chủ nhà xác nhận thời gian</p>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <Link
              href="/dashboard/broker/appointments"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              Xem lịch xem nhà
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

      </div>

      {/* KHỐI 3: QUY CHUẨN VẬN HÀNH HANOI REALTY DÀNH CHO MÔI GIỚI */}
      <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-5">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-blue-600" />
          3 Nguyên tắc cốt lõi khi khai thác nền tảng HaNoi Realty
        </h3>
        <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600 leading-relaxed">
          <div className="bg-white p-3 rounded-xl border border-blue-100 shadow-2xs">
            <strong className="text-slate-900 block mb-1">1. Kho hàng mở & không độc quyền:</strong>
            Mọi CTV đủ điều kiện đều có quyền tiếp cận kho nhà chung; không giữ chỗ ảo và không chia địa bàn độc quyền.
          </div>
          <div className="bg-white p-3 rounded-xl border border-blue-100 shadow-2xs">
            <strong className="text-slate-900 block mb-1">2. Một căn nhà - Một mã BĐS:</strong>
            Nhiều CTV cùng khai thác nhưng không nhân bản tin trên bản đồ. Khách hàng luôn tiếp cận thông tin xác thực nhất.
          </div>
          <div className="bg-white p-3 rounded-xl border border-blue-100 shadow-2xs">
            <strong className="text-slate-900 block mb-1">3. Ghi nhận giao dịch chuẩn 5 yếu tố:</strong>
            Quyền lợi hoa hồng được bảo đảm khi đăng ký gắn chặt Khách – BĐS – CTV – Thời gian – Bằng chứng được xác nhận.
          </div>
        </div>
      </div>
    </div>
  );
}

