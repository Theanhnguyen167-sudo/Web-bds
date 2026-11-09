'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import {
  Building2,
  ShieldCheck,
  Coins,
  Sparkles,
  Users2,
  ArrowRight,
  CheckCircle2,
  Share2,
  Clock,
  Download,
  Crown,
  FileCheck2,
  Check,
  ChevronDown,
  HelpCircle,
  Award,
  Layers,
  Lock,
  Compass,
  PhoneCall,
  Laptop
} from 'lucide-react';

export default function BrokerLandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const coreValues = [
    {
      title: 'Kho nhà mở, không chia địa bàn độc quyền',
      icon: Building2,
      color: 'blue',
      badge: 'Bình đẳng 100%',
      desc: 'Hàng ngàn BĐS thổ cư, nhà phố và chung cư cao cấp khắp 30 quận/huyện Hà Nội. Mọi CTV đều có quyền tiếp cận bình đẳng, không bị găm hàng hay cát cứ địa bàn.',
      highlights: [
        'Toàn quyền khai thác kho mở khắp Hà Nội',
        'Tọa độ và trích lục quy hoạch rõ ràng',
        'Cập nhật trạng thái còn/đã cọc thời gian thực',
      ],
    },
    {
      title: 'Đăng ký bảo lưu khách bằng chứng từ',
      icon: ShieldCheck,
      color: 'emerald',
      badge: 'Chống trùng khách',
      desc: 'Bảo lưu quyền lợi tư vấn 72 giờ khi có tin nhắn hẹn hoặc cuộc gọi xác thực. Thuật toán tự động đối soát SĐT, triệt tiêu hoàn toàn rủi ro tranh chấp khách mua.',
      highlights: [
        'Bảo lưu quyền lợi 72 giờ theo căn nhà',
        'Tải lên bằng chứng tin nhắn/lịch hẹn bảo mật',
        'Thông báo tự động nếu phát hiện trùng lặp',
      ],
    },
    {
      title: 'Bộ Marketing Kit tải nhanh không SĐT chủ',
      icon: Download,
      color: 'amber',
      badge: 'Công cụ 1-Click',
      desc: 'Tải trọn bộ ảnh sạch độ phân giải cao đã duyệt, kèm đoạn văn mô tả soạn sẵn tự động gắn link giới thiệu cá nhân và mã CTV để đăng ngay lên Zalo, Facebook.',
      highlights: [
        'Bộ ảnh sạch tuyệt đối không chứa SĐT chủ nhà',
        'Bài đăng mẫu chuyên nghiệp chuẩn SEO',
        'Tự động sinh link kèm mã #CTV cá nhân',
      ],
    },
    {
      title: 'Hoa hồng đối soát 5 trạng thái minh bạch',
      icon: Coins,
      color: 'purple',
      badge: 'Minh bạch tài chính',
      desc: 'Dòng tiền hoa hồng được theo dõi theo 5 trạng thái: Dự kiến ➔ Đủ điều kiện ➔ Chờ đối soát ➔ Đã chi trả (hoặc Tranh chấp). Chi trả trực tiếp qua Ủy nhiệm chi ngân hàng.',
      highlights: [
        'Minh bạch theo phiên bản thỏa thuận từng deal',
        'Xem mã Ủy nhiệm chi (UNC) và chứng từ ngân hàng',
        'Bảo lưu 100% quyền lợi hoa hồng dù hết hạn gói',
      ],
    },
  ];

  const plans = [
    {
      id: 'ctv',
      name: 'Gói CTV Tiêu Chuẩn',
      price: '189.000 đ',
      period: '/tháng',
      freeOffer: 'Miễn phí trải nghiệm tháng đầu',
      role: 'ctv',
      badge: 'Dành cho Môi giới thực chiến',
      popular: true,
      desc: 'Gói công cụ thiết yếu dành cho Môi giới hoạt động thường xuyên, muốn tiếp cận nguồn hàng mở lớn và bảo vệ quyền lợi giao dịch.',
      features: [
        'Toàn quyền khai thác kho nhà mở KHÔNG GIỚI HẠN',
        'Quản lý tủ hàng cá nhân không giới hạn',
        'CRM chuyên sâu: Đăng ký bảo lưu khách 72h chống trùng',
        'Tải trọn bộ Marketing Kit sạch (ảnh HD, bài viết Zalo/FB)',
        'Gắn mã CTV (#CTV...) vào link giới thiệu căn nhà',
        'Ví hoa hồng đối soát 5 trạng thái minh bạch',
        'Bảo lưu 100% hoa hồng hợp lệ dù hết hạn gói',
      ],
      ctaText: 'Đăng Ký CTV (Tháng Đầu Free)',
      ctaHref: '/register?role=ctv',
    },
    {
      id: 'tpkd',
      name: 'Gói TPKD Quản Trị',
      price: '499.000 đ',
      period: '/tháng',
      freeOffer: 'Kèm bảng quản trị đội nhóm',
      role: 'tpkd',
      badge: 'Dành cho Trưởng phòng kinh doanh',
      popular: false,
      desc: 'Dành cho Trưởng phòng kinh doanh điều phối đội ngũ CTV, hỗ trợ tháo gỡ deal vướng và nhận Thù lao Quản lý theo đóng góp thực tế.',
      features: [
        'Toàn bộ đặc quyền của gói CTV Tiêu chuẩn',
        'Bảng điều khiển "Quản trị đội nhóm" chuyên biệt (Tông tím Manager)',
        'Quản lý danh sách thành viên CTV trực thuộc và tiến độ chăm sóc',
        'Mời thành viên CTV vào đội nhóm (yêu cầu CTV xác nhận 2 chiều)',
        'Tiếp nhận hỗ trợ deal khó và hòa giải vướng mắc cọc thực địa',
        'Nhận Thù lao Quản lý (5 - 15 triệu/deal) theo đóng góp thực tế',
        'Ưu tiên kết nối trực tiếp với Ban Pháp lý và Kế toán sàn',
        'Cam kết KHÔNG có hoa hồng tuyển dụng (chống đa cấp)',
      ],
      ctaText: 'Đăng Ký Quản Trị TPKD',
      ctaHref: '/register?role=tpkd',
    },
  ];

  const onboardingSteps = [
    {
      step: '01',
      title: 'Nộp hồ sơ trực tuyến (2 phút)',
      desc: 'Điền thông tin định danh, số điện thoại, khu vực hoạt động và đính kèm ảnh CCCD hoặc chứng chỉ hành nghề môi giới BĐS.',
      icon: Laptop,
    },
    {
      step: '02',
      title: 'Sàn xét duyệt trong 2-4 giờ',
      desc: 'Ban Pháp chế và Đối soát của HaNoi Realty kiểm tra thông tin, cấp mã định danh duy nhất (VD: CTV-HN1089) và kích hoạt tài khoản.',
      icon: Clock,
    },
    {
      step: '03',
      title: 'Trải nghiệm Free tháng đầu',
      desc: 'Không cần thanh toán trước, không ràng buộc thẻ ngân hàng. Bạn lập tức được mở quyền truy cập Bàn làm việc số của Môi giới.',
      icon: Sparkles,
    },
    {
      step: '04',
      title: 'Khai thác kho mở & Nhận hoa hồng',
      desc: 'Chọn nhà trong kho mở, tải Marketing Kit gửi khách, đăng ký bảo lưu quyền lợi và nhận thanh toán hoa hồng sòng phẳng khi chốt cọc.',
      icon: Award,
    },
  ];

  const faqs = [
    {
      q: 'Nếu tôi hết hạn gói dịch vụ thì hoa hồng các deal trước có bị mất không?',
      a: 'Tuyệt đối KHÔNG. HaNoi Realty cam kết bảo lưu 100% quyền lợi tài chính của bạn. Dù gói dịch vụ có hết hạn, bạn vẫn có thể truy cập ví hoa hồng, theo dõi lịch sử đối soát và nhận tiền chuyển khoản về tài khoản ngân hàng bình thường khi giao dịch hoàn tất.',
    },
    {
      q: 'Gói TPKD có phải là mô hình đa cấp tuyển người để ăn phần trăm hoa hồng không?',
      a: 'Hoàn toàn KHÔNG. HaNoi Realty tuân thủ nghiêm ngặt Luật Kinh doanh Bất động sản và quy chuẩn đạo đức nghề nghiệp. Thù lao Quản lý (Management Overrides) của TPKD là khoản ngân sách sàn chi trả cho nhiệm vụ hỗ trợ thực tế (thẩm định pháp lý, đàm phán cọc, giải quyết tranh chấp). Tuyệt đối không có hoa hồng tuyển dụng hay phân tầng đa cấp.',
    },
    {
      q: 'Khách hàng bấm link giới thiệu của tôi nhưng sau đó mua căn nhà khác thì tính thế nào?',
      a: 'Mã giới thiệu của Môi giới được gắn định danh theo từng căn nhà cụ thể (ví dụ: hanoirealty.vn/mua-ban/nha-pho/dong-da/can-a?ref=CTV-HN1089). Điều này đảm bảo tính chính xác, công bằng và bảo vệ đúng công sức tư vấn của bạn trên căn nhà đó. Một khách hàng có thể được tư vấn bởi nhiều CTV ở các căn nhà khác nhau.',
    },
    {
      q: 'Quy trình kiểm tra chống trùng khách diễn ra như thế nào?',
      a: 'Khi bạn đăng ký khách hàng kèm bằng chứng kết nối (ảnh chụp tin nhắn đặt lịch hoặc cuộc gọi), hệ thống sẽ bảo lưu quyền lợi cho bạn trong 72 giờ. Nếu có môi giới khác nhập cùng SĐT trên căn nhà đó, hệ thống sẽ cảnh báo trùng lặp và giữ quyền ưu tiên cho người có bằng chứng hợp lệ sớm hơn.',
    },
    {
      q: 'Tôi là môi giới tự do chưa có chứng chỉ hành nghề thì có tham gia được không?',
      a: 'Bạn hoàn toàn có thể đăng ký tài khoản CTV để trải nghiệm hệ thống và tham gia các khóa đào tạo quy chuẩn nghề nghiệp của HaNoi Realty. Khi tiến hành các giao dịch chốt cọc có giá trị lớn, sàn sẽ hỗ trợ TPKD và chuyên viên pháp lý đồng hành để đảm bảo tính chuẩn mực pháp lý.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased flex flex-col">
      <Navbar />

      <main className="flex-1 pt-16">
        
        {/* ══════════════════════════════════════════════════════════════
            HERO SECTION: RỘNG NGUỒN HÀNG, RÕ ĐÓNG GÓP, VỮNG QUYỀN LỢI
        ══════════════════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden bg-gradient-to-b from-blue-900 via-indigo-950 to-slate-950 text-white pt-16 pb-20 sm:pt-24 sm:pb-28">
          
          {/* Background glow effects */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-10 w-[400px] h-[400px] bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            
            {/* Pill Badge Hero */}
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 backdrop-blur-md px-4 py-1.5 text-xs font-bold text-blue-200">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span>Phân Hệ Bàn Làm Việc Môi Giới 4.0 • HaNoi Realty</span>
            </div>

            {/* Headline chính */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight max-w-4xl mx-auto leading-tight sm:leading-tight">
              Rộng nguồn hàng, <span className="bg-gradient-to-r from-blue-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">rõ đóng góp</span>, vững quyền lợi
            </h1>

            {/* Subtitle mô tả */}
            <p className="text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Nền tảng Bất động sản Hà Nội tiên phong xóa bỏ độc quyền địa bàn, bảo vệ quyền lợi môi giới bằng bằng chứng số minh bạch và cơ chế đối soát hoa hồng 5 trạng thái.
            </p>

            {/* Hàng nút Call to Action */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4">
              <Link
                href="/register?role=ctv"
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 font-extrabold text-sm text-white shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 group"
              >
                <span>Đăng ký CTV (Miễn phí tháng đầu)</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href="/register?role=tpkd"
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl border-2 border-purple-400/60 bg-purple-950/40 hover:bg-purple-900/50 font-bold text-sm text-purple-200 transition-all flex items-center justify-center gap-2"
              >
                <Crown className="h-4 w-4 text-purple-400" />
                <span>Đăng ký Quản trị TPKD</span>
              </Link>

              <Link
                href="/dashboard/broker"
                className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white font-semibold text-sm transition-all"
              >
                Vào Bàn Làm Việc Môi Giới
              </Link>
            </div>

            {/* Cam kết minh bạch */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>100% BĐS xác thực tọa độ & quy hoạch</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>Không cắt cầu • Không ép doanh số ảo</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>Chi trả qua Ủy nhiệm chi (UNC) ngân hàng</span>
              </div>
            </div>

            {/* 4 Thẻ thống kê nhanh */}
            <div className="pt-10 grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto text-left">
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-4">
                <div className="text-2xl sm:text-3xl font-black text-blue-400">3.500+</div>
                <div className="text-xs text-slate-300 font-medium mt-1">BĐS mở bán đã xác thực</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-4">
                <div className="text-2xl sm:text-3xl font-black text-emerald-400">30/30</div>
                <div className="text-xs text-slate-300 font-medium mt-1">Quận / Huyện toàn Hà Nội</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-4">
                <div className="text-2xl sm:text-3xl font-black text-amber-400">100%</div>
                <div className="text-xs text-slate-300 font-medium mt-1">Bảo lưu hoa hồng hợp lệ</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-4">
                <div className="text-2xl sm:text-3xl font-black text-purple-400">2 - 4h</div>
                <div className="text-xs text-slate-300 font-medium mt-1">Thời gian duyệt hồ sơ CTV</div>
              </div>
            </div>

          </div>
        </section>


        {/* ══════════════════════════════════════════════════════════════
            KHỐI 4 GIÁ TRỊ CỐT LÕI (CORE VALUES)
        ══════════════════════════════════════════════════════════════ */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                Lợi thế vượt trội
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                4 Trụ Cột Đột Phá Cho Môi Giới Hà Nội
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Giải quyết triệt để những nỗi đau lớn nhất: thiếu nguồn hàng, tranh chấp khách và hoa hồng mập mờ.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {coreValues.map((val, idx) => {
                const Icon = val.icon;
                return (
                  <div
                    key={idx}
                    className="rounded-3xl border border-slate-200 bg-gradient-to-b from-slate-50/60 via-white to-white p-6 sm:p-8 shadow-xs hover:shadow-md transition-all space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-700 border border-slate-200">
                        {val.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                        {val.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                        {val.desc}
                      </p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      {val.highlights.map((h, hIdx) => (
                        <div key={hIdx} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                          <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </section>


        {/* ══════════════════════════════════════════════════════════════
            BẢNG SO SÁNH 2 GÓI DỊCH VỤ (GÓI CTV & GÓI TPKD)
        ══════════════════════════════════════════════════════════════ */}
        <section className="py-20 bg-slate-50 border-y border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-purple-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                Minh bạch chi phí
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Lựa Chọn Gói Dịch Vụ Phù Hợp
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Không thu phí ngầm. Tháng đầu tiên hoàn toàn miễn phí để bạn kiểm chứng chất lượng nguồn hàng.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
              {plans.map((p) => {
                const isTpkd = p.role === 'tpkd';

                return (
                  <div
                    key={p.id}
                    className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all bg-white relative ${
                      p.popular
                        ? 'border-2 border-blue-600 shadow-xl ring-4 ring-blue-600/10'
                        : 'border-2 border-purple-400 shadow-lg'
                    }`}
                  >
                    {/* Badge */}
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`text-[11px] font-extrabold uppercase px-3 py-1 rounded-full tracking-wider ${
                          isTpkd
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {p.badge}
                      </span>
                      {isTpkd ? (
                        <Crown className="h-5 w-5 text-purple-600" />
                      ) : (
                        <Sparkles className="h-5 w-5 text-blue-600" />
                      )}
                    </div>

                    <div>
                      <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                        {p.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 min-h-[36px]">
                        {p.desc}
                      </p>

                      <div className="my-6 border-y border-slate-100 py-4">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-3xl sm:text-4xl font-black text-slate-900">
                            {p.price}
                          </span>
                          <span className="text-xs text-slate-500 font-semibold">{p.period}</span>
                        </div>
                        <div className="mt-1 text-xs font-bold text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>{p.freeOffer}</span>
                        </div>
                      </div>

                      {/* Danh sách quyền lợi */}
                      <div className="space-y-3 text-xs">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          Quyền lợi tài khoản:
                        </div>
                        {p.features.map((feat, fIdx) => (
                          <div key={fIdx} className="flex items-start gap-2.5 text-slate-700">
                            <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span className="leading-snug">{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-8">
                      <Link
                        href={p.ctaHref}
                        className={`w-full py-3.5 px-6 rounded-2xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-2 shadow-md ${
                          isTpkd
                            ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-600/25'
                            : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/25'
                        }`}
                      >
                        <span>{p.ctaText}</span>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        </section>


        {/* ══════════════════════════════════════════════════════════════
            QUY TRÌNH 4 BƯỚC GIA NHẬP MINH BẠCH
        ══════════════════════════════════════════════════════════════ */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Thủ tục tinh gọn
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Quy Trình 4 Bước Bắt Đầu Trong 1 Ngày
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Xét duyệt hồ sơ minh bạch, không rườm rà. Bạn có thể bắt đầu khai thác kho nhà ngay hôm nay.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {onboardingSteps.map((st, idx) => {
                const Icon = st.icon;
                return (
                  <div
                    key={idx}
                    className="relative rounded-2xl border border-slate-200 bg-slate-50/60 p-6 flex flex-col justify-between space-y-4 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-black text-blue-600/30">
                        {st.step}
                      </span>
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                        {st.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                        {st.desc}
                      </p>
                    </div>

                    <div className="text-[11px] font-bold text-blue-700 flex items-center gap-1">
                      <span>Bảo mật 100%</span>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </section>


        {/* ══════════════════════════════════════════════════════════════
            PHẦN FAQ: CÂU HỎI THƯỜNG GẶP CỦA MÔI GIỚI
        ══════════════════════════════════════════════════════════════ */}
        <section className="py-20 bg-slate-50 border-t border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Câu Hỏi Thường Gặp
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Tất cả thông tin bạn cần biết về quyền lợi, nghĩa vụ và cam kết bảo lưu của sàn.
              </p>
            </div>

            <div className="space-y-3">
              {faqs.map((f, fIdx) => (
                <div
                  key={fIdx}
                  className="rounded-2xl border border-slate-200 bg-white overflow-hidden transition-all shadow-2xs"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(fIdx)}
                    className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-bold text-slate-900 text-xs sm:text-sm hover:text-blue-600"
                  >
                    <span>{f.q}</span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 transition-transform ${
                        openFaq === fIdx ? 'rotate-180 text-blue-600' : 'text-slate-400'
                      }`}
                    />
                  </button>

                  {openFaq === fIdx && (
                    <div className="px-4 pb-5 sm:px-5 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-100 mt-1">
                      <p className="pt-3">{f.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

          </div>
        </section>


        {/* ══════════════════════════════════════════════════════════════
            FINAL CTA BANNER: GIA NHẬP MẠNG LƯỚI
        ══════════════════════════════════════════════════════════════ */}
        <section className="py-16 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
              Sẵn Sàng Nâng Tầm Nghề Môi Giới Của Bạn?
            </h2>
            <p className="text-xs sm:text-base text-blue-100 max-w-xl mx-auto leading-relaxed">
              Gia nhập hơn 1.200 Môi giới và Trưởng phòng kinh doanh đang hoạt động chuyên nghiệp khắp Thủ đô Hà Nội.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/register?role=ctv"
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-white text-blue-900 font-extrabold text-sm shadow-xl hover:bg-blue-50 transition-all"
              >
                Đăng ký CTV ngay (Free tháng đầu)
              </Link>
              <Link
                href="/dashboard/broker"
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl border border-white/40 hover:bg-white/10 text-white font-bold text-sm transition-all"
              >
                Vào Dashboard bàn làm việc
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* Chân trang Landing Page */}
      <footer className="border-t border-slate-200 bg-white py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-900">HaNoi Realty</span>
            <span>• Nền tảng BĐS Thủ Đô Hà Nội</span>
          </div>
          <div>
            Định vị: Xác thực • Rõ ràng • Minh bạch • Bảo vệ quyền lợi các bên.
          </div>
        </div>
      </footer>

    </div>
  );
}
