'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, MessageCircle, Calendar, X, 
         ChevronUp, Send, Clock, CheckCircle } from 'lucide-react'
import BookingModal from './BookingModal'

export interface FloatingContactWidgetProps {
  agentPhone: string
  agentName: string
  agentZalo?: string
  listingTitle: string
  listingId: string
}

export default function FloatingContactWidget({
  agentPhone,
  agentName,
  agentZalo,
  listingTitle,
  listingId,
}: FloatingContactWidgetProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [showPhoneReveal, setShowPhoneReveal] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  // Show widget after scrolling 300px
  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY > 300)
    // Check initial scroll position
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const zaloPhone = agentZalo || agentPhone
  const zaloUrl = `https://zalo.me/${zaloPhone.replace(/\D/g, '')}`

  return (
    <>
      {/* ── Floating Buttons ── */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed bottom-6 right-6 z-[900] flex flex-col items-end gap-3"
          >
            {/* Expanded action buttons */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  className="flex flex-col gap-2 items-end"
                >
                  {/* Call Button */}
                  <motion.a
                    href={`tel:${agentPhone}`}
                    whileHover={{ scale: 1.05, x: -4 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-3 bg-green-500 hover:bg-green-600 
                               text-white px-4 py-3 rounded-2xl shadow-lg 
                               shadow-green-500/30 transition-colors"
                  >
                    <span className="text-sm font-medium">
                      {showPhoneReveal ? agentPhone : 'Gọi ngay'}
                    </span>
                    <Phone size={18} />
                  </motion.a>

                  {/* Zalo Button */}
                  <motion.a
                    href={zaloUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05, x: -4 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-3 bg-blue-500 hover:bg-blue-600 
                               text-white px-4 py-3 rounded-2xl shadow-lg 
                               shadow-blue-500/30 transition-colors"
                  >
                    <span className="text-sm font-medium">Chat Zalo</span>
                    <MessageCircle size={18} />
                  </motion.a>

                  {/* Book Appointment */}
                  <motion.button
                    onClick={() => {
                      setShowBookingModal(true)
                      setIsExpanded(false)
                    }}
                    whileHover={{ scale: 1.05, x: -4 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-3 bg-orange-500 hover:bg-orange-600 
                               text-white px-4 py-3 rounded-2xl shadow-lg 
                               shadow-orange-500/30 transition-colors"
                  >
                    <span className="text-sm font-medium">Đặt lịch xem nhà</span>
                    <Calendar size={18} />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main FAB Button */}
            <motion.button
              onClick={() => setIsExpanded(!isExpanded)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-14 h-14 bg-orange-500 hover:bg-orange-600 text-white 
                         rounded-full shadow-xl shadow-orange-500/40 flex items-center 
                         justify-center transition-colors"
              aria-label="Liên hệ môi giới"
            >
              <AnimatePresence mode="wait">
                {isExpanded ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X size={22} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="phone"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Phone size={22} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Agent name tooltip */}
            <AnimatePresence>
              {!isExpanded && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  className="bg-white/90 backdrop-blur-sm text-navy text-xs 
                             font-medium px-3 py-1.5 rounded-xl shadow-md 
                             border border-gray-100"
                >
                  📞 Liên hệ {agentName}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Booking Modal ── */}
      <AnimatePresence>
        {showBookingModal && (
          <BookingModal
            agentName={agentName}
            listingTitle={listingTitle}
            listingId={listingId}
            onClose={() => setShowBookingModal(false)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
