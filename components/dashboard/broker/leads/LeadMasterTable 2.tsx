'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Plus, 
  ShieldAlert, 
  ShieldCheck, 
  Clock, 
  CalendarDays, 
  FileText, 
  Eye, 
  AlertTriangle, 
  Filter, 
  Building2, 
  CheckCircle2, 
  MoreHorizontal,
  Lock,
  ArrowRight
} from 'lucide-react';
import { LeadItem, LeadStage, ProtectionStatus } from '@/types/broker-lead';
import { BrokerProfile } from '@/types/broker-nav';
import { formatCurrencyVND } from '@/lib/utils';
import { LeadEvidencePreviewModal } from './LeadEvidencePreviewModal';
import { DuplicateCheckModal } from './DuplicateCheckModal';
import { RegisterLeadModal } from './RegisterLeadModal';
import { LeadDetailDrawer } from './LeadDetailDrawer';

interface LeadMasterTableProps {
  initialLeads: LeadItem[];
  profile: BrokerProfile;
  onRestrictedClick: (featureName: string) => void;
}

export const LeadMasterTable: React.FC<LeadMasterTableProps> = ({
  initialLeads,
  profile,
  onRestrictedClick,
}) => {
  const [leads, setLeads] = useState<LeadItem[]>(initialLeads);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<LeadStage>('all');

  // Modals & Drawer State
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false);
  const [previewEvidenceLead, setPreviewEvidenceLead] = useState<LeadItem | null>(null);
  const [selectedDrawerLead, setSelectedDrawerLead] = useState<LeadItem | null>(null);

  // Điều kiện được đăng ký khách mới (hồ sơ phải hợp lệ & gói không expired)
  const canRegisterNewLead =
    profile.verificationStatus === 'verified' && profile.subscriptionTier !== 'expired';

  // Lọc theo search và phễu
  const filteredLeads = useMemo(() => {
    return leads.filter((item) => {
      // 1. Phễu
      if (activeTab !== 'all' && item.stage !== activeTab) {
        return false;
      }
      // 2. Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = item.fullName.toLowerCase().includes(q);
        const matchPhone = item.maskedPhone.includes(q) || item.rawPhone?.includes(q);
        const matchProp = item.targetPropertyCode.toLowerCase().includes(q);
        if (!matchName && !matchPhone && !matchProp) return false;
      }
      return true;
    });
  }, [leads, activeTab, searchQuery]);

  // Cập nhật stage cho lead
  const handleUpdateStage = (leadId: string, newStage: Exclude<LeadStage, 'all'>) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, stage: newStage } : l))
    );
    if (selectedDrawerLead && selectedDrawerLead.id === leadId) {
      setSelectedDrawerLead((prev) => prev ? { ...prev, stage: newStage } : null);
    }
  };

  // Thêm entry timeline mới
  const handleAddTimelineEntry = (
    leadId: string,
    entry: Omit<import('@/types/broker-lead').LeadTimelineEntry, 'id' | 'createdAt'>
  ) => {
    const newEntry = {
      ...entry,
      id: `log_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    setLeads((prev) =>
      prev.map((l) =>
        l.id === leadId
          ? {
              ...l,
              lastContactAt: 'Vừa xong',
              timeline: [newEntry, ...l.timeline],
            }
          : l
      )
    );

    if (selectedDrawerLead && selectedDrawerLead.id === leadId) {
      setSelectedDrawerLead((prev) =>
        prev
          ? {
              ...prev,
              lastContactAt: 'Vừa xong',
              timeline: [newEntry, ...prev.timeline],
            }
          : null
      );
    }
  };

  const handleRegisterSuccess = (newLead: LeadItem) => {
    setLeads((prev) => [newLead, ...prev]);
  };

  // Render badge trạng thái bảo lưu
  const renderProtectionBadge = (status: ProtectionStatus, days: number) => {
    if (status === 'active') {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200">
          <ShieldCheck className="h-3 w-3 text-emerald-600" />
          Còn {days} ngày
        </span>
      );
    }
    if (status === 'warning') {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-700 border border-amber-200 animate-pulse">
          <Clock className="h-3 w-3 text-amber-600" />
          Sắp hết hạn ({days} ngày)
        </span>
      );
    }
    if (status === 'disputed') {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2 py-0.5 text-[11px] font-bold text-purple-700 border border-purple-200">
          <AlertTriangle className="h-3 w-3 text-purple-600" />
          Đang đối soát
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-500 border border-slate-200">
        Hết hạn bảo lưu
      </span>
    );
  };

  const tabs: { key: LeadStage; label: string; count?: number }[] = [
    { key: 'all', label: 'Tất cả khách', count: leads.length },
    { key: 'pending_confirmation', label: 'Chờ xác nhận', count: leads.filter(l => l.stage === 'pending_confirmation').length },
    { key: 'consulting', label: 'Đang tư vấn', count: leads.filter(l => l.stage === 'consulting').length },
    { key: 'viewing', label: 'Đang dẫn xem', count: leads.filter(l => l.stage === 'viewing').length },
    { key: 'negotiating', label: 'Đang thương lượng', count: leads.filter(l => l.stage === 'negotiating').length },
    { key: 'deposited', label: 'Đã chốt cọc', count: leads.filter(l => l.stage === 'deposited').length },
    { key: 'expired', label: 'Hết hạn', count: leads.filter(l => l.stage === 'expired').length },
  ];

  return (
    <div className="space-y-4">
      
      {/* 1. THANH CÔNG CỤ TOOLBAR */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        {/* Ô tìm kiếm */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo Tên khách hàng, SĐT, hoặc Mã BĐS..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Nút tác vụ */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Nút tra cứu khiếu nại trùng khách */}
          <button
            type="button"
            onClick={() => setIsDuplicateModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <ShieldAlert className="h-4 w-4 text-indigo-600" />
            <span>Tra cứu trùng khách</span>
          </button>

          {/* Nút đăng ký khách mới (có kiểm tra quyền) */}
          <button
            type="button"
            onClick={() => {
              if (!canRegisterNewLead) {
                onRestrictedClick('Đăng ký khách giới thiệu mới');
                return;
              }
              setIsRegisterModalOpen(true);
            }}
            className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all shadow-xs ${
              canRegisterNewLead
                ? 'bg-blue-600 text-white hover:bg-blue-500'
                : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
            }`}
          >
            {canRegisterNewLead ? (
              <Plus className="h-4 w-4" />
            ) : (
              <Lock className="h-3.5 w-3.5" />
            )}
            <span>+ Đăng ký bảo lưu khách mới</span>
          </button>
        </div>
      </div>

      {/* 2. THANH TAB LỌC THEO PHỄU */}
      <div className="flex overflow-x-auto gap-1 border-b border-slate-200 bg-white p-1.5 rounded-2xl shadow-2xs no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === tab.key
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  activeTab === tab.key ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* 3. BẢNG HIỂN THỊ DANH SÁCH KHÁCH HÀNG */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-700 font-semibold">
                <th className="p-3.5 pl-5">Khách hàng & SĐT</th>
                <th className="p-3.5">Mã BĐS quan tâm</th>
                <th className="p-3.5">Bảo lưu độc quyền</th>
                <th className="p-3.5 text-center">Bằng chứng</th>
                <th className="p-3.5">Lần chăm sóc cuối</th>
                <th className="p-3.5">Việc cần làm tiếp theo</th>
                <th className="p-3.5 pr-5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-500">
                    <FileText className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                    Không tìm thấy khách hàng nào trong phễu này.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-blue-50/40 transition-colors cursor-pointer group"
                    onClick={() => setSelectedDrawerLead(item)}
                  >
                    {/* Tên khách & SĐT */}
                    <td className="p-3.5 pl-5">
                      <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {item.fullName}
                      </div>
                      <div className="font-mono text-[11px] text-slate-500 mt-0.5">
                        {item.maskedPhone}
                      </div>
                    </td>

                    {/* BĐS quan tâm */}
                    <td className="p-3.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {item.targetPropertyCode}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 line-clamp-1 max-w-[180px] mt-0.5">
                        {item.targetListingTitle}
                      </div>
                    </td>

                    {/* Badge trạng thái bảo lưu */}
                    <td className="p-3.5">
                      {renderProtectionBadge(item.protectionStatus, item.protectionDaysRemaining)}
                    </td>

                    {/* Bằng chứng kết nối */}
                    <td className="p-3.5 text-center" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => setPreviewEvidenceLead(item)}
                        className="inline-flex items-center justify-center p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-100"
                        title="Xem bằng chứng tin nhắn hẹn"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>

                    {/* Lần chăm sóc cuối */}
                    <td className="p-3.5 text-slate-600">
                      {item.lastContactAt}
                    </td>

                    {/* Việc cần làm tiếp theo */}
                    <td className="p-3.5 max-w-[200px]">
                      <div className="text-slate-800 line-clamp-1 font-medium">
                        {item.nextAction}
                      </div>
                    </td>

                    {/* Thao tác */}
                    <td className="p-3.5 pr-5 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/dashboard/broker/appointments?leadId=${item.id}&listingId=${item.targetListingId}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-[11px] font-semibold border border-blue-200"
                          title="Lên lịch dẫn khách xem"
                        >
                          <CalendarDays className="h-3.5 w-3.5" />
                          <span>Lịch hẹn</span>
                        </Link>
                        <button
                          type="button"
                          onClick={() => setSelectedDrawerLead(item)}
                          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                        >
                          <MoreHorizontal className="h-4 w-4" />
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

      {/* MODAL 1: XEM ẢNH BẰNG CHỨNG */}
      <LeadEvidencePreviewModal
        lead={previewEvidenceLead}
        onClose={() => setPreviewEvidenceLead(null)}
      />

      {/* MODAL 2: TRA CỨU TRÙNG KHÁCH */}
      <DuplicateCheckModal
        isOpen={isDuplicateModalOpen}
        onClose={() => setIsDuplicateModalOpen(false)}
      />

      {/* MODAL 3: ĐĂNG KÝ BẢO LƯU KHÁCH MỚI */}
      <RegisterLeadModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onSuccess={handleRegisterSuccess}
      />

      {/* DRAWER CHI TIẾT KHÁCH HÀNG */}
      <LeadDetailDrawer
        lead={selectedDrawerLead}
        isOpen={!!selectedDrawerLead}
        onClose={() => setSelectedDrawerLead(null)}
        onUpdateStage={handleUpdateStage}
        onAddTimelineEntry={handleAddTimelineEntry}
        onOpenEvidence={(lead) => setPreviewEvidenceLead(lead)}
      />

    </div>
  );
};

