'use client'

import React from 'react';
import { Star, Award, MapPin, Briefcase, Mail } from 'lucide-react';
import type { Doctor, Review } from '@/types/types';

interface DoctorProfileCardProps {
  doctor: Doctor;
  reviews: Review[];
}

export default function DoctorProfileCard({ doctor, reviews }: DoctorProfileCardProps) {
  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  return (
    <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-sm p-6 border border-blue-100">
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Avatar Section */}
        <div className="relative flex-shrink-0">
          <div className="absolute inset-0 bg-gradient-to-br rounded-2xl blur-md opacity-20"></div>
          <img
            src={doctor.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
            alt={doctor.full_name}
            className="relative w-32 h-32 rounded-2xl object-cover ring-4 ring-white shadow-lg"
          />
        </div>

        {/* Info Section */}
        <div className="flex-1 space-y-4">
          {/* Header */}
          <div>
            {doctor.title && (
              <span className="inline-block px-2 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded mb-2">
                {doctor.title}
              </span>
            )}
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {doctor.full_name}
            </h1>
            <div className="inline-flex items-center px-3 py-1.5 bg-blue-100 rounded-full">
              <span className="text-sm font-bold text-blue-700">
                {doctor.specialty_name}
              </span>
            </div>
          </div>

          {/* Info Items */}
          <div className="space-y-3">
            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Đánh giá</p>
                <p className="text-base font-bold text-gray-900">
                  {averageRating.toFixed(1)}
                  <span className="text-sm text-gray-500 font-normal ml-1">
                    ({reviews.length} đánh giá)
                  </span>
                </p>
              </div>
            </div>

            {/* Experience */}
            {doctor.experience_years && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Award className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Kinh nghiệm</p>
                  <p className="text-base font-bold text-gray-900">
                    {doctor.experience_years} năm
                  </p>
                </div>
              </div>
            )}

            {/* Workplace */}
            {doctor.workplace && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500">Nơi làm việc</p>
                  <p className="text-base font-semibold text-gray-900">
                    {doctor.workplace}
                  </p>
                </div>
              </div>
            )}

            {/* Clinic Address */}
            {doctor.clinic_address && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500">Địa chỉ phòng khám</p>
                  <p className="text-base font-semibold text-gray-900">
                    {doctor.clinic_address}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Contact Info */}
          {doctor.User?.email && (
            <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
              <Mail className="w-4 h-4 text-gray-400" />
              <a 
                href={`mailto:${doctor.User.email}`}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                {doctor.User.email}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}