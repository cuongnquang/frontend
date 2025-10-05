import { PatientFormInfoProps } from '@/components/admin/patients/form/PatientFormType'

export function PatientBasicInfo({ formData, setFormData, isReadOnly }: PatientFormInfoProps) {
    const handleChange = (field: string, value: string | number) => {
        setFormData((prev: FormData) => ({ ...prev, [field]: value }))
    }
    return (
        <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin cơ bản</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Họ và tên *
                    </label>
                    <input
                        type="text"
                        required
                        disabled={isReadOnly}
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                    />
                </div>

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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số điện thoại *
                    </label>
                    <input
                        type="tel"
                        required
                        disabled={isReadOnly}
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ngày sinh *
                    </label>
                    <input
                        type="date"
                        required
                        disabled={isReadOnly}
                        value={formData.dateOfBirth}
                        onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Giới tính
                    </label>
                    <select
                        disabled={isReadOnly}
                        value={formData.gender}
                        onChange={(e) => handleChange('gender', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                    >
                        <option value="male">Nam</option>
                        <option value="female">Nữ</option>
                        <option value="other">Khác</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Địa chỉ
                    </label>
                    <input
                        type="text"
                        disabled={isReadOnly}
                        value={formData.address}
                        onChange={(e) => handleChange('address', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                    />
                </div>
            </div>
        </div>

    )
}