'use client';

import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Download, 
  Share2, 
  Sparkles, 
  FileText, 
  Image as ImageIcon,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { BrokerListing } from '@/types/broker-listing';
import { BrokerProfile } from '@/types/broker-nav';
import { formatCurrencyVND } from '@/lib/utils';

interface MarketingKitModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: BrokerListing | null;
  profile: BrokerProfile;
}

export const MarketingKitModal: React.FC<MarketingKitModalProps> = ({
  isOpen,
  onClose,
  listing,
  profile,
}) => {
  const [copiedText, setCopiedText] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState<'text' | 'photos'>('text');

  if (!isOpen || !listing) return null;

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://hanoirealty.vn';
  const referralLink = `${origin}/listings/${listing.id}?ref=${encodeURIComponent(profile.referralCode || profile.brokerCode)}`;

  // Đoạn văn bài đăng soạn sẵn theo chuẩn Zalo / Facebook cho môi giới
  const marketingPitch = `🏠 SIÊU PHẨM ${listing.title.toUpperCase()}
📍 Vị trí đắc địa: ${listing.address}
💰 Giá bán: ${formatCurrencyVND(listing.price)} (${(listing.price / 1_000_000_000).toFixed(2)} tỷ)
📐 Diện tích: ${listing.area}m² | Mặt tiền: ${listing.frontageWidth || 5}m | Kết cấu: ${listing.floors || 4} tầng (${listing.bedrooms || 3}PN - ${listing.bathrooms || 3}WC)
📜 Pháp lý: ${listing.legalStatus}
🔍 Quy hoạch: ${listing.planningZone || 'Đã kiểm tra an toàn theo quy hoạch phân khu'}

✨ Điểm nổi bật:
- Nhà xây tâm huyết, ngõ thông thoáng, giao thông thuận tiện.
- Khu dân trí cao, an ninh tốt, gần trường học, bệnh viện và tiện ích lớn.
- Chủ nhà thiện chí, giao dịch minh bạch, hỗ trợ sang tên nhanh chóng.

📞 Liên hệ tư vấn & xem nhà thực tế miễn phí 24/7:
👤 Chuyên viên tư vấn: ${profile.fullName} (Mã CV: ${profile.brokerCode})
📱 Hotline/Zalo: ${profile.phone}
🌐 Xem chi tiết hồ sơ thẩm định BĐS tại: ${referralLink}`;

  const handleCopyPitch = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(marketingPitch);
      } else {
        const ta = document.createElement('textarea');
        ta.value = marketingPitch;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative flex flex-col w-full max-w-2xl max-h-[90vh] rounded-2xl bg-white shadow-2xl border border-slate-100 overflow-hidden">
        
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3.5 bg-slate-50/80">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
              <Sparkles className="h-4 w-4" />
            </span>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-tight">
                Bộ Tiếp Thị (Marketing Kit)
              </h3>
              <p className="text-slate-500 text-xs font-mono">
                {listing.propertyCode} • {listing.title.slice(0, 40)}...
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 transition-colors"
            aria-label="Đóng"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab selection */}
        <div className="flex border-b border-slate-200 px-5 bg-white">
          <button
            onClick={() => setActiveTab('text')}
            className={`flex items-center gap-2 py-3 px-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'text'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <FileText className="h-4 w-4" />
            Nội dung bài đăng Zalo / FB
          </button>
          <button
            onClick={() => setActiveTab('photos')}
            className={`flex items-center gap-2 py-3 px-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'photos'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <ImageIcon className="h-4 w-4" />
            Bộ ảnh sạch đã thẩm định ({listing.images.length})
          </button>
        </div>

        {/* Nội dung chính cuộn được */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          
          {/* Tag thông báo bảo vệ bản quyền & link cá nhân */}
          <div className="flex items-center justify-between rounded-xl bg-blue-50/80 p-3 text-xs text-blue-900 border border-blue-200/70">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-blue-600 shrink-0" />
              <span>
                Nội dung đã tự động gắn <strong>Link giới thiệu #{profile.referralCode || profile.brokerCode}</strong> và <strong>SĐT {profile.phone}</strong> của bạn.
              </span>
            </div>
            <button
              onClick={handleCopyLink}
              className="shrink-0 text-[11px] font-bold text-blue-700 hover:underline flex items-center gap-1"
            >
              {copiedLink ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              {copiedLink ? 'Đã chép link' : 'Chép link'}
            </button>
          </div>

          {activeTab === 'text' ? (
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-700">
                Mẫu tin đăng chuẩn SEO & tối ưu tương tác người mua:
              </label>
              <textarea
                readOnly
                value={marketingPitch}
                rows={12}
                className="w-full rounded-xl border border-slate-300 bg-slate-50/50 p-3.5 font-mono text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed select-all"
              />
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-xs text-slate-600">
                Toàn bộ ảnh đã được kiểm duyệt không chứa SĐT của chủ nhà, đảm bảo an toàn cho môi giới đăng tin:
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {listing.images.map((img, idx) => (
                  <div key={idx} className="group relative aspect-4/3 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                    <img
                      src={img}
                      alt={`Ảnh BĐS ${idx + 1}`}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <a
                      href={img}
                      target="_blank"
                      rel="noreferrer"
                      className="absolute inset-0 flex items-center justify-center bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-semibold gap-1"
                    >
                      <Download className="h-4 w-4" />
                      Tải ảnh
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-5 py-3.5">
          <span className="text-[11px] text-slate-500 hidden sm:inline">
            HaNoi Realty • Công cụ hỗ trợ môi giới chuyên nghiệp
          </span>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleCopyPitch}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-blue-500 transition-colors"
            >
              {copiedText ? (
                <>
                  <Check className="h-4 w-4 text-emerald-300 animate-bounce" />
                  <span>Đã sao chép nội dung!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>Sao chép bài đăng</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

