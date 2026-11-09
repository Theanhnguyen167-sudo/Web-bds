import React from 'react';
import Link from 'next/link';
import { Users, UserPlus, ShieldCheck, FileCheck, ArrowRight } from 'lucide-react';

export default function BrokerCrmPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="h-6 w-6 text-emerald-600" />
            Khách Hàng & CRM Môi Giới
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Ghi nhận khách hàng, lịch sử chăm sóc và đăng ký giới thiệu khách chuẩn 5 yếu tố.
          </p>
        </div>
        <button className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-500 shadow-sm">
          <UserPlus className="h-4 w-4" />
          Đăng ký giới thiệu khách mới
        </button>
      </div>

      <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-xs text-emerald-950 flex items-start gap-3">
        <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <strong>Cơ chế bảo vệ quyền môi giới HaNoi Realty:</strong> Việc click link giới thiệu hoặc nhập SĐT trước chưa tự tạo quyền hoa hồng. Đăng ký giới thiệu phải gắn chặt 5 yếu tố: <em>Khách hàng – BĐS cụ thể – CTV – Thời gian – Bằng chứng/xác nhận</em>.
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xs">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
          <Users className="h-7 w-7" />
        </div>
        <h3 className="mt-4 text-base font-bold text-slate-900">
          Phễu Quản Lý Khách Hàng (26 Khách tiềm năng)
        </h3>
        <p className="mt-1 text-xs text-slate-500 max-w-md mx-auto">
          Các giai đoạn: Mới tiếp cận ➔ Đã gửi căn ➔ Hẹn xem nhà ➔ Đặt cọc ➔ Ký công chứng.
        </p>
      </div>
    </div>
  );
}

