import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';

// Đăng ký Font Roboto chuẩn hỗ trợ 100% tiếng Việt có dấu đầy đủ
Font.register({
  family: 'Roboto',
  fonts: [
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf',
      fontWeight: 400,
    },
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf',
      fontWeight: 500,
    },
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf',
      fontWeight: 700,
    },
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-italic-webfont.ttf',
      fontStyle: 'italic',
      fontWeight: 400,
    },
  ],
});

const colors = {
  navy: '#1a2744',
  orange: '#f97316',
  green: '#22c55e',
  yellow: '#f59e0b',
  red: '#ef4444',
  gray: '#64748b',
  lightGray: '#f8fafc',
  border: '#e2e8f0',
  white: '#ffffff',
};

const styles = StyleSheet.create({
  page: { fontFamily: 'Roboto', backgroundColor: colors.white, padding: 0 },

  // ── TRANG 1: BÌA BÁO CÁO ──
  coverPage: {
    backgroundColor: colors.navy,
    height: '100%',
    padding: 45,
  },
  coverLogo: {
    color: colors.orange,
    fontSize: 16,
    fontWeight: 700,
    marginBottom: 4,
  },
  coverTagline: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 9,
    marginBottom: 45,
  },
  coverBadge: {
    backgroundColor: colors.orange,
    color: colors.white,
    fontSize: 9,
    fontWeight: 700,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  coverTitle: {
    color: colors.white,
    fontSize: 22,
    fontWeight: 700,
    lineHeight: 1.3,
    marginBottom: 12,
  },
  coverAddress: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 11,
    marginBottom: 35,
  },
  coverStatsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 35,
  },
  coverStatCard: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 8,
    padding: 12,
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  coverStatLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 8, marginBottom: 4 },
  coverStatValue: { color: colors.white, fontSize: 13, fontWeight: 700 },
  coverStatSub: { color: colors.orange, fontSize: 7.5, marginTop: 2, fontWeight: 500 },
  coverFooter: {
    position: 'absolute',
    bottom: 30,
    left: 45,
    right: 45,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.18)',
    paddingTop: 14,
  },
  coverFooterText: { color: 'rgba(255,255,255,0.5)', fontSize: 8 },

  // ── HEADER TRANG CON (Trang 2-4) ──
  pageHeader: {
    backgroundColor: colors.navy,
    paddingHorizontal: 40,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pageHeaderLogo: { color: colors.orange, fontSize: 11, fontWeight: 700 },
  pageHeaderTitle: { color: 'rgba(255,255,255,0.7)', fontSize: 8, maxWidth: 320 },
  pageHeaderPage: { color: 'rgba(255,255,255,0.5)', fontSize: 8 },
  pageContent: { padding: 35 },

  // ── TIÊU ĐỀ PHÂN MỤC ──
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 6,
    borderBottomWidth: 2,
    borderBottomColor: colors.orange,
  },
  sectionTitle: {
    color: colors.navy,
    fontSize: 12,
    fontWeight: 700,
  },

  // ── QUY HOẠCH ──
  planningCard: {
    backgroundColor: '#eff6ff',
    borderRadius: 8,
    padding: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
    marginBottom: 14,
  },
  planningBadge: {
    backgroundColor: colors.green,
    color: colors.white,
    fontSize: 8,
    fontWeight: 700,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  planningZoneName: {
    color: '#1d4ed8',
    fontSize: 13,
    fontWeight: 700,
    marginBottom: 10,
  },
  planningGridRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  planningGridItem: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 6,
    padding: 9,
    borderWidth: 1,
    borderColor: colors.border,
  },
  planningGridLabel: { color: colors.gray, fontSize: 7.5, marginBottom: 3 },
  planningGridValue: { color: colors.navy, fontSize: 10, fontWeight: 700 },
  zoneColorRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 8,
    flexWrap: 'wrap',
  },
  zoneColorChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    backgroundColor: colors.lightGray,
  },
  zoneColorDot: { width: 6, height: 6, borderRadius: 3 },
  zoneColorLabel: { fontSize: 7, color: colors.gray },

  // ── DỰ ÁN LÂN CẬN ──
  timelineContainer: { marginBottom: 14 },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 9,
    gap: 10,
  },
  timelineDotContainer: {
    alignItems: 'center',
    width: 14,
  },
  timelineDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    marginTop: 2,
  },
  timelineLine: {
    width: 1,
    flex: 1,
    backgroundColor: colors.border,
    marginTop: 2,
  },
  timelineContent: {
    flex: 1,
    backgroundColor: colors.lightGray,
    borderRadius: 6,
    padding: 9,
  },
  timelineTitle: { color: colors.navy, fontSize: 9, fontWeight: 700, marginBottom: 3 },
  timelineRow: { flexDirection: 'row', gap: 10 },
  timelineDistance: { color: colors.gray, fontSize: 7.5 },
  timelineStatus: { fontSize: 7.5, fontWeight: 700 },
  timelineYear: { color: colors.gray, fontSize: 7.5 },

  // ── NHẬN ĐỊNH AI ──
  aiAnalysisBox: {
    backgroundColor: '#fff7ed',
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: '#fed7aa',
    marginBottom: 12,
  },
  aiAnalysisHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 6,
  },
  aiAnalysisBadge: {
    backgroundColor: colors.orange,
    color: colors.white,
    fontSize: 7,
    fontWeight: 700,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 3,
  },
  aiAnalysisTitle: { color: colors.navy, fontSize: 9.5, fontWeight: 700 },
  aiAnalysisText: {
    color: '#374151',
    fontSize: 8.5,
    lineHeight: 1.5,
  },

  // ── THANH ĐIỂM CHỈ SỐ ──
  scoreBarsContainer: { gap: 7, marginBottom: 14 },
  scoreBarRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  scoreBarLabel: { color: colors.navy, fontSize: 8.5, width: 105 },
  scoreBarTrack: {
    flex: 1,
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
  },
  scoreBarFill: { height: 6, borderRadius: 3 },
  scoreBarValue: { color: colors.navy, fontSize: 8.5, fontWeight: 700, width: 35 },

  // ── BẢNG TIỆN ÍCH ──
  table: { borderRadius: 6, overflow: 'hidden', marginBottom: 14 },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.navy,
    paddingVertical: 6,
    paddingHorizontal: 9,
  },
  tableHeaderCell: {
    color: colors.white,
    fontSize: 7.5,
    fontWeight: 700,
    flex: 1,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 6,
    paddingHorizontal: 9,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tableRowAlt: { backgroundColor: colors.lightGray },
  tableCell: { color: '#374151', fontSize: 7.5, flex: 1 },

  // ── MA TRẬN SWOT ──
  swotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  swotCard: {
    width: '48%',
    borderRadius: 6,
    padding: 9,
  },
  swotCardS: { backgroundColor: '#dcfce7' },
  swotCardW: { backgroundColor: '#fef9c3' },
  swotCardO: { backgroundColor: '#dbeafe' },
  swotCardT: { backgroundColor: '#fee2e2' },
  swotCardTitle: { fontSize: 8.5, fontWeight: 700, marginBottom: 4 },
  swotCardTitleS: { color: '#166534' },
  swotCardTitleW: { color: '#713f12' },
  swotCardTitleO: { color: '#1e40af' },
  swotCardTitleT: { color: '#991b1b' },
  swotBullet: { color: '#374151', fontSize: 7.5, marginBottom: 2, lineHeight: 1.3 },

  // ── KHUYẾN NGHỊ ĐẦU TƯ ──
  recommendationCard: {
    backgroundColor: colors.navy,
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
  },
  recommendationTitle: {
    color: colors.orange,
    fontSize: 10,
    fontWeight: 700,
    marginBottom: 5,
  },
  recommendationText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 8.5,
    lineHeight: 1.5,
  },

  // ── MIỄN TRỪ TRÁCH NHIỆM ──
  disclaimer: {
    backgroundColor: colors.lightGray,
    borderRadius: 6,
    padding: 9,
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  disclaimerTitle: {
    color: colors.gray,
    fontSize: 7,
    fontWeight: 700,
    marginBottom: 2,
  },
  disclaimerText: { color: colors.gray, fontSize: 6.5, lineHeight: 1.4 },

  // ── FOOTER TRANG CON ──
  pageFooter: {
    position: 'absolute',
    bottom: 18,
    left: 35,
    right: 35,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 6,
  },
  pageFooterText: { color: colors.gray, fontSize: 7 },
});

export interface PDFTemplateProps {
  report: {
    id: string;
    score: number;
    planningScore: number;
    amenityScore: number;
    legalScore: number;
    planningZone: string;
    planningStatus: string;
    floorAreaRatio: number;
    maxHeight: string;
    nearbyProjects: Array<{
      name: string;
      distance: string;
      status: string;
      year: string;
    }>;
    amenities: Array<{
      type: string;
      name: string;
      distance: string;
      rating: number;
    }>;
    aiAnalysis: string;
    investmentRecommendation: string;
    priceTrendPotential: number;
    legalRisk: string;
    generatedAt: string;
  };
  listing: {
    title: string;
    address: string;
    price: number;
    area: number;
    pricePerM2: number;
    propertyType: string;
    district: string;
    floors?: number;
    bedrooms?: number;
  };
  userName: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return colors.green;
    case 'construction':
      return colors.yellow;
    case 'planning':
      return '#3b82f6';
    default:
      return colors.gray;
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'completed':
      return 'Đã hoàn thành';
    case 'construction':
      return 'Đang thi công';
    case 'planning':
      return 'Quy hoạch';
    default:
      return status;
  }
};

const formatPriceVND = (price: number): string => {
  if (price >= 1000000000) return `${(price / 1000000000).toFixed(1)} tỷ`;
  if (price >= 1000000) return `${(price / 1000000).toFixed(0)} triệu`;
  return `${price.toLocaleString('vi-VN')} đ`;
};

const ScoreBar = ({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) => (
  <View style={styles.scoreBarRow}>
    <Text style={styles.scoreBarLabel}>{label}</Text>
    <View style={styles.scoreBarTrack}>
      <View
        style={[
          styles.scoreBarFill,
          {
            width: `${Math.min(100, Math.max(0, value))}%`,
            backgroundColor: color,
          },
        ]}
      />
    </View>
    <Text style={styles.scoreBarValue}>{value}/100</Text>
  </View>
);

export const ReportPDFDocument: React.FC<PDFTemplateProps> = ({
  report,
  listing,
  userName,
}) => (
  <Document
    title={`Báo Cáo AI - ${listing.title}`}
    author="HaNoi Realty"
    subject="Thẩm định Bất động sản Hà Nội"
    creator="HaNoi Realty AI Engine"
  >
    {/* ━━━━ TRANG 1: BÌA BÁO CÁO ━━━━ */}
    <Page size="A4" style={styles.page}>
      <View style={styles.coverPage}>
        <Text style={styles.coverLogo}>HaNoi Realty</Text>
        <Text style={styles.coverTagline}>
          Nền tảng Bất động sản & Quy hoạch Đô thị Hà Nội
        </Text>

        <View style={styles.coverBadge}>
          <Text>BÁO CÁO THẨM ĐỊNH & ĐỊNH GIÁ AI</Text>
        </View>

        <Text style={styles.coverTitle}>{listing.title}</Text>
        <Text style={styles.coverAddress}>Vị trí: {listing.address}, {listing.district}, Hà Nội</Text>

        {/* Bảng thông số nhanh */}
        <View style={styles.coverStatsRow}>
          <View style={styles.coverStatCard}>
            <Text style={styles.coverStatLabel}>Giá chào bán</Text>
            <Text style={styles.coverStatValue}>{formatPriceVND(listing.price)}</Text>
            <Text style={styles.coverStatSub}>VNĐ</Text>
          </View>
          <View style={styles.coverStatCard}>
            <Text style={styles.coverStatLabel}>Diện tích</Text>
            <Text style={styles.coverStatValue}>{listing.area} m²</Text>
            <Text style={styles.coverStatSub}>Tổng diện tích</Text>
          </View>
          <View style={styles.coverStatCard}>
            <Text style={styles.coverStatLabel}>Đơn giá / m²</Text>
            <Text style={styles.coverStatValue}>{formatPriceVND(listing.pricePerM2)}</Text>
            <Text style={styles.coverStatSub}>/ m²</Text>
          </View>
          <View style={styles.coverStatCard}>
            <Text style={styles.coverStatLabel}>Điểm Tiềm Năng</Text>
            <Text style={[styles.coverStatValue, { color: colors.orange }]}>
              {report.score}/100
            </Text>
            <Text style={styles.coverStatSub}>
              {report.score >= 80 ? '🏆 Xuất sắc' : report.score >= 65 ? '✅ Tốt' : '⚠️ Trung bình'}
            </Text>
          </View>
        </View>

        {/* Thanh điểm tóm tắt bìa */}
        <View style={{ gap: 8, marginBottom: 35 }}>
          {[
            { label: 'Quy hoạch', value: report.planningScore },
            { label: 'Tiện ích & Giao thông', value: report.amenityScore },
            { label: 'Pháp lý & Thanh khoản', value: report.legalScore },
          ].map((item) => (
            <View
              key={item.label}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
            >
              <Text
                style={{
                  color: 'rgba(255,255,255,0.7)',
                  fontSize: 8,
                  width: 100,
                }}
              >
                {item.label}
              </Text>
              <View
                style={{
                  flex: 1,
                  height: 4,
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  borderRadius: 2,
                }}
              >
                <View
                  style={{
                    width: `${item.value}%`,
                    height: 4,
                    backgroundColor: colors.orange,
                    borderRadius: 2,
                  }}
                />
              </View>
              <Text
                style={{
                  color: colors.orange,
                  fontSize: 8,
                  fontWeight: 700,
                  width: 35,
                }}
              >
                {item.value}/100
              </Text>
            </View>
          ))}
        </View>

        {/* Chân trang bìa */}
        <View style={styles.coverFooter}>
          <Text style={styles.coverFooterText}>Chuyên viên: {userName}</Text>
          <Text style={styles.coverFooterText}>
            Ngày lập: {new Date(report.generatedAt).toLocaleDateString('vi-VN')}
          </Text>
          <Text style={styles.coverFooterText}>
            Mã định danh: #{report.id.slice(0, 8).toUpperCase()}
          </Text>
          <Text style={styles.coverFooterText}>Trang 1 / 4</Text>
        </View>
      </View>
    </Page>

    {/* ━━━━ TRANG 2: THÔNG TIN QUY HOẠCH & DỰ ÁN ━━━━ */}
    <Page size="A4" style={styles.page}>
      <View style={styles.pageHeader}>
        <Text style={styles.pageHeaderLogo}>HaNoi Realty</Text>
        <Text style={styles.pageHeaderTitle}>{listing.title}</Text>
        <Text style={styles.pageHeaderPage}>Trang 2 / 4</Text>
      </View>

      <View style={styles.pageContent}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>1. Thông Tin Quy Hoạch Đô Thị 2030 - 2045</Text>
        </View>

        <View style={styles.planningCard}>
          <Text style={styles.planningBadge}>Trạng thái: {report.planningStatus}</Text>
          <Text style={styles.planningZoneName}>Phân khu: {report.planningZone}</Text>

          <View style={styles.planningGridRow}>
            <View style={styles.planningGridItem}>
              <Text style={styles.planningGridLabel}>Tầm nhìn quy hoạch</Text>
              <Text style={styles.planningGridValue}>Năm 2030 - 2045</Text>
            </View>
            <View style={styles.planningGridItem}>
              <Text style={styles.planningGridLabel}>Hệ số sử dụng đất (FAR)</Text>
              <Text style={styles.planningGridValue}>{report.floorAreaRatio}</Text>
            </View>
            <View style={styles.planningGridItem}>
              <Text style={styles.planningGridLabel}>Chiều cao xây dựng</Text>
              <Text style={styles.planningGridValue}>{report.maxHeight}</Text>
            </View>
          </View>

          {/* Chú giải màu quy hoạch */}
          <Text style={{ color: '#374151', fontSize: 7.5, marginBottom: 5 }}>
            Bảng màu phân loại đất theo đồ án quy hoạch Hà Nội:
          </Text>
          <View style={styles.zoneColorRow}>
            {[
              { color: '#22c55e', label: 'Đất ở đô thị (ODT)' },
              { color: '#ef4444', label: 'Thương mại dịch vụ (TMD)' },
              { color: '#f59e0b', label: 'Giao thông (GT)' },
              { color: '#3b82f6', label: 'Công cộng & Trường học (CCC)' },
              { color: '#a855f7', label: 'Công nghệ cao (CNC)' },
              { color: '#6b7280', label: 'Cây xanh công viên (CX)' },
            ].map((zone) => (
              <View key={zone.label} style={styles.zoneColorChip}>
                <View
                  style={[styles.zoneColorDot, { backgroundColor: zone.color }]}
                />
                <Text style={styles.zoneColorLabel}>{zone.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Dự án hạ tầng lân cận */}
        <View style={[styles.sectionHeader, { marginTop: 14 }]}>
          <Text style={styles.sectionTitle}>
            2. Dự Án Hạ Tầng & Tuyến Metro Trọng Điểm (Bán kính 2km)
          </Text>
        </View>

        <View style={styles.timelineContainer}>
          {report.nearbyProjects.map((project, index) => (
            <View key={index} style={styles.timelineItem}>
              <View style={styles.timelineDotContainer}>
                <View
                  style={[
                    styles.timelineDot,
                    {
                      backgroundColor: getStatusColor(project.status),
                    },
                  ]}
                />
                {index < report.nearbyProjects.length - 1 && (
                  <View style={styles.timelineLine} />
                )}
              </View>
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTitle}>{project.name}</Text>
                <View style={styles.timelineRow}>
                  <Text style={styles.timelineDistance}>Khoảng cách: {project.distance}</Text>
                  <Text
                    style={[
                      styles.timelineStatus,
                      {
                        color: getStatusColor(project.status),
                      },
                    ]}
                  >
                    Tiến độ: {getStatusLabel(project.status)}
                  </Text>
                  <Text style={styles.timelineYear}>Mốc hoàn thành: {project.year}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.pageFooter}>
        <Text style={styles.pageFooterText}>HaNoi Realty © 2026</Text>
        <Text style={styles.pageFooterText}>
          Dữ liệu được số hóa từ Viện Quy hoạch Xây dựng Hà Nội
        </Text>
      </View>
    </Page>

    {/* ━━━━ TRANG 3: PHÂN TÍCH AI & MA TRẬN SWOT ━━━━ */}
    <Page size="A4" style={styles.page}>
      <View style={styles.pageHeader}>
        <Text style={styles.pageHeaderLogo}>HaNoi Realty</Text>
        <Text style={styles.pageHeaderTitle}>{listing.title}</Text>
        <Text style={styles.pageHeaderPage}>Trang 3 / 4</Text>
      </View>

      <View style={styles.pageContent}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>3. Phân Tích & Đánh Giá Tiềm Năng Bằng AI</Text>
        </View>

        {/* Thanh điểm chi tiết */}
        <View style={styles.scoreBarsContainer}>
          <ScoreBar label="An toàn quy hoạch" value={report.planningScore} color="#3b82f6" />
          <ScoreBar label="Tiện ích & Kết nối" value={report.amenityScore} color="#22c55e" />
          <ScoreBar label="Pháp lý & Thanh khoản" value={report.legalScore} color="#f97316" />
          <ScoreBar
            label="Tiềm năng tăng giá"
            value={report.priceTrendPotential * 10}
            color="#8b5cf6"
          />
        </View>

        {/* Nhận định chi tiết */}
        <View style={styles.aiAnalysisBox}>
          <View style={styles.aiAnalysisHeader}>
            <Text style={styles.aiAnalysisBadge}>GEMINI 1.5 PRO</Text>
            <Text style={styles.aiAnalysisTitle}>Nhận định tổng quan chuyên sâu</Text>
          </View>
          <Text style={styles.aiAnalysisText}>{report.aiAnalysis}</Text>
        </View>

        {/* Ma trận SWOT */}
        <View style={[styles.sectionHeader, { marginTop: 10 }]}>
          <Text style={styles.sectionTitle}>4. Ma Trận Đánh Giá SWOT Toàn Diện</Text>
        </View>

        <View style={styles.swotGrid}>
          <View style={[styles.swotCard, styles.swotCardS]}>
            <Text style={[styles.swotCardTitle, styles.swotCardTitleS]}>
              💪 Điểm mạnh (Strengths)
            </Text>
            <Text style={styles.swotBullet}>• Vị trí đắc địa, kết nối nhanh các trục vành đai</Text>
            <Text style={styles.swotBullet}>• Thuộc phân khu đất ở đô thị ổn định lâu dài</Text>
            <Text style={styles.swotBullet}>• Pháp lý minh bạch, sổ đỏ chính chủ sẵn sàng giao dịch</Text>
          </View>
          <View style={[styles.swotCard, styles.swotCardW]}>
            <Text style={[styles.swotCardTitle, styles.swotCardTitleW]}>
              ⚠️ Điểm yếu (Weaknesses)
            </Text>
            <Text style={styles.swotBullet}>• Đơn giá/m² tương đối cao so với mặt bằng chung</Text>
            <Text style={styles.swotBullet}>• Mật độ phương tiện vào giờ cao điểm đông đúc</Text>
            <Text style={styles.swotBullet}>• Cần tối ưu thêm diện tích công năng sử dụng</Text>
          </View>
          <View style={[styles.swotCard, styles.swotCardO]}>
            <Text style={[styles.swotCardTitle, styles.swotCardTitleO]}>
              🚀 Cơ hội (Opportunities)
            </Text>
            <Text style={styles.swotBullet}>• Hưởng lợi tăng giá đột phá khi tuyến Metro đi vào vận hành</Text>
            <Text style={styles.swotBullet}>• Nhu cầu thuê nhà và văn phòng dịch vụ khu vực rất cao</Text>
            <Text style={styles.swotBullet}>• Khả năng khai thác dòng tiền cho thuê 5 - 7% / năm</Text>
          </View>
          <View style={[styles.swotCard, styles.swotCardT]}>
            <Text style={[styles.swotCardTitle, styles.swotCardTitleT]}>
              🎯 Thách thức (Threats)
            </Text>
            <Text style={styles.swotBullet}>• Biến động lãi suất tín dụng bất động sản</Text>
            <Text style={styles.swotBullet}>• Cạnh tranh nguồn cung từ các phân khu mới</Text>
            <Text style={styles.swotBullet}>• Quy định điều chỉnh thuế chuyển nhượng tài sản</Text>
          </View>
        </View>

        {/* Khuyến nghị đầu tư */}
        <View style={styles.recommendationCard}>
          <Text style={styles.recommendationTitle}>🎯 Khuyến Nghị Đầu Tư Chiến Lược</Text>
          <Text style={styles.recommendationText}>
            {report.investmentRecommendation}
          </Text>
        </View>
      </View>

      <View style={styles.pageFooter}>
        <Text style={styles.pageFooterText}>HaNoi Realty © 2026</Text>
        <Text style={styles.pageFooterText}>Trang 3 / 4</Text>
      </View>
    </Page>

    {/* ━━━━ TRANG 4: TIỆN ÍCH, RỦI RO & MIỄN TRỪ ━━━━ */}
    <Page size="A4" style={styles.page}>
      <View style={styles.pageHeader}>
        <Text style={styles.pageHeaderLogo}>HaNoi Realty</Text>
        <Text style={styles.pageHeaderTitle}>{listing.title}</Text>
        <Text style={styles.pageHeaderPage}>Trang 4 / 4</Text>
      </View>

      <View style={styles.pageContent}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>5. Hệ Sinh Thái Tiện Ích & Dịch Vụ Xung Quanh</Text>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderCell}>Loại tiện ích</Text>
            <Text style={styles.tableHeaderCell}>Tên địa điểm</Text>
            <Text style={styles.tableHeaderCell}>Khoảng cách</Text>
            <Text style={styles.tableHeaderCell}>Đánh giá chất lượng</Text>
          </View>
          {report.amenities.map((amenity, index) => (
            <View
              key={index}
              style={[
                styles.tableRow,
                index % 2 === 1 ? styles.tableRowAlt : {},
              ]}
            >
              <Text style={styles.tableCell}>
                {amenity.type === 'school'
                  ? 'Trường học'
                  : amenity.type === 'hospital'
                  ? 'Bệnh viện'
                  : amenity.type === 'mall'
                  ? 'Trung tâm TM'
                  : amenity.type === 'park'
                  ? 'Công viên'
                  : amenity.type === 'metro'
                  ? 'Ga Metro'
                  : 'Tiện ích'}
              </Text>
              <Text style={styles.tableCell}>{amenity.name}</Text>
              <Text style={styles.tableCell}>{amenity.distance}</Text>
              <Text style={[styles.tableCell, { color: colors.orange, fontWeight: 700 }]}>
                {amenity.rating} / 5.0 ⭐
              </Text>
            </View>
          ))}
        </View>

        {/* Đánh giá rủi ro */}
        <View style={[styles.sectionHeader, { marginTop: 12 }]}>
          <Text style={styles.sectionTitle}>6. Tổng Kết Rủi Ro & Khả Năng Thanh Khoản</Text>
        </View>

        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 14 }}>
          {[
            {
              label: 'An toàn pháp lý',
              value: report.legalRisk,
              color: '#22c55e',
              bg: '#dcfce7',
            },
            {
              label: 'Tăng trưởng dự báo',
              value: `+${report.priceTrendPotential}% / năm`,
              color: '#3b82f6',
              bg: '#dbeafe',
            },
            {
              label: 'Mức độ thanh khoản',
              value: 'Rất cao (7-14 ngày)',
              color: '#f97316',
              bg: '#fff7ed',
            },
          ].map((item) => (
            <View
              key={item.label}
              style={{
                flex: 1,
                backgroundColor: item.bg,
                borderRadius: 6,
                padding: 9,
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  color: item.color,
                  fontSize: 9.5,
                  fontWeight: 700,
                  marginBottom: 2,
                  textAlign: 'center',
                }}
              >
                {item.value}
              </Text>
              <Text
                style={{ color: '#374151', fontSize: 6.5, textAlign: 'center' }}
              >
                {item.label}
              </Text>
            </View>
          ))}
        </View>

        {/* Miễn trừ trách nhiệm */}
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerTitle}>
            ⚠️ TUYÊN BỐ MIỄN TRỪ TRÁCH NHIỆM PHÁP LÝ
          </Text>
          <Text style={styles.disclaimerText}>
            Báo cáo này được tổng hợp và phân tích tự động bởi hệ thống AI của nền tảng HaNoi Realty dựa trên dữ liệu bản đồ quy hoạch phân khu và thông tin thị trường bất động sản tại thời điểm xuất báo cáo ({new Date(report.generatedAt).toLocaleDateString('vi-VN')}). Các số liệu, định giá và khuyến nghị chỉ mang tính chất tham khảo cho quá trình thẩm định ban đầu. HaNoi Realty không chịu trách nhiệm pháp lý đối với bất kỳ quyết định giao dịch tài chính nào phát sinh từ việc sử dụng báo cáo. Khách hàng vui lòng đối chiếu thực tế và tham vấn thêm ý kiến của các cơ quan quản lý đất đai có thẩm quyền.
          </Text>
        </View>
      </View>

      {/* Chân trang cuối */}
      <View style={[styles.pageFooter, { borderTopColor: colors.orange }]}>
        <Text style={styles.pageFooterText}>HaNoi Realty · Nền tảng PropTech Thủ Đô</Text>
        <Text style={styles.pageFooterText}>
          Mã báo cáo: #{report.id.slice(0, 8).toUpperCase()} · Trang 4 / 4
        </Text>
      </View>
    </Page>
  </Document>
);
