import React from 'react';
import { Search, Filter, ChevronDown } from 'lucide-react';
import { Specialty } from '@/types/types';

interface DoctorSearchBarProps {
  specialties: Specialty[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedSpecialtyId: string;
  setSelectedSpecialtyId: (id: string) => void;
}

export default function DoctorSearchBar({
  specialties,
  searchQuery,
  setSearchQuery,
  selectedSpecialtyId,
  setSelectedSpecialtyId,
}: DoctorSearchBarProps) {
  return (
    <div className="bg-white shadow-sm border-b top-16 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-4">
          
          {/* Search Box */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Tìm kiếm bác sĩ, chuyên khoa..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Specialty Dropdown */}
          <div className="relative min-w-[200px] text-gray-700">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <select 
              value={selectedSpecialtyId}
              onChange={(e) => setSelectedSpecialtyId(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white appearance-none cursor-pointer"
            >
              <option value="all">Tất cả chuyên khoa</option>
              {specialties.map((specialty) => (
                <option key={specialty.specialty_id} value={specialty.specialty_id}>
                  {specialty.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
          
          {/* Sort Dropdown */}
          <div className="relative min-w-[180px] text-gray-700">
            <select className="w-full pl-4 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white appearance-none cursor-pointer">
              <option>Đề xuất</option>
              <option>Đánh giá cao nhất</option>
              <option>Kinh nghiệm nhiều nhất</option>
              <option>Giá thấp đến cao</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
}