'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Phone,
  Mail,
  Building,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Check,
  Info
} from 'lucide-react';
import {
  SellerInfo,
  SellerType,
  SellerValidationErrors,
  isValidVNPhone,
  isValidEmail,
  isCompanyRequired
} from './PostingDataTypes';

interface Step5SellerInfoProps {
  seller: SellerInfo;
  onChange: (updated: Partial<SellerInfo>) => void;
  errors: SellerValidationErrors;
  clearError: (field: keyof SellerValidationErrors) => void;
  onVerifyPhoneSuccess?: () => void;
}

const SELLER_TYPES: { id: SellerType; label: string; desc: string }[] = [
  { id: 'Chính chủ', label: 'Chính chủ', desc: 'Chủ sở hữu bất động sản trực tiếp' },
  { id: 'Môi giới', label: 'Môi giới', desc: 'Môi giới tự do / Chuyên viên tư vấn' },
  { id: 'Nhân viên sàn giao dịch', label: 'Nhân viên sàn giao dịch', desc: 'Đại diện sàn giao dịch BĐS' },
  { id: 'Chủ đầu tư', label: 'Chủ đầu tư', desc: 'Đơn vị phát triển dự án hoặc chủ đầu tư' },
  { id: 'Người được ủy quyền', label: 'Người được ủy quyền', desc: 'Đại diện hợp pháp theo văn bản ủy quyền' },
];

export const Step5SellerInfo: React.FC<Step5SellerInfoProps> = ({
  seller,
  onChange,
  errors,
  clearError,
  onVerifyPhoneSuccess,
}) => {
  const [isVerifyingPhone, setIsVerifyingPhone] = useState(false);
  const [phoneVerifyError, setPhoneVerifyError] = useState<string | null>(null);

  const handleVerifyPhoneClick = () => {
    setPhoneVerifyError(null);
    if (!seller.phone || !seller.phone.trim()) {
      setPhoneVerifyError('Vui lòng nhập số điện thoại trước khi xác thực');
      return;
    }
    if (!isValidVNPhone(seller.phone)) {
      setPhoneVerifyError('Số điện thoại không đúng định dạng Việt Nam');
      return;
    }

    setIsVerifyingPhone(true);
    // Giả lập tương tác xác thực an toàn không can thiệp backend OTP giả
    setTimeout(() => {
      setIsVerifyingPhone(false);
      onChange({ isPhoneVerified: true });
      clearError('phone');
      if (onVerifyPhoneSuccess) {
        onVerifyPhoneSuccess();
      }
    }, 500);
  };

  const handlePhoneChange = (newPhone: string) => {
    // Nếu người dùng thay đổi số điện thoại, reset trạng thái xác thực
    onChange({
      phone: newPhone,
      isPhoneVerified: false,
    });
    setPhoneVerifyError(null);
    if (errors.phone) clearError('phone');
  };

  const handleSellerTypeChange = (newType: SellerType) => {
    const requiresCo = isCompanyRequired(newType);
    onChange({
      sellerType: newType,
      // Tự động bật hiển thị tên công ty nếu là Môi giới / Sàn / Chủ đầu tư
      showCompany: requiresCo ? true : seller.showCompany,
    });
    if (errors.sellerType) clearError('sellerType');
    if (!requiresCo && errors.companyName) clearError('companyName');
  };

  const companyIsRequired = isCompanyRequired(seller.sellerType);

  return (
    <motion.div
      key="step5"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header của Bước 5 */}
      <div>
        <h2 className="text-lg font-extrabold text-text-primary">Bước 5: Thông tin người đăng</h2>
        <p className="text-xs text-text-secondary mt-1">
          Thông tin liên hệ sẽ được sử dụng để xác minh và giúp khách hàng liên hệ với người đăng tin.
        </p>
      </div>

      {/* Grid các trường nhập liệu - phong cách Step 4 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* A. Họ và tên * */}
        <div>
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-text-primary flex items-center gap-1">
              <User className="h-3.5 w-3.5 text-accent" />
              <span>Họ và tên người đăng</span>
              <span className="text-accent">*</span>
            </label>
          </div>
          <input
            type="text"
            required
            value={seller.fullName}
            onChange={(e) => {
              onChange({ fullName: e.target.value });
              if (errors.fullName) clearError('fullName');
            }}
            placeholder="VD: Nguyễn Văn A"
            className={`mt-1 w-full rounded-xl border bg-page-bg p-3 text-xs font-bold transition-all focus:bg-white focus:outline-none ${
              errors.fullName
                ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                : 'border-input focus:border-accent focus:ring-2 focus:ring-accent/15'
            }`}
          />
          {errors.fullName && (
            <p className="mt-1 text-[11px] font-semibold text-red-500 flex items-center gap-1 animate-in fade-in">
              <AlertCircle className="h-3 w-3 shrink-0" />
              <span>{errors.fullName}</span>
            </p>
          )}
        </div>

        {/* B. Số điện thoại * kèm Xác thực */}
        <div>
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-text-primary flex items-center gap-1">
              <Phone className="h-3.5 w-3.5 text-accent" />
              <span>Số điện thoại</span>
              <span className="text-accent">*</span>
            </label>
            {seller.isPhoneVerified && (
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-0.5">
                <Check className="h-3 w-3" /> Đã xác thực
              </span>
            )}
          </div>

          <div className="mt-1 flex items-center gap-2">
            <input
              type="tel"
              required
              value={seller.phone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              placeholder="VD: 0912 345 678"
              className={`flex-1 rounded-xl border bg-page-bg p-3 text-xs font-bold transition-all focus:bg-white focus:outline-none ${
                errors.phone || phoneVerifyError
                  ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                  : 'border-input focus:border-accent focus:ring-2 focus:ring-accent/15'
              }`}
            />

            {seller.isPhoneVerified ? (
              <div className="inline-flex items-center gap-1 px-3 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold whitespace-nowrap shadow-xs">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span className="hidden sm:inline">✓ Đã xác thực</span>
                <span className="sm:hidden">✓ OK</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleVerifyPhoneClick}
                disabled={isVerifyingPhone}
                className="inline-flex items-center gap-1 px-4 py-3 rounded-xl bg-orange-50 border border-accent/40 text-accent hover:bg-accent hover:text-white text-xs font-bold transition-all whitespace-nowrap shadow-xs disabled:opacity-50"
                title="Bấm để xác thực số điện thoại"
              >
                {isVerifyingPhone ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Đang kiểm tra...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>Xác thực</span>
                  </>
                )}
              </button>
            )}
          </div>

          {errors.phone && (
            <p className="mt-1 text-[11px] font-semibold text-red-500 flex items-center gap-1 animate-in fade-in">
              <AlertCircle className="h-3 w-3 shrink-0" />
              <span>{errors.phone}</span>
            </p>
          )}
          {phoneVerifyError && !errors.phone && (
            <p className="mt-1 text-[11px] font-semibold text-red-500 flex items-center gap-1 animate-in fade-in">
              <AlertCircle className="h-3 w-3 shrink-0" />
              <span>{phoneVerifyError}</span>
            </p>
          )}
          {!errors.phone && !phoneVerifyError && !seller.isPhoneVerified && (
            <p className="mt-1 text-[10px] text-text-muted">
              Định dạng 10 số (VD: 0912345678 hoặc 03x, 05x, 07x, 08x, 09x)
            </p>
          )}
        </div>

        {/* C. Email */}
        <div>
          <label className="text-xs font-bold text-text-primary flex items-center gap-1">
            <Mail className="h-3.5 w-3.5 text-accent" />
            <span>Email liên hệ</span>
            <span className="text-[10px] font-normal text-text-muted">(Không bắt buộc)</span>
          </label>
          <input
            type="email"
            value={seller.email}
            onChange={(e) => {
              onChange({ email: e.target.value });
              if (errors.email) clearError('email');
            }}
            placeholder="VD: nguyenvana@email.com"
            className={`mt-1 w-full rounded-xl border bg-page-bg p-3 text-xs font-bold transition-all focus:bg-white focus:outline-none ${
              errors.email
                ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                : 'border-input focus:border-accent focus:ring-2 focus:ring-accent/15'
            }`}
          />
          {errors.email && (
            <p className="mt-1 text-[11px] font-semibold text-red-500 flex items-center gap-1 animate-in fade-in">
              <AlertCircle className="h-3 w-3 shrink-0" />
              <span>{errors.email}</span>
            </p>
          )}
        </div>

        {/* D. Loại người đăng * */}
        <div>
          <label className="text-xs font-bold text-text-primary flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-accent" />
            <span>Loại người đăng</span>
            <span className="text-accent">*</span>
          </label>
          <select
            value={seller.sellerType}
            onChange={(e) => handleSellerTypeChange(e.target.value as SellerType)}
            className={`mt-1 w-full rounded-xl border bg-page-bg p-3 text-xs font-bold text-text-primary transition-all focus:bg-white focus:outline-none ${
              errors.sellerType
                ? 'border-red-500 focus:border-red-500'
                : 'border-input focus:border-accent'
            }`}
          >
            {SELLER_TYPES.map((type) => (
              <option key={type.id} value={type.id}>
                {type.label} - {type.desc}
              </option>
            ))}
          </select>
          {errors.sellerType && (
            <p className="mt-1 text-[11px] font-semibold text-red-500 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              <span>{errors.sellerType}</span>
            </p>
          )}
        </div>

        {/* E. Tên công ty / sàn giao dịch */}
        <div className="sm:col-span-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-text-primary flex items-center gap-1">
              <Building className="h-3.5 w-3.5 text-accent" />
              <span>Tên công ty hoặc sàn giao dịch</span>
              {companyIsRequired ? (
                <span className="text-accent font-bold">* (Bắt buộc với {seller.sellerType})</span>
              ) : (
                <span className="text-[10px] font-normal text-text-muted">(Không bắt buộc với Chính chủ)</span>
              )}
            </label>
          </div>
          <input
            type="text"
            required={companyIsRequired}
            value={seller.companyName}
            onChange={(e) => {
              onChange({ companyName: e.target.value });
              if (errors.companyName) clearError('companyName');
            }}
            placeholder={companyIsRequired ? "VD: Bất động sản Đất Xanh Miền Bắc / CenLand..." : "VD: Tên công ty hoặc văn phòng môi giới (nếu có)"}
            className={`mt-1 w-full rounded-xl border bg-page-bg p-3 text-xs font-bold transition-all focus:bg-white focus:outline-none ${
              errors.companyName
                ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                : 'border-input focus:border-accent focus:ring-2 focus:ring-accent/15'
            }`}
          />
          {errors.companyName && (
            <p className="mt-1 text-[11px] font-semibold text-red-500 flex items-center gap-1 animate-in fade-in">
              <AlertCircle className="h-3 w-3 shrink-0" />
              <span>{errors.companyName}</span>
            </p>
          )}
        </div>

        {/* F. Địa chỉ liên hệ */}
        <div className="sm:col-span-2">
          <label className="text-xs font-bold text-text-primary flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 text-accent" />
            <span>Địa chỉ liên hệ</span>
            <span className="text-[10px] font-normal text-text-muted">(Không bắt buộc)</span>
          </label>
          <input
            type="text"
            value={seller.contactAddress}
            onChange={(e) => onChange({ contactAddress: e.target.value })}
            placeholder="VD: Tòa nhà Keangnam, Phạm Hùng, Mễ Trì, Nam Từ Liêm, Hà Nội"
            className="mt-1 w-full rounded-xl border border-input bg-page-bg p-3 text-xs font-semibold text-text-primary transition-all focus:border-accent focus:bg-white focus:outline-none"
          />
        </div>
      </div>

      {/* 4. Section: THÔNG TIN LIÊN HỆ HIỂN THỊ CHO KHÁCH HÀNG */}
      <div className="rounded-2xl border border-border bg-orange-50/20 p-5 space-y-4">
        <div>
          <h3 className="text-sm font-extrabold text-text-primary flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/20 text-accent text-xs">👁️</span>
            <span>Thông tin liên hệ hiển thị</span>
          </h3>
          <p className="text-xs text-text-secondary mt-0.5">
            Lựa chọn thông tin mà khách hàng có thể nhìn thấy khi xem tin đăng.
          </p>
        </div>

        <div className="space-y-3 pt-1">
          {/* Checkbox 1: Hiển thị số điện thoại */}
          <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-50/80 cursor-pointer transition-colors shadow-2xs">
            <input
              type="checkbox"
              checked={seller.showPhone}
              onChange={(e) => onChange({ showPhone: e.target.checked })}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-accent focus:ring-accent accent-orange-500 cursor-pointer"
            />
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-text-primary block">
                Hiển thị số điện thoại trên tin đăng
              </span>
              <p className="text-[11px] text-text-secondary">
                Người tìm mua có thể xem số và liên hệ gọi điện / nhắn tin trực tiếp với bạn.
              </p>
            </div>
          </label>

          {/* Checkbox 2: Cho phép liên hệ email */}
          <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-50/80 cursor-pointer transition-colors shadow-2xs">
            <input
              type="checkbox"
              checked={seller.allowEmailContact}
              onChange={(e) => onChange({ allowEmailContact: e.target.checked })}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-accent focus:ring-accent accent-orange-500 cursor-pointer"
            />
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-text-primary block">
                Cho phép khách hàng liên hệ qua email
              </span>
              <p className="text-[11px] text-text-secondary">
                Khách hàng có thể gửi thư trao đổi, đặt lịch hẹn xem nhà qua địa chỉ email đã đăng ký.
              </p>
            </div>
          </label>

          {/* Checkbox 3: Hiển thị tên công ty / sàn */}
          <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-50/80 cursor-pointer transition-colors shadow-2xs">
            <input
              type="checkbox"
              checked={seller.showCompany}
              onChange={(e) => onChange({ showCompany: e.target.checked })}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-accent focus:ring-accent accent-orange-500 cursor-pointer"
            />
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-text-primary block">
                Hiển thị tên công ty / sàn giao dịch
              </span>
              <p className="text-[11px] text-text-secondary">
                Đính kèm thương hiệu doanh nghiệp hoặc sàn giao dịch để gia tăng uy tín cho tin đăng.
              </p>
            </div>
          </label>
        </div>

        {/* Dòng note nhỏ */}
        <div className="flex items-center gap-2 pt-1 text-[11px] text-text-muted">
          <Info className="h-3.5 w-3.5 text-accent shrink-0" />
          <span>Thông tin liên hệ của bạn chỉ được sử dụng cho mục đích liên hệ liên quan đến tin đăng.</span>
        </div>
      </div>
    </motion.div>
  );
};
