import React from 'react'
import { Search } from 'lucide-react'
import HospitalCard from './HospitalCard'
import { Hospital } from '@/components/client/hospitals/HospitalType'

interface HospitalsResultsProps {
    filteredHospitals: Hospital[]
    resetFilters: () => void
}

export default function HospitalsResults({
    filteredHospitals,
    resetFilters,
}: HospitalsResultsProps) {
    return (
        <section className="py-8">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-6">
                    <p className="text-gray-600">
                        Tìm thấy <span className="font-semibold">{filteredHospitals.length}</span> bệnh viện
                    </p>
                    {/* Sắp xếp - Có thể tách thành component nhỏ hơn */}
                    <select className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>Sắp xếp theo</option>
                        <option>Đánh giá cao nhất</option>
                        <option>Khoảng cách gần nhất</option>
                        <option>Tên A-Z</option>
                    </select>
                </div>

                <div className="space-y-6">
                    {filteredHospitals.map(hospital => (
                        <HospitalCard key={hospital.id} hospital={hospital} />
                    ))}
                </div>

                {/* No Results State */}
                {filteredHospitals.length === 0 && (
                    <div className="text-center py-12">
                        <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <Search className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Không tìm thấy bệnh viện
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Thử thay đổi tiêu chí tìm kiếm hoặc bộ lọc
                        </p>
                        <button
                            onClick={resetFilters}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Xóa bộ lọc
                        </button>
                    </div>
                )}
            </div>
        </section>
    )
}