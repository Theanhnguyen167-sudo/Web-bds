import React from 'react';
import { Coins, CheckCircle2, Clock, FileText, AlertCircle, ShieldCheck } from 'lucide-react';
import { formatCurrencyVND } from '@/lib/utils';

export default function BrokerIncomePage() {
  const statuses = [
    {
      title: '1. Dự kiến (Estimated)',
      desc: 'Hoa hồng ước tính từ các giao dịch đang đặt cọc hoặc chuẩn bị hoàn thiện hồ sơ.',
      amount: 45000000,
      count: 2,
      badgeColor: 'bg-blue-100 text-blue-800',
    },
    {
      title: '2. Đủ điều kiện (Eligible)',
      desc: 'Giao dịch đã ký công chứng thành công và hoàn tất nghĩa vụ theo hợp đồng.',
      amount: 32000000,
      count: 1,
      badgeColor: 'bg-emerald-100 text-emerald-800',
    },
    {
      title: '3. Chờ đối soát (Auditing)',
      desc: 'Bộ phận kế toán & quản trị HaNoi Realty đang kiểm tra biên bản bàn giao và chứng từ thực thu.',
      amount: 18000000,
      count: 1,
      badgeColor: 'bg-amber-100 text-amber-800',
    },
    {
      title: '4. Đã chi (Paid)',
      desc: 'Khoản hoa hồng đã được giải ngân chuyển khoản về tài khoản ngân hàng của môi giới.',
      amount: 125000000,
      count: 5,
      badgeColor: 'bg-purple-100 text-purple-800',
    },
    {
      title: '5. Tranh chấp (Disputed)',
      desc: 'Giao dịch có khiếu nại về trùng khách hoặc sai lệch cam kết dẫn khách; đang xử lý theo quy chế.',
      amount: 0,
      count: 0,
      badgeColor: 'bg-rose-100 text-rose-800',
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Coins className="h-6 w-6 text-amber-500" />
          Thu Nhập & Đối Soát Hoa Hồng (5 Trạng Thái)
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Quy chuẩn minh bạch: Tỷ lệ phân chia lưu theo phiên bản thỏa thuận. CTV hết gói hoặc rời hệ thống vẫn được bảo lưu hoa hồng hợp lệ đã phát sinh.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statuses.map((item, idx) => (
          <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${item.badgeColor}`}>
                  {item.title}
                </span>
                <span className="text-xs font-medium text-slate-500">{item.count} BĐS</span>
              </div>
              <div className="text-2xl font-extrabold text-slate-900 mt-2">
                {formatCurrencyVND(item.amount)}
              </div>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

