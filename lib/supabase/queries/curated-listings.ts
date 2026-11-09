/**
 * HaNoi Realty - Database Queries: Quản lý Tủ Hàng Cá Nhân Môi Giới (Curated Listings)
 * Định vị: XÁC THỰC – RÕ RÀNG – MINH BẠCH – BẢO VỆ QUYỀN LỢI CÁC BÊN
 * 
 * ⚠️ NGUYÊN TẮC BẢO TOÀN DỮ LIỆU CỐT LÕI:
 * - Khi môi giới lưu BĐS vào "Tủ hàng cá nhân", hàm này CHỈ TƯƠNG TÁC với bảng `broker_curated_listings`.
 * - TUYỆT ĐỐI KHÔNG gọi insert hay duplicate trên bảng `listings`, bảo đảm không bao giờ nhân bản BĐS
 *   trên bản đồ hay làm ô nhiễm danh sách công khai.
 */

import { createClient } from '@/lib/supabase/client';
import { BrokerCuratedListingRecord } from '@/types/broker-system';

const STORAGE_KEY_CURATED = 'hanoi_realty_broker_curated_listings';

// Helper local cache fallback cho môi trường client/dev
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
 * Toggle trạng thái lưu vào Tủ hàng cá nhân của môi giới:
 * - Nếu chưa có: Thêm vào bảng `broker_curated_listings`
 * - Nếu đã có: Xóa khỏi bảng `broker_curated_listings`
 * - KHÔNG BAO GIỜ can thiệp bảng `listings`
 */
export async function toggleCuratedListing(
  brokerId: string,
  brokerCode: string,
  listingId: string,
  privateNotes?: string
): Promise<{
  success: boolean;
  isCurated: boolean;
  message: string;
  data?: BrokerCuratedListingRecord;
  error?: string;
}> {
  try {
    const local = getLocalCurated();
    const existingIndex = local.findIndex(
      (item) => item.broker_id === brokerId && item.listing_id === listingId
    );

    const isAlreadyCurated = existingIndex >= 0;

    if (isAlreadyCurated) {
      // 1. Nếu đã lưu -> Xóa khỏi tủ hàng
      try {
        const supabase = createClient();
        await (supabase.from('broker_curated_listings' as any) as any)
          .delete()
          .match({ broker_id: brokerId, listing_id: listingId });
      } catch (dbErr) {
        console.warn('[CuratedListings Query] Supabase delete fallback to local:', dbErr);
      }

      const updated = local.filter(
        (item) => !(item.broker_id === brokerId && item.listing_id === listingId)
      );
      setLocalCurated(updated);

      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('hanoi_curated_listing_removed', {
            detail: { brokerId, listingId },
          })
        );
      }

      return {
        success: true,
        isCurated: false,
        message: 'Đã xóa căn nhà khỏi Tủ hàng cá nhân của bạn.',
      };
    } else {
      // 2. Nếu chưa lưu -> Thêm liên kết vào bảng broker_curated_listings
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
        console.warn('[CuratedListings Query] Supabase insert fallback to local:', dbErr);
      }

      setLocalCurated([newRecord, ...local]);

      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('hanoi_curated_listing_added', {
            detail: newRecord,
          })
        );
      }

      return {
        success: true,
        isCurated: true,
        message: 'Đã lưu căn nhà vào Tủ hàng cá nhân để tiện chăm sóc khách!',
        data: newRecord,
      };
    }
  } catch (err: any) {
    console.error('[CuratedListings Query] Error toggling curated listing:', err);
    return {
      success: false,
      isCurated: false,
      message: 'Lỗi thao tác tủ hàng cá nhân.',
      error: err.message || 'Lỗi kết nối cơ sở dữ liệu',
    };
  }
}

/**
 * Lấy danh sách ID các BĐS môi giới đã bookmark vào tủ hàng
 */
export async function getBrokerCuratedIds(brokerId: string): Promise<string[]> {
  try {
    try {
      const supabase = createClient();
      const { data, error } = await (supabase.from('broker_curated_listings' as any) as any)
        .select('listing_id')
        .eq('broker_id', brokerId);

      if (!error && Array.isArray(data) && data.length > 0) {
        return data.map((d: any) => d.listing_id);
      }
    } catch {}

    const local = getLocalCurated();
    return local.filter((item) => item.broker_id === brokerId).map((item) => item.listing_id);
  } catch {
    return [];
  }
}

/**
 * Cập nhật ghi chú cá nhân (private notes) cho một BĐS trong tủ hàng
 */
export async function updateCuratedPrivateNotes(
  brokerId: string,
  listingId: string,
  notes: string
): Promise<{ success: boolean; message: string; error?: string }> {
  try {
    try {
      const supabase = createClient();
      await (supabase.from('broker_curated_listings' as any) as any)
        .update({ private_notes: notes, updated_at: new Date().toISOString() })
        .match({ broker_id: brokerId, listing_id: listingId });
    } catch {}

    const local = getLocalCurated();
    const updated = local.map((item) =>
      item.broker_id === brokerId && item.listing_id === listingId
        ? { ...item, private_notes: notes, updated_at: new Date().toISOString() }
        : item
    );
    setLocalCurated(updated);

    return {
      success: true,
      message: 'Đã lưu ghi chú cá nhân thành công.',
    };
  } catch (err: any) {
    return {
      success: false,
      message: 'Không thể lưu ghi chú.',
      error: err.message,
    };
  }
}

