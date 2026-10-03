'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Calendar,
  Clock,
  User,
  Phone,
  CheckCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CalendarDays,
  Sparkles,
  MessageSquare
} from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';
import { NotificationItem } from '@/types/notification';

export interface BookingModalProps {
  agentName: string;
  agentPhone?: string;
  agentAvatar?: string;
  listingTitle: string;
  listingId: string;
  sellerId?: string;
  sellerEmail?: string;
  onClose: () => void;
}

const MORNING_SLOTS = ['08:30', '09:30', '10:30', '11:15'];
const AFTERNOON_SLOTS = ['14:00', '15:00', '16:00', '17:00'];
const EVENING_SLOTS = ['17:45', '18:30', '19:15'];

const VISIT_PURPOSES = [
  { id: 'buy', label: '🏠 Mua ở thực', desc: 'Xem thực tế để mua ở' },
  { id: 'invest', label: '💰 Đầu tư', desc: 'Khảo sát dòng tiền & tiềm năng' },
  { id: 'rent', label: '🔑 Thuê lâu dài', desc: 'Có nhu cầu thuê dài hạn' },
  { id: 'check', label: '👀 Tham khảo', desc: 'Tìm hiểu thị trường khu vực' },
];

const STORAGE_KEY_NOTIFICATIONS = 'hanoi_realty_notifications';
const STORAGE_KEY_APPOINTMENTS = 'hanoi_realty_appointments';

export default function BookingModal({
  agentName,
  agentPhone = '0988 123 456',
  agentAvatar,
  listingTitle,
  listingId,
  sellerId,
  sellerEmail,
  onClose,
}: BookingModalProps) {
  const { user, listings, addToast } = useApp();

  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Date/Time, 2: Info, 3: Success
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    // Mặc định là ngày mai
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  });
  const [selectedTime, setSelectedTime] = useState<string>('09:30');
  const [isCustomTime, setIsCustomTime] = useState<boolean>(false);
  const [customTimeInput, setCustomTimeInput] = useState<string>('');
  const [purpose, setPurpose] = useState<string>('buy');

  const [name, setName] = useState<string>(user?.name || '');
  const [phone, setPhone] = useState<string>(user?.phone || '');
  const [note, setNote] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [existingAppointments, setExistingAppointments] = useState<any[]>([]);

  // Load existing appointments for slot concurrency check
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const raw = localStorage.getItem(STORAGE_KEY_APPOINTMENTS);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            setExistingAppointments(parsed);
          }
        }
      }
    } catch {}
  }, []);

  // Sync user info when available
  useEffect(() => {
    if (user?.name && !name) setName(user.name);
    if (user?.phone && !phone) setPhone(user.phone);
  }, [user]);

  // Generate next 14 days starting from today (bao gồm cả Thứ 7 và Chủ Nhật)
  const availableDates = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  const formatDateLabel = (d: Date) => {
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    const tomorrow = new Date();
    tomorrow.setDate(now.getDate() + 1);
    const isTomorrow = d.toDateString() === tomorrow.toDateString();

    if (isToday) return `Hôm nay (${d.getDate()}/${d.getMonth() + 1})`;
    if (isTomorrow) return `Ngày mai (${d.getDate()}/${d.getMonth() + 1})`;

    return d.toLocaleDateString('vi-VN', {
      weekday: 'short',
      day: 'numeric',
      month: 'numeric',
    });
  };

  const formatFullDateVN = (d: Date) => {
    return d.toLocaleDateString('vi-VN', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const toISODateInput = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      const parts = e.target.value.split('-');
      if (parts.length === 3) {
        const newD = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        setSelectedDate(newD);
      }
    }
  };

  const handleCustomTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomTimeInput(val);
    if (val) {
      setSelectedTime(val);
      setIsCustomTime(true);
    }
  };

  const canProceedStep1 = Boolean(selectedDate && selectedTime);
  const canProceedStep2 = name.trim().length >= 2 && phone.trim().length >= 9;

  // Slot Concurrency Check: Kiểm tra xem khung giờ này trên BĐS này đã bị người khác đặt chưa
  const formattedSelectedDate = formatFullDateVN(selectedDate);
  const isSlotBooked = (timeSlot: string) => {
    return existingAppointments.some(
      (a) =>
        a.listingId === listingId &&
        a.date === formattedSelectedDate &&
        a.time === timeSlot &&
        a.status !== 'cancelled'
    );
  };

  const handleSubmit = async () => {
    if (!name.trim() || !phone.trim() || !selectedDate || !selectedTime) {
      addToast('Vui lòng điền đầy đủ họ tên và số điện thoại liên hệ.', 'warning');
      return;
    }

    // 1. Concurrency Guard (Optimistic Locking): Ngăn chặn Double-Booking
    if (isSlotBooked(selectedTime)) {
      addToast(
        `⚠️ Khung giờ ${selectedTime} ngày ${formattedSelectedDate} vừa có khách đặt trước. Vui lòng chọn khung giờ khác!`,
        'warning'
      );
      return;
    }

    // 2. Idempotency Check: Ngăn chặn gửi đúp cùng 1 yêu cầu liên tục
    const idempotencyKey = `${listingId}-${toISODateInput(selectedDate)}-${selectedTime}-${phone.trim()}`;
    const recentDuplicate = existingAppointments.find(
      (a) =>
        a.listingId === listingId &&
        a.date === formattedSelectedDate &&
        a.time === selectedTime &&
        a.buyerPhone === phone.trim() &&
        a.status !== 'cancelled'
    );
    if (recentDuplicate) {
      addToast('Thông tin hẹn xem nhà của bạn đã được ghi nhận trước đó!', 'info');
      setStep(3);
      return;
    }

    setIsSubmitting(true);

    try {
      const formattedDateStr = formattedSelectedDate;
      const notifId = `notif-visit-${Date.now()}`;
      const apptId = `appt-${Date.now()}`;

      // Xác định chủ sở hữu bài đăng (ownerId) để CHỈ gửi thông báo cho tài khoản đó
      const targetListing = listings.find((l) => l.id === listingId);
      const sellerOwnerId =
        sellerId ||
        targetListing?.ownerId ||
        targetListing?.userId ||
        targetListing?.createdBy ||
        (targetListing?.authorEmail ? targetListing.authorEmail : undefined) ||
        sellerEmail ||
        'u1';

      const finalSellerEmail = sellerEmail || targetListing?.authorEmail;

      // 1. Tạo thông báo mới chi tiết cho NGƯỜI BÁN (Chủ tin)
      const newNotif: NotificationItem = {
        id: notifId,
        recipientUserId: sellerOwnerId, // CHỈ chủ sở hữu tin đăng mới nhận thông báo
        type: 'appointment',
        title: 'Bạn có lịch hẹn xem nhà mới',
        message: `${name.trim()} đã đặt lịch xem "${listingTitle}" vào lúc ${selectedTime} ngày ${formattedDateStr}.`,
        content: `Khách hàng ${name.trim()} (SĐT: ${phone.trim()}) vừa đặt lịch hẹn xem căn "${listingTitle}" vào lúc ${selectedTime}, ${formattedDateStr}.${note.trim() ? ` Ghi chú: "${note.trim()}"` : ''}`,
        category: 'message',
        createdAt: 'Vừa xong',
        timestamp: Date.now(),
        isRead: false,
        link: `/listings/${listingId}`,
        tag: 'Hẹn xem nhà',
        listingId: listingId,
        appointmentId: apptId,
        appointmentData: {
          buyerName: name.trim(),
          buyerPhone: phone.trim(),
          date: formattedDateStr,
          time: selectedTime,
          listingId: listingId,
          listingTitle: listingTitle,
          sellerId: sellerOwnerId,
          sellerEmail: finalSellerEmail,
          note: note.trim() || undefined,
          purpose: VISIT_PURPOSES.find(p => p.id === purpose)?.label,
          createdAt: new Date().toISOString(),
          status: 'pending'
        }
      };

      // 2. Lưu vào danh sách thông báo người bán trong LocalStorage
      if (typeof window !== 'undefined') {
        const existingRaw = localStorage.getItem(STORAGE_KEY_NOTIFICATIONS);
        const existingNotifs: NotificationItem[] = existingRaw ? JSON.parse(existingRaw) : [];
        const updatedNotifs = [newNotif, ...existingNotifs.filter(n => n.id !== newNotif.id)];
        localStorage.setItem(STORAGE_KEY_NOTIFICATIONS, JSON.stringify(updatedNotifs));

        // 3. Lưu vào lịch sử đặt hẹn
        const existingApptsRaw = localStorage.getItem(STORAGE_KEY_APPOINTMENTS);
        const existingAppts = existingApptsRaw ? JSON.parse(existingApptsRaw) : [];
        const newAppt = {
          id: apptId,
          sellerId: sellerOwnerId,
          sellerEmail: finalSellerEmail,
          buyerName: name.trim(),
          buyerPhone: phone.trim(),
          date: formattedDateStr,
          time: selectedTime,
          listingId,
          listingTitle,
          note: note.trim(),
          purpose,
          agentName,
          agentPhone,
          createdAt: new Date().toISOString(),
          status: 'pending'
        };
        localStorage.setItem(STORAGE_KEY_APPOINTMENTS, JSON.stringify([newAppt, ...existingAppts]));

        // 4. Phát sự kiện toàn cục để chuông thông báo (NotificationBell) và Dashboard cập nhật ngay lập tức
        window.dispatchEvent(new CustomEvent('hanoi_new_notification', { detail: newNotif }));
        window.dispatchEvent(new CustomEvent('hanoi_appointments_updated', { detail: newAppt }));
        window.dispatchEvent(new Event('hanoi_notifications_updated'));
      }

      // 5. Hiển thị thông báo Toast thành công
      addToast(
        `🎉 Đã đặt lịch xem nhà thành công! Thông báo đã được chuyển tới người bán ${agentName}.`,
        'success'
      );

      // Chuyển sang màn hình xác nhận hoàn tất
      setStep(3);
    } catch (err) {
      console.warn('Lỗi khi gửi đặt lịch xem nhà:', err);
      addToast('Có lỗi xảy ra khi gửi yêu cầu, vui lòng thử lại.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const todayISO = toISODateInput(new Date());

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" />

      {/* Modal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[92vh] flex flex-col border border-slate-200"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-5 flex items-center justify-between text-white shrink-0">
          <div className="flex items-center gap-3 min-w-0 pr-2">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-orange-500/20 text-orange-400 border border-orange-500/30">
              <Calendar className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h2 className="font-extrabold text-base sm:text-lg text-white leading-tight flex items-center gap-2">
                <span>Đặt Lịch Hẹn Xem Nhà</span>
                <span className="rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 border border-emerald-500/30">
                  Miễn phí 100%
                </span>
              </h2>
              <p className="text-slate-300 text-xs truncate mt-0.5 font-medium">
                {listingTitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1.5 rounded-xl hover:bg-white/10 shrink-0"
            title="Đóng"
          >
            <X size={20} />
          </button>
        </div>

        {/* Seller Info Bar */}
        <div className="px-5 py-2.5 bg-orange-50/70 border-b border-orange-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Người đăng bán:</span>
            <span className="font-bold text-slate-800">{agentName}</span>
          </div>
          <div className="flex items-center gap-1.5 text-orange-700 font-semibold text-[11px]">
            <Phone className="h-3 w-3 text-orange-600" />
            <span>{agentPhone}</span>
          </div>
        </div>

        {/* Step Indicator */}
        {step < 3 && (
          <div className="px-5 pt-3.5 pb-1 shrink-0">
            <div className="flex items-center gap-2">
              {[
                { n: 1, label: '1. Chọn ngày & giờ' },
                { n: 2, label: '2. Thông tin liên hệ' },
              ].map((s, i) => (
                <div key={s.n} className="flex items-center gap-2 flex-1">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      step >= s.n
                        ? 'bg-orange-500 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {step > s.n ? <CheckCircle size={13} /> : s.n}
                  </div>
                  <span
                    className={`text-xs font-bold ${
                      step >= s.n ? 'text-slate-900' : 'text-slate-400'
                    }`}
                  >
                    {s.label}
                  </span>
                  {i < 1 && (
                    <div
                      className={`flex-1 h-0.5 ${
                        step > s.n ? 'bg-orange-500' : 'bg-slate-200'
                      } transition-colors`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          <AnimatePresence mode="wait">
            {/* ── BƯỚC 1: CHỌN NGÀY VÀ GIỜ ── */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                className="space-y-4"
              >
                {/* 1. Chọn ngày xem nhà */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <CalendarDays className="h-4 w-4 text-orange-500" />
                      <span>Chọn ngày xem nhà:</span>
                    </label>
                    <span className="text-[11px] font-bold text-orange-600 bg-orange-100/70 px-2 py-0.5 rounded-md">
                      {formatFullDateVN(selectedDate)}
                    </span>
                  </div>

                  {/* Nút chọn nhanh các ngày gần nhất */}
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
                    {availableDates.slice(0, 8).map((date) => {
                      const isSelected = selectedDate.toDateString() === date.toDateString();
                      return (
                        <button
                          key={date.toISOString()}
                          type="button"
                          onClick={() => setSelectedDate(date)}
                          className={`py-2 px-2 rounded-xl text-[11px] font-semibold text-center border transition-all ${
                            isSelected
                              ? 'border-orange-500 bg-orange-500 text-white shadow-sm ring-2 ring-orange-400/30'
                              : 'border-slate-200 bg-slate-50/80 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                          }`}
                        >
                          {formatDateLabel(date)}
                        </button>
                      );
                    })}
                  </div>

                  {/* Hoặc chọn ngày trực tiếp trên lịch */}
                  <div className="pt-1 flex items-center gap-2">
                    <span className="text-[11px] text-slate-500 shrink-0 font-medium">Hoặc mở lịch:</span>
                    <input
                      type="date"
                      min={todayISO}
                      value={toISODateInput(selectedDate)}
                      onChange={handleDateInputChange}
                      className="flex-1 py-1.5 px-3 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:border-orange-500 cursor-pointer shadow-xs"
                    />
                  </div>
                </div>

                {/* 2. Chọn giờ xem nhà */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-orange-500" />
                      <span>Chọn khung giờ phù hợp:</span>
                    </label>
                    <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      Giờ đã chọn: {selectedTime}
                    </span>
                  </div>

                  {/* Buổi sáng */}
                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block mb-1">
                      Buổi sáng:
                    </span>
                    <div className="grid grid-cols-4 gap-1.5">
                      {MORNING_SLOTS.map((t) => {
                        const isSelected = selectedTime === t && !isCustomTime;
                        const booked = isSlotBooked(t);

                        return (
                          <button
                            key={t}
                            type="button"
                            disabled={booked}
                            onClick={() => {
                              if (booked) return;
                              setSelectedTime(t);
                              setIsCustomTime(false);
                            }}
                            className={`py-2 rounded-xl text-xs font-bold border transition-all relative ${
                              booked
                                ? 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed line-through opacity-60'
                                : isSelected
                                ? 'border-orange-500 bg-orange-500 text-white shadow-sm ring-2 ring-orange-400/30'
                                : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                            }`}
                            title={booked ? 'Khung giờ này đã có khách hẹn' : undefined}
                          >
                            <span>{t}</span>
                            {booked && (
                              <span className="block text-[8px] no-underline font-normal text-rose-500">Đã kín</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Buổi chiều */}
                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block mb-1">
                      Buổi chiều:
                    </span>
                    <div className="grid grid-cols-4 gap-1.5">
                      {AFTERNOON_SLOTS.map((t) => {
                        const isSelected = selectedTime === t && !isCustomTime;
                        const booked = isSlotBooked(t);

                        return (
                          <button
                            key={t}
                            type="button"
                            disabled={booked}
                            onClick={() => {
                              if (booked) return;
                              setSelectedTime(t);
                              setIsCustomTime(false);
                            }}
                            className={`py-2 rounded-xl text-xs font-bold border transition-all relative ${
                              booked
                                ? 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed line-through opacity-60'
                                : isSelected
                                ? 'border-orange-500 bg-orange-500 text-white shadow-sm ring-2 ring-orange-400/30'
                                : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                            }`}
                            title={booked ? 'Khung giờ này đã có khách hẹn' : undefined}
                          >
                            <span>{t}</span>
                            {booked && (
                              <span className="block text-[8px] no-underline font-normal text-rose-500">Đã kín</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Buổi tối & Giờ khác */}
                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block mb-1">
                      Buổi tối & Giờ khác:
                    </span>
                    <div className="grid grid-cols-3 gap-1.5">
                      {EVENING_SLOTS.map((t) => {
                        const isSelected = selectedTime === t && !isCustomTime;
                        const booked = isSlotBooked(t);

                        return (
                          <button
                            key={t}
                            type="button"
                            disabled={booked}
                            onClick={() => {
                              if (booked) return;
                              setSelectedTime(t);
                              setIsCustomTime(false);
                            }}
                            className={`py-2 rounded-xl text-xs font-bold border transition-all relative ${
                              booked
                                ? 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed line-through opacity-60'
                                : isSelected
                                ? 'border-orange-500 bg-orange-500 text-white shadow-sm ring-2 ring-orange-400/30'
                                : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                            }`}
                            title={booked ? 'Khung giờ này đã có khách hẹn' : undefined}
                          >
                            <span>{t}</span>
                            {booked && (
                              <span className="block text-[8px] no-underline font-normal text-rose-500">Đã kín</span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    <div className="pt-2 flex items-center gap-2">
                      <span className="text-[11px] text-slate-500 shrink-0 font-medium">Hoặc nhập giờ:</span>
                      <input
                        type="time"
                        value={customTimeInput || selectedTime}
                        onChange={handleCustomTimeChange}
                        className="py-1.5 px-3 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-800 focus:outline-none focus:border-orange-500 shadow-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Mục đích xem nhà */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <label className="text-xs font-bold text-slate-800 block">
                    Mục đích của bạn (tuỳ chọn):
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {VISIT_PURPOSES.map((p) => {
                      const isSelected = purpose === p.id;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setPurpose(p.id)}
                          className={`p-2 rounded-xl text-left border transition-all ${
                            isSelected
                              ? 'border-orange-500 bg-orange-50/80 text-orange-900 ring-1 ring-orange-400'
                              : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100'
                          }`}
                        >
                          <p className="text-xs font-bold">{p.label}</p>
                          <p className="text-[10px] text-slate-500">{p.desc}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── BƯỚC 2: THÔNG TIN LIÊN HỆ NGƯỜI MUA ── */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                className="space-y-3.5"
              >
                {/* Tóm tắt lịch hẹn */}
                <div className="bg-orange-50/80 border border-orange-200/80 rounded-2xl p-3.5 space-y-1">
                  <span className="text-[11px] font-extrabold text-orange-800 uppercase tracking-wide">
                    📋 Lịch xem bạn đã chọn:
                  </span>
                  <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-slate-800">
                    <span className="flex items-center gap-1.5 text-orange-700">
                      <Calendar size={14} className="text-orange-600" />
                      {formatFullDateVN(selectedDate)}
                    </span>
                    <span className="flex items-center gap-1.5 text-emerald-700">
                      <Clock size={14} className="text-emerald-600" />
                      {selectedTime}
                    </span>
                  </div>
                </div>

                {/* Họ tên */}
                <div>
                  <label className="text-xs font-bold text-slate-800 mb-1 block">
                    Họ và tên người xem nhà <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User size={15} className="absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      placeholder="VD: Nguyễn Văn Nam"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all shadow-xs"
                    />
                  </div>
                </div>

                {/* Số điện thoại */}
                <div>
                  <label className="text-xs font-bold text-slate-800 mb-1 block">
                    Số điện thoại liên hệ <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone size={15} className="absolute left-3 top-3 text-slate-400" />
                    <input
                      type="tel"
                      placeholder="VD: 0912 345 678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all shadow-xs"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Người bán sẽ liên hệ lại xác nhận lịch hẹn qua số điện thoại này.
                  </p>
                </div>

                {/* Ghi chú thêm */}
                <div>
                  <label className="text-xs font-bold text-slate-800 mb-1 block">
                    Ghi chú thêm cho người bán (tuỳ chọn):
                  </label>
                  <textarea
                    rows={2}
                    placeholder="VD: Tôi muốn xem sổ đỏ và kiểm tra kết cấu tầng thượng..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all resize-none shadow-xs"
                  />
                </div>

                {/* Cam kết */}
                <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-200 text-[11px] text-slate-600 flex items-start gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <p>
                    Thông tin được gửi trực tiếp tới <strong>chuông thông báo của {agentName}</strong> để kịp thời sắp xếp và đón tiếp bạn chu đáo.
                  </p>
                </div>
              </motion.div>
            )}

            {/* ── BƯỚC 3: ĐẶT LỊCH THÀNH CÔNG ── */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="py-4 text-center space-y-4"
              >
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-3xl mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/10">
                  <CheckCircle size={36} />
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900">
                    Đặt Lịch Hẹn Xem Nhà Thành Công! 🎉
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto leading-relaxed">
                    Yêu cầu đã được gửi đến <strong>hộp thông báo của người bán ({agentName})</strong>. Người bán sẽ chủ động gọi điện hoặc nhắn tin Zalo xác nhận sớm nhất.
                  </p>
                </div>

                {/* Chi tiết đã đặt */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-left text-xs space-y-2 max-w-sm mx-auto">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500">Bất động sản:</span>
                    <span className="font-bold text-slate-900 truncate max-w-[200px]">
                      {listingTitle}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500">Thời gian hẹn:</span>
                    <span className="font-extrabold text-orange-600">
                      {selectedTime} • {formatFullDateVN(selectedDate)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Người đặt lịch:</span>
                    <span className="font-semibold text-slate-800">
                      {name} ({phone})
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-md shadow-orange-500/25 transition-all"
                  >
                    Hoàn tất & Đóng
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Actions (Step 1 & 2) */}
        {step < 3 && (
          <div className="p-4 sm:p-5 border-t border-slate-100 flex items-center gap-3 shrink-0 bg-slate-50/50">
            {step === 2 && (
              <button
                type="button"
                onClick={() => setStep(1)}
                className="py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors flex items-center gap-1.5"
              >
                <ChevronLeft size={16} />
                <span>Quay lại</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                if (step === 1 && canProceedStep1) setStep(2);
                else if (step === 2 && canProceedStep2) handleSubmit();
              }}
              disabled={
                (step === 1 && !canProceedStep1) ||
                (step === 2 && (!canProceedStep2 || isSubmitting))
              }
              className="flex-1 py-3 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-extrabold text-xs shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Đang gửi thông báo tới người bán...</span>
                </>
              ) : step === 1 ? (
                <>
                  <span>Tiếp tục: Nhập thông tin liên hệ</span>
                  <ChevronRight size={16} />
                </>
              ) : (
                <>
                  <CheckCircle size={16} />
                  <span>Xác nhận gửi lịch hẹn tới người bán</span>
                </>
              )}
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

