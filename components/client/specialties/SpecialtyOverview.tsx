import { Specialty } from '@/types/types'
import { FileText, CheckCircle, Clock } from 'lucide-react'

interface SpecialtyOverviewProps {
    specialtyData: Specialty
}

export default function SpecialtyOverview({ specialtyData }: SpecialtyOverviewProps) {
    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">
                        Giới thiệu chuyên khoa
                    </h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                    {specialtyData.description || 'Chuyên khoa chăm sóc sức khỏe toàn diện với đội ngũ bác sĩ giàu kinh nghiệm.'} 
                    Đây là một trong những chuyên khoa quan trọng nhất trong hệ thống y tế, đòi hỏi sự chuyên môn cao và trang thiết bị hiện đại để đảm bảo chất lượng điều trị tốt nhất.
                </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <h4 className="text-lg font-bold text-gray-900">
                        Chuẩn bị trước khi khám
                    </h4>
                </div>
                <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
                        <span className="text-gray-700">Mang theo CMND/CCCD và thẻ bảo hiểm y tế (nếu có)</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
                        <span className="text-gray-700">Chuẩn bị hồ sơ bệnh án và kết quả xét nghiệm gần đây</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
                        <span className="text-gray-700">Đến sớm 10-15 phút để hoàn tất thủ tục hành chính</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
                        <span className="text-gray-700">Ghi chú các triệu chứng và câu hỏi muốn trao đổi với bác sĩ</span>
                    </li>
                </ul>
            </div>
        </div>
    )
}