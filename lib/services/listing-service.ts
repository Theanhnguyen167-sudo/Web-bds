/**
 * 🏛️ HANOI REALTY - SHARED LISTING SERVICE (SINGLE SOURCE OF TRUTH)
 * ==============================================================================
 * Dịch vụ đồng bộ dữ liệu Tin Đăng Bất Động Sản duy nhất giữa:
 * - Seller Portal (Đăng tin, chỉnh sửa, xem danh sách cá nhân)
 * - Admin Portal (Quản lý tin đăng, xem chi tiết, duyệt, từ chối, ẩn)
 * - Public Listings (Tìm kiếm, xem chi tiết, bản đồ quy hoạch)
 *
 * TUÂN THỦ NGUYÊN TẮC:
 * 1. Single Source of Truth: Một ID duy nhất, không tạo bản sao.
 * 2. Owner ID bắt buộc: Phân quyền theo ownerId = currentUser.id.
 * 3. Đồng bộ 2 chiều: Seller tạo/sửa -> Admin thấy ngay; Admin duyệt/từ chối/ẩn -> Seller nhận đúng trạng thái.
 * 4. Notification có đích danh: recipientUserId = listing.ownerId (không broadcast tràn lan).
 * 5. Rule sửa tin đã duyệt: Nếu tin 'active' mà sửa thông tin quan trọng -> tự động đưa về 'pending'.
 * ==============================================================================
 */

import { ListingItem, mockListings } from '@/lib/mock-data';
import { NotificationItem } from '@/types/notification';
import { parseLocationCoordinates } from '@/lib/utils';

export const STORAGE_KEY_LISTINGS = 'hanoi_platform_user_listings';
export const STORAGE_KEY_NOTIFICATIONS = 'hanoi_realty_notifications';
export const EVENT_LISTINGS_UPDATED = 'hanoi_listings_updated';
export const EVENT_NOTIFICATIONS_UPDATED = 'hanoi_notifications_updated';
export const EVENT_NEW_NOTIFICATION = 'hanoi_new_notification';

/**
 * 3 Tài khoản mẫu theo yêu cầu kiểm thử Section 23
 */
export interface DemoSeller {
  id: string;
  name: string;
  phone: string;
  email: string;
  sellerType: string;
  companyName?: string;
  contactAddress?: string;
  package?: string;
  avatar: string;
}

export const TEST_SELLERS: Record<string, DemoSeller> = {
  seller_a: {
    id: 'seller_a',
    name: 'Trần Minh Hoàng',
    phone: '0912 345 678',
    email: 'seller.a@gmail.com',
    sellerType: 'Chính chủ',
    companyName: '',
    contactAddress: 'Số 15 Phố Duy Tân, Dịch Vọng Hậu, Cầu Giấy, Hà Nội',
    package: 'Pro',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  },
  seller_b: {
    id: 'seller_b',
    name: 'Lê Thu Thảo',
    phone: '0988 765 432',
    email: 'seller.b@gmail.com',
    sellerType: 'Môi giới cá nhân',
    companyName: 'BĐS Hoàng Gia',
    contactAddress: 'Tầng 5 toà nhà Charmvit, Trần Duy Hưng, Cầu Giấy, Hà Nội',
    package: 'Agency',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
  },
  seller_c: {
    id: 'seller_c',
    name: 'Phạm Tuấn Anh',
    phone: '0903 888 999',
    email: 'seller.c@gmail.com',
    sellerType: 'Chủ đầu tư / Doanh nghiệp',
    companyName: 'Công ty CP Đầu tư & Phát triển Đô thị Thủ Đô',
    contactAddress: 'Số 88 Láng Hạ, Đống Đa, Hà Nội',
    package: 'Pro',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  },
};

export const TEST_SELLERS_LIST: DemoSeller[] = Object.values(TEST_SELLERS);

/**
 * Dữ liệu hạt giống ban đầu chuẩn bị cho Single Source of Truth
 */
function getInitialSeedListings(): ListingItem[] {
  // Gắn ownerId và snapshot seller cho các mockListings mẫu
  return mockListings.map((m, index) => {
    const ownerId = m.ownerId || (index % 3 === 0 ? 'seller_a' : index % 3 === 1 ? 'seller_b' : 'seller_c');
    const sellerInfo = TEST_SELLERS[ownerId] || TEST_SELLERS.seller_a;
    return {
      ...m,
      ownerId,
      createdBy: ownerId,
      userId: ownerId,
      city: 'Hà Nội',
      propertyType: m.type,
      seller: {
        fullName: m.authorName || sellerInfo.name,
        phone: m.authorPhone || sellerInfo.phone,
        email: m.authorEmail || sellerInfo.email,
        sellerType: m.sellerType || sellerInfo.sellerType,
        companyName: m.companyName || sellerInfo.companyName,
        contactAddress: m.contactAddress || `${m.district}, Hà Nội`,
        showPhone: m.showPhone ?? true,
        allowEmailContact: m.allowEmailContact ?? true,
        showCompany: m.showCompany ?? false,
        isPhoneVerified: m.isPhoneVerified ?? true,
      },
      authorName: m.authorName || sellerInfo.name,
      authorPhone: m.authorPhone || sellerInfo.phone,
      authorEmail: m.authorEmail || sellerInfo.email,
      sellerType: m.sellerType || sellerInfo.sellerType,
      companyName: m.companyName || sellerInfo.companyName,
      contactAddress: m.contactAddress || `${m.district}, Hà Nội`,
      updatedAt: m.createdAt,
      publishedAt: m.status === 'active' ? m.createdAt : null,
      rejectionReason: m.rejectionReason || null,
      appointments: 0,
    };
  });
}

/**
 * Lấy toàn bộ danh sách listing từ LocalStorage (Client cache)
 */
export function getLocalListings(): ListingItem[] {
  if (typeof window === 'undefined') {
    return getInitialSeedListings();
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LISTINGS);
    if (raw) {
      const parsed: ListingItem[] = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Lỗi đọc LocalStorage listings:', e);
  }

  // Khởi tạo seed lần đầu
  const initial = getInitialSeedListings();
  saveLocalListings(initial);
  return initial;
}

/**
 * Lưu danh sách listing vào LocalStorage và dispatch event đồng bộ
 */
export function saveLocalListings(items: ListingItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_LISTINGS, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent(EVENT_LISTINGS_UPDATED, { detail: items }));
  } catch (e) {
    console.warn('Lỗi lưu LocalStorage listings:', e);
  }
}

/**
 * Lấy một listing theo ID từ Single Source of Truth
 */
export function getListingByIdFromStore(id: string): ListingItem | null {
  const all = getLocalListings();
  return all.find((l) => l.id === id) || null;
}

/**
 * Tạo tin mới (Seller Portal Step 6 submit)
 * Bắt buộc ownerId = currentUser.id
 * Trạng thái ban đầu: 'pending' (Chờ duyệt)
 */
export async function createListingRecord(
  data: Partial<ListingItem>,
  currentUser: { id: string; name?: string; email?: string; phone?: string; avatar?: string } | null
): Promise<ListingItem> {
  // 1. Xác định ownerId bắt buộc
  const ownerId = currentUser?.id || 'seller_a';

  // 2. Tạo ID duy nhất (Không duplicate)
  const newId = 'lst_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);

  const price = Number(data.price) || 0;
  const area = Number(data.area) || 1;
  const pricePerM2 = data.pricePerM2 || Math.round(price / area);

  const numLat = Number(data.lat);
  const numLng = Number(data.lng);
  const coords = parseLocationCoordinates(null, data.district);
  const lat = !isNaN(numLat) && numLat !== 0 ? numLat : coords.lat;
  const lng = !isNaN(numLng) && numLng !== 0 ? numLng : coords.lng;

  const sellerName = data.seller?.fullName || data.authorName || currentUser?.name || 'Khách hàng';
  const sellerPhone = data.seller?.phone || data.authorPhone || currentUser?.phone || '0988 123 456';
  const sellerEmail = data.seller?.email || data.authorEmail || currentUser?.email || '';
  const sellerType = data.seller?.sellerType || data.sellerType || 'Chính chủ';
  const companyName = data.seller?.companyName || data.companyName || '';
  const contactAddress = data.seller?.contactAddress || data.contactAddress || `${data.district || 'Hà Nội'}`;

  const nowIso = new Date().toISOString();
  const dateStr = nowIso.split('T')[0];

  const newListing: ListingItem = {
    id: newId,
    ownerId,
    createdBy: ownerId,
    userId: ownerId,
    title: data.title || 'Bất động sản Hà Nội mới đăng',
    description: data.description || 'Bất động sản vị trí đắc địa, giao thông thuận tiện.',
    type: data.type || (data.propertyType as any) || 'house',
    propertyType: data.type || (data.propertyType as any) || 'house',
    price,
    area,
    pricePerM2,
    floors: Number(data.floors) || 1,
    bedrooms: Number(data.bedrooms) || 1,
    bathrooms: Number(data.bathrooms) || 1,
    direction: data.direction || 'Đông Nam',
    legalStatus: data.legalStatus || 'Sổ đỏ chính chủ',
    address: data.address || `${data.district || 'Hà Nội'}`,
    city: 'Hà Nội',
    district: data.district || 'Cầu Giấy',
    ward: data.ward || '',
    lat,
    lng,
    images: data.images && data.images.length > 0
      ? data.images
      : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80'],
    status: 'pending', // Luôn khởi tạo ở trạng thái Chờ duyệt
    isFeatured: false,
    views: 1,
    createdAt: dateStr,
    updatedAt: nowIso,
    publishedAt: null,
    rejectionReason: null,
    planningZone: data.planningZone || 'Đất ở đô thị',
    planningYear: 2030,
    appointments: 0,
    seller: {
      fullName: sellerName,
      phone: sellerPhone,
      email: sellerEmail,
      sellerType,
      companyName,
      contactAddress,
      showPhone: data.seller?.showPhone ?? data.showPhone ?? true,
      allowEmailContact: data.seller?.allowEmailContact ?? data.allowEmailContact ?? true,
      showCompany: data.seller?.showCompany ?? data.showCompany ?? false,
      isPhoneVerified: data.seller?.isPhoneVerified ?? data.isPhoneVerified ?? false,
    },
    authorName: sellerName,
    authorPhone: sellerPhone,
    authorEmail: sellerEmail,
    sellerType,
    companyName,
    contactAddress,
    showPhone: data.seller?.showPhone ?? data.showPhone ?? true,
    allowEmailContact: data.seller?.allowEmailContact ?? data.allowEmailContact ?? true,
    showCompany: data.seller?.showCompany ?? data.showCompany ?? false,
    isPhoneVerified: data.seller?.isPhoneVerified ?? data.isPhoneVerified ?? false,
    users: {
      full_name: sellerName,
      phone: sellerPhone,
      avatar_url: currentUser?.avatar,
      role: 'agent',
    },
  };

  // 3. Ghi vào LocalStorage (Single Source of Truth)
  const currentList = getLocalListings();
  const updatedList = [newListing, ...currentList.filter((l) => l.id !== newId)];
  saveLocalListings(updatedList);

  // 4. Đồng bộ nền lên Supabase API (nếu có kết nối)
  try {
    const res = await fetch('/api/listings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: ownerId,
        title: newListing.title,
        description: newListing.description,
        property_type: newListing.type,
        price: newListing.price,
        area: newListing.area,
        address: newListing.address,
        district: newListing.district,
        ward: newListing.ward,
        lat: newListing.lat,
        lng: newListing.lng,
        images: newListing.images,
      }),
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data?.id) {
        // Cập nhật lại ID từ Supabase nếu sinh UUID
        const remoteId = json.data.id;
        const syncedList = getLocalListings().map((l) =>
          l.id === newId ? { ...l, id: remoteId } : l
        );
        newListing.id = remoteId;
        saveLocalListings(syncedList);
      }
    }
  } catch (apiErr) {
    console.warn('Sync POST /api/listings notice:', apiErr);
  }

  return newListing;
}

/**
 * Cập nhật tin đăng (Seller sửa tin HOẶC Admin sửa thông tin)
 * Section 11 & 18: Update đúng Listing ID hiện tại, không duplicate!
 * Section 12: Nếu tin đang 'active' mà Seller sửa thông tin quan trọng -> tự động đưa về 'pending' để Admin duyệt lại!
 */
export async function updateListingRecord(
  id: string,
  updates: Partial<ListingItem>,
  currentUser?: { id: string; role?: string } | null,
  isAdminAction: boolean = false
): Promise<ListingItem | null> {
  const currentList = getLocalListings();
  const existingIndex = currentList.findIndex((l) => l.id === id);

  if (existingIndex === -1) {
    console.warn(`[ListingService] Không tìm thấy listing có id: ${id}`);
    return null;
  }

  const existing = currentList[existingIndex];

  // Kiểm tra phân quyền: Seller chỉ được sửa tin của chính mình
  if (!isAdminAction && currentUser && currentUser.role !== 'admin') {
    if (existing.ownerId && existing.ownerId !== currentUser.id) {
      throw new Error('Bạn không có quyền chỉnh sửa bài đăng này');
    }
  }

  // QUY TẮC SECTION 12:
  // Nếu tin đang 'active' mà seller chỉnh sửa thông tin quan trọng:
  // Giá, Địa chỉ, Diện tích, Pháp lý, Hình ảnh, Tiêu đề, Mô tả
  // -> Đưa tin về 'pending' để Admin duyệt lại.
  let targetStatus = updates.status !== undefined ? updates.status : existing.status;

  if (!isAdminAction && existing.status === 'active') {
    const isPriceChanged = updates.price !== undefined && Number(updates.price) !== Number(existing.price);
    const isAreaChanged = updates.area !== undefined && Number(updates.area) !== Number(existing.area);
    const isAddressChanged = updates.address !== undefined && updates.address !== existing.address;
    const isDistrictChanged = updates.district !== undefined && updates.district !== existing.district;
    const isLegalChanged = updates.legalStatus !== undefined && updates.legalStatus !== existing.legalStatus;
    const isTitleChanged = updates.title !== undefined && updates.title !== existing.title;
    const isDescChanged = updates.description !== undefined && updates.description !== existing.description;
    const isImagesChanged = updates.images !== undefined && JSON.stringify(updates.images) !== JSON.stringify(existing.images);

    if (
      isPriceChanged ||
      isAreaChanged ||
      isAddressChanged ||
      isDistrictChanged ||
      isLegalChanged ||
      isTitleChanged ||
      isDescChanged ||
      isImagesChanged
    ) {
      targetStatus = 'pending';
    }
  }

  const nowIso = new Date().toISOString();

  // Đồng bộ seller snapshot nếu có updates
  const updatedSeller = {
    ...existing.seller,
    ...(updates.seller || {}),
  };
  if (updates.authorName) updatedSeller.fullName = updates.authorName;
  if (updates.authorPhone) updatedSeller.phone = updates.authorPhone;
  if (updates.authorEmail) updatedSeller.email = updates.authorEmail;
  if (updates.sellerType) updatedSeller.sellerType = updates.sellerType;
  if (updates.companyName) updatedSeller.companyName = updates.companyName;
  if (updates.contactAddress) updatedSeller.contactAddress = updates.contactAddress;

  const updatedListing: ListingItem = {
    ...existing,
    ...updates,
    id: existing.id, // BẮT BUỘC giữ nguyên ID duy nhất
    ownerId: existing.ownerId, // BẮT BUỘC giữ nguyên chủ tin
    createdBy: existing.createdBy || existing.ownerId,
    status: targetStatus,
    updatedAt: nowIso,
    seller: updatedSeller as any,
    authorName: updatedSeller.fullName || existing.authorName,
    authorPhone: updatedSeller.phone || existing.authorPhone,
    authorEmail: updatedSeller.email || existing.authorEmail,
    sellerType: updatedSeller.sellerType || existing.sellerType,
    companyName: updatedSeller.companyName || existing.companyName,
    contactAddress: updatedSeller.contactAddress || existing.contactAddress,
  };

  currentList[existingIndex] = updatedListing;
  saveLocalListings(currentList);

  // Đồng bộ lên Supabase nếu có API
  try {
    await fetch(`/api/listings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    }).catch(() => {});
  } catch {}

  return updatedListing;
}

/**
 * Admin Duyệt tin đăng (Section 8)
 * - status = 'active'
 * - publishedAt = current timestamp
 * - Notification tới đúng listing.ownerId
 */
export async function approveListingRecord(id: string): Promise<ListingItem | null> {
  const currentList = getLocalListings();
  const listing = currentList.find((l) => l.id === id);

  if (!listing) return null;

  const nowIso = new Date().toISOString();
  const updated: ListingItem = {
    ...listing,
    status: 'active',
    publishedAt: nowIso,
    updatedAt: nowIso,
    rejectionReason: null,
  };

  const updatedList = currentList.map((l) => (l.id === id ? updated : l));
  saveLocalListings(updatedList);

  // Gửi thông báo tới ĐÚNG tài khoản ownerId (Section 17)
  createDirectNotification({
    recipientUserId: listing.ownerId || listing.userId || 'seller_a',
    type: 'listing_approved',
    title: 'Tin đăng BĐS đã duyệt thành công',
    message: `Tin đăng "${listing.title}" của bạn đã được Admin phê duyệt thành công và hiện đang hiển thị công khai trên hệ thống!`,
    content: `Tin đăng "${listing.title}" của bạn đã được Admin phê duyệt thành công và hiện đang hiển thị công khai trên hệ thống!`,
    listingId: id,
    category: 'listing',
    tag: 'Đã duyệt',
    link: `/listings/${id}`,
  });

  // Đồng bộ qua API
  try {
    await fetch('/api/listings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: 'active' }),
    }).catch(() => {});
  } catch {}

  return updated;
}

/**
 * Admin Từ chối tin đăng (Section 9)
 * - status = 'rejected'
 * - rejectionReason bắt buộc
 * - Notification tới đúng listing.ownerId
 */
export async function rejectListingRecord(id: string, rejectionReason: string): Promise<ListingItem | null> {
  const currentList = getLocalListings();
  const listing = currentList.find((l) => l.id === id);

  if (!listing) return null;

  const reason = rejectionReason?.trim() || 'Thông tin hoặc hình ảnh chưa đáp ứng tiêu chuẩn kiểm duyệt';
  const nowIso = new Date().toISOString();

  const updated: ListingItem = {
    ...listing,
    status: 'rejected',
    rejectionReason: reason,
    updatedAt: nowIso,
  };

  const updatedList = currentList.map((l) => (l.id === id ? updated : l));
  saveLocalListings(updatedList);

  // Gửi thông báo tới ĐÚNG tài khoản ownerId kèm lý do (Section 17)
  createDirectNotification({
    recipientUserId: listing.ownerId || listing.userId || 'seller_a',
    type: 'listing_rejected',
    title: 'Tin đăng chưa được duyệt',
    message: `Tin "${listing.title}" chưa được duyệt. Lý do: ${reason}`,
    content: `Tin "${listing.title}" chưa được duyệt. Lý do: ${reason}`,
    rejectionReason: reason,
    listingId: id,
    category: 'listing',
    tag: 'Cần sửa',
    link: '/dashboard',
  });

  // Đồng bộ qua API
  try {
    await fetch('/api/listings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: 'rejected', rejectionReason: reason }),
    }).catch(() => {});
  } catch {}

  return updated;
}

/**
 * Admin Ẩn / Bỏ ẩn tin đăng (Section 10)
 * - status = 'hidden' (Ẩn) hoặc 'active' (Bỏ ẩn)
 */
export async function toggleHideListingRecord(id: string, forceHidden?: boolean): Promise<ListingItem | null> {
  const currentList = getLocalListings();
  const listing = currentList.find((l) => l.id === id);

  if (!listing) return null;

  const nextStatus =
    forceHidden !== undefined
      ? forceHidden ? 'hidden' : 'active'
      : listing.status === 'hidden' ? 'active' : 'hidden';

  const nowIso = new Date().toISOString();
  const updated: ListingItem = {
    ...listing,
    status: nextStatus,
    updatedAt: nowIso,
  };

  const updatedList = currentList.map((l) => (l.id === id ? updated : l));
  saveLocalListings(updatedList);

  try {
    await fetch('/api/listings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: nextStatus }),
    }).catch(() => {});
  } catch {}

  return updated;
}

/**
 * Xóa vĩnh viễn tin đăng
 */
export function deleteListingRecord(id: string): void {
  const currentList = getLocalListings();
  const filtered = currentList.filter((l) => l.id !== id);
  saveLocalListings(filtered);
}

/**
 * Tính toán số lượng thống kê động từ dữ liệu thật cho Admin (Section 14)
 */
export function getListingCounts(list: ListingItem[]) {
  const total = list.length;
  const pending = list.filter((l) => l.status === 'pending').length;
  const active = list.filter((l) => l.status === 'active').length;
  const rejected = list.filter((l) => l.status === 'rejected').length;
  const hidden = list.filter((l) => l.status === 'hidden').length;
  const expired = list.filter((l) => l.status === 'expired').length;

  return { total, pending, active, rejected, hidden, expired };
}

/**
 * Tạo thông báo gửi đích danh (Scoping chuẩn xác recipientUserId, Section 17)
 */
export function createDirectNotification(params: {
  recipientUserId: string;
  type: string;
  title: string;
  message: string;
  content: string;
  listingId?: string;
  rejectionReason?: string;
  category?: 'listing' | 'planning' | 'ai' | 'message' | 'system';
  tag?: string;
  link?: string;
}): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_NOTIFICATIONS);
    const notifs: NotificationItem[] = raw ? JSON.parse(raw) : [];

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      recipientUserId: params.recipientUserId,
      type: params.type,
      title: params.title,
      message: params.message,
      content: params.content,
      listingId: params.listingId,
      rejectionReason: params.rejectionReason,
      category: params.category || 'listing',
      tag: params.tag || 'Hệ thống',
      link: params.link || '/dashboard',
      createdAt: 'Vừa xong',
      timestamp: Date.now(),
      isRead: false,
    };

    const updated = [newNotif, ...notifs];
    localStorage.setItem(STORAGE_KEY_NOTIFICATIONS, JSON.stringify(updated));

    // Phát sự kiện toàn cục
    window.dispatchEvent(new CustomEvent(EVENT_NEW_NOTIFICATION, { detail: newNotif }));
    window.dispatchEvent(new Event(EVENT_NOTIFICATIONS_UPDATED));
  } catch (e) {
    console.warn('Lỗi ghi nhận thông báo trực tiếp:', e);
  }
}

