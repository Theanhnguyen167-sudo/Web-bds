'use client';

import React, { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { useApp } from '@/lib/context/AppContext';
import { UploadPlanningModal } from '@/components/admin/UploadPlanningModal';
import { PlanningZoneItem } from '@/lib/planning/planning-utils';
import {
  Compass,
  Layers,
  MapPin,
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  AlertCircle,
  Sliders,
  Maximize2,
  RotateCcw,
  Sparkles,
  FileText,
} from 'lucide-react';

const PlanningMap = dynamic(
  () => import('@/components/map/PlanningMap'),
  { 
    ssr: false, 
    loading: () => (
      <div className="w-full h-[400px] bg-slate-900 rounded-2xl flex items-center justify-center text-slate-400 text-xs animate-pulse">
        🗺️ Đang nạp bản đồ phân khu quy hoạch Hà Nội...
      </div>
    )
  }
);

export default function AdminPlanningPage() {
  const {
    planningZones,
    selectedPlanningZoneId,
    setSelectedPlanningZoneId,
    addPlanningZone,
    importPlanningZones,
    deletePlanningZone,
    resetPlanningZonesToDefault,
    addToast,
  } = useApp();

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [mapOpacity, setMapOpacity] = useState<number>(45);
  const [activeTab, setActiveTab] = useState<'both' | 'map' | 'table'>('both');
  const mapSectionRef = useRef<HTMLDivElement>(null);

  // Dynamic statistics from real planning zones
  const totalZones = planningZones.length;
  const totalAreaHa = planningZones
    .reduce((sum, z) => sum + (Number(z.areaHa) || 0), 0)
    .toLocaleString();

  const handleViewOnMap = (zone: PlanningZoneItem) => {
    setSelectedPlanningZoneId(zone.id);
    addToast(`Đang định vị phân khu "${zone.name}" trên bản đồ`, 'info');
    mapSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa phân khu "${name}" khỏi bản đồ quy hoạch?`)) {
      deletePlanningZone(id);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader title="Quản lý Quy hoạch" breadcrumb="Hệ thống / Quy hoạch" />

      <main className="p-6 space-y-6 max-w-7xl">
        {/* ── TOP HEADER ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-extrabold text-navy">
                Bản đồ Phân khu Quy hoạch Hà Nội 2030
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-orange-100 text-orange-600 border border-orange-200">
                PostGIS & WGS84
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Quản lý dữ liệu địa không gian, tải file quy hoạch GeoJSON/KML và cập nhật tự động lên bản đồ
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-md shadow-orange-500/20 transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>+ Thêm phân khu</span>
            </button>
          </div>
        </div>

        {/* ── STATS ROW ── */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-xs text-slate-400 font-medium">Tổng phân khu đã số hóa</span>
            <p className="text-xl font-black text-navy mt-1">{totalZones} phân khu</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-xs text-slate-400 font-medium">Diện tích quy hoạch</span>
            <p className="text-xl font-black text-orange-500 mt-1">{totalAreaHa} ha</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-xs text-slate-400 font-medium">Tuyến Metro quy hoạch</span>
            <p className="text-xl font-black text-blue-500 mt-1">8 tuyến</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-xs text-slate-400 font-medium">Độ chuẩn xác WGS84</span>
            <p className="text-xl font-black text-emerald-500 mt-1">99.9%</p>
          </div>
        </div>

        {/* ── LIVE INTERACTIVE PLANNING MAP SECTION ── */}
        <div
          ref={mapSectionRef}
          className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden"
        >
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50/40">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600">
                <Layers className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-navy">
                  Bản đồ Phân khu Quy hoạch Trực quan (GIS Live Map)
                </h3>
                <p className="text-[11px] text-slate-400">
                  Hiển thị ranh giới đa giác PostGIS từ dữ liệu hệ thống và file tải lên
                </p>
              </div>
            </div>

            {/* Map Controls */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-white border border-slate-200 px-2.5 py-1.5 rounded-xl">
                <Sliders className="h-3.5 w-3.5 text-slate-400" />
                <span>Độ trong suốt:</span>
                <input
                  type="range"
                  min="15"
                  max="85"
                  value={mapOpacity}
                  onChange={(e) => setMapOpacity(Number(e.target.value))}
                  className="w-16 accent-orange-500 cursor-pointer h-1.5"
                />
                <span className="font-mono text-[11px] font-bold">{mapOpacity}%</span>
              </div>

              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="text-xs font-semibold bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-slate-700 focus:outline-hidden"
              >
                <option value="all">Tất cả quận / huyện</option>
                <option value="Đống Đa">Đống Đa</option>
                <option value="Cầu Giấy">Cầu Giấy</option>
                <option value="Tây Hồ">Tây Hồ</option>
                <option value="Hoàn Kiếm">Hoàn Kiếm</option>
                <option value="Nam Từ Liêm">Nam Từ Liêm</option>
                <option value="Ba Đình">Ba Đình</option>
              </select>
            </div>
          </div>

          {/* Embedded Map Container */}
          <div className="relative h-[420px] w-full bg-slate-950">
            <PlanningMap
              activeDistrict={selectedDistrict}
              activeLayers={{
                planning: true,
                metro: true,
                projects: true,
                amenities: false,
                green: true,
              }}
              planYear={2030}
              opacity={mapOpacity / 100}
              zones={planningZones}
              focusZoneId={selectedPlanningZoneId}
              onZoneClick={(zone) => {
                setSelectedPlanningZoneId(zone.id);
                addToast(`Đang xem chi tiết: ${zone.name}`, 'info');
              }}
            />

            {/* Active zone floating chip on map */}
            {selectedPlanningZoneId && (
              <div className="absolute bottom-4 left-4 z-[500] bg-slate-900/90 backdrop-blur-md text-white px-3.5 py-2 rounded-xl text-xs flex items-center gap-2 border border-slate-700 shadow-xl">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-ping" />
                <span>
                  Đang chọn: <b>{planningZones.find((z) => z.id === selectedPlanningZoneId)?.name || 'Phân khu'}</b>
                </span>
                <button
                  onClick={() => setSelectedPlanningZoneId(null)}
                  className="text-slate-400 hover:text-white text-xs ml-2"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── PLANNING ZONES TABLE ── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm text-navy">Danh sách Lớp quy hoạch phân khu</h3>
              <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-bold">
                {planningZones.length} phân khu
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={resetPlanningZonesToDefault}
                className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-navy px-2.5 py-1 rounded-lg hover:bg-slate-100 transition-colors"
                title="Khôi phục danh sách mặc định"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Khôi phục mẫu</span>
              </button>
              <span className="text-xs text-slate-400">Chuẩn dữ liệu Sở QHKT Hà Nội</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] font-bold uppercase text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Mã loại</th>
                  <th className="px-4 py-3">Tên phân khu</th>
                  <th className="px-4 py-3">Quận / Huyện</th>
                  <th className="px-4 py-3">Màu sắc</th>
                  <th className="px-4 py-3">Diện tích</th>
                  <th className="px-4 py-3">Tầng cao</th>
                  <th className="px-4 py-3">Mật độ XD</th>
                  <th className="px-4 py-3">Toạ độ</th>
                  <th className="px-4 py-3">Trạng thái</th>
                  <th className="px-4 py-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {planningZones.map((zone) => {
                  const isSelected = selectedPlanningZoneId === zone.id;
                  return (
                    <tr
                      key={zone.id}
                      className={`hover:bg-slate-50 transition-colors ${
                        isSelected ? 'bg-orange-50/50 border-l-4 border-l-orange-500' : ''
                      }`}
                    >
                      <td className="px-4 py-3 font-mono font-bold text-navy">{zone.code}</td>
                      <td className="px-4 py-3 font-bold text-slate-800 max-w-xs">
                        <div className="truncate" title={zone.name}>
                          {zone.name}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {zone.pdfUrl && (
                            <a
                              href={zone.pdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-[10px] font-extrabold transition-colors"
                              title="Nhấp để mở xem file PDF đồ án"
                            >
                              <FileText className="h-3 w-3" />
                              <span>PDF Đồ án</span>
                            </a>
                          )}
                          {zone.sourceFile && (
                            <span className="text-[10px] text-slate-400 font-normal truncate">
                              File: {zone.sourceFile}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">{zone.district}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-4 h-4 rounded-full border border-slate-300 shadow-2xs shrink-0"
                            style={{ backgroundColor: zone.color }}
                          />
                          <span className="font-mono text-[11px]">{zone.color}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-700">
                        {zone.areaHa ? `${zone.areaHa} ha` : '—'}
                      </td>
                      <td className="px-4 py-3 font-semibold">
                        {zone.maxFloors > 0 ? `${zone.maxFloors} tầng` : 'Không áp dụng'}
                      </td>
                      <td className="px-4 py-3 font-bold text-slate-700">{zone.density}</td>
                      <td className="px-4 py-3 font-mono text-[11px] text-slate-500">
                        {zone.coordinates?.length ? `${zone.coordinates.length} điểm` : '0 điểm'}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                          Đã công bố
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {zone.pdfUrl && (
                            <a
                              href={zone.pdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 hover:text-red-700 transition-colors"
                              title="Mở xem tài liệu PDF đồ án"
                            >
                              <FileText className="h-4 w-4" />
                            </a>
                          )}
                          <button
                            onClick={() => handleViewOnMap(zone)}
                            className="p-1.5 rounded-lg hover:bg-orange-50 text-orange-600 hover:text-orange-700 transition-colors"
                            title="Xem vị trí trên bản đồ"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(zone.id, zone.name)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                            title="Xóa phân khu"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* ── MODAL TẢI FILE BẢN ĐỒ QUY HOẠCH ── */}
      <UploadPlanningModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSaveZone={(newZone) => {
          const id = addPlanningZone(newZone);
          setSelectedPlanningZoneId(id);
        }}
        onBatchImport={(newZones) => {
          importPlanningZones(newZones);
        }}
      />
    </div>
  );
}
