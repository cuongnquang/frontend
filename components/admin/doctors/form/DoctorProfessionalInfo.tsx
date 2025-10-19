// components/admin/doctors/form/DoctorProfessionalInfo.tsx
interface DoctorProfessionalInfoProps {
    formData: any
    setFormData: React.Dispatch<React.SetStateAction<any>>
    isReadOnly: boolean
}

export function DoctorProfessionalInfo({ formData, setFormData, isReadOnly }: DoctorProfessionalInfoProps) {
    const handleChange = (field: string, value: string | number | boolean) => {
        setFormData((prev: any) => ({ ...prev, [field]: value }))
    }

    return (
        <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin chuyên môn</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Chuyên môn */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Chuyên môn chi tiết
                    </label>
                    <input
                        type="text"
                        disabled={isReadOnly}
                        value={formData.specialty_name}
                        onChange={(e) => handleChange('specialty_name', e.target.value)}
                        className="w-full p-3 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg text-black disabled:bg-gray-100"
                        placeholder="VD: Phẫu thuật tim, Khám bệnh..."
                    />
                </div>
                
                {/* Số năm kinh nghiệm */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số năm kinh nghiệm
                    </label>
                    <input
                        type="number"
                        disabled={isReadOnly}
                        value={formData.experience_years}
                        onChange={(e) => handleChange('experience_years', parseInt(e.target.value) || 0)}
                        className="w-full p-3 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg text-black disabled:bg-gray-100"
                        min="0"
                        max="50"
                    />
                </div>
            </div>
            
            {/* Giới thiệu */}
            <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giới thiệu
                </label>
                <textarea
                    rows={4}
                    disabled={isReadOnly}
                    value={formData.introduction}
                    onChange={(e) => handleChange('introduction', e.target.value)}
                    className="w-full p-3 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg text-black disabled:bg-gray-100"
                    placeholder="Giới thiệu về bác sĩ, quá trình đào tạo..."
                />
            </div>
            
            {/* Kinh nghiệm làm việc */}
            <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kinh nghiệm làm việc
                </label>
                <textarea
                    rows={3}
                    disabled={isReadOnly}
                    value={formData.work_experience}
                    onChange={(e) => handleChange('work_experience', e.target.value)}
                    className="w-full p-3 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg text-black disabled:bg-gray-100"
                    placeholder="Quá trình công tác và kinh nghiệm làm việc..."
                />
            </div>
            
            {/* Thành tích */}
            <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thành tích
                </label>
                <textarea
                    rows={3}
                    disabled={isReadOnly}
                    value={formData.achievements}
                    onChange={(e) => handleChange('achievements', e.target.value)}
                    className="w-full p-3 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg text-black disabled:bg-gray-100"
                    placeholder="Các thành tích, giải thưởng, nghiên cứu..."
                />
            </div>

            {/* Trạng thái (chỉ hiển thị khi view) */}
            {isReadOnly && (
                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Trạng thái làm việc
                    </label>
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        formData.is_available 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                    }`}>
                        {formData.is_available ? 'Đang làm việc' : 'Chưa kích hoạt'}
                    </div>
                </div>
            )}
        </div>
    )
}