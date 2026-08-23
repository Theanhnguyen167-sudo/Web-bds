'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, Clock, User, Phone, 
         CheckCircle, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'

export interface BookingModalProps {
  agentName: string
  listingTitle: string
  listingId: string
  onClose: () => void
}

const TIME_SLOTS = [
  '08:00', '09:00', '10:00', '11:00',
  '14:00', '15:00', '16:00', '17:00'
]

const VISIT_PURPOSES = [
  { id: 'buy', label: '🏠 Muốn mua', desc: 'Xem để mua' },
  { id: 'invest', label: '💰 Đầu tư', desc: 'Mục đích đầu tư' },
  { id: 'rent', label: '🔑 Thuê', desc: 'Muốn thuê dài hạn' },
  { id: 'check', label: '👀 Tham khảo', desc: 'Xem cho biết' },
]

export default function BookingModal({ agentName, listingTitle, listingId, onClose }: BookingModalProps) {
  const [step, setStep] = useState(1) // 1: Date/Time, 2: Info, 3: Success
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [purpose, setPurpose] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [note, setNote] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Generate next 14 days as available dates
  const availableDates = Array.from({ length: 14 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() + i + 1)
    return date
  }).filter(d => d.getDay() !== 0) // exclude Sundays

  const formatDate = (date: Date) =>
    date.toLocaleDateString('vi-VN', { weekday: 'short', day: 'numeric', month: 'numeric' })

  const handleSubmit = async () => {
    if (!name || !phone || !selectedDate || !selectedTime) return
    setIsSubmitting(true)
    // Mock API call - simulate booking submission
    await new Promise(r => setTimeout(r, 1500))
    setIsSubmitting(false)
    setStep(3)
  }

  const canProceedStep1 = selectedDate && selectedTime && purpose
  const canProceedStep2 = name.trim().length >= 2 && phone.trim().length >= 10

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg 
                   overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="bg-navy p-5 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-white font-bold text-lg">📅 Đặt lịch xem nhà</h2>
            <p className="text-white/60 text-sm mt-0.5 line-clamp-1">
              {listingTitle}
            </p>
          </div>
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="text-white/60 hover:text-white transition-colors p-1"
          >
            <X size={20} />
          </motion.button>
        </div>

        {/* Step indicator */}
        {step < 3 && (
          <div className="px-5 pt-4 flex-shrink-0">
            <div className="flex items-center gap-2">
              {[
                { n: 1, label: 'Chọn lịch' },
                { n: 2, label: 'Thông tin' },
              ].map((s, i) => (
                <div key={s.n} className="flex items-center gap-2 flex-1">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center 
                                  text-xs font-bold transition-colors ${
                    step >= s.n ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {step > s.n ? <CheckCircle size={14} /> : s.n}
                  </div>
                  <span className={`text-xs font-medium ${
                    step >= s.n ? 'text-navy' : 'text-gray-400'
                  }`}>{s.label}</span>
                  {i < 1 && (
                    <div className={`flex-1 h-0.5 ${
                      step > s.n ? 'bg-orange-500' : 'bg-gray-100'
                    } transition-colors`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          <AnimatePresence mode="wait">
            {/* ── Step 1: Date & Time ── */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                {/* Date Selection */}
                <div>
                  <p className="text-sm font-semibold text-navy mb-3">
                    📆 Chọn ngày xem
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {availableDates.map(date => (
                      <motion.button
                        key={date.toISOString()}
                        onClick={() => setSelectedDate(date)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-3 py-2 rounded-xl text-xs font-medium 
                                   border-2 transition-all ${
                          selectedDate?.toDateString() === date.toDateString()
                            ? 'border-orange-500 bg-orange-50 text-orange-600 font-bold'
                            : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        {formatDate(date)}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Time Slots */}
                <div>
                  <p className="text-sm font-semibold text-navy mb-3">
                    ⏰ Chọn giờ xem
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    {TIME_SLOTS.map(time => (
                      <motion.button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`py-2 rounded-xl text-sm font-medium 
                                   border-2 transition-all ${
                          selectedTime === time
                            ? 'border-orange-500 bg-orange-500 text-white font-bold'
                            : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        {time}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Purpose */}
                <div>
                  <p className="text-sm font-semibold text-navy mb-3">
                    🎯 Mục đích xem nhà
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {VISIT_PURPOSES.map(p => (
                      <motion.button
                        key={p.id}
                        onClick={() => setPurpose(p.id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`p-3 rounded-xl text-left border-2 transition-all ${
                          purpose === p.id
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <p className="text-sm font-medium text-navy">{p.label}</p>
                        <p className="text-xs text-gray-500">{p.desc}</p>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── Step 2: Contact Info ── */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                {/* Booking Summary */}
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                  <p className="text-xs font-semibold text-orange-700 mb-2">
                    📋 Thông tin lịch hẹn
                  </p>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-1.5 text-sm text-navy">
                      <Calendar size={14} className="text-orange-500" />
                      {selectedDate && formatDate(selectedDate)}
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-navy">
                      <Clock size={14} className="text-orange-500" />
                      {selectedTime}
                    </div>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="text-sm font-medium text-navy mb-1.5 block">
                    Họ và tên *
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-3.5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Nguyễn Văn A"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full pl-9 pr-4 py-3 rounded-xl border-2 border-gray-200 
                                 text-sm focus:border-orange-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="text-sm font-medium text-navy mb-1.5 block">
                    Số điện thoại *
                  </label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3 top-3.5 text-gray-400" />
                    <input
                      type="tel"
                      placeholder="0901 234 567"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full pl-9 pr-4 py-3 rounded-xl border-2 border-gray-200 
                                 text-sm focus:border-orange-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Note */}
                <div>
                  <label className="text-sm font-medium text-navy mb-1.5 block">
                    Ghi chú thêm (tuỳ chọn)
                  </label>
                  <textarea
                    placeholder="VD: Tôi muốn xem thêm tầng thượng, sân thượng..."
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 
                               text-sm focus:border-orange-500 focus:outline-none 
                               transition-colors resize-none"
                  />
                </div>

                <p className="text-xs text-gray-400">
                  🔒 Thông tin của bạn được bảo mật hoàn toàn. 
                  Chuyên viên {agentName} sẽ xác nhận lịch qua điện thoại.
                </p>
              </motion.div>
            )}

            {/* ── Step 3: Success ── */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center py-8 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    type: 'spring', 
                    stiffness: 200, 
                    damping: 15,
                    delay: 0.1
                  }}
                  className="w-20 h-20 bg-green-100 rounded-full flex items-center 
                             justify-center mb-5"
                >
                  <CheckCircle size={40} className="text-green-500" />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3 className="text-xl font-bold text-navy mb-2">
                    Đặt lịch thành công! 🎉
                  </h3>
                  <p className="text-gray-500 text-sm mb-6">
                    Chuyên viên <strong>{agentName}</strong> sẽ liên hệ xác nhận
                    lịch xem nhà vào{' '}
                    <strong className="text-orange-500">
                      {selectedTime} {selectedDate && formatDate(selectedDate)}
                    </strong>
                  </p>

                  <div className="bg-gray-50 rounded-xl p-4 text-left text-sm mb-6 space-y-2">
                    <p className="text-gray-600">
                      📱 Thông báo SMS sẽ được gửi đến <strong>{phone}</strong>
                    </p>
                    <p className="text-gray-600">
                      💬 Hoặc chat trực tiếp qua Zalo để xác nhận nhanh hơn
                    </p>
                  </div>

                  <motion.button
                    onClick={onClose}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white 
                               py-3 rounded-xl font-medium transition-colors"
                  >
                    Đóng
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer buttons */}
        {step < 3 && (
          <div className="p-5 border-t border-gray-100 flex gap-3 flex-shrink-0">
            {step > 1 && (
              <motion.button
                onClick={() => setStep(s => s - 1)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-3 rounded-xl border-2 border-gray-200 
                           text-gray-600 font-medium hover:border-gray-300 
                           transition-colors flex items-center justify-center gap-2"
              >
                <ChevronLeft size={16} /> Quay lại
              </motion.button>
            )}
            
            <motion.button
              onClick={() => {
                if (step === 1 && canProceedStep1) setStep(2)
                else if (step === 2) handleSubmit()
              }}
              disabled={
                (step === 1 && !canProceedStep1) ||
                (step === 2 && (!canProceedStep2 || isSubmitting))
              }
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 
                         disabled:bg-gray-200 disabled:cursor-not-allowed text-white 
                         font-medium transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <><Loader2 size={16} className="animate-spin" /> Đang gửi...</>
              ) : step === 1 ? (
                <div className="flex items-center gap-1"><span>Tiếp theo</span> <ChevronRight size={16} /></div>
              ) : (
                <div className="flex items-center gap-1"><span>Xác nhận đặt lịch</span></div>
              )}
            </motion.button>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
