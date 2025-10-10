'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Doctor, DoctorSchedule, Review } from '@/types/types';

import DoctorProfileCard from '@/components/client/doctors/details/DoctorProfileCard';
import DoctorInfoTabs from '@/components/client/doctors/details/DoctorInfoTabs';
import BookingPanel from '@/components/client/doctors/details/BookingPanel';

import { mockDoctors, mockSchedules, mockReviews } from '@/public/data';

export default function DoctorDetailPage() {
  const router = useRouter();
  const [selectedDateString, setSelectedDateString] = useState<string>('');
  const [selectedSchedule, setSelectedSchedule] = useState<DoctorSchedule | null>(null);
  
  const doctor: Doctor = mockDoctors[0];
  const schedules: DoctorSchedule[] = mockSchedules;
  const reviews: Review[] = mockReviews;

  const handleSelectDate = (date: string) => {
    setSelectedDateString(date);
    setSelectedSchedule(null);
  };

  const handleSelectSchedule = (schedule: DoctorSchedule) => {
    setSelectedSchedule(schedule);
  };

  // Hàm này sẽ được sử dụng cho cả 2 nút
  const handleBookingSubmit = () => {
    if (selectedSchedule) {
      // Chuyển hướng đến trang đặt lịch với các tham số cần thiết
      router.push(`/client/appointments?doctorId=${doctor.doctor_id}&scheduleId=${selectedSchedule.schedule_id}`);
    } else {
      // Thông báo cho người dùng nếu họ chưa chọn lịch
      alert("Vui lòng chọn một khung giờ khám bệnh.");
    }
  };
  
  // Không cần hàm handleOnSubmit trống nữa, ta sẽ xóa nó đi.
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-40">
        {/* ... Header ... */}
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            <DoctorProfileCard 
              doctor={doctor} 
              reviews={reviews}
              onBookAppointmentClick={handleBookingSubmit}
            />
            <DoctorInfoTabs 
              doctor={doctor} 
              reviews={reviews} 
            />
          </div>
          
          <div className="lg:col-span-1">
            <BookingPanel 
              schedules={schedules}
              selectedDate={selectedDateString}
              selectedSchedule={selectedSchedule}
              onSelectDate={handleSelectDate}
              onSelectSchedule={handleSelectSchedule}
              onSubmit={handleBookingSubmit} 
            />
          </div>

        </div>
      </main>
    </div>
  );
}