'use client';

import { useState } from 'react';
import {
  User,
  ShieldCheck,
  KeyRound,
  Save
} from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';

export function OwnerProfileTab() {
  const { user, setUser, addToast } = useApp();

  const [formData, setFormData] = useState({
    name: user?.name || 'Phạm Quốc Dũng',
    ownerCode: 'CN-00086',
    phone: user?.phone || '0988 765 432',
    email: user?.email || 'chunha@hanoirealty.vn',
    idCard: '001088******',
    idCardDate: '2022-08-15',
    address: 'Số 48 Phố Hàng Bông, Phường Hàng Bông, Quận Hoàn Kiếm, Hà Nội',
    bankAccount: '19038889999015',
    bankName: 'Techcombank - Chi nhánh Hoàn Kiếm',
    bankHolder: 'PHAM QUOC DUNG',
  });

  const [isChangingPass, setIsChangingPass] = useState(false);
  const [passData, setPassData] = useState({
    currentPass: '',
    newPass: '',
    confirmPass: '',
  });

  const handleSubmitProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser = {
      ...(user || {}),
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      ownerCode: formData.ownerCode,
    };
    setUser(updatedUser as any);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('hanoi_current_user', JSON.stringify(updatedUser));
      } catch {}
    }
    addToast('✅ Đã lưu thông tin hồ sơ chủ nhà thành công!', 'success');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passData.currentPass || !passData.newPass) {
      addToast('Vui lòng nhập đầy đủ mật khẩu', 'warning');
      return;
    }
    if (passData.newPass !== passData.confirmPass) {
      addToast('Mật khẩu mới xác nhận không khớp', 'error');
      return;
    }
    setIsChangingPass(false);
    setPassData({ currentPass: '', newPass: '', confirmPass: '' });
    addToast('🎉 Đã đổi mật khẩu tài khoản thành công!', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Tài khoản & Hồ sơ chủ nhà</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Quản lý thông tin định danh pháp lý, bảo mật và tài khoản nhận tiền giải ngân cọc
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Định danh CCCD chính chủ: ĐÃ DUYỆT</span>
          </span>
        </div>
      </div>

      {/* Form Thông Tin Hồ Sơ */}
      <form onSubmit={handleSubmitProfile} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="text-base font-bold text-slate-900">Thông tin cơ bản</h3>
          <p className="text-xs text-slate-500 mt-0.5">Thông tin dùng để đối chiếu khi ký hợp đồng đặt cọc và công chứng</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Họ và tên chủ sở hữu</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-900 focus:border-orange-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Mã định danh chủ nhà</label>
            <input
              type="text"
              value={formData.ownerCode}
              disabled
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 font-extrabold cursor-not-allowed"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Số điện thoại liên hệ</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-orange-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Địa chỉ Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-orange-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Số CCCD gắn chip (Đã xác minh)</label>
            <input
              type="text"
              value={formData.idCard}
              disabled
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 font-medium cursor-not-allowed"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Địa chỉ thường trú theo sổ đỏ</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-orange-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Thông tin tài khoản nhận tiền cọc Escrow */}
        <div className="border-t border-slate-100 pt-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Tài khoản ngân hàng thụ hưởng tiền cọc & bán nhà</h3>
              <p className="text-xs text-slate-500 mt-0.5">Tiền đặt cọc từ tài khoản Escrow sẽ được giải ngân trực tiếp vào số tài khoản này</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Số tài khoản</label>
              <input
                type="text"
                value={formData.bankAccount}
                onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-extrabold focus:border-orange-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Ngân hàng & Chi nhánh</label>
              <input
                type="text"
                value={formData.bankName}
                onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-orange-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Tên chủ tài khoản (In hoa không dấu)</label>
              <input
                type="text"
                value={formData.bankHolder}
                onChange={(e) => setFormData({ ...formData, bankHolder: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold focus:border-orange-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setIsChangingPass(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all"
          >
            <KeyRound className="w-4 h-4" />
            <span>Đổi mật khẩu</span>
          </button>

          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-orange-600 text-white hover:bg-orange-700 shadow-md transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Lưu thay đổi hồ sơ</span>
          </button>
        </div>
      </form>

      {/* Modal Đổi Mật Khẩu */}
      {isChangingPass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-100 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Đổi mật khẩu tài khoản chủ nhà</h3>
            <form onSubmit={handleChangePassword} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Mật khẩu hiện tại</label>
                <input
                  type="password"
                  value={passData.currentPass}
                  onChange={(e) => setPassData({ ...passData, currentPass: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
                  required
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Mật khẩu mới</label>
                <input
                  type="password"
                  value={passData.newPass}
                  onChange={(e) => setPassData({ ...passData, newPass: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
                  required
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Xác nhận mật khẩu mới</label>
                <input
                  type="password"
                  value={passData.confirmPass}
                  onChange={(e) => setPassData({ ...passData, confirmPass: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsChangingPass(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-orange-600 text-white font-bold hover:bg-orange-700"
                >
                  Lưu mật khẩu mới
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

