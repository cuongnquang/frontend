// components/admin/doctors/form/DoctorBasicInfo.tsx
interface DoctorBasicInfoProps {
    formData: any
    setFormData: React.Dispatch<React.SetStateAction<any>>
    isReadOnly: boolean
    specialties: any[]
    specialtiesLoading: boolean
}

export function DoctorBasicInfo({ 
    formData, 
    setFormData, 
    isReadOnly, 
    specialties, 
    specialtiesLoading 
}: DoctorBasicInfoProps) {
    const handleChange = (field: string, value: string | number | boolean) => {
        setFormData((prev: any) => ({ ...prev, [field]: value }))
    }

    return (
        <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin cơ bản</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Họ và tên */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Họ và tên *
                    </label>
                    <input
                        type="text"
                        required
                        disabled={isReadOnly}
                        value={formData.full_name}
                        onChange={(e) => handleChange('full_name', e.target.value)}
                        className="w-full p-3 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg text-black disabled:bg-gray-100"
                        placeholder="Nhập họ và tên đầy đủ"
                    />
                </div>
                
                {/* Email */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                    </label>
                    <input
                        type="email"
                        required
                        disabled={isReadOnly}
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        className="w-full p-3 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg text-black disabled:bg-gray-100"
                        placeholder="example@youmed.vn"
                    />
                </div>
                
                {/* Chuyên khoa */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Chuyên khoa *
                    </label>
                    <select
                        required
                        disabled={isReadOnly || specialtiesLoading}
                        value={formData.specialty_name}
                        onChange={(e) => handleChange('specialty_name', e.target.value)}
                        className="w-full p-3 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg text-black disabled:bg-gray-100"
                    >
                        <option value="">Chọn chuyên khoa</option>
                        {specialtiesLoading ? (
                            <option value="" disabled>Đang tải chuyên khoa...</option>
                        ) : (
                            specialties.map((specialty) => (
                                <option key={specialty.id} value={specialty.name}>
                                    {specialty.name}
                                </option>
                            ))
                        )}
                    </select>
                </div>
                
                {/* Chức danh */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Chức danh
                    </label>
                    <input
                        type="text"
                        disabled={isReadOnly}
                        value={formData.title}
                        onChange={(e) => handleChange('title', e.target.value)}
                        className="w-full p-3 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg text-black disabled:bg-gray-100"
                        placeholder="VD: Bác sĩ, Tiến sĩ, Thạc sĩ..."
                    />
                </div>
            </div>
        </div>
    )
}