import React from 'react'
import { Users, Calendar, AlertTriangle, FileText } from 'lucide-react'
import { Patient } from './PatientTypes'

interface PatientStatisticsProps {
    patients: Patient[]
}

export default function PatientStatistics({ patients }: PatientStatisticsProps) {
    const totalPatients = patients.length
    const appointmentsToday = patients.filter(p => p.nextAppointment).length // Giả định: chỉ cần có lịch hẹn
    const highRiskPatients = patients.filter(p => p.riskLevel === 'high').length
    const totalVisits = patients.reduce((sum, p) => sum + p.totalVisits, 0)

    const stats = [
        {
            icon: Users,
            color: 'blue',
            label: 'Tổng bệnh nhân',
            value: totalPatients
        },
        {
            icon: Calendar,
            color: 'green',
            label: 'Hẹn hôm nay',
            value: appointmentsToday
        },
        {
            icon: AlertTriangle,
            color: 'yellow',
            label: 'Rủi ro cao',
            value: highRiskPatients
        },
        {
            icon: FileText,
            color: 'purple',
            label: 'Lượt khám',
            value: totalVisits
        }
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
                <div key={stat.label} className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-l-gray-200 hover:border-l-blue-400 transition-all duration-300">
                    <div className="flex items-center">
                        <div className={`p-3 rounded-lg bg-${stat.color}-100 text-${stat.color}-600 mr-4`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">{stat.label}</p>
                            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}