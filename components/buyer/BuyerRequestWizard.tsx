'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
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
  Search
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
  { id: 'investment', label: 'Mua để đầu tư sinh lời', desc: 'Ưu tiên tiềm năng tăng giá, đón đầu quy hoạch và hạ tầng giao thông' },
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

  const [budgetMin, setBudgetMin] = useState(3_000_000_000);
  const [budgetMax, setBudgetMax] = useState(6_000_000_000);
  const [minArea, setMinArea] = useState<number>(45);
  const [minBedrooms, setMinBedrooms] = useState<number>(3);
  const [selectedDirections, setSelectedDirections] = useState<string[]>(['Đông Nam', 'Nam']);
  const [carAccess, setCarAccess] = useState<boolean>(true);

  const [urgency, setUrgency] = useState<UrgencyLevel>('within_1_month');
  const [needsLoanSupport, setNeedsLoanSupport] = useState<boolean>(false);
  const [needsPlanningCheck, setNeedsPlanningCheck] = useState<boolean>(true);
  const [notes, setNotes] = useState<string>('');

  const [contactName, setContactName] = useState<string>(user?.name || '');
  const [contactPhone, setContactPhone] = useState<string>(user?.phone || '');
  const [contactEmail, setContactEmail] = useState<string>(user?.email || '');
  const [preferredContactTime, setPreferredContactTime] = useState<string>('Bất kỳ lúc nào');

  // Validation Errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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
        setSelectedDistricts(selectedDistricts.filter((d) => d !== district));
      }
    } else {
      setSelectedDistricts([...selectedDistricts, district]);
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
      if (selectedDistricts.length === 0) newErrors.districts = 'Vui lòng chọn ít nhất 1 quận/huyện';
    }

    if (step === 2) {
      if (budgetMin <= 0) newErrors.budget = 'Tài chính tối thiểu phải lớn hơn 0';
      if (budgetMax <= budgetMin) newErrors.budget = 'Tài chính tối đa phải lớn hơn mức tối thiểu';
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

    setIsSubmitting(true);
    try {
      const generatedCode = `HR-REQ-2026-${Math.floor(1000 + Math.random() * 9000)}`;

      const newRequest: BuyerRequest = {
        id: `req_${Date.now()}`,
        code: generatedCode,
        user_id: user?.id,
        purpose,
        property_types: selectedTypes,
        target_districts: selectedDistricts,
        budget_min: budgetMin,
        budget_max: budgetMax,
        min_area: minArea,
        min_bedrooms: minBedrooms,
        preferred_directions: selectedDirections,
        car_access: carAccess,
        urgency,
        needs_loan_support: needsLoanSupport,
        needs_planning_check: needsPlanningCheck,
        notes,
        contact_name: contactName,
        contact_phone: contactPhone,
        contact_email: contactEmail,
        preferred_contact_time: preferredContactTime,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Lưu trữ vào localStorage để đồng bộ với Dashboard
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('hanoi_realty_buyer_requests');
        const list: BuyerRequest[] = stored ? JSON.parse(stored) : [];
        list.unshift(newRequest);
        localStorage.setItem('hanoi_realty_buyer_requests', JSON.stringify(list));
        window.dispatchEvent(new Event('hanoi_buyer_requests_updated'));
      }

      setSubmittedRequest(newRequest);
      addToast('🎉 Đã ghi nhận nhu cầu mua BĐS của bạn! Hệ thống đang quét giỏ hàng xác thực.', 'success');
    } catch {
      addToast('Có lỗi xảy ra khi gửi nhu cầu. Vui lòng thử lại!', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // MÀN HÌNH THÀNH CÔNG
  if (submittedRequest) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center space-y-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20"
        >
          <CheckCircle2 className="w-12 h-12" />
        </motion.div>

        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
            Mã yêu cầu: {submittedRequest.code}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Đăng Nhu Cầu Mua Thành Công!
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-lg mx-auto">
            Hệ thống HaNoi Realty đã tiếp nhận tiêu chí tìm nhà của bạn. Đội ngũ CTV chuyên trách khu vực{' '}
            <strong className="text-emerald-600">{submittedRequest.target_districts.join(', ')}</strong> sẽ rà soát kho BĐS đã kiểm định quy hoạch và kết nối sản phẩm phù hợp nhất.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 text-left shadow-xs space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Tóm tắt tiêu chí đã đăng ký</h3>
          <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm">
            <div>
              <span className="text-slate-400 block">Khu vực:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{submittedRequest.target_districts.join(', ')}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Tài chính dự kiến:</span>
              <span className="font-bold text-orange-600">{formatCurrencyVND(submittedRequest.budget_min)} – {formatCurrencyVND(submittedRequest.budget_max)}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Tiêu chí:</span>
              <span className="font-medium text-slate-700 dark:text-slate-300">
                Tối thiểu {submittedRequest.min_area}m² • {submittedRequest.min_bedrooms} PN • {submittedRequest.car_access ? 'Ngõ ô tô' : 'Ngõ thông thoáng'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">Người đăng:</span>
              <span className="font-medium text-slate-700 dark:text-slate-300">{submittedRequest.contact_name} ({submittedRequest.contact_phone})</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link
            href="/dashboard?tab=buyer-requests"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-md transition-all text-center"
          >
            Về Dashboard theo dõi
          </Link>
          <Link
            href="/search"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-sm transition-all text-center flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>Tự tra cứu kho nhà sẵn có</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto py-4 space-y-8">
      {/* HEADER & TIÊU ĐỀ */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full bg-orange-500/10 border border-orange-500/20 px-3.5 py-1 text-xs font-black text-orange-600">
          <Sparkles className="h-3.5 w-3.5 text-orange-500 animate-pulse" />
          <span>Dành Riêng Cho Người Mua Nhà Hà Nội • 100% Miễn Phí</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Đăng Ký Nhu Cầu Mua Bất Động Sản
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          Mô tả căn nhà bạn mơ ước. HaNoi Realty sẽ sàng lọc từ kho nguồn hàng đã thẩm định quy hoạch và hồ sơ pháp lý sạch, tránh lãng phí thời gian xem nhà ảo.
        </p>
      </div>

      {/* THANH TIẾN ĐỘ 4 BƯỚC */}
      <div className="relative">
        <div className="flex items-center justify-between max-w-2xl mx-auto px-4">
          {[
            { step: 1, title: 'Loại hình & Khu vực' },
            { step: 2, title: 'Tài chính & Tiêu chí' },
            { step: 3, title: 'Tiến độ & Hỗ trợ' },
            { step: 4, title: 'Thông tin liên hệ' },
          ].map((item) => {
            const isCompleted = currentStep > item.step;
            const isCurrent = currentStep === item.step;
            return (
              <div key={item.step} className="flex flex-col items-center relative z-10">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-xs transition-all duration-300 ${
                    isCompleted
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-4 ring-emerald-100 dark:ring-emerald-950'
                      : isCurrent
                      ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30 ring-4 ring-orange-100 dark:ring-orange-950 scale-105'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : item.step}
                </div>
                <span
                  className={`text-[11px] font-bold mt-2 text-center whitespace-nowrap hidden sm:block ${
                    isCurrent ? 'text-orange-600 dark:text-orange-400' : 'text-slate-500'
                  }`}
                >
                  {item.title}
                </span>
              </div>
            );
          })}
        </div>
        {/* Đường nối */}
        <div className="absolute top-4.5 left-1/2 -translate-x-1/2 w-3/4 max-w-xl h-0.5 bg-slate-200 dark:bg-slate-800 -z-0">
          <div
            className="h-full bg-orange-600 transition-all duration-500 ease-out"
            style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
          />
        </div>
      </div>

      {/* KHUNG NỘI DUNG TỪNG BƯỚC */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm">
        <AnimatePresence mode="wait">
          {/* ==================== BƯỚC 1 ==================== */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white">Bước 1: Nhu cầu & Khu vực tìm kiếm</h2>
                <p className="text-xs text-slate-500 mt-1">Chọn mục đích và loại hình BĐS bạn đang quan tâm.</p>
              </div>

              {/* Mục đích mua */}
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-wider text-slate-400">Mục đích chính của bạn</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {PURPOSE_OPTIONS.map((opt) => (
                    <div
                      key={opt.id}
                      onClick={() => setPurpose(opt.id)}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        purpose === opt.id
                          ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-950/20 shadow-xs'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                      }`}
                    >
                      <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center justify-between">
                        <span>{opt.label}</span>
                        {purpose === opt.id && <CheckCircle2 className="w-4 h-4 text-orange-600" />}
                      </div>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">{opt.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Loại BĐS */}
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-wider text-slate-400">Loại hình mong muốn (Chọn 1 hoặc nhiều)</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {PROPERTY_TYPES.map((type) => {
                    const isSelected = selectedTypes.includes(type.id);
                    const Icon = type.icon;
                    return (
                      <div
                        key={type.id}
                        onClick={() => toggleType(type.id)}
                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all text-center flex flex-col items-center gap-2 ${
                          isSelected
                            ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-950/20 shadow-xs'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                        }`}
                      >
                        <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-orange-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-xs text-slate-900 dark:text-white">{type.label}</span>
                      </div>
                    );
                  })}
                </div>
                {errors.types && <p className="text-xs text-red-500 font-medium">{errors.types}</p>}
              </div>

              {/* Quận / Huyện Hà Nội */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-400">Quận / Huyện ưu tiên tại Hà Nội</label>
                  <span className="text-xs text-slate-400">Đã chọn: {selectedDistricts.length} quận</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {HANOI_POPULAR_DISTRICTS.map((district) => {
                    const isSelected = selectedDistricts.includes(district);
                    return (
                      <button
                        type="button"
                        key={district}
                        onClick={() => toggleDistrict(district)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                          isSelected
                            ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                        }`}
                      >
                        {district}
                      </button>
                    );
                  })}
                </div>
                {errors.districts && <p className="text-xs text-red-500 font-medium">{errors.districts}</p>}
              </div>
            </motion.div>
          )}

          {/* ==================== BƯỚC 2 ==================== */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white">Bước 2: Khoảng tài chính & Tiêu chí chi tiết</h2>
                <p className="text-xs text-slate-500 mt-1">Xác định ngân sách dự kiến để nhận các gợi ý sát thực tế nhất.</p>
              </div>

              {/* Ngân sách Preset */}
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-wider text-slate-400">Mức ngân sách nhanh</label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {BUDGET_PRESETS.map((preset) => {
                    const isSelected = budgetMin === preset.min && budgetMax === preset.max;
                    return (
                      <button
                        type="button"
                        key={preset.label}
                        onClick={() => {
                          setBudgetMin(preset.min);
                          setBudgetMax(preset.max);
                        }}
                        className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                          isSelected
                            ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Nhập khoảng giá cụ thể */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">Tài chính tối thiểu (VNĐ)</label>
                  <input
                    type="number"
                    step={100_000_000}
                    value={budgetMin}
                    onChange={(e) => setBudgetMin(Number(e.target.value))}
                    className="w-full h-10 px-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-sm text-slate-900 dark:text-white"
                  />
                  <span className="text-[11px] text-orange-600 font-bold mt-1 block">{formatCurrencyVND(budgetMin)}</span>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">Tài chính tối đa (VNĐ)</label>
                  <input
                    type="number"
                    step={100_000_000}
                    value={budgetMax}
                    onChange={(e) => setBudgetMax(Number(e.target.value))}
                    className="w-full h-10 px-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-sm text-slate-900 dark:text-white"
                  />
                  <span className="text-[11px] text-orange-600 font-bold mt-1 block">{formatCurrencyVND(budgetMax)}</span>
                </div>
              </div>
              {errors.budget && <p className="text-xs text-red-500 font-medium">{errors.budget}</p>}

              {/* Diện tích & Phòng ngủ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">Diện tích tối thiểu (m²)</label>
                  <input
                    type="number"
                    min={20}
                    value={minArea}
                    onChange={(e) => setMinArea(Number(e.target.value))}
                    className="w-full h-10 px-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">Số phòng ngủ tối thiểu</label>
                  <select
                    value={minBedrooms}
                    onChange={(e) => setMinBedrooms(Number(e.target.value))}
                    className="w-full h-10 px-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-semibold"
                  >
                    <option value={1}>1+ phòng ngủ</option>
                    <option value={2}>2+ phòng ngủ</option>
                    <option value={3}>3+ phòng ngủ</option>
                    <option value={4}>4+ phòng ngủ</option>
                    <option value={5}>5+ phòng ngủ</option>
                  </select>
                </div>
              </div>

              {/* Ngõ ô tô */}
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-orange-100 dark:bg-orange-950/40 text-orange-600">
                    <Car className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">Yêu cầu ngõ ô tô</h4>
                    <p className="text-[11px] text-slate-500">Ưu tiên nhà ngõ ô tô đỗ cửa hoặc ô tô tránh nhau</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={carAccess}
                  onChange={(e) => setCarAccess(e.target.checked)}
                  className="w-5 h-5 rounded text-orange-600 focus:ring-orange-500 cursor-pointer"
                />
              </div>

              {/* Hướng nhà ưu tiên */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Hướng nhà ưu tiên (tùy chọn)</label>
                <div className="flex flex-wrap gap-2">
                  {['Đông Nam', 'Nam', 'Đông', 'Bắc', 'Tây Nam', 'Chính Tây', 'Tây Bắc', 'Đông Bắc'].map((dir) => {
                    const isSelected = selectedDirections.includes(dir);
                    return (
                      <button
                        type="button"
                        key={dir}
                        onClick={() => toggleDirection(dir)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                          isSelected
                            ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent font-bold'
                            : 'bg-white dark:bg-slate-800 text-slate-600 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {dir}
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* ==================== BƯỚC 3 ==================== */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white">Bước 3: Mức độ cần mua & Hỗ trợ chuyên sâu</h2>
                <p className="text-xs text-slate-500 mt-1">Cho chúng tôi biết kế hoạch thời gian và các dịch vụ bạn cần hỗ trợ thêm.</p>
              </div>

              {/* Mức độ cần mua */}
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-wider text-slate-400">Kế hoạch thời gian mua nhà</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'immediate', label: 'Cần mua gấp (Trong 1 tháng)', desc: 'Tài chính sẵn sàng, muốn chốt nhanh' },
                    { id: 'within_3_months', label: 'Trong 1 - 3 tháng tới', desc: 'Đang xem nhà và cân đối tài chính' },
                    { id: 'exploring', label: 'Đang khảo sát thị trường', desc: 'Chưa vội, tìm căn thật sự ưng ý' },
                  ].map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setUrgency(item.id as UrgencyLevel)}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        urgency === item.id
                          ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-950/20'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                      }`}
                    >
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{item.label}</h4>
                      <p className="text-[11px] text-slate-500 mt-1">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hỗ trợ đặc thù */}
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-wider text-slate-400">Dịch vụ bạn cần HaNoi Realty hỗ trợ kèm theo</label>
                
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950/40 text-blue-600">
                      <FileCheck2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">Kiểm tra quy hoạch phân khu Hà Nội (Miễn phí)</h4>
                      <p className="text-[11px] text-slate-500">Đối chiếu thửa đất với bản đồ quy hoạch giao thông, mở đường 2030</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={needsPlanningCheck}
                    onChange={(e) => setNeedsPlanningCheck(e.target.checked)}
                    className="w-5 h-5 rounded text-orange-600 focus:ring-orange-500 cursor-pointer"
                  />
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950/40 text-purple-600">
                      <DollarSign className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">Tư vấn gói vay mua nhà ngân hàng</h4>
                      <p className="text-[11px] text-slate-500">Hỗ trợ tính toán hạn mức vay và kết nối lãi suất ưu đãi tốt nhất</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={needsLoanSupport}
                    onChange={(e) => setNeedsLoanSupport(e.target.checked)}
                    className="w-5 h-5 rounded text-orange-600 focus:ring-orange-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Ghi chú thêm */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Yêu cầu đặc thù khác (nếu có)</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ví dụ: Gần trường tiểu học Dịch Vọng Hậu, nhà xây mới có thang máy, nở hậu..."
                  className="w-full p-3.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>
            </motion.div>
          )}

          {/* ==================== BƯỚC 4 ==================== */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white">Bước 4: Thông tin liên hệ & Xác nhận</h2>
                <p className="text-xs text-slate-500 mt-1">Thông tin được bảo mật tuyệt đối, chỉ phục vụ gửi danh sách BĐS phù hợp.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Họ và tên của bạn <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Nguyễn Văn An"
                      className="w-full h-10 pl-10 pr-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm font-semibold"
                    />
                  </div>
                  {errors.contactName && <p className="text-xs text-red-500 font-medium mt-1">{errors.contactName}</p>}
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Số điện thoại liên hệ <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="0912 345 678"
                      className="w-full h-10 pl-10 pr-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm font-semibold"
                    />
                  </div>
                  {errors.contactPhone && <p className="text-xs text-red-500 font-medium mt-1">{errors.contactPhone}</p>}
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Email nhận danh sách BĐS (tùy chọn)</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="an.nguyen@gmail.com"
                      className="w-full h-10 pl-10 pr-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Khung giờ tiện nghe điện thoại</label>
                  <select
                    value={preferredContactTime}
                    onChange={(e) => setPreferredContactTime(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm font-semibold"
                  >
                    <option value="Bất kỳ lúc nào">Bất kỳ lúc nào</option>
                    <option value="Giờ hành chính (08:30 - 17:30)">Giờ hành chính (08:30 - 17:30)</option>
                    <option value="Buổi tối (18:30 - 21:00)">Buổi tối (18:30 - 21:00)</option>
                    <option value="Cuối tuần">Thứ 7 & Chủ nhật</option>
                  </select>
                </div>
              </div>

              {/* Cam kết minh bạch */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Cam kết từ HaNoi Realty:</span>
                </div>
                <p>• Dịch vụ tìm kiếm và tư vấn nhà là <strong>hoàn toàn miễn phí</strong> đối với Người mua.</p>
                <p>• Thông tin cá nhân được bảo vệ nghiêm ngặt, không bị spam bởi môi giới tự do.</p>
                <p>• Mọi căn nhà gửi tới bạn đều được kiểm tra hồ sơ và cấp mã Property ID chính thức.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* NÚT ĐIỀU HƯỚNG */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-800 mt-6">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 flex items-center gap-1.5 transition-all"
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
              className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-md shadow-orange-600/20 flex items-center gap-1.5 transition-all"
            >
              <span>Tiếp tục</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white text-sm font-black shadow-lg shadow-orange-600/30 flex items-center gap-2 transition-all disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Đang ghi nhận...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Gửi Nhu Cầu Mua BĐS</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

