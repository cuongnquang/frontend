import React from 'react'
import { Users, FileText, Calendar, Phone } from 'lucide-react'
import { Patient } from '@/contexts/PatientContext'

interface PatientStatisticsProps {
    patients: Patient[]
}

export default function PatientStatistics({ patients }: PatientStatisticsProps) {
    const totalPatients = patients.length
    const hasInsurance = patients.filter(p => p.health_insurance_number).length
    const hasIdentity = patients.filter(p => p.identity_number).length
    const recentPatients = patients.filter(p => {
        const createdDate = new Date(p.created_at)
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        return createdDate >= thirtyDaysAgo
    }).length

    const stats = [
        {
            icon: Users,
            color: 'blue',
            label: 'Tổng bệnh nhân',
            value: totalPatients
        },
        {
            icon: FileText,
            color: 'green',
            label: 'Có BHYT',
            value: hasInsurance
        },
        {
            icon: Calendar,
            color: 'purple',
            label: 'Mới (30 ngày)',
            value: recentPatients
        },
        {
            icon: FileText,
            color: 'orange',
            label: 'Có CMND/CCCD',
            value: hasIdentity
        }
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
                <div key={stat.label} className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-l-blue-400 hover:border-l-blue-600 transition-all duration-300">
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