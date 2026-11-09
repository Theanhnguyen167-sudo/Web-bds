import React from 'react';
import { Users2, Crown, UserPlus, ShieldCheck } from 'lucide-react';

export default function BrokerTeamMembersPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Users2 className="h-6 w-6 text-purple-600" />
            Quản Lý Thành Viên Đội Nhóm (TPKD)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Theo dõi danh sách các thành viên CTV trong đội nhóm trực thuộc và hỗ trợ dẫn khách.
          </p>
        </div>
      </div>

      <div className="rounded-xl bg-purple-50 border border-purple-200 p-4 text-xs text-purple-950 flex items-start gap-3">
        <Crown className="h-5 w-5 text-purple-600 shrink-0 mt-0.5" />
        <div>
          <strong>Quy chuẩn vai trò TPKD:</strong> TPKD là vai trò quản lý điều phối và hỗ trợ nghiệp vụ cho nhóm, không phải tầng hoa hồng tuyển dụng. Mọi phần thưởng của TPKD gắn liền với nhiệm vụ và đóng góp thực tế được xác nhận.
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xs">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
          <Users2 className="h-7 w-7" />
        </div>
        <h3 className="mt-4 text-base font-bold text-slate-900">
          Danh Sách Đội Nhóm (8 Thành viên CTV)
        </h3>
        <p className="mt-1 text-xs text-slate-500 max-w-md mx-auto">
          Xem thông tin liên hệ, tiến độ khai thác kho nhà và hỗ trợ tư vấn chốt giao dịch.
        </p>
      </div>
    </div>
  );
}

