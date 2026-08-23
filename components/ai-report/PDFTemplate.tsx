import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';

try {
  Font.register({
    family: 'Inter',
    fonts: [
      {
        src: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff',
        fontWeight: 400,
      },
      {
        src: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZ9hiJ-Ek-_EeA.woff',
        fontWeight: 700,
      },
    ],
  });
} catch (e) {
  // Safe fallback if registered already
}

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
  page: { fontFamily: 'Helvetica', backgroundColor: colors.white, padding: 0 },

  // ── PAGE 1: COVER ──
  coverPage: {
    backgroundColor: colors.navy,
    height: '100%',
    padding: 50,
  },
  coverLogo: {
    color: colors.orange,
    fontSize: 14,
    fontWeight: 700,
    marginBottom: 4,
  },
  coverTagline: { color: 'rgba(255,255,255,0.6)', fontSize: 9, marginBottom: 50 },
  coverBadge: {
    backgroundColor: colors.orange,
    color: colors.white,
    fontSize: 9,
    fontWeight: 700,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  coverTitle: {
    color: colors.white,
    fontSize: 24,
    fontWeight: 700,
    lineHeight: 1.3,
    marginBottom: 12,
  },
  coverAddress: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
    marginBottom: 35,
  },
  coverStatsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 40,
  },
  coverStatCard: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 8,
    padding: 14,
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  coverStatLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 8, marginBottom: 4 },
  coverStatValue: { color: colors.white, fontSize: 14, fontWeight: 700 },
  coverStatSub: { color: colors.orange, fontSize: 7, marginTop: 2 },
  coverFooter: {
    position: 'absolute',
    bottom: 30,
    left: 50,
    right: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.15)',
    paddingTop: 16,
  },
  coverFooterText: { color: 'rgba(255,255,255,0.4)', fontSize: 8 },

  // ── PAGE HEADER (pages 2-4) ──
  pageHeader: {
    backgroundColor: colors.navy,
    paddingHorizontal: 40,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pageHeaderLogo: { color: colors.orange, fontSize: 11, fontWeight: 700 },
  pageHeaderTitle: { color: 'rgba(255,255,255,0.6)', fontSize: 8 },
  pageHeaderPage: { color: 'rgba(255,255,255,0.4)', fontSize: 8 },
  pageContent: { padding: 35 },

  // ── SECTION HEADERS ──
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: colors.orange,
  },
  sectionTitle: {
    color: colors.navy,
    fontSize: 13,
    fontWeight: 700,
  },

  // ── PLANNING SECTION ──
  planningCard: {
    backgroundColor: '#eff6ff',
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
    marginBottom: 16,
  },
  planningBadge: {
    backgroundColor: colors.green,
    color: colors.white,
    fontSize: 8,
    fontWeight: 700,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  planningZoneName: {
    color: '#1d4ed8',
    fontSize: 14,
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
    padding: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  planningGridLabel: { color: colors.gray, fontSize: 7, marginBottom: 3 },
  planningGridValue: { color: colors.navy, fontSize: 10, fontWeight: 700 },
  zoneColorRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 10,
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

  // ── NEARBY PROJECTS TIMELINE ──
  timelineContainer: { marginBottom: 16 },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 10,
    gap: 10,
  },
  timelineDotContainer: {
    alignItems: 'center',
    width: 16,
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
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
    padding: 10,
  },
  timelineTitle: { color: colors.navy, fontSize: 9, fontWeight: 700, marginBottom: 3 },
  timelineRow: { flexDirection: 'row', gap: 10 },
  timelineDistance: { color: colors.gray, fontSize: 7 },
  timelineStatus: { fontSize: 7, fontWeight: 700 },
  timelineYear: { color: colors.gray, fontSize: 7 },

  // ── AI ANALYSIS ──
  aiAnalysisBox: {
    backgroundColor: '#fff7ed',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#fed7aa',
    marginBottom: 14,
  },
  aiAnalysisHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
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
  aiAnalysisTitle: { color: colors.navy, fontSize: 10, fontWeight: 700 },
  aiAnalysisText: {
    color: '#374151',
    fontSize: 8.5,
    lineHeight: 1.5,
  },

  // ── SCORE BARS ──
  scoreBarsContainer: { gap: 8, marginBottom: 16 },
  scoreBarRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  scoreBarLabel: { color: colors.navy, fontSize: 8.5, width: 90 },
  scoreBarTrack: {
    flex: 1,
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
  },
  scoreBarFill: { height: 6, borderRadius: 3 },
  scoreBarValue: { color: colors.navy, fontSize: 8.5, fontWeight: 700, width: 35 },

  // ── AMENITIES TABLE ──
  table: { borderRadius: 6, overflow: 'hidden', marginBottom: 16 },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.navy,
    paddingVertical: 7,
    paddingHorizontal: 10,
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
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tableRowAlt: { backgroundColor: colors.lightGray },
  tableCell: { color: '#374151', fontSize: 7.5, flex: 1 },

  // ── SWOT ──
  swotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  swotCard: {
    width: '48%',
    borderRadius: 6,
    padding: 10,
  },
  swotCardS: { backgroundColor: '#dcfce7' },
  swotCardW: { backgroundColor: '#fef9c3' },
  swotCardO: { backgroundColor: '#dbeafe' },
  swotCardT: { backgroundColor: '#fee2e2' },
  swotCardTitle: { fontSize: 8.5, fontWeight: 700, marginBottom: 5 },
  swotCardTitleS: { color: '#166534' },
  swotCardTitleW: { color: '#713f12' },
  swotCardTitleO: { color: '#1e40af' },
  swotCardTitleT: { color: '#991b1b' },
  swotBullet: { color: '#374151', fontSize: 7.5, marginBottom: 2, lineHeight: 1.3 },

  // ── RECOMMENDATION ──
  recommendationCard: {
    backgroundColor: colors.navy,
    borderRadius: 8,
    padding: 16,
    marginBottom: 14,
  },
  recommendationTitle: {
    color: colors.orange,
    fontSize: 10.5,
    fontWeight: 700,
    marginBottom: 6,
  },
  recommendationText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 8.5,
    lineHeight: 1.5,
  },

  // ── DISCLAIMER ──
  disclaimer: {
    backgroundColor: colors.lightGray,
    borderRadius: 6,
    padding: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  disclaimerTitle: {
    color: colors.gray,
    fontSize: 7,
    fontWeight: 700,
    marginBottom: 3,
  },
  disclaimerText: { color: colors.gray, fontSize: 6.5, lineHeight: 1.4 },

  // ── PAGE FOOTER ──
  pageFooter: {
    position: 'absolute',
    bottom: 20,
    left: 40,
    right: 40,
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
      return 'Hoan thanh';
    case 'construction':
      return 'Dang thi cong';
    case 'planning':
      return 'Quy hoach';
    default:
      return status;
  }
};

const formatPrice = (price: number): string => {
  if (price >= 1000000000) return `${(price / 1000000000).toFixed(1)} ty`;
  if (price >= 1000000) return `${(price / 1000000).toFixed(0)} trieu`;
  return price.toLocaleString('vi-VN');
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
    title={`Bao cao AI - ${listing.title}`}
    author="HaNoi Realty"
    subject="Phan tich bat dong san"
    creator="HaNoi Realty AI"
  >
    {/* ━━━━ PAGE 1: COVER ━━━━ */}
    <Page size="A4" style={styles.page}>
      <View style={styles.coverPage}>
        <Text style={styles.coverLogo}>HaNoi Realty</Text>
        <Text style={styles.coverTagline}>
          Nen tang bat dong san thong minh Ha Noi
        </Text>

        <View style={styles.coverBadge}>
          <Text>BAO CAO PHAN TICH AI</Text>
        </View>

        <Text style={styles.coverTitle}>{listing.title}</Text>
        <Text style={styles.coverAddress}>{listing.address}</Text>

        {/* Stats Row */}
        <View style={styles.coverStatsRow}>
          <View style={styles.coverStatCard}>
            <Text style={styles.coverStatLabel}>Gia ban</Text>
            <Text style={styles.coverStatValue}>{formatPrice(listing.price)}</Text>
            <Text style={styles.coverStatSub}>VND</Text>
          </View>
          <View style={styles.coverStatCard}>
            <Text style={styles.coverStatLabel}>Dien tich</Text>
            <Text style={styles.coverStatValue}>{listing.area}m2</Text>
            <Text style={styles.coverStatSub}>Tong dien tich</Text>
          </View>
          <View style={styles.coverStatCard}>
            <Text style={styles.coverStatLabel}>Gia/m2</Text>
            <Text style={styles.coverStatValue}>{formatPrice(listing.pricePerM2)}</Text>
            <Text style={styles.coverStatSub}>/ m2</Text>
          </View>
          <View style={styles.coverStatCard}>
            <Text style={styles.coverStatLabel}>Diem AI</Text>
            <Text style={[styles.coverStatValue, { color: colors.orange }]}>
              {report.score}/100
            </Text>
            <Text style={styles.coverStatSub}>
              {report.score >= 80 ? 'Xuat sac' : report.score >= 65 ? 'Tot' : 'Trung binh'}
            </Text>
          </View>
        </View>

        {/* Score Breakdown Preview */}
        <View style={{ gap: 8, marginBottom: 35 }}>
          {[
            { label: 'Quy hoach', value: report.planningScore },
            { label: 'Tien ich', value: report.amenityScore },
            { label: 'Phap ly', value: report.legalScore },
          ].map((item) => (
            <View
              key={item.label}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
            >
              <Text
                style={{
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: 8,
                  width: 60,
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

        {/* Cover Footer */}
        <View style={styles.coverFooter}>
          <Text style={styles.coverFooterText}>Tao boi: {userName}</Text>
          <Text style={styles.coverFooterText}>
            Ngay: {new Date(report.generatedAt).toLocaleDateString('vi-VN')}
          </Text>
          <Text style={styles.coverFooterText}>
            Ma bao cao: #{report.id.slice(0, 8).toUpperCase()}
          </Text>
          <Text style={styles.coverFooterText}>Trang 1/4</Text>
        </View>
      </View>
    </Page>

    {/* ━━━━ PAGE 2: QUY HOẠCH ━━━━ */}
    <Page size="A4" style={styles.page}>
      <View style={styles.pageHeader}>
        <Text style={styles.pageHeaderLogo}>HaNoi Realty</Text>
        <Text style={styles.pageHeaderTitle}>{listing.title}</Text>
        <Text style={styles.pageHeaderPage}>Trang 2/4</Text>
      </View>

      <View style={styles.pageContent}>
        {/* Section: Planning */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Thong tin Quy hoach</Text>
        </View>

        <View style={styles.planningCard}>
          <Text style={styles.planningBadge}>{report.planningStatus}</Text>
          <Text style={styles.planningZoneName}>{report.planningZone}</Text>

          <View style={styles.planningGridRow}>
            <View style={styles.planningGridItem}>
              <Text style={styles.planningGridLabel}>Nam quy hoach</Text>
              <Text style={styles.planningGridValue}>2030</Text>
            </View>
            <View style={styles.planningGridItem}>
              <Text style={styles.planningGridLabel}>He so SDD</Text>
              <Text style={styles.planningGridValue}>{report.floorAreaRatio}</Text>
            </View>
            <View style={styles.planningGridItem}>
              <Text style={styles.planningGridLabel}>Chieu cao toi da</Text>
              <Text style={styles.planningGridValue}>{report.maxHeight}</Text>
            </View>
          </View>

          {/* Zone Color Legend */}
          <Text style={{ color: '#374151', fontSize: 7.5, marginBottom: 5 }}>
            Phan loai dat theo mau quy hoach:
          </Text>
          <View style={styles.zoneColorRow}>
            {[
              { color: '#22c55e', label: 'Dat o (ODT)' },
              { color: '#ef4444', label: 'Thuong mai (TMD)' },
              { color: '#f59e0b', label: 'Giao thong (GT)' },
              { color: '#3b82f6', label: 'Cong cong (CCC)' },
              { color: '#a855f7', label: 'Cong nghiep (CN)' },
              { color: '#6b7280', label: 'Chua QH' },
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

        {/* Section: Nearby Projects */}
        <View style={[styles.sectionHeader, { marginTop: 14 }]}>
          <Text style={styles.sectionTitle}>
            Du an Lan can (trong ban kinh 2km)
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
                  <Text style={styles.timelineDistance}>{project.distance}</Text>
                  <Text
                    style={[
                      styles.timelineStatus,
                      {
                        color: getStatusColor(project.status),
                      },
                    ]}
                  >
                    {getStatusLabel(project.status)}
                  </Text>
                  <Text style={styles.timelineYear}>{project.year}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.pageFooter}>
        <Text style={styles.pageFooterText}>HaNoi Realty (c) 2026</Text>
        <Text style={styles.pageFooterText}>
          Bao cao duoc tao tu dong boi AI - Chi mang tinh tham khao
        </Text>
      </View>
    </Page>

    {/* ━━━━ PAGE 3: AI ANALYSIS ━━━━ */}
    <Page size="A4" style={styles.page}>
      <View style={styles.pageHeader}>
        <Text style={styles.pageHeaderLogo}>HaNoi Realty</Text>
        <Text style={styles.pageHeaderTitle}>{listing.title}</Text>
        <Text style={styles.pageHeaderPage}>Trang 3/4</Text>
      </View>

      <View style={styles.pageContent}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Phan tich AI Chuyen sau</Text>
        </View>

        {/* Score Bars */}
        <View style={styles.scoreBarsContainer}>
          <ScoreBar label="Quy hoach" value={report.planningScore} color="#3b82f6" />
          <ScoreBar label="Tien ich" value={report.amenityScore} color="#22c55e" />
          <ScoreBar label="Phap ly" value={report.legalScore} color="#f97316" />
          <ScoreBar
            label="Tiem nang tang gia"
            value={report.priceTrendPotential * 10}
            color="#8b5cf6"
          />
        </View>

        {/* AI Analysis Text */}
        <View style={styles.aiAnalysisBox}>
          <View style={styles.aiAnalysisHeader}>
            <Text style={styles.aiAnalysisBadge}>AI GEMINI</Text>
            <Text style={styles.aiAnalysisTitle}>Nhan dinh tong quan</Text>
          </View>
          <Text style={styles.aiAnalysisText}>{report.aiAnalysis}</Text>
        </View>

        {/* SWOT */}
        <View style={[styles.sectionHeader, { marginTop: 12 }]}>
          <Text style={styles.sectionTitle}>Phan tich SWOT</Text>
        </View>

        <View style={styles.swotGrid}>
          <View style={[styles.swotCard, styles.swotCardS]}>
            <Text style={[styles.swotCardTitle, styles.swotCardTitleS]}>
              Diem manh (S)
            </Text>
            <Text style={styles.swotBullet}>- Vi tri trung tam, giao thong thuan loi</Text>
            <Text style={styles.swotBullet}>- Quy hoach dat o on dinh den 2030</Text>
            <Text style={styles.swotBullet}>- Phap ly day du, so do chinh chu</Text>
          </View>
          <View style={[styles.swotCard, styles.swotCardW]}>
            <Text style={[styles.swotCardTitle, styles.swotCardTitleW]}>
              Diem yeu (W)
            </Text>
            <Text style={styles.swotBullet}>- Gia/m2 cao hon muc trung binh khu vuc</Text>
            <Text style={styles.swotBullet}>- Ngo nho, kho tiep can xe tai lon</Text>
            <Text style={styles.swotBullet}>- Mat do dan so cao, tieng on</Text>
          </View>
          <View style={[styles.swotCard, styles.swotCardO]}>
            <Text style={[styles.swotCardTitle, styles.swotCardTitleO]}>
              Co hoi (O)
            </Text>
            <Text style={styles.swotBullet}>- Metro Line 2 hoan thanh tang gia tri</Text>
            <Text style={styles.swotBullet}>- Nhu cau thue van phong tang manh</Text>
            <Text style={styles.swotBullet}>- Tien ich xung quanh dang mo rong</Text>
          </View>
          <View style={[styles.swotCard, styles.swotCardT]}>
            <Text style={[styles.swotCardTitle, styles.swotCardTitleT]}>
              Thach thuc (T)
            </Text>
            <Text style={styles.swotBullet}>- Lai suat ngan hang co the bien dong</Text>
            <Text style={styles.swotBullet}>- Canh tranh tu cac du an chung cu moi</Text>
            <Text style={styles.swotBullet}>- Chinh sach thue BDS thay doi</Text>
          </View>
        </View>

        {/* Recommendation */}
        <View style={styles.recommendationCard}>
          <Text style={styles.recommendationTitle}>Khuyen nghi Dau tu</Text>
          <Text style={styles.recommendationText}>
            {report.investmentRecommendation}
          </Text>
        </View>
      </View>

      <View style={styles.pageFooter}>
        <Text style={styles.pageFooterText}>HaNoi Realty (c) 2026</Text>
        <Text style={styles.pageFooterText}>Trang 3/4</Text>
      </View>
    </Page>

    {/* ━━━━ PAGE 4: AMENITIES + DISCLAIMER ━━━━ */}
    <Page size="A4" style={styles.page}>
      <View style={styles.pageHeader}>
        <Text style={styles.pageHeaderLogo}>HaNoi Realty</Text>
        <Text style={styles.pageHeaderTitle}>{listing.title}</Text>
        <Text style={styles.pageHeaderPage}>Trang 4/4</Text>
      </View>

      <View style={styles.pageContent}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Tien ich Xung quanh</Text>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderCell}>Loai tien ich</Text>
            <Text style={styles.tableHeaderCell}>Ten</Text>
            <Text style={styles.tableHeaderCell}>Khoang cach</Text>
            <Text style={styles.tableHeaderCell}>Danh gia</Text>
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
                  ? 'Truong hoc'
                  : amenity.type === 'hospital'
                  ? 'Benh vien'
                  : amenity.type === 'mall'
                  ? 'Trung tam TM'
                  : amenity.type === 'park'
                  ? 'Cong vien'
                  : amenity.type === 'metro'
                  ? 'Metro'
                  : 'Tien ich'}
              </Text>
              <Text style={styles.tableCell}>{amenity.name}</Text>
              <Text style={styles.tableCell}>{amenity.distance}</Text>
              <Text style={[styles.tableCell, { color: colors.orange }]}>
                {amenity.rating}/5.0
              </Text>
            </View>
          ))}
        </View>

        {/* Risk Assessment */}
        <View style={[styles.sectionHeader, { marginTop: 14 }]}>
          <Text style={styles.sectionTitle}>Danh gia Rui ro</Text>
        </View>

        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
          {[
            {
              label: 'Rui ro phap ly',
              value: report.legalRisk,
              color: '#22c55e',
              bg: '#dcfce7',
            },
            {
              label: 'Tiem nang tang gia',
              value: `${report.priceTrendPotential}/10`,
              color: '#3b82f6',
              bg: '#dbeafe',
            },
            {
              label: 'Thanh khoan',
              value: 'Trung binh cao',
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
                padding: 10,
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  color: item.color,
                  fontSize: 10.5,
                  fontWeight: 700,
                  marginBottom: 2,
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

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerTitle}>
            TUYEN BO MIEN TRU TRACH NHIEM
          </Text>
          <Text style={styles.disclaimerText}>
            Bao cao nay duoc tao tu dong boi he thong AI cua HaNoi Realty dua tren du lieu quy hoach va thong tin thi truong co san tai thoi diem tao bao cao ({new Date(report.generatedAt).toLocaleDateString('vi-VN')}). Cac phan tich va du bao chi mang tinh tham khao, khong phai loi khuyen dau tu tai chinh. HaNoi Realty khong chiu trach nhiem ve cac quyet dinh dau tu dua tren bao cao nay.
          </Text>
        </View>
      </View>

      {/* Final Footer */}
      <View style={[styles.pageFooter, { borderTopColor: colors.orange }]}>
        <Text style={styles.pageFooterText}>HaNoi Realty - hanoirealty.vn</Text>
        <Text style={styles.pageFooterText}>
          Bao cao AI - #{report.id.slice(0, 8).toUpperCase()} - Trang 4/4
        </Text>
      </View>
    </Page>
  </Document>
);
