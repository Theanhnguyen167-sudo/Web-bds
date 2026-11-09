import React from 'react';
import { FileCheck2, FileText, Download } from 'lucide-react';

export default function BrokerContractsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <FileCheck2 className="h-6 w-6 text-indigo-600" />
          Hợp Đồng & Văn Bản Thỏa Thuận
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Hợp đồng hợp tác môi giới, cam kết bảo mật và thỏa thuận phân chia tỷ lệ hoa hồng theo từng giao dịch.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xs">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
          <FileCheck2 className="h-7 w-7" />
        </div>
        <h3 className="mt-4 text-base font-bold text-slate-900">
          Kho Hợp Đồng & Thỏa Thuận Pháp Lý
        </h3>
        <p className="mt-1 text-xs text-slate-500 max-w-md mx-auto">
          Mỗi giao dịch có mã hợp đồng và các điều khoản nghiệm thu rõ ràng để bảo vệ quyền lợi các bên khi phát sinh hoa hồng.
        </p>
      </div>
    </div>
  );
}

