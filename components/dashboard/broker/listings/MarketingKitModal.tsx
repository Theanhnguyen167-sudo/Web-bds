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
  ShieldCheck,
  Smartphone,
  Facebook,
  MessageSquare,
  Eye,
  CheckCircle2,
  Info
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

type TemplateType = 'facebook' | 'zalo' | 'sms';

export const MarketingKitModal: React.FC<MarketingKitModalProps> = ({
  isOpen,
  onClose,
  listing,
  profile,
}) => {
  const [copiedText, setCopiedText] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState<'text' | 'photos'>('text');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('facebook');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [downloadSuccessMessage, setDownloadSuccessMessage] = useState<string | null>(null);

  if (!isOpen || !listing) return null;

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://hanoirealty.vn';
  const referralCode = profile.referralCode || profile.brokerCode;
  const referralLink = `${origin}/listings/${listing.id}?ref=${encodeURIComponent(referralCode)}`;

  // 1. Template Facebook / Fanpage / Group chi tiết
  const fbTemplate = `🏠 SIÊU PHẨM ${listing.title.toUpperCase()}
📍 Vị trí đắc địa: ${listing.address}
💰 Giá bán công khai: ${formatCurrencyVND(listing.price)} (${(listing.price / 1_000_000_000).toFixed(2)} tỷ)
📐 Diện tích: ${listing.area}m² | Mặt tiền: ${listing.frontageWidth || 5}m | Kết cấu: ${listing.floors || 4} tầng (${listing.bedrooms || 3}PN - ${listing.bathrooms || 3}WC)
📜 Pháp lý: ${listing.legalStatus} - Sổ đỏ chính chủ, sẵn sàng giao dịch
🔍 Quy hoạch: ${listing.planningZone || 'Đã kiểm tra an toàn theo quy hoạch phân khu mới nhất'}

✨ ĐIỂM NỔI BẬT KHÔNG THỂ BỎ LỠ:
- Nhà xây kiên cố, thiết kế hiện đại, nội thất tinh tế ngập tràn ánh sáng tự nhiên.
- Khu dân trí cao, an ninh tuyệt đối, gần trường học, chợ, công viên và tiện ích lớn.
- Chủ nhà thiện chí, sẵn sàng thương lượng và hỗ trợ thủ tục công chứng sang tên ngay.

📞 LIÊN HỆ TƯ VẤN & XEM NHÀ THỰC TẾ MIỄN PHÍ 24/7:
👤 Chuyên viên tư vấn: ${profile.fullName} (Mã CV: ${profile.brokerCode})
📱 Hotline/Zalo: ${profile.phone}
🌐 Xem chi tiết hồ sơ thẩm định BĐS tại: ${referralLink}`;

  // 2. Template Zalo Feed / Story súc tích
  const zaloTemplate = `💥 CHÍNH CHỦ CẦN BÁN GẤP - ${listing.title}
📍 ${listing.address}
💰 ${formatCurrencyVND(listing.price)} (${(listing.price / 1_000_000_000).toFixed(2)} tỷ) - Còn thương lượng!
📐 ${listing.area}m² x ${listing.floors || 4} tầng (Mặt tiền ${listing.frontageWidth || 5}m)
📜 Sổ đỏ vuông đẹp, cất két giao dịch ngay.
👉 Điểm mạnh: Đường thông hè thoáng, dân trí cao, ở sướng hoặc cho thuê giữ dòng tiền cực tốt!

📲 Xem nhà trực tiếp & nhận trọn bộ hồ sơ pháp lý:
Chuyên viên ${profile.fullName} - 0${profile.phone.replace(/[^0-9]/g, '').slice(-9)}
Link chi tiết: ${referralLink}`;

  // 3. Template tin nhắn SMS / Zalo Chat gửi khách VIP
  const smsTemplate = `Dạ em chào Anh/Chị, em ${profile.fullName} (HaNoi Realty) ạ. Em vừa tiếp nhận căn nhà rất đẹp tại ${listing.address}, diện tích ${listing.area}m², giá ${formatCurrencyVND(listing.price)}, sổ đỏ chính chủ sẵn sàng sang tên. Anh/Chị bấm vào link này xem chi tiết ảnh và thông số nhé ạ: ${referralLink} . Nếu Anh/Chị quan tâm em xin phép sắp xếp lịch để Anh/Chị xem nhà thực tế trong ngày ạ!`;

  const currentContent = 
    selectedTemplate === 'facebook' 
      ? fbTemplate 
      : selectedTemplate === 'zalo' 
      ? zaloTemplate 
      : smsTemplate;

  const handleCopyText = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(currentContent);
      } else {
        const ta = document.createElement('textarea');
        ta.value = currentContent;
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

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: listing.title,
          text: currentContent,
          url: referralLink,
        });
      } catch (err) {
        console.log('Share dismissed');
      }
    } else {
      handleCopyText();
    }
  };

  const handleDownloadAllCleanPhotos = () => {
    listing.images.forEach((img, idx) => {
      setTimeout(() => {
        const a = document.createElement('a');
        a.href = img;
        a.download = `HaNoiRealty_${listing.propertyCode}_Clean_${idx + 1}.jpg`;
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }, idx * 250);
    });

    setDownloadSuccessMessage(`Đã khởi chạy tải ${listing.images.length} ảnh sạch.`);
    setTimeout(() => setDownloadSuccessMessage(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative flex flex-col w-full max-w-2xl max-h-[90vh] rounded-3xl bg-white shadow-2xl border border-slate-100 overflow-hidden">
        
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 sm:px-6 py-4 bg-slate-50/90">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-100 text-blue-700 shadow-xs">
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-tight">
                Bộ Tiếp Thị BĐS (Marketing Kit)
              </h3>
              <p className="text-slate-500 text-xs font-mono">
                {listing.propertyCode} • {listing.title.slice(0, 45)}...
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 transition-colors"
            aria-label="Đóng"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab selection */}
        <div className="flex border-b border-slate-200 px-5 sm:px-6 bg-white">
          <button
            onClick={() => setActiveTab('text')}
            className={`flex items-center gap-2 py-3 px-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'text'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <FileText className="h-4 w-4" />
            Nội dung bài đăng MXH
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
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          
          {/* Tag bảo vệ link tiếp thị cá nhân */}
          <div className="flex items-center justify-between rounded-2xl bg-blue-50/80 p-3 sm:p-3.5 text-xs text-blue-900 border border-blue-200/70">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="h-4 w-4 text-blue-600 shrink-0" />
              <span>
                Nội dung đã tự động chèn <strong>Họ tên {profile.fullName}</strong>, <strong>SĐT {profile.phone}</strong> và <strong>Link mã Ref #{referralCode}</strong> của bạn.
              </span>
            </div>
            <button
              onClick={handleCopyLink}
              className="shrink-0 text-xs font-bold text-blue-700 hover:underline flex items-center gap-1 ml-2"
            >
              {copiedLink ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              {copiedLink ? 'Đã chép link' : 'Chép link'}
            </button>
          </div>

          {activeTab === 'text' ? (
            <div className="space-y-3.5">
              
              {/* Lựa chọn template kênh đăng */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-600">Chọn mẫu:</span>
                <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setSelectedTemplate('facebook')}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      selectedTemplate === 'facebook'
                        ? 'bg-white text-blue-700 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Facebook className="h-3.5 w-3.5 text-blue-600" />
                    <span>Facebook / Fanpage</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedTemplate('zalo')}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      selectedTemplate === 'zalo'
                        ? 'bg-white text-blue-700 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Smartphone className="h-3.5 w-3.5 text-sky-500" />
                    <span>Zalo Feed</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedTemplate('sms')}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      selectedTemplate === 'sms'
                        ? 'bg-white text-blue-700 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <MessageSquare className="h-3.5 w-3.5 text-emerald-600" />
                    <span>SMS Khách VIP</span>
                  </button>
                </div>
              </div>

              {/* Khung nội dung bài đăng */}
              <div className="relative">
                <textarea
                  readOnly
                  value={currentContent}
                  rows={selectedTemplate === 'sms' ? 6 : 13}
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50/60 p-4 font-mono text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed select-all"
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 italic">
                <span>* Người mua nhấp vào link sẽ được hệ thống tự động ghi nhận hoa hồng cho bạn.</span>
                <span className="font-mono">{currentContent.length} ký tự</span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              
              {/* Tiêu đề & Nút tải trọn bộ */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="text-xs text-slate-600">
                  Toàn bộ ảnh đã được <strong>loại bỏ 100% số điện thoại chủ nhà</strong> và xóa biển quảng cáo, đảm bảo an toàn tối đa cho môi giới đăng tin:
                </div>
                <button
                  type="button"
                  onClick={handleDownloadAllCleanPhotos}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 shadow-xs shrink-0 self-start sm:self-auto"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Tải toàn bộ bộ ảnh sạch ({listing.images.length})</span>
                </button>
              </div>

              {downloadSuccessMessage && (
                <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-2.5 text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>{downloadSuccessMessage}</span>
                </div>
              )}

              {/* Lưới hiển thị các ảnh sạch */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {listing.images.map((img, idx) => (
                  <div key={idx} className="group relative aspect-4/3 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-2xs">
                    <img
                      src={img}
                      alt={`Ảnh sạch ${listing.propertyCode} ${idx + 1}`}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />

                    {/* Badge Ảnh Sạch Không SĐT */}
                    <div className="absolute top-2 left-2 rounded-md bg-emerald-600/90 backdrop-blur-xs px-1.5 py-0.5 text-[9px] font-bold text-white shadow-xs">
                      Sạch SĐT
                    </div>

                    {/* Lớp phủ hành động khi hover */}
                    <div className="absolute inset-0 flex items-center justify-center gap-2 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => setPreviewImage(img)}
                        className="p-2 rounded-xl bg-white/90 text-slate-900 hover:bg-white text-xs font-semibold shadow"
                        title="Xem phóng to"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <a
                        href={img}
                        target="_blank"
                        rel="noreferrer"
                        download={`HaNoiRealty_${listing.propertyCode}_Clean_${idx + 1}.jpg`}
                        className="p-2 rounded-xl bg-blue-600 text-white hover:bg-blue-500 text-xs font-semibold shadow"
                        title="Tải ảnh này"
                      >
                        <Download className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-5 sm:px-6 py-3.5">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleNativeShare}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 shadow-2xs"
            >
              <Share2 className="h-3.5 w-3.5 text-blue-600" />
              <span>Chia sẻ nhanh</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyText}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-500 transition-colors"
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

      {/* Lightbox Phóng to ảnh */}
      {previewImage && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={previewImage}
              alt="Ảnh BĐS phóng to"
              className="max-h-[85vh] max-w-full rounded-2xl object-contain shadow-2xl"
            />
            <button
              type="button"
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 rounded-full bg-black/60 p-2 text-white hover:bg-black/90"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
