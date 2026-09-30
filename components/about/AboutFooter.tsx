'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, PhoneCall, MapPin } from 'lucide-react';

export function AboutFooter() {
  return (
    <footer className="bg-[#070b14] text-slate-400 text-xs py-16 border-t border-slate-800">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        
        {/* Col 1 - Brand */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-orange-500 text-white flex items-center justify-center font-black text-lg shadow-md">
              🏠
            </div>
            <span className="text-lg font-black text-white">
              HaNoi <span className="text-orange-500">Realty</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Nền tảng kết nối bất động sản thông minh nhất Hà Nội. Tiên phong ứng dụng dữ liệu quy hoạch phân khu và thẩm định giá AI.
          </p>
          <div className="flex items-center gap-2 pt-1">
            {['Facebook', 'YouTube', 'TikTok', 'LinkedIn'].map((social) => (
              <div
                key={social}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-orange-500 hover:text-white text-slate-300 flex items-center justify-center text-xs cursor-pointer transition-colors"
                title={social}
              >
                {social[0]}
              </div>
            ))}
          </div>
        </div>

        {/* Col 2 - Sản phẩm */}
        <div className="space-y-3">
          <h4 className="font-bold text-white uppercase text-xs tracking-wider">
            Sản phẩm &amp; Hệ thống
          </h4>
          <ul className="space-y-2 text-slate-400">
            <li><Link href="/search" className="hover:text-white transition-colors">Tìm kiếm BĐS</Link></li>
            <li><Link href="/planning" className="hover:text-white transition-colors">Bản đồ quy hoạch</Link></li>
            <li><Link href="/reports" className="hover:text-white transition-colors">Báo cáo AI Gemini</Link></li>
            <li><Link href="/listings/create" className="hover:text-white transition-colors">Đăng tin BĐS</Link></li>
            <li><Link href="/pricing" className="hover:text-white transition-colors">Gói thành viên</Link></li>
            <li><Link href="/admin" className="text-orange-400 hover:text-white transition-colors font-bold flex items-center gap-1">🛡️ Admin Portal</Link></li>
          </ul>
        </div>

        {/* Col 3 - Công ty */}
        <div className="space-y-3">
          <h4 className="font-bold text-white uppercase text-xs tracking-wider">
            Công ty
          </h4>
          <ul className="space-y-2 text-slate-400">
            <li><Link href="/about" className="hover:text-white transition-colors">Về chúng tôi</Link></li>
            <li><Link href="/about#team" className="hover:text-white transition-colors">Đội ngũ sáng lập</Link></li>
            <li><Link href="/news" className="hover:text-white transition-colors">Tin tức thị trường</Link></li>
            <li><Link href="/streets" className="hover:text-white transition-colors">Danh mục tuyến đường</Link></li>
            <li><Link href="/dashboard" className="hover:text-white transition-colors">Bảng điều khiển</Link></li>
          </ul>
        </div>

        {/* Col 4 - Liên hệ & Hỗ trợ */}
        <div className="space-y-3">
          <h4 className="font-bold text-white uppercase text-xs tracking-wider">
            Liên hệ
          </h4>
          <div className="space-y-2 text-slate-400 text-xs">
            <p className="flex items-center gap-2">
              <Mail className="h-3.5 w-3.5 text-orange-400 shrink-0" />
              <span>support@hanoirealty.vn</span>
            </p>
            <p className="flex items-center gap-2">
              <PhoneCall className="h-3.5 w-3.5 text-orange-400 shrink-0" />
              <span>1800 6868 (Miễn phí)</span>
            </p>
            <p className="flex items-start gap-2">
              <MapPin className="h-3.5 w-3.5 text-orange-400 shrink-0 mt-0.5" />
              <span>Tầng 12, Tòa nhà Handico, Phạm Hùng, Nam Từ Liêm, Hà Nội</span>
            </p>
            <p className="text-[11px] text-slate-500 pt-1">
              ⏰ T2 - T6: 8:00 - 18:00 | T7: 8:00 - 12:00
            </p>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <p>© 2026 HaNoi Realty. Bảo lưu mọi quyền.</p>
        <div className="flex gap-4">
          <Link href="/about" className="hover:text-slate-300 transition-colors">Chính sách bảo mật</Link>
          <span>·</span>
          <Link href="/about" className="hover:text-slate-300 transition-colors">Điều khoản sử dụng</Link>
          <span>·</span>
          <Link href="/about" className="hover:text-slate-300 transition-colors">Quy chuẩn dữ liệu</Link>
        </div>
      </div>
    </footer>
  );
}
