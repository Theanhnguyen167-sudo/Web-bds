import { NextResponse } from 'next/server';
import { ApiResponse } from '@/types';

/**
 * Trả về phản hồi thành công chuẩn ApiResponse<T>
 */
export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json<ApiResponse<T>>(
    {
      success: true,
      data,
    },
    { status }
  );
}

/**
 * Trả về phản hồi thất bại chuẩn ApiResponse
 */
export function apiError(message: string, code = 'INTERNAL_ERROR', status = 500) {
  return NextResponse.json<ApiResponse>(
    {
      success: false,
      error: {
        message,
        code,
      },
    },
    { status }
  );
}

/**
 * Simple In-Memory Sliding Window Rate Limiter
 * Dùng để giới hạn tần suất gọi API (VD: Gemini AI, VNPay, cào dữ liệu)
 */
interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitStore = new Map<string, RateLimitRecord>();

export function checkRateLimit(
  identifier: string,
  limit: number = 30,
  windowMs: number = 60 * 1000
): { allowed: boolean; remaining: number; retryAfterSec: number } {
  const now = Date.now();
  const windowStart = now - windowMs;

  let record = rateLimitStore.get(identifier);
  if (!record) {
    record = { timestamps: [] };
    rateLimitStore.set(identifier, record);
  }

  // Loại bỏ các timestamp cũ ngoài khung thời gian trượt
  record.timestamps = record.timestamps.filter((t) => t > windowStart);

  if (record.timestamps.length >= limit) {
    const oldest = record.timestamps[0];
    const retryAfterSec = Math.ceil((oldest + windowMs - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      retryAfterSec: Math.max(1, retryAfterSec),
    };
  }

  record.timestamps.push(now);
  return {
    allowed: true,
    remaining: limit - record.timestamps.length,
    retryAfterSec: 0,
  };
}
