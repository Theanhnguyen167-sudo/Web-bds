'use client';

import React, { useState } from 'react';
import { X, Check, Copy, FileText, Printer, Building2, ShieldCheck } from 'lucide-react';
import { BrokerListing } from '@/types/broker-listing';
import { BrokerProfile } from '@/types/broker-nav';
import { formatCurrencyVND } from '@/lib/utils';

interface PortfolioCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  listings: BrokerListing[];
  profile: BrokerProfile;
}

export const PortfolioCompareModal: React.FC<PortfolioCompareModalProps> = ({
  isOpen,
  onClose,
  listings,
  profile,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || listings.length === 0) return null;

  // Tổng hợp văn bản so sánh gửi khách hàng
  const compareText = `📋 BẢNG SO SÁNH BẤT ĐỘNG SẢN MỤC TIÊU
Chuyên viên phụ trách: ${profile.fullName} - SĐT: ${profile.phone}
--------------------------------------------------
${listings.map((l, i) => `
[${i + 1}] Mã BĐS: ${l.propertyCode}
- Tên: ${l.title}
- Vị trí: ${l.address}
- Giá: ${formatCurrencyVND(l.price)} (${(l.price / 1_000_000_000).toFixed(2)} tỷ)
- Diện tích: ${l.area}m² (Đơn giá: ${(l.pricePerM2 / 1_000_000).toFixed(1)} tr/m²)
- Kết cấu: ${l.floors || 4} tầng | ${l.bedrooms || 3} phòng ngủ | ${l.bathrooms || 3} vệ sinh
- Hướng: ${l.direction || 'Đông Nam'} | Mặt tiền: ${l.frontageWidth || 5}m
- Pháp lý: ${l.legalStatus}
- Link thẩm định: https://hanoirealty.vn/listings/${l.id}?ref=${profile.referralCode || profile.brokerCode}
`).join('\n--------------------------------------------------')}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(compareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative flex flex-col w-full max-w-4xl max-h-[90vh] rounded-2xl bg-white shadow-2xl border border-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3.5 bg-slate-50">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
              <FileText className="h-4 w-4" />
            </span>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-tight">
                Bảng So Sánh Portfolio ({listings.length} căn BĐS)
              </h3>
              <p className="text-slate-500 text-xs">
                Tổng hợp thông số kỹ thuật và pháp lý để gửi tư vấn cho khách hàng
              </p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200/60">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Bảng so sánh dạng ma trận */}
        <div className="flex-1 overflow-x-auto overflow-y-auto p-5">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-700">
                <th className="p-3 font-semibold min-w-[130px]">Tiêu chí</th>
                {listings.map((l) => (
                  <th key={l.id} className="p-3 font-semibold min-w-[220px]">
                    <div className="font-mono text-[10px] text-blue-600 font-bold">{l.propertyCode}</div>
                    <div className="font-bold text-slate-900 text-xs line-clamp-1">{l.title}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="p-3 font-medium text-slate-500 bg-slate-50/50">Ảnh minh họa</td>
                {listings.map((l) => (
                  <td key={l.id} className="p-3">
                    <img src={l.images[0]} alt={l.title} className="h-20 w-32 object-cover rounded-lg" />
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-medium text-slate-500 bg-slate-50/50">Giá bán</td>
                {listings.map((l) => (
                  <td key={l.id} className="p-3 font-extrabold text-blue-700 text-sm">
                    {formatCurrencyVND(l.price)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-medium text-slate-500 bg-slate-50/50">Diện tích & Đơn giá</td>
                {listings.map((l) => (
                  <td key={l.id} className="p-3 text-slate-800">
                    <strong>{l.area} m²</strong> ({(l.pricePerM2 / 1_000_000).toFixed(1)} tr/m²)
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-medium text-slate-500 bg-slate-50/50">Vị trí quận/huyện</td>
                {listings.map((l) => (
                  <td key={l.id} className="p-3 text-slate-700">{l.district}</td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-medium text-slate-500 bg-slate-50/50">Kết cấu & Hướng</td>
                {listings.map((l) => (
                  <td key={l.id} className="p-3 text-slate-700">
                    {l.floors || 4} tầng • {l.bedrooms || 3}PN • Hướng {l.direction || 'Đông Nam'}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-medium text-slate-500 bg-slate-50/50">Pháp lý & Quy hoạch</td>
                {listings.map((l) => (
                  <td key={l.id} className="p-3 text-slate-700">
                    <div className="flex items-center gap-1 text-emerald-700 font-semibold mb-0.5">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      {l.legalStatus}
                    </div>
                    <div className="text-[11px] text-slate-500">{l.planningZone}</div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-5 py-3">
          <span className="text-xs text-slate-500">
            Đã gắn thông tin cá nhân của chuyên viên: <strong>{profile.fullName}</strong>
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500 shadow"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Đã sao chép bảng so sánh!' : 'Sao chép văn bản gửi khách'}
            </button>
            <button
              onClick={onClose}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700"
            >
              Đóng
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

