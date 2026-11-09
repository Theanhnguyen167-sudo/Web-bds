import React from 'react';
import Link from 'next/link';
import { BookmarkCheck, Building2, Plus, ArrowRight } from 'lucide-react';

export default function BrokerMyListingsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <BookmarkCheck className="h-6 w-6 text-blue-600" />
            Tủ Hàng Cá Nhân
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Các bất động sản bạn đã lưu từ Kho nhà chung để tập trung tư vấn và tiếp thị cho khách hàng.
          </p>
        </div>
        <Link
          href="/dashboard/broker/inventory"
          className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500 shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Thêm nhà từ kho chung
        </Link>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xs">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
          <BookmarkCheck className="h-7 w-7" />
        </div>
        <h3 className="mt-4 text-base font-bold text-slate-900">
          Tủ hàng đang quản lý 18 BĐS mục tiêu
        </h3>
        <p className="mt-1 text-xs text-slate-500 max-w-md mx-auto">
          Lưu ý: Việc thêm nhà vào tủ hàng giúp bạn tiện theo dõi biến động giá và cập nhật pháp lý, không tạo quyền độc quyền khai thác căn nhà này.
        </p>
      </div>
    </div>
  );
}

