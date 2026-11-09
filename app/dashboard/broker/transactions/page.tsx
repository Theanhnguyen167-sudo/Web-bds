import React from 'react';
import { ArrowLeftRight, ShieldCheck, AlertCircle } from 'lucide-react';

export default function BrokerTransactionsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <ArrowLeftRight className="h-6 w-6 text-blue-600" />
          Tiến Độ Giao Dịch BĐS
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Theo dõi các giao dịch từ giai đoạn đặt cọc, ký hợp đồng, công chứng đến giải ngân hoa hồng.
        </p>
      </div>

      <div className="rounded-xl bg-slate-100 border border-slate-200 p-4 text-xs text-slate-800 flex items-start gap-3">
        <ShieldCheck className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <strong>Cơ chế thanh toán & tiền bảo đảm:</strong> HaNoi Realty phân biệt rõ ràng: Phí gói dịch vụ, Tiền cọc/mua bán BĐS, và Phí môi giới. Nền tảng không tự giữ tiền mua bán trong tài khoản hoạt động. Định hướng dòng tiền bảo đảm thực hiện qua ngân hàng trung gian phong tỏa/giải ngân khi đủ điều kiện.
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xs">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
          <ArrowLeftRight className="h-7 w-7" />
        </div>
        <h3 className="mt-4 text-base font-bold text-slate-900">
          Danh Sách Giao Dịch Đang Thực Hiện
        </h3>
        <p className="mt-1 text-xs text-slate-500 max-w-md mx-auto">
          Các giao dịch được lưu vết lịch sử đầy đủ và gắn với phiên bản thỏa thuận hoa hồng tại thời điểm ký kết.
        </p>
      </div>
    </div>
  );
}

