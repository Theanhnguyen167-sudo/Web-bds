import React from 'react';
import Link from 'next/link';
import { Building2, Search, Filter, ShieldCheck, ArrowRight, Eye } from 'lucide-react';

export default function BrokerInventoryPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="h-6 w-6 text-blue-600" />
            Kho Nhà Chung (Nguồn Hàng Mở)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Kho mở cho toàn bộ CTV đủ điều kiện • Không chia địa bàn độc quyền • 1 căn nhà có 1 hồ sơ chuẩn & mã BĐS duy nhất
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/search"
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs"
          >
            <Eye className="h-4 w-4" />
            Xem trên Bản đồ chung
          </Link>
        </div>
      </div>

      {/* Thanh thông báo quy tắc kho mở */}
      <div className="rounded-xl bg-blue-50 border border-blue-200 p-4 text-xs text-blue-900 flex items-start gap-3">
        <ShieldCheck className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <strong>Cơ chế nguồn hàng HaNoi Realty:</strong> Nhà gửi lên đã được ban quản trị kiểm tra pháp lý sơ bộ, xử lý trùng lặp và phân quyền thông tin. Việc chọn khai thác hoặc theo dõi nhà không tạo quyền độc quyền cho bất kỳ CTV nào.
        </div>
      </div>

      {/* Placeholder bảng tra cứu kho hàng */}
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xs">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
          <Building2 className="h-7 w-7" />
        </div>
        <h3 className="mt-4 text-base font-bold text-slate-900">
          Danh sách Kho BĐS đã kiểm duyệt đang sẵn sàng
        </h3>
        <p className="mt-1 text-xs text-slate-500 max-w-md mx-auto">
          Mô-đun tra cứu lọc đa tiêu chí (Quận/Huyện, tầm giá, loại hình, hoa hồng thỏa thuận) đang được kết nối với cơ sở dữ liệu PostGIS.
        </p>
        <div className="mt-5">
          <Link
            href="/dashboard/broker"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700"
          >
            Quay lại Tổng quan
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

