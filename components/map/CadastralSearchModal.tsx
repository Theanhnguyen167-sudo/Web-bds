'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Search, Compass, FileText, MapPin, 
  Sparkles, CheckCircle2, ChevronRight, Hash, Layers
} from 'lucide-react';
import { 
  HANOI_ADMINISTRATIVE_WARDS, 
  SAMPLE_CADASTRAL_PLOTS, 
  findCadastralParcel, 
  locateFromVn2000,
  CadastralParcelResult 
} from '@/lib/gis/cadastral-db';
import { useApp } from '@/lib/context/AppContext';

interface CadastralSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLocateParcel: (parcel: CadastralParcelResult) => void;
}

export const CadastralSearchModal: React.FC<CadastralSearchModalProps> = ({
  isOpen,
  onClose,
  onLocateParcel,
}) => {
  const { addToast } = useApp();
  const [activeTab, setActiveTab] = useState<'sheet_parcel' | 'vn2000'>('sheet_parcel');

  // Form Tab 1: Số tờ / Số thửa
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Cầu Giấy');
  const [selectedWard, setSelectedWard] = useState<string>('Phường Dịch Vọng Hậu');
  const [sheetNo, setSheetNo] = useState<string>('12');
  const [parcelNo, setParcelNo] = useState<string>('48');

  // Form Tab 2: Toạ độ VN-2000
  const [coordX, setCoordX] = useState<string>('2325850.50');
  const [coordY, setCoordY] = useState<string>('581230.20');

  if (!isOpen) return null;

  const currentWards = HANOI_ADMINISTRATIVE_WARDS[selectedDistrict] || [];

  const handleDistrictChange = (district: string) => {
    setSelectedDistrict(district);
    const wards = HANOI_ADMINISTRATIVE_WARDS[district] || [];
    if (wards.length > 0) {
      setSelectedWard(wards[0].name);
    }
  };

  const handleSelectSample = (sample: CadastralParcelResult) => {
    setSelectedDistrict(sample.district);
    setSelectedWard(sample.ward);
    setSheetNo(sample.sheetNo.toString());
    setParcelNo(sample.parcelNo.toString());
    setCoordX(sample.vn2000Center.x.toString());
    setCoordY(sample.vn2000Center.y.toString());
  };

  const handleSubmitSheetParcel = (e: React.FormEvent) => {
    e.preventDefault();
    const sheetNum = parseInt(sheetNo, 10);
    const parcelNum = parseInt(parcelNo, 10);

    if (isNaN(sheetNum) || isNaN(parcelNum) || sheetNum <= 0 || parcelNum <= 0) {
      addToast?.('Vui lòng nhập Số tờ và Số thửa hợp lệ (> 0)', 'warning');
      return;
    }

    const parcelResult = findCadastralParcel(selectedDistrict, selectedWard, sheetNum, parcelNum);
    onLocateParcel(parcelResult);
    addToast?.(`Đã định vị Thửa số ${parcelNum}, Tờ ${sheetNum} (${selectedWard})`, 'success');
    onClose();
  };

  const handleSubmitVn2000 = (e: React.FormEvent) => {
    e.preventDefault();
    const xNum = parseFloat(coordX.replace(/,/g, '.').replace(/\s/g, ''));
    const yNum = parseFloat(coordY.replace(/,/g, '.').replace(/\s/g, ''));

    if (isNaN(xNum) || isNaN(yNum)) {
      addToast?.('Toạ độ X và Y phải là số hợp lệ', 'warning');
      return;
    }

    // Validate khoảng toạ độ Hà Nội
    if (xNum < 2200000 || xNum > 2400000 || yNum < 500000 || yNum > 650000) {
      addToast?.('Toạ độ VN-2000 ngoài phạm vi Hà Nội (X ~ 2.300.000m, Y ~ 580.000m)', 'warning');
      return;
    }

    const located = locateFromVn2000(xNum, yNum);
    const parcelResult: CadastralParcelResult = {
      id: `vn2000_${xNum}_${yNum}`,
      district: 'Hà Nội',
      ward: 'Toạ độ đo đạc thực tế',
      sheetNo: 1,
      parcelNo: 1,
      areaM2: 100,
      centerPoint: located.centerPoint,
      vn2000Center: located.vn2000,
      boundaryCoordinates: located.boundaryCoordinates,
      addressText: `Vị trí toạ độ VN-2000 (X: ${located.vn2000.formattedX}, Y: ${located.vn2000.formattedY})`,
      isPresetSample: false,
    };

    onLocateParcel(parcelResult);
    addToast?.(`Đã định vị thành công toạ độ VN-2000!`, 'success');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[650] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', stiffness: 320, damping: 26 }}
          className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl text-slate-100 overflow-hidden flex flex-col my-auto"
        >
          {/* HEADER */}
          <div className="flex items-start justify-between p-5 border-b border-slate-800 bg-slate-950/80">
            <div>
              <div className="flex items-center gap-1.5 text-orange-400 font-extrabold text-xs uppercase tracking-wider mb-1">
                <Compass className="h-4 w-4" />
                <span>Tra cứu quy hoạch theo Sổ đỏ</span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white leading-snug">
                Định Vị Thửa Đất & Toạ Độ VN-2000
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Nhập số tờ, số thửa hoặc toạ độ trắc địa ghi trên Giấy chứng nhận QSDĐ
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* TABS SELECTOR */}
          <div className="p-4 border-b border-slate-800 bg-slate-900/60 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('sheet_parcel')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all border ${
                activeTab === 'sheet_parcel'
                  ? 'bg-orange-500 text-white border-orange-400 shadow-md shadow-orange-500/25'
                  : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:text-white hover:bg-slate-800'
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>Số Tờ, Số Thửa (Sổ đỏ)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('vn2000')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all border ${
                activeTab === 'vn2000'
                  ? 'bg-orange-500 text-white border-orange-400 shadow-md shadow-orange-500/25'
                  : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Hash className="h-4 w-4" />
              <span>Toạ độ VN-2000 (X, Y)</span>
            </button>
          </div>

          {/* TAB 1: SỐ TỜ / SỐ THỬA FORM */}
          {activeTab === 'sheet_parcel' && (
            <form onSubmit={handleSubmitSheetParcel} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Quận/Huyện */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300">Quận / Huyện:</label>
                  <select
                    value={selectedDistrict}
                    onChange={(e) => handleDistrictChange(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-orange-500"
                  >
                    {Object.keys(HANOI_ADMINISTRATIVE_WARDS).map((dist) => (
                      <option key={dist} value={dist}>
                        {dist}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Phường/Xã */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300">Phường / Xã:</label>
                  <select
                    value={selectedWard}
                    onChange={(e) => setSelectedWard(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-orange-500"
                  >
                    {currentWards.map((w) => (
                      <option key={w.id} value={w.name}>
                        {w.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Số tờ bản đồ */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300">Số tờ bản đồ:</label>
                  <input
                    type="number"
                    min="1"
                    value={sheetNo}
                    onChange={(e) => setSheetNo(e.target.value)}
                    placeholder="VD: 12"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>

                {/* Số thửa đất */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300">Số thửa đất:</label>
                  <input
                    type="number"
                    min="1"
                    value={parcelNo}
                    onChange={(e) => setParcelNo(e.target.value)}
                    placeholder="VD: 48"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>
              </div>

              {/* SAMPLES 1-CLICK */}
              <div className="space-y-1.5 pt-2">
                <span className="text-[11px] font-bold text-slate-400">
                  Hoặc thử ngay các mẫu Sổ đỏ Hà Nội thực tế:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {SAMPLE_CADASTRAL_PLOTS.map((sample) => (
                    <button
                      key={sample.id}
                      type="button"
                      onClick={() => handleSelectSample(sample)}
                      className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-orange-500/60 text-left transition-all group"
                    >
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-200 group-hover:text-orange-400">
                        <span>Thửa {sample.parcelNo}, Tờ {sample.sheetNo}</span>
                        <ChevronRight className="h-3 w-3 opacity-60" />
                      </div>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">
                        {sample.ward} ({sample.district})
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl 
                           bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 
                           text-white font-bold text-xs shadow-lg shadow-orange-500/25 transition-all mt-2"
              >
                <Search className="h-4 w-4" />
                <span>Tìm Vị Trí Thửa Đất & Tra Cứu Quy Hoạch</span>
              </button>
            </form>
          )}

          {/* TAB 2: TOẠ ĐỘ TRẮC ĐỊA VN-2000 FORM */}
          {activeTab === 'vn2000' && (
            <form onSubmit={handleSubmitVn2000} className="p-5 space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-500/30 text-blue-200 text-[11px] leading-relaxed">
                💡 <strong>Hướng dẫn:</strong> Nhập cặp toạ độ <strong>X</strong> (trục Bắc) và <strong>Y</strong> (trục Đông) in tại <em>&quot;Bảng kê toạ độ ranh giới thửa đất&quot;</em> trên trang 3 hoặc trang 4 của Sổ đỏ.
              </div>

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300">Toạ độ X (Bắc - mét):</label>
                  <input
                    type="text"
                    value={coordX}
                    onChange={(e) => setCoordX(e.target.value)}
                    placeholder="VD: 2325850.50"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white focus:outline-none focus:border-orange-500"
                    required
                  />
                  <span className="text-[10px] text-slate-400">Toạ độ X tại Hà Nội thường dao động từ 2.300.000m đến 2.350.000m</span>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300">Toạ độ Y (Đông - mét):</label>
                  <input
                    type="text"
                    value={coordY}
                    onChange={(e) => setCoordY(e.target.value)}
                    placeholder="VD: 581230.20"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white focus:outline-none focus:border-orange-500"
                    required
                  />
                  <span className="text-[10px] text-slate-400">Toạ độ Y tại Hà Nội thường dao động từ 570.000m đến 600.000m</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
                  <span>Kinh tuyến trục quy chuẩn:</span>
                  <span className="font-mono font-bold text-amber-400">105°00&apos; (Múi chiếu 3 độ - Hà Nội)</span>
                </div>
              </div>

              {/* MẪU TOẠ ĐỘ NHANH */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-bold text-slate-400">Mẫu toạ độ kiểm tra nhanh:</span>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => {
                      setCoordX('2325850.50');
                      setCoordY('581230.20');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-orange-500 text-[10px] font-mono text-slate-300"
                  >
                    Duy Tân, Cầu Giấy
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCoordX('2324120.80');
                      setCoordY('584950.40');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-orange-500 text-[10px] font-mono text-slate-300"
                  >
                    Láng Hạ, Đống Đa
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCoordX('2329340.10');
                      setCoordY('586520.60');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-orange-500 text-[10px] font-mono text-slate-300"
                  >
                    Quảng An, Tây Hồ
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl 
                           bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 
                           text-white font-bold text-xs shadow-lg shadow-orange-500/25 transition-all mt-2"
              >
                <Compass className="h-4 w-4" />
                <span>Giải Mã Toạ Độ VN-2000 & Tra Cứu Quy Hoạch</span>
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
