---
name: clean-async-patterns
description: Xử lý bất đồng bộ chuyên sâu, chống Race Conditions (điều kiện chạy đua) và thiết kế Graceful Degradation từ kho tri thức qianguyihao/Web (Chương 06). Quản lý vòng đời HTTP request bằng AbortController và cơ chế fallback an toàn cho Supabase/AI API.
---

# 🛡️ Clean Async Patterns Skill (Hanoi PropTech Edition)

Trong ứng dụng bản đồ BĐS, người dùng liên tục tương tác (bấm bộ lọc, chuyển tab, pan bản đồ, gõ từ khóa tìm kiếm). Nếu không quản lý vòng đời bất đồng bộ, các request cũ sẽ ghi đè lên dữ liệu mới gây lỗi hiển thị sai lệch nghiêm trọng.

## 1. Triệt tiêu Race Conditions bằng `AbortController`:
- **Vấn đề:** Người dùng chọn Quận Cầu Giấy (Request 1 phát đi mất 800ms) ➔ Ngay sau đó đổi ý chọn Quận Đống Đa (Request 2 phát đi mất 300ms). Request 2 hoàn thành trước, nhưng sau đó Request 1 hoàn tất và ghi đè danh sách Cầu Giấy lên màn hình Đống Đa!
- **Giải pháp bắt buộc:**
  ```typescript
  useEffect(() => {
    const controller = new AbortController();
    
    async function fetchData() {
      try {
        const res = await fetch(`/api/listings?district=${district}`, {
          signal: controller.signal
        });
        const data = await res.json();
        setListings(data);
      } catch (err: any) {
        if (err.name === 'AbortError') {
          // Bỏ qua lỗi do chủ động hủy request cũ
          return;
        }
        handleError(err);
      }
    }

    fetchData();
    return () => controller.abort(); // Hủy ngay request cũ khi dependencies thay đổi
  }, [district]);
  ```

## 2. Graceful Degradation (Suy thoái mượt mà khi lỗi mạng / timeout):
- Khi dịch vụ phân tích Gemini AI hoặc Supabase bị chậm/timeout:
  - Bọc trong cơ chế `Promise.race([fetchPromise, timeoutPromise(5000)])`.
  - Tự động fallback về dữ liệu tính toán cục bộ (`lib/mock-data.ts` hoặc cache IndexedDB/LocalStorage) thay vì làm sập toàn bộ giao diện hoặc hiển thị trang trắng (Blank screen).

## 3. Quản lý trạng thái bất đồng bộ 4 bước:
Mọi component nạp dữ liệu từ xa đều phải thể hiện rõ ràng 4 trạng thái:
1. `idle`: Chưa thực hiện.
2. `loading`: Hiển thị Skeleton Loader mượt mà (tránh giật layout).
3. `success`: Hiển thị danh sách hoặc bản đồ.
4. `error / empty`: Thông báo thân thiện kèm nút "Thử lại" (`Retry`).
