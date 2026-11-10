/**
 * HaNoi Realty - Service Quản lý Tủ hàng cá nhân Môi giới (Broker Curated Listings Service)
 * Định vị: XÁC THỰC – RÕ RÀNG – MINH BẠCH – BẢO VỆ QUYỀN LỢI CÁC BÊN
 * 
 * ⚠️ NGUYÊN TẮC BẢO TOÀN DỮ LIỆU BẮT BUỘC:
 * Khi môi giới bấm "Lưu vào Tủ hàng", hàm này CHỈ INSERT vào bảng quan hệ `broker_curated_listings`.
 * TUYỆT ĐỐI KHÔNG gọi API tạo mới listing làm nhân bản BĐS trên bản đồ hay danh sách công khai!
 */

import { createClient } from '@/lib/supabase/client';
import { BrokerCuratedListingRecord } from '@/types/broker-system';

const STORAGE_KEY_CURATED = 'hanoi_realty_broker_curated_listings';

// Helper lưu trữ local cache an toàn
function getLocalCurated(): BrokerCuratedListingRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CURATED);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setLocalCurated(data: BrokerCuratedListingRecord[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_CURATED, JSON.stringify(data));
  } catch {}
}

/**
 * Lưu BĐS từ Kho nhà mở vào Tủ hàng cá nhân của Môi giới.
 * CHỈ THAO TÁC TRÊN BẢNG `broker_curated_listings`.
 */
export async function addListingToCurated(
  brokerId: string,
  brokerCode: string,
  listingId: string,
  privateNotes?: string
): Promise<{ success: boolean; data?: BrokerCuratedListingRecord; error?: string }> {
  try {
    // 1. Kiểm tra nếu đã tồn tại trong tủ hàng
    const local = getLocalCurated();
    const existing = local.find(
      (item) => item.broker_id === brokerId && item.listing_id === listingId
    );

    if (existing) {
      return { success: true, data: existing };
    }

    // 2. Tạo bản ghi quan hệ mới (CHỈ BẢNG broker_curated_listings)
    const newRecord: BrokerCuratedListingRecord = {
      id: `curated-${Date.now()}`,
      broker_id: brokerId,
      broker_code: brokerCode,
      listing_id: listingId,
      private_notes: privateNotes || '',
      tags: ['Tủ hàng'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // 3. Thử ghi vào Supabase nếu có kết nối
    try {
      const supabase = createClient();
      await (supabase.from('broker_curated_listings' as any) as any)
        .insert({
          broker_id: brokerId,
          broker_code: brokerCode,
          listing_id: listingId,
          private_notes: privateNotes || '',
        });
    } catch (dbErr) {
      // Tiếp tục với local cache nếu offline/dev
      console.warn('[BrokerCuratedService] Supabase offline, using local fallback:', dbErr);
    }

    // 4. Đồng bộ local cache
    setLocalCurated([newRecord, ...local]);

    // Bắn event để các tab hoặc component lắng nghe đồng bộ
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('hanoi_curated_listing_added', { detail: newRecord })
      );
    }

    return { success: true, data: newRecord };
  } catch (err: any) {
    console.error('[BrokerCuratedService] Error saving to curated:', err);
    return { success: false, error: err.message || 'Lỗi khi lưu vào tủ hàng' };
  }
}

/**
 * Xóa BĐS khỏi Tủ hàng cá nhân của Môi giới.
 * CHỈ XÓA QUAN HỆ TRONG BẢNG `broker_curated_listings`, BĐS GỐC TRÊN BẢN ĐỒ VẪN NGUYÊN VẸN.
 */
export async function removeListingFromCurated(
  brokerId: string,
  listingId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    try {
      const supabase = createClient();
      await (supabase.from('broker_curated_listings' as any) as any)
        .delete()
        .match({ broker_id: brokerId, listing_id: listingId });
    } catch (dbErr) {
      console.warn('[BrokerCuratedService] Supabase delete error, fallback local:', dbErr);
    }

    const local = getLocalCurated();
    const updated = local.filter(
      (item) => !(item.broker_id === brokerId && item.listing_id === listingId)
    );
    setLocalCurated(updated);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('hanoi_curated_listing_removed', { detail: { brokerId, listingId } })
      );
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Lỗi khi xóa khỏi tủ hàng' };
  }
}

/**
 * Cập nhật ghi chú cá nhân (private notes) cho BĐS trong tủ hàng.
 */
export async function updateCuratedListingNote(
  brokerId: string,
  listingId: string,
  note: string
): Promise<{ success: boolean; error?: string }> {
  try {
    try {
      const supabase = createClient();
      await (supabase.from('broker_curated_listings' as any) as any)
        .update({ private_notes: note, updated_at: new Date().toISOString() })
        .match({ broker_id: brokerId, listing_id: listingId });
    } catch (dbErr) {
      console.warn('[BrokerCuratedService] Supabase update note error, fallback local:', dbErr);
    }

    const local = getLocalCurated();
    const updated = local.map((item) =>
      item.broker_id === brokerId && item.listing_id === listingId
        ? { ...item, private_notes: note, updated_at: new Date().toISOString() }
        : item
    );
    setLocalCurated(updated);

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Lỗi khi lưu ghi chú' };
  }
}

/**
 * Lấy danh sách ID các BĐS mà môi giới đã lưu vào tủ hàng.
 */
export async function getCuratedListingIds(brokerId: string): Promise<string[]> {
  try {
    const local = getLocalCurated();
    const matched = local.filter((item) => item.broker_id === brokerId);
    return matched.map((m) => m.listing_id);
  } catch {
    return [];
  }
}
