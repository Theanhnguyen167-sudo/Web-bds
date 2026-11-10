'use client';

import { useState } from 'react';
import {
  Users,
  CheckCircle2,
  Clock,
  Send,
} from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';
import { formatCurrencyVND } from '@/lib/utils';

interface OfferLead {
  id: string;
  buyerName: string;
  buyerPhone: string;
  propertyTitle: string;
  propertyCode: string;
  originalPrice: number;
  offeredPrice: number;
  depositAmount: number;
  paymentTerm: string;
  status: 'pending' | 'accepted' | 'countered' | 'rejected';
  counterPrice?: number;
  createdAt: string;
  expiresIn: string;
  buyerNote: string;
}

const DEFAULT_OFFERS: OfferLead[] = [
  {
    id: 'off_01',
    buyerName: 'Nguyễn Văn An',
    buyerPhone: '0912.888.999',
    propertyTitle: 'Nhà phố Hàng Bông, Phường Hàng Bông, Hoàn Kiếm',
    propertyCode: 'HR-PROP-8821',
    originalPrice: 16500000000,
    offeredPrice: 15800000000,
    depositAmount: 500000000,
    paymentTerm: 'Thanh toán 100% bằng vốn tự có trong vòng 20 ngày sau công chứng',
    status: 'pending',
    createdAt: '10:15 - Hôm nay',
    expiresIn: 'Còn 22 giờ',
    buyerNote: 'Tôi rất thiện chí mua về kinh doanh gia đình, đã xem sổ đỏ và kiểm tra quy hoạch phân khu. Mong chủ nhà bớt lộc để chốt cọc sớm trong tuần.',
  },
  {
    id: 'off_02',
    buyerName: 'Trần Thị Mai',
    buyerPhone: '0904.555.666',
    propertyTitle: 'Nhà phố Hàng Bông, Phường Hàng Bông, Hoàn Kiếm',
    propertyCode: 'HR-PROP-8821',
    originalPrice: 16500000000,
    offeredPrice: 16100000000,
    depositAmount: 300000000,
    paymentTerm: 'Vay ngân hàng 30%, giải ngân phong tỏa 3 bên qua Vietcombank',
    status: 'pending',
    createdAt: 'Hôm qua',
    expiresIn: 'Còn 14 giờ',
    buyerNote: 'Gia đình đã có phê duyệt sơ bộ hạn mức tín dụng từ Vietcombank, cam kết giải ngân đúng tiến độ.',
  },
];

export function OwnerLeadsTab() {
  const { addToast } = useApp();

  const [offers, setOffers] = useState<OfferLead[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('hanoi_owner_offers');
        if (stored) return JSON.parse(stored);
      } catch {}
    }
    return DEFAULT_OFFERS;
  });

  const [counterModalItem, setCounterModalItem] = useState<OfferLead | null>(null);
  const [counterPriceInput, setCounterPriceInput] = useState<string>('16.2');
  const [counterNote, setCounterNote] = useState<string>('Chủ nhà đồng ý bớt chút lộc, chốt giá cuối cùng.');

  const saveOffers = (newOffers: OfferLead[]) => {
    setOffers(newOffers);
    if (typeof window !== 'undefined') {
      localStorage.setItem('hanoi_owner_offers', JSON.stringify(newOffers));
    }
  };

  const handleAcceptOffer = (offer: OfferLead) => {
    const updated = offers.map((o) => (o.id === offer.id ? { ...o, status: 'accepted' as const } : o));
    saveOffers(updated);
    addToast(
      `🎉 Bạn đã chấp thuận mức giá ${formatCurrencyVND(offer.offeredPrice)} của khách ${offer.buyerName}! Hệ thống đã chuyển sang quy trình ký HĐ Đặt cọc.`,
      'success'
    );
  };

  const handleRejectOffer = (offer: OfferLead) => {
    if (window.confirm(`Bạn có chắc muốn từ chối đề nghị mua ${formatCurrencyVND(offer.offeredPrice)} của khách ${offer.buyerName}?`)) {
      const updated = offers.map((o) => (o.id === offer.id ? { ...o, status: 'rejected' as const } : o));
      saveOffers(updated);
      addToast('Đã từ chối đề nghị mua', 'info');
    }
  };

  const handleSendCounter = () => {
    if (!counterModalItem) return;
    const priceNum = parseFloat(counterPriceInput) * 1_000_000_000;
    const updated = offers.map((o) =>
      o.id === counterModalItem.id
        ? {
            ...o,
            status: 'countered' as const,
            counterPrice: priceNum,
          }
        : o
    );
    saveOffers(updated);
    setCounterModalItem(null);
    addToast(
      `📨 Đã gửi đề xuất thương lượng lại: ${counterPriceInput} tỷ tới khách ${counterModalItem.buyerName}!`,
      'success'
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Khách quan tâm & Đề nghị mua</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Theo dõi người mua thiện chí, phản hồi giá mua và thương lượng trực tiếp
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-orange-50 text-orange-700 text-xs font-bold border border-orange-100">
            {offers.filter((o) => o.status === 'pending').length} đề nghị chờ phản hồi
          </span>
        </div>
      </div>

      {/* Danh sách Đề nghị mua */}
      <div className="space-y-4">
        {offers.map((offer) => {
          const discountPct = Math.round(((offer.originalPrice - offer.offeredPrice) / offer.originalPrice) * 100);

          return (
            <div
              key={offer.id}
              className={`rounded-3xl border p-6 transition-all ${
                offer.status === 'accepted'
                  ? 'bg-emerald-50/30 border-emerald-200'
                  : offer.status === 'countered'
                  ? 'bg-blue-50/30 border-blue-200'
                  : offer.status === 'rejected'
                  ? 'bg-slate-50 border-slate-200 opacity-60'
                  : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-100 text-slate-700">
                      Mã BĐS: {offer.propertyCode}
                    </span>
                    {offer.status === 'pending' && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-700 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Đang chờ chủ nhà phản hồi ({offer.expiresIn})
                      </span>
                    )}
                    {offer.status === 'accepted' && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Chủ nhà đã chấp thuận giá này
                      </span>
                    )}
                    {offer.status === 'countered' && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-700 flex items-center gap-1">
                        <Send className="w-3 h-3" />
                        Đã gửi lại đề xuất: {formatCurrencyVND(offer.counterPrice || 0)}
                      </span>
                    )}
                    {offer.status === 'rejected' && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-700">
                        Đã từ chối
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900">{offer.propertyTitle}</h3>

                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>Khách mua: <strong>{offer.buyerName}</strong></span>
                    <span>•</span>
                    <a href={`tel:${offer.buyerPhone}`} className="text-orange-600 font-bold hover:underline">
                      {offer.buyerPhone}
                    </a>
                  </div>
                </div>

                {/* Khối so sánh Giá */}
                <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 shrink-0">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Giá niêm yết</span>
                    <span className="text-sm font-bold text-slate-500 line-through">
                      {formatCurrencyVND(offer.originalPrice)}
                    </span>
                  </div>

                  <div className="w-px h-8 bg-slate-200" />

                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-600 block">Giá đề nghị mua</span>
                    <span className="text-lg font-black text-emerald-600">
                      {formatCurrencyVND(offer.offeredPrice)}
                    </span>
                    <span className="text-[10px] font-bold text-rose-500 ml-1.5">
                      (-{discountPct}%)
                    </span>
                  </div>
                </div>
              </div>

              {/* Chi tiết điều kiện mua & Ghi chú */}
              <div className="py-3 space-y-2 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600">
                  <div>
                    <span className="font-bold text-slate-700">Tiền đặt cọc cam kết:</span>{' '}
                    <strong className="text-slate-900">{formatCurrencyVND(offer.depositAmount)}</strong>
                  </div>
                  <div>
                    <span className="font-bold text-slate-700">Điều kiện thanh toán:</span> {offer.paymentTerm}
                  </div>
                </div>

                {offer.buyerNote && (
                  <div className="p-3 rounded-xl bg-orange-50/50 border border-orange-100/60 text-slate-700 italic">
                    "{offer.buyerNote}"
                  </div>
                )}
              </div>

              {/* Nút hành động */}
              {offer.status === 'pending' && (
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => handleRejectOffer(offer)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    Từ chối
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCounterModalItem(offer);
                      setCounterPriceInput((offer.offeredPrice / 1_000_000_000 + 0.3).toFixed(1));
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-sm"
                  >
                    Thương lượng lại giá
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAcceptOffer(offer)}
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-md"
                  >
                    Đồng ý bán với giá này
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal Thương Lượng Lại Giá */}
      {counterModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-100 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Gửi giá thương lượng lại cho {counterModalItem.buyerName}
            </h3>
            <p className="text-xs text-slate-500">
              Khách đang đề nghị {formatCurrencyVND(counterModalItem.offeredPrice)}. Bạn muốn chốt lại mức giá nào?
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Mức giá bạn muốn chốt (Tỷ đồng)</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.05"
                    value={counterPriceInput}
                    onChange={(e) => setCounterPriceInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-black text-slate-900 text-base focus:border-orange-500 focus:outline-none"
                  />
                  <span className="absolute right-3.5 top-3 text-xs font-bold text-slate-400">Tỷ VNĐ</span>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Lời nhắn gửi kèm</label>
                <textarea
                  rows={2}
                  value={counterNote}
                  onChange={(e) => setCounterNote(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-orange-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCounterModalItem(null)}
                className="px-4 py-2 rounded-xl text-slate-600 font-bold"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSendCounter}
                className="px-4 py-2 rounded-xl bg-orange-600 text-white font-bold hover:bg-orange-700 shadow-md"
              >
                Gửi phản hồi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

