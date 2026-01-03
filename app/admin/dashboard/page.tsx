'use client'

import { useEffect, useState } from 'react'
import { Users, UserCheck, Calendar, TrendingUp } from 'lucide-react'
import { useDoctor } from '@/contexts/DoctorContext'
import { usePatient } from '@/contexts/PatientContext'
import { useAppointment } from '@/contexts/AppointmentContext'
import { useSpecialty } from '@/contexts/SpecialtyContext'
import DashboardHeader from '@/components/admin/dashboard/DashboardHeader'
import StatsGrid from '@/components/admin/dashboard/StatsGrid'
import RecentActivities from '@/components/admin/dashboard/RecentActivities'
import QuickActions from '@/components/admin/dashboard/QuickActions'
import SystemStatus from '@/components/admin/dashboard/SystemStatus'

export default function AdminDashboard() {
    const { doctors, loading: doctorsLoading, fetchDoctors } = useDoctor()
    const { patients, loading: patientsLoading, fetchPatients } = usePatient()
    const { appointments, loading: appointmentsLoading, fetchAppointments } = useAppointment()
    const { specialties, loading: specialtiesLoading, fetchSpecialties } = useSpecialty()

    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const loadData = async () => {
            try {
                await Promise.all([
                    fetchDoctors(),
                    fetchPatients(),
                    fetchAppointments(),
                    fetchSpecialties()
                ])
            } finally {
                setIsLoading(false)
            }
        }
        loadData()
    }, [fetchDoctors, fetchPatients, fetchAppointments, fetchSpecialties])

    // Build stats array for display
    const statsArray = [
        {
            name: 'Tổng số Bác sĩ',
            value: doctors.length.toString(),
            change: '+0%',
            changeType: 'increase',
            icon: UserCheck,
            color: 'blue'
        },
        {
            name: 'Tổng số Bệnh nhân',
            value: patients.length.toString(),
            change: '+0%',
            changeType: 'increase',
            icon: Users,
            color: 'green'
        },
        {
            name: 'Lịch hẹn',
            value: appointments.length.toString(),
            change: '+0%',
            changeType: 'increase',
            icon: Calendar,
            color: 'yellow'
        },
        {
            name: 'Chuyên khoa',
            value: specialties.length.toString(),
            change: '+0%',
            changeType: 'increase',
            icon: TrendingUp,
            color: 'purple'
        }
    ]

    return (
        <div className="space-y-6">
            <DashboardHeader />
            <StatsGrid stats={statsArray} isLoading={isLoading || appointmentsLoading} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                <RecentActivities appointments={appointments} doctors={doctors} patients={patients} />
                <div className="space-y-6">
                    <QuickActions />
                    <SystemStatus />
                </div>
            </div>
        </div>
    )
}