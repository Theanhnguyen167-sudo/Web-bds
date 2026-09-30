'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface TeamMember {
  initials: string;
  avatarGradient: string;
  name: string;
  role: string;
  bio: string;
  tag: string;
}

const teamMembers: TeamMember[] = [
  {
    initials: 'NTA',
    avatarGradient: 'from-orange-500 to-amber-500',
    name: 'Nguyễn Thanh An',
    role: 'CEO & Co-founder',
    bio: '15 năm kinh nghiệm thị trường BĐS Hà Nội. Cựu Giám đốc CBRE Việt Nam, chuyên gia phân tích chu kỳ đầu tư.',
    tag: '🏠 BĐS & Chiến lược',
  },
  {
    initials: 'TBM',
    avatarGradient: 'from-blue-600 to-indigo-600',
    name: 'Trần Bảo Minh',
    role: 'CTO & Co-founder',
    bio: 'Cựu Kỹ sư AI tại Google (2018-2023). Chuyên gia Computer Vision, hệ thống GIS và mô hình AI định giá.',
    tag: '🤖 Kỹ thuật AI & GIS',
  },
  {
    initials: 'LTH',
    avatarGradient: 'from-emerald-600 to-teal-600',
    name: 'Lê Thị Hương',
    role: 'Head of Data',
    bio: 'Tiến sĩ Quy hoạch đô thị, ĐH Kiến trúc Hà Nội. 10+ năm xây dựng cơ sở dữ liệu không gian đô thị Thủ đô.',
    tag: '📊 Khoa học Dữ liệu',
  },
  {
    initials: 'PVK',
    avatarGradient: 'from-purple-600 to-pink-600',
    name: 'Phạm Văn Khải',
    role: 'Head of Product',
    bio: 'Ex-Product Lead tại VNPay. Chuyên gia thiết kế UX/UI PropTech & tối ưu hóa quy trình giao dịch thanh toán.',
    tag: '🎨 Trải nghiệm Sản phẩm',
  },
];

export function AboutTeam() {
  return (
    <section id="team" className="py-20 sm:py-28 bg-white border-y border-slate-100">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center space-y-3 mb-14 sm:mb-16">
          <span className="text-xs font-extrabold uppercase tracking-widest text-orange-600">
            CON NGƯỜI
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Đội ngũ Sáng lập
          </h2>
          <p className="text-sm sm:text-base text-slate-500">
            Sự kết hợp giữa chuyên môn bất động sản thực chiến và công nghệ AI hàng đầu
          </p>
        </div>

        {/* Responsive Grid: 4 cols on Desktop, 2 cols on Tablet, 1 col on Mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {teamMembers.map((member, idx) => (
            <motion.article
              key={member.initials}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: idx * 0.1 }}
              whileHover={{ y: -6 }}
              className="group flex flex-col justify-between rounded-3xl border border-slate-100 bg-slate-50/50 p-6 text-center shadow-xs transition-all duration-300 hover:border-orange-300 hover:bg-white hover:shadow-xl"
            >
              <div className="space-y-4">
                {/* Initials Avatar */}
                <div
                  className={`mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br ${member.avatarGradient} text-xl font-black text-white shadow-md transition-transform duration-300 group-hover:scale-108`}
                >
                  {member.initials}
                </div>

                {/* Name & Role */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-xs font-semibold text-orange-600 mt-0.5">
                    {member.role}
                  </p>
                </div>

                {/* Bio */}
                <p className="text-xs leading-relaxed text-slate-600">
                  {member.bio}
                </p>
              </div>

              {/* Specialization Tag */}
              <div className="pt-5 mt-4 border-t border-slate-200/60">
                <span className="inline-block rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 shadow-xs border border-slate-200/80 group-hover:border-orange-200 group-hover:text-orange-700 transition-colors">
                  {member.tag}
                </span>
              </div>
            </motion.article>
          ))}
        </div>

      </div>
    </section>
  );
}
