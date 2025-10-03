import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { LucideIcon } from 'lucide-react'

interface OverviewStatCardProps {
    title: string
    currentValue: string | number
    previousValue: string | number
    change: number
    icon: LucideIcon
    iconBgColor: string
    iconTextColor: string
}

export default function OverviewStatCard({
    title,
    currentValue,
    previousValue,
    change,
    icon: Icon,
    iconBgColor,
    iconTextColor
}: OverviewStatCardProps) {
    const isPositive = change >= 0
    const TrendIcon = isPositive ? TrendingUp : TrendingDown
    const trendColor = isPositive ? 'text-green-600' : 'text-red-600'

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-l-gray-200 hover:border-l-blue-400 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${iconBgColor} ${iconTextColor}`}>
                    <Icon className="w-6 h-6" />
                </div>
                <div className={`flex items-center ${trendColor}`}>
                    <TrendIcon className="w-4 h-4 mr-1" />
                    <span className="text-sm font-medium">{Math.abs(change).toFixed(1)}%</span>
                </div>
            </div>
            <h3 className="text-sm text-gray-600 mb-1">{title}</h3>
            <p className="text-2xl font-bold text-gray-900">{currentValue}</p>
            <p className="text-xs text-gray-500 mt-1">
                So với kỳ trước: {previousValue}
            </p>
        </div>
    )
}