import { Doctor } from "@/types/types"

interface AppointmentBookingInfoProps {
    formData: any
    setFormData: React.Dispatch<React.SetStateAction<any>>
    isReadOnly: boolean
    doctors: Doctor[]
}

export function AppointmentBookingInfo({ formData, setFormData, isReadOnly, doctors }: AppointmentBookingInfoProps) {
    const handleChange = (field: string, value: string) => {
        setFormData((prev: any) => ({ ...prev, [field]: value }))
    }

    return (
        <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Chi tiết lịch hẹn</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bác sĩ *</label>
                    <select
                        required
                        value={formData.doctorId}
                        onChange={(e) => handleChange('doctorId', e.target.value)}
                        disabled={isReadOnly}
                        className="w-full p-3 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg text-black disabled:bg-gray-100"
                    >
                        <option value="">-- Chọn bác sĩ --</option>
                        {doctors.map(d => (
                            <option key={d.doctor_id} value={d.doctor_id}>{d.full_name} - {d.Specialty?.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
                    <select
                        value={formData.status}
                        onChange={(e) => handleChange('status', e.target.value)}
                        disabled={isReadOnly}
                        className="w-full p-3 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg text-black disabled:bg-gray-100"
                    >
                        <option value="scheduled">Đã lên lịch</option>
                        <option value="confirmed">Đã xác nhận</option>
                        <option value="completed">Đã hoàn thành</option>
                        <option value="cancelled">Đã hủy</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ngày hẹn *</label>
                    <input
                        type="date"
                        required
                        value={formData.appointmentDate}
                        onChange={(e) => handleChange('appointmentDate', e.target.value)}
                        disabled={isReadOnly}
                        className="w-full p-3 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg text-black disabled:bg-gray-100"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Giờ hẹn *</label>
                    <input
                        type="time"
                        required
                        value={formData.appointmentTime}
                        onChange={(e) => handleChange('appointmentTime', e.target.value)}
                        disabled={isReadOnly}
                        className="w-full p-3 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg text-black disabled:bg-gray-100"
                    />
                </div>
            </div>
            <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Lý do khám / Triệu chứng</label>
                <textarea
                    rows={3}
                    value={formData.reason}
                    onChange={(e) => handleChange('reason', e.target.value)}
                    disabled={isReadOnly}
                    placeholder="VD: Khám tổng quát, đau đầu, chóng mặt..."
                    className="w-full p-3 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg text-black disabled:bg-gray-100"
                />
            </div>
        </div>
    )
}