'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  BookmarkCheck, 
  Trash2, 
  FileText, 
  CalendarDays, 
  Edit3, 
  Check, 
  Save, 
  Building2, 
  ArrowRight,
  ExternalLink,
  Coins,
  ShieldCheck,
  CheckSquare,
  Square
} from 'lucide-react';
import { BrokerListing } from '@/types/broker-listing';
import { BrokerProfile } from '@/types/broker-nav';
import { formatCurrencyVND } from '@/lib/utils';
import { PortfolioCompareModal } from './PortfolioCompareModal';

interface CuratedListingsProps {
  listings: BrokerListing[];
  profile: BrokerProfile;
  onRemoveCurated: (id: string) => void;
  onUpdateNote: (id: string, note: string) => void;
  onOpenMarketingKit: (listing: BrokerListing) => void;
  onGoToOpenPool: () => void;
}

export const CuratedListings: React.FC<CuratedListingsProps> = ({
  listings,
  profile,
  onRemoveCurated,
  onUpdateNote,
  onOpenMarketingKit,
  onGoToOpenPool,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [tempNote, setTempNote] = useState<string>('');
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // Chỉ lấy các căn đã được đánh dấu isCurated
  const curatedList = listings.filter((l) => l.isCurated);

  const handleStartEditNote = (listing: BrokerListing) => {
    setEditingNoteId(listing.id);
    setTempNote(listing.privateNote || '');
  };

  const handleSaveNote = (id: string) => {
    onUpdateNote(id, tempNote);
    setEditingNoteId(null);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedIds.length === curatedList.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(curatedList.map((l) => l.id));
    }
  };

  const selectedListings = curatedList.filter((l) => selectedIds.includes(l.id));

  return (
    <div className="space-y-5">
      {/* Thanh công cụ quản lý Tủ hàng */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={selectAll}
            className="flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-blue-600"
          >
            {selectedIds.length === curatedList.length && curatedList.length > 0 ? (
              <CheckSquare className="h-4 w-4 text-blue-600" />
            ) : (
              <Square className="h-4 w-4 text-slate-400" />
            )}
            <span>Chọn tất cả ({selectedIds.length}/{curatedList.length})</span>
          </button>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            disabled={selectedIds.length === 0}
            onClick={() => setIsCompareModalOpen(true)}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all shadow-xs ${
              selectedIds.length > 0
                ? 'bg-blue-600 text-white hover:bg-blue-500'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>Xuất Portfolio so sánh ({selectedIds.length})</span>
          </button>
        </div>
      </div>

      {/* Danh sách BĐS trong Tủ hàng cá nhân */}
      {curatedList.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-xs">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
            <BookmarkCheck className="h-7 w-7" />
          </div>
          <h3 className="mt-4 text-base font-bold text-slate-900">
            Tủ hàng cá nhân đang trống
          </h3>
          <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
            Hãy khám phá Kho nhà chung và bấm <strong>[Lưu vào tủ]</strong> để tiện theo dõi các căn mục tiêu và ghi chú chăm sóc khách hàng.
          </p>
          <button
            type="button"
            onClick={onGoToOpenPool}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow hover:bg-blue-500"
          >
            <Building2 className="h-4 w-4" />
            Khám phá Kho nhà chung ngay
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {curatedList.map((item) => {
            const isSelected = selectedIds.includes(item.id);
            const isEditing = editingNoteId === item.id;

            return (
              <div
                key={item.id}
                className={`rounded-2xl border bg-white p-4 sm:p-5 transition-all shadow-xs ${
                  isSelected ? 'border-blue-500 ring-2 ring-blue-500/10' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Checkbox & Thumbnail */}
                  <div className="flex items-start gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={() => toggleSelect(item.id)}
                      className="mt-1 p-0.5 text-slate-400 hover:text-blue-600"
                    >
                      {isSelected ? (
                        <CheckSquare className="h-5 w-5 text-blue-600" />
                      ) : (
                        <Square className="h-5 w-5 text-slate-400" />
                      )}
                    </button>

                    <div className="relative h-28 w-36 overflow-hidden rounded-xl bg-slate-100">
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                      <span className="absolute top-1.5 left-1.5 rounded bg-black/70 px-1.5 py-0.5 font-mono text-[9px] font-bold text-white">
                        {item.propertyCode}
                      </span>
                    </div>
                  </div>

                  {/* Thông tin BĐS */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm md:text-base line-clamp-1">
                            {item.title}
                          </h4>
                          <p className="text-xs text-slate-500 mt-0.5">
                            📍 {item.address}
                          </p>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="text-base font-extrabold text-blue-700">
                            {formatCurrencyVND(item.price)}
                          </div>
                          <div className="text-[11px] text-slate-500 font-medium">
                            {item.area} m² • {(item.pricePerM2 / 1_000_000).toFixed(1)} tr/m²
                          </div>
                        </div>
                      </div>

                      {/* Thông số kỹ thuật & Hoa hồng */}
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                        <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-medium">
                          {item.floors || 4} tầng • {item.bedrooms || 3}PN • Hướng {item.direction || 'Đông Nam'}
                        </span>
                        <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200 font-semibold flex items-center gap-1">
                          <ShieldCheck className="h-3 w-3" />
                          {item.legalStatus}
                        </span>
                        <span className="bg-amber-50 text-amber-900 px-2 py-0.5 rounded border border-amber-200 font-bold flex items-center gap-1">
                          <Coins className="h-3 w-3 text-amber-600" />
                          HH: {item.commissionRate}% (~{formatCurrencyVND(item.estimatedCommissionAmount)})
                        </span>
                      </div>
                    </div>

                    {/* Khối Ghi chú cá nhân (Private Notes) */}
                    <div className="mt-3 rounded-xl bg-amber-50/50 border border-amber-200/60 p-3">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-bold text-amber-900 flex items-center gap-1">
                          <Edit3 className="h-3 w-3 text-amber-600" />
                          Ghi chú riêng tư của bạn (Khách không nhìn thấy)
                        </span>
                        {!isEditing && (
                          <button
                            type="button"
                            onClick={() => handleStartEditNote(item)}
                            className="text-[10px] font-semibold text-amber-800 hover:underline"
                          >
                            Chỉnh sửa
                          </button>
                        )}
                      </div>

                      {isEditing ? (
                        <div className="space-y-2">
                          <textarea
                            value={tempNote}
                            onChange={(e) => setTempNote(e.target.value)}
                            placeholder="Nhập ghi chú cá nhân (VD: Khách anh Tuấn thích vị trí này, chủ đồng ý giảm 50tr nếu cọc sớm...)"
                            rows={2}
                            className="w-full rounded-lg border border-amber-300 bg-white p-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setEditingNoteId(null)}
                              className="px-2.5 py-1 text-[11px] text-slate-600 hover:text-slate-800"
                            >
                              Hủy
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSaveNote(item.id)}
                              className="inline-flex items-center gap-1 rounded-lg bg-amber-600 px-3 py-1 text-[11px] font-bold text-white hover:bg-amber-500"
                            >
                              <Save className="h-3 w-3" />
                              Lưu ghi chú
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-700 italic">
                          {item.privateNote || 'Chưa có ghi chú nào. Bấm "Chỉnh sửa" để thêm lưu ý về căn này.'}
                        </p>
                      )}
                    </div>

                    {/* Hàng nút tác vụ nhanh */}
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/dashboard/broker/crm?action=register&listingId=${item.id}&propertyCode=${item.propertyCode}`}
                          className="inline-flex items-center gap-1 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-500 shadow-2xs"
                        >
                          <BookmarkCheck className="h-3.5 w-3.5" />
                          <span>Đăng ký khách xem căn này</span>
                        </Link>

                        <button
                          type="button"
                          onClick={() => onOpenMarketingKit(item)}
                          className="inline-flex items-center gap-1 rounded-xl border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                        >
                          <span>Marketing Kit</span>
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => onRemoveCurated(item.id)}
                        className="inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-medium p-1"
                        title="Bỏ theo dõi căn này"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Xóa khỏi tủ</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal So sánh Portfolio */}
      <PortfolioCompareModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        listings={selectedListings}
        profile={profile}
      />
    </div>
  );
};

