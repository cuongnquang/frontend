'use client'

import React from 'react';
import { Star, Award, MapPin, Users, Calendar, Video } from 'lucide-react';
import type { Doctor, Review } from '@/types/types'; // Giả sử bạn có file types.ts

interface DoctorProfileCardProps {
  doctor: Doctor;
  reviews: Review[];
  onBookAppointmentClick: () => void;
}

export default function DoctorProfileCard({ doctor, reviews, onBookAppointmentClick }: DoctorProfileCardProps) {
  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex flex-col sm:flex-row gap-6">
        <img
          src={doctor.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
          alt={doctor.full_name}
          className="w-32 h-32 rounded-xl bg-gray-100 mx-auto sm:mx-0"
        />
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {doctor.title} {doctor.full_name}
              </h1>
              <p className="text-lg text-blue-600 font-medium mb-3">{doctor.Specialty.name}</p>
            </div>
            {doctor.is_available && (
              <span className="px-4 py-2 bg-green-100 text-green-700 text-sm font-medium rounded-full flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Đang hoạt động
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center text-gray-600">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400 mr-2" />
              <span className="font-semibold text-gray-900">{averageRating.toFixed(1)}</span>
              <span className="ml-1">({reviews.length} đánh giá)</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Award className="w-5 h-5 mr-2" />
              {doctor.experience_years} năm kinh nghiệm
            </div>
            <div className="flex items-center text-gray-600">
              <MapPin className="w-5 h-5 mr-2" />
              {doctor.work_experience}
            </div>
            <div className="flex items-center text-gray-600">
              <Users className="w-5 h-5 mr-2" />
              5000+ bệnh nhân
            </div>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={onBookAppointmentClick}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 font-medium"
            >
              <Calendar className="w-5 h-5" />
              Đặt lịch khám
            </button>
            <button className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition flex items-center gap-2 font-medium">
              <Video className="w-5 h-5" />
              Khám online
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}