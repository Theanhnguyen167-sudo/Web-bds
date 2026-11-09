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
  ArrowUpDown,
  Lock,
  ShieldCheck,
  Info,
  HelpCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { CommissionRecord } from '@/types/broker-finance';
import { IncomeStatus, SubscriptionTier } from '@/types/broker-nav';
import { formatCurrencyVND } from '@/lib/utils';
import { SettlementDetailDrawer } from './SettlementDetailDrawer';

interface CommissionLedgerProps {
  initialRecords: CommissionRecord[];
  subscriptionTier?: SubscriptionTier;
}

interface StatusMeta {
  label: string;
  shortCondition: string;
  fullCondition: string;
  color: string;
  activeColor: string;
  badgeColor: string;
  subText: string;
}

export const STATUS_METADATA: Record<IncomeStatus, StatusMeta> = {
  estimated: {
    label: '1. Dự kiến',
    shortCondition: 'Khách mới vào cọc',
    fullCondition: 'Khách mới vào cọc hoặc đang trong quy trình đàm phán hợp đồng mua bán. Khoản hoa hồng được ghi nhận tạm tính để môi giới theo dõi dòng tiền.',
    color: 'border-slate-200 bg-white text-slate-800 hover:border-slate-400',
    activeColor: 'border-slate-800 bg-slate-900 text-white shadow-md',
    badgeColor: 'bg-slate-100 text-slate-800 border-slate-300',
    subText: 'Giao dịch đang cọc',
  },
  eligible: {
    label: '2. Đủ điều kiện',
    shortCondition: 'Đã công chứng bàn giao',
    fullCondition: 'Giao dịch đã ký công chứng hợp pháp tại phòng công chứng và hoàn tất biên bản bàn giao nhà thực tế. Hoa hồng chính thức được khóa bảo lưu và sẵn sàng chuyển sang kỳ đối soát.',
    color: 'border-blue-200 bg-blue-50/50 text-blue-900 hover:border-blue-400',
    activeColor: 'border-blue-700 bg-blue-700 text-white shadow-md',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    subText: 'Đã công chứng sạch',
  },
  auditing: {
    label: '3. Chờ đối soát',
    shortCondition: 'Kế toán đang thẩm định hồ sơ',
    fullCondition: 'Ban Kiểm toán & Kế toán sàn HaNoi Realty đang thẩm định hồ sơ giải ngân, kiểm tra tính hợp lệ của hợp đồng và chuẩn bị lệnh ủy nhiệm chi (UNC) cho đợt thanh toán định kỳ.',
    color: 'border-amber-200 bg-amber-50/50 text-amber-900 hover:border-amber-400',
    activeColor: 'border-amber-700 bg-amber-600 text-white shadow-md',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    subText: 'Kế toán lập lệnh chi',
  },
  paid: {
    label: '4. Đã chi trả',
    shortCondition: 'Tiền đã vào tài khoản (có mã UNC)',
    fullCondition: 'Tiền đã được chuyển khoản thành công 100% vào tài khoản ngân hàng thụ hưởng của bạn. Có đính kèm mã Ủy nhiệm chi (UNC) và biên lai đối soát ngân hàng.',
    color: 'border-emerald-200 bg-emerald-50/50 text-emerald-900 hover:border-emerald-400',
    activeColor: 'border-emerald-700 bg-emerald-600 text-white shadow-md',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    subText: 'Đã chuyển khoản thành công',
  },
  disputed: {
    label: '5. Đang tranh chấp',
    shortCondition: 'Đang tạm giữ chờ giải trình',
    fullCondition: 'Giao dịch đang phát sinh khiếu nại hoặc yêu cầu giải trình về quyền dẫn khách/tỷ lệ chia. Khoản tiền tạm giữ an toàn trong tài khoản ủy thác cho tới khi Hội đồng Phân xử ra quyết định.',
    color: 'border-rose-200 bg-rose-50/50 text-rose-900 hover:border-rose-400',
    activeColor: 'border-rose-700 bg-rose-600 text-white shadow-md',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
    subText: 'Đang đối soát giải trình',
  },
};

export const CommissionLedger: React.FC<CommissionLedgerProps> = ({ 
  initialRecords,
  subscriptionTier,
}) => {
  const [records, setRecords] = useState<CommissionRecord[]>(initialRecords);
  const [activeTab, setActiveTab] = useState<IncomeStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<CommissionRecord | null>(null);
  const [showStatusGuide, setShowStatusGuide] = useState(false);
  const [hoveredStatusTooltip, setHoveredStatusTooltip] = useState<IncomeStatus | null>(null);

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

  const statusKeys: IncomeStatus[] = ['estimated', 'eligible', 'auditing', 'paid', 'disputed'];

  return (
    <div className="space-y-5">
      
      {/* Banner Cam Kết Bảo Toàn Quyền Lợi Tài Chính Dù Hết Hạn Gói */}
      {subscriptionTier === 'expired' && (
        <div className="rounded-2xl border border-emerald-300 bg-emerald-50/80 p-4 text-xs text-emerald-950 flex items-start gap-3 shadow-xs">
          <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="font-bold">Cam kết bảo lưu quyền lợi HaNoi Realty:</strong> Dù gói dịch vụ của bạn hiện đang ở trạng thái hết hạn, bạn vẫn có <strong>toàn quyền 100%</strong> truy cập bảng kê đối soát hoa hồng này và nhận tiền chi trả bình thường qua ngân hàng khi các deal hoàn tất.
          </div>
        </div>
      )}

      {/* 1. THANH 5 THẺ TÓM TẮT TRẠNG THÁI KÈM TOOLTIP ĐIỀU KIỆN THỰC TẾ */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {statusKeys.map((statusKey) => {
          const meta = STATUS_METADATA[statusKey];
          const isSelected = activeTab === statusKey;

          return (
            <div
              key={statusKey}
              onClick={() => setActiveTab(statusKey)}
              className={`relative rounded-2xl border p-4 cursor-pointer transition-all ${
                isSelected ? meta.activeColor : meta.color
              } ${statusKey === 'disputed' ? 'col-span-2 sm:col-span-1' : ''}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider block opacity-75">
                  {meta.label}
                </span>

                {/* Tooltip Icon & Trigger */}
                <div
                  className="relative group p-1 -m-1"
                  onMouseEnter={() => setHoveredStatusTooltip(statusKey)}
                  onMouseLeave={() => setHoveredStatusTooltip(null)}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Info className={`h-3.5 w-3.5 ${isSelected ? 'text-white/80' : 'text-slate-400'} hover:opacity-100 transition-opacity`} />
                  
                  {/* Tooltip Content Popover */}
                  <div className="absolute right-0 top-6 z-40 hidden group-hover:block w-64 rounded-xl bg-slate-900 p-3 text-[11px] font-normal text-white shadow-2xl border border-slate-700 animate-in fade-in duration-150 leading-relaxed pointer-events-none">
                    <div className="font-bold text-amber-300 pb-1 border-b border-slate-800">
                      Điều kiện: {meta.shortCondition}
                    </div>
                    <div className="mt-1 text-slate-200">
                      {meta.fullCondition}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-1 text-base sm:text-lg font-black font-mono">
                {formatCurrencyVND(stats[statusKey])}
              </div>

              <div className="mt-0.5 flex items-center justify-between text-[10px] opacity-80">
                <span className="line-clamp-1">{meta.shortCondition}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Accordion Hướng Dẫn Chi Tiết 5 Trạng Thái Hoa Hồng */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
        <button
          type="button"
          onClick={() => setShowStatusGuide(!showStatusGuide)}
          className="w-full flex items-center justify-between p-3.5 px-4 text-xs font-bold text-slate-800 bg-slate-50/70 hover:bg-slate-100/80 transition-colors text-left"
        >
          <span className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-blue-600" />
            <span>Quy chuẩn 5 bước đối soát & giải ngân hoa hồng HaNoi Realty (Bấm để xem chi tiết điều kiện)</span>
          </span>
          {showStatusGuide ? <ChevronUp className="h-4 w-4 text-slate-500" /> : <ChevronDown className="h-4 w-4 text-slate-500" />}
        </button>

        {showStatusGuide && (
          <div className="p-4 grid grid-cols-1 md:grid-cols-5 gap-3 border-t border-slate-200 bg-white text-xs">
            {statusKeys.map((k) => {
              const item = STATUS_METADATA[k];
              return (
                <div key={k} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${item.badgeColor}`}>
                      {item.label}
                    </span>
                  </div>
                  <div className="font-bold text-slate-900 text-[11px]">
                    {item.shortCondition}
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    {item.fullCondition}
                  </p>
                </div>
              );
            })}
          </div>
        )}
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
                <th className="p-3.5">Giá trị chốt</th>
                <th className="p-3.5">Tỷ lệ chia (%)</th>
                <th className="p-3.5">Thực nhận</th>
                <th className="p-3.5">Trạng thái (Hover xem điều kiện)</th>
                <th className="p-3.5">Chứng từ / UNC</th>
                <th className="p-3.5 pr-5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-slate-400">
                    <FileText className="h-8 w-8 mx-auto mb-2 opacity-30" />
                    Không tìm thấy khoản hoa hồng nào phù hợp với bộ lọc.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((item) => {
                  const meta = STATUS_METADATA[item.status];

                  return (
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
                        <div className="flex items-center gap-1 mt-1">
                          <span 
                            className="inline-flex items-center gap-1 font-mono text-[9px] font-bold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200"
                            title="Phiên bản thỏa thuận chốt của deal - không bị ảnh hưởng bởi thay đổi biểu phí sau này"
                          >
                            <Lock className="h-2.5 w-2.5 text-slate-400" />
                            {item.agreementVersion}
                          </span>
                        </div>
                      </td>

                      {/* Tiền thực nhận */}
                      <td className="p-3.5 font-mono font-black text-sm text-slate-900">
                        {formatCurrencyVND(item.netPayoutAmount)}
                      </td>

                      {/* Badge trạng thái kèm Tooltip điều kiện thực tế */}
                      <td className="p-3.5">
                        <div className="relative group/badge inline-block" onClick={(e) => e.stopPropagation()}>
                          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold border ${meta.badgeColor} cursor-help`}>
                            {meta.label}
                            <HelpCircle className="h-3 w-3 opacity-60" />
                          </span>

                          {/* Tooltip Hover cho Badge */}
                          <div className="absolute left-0 bottom-full mb-1 z-30 hidden group-hover/badge:block w-64 rounded-xl bg-slate-900 p-2.5 text-[11px] text-white shadow-xl border border-slate-700 leading-relaxed pointer-events-none">
                            <strong className="block text-amber-300 font-bold mb-0.5">{meta.shortCondition}</strong>
                            <p className="text-slate-300 text-[10px] leading-tight">{meta.fullCondition}</p>
                          </div>
                        </div>
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
                  );
                })
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
