import { Award, Briefcase, Star } from 'lucide-react'
import { Doctor } from '@/types/types'

interface DoctorSidebarProps {
    doctor: Doctor
}

export default function DoctorSidebar({ doctor }: DoctorSidebarProps) {
    return (
        <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-xl p-6 sticky top-4">
                <h3 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Thông tin bác sĩ</h3>
                {/* Doctor Avatar */}
                <div className="flex flex-col items-center mb-4">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-200 mb-3">
                        <img src={doctor.avatar_url} alt={doctor.full_name} className="w-full h-full object-cover"/>
                    </div>
                    <h4 className="text-2xl font-bold text-gray-900 text-center">{doctor.full_name}</h4>
                    <p className="text-blue-600 font-medium text-lg">{doctor.title}</p>
                </div>
                {/* Specialty */}
                <div className="mb-4 p-3 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Award className="w-5 h-5 mr-2 text-blue-800" />
                    <span className="font-semibold text-blue-800">{doctor.Specialty.name}</span>
                </div>
                {/* Details Section */}
                <div className="space-y-4 text-sm">
                    <div className="flex items-start text-gray-700"><Briefcase className="w-5 h-5 mr-3 mt-1 text-blue-600 flex-shrink-0" /><div><span className="font-semibold block">Kinh nghiệm:</span><p className="text-gray-600">{doctor.experience_years} năm</p></div></div>
                    <div className="flex items-start text-gray-700"><Star className="w-5 h-5 mr-3 mt-1 text-blue-600 flex-shrink-0" /><div><span className="font-semibold block">Chuyên môn:</span><p className="text-gray-600">{doctor.specializations}</p></div></div>
                    <div className="pt-2 border-t border-gray-100"><h5 className="font-semibold text-gray-900 mb-1">Giới thiệu:</h5><p className="text-gray-600 italic">{doctor.introduction}</p></div>
                    <div className="pt-2 border-t border-gray-100"><h5 className="font-semibold text-gray-900 mb-1">Kinh nghiệm làm việc:</h5><p className="text-gray-600">{doctor.work_experience}</p></div>
                    <div className="pt-2 border-t border-gray-100"><h5 className="font-semibold text-gray-900 mb-1">Thành tích:</h5><p className="text-gray-600">{doctor.achievements}</p></div>
                </div>
            </div>
        </div>
    )
}