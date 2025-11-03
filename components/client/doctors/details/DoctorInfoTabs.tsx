'use client'

import React, { useState } from 'react';
import { BookOpen, Briefcase, GraduationCap, Award, CheckCircle, Star, User } from 'lucide-react';
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
            {/* Introduction */}
            {doctor.introduction && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Giới thiệu</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">{doctor.introduction}</p>
              </div>
            )}

            {/* Specializations */}
            {doctor.specializations && (
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Chuyên môn</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {doctor.specializations.split(',').map((spec, index) => (
                    <span 
                      key={index} 
                      className="px-4 py-2 bg-gradient-to-r from-purple-50 to-blue-50 text-purple-700 rounded-lg text-sm font-semibold border border-purple-200"
                    >
                      {spec.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Position*/}
            <div className="grid md:grid-cols-2 gap-4">
              {doctor.position && (
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Award className="w-5 h-5 text-blue-600" />
                    <h4 className="font-bold text-gray-900">Chức vụ</h4>
                  </div>
                  <p className="text-gray-700 font-medium">{doctor.position}</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'achievements':
        return (
          <div className="space-y-6">
            {doctor.achievements ? (
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                    <Award className="w-5 h-5 text-amber-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Thành tựu & Giải thưởng
                  </h3>
                </div>
                <div className="space-y-3">
                  {doctor.achievements.split('\n').map((achievement, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-700 leading-relaxed">
                        {achievement.replace('-', '').trim()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Chưa có thông tin về thành tựu</p>
              </div>
            )}
          </div>
        );

      case 'reviews':
        return (
          <div className="space-y-6">
            {/* Rating Summary */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-5xl font-bold text-amber-600 mb-2">
                    {averageRating.toFixed(1)}
                  </div>
                  <div className="flex items-center gap-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-5 h-5 ${
                          i < Math.round(averageRating) 
                            ? 'text-amber-400 fill-amber-400' 
                            : 'text-gray-300'
                        }`} 
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">{reviews.length} đánh giá</p>
                </div>
                <div className="flex-1">
                  <p className="text-gray-700 font-medium mb-2">Phân bố đánh giá</p>
                  {[5, 4, 3, 2, 1].map(rating => {
                    const count = reviews.filter(r => r.rating === rating).length;
                    const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                    return (
                      <div key={rating} className="flex items-center gap-2 mb-1">
                        <span className="text-sm text-gray-600 w-8">{rating}★</span>
                        <div className="flex-1 h-2 bg-white rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-amber-400 rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500 w-8">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review.id} className="bg-white border border-gray-200 rounded-xl p-5">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-gray-900">Bệnh nhân</h4>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-4 h-4 ${
                                  i < review.rating 
                                    ? 'text-amber-400 fill-amber-400' 
                                    : 'text-gray-300'
                                }`} 
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                        <p className="text-xs text-gray-400 mt-2">
                          {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Chưa có đánh giá nào</p>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const TabButton = ({ tabName, label, icon: Icon }: { tabName: string; label: string; icon: any }) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={`flex items-center gap-2 px-6 py-4 font-semibold transition-all border-b-2 ${
        activeTab === tabName
          ? 'border-blue-600 text-blue-600 bg-blue-50'
          : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="flex overflow-x-auto">
          <TabButton tabName="overview" label="Tổng quan" icon={BookOpen} />
          <TabButton tabName="achievements" label="Thành tựu" icon={Award} />
          <TabButton tabName="reviews" label="Đánh giá" icon={Star} />
        </div>
      </div>
      <div className="p-6">
        {renderTabContent()}
      </div>
    </div>
  );
}