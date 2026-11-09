'use client';

import React, { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/lib/context/AppContext';
import { formatCurrencyVND } from '@/lib/utils';
import type { LocationData } from '@/components/map/LocationPicker';
import {
  ShieldCheck,
  Check,
  ChevronDown,
  Calendar,
  Image as ImageIcon,
  MapPin,
  Lock,
  UploadCloud,
  Trash2,
  Star,
  FileCheck2,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
  Search
} from 'lucide-react';
import {
  PostingData,
  SellerValidationErrors,
  isValidVNPhone
} from './wizard/PostingDataTypes';

function processImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error(`Không thể đọc file ${file.name}`));
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (!dataUrl) {
        reject(new Error('Dữ liệu file rỗng'));
        return;
      }
      const img = new Image();
      img.onerror = () => resolve(dataUrl);
      img.onload = () => {
        try {
          const MAX_WIDTH = 1600;
          const MAX_HEIGHT = 1600;
          let width = img.width;
          let height = img.height;

          if (width > MAX_WIDTH || height > MAX_HEIGHT) {
            if (width > height) {
              height = Math.round((height * MAX_WIDTH) / width);
              width = MAX_WIDTH;
            } else {
              width = Math.round((width * MAX_HEIGHT) / height);
              height = MAX_HEIGHT;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(dataUrl);
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.85);
          resolve(compressed);
        } catch {
          resolve(dataUrl);
        }
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  });
}

const LocationPicker = dynamic(
  () => import('@/components/map/LocationPicker'),
  {
    ssr: false,
    loading: () => (
      <div className="h-[320px] bg-slate-100 rounded-2xl animate-pulse flex items-center justify-center">
        <p className="text-slate-400 text-xs">Đang tải bản đồ định vị...</p>
      </div>
    ),
  }
);

const STEP_LABELS = [
  'Thông tin nhà',
  'Vị trí',
  'Hình ảnh & lịch',
  'Giá bán',
  'Xác minh',
  'Kiểm tra & Gửi',
];

const STEP_PERCENTAGES = ['17%', '33%', '50%', '67%', '83%', '100%'];

export const CreateListingWizard: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const { user, listings, addNewListing, updateListing, addToast } = useApp();

  const editId = searchParams?.get('editId') || searchParams?.get('id');
  const isEditMode = Boolean(editId);

  // Phân tích bước từ URL
  const stepParamFromPath = params?.step as string | undefined;
  let parsedStep = 1;
  if (stepParamFromPath) {
    const match = stepParamFromPath.match(/\d+/);
    if (match) parsedStep = Number(match[0]);
  } else if (searchParams?.get('step')) {
    parsedStep = Number(searchParams.get('step'));
  }

  const [currentStep, setCurrentStep] = useState(
    parsedStep >= 1 && parsedStep <= 6 ? parsedStep : 1
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [publishedListingId, setPublishedListingId] = useState<string | null>(null);
  const [showMapPicker, setShowMapPicker] = useState<boolean>(false);

  const [pickedLocation, setPickedLocation] = useState<LocationData | null>({
    lat: 21.0315,
    lng: 105.7825,
    displayName: 'Phường Dịch Vọng Hậu, Quận Cầu Giấy, Hà Nội',
    district: 'Cầu Giấy',
    ward: 'Dịch Vọng Hậu',
    road: 'Duy Tân',
    houseNumber: '18',
  });

  // State Posting Data đầy đủ
  const [postingData, setPostingData] = useState<PostingData>(() => {
    if (typeof window !== 'undefined' && !isEditMode) {
      try {
        const cached = localStorage.getItem('owner_listing_wizard_draft');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && parsed.propertyType) {
            return parsed;
          }
        }
      } catch {}
    }

    return {
      propertyType: 'house',
      location: {
        district: 'Cầu Giấy',
        ward: 'Dịch Vọng Hậu',
        street: 'Số 18, ngõ 86 Duy Tân',
        addressNumber: '18',
        lat: 21.0315,
        lng: 105.7825,
        displayName: 'Số 18, ngõ 86 Duy Tân, Dịch Vọng Hậu, Cầu Giấy, Hà Nội',
      },
      images: [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80',
      ],
      price: 5000000000,
      area: 65,
      floors: 5,
      bedrooms: 4,
      bathrooms: 3,
      direction: 'Đông Nam',
      legalStatus: 'Sổ đỏ chính chủ',
      title: '',
      description: '',

      // Bước 3: Hình ảnh & lịch khảo sát
      imageMethod: 'has_images',
      surveyDate: '',
      surveyTimeSlot: 'Buổi sáng',

      // Bước 4: Tình trạng sử dụng
      usageStatus: 'empty',

      // Bước 5: Xác minh chủ nhà & hồ sơ
      ownershipRole: 'sole_owner',
      certificateStatus: 'Có giấy chứng nhận',
      mortgageStatus: 'Chưa rõ / cần kiểm tra',
      disputeStatus: 'Không có tranh chấp (theo khai báo)',
      confidentialDocs: [],
      ownerDeclarationChecked: true,

      seller: {
        fullName: 'Nguyễn Minh Tuấn',
        phone: '0912345678',
        email: '',
        sellerType: 'Chính chủ',
        companyName: '',
        contactAddress: '',
        showPhone: true,
        allowEmailContact: true,
        showCompany: false,
        isPhoneVerified: true,
      },

      status: 'pending',
    };
  });

  const [priceInput, setPriceInput] = useState<string>(
    postingData.price ? String(postingData.price) : '5000000000'
  );
  const [areaInput, setAreaInput] = useState<string>(
    postingData.area ? String(postingData.area) : '65'
  );
  const [floorsInput, setFloorsInput] = useState<string>(
    postingData.floors ? String(postingData.floors) : '5'
  );
  const [streetAddressInput, setStreetAddressInput] = useState<string>(
    postingData.location.street || 'Số 18, ngõ 86 Duy Tân'
  );
  const [wardDistrictInput, setWardDistrictInput] = useState<string>(
    postingData.location.ward && postingData.location.district
      ? `${postingData.location.ward}, ${postingData.location.district}`
      : 'Dịch Vọng Hậu, Cầu Giấy'
  );

  // Đồng bộ user info
  useEffect(() => {
    if (user && !editId) {
      setPostingData((prev) => ({
        ...prev,
        seller: {
          ...prev.seller,
          fullName: user.name || prev.seller.fullName,
          phone: user.phone || prev.seller.phone,
          email: user.email || prev.seller.email,
        },
      }));
    }
  }, [user, editId]);

  // Lưu nháp tự động
  useEffect(() => {
    if (typeof window !== 'undefined' && !publishedListingId && !editId) {
      try {
        localStorage.setItem('owner_listing_wizard_draft', JSON.stringify(postingData));
      } catch {}
    }
  }, [postingData, publishedListingId, editId]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const confidentialFileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Upload ảnh hiện trạng nhà
  const handleFiles = async (fileList: FileList | File[]) => {
    const files = Array.from(fileList);
    if (!files.length) return;

    setIsUploading(true);
    try {
      const processedUrls: string[] = [];
      for (const file of files) {
        try {
          const dataUrl = await processImageFile(file);
          processedUrls.push(dataUrl);
        } catch {
          addToast(`Không thể đọc file ảnh: ${file.name}`, 'error');
        }
      }

      if (processedUrls.length > 0) {
        setPostingData((prev) => ({
          ...prev,
          images: [...prev.images, ...processedUrls],
        }));
        addToast(`Đã thêm thành công ${processedUrls.length} ảnh`, 'success');
      }
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Upload hồ sơ bảo mật (sổ đỏ/giấy tờ)
  const handleConfidentialFiles = async (fileList: FileList | File[]) => {
    const files = Array.from(fileList);
    if (!files.length) return;

    try {
      const processedUrls: string[] = [];
      for (const file of files) {
        const dataUrl = await processImageFile(file);
        processedUrls.push(dataUrl);
      }
      setPostingData((prev) => ({
        ...prev,
        confidentialDocs: [...(prev.confidentialDocs || []), ...processedUrls],
      }));
      addToast(`Đã tải lên ${processedUrls.length} giấy tờ hồ sơ bảo mật`, 'success');
    } catch {
      addToast('Có lỗi xảy ra khi tải tài liệu', 'error');
    } finally {
      if (confidentialFileInputRef.current) confidentialFileInputRef.current.value = '';
    }
  };

  const handleNext = () => {
    // Validate từng bước
    if (currentStep === 1) {
      const a = parseFloat(areaInput);
      if (isNaN(a) || a <= 0) {
        addToast('Vui lòng nhập diện tích hợp lệ (m²)', 'warning');
        return;
      }
      setPostingData((prev) => ({
        ...prev,
        area: a,
        floors: parseInt(floorsInput, 10) || prev.floors,
      }));
    }

    if (currentStep === 2) {
      if (!streetAddressInput.trim()) {
        addToast('Vui lòng nhập địa chỉ bất động sản', 'warning');
        return;
      }
      if (!wardDistrictInput.trim()) {
        addToast('Vui lòng nhập phường/xã, khu vực tại Hà Nội', 'warning');
        return;
      }
      setPostingData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          street: streetAddressInput,
          displayName: `${streetAddressInput}, ${wardDistrictInput}, Hà Nội`,
        },
      }));
    }

    if (currentStep === 4) {
      const p = parseFloat(priceInput);
      if (isNaN(p) || p <= 0) {
        addToast('Vui lòng nhập giá bán mong muốn hợp lệ (VNĐ)', 'warning');
        return;
      }
      setPostingData((prev) => ({
        ...prev,
        price: p,
      }));
    }

    if (currentStep === 5) {
      if (!postingData.seller.fullName.trim()) {
        addToast('Vui lòng nhập họ tên người gửi trên giấy tờ', 'warning');
        return;
      }
      if (!postingData.seller.phone.trim() || !isValidVNPhone(postingData.seller.phone)) {
        addToast('Vui lòng nhập số điện thoại liên hệ hợp lệ để xác thực OTP', 'warning');
        return;
      }
      if (!postingData.ownerDeclarationChecked) {
        addToast('Vui lòng tích xác nhận quyền cung cấp thông tin và giấy tờ', 'warning');
        return;
      }
    }

    setCurrentStep((prev) => Math.min(6, prev + 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Submit gửi duyệt BĐS
  const handleSubmitListing = async () => {
    if (isSubmitting) return;

    if (user?.role === 'buyer') {
      addToast('Tài khoản Người mua không thể gửi bán BĐS. Vui lòng chuyển sang Đăng tìm BĐS!', 'error');
      router.push('/buyer-request');
      return;
    }

    setIsSubmitting(true);
    try {
      const generatedCode = `HR-PROP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

      const fullAddress = `${streetAddressInput}, ${wardDistrictInput}, Hà Nội`;
      const finalTitle = `Bán ${
        postingData.propertyType === 'house'
          ? 'Nhà riêng / Nhà phố'
          : postingData.propertyType === 'apartment'
          ? 'Căn hộ chung cư'
          : postingData.propertyType === 'land'
          ? 'Đất nền / Đất thổ cư'
          : 'Biệt thự / Shophouse'
      } ${postingData.area}m² tại ${wardDistrictInput}`;

      let resultId = editId;

      if (isEditMode && editId) {
        await updateListing(editId, {
          title: finalTitle,
          propertyType: postingData.propertyType,
          price: postingData.price,
          area: postingData.area,
          pricePerM2: Math.round(postingData.price / (postingData.area || 1)),
          floors: postingData.floors,
          address: fullAddress,
          images: postingData.images.length > 0 ? postingData.images : [
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80'
          ],
          authorName: postingData.seller.fullName,
          authorPhone: postingData.seller.phone,
          status: 'pending',
        });
        addToast('Đã cập nhật BĐS và gửi vào kho thẩm định!', 'success');
      } else {
        const newId = await addNewListing({
          title: finalTitle,
          description: `BĐS chính chủ gửi bán qua hệ thống HaNoi Realty. Tình trạng sử dụng: ${
            postingData.usageStatus === 'empty'
              ? 'Nhà trống, có thể bàn giao'
              : postingData.usageStatus === 'occupied'
              ? 'Đang có người sử dụng'
              : 'Đang có hợp đồng cho thuê'
          }. Pháp lý: ${postingData.certificateStatus}.`,
          type: postingData.propertyType,
          propertyType: postingData.propertyType,
          price: postingData.price,
          area: postingData.area,
          pricePerM2: Math.round(postingData.price / (postingData.area || 1)),
          floors: postingData.floors,
          bedrooms: postingData.bedrooms || 3,
          bathrooms: postingData.bathrooms || 2,
          direction: postingData.direction || 'Đông Nam',
          legalStatus: postingData.certificateStatus || 'Sổ đỏ chính chủ',
          address: fullAddress,
          district: postingData.location.district || 'Cầu Giấy',
          ward: postingData.location.ward || 'Dịch Vọng Hậu',
          lat: postingData.location.lat || 21.0315,
          lng: postingData.location.lng || 105.7825,
          images: postingData.images.length > 0 ? postingData.images : [
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80'
          ],
          authorName: postingData.seller.fullName,
          authorPhone: postingData.seller.phone,
          authorEmail: postingData.seller.email || undefined,
          status: 'pending',
          propertyCode: generatedCode,
          verificationStatus: 'in_review',
          surveyDate: postingData.surveyDate,
          surveyTimeSlot: postingData.surveyTimeSlot,
        });

        resultId = newId;
        addToast('🎉 Gửi BĐS thành công! Hồ sơ đang ở trạng thái Chờ xác minh.', 'success');
      }

      if (typeof window !== 'undefined') {
        try {
          localStorage.removeItem('owner_listing_wizard_draft');
        } catch {}
      }

      setPublishedListingId(resultId || generatedCode);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      console.error(e);
      addToast('Có lỗi xảy ra khi lưu BĐS', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // MÀN HÌNH THÀNH CÔNG (STEP 6 SUCCESS STATE)
  if (publishedListingId !== null) {
    const finalPropCode = publishedListingId.startsWith('HR-PROP-')
      ? publishedListingId
      : `HR-PROP-2026-${publishedListingId.slice(-4).toUpperCase()}`;

    return (
      <div className="w-full max-w-3xl mx-auto py-10 px-4 text-center space-y-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-md shadow-emerald-500/20"
        >
          <CheckCircle2 className="w-10 h-10" />
        </motion.div>

        <div className="space-y-2">
          <span className="px-3.5 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
            Property ID: {finalPropCode}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Gửi Bất Động Sản Thành Công!
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
            Hồ sơ BĐS của bạn đã được đưa vào kho thẩm định ở trạng thái{' '}
            <strong className="text-orange-600 font-bold">Chờ xác minh</strong>. Ban quản trị HaNoi Realty sẽ đối chiếu hồ sơ, liên hệ sắp xếp khảo sát và cập nhật tiến độ công khai.
          </p>
        </div>

        {/* Tóm tắt BĐS vừa gửi */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-xs space-y-4 max-w-xl mx-auto">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">Trạng thái</span>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 mt-1">
                <Clock className="w-3 h-3 text-amber-600 animate-pulse" />
                Chờ xác minh
              </span>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">Giá chào bán</span>
              <span className="text-base font-bold text-orange-600 mt-1 block">
                {formatCurrencyVND(postingData.price)}
              </span>
            </div>
          </div>

          <div className="space-y-2 text-xs sm:text-sm">
            <div>
              <span className="text-slate-400">Loại BĐS & Quy mô: </span>
              <span className="font-semibold text-slate-800">
                {postingData.propertyType === 'house'
                  ? 'Nhà riêng / Nhà phố'
                  : postingData.propertyType === 'apartment'
                  ? 'Căn hộ chung cư'
                  : postingData.propertyType === 'land'
                  ? 'Đất nền / Đất thổ cư'
                  : 'Biệt thự / Shophouse'}{' '}
                • {postingData.area} m² {postingData.floors ? `• ${postingData.floors} tầng` : ''}
              </span>
            </div>
            <div>
              <span className="text-slate-400">Địa chỉ: </span>
              <span className="font-semibold text-slate-800">
                {streetAddressInput}, {wardDistrictInput}, Hà Nội
              </span>
            </div>
            <div>
              <span className="text-slate-400">Người gửi: </span>
              <span className="font-semibold text-slate-800">
                {postingData.seller.fullName} ({postingData.seller.phone})
              </span>
            </div>
            {postingData.imageMethod === 'need_survey' && (
              <div className="text-emerald-700 bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">
                📅 Đã ghi nhận yêu cầu khảo sát/quay chụp: <strong>{postingData.surveyDate || 'Sớm nhất'} ({postingData.surveyTimeSlot})</strong>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/dashboard?tab=properties"
            className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-slate-950 hover:bg-slate-800 text-white font-medium text-xs sm:text-sm transition-all text-center"
          >
            Quản lý BĐS đã gửi bán
          </Link>
          <button
            type="button"
            onClick={() => {
              setPublishedListingId(null);
              setCurrentStep(1);
            }}
            className="w-full sm:w-auto px-6 py-2.5 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium text-xs sm:text-sm transition-all text-center"
          >
            Gửi thêm BĐS khác
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto py-6 sm:py-10 px-4 space-y-6">
      {/* 1. HEADER: Gửi bán bất động sản */}
      <div className="space-y-1 pb-4 border-b border-slate-100">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Gửi bán bất động sản
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 font-medium">
          Dành cho Chủ nhà • Miễn phí đăng nguồn hàng
        </p>
      </div>

      {/* 2. THANH TIẾN ĐỘ 6 BƯỚC: NÉT ĐỨT / ĐƯỜNG THẲNG & DẤU TÍCH XANH LÁ HOÀN THÀNH (ĐỒNG BỘ FORM NGƯỜI MUA) */}
      <div className="pb-6 border-b border-slate-100">
        <div className="flex items-center justify-between max-w-2xl mx-auto px-1 sm:px-3">
          {[
            { step: 1, title: 'Loại BĐS' },
            { step: 2, title: 'Vị trí' },
            { step: 3, title: 'Ảnh & lịch' },
            { step: 4, title: 'Giá bán' },
            { step: 5, title: 'Xác minh' },
            { step: 6, title: 'Xác nhận' },
          ].map((item, idx) => {
            const isCompleted = item.step < currentStep;
            const isCurrent = item.step === currentStep;

            return (
              <React.Fragment key={item.step}>
                <div className="flex flex-col items-center shrink-0">
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-300 ${
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
                    className={`text-[10px] sm:text-xs mt-2 text-center whitespace-nowrap ${
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
                {idx < 5 && (
                  <div
                    className={`flex-1 mx-1 sm:mx-2.5 -mt-5 transition-all duration-300 ${
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

      {/* NỘI DUNG TỪNG BƯỚC */}
      <div className="pt-2 min-h-[380px]">
        <AnimatePresence mode="wait">
          {/* ==================== BƯỚC 1: THÔNG TIN BẤT ĐỘNG SẢN ==================== */}
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
                  Bước 1. Thông tin bất động sản
                </h2>
              </div>

              {/* Loại bất động sản */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-slate-700 block">
                  Loại bất động sản
                </label>
                <div className="space-y-3 pt-0.5">
                  {[
                    { id: 'house', label: 'Nhà riêng / Nhà phố' },
                    { id: 'apartment', label: 'Căn hộ chung cư' },
                    { id: 'land', label: 'Đất nền / Đất thổ cư' },
                    { id: 'villa', label: 'Biệt thự / Shophouse' },
                  ].map((item) => {
                    const isSelected = postingData.propertyType === item.id;
                    return (
                      <label
                        key={item.id}
                        onClick={() =>
                          setPostingData((prev) => ({
                            ...prev,
                            propertyType: item.id as any,
                          }))
                        }
                        className="flex items-center gap-3.5 py-1.5 cursor-pointer select-none group"
                      >
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
                          className={`text-sm sm:text-base transition-colors ${
                            isSelected
                              ? 'text-slate-900 font-medium'
                              : 'text-slate-700 group-hover:text-slate-900 font-normal'
                          }`}
                        >
                          {item.label}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Diện tích & Số tầng */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-xs sm:text-sm font-medium text-slate-700 mb-1.5 block">
                    Diện tích (m²)
                  </label>
                  <input
                    type="number"
                    value={areaInput}
                    onChange={(e) => setAreaInput(e.target.value)}
                    placeholder="Ví dụ: 65"
                    className="w-full px-5 py-2.5 rounded-full border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-medium text-slate-700 mb-1.5 block">
                    Số tầng (nếu có)
                  </label>
                  <input
                    type="number"
                    value={floorsInput}
                    onChange={(e) => setFloorsInput(e.target.value)}
                    placeholder="Ví dụ: 5"
                    className="w-full px-5 py-2.5 rounded-full border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 transition-colors"
                  />
                </div>
              </div>

              <p className="text-xs text-slate-400">
                Các trường chi tiết khác sẽ thay đổi tùy loại BĐS được chọn.
              </p>
            </motion.div>
          )}

          {/* ==================== BƯỚC 2: XÁC ĐỊNH VỊ TRÍ ==================== */}
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
                  Bước 2. Xác định vị trí
                </h2>
              </div>

              {/* Địa chỉ bất động sản */}
              <div>
                <label className="text-xs sm:text-sm font-medium text-slate-700 mb-1.5 block">
                  Địa chỉ bất động sản
                </label>
                <input
                  type="text"
                  value={streetAddressInput}
                  onChange={(e) => setStreetAddressInput(e.target.value)}
                  placeholder="Số nhà, đường/ngõ, tên tòa nhà"
                  className="w-full px-5 py-2.5 rounded-full border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 transition-colors"
                />
              </div>

              {/* Phường/xã, khu vực tại Hà Nội */}
              <div>
                <label className="text-xs sm:text-sm font-medium text-slate-700 mb-1.5 block">
                  Phường/xã, khu vực tại Hà Nội
                </label>
                <input
                  type="text"
                  value={wardDistrictInput}
                  onChange={(e) => setWardDistrictInput(e.target.value)}
                  placeholder="Nhập hoặc chọn địa giới hiện hành"
                  className="w-full px-5 py-2.5 rounded-full border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 transition-colors"
                />
              </div>

              {/* Khung Vị trí trên bản đồ */}
              <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-6 text-center space-y-2">
                <div className="w-8 h-8 mx-auto text-slate-600 flex items-center justify-center">
                  <MapPin className="w-6 h-6 stroke-[1.5]" />
                </div>
                <h3 className="text-sm font-bold text-slate-800">
                  Vị trí trên bản đồ
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  Website thật sẽ cho tìm địa chỉ và ghim vị trí chính xác. Admin sẽ đối chiếu với hồ sơ và khảo sát thực tế.
                </p>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setShowMapPicker(!showMapPicker)}
                    className="text-xs font-semibold text-orange-600 hover:text-orange-700 underline underline-offset-4"
                  >
                    {showMapPicker ? 'Thu gọn bản đồ định vị' : 'Mở bản đồ định vị toạ độ GPS'}
                  </button>
                </div>

                {showMapPicker && (
                  <div className="pt-3 text-left">
                    <LocationPicker
                      value={pickedLocation}
                      onChange={(loc) => {
                        setPickedLocation(loc);
                        if (loc) {
                          setPostingData((prev) => ({
                            ...prev,
                            location: {
                              ...prev.location,
                              lat: loc.lat,
                              lng: loc.lng,
                              displayName: loc.displayName || prev.location.displayName,
                            },
                          }));
                          addToast('📍 Đã cập nhật toạ độ GPS chính xác', 'success');
                        }
                      }}
                      height="300px"
                    />
                  </div>
                )}
              </div>

              <p className="text-xs text-slate-400">
                Địa chỉ chính xác có thể được giữ trong hồ sơ nội bộ; trang công khai chỉ hiển thị phạm vi được chủ nhà cho phép.
              </p>
            </motion.div>
          )}

          {/* ==================== BƯỚC 3: HÌNH ẢNH & LỊCH KHẢO SÁT ==================== */}
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
                  Bước 3. Hình ảnh & lịch khảo sát
                </h2>
              </div>

              {/* Ảnh bất động sản */}
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium text-slate-700 block">
                  Ảnh bất động sản
                </label>

                {/* Box tải ảnh viền nét đứt bo tròn */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => e.target.files && handleFiles(e.target.files)}
                  multiple
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-2xl border-2 border-dashed border-slate-200 p-8 text-center bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-colors space-y-2 group"
                >
                  <div className="w-8 h-8 mx-auto text-slate-500 group-hover:text-slate-700 transition-colors flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 stroke-[1.5]" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800">
                    Khu vực tải ảnh hiện trạng nhà
                  </h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                    Bản website thật: tải nhiều ảnh, xem trước và xóa ảnh. Bản mẫu chưa hỗ trợ tải file.
                  </p>
                  <span className="inline-block text-[11px] font-semibold text-orange-600 group-hover:underline">
                    Nhấp vào đây để chọn ảnh từ máy tính (tối đa 20 ảnh)
                  </span>
                </div>

                {/* Danh sách ảnh đã tải lên */}
                {postingData.images.length > 0 && (
                  <div className="pt-2">
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                      <span>Đã tải {postingData.images.length} ảnh (Ảnh đầu tiên là ảnh bìa)</span>
                      <button
                        type="button"
                        onClick={() => setPostingData((prev) => ({ ...prev, images: [] }))}
                        className="text-red-500 hover:underline"
                      >
                        Xóa tất cả
                      </button>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
                      {postingData.images.map((imgUrl, idx) => (
                        <div
                          key={idx}
                          className="relative aspect-4/3 rounded-xl overflow-hidden border border-slate-200 group bg-slate-100"
                        >
                          <img
                            src={imgUrl}
                            alt={`Preview ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          {idx === 0 && (
                            <span className="absolute top-1 left-1 bg-orange-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs">
                              Bìa
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPostingData((prev) => ({
                                ...prev,
                                images: prev.images.filter((_, i) => i !== idx),
                              }));
                            }}
                            className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-black/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Phương án cung cấp hình ảnh */}
              <div className="space-y-3 pt-2">
                <label className="text-xs sm:text-sm font-medium text-slate-700 block">
                  Phương án cung cấp hình ảnh
                </label>
                <div className="space-y-3">
                  {[
                    {
                      id: 'has_images',
                      label: 'Tôi có ảnh sẵn, muốn bổ sung khảo sát nếu cần',
                    },
                    {
                      id: 'need_survey',
                      label: 'Tôi muốn HaNoi Realty đến khảo sát/quay chụp',
                    },
                  ].map((item) => {
                    const isSelected = postingData.imageMethod === item.id;
                    return (
                      <label
                        key={item.id}
                        onClick={() =>
                          setPostingData((prev) => ({
                            ...prev,
                            imageMethod: item.id as any,
                          }))
                        }
                        className="flex items-center gap-3.5 py-1 cursor-pointer select-none group"
                      >
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
                          className={`text-sm sm:text-base transition-colors ${
                            isSelected
                              ? 'text-slate-900 font-medium'
                              : 'text-slate-700 group-hover:text-slate-900 font-normal'
                          }`}
                        >
                          {item.label}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Ngày thuận tiện & Khung giờ */}
              <div className="space-y-4 pt-2">
                <div>
                  <label className="text-xs sm:text-sm font-medium text-slate-700 mb-1.5 block">
                    Ngày thuận tiện cho việc khảo sát
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={postingData.surveyDate || ''}
                      onChange={(e) =>
                        setPostingData((prev) => ({
                          ...prev,
                          surveyDate: e.target.value,
                        }))
                      }
                      className="w-full px-5 py-2.5 rounded-full border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-slate-900 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs sm:text-sm font-medium text-slate-700 mb-1.5 block">
                    Khung giờ
                  </label>
                  <div className="relative">
                    <select
                      value={postingData.surveyTimeSlot || 'Buổi sáng'}
                      onChange={(e) =>
                        setPostingData((prev) => ({
                          ...prev,
                          surveyTimeSlot: e.target.value,
                        }))
                      }
                      className="w-full px-5 py-2.5 rounded-full border border-slate-200 text-sm text-slate-900 appearance-none bg-white focus:outline-none focus:border-slate-900 transition-colors pr-10"
                    >
                      <option value="Buổi sáng">Buổi sáng</option>
                      <option value="Buổi chiều">Buổi chiều</option>
                      <option value="Buổi tối">Buổi tối</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-400">
                Lịch chỉ được xác nhận sau khi nhân sự HaNoi Realty tiếp nhận và phản hồi.
              </p>
            </motion.div>
          )}

          {/* ==================== BƯỚC 4: GIÁ BÁN & ĐIỀU KIỆN GIAO DỊCH ==================== */}
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
                  Bước 4. Giá bán & điều kiện giao dịch
                </h2>
              </div>

              {/* Giá bán mong muốn (VNĐ) */}
              <div>
                <label className="text-xs sm:text-sm font-medium text-slate-700 mb-1.5 block">
                  Giá bán mong muốn (VNĐ)
                </label>
                <input
                  type="number"
                  value={priceInput}
                  onChange={(e) => {
                    setPriceInput(e.target.value);
                    const val = parseFloat(e.target.value);
                    if (!isNaN(val)) {
                      setPostingData((prev) => ({ ...prev, price: val }));
                    }
                  }}
                  placeholder="Ví dụ: 5000000000"
                  className="w-full px-5 py-2.5 rounded-full border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 transition-colors"
                />
                {postingData.price > 0 && (
                  <p className="text-xs font-semibold text-orange-600 mt-1.5 pl-2">
                    ≈ {formatCurrencyVND(postingData.price)} ({postingData.price.toLocaleString('vi-VN')} đ)
                  </p>
                )}
              </div>

              {/* Tình trạng sử dụng */}
              <div className="space-y-3 pt-2">
                <label className="text-xs sm:text-sm font-medium text-slate-700 block">
                  Tình trạng sử dụng
                </label>
                <div className="space-y-3">
                  {[
                    { id: 'empty', label: 'Nhà trống, có thể bàn giao' },
                    { id: 'occupied', label: 'Đang có người sử dụng' },
                    { id: 'rented', label: 'Đang có hợp đồng cho thuê' },
                  ].map((item) => {
                    const isSelected = postingData.usageStatus === item.id;
                    return (
                      <label
                        key={item.id}
                        onClick={() =>
                          setPostingData((prev) => ({
                            ...prev,
                            usageStatus: item.id as any,
                          }))
                        }
                        className="flex items-center gap-3.5 py-1 cursor-pointer select-none group"
                      >
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
                          className={`text-sm sm:text-base transition-colors ${
                            isSelected
                              ? 'text-slate-900 font-medium'
                              : 'text-slate-700 group-hover:text-slate-900 font-normal'
                          }`}
                        >
                          {item.label}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Thông tin phí môi giới */}
              <div className="space-y-1.5 pt-2">
                <h3 className="text-sm font-bold text-slate-900">
                  Thông tin phí môi giới
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Đăng nguồn hàng miễn phí. Phí môi giới, thời điểm phát sinh nghĩa vụ và các điều kiện khác sẽ được thống nhất bằng hợp đồng dịch vụ riêng, không tự áp dụng tỷ lệ mặc định.
                </p>
              </div>
            </motion.div>
          )}

          {/* ==================== BƯỚC 5: XÁC MINH CHỦ NHÀ & HỒ SƠ ==================== */}
          {currentStep === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  Bước 5. Xác minh chủ nhà & hồ sơ
                </h2>
              </div>

              {/* Tư cách người gửi bán */}
              <div className="space-y-3">
                <label className="text-xs sm:text-sm font-medium text-slate-700 block">
                  Tư cách người gửi bán
                </label>
                <div className="space-y-3">
                  {[
                    { id: 'sole_owner', label: 'Tôi là người đứng tên trên giấy tờ' },
                    { id: 'co_owner', label: 'Tài sản có đồng sở hữu / sở hữu chung' },
                    { id: 'authorized', label: 'Tôi là người được ủy quyền hợp pháp' },
                  ].map((item) => {
                    const isSelected = postingData.ownershipRole === item.id;
                    return (
                      <label
                        key={item.id}
                        onClick={() =>
                          setPostingData((prev) => ({
                            ...prev,
                            ownershipRole: item.id as any,
                          }))
                        }
                        className="flex items-center gap-3.5 py-1 cursor-pointer select-none group"
                      >
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
                          className={`text-sm sm:text-base transition-colors ${
                            isSelected
                              ? 'text-slate-900 font-medium'
                              : 'text-slate-700 group-hover:text-slate-900 font-normal'
                          }`}
                        >
                          {item.label}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Họ tên người gửi */}
              <div>
                <label className="text-xs sm:text-sm font-medium text-slate-700 mb-1.5 block">
                  Họ tên người gửi
                </label>
                <input
                  type="text"
                  value={postingData.seller.fullName}
                  onChange={(e) =>
                    setPostingData((prev) => ({
                      ...prev,
                      seller: { ...prev.seller, fullName: e.target.value },
                    }))
                  }
                  placeholder="Họ tên trên giấy tờ"
                  className="w-full px-5 py-2.5 rounded-full border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 transition-colors"
                />
              </div>

              {/* Số điện thoại liên hệ */}
              <div>
                <label className="text-xs sm:text-sm font-medium text-slate-700 mb-1.5 block">
                  Số điện thoại liên hệ
                </label>
                <input
                  type="tel"
                  value={postingData.seller.phone}
                  onChange={(e) =>
                    setPostingData((prev) => ({
                      ...prev,
                      seller: { ...prev.seller, phone: e.target.value },
                    }))
                  }
                  placeholder="Số điện thoại để xác thực OTP"
                  className="w-full px-5 py-2.5 rounded-full border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 transition-colors"
                />
              </div>

              {/* Khu vực hồ sơ bảo mật */}
              <input
                type="file"
                ref={confidentialFileInputRef}
                onChange={(e) => e.target.files && handleConfidentialFiles(e.target.files)}
                multiple
                accept="image/*,.pdf"
                className="hidden"
              />

              <div
                onClick={() => confidentialFileInputRef.current?.click()}
                className="rounded-2xl border border-dashed border-slate-200 p-4.5 bg-slate-50/40 hover:bg-slate-50 cursor-pointer transition-colors space-y-1.5 group"
              >
                <div className="flex items-center gap-2 text-slate-800">
                  <Lock className="w-4 h-4 text-slate-600" />
                  <span className="text-sm font-bold">Khu vực hồ sơ bảo mật</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Website thật cần hỗ trợ tải giấy tờ định danh và giấy chứng nhận, giấy ủy quyền hoặc giấy tờ đồng sở hữu nếu có. Chỉ nhân sự có thẩm quyền được xem.
                </p>
                {postingData.confidentialDocs && postingData.confidentialDocs.length > 0 ? (
                  <p className="text-xs font-semibold text-emerald-600 pt-1">
                    ✓ Đã đính kèm {postingData.confidentialDocs.length} tệp tài liệu bảo mật
                  </p>
                ) : (
                  <span className="inline-block text-[11px] font-semibold text-orange-600 group-hover:underline pt-0.5">
                    + Nhấp vào đây để tải ảnh giấy chứng nhận / CCCD (nếu có)
                  </span>
                )}
              </div>

              {/* 3 Dropdown: Giấy chứng nhận, Tình trạng thế chấp, Tình trạng tranh chấp */}
              <div className="space-y-4 pt-1">
                <div>
                  <label className="text-xs sm:text-sm font-medium text-slate-700 mb-1.5 block">
                    Giấy chứng nhận
                  </label>
                  <div className="relative">
                    <select
                      value={postingData.certificateStatus || 'Có giấy chứng nhận'}
                      onChange={(e) =>
                        setPostingData((prev) => ({
                          ...prev,
                          certificateStatus: e.target.value,
                        }))
                      }
                      className="w-full px-5 py-2.5 rounded-full border border-slate-200 text-sm text-slate-900 appearance-none bg-white focus:outline-none focus:border-slate-900 transition-colors pr-10"
                    >
                      <option value="Có giấy chứng nhận">Có giấy chứng nhận</option>
                      <option value="Đang chờ cấp giấy chứng nhận">Đang chờ cấp giấy chứng nhận</option>
                      <option value="Hợp đồng mua bán / Giấy tờ khác">Hợp đồng mua bán / Giấy tờ khác</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="text-xs sm:text-sm font-medium text-slate-700 mb-1.5 block">
                    Tình trạng thế chấp
                  </label>
                  <div className="relative">
                    <select
                      value={postingData.mortgageStatus || 'Chưa rõ / cần kiểm tra'}
                      onChange={(e) =>
                        setPostingData((prev) => ({
                          ...prev,
                          mortgageStatus: e.target.value,
                        }))
                      }
                      className="w-full px-5 py-2.5 rounded-full border border-slate-200 text-sm text-slate-900 appearance-none bg-white focus:outline-none focus:border-slate-900 transition-colors pr-10"
                    >
                      <option value="Chưa rõ / cần kiểm tra">Chưa rõ / cần kiểm tra</option>
                      <option value="Không có thế chấp">Không có thế chấp</option>
                      <option value="Đang thế chấp ngân hàng">Đang thế chấp ngân hàng</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="text-xs sm:text-sm font-medium text-slate-700 mb-1.5 block">
                    Tình trạng tranh chấp
                  </label>
                  <div className="relative">
                    <select
                      value={postingData.disputeStatus || 'Không có tranh chấp (theo khai báo)'}
                      onChange={(e) =>
                        setPostingData((prev) => ({
                          ...prev,
                          disputeStatus: e.target.value,
                        }))
                      }
                      className="w-full px-5 py-2.5 rounded-full border border-slate-200 text-sm text-slate-900 appearance-none bg-white focus:outline-none focus:border-slate-900 transition-colors pr-10"
                    >
                      <option value="Không có tranh chấp (theo khai báo)">Không có tranh chấp (theo khai báo)</option>
                      <option value="Đang giải quyết tranh chấp">Đang giải quyết tranh chấp</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Checkbox xác nhận */}
              <div className="pt-2">
                <label
                  onClick={() =>
                    setPostingData((prev) => ({
                      ...prev,
                      ownerDeclarationChecked: !prev.ownerDeclarationChecked,
                    }))
                  }
                  className="flex items-start gap-3 cursor-pointer select-none group"
                >
                  <div className="relative flex items-center justify-center shrink-0 mt-0.5">
                    <div
                      className={`w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center ${
                        postingData.ownerDeclarationChecked
                          ? 'border-slate-900 bg-white'
                          : 'border-slate-300 group-hover:border-slate-400 bg-white'
                      }`}
                    >
                      {postingData.ownerDeclarationChecked && (
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-900" />
                      )}
                    </div>
                  </div>
                  <span className="text-xs sm:text-sm text-slate-700 leading-snug">
                    Tôi xác nhận có quyền cung cấp thông tin, giấy tờ và yêu cầu HaNoi Realty xem xét tài sản này.
                  </span>
                </label>
              </div>
            </motion.div>
          )}

          {/* ==================== BƯỚC 6: KIỂM TRA & GỬI DUYỆT ==================== */}
          {currentStep === 6 && (
            <motion.div
              key="step6"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  Bước 6. Kiểm tra & gửi duyệt
                </h2>
              </div>

              {/* 2 dấu tích xanh kiểm tra */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Kiểm tra lại loại nhà, vị trí, giá bán và phương án khảo sát</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Xác nhận thông tin chủ sở hữu và hồ sơ pháp lý trước khi gửi</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Sau khi gửi, BĐS sẽ được cấp Property ID duy nhất và lưu vào kho thẩm định ở trạng thái &quot;Chờ xác minh&quot;. Bạn có thể theo dõi tiến độ duyệt và lịch khảo sát trong Dashboard Chủ nhà.
              </p>

              {/* Thẻ tóm tắt thông tin hồ sơ */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 space-y-3 text-xs sm:text-sm">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Tóm tắt hồ sơ BĐS gửi bán
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Loại BĐS:</span>
                    <span className="font-semibold text-slate-900">
                      {postingData.propertyType === 'house'
                        ? 'Nhà riêng / Nhà phố'
                        : postingData.propertyType === 'apartment'
                        ? 'Căn hộ chung cư'
                        : postingData.propertyType === 'land'
                        ? 'Đất nền / Đất thổ cư'
                        : 'Biệt thự / Shophouse'}{' '}
                      ({areaInput} m² {floorsInput ? `• ${floorsInput} tầng` : ''})
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px]">Giá bán mong muốn:</span>
                    <span className="font-bold text-orange-600">
                      {formatCurrencyVND(postingData.price)}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px]">Địa chỉ:</span>
                    <span className="font-semibold text-slate-900">
                      {streetAddressInput}, {wardDistrictInput}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px]">Khảo sát / Hình ảnh:</span>
                    <span className="font-semibold text-slate-900">
                      {postingData.imageMethod === 'has_images'
                        ? `Đã có ảnh (${postingData.images.length} ảnh)`
                        : `Đề xuất khảo sát: ${postingData.surveyDate || 'Sớm nhất'} (${postingData.surveyTimeSlot})`}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px]">Người gửi bán:</span>
                    <span className="font-semibold text-slate-900">
                      {postingData.seller.fullName} • {postingData.seller.phone}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px]">Pháp lý & Thế chấp:</span>
                    <span className="font-semibold text-slate-900">
                      {postingData.certificateStatus} • {postingData.mortgageStatus}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3. NÚT ĐIỀU HƯỚNG CHÂN TRANG: Quay lại & Tiếp theo / Gửi BĐS */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <div>
          {currentStep > 1 && (
            <button
              type="button"
              onClick={handleBack}
              className="px-6 py-2.5 rounded-full border border-slate-200 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Quay lại
            </button>
          )}
        </div>

        <div>
          {currentStep < 6 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-7 py-2.5 rounded-full bg-slate-950 text-white text-xs sm:text-sm font-medium hover:bg-slate-800 transition-colors flex items-center gap-1.5"
            >
              <span>Tiếp theo</span>
              <span className="text-base leading-none">→</span>
            </button>
          ) : (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmitListing}
              className="px-8 py-2.5 rounded-full bg-slate-950 text-white text-xs sm:text-sm font-medium hover:bg-slate-800 disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              {isSubmitting ? 'Đang gửi hồ sơ...' : 'Gửi BĐS vào kho thẩm định →'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
