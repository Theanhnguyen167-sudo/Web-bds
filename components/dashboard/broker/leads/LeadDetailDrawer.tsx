'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  X, 
  User, 
  Phone, 
  Mail, 
  Coins, 
  Building2, 
  ShieldCheck, 
  Clock, 
  CalendarDays, 
  Plus, 
  MessageSquare, 
  PhoneCall, 
  Eye, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { LeadItem, LeadStage, LeadTimelineEntry } from '@/types/broker-lead';
import { formatCurrencyVND } from '@/lib/utils';

interface LeadDetailDrawerProps {
  lead: LeadItem | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStage: (leadId: string, newStage: Exclude<LeadStage, 'all'>) => void;
  onAddTimelineEntry: (leadId: string, entry: Omit<LeadTimelineEntry, 'id' | 'createdAt'>) => void;
  onOpenEvidence: (lead: LeadItem) => void;
}

export const LeadDetailDrawer: React.FC<LeadDetailDrawerProps> = ({
  lead,
  isOpen,
  onClose,
  onUpdateStage,
  onAddTimelineEntry,
  onOpenEvidence,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'timeline' | 'protection'>('profile');
  const [showFullPhone, setShowFullPhone] = useState(false);

  // Form thêm nhật ký chăm sóc
  const [newLogType, setNewLogType] = useState<'call' | 'message' | 'viewing' | 'note'>('call');
  const [newLogTitle, setNewLogTitle] = useState('');
  const [newLogContent, setNewLogContent] = useState('');

  if (!isOpen || !lead) return null;

  const handleAddLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLogContent.trim()) return;

    const defaultTitle = 
      newLogType === 'call' ? 'Cuộc gọi trao đổi' :
      newLogType === 'message' ? 'Nhắn tin tư vấn' :
      newLogType === 'viewing' ? 'Dẫn khách xem nhà' : 'Ghi chú nội bộ';

    onAddTimelineEntry(lead.id, {
      type: newLogType,
      title: newLogTitle.trim() || defaultTitle,
      content: newLogContent.trim(),
      authorName: 'Bạn (Chuyên viên)',
    });

    setNewLogTitle('');
    setNewLogContent('');
  };

  const stageLabels: Record<Exclude<LeadStage, 'all'>, { label: string; color: string }> = {
    pending_confirmation: { label: 'Chờ xác nhận', color: 'bg-slate-100 text-slate-800' },
    consulting: { label: 'Đang tư vấn', color: 'bg-blue-100 text-blue-800' },
    viewing: { label: 'Đang dẫn xem', color: 'bg-indigo-100 text-indigo-800' },
    negotiating: { label: 'Đang thương lượng', color: 'bg-amber-100 text-amber-800' },
    deposited: { label: 'Đã chốt cọc', color: 'bg-emerald-100 text-emerald-800' },
    expired: { label: 'Hết hạn bảo lưu', color: 'bg-rose-100 text-rose-800' },
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        <aside className="w-screen max-w-lg bg-white shadow-2xl border-l border-slate-200 flex flex-col">
          
          {/* Header Drawer */}
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 bg-slate-50">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-base leading-tight">
                  {lead.fullName}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${stageLabels[lead.stage].color}`}>
                  {stageLabels[lead.stage].label}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                BĐS: <strong className="font-mono text-blue-600">{lead.targetPropertyCode}</strong> • Mã khách #{lead.id}
              </p>
            </div>

            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200/60 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-200 px-5 bg-white text-xs font-bold">
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-3 px-3 border-b-2 transition-all ${
                activeTab === 'profile' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Hồ sơ nhu cầu
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              className={`py-3 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'timeline' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Nhật ký ({lead.timeline.length})
            </button>
            <button
              onClick={() => setActiveTab('protection')}
              className={`py-3 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'protection' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Bảo lưu 5 yếu tố
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            
            {/* TAB 1: HỒ SƠ NHU CẦU */}
            {activeTab === 'profile' && (
              <div className="space-y-4">
                
                {/* Thông tin liên hệ */}
                <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Số điện thoại:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900">
                        {showFullPhone && lead.rawPhone ? lead.rawPhone : lead.maskedPhone}
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowFullPhone(!showFullPhone)}
                        className="text-[11px] text-blue-600 hover:underline font-semibold"
                      >
                        {showFullPhone ? 'Ẩn' : 'Hiện số'}
                      </button>
                    </div>
                  </div>

                  {lead.email && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Email:</span>
                      <span className="text-slate-800 font-medium">{lead.email}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Ngân sách dự kiến:</span>
                    <span className="text-blue-700 font-extrabold text-sm">
                      {lead.budget ? formatCurrencyVND(lead.budget) : 'Chưa xác định'}
                    </span>
                  </div>
                </div>

                {/* BĐS quan tâm */}
                <div className="rounded-xl border border-slate-200 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Căn BĐS đang bảo lưu
                    </span>
                    <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {lead.targetPropertyCode}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    {lead.targetListingTitle}
                  </h4>
                  <Link
                    href={`/dashboard/broker/inventory`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline pt-1"
                  >
                    <Building2 className="h-3.5 w-3.5" />
                    <span>Xem chi tiết căn nhà trong kho</span>
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>

                {/* Đổi trạng thái phễu nhanh */}
                <div className="rounded-xl border border-slate-200 p-4 space-y-2">
                  <label className="block text-xs font-bold text-slate-700">
                    Cập nhật giai đoạn phễu chăm sóc:
                  </label>
                  <select
                    value={lead.stage}
                    onChange={(e) => onUpdateStage(lead.id, e.target.value as any)}
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="pending_confirmation">1. Chờ xác nhận thẩm định</option>
                    <option value="consulting">2. Đang tư vấn & gửi thông tin</option>
                    <option value="viewing">3. Đang dẫn xem nhà thực tế</option>
                    <option value="negotiating">4. Đang thương lượng giá / hợp đồng</option>
                    <option value="deposited">5. Đã chốt cọc thành công</option>
                    <option value="expired">6. Hết hạn bảo lưu</option>
                  </select>
                </div>

                {/* Việc cần làm tiếp theo */}
                <div className="rounded-xl bg-amber-50 border border-amber-200 p-3.5 text-xs text-amber-900">
                  <div className="font-bold mb-1 flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-amber-600" />
                    Việc cần làm tiếp theo:
                  </div>
                  <p>{lead.nextAction}</p>
                </div>

              </div>
            )}

            {/* TAB 2: TIMELINE NHẬT KÝ CHĂM SÓC */}
            {activeTab === 'timeline' && (
              <div className="space-y-5">
                
                {/* Form thêm nhật ký mới */}
                <form onSubmit={handleAddLogSubmit} className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 space-y-2.5">
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Plus className="h-4 w-4 text-blue-600" />
                    Ghi lại tương tác chăm sóc mới
                  </div>

                  <div className="grid grid-cols-4 gap-1 text-[11px]">
                    {[
                      { key: 'call', label: 'Cuộc gọi' },
                      { key: 'message', label: 'Tin nhắn' },
                      { key: 'viewing', label: 'Dẫn xem' },
                      { key: 'note', label: 'Ghi chú' },
                    ].map((t) => (
                      <button
                        key={t.key}
                        type="button"
                        onClick={() => setNewLogType(t.key as any)}
                        className={`py-1.5 rounded-lg font-semibold text-center transition-colors ${
                          newLogType === t.key
                            ? 'bg-blue-600 text-white shadow-2xs'
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>

                  <textarea
                    rows={2}
                    required
                    placeholder="Nội dung tương tác (VD: Gọi điện khách bảo cuối tuần xem nhà, đang thích view ban công...)"
                    value={newLogContent}
                    onChange={(e) => setNewLogContent(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-500"
                    >
                      Lưu nhật ký
                    </button>
                  </div>
                </form>

                {/* Danh sách nhật ký timeline */}
                <div className="relative border-l-2 border-slate-200 ml-3 space-y-4 text-xs">
                  {lead.timeline.map((entry) => (
                    <div key={entry.id} className="relative pl-5">
                      {/* Icon dot */}
                      <span className="absolute -left-2 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-white text-[9px] ring-4 ring-white">
                        ✓
                      </span>

                      <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-2xs space-y-1">
                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                          <span className="font-bold text-slate-800">{entry.title}</span>
                          <span>{new Date(entry.createdAt).toLocaleDateString('vi-VN')}</span>
                        </div>
                        <p className="text-slate-600 leading-relaxed">{entry.content}</p>
                        <div className="text-[10px] text-slate-400 font-medium pt-1 border-t border-slate-50">
                          Người tạo: {entry.authorName}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* TAB 3: THÔNG TIN XÁC NHẬN BẢO LƯU (5 YẾU TỐ) */}
            {activeTab === 'protection' && (
              <div className="space-y-4 text-xs">
                
                {/* Thời hạn bảo lưu */}
                <div className="rounded-xl bg-blue-50 border border-blue-200 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-blue-950 flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4 text-blue-600" />
                      Thời hạn bảo lưu quyền lợi:
                    </span>
                    <span className="font-bold text-blue-700 text-sm">
                      Còn {lead.protectionDaysRemaining} ngày
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    Hết hạn vào: <strong>{new Date(lead.protectionExpiresAt).toLocaleDateString('vi-VN')}</strong>.
                    Trong thời gian này, hoa hồng phát sinh từ căn {lead.targetPropertyCode} được bảo vệ độc quyền cho bạn.
                  </p>
                </div>

                {/* Khối 5 yếu tố chuẩn DDD */}
                <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
                  <h5 className="font-bold text-slate-900 border-b border-slate-100 pb-2">
                    5 Yếu tố cấu thành quyền bảo lưu HaNoi Realty:
                  </h5>

                  <div className="space-y-2 text-slate-700">
                    <div className="flex justify-between">
                      <span className="text-slate-500">1. Khách hàng:</span>
                      <strong>{lead.fullName} ({lead.maskedPhone})</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">2. BĐS cụ thể:</span>
                      <strong className="font-mono text-blue-600">{lead.targetPropertyCode}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">3. Chuyên viên giới thiệu:</span>
                      <strong>Bạn (Nguyễn Thế Anh)</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">4. Thời gian đăng ký:</span>
                      <span>{new Date(lead.createdAt).toLocaleDateString('vi-VN')}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">5. Bằng chứng kết nối:</span>
                      <button
                        type="button"
                        onClick={() => onOpenEvidence(lead)}
                        className="text-blue-600 hover:underline font-bold flex items-center gap-1"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        Xem bằng chứng đã nộp
                      </button>
                    </div>
                  </div>
                </div>

                {/* Nút hành động */}
                <div className="pt-2">
                  <Link
                    href={`/dashboard/broker/appointments?leadId=${lead.id}&listingId=${lead.targetListingId}`}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 font-bold text-white shadow hover:bg-blue-500"
                  >
                    <CalendarDays className="h-4 w-4" />
                    <span>Lên lịch hẹn dẫn xem căn này</span>
                  </Link>
                </div>

              </div>
            )}

          </div>

          {/* Footer Drawer */}
          <div className="border-t border-slate-200 bg-slate-50 p-4 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">
              Cập nhật lần cuối: {lead.lastContactAt}
            </span>
            <button
              onClick={onClose}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              Đóng
            </button>
          </div>

        </aside>
      </div>
    </div>
  );
};

