// Helper type cho formData và setFormData
type DoctorFormData = any; // Thay thế bằng type cụ thể nếu có
type SetFormData = React.Dispatch<React.SetStateAction<DoctorFormData>>;

interface DoctorBasicInfoProps {
    formData: DoctorFormData
    setFormData: SetFormData
    isReadOnly: boolean
}

export function DoctorBasicInfo({ formData, setFormData, isReadOnly }: DoctorBasicInfoProps) {
    const handleChange = (field: string, value: string | number) => {
        setFormData((prev: DoctorFormData) => ({ ...prev, [field]: value }))
    }

    return (
        <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin cơ bản</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Họ và tên */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên *</label>
                    <input
                        type="text"
                        required
                        disabled={isReadOnly}
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        className="w-full p-3 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg text-black disabled:bg-gray-100"
                    />
                </div>
                {/* Email */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                        type="email"
                        required
                        disabled={isReadOnly}
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        className="w-full p-3 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg text-black disabled:bg-gray-100"
                    />
                </div>
                {/* Số điện thoại */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại *</label>
                    <input
                        type="tel"
                        required
                        disabled={isReadOnly}
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        className="w-full p-3 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg text-black disabled:bg-gray-100"
                    />
                </div>
                {/* Ngày sinh */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ngày sinh</label>
                    <input
                        type="date"
                        disabled={isReadOnly}
                        value={formData.dateOfBirth}
                        onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                        className="w-full p-3 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg text-black disabled:bg-gray-100"
                    />
                </div>
                {/* Giới tính */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Giới tính</label>
                    <select
                        disabled={isReadOnly}
                        value={formData.gender}
                        onChange={(e) => handleChange('gender', e.target.value)}
                        className="w-full p-3 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg text-black disabled:bg-gray-100"
                    >
                        <option value="male">Nam</option>
                        <option value="female">Nữ</option>
                        <option value="other">Khác</option>
                    </select>
                </div>
                {/* Địa chỉ */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ</label>
                    <input
                        type="text"
                        disabled={isReadOnly}
                        value={formData.address}
                        onChange={(e) => handleChange('address', e.target.value)}
                        className="w-full p-3 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg text-black disabled:bg-gray-100"
                    />
                </div>
            </div>
        </div>
    )
}