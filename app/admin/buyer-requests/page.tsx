'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { formatCurrencyVND } from '@/lib/utils';
import { useApp } from '@/lib/context/AppContext';
import { BuyerRequest, BuyerRequestStatus } from '@/types/buyer-request';
import {
  Search,
  Phone,
  Mail,
  Calendar,
  Clock,
  Filter,
  RefreshCw,
  Building2,
  CheckCircle2,
  AlertCircle,
  Eye,
  X,
  UserCheck,
  ChevronRight,
  ShieldCheck,
  Check,
  Ban,
  BadgePercent
} from 'lucide-react';

const STATUS_CONFIG: Record<BuyerRequestStatus, { label: string; color: string; bg: string; border: string }> = {
  pending: {
    label: 'Chờ xử lý',
    color: 'text-amber-800',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
  },
  contacted: {
    label: 'Đang liên hệ',
    color: 'text-blue-800',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
  },
  matched: {
    label: 'Đã khớp căn',
    color: 'text-emerald-800',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
  },
  completed: {
    label: 'Đã hoàn tất',
    color: 'text-purple-800',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
  },
  cancelled: {
    label: 'Đã huỷ/Dừng',
    color: 'text-slate-700',
    bg: 'bg-slate-100',
    border: 'border-slate-300',
  },
};

export default function AdminBuyerRequestsPage() {
  const { user, addToast } = useApp();
  const [requests, setRequests] = useState<BuyerRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | BuyerRequestStatus>('all');
  const [districtFilter, setDistrictFilter] = useState<string>('all');
  const [selectedRequest, setSelectedRequest] = useState<BuyerRequest | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Tải danh sách yêu cầu từ API (server auth/filter)
  const fetchRequests = useCallback(async () => {
    setIsLoading(true);
    try {
      const headers: Record<string, string> = {};
      if (user) {
        headers['x-user-id'] = user.id;
        headers['x-user-role'] = user.role || 'admin';
        headers['x-user-email'] = user.email || 'admin@hanoirealty.vn';
      } else {
        // Fallback admin view trong sandbox
        headers['x-user-id'] = 'admin_system';
        headers['x-user-role'] = 'admin';
        headers['x-user-email'] = 'admin@hanoirealty.vn';
      }

      const res = await fetch('/api/buyer-requests', {
        headers,
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setRequests(json.data);
        }
      } else {
        addToast('Không thể tải danh sách nhu cầu mua', 'error');
      }
    } catch (err) {
      console.error('Lỗi khi fetch buyer-requests:', err);
      addToast('Lỗi kết nối khi tải nhu cầu mua', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [user, addToast]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // Cập nhật trạng thái yêu cầu
  const handleUpdateStatus = async (id: string, newStatus: BuyerRequestStatus) => {
    setIsUpdating(true);
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (user) {
        headers['x-user-id'] = user.id;
        headers['x-user-role'] = user.role || 'admin';
      } else {
        headers['x-user-id'] = 'admin_system';
        headers['x-user-role'] = 'admin';
      }

      const res = await fetch('/api/buyer-requests', {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ id, status: newStatus }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setRequests((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: newStatus, updated_at: new Date().toISOString() } : r))
        );
        if (selectedRequest && selectedRequest.id === id) {
          setSelectedRequest((prev) => prev ? { ...prev, status: newStatus } : null);
        }
        addToast(`✅ Đã chuyển trạng thái sang "${STATUS_CONFIG[newStatus].label}"`, 'success');
      } else {
        addToast(json.error?.message || 'Không thể cập nhật trạng thái', 'error');
      }
    } catch (err) {
      addToast('Lỗi máy chủ khi cập nhật trạng thái', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  // Tính số liệu thống kê
  const counts = {
    total: requests.length,
    pending: requests.filter((r) => r.status === 'pending').length,
    contacted: requests.filter((r) => r.status === 'contacted').length,
    matched: requests.filter((r) => r.status === 'matched').length,
    completed: requests.filter((r) => r.status === 'completed').length,
    cancelled: requests.filter((r) => r.status === 'cancelled').length,
  };

  // Lọc danh sách
  const filteredRequests = requests.filter((req) => {
    if (statusFilter !== 'all' && req.status !== statusFilter) return false;
    if (districtFilter !== 'all') {
      const districts = Array.isArray(req.target_districts) ? req.target_districts : [req.target_districts];
      if (!districts.some((d) => d?.toLowerCase().includes(districtFilter.toLowerCase()))) {
        return false;
      }
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      const matchCode = req.code?.toLowerCase().includes(q);
      const matchName = req.contact_name?.toLowerCase().includes(q);
      const matchPhone = req.contact_phone?.includes(q);
      const matchEmail = req.contact_email?.toLowerCase().includes(q);
      const matchDistricts = Array.isArray(req.target_districts)
        ? req.target_districts.some((d) => d?.toLowerCase().includes(q))
        : false;
      return matchCode || matchName || matchPhone || matchEmail || matchDistricts;
    }
    return true;
  });

  return (
    <div className="flex-1 space-y-6 p-6">
      <AdminHeader
        title="Tiếp nhận nhu cầu mua"
        breadcrumb="Vận hành"
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div
          onClick={() => setStatusFilter('all')}
          className={`cursor-pointer rounded-2xl border p-4 bg-white shadow-xs transition-all ${
            statusFilter === 'all' ? 'border-orange-500 ring-2 ring-orange-500/10' : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <span className="text-[11px] font-bold text-slate-500 block uppercase">Tất cả</span>
          <span className="text-xl font-extrabold text-slate-900 mt-1 block">{counts.total}</span>
        </div>

        <div
          onClick={() => setStatusFilter('pending')}
          className={`cursor-pointer rounded-2xl border p-4 bg-white shadow-xs transition-all ${
            statusFilter === 'pending' ? 'border-amber-500 ring-2 ring-amber-500/10' : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-700 block uppercase">Chờ xử lý</span>
            {counts.pending > 0 && (
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping" />
            )}
          </div>
          <span className="text-xl font-extrabold text-amber-900 mt-1 block">{counts.pending}</span>
        </div>

        <div
          onClick={() => setStatusFilter('contacted')}
          className={`cursor-pointer rounded-2xl border p-4 bg-white shadow-xs transition-all ${
            statusFilter === 'contacted' ? 'border-blue-500 ring-2 ring-blue-500/10' : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <span className="text-[11px] font-bold text-blue-700 block uppercase">Đang liên hệ</span>
          <span className="text-xl font-extrabold text-blue-900 mt-1 block">{counts.contacted}</span>
        </div>

        <div
          onClick={() => setStatusFilter('matched')}
          className={`cursor-pointer rounded-2xl border p-4 bg-white shadow-xs transition-all ${
            statusFilter === 'matched' ? 'border-emerald-500 ring-2 ring-emerald-500/10' : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <span className="text-[11px] font-bold text-emerald-700 block uppercase">Đã khớp căn</span>
          <span className="text-xl font-extrabold text-emerald-900 mt-1 block">{counts.matched}</span>
        </div>

        <div
          onClick={() => setStatusFilter('completed')}
          className={`cursor-pointer rounded-2xl border p-4 bg-white shadow-xs transition-all ${
            statusFilter === 'completed' ? 'border-purple-500 ring-2 ring-purple-500/10' : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <span className="text-[11px] font-bold text-purple-700 block uppercase">Hoàn tất</span>
          <span className="text-xl font-extrabold text-purple-900 mt-1 block">{counts.completed}</span>
        </div>

        <div
          onClick={() => setStatusFilter('cancelled')}
          className={`cursor-pointer rounded-2xl border p-4 bg-white shadow-xs transition-all ${
            statusFilter === 'cancelled' ? 'border-slate-500 ring-2 ring-slate-500/10' : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <span className="text-[11px] font-bold text-slate-500 block uppercase">Đã huỷ / Tạm dừng</span>
          <span className="text-xl font-extrabold text-slate-700 mt-1 block">{counts.cancelled}</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo mã REQ, tên khách, SĐT, quận..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <select
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:border-orange-500"
          >
            <option value="all">Tất cả quận/huyện</option>
            <option value="Cầu Giấy">Cầu Giấy</option>
            <option value="Đống Đa">Đống Đa</option>
            <option value="Thanh Xuân">Thanh Xuân</option>
            <option value="Nam Từ Liêm">Nam Từ Liêm</option>
            <option value="Bắc Từ Liêm">Bắc Từ Liêm</option>
            <option value="Tây Hồ">Tây Hồ</option>
            <option value="Ba Đình">Ba Đình</option>
            <option value="Hai Bà Trưng">Hai Bà Trưng</option>
            <option value="Hoàng Mai">Hoàng Mai</option>
            <option value="Hà Đông">Hà Đông</option>
            <option value="Long Biên">Long Biên</option>
          </select>

          <button
            onClick={() => fetchRequests()}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Làm mới</span>
          </button>
        </div>
      </div>

      {/* Requests Table / List */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="py-16 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
            <p className="mt-2 text-xs font-medium text-slate-500">Đang tải danh sách nhu cầu mua...</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="py-16 text-center text-slate-500">
            <Building2 className="mx-auto h-12 w-12 text-slate-300" />
            <p className="mt-2 text-sm font-bold text-slate-700">Không tìm thấy yêu cầu mua nào</p>
            <p className="text-xs text-slate-400 mt-1">Thử đổi bộ lọc hoặc từ khoá tìm kiếm</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-[11px] font-bold uppercase text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Mã YC</th>
                  <th className="py-3 px-4">Khách hàng</th>
                  <th className="py-3 px-4">Khu vực & Loại hình</th>
                  <th className="py-3 px-4">Tài chính & Tiêu chí</th>
                  <th className="py-3 px-4">Ngày gửi</th>
                  <th className="py-3 px-4">Trạng thái</th>
                  <th className="py-3 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRequests.map((req) => {
                  const statusConf = STATUS_CONFIG[req.status] || STATUS_CONFIG.pending;
                  return (
                    <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-orange-600">
                        {req.code}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{req.contact_name}</div>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500">
                          <span className="flex items-center gap-1 font-mono">
                            <Phone className="h-3 w-3 text-slate-400" />
                            {req.contact_phone}
                          </span>
                        </div>
                        {req.contact_email && (
                          <div className="text-[10px] text-slate-400 truncate max-w-[150px]">
                            {req.contact_email}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">
                          {Array.isArray(req.target_districts) ? req.target_districts.join(', ') : req.target_districts}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {Array.isArray(req.property_types) ? req.property_types.join(', ') : req.property_types}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-orange-600">
                          {formatCurrencyVND(req.budget_min || 0)} - {formatCurrencyVND(req.budget_max || 0)}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {req.min_area ? `>= ${req.min_area}m²` : 'Không giới hạn DT'} • {req.min_bedrooms ? `>= ${req.min_bedrooms} PN` : 'Bất kỳ'}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                        {new Date(req.created_at).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${statusConf.bg} ${statusConf.color} ${statusConf.border}`}
                        >
                          {statusConf.label}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedRequest(req)}
                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
                            title="Xem chi tiết"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>

                          {req.status === 'pending' && (
                            <button
                              onClick={() => handleUpdateStatus(req.id, 'contacted')}
                              disabled={isUpdating}
                              className="px-2 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-[10px] border border-blue-200 transition-colors"
                            >
                              Tiếp nhận
                            </button>
                          )}

                          {req.status === 'contacted' && (
                            <button
                              onClick={() => handleUpdateStatus(req.id, 'matched')}
                              disabled={isUpdating}
                              className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-[10px] border border-emerald-200 transition-colors"
                            >
                              Khớp căn
                            </button>
                          )}

                          {req.status === 'matched' && (
                            <button
                              onClick={() => handleUpdateStatus(req.id, 'completed')}
                              disabled={isUpdating}
                              className="px-2 py-1 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 font-bold text-[10px] border border-purple-200 transition-colors"
                            >
                              Hoàn tất
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Drawer / Modal Chi Tiết Yêu Cầu */}
      <AnimatePresence>
        {selectedRequest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black text-orange-600 bg-orange-100 px-2.5 py-1 rounded-md">
                      {selectedRequest.code}
                    </span>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                        STATUS_CONFIG[selectedRequest.status]?.bg
                      } ${STATUS_CONFIG[selectedRequest.status]?.color} ${
                        STATUS_CONFIG[selectedRequest.status]?.border
                      }`}
                    >
                      {STATUS_CONFIG[selectedRequest.status]?.label}
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 mt-1">
                    Chi tiết nhu cầu tìm mua BĐS
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="p-1.5 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4 py-4 text-xs">
                {/* Thông tin liên hệ khách hàng */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 space-y-2">
                  <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    <span>Thông tin liên hệ (Bảo mật nhân sự vận hành)</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Họ tên khách hàng</span>
                      <strong className="text-slate-800 text-xs">{selectedRequest.contact_name}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Số điện thoại</span>
                      <strong className="text-slate-800 text-xs font-mono">{selectedRequest.contact_phone}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Email</span>
                      <span className="text-slate-700 text-xs">{selectedRequest.contact_email || 'Chưa cung cấp'}</span>
                    </div>
                  </div>
                  <div className="pt-1 text-[11px] text-slate-500">
                    <strong>Thời gian liên hệ thuận tiện:</strong> {selectedRequest.preferred_contact_time || 'Bất kỳ lúc nào'}
                  </div>
                </div>

                {/* Tiêu chí BĐS */}
                <div className="rounded-2xl border border-slate-200 p-4 space-y-3">
                  <h4 className="font-bold text-slate-900 text-xs">Tiêu chí tìm mua</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Quận/Huyện quan tâm</span>
                      <strong className="text-slate-800 text-xs">
                        {Array.isArray(selectedRequest.target_districts)
                          ? selectedRequest.target_districts.join(', ')
                          : selectedRequest.target_districts}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Loại hình BĐS</span>
                      <strong className="text-slate-800 text-xs">
                        {Array.isArray(selectedRequest.property_types)
                          ? selectedRequest.property_types.join(', ')
                          : selectedRequest.property_types}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Khoảng tài chính</span>
                      <strong className="text-orange-600 text-xs">
                        {formatCurrencyVND(selectedRequest.budget_min || 0)} - {formatCurrencyVND(selectedRequest.budget_max || 0)}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Diện tích tối thiểu</span>
                      <span className="text-slate-700">{selectedRequest.min_area ? `${selectedRequest.min_area} m²` : 'Không yêu cầu'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Số phòng ngủ</span>
                      <span className="text-slate-700">{selectedRequest.min_bedrooms ? `>= ${selectedRequest.min_bedrooms} phòng` : 'Không yêu cầu'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Ô tô vào nhà / đỗ cửa</span>
                      <span className="text-slate-700">{selectedRequest.car_access ? 'Có yêu cầu ô tô' : 'Không bắt buộc'}</span>
                    </div>
                  </div>

                  {selectedRequest.preferred_directions && selectedRequest.preferred_directions.length > 0 && (
                    <div className="pt-2 border-t border-slate-100">
                      <span className="text-slate-400 block text-[10px]">Hướng nhà phù hợp</span>
                      <span className="text-slate-700 font-medium">
                        {selectedRequest.preferred_directions.join(', ')}
                      </span>
                    </div>
                  )}

                  {selectedRequest.notes && (
                    <div className="pt-2 border-t border-slate-100">
                      <span className="text-slate-400 block text-[10px]">Ghi chú chi tiết từ khách hàng</span>
                      <p className="text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200 mt-1 leading-relaxed">
                        {selectedRequest.notes}
                      </p>
                    </div>
                  )}
                </div>

                {/* Chuyển đổi trạng thái trực tiếp */}
                <div className="rounded-2xl border border-slate-200 p-4 space-y-2">
                  <h4 className="font-bold text-slate-900 text-xs">Cập nhật tiến độ xử lý</h4>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {(['pending', 'contacted', 'matched', 'completed', 'cancelled'] as BuyerRequestStatus[]).map((st) => (
                      <button
                        key={st}
                        onClick={() => handleUpdateStatus(selectedRequest.id, st)}
                        disabled={isUpdating || selectedRequest.status === st}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                          selectedRequest.status === st
                            ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        } disabled:opacity-50`}
                      >
                        {STATUS_CONFIG[st].label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end border-t border-slate-100 pt-4">
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  Đóng
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
