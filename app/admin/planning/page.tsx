'use client';

import React, { useState } from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { useApp } from '@/lib/context/AppContext';
import {
  Compass,
  Layers,
  MapPin,
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface PlanningZone {
  id: string;
  code: string;
  name: string;
  district: string;
  color: string;
  areaHa: number;
  maxFloors: number;
  density: string;
  status: 'published' | 'draft';
}

const mockZones: PlanningZone[] = [
  {
    id: 'z1',
    code: 'ODT',
    name: 'Đất ở đô thị hiện hữu cải tạo',
    district: 'Đống Đa',
    color: '#ffdd29',
    areaHa: 450,
    maxFloors: 5,
    density: '70%',
    status: 'published',
  },
  {
    id: 'z2',
    code: 'TMD',
    name: 'Đất thương mại & Dịch vụ tổng hợp',
    district: 'Cầu Giấy',
    color: '#ef4444',
    areaHa: 280,
    maxFloors: 25,
    density: '60%',
    status: 'published',
  },
  {
    id: 'z3',
    code: 'GT',
    name: 'Hành lang Giao thông & Tuyến Metro số 2',
    district: 'Tây Hồ - Hoàn Kiếm',
    color: '#3b82f6',
    areaHa: 120,
    maxFloors: 0,
    density: '15%',
    status: 'published',
  },
  {
    id: 'z4',
    code: 'CCC',
    name: 'Đất công viên cây xanh & Thể dục thể thao',
    district: 'Tây Hồ',
    color: '#22c55e',
    areaHa: 520,
    maxFloors: 2,
    density: '5%',
    status: 'published',
  },
];

export default function AdminPlanningPage() {
  const { addToast } = useApp();
  const [zones, setZones] = useState<PlanningZone[]>(mockZones);

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader title="Quản lý Quy hoạch" breadcrumb="Hệ thống / Quy hoạch" />

      <main className="p-6 space-y-6 max-w-7xl">
        {/* ── TOP HEADER ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-extrabold text-navy">
              Bản đồ Phân khu Quy hoạch Hà Nội 2030
            </h2>
            <p className="text-xs text-slate-500">
              Quản lý dữ liệu địa không gian PostGIS, ranh giới và mật độ xây dựng
            </p>
          </div>

          <button
            onClick={() => addToast('Mở trình thêm dữ liệu phân khu quy hoạch', 'info')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-md shadow-orange-500/20 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>+ Thêm phân khu</span>
          </button>
        </div>

        {/* ── STATS ROW ── */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-xs text-slate-400">Tổng phân khu đã số hóa</span>
            <p className="text-xl font-black text-navy mt-1">42 phân khu</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-xs text-slate-400">Diện tích quy hoạch</span>
            <p className="text-xl font-black text-orange-500 mt-1">1,370 ha</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-xs text-slate-400">Tuyến Metro quy hoạch</span>
            <p className="text-xl font-black text-blue-500 mt-1">8 tuyến</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-xs text-slate-400">Độ chuẩn xác WGS84</span>
            <p className="text-xl font-black text-emerald-500 mt-1">99.9%</p>
          </div>
        </div>

        {/* ── PLANNING ZONES TABLE ── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-navy">Danh sách Lớp quy hoạch phân khu</h3>
            <span className="text-xs text-slate-400">Chuẩn dữ liệu Sở QHKT Hà Nội</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] font-bold uppercase text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Mã loại</th>
                  <th className="px-4 py-3">Tên phân khu</th>
                  <th className="px-4 py-3">Quận / Huyện</th>
                  <th className="px-4 py-3">Màu sắc</th>
                  <th className="px-4 py-3">Tầng cao tối đa</th>
                  <th className="px-4 py-3">Mật độ XD</th>
                  <th className="px-4 py-3">Trạng thái</th>
                  <th className="px-4 py-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {zones.map((zone) => (
                  <tr key={zone.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-mono font-bold text-navy">{zone.code}</td>
                    <td className="px-4 py-3 font-bold text-slate-800">{zone.name}</td>
                    <td className="px-4 py-3">{zone.district}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-4 h-4 rounded-full border border-slate-300 shadow-2xs"
                          style={{ backgroundColor: zone.color }}
                        />
                        <span className="font-mono text-[11px]">{zone.color}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold">{zone.maxFloors > 0 ? `${zone.maxFloors} tầng` : 'Không áp dụng'}</td>
                    <td className="px-4 py-3 font-bold text-slate-700">{zone.density}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600">
                        Đã công bố
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => addToast(`Xem bản đồ phân khu ${zone.code}`, 'info')}
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => addToast(`Chỉnh sửa phân khu ${zone.code}`, 'info')}
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
