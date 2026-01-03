'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { apiClient } from '@/lib/api';
import { useAuth } from './AuthContext';

export interface Appointment {
  id: string;
  patient_id: string;
  patient_name: string;
  doctor_id: string;
  doctor_name: string;
  schedule_date: string;
  start_time: string;
  end_time: string;
  symptoms?: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentStatistics {
  total: number;
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  noShow: number;
}

interface AppointmentContextType {
  // State
  appointments: Appointment[];
  selectedAppointment: Appointment | null;
  loading: boolean;
  error: string | null;
  statistics: AppointmentStatistics;
  
  // Methods
  fetchAppointments: (filters?: { status?: string; startDate?: string; endDate?: string }) => Promise<void>;
  fetchAppointmentById: (id: string) => Promise<void>;
  confirmAppointment: (id: string) => Promise<{ success: boolean; message: string }>;
  cancelAppointment: (id: string, reason?: string) => Promise<{ success: boolean; message: string }>;
  completeAppointment: (id: string) => Promise<{ success: boolean; message: string }>;
  getDoctorSchedule: (doctorId?: string) => Promise<any[]>;
  getAppointmentStatistics: () => Promise<AppointmentStatistics>;
  refreshAppointments: () => Promise<void>;
  clearError: () => void;
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

const defaultStatistics: AppointmentStatistics = {
  total: 0,
  pending: 0,
  confirmed: 0,
  completed: 0,
  cancelled: 0,
  noShow: 0,
};

export const AppointmentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statistics, setStatistics] = useState<AppointmentStatistics>(defaultStatistics);

  // Clear error message
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Calculate statistics from appointments array
  const calculateStatistics = (appts: Appointment[]): AppointmentStatistics => {
    return {
      total: appts.length,
      pending: appts.filter((a) => a.status === 'pending').length,
      confirmed: appts.filter((a) => a.status === 'confirmed').length,
      completed: appts.filter((a) => a.status === 'completed').length,
      cancelled: appts.filter((a) => a.status === 'cancelled').length,
      noShow: 0,
    };
  };

  // Lấy danh sách lịch hẹn
  const fetchAppointments = useCallback(
    async (filters?: { status?: string; startDate?: string; endDate?: string }) => {
      if (!user) {
        setAppointments([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Kiểm tra role của user và chọn endpoint phù hợp
        let url = '';
        
        if (user.role === 'doctor') {
          url = '/api/appointments/doctor-schedule';
        } else if (user.role === 'patient') {
          url = '/api/appointments/patient-medical-history';
        } else if (user.role === 'admin') {
          url = '/api/appointments/doctor-schedule';
        }

        if (!url) {
          setAppointments([]);
          setLoading(false);
          return;
        }

        const response = await apiClient<any>(url);

        if (response.status && response.data) {
          let appointmentData = Array.isArray(response.data)
            ? response.data
            : response.data?.data || [];
          
          setAppointments(appointmentData);
          const stats = calculateStatistics(appointmentData);
          setStatistics(stats);
          
          console.log('✅ Appointments loaded:', appointmentData.length);
        } else {
          console.warn('⚠️ Could not load appointments:', response.message);
          setAppointments([]);
          setStatistics(calculateStatistics([]));
        }
      } catch (err: any) {
        console.warn('⚠️ Warning loading appointments:', err.message);
        setAppointments([]);
        setStatistics(calculateStatistics([]));
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  // Lấy chi tiết lịch hẹn
  const fetchAppointmentById = useCallback(async (id: string) => {
    setError(null);
    setSelectedAppointment(null);

    try {
      const response = await apiClient<Appointment>(`/api/appointments/${id}`);

      if (response.status && response.data) {
        setSelectedAppointment(response.data);
        console.log('✅ Appointment detail loaded:', response.data);
      } else {
        setError(response.message || `Không thể tìm thấy lịch hẹn với ID: ${id}`);
        console.error('❌ Error loading appointment detail:', response.message);
      }
    } catch (err: any) {
      const errorMsg = err.message || 'Lỗi khi tải chi tiết lịch hẹn';
      setError(errorMsg);
      console.error('❌ Error:', errorMsg);
    }
  }, []);

  // Xác nhận lịch hẹn
  const confirmAppointment = async (id: string): Promise<{ success: boolean; message: string }> => {
    setError(null);
    try {
      const response = await apiClient(`/api/appointments/${id}/actions/confirm`, {
        method: 'POST',
        body: JSON.stringify({}),
      });

      if (response.status) {
        console.log('✅ Appointment confirmed:', id);
        // Update local state
        setAppointments((prev) =>
          prev.map((appt) =>
            appt.id === id ? { ...appt, status: 'confirmed' } : appt
          )
        );
        // Refresh statistics
        const stats = calculateStatistics(appointments);
        setStatistics(stats);
        return { success: true, message: response.message || 'Xác nhận lịch hẹn thành công!' };
      } else {
        setError(response.message || 'Không thể xác nhận lịch hẹn');
        console.error('❌ Error confirming appointment:', response.message);
        return { success: false, message: response.message || 'Không thể xác nhận lịch hẹn' };
      }
    } catch (err: any) {
      const errorMsg = err.message || 'Lỗi khi xác nhận lịch hẹn';
      setError(errorMsg);
      console.error('❌ Error:', errorMsg);
      return { success: false, message: errorMsg };
    }
  };

  // Hủy lịch hẹn
  const cancelAppointment = async (
    id: string,
    reason?: string
  ): Promise<{ success: boolean; message: string }> => {
    setError(null);
    try {
      const body = reason ? { reason } : {};
      const response = await apiClient(`/api/appointments/${id}/actions/cancel`, {
        method: 'POST',
        body: JSON.stringify(body),
      });

      if (response.status) {
        console.log('✅ Appointment cancelled:', id);
        // Update local state
        setAppointments((prev) =>
          prev.map((appt) =>
            appt.id === id ? { ...appt, status: 'cancelled' } : appt
          )
        );
        // Refresh statistics
        const stats = calculateStatistics(appointments);
        setStatistics(stats);
        return { success: true, message: response.message || 'Hủy lịch hẹn thành công!' };
      } else {
        setError(response.message || 'Không thể hủy lịch hẹn');
        console.error('❌ Error cancelling appointment:', response.message);
        return { success: false, message: response.message || 'Không thể hủy lịch hẹn' };
      }
    } catch (err: any) {
      const errorMsg = err.message || 'Lỗi khi hủy lịch hẹn';
      setError(errorMsg);
      console.error('❌ Error:', errorMsg);
      return { success: false, message: errorMsg };
    }
  };

  // Hoàn thành lịch hẹn
  const completeAppointment = async (id: string): Promise<{ success: boolean; message: string }> => {
    setError(null);
    try {
      const response = await apiClient(`/api/appointments/${id}/actions/complete`, {
        method: 'POST',
        body: JSON.stringify({}),
      });

      if (response.status) {
        console.log('✅ Appointment completed:', id);
        // Update local state
        setAppointments((prev) =>
          prev.map((appt) =>
            appt.id === id ? { ...appt, status: 'completed' } : appt
          )
        );
        // Refresh statistics
        const stats = calculateStatistics(appointments);
        setStatistics(stats);
        return { success: true, message: response.message || 'Hoàn thành lịch hẹn thành công!' };
      } else {
        setError(response.message || 'Không thể hoàn thành lịch hẹn');
        console.error('❌ Error completing appointment:', response.message);
        return { success: false, message: response.message || 'Không thể hoàn thành lịch hẹn' };
      }
    } catch (err: any) {
      const errorMsg = err.message || 'Lỗi khi hoàn thành lịch hẹn';
      setError(errorMsg);
      console.error('❌ Error:', errorMsg);
      return { success: false, message: errorMsg };
    }
  };

  // Lấy lịch của bác sĩ
  const getDoctorSchedule = useCallback(
    async (doctorId?: string): Promise<any[]> => {
      try {
        const url = doctorId
          ? `/api/appointments/doctor-schedule?doctorId=${doctorId}`
          : '/api/appointments/doctor-schedule';
        const response = await apiClient<any>(url);

        if (response.status && response.data) {
          const scheduleData = Array.isArray(response.data)
            ? response.data
            : response.data?.data || [];
          console.log('✅ Doctor schedule loaded');
          return scheduleData;
        } else {
          console.error('❌ Error loading doctor schedule:', response.message);
          return [];
        }
      } catch (err: any) {
        console.error('❌ Error:', err.message);
        return [];
      }
    },
    []
  );

  // Calculate appointment statistics
  const getAppointmentStatistics = useCallback(async (): Promise<AppointmentStatistics> => {
    try {
      const response = await apiClient<AppointmentStatistics>('/api/appointments/statistics');

      if (response.status && response.data) {
        setStatistics(response.data);
        return response.data;
      } else {
        console.error('❌ Error loading statistics:', response.message);
        return defaultStatistics;
      }
    } catch (err: any) {
      console.error('❌ Error:', err.message);
      return defaultStatistics;
    }
  }, []);

  // Refresh appointments
  const refreshAppointments = useCallback(async () => {
    await fetchAppointments();
  }, [fetchAppointments]);

  // Load appointments on mount
  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
  }, [user]);

  const value: AppointmentContextType = {
    appointments,
    selectedAppointment,
    loading,
    error,
    statistics,
    fetchAppointments,
    fetchAppointmentById,
    confirmAppointment,
    cancelAppointment,
    completeAppointment,
    getDoctorSchedule,
    getAppointmentStatistics,
    refreshAppointments,
    clearError,
  };

  return (
    <AppointmentContext.Provider value={value}>
      {children}
    </AppointmentContext.Provider>
  );
};

export const useAppointment = () => {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error('useAppointment must be used within AppointmentProvider');
  }
  return context;
};
