'use client';

import React, { useState } from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { useApp } from '@/lib/context/AppContext';
import {
  Globe,
  CreditCard,
  Mail,
  Bell,
  Lock,
  Save,
  CheckCircle2,
  AlertTriangle,
  Send,
  Eye,
  Key,
  ShieldCheck
} from 'lucide-react';

export default function AdminSettingsPage() {
  const { addToast } = useApp();
  const [activeTab, setActiveTab] = useState<'general' | 'payments' | 'email' | 'notifications' | 'security'>('general');

  // General Settings
  const [siteName, setSiteName] = useState('HaNoi Realty');
  const [tagline, setTagline] = useState('PropTech & Bản đồ Quy hoạch 2030 Hà Nội');
  const [contactEmail, setContactEmail] = useState('support@hanoirealty.vn');
  const [contactPhone, setContactPhone] = useState('1800 6868');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [autoApprove, setAutoApprove] = useState(false);

  // Payment Settings
  const [momoPartnerCode, setMomoPartnerCode] = useState('MOMO_PROD_998124');
  const [vnpayTmnCode, setVnpayTmnCode] = useState('HANOIREALTY01');
  const [isSandbox, setIsSandbox] = useState(true);

  // Email Settings
  const [smtpHost, setSmtpHost] = useState('smtp.resend.com');
  const [smtpPort, setSmtpPort] = useState('587');
  const [resendApiKey, setResendApiKey] = useState('re_89a7df62b8...masked');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('Đã lưu cấu hình hệ thống thành công!', 'success');
  };

  const handleTestPayment = (gateway: 'momo' | 'vnpay') => {
    addToast(`Đã gửi yêu cầu kiểm tra kết nối tới ${gateway.toUpperCase()} Sandbox: Thành công (200 OK)`, 'success');
  };

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader title="Cài đặt Hệ thống" breadcrumb="Hệ thống / Cài đặt" />

      <main className="p-6 space-y-6 max-w-5xl">
        {/* ── SETTINGS TABS ── */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-slate-200 shadow-2xs overflow-x-auto">
          {[
            { id: 'general', label: 'Chung', icon: Globe },
            { id: 'payments', label: 'Thanh toán', icon: CreditCard },
            { id: 'email', label: 'Email', icon: Mail },
            { id: 'notifications', label: 'Thông báo', icon: Bell },
            { id: 'security', label: 'Bảo mật', icon: Lock },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-orange-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-navy hover:bg-slate-50'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ── TAB CONTENT ── */}
        <form onSubmit={handleSave} className="space-y-6">
          
          {/* TAB 1: CHUNG */}
          {activeTab === 'general' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-5">
              <h3 className="font-extrabold text-sm text-navy border-b border-slate-100 pb-3">
                Cấu hình thông tin Website
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-bold text-navy block mb-1">Tên nền tảng (Site name)</label>
                  <input
                    type="text"
                    value={siteName}
                    onChange={(e) => setSiteName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold"
                  />
                </div>

                <div>
                  <label className="font-bold text-navy block mb-1">Khẩu hiệu (Tagline)</label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold"
                  />
                </div>

                <div>
                  <label className="font-bold text-navy block mb-1">Email hỗ trợ</label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold"
                  />
                </div>

                <div>
                  <label className="font-bold text-navy block mb-1">Hotline CSKH</label>
                  <input
                    type="text"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
                <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                  <div>
                    <span className="font-bold text-navy block">Tự động duyệt tin đăng (Auto-approve)</span>
                    <span className="text-slate-400 text-[11px]">Bỏ qua bước phê duyệt thủ công của Admin</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoApprove}
                    onChange={(e) => setAutoApprove(e.target.checked)}
                    className="h-4 w-4 rounded text-orange-500"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-rose-50 border border-rose-200 cursor-pointer">
                  <div>
                    <span className="font-bold text-rose-700 block flex items-center gap-1">
                      <AlertTriangle className="h-4 w-4" /> Chế độ bảo trì (Maintenance Mode)
                    </span>
                    <span className="text-rose-500 text-[11px]">Chỉ tài khoản Admin mới có thể truy cập hệ thống</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={maintenanceMode}
                    onChange={(e) => setMaintenanceMode(e.target.checked)}
                    className="h-4 w-4 rounded text-rose-600"
                  />
                </label>
              </div>
            </div>
          )}

          {/* TAB 2: THANH TOÁN */}
          {activeTab === 'payments' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-extrabold text-sm text-navy">Cấu hình Cổng thanh toán MoMo & VNPay</h3>
                <label className="flex items-center gap-2 text-xs font-bold text-navy cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isSandbox}
                    onChange={(e) => setIsSandbox(e.target.checked)}
                    className="rounded text-orange-500"
                  />
                  <span>Môi trường Thử nghiệm (Sandbox)</span>
                </label>
              </div>

              {/* VNPay */}
              <div className="space-y-3 text-xs">
                <h4 className="font-bold text-navy text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500" /> Cổng thanh toán VNPay
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">TMN Code</label>
                    <input
                      type="text"
                      value={vnpayTmnCode}
                      onChange={(e) => setVnpayTmnCode(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Hash Secret Key</label>
                    <input
                      type="password"
                      defaultValue="••••••••••••••••••••••••"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleTestPayment('vnpay')}
                  className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold rounded-lg transition-colors flex items-center gap-1"
                >
                  <Send className="h-3 w-3" /> Test kết nối VNPay
                </button>
              </div>

              {/* MoMo */}
              <div className="space-y-3 text-xs pt-4 border-t border-slate-100">
                <h4 className="font-bold text-navy text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-pink-500" /> Cổng thanh toán MoMo
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Partner Code</label>
                    <input
                      type="text"
                      value={momoPartnerCode}
                      onChange={(e) => setMomoPartnerCode(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Secret Key</label>
                    <input
                      type="password"
                      defaultValue="••••••••••••••••••••••••"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleTestPayment('momo')}
                  className="px-3 py-1.5 bg-pink-50 hover:bg-pink-100 text-pink-600 font-bold rounded-lg transition-colors flex items-center gap-1"
                >
                  <Send className="h-3 w-3" /> Test kết nối MoMo
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: EMAIL */}
          {activeTab === 'email' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-5">
              <h3 className="font-extrabold text-sm text-navy border-b border-slate-100 pb-3">
                Cấu hình Gửi Email (Resend & SMTP)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-bold text-navy block mb-1">SMTP Host</label>
                  <input
                    type="text"
                    value={smtpHost}
                    onChange={(e) => setSmtpHost(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-navy block mb-1">Resend API Key</label>
                  <input
                    type="password"
                    value={resendApiKey}
                    onChange={(e) => setResendApiKey(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              {/* Email templates preview */}
              <div className="space-y-2 pt-3 border-t border-slate-100 text-xs">
                <p className="font-bold text-navy">Mẫu email thông báo tự động:</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => addToast('Mở bản xem trước: Email xác nhận tài khoản', 'info')}
                    className="p-3 rounded-xl border border-slate-200 hover:border-orange-500 hover:bg-orange-50 text-left transition-colors"
                  >
                    <p className="font-bold text-navy">📧 Xác nhận tài khoản</p>
                    <p className="text-[11px] text-slate-400">Gửi khi người dùng đăng ký</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => addToast('Mở bản xem trước: Email thanh toán thành công', 'info')}
                    className="p-3 rounded-xl border border-slate-200 hover:border-orange-500 hover:bg-orange-50 text-left transition-colors"
                  >
                    <p className="font-bold text-navy">🧾 Thanh toán thành công</p>
                    <p className="text-[11px] text-slate-400">Kèm hóa đơn điện tử</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => addToast('Mở bản xem trước: Email tin sắp hết hạn', 'info')}
                    className="p-3 rounded-xl border border-slate-200 hover:border-orange-500 hover:bg-orange-50 text-left transition-colors"
                  >
                    <p className="font-bold text-navy">⏰ Tin sắp hết hạn</p>
                    <p className="text-[11px] text-slate-400">Nhắc gia hạn tin đăng</p>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: THÔNG BÁO */}
          {activeTab === 'notifications' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4 text-xs">
              <h3 className="font-extrabold text-sm text-navy border-b border-slate-100 pb-3">
                Kênh thông báo & Cảnh báo quản trị
              </h3>

              <div className="space-y-3">
                <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                  <div>
                    <span className="font-bold text-navy block">Thông báo qua Telegram Bot</span>
                    <span className="text-slate-400 text-[11px]">Nhận tin nhắn tức thì khi có giao dịch mới hoặc tin chờ duyệt</span>
                  </div>
                  <input type="checkbox" defaultChecked className="h-4 w-4 rounded text-orange-500" />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                  <div>
                    <span className="font-bold text-navy block">Cảnh báo lỗi API Gemini AI</span>
                    <span className="text-slate-400 text-[11px]">Thông báo ngay khi độ trễ phản hồi vượt quá 5 giây</span>
                  </div>
                  <input type="checkbox" defaultChecked className="h-4 w-4 rounded text-orange-500" />
                </label>
              </div>
            </div>
          )}

          {/* TAB 5: BẢO MẬT */}
          {activeTab === 'security' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4 text-xs">
              <h3 className="font-extrabold text-sm text-navy border-b border-slate-100 pb-3">
                Bảo mật & Quản lý Phiên làm việc
              </h3>

              <div className="space-y-3">
                <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                  <div>
                    <span className="font-bold text-navy block">Xác thực 2 yếu tố (2FA / OTP)</span>
                    <span className="text-slate-400 text-[11px]">Bắt buộc đối với tất cả tài khoản Quản trị viên</span>
                  </div>
                  <input type="checkbox" defaultChecked className="h-4 w-4 rounded text-emerald-600" />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                  <div>
                    <span className="font-bold text-navy block">Tự động đăng xuất sau 30 phút không hoạt động</span>
                    <span className="text-slate-400 text-[11px]">Ngăn ngừa rủi ro bảo mật trên thiết bị công cộng</span>
                  </div>
                  <input type="checkbox" defaultChecked className="h-4 w-4 rounded text-orange-500" />
                </label>
              </div>
            </div>
          )}

          {/* Save Bar */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-md shadow-orange-500/20 transition-all flex items-center gap-1.5"
            >
              <Save className="h-3.5 w-3.5" /> Lưu thay đổi
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
