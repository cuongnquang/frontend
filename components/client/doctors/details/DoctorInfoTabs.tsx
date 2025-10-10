'use client'

import React, { useState } from 'react';
import { BookOpen, Briefcase, GraduationCap, Award, CheckCircle } from 'lucide-react';
import type { Doctor, Review } from '@/types/types';

interface DoctorInfoTabsProps {
  doctor: Doctor;
  reviews: Review[];
}

export default function DoctorInfoTabs({ doctor, reviews }: DoctorInfoTabsProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                Giới thiệu
              </h3>
              <p className="text-gray-600 leading-relaxed">{doctor.introduction}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-blue-600" />
                Chuyên môn
              </h3>
              <div className="flex flex-wrap gap-2">
                {doctor.specializations?.split(',').map((spec, index) => (
                  <span key={index} className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
                    {spec.trim()}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-600" />
                Nơi làm việc
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-900 font-medium">{doctor.work_experience}</p>
              </div>
            </div>
          </div>
        );
      case 'experience':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-600" />
                Thành tựu & Giải thưởng
              </h3>
              <div className="space-y-3">
                {doctor.achievements?.split('\n').map((achievement, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700">{achievement.replace('-', '').trim()}</p>
                  </div>
                ))}
              </div>
            </div>
            {/* ... Nội dung học vấn ... */}
          </div>
        );
      case 'reviews':
        return (
          <div className="space-y-6">
            {/* ... Nội dung thống kê đánh giá ... */}
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                  {/* ... Nội dung chi tiết một đánh giá ... */}
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  
  const TabButton = ({ tabName, label }: { tabName: string; label: string }) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={`px-6 py-4 font-medium transition border-b-2 ${
        activeTab === tabName
          ? 'border-blue-600 text-blue-600'
          : 'border-transparent text-gray-600 hover:text-gray-900'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="border-b border-gray-200">
        <div className="flex">
          <TabButton tabName="overview" label="Tổng quan" />
          <TabButton tabName="experience" label="Kinh nghiệm" />
          <TabButton tabName="reviews" label="Đánh giá" />
        </div>
      </div>
      <div className="p-6">
        {renderTabContent()}
      </div>
    </div>
  );
}