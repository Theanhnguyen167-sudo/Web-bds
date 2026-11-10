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

  // Yêu cầu đăng nhập trước khi sử dụng tính năng Đăng tìm BĐS
  React.useEffect(() => {
    if (!user) {
      addToast('Vui lòng đăng nhập để sử dụng tính năng Đăng tìm BĐS', 'info');
      router.push('/login?redirect=/buyer-request');
    }
  }, [user, router, addToast]);

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

  const [budgetMin, setBudgetMin] = useState(3_000_000_000);
  const [budgetMax, setBudgetMax] = useState(6_000_000_000);
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
      if (selectedTypes.length === 0) newErrors.types = 'Vui lòng chọn 1 loại hình BĐS';
    }

    if (step === 2) {
      if (!districtsInput.trim()) {
        newErrors.districts = 'Vui lòng nhập quận/huyện mong muốn';
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

    setIsSubmitting(true);
    try {
      const generatedCode = `HR-REQ-2026-${Math.floor(1000 + Math.random() * 9000)}`;

      const parsedMin = (parseFloat(budgetMinInput) || 3) * 1_000_000_000;
      const parsedMax = (parseFloat(budgetMaxInput) || 6) * 1_000_000_000;
      const parsedDistricts = districtsInput.split(',').map((s) => s.trim()).filter(Boolean);

      const newRequest: BuyerRequest = {
        id: `req_${Date.now()}`,
        code: generatedCode,
        user_id: user?.id,
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

  // MÀN HÌNH YÊU CẦU ĐĂNG NHẬP NẾU CHƯA CÓ PHIÊN ĐĂNG NHẬP
  if (!user) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center rounded-3xl bg-white border border-slate-200/80 shadow-xs">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-orange-100 text-orange-600 flex items-center justify-center mb-4">
          <Search className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Yêu cầu đăng nhập tài khoản</h2>
        <p className="text-xs text-slate-500 mt-2 leading-relaxed max-w-md mx-auto">
          Tính năng Đăng tìm BĐS yêu cầu bạn đăng nhập để hệ thống tự động lưu nhu cầu, kết nối CTV và gửi thông báo BĐS phù hợp vào Dashboard của bạn.
        </p>
        <div className="mt-6">
          <Link
            href="/login?redirect=/buyer-request"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-orange-600 text-white font-bold text-xs shadow-md hover:bg-orange-700 transition-all"
          >
            <span>Đăng nhập ngay</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

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
    <div className="w-full max-w-3xl mx-auto py-6 sm:py-10 px-4 space-y-8">
      {/* HEADER & TIÊU ĐỀ THEO MẪU */}
      <div className="space-y-1 pb-4 border-b border-slate-100">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Đăng nhu cầu mua BĐS
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 font-medium">
          Miễn phí • Thông tin được bảo vệ
        </p>
      </div>

      {/* THANH TIẾN ĐỘ 4 BƯỚC: NÉT ĐỨT / ĐƯỜNG THẲNG & DẤU TÍCH XANH LÁ HOÀN THÀNH */}
      <div className="pb-6 border-b border-slate-100">
        <div className="flex items-center justify-between max-w-2xl mx-auto px-1 sm:px-4">
          {[
            { step: 1, title: 'Loại BĐS' },
            { step: 2, title: 'Khu vực & ngân sách' },
            { step: 3, title: 'Hỗ trợ môi giới' },
            { step: 4, title: 'Xác nhận' },
          ].map((item, idx) => {
            const isCompleted = item.step < currentStep;
            const isCurrent = item.step === currentStep;

            return (
              <React.Fragment key={item.step}>
                <div className="flex flex-col items-center shrink-0">
                  <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-300 ${
                      isCompleted
                        ? 'bg-emerald-600 text-white shadow-sm ring-4 ring-emerald-50'
                        : isCurrent
                        ? 'bg-orange-600 text-white shadow-sm ring-4 ring-orange-100'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4 text-white stroke-[3]" />
                    ) : (
                      item.step
                    )}
                  </div>
                  <span
                    className={`text-[11px] sm:text-xs mt-2 text-center whitespace-nowrap ${
                      isCurrent
                        ? 'text-slate-900 font-bold'
                        : isCompleted
                        ? 'text-slate-700 font-medium'
                        : 'text-slate-400 font-medium'
                    }`}
                  >
                    {item.title}
                  </span>
                </div>

                {/* Đoạn nối giữa bước idx và idx + 1: Nét đứt (chưa xong) -> Đường liền (đã xong) */}
                {idx < 3 && (
                  <div
                    className={`flex-1 mx-1.5 sm:mx-3 -mt-5 transition-all duration-300 ${
                      currentStep > item.step
                        ? 'border-t-2 border-solid border-emerald-500'
                        : 'border-t-2 border-dashed border-slate-300'
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* KHUNG NỘI DUNG TỪNG BƯỚC */}
      <div className="pt-2">
        <AnimatePresence mode="wait">
          {/* ==================== BƯỚC 1: BẠN ĐANG MUỐN MUA LOẠI BĐS NÀO? ==================== */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  Bước 1. Bạn đang muốn mua loại BĐS nào?
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                  Chọn loại hình phù hợp với nhu cầu
                </p>
              </div>

              {/* Danh sách lựa chọn dạng Radio List chuẩn giao diện */}
              <div className="space-y-3 pt-2">
                {[
                  { id: 'house', label: 'Nhà phố / Nhà riêng' },
                  { id: 'apartment', label: 'Chung cư' },
                  { id: 'land', label: 'Đất nền / Đất thổ cư' },
                  { id: 'villa', label: 'Biệt thự / Shophouse' },
                ].map((item) => {
                  const isSelected = selectedTypes.includes(item.id);
                  return (
                    <label
                      key={item.id}
                      onClick={() => setSelectedTypes([item.id])}
                      className="flex items-center gap-3.5 py-2.5 cursor-pointer select-none group"
                    >
                      {/* Custom Radio Button */}
                      <div className="relative flex items-center justify-center">
                        <div
                          className={`w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center ${
                            isSelected
                              ? 'border-slate-900 bg-white'
                              : 'border-slate-300 group-hover:border-slate-400 bg-white'
                          }`}
                        >
                          {isSelected && (
                            <div className="w-2.5 h-2.5 rounded-full bg-slate-900" />
                          )}
                        </div>
                      </div>

                      <span
                        className={`text-sm sm:text-base font-normal transition-colors ${
                          isSelected ? 'text-slate-900 font-medium' : 'text-slate-700 group-hover:text-slate-900'
                        }`}
                      >
                        {item.label}
                      </span>
                    </label>
                  );
                })}
              </div>
              {errors.types && <p className="text-xs text-red-500 font-medium pt-1">{errors.types}</p>}
            </motion.div>
          )}

          {/* ==================== BƯỚC 2: KHU VỰC VÀ NGÂN SÁCH ==================== */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  Bước 2. Khu vực và ngân sách
                </h2>
              </div>

              {/* 1. Quận / huyện mong muốn */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-800 block">
                  Quận/huyện mong muốn
                </label>
                <input
                  type="text"
                  value={districtsInput}
                  onChange={(e) => setDistrictsInput(e.target.value)}
                  placeholder="Ví dụ: Cầu Giấy, Nam Từ Liêm"
                  className="w-full h-12 px-5 rounded-full border border-slate-300 focus:border-slate-400 focus:outline-none text-sm text-slate-800 placeholder:text-slate-400 bg-white transition-colors"
                />
                {errors.districts && (
                  <p className="text-xs text-red-500 font-medium px-2">{errors.districts}</p>
                )}
              </div>

              {/* 2. Khoảng ngân sách (tỷ đồng) */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-800 block">
                  Khoảng ngân sách (tỷ đồng)
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={budgetMinInput}
                    onChange={(e) => setBudgetMinInput(e.target.value)}
                    placeholder="Từ"
                    className="w-full h-12 px-5 rounded-full border border-slate-300 focus:border-slate-400 focus:outline-none text-sm text-slate-800 placeholder:text-slate-400 bg-white transition-colors"
                  />
                  <input
                    type="text"
                    value={budgetMaxInput}
                    onChange={(e) => setBudgetMaxInput(e.target.value)}
                    placeholder="Đến"
                    className="w-full h-12 px-5 rounded-full border border-slate-300 focus:border-slate-400 focus:outline-none text-sm text-slate-800 placeholder:text-slate-400 bg-white transition-colors"
                  />
                </div>
                {errors.budget && (
                  <p className="text-xs text-red-500 font-medium px-2">{errors.budget}</p>
                )}
              </div>

              {/* 3. Yêu cầu thêm */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-800 block">
                  Yêu cầu thêm
                </label>
                <textarea
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ví dụ: diện tích tối thiểu 60m², 3 phòng ngủ, có sổ đỏ..."
                  className="w-full p-4 rounded-2xl border border-slate-300 focus:border-slate-400 focus:outline-none text-sm text-slate-800 placeholder:text-slate-400 bg-white resize-none transition-colors"
                />
              </div>
            </motion.div>
          )}

          {/* ==================== BƯỚC 3: BẠN MUỐN ĐƯỢC HỖ TRỢ THẾ NÀO? ==================== */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  Bước 3. Bạn muốn được hỗ trợ thế nào?
                </h2>
              </div>

              {/* 3 Lựa chọn hình thức hỗ trợ dạng Radio List */}
              <div className="space-y-3 pt-1">
                {[
                  { id: 'connect_ctv', label: 'Nhờ HaNoi Realty kết nối CTV tư vấn' },
                  { id: 'self_search', label: 'Tự tìm kiếm và nhận gợi ý BĐS' },
                  { id: 'has_broker', label: 'Tôi đã có môi giới giới thiệu' },
                ].map((item) => {
                  const isSelected = supportType === item.id;
                  return (
                    <label
                      key={item.id}
                      onClick={() => setSupportType(item.id as any)}
                      className="flex items-center gap-3.5 py-2.5 cursor-pointer select-none group"
                    >
                      {/* Custom Radio Button */}
                      <div className="relative flex items-center justify-center">
                        <div
                          className={`w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center ${
                            isSelected
                              ? 'border-slate-900 bg-white'
                              : 'border-slate-300 group-hover:border-slate-400 bg-white'
                          }`}
                        >
                          {isSelected && (
                            <div className="w-2.5 h-2.5 rounded-full bg-slate-900" />
                          )}
                        </div>
                      </div>

                      <span
                        className={`text-sm sm:text-base font-normal transition-colors ${
                          isSelected ? 'text-slate-900 font-medium' : 'text-slate-700 group-hover:text-slate-900'
                        }`}
                      >
                        {item.label}
                      </span>
                    </label>
                  );
                })}
              </div>

              {/* Nhập mã giới thiệu CTV */}
              <div className="space-y-2 pt-2">
                <label className="text-sm font-semibold text-slate-800 block">
                  Mã giới thiệu CTV (nếu có)
                </label>
                <input
                  type="text"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                  placeholder="Nhập mã giới thiệu"
                  className="w-full h-12 px-5 rounded-full border border-slate-300 focus:border-slate-400 focus:outline-none text-sm text-slate-800 placeholder:text-slate-400 bg-white transition-colors"
                />
              </div>

              {/* Đồng ý cam kết sử dụng thông tin */}
              <div className="pt-2">
                <label
                  onClick={() => setAgreeConsent(!agreeConsent)}
                  className="flex items-start gap-3.5 cursor-pointer select-none group"
                >
                  <div className="relative flex items-center justify-center mt-0.5">
                    <div
                      className={`w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center ${
                        agreeConsent
                          ? 'border-slate-900 bg-white'
                          : 'border-slate-300 group-hover:border-slate-400 bg-white'
                      }`}
                    >
                      {agreeConsent && (
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-900" />
                      )}
                    </div>
                  </div>
                  <span className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal group-hover:text-slate-900">
                    Tôi đồng ý cho HaNoi Realty sử dụng thông tin liên hệ để xử lý yêu cầu tư vấn này.
                  </span>
                </label>
              </div>
            </motion.div>
          )}

          {/* ==================== BƯỚC 4: KIỂM TRA VÀ GỬI NHU CẦU ==================== */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  Bước 4. Kiểm tra và gửi nhu cầu
                </h2>
              </div>

              {/* 2 Checklist items theo mẫu thiết kế */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center gap-3 text-slate-800 text-sm sm:text-base font-normal">
                  <div className="w-5 h-5 rounded-full border-2 border-emerald-600 flex items-center justify-center text-emerald-600 shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                  <span>Kiểm tra lại loại nhà, khu vực, ngân sách và phương thức hỗ trợ</span>
                </div>

                <div className="flex items-center gap-3 text-slate-800 text-sm sm:text-base font-normal">
                  <div className="w-5 h-5 rounded-full border-2 border-emerald-600 flex items-center justify-center text-emerald-600 shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                  <span>Xác nhận thông tin liên hệ trước khi gửi yêu cầu</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-500 pt-0.5">
                Sau khi gửi, bạn có thể quản lý nhu cầu mua và theo dõi phản hồi trong Dashboard Người mua.
              </p>

              {/* Thông tin liên hệ & Tóm tắt tiêu chí */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Họ và tên của bạn <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Nguyễn Văn An"
                      className="w-full h-11 px-4 rounded-xl border border-slate-300 focus:border-slate-500 focus:outline-none text-sm text-slate-800 bg-white"
                    />
                    {errors.contactName && (
                      <p className="text-xs text-red-500 font-medium mt-1">{errors.contactName}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Số điện thoại liên hệ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="0912 345 678"
                      className="w-full h-11 px-4 rounded-xl border border-slate-300 focus:border-slate-500 focus:outline-none text-sm text-slate-800 bg-white"
                    />
                    {errors.contactPhone && (
                      <p className="text-xs text-red-500 font-medium mt-1">{errors.contactPhone}</p>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Loại BĐS:</span>
                    <strong className="text-slate-800">
                      {selectedTypes.map((t) => (t === 'house' ? 'Nhà phố' : t === 'apartment' ? 'Chung cư' : t === 'land' ? 'Đất nền' : 'Biệt thự')).join(', ')}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Khu vực:</span>
                    <strong className="text-slate-800 truncate block">{districtsInput || 'Hà Nội'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Ngân sách:</span>
                    <strong className="text-orange-600">{budgetMinInput} – {budgetMaxInput} tỷ đồng</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Hỗ trợ:</span>
                    <strong className="text-slate-800">
                      {supportType === 'connect_ctv' ? 'Kết nối CTV' : supportType === 'self_search' ? 'Tự tìm kiếm' : 'Có môi giới'}
                    </strong>
                  </div>
                </div>
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
              className="px-6 py-2.5 rounded-full bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-md shadow-orange-600/20 flex items-center gap-1.5 transition-all"
            >
              <span>Tiếp tục</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="px-8 py-3 rounded-full bg-orange-600 hover:bg-orange-700 text-white text-sm font-bold shadow-md shadow-orange-600/25 flex items-center gap-2 transition-all disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Đang gửi...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Gửi nhu cầu mua</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

