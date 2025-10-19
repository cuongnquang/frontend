'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { apiClient } from '@/lib/api';
import { Doctor } from '@/types/types';

export type CreateDoctorData = {
  name: string;
  specialtyId: string;
  bio?: string;
  avatar_url?: string;
  // add other fields as needed
};

export type UpdateDoctorData = Partial<CreateDoctorData>;

interface DoctorContextType {
  doctors: Doctor[];
  selectedDoctor: Doctor | null;
  loading: boolean;
  error: string | null;
  fetchDoctors: (params?: Record<string, string | number | undefined>) => Promise<void>;
  fetchDoctorById: (id: string) => Promise<void>;
  createDoctor: (data: CreateDoctorData) => Promise<{ success: boolean; message: string }>;
  updateDoctor: (id: string, data: UpdateDoctorData) => Promise<{ success: boolean; message: string }>;
  deleteDoctor: (id: string) => Promise<{ success: boolean; message: string }>;
}

const DoctorContext = createContext<DoctorContextType | undefined>(undefined);

export function DoctorProvider({ children }: { children: ReactNode }) {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDoctors = useCallback(async (params?: Record<string, string | number | undefined>) => {
    setLoading(true);
    setError(null);
    try {
      const qs = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([k, v]) => {
          if (v !== undefined && v !== null && String(v) !== '') qs.set(k, String(v));
        });
      }
      const path = `/api/doctors${qs.toString() ? `?${qs.toString()}` : ''}`;
      const res = await apiClient<Doctor[]>(path);
      if (res.status && res.data) {
        // backend may wrap response with { data: [...] } — apiClient returns res.data already
        setDoctors(res.data);
      } else {
        setError(res.message || 'Không thể tải danh sách bác sĩ.');
      }
    } catch (err) {
      setError('Lỗi kết nối đến server.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDoctorById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    setSelectedDoctor(null);
    try {
      const res = await apiClient<Doctor>(`/api/doctors/${id}?service_token=1`);
      
      if (res.status && res.data) {
        setSelectedDoctor(res.data);
      } else {
        setError(res.message || `Không thể tìm thấy bác sĩ với ID: ${id}.`);
      }
    } catch (err) {
      setError('Lỗi kết nối đến server.');
    } finally {
      setLoading(false);
    }
  }, []);

  const createDoctor = async (data: CreateDoctorData): Promise<{ success: boolean; message: string }> => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient('/api/doctors', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      if (!res.status) {
        setError(res.message || 'Tạo bác sĩ thất bại.');
        return { success: false, message: res.message || 'Tạo bác sĩ thất bại.' };
      }
      await fetchDoctors();
      return { success: true, message: res.message || 'Tạo bác sĩ thành công!' };
    } catch (err) {
      setError('Đã có lỗi không mong muốn xảy ra.');
      return { success: false, message: 'Đã có lỗi không mong muốn xảy ra.' };
    } finally {
      setLoading(false);
    }
  };

  const updateDoctor = async (id: string, data: UpdateDoctorData): Promise<{ success: boolean; message: string }> => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient(`/api/doctors/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
      if (!res.status) {
        setError(res.message || 'Cập nhật bác sĩ thất bại.');
        return { success: false, message: res.message || 'Cập nhật bác sĩ thất bại.' };
      }
      await fetchDoctors();
      return { success: true, message: res.message || 'Cập nhật bác sĩ thành công!' };
    } catch (err) {
      setError('Đã có lỗi không mong muốn xảy ra khi cập nhật.');
      return { success: false, message: 'Đã có lỗi không mong muốn xảy ra khi cập nhật.' };
    } finally {
      setLoading(false);
    }
  };

  const deleteDoctor = async (id: string): Promise<{ success: boolean; message: string }> => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient(`/api/doctors/${id}`, { method: 'DELETE' });
      if (!res.status) {
        setError(res.message || 'Xóa bác sĩ thất bại.');
        return { success: false, message: res.message || 'Xóa bác sĩ thất bại.' };
      }
      setDoctors(prev => prev.filter(d => String(d.doctor_id ?? (d as any).id) !== String(id)));
      return { success: true, message: res.message || 'Xóa bác sĩ thành công!' };
    } catch (err) {
      setError('Đã có lỗi không mong muốn xảy ra khi xóa.');
      return { success: false, message: 'Đã có lỗi không mong muốn xảy ra khi xóa.' };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  return (
    <DoctorContext.Provider
      value={{
        doctors,
        selectedDoctor,
        loading,
        error,
        fetchDoctors,
        fetchDoctorById,
        createDoctor,
        updateDoctor,
        deleteDoctor,
      }}
    >
      {children}
    </DoctorContext.Provider>
  );
}

export function useDoctor() {
  const context = useContext(DoctorContext);
  if (context === undefined) {
    throw new Error('useDoctor must be used within a DoctorProvider');
  }
  return context;
}