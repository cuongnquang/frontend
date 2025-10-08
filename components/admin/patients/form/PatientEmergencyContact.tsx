import { PatientFormInfoProps } from "./PatientFormType";

export function PatientEmergencyContact({ formData, setFormData, isReadOnly }: PatientFormInfoProps) {
    return (
        <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Liên hệ khẩn cấp</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Họ và tên
                    </label>
                    <input
                        type="text"
                        disabled={isReadOnly}
                        value={formData.emergencyContactName}
                        onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                        className="w-full p-3 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg text-black disabled:bg-gray-100"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số điện thoại
                    </label>
                    <input
                        type="tel"
                        disabled={isReadOnly}
                        value={formData.emergencyContactPhone}
                        onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                        className="w-full p-3 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg text-black disabled:bg-gray-100"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mối quan hệ
                    </label>
                    <input
                        type="text"
                        disabled={isReadOnly}
                        value={formData.emergencyContactRelationship}
                        onChange={(e) => setFormData({ ...formData, emergencyContactRelationship: e.target.value })}
                        className="w-full p-3 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg text-black disabled:bg-gray-100"
                    />
                </div>
            </div>
        </div>
    )
}