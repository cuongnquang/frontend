// components/admin/doctors/form/DoctorForm.tsx
'use client'
import { useState, useEffect } from 'react'
import { X, Upload, User } from 'lucide-react'
import { DoctorFormHeader } from './DoctorFormHeader'
import { DoctorBasicInfo } from './DoctorBasicInfo'
import { DoctorProfessionalInfo } from './DoctorProfessionalInfo'
import { DoctorFormActions } from './DoctorFormActions'
import { useSpecialty } from '@/contexts/SpecialtyContext'

interface DoctorFormProps {
    doctor?: any
    onClose: () => void
    onSubmit: (data: any) => void
    mode: 'create' | 'view'
}

// Hàm chuyển File → Base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export function DoctorForm({ doctor, onClose, onSubmit, mode }: DoctorFormProps) {
    const { specialties, loading: specialtiesLoading } = useSpecialty()
    const [formData, setFormData] = useState({
        email: '',
        specialty_name: '',
        full_name: '',
        title: '',
        introduction: '',
        avatar_url: '',
        specializations: '',
        work_experience: '',
        achievements: '',
        experience_years: 0,
        is_available: false // Mặc định là false
    })
    const [avatarPreview, setAvatarPreview] = useState<string>('')
    const [uploading, setUploading] = useState(false)

    useEffect(() => {
        if (doctor) {
            setFormData({
                email: doctor.email || '',
                specialty_name: doctor.specialty_name || '',
                full_name: doctor.full_name || '',
                title: doctor.title || '',
                introduction: doctor.introduction || '',
                avatar_url: doctor.avatar_url || '',
                specializations: doctor.specializations || '',
                work_experience: doctor.work_experience || '',
                achievements: doctor.achievements || '',
                experience_years: doctor.experience_years || 0,
                is_available: doctor.is_available !== undefined ? doctor.is_available : false
            })
            
            if (doctor.avatar_url) {
                setAvatarPreview(doctor.avatar_url)
            }
        }
    }, [doctor])

    const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        // Kiểm tra loại file
        if (!file.type.startsWith('image/')) {
            alert('Vui lòng chọn file ảnh')
            return
        }

        // Kiểm tra kích thước file (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Kích thước ảnh không được vượt quá 5MB')
            return
        }

        setUploading(true)
        try {
            const base64 = await fileToBase64(file)
            setAvatarPreview(base64)
            setFormData(prev => ({ ...prev, avatar_url: base64 }))
        } catch (error) {
            console.error('Lỗi upload ảnh:', error)
            alert('Có lỗi xảy ra khi upload ảnh')
        } finally {
            setUploading(false)
        }
    }

    const removeAvatar = () => {
        setAvatarPreview('')
        setFormData(prev => ({ ...prev, avatar_url: '' }))
    }

    const isReadOnly = mode === 'view'

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(formData)
    }

    return (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <DoctorFormHeader mode={mode} onClose={onClose} />

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Avatar Upload Section */}
                    <div className="flex flex-col items-center space-y-4">
                        <div className="relative">
                            {avatarPreview ? (
                                <div className="relative">
                                    <img
                                        src={avatarPreview}
                                        alt="Avatar preview"
                                        className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                                    />
                                    {!isReadOnly && (
                                        <button
                                            type="button"
                                            onClick={removeAvatar}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-gray-300">
                                    <User className="w-12 h-12 text-gray-400" />
                                </div>
                            )}
                        </div>
                        
                        {!isReadOnly && (
                            <div className="text-center">
                                <input
                                    type="file"
                                    id="avatar-upload"
                                    accept="image/*"
                                    onChange={handleAvatarUpload}
                                    className="hidden"
                                    disabled={uploading}
                                />
                                <label
                                    htmlFor="avatar-upload"
                                    className={`inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition ${
                                        uploading ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                >
                                    {uploading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                                            <span>Đang upload...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-4 h-4" />
                                            <span>Chọn ảnh đại diện</span>
                                        </>
                                    )}
                                </label>
                                <p className="text-xs text-gray-500 mt-2">
                                    PNG, JPG, JPEG (tối đa 5MB)
                                </p>
                            </div>
                        )}
                    </div>

                    <DoctorBasicInfo
                        formData={formData}
                        setFormData={setFormData}
                        isReadOnly={isReadOnly}
                        specialties={specialties}
                        specialtiesLoading={specialtiesLoading}
                    />

                    <DoctorProfessionalInfo
                        formData={formData}
                        setFormData={setFormData}
                        isReadOnly={isReadOnly}
                    />

                    <DoctorFormActions
                        mode={mode}
                        onClose={onClose}
                        isReadOnly={isReadOnly}
                    />
                </form>
            </div>
        </div>
    )
}