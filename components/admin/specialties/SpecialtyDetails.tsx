import React from 'react'
import { Microscope, Hash, FileText, Calendar, X, Image } from 'lucide-react'
import { Specialization } from './SpecializationTypes'

interface SpecialtyDetailsProps {
    specialty: Specialization
    onClose: () => void
}

export default function SpecialtyDetails({ specialty, onClose }: SpecialtyDetailsProps) {
    return (
        <div className="bg-white rounded-xl shadow-2xl p-6 max-w-2xl mx-auto w-full max-h-screen overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                        <Microscope className="w-6 h-6 text-indigo-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Chi tiết chuyên khoa</h2>
                </div>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition"
                    title="Đóng"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Thông tin cơ bản */}
            <div className="space-y-4 mb-6">
                {/* Mã Chuyên khoa */}
                <div className="flex items-start p-3 bg-gray-50 rounded-lg">
                    <Hash className="w-5 h-5 text-indigo-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Mã chuyên khoa</p>
                        <p className="text-sm text-gray-800 font-mono">{specialty.id}</p>
                    </div>
                </div>

                {/* Tên Chuyên khoa */}
                <div className="flex items-start p-3 bg-indigo-50 rounded-lg border-l-4 border-indigo-600">
                    <Microscope className="w-5 h-5 text-indigo-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Tên chuyên khoa</p>
                        <p className="text-lg font-bold text-gray-900">{specialty.name}</p>
                    </div>
                </div>

                {/* Hình ảnh */}
                {specialty.image && (
                    <div className="flex items-start p-3 bg-gray-50 rounded-lg">
                        <Image className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Hình ảnh</p>
                            <img
                                src={specialty.image}
                                alt={specialty.name || "Ảnh chuyên khoa"}
                                className="w-40 h-40 object-cover rounded-lg shadow-md border border-gray-200"
                            />
                        </div>
                    </div>
                )}

                {/* Mô tả */}
                <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-start mb-2">
                        <FileText className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Mô tả</p>
                    </div>
                    <p className="text-base text-gray-700 ml-8 leading-relaxed">
                        {specialty.description || <span className="text-gray-400 italic">Không có mô tả</span>}
                    </p>
                </div>
            </div>

            {/* Thời gian tạo & cập nhật */}
            <div className="border-t pt-4 grid grid-cols-2 gap-3">
                <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                    <div className="flex items-center mb-1">
                        <Calendar className="w-4 h-4 text-indigo-600 mr-2" />
                        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Ngày tạo</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 ml-6">
                        {specialty.createdAt ? new Date(specialty.createdAt).toLocaleDateString('vi-VN') : '-'}
                    </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center mb-1">
                        <Calendar className="w-4 h-4 text-gray-600 mr-2" />
                        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Cập nhật</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 ml-6">
                        {specialty.updatedAt ? new Date(specialty.updatedAt).toLocaleDateString('vi-VN') : '-'}
                    </p>
                </div>
            </div>
        </div>
    )
}