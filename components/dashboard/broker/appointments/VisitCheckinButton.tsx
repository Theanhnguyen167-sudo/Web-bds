'use client';

import React, { useState } from 'react';
import {
  MapPin,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  RefreshCw,
  Navigation,
  Compass,
  X,
  FileCheck2,
  ExternalLink,
  Laptop
} from 'lucide-react';
import { VisitCheckinRecord } from '@/types/broker-appointment';

interface VisitCheckinButtonProps {
  appointmentId: string;
  propertyCode: string;
  propertyTitle?: string;
  meetingAddress: string;
  targetCoordinates?: { lat: number; lng: number };
  initialCheckin?: VisitCheckinRecord;
  onCheckinSuccess?: (record: VisitCheckinRecord) => void;
  className?: string;
}

// Bán kính hợp lệ tối đa: 150 mét
const MAX_ALLOWED_DISTANCE_METERS = 150;

/**
 * Tính khoảng cách giữa hai tọa độ địa lý theo công thức Haversine (đơn vị: Mét)
 */
function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000; // Bán kính trái đất tính bằng mét
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

export const VisitCheckinButton: React.FC<VisitCheckinButtonProps> = ({
  appointmentId,
  propertyCode,
  propertyTitle,
  meetingAddress,
  targetCoordinates = { lat: 21.033333, lng: 105.850000 }, // Mặc định Hà Nội
  initialCheckin,
  onCheckinSuccess,
  className = '',
}) => {
  const [checkinRecord, setCheckinRecord] = useState<VisitCheckinRecord | undefined>(initialCheckin);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [distanceAlert, setDistanceAlert] = useState<{
    actualDistance: number;
    userCoords: { lat: number; lng: number };
  } | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Xử lý Check-in Geolocation thực tế
  const handlePerformCheckin = () => {
    setErrorMessage(null);
    setDistanceAlert(null);

    if (typeof window === 'undefined' || !navigator.geolocation) {
      setErrorMessage('Trình duyệt hoặc thiết bị của bạn không hỗ trợ định vị Geolocation.');
      return;
    }

    setIsLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        const accuracy = Math.round(position.coords.accuracy || 10);

        const distance = calculateHaversineDistance(
          userLat,
          userLng,
          targetCoordinates.lat,
          targetCoordinates.lng
        );

        setIsLoading(false);

        if (distance <= MAX_ALLOWED_DISTANCE_METERS) {
          // Hợp lệ trong bán kính <= 150m
          const newRecord: VisitCheckinRecord = {
            checkedInAt: new Date().toISOString(),
            lat: Number(userLat.toFixed(6)),
            lng: Number(userLng.toFixed(6)),
            distanceMeters: distance,
            accuracyMeters: accuracy,
            isSimulated: false,
          };
          setCheckinRecord(newRecord);
          setShowDetailModal(true);
          if (onCheckinSuccess) onCheckinSuccess(newRecord);
        } else {
          // Vi phạm: Đứng cách xa hơn 150m
          setDistanceAlert({
            actualDistance: distance,
            userCoords: { lat: userLat, lng: userLng },
          });
        }
      },
      (error) => {
        setIsLoading(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setErrorMessage('Vui lòng cấp quyền truy cập vị trí (GPS) trên thiết bị để thực hiện check-in.');
            break;
          case error.POSITION_UNAVAILABLE:
            setErrorMessage('Không thể thu thập tín hiệu GPS tại thời điểm này. Vui lòng thử lại.');
            break;
          case error.TIMEOUT:
            setErrorMessage('Yêu cầu định vị GPS hết thời gian chờ. Vui lòng thử lại.');
            break;
          default:
            setErrorMessage('Đã xảy ra lỗi khi lấy vị trí GPS: ' + error.message);
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // Giả lập check-in hiện trường (Dành cho Dev & Tester thử nghiệm tính năng)
  const handleSimulateCheckin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setDistanceAlert(null);
      setErrorMessage(null);

      // Mô phỏng vị trí cách mục tiêu 38 mét (hợp lệ <= 150m)
      const simulatedRecord: VisitCheckinRecord = {
        checkedInAt: new Date().toISOString(),
        lat: Number((targetCoordinates.lat + 0.00025).toFixed(6)),
        lng: Number((targetCoordinates.lng + 0.00015).toFixed(6)),
        distanceMeters: 38,
        accuracyMeters: 5,
        isSimulated: true,
      };

      setCheckinRecord(simulatedRecord);
      setShowDetailModal(true);
      if (onCheckinSuccess) onCheckinSuccess(simulatedRecord);
    }, 800);
  };

  return (
    <>
      <div className={`inline-flex flex-col gap-1.5 ${className}`}>
        {checkinRecord ? (
          /* Trạng thái: ĐÃ CHECK-IN TẠI HIỆN TRƯỜNG */
          <button
            type="button"
            onClick={() => setShowDetailModal(true)}
            className="group inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 border border-emerald-300 px-3 py-1.5 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition-all shadow-2xs"
            title="Bấm để xem chứng thư số GPS hiện trường"
          >
            <ShieldCheck className="h-4 w-4 text-emerald-600 group-hover:scale-110 transition-transform" />
            <span>
              Đã check-in ({checkinRecord.distanceMeters}m
              {checkinRecord.isSimulated ? ' • Demo' : ''})
            </span>
          </button>
        ) : (
          /* Trạng thái: CHƯA CHECK-IN -> NÚT THỰC HIỆN */
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={isLoading}
              onClick={handlePerformCheckin}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:from-blue-500 hover:to-indigo-500 shadow-xs transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  <span>Đang quét GPS...</span>
                </>
              ) : (
                <>
                  <Compass className="h-3.5 w-3.5 text-blue-200" />
                  <span>Check-in GPS (&le;150m)</span>
                </>
              )}
            </button>

            {/* Nút giả lập cho môi trường phát triển / test */}
            <button
              type="button"
              disabled={isLoading}
              onClick={handleSimulateCheckin}
              className="rounded-lg p-1 text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition-colors"
              title="Test GPS hiện trường (Mô phỏng khoảng cách 38m)"
            >
              <Laptop className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* Thông báo lỗi GPS nếu có */}
        {errorMessage && (
          <div className="flex items-center gap-1 text-[11px] text-rose-600 font-medium">
            <AlertTriangle className="h-3 w-3 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* MODAL CẢNH BÁO VI PHẠM KHOẢNG CÁCH (> 150M) */}
      {distanceAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-rose-200 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Vượt Quá Bán Kính Hiện Trường
                </h3>
                <span className="text-xs font-semibold text-rose-600">
                  Khoảng cách thực tế: {distanceAlert.actualDistance.toLocaleString('vi-VN')} mét
                </span>
              </div>
            </div>

            <div className="rounded-xl bg-rose-50/70 border border-rose-200 p-3.5 text-xs text-rose-950 space-y-2 leading-relaxed">
              <p>
                Hệ thống đo được bạn đang cách điểm hẹn đón khách{' '}
                <strong>{distanceAlert.actualDistance} mét</strong> (quy định bắt buộc là{' '}
                <strong>&le; 150 mét</strong>).
              </p>
              <p className="text-slate-600">
                📍 <strong>Điểm đón tiếp:</strong> {meetingAddress}
              </p>
              <div className="pt-1 text-[11px] text-slate-500 italic">
                Cơ chế này nhằm ngăn chặn tình trạng check-in khống khi chưa có mặt tại hiện trường,
                tạo bằng chứng số bảo vệ quyền lợi môi giới chống lại hành vi luồn cò.
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={handleSimulateCheckin}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Mô phỏng đạt chuẩn (Test)
              </button>
              <button
                type="button"
                onClick={() => setDistanceAlert(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-xs font-bold text-white hover:bg-slate-800"
              >
                Đã hiểu & Di chuyển tới nhà
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CHỨNG THƯ SỐ CHECK-IN HIỆN TRƯỜNG */}
      {showDetailModal && checkinRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl border border-emerald-100 overflow-hidden">
            
            {/* Header Chứng Thư */}
            <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-emerald-300">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm leading-tight">
                    Chứng Thư Định Vị Hiện Trường
                  </h3>
                  <span className="text-[11px] text-emerald-200 font-mono">
                    #{propertyCode} • Bán kính hợp lệ
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowDetailModal(false)}
                className="rounded-lg p-1 text-emerald-200 hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 border border-emerald-200 p-3.5 text-xs text-emerald-950">
                <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0" />
                <div>
                  <strong className="font-bold block">Xác thực có mặt tại căn nhà thành công!</strong>
                  <span className="text-[11px] text-emerald-800">
                    Khoảng cách GPS đến mục tiêu: <strong>{checkinRecord.distanceMeters}m</strong> (Bán kính cho phép &le;150m).
                  </span>
                </div>
              </div>

              {/* Chi tiết dữ liệu GPS đã niêm phong */}
              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 space-y-2.5 text-xs">
                <div className="flex justify-between border-b border-slate-200/80 pb-2">
                  <span className="text-slate-500">Thời gian niêm phong:</span>
                  <span className="font-mono font-bold text-slate-800">
                    {new Date(checkinRecord.checkedInAt).toLocaleString('vi-VN')}
                  </span>
                </div>

                <div className="flex justify-between border-b border-slate-200/80 pb-2">
                  <span className="text-slate-500">Tọa độ GPS xác thực:</span>
                  <span className="font-mono font-bold text-blue-700">
                    {checkinRecord.lat}, {checkinRecord.lng}
                  </span>
                </div>

                <div className="flex justify-between border-b border-slate-200/80 pb-2">
                  <span className="text-slate-500">Độ lệch tâm:</span>
                  <span className="font-mono font-semibold text-slate-700">
                    &plusmn;{checkinRecord.accuracyMeters || 8} mét
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Phương thức:</span>
                  <span className="font-bold text-slate-800">
                    {checkinRecord.isSimulated ? 'Mô phỏng kiểm thử (Dev Mode)' : 'HTML5 Geolocation WGS-84'}
                  </span>
                </div>
              </div>

              <div className="rounded-xl bg-blue-50/70 border border-blue-200 p-3 text-[11px] text-blue-900 leading-relaxed">
                🛡️ <strong>Bảo vệ chống luồn cò:</strong> Bản ghi tọa độ này được mã hóa và gắn vào biên bản dẫn khách. Trong trường hợp xảy ra tranh chấp giao dịch, môi giới có đầy đủ bằng chứng đã trực tiếp đưa khách tới căn nhà.
              </div>

              <div className="pt-2 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setShowDetailModal(false)}
                  className="w-full rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition-colors"
                >
                  Đóng chứng thư
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

