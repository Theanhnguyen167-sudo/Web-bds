'use client';

import { useState } from 'react';
import {
  Headphones,
  PhoneCall,
  Clock,
  Send
} from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';

interface SupportTicket {
  id: string;
  category: string;
  title: string;
  content: string;
  createdAt: string;
  status: 'pending' | 'in_progress' | 'resolved';
  response?: string;
}

const DEFAULT_TICKETS: SupportTicket[] = [
  {
    id: 'tck_01',
    category: 'Tư vấn pháp lý & Sổ đỏ',
    title: 'Hỗ trợ trích lục thông tin quy hoạch phân khu Hàng Bông',
    content: 'Tôi muốn nhờ luật sư của sàn kiểm tra quy hoạch chỉ giới đường đỏ mở rộng phố Hàng Bông trước khi ký cọc với khách.',
    createdAt: '08:30 - Hôm qua',
    status: 'in_progress',
    response: 'Luật sư Vũ Đức Mạnh đã tiếp nhận hồ sơ trích lục. Kết quả bản vẽ GIS đối soát sẽ được gửi vào sáng mai.',
  },
];

export function OwnerSupportTab() {
  const { addToast } = useApp();

  const [tickets, setTickets] = useState<SupportTicket[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('hanoi_owner_tickets');
        if (stored) return JSON.parse(stored);
      } catch {}
    }
    return DEFAULT_TICKETS;
  });

  const [category, setCategory] = useState('Tư vấn pháp lý & Sổ đỏ');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [phone, setPhone] = useState('0988 765 432');

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      addToast('Vui lòng nhập đầy đủ tiêu đề và nội dung', 'warning');
      return;
    }

    const newTicket: SupportTicket = {
      id: `tck_${Date.now()}`,
      category,
      title: title.trim(),
      content: content.trim(),
      createdAt: 'Vừa xong',
      status: 'pending',
    };

    const updated = [newTicket, ...tickets];
    setTickets(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('hanoi_owner_tickets', JSON.stringify(updated));
    }

    setTitle('');
    setContent('');
    addToast('🎉 Yêu cầu của bạn đã được gửi tới Ban Pháp lý & Chăm sóc khách hàng! Chúng tôi sẽ phản hồi trong 30 phút.', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Trung tâm hỗ trợ & Khiếu nại chủ nhà</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Kênh liên hệ trực tiếp với Ban Pháp lý, Giám sát chất lượng môi giới và Ban Giám Đốc sàn
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="tel:1900636888"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 text-white text-xs font-bold shadow-md hover:bg-orange-700 transition-all"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Hotline 24/7: 1900.636.888</span>
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cột Trái: Form Gửi Yêu Cầu Hỗ Trợ */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">Gửi yêu cầu hỗ trợ mới</h3>
            <p className="text-xs text-slate-500 mt-0.5">Mọi thông tin khiếu nại hoặc tư vấn pháp lý đều được bảo mật tuyệt đối</p>
          </div>

          <form onSubmit={handleSubmitTicket} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Loại yêu cầu</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:border-orange-500 focus:outline-none"
              >
                <option value="Tư vấn pháp lý & Sổ đỏ">Tư vấn pháp lý & Kiểm tra quy hoạch phân khu</option>
                <option value="Hỗ trợ thẩm định giá thị trường">Hỗ trợ định giá thị trường & chiến lược bán</option>
                <option value="Khiếu nại môi giới / CTV">Khiếu nại CTV có hành vi sai phạm / Kê giá chênh</option>
                <option value="Hỗ trợ ký cọc & Công chứng">Hỗ trợ thủ tục đặt cọc 3 bên & Phòng công chứng</option>
                <option value="Vấn đề kỹ thuật tin đăng">Lỗi hiển thị hình ảnh / Video 3D Tour</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Tiêu đề yêu cầu</label>
              <input
                type="text"
                placeholder="Ví dụ: Cần check quy hoạch mở đường ngõ 48 Hàng Bông"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-orange-500 focus:outline-none font-bold"
                required
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Nội dung chi tiết</label>
              <textarea
                rows={4}
                placeholder="Mô tả cụ thể thắc mắc hoặc sự việc cần xử lý..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-orange-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Số điện thoại tiếp nhận cuộc gọi</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-orange-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-orange-600 text-white font-bold hover:bg-orange-700 shadow-md transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Gửi yêu cầu ngay</span>
              </button>
            </div>
          </form>
        </div>

        {/* Cột Phải: Các Kênh Trợ Giúp Nhanh */}
        <div className="space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4 text-xs">
            <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Liên hệ trực tiếp
            </h4>

            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-orange-50/60 border border-orange-100 space-y-1">
                <span className="font-bold text-orange-950 block">Luật sư trưởng Ban Pháp lý</span>
                <p className="text-slate-600">LS. Vũ Đức Mạnh</p>
                <a href="tel:0969888777" className="text-orange-600 font-extrabold hover:underline block pt-0.5">
                  📞 0969.888.777
                </a>
              </div>

              <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-1">
                <span className="font-bold text-blue-950 block">Tổng đài tiếp nhận khiếu nại CTV</span>
                <p className="text-slate-600">Giám sát tính minh bạch 24/7</p>
                <a href="tel:1900636888" className="text-blue-700 font-extrabold hover:underline block pt-0.5">
                  📞 1900.636.888 (Phím 2)
                </a>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 block">Email phản hồi chính thức</span>
                <p className="text-slate-500">tiepnhan@hanoirealty.vn</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lịch Sử Các Phiếu Yêu Cầu Hỗ Trợ Đã Gửi */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
          Lịch sử yêu cầu hỗ trợ ({tickets.length})
        </h3>

        <div className="space-y-3">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full font-extrabold text-[10px] bg-slate-200 text-slate-700">
                    {ticket.category}
                  </span>
                  <span className="font-bold text-slate-900 text-sm">{ticket.title}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400">{ticket.createdAt}</span>
                  {ticket.status === 'in_progress' && (
                    <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-amber-100 text-amber-700 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Đang xử lý
                    </span>
                  )}
                  {ticket.status === 'pending' && (
                    <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-blue-100 text-blue-700">
                      Mới tiếp nhận
                    </span>
                  )}
                  {ticket.status === 'resolved' && (
                    <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-emerald-100 text-emerald-700">
                      Đã giải quyết
                    </span>
                  )}
                </div>
              </div>

              <p className="text-slate-600 leading-relaxed">{ticket.content}</p>

              {ticket.response && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-900 font-medium">
                  <strong>Phản hồi từ HaNoi Realty:</strong> {ticket.response}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

