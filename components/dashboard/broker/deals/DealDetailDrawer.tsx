'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  Building2, 
  User, 
  ShieldCheck, 
  FileText, 
  Download, 
  Send, 
  MessageSquare, 
  Coins, 
  Lock, 
  ExternalLink,
  Landmark,
  FileCheck2
} from 'lucide-react';
import { DealItem, DealStage } from '@/types/broker-deal';
import { formatCurrencyVND } from '@/lib/utils';

interface DealDetailDrawerProps {
  deal: DealItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSendMessage: (dealId: string, message: string) => void;
}

export const DealDetailDrawer: React.FC<DealDetailDrawerProps> = ({
  deal,
  isOpen,
  onClose,
  onSendMessage,
}) => {
  const [activeTab, setActiveTab] = useState<'progress' | 'fees' | 'documents' | 'chat'>('progress');
  const [chatInput, setChatInput] = useState('');

  if (!isOpen || !deal) return null;

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    onSendMessage(deal.id, chatInput.trim());
    setChatInput('');
  };

  const stagesOrder: { key: DealStage; label: string; number: number }[] = [
    { key: 'negotiation', label: 'Thương lượng giá', number: 1 },
    { key: 'deposit_agreement', label: 'Thỏa thuận cọc', number: 2 },
    { key: 'notarization', label: 'Công chứng pháp lý', number: 3 },
    { key: 'handover_settlement', label: 'Bàn giao & Đối soát', number: 4 },
  ];

  const currentStageIndex = stagesOrder.findIndex((s) => s.key === deal.stage);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        <aside className="w-screen max-w-xl bg-white shadow-2xl border-l border-slate-200 flex flex-col">
          
          {/* Header Drawer */}
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 bg-slate-50">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-black text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                  {deal.dealCode}
                </span>
                <span className="text-xs font-bold text-slate-500 font-mono">
                  #{deal.propertyCode}
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base mt-1 line-clamp-1">
                {deal.listingTitle}
              </h3>
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
              onClick={() => setActiveTab('progress')}
              className={`py-3 px-3 border-b-2 transition-all ${
                activeTab === 'progress' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Tiến độ 4 bước
            </button>
            <button
              onClick={() => setActiveTab('fees')}
              className={`py-3 px-3 border-b-2 transition-all ${
                activeTab === 'fees' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Phân rã phí & Hoa hồng
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`py-3 px-3 border-b-2 transition-all flex items-center gap-1 ${
                activeTab === 'documents' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Hồ sơ ({deal.documents.length})
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`py-3 px-3 border-b-2 transition-all flex items-center gap-1 ${
                activeTab === 'chat' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Trao đổi ({deal.chatLogs.length})
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            
            {/* TAB 1: TIẾN ĐỘ 4 BƯỚC (STEP TRACKER) */}
            {activeTab === 'progress' && (
              <div className="space-y-6">
                
                {/* Horizontal Step Tracker Bar */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                  <div className="flex items-center justify-between relative">
                    <div className="absolute top-3.5 left-4 right-4 h-0.5 bg-slate-200 -z-0" />
                    {stagesOrder.map((step, idx) => {
                      const isPast = idx < currentStageIndex;
                      const isCurrent = idx === currentStageIndex;
                      return (
                        <div key={step.key} className="relative z-10 flex flex-col items-center text-center">
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
                              isPast
                                ? 'bg-emerald-600 text-white ring-4 ring-emerald-50'
                                : isCurrent
                                ? 'bg-blue-600 text-white ring-4 ring-blue-100 animate-pulse'
                                : 'bg-white border-2 border-slate-300 text-slate-400'
                            }`}
                          >
                            {isPast ? '✓' : step.number}
                          </div>
                          <span
                            className={`mt-1.5 text-[10px] font-bold max-w-[70px] leading-tight ${
                              isCurrent ? 'text-blue-700' : isPast ? 'text-slate-800' : 'text-slate-400'
                            }`}
                          >
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Danh sách Milestone chi tiết */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Nhật ký mốc thời gian giao dịch
                  </h4>

                  <div className="space-y-2.5">
                    {deal.milestones.map((m, mIdx) => (
                      <div
                        key={mIdx}
                        className={`rounded-xl border p-3.5 text-xs transition-all ${
                          m.isCompleted
                            ? 'border-emerald-200 bg-emerald-50/40'
                            : m.stage === deal.stage
                            ? 'border-blue-300 bg-blue-50/40 shadow-xs'
                            : 'border-slate-200 bg-white opacity-70'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 flex items-center gap-1.5">
                            {m.isCompleted ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                            ) : (
                              <Clock className="h-4 w-4 text-blue-600 shrink-0" />
                            )}
                            {m.title}
                          </span>

                          <span className="font-mono text-[10px] text-slate-500">
                            {m.completedAt
                              ? new Date(m.completedAt).toLocaleDateString('vi-VN')
                              : m.targetDate
                              ? `Mục tiêu: ${new Date(m.targetDate).toLocaleDateString('vi-VN')}`
                              : 'Chưa thực hiện'}
                          </span>
                        </div>

                        {m.note && (
                          <p className="mt-2 text-slate-600 text-[11px] leading-relaxed pl-5">
                            {m.note}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Thông tin 3 bên */}
                <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-2.5 text-xs">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Đầu mối phụ trách 3 bên:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 text-[10px] block">Khách mua:</span>
                      <strong className="text-slate-800">{deal.buyerName}</strong>
                      <div className="font-mono text-slate-500 text-[11px]">{deal.buyerMaskedPhone}</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 text-[10px] block">Chủ nhà:</span>
                      <strong className="text-slate-800">{deal.sellerName}</strong>
                      <div className="font-mono text-slate-500 text-[11px]">{deal.sellerPhone}</div>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-blue-50/60 border border-blue-100">
                    <span className="text-blue-600 text-[10px] block font-semibold">Admin điều phối & Pháp chế:</span>
                    <strong className="text-blue-900">{deal.adminCoordinator}</strong>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 2: PHÂN RÃ PHÍ & HOA HỒNG */}
            {activeTab === 'fees' && (
              <div className="space-y-4 text-xs">
                
                {/* Thẻ Tổng kết dòng tiền */}
                <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-blue-950 p-5 text-white space-y-3 shadow-md">
                  <span className="text-xs font-semibold text-blue-200 uppercase tracking-wider block">
                    Phân rã dòng tiền giao dịch
                  </span>
                  <div className="flex items-baseline justify-between border-b border-white/10 pb-3">
                    <span className="text-xs text-slate-300">Giá trị giao dịch chốt:</span>
                    <span className="text-xl font-black text-white font-mono">
                      {formatCurrencyVND(deal.agreedPrice)}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between border-b border-white/10 pb-3">
                    <span className="text-xs text-slate-300">
                      Tổng phí môi giới thu sàn ({deal.totalCommissionRate}%):
                    </span>
                    <span className="text-base font-bold text-blue-300 font-mono">
                      {formatCurrencyVND(deal.totalCommissionAmount)}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between pt-1">
                    <div>
                      <span className="text-xs font-bold text-amber-300 block">
                        Khoản môi giới được nhận:
                      </span>
                      <span className="text-[10px] text-slate-300">
                        Lưu theo phiên bản thỏa thuận chốt
                      </span>
                    </div>
                    <span className="text-2xl font-black text-amber-400 font-mono">
                      {formatCurrencyVND(deal.brokerCommissionShare)}
                    </span>
                  </div>
                </div>

                {/* Phiên bản thỏa thuận */}
                <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-1.5">
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Phiên bản thỏa thuận áp dụng:</div>
                  <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <FileCheck2 className="h-4 w-4 text-blue-600" />
                    <span>{deal.agreementVersion}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 pt-1 leading-relaxed">
                    Quy chuẩn HaNoi Realty: Tỷ lệ phân chia được lưu cố định theo phiên bản thỏa thuận tại thời điểm ký kết giao dịch, không bị thay đổi bởi các điều chỉnh chính sách sau này.
                  </p>
                </div>

                {/* Giải pháp ngân hàng trung gian */}
                {deal.escrowBankName && (
                  <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 space-y-1">
                    <div className="font-bold text-emerald-950 flex items-center gap-1.5">
                      <Landmark className="h-4 w-4 text-emerald-700" />
                      Cơ chế tiền bảo đảm:
                    </div>
                    <p className="text-emerald-900 text-[11px] leading-relaxed">
                      {deal.escrowBankName}: Tiền cọc và dòng tiền giao dịch được định hướng phong tỏa an toàn qua tài khoản trung gian, chỉ giải ngân cho các bên khi hoàn tất đầy đủ hồ sơ công chứng và bàn giao.
                    </p>
                  </div>
                )}

              </div>
            )}

            {/* TAB 3: DANH SÁCH TÀI LIỆU HỒ SƠ */}
            {activeTab === 'documents' && (
              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">Tài liệu pháp lý gắn liền với Deal:</span>
                </div>

                {deal.documents.length === 0 ? (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-400">
                    <FileText className="h-8 w-8 mx-auto mb-1 text-slate-300" />
                    Chưa có tài liệu đính kèm nào được tải lên
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {deal.documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="rounded-xl border border-slate-200 bg-white p-3.5 flex items-center justify-between hover:border-blue-400 transition-colors shadow-2xs"
                      >
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                            <FileText className="h-5 w-5" />
                          </span>
                          <div>
                            <div className="font-bold text-slate-900 line-clamp-1">{doc.name}</div>
                            <div className="text-[11px] text-slate-500">
                              {doc.docTypeLabel} • {doc.fileSize} • Đăng bởi: {doc.uploadedBy}
                            </div>
                          </div>
                        </div>

                        <a
                          href={doc.fileUrl}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          <Download className="h-3.5 w-3.5 text-blue-600" />
                          <span>Tải về</span>
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: NHẬT KÝ THAO TÁC / TRAO ĐỔI VỚI ADMIN SÀN */}
            {activeTab === 'chat' && (
              <div className="space-y-4 flex flex-col h-full text-xs">
                <div className="rounded-xl bg-slate-50 p-3 text-[11px] text-slate-600 border border-slate-200">
                  Kênh trao đổi nghiệp vụ bảo mật trực tiếp giữa Chuyên viên CTV và Ban Pháp chế/Admin phụ trách giao dịch.
                </div>

                {/* Chat message list */}
                <div className="space-y-3 min-h-[220px]">
                  {deal.chatLogs.length === 0 ? (
                    <div className="text-center text-slate-400 py-8">Chưa có tin nhắn trao đổi nào.</div>
                  ) : (
                    deal.chatLogs.map((log) => (
                      <div
                        key={log.id}
                        className={`rounded-xl p-3 max-w-[85%] ${
                          log.senderRole === 'broker'
                            ? 'ml-auto bg-blue-600 text-white'
                            : 'mr-auto bg-slate-100 text-slate-900 border border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3 text-[10px] opacity-80 mb-1">
                          <span className="font-bold">{log.senderName} ({log.senderRoleLabel})</span>
                          <span>{log.timestamp}</span>
                        </div>
                        <p className="leading-relaxed text-xs">{log.content}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Form gửi tin nhắn */}
                <form onSubmit={handleSendChat} className="flex gap-2 pt-2 border-t border-slate-100">
                  <input
                    type="text"
                    placeholder="Gửi câu hỏi hoặc thông báo tiến độ cho Admin..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    className="flex-1 rounded-xl border border-slate-300 px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="rounded-xl bg-blue-600 px-4 py-2 text-white hover:bg-blue-500 shadow-xs flex items-center justify-center"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </div>
            )}

          </div>

          {/* Footer Drawer */}
          <div className="border-t border-slate-200 bg-slate-50 p-4 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">
              Mã giao dịch: <strong className="font-mono text-slate-700">{deal.dealCode}</strong>
            </span>
            <button
              onClick={onClose}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              Đóng phòng deal
            </button>
          </div>

        </aside>
      </div>
    </div>
  );
};

