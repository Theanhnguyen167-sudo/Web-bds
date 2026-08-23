'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { mockAdminPackages, AdminPackage } from '@/lib/admin-data';
import { formatCurrencyVND } from '@/lib/utils';
import { useApp } from '@/lib/context/AppContext';
import {
  Package,
  Edit,
  Check,
  X,
  Plus,
  Tag,
  Users,
  DollarSign,
  TrendingUp,
  Save,
  Trash2
} from 'lucide-react';

interface DiscountCode {
  id: string;
  code: string;
  discount: string;
  applicableTo: string;
  usedCount: number;
  maxUses: number;
  expiresAt: string;
  status: 'active' | 'expired';
}

export default function AdminPackagesPage() {
  const { addToast } = useApp();
  const [packages, setPackages] = useState<AdminPackage[]>(mockAdminPackages);
  const [editingPackage, setEditingPackage] = useState<AdminPackage | null>(null);

  // Discount Codes
  const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>([
    {
      id: 'dc1',
      code: 'VIP2025',
      discount: '20%',
      applicableTo: 'Gói Pro & Agency',
      usedCount: 48,
      maxUses: 100,
      expiresAt: '2025-12-31',
      status: 'active',
    },
    {
      id: 'dc2',
      code: 'PROPTECH30',
      discount: '30%',
      applicableTo: 'Gói Basic',
      usedCount: 100,
      maxUses: 100,
      expiresAt: '2025-08-01',
      status: 'expired',
    },
  ]);

  const [newCode, setNewCode] = useState('');
  const [newDiscount, setNewDiscount] = useState('15%');
  const [showAddCode, setShowAddCode] = useState(false);

  const handleSavePackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPackage) return;
    setPackages((prev) =>
      prev.map((p) => (p.id === editingPackage.id ? editingPackage : p))
    );
    addToast(`Đã cập nhật cấu hình gói ${editingPackage.name}`, 'success');
    setEditingPackage(null);
  };

  const handleAddDiscountCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode) return;
    const item: DiscountCode = {
      id: 'dc_' + Date.now(),
      code: newCode.toUpperCase(),
      discount: newDiscount,
      applicableTo: 'Tất cả các gói',
      usedCount: 0,
      maxUses: 50,
      expiresAt: '2025-12-31',
      status: 'active',
    };
    setDiscountCodes([...discountCodes, item]);
    setNewCode('');
    setShowAddCode(false);
    addToast(`Đã tạo mã giảm giá: ${item.code}`, 'success');
  };

  return (
    <div className="flex-1 flex flex-col relative">
      <AdminHeader title="Quản lý Gói Dịch vụ" breadcrumb="Gói dịch vụ" />

      <main className="p-6 space-y-8 max-w-7xl">
        {/* ── 4 PACKAGE CARDS ── */}
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-extrabold text-navy">Gói Thành viên & Giá dịch vụ</h2>
            <p className="text-xs text-slate-500">
              Cấu hình quyền lợi tin đăng, báo cáo AI và mức giá định kỳ
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className={`bg-white rounded-2xl p-5 border flex flex-col justify-between shadow-2xs transition-all ${
                  pkg.isHighlighted
                    ? 'border-orange-500 ring-2 ring-orange-500/10'
                    : 'border-slate-200'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-base text-navy">{pkg.name}</span>
                    {pkg.isHighlighted && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-orange-500 text-white">
                        Phổ biến
                      </span>
                    )}
                  </div>

                  <div>
                    <span className="text-2xl font-black text-orange-600">
                      {pkg.priceMonth === 0 ? 'Miễn phí' : formatCurrencyVND(pkg.priceMonth)}
                    </span>
                    {pkg.priceMonth > 0 && (
                      <span className="text-xs text-slate-400">/tháng</span>
                    )}
                  </div>

                  {/* Limits summary */}
                  <div className="p-3 rounded-xl bg-slate-50 text-xs space-y-1 text-slate-600">
                    <div className="flex justify-between">
                      <span>Tin đăng:</span>
                      <strong>{pkg.maxListings === -1 ? 'Không giới hạn' : `${pkg.maxListings} tin`}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Thời hạn:</span>
                      <strong>{pkg.durationDays} ngày</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Báo cáo AI:</span>
                      <strong>{pkg.aiReportsPerMonth === -1 ? 'Không giới hạn' : `${pkg.aiReportsPerMonth}/tháng`}</strong>
                    </div>
                  </div>

                  {/* Feature list */}
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    {pkg.features.map((f, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-5 border-t border-slate-100 mt-4">
                  <button
                    onClick={() => setEditingPackage({ ...pkg })}
                    className="w-full py-2 bg-slate-100 hover:bg-orange-50 text-slate-700 hover:text-orange-600 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Edit className="h-3.5 w-3.5" /> Sửa gói
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── SUBSCRIBERS STATS TABLE ── */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
          <h3 className="font-extrabold text-sm text-navy flex items-center gap-2">
            <Users className="h-4 w-4 text-orange-500" />
            <span>Thống kê người dùng theo gói</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] font-bold uppercase text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Gói dịch vụ</th>
                  <th className="px-4 py-3">Số người dùng</th>
                  <th className="px-4 py-3">Doanh thu tháng</th>
                  <th className="px-4 py-3">Tỷ lệ gia hạn</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {packages.map((pkg) => (
                  <tr key={pkg.id}>
                    <td className="px-4 py-3 font-bold text-navy">{pkg.name}</td>
                    <td className="px-4 py-3 font-semibold">{pkg.subscribersCount.toLocaleString()} users</td>
                    <td className="px-4 py-3 font-bold text-orange-600">
                      {formatCurrencyVND(pkg.monthlyRevenue)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-emerald-500 h-full rounded-full"
                            style={{ width: `${pkg.retentionRate}%` }}
                          />
                        </div>
                        <span className="font-bold text-slate-700">{pkg.retentionRate}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── DISCOUNT CODES SECTION ── */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm text-navy flex items-center gap-2">
                <Tag className="h-4 w-4 text-orange-500" />
                <span>Mã giảm giá & Khuyến mãi</span>
              </h3>
              <p className="text-xs text-slate-400">Tạo mã ưu đãi khi nâng cấp gói VIP</p>
            </div>

            <button
              onClick={() => setShowAddCode(true)}
              className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-2xs flex items-center gap-1"
            >
              <Plus className="h-3.5 w-3.5" /> Tạo mã mới
            </button>
          </div>

          {/* Add Code Inline Form */}
          {showAddCode && (
            <form
              onSubmit={handleAddDiscountCode}
              className="p-4 bg-orange-50/50 border border-orange-200 rounded-xl grid grid-cols-1 sm:grid-cols-4 gap-3 items-end text-xs"
            >
              <div>
                <label className="font-bold text-navy block mb-1">Mã code</label>
                <input
                  type="text"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  placeholder="VD: SUMMER2025"
                  className="w-full p-2 bg-white border border-slate-200 rounded-lg outline-none font-mono uppercase"
                  required
                />
              </div>
              <div>
                <label className="font-bold text-navy block mb-1">Mức giảm</label>
                <select
                  value={newDiscount}
                  onChange={(e) => setNewDiscount(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-200 rounded-lg outline-none"
                >
                  <option value="10%">10%</option>
                  <option value="15%">15%</option>
                  <option value="20%">20%</option>
                  <option value="30%">30%</option>
                  <option value="50%">50%</option>
                </select>
              </div>
              <div>
                <label className="font-bold text-navy block mb-1">Số lượt</label>
                <input
                  type="number"
                  defaultValue={50}
                  className="w-full p-2 bg-white border border-slate-200 rounded-lg outline-none"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-orange-500 text-white font-bold rounded-lg"
                >
                  Lưu
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddCode(false)}
                  className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-600"
                >
                  Hủy
                </button>
              </div>
            </form>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] font-bold uppercase text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Mã code</th>
                  <th className="px-4 py-3">Mức giảm</th>
                  <th className="px-4 py-3">Áp dụng</th>
                  <th className="px-4 py-3">Đã dùng</th>
                  <th className="px-4 py-3">Hạn dùng</th>
                  <th className="px-4 py-3">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {discountCodes.map((code) => (
                  <tr key={code.id}>
                    <td className="px-4 py-3 font-mono font-bold text-orange-600">{code.code}</td>
                    <td className="px-4 py-3 font-bold text-emerald-600">{code.discount}</td>
                    <td className="px-4 py-3">{code.applicableTo}</td>
                    <td className="px-4 py-3 font-semibold">{code.usedCount}/{code.maxUses}</td>
                    <td className="px-4 py-3 text-slate-400">{code.expiresAt}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          code.status === 'active'
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        {code.status === 'active' ? 'Đang kích hoạt' : 'Đã hết hạn'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* ── EDIT PACKAGE MODAL ── */}
      <AnimatePresence>
        {editingPackage && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingPackage(null)}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-2xl shadow-2xl z-50 p-6 space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-extrabold text-base text-navy">
                  Chỉnh sửa Gói: {editingPackage.name}
                </h3>
                <button
                  onClick={() => setEditingPackage(null)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleSavePackage} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-navy block mb-1">Tên gói</label>
                  <input
                    type="text"
                    value={editingPackage.name}
                    onChange={(e) =>
                      setEditingPackage({ ...editingPackage, name: e.target.value })
                    }
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-navy block mb-1">Giá tháng (VNĐ)</label>
                    <input
                      type="number"
                      value={editingPackage.priceMonth}
                      onChange={(e) =>
                        setEditingPackage({
                          ...editingPackage,
                          priceMonth: Number(e.target.value),
                        })
                      }
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-orange-600 font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-navy block mb-1">Giá năm (VNĐ)</label>
                    <input
                      type="number"
                      value={editingPackage.priceYear}
                      onChange={(e) =>
                        setEditingPackage({
                          ...editingPackage,
                          priceYear: Number(e.target.value),
                        })
                      }
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-orange-600 font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-navy block mb-1">Số tin tối đa (-1 = Vô hạn)</label>
                    <input
                      type="number"
                      value={editingPackage.maxListings}
                      onChange={(e) =>
                        setEditingPackage({
                          ...editingPackage,
                          maxListings: Number(e.target.value),
                        })
                      }
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-navy block mb-1">Thời hạn tin (ngày)</label>
                    <input
                      type="number"
                      value={editingPackage.durationDays}
                      onChange={(e) =>
                        setEditingPackage({
                          ...editingPackage,
                          durationDays: Number(e.target.value),
                        })
                      }
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-navy block mb-1">Báo cáo AI/tháng</label>
                    <input
                      type="number"
                      value={editingPackage.aiReportsPerMonth}
                      onChange={(e) =>
                        setEditingPackage({
                          ...editingPackage,
                          aiReportsPerMonth: Number(e.target.value),
                        })
                      }
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-navy block mb-1">Tin nổi bật/tháng</label>
                    <input
                      type="number"
                      value={editingPackage.featuredPerMonth}
                      onChange={(e) =>
                        setEditingPackage({
                          ...editingPackage,
                          featuredPerMonth: Number(e.target.value),
                        })
                      }
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                    />
                  </div>
                </div>

                {/* Toggles */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingPackage.hasPdfExport}
                      onChange={(e) =>
                        setEditingPackage({
                          ...editingPackage,
                          hasPdfExport: e.target.checked,
                        })
                      }
                      className="rounded text-orange-500"
                    />
                    <span className="font-bold text-navy">Cho phép Xuất file PDF Báo cáo</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingPackage.isHighlighted}
                      onChange={(e) =>
                        setEditingPackage({
                          ...editingPackage,
                          isHighlighted: e.target.checked,
                        })
                      }
                      className="rounded text-orange-500"
                    />
                    <span className="font-bold text-navy">Đánh dấu gói "Phổ biến nhất"</span>
                  </label>
                </div>

                <div className="flex gap-2 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setEditingPackage(null)}
                    className="flex-1 py-2.5 border border-slate-200 bg-white text-slate-700 font-bold rounded-xl"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-md"
                  >
                    💾 Lưu thay đổi
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
