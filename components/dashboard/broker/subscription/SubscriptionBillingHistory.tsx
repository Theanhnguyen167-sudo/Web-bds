'use client';

import React, { useState } from 'react';
import {
  FileText,
  Download,
  CheckCircle2,
  Calendar,
  CreditCard,
  Eye,
  X,
  Receipt
} from 'lucide-react';
import { SubscriptionInvoice } from '@/types/broker-subscription';

interface SubscriptionBillingHistoryProps {
  invoices: SubscriptionInvoice[];
}

export const SubscriptionBillingHistory: React.FC<SubscriptionBillingHistoryProps> = ({
  invoices,
}) => {
  const [previewInvoice, setPreviewInvoice] = useState<SubscriptionInvoice | null>(null);

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const handleDownloadInvoice = (inv: SubscriptionInvoice) => {
    // Giả lập tải file biên nhận điện tử
    const content = `BIÊN NHẬN ĐIỆN TỬ HANOI REALTY\n\nMã hóa đơn: ${inv.invoiceCode}\nGói: ${inv.planName}\nSố tiền: ${inv.amount.toLocaleString('vi-VN')} đ\nPhương thức: ${inv.paymentMethodTitle}\nNgày thanh toán: ${formatDate(inv.paidAt)}\nThời hạn: ${formatDate(inv.validFrom)} - ${formatDate(inv.validUntil)}\nTrạng thái: Đã thanh toán hợp lệ (PAID)\n\nCảm ơn bạn đã đồng hành cùng HaNoi Realty!`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${inv.invoiceCode}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Receipt className="h-5 w-5 text-blue-600" />
            Lịch Sử Thanh Toán & Biên Nhận Gói Dịch Vụ
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Lưu trữ đầy đủ hóa đơn điện tử cho mục đích quyết toán thuế và đối chiếu chi phí cá nhân.
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Mã Hóa Đơn</th>
                <th className="px-5 py-3.5">Gói Dịch Vụ</th>
                <th className="px-5 py-3.5">Phương Thức</th>
                <th className="px-5 py-3.5">Ngày Thanh Toán</th>
                <th className="px-5 py-3.5">Thời Hạn Hiệu Lực</th>
                <th className="px-5 py-3.5 text-right">Số Tiền</th>
                <th className="px-5 py-3.5 text-center">Trạng Thái</th>
                <th className="px-5 py-3.5 text-right">Hành Động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-4 font-mono font-bold text-blue-700">
                    {inv.invoiceCode}
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-bold text-slate-900">{inv.planName}</div>
                    <div className="text-[11px] text-slate-500">{inv.cycleText}</div>
                  </td>
                  <td className="px-5 py-4 text-slate-700">
                    <span className="inline-flex items-center gap-1.5">
                      <CreditCard className="h-3.5 w-3.5 text-slate-400" />
                      {inv.paymentMethodTitle}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-600">
                    {formatDate(inv.paidAt)}
                  </td>
                  <td className="px-5 py-4 text-slate-600">
                    {formatDate(inv.validFrom)} – {formatDate(inv.validUntil)}
                  </td>
                  <td className="px-5 py-4 text-right font-bold text-slate-900">
                    {inv.amount === 0 ? (
                      <span className="text-emerald-600">0 đ (Miễn phí)</span>
                    ) : (
                      `${inv.amount.toLocaleString('vi-VN')} đ`
                    )}
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="h-3 w-3" />
                      Đã thanh toán
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setPreviewInvoice(inv)}
                        className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-blue-600 transition-colors"
                        title="Xem biên nhận"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDownloadInvoice(inv)}
                        className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-emerald-600 transition-colors"
                        title="Tải biên nhận"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Preview Biên Nhận Điện Tử */}
      {previewInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Receipt className="h-5 w-5 text-blue-600" />
                <h4 className="font-bold text-slate-900 text-sm">Biên Nhận Điện Tử</h4>
              </div>
              <button
                onClick={() => setPreviewInvoice(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="rounded-xl bg-blue-50/70 p-3 text-center border border-blue-100">
                <div className="text-[11px] text-blue-600 font-semibold uppercase">Số tiền đã quyết toán</div>
                <div className="text-xl font-extrabold text-blue-700 mt-0.5">
                  {previewInvoice.amount === 0 ? '0 đ' : `${previewInvoice.amount.toLocaleString('vi-VN')} đ`}
                </div>
              </div>

              <div className="space-y-2 border-t border-slate-100 pt-3">
                <div className="flex justify-between">
                  <span className="text-slate-500">Mã biên nhận:</span>
                  <span className="font-mono font-bold text-slate-900">{previewInvoice.invoiceCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Gói áp dụng:</span>
                  <span className="font-semibold text-slate-900">{previewInvoice.planName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Chu kỳ:</span>
                  <span className="text-slate-900">{previewInvoice.cycleText}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Phương thức:</span>
                  <span className="text-slate-900">{previewInvoice.paymentMethodTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Thời hạn sử dụng:</span>
                  <span className="text-slate-900">
                    {formatDate(previewInvoice.validFrom)} – {formatDate(previewInvoice.validUntil)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Đơn vị phát hành:</span>
                  <span className="font-semibold text-slate-900">CTCP Công nghệ BĐS HaNoi Realty</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                onClick={() => setPreviewInvoice(null)}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Đóng
              </button>
              <button
                onClick={() => handleDownloadInvoice(previewInvoice)}
                className="px-3.5 py-1.5 rounded-xl bg-blue-600 text-xs font-semibold text-white hover:bg-blue-500 flex items-center gap-1.5"
              >
                <Download className="h-3.5 w-3.5" />
                Tải biên nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

