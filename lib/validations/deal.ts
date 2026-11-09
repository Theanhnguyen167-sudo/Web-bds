import { z } from 'zod';

/**
 * 1. Zod Schema: Gắn kết khách hàng theo Cơ chế Ba Mã (Lead Attribution & Anti-bypass)
 */
export const createLeadBindingSchema = z.object({
  member_id: z.string().min(3, 'Mã thành viên (Member ID) không hợp lệ'),
  property_code: z.string().min(3, 'Mã BĐS (Property ID) không hợp lệ'),
  listing_id: z.string().uuid('Listing ID phải là UUID hợp lệ'),
  customer_name: z.string().min(2, 'Tên khách hàng tối thiểu 2 ký tự'),
  customer_phone: z
    .string()
    .regex(/^(0|\+84)[3|5|7|8|9][0-9]{8}$/, 'Số điện thoại không đúng định dạng Việt Nam'),
  source_channel: z.enum(['facebook', 'zalo', 'referral', 'direct', 'other']).default('direct'),
});

export type CreateLeadBindingInput = z.infer<typeof createLeadBindingSchema>;

/**
 * 2. Zod Schema: Lập Bằng chứng dẫn khách xem nhà (Proof of Viewing)
 */
export const createViewingProofSchema = z.object({
  listing_id: z.string().uuid('Listing ID không hợp lệ'),
  customer_name: z.string().min(2, 'Tên khách hàng tối thiểu 2 ký tự'),
  customer_phone: z
    .string()
    .regex(/^(0|\+84)[3|5|7|8|9][0-9]{8}$/, 'Số điện thoại không đúng định dạng'),
  checkin_location: z
    .object({
      lat: z.number().min(-90).max(90),
      lng: z.number().min(-180).max(180),
    })
    .optional(),
  checkin_address: z.string().optional(),
  proof_photos: z.array(z.string().url()).min(1, 'Cần ít nhất 1 ảnh bằng chứng thực địa'),
  notes: z.string().max(500, 'Ghi chú tối đa 500 ký tự').optional(),
});

export type CreateViewingProofInput = z.infer<typeof createViewingProofSchema>;

/**
 * 3. Zod Schema: Khởi tạo Hồ sơ Giao dịch / Phiếu chốt giá (Deal)
 */
export const createDealSchema = z.object({
  listing_id: z.string().uuid('Listing ID không hợp lệ'),
  property_code: z.string().min(3, 'Mã BĐS không hợp lệ').optional(),
  buyer_id: z.string().uuid('Buyer ID không hợp lệ'),
  lead_generator_id: z.string().uuid().optional().nullable(),
  closer_id: z.string().uuid().optional().nullable(),
  team_leader_id: z.string().uuid().optional().nullable(),
  agreed_price: z.number().positive('Giá chốt phải lớn hơn 0'),
  deposit_amount: z.number().positive('Số tiền cọc phải lớn hơn 0'),
  commission_rate_percent: z.number().min(0.5).max(10).default(2.0),
  notes: z.string().max(1000).optional(),
});

export type CreateDealInput = z.infer<typeof createDealSchema>;

/**
 * 4. Zod Schema: Phê duyệt Mốc Giải ngân Đa bên (Milestone Approval)
 */
export const approveMilestoneSchema = z.object({
  milestone_id: z.string().uuid('Milestone ID không hợp lệ'),
  role: z.enum(['buyer', 'seller', 'admin']),
  confirmed: z.boolean().refine((val) => val === true, 'Cần xác nhận đồng thuận'),
  signature_hash: z.string().optional(),
  notes: z.string().max(500).optional(),
});

export type ApproveMilestoneInput = z.infer<typeof approveMilestoneSchema>;

