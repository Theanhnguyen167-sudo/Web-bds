'use client';

import { useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';

const SCROLL_STORAGE_PREFIX = 'hanoi_bds_scroll_';
const POPSTATE_FLAG_KEY = 'hanoi_bds_is_popstate';
const HISTORY_KEY_PROP = '__hanoi_hist_key';

/**
 * Tạo hoặc lấy định danh duy nhất (History Key) gắn chặt với từng entry trong history stack của trình duyệt.
 * Nhờ đó, khi bấm nút "Quay lại" (Back) hoặc "Tiến lên" (Forward), key này được trình duyệt khôi phục chính xác 100%.
 */
function getOrCreateHistoryKey(): string {
  if (typeof window === 'undefined') return '';
  try {
    const state = window.history.state || {};
    if (state[HISTORY_KEY_PROP]) {
      return state[HISTORY_KEY_PROP];
    }
    const newKey = 'hk_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 8);
    window.history.replaceState({ ...state, [HISTORY_KEY_PROP]: newKey }, '');
    return newKey;
  } catch {
    return '';
  }
}

function getPathKey(): string {
  if (typeof window === 'undefined') return '';
  return window.location.pathname + window.location.search;
}

/**
 * Lưu tọa độ cuộn hiện tại của trang vào sessionStorage theo cả History Key và URL Path
 */
function saveCurrentPosition() {
  if (typeof window === 'undefined') return;
  const scrollY = window.scrollY;
  if (scrollY < 0) return;

  const hKey = getOrCreateHistoryKey();
  const pathKey = getPathKey();

  try {
    if (hKey) {
      sessionStorage.setItem(`${SCROLL_STORAGE_PREFIX}hkey_${hKey}`, String(scrollY));
    }
    if (pathKey) {
      sessionStorage.setItem(`${SCROLL_STORAGE_PREFIX}path_${pathKey}`, String(scrollY));
    }
  } catch {
    // Tránh lỗi khi bộ nhớ sessionStorage bị đầy hoặc trong chế độ ẩn danh nghiêm ngặt
  }
}

/**
 * Lấy tọa độ cuộn đã lưu của entry lịch sử hiện tại
 */
function getSavedPosition(): number | null {
  if (typeof window === 'undefined') return null;
  try {
    const state = window.history.state;
    const hKey = state ? state[HISTORY_KEY_PROP] : null;

    if (hKey) {
      const val = sessionStorage.getItem(`${SCROLL_STORAGE_PREFIX}hkey_${hKey}`);
      if (val !== null) {
        const num = parseInt(val, 10);
        if (!isNaN(num) && num >= 0) return num;
      }
    }

    const pathKey = getPathKey();
    if (pathKey) {
      const val = sessionStorage.getItem(`${SCROLL_STORAGE_PREFIX}path_${pathKey}`);
      if (val !== null) {
        const num = parseInt(val, 10);
        if (!isNaN(num) && num >= 0) return num;
      }
    }
  } catch {
    // Bỏ qua lỗi
  }
  return null;
}

/**
 * GlobalScrollRestoration
 * 
 * Component khôi phục vị trí cuộn thông minh cho TOÀN BỘ trang web:
 * - Khi người dùng cuộn xem bài viết, tin tức, thẻ nhà đất rồi bấm vào xem chi tiết:
 *   Vị trí cuộn được ghi nhớ tức thì ngay tại thời điểm bấm chuột / chạm ngón tay.
 * - Khi bấm "Quay lại" (Back trên trình duyệt hoặc nút Quay lại giao diện):
 *   Trang quay trở lại chính xác 100% vị trí trước khi bấm, không bị nhảy giật về đầu trang.
 * - Hỗ trợ vòng lặp thích ứng (Adaptive Retry Loop) chờ Next.js hydrate & mở rộng chiều cao DOM đầy đủ.
 * - Hủy tự động nếu người dùng chủ động chạm/cuộn để không làm cản trở thao tác tự nhiên.
 */
export function GlobalScrollRestoration() {
  const pathname = usePathname();
  const isRestoringRef = useRef(false);
  const cancelRestorationRef = useRef<(() => void) | null>(null);
  const isPopStateRef = useRef(false);
  const lastPathnameRef = useRef<string | null>(null);

  // 1. Tắt chế độ tự can thiệp cuộn mặc định của trình duyệt để tránh bị kéo về (0, 0) trước khi DOM hydrate
  useEffect(() => {
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  // Hàm thực hiện khôi phục vị trí thích ứng (Adaptive Restoration)
  const triggerRestoration = useCallback((targetY: number) => {
    if (typeof window === 'undefined' || targetY <= 0) return;

    // Hủy bất kỳ tác vụ khôi phục cũ đang chạy
    if (cancelRestorationRef.current) {
      cancelRestorationRef.current();
    }

    isRestoringRef.current = true;
    let isCancelled = false;
    let consecutiveMatches = 0;
    let rafId: number | null = null;
    let observer: MutationObserver | null = null;
    const startTime = Date.now();
    const MAX_DURATION_MS = 2500; // Thử tối đa trong 2.5s để chờ ảnh & DOM con nạp xong

    const cleanup = () => {
      isCancelled = true;
      if (rafId) cancelAnimationFrame(rafId);
      if (observer) observer.disconnect();
      window.removeEventListener('wheel', onUserInterruption);
      window.removeEventListener('touchstart', onUserInterruption);
      window.removeEventListener('touchmove', onUserInterruption);
      window.removeEventListener('pointerdown', onUserInterruption);
      window.removeEventListener('keydown', onUserInterruption);
      cancelRestorationRef.current = null;
      // Thả cờ sau một nhịp ngắn để không bị lưu sai tọa độ trong lúc chuyển giao
      setTimeout(() => {
        isRestoringRef.current = false;
      }, 80);
    };

    // Nếu người dùng chủ động chạm/cuộn thì dừng tự động khôi phục ngay để nhường quyền điều khiển
    const onUserInterruption = () => {
      cleanup();
    };

    cancelRestorationRef.current = cleanup;

    window.addEventListener('wheel', onUserInterruption, { passive: true });
    window.addEventListener('touchstart', onUserInterruption, { passive: true });
    window.addEventListener('touchmove', onUserInterruption, { passive: true });
    window.addEventListener('pointerdown', onUserInterruption, { passive: true });
    window.addEventListener('keydown', onUserInterruption, { passive: true });

    const performAdaptiveScroll = () => {
      if (isCancelled) return;

      const docHeight = document.documentElement.scrollHeight;
      const viewportHeight = window.innerHeight;
      const maxScrollY = Math.max(0, docHeight - viewportHeight);
      const effectiveTarget = Math.min(targetY, maxScrollY);

      // Áp dụng vị trí cuộn ngay lập tức
      window.scrollTo({
        top: effectiveTarget,
        left: 0,
        behavior: 'instant' as ScrollBehavior,
      });

      const currentY = window.scrollY;
      const isAtTarget = Math.abs(currentY - targetY) <= 3;
      const isPageTallEnough = maxScrollY >= targetY - 10;

      if (isAtTarget && isPageTallEnough) {
        consecutiveMatches++;
        // Đã đứng vững đúng vị trí trong 3 frame liên tiếp mà trang đủ chiều cao
        if (consecutiveMatches >= 3) {
          cleanup();
          return;
        }
      } else {
        consecutiveMatches = 0;
      }

      if (Date.now() - startTime < MAX_DURATION_MS) {
        rafId = requestAnimationFrame(performAdaptiveScroll);
      } else {
        cleanup();
      }
    };

    // Quan sát thay đổi DOM con để cuộn tức thì ngay khi các component/thẻ bài viết vừa xuất hiện
    if (typeof MutationObserver !== 'undefined' && document.body) {
      observer = new MutationObserver(() => {
        if (isCancelled) return;
        performAdaptiveScroll();
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }

    // Bắt đầu vòng lặp khôi phục ngay lập tức
    performAdaptiveScroll();
  }, []);

  // 2. Lắng nghe các sự kiện điều hướng lịch sử (popstate, pageshow từ BFCache)
  useEffect(() => {
    const handlePopState = () => {
      isPopStateRef.current = true;
      try {
        sessionStorage.setItem(POPSTATE_FLAG_KEY, '1');
      } catch {}

      // Kích hoạt kiểm tra và khôi phục ngay trong frame tiếp theo của popstate
      requestAnimationFrame(() => {
        const targetY = getSavedPosition();
        if (targetY !== null && targetY > 0) {
          triggerRestoration(targetY);
        }
      });
    };

    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        isPopStateRef.current = true;
        try {
          sessionStorage.setItem(POPSTATE_FLAG_KEY, '1');
        } catch {}
        const targetY = getSavedPosition();
        if (targetY !== null && targetY > 0) {
          triggerRestoration(targetY);
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('pageshow', handlePageShow);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, [triggerRestoration]);

  // 3. Ghi nhớ vị trí cuộn liên tục và NGAY LẬP TỨC tại thời điểm người dùng bấm vào bất kỳ bài viết / link nào
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout | null = null;

    // Ghi nhớ khi người dùng cuộn chuột (debounce 40ms)
    const handleScroll = () => {
      if (isRestoringRef.current) return;
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        if (!isRestoringRef.current) {
          saveCurrentPosition();
        }
      }, 40);
    };

    // Bắt sự kiện Click ở tầng Capture: lưu ngay tọa độ cuộn trước khi bất kỳ navigation nào bắt đầu
    const handleCaptureClick = () => {
      if (!isRestoringRef.current) {
        saveCurrentPosition();
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && !isRestoringRef.current) {
        saveCurrentPosition();
      }
    };

    const handleBeforeUnload = () => {
      if (!isRestoringRef.current) {
        saveCurrentPosition();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('click', handleCaptureClick, { capture: true, passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', handleBeforeUnload);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('click', handleCaptureClick, { capture: true });
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', handleBeforeUnload);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // 4. Xử lý khôi phục vị trí khi pathname thay đổi hoặc khi trang được mount
  useEffect(() => {
    const isInitialMount = lastPathnameRef.current === null;
    lastPathnameRef.current = pathname;

    // Kiểm tra cờ popstate từ memory ref hoặc sessionStorage
    let isPop = isPopStateRef.current;
    if (!isPop) {
      try {
        isPop = sessionStorage.getItem(POPSTATE_FLAG_KEY) === '1';
      } catch {}
    }

    // Xóa cờ popstate sau khi nhận diện
    isPopStateRef.current = false;
    try {
      sessionStorage.removeItem(POPSTATE_FLAG_KEY);
    } catch {}

    if (isPop) {
      // Trường hợp 1: Người dùng nhấn "Quay lại" (Back) hoặc "Tiến lên" (Forward)
      const targetY = getSavedPosition();
      if (targetY !== null && targetY > 0) {
        triggerRestoration(targetY);
      }
    } else if (!isInitialMount) {
      // Trường hợp 2: Người dùng nhấn link mới để xem trang khác (Forward navigation bình thường)
      // Nếu URL không có neo hashtag (#), đảm bảo trang mới mở ra bắt đầu từ đỉnh đầu trang
      if (typeof window !== 'undefined' && !window.location.hash) {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      }
      getOrCreateHistoryKey();
    } else {
      // Trường hợp 3: Khởi tạo lần đầu tiên mở web
      getOrCreateHistoryKey();
    }
  }, [pathname, triggerRestoration]);

  return null;
}
