'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, MapPin, Compass, ShieldCheck, Building2, 
  Ruler, Copy, Check, ExternalLink, FileText, 
  ArrowRight, Search, Sparkles, Layers, Share2
} from 'lucide-react';
import { PlanningInspectionResult } from '@/lib/gis/planning-inspector';
import { useApp } from '@/lib/context/AppContext';

interface PlanningInspectorDrawerProps {
  inspection: PlanningInspectionResult | null;
  onClose: () => void;
  onOpenReport?: (inspection: PlanningInspectionResult) => void;
}

export const PlanningInspectorDrawer: React.FC<PlanningInspectorDrawerProps> = ({
  inspection,
  onClose,
  onOpenReport,
}) => {
  const { addToast } = useApp();
  const [copiedCoords, setCopiedCoords] = useState(false);

  if (!inspection) return null;

  const handleCopyCoordinates = () => {
    const textToCopy = `Toạ độ VN-2000 (Hà Nội trục 105°00'): X=${inspection.vn2000.formattedX}, Y=${inspection.vn2000.formattedY}\nToạ độ WGS-84: ${inspection.wgs84.formatted} (${inspection.wgs84.dmsLat}, ${inspection.wgs84.dmsLng})\nPhân khu: ${inspection.zone.name} (${inspection.zone.code})`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedCoords(true);
    addToast?.('Đã sao chép toạ độ VN-2000 & WGS-84 vào bộ nhớ tạm!', 'success');
    setTimeout(() => setCopiedCoords(false), 2500);
  };

  return (
    <AnimatePresence>
      <motion.div
        key="planning-inspector-drawer"
        initial={{ opacity: 0, x: 380 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 380 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        className="absolute top-4 right-4 z-[470] w-[360px] max-w-[calc(100vw-32px)] max-h-[calc(100vh-100px)] 
                   flex flex-col bg-slate-950/95 backdrop-blur-xl border border-slate-700/80 
                   rounded-2xl shadow-2xl text-slate-100 overflow-hidden"
        style={{ borderTop: `4px solid ${inspection.zone.color}` }}
      >
        {/* HEADER */}
        <div className="flex items-start justify-between p-4 border-b border-slate-800 bg-slate-900/60">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-orange-500/20 text-orange-400 border border-orange-500/30">
                <MapPin className="h-3 w-3" /> Tra cứu vị trí
              </span>
              <span className="font-mono text-[10px] text-slate-400 bg-slate-800/80 px-1.5 py-0.5 rounded">
                #{inspection.inspectionId}
              </span>
            </div>
            <h3 className="font-bold text-sm text-white leading-snug">
              Chứng Thư Thông Tin Quy Hoạch
            </h3>
            <p className="text-[10px] text-slate-400">
              {inspection.timestamp}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Đóng bảng tra cứu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* BODY SCROLLABLE */}
        <div className="p-4 space-y-4 overflow-y-auto flex-1 text-xs">
          {/* TOẠ ĐỘ KÉP: VN-2000 & WGS-84 */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-[11px] font-extrabold text-amber-400 uppercase tracking-wider">
                <Compass className="h-3.5 w-3.5" />
                <span>Toạ độ trích lục thửa đất</span>
              </div>
              <button
                onClick={handleCopyCoordinates}
                className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-slate-300 hover:text-white transition-colors"
                title="Sao chép toạ độ"
              >
                {copiedCoords ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                <span>{copiedCoords ? 'Đã chép' : 'Sao chép'}</span>
              </button>
            </div>

            {/* VN-2000 */}
            <div className="bg-slate-950/70 p-2 rounded-lg border border-slate-800/80 space-y-1">
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-slate-400 font-semibold">Hệ toạ độ Quốc gia VN-2000:</span>
                <span className="text-amber-400 font-mono font-bold">Trục {inspection.vn2000.centralMeridian}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 font-mono text-[11px] font-bold text-slate-200">
                <div>X: <span className="text-white">{inspection.vn2000.formattedX}</span></div>
                <div>Y: <span className="text-white">{inspection.vn2000.formattedY}</span></div>
              </div>
            </div>

            {/* WGS-84 */}
            <div className="text-[10px] text-slate-400 flex justify-between pt-0.5">
              <span>WGS-84 (GPS):</span>
              <span className="font-mono text-slate-300 font-semibold">{inspection.wgs84.dmsLat}, {inspection.wgs84.dmsLng}</span>
            </div>
          </div>

          {/* CHỨC NĂNG SỬ DỤNG ĐẤT */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Chức năng sử dụng đất
              </span>
              <span
                className="font-mono font-black text-xs px-2 py-0.5 rounded text-white shadow-xs"
                style={{ backgroundColor: inspection.zone.color }}
              >
                {inspection.zone.code}
              </span>
            </div>

            <div className="p-3 rounded-xl border border-slate-800 bg-slate-900/60 space-y-1.5">
              <h4 className="font-bold text-sm text-white leading-snug">
                {inspection.zone.name}
              </h4>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {inspection.specs.landUseDescription}
              </p>
              <div className="pt-1.5 flex items-center justify-between text-[11px] border-t border-slate-800/80">
                <span className="text-slate-400">Quận/Huyện:</span>
                <span className="font-bold text-white">{inspection.zone.district}</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Đồ án phân khu:</span>
                <span className="font-semibold text-amber-400">{inspection.zone.subdivisionCode} ({inspection.zone.subdivisionName})</span>
              </div>
            </div>
          </div>

          {/* CHỈ TIÊU QUY HOẠCH KIẾN TRÚC QCVN 01:2021 */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 text-blue-400" />
              Chỉ tiêu quy hoạch kiến trúc (QCVN 01:2021)
            </span>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-900/70 p-2.5 rounded-xl border border-slate-800">
                <p className="text-[10px] text-slate-400 mb-0.5">Tầng cao khống chế</p>
                <p className="font-bold text-xs text-white leading-snug">
                  {inspection.specs.maxHeight}
                </p>
              </div>

              <div className="bg-slate-900/70 p-2.5 rounded-xl border border-slate-800">
                <p className="text-[10px] text-slate-400 mb-0.5">Mật độ xây dựng</p>
                <p className="font-bold text-xs text-emerald-400 leading-snug">
                  {inspection.specs.density}
                </p>
              </div>

              <div className="bg-slate-900/70 p-2.5 rounded-xl border border-slate-800">
                <p className="text-[10px] text-slate-400 mb-0.5">Hệ số SDĐ (FAR)</p>
                <p className="font-bold text-xs text-white leading-snug">
                  {inspection.specs.floorAreaRatio}x
                </p>
              </div>

              <div className="bg-slate-900/70 p-2.5 rounded-xl border border-slate-800">
                <p className="text-[10px] text-slate-400 mb-0.5">Khoảng lùi tối thiểu</p>
                <p className="font-bold text-xs text-amber-300 leading-snug">
                  {inspection.specs.setback}
                </p>
              </div>
            </div>
          </div>

          {/* CĂN CỨ PHÁP LÝ & GHI CHÚ */}
          <div className="p-2.5 rounded-xl bg-slate-900/50 border border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[11px]">
              <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
              <span>Căn cứ pháp lý phê duyệt</span>
            </div>
            <p className="text-[10px] text-slate-300 leading-relaxed pl-5">
              {inspection.zone.legalBasis}
            </p>
            <p className="text-[10px] text-slate-400 italic pt-1 pl-5">
              ℹ️ {inspection.specs.planningNote}
            </p>
          </div>
        </div>

        {/* ACTIONS FOOTER */}
        <div className="p-3.5 border-t border-slate-800 bg-slate-900/80 space-y-2">
          {/* Nút Xem Phiếu Báo Cáo Quy Hoạch */}
          <button
            onClick={() => onOpenReport?.(inspection)}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl 
                       bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 
                       text-white text-xs font-bold shadow-lg shadow-orange-500/25 transition-all"
          >
            <FileText className="h-4 w-4" />
            <span>Xuất Phiếu Tra Cứu Quy Hoạch PDF</span>
          </button>

          {/* Tìm BĐS xung quanh */}
          <a
            href={`/search?district=${encodeURIComponent(inspection.zone.district)}`}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl 
                       bg-slate-800 hover:bg-slate-700 border border-slate-700 
                       text-slate-200 text-xs font-semibold transition-colors"
          >
            <Search className="h-3.5 w-3.5 text-orange-400" />
            <span>Tìm BĐS bán trong phạm vi {inspection.zone.district}</span>
          </a>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
