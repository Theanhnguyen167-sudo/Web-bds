import React from 'react';

interface StatusBadgeProps {
  status: string;
  type?: 'user' | 'listing' | 'payment' | 'priority';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type = 'user' }) => {
  const getBadgeStyle = () => {
    switch (status) {
      // User / Listing active
      case 'active':
      case 'success':
      case 'Hoạt động':
      case 'Thành công':
      case 'Đang hiển thị':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          dot: 'bg-emerald-500',
          label: status === 'active' ? 'Hoạt động' : status === 'success' ? 'Thành công' : status
        };

      // Pending
      case 'pending':
      case 'Chờ duyệt':
      case 'Chờ xác thực':
      case 'Đang xử lý':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          dot: 'bg-amber-500 animate-pulse',
          label: status === 'pending' ? 'Chờ duyệt' : status
        };

      // Failed / Locked / Rejected
      case 'locked':
      case 'failed':
      case 'rejected':
      case 'Bị khóa':
      case 'Thất bại':
      case 'Bị từ chối':
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-200',
          dot: 'bg-rose-500',
          label: status === 'locked' ? 'Bị khóa' : status === 'failed' ? 'Thất bại' : status === 'rejected' ? 'Bị từ chối' : status
        };

      // Expired / Sold / Refunded
      case 'expired':
      case 'sold':
      case 'refunded':
      case 'Hết hạn':
      case 'Đã bán':
      case 'Hoàn tiền':
        return {
          bg: 'bg-slate-100 text-slate-700 border-slate-200',
          dot: 'bg-slate-400',
          label: status === 'expired' ? 'Hết hạn' : status === 'sold' ? 'Đã bán' : status === 'refunded' ? 'Hoàn tiền' : status
        };

      // Urgent
      case 'URGENT':
      case 'Khẩn cấp':
        return {
          bg: 'bg-orange-100 text-orange-700 border-orange-300',
          dot: 'bg-orange-600 animate-ping',
          label: 'Khẩn cấp'
        };

      default:
        return {
          bg: 'bg-gray-100 text-gray-700 border-gray-200',
          dot: 'bg-gray-400',
          label: status
        };
    }
  };

  const style = getBadgeStyle();

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${style.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      <span>{style.label}</span>
    </span>
  );
};
