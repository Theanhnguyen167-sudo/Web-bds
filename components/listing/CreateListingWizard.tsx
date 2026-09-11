'use client';

import React, { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/lib/context/AppContext';
import { formatCurrencyVND, formatPricePerM2 } from '@/lib/utils';
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
  Plus
} from 'lucide-react';

/**
 * Hàm nén và đọc file ảnh sang DataURL (JPEG chất lượng cao, tối đa 1600px)
 * Đảm bảo tải mượt mà từ máy tính và hiển thị ngay tức thì
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
      <div className="h-[400px] bg-gray-100 dark:bg-gray-700 rounded-2xl animate-pulse flex items-center justify-center">
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
  const { addNewListing, addToast } = useApp();

  const [currentStep, setCurrentStep] = useState(1);

  const [pickedLocation, setPickedLocation] = useState<LocationData | null>({
    lat: 21.0315,
    lng: 105.7825,
    displayName: 'Phố Duy Tân, Cầu Giấy, Hà Nội',
    district: 'Cầu Giấy',
    ward: 'Dịch Vọng Hậu',
    road: 'Duy Tân',
    houseNumber: '18',
  });

  // Form Data State
  const [formData, setFormData] = useState({
    type: 'house' as 'house' | 'apartment' | 'land' | 'villa',
    title: '',
    district: 'Cầu Giấy',
    ward: 'Dịch Vọng Hậu',
    street: 'Duy Tân',
    addressNumber: 'Số 18',
    lat: 21.0315,
    lng: 105.7825,
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
    description: '',
  });

  const propertyTypes = [
    { id: 'house', title: 'Nhà phố / Nhà riêng', icon: Home, desc: 'Nhà liền kề, nhà phân lô, nhà mặt ngõ ô tô' },
    { id: 'apartment', title: 'Chung cư cao cấp', icon: Building2, desc: 'Căn hộ chung cư, Penthouse, Duplex' },
    { id: 'land', title: 'Đất nền / Đất thổ cư', icon: Trees, desc: 'Đất phân lô đấu giá, đất sổ đỏ xây tự do' },
    { id: 'villa', title: 'Biệt thự / Shophouse', icon: Landmark, desc: 'Biệt thự đơn lập, song lập, nhà thương mại' },
  ];

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleNext = () => {
    if (currentStep === 2 && !formData.street && !pickedLocation) {
      addToast('Vui lòng ghim vị trí hoặc nhập tên đường / phố', 'warning');
      return;
    }
    if (currentStep === 3 && formData.images.length === 0) {
      addToast('Vui lòng tải lên ít nhất 1 hình ảnh của bất động sản', 'warning');
      return;
    }
    if (currentStep === 4 && (!formData.price || !formData.area)) {
      addToast('Vui lòng nhập giá bán và diện tích', 'warning');
      return;
    }
    setCurrentStep((prev) => Math.min(5, prev + 1));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleFiles = async (fileList: FileList | File[]) => {
    const files = Array.from(fileList);
    if (!files.length) return;

    const MAX_IMAGES = 20;
    const remainingSlots = MAX_IMAGES - formData.images.length;

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
      // 10MB limit
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
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, ...processedUrls],
        }));
        addToast(`🎉 Đã tải lên thành công ${processedUrls.length} ảnh từ máy tính!`, 'success');
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
    setFormData((prev) => {
      const updated = [...prev.images];
      const [cover] = updated.splice(index, 1);
      updated.unshift(cover);
      return { ...prev, images: updated };
    });
    addToast('⭐ Đã đổi ảnh đại diện thành công!', 'success');
  };

  const handleClearAllImages = () => {
    setFormData((prev) => ({ ...prev, images: [] }));
    addToast('Đã xóa tất cả ảnh', 'info');
  };

  const handleAddSampleImage = () => {
    const samples = [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80',
    ];
    const randomImg = samples[Math.floor(Math.random() * samples.length)];
    if (formData.images.length < 20) {
      setFormData((prev) => ({ ...prev, images: [...prev.images, randomImg] }));
      addToast('Đã thêm 1 hình ảnh mẫu', 'info');
    }
  };

  const handleDeleteImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmitListing = () => {
    const fullAddress = `${formData.addressNumber} ${formData.street}, ${formData.ward}, ${formData.district}, Hà Nội`;
    const finalTitle =
      formData.title ||
      `Bán ${propertyTypes.find((t) => t.id === formData.type)?.title} ${formData.area}m² tại ${formData.district}`;

    addNewListing({
      ...formData,
      title: finalTitle,
      address: fullAddress,
      pricePerM2: formData.price / formData.area,
    });

    router.push('/dashboard');
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8">
      
      {/* Wizard Step Progress Bar Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          {[
            { step: 1, label: 'Loại hình' },
            { step: 2, label: 'Vị trí' },
            { step: 3, label: 'Hình ảnh' },
            { step: 4, label: 'Giá & Thông số' },
            { step: 5, label: 'Xem trước' },
          ].map((item) => (
            <div key={item.step} className="flex flex-col items-center">
              <motion.div
                animate={{
                  scale: currentStep === item.step ? 1.15 : 1,
                }}
                className={`flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold transition-all shadow-sm ${
                  currentStep > item.step
                    ? 'bg-success text-white'
                    : currentStep === item.step
                    ? 'bg-accent text-white ring-4 ring-accent/20'
                    : 'bg-slate-200 text-text-muted'
                }`}
              >
                {currentStep > item.step ? <Check className="h-4 w-4" /> : item.step}
              </motion.div>
              <span
                className={`text-[11px] font-bold mt-1.5 hidden sm:block ${
                  currentStep === item.step ? 'text-accent' : 'text-text-muted'
                }`}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Progress Bar Track */}
        <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
          <motion.div
            className="h-full bg-accent"
            animate={{ width: `${(currentStep / 5) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Main Wizard Form Card */}
      <div className="rounded-3xl border border-border bg-white p-6 sm:p-10 shadow-xl min-h-[460px] flex flex-col justify-between">
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
                  const isSelected = formData.type === type.id;
                  return (
                    <motion.div
                      key={type.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setFormData({ ...formData, type: type.id as any })}
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
                        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                          isSelected ? 'bg-accent text-white' : 'bg-white text-text-secondary'
                        } shadow-sm`}>
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
                      setFormData(prev => ({
                        ...prev,
                        district: loc.district || prev.district,
                        ward: loc.ward || prev.ward,
                        street: loc.road || prev.street,
                        addressNumber: loc.houseNumber ? `Số ${loc.houseNumber}` : prev.addressNumber,
                        lat: loc.lat,
                        lng: loc.lng,
                      }));
                      addToast('📍 Đã cập nhật toạ độ & địa chỉ BĐS', 'success');
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
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
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
                    value={formData.ward}
                    onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                    placeholder="VD: Dịch Vọng Hậu"
                    className="mt-1 w-full rounded-xl border border-input bg-page-bg p-3 text-xs font-semibold focus:border-accent focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-text-primary">Tên đường / Phố *</label>
                  <input
                    type="text"
                    required
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    placeholder="VD: Phố Duy Tân"
                    className="mt-1 w-full rounded-xl border border-input bg-page-bg p-3 text-xs font-semibold focus:border-accent focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-text-primary">Số nhà / Ngõ ngách</label>
                  <input
                    type="text"
                    value={formData.addressNumber}
                    onChange={(e) => setFormData({ ...formData, addressNumber: e.target.value })}
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
                  {formData.images.length > 0 && (
                    <button
                      type="button"
                      onClick={handleClearAllImages}
                      className="text-xs font-semibold text-red-500 hover:text-red-600 px-2 py-1 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      Xóa tất cả
                    </button>
                  )}
                  <span className={`rounded-lg px-3 py-1 text-xs font-bold ${
                    formData.images.length >= 3 
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' 
                      : 'bg-slate-100 text-text-secondary'
                  }`}>
                    {formData.images.length} / 20 ảnh
                  </span>
                </div>
              </div>

              {/* Hidden File Input for Native File Dialog */}
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
                    <UploadCloud className={`h-10 w-10 mx-auto mb-2 transition-transform duration-200 ${isDragging ? 'text-accent scale-125' : 'text-accent'}`} />
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
                        className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-accent/90 hover:shadow-lg transition-all"
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
              {formData.images.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-text-muted">
                    <span>Di chuột vào ảnh để đặt làm ảnh đại diện hoặc xóa ảnh</span>
                    <span>Ảnh đầu tiên là ảnh đại diện hiển thị ngoài danh sách</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {formData.images.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        className={`relative aspect-video rounded-xl overflow-hidden border group bg-slate-100 transition-all ${
                          idx === 0 ? 'ring-2 ring-accent border-accent' : 'border-border hover:border-accent/60'
                        }`}
                      >
                        <img src={imgUrl} alt={`preview-${idx}`} className="h-full w-full object-cover" />
                        
                        {/* Number Index Badge */}
                        <span className="absolute bottom-1.5 left-1.5 rounded bg-black/60 backdrop-blur-xs px-1.5 py-0.5 text-[9px] font-bold text-white">
                          #{idx + 1}
                        </span>

                        {/* Cover Image Badge */}
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

                        {/* Delete Button */}
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
                    <span className="text-xs font-black text-accent">{formatCurrencyVND(formData.price)}</span>
                  </div>
                  <input
                    type="number"
                    value={formData.price}
                    step={100000000}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="mt-1 w-full rounded-xl border border-input bg-page-bg p-3 text-xs font-bold focus:border-accent focus:bg-white focus:outline-none"
                  />
                </div>

                {/* Area */}
                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-text-primary">Diện tích sử dụng (m²) *</label>
                    <span className="text-xs font-bold text-text-secondary">
                      Đơn giá: {formatPricePerM2(formData.price, formData.area)}
                    </span>
                  </div>
                  <input
                    type="number"
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: Number(e.target.value) })}
                    className="mt-1 w-full rounded-xl border border-input bg-page-bg p-3 text-xs font-bold focus:border-accent focus:bg-white focus:outline-none"
                  />
                </div>

                {/* Floors */}
                <div>
                  <label className="text-xs font-bold text-text-primary">Số tầng</label>
                  <input
                    type="number"
                    value={formData.floors}
                    onChange={(e) => setFormData({ ...formData, floors: Number(e.target.value) })}
                    className="mt-1 w-full rounded-xl border border-input bg-page-bg p-3 text-xs font-bold focus:border-accent focus:bg-white focus:outline-none"
                  />
                </div>

                {/* Bedrooms & Bathrooms */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-bold text-text-primary">Phòng ngủ</label>
                    <input
                      type="number"
                      value={formData.bedrooms}
                      onChange={(e) => setFormData({ ...formData, bedrooms: Number(e.target.value) })}
                      className="mt-1 w-full rounded-xl border border-input bg-page-bg p-3 text-xs font-bold focus:border-accent focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-text-primary">Phòng tắm</label>
                    <input
                      type="number"
                      value={formData.bathrooms}
                      onChange={(e) => setFormData({ ...formData, bathrooms: Number(e.target.value) })}
                      className="mt-1 w-full rounded-xl border border-input bg-page-bg p-3 text-xs font-bold focus:border-accent focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* Direction */}
                <div>
                  <label className="text-xs font-bold text-text-primary">Hướng chính</label>
                  <select
                    value={formData.direction}
                    onChange={(e) => setFormData({ ...formData, direction: e.target.value })}
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
                    value={formData.legalStatus}
                    onChange={(e) => setFormData({ ...formData, legalStatus: e.target.value })}
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
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="VD: Bán nhà phân lô Duy Tân Cầu Giấy 75m2 5 tầng ô tô tránh..."
                  className="mt-1 w-full rounded-xl border border-input bg-page-bg p-3 text-xs font-semibold focus:border-accent focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-text-primary">Mô tả chi tiết</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Mô tả ưu điểm vị trí, tiện ích, nội thất..."
                  className="mt-1 w-full rounded-xl border border-input bg-page-bg p-3 text-xs font-medium focus:border-accent focus:bg-white focus:outline-none"
                />
              </div>
            </motion.div>
          )}

          {/* STEP 5: Full Preview & Confirmation */}
          {currentStep === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-lg font-extrabold text-text-primary">Bước 5: Xem trước tin đăng</h2>
                <p className="text-xs text-text-secondary mt-1">Kiểm tra lại toàn bộ thông tin trước khi xuất bản lên nền tảng</p>
              </div>

              {/* Preview Card */}
              <div className="rounded-2xl border border-border bg-page-bg p-5 space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="w-full sm:w-48 shrink-0 space-y-2">
                    <img
                      src={formData.images[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80'}
                      alt="preview"
                      className="w-full aspect-video sm:aspect-square object-cover rounded-xl shadow-sm border border-border"
                    />
                    {formData.images.length > 1 && (
                      <div className="flex gap-1.5 overflow-x-auto pb-1">
                        {formData.images.slice(1, 5).map((img, i) => (
                          <img
                            key={i}
                            src={img}
                            alt={`sub-${i}`}
                            className="h-9 w-9 rounded-lg object-cover border border-border shrink-0"
                          />
                        ))}
                        {formData.images.length > 5 && (
                          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-[10px] font-bold text-text-muted shrink-0">
                            +{formData.images.length - 5}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-accent px-2 py-0.5 text-[10px] font-bold text-white uppercase">
                        {formData.type}
                      </span>
                      <span className="text-xs font-extrabold text-accent">
                        {formatCurrencyVND(formData.price)} ({formatPricePerM2(formData.price, formData.area)})
                      </span>
                    </div>

                    <h3 className="text-sm font-extrabold text-text-primary">
                      {formData.title || `Bán BĐS ${formData.area}m² tại ${formData.district}`}
                    </h3>

                    <p className="text-xs text-text-secondary flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-accent shrink-0" />
                      {formData.addressNumber} {formData.street}, {formData.ward}, {formData.district}, Hà Nội
                    </p>

                    <div className="flex items-center gap-4 text-xs text-text-muted pt-2 border-t border-border">
                      <span>{formData.area} m²</span>
                      <span>{formData.floors} tầng</span>
                      <span>{formData.bedrooms} PN</span>
                      <span>{formData.bathrooms} PT</span>
                      <span>Hướng {formData.direction}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 text-xs text-emerald-800 flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                <span>Tin đăng của bạn sẽ tự động được kết nối với bản đồ quy hoạch phân khu Hà Nội 2030.</span>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

        {/* Wizard Footer Controls */}
        <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="flex items-center gap-1.5 rounded-xl border border-border bg-page-bg px-4 py-2.5 text-xs font-bold text-text-primary hover:bg-slate-100 disabled:opacity-40 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Quay lại</span>
          </button>

          {currentStep < 5 ? (
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
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={handleSubmitListing}
              className="flex items-center gap-2 rounded-xl bg-success px-8 py-3 text-xs font-black text-white shadow-lg shadow-success/25 hover:bg-emerald-600 transition-all"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Xuất bản tin đăng ngay</span>
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
};
