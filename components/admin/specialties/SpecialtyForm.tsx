import React, { useState, useEffect } from 'react'
import { Microscope, User, FileText, Palette, X, Save, Edit } from 'lucide-react'
import { Specialization } from './SpecializationTypes'

// Kiểu dữ liệu cho form (chỉ bao gồm các trường cần nhập)
type SpecializationFormData = Omit<Specialization, 'id' | 'totalDoctors' | 'avgRating'> 

interface SpecialtyFormProps {
    initialData: Specialization | null 
    isEditMode: boolean
    onSave: (specialty: SpecializationFormData) => void 
    onCancel: () => void 
}

const initialFormData: SpecializationFormData = {
    name: '',
    leadDoctor: '',
    description: '',
    colorCode: '#3b82f6', 
}

export default function SpecialtyForm({ initialData, isEditMode, onSave, onCancel }: SpecialtyFormProps) {
    const [formData, setFormData] = useState<SpecializationFormData>(initialFormData)

    // Cập nhật state khi component mount hoặc initialData thay đổi (khi mở modal Sửa)
    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                leadDoctor: initialData.leadDoctor,
                description: initialData.description,
                colorCode: initialData.colorCode,
            })
        } else {
            setFormData(initialFormData) // Reset form khi ở chế độ thêm mới
        }
    }, [initialData])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.name || !formData.leadDoctor) {
            alert('Vui lòng điền đầy đủ Tên chuyên khoa và Trưởng khoa.')
            return
        }
        onSave(formData)
    }

    const title = isEditMode ? 'Sửa Chuyên khoa' : 'Thêm Chuyên khoa Mới'
    const icon = isEditMode ? Edit : Microscope
    const buttonText = isEditMode ? 'Lưu Thay đổi' : 'Lưu Chuyên khoa'

    return (
        <div className="bg-white rounded-xl shadow-2xl p-6 max-w-lg mx-auto w-full">
            <div className="flex items-center space-x-3 mb-6">
                {React.createElement(icon, { className: "w-8 h-8 text-indigo-600" })}
                <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* ... (Các trường nhập liệu Tên, Trưởng khoa, Mô tả, Mã màu giữ nguyên) ... */}
                
                 {/* Tên chuyên khoa */}
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 flex items-center mb-1">
                        <Microscope className="w-4 h-4 mr-2 text-gray-500" />
                        Tên Chuyên khoa <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-black"
                        placeholder="Ví dụ: Nội Tim mạch"
                        required
                    />
                </div>

                {/* Trưởng khoa */}
                <div>
                    <label htmlFor="leadDoctor" className="block text-sm font-medium text-gray-700 flex items-center mb-1">
                        <User className="w-4 h-4 mr-2 text-gray-500" />
                        Trưởng khoa <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                        type="text"
                        id="leadDoctor"
                        name="leadDoctor"
                        value={formData.leadDoctor}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-black"
                        placeholder="Ví dụ: TS.BS. Nguyễn Văn A"
                        required
                    />
                </div>

                {/* Mô tả */}
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 flex items-center mb-1">
                        <FileText className="w-4 h-4 mr-2 text-gray-500" />
                        Mô tả Ngắn
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        rows={3}
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-black"
                        placeholder="Mô tả các dịch vụ, phạm vi của chuyên khoa..."
                    />
                </div>
                
                {/* Mã màu hiển thị */}
                <div className="flex items-center space-x-4">
                    <label htmlFor="colorCode" className="text-sm font-medium text-gray-700 flex items-center">
                        <Palette className="w-4 h-4 mr-2 text-gray-500" />
                        Màu hiển thị (Bảng)
                    </label>
                    <input
                        type="color"
                        id="colorCode"
                        name="colorCode"
                        value={formData.colorCode}
                        onChange={handleChange}
                        className="h-8 w-12 rounded-lg border-none cursor-pointer"
                        title="Chọn màu"
                    />
                    <span className="text-sm text-gray-500">{formData.colorCode}</span>
                </div>

                {/* Nút thao tác */}
                <div className="flex justify-end space-x-3 pt-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center transition"
                    >
                        <X className="w-4 h-4 mr-2" />
                        Hủy
                    </button>
                    <button
                        type="submit"
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center transition"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        {buttonText}
                    </button>
                </div>
            </form>
        </div>
    )
}