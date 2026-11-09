import React from 'react';
import { CreditCard, Check, ShieldAlert, Sparkles, Crown } from 'lucide-react';

export default function BrokerSubscriptionPage() {
  const plans = [
    {
      name: 'CTV Free',
      price: 'Miễn phí',
      period: 'tháng đầu trải nghiệm',
      role: 'ctv',
      desc: 'Dành cho môi giới mới tham gia làm quen nền tảng.',
      features: [
        'Khai thác kho nhà chung mở',
        'Quản lý tủ hàng cá nhân (giới hạn)',
        'CRM chăm sóc & lưu trữ lịch sử khách',
        'Gắn mã giới thiệu cá nhân',
      ],
      current: false,
      cta: 'Trải nghiệm ngay',
    },
    {
      name: 'Gói CTV',
      price: '189.000 đ',
      period: 'mỗi tháng',
      role: 'ctv',
      popular: true,
      desc: 'Gói tiêu chuẩn dành cho CTV hoạt động thường xuyên.',
      features: [
        'Toàn quyền khai thác kho nhà chung mở không giới hạn',
        'Quản lý tủ hàng không giới hạn',
        'CRM chuyên sâu & thông báo đẩy lịch hẹn',
        'Bảo lưu quyền hoa hồng hợp lệ theo thỏa thuận giao dịch',
        'Hỗ trợ đối soát và kiểm tra quy hoạch cơ bản',
      ],
      current: true,
      cta: 'Đang sử dụng',
    },
    {
      name: 'Gói TPKD',
      price: '499.000 đ',
      period: 'mỗi tháng',
      role: 'tpkd',
      desc: 'Dành cho Trưởng phòng kinh doanh quản trị đội nhóm.',
      features: [
        'Đầy đủ quyền lợi của gói CTV tiêu chuẩn',
        'Bảng điều khiển "Quản trị đội nhóm" chuyên biệt',
        'Quản lý danh sách thành viên đội nhóm',
        'Theo dõi báo cáo và phân bổ nhiệm vụ',
        'Hưởng phần thưởng theo nhiệm vụ/đóng góp được xác nhận',
      ],
      current: false,
      cta: 'Nâng cấp TPKD',
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <CreditCard className="h-6 w-6 text-blue-600" />
          Gói Dịch Vụ Môi Giới & Công Cụ
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Lựa chọn gói dịch vụ phù hợp với nhu cầu khai thác kho hàng và quy mô đội nhóm của bạn.
        </p>
      </div>

      <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-xs text-amber-900 flex items-start gap-3">
        <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <strong>Quy chuẩn bắt buộc của HaNoi Realty:</strong> Việc thanh toán mua gói công cụ <em>không tự động thay thế cho điều kiện xét duyệt hồ sơ chứng chỉ hành nghề</em>. Môi giới cần hoàn tất xác minh danh tính và bằng cấp theo quy định để được mở đầy đủ quyền giao dịch.
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        {plans.map((p, idx) => (
          <div
            key={idx}
            className={`rounded-2xl p-6 flex flex-col justify-between transition-all ${
              p.popular
                ? 'border-2 border-blue-600 bg-white shadow-lg relative'
                : 'border border-slate-200 bg-white shadow-xs'
            }`}
          >
            {p.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-3 py-0.5 text-[11px] font-bold text-white uppercase tracking-wider">
                Được tin dùng nhất
              </span>
            )}

            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">{p.name}</h3>
                {p.role === 'tpkd' ? (
                  <Crown className="h-5 w-5 text-purple-600" />
                ) : (
                  <Sparkles className="h-5 w-5 text-blue-600" />
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1">{p.desc}</p>

              <div className="mt-4">
                <span className="text-3xl font-extrabold text-slate-900">{p.price}</span>
                <span className="text-xs text-slate-500 ml-1.5">/ {p.period}</span>
              </div>

              <ul className="mt-6 space-y-2.5 text-xs text-slate-600">
                {p.features.map((f, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8">
              <button
                disabled={p.current}
                className={`w-full rounded-xl py-2.5 text-xs font-bold transition-all ${
                  p.current
                    ? 'bg-slate-100 text-slate-500 cursor-not-allowed'
                    : p.popular
                    ? 'bg-blue-600 text-white hover:bg-blue-500 shadow'
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                {p.cta}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

