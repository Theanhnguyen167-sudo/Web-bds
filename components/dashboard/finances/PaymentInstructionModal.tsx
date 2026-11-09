'use client';

import React, { useState } from 'react';
import {
  X,
  QrCode,
  Copy,
  Check,
  Upload,
  AlertTriangle,
  Building2,
  Lock,
  Loader2,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { formatCurrencyVND } from '@/lib/utils';
import { CodeBadge } from '@/components/common/CodeBadge';

interface PaymentInstructionModalProps {
  contractCode?: string;
  listingCode?: string;
  listingTitle?: string;
  installmentTitle: string;
  amount: number;
  onClose: () => void;
  onSubmitProof?: (proofUrl: string, note?: string) => Promise<void> | void;
}

export function PaymentInstructionModal({
  contractCode = 'HD-00035',
  listingCode = 'BDS-00125',
  listingTitle = 'Nhà phố Đống Đa 5 tầng',
  installmentTitle,
  amount,
  onClose,
  onSubmitProof,
}: PaymentInstructionModalProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [proofImage, setProofImage] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Thông tin tài khoản phong tỏa bảo chứng chính thức (Vietcombank Escrow)
  const bankInfo = {
    bankName: 'Ngân hàng TMCP Ngoại thương Việt Nam (Vietcombank)',
    bin: '970436', // Vietcombank BIN
    accountNumber: '9999888800001',
    accountName: 'HANOI REALTY ESCROW ACCOUNT',
    transferSyntax: `HNREALTY ${contractCode.replace('-', '')} ${listingCode.replace('-', '')} TT`,
  };

  const handleCopy = (text: string, field: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  // VietQR URL hợp lệ khớp đúng ngân hàng, tài khoản, số tiền và nội dung
  const qrUrl = amount > 0
    ? `https://img.vietqr.io/image/${bankInfo.bin}-${bankInfo.accountNumber}-compact2.jpg?amount=${amount}&addInfo=${encodeURIComponent(
        bankInfo.transferSyntax
      )}&accountName=${encodeURIComponent(bankInfo.accountName)}`
    : null;

  const handleFakeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      // Giả lập đọc file ảnh chuyển khoản
      const reader = new FileReader();
      reader.onload = () => {
        setProofImage(reader.result as string);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!proofImage) return;
    setIsUploading(true);
    if (onSubmitProof) {
      await onSubmitProof(proofImage, note);
    }
    setIsUploading(false);
    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="space-y-1">
            <h3 className="text-sm font-black text-slate-900">Hướng dẫn thanh toán & Chuyển khoản</h3>
            <p className="text-xs text-slate-500">{installmentTitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* Thông tin căn nhà & số tiền */}
          <div className="rounded-2xl border border-orange-200 bg-orange-50/70 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <CodeBadge code={listingCode} label="Mã căn" size="sm" />
                <CodeBadge code={contractCode} label="Mã HĐ" size="sm" />
              </div>
              <p className="text-xs font-bold text-slate-800">{listingTitle}</p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-[10.5px] font-bold text-orange-900 uppercase">Số tiền cần chuyển chính xác</p>
              <p className="text-xl font-black text-orange-600">{formatCurrencyVND(amount)}</p>
            </div>
          </div>

          {/* QR Code & Thông tin chuyển khoản */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            {/* Cột QR */}
            <div className="flex flex-col items-center justify-center p-4 rounded-2xl border border-slate-200 bg-slate-50 text-center space-y-2">
              {qrUrl ? (
                <>
                  <div className="p-2 bg-white rounded-xl shadow-xs border border-slate-200">
                    <img
                      src={qrUrl}
                      alt="VietQR Code"
                      className="w-44 h-44 object-contain"
                    />
                  </div>
                  <p className="text-[10.5px] text-slate-500 font-medium">
                    Quét mã QR bằng ứng dụng ngân hàng bất kỳ để tự động điền số tiền và cú pháp
                  </p>
                </>
              ) : (
                <div className="h-44 flex items-center justify-center text-slate-400">
                  <p>Không có mã QR</p>
                </div>
              )}
            </div>

            {/* Cột thông tin số tài khoản & Cú pháp */}
            <div className="space-y-3">
              <div>
                <p className="text-slate-400 font-semibold text-[11px]">Ngân hàng nhận:</p>
                <p className="font-extrabold text-slate-900 mt-0.5">{bankInfo.bankName}</p>
              </div>

              <div>
                <p className="text-slate-400 font-semibold text-[11px]">Chủ tài khoản bảo chứng:</p>
                <p className="font-extrabold text-slate-900 mt-0.5">{bankInfo.accountName}</p>
              </div>

              <div>
                <p className="text-slate-400 font-semibold text-[11px]">Số tài khoản:</p>
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200 mt-0.5">
                  <span className="font-mono font-black text-slate-900">{bankInfo.accountNumber}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(bankInfo.accountNumber, 'acc')}
                    className="p-1 text-slate-500 hover:text-orange-600 cursor-pointer"
                    title="Sao chép"
                  >
                    {copiedField === 'acc' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <p className="text-slate-400 font-semibold text-[11px]">Nội dung chuyển khoản chuẩn:</p>
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200 mt-0.5">
                  <span className="font-mono font-black text-slate-900">{bankInfo.transferSyntax}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(bankInfo.transferSyntax, 'syntax')}
                    className="p-1 text-slate-500 hover:text-orange-600 cursor-pointer"
                    title="Sao chép"
                  >
                    {copiedField === 'syntax' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Cảnh báo kiểm tra người nhận */}
          <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-[11.5px] text-amber-900 flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5 leading-relaxed">
              <p className="font-bold">Lưu ý bắt buộc trước khi chuyển khoản:</p>
              <p>
                Vui lòng kiểm tra kỹ tên người thụ hưởng đúng là <strong>HANOI REALTY ESCROW ACCOUNT</strong> và số tiền chính xác trước khi bấm xác nhận chuyển tiền.
              </p>
            </div>
          </div>

          {/* Tải chứng từ chuyển khoản */}
          <div className="rounded-2xl border border-slate-200 p-4 space-y-3 bg-slate-50/50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">Gửi chứng từ chuyển tiền (Ủy nhiệm chi / Biên lai)</span>
              <span className="text-[10.5px] text-slate-400">Ảnh JPG, PNG, PDF</span>
            </div>

            {proofImage ? (
              <div className="relative rounded-xl overflow-hidden border border-emerald-300">
                <img src={proofImage} alt="Chứng từ" className="w-full h-36 object-cover" />
                <button
                  type="button"
                  onClick={() => setProofImage(null)}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 rounded-xl hover:border-orange-500 bg-white cursor-pointer transition-colors">
                <Upload className="h-6 w-6 text-slate-400 mb-1" />
                <span className="text-xs font-bold text-slate-700">Tải ảnh biên lai chuyển khoản lên</span>
                <span className="text-[10.5px] text-slate-400 mt-0.5">Kéo thả hoặc nhấp để chọn tệp</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFakeUpload}
                  className="hidden"
                />
              </label>
            )}

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Ghi chú thêm (nếu có):</label>
              <input
                type="text"
                placeholder="VD: Đã chuyển khoản từ ngân hàng Techcombank lúc 14:30..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* Thông báo nguyên tắc đối soát */}
            <div className="text-[11px] text-slate-500 flex items-start gap-1.5 pt-1">
              <Info className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
              <span>
                <strong>Quy định đối soát:</strong> Tải ảnh chứng từ là bước gửi thông tin đối soát; giao dịch chỉ được chuyển sang trạng thái <strong>ĐÃ THANH TOÁN</strong> sau khi Ngân hàng hoặc Kế toán sàn xác nhận tiền nổi thực tế.
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            Đóng
          </button>

          {isSubmitted ? (
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
              <span>Đã gửi chứng từ đối soát thành công!</span>
            </div>
          ) : (
            <button
              type="button"
              disabled={!proofImage || isUploading}
              onClick={handleSubmit}
              className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              <span>Gửi chứng từ đối soát</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default PaymentInstructionModal;

