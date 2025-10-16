import { FileText, Download, Upload, Stethoscope } from 'lucide-react'

interface MedicalRecord {
    id: number
    date: string
    doctorName: string
    diagnosis: string
    treatment: string
    hospital: string
    files: string[]
}

interface MedicalRecordsListProps {
    medicalRecords: MedicalRecord[]
}

export default function MedicalRecordsList({ medicalRecords }: MedicalRecordsListProps) {
    if (medicalRecords.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có hồ sơ y tế nào</h3>
                    <p className="text-gray-600 mb-6">Các hồ sơ sẽ được lưu trữ tự động sau khi hoàn thành lịch hẹn.</p>
                    <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        <div className="flex items-center justify-center">
                            <Upload className="w-4 h-4 mr-2" />
                            Tải lên hồ sơ mới
                        </div>
                        
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-gray-900">Hồ sơ và Tài liệu Y tế</h1>
                <p className="text-gray-600 mt-1">Quản lý các kết quả khám, chẩn đoán và tài liệu liên quan</p>
            </div>

            <div className="p-6 space-y-4">
                {medicalRecords.map((record) => (
                    <div key={record.id} className="border border-gray-200 rounded-lg p-6 flex items-start justify-between hover:shadow-md transition-shadow">
                        <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                                <Stethoscope className="w-5 h-5 text-blue-600" />
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {record.diagnosis}
                                </h3>
                                <span className="text-sm text-gray-500">
                                    ({new Date(record.date).toLocaleDateString('vi-VN')})
                                </span>
                            </div>
                            <p className="text-gray-600 mb-2">
                                **Bác sĩ:** {record.doctorName} | **Bệnh viện:** {record.hospital}
                            </p>
                            <p className="text-sm text-gray-700">
                                **Điều trị:** {record.treatment}
                            </p>

                            <div className="mt-4">
                                <h4 className="text-sm font-medium text-gray-700 mb-2">
                                    Tài liệu đính kèm ({record.files.length})
                                </h4>
                                <div className="flex flex-wrap gap-3">
                                    {record.files.map((file, index) => (
                                        <a
                                            key={index}
                                            href="#" // Placeholder for file download link
                                            className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors bg-blue-50 px-3 py-1.5 rounded-full border border-blue-200"
                                        >
                                            <FileText className="w-4 h-4 mr-1" />
                                            {file}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="ml-4 flex space-x-2">
                            <button
                                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                title="Tải xuống tất cả"
                            >
                                <Download className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}