import { Specialty } from '@/types/types'

interface SpecialtyOverviewProps {
    specialtyData: Specialty
}

export default function SpecialtyOverview({ specialtyData }: SpecialtyOverviewProps) {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Giới thiệu chuyên khoa
                </h3>
                <p className="text-gray-600 leading-relaxed">
                    {specialtyData.description} Đây là một trong những chuyên khoa
                    quan trọng nhất trong hệ thống y tế, đòi hỏi sự chuyên môn cao và
                    trang thiết bị hiện đại để đảm bảo chất lượng điều trị tốt nhất.
                </p>
            </div>

            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Thông tin hữu ích
                </h3>
                <div className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">
                        Chuẩn bị trước khi khám
                    </h4>
                    <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                        <li>Mang theo CMND/CCCD và thẻ bảo hiểm (nếu có)</li>
                        <li>Chuẩn bị hồ sơ/bệnh án và các xét nghiệm gần đây</li>
                        <li>Đến sớm 10-15 phút để làm thủ tục</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}