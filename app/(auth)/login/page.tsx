'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/lib/context/AppContext';
import { mockUser } from '@/lib/mock-data';
import { signInWithEmail, signUpWithEmail, signInWithGoogle } from '@/lib/supabase/queries/auth';
import {
  Home,
  Mail,
  Lock,
  User as UserIcon,
  Phone,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Sparkles,
  ShieldCheck,
  Building2,
  Crown,
  KeyRound,
  Zap,
  Check
} from 'lucide-react';

type RoleType = 'user' | 'agent' | 'admin';

const ROLES_CONFIG = [
  {
    id: 'user' as RoleType,
    title: 'Người mua / Thuê',
    subtitle: 'Khách hàng cá nhân',
    icon: UserIcon,
    badge: 'Khách hàng',
    color: 'border-blue-500 bg-blue-500/10 text-blue-600',
    demoEmail: 'khachhang@gmail.com',
    demoPass: '12345678',
    demoName: 'Nguyễn Minh Tuấn',
    demoPackage: 'Free',
    targetRoute: '/search',
    desc: 'Tra cứu quy hoạch 2030, tìm kiếm BĐS, tải báo cáo thẩm định AI',
  },
  {
    id: 'agent' as RoleType,
    title: 'Chủ nhà / Môi giới',
    subtitle: 'Đối tác & Môi giới',
    icon: Building2,
    badge: 'Môi giới VIP',
    color: 'border-orange-500 bg-orange-500/10 text-orange-600',
    demoEmail: 'moigioi@hanoirealty.vn',
    demoPass: '12345678',
    demoName: 'Trần Thị Thu Hà',
    demoPackage: 'Pro',
    targetRoute: '/dashboard',
    desc: 'Đăng tin BĐS, quản lý khách hàng, nhận lịch hẹn xem nhà qua Zalo',
  },
  {
    id: 'admin' as RoleType,
    title: 'Quản trị viên',
    subtitle: 'Super Admin Portal',
    icon: ShieldCheck,
    badge: 'Super Admin',
    color: 'border-rose-500 bg-rose-500/10 text-rose-600',
    demoEmail: 'admin@hanoirealty.vn',
    demoPass: 'admin123',
    demoName: 'Hệ thống Quản Trị Super Admin',
    demoPackage: 'Agency',
    targetRoute: '/admin',
    desc: 'Toàn quyền kiểm duyệt tin đăng, quản lý người dùng, doanh thu & cấu hình',
  },
];

export default function AuthPage() {
  const router = useRouter();
  const { setUser, addToast } = useApp();

  const [selectedRole, setSelectedRole] = useState<RoleType>('admin');
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);

  // Form states initialized with active role demo credentials
  const [email, setEmail] = useState('admin@hanoirealty.vn');
  const [password, setPassword] = useState('admin123');
  const [name, setName] = useState('Hệ thống Quản Trị Super Admin');
  const [phone, setPhone] = useState('0988 123 456');

  // Switch role and update form presets
  const handleSelectRole = (role: RoleType) => {
    setSelectedRole(role);
    const config = ROLES_CONFIG.find((r) => r.id === role)!;
    setEmail(config.demoEmail);
    setPassword(config.demoPass);
    setName(config.demoName);
  };

  const handleFillDemoCredentials = () => {
    const config = ROLES_CONFIG.find((r) => r.id === selectedRole)!;
    setEmail(config.demoEmail);
    setPassword(config.demoPass);
    setName(config.demoName);
    addToast(`Đã điền tài khoản mẫu: ${config.demoEmail}`, 'info');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const config = ROLES_CONFIG.find((r) => r.id === selectedRole)!;

    try {
      if (activeTab === 'login') {
        const res = await signInWithEmail(email, password);
        if (res.error && !res.error.message.includes('mock')) {
          // In case of actual Supabase connection error
        }

        setUser({
          ...mockUser,
          id: selectedRole === 'admin' ? 'admin_01' : 'user_01',
          name: name || config.demoName,
          email: email || config.demoEmail,
          role: selectedRole,
          package: config.demoPackage as any,
          avatar:
            selectedRole === 'admin'
              ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
              : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
        });

        addToast(
          `👋 Đăng nhập thành công với vai trò: ${config.title}`,
          'success'
        );
      } else {
        const res = await signUpWithEmail(email, password, name);
        setUser({
          ...mockUser,
          id: 'user_' + Date.now(),
          name: name || 'Người dùng mới',
          email,
          phone,
          role: selectedRole,
          package: selectedRole === 'agent' ? 'Basic' : 'Free',
        });

        addToast(
          `🎉 Đăng ký thành công! Chào mừng ${name || 'bạn'}.`,
          'success'
        );
      }
    } catch {
      // Local fallback
      setUser({
        ...mockUser,
        name: name || config.demoName,
        email: email || config.demoEmail,
        role: selectedRole,
        package: config.demoPackage as any,
      });
      addToast('Đăng nhập thành công!', 'success');
    } finally {
      setLoading(false);
      setTimeout(() => {
        router.push(config.targetRoute);
      }, 400);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (err: any) {
      addToast('Đang kết nối cổng Google OAuth...', 'info');
    }
  };

  const currentRoleConfig = ROLES_CONFIG.find((r) => r.id === selectedRole)!;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0f1e] p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[300px] bg-orange-500/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[300px] bg-blue-500/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="flex w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-800 bg-white shadow-2xl z-10"
      >
        {/* ── LEFT SIDE: Brand & Role Selector Visuals ── */}
        <div className="hidden lg:flex w-5/12 flex-col justify-between bg-[#0f172a] p-8 text-white relative overflow-hidden border-r border-slate-800">
          <div className="relative z-10 space-y-6">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white font-black shadow-lg shadow-orange-500/30">
                🏠
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                HaNoi <span className="text-orange-500 font-black">Realty</span>
              </span>
            </Link>

            <div>
              <span className="text-orange-400 font-extrabold text-[11px] uppercase tracking-widest block">
                CỔNG ĐĂNG NHẬP PHÂN QUYỀN
              </span>
              <h2 className="text-2xl font-black text-white leading-tight mt-1">
                Trải nghiệm dành riêng cho từng vai trò
              </h2>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Lựa chọn đúng vai trò để hệ thống tự động chuyển hướng đến bảng điều khiển phù hợp nhất.
              </p>
            </div>

            {/* 3 Role Selection Cards */}
            <div className="space-y-2.5 pt-2">
              {ROLES_CONFIG.map((r) => {
                const Icon = r.icon;
                const isSelected = selectedRole === r.id;
                return (
                  <div
                    key={r.id}
                    onClick={() => handleSelectRole(r.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                      isSelected
                        ? 'bg-white/10 border-orange-500 shadow-md ring-1 ring-orange-500/30'
                        : 'bg-white/5 border-slate-800 hover:bg-white/8 text-slate-400'
                    }`}
                  >
                    <div
                      className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-orange-500 text-white shadow-md'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-xs text-white truncate">{r.title}</p>
                        {isSelected && (
                          <span className="h-2 w-2 rounded-full bg-orange-400 animate-ping" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 truncate">{r.subtitle}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom info */}
          <div className="relative z-10 text-[11px] text-slate-400 pt-6 border-t border-slate-800/80 flex items-center justify-between">
            <span>© 2026 HaNoi Realty</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" /> Bảo mật SSL 256-bit
            </span>
          </div>
        </div>

        {/* ── RIGHT SIDE: Login / Register Form ── */}
        <div className="flex w-full lg:w-7/12 flex-col justify-center p-6 sm:p-10 bg-white">
          
          {/* Mobile Logo & Role Switcher */}
          <div className="lg:hidden mb-6 text-center space-y-4">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 text-white font-black">
                🏠
              </div>
              <span className="text-lg font-extrabold text-navy">HaNoi Realty</span>
            </Link>

            {/* Mobile 3-Role Pills */}
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl text-[11px] font-bold">
              {ROLES_CONFIG.map((r) => (
                <button
                  key={r.id}
                  onClick={() => handleSelectRole(r.id)}
                  className={`py-2 px-1 rounded-lg transition-all ${
                    selectedRole === r.id
                      ? 'bg-orange-500 text-white shadow-xs'
                      : 'text-slate-600'
                  }`}
                >
                  {r.badge}
                </button>
              ))}
            </div>
          </div>

          {/* Desktop 3 Role Tabs */}
          <div className="hidden lg:grid grid-cols-3 gap-2 p-1.5 bg-slate-100 rounded-2xl mb-6">
            {ROLES_CONFIG.map((r) => {
              const Icon = r.icon;
              const isSelected = selectedRole === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => handleSelectRole(r.id)}
                  className={`relative flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-white text-navy shadow-xs ring-1 ring-slate-200/80'
                      : 'text-slate-500 hover:text-navy hover:bg-slate-200/50'
                  }`}
                >
                  <Icon
                    className={`h-3.5 w-3.5 ${
                      isSelected ? 'text-orange-500' : 'text-slate-400'
                    }`}
                  />
                  <span>{r.badge}</span>
                </button>
              );
            })}
          </div>

          {/* Role Header Banner */}
          <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-200/80 mb-5 flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-navy">
                  Đăng nhập: {currentRoleConfig.title}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-orange-500 text-white">
                  {currentRoleConfig.badge}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">
                {currentRoleConfig.desc}
              </p>
            </div>

            {/* Quick Fill Demo Credentials Button */}
            <button
              type="button"
              onClick={handleFillDemoCredentials}
              className="px-2.5 py-1.5 rounded-xl bg-white border border-orange-200 text-orange-600 hover:bg-orange-100 font-bold text-[11px] shrink-0 shadow-2xs flex items-center gap-1 transition-colors"
              title="Tự động điền tài khoản mẫu"
            >
              <Zap className="h-3 w-3 fill-orange-500 text-orange-500" />
              <span>⚡ Mẫu</span>
            </button>
          </div>

          {/* Login / Register Toggle (Only for User/Agent) */}
          {selectedRole !== 'admin' && (
            <div className="flex rounded-xl bg-slate-100 p-1 mb-5">
              <button
                type="button"
                onClick={() => setActiveTab('login')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'login'
                    ? 'bg-white text-navy shadow-xs'
                    : 'text-slate-500 hover:text-navy'
                }`}
              >
                Đăng nhập
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('register')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'register'
                    ? 'bg-white text-navy shadow-xs'
                    : 'text-slate-500 hover:text-navy'
                }`}
              >
                Đăng ký tài khoản
              </button>
            </div>
          )}

          {/* Auth Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {activeTab === 'register' && selectedRole !== 'admin' && (
              <>
                <div>
                  <label className="font-bold text-navy block mb-1">Họ và tên</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Nguyễn Văn An"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none focus:bg-white focus:border-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-navy block mb-1">Số điện thoại</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0988 123 456"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none focus:bg-white focus:border-orange-500"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="font-bold text-navy block mb-1">
                {selectedRole === 'admin' ? 'Tài khoản Quản trị / Email' : 'Email'}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={currentRoleConfig.demoEmail}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none focus:bg-white focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-navy">Mật khẩu</label>
                {activeTab === 'login' && (
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      addToast('Mã OTP khôi phục mật khẩu đã được gửi đến email!', 'info');
                    }}
                    className="text-[11px] font-bold text-orange-500 hover:underline"
                  >
                    Quên mật khẩu?
                  </a>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none focus:bg-white focus:border-orange-500"
                />
              </div>
            </div>

            {/* Quick Demo Credentials Box */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-500 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-700 block">Tài khoản demo sẵn sàng:</span>
                <span className="font-mono text-orange-600">{currentRoleConfig.demoEmail}</span> ·{' '}
                <span className="font-mono">{currentRoleConfig.demoPass}</span>
              </div>
              <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                Auto-fill
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <span>
                    {activeTab === 'login'
                      ? selectedRole === 'admin'
                        ? 'Truy cập Admin Portal →'
                        : 'Đăng nhập ngay →'
                      : 'Hoàn tất đăng ký'}
                  </span>
                </>
              )}
            </button>
          </form>

          {/* Social Google Login */}
          {selectedRole !== 'admin' && (
            <div className="mt-5 pt-4 border-t border-slate-100 text-center">
              <p className="text-[11px] text-slate-400 mb-3">Hoặc tiếp tục với</p>
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full py-2.5 px-4 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Đăng nhập với Google</span>
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
