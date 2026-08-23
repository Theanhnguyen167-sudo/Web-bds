import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format Vietnamese currency:
 * 8500000000 -> "8.5 tỷ"
 * 850000000 -> "850 triệu"
 * 85000000 -> "85 triệu"
 */
export function formatCurrencyVND(amount: number): string {
  if (!amount || amount === 0) return "Thoả thuận";
  if (amount >= 1_000_000_000) {
    const ty = amount / 1_000_000_000;
    return `${ty % 1 === 0 ? ty : ty.toFixed(1)} tỷ`;
  }
  if (amount >= 1_000_000) {
    const trieu = amount / 1_000_000;
    return `${trieu % 1 === 0 ? trieu : trieu.toFixed(0)} triệu`;
  }
  return `${amount.toLocaleString("vi-VN")} đ`;
}

/**
 * Format price per m2
 * 85000000 -> "85 triệu/m²"
 */
export function formatPricePerM2(price: number, area: number): string {
  if (!price || !area || area <= 0) return "N/A";
  const perM2 = price / area;
  if (perM2 >= 1_000_000_000) {
    const ty = perM2 / 1_000_000_000;
    return `${ty.toFixed(1)} tỷ/m²`;
  }
  if (perM2 >= 1_000_000) {
    const trieu = perM2 / 1_000_000;
    return `${trieu.toFixed(1)} tr/m²`;
  }
  return `${Math.round(perM2).toLocaleString("vi-VN")} đ/m²`;
}

export function formatArea(area: number): string {
  return `${area} m²`;
}
