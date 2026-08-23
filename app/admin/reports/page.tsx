'use client';

import React from 'react';
import Link from 'next/link';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { StatsCard } from '@/components/admin/StatsCard';
import { useApp } from '@/lib/context/AppContext';
import {
  Sparkles,
  FileText,
  Download,
  Eye,
  CheckCircle,
  TrendingUp,
  Cpu,
  Search
} from 'lucide-react';

const mockReportsLog = [
  {
    id: 'RPT-89201',
    listingTitle: 'Nhà phố Đống Đa 5 tầng, gần Văn Miếu',
    requester: 'Nguyễn Văn Minh (Pro)',
    score: 82,
    legalRisk: 'An toàn 100%',
    metroDist: '800m (Ga Cát Linh)',
    createdAt: '23/08/2025 15:40',
    pdfDownloaded: true,
  },
  {
    id: 'RPT-89200',
    listingTitle: 'Biệt thự Đơn lập Tây Hồ view trực diện mặt nước',
    requester: 'Trần Thị Thu Hà (Agency)',
    score: 91,
    legalRisk: 'An toàn 100%',
    metroDist: '1.2km',
    createdAt: '23/08/2025 14:10',
    pdfDownloaded: true,
  },
  {
    id: 'RPT-89199',
    listingTitle: 'Căn hộ Duplex cao cấp 3PN The Matrix One',
    requester: 'Lê Hoàng Nam (Basic)',
    score: 78,
    legalRisk: 'An toàn 100%',
    metroDist: '500m',
    createdAt: '22/08/2025 18:25',
    pdfDownloaded: false,
  },
  {
    id: 'RPT-89198',
    listingTitle: 'Đất phân lô kinh doanh Cầu Giấy, ngõ 8m',
    requester: 'Phạm Đức Thắng (Free)',
    score: 75,
    legalRisk: 'Cần kiểm tra mốc giới',
    metroDist: '300m',
    createdAt: '22/08/2025 11:00',
    pdfDownloaded: false,
  },
];

export default function AdminReportsPage() {
  const { addToast } = useApp();

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader title="Nhật ký Báo cáo AI" breadcrumb="Báo cáo AI" />

      <main className="p-6 space-y-6 max-w-7xl">
        {/* ── STATS ROW ── */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <StatsCard
            title="Tổng báo cáo đã xuất"
            value="1,432"
            trend="+18% tuần này"
            trendDirection="up"
            icon={<Sparkles className="h-5 w-5 text-purple-500" />}
          />
          <StatsCard
            title="Điểm AI trung bình"
            value="81.5 / 100"
            trend="Chất lượng tốt"
            trendDirection="up"
            icon={<TrendingUp className="h-5 w-5 text-emerald-500" />}
          />
          <StatsCard
            title="Tỷ lệ tải PDF"
            value="78.4%"
            trend="1,122 lượt tải"
            trendDirection="up"
            icon={<Download className="h-5 w-5 text-blue-500" />}
          />
          <StatsCard
            title="Model AI Active"
            value="Gemini 1.5 Pro"
            trend="Độ trễ: 1.8s"
            trendDirection="up"
            icon={<Cpu className="h-5 w-5 text-orange-500" />}
          />
        </div>

        {/* ── REPORTS LOG TABLE ── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-sm text-navy">Lịch sử định giá & thẩm định BĐS</h3>
              <p className="text-xs text-slate-400">Dữ liệu phân tích tự động từ Google Gemini AI</p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm mã báo cáo, BĐS..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] font-bold uppercase text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Mã báo cáo</th>
                  <th className="px-4 py-3">Bất động sản</th>
                  <th className="px-4 py-3">Người yêu cầu</th>
                  <th className="px-4 py-3">Điểm AI</th>
                  <th className="px-4 py-3">Rủi ro quy hoạch</th>
                  <th className="px-4 py-3">Thời gian</th>
                  <th className="px-4 py-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mockReportsLog.map((rpt) => (
                  <tr key={rpt.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-mono font-bold text-orange-600">{rpt.id}</td>
                    <td className="px-4 py-3 font-bold text-navy max-w-xs truncate">{rpt.listingTitle}</td>
                    <td className="px-4 py-3">{rpt.requester}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded font-black text-xs bg-purple-50 text-purple-600 border border-purple-200">
                        {rpt.score}/100
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-emerald-600">{rpt.legalRisk}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-400">{rpt.createdAt}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href="/reports/1"
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-navy"
                          title="Xem báo cáo"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Link>
                        <button
                          onClick={() => addToast(`Đang tải file PDF cho ${rpt.id}`, 'info')}
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-orange-500"
                          title="Tải PDF"
                        >
                          <Download className="h-3.5 w-3.5" />
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
