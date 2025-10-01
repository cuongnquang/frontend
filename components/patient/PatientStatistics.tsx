import React from 'react'
import { Users, AlertTriangle, CheckCircle } from 'lucide-react'
import { Patient } from '@/types/types' // Import interface Patient

interface PatientStatisticsProps {
    patients: Patient[]
}

export const PatientStatistics: React.FC<PatientStatisticsProps> = ({ patients }) => {
    const totalPatients = patients.length
    const activePatients = patients.filter(p => p.status === 'active').length
    const highRiskPatients = patients.filter(p => p.riskLevel === 'high').length

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center">
                    <div className="p-3 rounded-lg bg-blue-100 text-blue-600 mr-4">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Tổng bệnh nhân</p>
                        <p className="text-2xl font-bold text-gray-900">{totalPatients}</p>
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center">
                    <div className="p-3 rounded-lg bg-green-100 text-green-600 mr-4">
                        <CheckCircle className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Đang hoạt động</p>
                        <p className="text-2xl font-bold text-gray-900">{activePatients}</p>
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center">
                    <div className="p-3 rounded-lg bg-red-100 text-red-600 mr-4">
                        <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Nguy cơ cao</p>
                        <p className="text-2xl font-bold text-gray-900">{highRiskPatients}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}