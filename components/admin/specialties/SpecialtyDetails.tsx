import React from 'react'
import { Specialization } from './SpecializationTypes'
import { X, Microscope, User, FileText, Users, Star, Hash } from 'lucide-react'

interface SpecialtyDetailsProps {
    specialty: Specialization
    onClose: () => void
}

export default function SpecialtyDetails({ specialty, onClose }: SpecialtyDetailsProps) {
    return (
        <div className="bg-white rounded-xl shadow-2xl p-6 max-w-lg mx-auto w-full">
            {/* Header */}
            <div className="flex justify-between items-center border-b pb-3 mb-4">
                <div className="flex items-center space-x-3">
                    <Microscope className="w-6 h-6 text-indigo-600" />
                    <h2 className="text-xl font-bold text-gray-900">Chi tiết Chuyên khoa</h2>
                </div>
                <button 
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition"
                    title="Đóng"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Nội dung chi tiết */}
            <div className="space-y-4">
                {/* Tên */}
                <div className="flex items-center border-b pb-2">
                    <Microscope className="w-5 h-5 text-indigo-500 mr-3" />
                    <div className="flex-1">
                        <p className="text-sm font-medium text-gray-500">Tên Chuyên khoa</p>
                        <p className="text-lg font-semibold text-gray-900">{specialty.name}</p>
                    </div>
                    <div className="w-5 h-5 rounded-full" style={{ backgroundColor: specialty.colorCode }}></div>
                </div>

                {/* ID */}
                <div className="flex items-center">
                    <Hash className="w-5 h-5 text-gray-500 mr-3" />
                    <div>
                        <p className="text-sm font-medium text-gray-500">Mã Chuyên khoa</p>
                        <p className="text-base text-gray-800">{specialty.id}</p>
                    </div>
                </div>

                {/* Trưởng khoa */}
                <div className="flex items-center">
                    <User className="w-5 h-5 text-green-500 mr-3" />
                    <div>
                        <p className="text-sm font-medium text-gray-500">Trưởng khoa</p>
                        <p className="text-base text-gray-800">{specialty.leadDoctor}</p>
                    </div>
                </div>
                
                {/* Mô tả */}
                <div>
                    <div className="flex items-center mb-1">
                        <FileText className="w-5 h-5 text-blue-500 mr-3" />
                        <p className="text-sm font-medium text-gray-500">Mô tả chi tiết</p>
                    </div>
                    <p className="text-base text-gray-700 ml-8 bg-gray-50 p-3 rounded-lg border">{specialty.description || "Không có mô tả chi tiết."}</p>
                </div>

                {/* Thống kê */}
                <div className="pt-2 border-t mt-4 grid grid-cols-2 gap-4">
                    <div className="flex items-center p-3 bg-indigo-50 rounded-lg">
                        <Users className="w-5 h-5 text-indigo-600 mr-3" />
                        <div>
                            <p className="text-sm font-medium text-gray-600">Tổng số BS</p>
                            <p className="text-lg font-bold text-indigo-900">{specialty.totalDoctors}</p>
                        </div>
                    </div>
                    <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
                        <Star className="w-5 h-5 text-yellow-600 mr-3" fill="#d97706" />
                        <div>
                            <p className="text-sm font-medium text-gray-600">Đánh giá TB</p>
                            <p className="text-lg font-bold text-yellow-900">{specialty.avgRating.toFixed(1)} / 5.0</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}