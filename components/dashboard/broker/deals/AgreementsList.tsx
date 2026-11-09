'use client';

import React, { useState } from 'react';
import { 
  FileCheck2, 
  Download, 
  Eye, 
  CheckCircle2, 
  Clock, 
  FileText, 
  ShieldCheck, 
  KeyRound, 
  Check, 
  X,
  Building2,
  Calendar
} from 'lucide-react';
import { AgreementDocument, AgreementStatus } from '@/types/broker-deal';

interface AgreementsListProps {
  initialAgreements: AgreementDocument[];
}

export const AgreementsList: React.FC<AgreementsListProps> = ({ initialAgreements }) => {
  const [agreements, setAgreements] = useState<AgreementDocument[]>(initialAgreements);
  const [signingModalAgr, setSigningModalAgr] = useState<AgreementDocument | null>(null);
  const [otpCode, setOtpCode] = useState('');
  const [isSignSuccess, setIsSignSuccess] = useState(false);

  const getStatusBadge = (status: AgreementStatus) => {
    switch (status) {
      case 'signed':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            Đã ký số điện tử
          </span>
        );
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-700 border border-blue-200">
            <Clock className="h-3.5 w-3.5 text-blue-600" />
            Đã xác nhận điều khoản
          </span>
        );
      case 'read':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-600 border border-slate-200">
            <Eye className="h-3.5 w-3.5 text-slate-500" />
            Đã đọc văn bản
          </span>
        );
    }
  };

  const handleSignConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signingModalAgr) return;

    setIsSignSuccess(true);

    setTimeout(() => {
      setAgreements((prev) =>
        prev.map((a) =>
          a.id === signingModalAgr.id
            ? {
                ...a,
                status: 'signed',
                statusLabel: 'Đã ký số hợp lệ',
                signedAt: new Date().toISOString(),
                signerName: 'Nguyễn Thế Anh (Đã ký số)',
              }
            : a
        )
      );
      setIsSignSuccess(false);
      setSigningModalAgr(null);
      setOtpCode('');
    }, 1000);
  };

  return (
    <div className="space-y-4">
      
      {/* Banner cam kết tính pháp lý hợp đồng */}
      <div className="rounded-xl bg-blue-50/70 border border-blue-200 p-4 text-xs text-blue-950 flex items-start gap-3">
        <ShieldCheck className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <strong>Pháp lý minh bạch theo từng phiên bản giao dịch:</strong> HaNoi Realty áp dụng quy trình xác thực hợp đồng điện tử 3 bước phân tầng: <em>Đã đọc ➔ Đã xác nhận ➔ Đã ký số</em>. Tỷ lệ hoa hồng được bảo đảm không bị điều chỉnh sau khi đã ký kết.
        </div>
      </div>

      {/* Danh sách Hợp đồng / Thỏa thuận */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-semibold">
                <th className="p-3.5 pl-5">Văn bản & Mã hồ sơ</th>
                <th className="p-3.5">Mã Deal / BĐS</th>
                <th className="p-3.5">Trạng thái phân tầng</th>
                <th className="p-3.5">Phiên bản hoa hồng</th>
                <th className="p-3.5">Ngày hiệu lực</th>
                <th className="p-3.5 pr-5 text-right">Tác vụ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {agreements.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                  
                  {/* Mã & Tên văn bản */}
                  <td className="p-3.5 pl-5 max-w-[280px]">
                    <div className="font-mono text-[10px] font-bold text-blue-700">
                      {item.code}
                    </div>
                    <div className="font-bold text-slate-900 mt-0.5 line-clamp-1">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Bên ký: {item.signerName}
                    </div>
                  </td>

                  {/* Mã Deal / BĐS */}
                  <td className="p-3.5">
                    <span className="font-mono text-[11px] font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                      {item.dealCode}
                    </span>
                    <div className="text-[11px] text-slate-500 mt-0.5 font-mono">
                      {item.propertyCode}
                    </div>
                  </td>

                  {/* Trạng thái 3 bước */}
                  <td className="p-3.5">
                    {getStatusBadge(item.status)}
                    {item.signedAt && (
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Ký lúc: {new Date(item.signedAt).toLocaleDateString('vi-VN')}
                      </div>
                    )}
                  </td>

                  {/* Phiên bản hoa hồng */}
                  <td className="p-3.5 max-w-[200px]">
                    <p className="text-slate-700 text-[11px] line-clamp-2">
                      {item.commissionRateText}
                    </p>
                  </td>

                  {/* Ngày hiệu lực */}
                  <td className="p-3.5 text-slate-600 font-medium">
                    {new Date(item.effectiveDate).toLocaleDateString('vi-VN')}
                  </td>

                  {/* Tác vụ */}
                  <td className="p-3.5 pr-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {item.status !== 'signed' ? (
                        <button
                          type="button"
                          onClick={() => setSigningModalAgr(item)}
                          className="inline-flex items-center gap-1 rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-500 shadow-2xs"
                        >
                          <KeyRound className="h-3.5 w-3.5" />
                          <span>Ký số ngay</span>
                        </button>
                      ) : (
                        <a
                          href={item.pdfUrl}
                          className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          <Download className="h-3.5 w-3.5 text-blue-600" />
                          <span>Tải PDF đã ký</span>
                        </a>
                      )}
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL KÝ SỐ ĐIỆN TỬ */}
      {signingModalAgr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative flex flex-col w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-100 p-6 space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <KeyRound className="h-4 w-4 text-blue-600" />
                Xác Nhận Ký Số Điện Tử (E-Sign)
              </h3>
              <button
                onClick={() => setSigningModalAgr(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {isSignSuccess ? (
              <div className="py-6 text-center space-y-2">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                  <Check className="h-6 w-6" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Ký số văn bản thành công!</h4>
                <p className="text-xs text-slate-500">Mã băm chữ ký điện tử đã được ghi nhận vào hợp đồng.</p>
              </div>
            ) : (
              <form onSubmit={handleSignConfirm} className="space-y-3.5 text-xs">
                <div className="rounded-xl bg-slate-50 p-3 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Văn bản ký:</span>
                  <strong className="text-slate-900">{signingModalAgr.title}</strong>
                  <div className="text-[11px] text-blue-700 font-mono">Mã hồ sơ: {signingModalAgr.code}</div>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Nhập mã xác thực ký điện tử (Mã OTP mẫu: 123456):
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nhập 6 chữ số OTP..."
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-center font-mono font-bold tracking-widest text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="text-[11px] text-slate-500 leading-relaxed">
                  Bằng việc bấm xác nhận ký, bạn đồng ý với toàn bộ các điều khoản phân chia hoa hồng môi giới theo phiên bản quy chế giao dịch này.
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setSigningModalAgr(null)}
                    className="rounded-xl border border-slate-300 px-4 py-2 font-semibold text-slate-700"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-500 shadow"
                  >
                    Xác nhận ký số
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

