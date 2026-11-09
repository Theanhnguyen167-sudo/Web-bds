'use client';

import React, { useState, useMemo } from 'react';
import { 
  Briefcase, 
  Search, 
  LayoutGrid, 
  List, 
  Coins, 
  TrendingUp, 
  Filter, 
  Building2, 
  ShieldCheck, 
  Clock,
  Columns3
} from 'lucide-react';
import { DealItem, DealStage } from '@/types/broker-deal';
import { BrokerProfile } from '@/types/broker-nav';
import { formatCurrencyVND } from '@/lib/utils';
import { DealCard } from './DealCard';
import { DealDetailDrawer } from './DealDetailDrawer';

interface DealMasterListProps {
  initialDeals: DealItem[];
  profile: BrokerProfile;
}

export const DealMasterList: React.FC<DealMasterListProps> = ({
  initialDeals,
  profile,
}) => {
  const [deals, setDeals] = useState<DealItem[]>(initialDeals);
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [selectedDeal, setSelectedDeal] = useState<DealItem | null>(null);

  // Thống kê tổng
  const totalAgreedPrice = useMemo(
    () => deals.reduce((sum, d) => sum + d.agreedPrice, 0),
    [deals]
  );
  const totalCommissionPotential = useMemo(
    () => deals.reduce((sum, d) => sum + d.brokerCommissionShare, 0),
    [deals]
  );

  // Lọc dữ liệu theo search và tab
  const filteredDeals = useMemo(() => {
    return deals.filter((item) => {
      if (stageFilter !== 'all' && item.stage !== stageFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchCode = item.dealCode.toLowerCase().includes(q);
        const matchProp = item.propertyCode.toLowerCase().includes(q);
        const matchTitle = item.listingTitle.toLowerCase().includes(q);
        const matchBuyer = item.buyerName.toLowerCase().includes(q);
        if (!matchCode && !matchProp && !matchTitle && !matchBuyer) return false;
      }
      return true;
    });
  }, [deals, stageFilter, searchQuery]);

  // Gửi tin nhắn mới trong Drawer
  const handleSendMessage = (dealId: string, content: string) => {
    const newChat = {
      id: `chat_${Date.now()}`,
      senderName: profile.fullName,
      senderRole: 'broker' as const,
      senderRoleLabel: 'Chuyên viên CTV',
      content,
      timestamp: 'Vừa xong',
    };

    setDeals((prev) =>
      prev.map((d) =>
        d.id === dealId
          ? { ...d, chatLogs: [...d.chatLogs, newChat] }
          : d
      )
    );

    if (selectedDeal && selectedDeal.id === dealId) {
      setSelectedDeal((prev) =>
        prev ? { ...prev, chatLogs: [...prev.chatLogs, newChat] } : null
      );
    }
  };

  const kanbanColumns: { key: DealStage; label: string; color: string }[] = [
    { key: 'negotiation', label: '1. Thương lượng giá', color: 'border-blue-400 bg-blue-50/20' },
    { key: 'deposit_agreement', label: '2. Thỏa thuận cọc', color: 'border-amber-400 bg-amber-50/20' },
    { key: 'notarization', label: '3. Công chứng pháp lý', color: 'border-indigo-400 bg-indigo-50/20' },
    { key: 'handover_settlement', label: '4. Bàn giao & Đối soát', color: 'border-emerald-400 bg-emerald-50/20' },
  ];

  return (
    <div className="space-y-5">
      
      {/* 1. THẺ THỐNG KÊ TỔNG DÒNG TIỀN GIAO DỊCH */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Giao dịch đang quản lý
          </span>
          <div className="mt-2 text-2xl font-extrabold text-slate-900">
            {deals.length} Deal
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">
            Từ cọc tới công chứng và tất toán
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">
            Tổng giá trị giao dịch
          </span>
          <div className="mt-2 text-2xl font-extrabold text-blue-700">
            {formatCurrencyVND(totalAgreedPrice)}
          </div>
          <span className="text-[10px] text-blue-600 mt-1 block">
            Cam kết minh bạch không kê giá chênh
          </span>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-5 shadow-xs">
          <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider">
            Hoa hồng bảo lưu cho bạn
          </span>
          <div className="mt-2 text-2xl font-extrabold text-amber-800 font-mono">
            {formatCurrencyVND(totalCommissionPotential)}
          </div>
          <span className="text-[10px] text-amber-700 mt-1 block">
            Theo phiên bản thỏa thuận từng giao dịch
          </span>
        </div>
      </div>

      {/* 2. THANH CÔNG CỤ TOOLBAR */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        {/* Ô tìm kiếm */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo Mã Deal (DEAL-HN-xxxx), Mã BĐS, Tên khách hoặc tiêu đề..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Switch View (Kanban 4 cột vs Danh sách) */}
        <div className="flex items-center rounded-xl border border-slate-200 bg-slate-100 p-1 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setViewMode('kanban')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'kanban' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Columns3 className="h-4 w-4" />
            <span>Kanban 4 bước</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'list' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <List className="h-4 w-4" />
            <span>Danh sách</span>
          </button>
        </div>
      </div>

      {/* 3. HIỂN THỊ DẠNG KANBAN 4 CỘT */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
          {kanbanColumns.map((col) => {
            const colDeals = filteredDeals.filter((d) => d.stage === col.key);
            return (
              <div
                key={col.key}
                className={`rounded-2xl border-t-4 border border-slate-200 p-3.5 space-y-3 bg-slate-50/60 ${col.color}`}
              >
                <div className="flex items-center justify-between pb-1">
                  <h4 className="text-xs font-bold text-slate-800">{col.label}</h4>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700">
                    {colDeals.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {colDeals.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-[11px] text-slate-400">
                      Chưa có giao dịch ở giai đoạn này
                    </div>
                  ) : (
                    colDeals.map((deal) => (
                      <DealCard
                        key={deal.id}
                        deal={deal}
                        onSelect={(item) => setSelectedDeal(item)}
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* DẠNG DANH SÁCH */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDeals.map((deal) => (
            <DealCard
              key={deal.id}
              deal={deal}
              onSelect={(item) => setSelectedDeal(item)}
            />
          ))}
        </div>
      )}

      {/* 4. DRAWER CHI TIẾT DEAL */}
      <DealDetailDrawer
        deal={selectedDeal}
        isOpen={!!selectedDeal}
        onClose={() => setSelectedDeal(null)}
        onSendMessage={handleSendMessage}
      />

    </div>
  );
};

