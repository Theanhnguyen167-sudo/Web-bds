'use client';

import { useState } from 'react';
import {
  Briefcase,
  Star,
  Phone,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Unlock,
} from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';

interface ActiveBroker {
  id: string;
  name: string;
  code: string;
  phone: string;
  rating: number;
  dealsClosed: number;
  clientsLed: number;
  offersSubmitted: number;
  status: 'active' | 'paused';
  notes?: string;
  commissionRate: string;
}

const DEFAULT_BROKERS: ActiveBroker[] = [
  {
    id: 'brk_01',
    name: 'Nguyễn Lan Hương',
    code: 'MG-00102',
    phone: '0977.889.900',
    rating: 5.0,
    dealsClosed: 18,
    clientsLed: 4,
    offersSubmitted: 1,
    status: 'active',
    notes: 'Ưu tiên khách tài chính sẵn có, đã dẫn 1 khách thiện chí gửi offer 15.8 tỷ.',
    commissionRate: '1.0% (Thỏa thuận)',
  },
  {
    id: 'brk_02',
    name: 'Lê Tuấn Anh',
    code: 'MG-00045',
    phone: '0915.234.567',
    rating: 4.9,
    dealsClosed: 24,
    clientsLed: 2,
    offersSubmitted: 1,
    status: 'active',
    notes: 'Đang tư vấn cho 2 khách mua kinh doanh khách sạn mini.',
    commissionRate: '1.0% (Thỏa thuận)',
  },
  {
    id: 'brk_03',
    name: 'Trần Văn Kiên',
    code: 'MG-00219',
    phone: '0984.112.233',
    rating: 4.8,
    dealsClosed: 12,
    clientsLed: 1,
    offersSubmitted: 0,
    status: 'active',
    notes: 'Đã khảo sát thực tế và lưu vào giỏ hàng riêng.',
    commissionRate: '1.0% (Thỏa thuận)',
  },
];

export function OwnerBrokersTab() {
  const { addToast } = useApp();

  const [brokers, setBrokers] = useState<ActiveBroker[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('hanoi_owner_brokers');
        if (stored) return JSON.parse(stored);
      } catch {}
    }
    return DEFAULT_BROKERS;
  });

  const [selectedBrokerForNote, setSelectedBrokerForNote] = useState<ActiveBroker | null>(null);
  const [noteInput, setNoteInput] = useState('');

  const saveBrokers = (newBrokers: ActiveBroker[]) => {
    setBrokers(newBrokers);
    if (typeof window !== 'undefined') {
      localStorage.setItem('hanoi_owner_brokers', JSON.stringify(newBrokers));
    }
  };

  const handleToggleBrokerStatus = (id: string) => {
    const updated = brokers.map((b) => {
      if (b.id === id) {
        const nextStatus = b.status === 'active' ? ('paused' as const) : ('active' as const);
        return { ...b, status: nextStatus };
      }
      return b;
    });
    saveBrokers(updated);
    addToast('Đã cập nhật trạng thái cấp quyền khai thác cho CTV', 'info');
  };

  const handleSaveNote = () => {
    if (!selectedBrokerForNote) return;
    const updated = brokers.map((b) =>
      b.id === selectedBrokerForNote.id ? { ...b, notes: noteInput } : b
    );
    saveBrokers(updated);
    setSelectedBrokerForNote(null);
    addToast('✅ Đã gửi ghi chú riêng cho CTV thành công!', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Hoạt động môi giới & CTV</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Theo dõi mạng lưới CTV được xác thực của HaNoi Realty đang tìm kiếm khách mua cho BĐS của bạn
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>Mạng lưới bảo chứng giá gốc chủ nhà</span>
          </span>
        </div>
      </div>

      {/* Cam Kết & Chính Sách Minh Bạch */}
      <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-100 text-xs text-slate-700 space-y-1">
        <div className="font-bold text-orange-950 flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-orange-600" />
          <span>Cam kết minh bạch tuyệt đối từ HaNoi Realty:</span>
        </div>
        <p className="text-slate-600 leading-relaxed">
          Tất cả CTV dẫn khách đều phải đăng ký qua hệ thống, kiểm tra thẻ môi giới và cam kết <strong>không kê giá chênh</strong>.
          Chủ nhà chỉ trả phí dịch vụ hoa hồng 1.0% khi giao dịch hoàn tất tại phòng công chứng.
        </p>
      </div>

      {/* Danh Sách CTV Đang Khai Thác */}
      <div className="space-y-4">
        {brokers.map((broker) => (
          <div
            key={broker.id}
            className={`rounded-3xl border p-6 transition-all ${
              broker.status === 'active'
                ? 'bg-white border-slate-200 shadow-sm'
                : 'bg-slate-50 border-slate-200 opacity-60'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-base border border-slate-200 shrink-0">
                  {broker.name.split(' ').slice(-1)[0][0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">{broker.name}</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-700">
                      {broker.code}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 flex items-center gap-0.5">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      {broker.rating}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                    <span>Đã chốt thành công: <strong>{broker.dealsClosed} căn</strong></span>
                    <span>•</span>
                    <a href={`tel:${broker.phone}`} className="text-orange-600 font-bold hover:underline flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {broker.phone}
                    </a>
                  </div>
                </div>
              </div>

              {/* Thống kê hoạt động với nhà của bạn */}
              <div className="flex items-center gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center min-w-[90px]">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Đã dẫn khách</span>
                  <span className="text-base font-black text-slate-900">{broker.clientsLed} lượt</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center min-w-[90px]">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Đề nghị mua</span>
                  <span className="text-base font-black text-emerald-600">{broker.offersSubmitted} offer</span>
                </div>
              </div>
            </div>

            {/* Ghi chú & Thao tác */}
            <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="text-slate-600">
                <span className="font-bold text-slate-700">Ghi chú cho CTV này:</span>{' '}
                <span className="italic">{broker.notes || 'Chưa có ghi chú riêng.'}</span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedBrokerForNote(broker);
                    setNoteInput(broker.notes || '');
                  }}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Gửi dặn dò</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleToggleBrokerStatus(broker.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    broker.status === 'active'
                      ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                  }`}
                >
                  {broker.status === 'active' ? (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>Tạm ngưng</span>
                    </>
                  ) : (
                    <>
                      <Unlock className="w-3.5 h-3.5" />
                      <span>Kích hoạt lại</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Nhập Ghi Chú Riêng Cho CTV */}
      {selectedBrokerForNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-100 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Gửi lời dặn cho môi giới {selectedBrokerForNote.name}
            </h3>
            <p className="text-xs text-slate-500">
              Lời dặn sẽ hiển thị trực tiếp trong ứng dụng của môi giới này khi dẫn khách đến nhà bạn.
            </p>

            <div>
              <textarea
                rows={3}
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                placeholder="Ví dụ: Chỉ dẫn khách sau 18h các ngày trong tuần, không bấm chuông làm phiền hàng xóm..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-orange-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedBrokerForNote(null)}
                className="px-4 py-2 rounded-xl text-slate-600 text-xs font-bold"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSaveNote}
                className="px-4 py-2 rounded-xl bg-orange-600 text-white text-xs font-bold hover:bg-orange-700 shadow-md"
              >
                Lưu lời dặn
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

