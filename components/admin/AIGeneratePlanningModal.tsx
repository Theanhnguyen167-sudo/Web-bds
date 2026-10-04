'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  X,
  MapPin,
  Layers,
  CheckCircle2,
  AlertCircle,
  Building,
  Check,
  Compass,
  ArrowRight,
  Database,
  ExternalLink,
  Cpu,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { PlanningZoneItem } from '@/lib/planning/planning-utils';
import { HANOI_DISTRICTS_LIST } from '@/lib/planning/planning-utils';
import { PLANNING_STANDARD_SYMBOLS } from '@/lib/planning/hanoi-planning-db';

interface AIGeneratePlanningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyZones: (zones: PlanningZoneItem[]) => void;
}

export const AIGeneratePlanningModal: React.FC<AIGeneratePlanningModalProps> = ({
  isOpen,
  onClose,
  onApplyZones,
}) => {
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Đống Đa');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [stepMessage, setStepMessage] = useState<string>('');
  const [generatedResult, setGeneratedResult] = useState<{
    district: string;
    subdivisionCode: string;
    legalBasis: string;
    planYear: number;
    source: string;
    zones: PlanningZoneItem[];
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedPreviewZoneIdx, setSelectedPreviewZoneIdx] = useState<number>(0);

  if (!isOpen) return null;

  const handleRunAI = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    setGeneratedResult(null);

    setStepMessage(`Đang quét cơ sở dữ liệu đồ án quy hoạch phân khu quận ${selectedDistrict}...`);

    try {
      // Giả lập hiệu ứng tiến trình thông minh
      const timer1 = setTimeout(() => {
        setStepMessage('Gemini 1.5 Pro đang bóc tách phân khu & ký hiệu chuẩn QCVN 01:2021/BXD (ODT, TMD, HH, CX, GT)...');
      }, 1200);

      const timer2 = setTimeout(() => {
        setStepMessage('Tính toán ma trận đa giác tọa độ WGS84 & kiểm soát tầng cao, mật độ...');
      }, 2500);

      const res = await fetch('/api/ai/district-planning-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          district: selectedDistrict,
          customRequirements: customPrompt,
        }),
      });

      clearTimeout(timer1);
      clearTimeout(timer2);

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json?.error?.message || 'Không thể tạo bản đồ phân khu bằng AI');
      }

      setGeneratedResult(json.data);
      setSelectedPreviewZoneIdx(0);
    } catch (err: any) {
      setErrorMessage(err.message || 'Lỗi kết nối khi AI phân tích quy hoạch.');
    } finally {
      setIsLoading(false);
      setStepMessage('');
    }
  };

  const handleSaveToMap = () => {
    if (!generatedResult || !generatedResult.zones.length) return;
    onApplyZones(generatedResult.zones);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-white rounded-3xl border border-slate-200/80 shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-purple-500/10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/30">
                <Sparkles className="h-5 w-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-extrabold text-slate-900">
                    AI Gemini Quét & Tự Động Số Hóa Bản Đồ Quy Hoạch
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-orange-100 text-orange-600 border border-orange-200">
                    Gemini 1.5 Pro
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tự động truy vấn đồ án quy hoạch phân khu theo quận, sinh đa giác WGS84 và ký hiệu màu sắc chuẩn Bộ Xây dựng
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              disabled={isLoading}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Input Selection Card */}
            <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200/70 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Chọn Quận / Huyện */}
                <div>
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-1.5">
                    <MapPin className="h-3.5 w-3.5 text-orange-500" />
                    Chọn Quận / Khu vực Hà Nội cần số hóa quy hoạch:
                  </label>
                  <select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    disabled={isLoading}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:border-orange-500 focus:outline-hidden shadow-2xs"
                  >
                    {HANOI_DISTRICTS_LIST.map((dist) => (
                      <option key={dist} value={dist}>
                        Quận {dist}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tùy chọn yêu cầu thêm */}
                <div>
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-1.5">
                    <Compass className="h-3.5 w-3.5 text-blue-500" />
                    Định hướng đặc thù (Tuỳ chọn cho AI):
                  </label>
                  <input
                    type="text"
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="VD: Tập trung phân khu quanh trục Vành đai 2.5 và ga metro..."
                    disabled={isLoading}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:border-orange-500 focus:outline-hidden shadow-2xs"
                  />
                </div>
              </div>

              {/* Standard symbols legend badge */}
              <div className="pt-2 border-t border-slate-200/60 flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold text-slate-500">Chuẩn ký hiệu:</span>
                {Object.values(PLANNING_STANDARD_SYMBOLS).slice(0, 7).map((sym) => (
                  <span
                    key={sym.code}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border border-slate-200 bg-white text-slate-700 shadow-3xs"
                  >
                    <span className="h-2 w-2 rounded-xs" style={{ backgroundColor: sym.color }} />
                    {sym.code}
                  </span>
                ))}
              </div>

              {/* Trigger Button */}
              <button
                onClick={handleRunAI}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-xs font-bold shadow-lg shadow-orange-500/25 transition-all cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>{stepMessage || 'AI đang phân tích đồ án...'}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>🚀 Kích hoạt AI Gemini Quét & Số Hóa Bản Đồ Quận {selectedDistrict}</span>
                  </>
                )}
              </button>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Results Display */}
            {generatedResult && (
              <div className="space-y-4">
                {/* Result Summary Bar */}
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      <h4 className="text-xs font-black text-emerald-900">
                        Đã bóc tách thành công {generatedResult.zones.length} phân khu chức năng cho Quận {generatedResult.district}
                      </h4>
                    </div>
                    <p className="text-[11px] text-emerald-700 mt-0.5">
                      Căn cứ: <span className="font-semibold">{generatedResult.legalBasis}</span> (Phân khu: {generatedResult.subdivisionCode})
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white text-emerald-700 border border-emerald-200 shadow-3xs shrink-0">
                    {generatedResult.source === 'gemini-1.5-pro' ? '🤖 Gemini 1.5 Pro' : '🏛️ GIS Planner Engine'}
                  </span>
                </div>

                {/* Zones Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {generatedResult.zones.map((zone, idx) => {
                    const isSelected = selectedPreviewZoneIdx === idx;
                    return (
                      <div
                        key={zone.id || idx}
                        onClick={() => setSelectedPreviewZoneIdx(idx)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-orange-50/50 border-orange-500 ring-2 ring-orange-500/20 shadow-md'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span
                              className="h-3.5 w-3.5 rounded-md shrink-0 shadow-xs"
                              style={{ backgroundColor: zone.color }}
                            />
                            <span className="font-mono text-[11px] font-black px-1.5 py-0.5 rounded bg-slate-100 text-slate-800">
                              {zone.code}
                            </span>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                            {zone.areaHa} ha
                          </span>
                        </div>

                        <h5 className="text-xs font-extrabold text-slate-900 mt-2 line-clamp-1">
                          {zone.name}
                        </h5>

                        <div className="grid grid-cols-3 gap-1.5 mt-2.5 pt-2 border-t border-slate-100 text-[10px] text-slate-600">
                          <div>
                            <span className="text-slate-400 block">Tầng cao:</span>
                            <span className="font-bold text-slate-800">{zone.maxFloors} tầng</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block">Mật độ:</span>
                            <span className="font-bold text-slate-800">{zone.density}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block">Hệ số FAR:</span>
                            <span className="font-bold text-slate-800">{zone.floorAreaRatio || 3.5}</span>
                          </div>
                        </div>

                        <div className="mt-2 text-[10px] text-slate-500 line-clamp-1 italic">
                          {zone.coordinates.length} điểm WGS84 khép kín
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/60">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-xs font-bold text-slate-700 transition-colors"
            >
              Đóng
            </button>

            {generatedResult && (
              <button
                onClick={handleSaveToMap}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-extrabold shadow-md shadow-orange-500/25 transition-all cursor-pointer"
              >
                <Check className="h-4 w-4" />
                <span>Lưu & Xuất Bản Lên Supabase + Bản Đồ ({generatedResult.zones.length} phân khu)</span>
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
