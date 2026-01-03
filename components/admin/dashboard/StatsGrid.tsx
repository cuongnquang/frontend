import { Users, UserCheck, Calendar, TrendingUp } from 'lucide-react'

interface StatsGridProps {
    stats?: any
    isLoading?: boolean
}

const defaultStats = [
    {
        name: 'Tổng số Bác sĩ',
        value: '0',
        change: '+0%',
        changeType: 'increase',
        icon: UserCheck,
        color: 'blue'
    },
    {
        name: 'Tổng số Bệnh nhân',
        value: '0',
        change: '+0%',
        changeType: 'increase',
        icon: Users,
        color: 'green'
    },
    {
        name: 'Lịch hẹn',
        value: '0',
        change: '+0%',
        changeType: 'increase',
        icon: Calendar,
        color: 'yellow'
    },
    {
        name: 'Chuyên khoa',
        value: '0',
        change: '+0%',
        changeType: 'increase',
        icon: TrendingUp,
        color: 'purple'
    }
]

const getStatColors = (color: string) => {
    const colors = {
        blue: 'text-blue-600 bg-blue-100',
        green: 'text-green-600 bg-green-100',
        yellow: 'text-yellow-600 bg-yellow-100',
        purple: 'text-purple-600 bg-purple-100'
    }
    return colors[color as keyof typeof colors] || colors.blue
}

export default function StatsGrid({ stats: propsStats, isLoading }: StatsGridProps) {
    const stats = propsStats || defaultStats
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat: any, i: number) => {
                const IconComponent = stat.icon
                return (
                    <div key={i} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                                <div className="flex items-center mt-2">
                                    <span className={`text-sm font-medium ${stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                        {stat.change}
                                    </span>
                                    <span className="text-sm text-gray-500 ml-1">so với tháng trước</span>
                                </div>
                            </div>
                            <div className={`p-3 rounded-lg ${getStatColors(stat.color)}`}>
                                {IconComponent ? <IconComponent className="w-6 h-6" /> : null}
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
