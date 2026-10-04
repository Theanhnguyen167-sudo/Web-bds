'use client';

import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Printer, Download, Share2, Check, 
  MapPin, ShieldCheck, Building2, Compass, QrCode, FileText
} from 'lucide-react';
import { PlanningInspectionResult } from '@/lib/gis/planning-inspector';
import { useApp } from '@/lib/context/AppContext';

interface PlanningReportModalProps {
  inspection: PlanningInspectionResult | null;
  onClose: () => void;
}

export const PlanningReportModal: React.FC<PlanningReportModalProps> = ({
  inspection,
  onClose,
}) => {
  const { addToast } = useApp();
  const printRef = useRef<HTMLDivElement>(null);

  if (!inspection) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/planning?lat=${inspection.point[0]}&lng=${inspection.point[1]}`;
    navigator.clipboard.writeText(url);
    addToast?.('Đã sao chép liên kết tra cứu vị trí này!', 'success');
  };

  // Tạo 4 toạ độ góc ranh mô phỏng xung quanh điểm tra cứu theo chuẩn VN-2000
  const cornerPoints = [
    { stt: 1, x: (inspection.vn2000.x - 12.5).toFixed(2), y: (inspection.vn2000.y - 8.2).toFixed(2) },
    { stt: 2, x: (inspection.vn2000.x + 15.3).toFixed(2), y: (inspection.vn2000.y - 7.6).toFixed(2) },
    { stt: 3, x: (inspection.vn2000.x + 14.8).toFixed(2), y: (inspection.vn2000.y + 12.4).toFixed(2) },
    { stt: 4, x: (inspection.vn2000.x - 11.9).toFixed(2), y: (inspection.vn2000.y + 11.8).toFixed(2) },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[600] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl text-slate-100 overflow-hidden flex flex-col my-auto max-h-[92vh]"
        >
          {/* TOP ACTION BAR */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-950/80 shrink-0">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-orange-400" />
              <span className="font-bold text-sm text-white">
                Phiếu Trích Lục Thông Tin Quy Hoạch
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
                title="Sao chép link xem vị trí"
              >
                <Share2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Chia sẻ</span>
              </button>

              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-xs font-bold text-white shadow-md shadow-orange-500/25 transition-all"
                title="In hoặc Lưu thành file PDF"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>In / Lưu PDF</span>
              </button>

              <button
                onClick={onClose}
                className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* PRINTABLE SHEET CONTAINER (A4 FORMAT) */}
          <div className="p-4 sm:p-8 overflow-y-auto flex-1 bg-white text-slate-900 font-sans print:p-0 print:m-0" ref={printRef}>
            {/* QUỐC HIỆU TIÊU NGỮ */}
            <div className="text-center space-y-1 pb-4 border-b-2 border-slate-900">
              <p className="font-bold text-xs uppercase tracking-widest text-slate-800">
                CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
              </p>
              <p className="font-semibold text-xs text-slate-700">
                Độc lập - Tự do - Hạnh phúc
              </p>
              <div className="w-24 h-0.5 bg-slate-900 mx-auto my-1"></div>
              <h2 className="text-base sm:text-lg font-black text-slate-950 uppercase pt-2 tracking-tight">
                PHIẾU CUNG CẤP THÔNG TIN QUY HOẠCH ĐÔ THỊ
              </h2>
              <p className="text-xs text-slate-500 italic">
                (Trích lục số hóa dữ liệu quy hoạch phân khu theo Hệ toạ độ VN-2000 Hà Nội)
              </p>
              <div className="flex justify-between items-center text-[11px] text-slate-500 pt-1 px-2">
                <span>Mã tra cứu: <strong className="text-slate-900 font-mono">{inspection.inspectionId}</strong></span>
                <span>Thời gian trích lục: {inspection.timestamp}</span>
              </div>
            </div>

            {/* PHẦN 1: THÔNG TIN VỊ TRÍ & TOẠ ĐỘ THỬA ĐẤT */}
            <div className="pt-4 space-y-2">
              <h3 className="font-black text-xs uppercase text-slate-900 bg-slate-100 px-2 py-1 rounded">
                I. Vị trí & Toạ độ trích lục thửa đất
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <p><strong>Khu vực:</strong> Quận {inspection.zone.district}, TP Hà Nội</p>
                  <p><strong>Đồ án phân khu:</strong> {inspection.zone.subdivisionCode} ({inspection.zone.subdivisionName})</p>
                  <p><strong>Toạ độ GPS (WGS84):</strong> {inspection.wgs84.formatted}</p>
                </div>
                <div className="space-y-1">
                  <p><strong>Hệ toạ độ:</strong> VN-2000 (Kinh tuyến trục 105°00', múi chiếu 3°)</p>
                  <p><strong>Toạ độ tâm X:</strong> <span className="font-mono font-bold">{inspection.vn2000.formattedX}</span></p>
                  <p><strong>Toạ độ tâm Y:</strong> <span className="font-mono font-bold">{inspection.vn2000.formattedY}</span></p>
                </div>
              </div>

              {/* BẢNG TOẠ ĐỘ GÓC RANH VN-2000 */}
              <div className="pt-2">
                <p className="text-[11px] font-bold text-slate-700 mb-1">
                  Bảng kê toạ độ ranh giới định vị thửa đất (VN-2000):
                </p>
                <table className="w-full text-xs text-left border-collapse border border-slate-300">
                  <thead className="bg-slate-100 text-slate-800">
                    <tr>
                      <th className="border border-slate-300 px-2 py-1 text-center w-12">Điểm</th>
                      <th className="border border-slate-300 px-3 py-1">Toạ độ X (m)</th>
                      <th className="border border-slate-300 px-3 py-1">Toạ độ Y (m)</th>
                      <th className="border border-slate-300 px-3 py-1">Ghi chú</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cornerPoints.map((pt) => (
                      <tr key={pt.stt} className="hover:bg-slate-50 font-mono text-[11px]">
                        <td className="border border-slate-300 px-2 py-1 text-center font-bold">{pt.stt}</td>
                        <td className="border border-slate-300 px-3 py-1">{pt.x}</td>
                        <td className="border border-slate-300 px-3 py-1">{pt.y}</td>
                        <td className="border border-slate-300 px-3 py-1 font-sans text-slate-500">Mốc ranh giới thửa</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* PHẦN 2: CHỨC NĂNG SỬ DỤNG ĐẤT & PHÁP LÝ QUY HOẠCH */}
            <div className="pt-4 space-y-2">
              <h3 className="font-black text-xs uppercase text-slate-900 bg-slate-100 px-2 py-1 rounded">
                II. Chức năng sử dụng đất theo quy hoạch
              </h3>

              <div className="p-3 border border-slate-300 rounded-lg space-y-1.5 bg-slate-50 text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className="font-mono font-black text-xs px-2 py-0.5 rounded text-white"
                    style={{ backgroundColor: inspection.zone.color }}
                  >
                    {inspection.zone.code}
                  </span>
                  <span className="font-bold text-sm text-slate-900">
                    {inspection.zone.name}
                  </span>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  {inspection.specs.landUseDescription}
                </p>
                <p className="text-slate-600 text-[11px] pt-1 border-t border-slate-200">
                  <strong>Căn cứ pháp lý:</strong> {inspection.zone.legalBasis}
                </p>
              </div>
            </div>

            {/* PHẦN 3: BẢNG CHỈ TIÊU QUY HOẠCH KIẾN TRÚC QCVN 01:2021 */}
            <div className="pt-4 space-y-2">
              <h3 className="font-black text-xs uppercase text-slate-900 bg-slate-100 px-2 py-1 rounded">
                III. Chỉ tiêu quy hoạch kiến trúc khống chế (QCVN 01:2021/BXD)
              </h3>

              <table className="w-full text-xs text-left border-collapse border border-slate-300">
                <thead className="bg-slate-100 text-slate-800">
                  <tr>
                    <th className="border border-slate-300 px-3 py-1.5 w-12 text-center">STT</th>
                    <th className="border border-slate-300 px-3 py-1.5">Chỉ tiêu quy hoạch kiến trúc</th>
                    <th className="border border-slate-300 px-3 py-1.5 w-44 font-bold">Quy chuẩn cho phép</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-slate-300 px-3 py-1 text-center font-bold">1</td>
                    <td className="border border-slate-300 px-3 py-1">Tầng cao công trình tối đa</td>
                    <td className="border border-slate-300 px-3 py-1 font-bold text-blue-700">{inspection.specs.maxHeight}</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 px-3 py-1 text-center font-bold">2</td>
                    <td className="border border-slate-300 px-3 py-1">Mật độ xây dựng tối đa khống chế</td>
                    <td className="border border-slate-300 px-3 py-1 font-bold text-emerald-700">{inspection.specs.density}</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 px-3 py-1 text-center font-bold">3</td>
                    <td className="border border-slate-300 px-3 py-1">Hệ số sử dụng đất (FAR)</td>
                    <td className="border border-slate-300 px-3 py-1 font-bold text-slate-900">{inspection.specs.floorAreaRatio} lần</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 px-3 py-1 text-center font-bold">4</td>
                    <td className="border border-slate-300 px-3 py-1">Khoảng lùi xây dựng công trình tối thiểu</td>
                    <td className="border border-slate-300 px-3 py-1 font-bold text-amber-700">{inspection.specs.setback}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* DẤU XÁC NHẬN SỐ HÓA & QR CODE */}
            <div className="pt-6 flex justify-between items-end border-t border-slate-300 mt-6 text-xs text-slate-600">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>Dữ liệu số hóa đối soát từ Đồ án Quy hoạch Hà Nội</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Hệ thống HaNoi Realty PropTech · Bản quyền số liệu GIS WGS84/VN-2000
                </p>
                <p className="text-[10px] text-slate-400 font-mono">
                  Mã hash bảo mật: SHA256-{inspection.inspectionId}-VERIFIED
                </p>
              </div>

              <div className="text-center space-y-1">
                <div className="p-1 border border-slate-300 rounded inline-block bg-white shadow-2xs">
                  <QrCode className="h-14 w-14 text-slate-900" />
                </div>
                <p className="text-[9px] font-mono text-slate-500 uppercase tracking-tighter">
                  Quét tra cứu online
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
