'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/lib/context/AppContext';
import { mockUser } from '@/lib/mock-data';
import {
  signInWithEmail,
  signUpWithEmail,
  signInWithGoogle,
  signInWithFacebook,
  signInWithApple,
} from '@/lib/supabase/queries/auth';
import { signInWithGoogleFirebase } from '@/lib/firebase/auth';
import {
  Mail,
  Lock,
  Phone,
  ArrowRight,
  Loader2,
  ShieldCheck,
  User as UserIcon,
  Sparkles,
  Search,
  Key,
  Briefcase,
  Check,
  Eye,
  EyeOff,
} from 'lucide-react';

export type AuthRole = 'buyer' | 'owner' | 'agent' | 'admin';

interface RegistrationRoleMeta {
  id: AuthRole;
  title: string;
  badge: string;
  fullDesc: string;
  icon: any;
  colorHex: string;
  activeBorderClass: string;
  activeBgClass: string;
  activeBadgeClass: string;
  targetRoute: string;
}

// 3 public roles available for sign up
export const REGISTRATION_ROLES: Record<'buyer' | 'owner' | 'agent', RegistrationRoleMeta> = {
  buyer: {
    id: 'buyer',
    title: 'Người mua / Người thuê',
    badge: 'Khách hàng',
    fullDesc: 'Khám phá BĐS chuẩn đã kiểm tra, tra cứu quy hoạch Hà Nội 2030, đặt lịch xem nhà miễn phí.',
    icon: Search,
    colorHex: '#0284c7',
    activeBorderClass: 'border-sky-500 ring-2 ring-sky-500/30',
    activeBgClass: 'bg-sky-500/10',
    activeBadgeClass: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
    targetRoute: '/search',
  },
  owner: {
    id: 'owner',
    title: 'Chủ nhà BĐS',
    badge: 'Ký gửi nguồn hàng',
    fullDesc: 'Gửi nhà đất vào kho chuẩn, xác minh pháp lý, kết nối mạng lưới CTV rộng khắp.',
    icon: Key,
    colorHex: '#10b981',
    activeBorderClass: 'border-emerald-500 ring-2 ring-emerald-500/30',
    activeBgClass: 'bg-emerald-500/10',
    activeBadgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    targetRoute: '/dashboard?tab=listings&role=owner',
  },
  agent: {
    id: 'agent',
    title: 'CTV / Môi giới',
    badge: 'Khai thác kho mở',
    fullDesc: 'Tiếp cận kho nguồn toàn Hà Nội, đăng ký giới thiệu khách (Lead Claim), nhận hoa hồng minh bạch.',
    icon: Briefcase,
    colorHex: '#f97316',
    activeBorderClass: 'border-orange-500 ring-2 ring-orange-500/30',
    activeBgClass: 'bg-orange-500/10',
    activeBadgeClass: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
    targetRoute: '/dashboard?tab=crm&role=agent',
  },
};

// Helper: Điều hướng tới đúng trang dựa theo vai trò tài khoản được lưu trong Supabase
export function getRouteForRole(role: string): string {
  switch (role) {
    case 'admin':
      return '/admin';
    case 'owner':
      return '/dashboard?tab=listings&role=owner';
    case 'agent':
      return '/dashboard?tab=crm&role=agent';
    case 'buyer':
    case 'user':
    default:
      return '/search';
  }
}

// Helper: Hiển thị tên tiếng Việt của vai trò
export function getRoleBadgeTitle(role: string): string {
  switch (role) {
    case 'admin':
      return 'Quản trị viên';
    case 'owner':
      return 'Chủ nhà BĐS';
    case 'agent':
      return 'CTV / Môi giới';
    case 'buyer':
    case 'user':
    default:
      return 'Khách hàng';
  }
}

export default function AuthPageContent({
  initialMode = 'login',
}: {
  initialMode?: 'login' | 'register';
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { setUser, addToast } = useApp();

  // Mode: login or register
  const [mode, setMode] = useState<'login' | 'register'>(() => {
    if (initialMode === 'register') return 'register';
    if (pathname && pathname.includes('register')) return 'register';
    if (searchParams && searchParams.get('mode') === 'register') return 'register';
    return 'login';
  });

  // Role selection ONLY FOR REGISTER
  const [registerRole, setRegisterRole] = useState<'buyer' | 'owner' | 'agent'>('buyer');

  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Common inputs
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');

  // Role-specific fields for Registration
  // 1. Buyer
  const [buyerInterest, setBuyerInterest] = useState<'buy' | 'rent' | 'invest'>('buy');
  // 2. Owner
  const [ownerPropertyType, setOwnerPropertyType] = useState<'house' | 'apartment' | 'land' | 'villa'>('house');
  const [ownerPurpose, setOwnerPurpose] = useState<'sale' | 'rent'>('sale');
  // 3. Agent
  const [agentDistrict, setAgentDistrict] = useState('Cầu Giấy & Nam Từ Liêm');
  const [agentType, setAgentType] = useState<'independent' | 'brokerage'>('independent');

  // Terms agreement
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Sync mode state if URL changes
  useEffect(() => {
    if (pathname && pathname.includes('register')) {
      setMode('register');
    } else if (searchParams && searchParams.get('mode') === 'register') {
      setMode('register');
    }
  }, [pathname, searchParams]);

  // ============================================================================
  // XỬ LÝ ĐĂNG KÝ (LƯU TRỮ VAI TRÒ VÀ THÔNG TIN VÀO SUPABASE)
  // ============================================================================
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      addToast('Vui lòng nhập họ và tên của bạn!', 'warning');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      addToast('Vui lòng nhập địa chỉ email hợp lệ!', 'warning');
      return;
    }
    if (!password || password.length < 6) {
      addToast('Mật khẩu cần tối thiểu 6 ký tự!', 'warning');
      return;
    }
    if (registerRole === 'owner' && !phoneNumber.trim()) {
      addToast('Chủ nhà bắt buộc cung cấp số điện thoại chính chủ để xác minh BĐS!', 'warning');
      return;
    }
    if (!agreeTerms) {
      addToast('Vui lòng đồng ý với Điều khoản dịch vụ & Chính sách bảo mật!', 'warning');
      return;
    }

    setLoading(true);
    const meta = REGISTRATION_ROLES[registerRole];

    try {
      const extraMetadata: Record<string, any> = {
        role: registerRole,
        phone: phoneNumber.trim(),
      };

      if (registerRole === 'buyer') {
        extraMetadata.buyerInterest = buyerInterest;
      } else if (registerRole === 'owner') {
        extraMetadata.ownerPropertyType = ownerPropertyType;
        extraMetadata.ownerPurpose = ownerPurpose;
      } else if (registerRole === 'agent') {
        extraMetadata.agentDistrict = agentDistrict;
        extraMetadata.agentType = agentType;
      }

      // 1. Đăng ký tài khoản trong Supabase Auth (Lưu role vào auth user_metadata)
      const res = await signUpWithEmail(
        email.trim(),
        password,
        fullName.trim(),
        registerRole,
        phoneNumber.trim(),
        extraMetadata
      );

      const userId = res?.data?.user?.id || `user_${Date.now()}`;

      // 2. Lưu trữ và đồng bộ vai trò vào bảng users trong Supabase
      try {
        await fetch('/api/sync-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: userId,
            email: email.trim(),
            full_name: fullName.trim(),
            phone: phoneNumber.trim(),
            role: registerRole,
          }),
        });
      } catch (syncErr) {
        console.warn('Sync user route warning:', syncErr);
      }

      // 3. Cập nhật phiên đăng nhập Client
      setUser({
        ...mockUser,
        id: userId,
        name: fullName.trim(),
        email: email.trim(),
        phone: phoneNumber.trim(),
        role: registerRole,
        package: 'Free',
      });

      addToast(`🎉 Đăng ký thành công! Chào mừng ${fullName} gia nhập HaNoi Realty (${meta.badge})`, 'success');
      router.push(meta.targetRoute);
    } catch (err: any) {
      addToast(err?.message || 'Không thể tạo tài khoản, vui lòng thử lại!', 'error');
    } finally {
      setLoading(false);
    }
  };

  // ============================================================================
  // XỬ LÝ ĐĂNG NHẬP (KHÔNG CẦN CHỌN ROLE - TỰ ĐỘNG NHẬN DIỆN VAI TRÒ TỪ SUPABASE)
  // ============================================================================
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (authMethod === 'email') {
      if (!email.trim() || !password) {
        addToast('Vui lòng nhập email và mật khẩu!', 'warning');
        return;
      }

      setLoading(true);

      try {
        // 1. Xác thực tài khoản với Supabase Auth
        const res = await signInWithEmail(email.trim(), password);

        if (res?.error && !res?.data?.user) {
          throw new Error(res.error.message || 'Email hoặc mật khẩu không chính xác!');
        }

        const authUser = res?.data?.user;
        const authMeta = authUser?.user_metadata || {};

        let userRole = authMeta.role || '';
        let userName = authMeta.full_name || authMeta.name || email.split('@')[0];
        let userPhone = authMeta.phone || phoneNumber || '';

        // 2. Tra cứu vai trò tài khoản đã lưu trong Supabase Database
        try {
          const syncRes = await fetch(`/api/sync-user?email=${encodeURIComponent(email.trim())}`);
          const syncJson = await syncRes.json();
          if (syncJson?.success && syncJson?.data) {
            const dbData = syncJson.data;
            userRole = dbData.businessRole || dbData.notification_preferences?.business_role || dbData.role || userRole;
            userName = dbData.full_name || userName;
            userPhone = dbData.phone || userPhone;
          }
        } catch (dbErr) {
          console.warn('Tra cứu vai trò từ DB dự phòng:', dbErr);
        }

        // Nếu chưa có vai trò cụ thể, nhận diện an toàn
        if (!userRole) {
          userRole = email.trim().toLowerCase() === 'admin@hanoirealty.vn' ? 'admin' : 'buyer';
        }

        // 3. Cập nhật Session AppContext
        setUser({
          ...mockUser,
          id: authUser?.id || `user_${Date.now()}`,
          name: userName,
          email: email.trim(),
          phone: userPhone,
          role: userRole,
          package: userRole === 'admin' ? 'Agency' : 'Free',
        });

        const targetRoute = getRouteForRole(userRole);
        const roleTitle = getRoleBadgeTitle(userRole);

        addToast(`👋 Đăng nhập thành công! Chào mừng ${userName} (${roleTitle})`, 'success');
        router.push(targetRoute);
      } catch (err: any) {
        addToast(err?.message || 'Đăng nhập không thành công, vui lòng kiểm tra lại!', 'error');
      } finally {
        setLoading(false);
      }
    } else {
      // Đăng nhập bằng số điện thoại
      if (!phoneNumber || phoneNumber.trim().length < 9) {
        addToast('Vui lòng nhập số điện thoại hợp lệ (10 số)!', 'warning');
        return;
      }

      setLoading(true);

      setTimeout(() => {
        setUser({
          ...mockUser,
          id: 'phone_' + Date.now(),
          name: `Thành viên (${phoneNumber.slice(-4)})`,
          phone: phoneNumber.trim(),
          role: 'buyer',
          package: 'Free',
        });
        addToast(`🎉 Đăng nhập thành công với số ${phoneNumber}!`, 'success');
        setLoading(false);
        router.push('/search');
      }, 400);
    }
  };

  // Đăng nhập mạng xã hội (Google)
  const handleGoogleLogin = async () => {
    try {
      addToast('Đang kết nối Google...', 'info');
      const { user: fbUser, error } = await signInWithGoogleFirebase();

      if (error) {
        if ((error as any).code === 'auth/popup-closed-by-user') {
          addToast('Bạn đã đóng cửa sổ đăng nhập Google', 'info');
          return;
        }
        const sbRes = await signInWithGoogle();
        if (sbRes?.error) {
          addToast(`Lỗi đăng nhập Google: ${error.message}`, 'error');
        }
        return;
      }

      if (fbUser) {
        const userEmail = fbUser.email || '';
        let detectedRole = 'buyer';
        let detectedName = fbUser.displayName || userEmail.split('@')[0] || 'Khách hàng Google';

        // Tra cứu vai trò từ Supabase Database nếu đã từng đăng ký trước đó
        if (userEmail) {
          try {
            const syncRes = await fetch(`/api/sync-user?email=${encodeURIComponent(userEmail)}`);
            const syncJson = await syncRes.json();
            if (syncJson?.success && syncJson?.data) {
              detectedRole = syncJson.data.businessRole || syncJson.data.role || detectedRole;
              detectedName = syncJson.data.full_name || detectedName;
            } else {
              // Lưu tài khoản mới nếu chưa có
              await fetch('/api/sync-user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  id: fbUser.uid,
                  email: userEmail,
                  full_name: detectedName,
                  avatar_url: fbUser.photoURL || null,
                  role: mode === 'register' ? registerRole : 'buyer',
                }),
              });
              if (mode === 'register') detectedRole = registerRole;
            }
          } catch (syncErr) {
            console.warn('Sync google user error:', syncErr);
          }
        }

        setUser({
          ...mockUser,
          id: fbUser.uid,
          name: detectedName,
          email: userEmail,
          avatar: fbUser.photoURL || mockUser.avatar,
          role: detectedRole,
          package: detectedRole === 'admin' ? 'Agency' : 'Free',
        });

        const targetRoute = getRouteForRole(detectedRole);
        addToast(`🎉 Đăng nhập Google thành công! Xin chào ${detectedName}`, 'success');
        router.push(targetRoute);
      }
    } catch (err: any) {
      addToast(`Không thể kết nối Google: ${err?.message || 'Vui lòng thử lại'}`, 'error');
    }
  };

  const handleFacebookLogin = async () => {
    try {
      addToast('Đang kết nối Facebook...', 'info');
      const res = await signInWithFacebook();
      if (res?.error) addToast(`Lỗi Facebook: ${res.error.message}`, 'error');
    } catch (err: any) {
      addToast(`Không thể kết nối Facebook: ${err?.message}`, 'error');
    }
  };

  const handleAppleLogin = async () => {
    try {
      addToast('Đang kết nối Apple ID...', 'info');
      const res = await signInWithApple();
      if (res?.error) addToast(`Lỗi Apple: ${res.error.message}`, 'error');
    } catch (err: any) {
      addToast(`Không thể kết nối Apple: ${err?.message}`, 'error');
    }
  };

  // 1-Tap Quick Trial For Development / Testing Purposes
  const handleQuickRole = (role: AuthRole) => {
    setLoading(true);
    let demoName = 'Nguyễn Minh Tuấn (Khách mua)';
    let demoEmail = 'khachhang@hanoirealty.vn';
    let demoPackage = 'Free';
    let demoPhone = '0912 345 678';

    if (role === 'owner') {
      demoName = 'Phạm Quốc Dũng (Chủ nhà BĐS)';
      demoEmail = 'chunha@hanoirealty.vn';
      demoPhone = '0988 765 432';
    } else if (role === 'agent') {
      demoName = 'Trần Thị Thu Hà (Môi giới VIP)';
      demoEmail = 'moigioi@hanoirealty.vn';
      demoPackage = 'Pro';
      demoPhone = '0977 889 900';
    } else if (role === 'admin') {
      demoName = 'Hệ thống Quản Trị Super Admin';
      demoEmail = 'admin@hanoirealty.vn';
      demoPackage = 'Agency';
      demoPhone = '0900 000 001';
    }

    setTimeout(() => {
      setUser({
        ...mockUser,
        id: `${role}_demo_01`,
        name: demoName,
        email: demoEmail,
        phone: demoPhone,
        role: role,
        package: demoPackage,
      });

      addToast(`⚡ Đăng nhập kiểm thử: ${demoName}`, 'success');
      setLoading(false);
      router.push(getRouteForRole(role));
    }, 300);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#070b14] px-4 py-8 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Ambient Glow */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[350px] bg-orange-500/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[350px] bg-sky-500/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(#f97316_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="w-full max-w-[480px] rounded-[30px] bg-[#0f172a] p-6 sm:p-8 shadow-2xl relative z-10 border border-slate-800"
      >
        {/* Header with Title & Logo */}
        <div className="flex items-start justify-between gap-3 mb-5">
          <div className="flex-1 pr-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 mb-2 text-xs font-bold text-orange-400 hover:text-orange-300 transition-colors"
            >
              <span>← Trang chủ</span>
            </Link>
            <h1 className="text-2xl sm:text-[25px] font-black tracking-tight text-white leading-tight">
              {mode === 'register' ? 'Đăng ký tài khoản' : 'Đăng nhập nền tảng'}
            </h1>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Hệ thống Bất Động Sản & Bản Đồ Quy Hoạch Hà Nội
            </p>
          </div>

          <Link
            href="/"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 text-white font-black text-2xl shadow-lg shadow-orange-500/25 border border-orange-400/40"
          >
            🏠
          </Link>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="grid grid-cols-2 p-1 bg-[#1e293b]/70 rounded-2xl border border-slate-800 mb-5">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`py-2.5 rounded-xl text-xs font-extrabold transition-all duration-200 cursor-pointer ${
              mode === 'login'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Đăng nhập
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`py-2.5 rounded-xl text-xs font-extrabold transition-all duration-200 cursor-pointer ${
              mode === 'register'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Đăng ký thành viên
          </button>
        </div>

        {/* ======================================================================
            CASE 1: FORM ĐĂNG KÝ (CẦN CHỌN VAI TRÒ ĐỂ THIẾT LẬP HỒ SƠ)
            ====================================================================== */}
        {mode === 'register' ? (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            {/* LỰA CHỌN 3 VAI TRÒ ĐĂNG KÝ */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-extrabold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <span>1. Chọn vai trò tham gia của bạn:</span>
                </label>
                <span className="text-[11px] font-semibold text-orange-400">
                  {REGISTRATION_ROLES[registerRole].badge}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {(['buyer', 'owner', 'agent'] as const).map((roleId) => {
                  const meta = REGISTRATION_ROLES[roleId];
                  const IconComponent = meta.icon;
                  const isSelected = registerRole === roleId;

                  return (
                    <div
                      key={roleId}
                      onClick={() => setRegisterRole(roleId)}
                      className={`p-3 rounded-2xl border transition-all duration-200 cursor-pointer text-left relative flex items-start gap-3 ${
                        isSelected
                          ? `${meta.activeBorderClass} ${meta.activeBgClass}`
                          : 'border-slate-800 bg-[#1e293b]/50 hover:border-slate-700 hover:bg-[#1e293b]/80'
                      }`}
                    >
                      <div
                        className="h-10 w-10 rounded-xl shrink-0 flex items-center justify-center font-bold"
                        style={{
                          backgroundColor: isSelected ? meta.colorHex : '#334155',
                          color: 'white',
                        }}
                      >
                        <IconComponent className="h-5 w-5" />
                      </div>

                      <div className="flex-1 min-w-0 pr-6">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-extrabold text-white truncate">
                            {meta.title}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${meta.activeBadgeClass}`}
                          >
                            {meta.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                          {meta.fullDesc}
                        </p>
                      </div>

                      <div className="absolute top-3.5 right-3.5">
                        <div
                          className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-orange-500 bg-orange-500 text-white' : 'border-slate-600'
                          }`}
                        >
                          {isSelected && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* THÔNG TIN CHI TIẾT THEO VAI TRÒ */}
            <div className="border-t border-slate-800/80 pt-3 space-y-3">
              <label className="text-xs font-extrabold text-slate-200 uppercase tracking-wider block mb-1">
                2. Thông tin đăng ký ({REGISTRATION_ROLES[registerRole].title}):
              </label>

              {/* Họ và tên */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  Họ và tên <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={
                    registerRole === 'owner'
                      ? 'Họ tên Chủ BĐS / Người đại diện'
                      : registerRole === 'agent'
                      ? 'Họ tên Môi giới / CTV'
                      : 'Họ và tên của bạn'
                  }
                  className="w-full px-3.5 py-2.5 bg-[#1e293b]/70 border border-slate-700/80 rounded-xl text-xs font-medium text-white placeholder:text-slate-500 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                />
              </div>

              {/* Số điện thoại & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Số điện thoại {registerRole === 'owner' ? <span className="text-rose-500">*</span> : '(Zalo)'}
                  </label>
                  <input
                    type="tel"
                    required={registerRole === 'owner'}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="0912 345 678"
                    className="w-full px-3.5 py-2.5 bg-[#1e293b]/70 border border-slate-700/80 rounded-xl text-xs font-medium text-white placeholder:text-slate-500 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Email đăng nhập <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@email.com"
                    className="w-full px-3.5 py-2.5 bg-[#1e293b]/70 border border-slate-700/80 rounded-xl text-xs font-medium text-white placeholder:text-slate-500 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                  />
                </div>
              </div>

              {/* Mật khẩu */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  Mật khẩu bảo mật <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Tối thiểu 6 ký tự"
                    className="w-full px-3.5 py-2.5 bg-[#1e293b]/70 border border-slate-700/80 rounded-xl text-xs font-medium text-white placeholder:text-slate-500 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Trường riêng cho từng vai trò */}
              {registerRole === 'buyer' && (
                <div className="p-3 rounded-xl bg-[#1e293b]/40 border border-slate-800">
                  <label className="block text-[11px] font-bold text-slate-300 mb-1.5">
                    Nhu cầu tìm kiếm chính của bạn:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'buy' as const, label: 'Mua để ở' },
                      { id: 'invest' as const, label: 'Đầu tư' },
                      { id: 'rent' as const, label: 'Thuê nhà' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setBuyerInterest(item.id)}
                        className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold border transition-all ${
                          buyerInterest === item.id
                            ? 'border-sky-500 bg-sky-500/20 text-sky-300'
                            : 'border-slate-700 bg-slate-800/60 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {registerRole === 'owner' && (
                <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-800/40 space-y-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-emerald-300 mb-1.5">
                      Nhu cầu gửi nguồn BĐS:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setOwnerPurpose('sale')}
                        className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold border transition-all ${
                          ownerPurpose === 'sale'
                            ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300'
                            : 'border-slate-700 bg-slate-800/60 text-slate-400'
                        }`}
                      >
                        Cần bán BĐS
                      </button>
                      <button
                        type="button"
                        onClick={() => setOwnerPurpose('rent')}
                        className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold border transition-all ${
                          ownerPurpose === 'rent'
                            ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300'
                            : 'border-slate-700 bg-slate-800/60 text-slate-400'
                        }`}
                      >
                        Cần cho thuê
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-emerald-300 mb-1">
                      Loại BĐS sở hữu:
                    </label>
                    <select
                      value={ownerPropertyType}
                      onChange={(e: any) => setOwnerPropertyType(e.target.value)}
                      className="w-full px-3 py-2 bg-[#1e293b] border border-slate-700 rounded-lg text-xs font-semibold text-white outline-none focus:border-emerald-500"
                    >
                      <option value="house">Nhà riêng / Nhà phố Hà Nội</option>
                      <option value="apartment">Căn hộ chung cư</option>
                      <option value="land">Đất thổ cư / Đất nền</option>
                      <option value="villa">Biệt thự / Liền kề / Shophouse</option>
                    </select>
                  </div>
                </div>
              )}

              {registerRole === 'agent' && (
                <div className="p-3 rounded-xl bg-orange-950/20 border border-orange-800/40 space-y-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-orange-300 mb-1">
                      Khu vực quận hoạt động chính tại Hà Nội:
                    </label>
                    <input
                      type="text"
                      value={agentDistrict}
                      onChange={(e) => setAgentDistrict(e.target.value)}
                      placeholder="VD: Cầu Giấy, Nam Từ Liêm, Đống Đa..."
                      className="w-full px-3 py-2 bg-[#1e293b] border border-slate-700 rounded-lg text-xs font-medium text-white placeholder:text-slate-500 outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-orange-300 mb-1.5">
                      Hình thức hoạt động:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setAgentType('independent')}
                        className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold border transition-all ${
                          agentType === 'independent'
                            ? 'border-orange-500 bg-orange-500/20 text-orange-300'
                            : 'border-slate-700 bg-slate-800/60 text-slate-400'
                        }`}
                      >
                        Môi giới độc lập (CTV)
                      </button>
                      <button
                        type="button"
                        onClick={() => setAgentType('brokerage')}
                        className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold border transition-all ${
                          agentType === 'brokerage'
                            ? 'border-orange-500 bg-orange-500/20 text-orange-300'
                            : 'border-slate-700 bg-slate-800/60 text-slate-400'
                        }`}
                      >
                        Đại diện Sàn BĐS
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Điều khoản */}
              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 rounded border-slate-700 bg-slate-800 text-orange-500 focus:ring-orange-500"
                />
                <label htmlFor="terms" className="text-[11px] text-slate-400 leading-tight">
                  Tôi đồng ý với{' '}
                  <Link href="/about" className="text-orange-400 hover:underline">
                    Điều khoản dịch vụ
                  </Link>{' '}
                  và cam kết cung cấp thông tin trung thực.
                </label>
              </div>

              {/* Nút đăng ký */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99]"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                ) : (
                  <>
                    <span>Hoàn tất đăng ký ({REGISTRATION_ROLES[registerRole].title})</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* ======================================================================
              CASE 2: FORM ĐĂNG NHẬP (CHUẨN GỌN GÀNG - KHÔNG CẦN CHỌN VAI TRÒ)
              Hệ thống tự động tra cứu vai trò đã đăng ký trong Supabase!
              ====================================================================== */
          <div className="space-y-4">
            {/* Phương thức Social Logins */}
            <div className="space-y-2 mb-4">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-700/80 bg-[#1e293b]/70 hover:bg-[#1e293b] text-slate-100 text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-2.5 active:scale-[0.99] cursor-pointer"
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

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleFacebookLogin}
                  disabled={loading}
                  className="py-2 px-3 rounded-xl border border-slate-700/80 bg-[#1e293b]/70 hover:bg-[#1e293b] text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <svg className="h-4 w-4 shrink-0 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span>Facebook</span>
                </button>

                <button
                  type="button"
                  onClick={handleAppleLogin}
                  disabled={loading}
                  className="py-2 px-3 rounded-xl border border-slate-700/80 bg-[#1e293b]/70 hover:bg-[#1e293b] text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <svg className="h-4 w-4 shrink-0 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.38c.62-.76 1.04-1.82.93-2.88-.9.04-1.98.6-2.61 1.36-.56.65-.95 1.72-.82 2.76 1 .08 1.9-.48 2.5-1.24z" />
                  </svg>
                  <span>Apple ID</span>
                </button>
              </div>
            </div>

            <div className="relative flex items-center justify-center my-4">
              <div className="w-full border-t border-slate-800"></div>
              <span className="bg-[#0f172a] px-3 text-[11px] font-semibold text-slate-500 absolute">
                Hoặc đăng nhập bằng tài khoản
              </span>
            </div>

            {/* Toggle Phương thức: Email hay Số điện thoại */}
            <div className="flex justify-end gap-3 text-xs mb-1">
              <button
                type="button"
                onClick={() => setAuthMethod(authMethod === 'email' ? 'phone' : 'email')}
                className="text-orange-400 font-bold hover:underline cursor-pointer flex items-center gap-1"
              >
                {authMethod === 'email' ? (
                  <>
                    <Phone className="h-3.5 w-3.5" />
                    <span>Đổi sang dùng Số điện thoại</span>
                  </>
                ) : (
                  <>
                    <Mail className="h-3.5 w-3.5" />
                    <span>Đổi sang dùng Email & Mật khẩu</span>
                  </>
                )}
              </button>
            </div>

            {/* Form nhập thông tin đăng nhập */}
            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              {authMethod === 'email' ? (
                <>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      Email tài khoản:
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@email.com"
                      className="w-full px-3.5 py-2.5 bg-[#1e293b]/70 border border-slate-700/80 rounded-xl text-xs font-medium text-white placeholder:text-slate-500 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold text-slate-300">Mật khẩu:</label>
                      <button
                        type="button"
                        onClick={() => addToast('Vui lòng liên hệ Admin hoặc kiểm tra hộp thư email để khôi phục!', 'info')}
                        className="text-[10.5px] text-slate-400 hover:text-orange-400 transition-colors"
                      >
                        Quên mật khẩu?
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Nhập mật khẩu của bạn"
                        className="w-full px-3.5 py-2.5 bg-[#1e293b]/70 border border-slate-700/80 rounded-xl text-xs font-medium text-white placeholder:text-slate-500 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Số điện thoại tài khoản:
                  </label>
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="0912 345 678"
                    className="w-full px-3.5 py-2.5 bg-[#1e293b]/70 border border-slate-700/80 rounded-xl text-xs font-medium text-white placeholder:text-slate-500 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                  />
                </div>
              )}

              {/* Nút Đăng nhập duy nhất */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99] mt-2"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                ) : (
                  <>
                    <span>Đăng nhập</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Chưa có tài khoản?{' '}
                  <span className="text-orange-400 font-bold hover:underline">
                    Đăng ký thành viên ngay
                  </span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ======================================================================
            TIỆN ÍCH DÀNH CHO KIỂM THỬ / DEMO (1-CHẠM VÀO THẲNG VAI TRÒ MẪU)
            ====================================================================== */}
        <div className="pt-4 mt-6 border-t border-slate-800 text-center">
          <p className="text-[11px] text-slate-400 mb-2 font-semibold flex items-center justify-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-orange-400" />
            <span>Thử nghiệm nhanh tài khoản mẫu (Kiểm thử):</span>
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            {[
              { id: 'buyer' as AuthRole, label: 'Khách hàng' },
              { id: 'owner' as AuthRole, label: 'Chủ nhà' },
              { id: 'agent' as AuthRole, label: 'CTV Môi giới' },
              { id: 'admin' as AuthRole, label: 'Super Admin' },
            ].map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => handleQuickRole(r.id)}
                disabled={loading}
                className="py-1.5 px-1.5 rounded-lg border border-slate-800 bg-[#1e293b]/80 hover:bg-slate-800 hover:border-slate-700 text-slate-200 text-[10.5px] font-bold transition-all duration-150 active:scale-95 cursor-pointer shadow-xs truncate"
              >
                ⚡ {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Footer Guarantee */}
        <div className="mt-4 text-center text-[10px] text-slate-500 flex items-center justify-center gap-1">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          <span>Hệ thống bảo vệ dữ liệu chuẩn mã hóa SSL 256-bit</span>
        </div>
      </motion.div>
    </div>
  );
}
