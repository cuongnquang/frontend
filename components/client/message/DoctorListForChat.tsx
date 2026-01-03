'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { MessageCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';

interface BookedDoctor {
  id: string;
  user_id: string;
  full_name: string;
  avatar_url?: string;
  specialty_name?: string;
  title?: string;
}

interface DoctorListProps {
  onSelectDoctor: (doctor: BookedDoctor) => void;
}

export default function DoctorListForChat({ onSelectDoctor }: DoctorListProps) {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState<BookedDoctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookedDoctors = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Lấy danh sách cuộc hẹn của bệnh nhân
        const appointmentsRes = await apiClient<any>('/api/appointments?status=all');
        
        if (!appointmentsRes.status || !appointmentsRes.data) {
          setDoctors([]);
          return;
        }

        // Extract unique doctors from appointments
        const appointmentData = appointmentsRes.data as any[];
        const uniqueDoctorMap = new Map<string, BookedDoctor>();

        appointmentData.forEach((appointment: any) => {
          if (appointment.doctor_id && !uniqueDoctorMap.has(appointment.doctor_id)) {
            uniqueDoctorMap.set(appointment.doctor_id, {
              id: appointment.doctor_id,
              user_id: appointment.doctor_user_id || appointment.doctor_id,
              full_name: appointment.doctor_name || 'Bác sĩ',
              avatar_url: appointment.doctor_avatar,
              specialty_name: appointment.specialty_name,
              title: appointment.doctor_title,
            });
          }
        });

        setDoctors(Array.from(uniqueDoctorMap.values()));
      } catch (err) {
        console.error('Failed to fetch booked doctors:', err);
        setError('Không thể tải danh sách bác sĩ');
        setDoctors([]);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchBookedDoctors();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    );
  }

  if (doctors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-gray-300 mb-3">📋</div>
        <p className="text-gray-500 text-sm">Bạn chưa có cuộc hẹn nào với bác sĩ</p>
        <p className="text-gray-400 text-xs mt-1">Đặt lịch khám để có thể nhắn tin với bác sĩ</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-700 px-4 pt-4">Bác sĩ đã đặt lịch</h3>
      <div className="space-y-2 px-3">
        {doctors.map((doctor) => (
          <button
            key={doctor.id}
            onClick={() => onSelectDoctor(doctor)}
            className="w-full p-3 text-left hover:bg-blue-50 rounded-lg transition-all border border-gray-200 hover:border-blue-300 flex items-center gap-3 group"
          >
            {doctor.avatar_url ? (
              <Image
                src={doctor.avatar_url}
                alt={doctor.full_name}
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                {doctor.full_name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-gray-900 truncate group-hover:text-blue-600">
                {doctor.full_name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {doctor.specialty_name || 'Chuyên khoa'}
              </p>
            </div>
            <MessageCircle className="w-4 h-4 text-gray-400 group-hover:text-blue-600 flex-shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
}
