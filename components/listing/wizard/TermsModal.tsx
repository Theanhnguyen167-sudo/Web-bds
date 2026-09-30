'use client';

import React from 'react';
import { X, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div 
        className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-border animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 text-accent">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-base font-extrabold text-text-primary">Quy định đăng tin Hanoi Realty</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-text-muted hover:bg-slate-100 hover:text-text-primary transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 max-h-[60vh] overflow-y-auto space-y-4 pr-1 text-xs text-text-secondary leading-relaxed scrollbar-thin">
          <div className="rounded-xl bg-orange-50/50 p-3 border border-orange-100 text-orange-950">
            <p className="font-bold flex items-center gap-1.5 text-accent">
              <AlertCircle className="h-4 w-4" /> Nguyên tắc minh bạch & pháp lý
            </p>
            <p className="mt-1 text-[11px] text-text-secondary">
              Mọi tin đăng trên Hanoi Realty phải cam kết tính xác thực, vị trí chính xác và quyền sở hữu hoặc đại diện hợp pháp.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-text-primary mb-1">1. Quyền sở hữu & tính pháp lý</h4>
            <p>
              Người đăng tin phải là chủ sở hữu, người đại diện theo ủy quyền hợp pháp, hoặc môi giới / sàn được ủy thác bán hoặc cho thuê bất động sản.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-text-primary mb-1">2. Tính trung thực của thông tin</h4>
            <p>
              Thông tin về giá, diện tích, quy hoạch, hình ảnh thực tế và hiện trạng pháp lý (sổ đỏ / sổ hồng / hợp đồng mua bán) phải trung thực và cập nhật mới nhất.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-text-primary mb-1">3. Kiểm duyệt nội dung</h4>
            <p>
              Tất cả tin đăng sau khi gửi sẽ được đưa vào trạng thái <strong className="text-amber-700">Chờ duyệt</strong>. Ban quản trị hệ thống sẽ đối chiếu toạ độ quy hoạch và nội dung trước khi hiển thị công khai trên nền tảng.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-text-primary mb-1">4. Bảo vệ thông tin liên hệ</h4>
            <p>
              Số điện thoại và thông tin liên hệ của bạn chỉ được dùng cho mục đích kết nối giao dịch BĐS. Hanoi Realty cam kết không bán hoặc chia sẻ thông tin cho bên thứ ba trái phép.
            </p>
          </div>
        </div>

        <div className="mt-5 flex justify-end pt-3 border-t border-border">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-accent px-5 py-2 text-xs font-bold text-white hover:bg-accent-hover transition-colors shadow-sm"
          >
            Tôi đã hiểu
          </button>
        </div>
      </div>
    </div>
  );
};
