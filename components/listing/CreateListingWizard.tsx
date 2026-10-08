'use client';

import React, { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/lib/context/AppContext';
import { formatCurrencyVND, formatPricePerM2, HANOI_DISTRICT_COORDINATES } from '@/lib/utils';
import type { LocationData } from '@/components/map/LocationPicker';
import {
  Home,
  Building2,
  Trees,
  Landmark,
  MapPin,
  Image as ImageIcon,
  DollarSign,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  UploadCloud,
  Trash2,
  Sparkles,
  Maximize2,
  Bed,
  Bath,
  Building,
  Compass,
  Check,
  Star,
  Loader2,
  Plus,
  Pencil,
  X,
  ShieldCheck,
  FileText,
  Save
} from 'lucide-react';
import {
  PostingData,
  SellerValidationErrors,
  isValidVNPhone,
  isValidEmail,
  isCompanyRequired
} from './wizard/PostingDataTypes';
import { Step5SellerInfo } from './wizard/Step5SellerInfo';
import { Step6ReviewPublish } from './wizard/Step6ReviewPublish';
import { PublishSuccessView } from './wizard/PublishSuccessView';

/**
 * Hàm nén và đọc file ảnh sang DataURL (JPEG chất lượng cao, tối đa 1600px)
 */
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
      <div className="h-[380px] bg-gray-100 dark:bg-gray-700 rounded-2xl animate-pulse flex items-center justify-center">
        <p className="text-gray-400 text-sm">Đang tải bản đồ...</p>
      </div>
    )
  }
);

const HANOI_DISTRICTS = [
  'Đống Đa',
  'Hoàn Kiếm',
  'Cầu Giấy',
  'Tây Hồ',
  'Long Biên',
  'Nam Từ Liêm',
  'Ba Đình',
  'Thanh Xuân',
  'Hai Bà Trưng',
  'Hà Đông',
  'Hoàng Mai',
];

export const CreateListingWizard: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const { user, listings, addNewListing, updateListing, addToast } = useApp();

  const editId = searchParams?.get('editId') || searchParams?.get('id');
  const isEditMode = Boolean(editId);

  // Step state (1 to 6)
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
  const [isCommitted, setIsCommitted] = useState(false);
  const [sellerErrors, setSellerErrors] = useState<SellerValidationErrors>({});

  const [pickedLocation, setPickedLocation] = useState<LocationData | null>({
    lat: 21.0315,
    lng: 105.7825,
    displayName: 'Phố Duy Tân, Cầu Giấy, Hà Nội',
    district: 'Cầu Giấy',
    ward: 'Dịch Vọng Hậu',
    road: 'Duy Tân',
    houseNumber: '18',
  });

  // UNIFIED POSTING DATA STATE DÙNG CHUNG CHO TOÀN BỘ FLOW (STEP 1 ĐẾN STEP 6)
  const [postingData, setPostingData] = useState<PostingData>(() => {
    if (typeof window !== 'undefined' && !isEditMode) {
      try {
        const cached = localStorage.getItem('listing_wizard_draft');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && parsed.propertyType && parsed.seller) {
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
        street: 'Duy Tân',
        addressNumber: 'Số 18',
        lat: 21.0315,
        lng: 105.7825,
        displayName: 'Phố Duy Tân, Cầu Giấy, Hà Nội',
      },
      images: [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80',
      ],
      price: 8500000000,
      area: 75,
      floors: 5,
      bedrooms: 4,
      bathrooms: 3,
      direction: 'Đông Nam',
      legalStatus: 'Sổ đỏ chính chủ',
      title: '',
      description: '',

      seller: {
        fullName: 'Nguyễn Văn A',
        phone: '0912 345 678',
        email: '',
        sellerType: 'Chính chủ',
        companyName: '',
        contactAddress: '',
        showPhone: true,
        allowEmailContact: true,
        showCompany: false,
        isPhoneVerified: false,
      },

      status: 'pending',
    };
  });

  // Nếu là edit mode: load dữ liệu của tin cần chỉnh sửa
  useEffect(() => {
    if (editId && listings.length > 0) {
      const existing = listings.find((l) => l.id === editId);
      if (existing) {
        setPostingData({
          propertyType: (existing.propertyType || existing.type || 'house') as any,
          location: {
            district: existing.district || 'Cầu Giấy',
            ward: existing.ward || '',
            street: existing.address || '',
            addressNumber: '',
            lat: existing.lat || 21.0315,
            lng: existing.lng || 105.7825,
            displayName: existing.address || '',
          },
          images: existing.images && existing.images.length > 0 ? existing.images : [],
          price: existing.price,
          area: existing.area,
          floors: existing.floors || 1,
          bedrooms: existing.bedrooms || 1,
          bathrooms: existing.bathrooms || 1,
          direction: existing.direction || 'Đông Nam',
          legalStatus: existing.legalStatus || 'Sổ đỏ chính chủ',
          title: existing.title || '',
          description: existing.description || '',
          seller: {
            fullName: existing.seller?.fullName || existing.authorName || user?.name || 'Chủ nhà',
            phone: existing.seller?.phone || existing.authorPhone || user?.phone || '0912 345 678',
            email: existing.seller?.email || existing.authorEmail || user?.email || '',
            sellerType: (existing.seller?.sellerType || (existing as any).sellerType || 'Chính chủ') as any,
            companyName: existing.seller?.companyName || (existing as any).companyName || '',
            contactAddress: existing.seller?.contactAddress || (existing as any).contactAddress || '',
            showPhone: true,
            allowEmailContact: true,
            showCompany: Boolean(existing.seller?.companyName || (existing as any).companyName),
            isPhoneVerified: true,
          },
          status: existing.status,
        });
        setPickedLocation({
          lat: existing.lat || 21.0315,
          lng: existing.lng || 105.7825,
          displayName: existing.address || '',
          district: existing.district || '',
          ward: existing.ward || '',
          road: '',
          houseNumber: '',
        });
      }
    }
  }, [editId, listings]);

  // Tự động điền email và thông tin tài khoản nếu user đã đăng nhập (chỉ khi không phải edit)
  useEffect(() => {
    if (user && !editId) {
      setPostingData((prev) => ({
        ...prev,
        seller: {
          ...prev.seller,
          fullName:
            prev.seller.fullName === 'Nguyễn Văn A' && user.name
              ? user.name
              : prev.seller.fullName,
          email: !prev.seller.email && user.email ? user.email : prev.seller.email,
          phone:
            prev.seller.phone === '0912 345 678' && user.phone
              ? user.phone
              : prev.seller.phone,
          isPhoneVerified: Boolean(user.phone) || prev.seller.isPhoneVerified,
        },
      }));
    }
  }, [user, editId]);

  // Lưu tự động dữ liệu vào localStorage để không bị mất khi refresh hay chuyển bước (chỉ khi tạo mới)
  useEffect(() => {
    if (typeof window !== 'undefined' && !publishedListingId && !editId) {
      try {
        localStorage.setItem('listing_wizard_draft', JSON.stringify(postingData));
      } catch {}
    }
  }, [postingData, publishedListingId, editId]);

  const propertyTypes = [
    { id: 'house', title: 'Nhà phố / Nhà riêng', icon: Home, desc: 'Nhà liền kề, nhà phân lô, nhà mặt ngõ ô tô' },
    { id: 'apartment', title: 'Chung cư cao cấp', icon: Building2, desc: 'Căn hộ chung cư, Penthouse, Duplex' },
    { id: 'land', title: 'Đất nền / Đất thổ cư', icon: Trees, desc: 'Đất phân lô đấu giá, đất sổ đỏ xây tự do' },
    { id: 'villa', title: 'Biệt thự / Shophouse', icon: Landmark, desc: 'Biệt thự đơn lập, song lập, nhà thương mại' },
  ];

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Validate form Step 5
  const validateStep5 = (): boolean => {
    const errors: SellerValidationErrors = {};
    const seller = postingData.seller;

    // Họ tên: không để trống, tối thiểu 2 ký tự
    if (!seller.fullName || seller.fullName.trim().length < 2) {
      errors.fullName = 'Họ và tên không được để trống và tối thiểu 2 ký tự';
    }

    // Số điện thoại: không để trống, đúng format VN
    if (!seller.phone || !seller.phone.trim()) {
      errors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!isValidVNPhone(seller.phone)) {
      errors.phone = 'Số điện thoại không hợp lệ (VD: 0912 345 678)';
    }

    // Email: nếu có nhập thì kiểm tra format
    if (seller.email && seller.email.trim() && !isValidEmail(seller.email)) {
      errors.email = 'Email không đúng định dạng (VD: example@email.com)';
    }

    // Loại người đăng: bắt buộc chọn
    if (!seller.sellerType) {
      errors.sellerType = 'Vui lòng chọn loại người đăng';
    }

    // Tên công ty: bắt buộc nếu là Môi giới / Sàn / Chủ đầu tư
    if (isCompanyRequired(seller.sellerType)) {
      if (!seller.companyName || !seller.companyName.trim()) {
        errors.companyName = `Vui lòng nhập tên công ty hoặc sàn giao dịch cho ${seller.sellerType}`;
      }
    }

    setSellerErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const clearSellerError = (field: keyof SellerValidationErrors) => {
    setSellerErrors((prev) => {
      const updated = { ...prev };
      delete updated[field];
      return updated;
    });
  };

  // Điều hướng Tiếp theo
  const handleNext = () => {
    if (currentStep === 2 && !postingData.location.street && !pickedLocation) {
      addToast('Vui lòng ghim vị trí hoặc nhập tên đường / phố', 'warning');
      return;
    }
    if (currentStep === 3 && postingData.images.length === 0) {
      addToast('Vui lòng tải lên ít nhất 1 hình ảnh của bất động sản', 'warning');
      return;
    }
    if (currentStep === 4 && (!postingData.price || !postingData.area)) {
      addToast('Vui lòng nhập giá bán và diện tích', 'warning');
      return;
    }
    if (currentStep === 5) {
      const isValid = validateStep5();
      if (!isValid) {
        addToast('Vui lòng kiểm tra và hoàn thiện các trường thông tin bắt buộc', 'warning');
        return;
      }
    }

    setCurrentStep((prev) => Math.min(6, prev + 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Điều hướng Quay lại
  const handleBack = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Upload ảnh
  const handleFiles = async (fileList: FileList | File[]) => {
    const files = Array.from(fileList);
    if (!files.length) return;

    const MAX_IMAGES = 20;
    const remainingSlots = MAX_IMAGES - postingData.images.length;

    if (remainingSlots <= 0) {
      addToast(`Đã đạt giới hạn tối đa ${MAX_IMAGES} ảnh. Hãy xóa bớt ảnh trước khi thêm mới.`, 'warning');
      return;
    }

    const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const validFiles: File[] = [];

    for (const file of files) {
      if (!validImageTypes.includes(file.type.toLowerCase()) && !file.type.startsWith('image/')) {
        addToast(`File "${file.name}" không phải định dạng ảnh (JPG, PNG, WEBP)`, 'warning');
        continue;
      }
      if (file.size > 10 * 1024 * 1024) {
        addToast(`Ảnh "${file.name}" vượt quá dung lượng tối đa 10MB`, 'error');
        continue;
      }
      validFiles.push(file);
    }

    if (!validFiles.length) return;

    const filesToProcess = validFiles.slice(0, remainingSlots);
    if (validFiles.length > remainingSlots) {
      addToast(`Chỉ có thể tải thêm ${remainingSlots} ảnh (giới hạn tối đa 20 ảnh)`, 'info');
    }

    setIsUploading(true);
    try {
      const processedUrls: string[] = [];
      for (const file of filesToProcess) {
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
        addToast(`🎉 Đã tải lên thành công ${processedUrls.length} ảnh!`, 'success');
      }
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleSetCoverImage = (index: number) => {
    if (index === 0) return;
    setPostingData((prev) => {
      const updated = [...prev.images];
      const [cover] = updated.splice(index, 1);
      updated.unshift(cover);
      return { ...prev, images: updated };
    });
    addToast('⭐ Đã đổi ảnh đại diện thành công!', 'success');
  };

  const handleClearAllImages = () => {
    setPostingData((prev) => ({ ...prev, images: [] }));
    addToast('Đã xóa tất cả ảnh', 'info');
  };

  const handleAddSampleImage = () => {
    const samples = [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80',
    ];
    const randomImg = samples[Math.floor(Math.random() * samples.length)];
    if (postingData.images.length < 20) {
      setPostingData((prev) => ({ ...prev, images: [...prev.images, randomImg] }));
      addToast('Đã thêm 1 hình ảnh mẫu', 'info');
    }
  };

  const handleDeleteImage = (index: number) => {
    setPostingData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Lưu nháp (Lưu dữ liệu hiện tại, status = draft, không xuất bản tin)
  const handleSaveDraft = async () => {
    try {
      const draftData: PostingData = {
        ...postingData,
        status: 'draft',
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('listing_wizard_draft', JSON.stringify(draftData));
      }
      setPostingData(draftData);
      addToast('💾 Đã lưu nháp tin đăng thành công! Bạn có thể tiếp tục bất cứ lúc nào.', 'success');
    } catch {
      addToast('Có lỗi xảy ra khi lưu nháp', 'error');
    }
  };

  // Xuất bản tin (Validate Step 1-5, tạo tin với status: 'pending' chờ admin duyệt)
  const handleSubmitListing = async () => {
    if (isSubmitting) return;

    if (!isCommitted) {
      addToast('Vui lòng tích chọn cam kết tính chính xác trước khi xuất bản', 'warning');
      return;
    }

    if (!postingData.location.street && !pickedLocation) {
      addToast('Vui lòng kiểm tra lại địa chỉ ở Bước 2', 'warning');
      setCurrentStep(2);
      return;
    }
    if (postingData.images.length === 0) {
      addToast('Vui lòng tải lên ít nhất 1 ảnh ở Bước 3', 'warning');
      setCurrentStep(3);
      return;
    }
    if (!postingData.price || !postingData.area) {
      addToast('Vui lòng kiểm tra lại giá bán và diện tích ở Bước 4', 'warning');
      setCurrentStep(4);
      return;
    }
    if (!validateStep5()) {
      addToast('Vui lòng hoàn thiện thông tin người đăng ở Bước 5', 'warning');
      setCurrentStep(5);
      return;
    }

    setIsSubmitting(true);
    try {
      const fullAddress = `${postingData.location.addressNumber ? `${postingData.location.addressNumber} ` : ''}${postingData.location.street}, ${postingData.location.ward}, ${postingData.location.district}, Hà Nội`;
      const finalTitle =
        postingData.title ||
        `Bán ${propertyTypes.find((t) => t.id === postingData.propertyType)?.title || 'BĐS'} ${postingData.area}m² tại ${postingData.location.district}`;

      let resultId = editId;

      if (isEditMode && editId) {
        // CẬP NHẬT TIN ĐĂNG HIỆN TẠI (SECTION 11 & SECTION 12)
        // Không tạo duplicate listing, giữ nguyên ID, kiểm tra đưa về pending nếu sửa trường quan trọng
        const updated = await updateListing(editId, {
          title: finalTitle,
          description: postingData.description,
          type: postingData.propertyType,
          propertyType: postingData.propertyType,
          price: postingData.price,
          area: postingData.area,
          pricePerM2: Math.round(postingData.price / (postingData.area || 1)),
          floors: postingData.floors,
          bedrooms: postingData.bedrooms,
          bathrooms: postingData.bathrooms,
          direction: postingData.direction,
          legalStatus: postingData.legalStatus,
          address: fullAddress,
          district: postingData.location.district,
          ward: postingData.location.ward,
          lat: postingData.location.lat,
          lng: postingData.location.lng,
          images: postingData.images,
          authorName: postingData.seller.fullName,
          authorPhone: postingData.seller.phone,
          authorEmail: postingData.seller.email || undefined,
          seller: {
            fullName: postingData.seller.fullName,
            phone: postingData.seller.phone,
            email: postingData.seller.email,
            sellerType: postingData.seller.sellerType,
            companyName: postingData.seller.companyName,
            contactAddress: postingData.seller.contactAddress,
          },
          sellerType: postingData.seller.sellerType,
          companyName: postingData.seller.companyName,
          contactAddress: postingData.seller.contactAddress,
          showPhone: postingData.seller.showPhone,
          allowEmailContact: postingData.seller.allowEmailContact,
          showCompany: postingData.seller.showCompany,
          isPhoneVerified: postingData.seller.isPhoneVerified,
        });

        if (updated?.status === 'pending') {
          addToast('🔄 Tin đã cập nhật và gửi tới Admin kiểm duyệt lại do thay đổi thông tin quan trọng!', 'info');
        } else {
          addToast('🎉 Đã cập nhật tin đăng thành công!', 'success');
        }
      } else {
        // TẠO TIN ĐĂNG MỚI (SECTION 4 & SECTION 5)
        const newId = await addNewListing({
          title: finalTitle,
          description: postingData.description,
          type: postingData.propertyType,
          propertyType: postingData.propertyType,
          price: postingData.price,
          area: postingData.area,
          pricePerM2: Math.round(postingData.price / (postingData.area || 1)),
          floors: postingData.floors,
          bedrooms: postingData.bedrooms,
          bathrooms: postingData.bathrooms,
          direction: postingData.direction,
          legalStatus: postingData.legalStatus,
          address: fullAddress,
          district: postingData.location.district,
          ward: postingData.location.ward,
          lat: postingData.location.lat,
          lng: postingData.location.lng,
          images: postingData.images,
          authorName: postingData.seller.fullName,
          authorPhone: postingData.seller.phone,
          authorEmail: postingData.seller.email || undefined,
          status: 'pending', // Luôn ở trạng thái Chờ duyệt ban đầu
          seller: {
            fullName: postingData.seller.fullName,
            phone: postingData.seller.phone,
            email: postingData.seller.email,
            sellerType: postingData.seller.sellerType,
            companyName: postingData.seller.companyName,
            contactAddress: postingData.seller.contactAddress,
          },
          sellerType: postingData.seller.sellerType,
          companyName: postingData.seller.companyName,
          contactAddress: postingData.seller.contactAddress,
          showPhone: postingData.seller.showPhone,
          allowEmailContact: postingData.seller.allowEmailContact,
          showCompany: postingData.seller.showCompany,
          isPhoneVerified: postingData.seller.isPhoneVerified,
        });
        resultId = newId;
        addToast('🎉 Đăng tin thành công! Tin đang chờ hệ thống kiểm duyệt.', 'success');
      }

      if (typeof window !== 'undefined') {
        try {
          localStorage.removeItem('listing_wizard_draft');
        } catch {}
      }

      setPublishedListingId(resultId || 'lst_' + Date.now());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      console.error('Error publishing/updating listing:', e);
      addToast('Có lỗi xảy ra khi lưu tin đăng', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8">
      
      {/* 1. THANH TIẾN ĐỘ 6 BƯỚC CHUẨN */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          {[
            { step: 1, label: 'Loại hình' },
            { step: 2, label: 'Vị trí' },
            { step: 3, label: 'Hình ảnh' },
            { step: 4, label: 'Giá & Thông số' },
            { step: 5, label: 'Thông tin người đăng' },
            { step: 6, label: 'Kiểm tra & xuất bản' },
          ].map((item) => {
            const isCompleted = publishedListingId !== null || currentStep > item.step;
            const isCurrent = publishedListingId === null && currentStep === item.step;

            return (
              <div key={item.step} className="flex flex-col items-center">
                <motion.div
                  animate={{
                    scale: isCurrent ? 1.15 : 1,
                  }}
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold transition-all shadow-sm ${
                    isCompleted
                      ? 'bg-success text-white'
                      : isCurrent
                      ? 'bg-accent text-white ring-4 ring-accent/20'
                      : 'bg-slate-200 text-text-muted'
                  }`}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : item.step}
                </motion.div>
                <span
                  className={`text-[11px] font-bold mt-1.5 hidden sm:block ${
                    isCurrent ? 'text-accent' : isCompleted ? 'text-text-primary' : 'text-text-muted'
                  }`}
                >
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Progress Bar Track:
            - Step 4: ~67%
            - Step 5: ~80%
            - Step 6 / Published: 100%
        */}
        <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
          <motion.div
            className="h-full bg-accent"
            animate={{
              width:
                publishedListingId !== null || currentStep === 6
                  ? '100%'
                  : currentStep === 5
                  ? '80%'
                  : `${Math.round((currentStep / 6) * 100)}%`,
            }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Main Wizard Form Card */}
      <div className="rounded-3xl border border-border bg-white p-6 sm:p-10 shadow-xl min-h-[460px] flex flex-col justify-between">
        
        {/* HIỂN THỊ KẾT QUẢ XUẤT BẢN THÀNH CÔNG (STEP 6 SUCCESS STATE) */}
        {publishedListingId !== null ? (
          <PublishSuccessView listingId={publishedListingId} data={postingData} />
        ) : (
          <AnimatePresence mode="wait">
            
            {/* STEP 1: Property Type Selection */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-lg font-extrabold text-text-primary">Bước 1: Chọn loại hình bất động sản</h2>
                  <p className="text-xs text-text-secondary mt-1">Lựa chọn đúng phân khúc để tiếp cận khách hàng tìm kiếm chính xác</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {propertyTypes.map((type) => {
                    const Icon = type.icon;
                    const isSelected = postingData.propertyType === type.id;
                    return (
                      <motion.div
                        key={type.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() =>
                          setPostingData((prev) => ({
                            ...prev,
                            propertyType: type.id as any,
                          }))
                        }
                        className={`relative cursor-pointer rounded-2xl border-2 p-5 transition-all ${
                          isSelected
                            ? 'border-accent bg-orange-50/40 shadow-md ring-2 ring-accent/20'
                            : 'border-border bg-page-bg opacity-75 hover:opacity-100 hover:border-slate-300'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-white shadow-sm">
                            <Check className="h-3.5 w-3.5" />
                          </div>
                        )}
                        <div className="flex items-center gap-3.5">
                          <div
                            className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                              isSelected ? 'bg-accent text-white' : 'bg-white text-text-secondary'
                            } shadow-sm`}
                          >
                            <Icon className="h-6 w-6" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-text-primary">{type.title}</h4>
                            <p className="text-[11px] text-text-secondary mt-0.5">{type.desc}</p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* STEP 2: Address & Location Pin */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-lg font-extrabold text-text-primary">Bước 2: Địa chỉ & Vị trí trên bản đồ</h2>
                  <p className="text-xs text-text-secondary mt-1">Định vị chính xác để người mua dễ dàng tra cứu quy hoạch phân khu và tiện ích lân cận</p>
                </div>

                {/* Interactive Leaflet Map Pin Picker */}
                <div>
                  <label className="text-sm font-semibold text-navy dark:text-white mb-1.5 block">
                    📍 Chọn vị trí trên bản đồ
                    <span className="text-orange-500 ml-1">*</span>
                  </label>
                  <p className="text-xs text-gray-500 mb-3">
                    Nhấp vào bản đồ hoặc tìm kiếm địa chỉ để gắn pin vị trí BĐS chính xác
                  </p>
                  <LocationPicker
                    value={pickedLocation}
                    onChange={(loc) => {
                      setPickedLocation(loc);
                      if (loc) {
                        const cleanDistrict = loc.district ? loc.district.replace(/^(Quận|Huyện|Thị xã)\s+/i, '').trim() : '';
                        const matchedDistrict = HANOI_DISTRICTS.find(d => d.toLowerCase() === cleanDistrict.toLowerCase()) || loc.district;
                        setPostingData((prev) => ({
                          ...prev,
                          location: {
                            ...prev.location,
                            district: matchedDistrict || prev.location.district,
                            ward: loc.ward || prev.location.ward,
                            street: loc.road || prev.location.street,
                            addressNumber: loc.houseNumber ? `Số ${loc.houseNumber}` : prev.location.addressNumber,
                            lat: loc.lat,
                            lng: loc.lng,
                            displayName: loc.displayName || prev.location.displayName,
                          },
                        }));
                        addToast('📍 Đã cập nhật toạ độ & địa chỉ BĐS chính xác', 'success');
                      }
                    }}
                    height="380px"
                  />
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                  <span className="text-xs text-gray-400">hoặc kiểm tra & điều chỉnh chi tiết bên dưới</span>
                  <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                </div>

                {/* Address Form Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-text-primary">Quận / Huyện *</label>
                    <select
                      value={postingData.location.district}
                      onChange={(e) => {
                        const newDistrict = e.target.value;
                        const districtCenter = HANOI_DISTRICT_COORDINATES[newDistrict];
                        setPostingData((prev) => ({
                          ...prev,
                          location: {
                            ...prev.location,
                            district: newDistrict,
                            lat: districtCenter ? districtCenter.lat : prev.location.lat,
                            lng: districtCenter ? districtCenter.lng : prev.location.lng,
                          },
                        }));
                        if (districtCenter) {
                          setPickedLocation({
                            lat: districtCenter.lat,
                            lng: districtCenter.lng,
                            displayName: `Quận ${newDistrict}, Hà Nội`,
                            district: newDistrict,
                            ward: '',
                            road: '',
                            houseNumber: '',
                          });
                        }
                      }}
                      className="mt-1 w-full rounded-xl border border-input bg-page-bg p-3 text-xs font-bold text-text-primary focus:border-accent focus:bg-white focus:outline-none"
                    >
                      {HANOI_DISTRICTS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-text-primary">Phường / Xã</label>
                    <input
                      type="text"
                      value={postingData.location.ward}
                      onChange={(e) =>
                        setPostingData((prev) => ({
                          ...prev,
                          location: { ...prev.location, ward: e.target.value },
                        }))
                      }
                      placeholder="VD: Dịch Vọng Hậu"
                      className="mt-1 w-full rounded-xl border border-input bg-page-bg p-3 text-xs font-semibold focus:border-accent focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-text-primary">Tên đường / Phố *</label>
                    <input
                      type="text"
                      required
                      value={postingData.location.street}
                      onChange={(e) =>
                        setPostingData((prev) => ({
                          ...prev,
                          location: { ...prev.location, street: e.target.value },
                        }))
                      }
                      placeholder="VD: Phố Duy Tân"
                      className="mt-1 w-full rounded-xl border border-input bg-page-bg p-3 text-xs font-semibold focus:border-accent focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-text-primary">Số nhà / Ngõ ngách</label>
                    <input
                      type="text"
                      value={postingData.location.addressNumber}
                      onChange={(e) =>
                        setPostingData((prev) => ({
                          ...prev,
                          location: { ...prev.location, addressNumber: e.target.value },
                        }))
                      }
                      placeholder="VD: Số 18, Ngõ 72"
                      className="mt-1 w-full rounded-xl border border-input bg-page-bg p-3 text-xs font-semibold focus:border-accent focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Image Upload */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-extrabold text-text-primary">Bước 3: Tải ảnh bất động sản</h2>
                    <p className="text-xs text-text-secondary mt-1">Tin đăng có từ 3 ảnh trở lên nhận được gấp 4 lần lượt liên hệ</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {postingData.images.length > 0 && (
                      <button
                        type="button"
                        onClick={handleClearAllImages}
                        className="text-xs font-semibold text-red-500 hover:text-red-600 px-2 py-1 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        Xóa tất cả
                      </button>
                    )}
                    <span
                      className={`rounded-lg px-3 py-1 text-xs font-bold ${
                        postingData.images.length >= 3
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                          : 'bg-slate-100 text-text-secondary'
                      }`}
                    >
                      {postingData.images.length} / 20 ảnh
                    </span>
                  </div>
                </div>

                {/* Hidden File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={handleFileInputChange}
                  className="hidden"
                />

                {/* Drag Drop Zone */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsDragging(true);
                  }}
                  onDragEnter={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsDragging(true);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsDragging(false);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsDragging(false);
                    if (e.dataTransfer.files?.length) {
                      handleFiles(e.dataTransfer.files);
                    }
                  }}
                  className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
                    isDragging
                      ? 'border-accent bg-accent/15 scale-[1.01] ring-4 ring-accent/20'
                      : 'border-accent/60 bg-orange-50/20 hover:bg-orange-50/40 hover:border-accent'
                  }`}
                >
                  {isUploading ? (
                    <div className="py-4">
                      <Loader2 className="h-10 w-10 text-accent mx-auto mb-2 animate-spin" />
                      <p className="text-xs font-bold text-accent">Đang xử lý tải ảnh từ máy tính...</p>
                      <p className="text-[11px] text-text-muted mt-1">Đang tối ưu dung lượng và chất lượng hiển thị</p>
                    </div>
                  ) : (
                    <>
                      <UploadCloud
                        className={`h-10 w-10 mx-auto mb-2 transition-transform duration-200 ${
                          isDragging ? 'text-accent scale-125' : 'text-accent'
                        }`}
                      />
                      <p className="text-xs font-bold text-text-primary">
                        {isDragging ? 'Thả ảnh vào đây để tải lên ngay!' : 'Kéo thả ảnh vào đây hoặc bấm để chọn ảnh'}
                      </p>
                      <p className="text-[11px] text-text-muted mt-1">Hỗ trợ định dạng JPG, PNG, WEBP tối đa 10MB/ảnh (chọn được nhiều ảnh)</p>

                      <div className="mt-4 flex items-center justify-center gap-3">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            fileInputRef.current?.click();
                          }}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-accent-hover hover:shadow-lg transition-all"
                        >
                          <Plus className="h-4 w-4" />
                          Tải ảnh từ máy tính
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddSampleImage();
                          }}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-white px-3 py-2 text-xs font-semibold text-text-secondary hover:bg-slate-50 hover:text-text-primary transition-colors"
                        >
                          + Thêm ảnh mẫu
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {/* Thumbnails preview grid */}
                {postingData.images.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-text-muted">
                      <span>Di chuột vào ảnh để đặt làm ảnh đại diện hoặc xóa ảnh</span>
                      <span>Ảnh đầu tiên là ảnh đại diện hiển thị ngoài danh sách</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {postingData.images.map((imgUrl, idx) => (
                        <div
                          key={idx}
                          className={`relative aspect-video rounded-xl overflow-hidden border group bg-slate-100 transition-all ${
                            idx === 0 ? 'ring-2 ring-accent border-accent' : 'border-border hover:border-accent/60'
                          }`}
                        >
                          <img src={imgUrl} alt={`preview-${idx}`} className="h-full w-full object-cover" />

                          <span className="absolute bottom-1.5 left-1.5 rounded bg-black/60 backdrop-blur-xs px-1.5 py-0.5 text-[9px] font-bold text-white">
                            #{idx + 1}
                          </span>

                          {idx === 0 ? (
                            <span className="absolute top-1.5 left-1.5 inline-flex items-center gap-1 rounded bg-accent px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
                              <Star className="h-3 w-3 fill-white" />
                              Ảnh đại diện
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSetCoverImage(idx)}
                              className="absolute top-1.5 left-1.5 inline-flex items-center gap-1 rounded bg-black/70 hover:bg-accent px-2 py-0.5 text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                              title="Đặt làm ảnh đại diện"
                            >
                              <Star className="h-3 w-3" />
                              Đặt làm đại diện
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleDeleteImage(idx)}
                            className="absolute top-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-md bg-red-600 hover:bg-red-700 text-white opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                            title="Xóa ảnh này"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* STEP 4: Price & Specs */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
              >
                <div>
                  <h2 className="text-lg font-extrabold text-text-primary">Bước 4: Giá bán & Thông số chi tiết</h2>
                  <p className="text-xs text-text-secondary mt-1">Hệ thống sẽ tự động tính đơn giá / m² và phân tích định giá</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Price */}
                  <div>
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-text-primary">Mức giá chào bán (VNĐ) *</label>
                      <span className="text-xs font-black text-accent">{formatCurrencyVND(postingData.price)}</span>
                    </div>
                    <input
                      type="number"
                      value={postingData.price}
                      step={100000000}
                      onChange={(e) =>
                        setPostingData((prev) => ({
                          ...prev,
                          price: Number(e.target.value),
                        }))
                      }
                      className="mt-1 w-full rounded-xl border border-input bg-page-bg p-3 text-xs font-bold focus:border-accent focus:bg-white focus:outline-none"
                    />
                  </div>

                  {/* Area */}
                  <div>
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-text-primary">Diện tích sử dụng (m²) *</label>
                      <span className="text-xs font-bold text-text-secondary">
                        Đơn giá: {formatPricePerM2(postingData.price, postingData.area)}
                      </span>
                    </div>
                    <input
                      type="number"
                      value={postingData.area}
                      onChange={(e) =>
                        setPostingData((prev) => ({
                          ...prev,
                          area: Number(e.target.value),
                        }))
                      }
                      className="mt-1 w-full rounded-xl border border-input bg-page-bg p-3 text-xs font-bold focus:border-accent focus:bg-white focus:outline-none"
                    />
                  </div>

                  {/* Floors */}
                  <div>
                    <label className="text-xs font-bold text-text-primary">Số tầng</label>
                    <input
                      type="number"
                      value={postingData.floors}
                      onChange={(e) =>
                        setPostingData((prev) => ({
                          ...prev,
                          floors: Number(e.target.value),
                        }))
                      }
                      className="mt-1 w-full rounded-xl border border-input bg-page-bg p-3 text-xs font-bold focus:border-accent focus:bg-white focus:outline-none"
                    />
                  </div>

                  {/* Bedrooms & Bathrooms */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-bold text-text-primary">Phòng ngủ</label>
                      <input
                        type="number"
                        value={postingData.bedrooms}
                        onChange={(e) =>
                          setPostingData((prev) => ({
                            ...prev,
                            bedrooms: Number(e.target.value),
                          }))
                        }
                        className="mt-1 w-full rounded-xl border border-input bg-page-bg p-3 text-xs font-bold focus:border-accent focus:bg-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-text-primary">Phòng tắm</label>
                      <input
                        type="number"
                        value={postingData.bathrooms}
                        onChange={(e) =>
                          setPostingData((prev) => ({
                            ...prev,
                            bathrooms: Number(e.target.value),
                          }))
                        }
                        className="mt-1 w-full rounded-xl border border-input bg-page-bg p-3 text-xs font-bold focus:border-accent focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Direction */}
                  <div>
                    <label className="text-xs font-bold text-text-primary">Hướng chính</label>
                    <select
                      value={postingData.direction}
                      onChange={(e) =>
                        setPostingData((prev) => ({
                          ...prev,
                          direction: e.target.value,
                        }))
                      }
                      className="mt-1 w-full rounded-xl border border-input bg-page-bg p-3 text-xs font-bold focus:border-accent focus:bg-white focus:outline-none"
                    >
                      <option value="Đông">Đông</option>
                      <option value="Tây">Tây</option>
                      <option value="Nam">Nam</option>
                      <option value="Bắc">Bắc</option>
                      <option value="Đông Nam">Đông Nam</option>
                      <option value="Đông Bắc">Đông Bắc</option>
                      <option value="Tây Nam">Tây Nam</option>
                      <option value="Tây Bắc">Tây Bắc</option>
                    </select>
                  </div>

                  {/* Legal Status */}
                  <div>
                    <label className="text-xs font-bold text-text-primary">Tình trạng pháp lý</label>
                    <input
                      type="text"
                      value={postingData.legalStatus}
                      onChange={(e) =>
                        setPostingData((prev) => ({
                          ...prev,
                          legalStatus: e.target.value,
                        }))
                      }
                      placeholder="VD: Sổ đỏ chính chủ"
                      className="mt-1 w-full rounded-xl border border-input bg-page-bg p-3 text-xs font-bold focus:border-accent focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* Title & Description */}
                <div>
                  <label className="text-xs font-bold text-text-primary">Tiêu đề tin đăng</label>
                  <input
                    type="text"
                    value={postingData.title}
                    onChange={(e) =>
                      setPostingData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    placeholder="VD: Bán nhà phân lô Duy Tân Cầu Giấy 75m2 5 tầng ô tô tránh..."
                    className="mt-1 w-full rounded-xl border border-input bg-page-bg p-3 text-xs font-semibold focus:border-accent focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-text-primary">Mô tả chi tiết</label>
                  <textarea
                    rows={3}
                    value={postingData.description}
                    onChange={(e) =>
                      setPostingData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Mô tả ưu điểm vị trí, tiện ích, nội thất..."
                    className="mt-1 w-full rounded-xl border border-input bg-page-bg p-3 text-xs font-medium focus:border-accent focus:bg-white focus:outline-none"
                  />
                </div>
              </motion.div>
            )}

            {/* STEP 5: Thông tin người đăng (NEW STEP!) */}
            {currentStep === 5 && (
              <Step5SellerInfo
                seller={postingData.seller}
                onChange={(updated) =>
                  setPostingData((prev) => ({
                    ...prev,
                    seller: { ...prev.seller, ...updated },
                  }))
                }
                errors={sellerErrors}
                clearError={clearSellerError}
                onVerifyPhoneSuccess={() => {
                  addToast('✓ Số điện thoại đã xác thực thành công!', 'success');
                }}
              />
            )}

            {/* STEP 6: Kiểm tra & xuất bản (UPDATED STEP 6!) */}
            {currentStep === 6 && (
              <Step6ReviewPublish
                data={postingData}
                onEditStep={(stepNum) => {
                  setCurrentStep(stepNum);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                isCommitted={isCommitted}
                setIsCommitted={setIsCommitted}
              />
            )}

          </AnimatePresence>
        )}

        {/* Wizard Footer Controls (Ẩn khi đã xuất bản thành công) */}
        {publishedListingId === null && (
          <div className="mt-8 flex items-center justify-between border-t border-border pt-6 gap-3 flex-wrap">
            {/* Nút Quay lại */}
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 1 || isSubmitting}
              className="flex items-center gap-1.5 rounded-xl border border-border bg-page-bg px-4 py-2.5 text-xs font-bold text-text-primary hover:bg-slate-100 disabled:opacity-40 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Quay lại</span>
            </button>

            {/* Cụm nút Tiếp theo / Lưu nháp / Xuất bản */}
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              {currentStep === 6 && (
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 hover:border-slate-400 transition-all disabled:opacity-50"
                  title="Lưu lại bản nháp vào hệ thống"
                >
                  <Save className="h-4 w-4 text-slate-500" />
                  <span>Lưu nháp</span>
                </button>
              )}

              {currentStep < 6 ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-2 rounded-xl bg-accent px-6 py-2.5 text-xs font-extrabold text-white shadow-md shadow-accent/25 hover:bg-accent-hover transition-all"
                >
                  <span>Tiếp theo</span>
                  <ArrowRight className="h-4 w-4" />
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: isSubmitting || !isCommitted ? 1 : 1.03 }}
                  whileTap={{ scale: isSubmitting || !isCommitted ? 1 : 0.97 }}
                  type="button"
                  disabled={isSubmitting || !isCommitted}
                  onClick={handleSubmitListing}
                  className={`flex items-center gap-2 rounded-xl px-7 py-3 text-xs font-black text-white shadow-lg transition-all ${
                    !isCommitted
                      ? 'bg-slate-300 cursor-not-allowed text-slate-500 shadow-none'
                      : isSubmitting
                      ? 'bg-accent/80 cursor-wait shadow-accent/20'
                      : 'bg-accent hover:bg-accent-hover shadow-accent/25'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Đang xuất bản...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Xuất bản tin</span>
                    </>
                  )}
                </motion.button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
