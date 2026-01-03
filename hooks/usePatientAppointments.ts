"use client";

import { useState, useCallback, useEffect } from 'react';
import { apiClient } from '@/lib/api';

export interface PatientAppointment {
  id: string;
  patient_id: string;
  patient_name: string;
  doctor_id: string;
  doctor_name: string;
  doctor_specialty?: string;
  doctor_avatar?: string;
  schedule_date: string;
  start_time: string;
  end_time: string;
  hospital?: string;
  symptoms?: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  price?: string;
  createdAt: string;
  updatedAt: string;
}

export const usePatientAppointments = () => {
  const [appointments, setAppointments] = useState<PatientAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient<PatientAppointment[]>('/api/appointments/patient-medical-history');
      if (res.status && res.data) {
        // Transform data if needed
        const transformedData = res.data.map(apt => ({
          ...apt,
          doctor_specialty: apt.doctor_specialty || 'Chuyên khoa',
          hospital: apt.hospital || 'Bệnh viện',
        }));
        setAppointments(transformedData);
      } else {
        setError(res.message || 'Không thể lấy danh sách lịch hẹn');
        setAppointments([]);
      }
    } catch (err) {
      setError('Lỗi khi lấy danh sách lịch hẹn');
      setAppointments([]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const cancelAppointment = useCallback(async (appointmentId: string, reason?: string) => {
    try {
      const res = await apiClient(`/api/appointments/${appointmentId}/actions/cancel`, {
        method: 'POST',
        body: JSON.stringify({ reason }),
      });
      
      if (res.status) {
        // Update local state
        setAppointments(prev =>
          prev.map(apt =>
            apt.id === appointmentId ? { ...apt, status: 'cancelled' } : apt
          )
        );
        return { success: true, message: 'Hủy lịch hẹn thành công' };
      }
      return { success: false, message: res.message || 'Lỗi khi hủy lịch hẹn' };
    } catch (err) {
      return { success: false, message: 'Lỗi khi hủy lịch hẹn' };
    }
  }, []);

  const completeAppointment = useCallback(async (appointmentId: string) => {
    try {
      const res = await apiClient(`/api/appointments/${appointmentId}/actions/complete`, {
        method: 'POST',
      });
      
      if (res.status) {
        setAppointments(prev =>
          prev.map(apt =>
            apt.id === appointmentId ? { ...apt, status: 'completed' } : apt
          )
        );
        return { success: true, message: 'Hoàn thành lịch hẹn' };
      }
      return { success: false, message: res.message || 'Lỗi khi hoàn thành lịch hẹn' };
    } catch (err) {
      return { success: false, message: 'Lỗi khi hoàn thành lịch hẹn' };
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  return {
    appointments,
    loading,
    error,
    fetchAppointments,
    cancelAppointment,
    completeAppointment,
  };
};
