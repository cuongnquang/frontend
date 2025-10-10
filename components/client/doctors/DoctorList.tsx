import React from 'react';
import { Doctor } from '@/types/types';
import DoctorCard from './DoctorCard'; // Import component con

interface DoctorListProps {
  doctors: Doctor[];
  resultsCount: number;
  onSelectDoctor: (doctor: Doctor) => void;
}

export default function DoctorList({ doctors, resultsCount, onSelectDoctor }: DoctorListProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <p className="text-gray-600">
          Tìm thấy <span className="font-semibold text-gray-900">{resultsCount}</span> bác sĩ
        </p>
      </div>

      {/* Doctors List */}
      <div className="space-y-4">
        {doctors.map((doctor) => (
          <DoctorCard 
            key={doctor.doctor_id} 
            doctor={doctor} 
            onBook={() => onSelectDoctor(doctor)}
          />
        ))}
        
        {resultsCount === 0 && (
          <div className="text-center py-10 text-gray-500 bg-white rounded-xl shadow-sm">
            Không tìm thấy bác sĩ nào phù hợp với tiêu chí tìm kiếm.
          </div>
        )}
      </div>
    </div>
  );
}