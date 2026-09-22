'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useApp } from '@/lib/context/AppContext';
import { mockUser } from '@/lib/mock-data';
import {
  signInWithEmail,
  signUpWithEmail,
  signInWithGoogle,
  signInWithFacebook,
  signInWithApple,
} from '@/lib/supabase/queries/auth';
import {
  Mail,
  Lock,
  Phone,
  ArrowRight,
  Loader2,
  ShieldCheck,
  User as UserIcon,
  Sparkles,
} from 'lucide-react';

type RoleType = 'user' | 'agent' | 'admin';

const ROLES_CONFIG = [
  {
    id: 'user' as RoleType,
    title: 'Người mua / Thuê',
    badge: 'Khách hàng',
    demoEmail: 'khachhang@gmail.com',
    demoPass: '12345678',
    demoName: 'Nguyễn Minh Tuấn',
    demoPackage: 'Free',
    targetRoute: '/search',
    btnClasses: 'border-slate-700 bg-[#1e293b]/80 text-slate-200 hover:border-slate-500 hover:bg-[#1e293b]',
    activeClasses: 'border-orange-500 bg-orange-500/15 text-orange-400 font-bold ring-1 ring-orange-500/40',
  },
  {
    id: 'agent' as RoleType,
    title: 'Chủ nhà / Môi giới',
    badge: 'Môi giới VIP',
    demoEmail: 'moigioi@hanoirealty.vn',
    demoPass: '12345678',
    demoName: 'Trần Thị Thu Hà',
    demoPackage: 'Pro',
    targetRoute: '/dashboard',
    btnClasses: 'border-slate-700 bg-[#1e293b]/80 text-slate-200 hover:border-slate-500 hover:bg-[#1e293b]',
    activeClasses: 'border-orange-500 bg-orange-500/15 text-orange-400 font-bold ring-1 ring-orange-500/40',
  },
  {
    id: 'admin' as RoleType,
    title: 'Quản trị viên',
    badge: 'Super Admin',
    demoEmail: 'admin@hanoirealty.vn',
    demoPass: 'admin123',
    demoName: 'Hệ thống Quản Trị Super Admin',
    demoPackage: 'Agency',
    targetRoute: '/admin',
    btnClasses: 'border-slate-700 bg-[#1e293b]/80 text-slate-200 hover:border-slate-500 hover:bg-[#1e293b]',
    activeClasses: 'border-orange-500 bg-orange-500/15 text-orange-400 font-bold ring-1 ring-orange-500/40',
  },
];

export default function AuthPage() {
  const router = useRouter();
  const { setUser, addToast } = useApp();

  const [selectedRole, setSelectedRole] = useState<RoleType>('user');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [authMethod, setAuthMethod] = useState<'phone' | 'email'>('phone');
  const [loading, setLoading] = useState(false);

  // Email form fallback states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [fullName, setFullName] = useState('');

  // 1-Tap Quick Trial Role Selection
  const handleQuickRole = (role: RoleType) => {
    setSelectedRole(role);
    const config = ROLES_CONFIG.find((r) => r.id === role)!;
    setLoading(true);

    setTimeout(() => {
      setUser({
        ...mockUser,
        id: role === 'admin' ? 'admin_01' : role === 'agent' ? 'agent_01' : 'user_01',
        name: config.demoName,
        email: config.demoEmail,
        role: role,
        package: config.demoPackage as any,
        avatar:
          role === 'admin'
            ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
            : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      });
      addToast(`👋 Đăng nhập thành công vai trò: ${config.title}`, 'success');
      setLoading(false);
      router.push(config.targetRoute);
    }, 400);
  };

  // Phone submit
  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.trim().length < 9) {
      addToast('Vui lòng nhập số điện thoại hợp lệ (10 số)!', 'error');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const config = ROLES_CONFIG.find((r) => r.id === selectedRole)!;
      setUser({
        ...mockUser,
        id: 'phone_' + Date.now(),
        name: `Thành viên (${phoneNumber.slice(-4)})`,
        phone: phoneNumber,
        role: selectedRole,
        package: (selectedRole === 'agent' ? 'Pro' : 'Free') as any,
      });
      addToast(`🎉 Đăng nhập thành công với số ${phoneNumber}!`, 'success');
      setLoading(false);
      router.push(config.targetRoute);
    }, 500);
  };

  // OAuth actions
  const handleGoogleLogin = async () => {
    try {
      addToast('Đang kết nối Google OAuth...', 'info');
      await signInWithGoogle();
    } catch {
      handleQuickRole(selectedRole);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      addToast('Đang kết nối Facebook Login...', 'info');
      await signInWithFacebook();
    } catch {
      handleQuickRole(selectedRole);
    }
  };

  const handleAppleLogin = async () => {
    try {
      addToast('Đang kết nối Apple ID...', 'info');
      await signInWithApple();
    } catch {
      handleQuickRole(selectedRole);
    }
  };

  // Email login / signup
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const config = ROLES_CONFIG.find((r) => r.id === selectedRole)!;

    try {
      if (!isRegister) {
        await signInWithEmail(email, password);
        setUser({
          ...mockUser,
          id: selectedRole === 'admin' ? 'admin_01' : 'user_01',
          name: fullName || config.demoName,
          email: email || config.demoEmail,
          role: selectedRole,
        });
        addToast('Đăng nhập thành công!', 'success');
      } else {
        await signUpWithEmail(email, password, fullName);
        setUser({
          ...mockUser,
          id: 'user_' + Date.now(),
          name: fullName || 'Thành viên mới',
          email,
          role: selectedRole,
        });
        addToast('Đăng ký tài khoản thành công!', 'success');
      }
      router.push(config.targetRoute);
    } catch {
      handleQuickRole(selectedRole);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#070b14] px-4 py-8 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Background Ambient Glow matching Photo 1 */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[350px] bg-orange-500/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-[450px] h-[350px] bg-blue-500/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(#f97316_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="w-full max-w-[440px] rounded-[32px] bg-[#0f172a] p-6 sm:p-8 shadow-2xl relative z-10 border border-slate-800"
      >
        {/* ── HEADER WITH TITLE & LOGO (PHOTO 1 STYLE) ── */}
        <div className="flex items-start justify-between gap-3 mb-6">
          <div className="flex-1 pr-2">
            <Link href="/" className="inline-flex items-center gap-1.5 mb-2 text-xs font-bold text-orange-400 hover:text-orange-300">
              <span>← Trang chủ</span>
            </Link>
            <h1 className="text-2xl sm:text-[26px] font-black tracking-tight text-white leading-tight">
              Đăng nhập/Đăng ký
            </h1>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Tiếp cận hàng chục ngàn bất động sản & quy hoạch Hà Nội
            </p>
          </div>

          {/* Brand Logo Icon */}
          <Link href="/" className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-orange-500 text-white font-black text-2xl shadow-lg shadow-orange-500/30 border border-orange-400/40">
            🏠
          </Link>
        </div>

        {/* ── SOCIAL AUTH BUTTONS (PHOTO 2 LAYOUT + PHOTO 1 PALETTE) ── */}
        <div className="space-y-3 mb-5">
          {/* Google Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-3 px-4 rounded-full border border-slate-700/80 bg-[#1e293b]/70 hover:bg-[#1e293b] text-slate-100 text-xs sm:text-sm font-bold shadow-sm transition-all duration-150 flex items-center justify-center gap-2.5 active:scale-[0.99]"
          >
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
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
            <span>Tiếp tục với Google</span>
          </button>

          {/* Facebook Button */}
          <button
            type="button"
            onClick={handleFacebookLogin}
            disabled={loading}
            className="w-full py-3 px-4 rounded-full border border-slate-700/80 bg-[#1e293b]/70 hover:bg-[#1e293b] text-slate-100 text-xs sm:text-sm font-bold shadow-sm transition-all duration-150 flex items-center justify-center gap-2.5 active:scale-[0.99]"
          >
            <svg className="h-4 w-4 shrink-0 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <span>Tiếp tục với Facebook</span>
          </button>

          {/* Apple Button */}
          <button
            type="button"
            onClick={handleAppleLogin}
            disabled={loading}
            className="w-full py-3 px-4 rounded-full border border-slate-700/80 bg-[#1e293b]/70 hover:bg-[#1e293b] text-slate-100 text-xs sm:text-sm font-bold shadow-sm transition-all duration-150 flex items-center justify-center gap-2.5 active:scale-[0.99]"
          >
            <svg className="h-4 w-4 shrink-0 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.38c.62-.76 1.04-1.82.93-2.88-.9.04-1.98.6-2.61 1.36-.56.65-.95 1.72-.82 2.76 1 .08 1.9-.48 2.5-1.24z" />
            </svg>
            <span>Tiếp tục với Apple</span>
          </button>
        </div>

        {/* ── DIVIDER ── */}
        <div className="relative flex items-center justify-center my-5">
          <div className="w-full border-t border-slate-800"></div>
          <span className="bg-[#0f172a] px-3 text-[11px] font-semibold text-slate-500 absolute">
            Hoặc
          </span>
        </div>

        {/* ── PHONE / EMAIL AUTH TOGGLE ── */}
        {authMethod === 'phone' ? (
          <form onSubmit={handlePhoneSubmit} className="space-y-3 mb-5">
            <div>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Số điện thoại"
                className="w-full px-4 py-3 bg-[#1e293b]/60 border border-slate-700/80 rounded-2xl text-xs sm:text-sm font-medium text-white placeholder:text-slate-500 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all shadow-inner"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 flex items-center justify-center gap-1.5 shadow-md ${
                phoneNumber.trim().length >= 9
                  ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/30 cursor-pointer active:scale-[0.99]'
                  : 'bg-slate-800/80 text-slate-500 cursor-not-allowed border border-slate-700/50'
              }`}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin text-orange-400" />
              ) : (
                <>
                  <span>Tiếp tục</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => setAuthMethod('email')}
                className="text-[11px] font-semibold text-orange-400 hover:text-orange-300 cursor-pointer"
              >
                Đăng nhập bằng Email & Mật khẩu
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleEmailSubmit} className="space-y-3 mb-5 text-xs">
            {isRegister && (
              <div>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Họ và tên"
                  className="w-full px-4 py-2.5 bg-[#1e293b]/60 border border-slate-700/80 rounded-xl text-xs font-medium text-white placeholder:text-slate-500 outline-none focus:border-orange-500"
                />
              </div>
            )}

            <div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Địa chỉ Email"
                className="w-full px-4 py-2.5 bg-[#1e293b]/60 border border-slate-700/80 rounded-xl text-xs font-medium text-white placeholder:text-slate-500 outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mật khẩu"
                className="w-full px-4 py-2.5 bg-[#1e293b]/60 border border-slate-700/80 rounded-xl text-xs font-medium text-white placeholder:text-slate-500 outline-none focus:border-orange-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold shadow-md shadow-orange-500/30 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <span>{isRegister ? 'Hoàn tất đăng ký' : 'Đăng nhập ngay'}</span>
              )}
            </button>

            <div className="flex items-center justify-between text-[11px] pt-1">
              <button
                type="button"
                onClick={() => setIsRegister(!isRegister)}
                className="text-orange-400 font-bold hover:underline"
              >
                {isRegister ? 'Đã có tài khoản? Đăng nhập' : 'Chưa có tài khoản? Đăng ký'}
              </button>
              <button
                type="button"
                onClick={() => setAuthMethod('phone')}
                className="text-slate-400 hover:text-white"
              >
                Dùng số điện thoại
              </button>
            </div>
          </form>
        )}

        {/* ── 1-TAP QUICK ROLES TRIAL (PHOTO 2 LAYOUT + PHOTO 1 STYLING) ── */}
        <div className="pt-3 border-t border-slate-800 text-center">
          <p className="text-[11px] text-slate-400 mb-2.5 font-medium flex items-center justify-center gap-1">
            <Sparkles className="h-3.5 w-3.5 text-orange-400" />
            <span>Tài khoản thử nghiệm nhanh (1-Chạm):</span>
          </p>

          <div className="grid grid-cols-3 gap-2">
            {ROLES_CONFIG.map((r) => {
              const isActive = selectedRole === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => handleQuickRole(r.id)}
                  disabled={loading}
                  className={`py-2 px-1 rounded-xl border text-[11px] font-bold transition-all duration-150 active:scale-95 shadow-sm ${
                    isActive ? r.activeClasses : r.btnClasses
                  }`}
                >
                  {r.badge}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Safety Guarantee */}
        <div className="mt-5 text-center text-[10px] text-slate-500 flex items-center justify-center gap-1">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          <span>Bảo mật dữ liệu chuẩn mã hóa SSL 256-bit</span>
        </div>
      </motion.div>
    </div>
  );
}
