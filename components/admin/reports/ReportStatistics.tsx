import React from 'react'
import { DollarSign, Calendar, Users, Activity } from 'lucide-react'
import OverviewStatCard from './OverviewStatCard'

interface StatsData {
    current: number
    previous: number
    change: number
}

interface ReportStatisticsProps {
    overviewStats: {
        revenue: StatsData
        appointments: StatsData
        newPatients: StatsData
        satisfaction: StatsData
    }
}

// Format numbers for display
const formatCurrency = (value: number) => `₫${(value / 1000000).toFixed(1)}M`
const formatRating = (value: number) => `${value}/5`

export default function ReportStatistics({ overviewStats }: ReportStatisticsProps) {
    const stats = [
        {
            title: 'Doanh thu',
            current: formatCurrency(overviewStats.revenue.current),
            previous: formatCurrency(overviewStats.revenue.previous),
            change: overviewStats.revenue.change,
            icon: DollarSign,
            iconBgColor: 'bg-green-100',
            iconTextColor: 'text-green-600'
        },
        {
            title: 'Lượt khám',
            current: overviewStats.appointments.current,
            previous: overviewStats.appointments.previous,
            change: overviewStats.appointments.change,
            icon: Calendar,
            iconBgColor: 'bg-blue-100',
            iconTextColor: 'text-blue-600'
        },
        {
            title: 'Bệnh nhân mới',
            current: overviewStats.newPatients.current,
            previous: overviewStats.newPatients.previous,
            change: overviewStats.newPatients.change,
            icon: Users,
            iconBgColor: 'bg-purple-100',
            iconTextColor: 'text-purple-600'
        },
        {
            title: 'Đánh giá TB',
            current: formatRating(overviewStats.satisfaction.current),
            previous: formatRating(overviewStats.satisfaction.previous),
            change: overviewStats.satisfaction.change,
            icon: Activity,
            iconBgColor: 'bg-yellow-100',
            iconTextColor: 'text-yellow-600'
        }
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
                <OverviewStatCard
                    key={stat.title}
                    title={stat.title}
                    currentValue={stat.current}
                    previousValue={stat.previous}
                    change={stat.change}
                    icon={stat.icon}
                    iconBgColor={stat.iconBgColor}
                    iconTextColor={stat.iconTextColor}
                />
            ))}
        </div>
    )
}