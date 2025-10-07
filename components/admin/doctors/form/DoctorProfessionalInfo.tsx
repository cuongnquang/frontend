// Helper type cho formData và setFormData
type DoctorFormData = any;
type SetFormData = React.Dispatch<React.SetStateAction<DoctorFormData>>;

interface DoctorProfessionalInfoProps {
    formData: DoctorFormData
    setFormData: SetFormData
    isReadOnly: boolean
}

export function DoctorProfessionalInfo({ formData, setFormData, isReadOnly }: DoctorProfessionalInfoProps) {
    const handleChange = (field: string, value: string | number) => {
        setFormData((prev: DoctorFormData) => ({ ...prev, [field]: value }))
    }

    return (
        <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin chuyên môn</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Chuyên khoa */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Chuyên khoa *</label>
                    <select
                        required
                        disabled={isReadOnly}
                        value={formData.specialization}
                        onChange={(e) => handleChange('specialization', e.target.value)}
                        className="w-full p-3 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg text-black disabled:bg-gray-100"
                    >
                        <option value="">Chọn chuyên khoa</option>
                        <option value="Tim mạch">Tim mạch</option>
                        <option value="Nhi khoa">Nhi khoa</option>
                        <option value="Ngoại khoa">Ngoại khoa</option>
                        <option value="Da liễu">Da liễu</option>
                        <option value="Nội khoa">Nội khoa</option>
                        <option value="Sản phụ khoa">Sản phụ khoa</option>
                    </select>
                </div>
                {/* Số chứng chỉ hành nghề */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Số chứng chỉ hành nghề *</label>
                    <input
                        type="text"
                        required
                        disabled={isReadOnly}
                        value={formData.licenseNumber}
                        onChange={(e) => handleChange('licenseNumber', e.target.value)}
                        className="w-full p-3 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg text-black disabled:bg-gray-100"
                    />
                </div>
                {/* Trình độ */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Trình độ</label>
                    <select
                        disabled={isReadOnly}
                        value={formData.qualification}
                        onChange={(e) => handleChange('qualification', e.target.value)}
                        className="w-full p-3 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg text-black disabled:bg-gray-100"
                    >
                        <option value="">Chọn trình độ</option>
                        <option value="Bác sĩ">Bác sĩ</option>
                        <option value="Thạc sĩ">Thạc sĩ</option>
                        <option value="Tiến sĩ">Tiến sĩ</option>
                        <option value="Giáo sư">Giáo sư</option>
                    </select>
                </div>
                {/* Kinh nghiệm */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Kinh nghiệm (năm)</label>
                    <input
                        type="number"
                        disabled={isReadOnly}
                        value={formData.experience}
                        onChange={(e) => handleChange('experience', parseInt(e.target.value))}
                        className="w-full p-3 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg text-black disabled:bg-gray-100"
                    />
                </div>
                {/* Phí khám */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phí khám (VNĐ)</label>
                    <input
                        type="number"
                        disabled={isReadOnly}
                        value={formData.consultationFee}
                        onChange={(e) => handleChange('consultationFee', parseInt(e.target.value))}
                        className="w-full p-3 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg text-black disabled:bg-gray-100"
                    />
                </div>
            </div>
            {/* Giới thiệu */}
            <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Giới thiệu</label>
                <textarea
                    rows={4}
                    disabled={isReadOnly}
                    value={formData.bio}
                    onChange={(e) => handleChange('bio', e.target.value)}
                    className="w-full p-3 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg text-black disabled:bg-gray-100"
                />
            </div>
        </div>
    )
}