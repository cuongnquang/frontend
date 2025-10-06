import { UserCheck, Clock, CheckCircle, XCircle } from 'lucide-react'
import { Appointment } from './AppointmentType'

interface AppointmentStatisticsProps {
    appointments: Appointment[]
}

export default function AppointmentStatistics({ appointments }: AppointmentStatisticsProps) {
    const totalAppointments = appointments.length
    const completed = appointments.filter(a => a.status === 'completed').length;
    const pending = appointments.filter(a => a.status === 'pending').length
    const cancelled = appointments.filter(a => a.status === 'cancelled').length;

    const stats = [
        {
            icon: UserCheck,
            color: 'blue',
            label: 'Tổng số Lịch hẹn',
            value: totalAppointments.toString(),
            total: totalAppointments
        },
        {
            icon: CheckCircle,
            color: 'green',
            label: 'Tỷ lệ Hoàn thành',
            value: `${(completed / totalAppointments * 100).toFixed(1)}%`,
            unit: 'increase'
        },
        {
            icon: XCircle,
            color: 'red',
            label: 'Lịch hẹn Đã hủy',
            value: cancelled.toString(),
            unit: 'decrease'
        },
        {
            icon: Clock,
            color: 'yellow',
            label: 'Lịch hẹn Chờ',
            value: pending.toString(),
            unit: 'decrease'
        }
    ]
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
                <div key={stat.label} className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-l-gray-200 hover:border-l-blue-400 transition-all duration-300">
                    <div className="flex items-center">
                        <div className={`p-3 rounded-lg bg-${stat.color}-100 text-${stat.color}-600 mr-4`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">{stat.label}</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {stat.value}
                                {stat.unit && <span className="text-base font-normal ml-1 text-gray-600">{stat.unit}</span>}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}