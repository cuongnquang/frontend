import React from 'react'
import { Doctor } from '@/types/types'
import { Shield, Clock, Users, ThumbsUp, Phone, Mail, MapPin as Location, Verified, Award } from 'lucide-react'

interface TabContentAboutProps {
    doctor: Doctor
}

export const TabContentAbout: React.FC<TabContentAboutProps> = ({ doctor }) => (
    <div className="space-y-8">
        <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Về Bác Sĩ</h3>
            <p className="text-gray-700 leading-relaxed mb-6">{doctor.description}</p>
        </div>

        {/* Social Proof Grid */}
        <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Shield className="w-5 h-5 mr-3 text-green-500" />
                    <div>
                        <p className="font-medium text-gray-900">Bảo hiểm</p>
                        <p className="text-sm text-gray-600">{doctor.acceptsInsurance ? 'Chấp nhận' : 'Không chấp nhận'}</p>
                    </div>
                </div>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Clock className="w-5 h-5 mr-3 text-blue-500" />
                    <div>
                        <p className="font-medium text-gray-900">Thời gian chờ trung bình</p>
                        <p className="text-sm text-gray-600">{doctor.socialProof.averageWaitTime}</p>
                    </div>
                </div>
            </div>
            <div className="space-y-4">
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Users className="w-5 h-5 mr-3 text-indigo-500" />
                    <div>
                        <p className="font-medium text-gray-900">Bệnh nhân tháng này</p>
                        <p className="text-sm text-gray-600">{doctor.socialProof.patientsThisMonth} người</p>
                    </div>
                </div>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <ThumbsUp className="w-5 h-5 mr-3 text-green-500" />
                    <div>
                        <p className="font-medium text-gray-900">Tỷ lệ hài lòng</p>
                        <p className="text-sm text-gray-600">{doctor.socialProof.satisfactionRate}%</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Thông tin liên hệ */}
        <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <div className="w-1 h-6 bg-indigo-500 mr-3 rounded"></div>
                Thông Tin Liên Hệ
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <Phone className="w-5 h-5 text-gray-500 mr-3" />
                    <div>
                        <p className="font-medium text-gray-900">{doctor.contact.phone}</p>
                        <p className="text-sm text-gray-500">Hotline bệnh viện</p>
                    </div>
                </div>
                <div className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <Mail className="w-5 h-5 text-gray-500 mr-3" />
                    <div>
                        <p className="font-medium text-gray-900">{doctor.contact.email}</p>
                        <p className="text-sm text-gray-500">Email trực tiếp</p>
                    </div>
                </div>
                <div className="flex items-start p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors md:col-span-2">
                    <Location className="w-5 h-5 text-gray-500 mr-3 mt-1" />
                    <div>
                        <p className="font-medium text-gray-900">{doctor.hospital}</p>
                        <p className="text-sm text-gray-500">{doctor.location}</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Chứng nhận & Bảo đảm */}
        <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <div className="w-1 h-6 bg-indigo-500 mr-3 rounded"></div>
                Chứng Nhận & Bảo Đảm
            </h3>
            <div className="space-y-3">
                <div className="flex items-center p-4 bg-green-50 rounded-lg border border-green-200">
                    <Verified className="w-6 h-6 text-green-600 mr-3" />
                    <div>
                        <p className="font-medium text-green-800">Bác sĩ được xác minh</p>
                        <p className="text-sm text-green-600">Đã kiểm tra bằng cấp và chứng chỉ</p>
                    </div>
                </div>
                <div className="flex items-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <Shield className="w-6 h-6 text-blue-600 mr-3" />
                    <div>
                        <p className="font-medium text-blue-800">Bảo hiểm trách nhiệm</p>
                        <p className="text-sm text-blue-600">Được bảo hiểm hành nghề</p>
                    </div>
                </div>
                <div className="flex items-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <Award className="w-6 h-6 text-purple-600 mr-3" />
                    <div>
                        <p className="font-medium text-purple-800">Chứng nhận chất lượng</p>
                        <p className="text-sm text-purple-600">Đạt tiêu chuẩn quốc tế</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
)