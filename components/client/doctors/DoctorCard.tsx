import React from 'react';
import { Doctor } from '@/types/types';
import { MapPin, Award, Clock, Calendar } from 'lucide-react';

interface DoctorCardProps {
  doctor: Doctor;
  onSelect:()=>void;
  onBook: () => void;
}

export default function DoctorCard({ doctor, onBook, onSelect }: DoctorCardProps) {
  return ( 
    <div
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-5 border border-gray-100"
    >
      <div className="flex gap-5">
        <div  onClick={onSelect} className='flex flex-col items-center flex-shrink-0 cursor-pointer'>
          <img
            src={doctor.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
            alt={doctor.full_name}
            className="w-20 h-20 rounded-full object-cover ring-2 ring-blue-500 bg-gray-100 mb-2"
          />
          {doctor.is_available && (
            <span className="text-xs font-semibold text-green-700">
              🟢 Online
            </span>
          )}
        </div>

        <div className="flex-1">
          <div  onClick={onSelect} className="flex items-center justify-between cursor-pointer">
            <h3 className="text-xl font-bold text-gray-900 leading-snug">
              {doctor.title ? `${doctor.title} ` : ''}{doctor.full_name}
            </h3>
            <span className="text-base font-semibold text-blue-600 px-3 py-0.5 bg-blue-50 rounded-lg flex-shrink-0">
              {doctor.Specialty.name}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600 mt-1 mb-2">
            {doctor.experience_years && (
              <div className="flex items-center">
                <Award className="w-4 h-4 mr-1 text-indigo-500" />
                {doctor.experience_years} năm kinh nghiệm
              </div>
            )}
            {doctor.work_experience && (
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1 text-red-400" />
                {doctor.work_experience}
              </div>
            )}
          </div>
          {doctor.introduction && (
            <p className="text-gray-700 text-sm mb-3 line-clamp-2 italic">
              {doctor.introduction} 
            </p>
          )}
          
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className='flex items-center text-sm text-gray-500'>
              {doctor.specializations && (
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  Chuyên về: <span className='font-medium ml-1 line-clamp-1'>{doctor.specializations.split(',')[0]}...</span>
                </div>
              )}
            </div>
            
            <button 
              onClick={onBook}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-1 font-semibold text-sm shadow-md"
            >
              <Calendar className="w-4 h-4" />
              Đặt lịch
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}