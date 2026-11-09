'use client';

import React, { useState, useMemo } from 'react';
import { 
  Coins, 
  Search, 
  Download, 
  Filter, 
  Clock, 
  CheckCircle2, 
  FileText, 
  AlertCircle, 
  Eye, 
  ExternalLink,
  ShieldAlert,
  ArrowUpDown
} from 'lucide-react';
import { CommissionRecord } from '@/types/broker-finance';
import { IncomeStatus } from '@/types/broker-nav';
import { formatCurrencyVND } from '@/lib/utils';
import { SettlementDetailDrawer } from './SettlementDetailDrawer';

interface CommissionLedgerProps {
  initialRecords: CommissionRecord[];
}

export const CommissionLedger: React.FC<CommissionLedgerProps> = ({ initialRecords }) => {
  const [records, setRecords] = useState<CommissionRecord[]>(initialRecords);
  const [activeTab, setActiveTab] = useState<IncomeStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [periodFilter, setPeriodFilter] = useState('all');
  const [selectedRecord, setSelectedRecord] = useState<CommissionRecord | null>(null);

  // Thống kê tổng tiền theo từng trạng thái
  const stats = useMemo(() => {
    return {
      estimated: records.filter((r) => r.status === 'estimated').reduce((s, r) => s + r.netPayoutAmount, 0),
      eligible: records.filter((r) => r.status === 'eligible').reduce((s, r) => s + r.netPayoutAmount, 0),
      auditing: records.filter((r) => r.status === 'auditing').reduce((s, r) => s + r.netPayoutAmount, 0),
      paid: records.filter((r) => r.status === 'paid').reduce((s, r) => s + r.netPayoutAmount, 0),
      disputed: records.filter((r) => r.status === 'disputed').reduce((s, r) => s + r.netPayoutAmount, 0),
    };
  }, [records]);

  // Lọc bản ghi
  const filteredRecords = useMemo(() => {
    return records.filter((item) => {
      if (activeTab !== 'all' && item.status !== activeTab) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchDeal = item.dealCode.toLowerCase().includes(q);
        const matchProp = item.propertyCode.toLowerCase().includes(q);
        const matchTitle = item.listingTitle.toLowerCase().includes(q);
        if (!matchDeal && !matchProp && !matchTitle) return false;
      }
      return true;
    });
  }, [records, activeTab, searchQuery]);

  // Xuất file CSV bảng kê
  const handleExportCSV = () => {
    const headers = ['Mã Deal', 'Mã BĐS', 'BĐS', 'Giá trị giao dịch', 'Tổng phí môi giới', 'Tỷ lệ CTV (%)', 'Hoa hồng thực nhận', 'Trạng thái', 'Mã UNC'];
    const rows = filteredRecords.map((r) => [
      r.dealCode,
      r.propertyCode,
      `"${r.listingTitle.replace(/"/g, '""')}"`,
      r.transactionValue,
      r.totalCommissionAmount,
      r.brokerShareRate,
      r.netPayoutAmount,
      r.status,
      r.paymentReferenceCode || '',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Bang_ke_hoa_hong_HaNoiRealty_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const statusBadges: Record<IncomeStatus, { label: string; color: string }> = {
    estimated: { label: '1. Dự kiến', color: 'bg-slate-100 text-slate-800 border-slate-300' },
    eligible: { label: '2. Đủ điều kiện', color: 'bg-blue-100 text-blue-800 border-blue-300' },
    auditing: { label: '3. Chờ đối soát', color: 'bg-amber-100 text-amber-800 border-amber-300' },
    paid: { label: '4. Đã chi trả', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    disputed: { label: '5. Đang tranh chấp', color: 'bg-rose-100 text-rose-800 border-rose-300' },
  };

  return (
    <div className="space-y-5">
      
      {/* 1. THANH 5 THẺ TÓM TẮT TRẠNG THÁI */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {/* Dự kiến */}
        <div
          onClick={() => setActiveTab('estimated')}
          className={`rounded-2xl border p-4 cursor-pointer transition-all ${
            activeTab === 'estimated'
              ? 'border-slate-800 bg-slate-900 text-white shadow-md'
              : 'border-slate-200 bg-white text-slate-800 hover:border-slate-400'
          }`}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider block opacity-75">
            1. Dự kiến (Cọc)
          </span>
          <div className="mt-1 text-base sm:text-lg font-black font-mono">
            {formatCurrencyVND(stats.estimated)}
          </div>
          <span className="text-[10px] opacity-75">Giao dịch đang cọc</span>
        </div>

        {/* Đủ điều kiện */}
        <div
          onClick={() => setActiveTab('eligible')}
          className={`rounded-2xl border p-4 cursor-pointer transition-all ${
            activeTab === 'eligible'
              ? 'border-blue-700 bg-blue-700 text-white shadow-md'
              : 'border-blue-200 bg-blue-50/50 text-blue-900 hover:border-blue-400'
          }`}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider block opacity-75">
            2. Đủ điều kiện
          </span>
          <div className="mt-1 text-base sm:text-lg font-black font-mono">
            {formatCurrencyVND(stats.eligible)}
          </div>
          <span className="text-[10px] opacity-75">Đã công chứng sạch</span>
        </div>

        {/* Chờ đối soát */}
        <div
          onClick={() => setActiveTab('auditing')}
          className={`rounded-2xl border p-4 cursor-pointer transition-all ${
            activeTab === 'auditing'
              ? 'border-amber-700 bg-amber-600 text-white shadow-md'
              : 'border-amber-200 bg-amber-50/50 text-amber-900 hover:border-amber-400'
          }`}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider block opacity-75">
            3. Chờ đối soát
          </span>
          <div className="mt-1 text-base sm:text-lg font-black font-mono">
            {formatCurrencyVND(stats.auditing)}
          </div>
          <span className="text-[10px] opacity-75">Kế toán chuẩn bị lệnh chi</span>
        </div>

        {/* Đã chi trả */}
        <div
          onClick={() => setActiveTab('paid')}
          className={`rounded-2xl border p-4 cursor-pointer transition-all ${
            activeTab === 'paid'
              ? 'border-emerald-700 bg-emerald-600 text-white shadow-md'
              : 'border-emerald-200 bg-emerald-50/50 text-emerald-900 hover:border-emerald-400'
          }`}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider block opacity-75">
            4. Đã chi trả
          </span>
          <div className="mt-1 text-base sm:text-lg font-black font-mono">
            {formatCurrencyVND(stats.paid)}
          </div>
          <span className="text-[10px] opacity-75">Đã chuyển khoản thành công</span>
        </div>

        {/* Đang tranh chấp */}
        <div
          onClick={() => setActiveTab('disputed')}
          className={`rounded-2xl border p-4 cursor-pointer transition-all col-span-2 sm:col-span-1 ${
            activeTab === 'disputed'
              ? 'border-rose-700 bg-rose-600 text-white shadow-md'
              : 'border-rose-200 bg-rose-50/50 text-rose-900 hover:border-rose-400'
          }`}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider block opacity-75">
            5. Tranh chấp
          </span>
          <div className="mt-1 text-base sm:text-lg font-black font-mono">
            {formatCurrencyVND(stats.disputed)}
          </div>
          <span className="text-[10px] opacity-75">Đang đối soát giải trình</span>
        </div>
      </div>

      {/* 2. THANH CÔNG CỤ TOOLBAR & BỘ LỌC */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        {/* Tìm kiếm */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo Mã Deal (DEAL-HN-xxxx), Mã BĐS, hoặc tiêu đề..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Lọc kỳ & Nút xuất file */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors ${
              activeTab === 'all'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            Tất cả ({records.length})
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-xs"
          >
            <Download className="h-4 w-4 text-blue-600" />
            <span>Xuất Excel / CSV</span>
          </button>
        </div>
      </div>

      {/* 3. BẢNG KÊ ĐỐI SOÁT CHI TIẾT */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-700 font-semibold">
                <th className="p-3.5 pl-5">Mã Deal / BĐS</th>
                <th className="p-3.5">Giá trị giao dịch</th>
                <th className="p-3.5">Tỷ lệ theo thỏa thuận</th>
                <th className="p-3.5">Hoa hồng thực nhận</th>
                <th className="p-3.5">Trạng thái đối soát</th>
                <th className="p-3.5">Mã chứng từ / UNC</th>
                <th className="p-3.5 pr-5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-400">
                    <Coins className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                    Không có khoản hoa hồng nào trong mục này.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => setSelectedRecord(item)}
                    className="hover:bg-blue-50/40 transition-colors cursor-pointer group"
                  >
                    {/* Mã Deal / BĐS */}
                    <td className="p-3.5 pl-5">
                      <div className="font-mono text-xs font-extrabold text-blue-700 group-hover:text-blue-800">
                        {item.dealCode}
                      </div>
                      <div className="font-bold text-slate-900 mt-0.5 line-clamp-1 max-w-[200px]">
                        {item.listingTitle}
                      </div>
                      <div className="font-mono text-[11px] text-slate-400 mt-0.5">
                        #{item.propertyCode}
                      </div>
                    </td>

                    {/* Giá trị giao dịch */}
                    <td className="p-3.5 font-bold text-slate-900 font-mono">
                      {formatCurrencyVND(item.transactionValue)}
                    </td>

                    {/* Tỷ lệ chia */}
                    <td className="p-3.5">
                      <div className="font-semibold text-slate-800">
                        {item.brokerShareRate}% trên {item.totalCommissionRate}% sàn
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {item.agreementVersion}
                      </div>
                    </td>

                    {/* Tiền thực nhận */}
                    <td className="p-3.5 font-mono font-black text-sm text-slate-900">
                      {formatCurrencyVND(item.netPayoutAmount)}
                    </td>

                    {/* Badge trạng thái */}
                    <td className="p-3.5">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold border ${statusBadges[item.status].color}`}>
                        {statusBadges[item.status].label}
                      </span>
                    </td>

                    {/* Mã UNC */}
                    <td className="p-3.5">
                      {item.paymentReferenceCode ? (
                        <div>
                          <div className="font-mono text-[11px] font-bold text-emerald-700">
                            {item.paymentReferenceCode}
                          </div>
                          <span className="text-[10px] text-slate-400">Đã chi trả</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">— Chờ giải ngân —</span>
                      )}
                    </td>

                    {/* Nút thao tác */}
                    <td className="p-3.5 pr-5 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedRecord(item)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold border border-blue-200 shadow-2xs"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>Đối soát</span>
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. DRAWER CHI TIẾT ĐỐI SOÁT */}
      <SettlementDetailDrawer
        record={selectedRecord}
        isOpen={!!selectedRecord}
        onClose={() => setSelectedRecord(null)}
      />

    </div>
  );
};

