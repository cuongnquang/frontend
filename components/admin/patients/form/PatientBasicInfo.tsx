import { PatientFormInfoProps } from '@/components/admin/patients/form/PatientFormType'

export function PatientBasicInfo({ formData, setFormData, isReadOnly }: PatientFormInfoProps) {
    const handleChange = (field: string, value: string) => {
        setFormData((prev: any) => ({ ...prev, [field]: value }))
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
                        value={formData.full_name}
                        onChange={(e) => handleChange('full_name', e.target.value)}
                        className="w-full p-3 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg text-black disabled:bg-gray-100"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số CMND/CCCD
                    </label>
                    <input
                        type="text"
                        disabled={isReadOnly}
                        value={formData.identity_number}
                        onChange={(e) => handleChange('identity_number', e.target.value)}
                        className="w-full p-3 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg text-black disabled:bg-gray-100"
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
                        value={formData.phone_number}
                        onChange={(e) => handleChange('phone_number', e.target.value)}
                        className="w-full p-3 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg text-black disabled:bg-gray-100"
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
                        value={formData.date_of_birth}
                        onChange={(e) => handleChange('date_of_birth', e.target.value)}
                        className="w-full p-3 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg text-black disabled:bg-gray-100"
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
                        className="w-full p-3 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg text-black disabled:bg-gray-100"
                    >
                        <option value="male">Nam</option>
                        <option value="female">Nữ</option>
                        <option value="other">Khác</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dân tộc
                    </label>
                    <input
                        type="text"
                        disabled={isReadOnly}
                        value={formData.ethnicity}
                        onChange={(e) => handleChange('ethnicity', e.target.value)}
                        className="w-full p-3 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg text-black disabled:bg-gray-100"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Địa chỉ
                    </label>
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