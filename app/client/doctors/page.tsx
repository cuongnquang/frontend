'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Doctor, Specialty } from '@/types/types';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import DoctorHeader from '@/components/client/doctors/DoctorHeader';
import DoctorSearchBar from '@/components/client/doctors/DoctorSearchBar';
import DoctorList from '@/components/client/doctors/DoctorList';
import { apiClient } from '@/lib/api';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Alert from '@/components/ui/Alert';

export default function DoctorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  // Lấy giá trị từ URL hoặc sử dụng giá trị mặc định
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState<string>(searchParams.get('specialty') || 'all');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Chỉ fetch danh sách chuyên khoa một lần
  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const specialtiesRes = await apiClient('/api/specialties');
        if (specialtiesRes.status && specialtiesRes.data) {
          setSpecialties(specialtiesRes.data);
        } else {
          setError(specialtiesRes.message || 'Không thể tải danh sách chuyên khoa.');
        }
      } catch (err: any) {
        setError('Lỗi khi tải chuyên khoa.');
      }
    };
    fetchSpecialties();
  }, []);

  // Fetch danh sách bác sĩ mỗi khi bộ lọc thay đổi
  useEffect(() => {
    const fetchDoctors = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (searchQuery) {
          params.set('q', searchQuery);
        }
        if (selectedSpecialtyId && selectedSpecialtyId !== 'all') {
          params.set('specialty', selectedSpecialtyId);
        }

        const doctorsRes = await apiClient(`/api/doctors?${params.toString()}`);

        if (doctorsRes.status && doctorsRes.data) {
          setDoctors(doctorsRes.data);
        } else {
          setError(doctorsRes.message || 'Không thể tải danh sách bác sĩ.');
        }
      } catch (err) {
        setError('Đã xảy ra lỗi không mong muốn khi tìm kiếm bác sĩ.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctors();
  }, [searchQuery, selectedSpecialtyId]);

  const handleAppointmentDoctor = (doctor: Doctor) => {
    router.push(`/client/appointments?doctorId=${doctor.doctor_id}`);
  };

  const handleSelectDoctor = (doctor: Doctor) => {
    router.push(`/client/doctors/${doctor.doctor_id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header />
      <DoctorHeader />

      <DoctorSearchBar
        specialties={specialties}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedSpecialtyId={selectedSpecialtyId}
        setSelectedSpecialtyId={setSelectedSpecialtyId}
      />

      {isLoading ? (
        <LoadingSpinner />
      ) : error ? (
        <Alert message={error} type="error" />
      ) : (
        <DoctorList
          doctors={doctors}
          resultsCount={doctors.length}
          onSelectDoctor={handleSelectDoctor}
          onAppointmentDoctor={handleAppointmentDoctor}
        />
      )}

      <Footer />
    </div>
  );
}