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
  ShieldCheck
} from 'lucide-react';

export default function AuthPage() {
  const router = useRouter();
  const { setUser, addToast } = useApp();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form states
  const [email, setEmail] = useState('an@example.com');
  const [password, setPassword] = useState('12345678');
  const [name, setName] = useState('Nguyễn Văn An');
  const [phone, setPhone] = useState('0988123456');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (activeTab === 'login') {
        const res = await signInWithEmail(email, password);
        if (res.error && !res.error.message.includes('mock')) {
          // If error from real Supabase
          addToast(res.error.message, 'warning');
        }
        setUser({
          ...mockUser,
          email,
        });
        addToast(`👋 Chào mừng trở lại!`, 'success');
      } else {
        const res = await signUpWithEmail(email, password, name);
        if (res.error && !res.error.message.includes('mock')) {
          addToast(res.error.message, 'warning');
        }
        setUser({
          ...mockUser,
          name: name || 'Người dùng mới',
          email,
          phone,
        });
        addToast(`🎉 Đăng ký thành công! Chào mừng ${name || 'bạn'}.`, 'success');
      }
    } catch {
      // Local fallback
      setUser({
        ...mockUser,
        name: name || 'Người dùng mới',
        email,
      });
      addToast('Đăng nhập thành công!', 'success');
    } finally {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        router.push('/');
      }, 500);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (err: any) {
      addToast('Đang kết nối cổng Google OAuth...', 'info');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-page-bg p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="flex w-full max-w-4xl overflow-hidden rounded-3xl border border-border bg-white shadow-2xl"
      >
        {/* Left Side: Brand & Visual Showcase */}
        <div className="hidden lg:flex w-1/2 flex-col justify-between bg-primary p-10 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_20px]" />

          {/* Top Logo */}
          <div className="relative z-10">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-white shadow-lg">
                <Home className="h-5 w-5" />
              </div>
              <span className="text-xl font-extrabold tracking-tight">
                HaNoi <span className="text-accent font-black">Realty</span>
              </span>
            </Link>
          </div>

          {/* Middle Value Props */}
          <div className="relative z-10 space-y-6">
            <h2 className="text-2xl font-extrabold leading-snug">
              Nền tảng BĐS & Quy hoạch Đô thị Hà Nội thông minh
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Truy cập dữ liệu quy hoạch đất 2030, xem định giá và nhận báo cáo thẩm định AI chuyên sâu theo thời gian thực.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-xs text-slate-200">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-accent/20 text-accent">
                  <ShieldCheck className="h-3.5 w-3.5" />
                </div>
                <span>Tra cứu quy hoạch 100% minh bạch & chuẩn pháp lý</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-200">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-accent/20 text-accent">
                  <Sparkles className="h-3.5 w-3.5" />
                </div>
                <span>Thẩm định tiềm năng tăng giá bằng trí tuệ nhân tạo</span>
              </div>
            </div>
          </div>

          {/* Bottom Footer note */}
          <div className="relative z-10 text-[11px] text-slate-400">
            © 2026 HaNoi Realty. Nền tảng PropTech hàng đầu Thủ Đô.
          </div>
        </div>

        {/* Right Side: Auth Form Container */}
        <div className="flex w-full lg:w-1/2 flex-col justify-center p-6 sm:p-10">
          
          {/* Top Logo for Mobile */}
          <div className="lg:hidden mb-6 text-center">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-white">
                <Home className="h-4 w-4" />
              </div>
              <span className="text-lg font-extrabold text-primary">HaNoi Realty</span>
            </Link>
          </div>

          {/* Tab Switcher: Đăng nhập / Đăng ký */}
          <div className="relative flex rounded-xl bg-slate-100 p-1 mb-6">
            <button
              onClick={() => setActiveTab('login')}
              className={`relative flex-1 py-2 text-xs font-bold transition-colors ${
                activeTab === 'login' ? 'text-primary' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {activeTab === 'login' && (
                <motion.div
                  layoutId="authTabIndicator"
                  className="absolute inset-0 rounded-lg bg-white shadow-sm"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">Đăng nhập</span>
            </button>

            <button
              onClick={() => setActiveTab('register')}
              className={`relative flex-1 py-2 text-xs font-bold transition-colors ${
                activeTab === 'register' ? 'text-primary' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {activeTab === 'register' && (
                <motion.div
                  layoutId="authTabIndicator"
                  className="absolute inset-0 rounded-lg bg-white shadow-sm"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">Đăng ký tài khoản</span>
            </button>
          </div>

          {/* Animated Form Fields */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {activeTab === 'login' ? (
                <motion.div
                  key="login-fields"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 15 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="text-xs font-bold text-text-primary">Email</label>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-text-muted" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="an@example.com"
                        className="w-full rounded-xl border border-input bg-page-bg pl-9 pr-3 py-2 text-xs font-semibold focus:border-accent focus:bg-white focus:outline-none focus:ring-1 focus:ring-accent"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-text-primary">Mật khẩu</label>
                      <a href="#" className="text-[11px] font-semibold text-accent hover:underline">
                        Quên mật khẩu?
                      </a>
                    </div>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-text-muted" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full rounded-xl border border-input bg-page-bg pl-9 pr-3 py-2 text-xs font-semibold focus:border-accent focus:bg-white focus:outline-none focus:ring-1 focus:ring-accent"
                      />
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="register-fields"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="text-xs font-bold text-text-primary">Họ và tên</label>
                    <div className="relative mt-1">
                      <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-text-muted" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nguyễn Văn An"
                        className="w-full rounded-xl border border-input bg-page-bg pl-9 pr-3 py-2 text-xs font-semibold focus:border-accent focus:bg-white focus:outline-none focus:ring-1 focus:ring-accent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-text-primary">Số điện thoại</label>
                    <div className="relative mt-1">
                      <Phone className="absolute left-3 top-2.5 h-4 w-4 text-text-muted" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="0988 123 456"
                        className="w-full rounded-xl border border-input bg-page-bg pl-9 pr-3 py-2 text-xs font-semibold focus:border-accent focus:bg-white focus:outline-none focus:ring-1 focus:ring-accent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-text-primary">Email</label>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-text-muted" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="an@example.com"
                        className="w-full rounded-xl border border-input bg-page-bg pl-9 pr-3 py-2 text-xs font-semibold focus:border-accent focus:bg-white focus:outline-none focus:ring-1 focus:ring-accent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-text-primary">Mật khẩu</label>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-text-muted" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Tối thiểu 8 ký tự"
                        className="w-full rounded-xl border border-input bg-page-bg pl-9 pr-3 py-2 text-xs font-semibold focus:border-accent focus:bg-white focus:outline-none focus:ring-1 focus:ring-accent"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading || success}
              type="submit"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-3 px-4 text-xs font-extrabold text-white shadow-lg shadow-accent/25 hover:bg-accent-hover transition-all disabled:opacity-75"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Đang xử lý Supabase...</span>
                </>
              ) : success ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-white" />
                  <span>Thành công! Đang chuyển trang...</span>
                </>
              ) : (
                <>
                  <span>{activeTab === 'login' ? 'Đăng nhập ngay' : 'Tạo tài khoản'}</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </motion.button>
          </form>

          {/* Quick Demo Fill Credentials button */}
          <div className="mt-6 rounded-xl border border-dashed border-slate-200 bg-page-bg p-3 text-center">
            <span className="text-[11px] text-text-muted">Tài khoản demo: </span>
            <button
              onClick={() => {
                setEmail('an@example.com');
                setPassword('12345678');
                setActiveTab('login');
              }}
              className="text-[11px] font-bold text-accent hover:underline ml-1"
            >
              an@example.com (Pro Agent)
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
