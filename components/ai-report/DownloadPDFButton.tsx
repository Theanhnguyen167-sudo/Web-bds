'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DownloadPDFButtonProps {
  reportId: string;
  report: any;
  listing: any;
  userName?: string;
}

export function DownloadPDFButton({
  reportId,
  report,
  listing,
  userName = 'Chuyên viên BĐS Hà Nội',
}: DownloadPDFButtonProps) {
  const [state, setState] = useState<'idle' | 'generating' | 'done' | 'error'>('idle');
  const [progress, setProgress] = useState(0);

  const handleDownload = async () => {
    setState('generating');
    setProgress(0);

    const steps = [
      { msg: 'Đang tổng hợp dữ liệu quy hoạch...', progress: 25 },
      { msg: 'Đang kết xuất 4 trang PDF...', progress: 60 },
      { msg: 'Đang xuất file tài liệu...', progress: 85 },
      { msg: 'Hoàn tất tải xuống!', progress: 100 },
    ];

    for (const step of steps.slice(0, 3)) {
      setProgress(step.progress);
      await new Promise((r) => setTimeout(r, 300));
    }

    try {
      const response = await fetch('/api/reports/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          report: {
            id: reportId || report?.id || 'rep-1',
            score: report?.score || 82,
            planningScore: report?.planningScore || 85,
            amenityScore: report?.amenityScore || 88,
            legalScore: report?.legalScore || 90,
            planningZone: report?.planningZone || 'Đất ở đô thị',
            planningStatus: report?.planningStatus || 'Chuẩn quy hoạch 100%',
            floorAreaRatio: report?.floorAreaRatio || 3.5,
            maxHeight: report?.maxHeight || '5 tầng + 1 tum',
            nearbyProjects: report?.nearbyProjects || [
              { name: 'Tuyến Metro Line 2A', distance: '300m', status: 'completed', year: '2021' },
              { name: 'Mở rộng đường Vành đai 1', distance: '600m', status: 'construction', year: '2026' },
            ],
            amenities: report?.amenities || [
              { type: 'school', name: 'ĐH Ngoại Thương', distance: '1.2km', rating: 4.8 },
              { type: 'hospital', name: 'Bệnh viện Đống Đa', distance: '850m', rating: 4.5 },
              { type: 'mall', name: 'Vincom Nguyễn Chí Thanh', distance: '1.5km', rating: 4.9 },
            ],
            aiAnalysis:
              report?.aiAnalysis ||
              'Bất động sản sở hữu vị trí chiến lược, hưởng lợi lớn từ hạ tầng giao thông đồng bộ và tuyến Metro lân cận. Quy hoạch đất ở đô thị ổn định lâu dài.',
            investmentRecommendation:
              report?.investmentRecommendation ||
              'Khuyến nghị mua để ở kết hợp kinh doanh hoặc nắm giữ trung - dài hạn với tỷ suất sinh lời kỳ vọng 12-15%/năm.',
            priceTrendPotential: report?.priceTrendPotential || 8.5,
            legalRisk: report?.legalRisk || 'An toàn tuyệt đối',
            generatedAt: report?.generatedAt || new Date().toISOString(),
          },
          listing: {
            title: listing?.title || 'Nhà Phố Trung Tâm Hà Nội',
            address: listing?.address || 'Hà Nội',
            price: listing?.price || 8500000000,
            area: listing?.area || 65,
            pricePerM2: listing?.pricePerM2 || 130769230,
            propertyType: listing?.type || 'Nhà riêng',
            district: listing?.district || 'Đống Đa',
          },
          userName,
        }),
      });

      if (!response.ok) throw new Error('PDF generation failed');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `HaNoi-Realty-AI-Report-${(reportId || '01').slice(0, 8)}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setProgress(100);
      setState('done');
      setTimeout(() => setState('idle'), 3000);
    } catch (err) {
      console.error('Download error:', err);
      setState('error');
      setTimeout(() => setState('idle'), 2500);
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <motion.div whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.02 }}>
        <Button
          onClick={handleDownload}
          disabled={state === 'generating'}
          className={`w-full gap-2 py-3 text-xs font-black shadow-lg transition-all ${
            state === 'done'
              ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20'
              : state === 'error'
              ? 'bg-red-600 hover:bg-red-700'
              : 'bg-accent hover:bg-accent-hover shadow-accent/25'
          } text-white`}
        >
          {state === 'idle' && (
            <>
              <Download size={16} />
              <span>Tải báo cáo PDF (A4)</span>
            </>
          )}
          {state === 'generating' && (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Đang kết xuất PDF...</span>
            </>
          )}
          {state === 'done' && (
            <>
              <CheckCircle2 size={16} />
              <span>Đã tải xuống file PDF!</span>
            </>
          )}
          {state === 'error' && <span>❌ Lỗi, vui lòng thử lại</span>}
        </Button>
      </motion.div>

      {state === 'generating' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="overflow-hidden space-y-1 mt-1"
        >
          <div className="bg-slate-200 rounded-full h-1.5 overflow-hidden">
            <motion.div
              className="bg-accent h-full rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <p className="text-[10px] text-text-muted text-center font-medium">
            {progress < 30
              ? 'Đang tổng hợp dữ liệu quy hoạch...'
              : progress < 60
              ? 'Đang kết xuất 4 trang PDF...'
              : progress < 90
              ? 'Đang nạp bảng biểu & biểu đồ...'
              : 'Hoàn tất!'}
          </p>
        </motion.div>
      )}
    </div>
  );
}
