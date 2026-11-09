/**
 * Hệ thống 4 Mã Định Danh Chuẩn — HaNoi Realty
 * 1. BDS-00125 : Mã căn nhà (listings)
 * 2. MG-00102  : Mã tài khoản CTV / TPKD (đồng thời là mã giới thiệu, cố định khi đổi gói)
 * 3. CN-00086  : Mã tài khoản chủ nhà
 * 4. HD-00035  : Mã hợp đồng
 */

// Regex kiểm tra định dạng chuẩn 4 mã
export const CODE_REGEX = {
  BDS: /^BDS-\d{5}$/i,
  MG: /^MG-\d{5}$/i,
  CN: /^CN-\d{5}$/i,
  HD: /^HD-\d{5}$/i,
  ANY: /^(BDS|MG|CN|HD)-\d{5}$/i,
};

/**
 * Format số hoặc chuỗi thành mã 5 chữ số
 */
export function formatCode(prefix: 'BDS' | 'MG' | 'CN' | 'HD', numOrStr: string | number): string {
  if (typeof numOrStr === 'string' && CODE_REGEX.ANY.test(numOrStr.trim())) {
    return numOrStr.trim().toUpperCase();
  }

  // Nếu là số hoặc chuỗi số
  const cleanNumber = typeof numOrStr === 'number'
    ? numOrStr
    : parseInt(String(numOrStr).replace(/\D/g, ''), 10);

  if (!isNaN(cleanNumber) && cleanNumber > 0) {
    return `${prefix}-${String(cleanNumber).padStart(5, '0')}`;
  }

  // Fallback băm ổn định (deterministic hash) từ chuỗi ID (ví dụ UUID hoặc mock-1)
  const str = String(numOrStr);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) % 90000;
  }
  const stableNum = Math.abs(hash) + 100;
  return `${prefix}-${String(stableNum).padStart(5, '0')}`;
}

export function formatBdsCode(numOrStr: string | number): string {
  return formatCode('BDS', numOrStr);
}

export function formatMgCode(numOrStr: string | number): string {
  return formatCode('MG', numOrStr);
}

export function formatCnCode(numOrStr: string | number): string {
  return formatCode('CN', numOrStr);
}

export function formatHdCode(numOrStr: string | number): string {
  return formatCode('HD', numOrStr);
}

/**
 * Trích xuất mã định danh từ từ khoá tìm kiếm (VD: 'bds-00125' -> 'BDS-00125')
 */
export function extractIdentificationCode(text: string): {
  type: 'BDS' | 'MG' | 'CN' | 'HD' | null;
  code: string | null;
} {
  if (!text) return { type: null, code: null };
  const trimmed = text.trim();

  // Khớp định dạng chuẩn có dấu gạch ngang: BDS-00125
  const match = trimmed.match(/^(BDS|MG|CN|HD)-?(\d{3,6})$/i);
  if (match) {
    const prefix = match[1].toUpperCase() as 'BDS' | 'MG' | 'CN' | 'HD';
    const num = match[2].padStart(5, '0');
    return {
      type: prefix,
      code: `${prefix}-${num}`,
    };
  }

  return { type: null, code: null };
}

/**
 * Lấy mã BĐS thực tế của 1 căn nhà (ưu tiên dữ liệu thật từ DB, nếu chưa có thì lấy mã fallback cố định)
 */
export function getListingIdentifier(listing: {
  id?: string;
  listing_code?: string | null;
  code?: string | null;
}, defaultIndex?: number): string {
  if (listing?.listing_code && CODE_REGEX.BDS.test(listing.listing_code)) {
    return listing.listing_code.toUpperCase();
  }
  if (listing?.code && CODE_REGEX.BDS.test(listing.code)) {
    return listing.code.toUpperCase();
  }
  if (defaultIndex !== undefined && defaultIndex >= 0) {
    return formatBdsCode(125 + defaultIndex);
  }
  return formatBdsCode(listing?.id || '1');
}

/**
 * Lấy mã CTV / Môi giới thực tế của người dùng (CHỈ tài khoản CTV/Môi giới mới có mã MG)
 */
export function getUserAgentCode(user: {
  id?: string;
  agentCode?: string | null;
  agent_code?: string | null;
  role?: string;
}): string | null {
  const isAgent = user?.role === 'agent' || user?.role === 'broker' || user?.role === 'agency';
  if (!isAgent) return null;

  if (user?.agentCode && CODE_REGEX.MG.test(user.agentCode)) {
    return user.agentCode.toUpperCase();
  }
  if (user?.agent_code && CODE_REGEX.MG.test(user.agent_code)) {
    return user.agent_code.toUpperCase();
  }
  return formatMgCode(user?.id || 102);
}

/**
 * Lấy mã Chủ nhà thực tế của người dùng (CHỈ tài khoản Chủ nhà mới có mã CN)
 */
export function getUserOwnerCode(user: {
  id?: string;
  ownerCode?: string | null;
  owner_code?: string | null;
  role?: string;
}): string | null {
  const isOwner = user?.role === 'owner';
  if (!isOwner) return null;

  if (user?.ownerCode && CODE_REGEX.CN.test(user.ownerCode)) {
    return user.ownerCode.toUpperCase();
  }
  if (user?.owner_code && CODE_REGEX.CN.test(user.owner_code)) {
    return user.owner_code.toUpperCase();
  }
  return formatCnCode(user?.id || 86);
}

