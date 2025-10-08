'use client';

import React from 'react';
import Image from 'next/image';
import { Doctor } from '@/types/types';
import { Star, MapPin } from 'lucide-react';

/**
 * Props for the SelectedInfoCard component.
 * @property selectedDoctor - The selected doctor object, if any.
 * @property selectedHospital - The selected hospital object, if any.
 */
interface SelectedInfoCardProps {
  selectedDoctor?: Doctor | null;
}

/**
 * A card component to display information about the selected doctor or hospital.
 *
 * @param {SelectedInfoCardProps} props - The props for the component.
 * @returns {React.ReactElement | null} The rendered card or null if no selection is provided.
 */
export default function SelectedInfoCard({ selectedDoctor }: SelectedInfoCardProps): React.ReactElement | null {
  const item = selectedDoctor
  const isDoctor = !!selectedDoctor;

  if (!item) {
    return (
        <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 text-center">
            <p className="text-gray-600">Vui lòng chọn một bác sĩ hoặc bệnh viện để bắt đầu đặt lịch.</p>
        </div>
    );
  }

  return (
    <div className="bg-white p-5 rounded-lg shadow-md border border-gray-200 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-3">Thông tin đã chọn</h2>
      <div className="flex items-start space-x-4">
        <Image
          src={item.avatar_url || '/api/placeholder/100/100'}
          alt={item.full_name}
          width={100}
          height={100}
          className="rounded-lg object-cover border"
        />
        <div className="flex-1">
          <h3 className="text-lg font-bold text-blue-700">{item.full_name}</h3>
          {isDoctor && 'specialty' in item && (
            <p className="text-md text-gray-700">{item.Specialty.name}</p>
          )}
          <div className="flex items-center text-yellow-500 mt-2">
            <Star className="w-4 h-4 mr-1" />
            <span className="font-semibold">{item.experience_years}</span>
          </div>
          <div className="text-sm text-gray-500 mt-1 flex items-center">
            <MapPin className="w-4 h-4 mr-1.5" />
            <span>{item.introduction}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
