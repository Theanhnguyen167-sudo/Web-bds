'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Phone,
  Mail,
  Calendar,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  MessageCircle,
  Home,
  ShieldCheck,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { CodeBadge } from '@/components/common/CodeBadge';
import { getUserAgentCode } from '@/lib/identification';

interface ClientItem {
  id: string;
  fullName: string;
  email?: string;
  phone?: string;
  avatarUrl?: string | null;
  confirmedAt: string;
  status: string;
  interestedListingCode?: string;
}

interface MyClientsTabProps {
  user: any;
  appointments?: any[];
}

export function MyClientsTab({ user, appointments = [] }: MyClientsTabProps) {
  const [clients, setClients] = useState<ClientItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const agentCode = (user ? getUserAgentCode(user) : null) || 'MG-00102';
  const referralLink = typeof window !== 'undefined'
    ? `${window.location.origin}/register?ref=${agentCode}`
    : `https://hanoirealty.vn/register?ref=${agentCode}`;

  const fetchClients = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/referral?action=clients&agent_code=${encodeURIComponent(agentCode)}`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setClients(json.data);
      }
    } catch (err) {
      console.warn('Lỗi tải danh sách khách hàng:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [agentCode]);

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(referralLink);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const filteredClients = clients.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      c.fullName.toLowerCase().includes(q) ||
      (c.phone && c.phone.includes(q)) ||
      (c.email && c.email.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl border border-border bg-white p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-slate-900">Khách hàng của tôi</h3>
                <span className="rounded-full bg-orange-100 text-orange-800 px-2.5 py-0.5 text-xs font-bold">
                  {clients.length} khách hàng
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Danh sách người mua đã xác nhận kết nối qua mã định danh giới thiệu của bạn
              </p>
            </div>
          </div>

          <button
            onClick={fetchClients}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Làm mới</span>
          </button>
        </div>

        {/* Mã giới thiệu & Link chia sẻ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-slate-100">
          <div className="rounded-2xl border border-orange-200 bg-orange-50/60 p-4 flex items-center justify-between gap-3">
            <div className="space-y-1">
              <p className="text-[11px] font-bold text-orange-950 uppercase tracking-wide">
                Mã định danh giới thiệu của bạn:
              </p>
              <p className="text-xs text-slate-600">
                Khách hàng nhập mã này trong mục “Môi giới giới thiệu bạn”
              </p>
            </div>
            <CodeBadge code={agentCode} label="Mã CTV" />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 flex items-center justify-between gap-3">
            <div className="space-y-1 min-w-0 flex-1">
              <p className="text-[11px] font-bold text-slate-800 uppercase tracking-wide">
                Đường link giới thiệu trực tiếp:
              </p>
              <p className="text-xs font-mono text-slate-500 truncate">
                {referralLink}
              </p>
            </div>
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-orange-500 text-xs font-bold text-slate-700 hover:text-orange-600 transition-colors shadow-xs shrink-0 cursor-pointer"
            >
              {copiedLink ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedLink ? 'Đã chép' : 'Sao chép'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Toolbar Search */}
      <div className="rounded-2xl border border-border bg-white p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:max-w-md">
          <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Tìm theo tên, số điện thoại hoặc email khách hàng..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-orange-500 bg-slate-50 placeholder:text-slate-400"
          />
        </div>
        <p className="text-xs text-slate-500 font-medium">
          Hiển thị <strong className="text-slate-800">{filteredClients.length}</strong> / {clients.length} khách
        </p>
      </div>

      {/* Danh sách khách hàng */}
      {loading ? (
        <div className="rounded-3xl border border-border bg-white p-12 text-center space-y-3">
          <Loader2 className="h-8 w-8 text-orange-500 animate-spin mx-auto" />
          <p className="text-xs font-semibold text-slate-500">Đang tải danh sách khách hàng...</p>
        </div>
      ) : filteredClients.length === 0 ? (
        <div className="rounded-3xl border border-border bg-white p-12 text-center space-y-3">
          <div className="h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
            <Users className="h-7 w-7" />
          </div>
          <h4 className="text-sm font-bold text-slate-800">
            {searchQuery ? 'Không tìm thấy khách hàng phù hợp' : 'Chưa có khách hàng kết nối'}
          </h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            {searchQuery
              ? 'Thử thay đổi từ khóa tìm kiếm hoặc làm mới lại danh sách.'
              : `Hãy chia sẻ mã ${agentCode} hoặc đường dẫn giới thiệu cho khách hàng khi họ tạo tài khoản để theo sát nhu cầu tìm nhà của họ.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredClients.map((client) => {
            const confirmedDate = new Date(client.confirmedAt);
            const dateStr = !isNaN(confirmedDate.getTime())
              ? `${confirmedDate.toLocaleDateString('vi-VN')} lúc ${confirmedDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`
              : 'Gần đây';

            return (
              <div
                key={client.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 hover:border-orange-300 transition-all shadow-xs space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={client.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80'}
                      alt={client.fullName}
                      className="h-11 w-11 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900">{client.fullName}</h4>
                      <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold mt-0.5">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>{client.status || 'Đã liên kết'}</span>
                      </div>
                    </div>
                  </div>

                  <span className="text-[10.5px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                    Khách mua
                  </span>
                </div>

                {/* Thông tin liên hệ được phép chia sẻ */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Phone className="h-3.5 w-3.5 text-orange-500 shrink-0" />
                    <span className="font-mono font-medium truncate">{client.phone || 'Chưa có SĐT'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Mail className="h-3.5 w-3.5 text-orange-500 shrink-0" />
                    <span className="truncate">{client.email || 'Chưa có email'}</span>
                  </div>
                  <div className="col-span-1 sm:col-span-2 flex items-center gap-1.5 text-slate-400 text-[11px]">
                    <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span>Xác nhận: <strong className="text-slate-600">{dateStr}</strong></span>
                  </div>
                </div>

                {/* Hành động liên hệ nhanh */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  {client.phone && (
                    <>
                      <a
                        href={`tel:${client.phone.replace(/\s+/g, '')}`}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold text-xs transition-colors"
                      >
                        <Phone className="h-3.5 w-3.5" />
                        <span>Gọi điện</span>
                      </a>
                      <a
                        href={`https://zalo.me/${client.phone.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold text-xs transition-colors"
                      >
                        <MessageCircle className="h-3.5 w-3.5" />
                        <span>Nhắn Zalo</span>
                      </a>
                    </>
                  )}
                  {client.email && (
                    <a
                      href={`mailto:${client.email}`}
                      className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors"
                      title="Gửi email"
                    >
                      <Mail className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MyClientsTab;

