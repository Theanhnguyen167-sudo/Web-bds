'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  Bot,
  RotateCcw,
  ExternalLink,
  ChevronRight,
  Flame,
  ArrowUp
} from 'lucide-react';
import Link from 'next/link';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  actions?: { label: string; href?: string; onClickAction?: string }[];
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'welcome-1',
    sender: 'bot',
    text: 'Xin chào quý khách! 👋 Tôi là Trợ lý AI BĐS HaNoi Realty.',
    timestamp: 'Vừa xong',
  },
  {
    id: 'welcome-2',
    sender: 'bot',
    text: 'Tôi có thể hỗ trợ bạn tra cứu quy hoạch Hà Nội 2030, định giá nhà đất, tìm BĐS theo tài chính hoặc kết nối chuyên viên trực tiếp.',
    timestamp: 'Vừa xong',
    actions: [
      { label: '🔍 Tìm nhà 3 - 5 tỷ Cầu Giấy', onClickAction: 'tim-nha-cau-giay' },
      { label: '🗺️ Cách tra cứu quy hoạch số', onClickAction: 'tra-cuu-quy-hoach' },
      { label: '🤖 Định giá nhà đất bằng AI', onClickAction: 'dinh-gia-ai' },
      { label: '📞 Gặp chuyên viên tư vấn', onClickAction: 'gap-chuyen-vien' },
    ],
  },
];

const BOT_KNOWLEDGE_BASE: { keywords: string[]; response: string; actions?: { label: string; href?: string; onClickAction?: string }[] }[] = [
  {
    keywords: ['quy hoạch', 'tra cứu', 'bản đồ', 'chỉ giới', 'qh'],
    response: '🗺️ Hệ thống HaNoi Realty cung cấp bản đồ quy hoạch số Hà Nội đến năm 2030 - 2045 chuẩn phân khu (H1-1, H2, sông Hồng, đô thị vệ tinh). Bạn có thể bật lớp phủ quy hoạch, kiểm tra mật độ xây dựng và tầng cao tối đa ngay trên bản đồ.',
    actions: [
      { label: 'Xem Bản đồ Quy hoạch', href: '/planning' },
      { label: 'Tìm BĐS theo Quy hoạch', href: '/search' }
    ]
  },
  {
    keywords: ['giá', 'định giá', 'thẩm định', 'báo cáo', 'chi phí'],
    response: '🤖 Công nghệ AI Valuation của chúng tôi phân tích hơn 100,000+ điểm dữ liệu giao dịch thực tế tại 30 quận/huyện Hà Nội để dự đoán biên độ tăng giá và thẩm định giá thị trường chính xác tới 95%.',
    actions: [
      { label: 'Xem Báo cáo AI', href: '/listings/1' },
      { label: 'Bảng giá dịch vụ VIP', href: '/pricing' }
    ]
  },
  {
    keywords: ['cầu giấy', 'đống đa', 'ba đình', 'tây hồ', 'nam từ liêm', 'hà đông', 'hoàng mai', 'long biên'],
    response: '🏢 Hiện sàn đang có hàng ngàn tin đăng nhà phố, chung cư và biệt thự chính chủ đã xác thực sổ đỏ tại khu vực này. Bạn có thể sử dụng bộ lọc tìm kiếm theo tầm giá, diện tích và hướng nhà.',
    actions: [
      { label: 'Khám phá tin đăng khu vực', href: '/search' },
      { label: 'Xem danh mục phân khu', href: '/#categories' }
    ]
  },
  {
    keywords: ['zalo', 'sđt', 'hotline', 'gọi', 'liên hệ', 'chuyên viên', 'tư vấn viên', 'nhân viên'],
    response: '📞 Đội ngũ chuyên viên tư vấn pháp lý & quy hoạch của HaNoi Realty luôn sẵn sàng hỗ trợ 24/7:\n\n• Hotline: 0988.168.999\n• Zalo tư vấn nhanh: 0988.168.999\n• Email: hotro@hanoirealty.vn',
    actions: [
      { label: 'Mở Zalo kết nối ngay', href: 'https://zalo.me/0988168999' },
      { label: 'Về chúng tôi', href: '/about' }
    ]
  },
  {
    keywords: ['đăng tin', 'bán nhà', 'cho thuê', 'ký gửi'],
    response: '✍️ Bạn có thể đăng tin BĐS miễn phí với tính năng kiểm tra toạ độ tự động và liên kết lớp quy hoạch. Tin đăng của bạn sẽ tiếp cận hơn 50,000+ khách hàng tiềm năng mỗi tháng.',
    actions: [
      { label: 'Đăng tin ngay', href: '/listings/create' }
    ]
  }
];

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const handleScroll = () => {
      // Chỉ hiển thị nút cuộn lên đầu khi lướt xuống một chút (> 150px)
      setShowScrollTop(window.scrollY > 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setHasUnread(false);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, messages, isTyping]);

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: 'Vừa xong',
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsTyping(true);

    // Bot Auto-Response with slight natural delay
    setTimeout(() => {
      const lower = text.toLowerCase();
      let matchedResponse = BOT_KNOWLEDGE_BASE.find((item) =>
        item.keywords.some((k) => lower.includes(k))
      );

      let botText = '';
      let botActions = undefined;

      if (matchedResponse) {
        botText = matchedResponse.response;
        botActions = matchedResponse.actions;
      } else if (lower.includes('chào') || lower.includes('hi') || lower.includes('hello')) {
        botText = 'Dạ chào bạn! Rất vui được hỗ trợ bạn. Bạn đang quan tâm đến mua bán BĐS, kiểm tra quy hoạch khu vực nào tại Hà Nội?';
        botActions = [
          { label: '🔍 Tìm mua nhà đất', href: '/search' },
          { label: '🗺️ Bản đồ quy hoạch', href: '/planning' },
          { label: '📞 Liên hệ Hotline', href: 'https://zalo.me/0988168999' }
        ];
      } else {
        botText = `Cảm ơn câu hỏi của bạn về "${text}". Chuyên viên tư vấn HaNoi Realty đã ghi nhận. Để được hỗ trợ chi tiết và kiểm tra hồ sơ thực tế, bạn có thể nhắn trực tiếp qua Zalo hoặc Hotline 0988.168.999!`;
        botActions = [
          { label: '💬 Chat qua Zalo Chuyên viên', href: 'https://zalo.me/0988168999' },
          { label: '🔍 Khám phá giỏ hàng BĐS', href: '/search' }
        ];
      }

      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: botText,
        timestamp: 'Vừa xong',
        actions: botActions,
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 700);
  };

  const handleActionClick = (action: { label: string; href?: string; onClickAction?: string }) => {
    if (action.href) {
      if (action.href.startsWith('http')) {
        window.open(action.href, '_blank');
      }
      return;
    }

    if (action.onClickAction === 'tim-nha-cau-giay') {
      handleSendMessage('Tôi muốn tìm nhà phân khúc 3 - 5 tỷ ở Cầu Giấy');
    } else if (action.onClickAction === 'tra-cuu-quy-hoach') {
      handleSendMessage('Hướng dẫn tôi tra cứu quy hoạch số');
    } else if (action.onClickAction === 'dinh-gia-ai') {
      handleSendMessage('Định giá nhà đất bằng AI như thế nào?');
    } else if (action.onClickAction === 'gap-chuyen-vien') {
      handleSendMessage('Tôi cần kết nối trực tiếp với chuyên viên tư vấn');
    }
  };

  const resetChat = () => {
    setMessages(INITIAL_MESSAGES);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 select-none flex flex-col items-end">
      {/* ━━━ CHAT POPUP WINDOW ━━━ */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="mb-3 w-[calc(100vw-32px)] sm:w-[390px] h-[540px] max-h-[75vh] bg-white rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden backdrop-blur-xl"
            style={{
              boxShadow: '0 20px 45px -10px rgba(15, 23, 42, 0.25), 0 0 1px 1px rgba(0, 0, 0, 0.05)',
            }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#0a1128] via-[#101f42] to-accent p-4 text-white flex items-center justify-between shadow-md relative">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="h-10 w-10 rounded-2xl bg-accent/20 border border-accent/40 flex items-center justify-center text-accent shadow-inner">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  {/* Status Indicator */}
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-[#0a1128]" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-sm text-white leading-tight">HaNoi Realty Support</h3>
                    <span className="bg-white/20 text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded tracking-wider">
                      Online
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 flex items-center gap-1">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Hỗ trợ trực tuyến 24/7
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={resetChat}
                  title="Bắt đầu lại cuộc trò chuyện"
                  className="h-8 w-8 rounded-xl hover:bg-white/10 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  title="Đóng chat"
                  className="h-8 w-8 rounded-xl hover:bg-white/10 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Quick Hotline Banner */}
            <div className="bg-amber-50/90 border-b border-amber-200/60 px-3.5 py-1.5 flex items-center justify-between text-[11px] text-amber-900">
              <span className="flex items-center gap-1 font-medium">
                <Flame className="h-3.5 w-3.5 text-amber-600 fill-amber-600" />
                Hỗ trợ trực tiếp Hotline / Zalo:
              </span>
              <a
                href="https://zalo.me/0988168999"
                target="_blank"
                rel="noreferrer"
                className="font-bold text-accent hover:underline flex items-center gap-0.5"
              >
                0988.168.999
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed shadow-sm ${
                      msg.sender === 'user'
                        ? 'bg-accent text-white rounded-br-none font-medium'
                        : 'bg-white text-slate-800 rounded-bl-none border border-slate-200/80'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>
                  </div>

                  {/* Actions / Suggestion Pills */}
                  {msg.actions && msg.actions.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5 max-w-[90%]">
                      {msg.actions.map((act, i) => (
                        act.href ? (
                          <Link
                            key={i}
                            href={act.href}
                            target={act.href.startsWith('http') ? '_blank' : undefined}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold bg-white hover:bg-orange-50 text-slate-700 hover:text-accent border border-slate-200 hover:border-accent/40 rounded-full px-2.5 py-1 transition-all shadow-2xs"
                          >
                            <span>{act.label}</span>
                            <ChevronRight className="h-3 w-3 text-slate-400 group-hover:text-accent" />
                          </Link>
                        ) : (
                          <button
                            key={i}
                            type="button"
                            onClick={() => handleActionClick(act)}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold bg-white hover:bg-orange-50 text-slate-700 hover:text-accent border border-slate-200 hover:border-accent/40 rounded-full px-2.5 py-1 transition-all shadow-2xs cursor-pointer text-left"
                          >
                            <span>{act.label}</span>
                            <ChevronRight className="h-3 w-3 text-slate-400" />
                          </button>
                        )
                      ))}
                    </div>
                  )}

                  <span className="text-[10px] text-slate-400 mt-1 px-1">
                    {msg.timestamp}
                  </span>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex items-center gap-1.5 bg-white border border-slate-200/80 rounded-2xl rounded-bl-none px-3 py-2 w-fit shadow-xs">
                  <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 bg-white border-t border-slate-200/80 flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Nhập câu hỏi (VD: Quy hoạch Cầu Giấy, tìm nhà 3 tỷ...)..."
                className="flex-1 bg-slate-100/80 border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all"
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="h-9 w-9 rounded-xl bg-accent hover:bg-accent-hover disabled:bg-slate-200 disabled:text-slate-400 text-white flex items-center justify-center transition-all shadow-md shadow-accent/20 disabled:shadow-none shrink-0 cursor-pointer"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ━━━ VERTICAL BUTTON STACK (CHAT + SCROLL TO TOP) ━━━ */}
      <div className="flex flex-col items-center gap-2.5">
        {/* Floating Chat Button (Trigger) */}
        <div className="relative group flex items-center justify-center">
          {/* Hover Label Tooltip */}
          {!isOpen && (
            <div className="absolute right-16 px-3 py-1.5 rounded-xl bg-slate-900/90 text-white text-xs font-semibold whitespace-nowrap shadow-lg backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none -translate-x-1 group-hover:translate-x-0 border border-slate-700/50 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              <span>Chat với chúng tôi 24/7</span>
            </div>
          )}

          {/* Pulse Radar effect */}
          {!isOpen && (
            <span className="absolute -inset-1 rounded-full bg-accent/40 animate-ping opacity-60 pointer-events-none" />
          )}

          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Đóng chat' : 'Mở chat với chúng tôi'}
            className="relative h-13 w-13 sm:h-14 sm:w-14 rounded-full bg-gradient-to-tr from-accent to-orange-500 hover:from-accent-hover hover:to-orange-600 text-white shadow-xl shadow-accent/30 flex items-center justify-center transition-all duration-300 focus:outline-hidden ring-4 ring-white cursor-pointer z-10"
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="h-6 w-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="chat"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="relative"
                >
                  <MessageCircle className="h-6 w-6" />
                  {/* Red unread indicator dot */}
                  {hasUnread && (
                    <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-rose-500 border-2 border-white flex items-center justify-center">
                      <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                    </span>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Scroll to Top Button (Chỉ hiển thị khi lướt xuống một chút > 150px, màu trắng, mũi tên đen hướng lên) */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.div
              initial={{ opacity: 0, scale: 0.6, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.6, y: 8 }}
              transition={{ duration: 0.2 }}
              className="relative group flex items-center justify-center"
            >
              {/* Tooltip on hover */}
              <div className="absolute right-14 px-2.5 py-1 rounded-lg bg-slate-900/90 text-white text-[11px] font-semibold whitespace-nowrap shadow-md backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none -translate-x-1 group-hover:translate-x-0 border border-slate-700/50">
                Cuộn lên đầu trang
              </div>

              <motion.button
                whileHover={{ scale: 1.12, y: -2 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                aria-label="Kéo lên đầu trang"
                title="Kéo lên đầu trang"
                className="h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-white text-black shadow-lg hover:shadow-xl border border-slate-200/90 flex items-center justify-center transition-all duration-200 cursor-pointer hover:bg-slate-50 ring-2 ring-white/90"
              >
                <ArrowUp className="h-5 w-5 text-black stroke-[2.5] transition-transform duration-200 group-hover:-translate-y-0.5" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ChatWidget;
