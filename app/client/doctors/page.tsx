'use client';
import React, { useState } from 'react';
import { Doctor } from '@/types/types'; // Giữ lại import Types
import Header from '@/components/layout/Header';
import  Footer  from '@/components/layout/Footer'; // Đổi thành import Footer nếu nó là component của bạn
import DoctorHeader from '@/components/client/doctors/DoctorHeader';
import DoctorSearchBar from '@/components/client/doctors/DoctorSearchBar';
import DoctorList from '@/components/client/doctors/DoctorList';
import { mockSpecialties, mockDoctors } from '@/public/data'; // Giả định đưa mock data ra file riêng


export default function DoctorPage() {
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  // Logic lọc bác sĩ
  const filteredDoctors = mockDoctors.filter(doctor => {
    const matchesSpecialty = selectedSpecialtyId === 'all' || doctor.specialty_id === selectedSpecialtyId;
    const matchesSearch = doctor.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doctor.Specialty.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSpecialty && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header/>
      
      <DoctorHeader />

      <DoctorSearchBar
        specialties={mockSpecialties}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedSpecialtyId={selectedSpecialtyId}
        setSelectedSpecialtyId={setSelectedSpecialtyId}
      />

      <DoctorList 
        doctors={filteredDoctors} 
        resultsCount={filteredDoctors.length}
        onSelectDoctor={setSelectedDoctor} // Truyền hàm để mở modal/chi tiết
      />

      <Footer/>
    </div>
  );
}