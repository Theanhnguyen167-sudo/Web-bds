import React from 'react';
import { Settings, ShieldCheck, User, Building, CreditCard } from 'lucide-react';

export default function BrokerSettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Settings className="h-6 w-6 text-slate-700" />
          Cài Đặt Hồ Sơ & Chứng Chỉ Hành Nghề
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Cập nhật thông tin định danh, tài khoản ngân hàng nhận hoa hồng và chứng chỉ môi giới BĐS để được phê duyệt quyền khai thác.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-emerald-600" />
          Hồ sơ kiểm duyệt môi giới
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          HaNoi Realty yêu cầu môi giới cung cấp chứng chỉ đào tạo hoặc chứng chỉ hành nghề môi giới BĐS hợp lệ. Đội ngũ kiểm soát sẽ thẩm định trong vòng 24 giờ làm việc.
        </p>
        
        <div className="pt-2">
          <div className="border border-dashed border-slate-300 rounded-xl p-6 text-center bg-slate-50">
            <User className="h-8 w-8 text-slate-400 mx-auto mb-2" />
            <div className="text-xs font-semibold text-slate-700">Tải lên chứng chỉ hành nghề hoặc giấy phép liên quan</div>
            <p className="text-[11px] text-slate-500 mt-1">Định dạng hỗ trợ: PDF, JPG, PNG (tối đa 10MB)</p>
          </div>
        </div>
      </div>
    </div>
  );
}

