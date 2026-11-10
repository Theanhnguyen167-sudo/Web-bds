'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  CalendarDays,
  Plus,
  LayoutList,
  Calendar as CalendarIcon,
  Filter,
  Lock,
  Clock,
  CheckCircle2,
  FileCheck,
  AlertCircle
} from 'lucide-react';
import { AppointmentItem, AppointmentStatus, VisitOutcome } from '@/types/broker-appointment';
import { BrokerProfile } from '@/types/broker-nav';
import { getBrokerAppointments, saveBrokerAppointment } from '@/lib/services/broker-state-service';
import { AppointmentCard } from './AppointmentCard';
import { AppointmentWeekView } from './AppointmentWeekView';
import { CreateAppointmentModal } from './CreateAppointmentModal';
import { UpdateVisitOutcomeModal } from './UpdateVisitOutcomeModal';

interface AppointmentMasterViewProps {
  initialAppointments: AppointmentItem[];
  profile: BrokerProfile;
  onRestrictedClick: (featureName: string) => void;
  presetLeadId?: string;
  presetListingId?: string;
}

export const AppointmentMasterView: React.FC<AppointmentMasterViewProps> = ({
  initialAppointments,
  profile,
  onRestrictedClick,
  presetLeadId,
  presetListingId,
}) => {
  const [appointments, setAppointments] = useState<AppointmentItem[]>(() => {
    return getBrokerAppointments();
  });
  const [viewMode, setViewMode] = useState<'cards' | 'week'>('cards');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(!!presetListingId || false);
  const [selectedAptForOutcome, setSelectedAptForOutcome] = useState<AppointmentItem | null>(null);

  // Sync realtime khi có thay đổi lịch hẹn từ các component khác
  useEffect(() => {
    const handleSync = () => {
      setAppointments(getBrokerAppointments());
    };
    window.addEventListener('hanoi_broker_appointments_updated', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('hanoi_broker_appointments_updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const canCreateAppointment =
    profile.verificationStatus === 'verified' && profile.subscriptionTier !== 'expired';

  // Lọc lịch hẹn
  const filteredAppointments = useMemo(() => {
    return appointments.filter((item) => {
      if (statusFilter === 'all') return true;
      if (statusFilter === 'pending_host') return item.status === 'pending_host';
      if (statusFilter === 'confirmed') return item.status === 'confirmed';
      if (statusFilter === 'completed') return item.status === 'completed';
      if (statusFilter === 'cancelled_rescheduled') {
        return item.status === 'cancelled' || item.status === 'rescheduled';
      }
      return true;
    });
  }, [appointments, statusFilter]);

  const handleCreateSuccess = (newApt: AppointmentItem) => {
    setAppointments(saveBrokerAppointment(newApt));
  };

  const handleSaveOutcome = (aptId: string, outcome: VisitOutcome) => {
    setAppointments((prev) =>
      prev.map((item) =>
        item.id === aptId
          ? {
            ...item,
            status: 'completed',
            outcome,
          }
          : item
      )
    );
  };

  const handleCancelOrReschedule = (apt: AppointmentItem) => {
    const isCancel = confirm(`Bạn có chắc chắn muốn hủy lịch hẹn xem nhà cho khách ${apt.leadName}?`);
    if (isCancel) {
      setAppointments((prev) =>
        prev.map((item) => (item.id === apt.id ? { ...item, status: 'cancelled' } : item))
      );
    }
  };

  const filterTabs = [
    { key: 'all', label: 'Tất cả lịch hẹn', count: appointments.length },
    { key: 'pending_host', label: 'Chờ chủ nhà duyệt', count: appointments.filter(a => a.status === 'pending_host').length },
    { key: 'confirmed', label: 'Đã xác nhận', count: appointments.filter(a => a.status === 'confirmed').length },
    { key: 'completed', label: 'Đã hoàn thành', count: appointments.filter(a => a.status === 'completed').length },
    { key: 'cancelled_rescheduled', label: 'Đổi/Hủy lịch', count: appointments.filter(a => a.status === 'cancelled' || a.status === 'rescheduled').length },
  ];

  return (
    <div className="space-y-4">

      {/* 1. THANH CÔNG CỤ TOOLBAR */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">

        {/* Switch View (Danh sách vs Lịch tuần) */}
        <div className="flex items-center rounded-xl border border-slate-200 bg-slate-100 p-1 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setViewMode('cards')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'cards' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
          >
            <LayoutList className="h-4 w-4" />
            <span>Danh sách</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('week')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'week' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
          >
            <CalendarIcon className="h-4 w-4" />
            <span>Lịch tuần</span>
          </button>
        </div>

        {/* Nút Tạo lịch hẹn mới */}
        <button
          type="button"
          onClick={() => {
            if (!canCreateAppointment) {
              onRestrictedClick('Tạo lịch hẹn dẫn khách xem nhà');
              return;
            }
            setIsCreateModalOpen(true);
          }}
          className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all shadow-xs ${canCreateAppointment
              ? 'bg-blue-600 text-white hover:bg-blue-500'
              : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
            }`}
        >
          {canCreateAppointment ? <Plus className="h-4 w-4" /> : <Lock className="h-3.5 w-3.5" />}
          <span>+ Tạo lịch hẹn xem nhà mới</span>
        </button>
      </div>

      {/* 2. THANH TAB LỌC TRẠNG THÁI */}
      <div className="flex overflow-x-auto gap-1 border-b border-slate-200 bg-white p-1.5 rounded-2xl shadow-2xs no-scrollbar">
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setStatusFilter(tab.key)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${statusFilter === tab.key
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
          >
            <span>{tab.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${statusFilter === tab.key ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600'
                }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* 3. HIỂN THỊ DẠNG CARDS HOẶC LỊCH TUẦN */}
      {viewMode === 'week' ? (
        <AppointmentWeekView
          appointments={filteredAppointments}
          onOpenOutcomeModal={(apt) => setSelectedAptForOutcome(apt)}
        />
      ) : (
        <div>
          {filteredAppointments.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-xs">
              <CalendarDays className="h-10 w-10 text-slate-300 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-800">Không có lịch hẹn nào</h3>
              <p className="text-xs text-slate-500 mt-1">
                Hãy kết nối với khách hàng trong CRM và tạo lịch dẫn xem để hỗ trợ chốt giao dịch.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredAppointments.map((apt) => (
                <AppointmentCard
                  key={apt.id}
                  item={apt}
                  onOpenOutcomeModal={(item) => setSelectedAptForOutcome(item)}
                  onCancelOrReschedule={handleCancelOrReschedule}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL 1: TẠO LỊCH HẸN MỚI */}
      <CreateAppointmentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
        presetLeadId={presetLeadId}
        presetListingId={presetListingId}
      />

      {/* MODAL 2: CẬP NHẬT KẾT QUẢ BUỔI XEM */}
      <UpdateVisitOutcomeModal
        isOpen={!!selectedAptForOutcome}
        onClose={() => setSelectedAptForOutcome(null)}
        appointment={selectedAptForOutcome}
        onSaveOutcome={handleSaveOutcome}
      />

    </div>
  );
};

