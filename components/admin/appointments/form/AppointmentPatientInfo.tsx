import { Patient } from "@/types/types"

interface AppointmentPatientInfoProps {
    formData: any
    setFormData: React.Dispatch<React.SetStateAction<any>>
    isReadOnly: boolean
    patients: Patient[]
}

export function AppointmentPatientInfo({ formData, setFormData, isReadOnly, patients }: AppointmentPatientInfoProps) {
    const handlePatientChange = (field: string, value: string) => {
        if (field === 'patientId') {
            setFormData((prev: any) => ({ ...prev, patientId: value }))
        } else {
            setFormData((prev: any) => ({
                ...prev,
                newPatient: { ...prev.newPatient, [field]: value }
            }))
        }
    }

    const isNewPatient = !formData.patientId;

    return (
        <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin bệnh nhân</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Chọn bệnh nhân (nếu có)</label>
                    <select
                        value={formData.patientId}
                        onChange={(e) => handlePatientChange('patientId', e.target.value)}
                        disabled={isReadOnly}
                        className="w-full p-3 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg text-black disabled:bg-gray-100"
                    >
                        <option value="">-- Bệnh nhân mới --</option>
                        {patients.map(p => (
                            <option key={p.patient_id} value={p.patient_id}>{p.full_name} - {p.phone_number}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên *</label>
                    <input
                        type="text"
                        required
                        value={formData.newPatient.fullName}
                        onChange={(e) => handlePatientChange('fullName', e.target.value)}
                        disabled={isReadOnly || !isNewPatient}
                        className="w-full p-3 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg text-black disabled:bg-gray-100"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại *</label>
                    <input
                        type="tel"
                        required
                        value={formData.newPatient.phone}
                        onChange={(e) => handlePatientChange('phone', e.target.value)}
                        disabled={isReadOnly || !isNewPatient}
                        className="w-full p-3 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg text-black disabled:bg-gray-100"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                        type="email"
                        value={formData.newPatient.email}
                        onChange={(e) => handlePatientChange('email', e.target.value)}
                        disabled={isReadOnly || !isNewPatient}
                        className="w-full p-3 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg text-black disabled:bg-gray-100"
                    />
                </div>
            </div>
        </div>
    )
}