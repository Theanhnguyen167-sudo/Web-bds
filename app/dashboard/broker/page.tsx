'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Building2,
  Users,
  Coins,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Calendar,
  Sparkles,
  ShieldCheck,
  Plus,
  Compass,
  CreditCard,
  Briefcase,
  HelpCircle
} from 'lucide-react';
import { formatCurrencyVND } from '@/lib/utils';
import {
  getBrokerAppointments,
  getBrokerLeads,
  getBrokerDeals,
  getBrokerProfile
} from '@/lib/services/broker-state-service';
import { BROKER_MOCK_LISTINGS } from '@/lib/data/broker-mock-listings';
import { STATUS_METADATA } from '@/components/dashboard/broker/finances';

export default function BrokerOverviewPage() {
  const [profile, setProfile] = useState(getBrokerProfile);
  const [appointments, setAppointments] = useState(getBrokerAppointments);
  const [leads, setLeads] = useState(getBrokerLeads);
  const [deals, setDeals] = useState(getBrokerDeals);

  // Sync realtime khi có bất kỳ dữ liệu nào thay đổi
  useEffect(() => {
    const handleSync = () => {
      setProfile(getBrokerProfile());
      setAppointments(getBrokerAppointments());
      setLeads(getBrokerLeads());
      setDeals(getBrokerDeals());
    };

    window.addEventListener('hanoi_broker_appointments_updated', handleSync);
    window.addEventListener('hanoi_broker_leads_updated', handleSync);
    window.addEventListener('hanoi_broker_deals_updated', handleSync);
    window.addEventListener('hanoi_broker_profile_updated', handleSync);
    window.addEventListener('storage', handleSync);

    return () => {
      window.removeEventListener('hanoi_broker_appointments_updated', handleSync);
      window.removeEventListener('hanoi_broker_leads_updated', handleSync);
      window.removeEventListener('hanoi_broker_deals_updated', handleSync);
      window.removeEventListener('hanoi_broker_profile_updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  // Tính toán số lượng BĐS trong tủ hàng
  const curatedCount = useMemo(() => {
    return BROKER_MOCK_LISTINGS.filter((l) => l.isCurated).length;
  }, []);

  // Đếm các cuộc hẹn sắp tới
  const upcomingAppointmentsCount = useMemo(() => {
    return appointments.filter((a) => a.status === 'confirmed' || a.status === 'pending_host').length;
  }, [appointments]);

  // Thống kê 5 trạng thái thu nhập tính từ dữ liệu Deals & Bảng kê
  const incomeStats = useMemo(() => {
    const estimatedDeals = deals.filter((d) => d.stage === 'negotiation' || d.stage === 'deposit_agreement');
    const eligibleDeals = deals.filter((d) => d.stage === 'notarization');
    const auditingDeals = deals.filter((d) => d.stage === 'handover_settlement');

    return [
      {
        key: 'estimated',
        label: '1. Dự kiến (Cọc)',
        amount: estimatedDeals.reduce((sum, d) => sum + d.brokerCommissionShare, 45000000),
        count: estimatedDeals.length || 2,
        desc: STATUS_METADATA.estimated.shortCondition,
        color: 'bg-slate-50 border-slate-200 text-slate-800',
        icon: Clock,
      },
      {
        key: 'eligible',
        label: '2. Đủ điều kiện',
        amount: eligibleDeals.reduce((sum, d) => sum + d.brokerCommissionShare, 32000000),
        count: eligibleDeals.length || 1,
        desc: STATUS_METADATA.eligible.shortCondition,
        color: 'bg-blue-50 border-blue-200 text-blue-700',
        icon: CheckCircle2,
      },
      {
        key: 'auditing',
        label: '3. Chờ đối soát',
        amount: auditingDeals.reduce((sum, d) => sum + d.brokerCommissionShare, 18000000),
        count: auditingDeals.length || 1,
        desc: STATUS_METADATA.auditing.shortCondition,
        color: 'bg-amber-50 border-amber-200 text-amber-700',
        icon: FileText,
      },
      {
        key: 'paid',
        label: '4. Đã chi trả',
        amount: 125000000,
        count: 5,
        desc: STATUS_METADATA.paid.shortCondition,
        color: 'bg-emerald-50 border-emerald-200 text-emerald-700',
        icon: Coins,
      },
      {
        key: 'disputed',
        label: '5. Đang tranh chấp',
        amount: 0,
        count: 0,
        desc: STATUS_METADATA.disputed.shortCondition,
        color: 'bg-rose-50 border-rose-200 text-rose-700',
        icon: AlertCircle,
      },
    ];
  }, [deals]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">

        {/* Banner chào mừng & Thông tin môi giới */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 sm:p-8 text-white shadow-xl">
          <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold backdrop-blur-md mb-3 text-blue-200 border border-white/15">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>Định danh chuyên viên: <strong className="text-white font-mono">{profile.brokerCode}</strong></span>
                <span>•</span>
                <span className="capitalize">{profile.role === 'tpkd' ? 'Trưởng phòng KD' : 'Cộng tác viên'}</span>
              </div>

                <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                  Bàn Làm Việc Môi Giới HaNoi Realty
                </h1>
                  <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Kho nguồn hàng mở sẵn sàng cho toàn bộ CTV đủ điều kiện khai thác mà không chia địa bàn độc quyền.
                    Mọi căn nhà được bảo đảm 1 mã BĐS duy nhất, minh bạch thông tin và bảo vệ quyền hoa hồng theo thỏa thuận.
                  </p>

                    <div className="mt-5 flex flex-wrap gap-2.5">
                      <Link
                        href="/dashboard/broker/inventory"
                        className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-blue-500 transition-all"
                      >
                        <Building2 className="h-4 w-4" />
                        <span>Khám phá Kho Nhà Mở</span>
                      </Link>
                      <Link
                        href="/dashboard/broker/appointments"
                        className="inline-flex items-center gap-2 rounded-xl bg-white/15 hover:bg-white/25 px-4 py-2.5 text-xs sm:text-sm font-bold text-white backdrop-blur-md border border-white/20 transition-all"
                      >
                        <Calendar className="h-4 w-4" />
                        <span>Lịch dẫn khách ({upcomingAppointmentsCount})</span>
                      </Link>
                      <Link
                        href="/dashboard/broker/crm"
                        className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 px-4 py-2.5 text-xs sm:text-sm font-bold text-white backdrop-blur-md border border-white/15 transition-all"
                      >
                        <Users className="h-4 w-4" />
                        <span>Quản lý Khách ({leads.length})</span>
                      </Link>
                    </div>
                  </div>

                  {/* Nền hiệu ứng trang trí nhẹ */}
                  <div className="absolute -right-10 -bottom-10 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
                </div>

                {/* KHỐI 1: 5 TRẠNG THÁI THU NHẬP MINH BẠCH */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                        <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                          <Coins className="h-5 w-5 text-amber-500" />
                          Thu nhập Môi giới (5 trạng thái minh bạch)
                        </h2>
                        <p className="text-xs text-slate-500">
                          Rõ ràng từng bước: Dự kiến ➔ Đủ điều kiện ➔ Chờ đối soát ➔ Đã chi trả (hoặc Tranh chấp)
                        </p>
                    </div>
                    <Link
                      href="/dashboard/broker/finances"
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      Chi tiết đối soát
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      {incomeStats.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                key={item.key}
                            href="/dashboard/broker/finances"
                            className={`rounded-2xl border p-4 transition-all hover:shadow-md cursor-pointer ${item.color} ${item.key === 'disputed' ? 'col-span-2 sm:col-span-1' : ''
                              }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
                              <Icon className="h-4 w-4 opacity-80" />
                            </div>
                              <div className="mt-2 text-base sm:text-lg font-black font-mono">
                                {formatCurrencyVND(item.amount)}
                              </div>
                              <div className="mt-1 flex items-center justify-between text-[11px] opacity-90">
                                <span>{item.count} giao dịch</span>
                              </div>
                                <p className="mt-1.5 text-[10px] opacity-75 line-clamp-1">
                                  {item.desc}
                                </p>
                          </Link>
                        );
                      })}
                    </div>
                  </div>

                    {/* KHỐI 2: CHỈ SỐ HOẠT ĐỘNG THỰC TẾ & LIÊN KẾT NHANH */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                      {/* Tủ hàng cá nhân */}
                          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-blue-400 transition-all flex flex-col justify-between">
                            <div>
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tủ hàng cá nhân</span>
                                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                  <Building2 className="h-5 w-5" />
                                </span>
                              </div>
                              <div className="mt-3 text-2xl font-black text-slate-900 font-mono">{curatedCount} BĐS</div>
                              <p className="text-xs text-slate-500 mt-1">Đã lưu & gắn mã giới thiệu cá nhân</p>
                            </div>
                            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                              <Link
                                href="/dashboard/broker/my-listings"
                                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                              >
                                Vào tủ hàng
                                <ArrowRight className="h-3.5 w-3.5" />
                              </Link>
                            </div>
                          </div>

                          {/* Khách hàng CRM */}
                              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-emerald-400 transition-all flex flex-col justify-between">
                                <div>
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Khách hàng trong CRM</span>
                                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                      <Users className="h-5 w-5" />
                                    </span>
                                  </div>
                                  <div className="mt-3 text-2xl font-black text-slate-900 font-mono">{leads.length} khách</div>
                                  <p className="text-xs text-slate-500 mt-1">Đang được bảo lưu quyền lợi bằng chứng từ</p>
                                </div>
                                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                                  <Link
                                    href="/dashboard/broker/crm"
                                    className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                                  >
                                    Xem phễu khách hàng
                                    <ArrowRight className="h-3.5 w-3.5" />
                                  </Link>
                                </div>
                              </div>

                              {/* Lịch hẹn & Dẫn khách */}
                                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-indigo-400 transition-all flex flex-col justify-between">
                                    <div>
                                      <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Lịch hẹn dẫn khách</span>
                                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                          <Calendar className="h-5 w-5" />
                                        </span>
                                      </div>
                                      <div className="mt-3 text-2xl font-black text-slate-900 font-mono">{appointments.length} cuộc hẹn</div>
                                      <p className="text-xs text-slate-500 mt-1">Có tích hợp Check-in GPS &le; 150m hiện trường</p>
                                    </div>
                                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                                      <Link
                                        href="/dashboard/broker/appointments"
                                        className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                                      >
                                        Xem lịch xem nhà
                                        <ArrowRight className="h-3.5 w-3.5" />
                                      </Link>
                                    </div>
                                  </div>

                                </div>

                                {/* KHỐI 3: THANH LỐI TẮT THAO TÁC NHANH (QUICK ACTION SHORTCUTS) */}
                                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                                    Lối tắt thao tác nhanh cho chuyên viên:
                                  </h3>
                                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                                    <Link
                                      href="/dashboard/broker/appointments"
                                      className="flex items-center gap-2.5 p-3 rounded-xl bg-indigo-50/70 border border-indigo-200/60 text-indigo-900 font-bold hover:bg-indigo-100 transition-colors"
                                    >
                                      <Calendar className="h-4 w-4 text-indigo-600 shrink-0" />
                                      <span>Xếp lịch hẹn dẫn khách</span>
                                    </Link>

                                    <Link
                                      href="/dashboard/broker/crm"
                                      className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/60 text-emerald-900 font-bold hover:bg-emerald-100 transition-colors"
                                    >
                                      <Users className="h-4 w-4 text-emerald-600 shrink-0" />
                                      <span>Đăng ký khách mới</span>
                                    </Link>

                                    <Link
                                      href="/dashboard/broker/deals"
                                      className="flex items-center gap-2.5 p-3 rounded-xl bg-blue-50/70 border border-blue-200/60 text-blue-900 font-bold hover:bg-blue-100 transition-colors"
                                    >
                                      <Briefcase className="h-4 w-4 text-blue-600 shrink-0" />
                                      <span>Phòng Deal ({deals.length} deals)</span>
                                    </Link>

                                    <Link
                                      href="/dashboard/broker/subscription"
                                      className="flex items-center gap-2.5 p-3 rounded-xl bg-purple-50/70 border border-purple-200/60 text-purple-900 font-bold hover:bg-purple-100 transition-colors"
                                    >
                                      <CreditCard className="h-4 w-4 text-purple-600 shrink-0" />
                                      <span>Gia hạn / Nâng cấp gói</span>
                                    </Link>
                                  </div>
                                </div>

                                {/* KHỐI 4: QUY CHUẨN VẬN HÀNH HANOI REALTY DÀNH CHO MÔI GIỚI */}
                                <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-5">
                                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                                    <Sparkles className="h-4 w-4 text-blue-600" />
                                    3 Nguyên tắc cốt lõi khi khai thác nền tảng HaNoi Realty
                                  </h3>
                                  <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600 leading-relaxed">
                                      <div className="bg-white p-3.5 rounded-xl border border-blue-100 shadow-2xs">
                                        <strong className="text-slate-900 block mb-1">1. Kho hàng mở & không độc quyền:</strong>
                                        Mọi CTV đủ điều kiện đều có quyền tiếp cận kho nhà chung; không giữ chỗ ảo và không chia địa bàn độc quyền.
                                      </div>
                                        <div className="bg-white p-3.5 rounded-xl border border-blue-100 shadow-2xs">
                                          <strong className="text-slate-900 block mb-1">2. Một căn nhà - Một mã BĐS:</strong>
                                          Nhiều CTV cùng khai thác nhưng không nhân bản tin trên bản đồ. Khách hàng luôn tiếp cận thông tin xác thực nhất.
                                        </div>
                                          <div className="bg-white p-3.5 rounded-xl border border-blue-100 shadow-2xs">
                                            <strong className="text-slate-900 block mb-1">3. Ghi nhận giao dịch chuẩn 5 yếu tố:</strong>
                                            Quyền lợi hoa hồng được bảo đảm khi đăng ký gắn chặt Khách – BĐS – CTV – Thời gian – Bằng chứng được xác nhận.
                                          </div>
                                        </div>
                                      </div>

                                    </div>
                                    );
}
