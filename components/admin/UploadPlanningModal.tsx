'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  UploadCloud,
  FileCode,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Plus,
  Compass,
  Layers,
  Sparkles,
  RefreshCw,
  Building,
  Check,
} from 'lucide-react';
import {
  PlanningZoneItem,
  ParsedZoneFeature,
  parsePlanningMapFile,
  SAMPLE_HANOI_GEOJSON,
} from '@/lib/planning/planning-utils';

interface UploadPlanningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveZone: (zone: Partial<PlanningZoneItem>) => void;
  onBatchImport: (zones: PlanningZoneItem[]) => void;
}

export const UploadPlanningModal: React.FC<UploadPlanningModalProps> = ({
  isOpen,
  onClose,
  onSaveZone,
  onBatchImport,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedZones, setParsedZones] = useState<ParsedZoneFeature[]>([]);
  const [selectedZoneIndex, setSelectedZoneIndex] = useState<number>(0);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form state for current zone being edited
  const [formData, setFormData] = useState<Partial<PlanningZoneItem>>({
    name: '',
    code: '',
    district: 'Cầu Giấy',
    type: 'residential',
    color: '#ffdd29',
    areaHa: 200,
    maxFloors: 5,
    density: '70%',
    planYear: 2030,
    status: 'published',
  });

  const handleFile = async (file: File) => {
    setIsProcessing(true);
    setErrorMessage(null);
    setUploadedFileName(file.name);

    try {
      const text = await file.text();
      const features = parsePlanningMapFile(text, file.name);

      if (!features || features.length === 0) {
        setErrorMessage('Không tìm thấy dữ liệu toạ độ Polygon hợp lệ trong file. Vui lòng kiểm tra file GeoJSON hoặc KML.');
        setParsedZones([]);
        return;
      }

      setParsedZones(features);
      setSelectedZoneIndex(0);
      loadFeatureToForm(features[0]);
    } catch (err: any) {
      setErrorMessage(err.message || 'Lỗi khi đọc file dữ liệu quy hoạch.');
      setParsedZones([]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleLoadSample = () => {
    setIsProcessing(true);
    setErrorMessage(null);
    setUploadedFileName('mau_quy_hoach_ha_noi_2030.geojson');
    const features = parsePlanningMapFile(SAMPLE_HANOI_GEOJSON, 'mau_quy_hoach_ha_noi_2030.geojson');
    setParsedZones(features);
    setSelectedZoneIndex(0);
    if (features.length > 0) {
      loadFeatureToForm(features[0]);
    }
    setIsProcessing(false);
  };

  const loadFeatureToForm = (feat: ParsedZoneFeature) => {
    setFormData({
      name: feat.name,
      code: feat.code,
      district: feat.district,
      type: feat.type,
      color: feat.color,
      areaHa: feat.areaHa,
      maxFloors: feat.maxFloors,
      density: feat.density,
      planYear: feat.planYear,
      status: feat.status,
      coordinates: feat.coordinates,
    });
  };

  const handleSelectZone = (index: number) => {
    setSelectedZoneIndex(index);
    if (parsedZones[index]) {
      loadFeatureToForm(parsedZones[index]);
    }
  };

  const handleSaveCurrentZone = () => {
    if (!formData.name || !formData.code) {
      setErrorMessage('Vui lòng nhập tên và mã phân khu quy hoạch.');
      return;
    }

    onSaveZone({
      ...formData,
      sourceFile: uploadedFileName || 'Thủ công',
    });
    handleClose();
  };

  const handleImportAllZones = () => {
    if (parsedZones.length === 0) return;

    const items: PlanningZoneItem[] = parsedZones.map((z, idx) => ({
      id: 'zone_import_' + Date.now().toString(36) + '_' + idx,
      code: z.code,
      name: z.name,
      district: z.district,
      color: z.color,
      areaHa: z.areaHa,
      maxFloors: z.maxFloors,
      density: z.density,
      status: 'published',
      type: z.type,
      planYear: z.planYear,
      coordinates: z.coordinates,
      sourceFile: uploadedFileName,
      floorAreaRatio: z.type === 'commercial' ? 5.0 : 3.5,
      maxHeight: z.maxFloors ? `${z.maxFloors} tầng` : 'Không áp dụng',
    }));

    onBatchImport(items);
    handleClose();
  };

  const handleClose = () => {
    setParsedZones([]);
    setUploadedFileName('');
    setErrorMessage(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-orange-500/10 text-orange-500 border border-orange-500/20">
                <Compass className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-navy">
                  Thêm Phân Khu / Tải File Bản Đồ Quy Hoạch
                </h2>
                <p className="text-xs text-slate-500">
                  Hỗ trợ tải file GeoJSON, JSON, KML và tự động số hóa lên bản đồ Hà Nội 2030
                </p>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            {/* Upload Zone */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".geojson,application/geo+json,.json,.kml"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleFile(e.target.files[0]);
                }
              }}
              className="hidden"
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragging(true);
              }}
              onDragEnter={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragging(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragging(false);
              }}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 ${
                isDragging
                  ? 'border-orange-500 bg-orange-50/60 scale-[1.01] ring-4 ring-orange-500/20'
                  : 'border-orange-500/40 bg-orange-50/15 hover:bg-orange-50/30 hover:border-orange-500'
              }`}
            >
              <UploadCloud className="h-10 w-10 text-orange-500 mx-auto mb-2" />
              <p className="text-xs font-extrabold text-navy">
                {isDragging ? 'Thả file bản đồ quy hoạch vào đây...' : 'Kéo thả file bản đồ quy hoạch vào đây hoặc bấm để chọn'}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Hỗ trợ định dạng <b>.geojson</b>, <b>.json</b>, <b>.kml</b> (Chuẩn toạ độ WGS84 EPSG:4326)
              </p>

              <div className="mt-4 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-md shadow-orange-500/20 transition-all"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Chọn file từ máy tính
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLoadSample();
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors"
                >
                  <Sparkles className="h-3.5 w-3.5 text-orange-500" />
                  Dùng file mẫu Hà Nội
                </button>
              </div>
            </div>

            {/* Error message */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl border border-red-200 bg-red-50/80 text-xs text-red-600 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Uploaded File Confirmation */}
            {uploadedFileName && parsedZones.length > 0 && (
              <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/60 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-emerald-800 font-bold">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Đã đọc thành công <b>{parsedZones.length}</b> phân khu từ file: <i>{uploadedFileName}</i></span>
                </div>
                {parsedZones.length > 1 && (
                  <button
                    type="button"
                    onClick={handleImportAllZones}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold shadow-xs transition-colors"
                  >
                    + Nhập tất cả {parsedZones.length} phân khu
                  </button>
                )}
              </div>
            )}

            {/* Multi-feature Selector Tabs */}
            {parsedZones.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <span className="text-xs font-bold text-slate-500 shrink-0">Chọn xem:</span>
                {parsedZones.map((zone, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectZone(idx)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-colors ${
                      selectedZoneIndex === idx
                        ? 'bg-navy text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    #{idx + 1} {zone.code} - {zone.name.substring(0, 24)}...
                  </button>
                ))}
              </div>
            )}

            {/* Zone Data Form & Coordinates Preview */}
            <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50/30 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-extrabold text-navy uppercase tracking-wider">
                  Thông số phân khu quy hoạch
                </h3>
                {formData.coordinates && (
                  <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                    Toạ độ Polygon: <b>{formData.coordinates.length} điểm</b>
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700">Tên phân khu quy hoạch *</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="VD: Phân khu Đô thị mới Cầu Giấy (H2-2)"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-semibold focus:border-orange-500 focus:outline-hidden"
                  />
                </div>

                {/* Code */}
                <div>
                  <label className="text-xs font-bold text-slate-700">Mã loại phân khu *</label>
                  <input
                    type="text"
                    value={formData.code || ''}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="VD: ODT, TMD, GT, CCC"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-mono font-bold focus:border-orange-500 focus:outline-hidden"
                  />
                </div>

                {/* District */}
                <div>
                  <label className="text-xs font-bold text-slate-700">Quận / Huyện</label>
                  <select
                    value={formData.district || 'Cầu Giấy'}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-semibold focus:border-orange-500 focus:outline-hidden"
                  >
                    {[
                      'Cầu Giấy',
                      'Đống Đa',
                      'Tây Hồ',
                      'Ba Đình',
                      'Hoàn Kiếm',
                      'Nam Từ Liêm',
                      'Bắc Từ Liêm',
                      'Thanh Xuân',
                      'Hai Bà Trưng',
                      'Long Biên',
                      'Hà Đông',
                      'Hoàng Mai',
                      'Gia Lâm',
                      'Đông Anh',
                    ].map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Zone Type */}
                <div>
                  <label className="text-xs font-bold text-slate-700">Loại quy hoạch sử dụng đất</label>
                  <select
                    value={formData.type || 'residential'}
                    onChange={(e) => {
                      const t = e.target.value as any;
                      const colors: Record<string, string> = {
                        residential: '#ffdd29',
                        commercial: '#ef4444',
                        mixed: '#8b5cf6',
                        green: '#22c55e',
                        transport: '#3b82f6',
                        industrial: '#f59e0b',
                        public: '#6366f1',
                      };
                      setFormData({
                        ...formData,
                        type: t,
                        color: colors[t] || formData.color,
                      });
                    }}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-semibold focus:border-orange-500 focus:outline-hidden"
                  >
                    <option value="residential">Đất ở đô thị (ODT)</option>
                    <option value="commercial">Đất thương mại dịch vụ (TMD)</option>
                    <option value="mixed">Đất hỗn hợp đa chức năng (HH)</option>
                    <option value="green">Đất công viên cây xanh & mặt nước (CCC)</option>
                    <option value="transport">Đất giao thông & Metro (GT)</option>
                    <option value="industrial">Đất công nghiệp (CN)</option>
                    <option value="public">Công trình công cộng (CC)</option>
                  </select>
                </div>

                {/* Color */}
                <div>
                  <label className="text-xs font-bold text-slate-700">Màu sắc hiển thị trên bản đồ</label>
                  <div className="mt-1 flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.color || '#ffdd29'}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="h-9 w-12 rounded-lg border border-slate-200 cursor-pointer p-0.5 bg-white"
                    />
                    <input
                      type="text"
                      value={formData.color || ''}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="flex-1 rounded-xl border border-slate-200 bg-white p-2 text-xs font-mono font-bold focus:border-orange-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Area in Hectares */}
                <div>
                  <label className="text-xs font-bold text-slate-700">Diện tích quy hoạch (Hécta)</label>
                  <input
                    type="number"
                    value={formData.areaHa || 100}
                    onChange={(e) => setFormData({ ...formData, areaHa: Number(e.target.value) })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-semibold focus:border-orange-500 focus:outline-hidden"
                  />
                </div>

                {/* Max floors */}
                <div>
                  <label className="text-xs font-bold text-slate-700">Tầng cao tối đa</label>
                  <input
                    type="number"
                    value={formData.maxFloors || 0}
                    onChange={(e) => setFormData({ ...formData, maxFloors: Number(e.target.value) })}
                    placeholder="0 là không áp dụng"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-semibold focus:border-orange-500 focus:outline-hidden"
                  />
                </div>

                {/* Density */}
                <div>
                  <label className="text-xs font-bold text-slate-700">Mật độ xây dựng</label>
                  <input
                    type="text"
                    value={formData.density || '60%'}
                    onChange={(e) => setFormData({ ...formData, density: e.target.value })}
                    placeholder="VD: 60%, 70%"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-semibold focus:border-orange-500 focus:outline-hidden"
                  />
                </div>

                {/* Plan Year */}
                <div>
                  <label className="text-xs font-bold text-slate-700">Tầm nhìn quy hoạch</label>
                  <select
                    value={formData.planYear || 2030}
                    onChange={(e) => setFormData({ ...formData, planYear: Number(e.target.value) })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-semibold focus:border-orange-500 focus:outline-hidden"
                  >
                    <option value={2025}>2025</option>
                    <option value={2030}>2030 (Quy hoạch tổng thể)</option>
                    <option value={2045}>2045 (Tầm nhìn dài hạn)</option>
                  </select>
                </div>
              </div>

              {/* Coordinates Preview Box */}
              {formData.coordinates && formData.coordinates.length > 0 && (
                <div className="pt-2 border-t border-slate-200">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                    <span>Mẫu toạ độ ranh giới WGS84:</span>
                    <span className="font-mono">
                      {formData.coordinates.length} điểm toạ độ khép góc
                    </span>
                  </div>
                  <div className="bg-slate-900 text-slate-200 p-3 rounded-xl font-mono text-[11px] overflow-x-auto max-h-24 leading-relaxed">
                    {formData.coordinates.slice(0, 4).map((c, i) => (
                      <div key={i}>
                        [{i + 1}] Lat: {c[0].toFixed(5)}, Lng: {c[1].toFixed(5)}
                      </div>
                    ))}
                    {formData.coordinates.length > 4 && (
                      <div className="text-slate-400">... và {formData.coordinates.length - 4} điểm toạ độ khác</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-xs font-bold text-slate-700 transition-colors"
            >
              Hủy bỏ
            </button>

            <div className="flex items-center gap-2">
              {parsedZones.length > 1 && (
                <button
                  type="button"
                  onClick={handleImportAllZones}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition-colors"
                >
                  Nhập tất cả ({parsedZones.length})
                </button>
              )}
              <button
                type="button"
                onClick={handleSaveCurrentZone}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-md shadow-orange-500/20 transition-all"
              >
                <Check className="h-4 w-4" />
                Xác nhận & Cập nhật lên bản đồ
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
