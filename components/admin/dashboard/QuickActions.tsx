'use client'

import { UserCheck, Users } from 'lucide-react'

export default function QuickActions({ handleOpenDoctor, handleOpenPatient }: any) {
    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h3>
                <div className="space-y-3">
                    <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors border" onClick={handleOpenDoctor}>
                        <div className="flex items-center">
                            <UserCheck className="w-5 h-5 text-blue-600 mr-3" />
                            <div>
                                <p className="text-sm font-medium text-gray-900">Thêm Bác sĩ</p>
                                <p className="text-xs text-gray-500">Đăng ký bác sĩ mới</p>
                            </div>
                        </div>
                    </button>
                    <button onClick={handleOpenPatient} className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors border">
                        <div className="flex items-center">
                            <Users className="w-5 h-5 text-green-600 mr-3" />
                            <div>
                                <p className="text-sm font-medium text-gray-900">Thêm Bệnh nhân</p>
                                <p className="text-xs text-gray-500">Đăng ký bệnh nhân mới</p>
                            </div>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    )
}
