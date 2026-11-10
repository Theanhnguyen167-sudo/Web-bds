'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useApp } from '@/lib/context/AppContext';
import { formatCurrencyVND } from '@/lib/utils';
import {
  Home,
  Building2,
  Trees,
  Landmark,
  MapPin,
  DollarSign,
  Compass,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Check,
  Phone,
  User,
  Mail,
  Clock,
  Car,
  FileCheck2,
  HelpCircle,
  Search,
  LogIn
} from 'lucide-react';
import { BuyerPurpose, UrgencyLevel, BuyerRequest } from '@/types/buyer-request';

const HANOI_POPULAR_DISTRICTS = [
  'Cầu Giấy',
  'Nam Từ Liêm',
  'Bắc Từ Liêm',
  'Thanh Xuân',
  'Hà Đông',
  'Đống Đa',
  'Ba Đình',
  'Tây Hồ',
  'Hai Bà Trưng',
  'Hoàng Mai',
  'Long Biên',
  'Hoài Đức',
  'Gia Lâm',
  'Đông Anh',
];

const PROPERTY_TYPES = [
  { id: 'house', label: 'Nhà phố / Liền kề', icon: Home, desc: 'Nhà riêng, nhà ngõ, phân lô' },
  { id: 'apartment', label: 'Chung cư cao cấp', icon: Building2, desc: 'Căn hộ chung cư, tòa nhà' },
  { id: 'land', label: 'Đất thổ cư / Đất nền', icon: Trees, desc: 'Đất thổ cư, đất đấu giá' },
  { id: 'villa', label: 'Biệt thự / Shophouse', icon: Landmark, desc: 'Biệt thự, nhà phố thương mại' },
];

const PURPOSE_OPTIONS: { id: BuyerPurpose; label: string; desc: string }[] = [
  { id: 'living', label: 'Mua để ở / An cư', desc: 'Ưu tiên vị trí gần trường học, chợ, môi trường sống văn minh' },
  { id: 'investment', label: 'Mua để đầu tư sinh lời', desc: 'Ưu tiên tiềm năng tăng giá, vị trí chiến lược và kết nối giao thông' },
  { id: 'business', label: 'Mua để kinh doanh / Cho thuê', desc: 'Ưu tiên mặt tiền rộng, vỉa hè, dòng tiền cho thuê ổn định' },
  { id: 'other', label: 'Nhu cầu khác', desc: 'Mua làm tài sản tích lũy, giữ tiền hoặc mục đích riêng' },
];

const BUDGET_PRESETS = [
  { label: 'Dưới 3 tỷ', min: 1_000_000_000, max: 3_000_000_000 },
  { label: '3 - 5 tỷ', min: 3_000_000_000, max: 5_000_000_000 },
  { label: '5 - 8 tỷ', min: 5_000_000_000, max: 8_000_000_000 },
  { label: '8 - 15 tỷ', min: 8_000_000_000, max: 15_000_000_000 },
  { label: 'Trên 15 tỷ', min: 15_000_000_000, max: 50_000_000_000 },
];

export const BuyerRequestWizard: React.FC = () => {
  const router = useRouter();
  const { user, addToast } = useApp();

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState<BuyerRequest | null>(null);

  // Form State
  const [purpose, setPurpose] = useState<BuyerPurpose>('living');
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['house']);
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>(['Cầu Giấy', 'Nam Từ Liêm']);
  const [districtsInput, setDistrictsInput] = useState<string>('Cầu Giấy, Nam Từ Liêm');
  const [budgetMinInput, setBudgetMinInput] = useState<string>('3');
  const [budgetMaxInput, setBudgetMaxInput] = useState<string>('6');

  const [minArea, setMinArea] = useState<number>(45);
  const [minBedrooms, setMinBedrooms] = useState<number>(3);
  const [selectedDirections, setSelectedDirections] = useState<string[]>(['Đông Nam', 'Nam']);
  const [carAccess, setCarAccess] = useState<boolean>(true);

  // Bước 3 State
  const [supportType, setSupportType] = useState<'connect_ctv' | 'self_search' | 'has_broker'>('has_broker');
  const [referralCode, setReferralCode] = useState<string>('');
  const [agreeConsent, setAgreeConsent] = useState<boolean>(true);

  const [urgency, setUrgency] = useState<UrgencyLevel>('within_1_month');
  const [needsLoanSupport, setNeedsLoanSupport] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>('');

  const [contactName, setContactName] = useState<string>(user?.name || '');
  const [contactPhone, setContactPhone] = useState<string>(user?.phone || '');
  const [contactEmail, setContactEmail] = useState<string>(user?.email || '');
  const [preferredContactTime, setPreferredContactTime] = useState<string>('Bất kỳ lúc nào');

  // Validation Errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // ── Khôi phục bản nháp từ localStorage nếu có ──
  useEffect(() => {
    try {
      const draftRaw = localStorage.getItem('hanoi_realty_buyer_request_draft');
      if (draftRaw) {
        const draft = JSON.parse(draftRaw);
        if (draft.purpose) setPurpose(draft.purpose);
        if (Array.isArray(draft.selectedTypes) && draft.selectedTypes.length > 0) setSelectedTypes(draft.selectedTypes);
        if (draft.districtsInput) setDistrictsInput(draft.districtsInput);
        if (draft.budgetMinInput) setBudgetMinInput(draft.budgetMinInput);
        if (draft.budgetMaxInput) setBudgetMaxInput(draft.budgetMaxInput);
        if (draft.minArea) setMinArea(draft.minArea);
        if (draft.minBedrooms) setMinBedrooms(draft.minBedrooms);
        if (draft.selectedDirections) setSelectedDirections(draft.selectedDirections);
        if (typeof draft.carAccess === 'boolean') setCarAccess(draft.carAccess);
        if (draft.supportType) setSupportType(draft.supportType);
        if (draft.referralCode) setReferralCode(draft.referralCode);
        if (draft.urgency) setUrgency(draft.urgency);
        if (typeof draft.needsLoanSupport === 'boolean') setNeedsLoanSupport(draft.needsLoanSupport);
        if (draft.notes) setNotes(draft.notes);
        if (draft.contactName) setContactName(draft.contactName);
        if (draft.contactPhone) setContactPhone(draft.contactPhone);
        if (draft.contactEmail) setContactEmail(draft.contactEmail);
        if (draft.preferredContactTime) setPreferredContactTime(draft.preferredContactTime);
      }
    } catch {}
  }, []);

  // ── Tự động lưu bản nháp vào localStorage khi khách thay đổi dữ liệu ──
  useEffect(() => {
    if (submittedRequest) return;
    try {
      const draft = {
        purpose,
        selectedTypes,
        districtsInput,
        budgetMinInput,
        budgetMaxInput,
        minArea,
        minBedrooms,
        selectedDirections,
        carAccess,
        supportType,
        referralCode,
        urgency,
        needsLoanSupport,
        notes,
        contactName,
        contactPhone,
        contactEmail,
        preferredContactTime,
      };
      localStorage.setItem('hanoi_realty_buyer_request_draft', JSON.stringify(draft));
    } catch {}
  }, [
    purpose, selectedTypes, districtsInput, budgetMinInput, budgetMaxInput, minArea,
    minBedrooms, selectedDirections, carAccess, supportType, referralCode, urgency,
    needsLoanSupport, notes, contactName, contactPhone, contactEmail, preferredContactTime,
    submittedRequest
  ]);

  // Cập nhật thông tin liên hệ khi user login
  useEffect(() => {
    if (user) {
      if (!contactName && user.name) setContactName(user.name);
      if (!contactPhone && user.phone) setContactPhone(user.phone);
      if (!contactEmail && user.email) setContactEmail(user.email);
    }
  }, [user]);

  const toggleType = (typeId: string) => {
    if (selectedTypes.includes(typeId)) {
      if (selectedTypes.length > 1) {
        setSelectedTypes(selectedTypes.filter((t) => t !== typeId));
      }
    } else {
      setSelectedTypes([...selectedTypes, typeId]);
    }
  };

  const toggleDistrict = (district: string) => {
    if (selectedDistricts.includes(district)) {
      if (selectedDistricts.length > 1) {
        const next = selectedDistricts.filter((d) => d !== district);
        setSelectedDistricts(next);
        setDistrictsInput(next.join(', '));
      }
    } else {
      const next = [...selectedDistricts, district];
      setSelectedDistricts(next);
      setDistrictsInput(next.join(', '));
    }
  };

  const toggleDirection = (dir: string) => {
    if (selectedDirections.includes(dir)) {
      setSelectedDirections(selectedDirections.filter((d) => d !== dir));
    } else {
      setSelectedDirections([...selectedDirections, dir]);
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (step === 1) {
      if (selectedTypes.length === 0) newErrors.types = 'Vui lòng chọn ít nhất 1 loại hình BĐS';
    }

    if (step === 2) {
      if (!districtsInput.trim()) {
        newErrors.districts = 'Vui lòng nhập hoặc chọn quận/huyện mong muốn';
      }
      const minVal = parseFloat(budgetMinInput);
      const maxVal = parseFloat(budgetMaxInput);
      if (isNaN(minVal) || minVal <= 0) {
        newErrors.budget = 'Vui lòng nhập mức ngân sách tối thiểu (tỷ đồng)';
      } else if (!isNaN(maxVal) && maxVal < minVal) {
        newErrors.budget = 'Ngân sách tối đa phải lớn hơn hoặc bằng mức tối thiểu';
      }
    }

    if (step === 3) {
      if (!agreeConsent) {
        newErrors.consent = 'Vui lòng tích đồng ý để HaNoi Realty xử lý yêu cầu tư vấn';
        addToast('Vui lòng tích chọn đồng ý xử lý yêu cầu tư vấn', 'warning');
      }
    }

    if (step === 4) {
      if (!contactName.trim()) newErrors.contactName = 'Vui lòng nhập họ và tên của bạn';
      if (!contactPhone.trim()) {
        newErrors.contactPhone = 'Vui lòng nhập số điện thoại liên hệ';
      } else if (!/^(0|\+84)[3|5|7|8|9][0-9]{8}$/.test(contactPhone.replace(/\s/g, ''))) {
        newErrors.contactPhone = 'Số điện thoại không đúng định dạng Việt Nam';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;

    if (!user) {
      addToast('Vui lòng đăng nhập tài khoản người mua để gửi nhu cầu tìm nhà!', 'warning');
      router.push('/login?redirect=/buyer-request');
      return;
    }

    setIsSubmitting(true);
    try {
      const parsedMin = (parseFloat(budgetMinInput) || 3) * 1_000_000_000;
      const parsedMax = (parseFloat(budgetMaxInput) || 6) * 1_000_000_000;
      const parsedDistricts = districtsInput.split(',').map((s) => s.trim()).filter(Boolean);

      const payload = {
        user_id: user.id,
        purpose,
        property_types: selectedTypes,
        target_districts: parsedDistricts.length > 0 ? parsedDistricts : ['Hà Nội'],
        budget_min: parsedMin,
        budget_max: parsedMax,
        min_area: minArea,
        min_bedrooms: minBedrooms,
        preferred_directions: selectedDirections,
        car_access: carAccess,
        urgency,
        support_type: supportType,
        referral_code: referralCode.trim() || undefined,
        needs_loan_support: needsLoanSupport,
        notes: notes.trim() || undefined,
        contact_name: contactName.trim(),
        contact_phone: contactPhone.trim(),
        contact_email: contactEmail.trim() || user.email || undefined,
        preferred_contact_time: preferredContactTime,
      };

      const res = await fetch('/api/buyer-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id,
          'x-user-role': user.role || 'buyer',
          'x-user-email': user.email || '',
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || json.error || 'Lỗi khi gửi yêu cầu');
      }

      // Xóa bản nháp sau khi lưu server thành công
      try {
        localStorage.removeItem('hanoi_realty_buyer_request_draft');
      } catch {}

      setSubmittedRequest(json.data.request);
      addToast(`🎉 Đã tiếp nhận nhu cầu mua! Mã yêu cầu: ${json.data.request.code}`, 'success');
    } catch (err: any) {
      addToast(err?.message || 'Có lỗi xảy ra khi gửi nhu cầu. Dữ liệu đã được giữ lại để bạn thử lại!', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==================== MÀN HÌNH THÀNH CÔNG: ĐÃ TIẾP NHẬN ====================
  if (submittedRequest) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center space-y-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20"
        >
          <CheckCircle2 className="w-12 h-12" />
        </motion.div>

        <div className="space-y-2">
          <span className="px-3.5 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300 inline-block">
            Mã yêu cầu: {submittedRequest.code}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Đã tiếp nhận
          </h1>
          <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
            Hệ thống HaNoi Realty đã tiếp nhận yêu cầu tìm mua BĐS tại{' '}
            <strong className="text-emerald-700">{submittedRequest.target_districts.join(', ')}</strong>. Trạng thái hiện tại là{' '}
            <strong className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">Chờ xử lý</strong>. Bạn có thể theo dõi tiến độ và phản hồi trong Dashboard Người mua.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-xs space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Tóm tắt tiêu chí đã đăng ký</h3>
          <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm">
            <div>
              <span className="text-slate-400 block text-[11px]">Khu vực:</span>
              <span className="font-bold text-slate-800">{submittedRequest.target_districts.join(', ')}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Tài chính dự kiến:</span>
              <span className="font-bold text-orange-600">
                {formatCurrencyVND(submittedRequest.budget_min)} – {formatCurrencyVND(submittedRequest.budget_max)}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Tiêu chí:</span>
              <span className="font-medium text-slate-700">
                Tối thiểu {submittedRequest.min_area}m² • {submittedRequest.min_bedrooms} PN • {submittedRequest.car_access ? 'Ngõ ô tô' : 'Ngõ thông thoáng'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Người đăng:</span>
              <span className="font-medium text-slate-700">{submittedRequest.contact_name} ({submittedRequest.contact_phone})</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link
            href="/dashboard?tab=buyer-requests"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-md transition-all text-center"
          >
            Về Dashboard theo dõi trạng thái
          </Link>
          <Link
            href="/search"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm transition-all text-center flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>Tra cứu kho nhà sẵn có</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto py-6 sm:py-10 px-4 space-y-8">
      {/* ── Tiêu đề & Cảnh báo chưa đăng nhập ── */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-extrabold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-orange-600" />
          <span>Dịch vụ kết nối người mua</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Đăng nhu cầu mua BĐS
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
          Điền tiêu chí căn nhà bạn tìm kiếm. HaNoi Realty tiếp nhận và hỗ trợ kết nối với nguồn hàng chuẩn xác.
        </p>

        {!user && (
          <div className="mt-4 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-3 text-left max-w-lg mx-auto">
            <div className="flex items-center gap-2.5">
              <LogIn className="w-5 h-5 text-amber-600 shrink-0" />
              <div className="text-xs text-amber-800">
                <span className="font-bold block">Yêu cầu đăng nhập tài khoản</span>
                <span>Vui lòng đăng nhập để lưu và theo dõi yêu cầu của bạn.</span>
              </div>
            </div>
            <Link
              href="/login?redirect=/buyer-request"
              className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs whitespace-nowrap"
            >
              Đăng nhập
            </Link>
          </div>
        )}
      </div>

      {/* ── Thanh tiến trình 4 bước ── */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-200 -z-0" />
          <div
            className="absolute top-4 left-6 h-0.5 bg-orange-500 transition-all duration-300 -z-0"
            style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
          />

          {[
            { step: 1, title: 'Loại BĐS' },
            { step: 2, title: 'Khu vực & Giá' },
            { step: 3, title: 'Phương thức' },
            { step: 4, title: 'Xác nhận' },
          ].map((item) => {
            const isCompleted = currentStep > item.step;
            const isCurrent = currentStep === item.step;

            return (
              <div key={item.step} className="flex flex-col items-center relative z-10">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                    isCompleted
                      ? 'bg-emerald-600 text-white'
                      : isCurrent
                      ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                      : 'bg-white border-2 border-slate-300 text-slate-400'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : item.step}
                </div>
                <span
                  className={`text-[11px] sm:text-xs font-bold mt-1.5 hidden sm:block ${
                    isCurrent ? 'text-slate-900' : 'text-slate-400'
                  }`}
                >
                  {item.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Nội dung từng bước ── */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
        {/* ==================== BƯỚC 1: NHU CẦU & LOẠI BĐS ==================== */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Bước 1. Bạn tìm mua BĐS cho mục đích gì?
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Chọn mục đích và loại hình căn nhà bạn mong muốn.</p>
            </div>

            {/* Mục đích mua */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PURPOSE_OPTIONS.map((item) => {
                const isSelected = purpose === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPurpose(item.id)}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-orange-500 bg-orange-50/30 ring-2 ring-orange-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm text-slate-900">{item.label}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-orange-500" />}
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed font-normal">{item.desc}</p>
                  </button>
                );
              })}
            </div>

            {/* Loại BĐS */}
            <div className="pt-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2.5">
                Loại hình BĐS quan tâm (chọn nhiều loại)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {PROPERTY_TYPES.map((pt) => {
                  const Icon = pt.icon;
                  const isSelected = selectedTypes.includes(pt.id);
                  return (
                    <button
                      key={pt.id}
                      type="button"
                      onClick={() => toggleType(pt.id)}
                      className={`p-3.5 rounded-2xl border text-center flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-orange-500 bg-orange-500 text-white shadow-md shadow-orange-500/20'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-xs font-bold leading-tight">{pt.label}</span>
                    </button>
                  );
                })}
              </div>
              {errors.types && <p className="text-xs text-rose-500 font-medium mt-1.5">{errors.types}</p>}
            </div>
          </div>
        )}

        {/* ==================== BƯỚC 2: KHU VỰC & TÀI CHÍNH ==================== */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Bước 2. Khu vực và mức tài chính dự kiến
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Xác định vị trí quận/huyện và ngân sách tìm nhà.</p>
            </div>

            {/* Khu vực */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Khu vực quận/huyện mong muốn <span className="text-rose-500">*</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {HANOI_POPULAR_DISTRICTS.map((district) => {
                  const isSelected = selectedDistricts.includes(district);
                  return (
                    <button
                      key={district}
                      type="button"
                      onClick={() => toggleDistrict(district)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-orange-500 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/80'
                      }`}
                    >
                      {district}
                    </button>
                  );
                })}
              </div>
              <input
                type="text"
                value={districtsInput}
                onChange={(e) => setDistrictsInput(e.target.value)}
                placeholder="Nhập quận/huyện (ngăn cách bằng dấu phẩy)..."
                className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-slate-800 transition-colors"
              />
              {errors.districts && <p className="text-xs text-rose-500 font-medium">{errors.districts}</p>}
            </div>

            {/* Tài chính */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Khoảng ngân sách dự kiến (tỷ VNĐ) <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-slate-500 block mb-1">Tối thiểu:</span>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      value={budgetMinInput}
                      onChange={(e) => setBudgetMinInput(e.target.value)}
                      placeholder="VD: 3"
                      className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:border-slate-800"
                    />
                    <span className="absolute right-3.5 top-2.5 text-xs font-bold text-slate-400">Tỷ</span>
                  </div>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block mb-1">Tối đa:</span>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      value={budgetMaxInput}
                      onChange={(e) => setBudgetMaxInput(e.target.value)}
                      placeholder="VD: 6"
                      className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:border-slate-800"
                    />
                    <span className="absolute right-3.5 top-2.5 text-xs font-bold text-slate-400">Tỷ</span>
                  </div>
                </div>
              </div>
              {errors.budget && <p className="text-xs text-rose-500 font-medium">{errors.budget}</p>}
            </div>

            {/* Tiêu chí phụ */}
            <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-slate-500 block mb-1">Diện tích tối thiểu (m²)</label>
                <input
                  type="number"
                  value={minArea || ''}
                  onChange={(e) => setMinArea(Number(e.target.value))}
                  placeholder="45"
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs text-slate-900"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 block mb-1">Phòng ngủ tối thiểu</label>
                <input
                  type="number"
                  value={minBedrooms || ''}
                  onChange={(e) => setMinBedrooms(Number(e.target.value))}
                  placeholder="3"
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs text-slate-900"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 block mb-1">Ngõ ô tô tránh</label>
                <select
                  value={carAccess ? 'yes' : 'no'}
                  onChange={(e) => setCarAccess(e.target.value === 'yes')}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white"
                >
                  <option value="yes">Yêu cầu ngõ ô tô vào</option>
                  <option value="no">Không bắt buộc ngõ ô tô</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* ==================== BƯỚC 3: PHƯƠNG THỨC HỖ TRỢ ==================== */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Bước 3. Phương thức hỗ trợ & Tiến độ tìm mua
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Lựa chọn cách thức bạn muốn làm việc với HaNoi Realty.</p>
            </div>

            <div className="space-y-2.5">
              {[
                { id: 'connect_ctv', label: 'Nhờ HaNoi Realty kết nối môi giới/CTV phụ trách khu vực' },
                { id: 'self_search', label: 'Tự tìm kiếm và chỉ nhận thông báo khi có căn phù hợp' },
                { id: 'has_broker', label: 'Tôi đã có môi giới riêng trên hệ thống HaNoi Realty' },
              ].map((item) => {
                const isSelected = supportType === item.id;
                return (
                  <label
                    key={item.id}
                    onClick={() => setSupportType(item.id as any)}
                    className="flex items-center gap-3 p-3.5 rounded-2xl border border-slate-200 hover:border-slate-300 cursor-pointer select-none bg-white transition-all"
                  >
                    <div className="relative flex items-center justify-center">
                      <div
                        className={`w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center ${
                          isSelected ? 'border-orange-500 bg-white' : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />}
                      </div>
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-slate-800">{item.label}</span>
                  </label>
                );
              })}
            </div>

            {/* Mã giới thiệu */}
            <div className="space-y-1 pt-1">
              <label className="text-xs font-bold text-slate-700 block">Mã giới thiệu môi giới/CTV (nếu có)</label>
              <input
                type="text"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
                placeholder="VD: MG-00102"
                className="w-full h-11 px-4 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-slate-800"
              />
            </div>

            {/* Ghi chú thêm */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Ghi chú yêu cầu đặc thù</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ví dụ: Cần nhà có sổ đỏ nở hậu, mặt tiền trên 4m, không lỗi phong thủy..."
                className="w-full p-3 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-slate-800 resize-none"
              />
            </div>

            {/* Đồng ý cam kết */}
            <div className="pt-2">
              <label
                onClick={() => setAgreeConsent(!agreeConsent)}
                className="flex items-start gap-3 cursor-pointer select-none group"
              >
                <div className="relative flex items-center justify-center mt-0.5">
                  <div
                    className={`w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center ${
                      agreeConsent ? 'border-orange-500 bg-white' : 'border-slate-300 bg-white'
                    }`}
                  >
                    {agreeConsent && <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />}
                  </div>
                </div>
                <span className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                  Tôi đồng ý cho HaNoi Realty sử dụng thông tin để xử lý yêu cầu tìm kiếm và kết nối BĐS này.
                </span>
              </label>
            </div>
          </div>
        )}

        {/* ==================== BƯỚC 4: XÁC NHẬN VÀ GỬI NHU CẦU ==================== */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Bước 4. Xác nhận thông tin liên hệ và gửi yêu cầu
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Kiểm tra thông tin liên lạc để đội ngũ tiếp nhận và thông báo kết quả.
              </p>
            </div>

            {/* Thông tin người liên hệ */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Họ và tên của bạn <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Nguyễn Văn An"
                    className="w-full h-11 px-4 rounded-xl border border-slate-300 focus:border-slate-800 focus:outline-none text-sm text-slate-900 bg-white"
                  />
                  {errors.contactName && <p className="text-xs text-rose-500 font-medium mt-1">{errors.contactName}</p>}
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Số điện thoại liên hệ <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="0912 345 678"
                    className="w-full h-11 px-4 rounded-xl border border-slate-300 focus:border-slate-800 focus:outline-none text-sm text-slate-900 bg-white"
                  />
                  {errors.contactPhone && <p className="text-xs text-rose-500 font-medium mt-1">{errors.contactPhone}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Email nhận thông báo</label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="an.nguyen@gmail.com"
                    className="w-full h-11 px-4 rounded-xl border border-slate-300 focus:border-slate-800 focus:outline-none text-sm text-slate-900 bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Khung giờ liên hệ thuận tiện</label>
                  <select
                    value={preferredContactTime}
                    onChange={(e) => setPreferredContactTime(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-slate-300 text-sm text-slate-900 bg-white"
                  >
                    <option value="Bất kỳ lúc nào">Bất kỳ lúc nào</option>
                    <option value="Giờ hành chính">Giờ hành chính (8h30 - 17h30)</option>
                    <option value="Buổi tối">Buổi tối (sau 18h)</option>
                    <option value="Cuối tuần">Thứ 7 & Chủ Nhật</option>
                  </select>
                </div>
              </div>

              {/* Tóm tắt */}
              <div className="pt-3 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Khu vực:</span>
                  <strong className="text-slate-800">{districtsInput || 'Hà Nội'}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Tài chính:</span>
                  <strong className="text-orange-600">{budgetMinInput} – {budgetMaxInput} tỷ</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Loại BĐS:</span>
                  <strong className="text-slate-800">
                    {selectedTypes.map((t) => (t === 'house' ? 'Nhà phố' : t === 'apartment' ? 'Chung cư' : t === 'land' ? 'Đất nền' : 'Biệt thự')).join(', ')}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Nút điều hướng Wizard ── */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-6">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              disabled={isSubmitting}
              className="h-11 px-5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại</span>
            </button>
          ) : (
            <div />
          )}

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="h-11 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer ml-auto"
            >
              <span>Tiếp tục</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="h-11 px-7 rounded-xl bg-orange-600 hover:bg-orange-700 active:scale-[0.98] text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-orange-600/25 cursor-pointer ml-auto disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Đang tiếp nhận...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Gửi nhu cầu mua BĐS</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
