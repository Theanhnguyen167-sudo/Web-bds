'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/context/AppContext';
import {
  CreditCard,
  Smartphone,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  Zap,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { formatCurrencyVND } from '@/lib/utils';

export default function PaymentTestPage() {
  const router = useRouter();
  const { user, setUser, addToast } = useApp();
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    addToast(`Đã sao chép ${label}`, 'info');
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleTestMoMo = () => {
    router.push('/payment/checkout?packageId=pro&billing=monthly');
  };

  const handleTestVNPay = () => {
    router.push('/payment/checkout?packageId=pro&billing=yearly');
  };

  const handleSimulateSuccess = () => {
    if (user) {
      setUser({
        ...user,
        package: 'Pro',
        packageExpiry: '2026-09-24',
        listingsCount: user.listingsCount + 50,
      });
    }
    router.push('/payment/success?orderId=TEST_MOCK_SUCCESS_99&method=momo&amount=599000');
  };

  const handleSimulateError = () => {
    router.push('/payment/error?reason=Khách hàng đã hủy giao dịch trên cổng thanh toán&method=vnpay&orderId=TEST_MOCK_FAIL_01');
  };

  return (
    <div className="min-h-screen bg-page-bg py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-amber-500 text-slate-950 p-6 rounded-3xl space-y-2 shadow-lg">
          <div className="flex items-center gap-2 font-black text-lg">
            <ShieldAlert className="h-6 w-6" />
            <span>🧪 Payment Sandbox Testing Hub (Dev Mode)</span>
          </div>
          <p className="text-xs font-semibold">
            Bảng điều khiển kiểm thử giao diện & luồng xử lý cổng thanh toán MoMo, VNPay và Chuyển khoản ngân hàng.
          </p>
        </div>

        {/* 4 Interactive Test Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Test MoMo Checkout */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-navy font-bold text-sm">
                <span className="h-8 w-8 rounded-xl bg-[#ae2070] text-white flex items-center justify-center font-black">
                  M
                </span>
                <span>Kiểm thử Luồng MoMo QR</span>
              </div>
              <p className="text-xs text-slate-500">
                Tạo đơn hàng gói Pro 1 tháng ({formatCurrencyVND(599000)}) và mở giao diện quét QR với đồng hồ đếm ngược.
              </p>
            </div>
            <button
              onClick={handleTestMoMo}
              className="w-full py-3 bg-[#ae2070] hover:bg-[#921a5d] text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <Smartphone className="h-4 w-4" /> Bắt đầu Test MoMo →
            </button>
          </div>

          {/* Test VNPay Checkout */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-navy font-bold text-sm">
                <span className="h-8 w-8 rounded-xl bg-[#0066cc] text-white flex items-center justify-center font-black text-xs">
                  VNP
                </span>
                <span>Kiểm thử Luồng VNPay</span>
              </div>
              <p className="text-xs text-slate-500">
                Tạo đơn hàng gói Pro 1 năm và mở bảng chọn hơn 40 ngân hàng đối tác liên kết.
              </p>
            </div>
            <button
              onClick={handleTestVNPay}
              className="w-full py-3 bg-[#0066cc] hover:bg-[#0052a3] text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <CreditCard className="h-4 w-4" /> Bắt đầu Test VNPay →
            </button>
          </div>

          {/* Simulate Success */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-navy font-bold text-sm">
                <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                <span>Mô phỏng Giao diện Thành công</span>
              </div>
              <p className="text-xs text-slate-500">
                Kiểm tra hiệu ứng animation checkmark, hóa đơn điện tử và các nút điều hướng sau thanh toán.
              </p>
            </div>
            <button
              onClick={handleSimulateSuccess}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="h-4 w-4" /> Mở trang Thành công →
            </button>
          </div>

          {/* Simulate Error */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-navy font-bold text-sm">
                <XCircle className="h-6 w-6 text-rose-500" />
                <span>Mô phỏng Giao diện Thất bại</span>
              </div>
              <p className="text-xs text-slate-500">
                Kiểm tra giao diện báo lỗi khi người dùng hủy giao dịch hoặc thẻ không đủ số dư.
              </p>
            </div>
            <button
              onClick={handleSimulateError}
              className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <XCircle className="h-4 w-4" /> Mở trang Báo lỗi →
            </button>
          </div>
        </div>

        {/* VNPay Sandbox Test Cards Reference */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-black text-sm text-navy">
            💳 Thông tin Thẻ Test VNPay Sandbox chính thức
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* ATM Card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-navy block">Thẻ ATM Nội địa (Vietcombank):</span>
              <div className="space-y-1 font-mono text-[11px] text-slate-700">
                <div className="flex justify-between items-center">
                  <span>Số thẻ: <strong>9704198526191432198</strong></span>
                  <button
                    onClick={() => handleCopy('9704198526191432198', 'Số thẻ ATM')}
                    className="p-1 rounded bg-white border"
                  >
                    {copiedText === 'Số thẻ ATM' ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                  </button>
                </div>
                <p>Tên chủ thẻ: NGUYEN VAN A</p>
                <p>Ngày phát hành: 07/15</p>
                <p>Mã OTP: <strong>123456</strong></p>
              </div>
            </div>

            {/* Visa Card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-navy block">Thẻ Quốc tế (Visa / Mastercard):</span>
              <div className="space-y-1 font-mono text-[11px] text-slate-700">
                <div className="flex justify-between items-center">
                  <span>Số thẻ: <strong>4456530000001005</strong></span>
                  <button
                    onClick={() => handleCopy('4456530000001005', 'Số thẻ Visa')}
                    className="p-1 rounded bg-white border"
                  >
                    {copiedText === 'Số thẻ Visa' ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                  </button>
                </div>
                <p>Hết hạn: 01/25</p>
                <p>Mã CVV: <strong>123</strong></p>
                <p>Mã OTP: <strong>123456</strong></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
