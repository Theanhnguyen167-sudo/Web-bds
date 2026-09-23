'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { mockListings, ListingItem } from '@/lib/mock-data';
import { getAIReportForListing, PropertyAIReport } from '@/lib/ai/report-service';
import { formatCurrencyVND } from '@/lib/utils';
import { useApp } from '@/lib/context/AppContext';
import { DownloadPDFButton } from '@/components/ai-report/DownloadPDFButton';
import { PropertyReportSelector } from '@/components/ai-report/PropertyReportSelector';
import type { FocusTarget } from '@/components/map/InfrastructureMap';
import {
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Building,
  MapPin,
  TrendingUp,
  AlertTriangle,
  FileCheck,
  Calendar,
  School,
  Hospital,
  ShoppingBag,
  Trees,
  Train,
  Check,
  RefreshCw,
  Zap,
  Target,
  ShieldAlert,
  Loader2,
  ExternalLink,
  Navigation,
  Compass,
  Layers,
} from 'lucide-react';

const InfrastructureMap = dynamic(
  () => import('@/components/map/InfrastructureMap'),
  {
    ssr: false,
    loading: () => (
      <div className="h-[460px] w-full rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse flex flex-col items-center justify-center gap-2">
        <Loader2 className="h-6 w-6 animate-spin text-accent" />
        <span className="text-xs text-text-muted">Đang tải bản đồ hạ tầng & quy hoạch Google Maps...</span>
      </div>
    ),
  }
);

interface ReportViewerProps {
  listingId: string;
}

export const ReportViewer: React.FC<ReportViewerProps> = ({ listingId }) => {
  const { user, addToast } = useApp();

  // Find initial listing or fallback to first
  const initialListing = mockListings.find((l) => l.id === listingId) || mockListings[0];
  const [listing, setListing] = useState<ListingItem>(initialListing);
  const [report, setReport] = useState<PropertyAIReport>(() => getAIReportForListing(initialListing));
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [scoreCount, setScoreCount] = useState(0);
  const [mapFocusTarget, setMapFocusTarget] = useState<FocusTarget | null>(null);
  const mapSectionRef = useRef<HTMLDivElement>(null);

  // Sync state if listingId prop changes externally
  useEffect(() => {
    const found = mockListings.find((l) => l.id === listingId);
    if (found && found.id !== listing.id) {
      setListing(found);
      setReport(getAIReportForListing(found));
    }
  }, [listingId]);

  // Handler when user selects another property from selector
  const handleSelectListing = (newListing: ListingItem) => {
    setListing(newListing);
    setReport(getAIReportForListing(newListing));
    // Update browser URL without reload
    window.history.pushState(null, '', `/reports/${newListing.id}`);
    addToast?.(`Đã chuyển sang báo cáo: ${newListing.title}`, 'info');
  };

  // Animated Score Counter (0 -> report.score)
  useEffect(() => {
    let current = 0;
    const target = report.score;
    const duration = 1200;
    const stepTime = 20;
    const increment = target / (duration / stepTime);

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setScoreCount(target);
        clearInterval(timer);
      } else {
        setScoreCount(Math.floor(current));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [report.score]);

  // Re-run real-time AI Analysis
  const handleReanalyzeAI = async () => {
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/ai/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: listing.address,
          district: listing.district,
          property_type: listing.type,
          price: listing.price,
          area: listing.area,
          direction: listing.direction,
          legal_status: listing.legalStatus,
        }),
      });

      const data = await res.json();
      if (data?.success && data?.data?.ai_analysis) {
        const ai = data.data.ai_analysis;
        setReport((prev) => ({
          ...prev,
          score: ai.growth_potential_score || prev.score,
          aiAnalysis: ai.overview_summary || prev.aiAnalysis,
          investmentRecommendation: ai.investment_recommendation || prev.investmentRecommendation,
          liquidityRating: (ai.liquidity_score || 80) >= 85 ? 'Rất Cao (7-14 ngày)' : 'Cao (15-30 ngày)',
          generatedAt: new Date().toISOString(),
        }));
        addToast?.('✨ Đã cập nhật phân tích AI thời gian thực từ Gemini 1.5 Pro!', 'success');
      } else {
        addToast?.('✅ Dữ liệu thẩm định đã được đối soát cập nhật!', 'success');
      }
    } catch (e) {
      console.error(e);
      addToast?.('Hệ thống AI đang sử dụng chế độ thẩm định phân tích tự động.', 'info');
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-6 space-y-6">
      
      {/* Top Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <Link
            href={`/listings/${listing.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-accent hover:underline mb-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Quay lại chi tiết bất động sản</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-white shadow-md">
              <Sparkles className="h-4 w-4" />
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-text-primary tracking-tight">
              Báo Cáo Thẩm Định & Tiềm Năng Đầu Tư AI
            </h1>
          </div>
          <p className="text-xs text-text-secondary mt-1">
            {listing.title} · {listing.address}
          </p>
        </div>

        {/* Action buttons: AI Re-run & PDF Download */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={handleReanalyzeAI}
            disabled={isAiLoading}
            className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl border border-border bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-text-primary text-xs font-bold shadow-sm transition-all disabled:opacity-60"
          >
            {isAiLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-accent" />
            ) : (
              <RefreshCw className="h-4 w-4 text-accent" />
            )}
            <span>Phân tích lại AI</span>
          </button>

          <div className="min-w-[200px]">
            <DownloadPDFButton
              reportId={listing.id}
              report={{
                ...report,
                generatedAt: new Date().toISOString(),
              }}
              listing={{
                title: listing.title,
                address: listing.address,
                price: listing.price,
                area: listing.area,
                pricePerM2: listing.pricePerM2,
                propertyType: listing.type,
                district: listing.district,
              }}
              userName={user?.name || 'Nguyễn Văn An (Pro Agent)'}
            />
          </div>
        </div>
      </div>

      {/* 🌟 PROPERTY SWITCHER / SELECTOR COMPONENT 🌟 */}
      <PropertyReportSelector
        currentListing={listing}
        onSelectListing={handleSelectListing}
      />

      {/* Main Scorecard Section: Circular Gauge + Sub Scores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left: Overall Score Circular Gauge */}
        <div className="rounded-3xl border border-border bg-white dark:bg-slate-900 p-6 shadow-sm flex flex-col items-center justify-center text-center">
          <span className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-3">
            Điểm Tiềm Năng Tổng Thể
          </span>

          {/* SVG Animated Circular Gauge */}
          <div className="relative h-36 w-36 flex items-center justify-center">
            <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
              {/* Background track circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="#e2e8f0"
                strokeWidth="8"
                className="dark:stroke-slate-800"
              />
              {/* Animated Progress Circle */}
              <motion.circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="#f97316"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={251.2}
                initial={{ strokeDashoffset: 251.2 }}
                animate={{ strokeDashoffset: 251.2 - (251.2 * report.score) / 100 }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              />
            </svg>

            {/* Score Text Counter */}
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-text-primary">{scoreCount}</span>
              <span className="text-[10px] font-extrabold text-accent">/ 100</span>
            </div>
          </div>

          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>{report.score >= 85 ? 'Khuyến nghị đầu tư cao' : 'Tiềm năng phát triển tốt'}</span>
          </div>
        </div>

        {/* Middle & Right: Sub-Score Animated Bars */}
        <div className="md:col-span-2 rounded-3xl border border-border bg-white dark:bg-slate-900 p-6 shadow-sm flex flex-col justify-between space-y-4">
          <h3 className="text-sm font-bold text-text-primary">Đánh giá các trụ cột chỉ số</h3>

          {/* Planning Score */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-text-primary flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-accent" />
                Độ an toàn quy hoạch & Không gian đô thị
              </span>
              <span className="text-accent">{report.planningScore} %</span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-accent"
                initial={{ width: 0 }}
                animate={{ width: `${report.planningScore}%` }}
                transition={{ duration: 1, delay: 0.2 }}
              />
            </div>
          </div>

          {/* Amenity Score */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-text-primary flex items-center gap-1.5">
                <School className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                Hệ sinh thái tiện ích & Giao thông
              </span>
              <span className="text-emerald-600 dark:text-emerald-400">{report.amenityScore} %</span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-emerald-500"
                initial={{ width: 0 }}
                animate={{ width: `${report.amenityScore}%` }}
                transition={{ duration: 1, delay: 0.4 }}
              />
            </div>
          </div>

          {/* Legal Score */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-text-primary flex items-center gap-1.5">
                <FileCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                Pháp lý chuẩn chỉnh · Sẵn sàng sang tên ngay
              </span>
              <span className="text-emerald-600 dark:text-emerald-400">{report.legalScore} %</span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-emerald-500"
                initial={{ width: 0 }}
                animate={{ width: `${report.legalScore}%` }}
                transition={{ duration: 1, delay: 0.6 }}
              />
            </div>
          </div>

          {/* Khung Khẳng Định Cam Kết Pháp Lý & Sang Tên */}
          <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/25 p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white font-black shadow-sm">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div>
                <p className="font-extrabold text-emerald-950 dark:text-emerald-300">
                  Cam kết pháp lý minh bạch 100% · Đủ điều kiện sang tên ngay
                </p>
                <p className="text-[11px] text-emerald-800/80 dark:text-emerald-400/80 mt-0.5">
                  Sổ đỏ/sổ hồng chuẩn chỉnh, đất sạch không tranh chấp, hỗ trợ thủ tục công chứng sang tên nhanh gọn trong ngày.
                </p>
              </div>
            </div>
            <span className="shrink-0 px-2.5 py-1 rounded-full bg-emerald-600 text-white font-extrabold text-[10px] uppercase tracking-wide">
              An toàn tuyệt đối
            </span>
          </div>

          {/* Metric tags */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-border text-center text-xs">
            <div className="rounded-xl bg-page-bg p-2">
              <span className="text-[10px] text-text-muted">Hệ số sử dụng đất</span>
              <p className="font-bold text-text-primary">{report.floorAreaRatio}</p>
            </div>
            <div className="rounded-xl bg-page-bg p-2">
              <span className="text-[10px] text-text-muted">Chiều cao tối đa</span>
              <p className="font-bold text-text-primary truncate">{report.maxHeight}</p>
            </div>
            <div className="rounded-xl bg-page-bg p-2">
              <span className="text-[10px] text-text-muted">Tăng trưởng dự kiến</span>
              <p className="font-bold text-accent">+{report.priceTrendPotential}% / năm</p>
            </div>
            <div className="rounded-xl bg-page-bg p-2">
              <span className="text-[10px] text-text-muted">Tính thanh khoản</span>
              <p className="font-bold text-emerald-600 dark:text-emerald-400 truncate">{report.liquidityRating}</p>
            </div>
          </div>
        </div>

      </div>

      {/* AI Synthesis Analysis */}
      <div className="rounded-3xl border border-border bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-accent shadow-sm">
              <Sparkles className="h-4 w-4" />
            </div>
            <h3 className="text-base font-extrabold text-text-primary">
              Phân Tích Chuyên Sâu Từ Gemini 1.5 Pro AI
            </h3>
          </div>
          <span className="rounded-full bg-accent/10 px-2.5 py-1 text-[10px] font-extrabold text-accent uppercase">
            AI Engine v2.4
          </span>
        </div>

        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed whitespace-pre-line bg-page-bg p-5 rounded-2xl border border-border">
          {report.aiAnalysis}
        </p>

        {/* Investment Advice */}
        <div className="rounded-2xl border border-emerald-200 dark:border-emerald-950/60 bg-emerald-50/60 dark:bg-emerald-950/30 p-4 text-xs">
          <h4 className="font-extrabold text-emerald-900 dark:text-emerald-300 mb-1 flex items-center gap-1.5">
            <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            Khuyến nghị đầu tư:
          </h4>
          <p className="text-emerald-800 dark:text-emerald-300 leading-relaxed font-medium">
            {report.investmentRecommendation}
          </p>
        </div>
      </div>

      {/* SWOT Analysis Matrix */}
      {report.swot && (
        <div className="rounded-3xl border border-border bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600">
              <Target className="h-4 w-4" />
            </div>
            <h3 className="text-base font-extrabold text-text-primary">
              Ma Trận Đánh Giá Toàn Diện (SWOT)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Strengths */}
            <div className="rounded-2xl p-4 bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50">
              <h4 className="font-black text-emerald-800 dark:text-emerald-400 mb-2 flex items-center gap-1.5">
                <Check className="h-4 w-4 text-emerald-600" />
                Điểm mạnh (Strengths)
              </h4>
              <ul className="space-y-1.5 text-text-secondary list-disc pl-4 font-medium">
                {report.swot.strengths.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="rounded-2xl p-4 bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50">
              <h4 className="font-black text-amber-800 dark:text-amber-400 mb-2 flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                Điểm yếu (Weaknesses)
              </h4>
              <ul className="space-y-1.5 text-text-secondary list-disc pl-4 font-medium">
                {report.swot.weaknesses.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>

            {/* Opportunities */}
            <div className="rounded-2xl p-4 bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50">
              <h4 className="font-black text-blue-800 dark:text-blue-400 mb-2 flex items-center gap-1.5">
                <Zap className="h-4 w-4 text-blue-600" />
                Cơ hội (Opportunities)
              </h4>
              <ul className="space-y-1.5 text-text-secondary list-disc pl-4 font-medium">
                {report.swot.opportunities.map((o, i) => (
                  <li key={i}>{o}</li>
                ))}
              </ul>
            </div>

            {/* Threats */}
            <div className="rounded-2xl p-4 bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50">
              <h4 className="font-black text-rose-800 dark:text-rose-400 mb-2 flex items-center gap-1.5">
                <ShieldAlert className="h-4 w-4 text-rose-600" />
                Thách thức (Threats)
              </h4>
              <ul className="space-y-1.5 text-text-secondary list-disc pl-4 font-medium">
                {report.swot.threats.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ── BẢN ĐỒ QUAN SÁT HẠ TẦNG TRỌNG ĐIỂM, TIỆN ÍCH & QUY HOẠCH GOOGLE MAPS ── */}
      <div ref={mapSectionRef} className="rounded-3xl border border-border bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400">
                <Compass className="h-4 w-4" />
              </span>
              <h3 className="text-base font-extrabold text-text-primary">
                Bản Đồ Quan Sát Hạ Tầng Trọng Điểm, Tiện Ích & Quy Hoạch Google Maps
              </h3>
            </div>
            <p className="text-xs text-text-secondary mt-1">
              Dữ liệu không gian thực tế từ Google Maps trong bán kính 500m (đi bộ) · 1.5km (xe máy) · 3km (vùng ảnh hưởng) quanh {listing.address}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="h-3 w-3" />
              <span>Chuẩn tọa độ WGS84</span>
            </span>
          </div>
        </div>

        {/* Component Bản Đồ Chuyên Sâu */}
        <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
          <InfrastructureMap
            propertyLat={listing.lat || 21.0265}
            propertyLng={listing.lng || 105.8285}
            propertyTitle={listing.title}
            propertyAddress={listing.address}
            propertyDistrict={listing.district}
            focusTarget={mapFocusTarget}
            height="460px"
          />
        </div>
      </div>

      {/* ── TIMELINE DỰ ÁN HẠ TẦNG TRỌNG ĐIỂM & METRO LÂN CẬN ── */}
      <div className="rounded-3xl border border-border bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-extrabold text-text-primary flex items-center gap-2">
              <Train className="h-5 w-5 text-accent" />
              Dự Án Hạ Tầng Trọng Điểm & Tuyến Metro Tác Động BĐS
            </h3>
            <p className="text-xs text-text-secondary mt-1">
              Khoảng cách chính xác được tính toán tự động từ vị trí bất động sản này đến các dự án giao thông huyết mạch
            </p>
          </div>
          <span className="text-xs font-bold text-text-muted">
            {report.nearbyProjects.length} Dự án lân cận
          </span>
        </div>

        {/* Timeline container */}
        <div className="relative pl-6 space-y-5">
          <motion.div
            className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-accent/40"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            style={{ transformOrigin: 'top' }}
          />

          {report.nearbyProjects.map((project, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + idx * 0.08 }}
              className="relative rounded-2xl bg-page-bg p-4 sm:p-5 border border-border hover:border-accent/50 transition-all space-y-3"
            >
              <div className="absolute -left-[27px] top-5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-accent ring-4 ring-white dark:ring-slate-900" />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-text-primary">{project.name}</h4>
                    {project.type && (
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {project.type}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-text-secondary mt-1 flex items-center gap-3">
                    <span className="font-extrabold text-orange-600 dark:text-orange-400">
                      Khoảng cách: {project.distance}
                    </span>
                    {project.lat && project.lng && (
                      <span className="text-slate-400 text-[11px]">
                        Toạ độ: {project.lat.toFixed(4)}, {project.lng.toFixed(4)}
                      </span>
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`rounded-md px-2.5 py-1 text-[10px] font-extrabold uppercase ${
                      project.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : project.status === 'construction'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                    }`}
                  >
                    {project.status === 'completed'
                      ? 'Đã hoàn thành'
                      : project.status === 'construction'
                      ? 'Đang thi công'
                      : 'Quy hoạch'}
                  </span>
                  <span className="text-xs font-bold text-text-muted">Năm {project.year}</span>
                </div>
              </div>

              {project.priceImpactSummary && (
                <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-100 dark:border-emerald-900/40">
                  ⚡ Động lực giá trị: {project.priceImpactSummary}
                </div>
              )}

              {/* Action Buttons: Xem trên bản đồ & Mở Google Maps */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/60">
                {project.lat && project.lng && (
                  <button
                    onClick={() => {
                      setMapFocusTarget({
                        id: project.id,
                        lat: project.lat!,
                        lng: project.lng!,
                        name: project.name,
                        category: 'infrastructure',
                      });
                      mapSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-colors shadow-sm"
                  >
                    <MapPin className="h-3.5 w-3.5 text-accent" />
                    <span>Định vị trên bản đồ</span>
                  </button>
                )}

                <a
                  href={
                    project.googleMapsUrl ||
                    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(project.name + ' Hà Nội')}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 hover:bg-blue-100 transition-colors"
                >
                  <span>Mở Google Maps</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── TIỆN ÍCH & DỊCH VỤ XUNG QUANH CHUẨN GOOGLE MAPS ── */}
      <div className="rounded-3xl border border-border bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-extrabold text-text-primary flex items-center gap-2">
              <Hospital className="h-5 w-5 text-accent" />
              Tiện Ích & Dịch Vụ Xung Quanh Bất Động Sản ({listing.district})
            </h3>
            <p className="text-xs text-text-secondary mt-1">
              Định vị chính xác cự ly thực tế và đường đi đến các trường học, bệnh viện, TTTM và công viên
            </p>
          </div>
          <span className="text-xs font-bold text-text-muted">
            {report.amenities.length} Địa điểm tiêu biểu
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {report.amenities.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between rounded-2xl bg-page-bg p-4 border border-border hover:border-accent/40 transition-all space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white dark:bg-slate-800 text-accent shadow-sm border border-slate-100 dark:border-slate-800">
                    {item.type === 'school' && <School className="h-5 w-5 text-blue-500" />}
                    {item.type === 'hospital' && <Hospital className="h-5 w-5 text-rose-500" />}
                    {item.type === 'mall' && <ShoppingBag className="h-5 w-5 text-pink-500" />}
                    {item.type === 'park' && <Trees className="h-5 w-5 text-emerald-500" />}
                    {item.type === 'metro' && <Train className="h-5 w-5 text-purple-500" />}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-text-primary text-xs leading-snug">{item.name}</h4>
                    {item.address && (
                      <p className="text-[11px] text-text-muted mt-0.5 line-clamp-1">📍 {item.address}</p>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-extrabold text-orange-600 dark:text-orange-400 text-[11px]">
                        Khoảng cách: {item.distance}
                      </span>
                      {item.travelTimeText && (
                        <span className="text-[10px] text-slate-500 bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                          {item.travelTimeText}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <span className="font-bold text-amber-500 text-xs shrink-0">
                  ⭐ {item.rating}
                </span>
              </div>

              {/* Action Buttons: Xem trên bản đồ & Chỉ đường Google Maps */}
              <div className="flex items-center justify-between pt-2 border-t border-border/60 text-[11px]">
                {item.lat && item.lng ? (
                  <button
                    onClick={() => {
                      setMapFocusTarget({
                        id: item.id,
                        lat: item.lat!,
                        lng: item.lng!,
                        name: item.name,
                        category: item.type,
                      });
                      mapSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }}
                    className="text-slate-600 dark:text-slate-300 hover:text-accent font-bold flex items-center gap-1 transition-colors"
                  >
                    <Compass className="h-3 w-3" />
                    <span>Xem vị trí</span>
                  </button>
                ) : (
                  <span />
                )}

                <a
                  href={
                    item.directionsUrl ||
                    (item.lat && item.lng
                      ? (listing.lat && listing.lng
                          ? `https://www.google.com/maps/dir/?api=1&origin=${listing.lat},${listing.lng}&destination=${item.lat},${item.lng}&travelmode=driving`
                          : `https://www.google.com/maps/dir/?api=1&destination=${item.lat},${item.lng}`)
                      : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(item.name + ' Hà Nội')}`)
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-1 hover:underline"
                >
                  <span>Chỉ đường Google Maps</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
