import React, { memo } from 'react';
import { Search, Filter, ChevronDown } from 'lucide-react';
import { Specialty } from '@/types/types';

interface DoctorSearchBarProps {
  specialties: Specialty[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedSpecialtyName: string;
  setselectedSpecialtyName: (id: string) => void;
  sortBy?: string;
  setSortBy?: (s: string) => void;
}

const DoctorSearchBar = memo(function DoctorSearchBar({
  specialties,
  searchQuery,
  setSearchQuery,
  selectedSpecialtyName,
  setselectedSpecialtyName,
  sortBy = 'relevance',
  setSortBy,
}: DoctorSearchBarProps) {
  return (
    <div className="bg-white shadow-sm border-b top-16 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">

          {/* Search Box */}
          <div className="flex-1 relative">
            <Search 
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" 
              aria-hidden="true"
            />
            <input
              type="text"
              placeholder="Tìm kiếm bác sĩ, chuyên khoa..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                text-gray-900 transition-shadow"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Tìm kiếm bác sĩ"
            />
          </div>

          {/* Specialty Dropdown */}
          <div className="relative min-w-full sm:min-w-[200px]">
            <Filter 
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" 
              aria-hidden="true"
            />
            <select
              value={selectedSpecialtyName}
              onChange={(e) => setselectedSpecialtyName(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                bg-white appearance-none cursor-pointer text-gray-700 transition-shadow"
              aria-label="Chọn chuyên khoa"
            >
              <option value="all">Tất cả chuyên khoa</option>
              {specialties.map((specialty) => (
                <option 
                  key={specialty.specialty_id} 
                  value={specialty.name}
                >
                  {specialty.name}
                </option>
              ))}
            </select>
            <ChevronDown 
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" 
              aria-hidden="true"
            />
          </div>

          {/* Sort Dropdown */}
          {setSortBy && (
            <div className="relative min-w-full sm:min-w-[180px]">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full pl-4 pr-10 py-2.5 border border-gray-300 rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  bg-white appearance-none cursor-pointer text-gray-700 transition-shadow"
                aria-label="Sắp xếp"
              >
                <option value="relevance">Đề xuất</option>
                <option value="name_asc">Tên A → Z</option>
                <option value="experience_desc">Kinh nghiệm nhiều nhất</option>
              </select>
              <ChevronDown 
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" 
                aria-hidden="true"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default DoctorSearchBar;