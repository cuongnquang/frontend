import React from 'react'
import { Achievement } from '@/app/page' //Import interface Achievement

interface AchievementsGridProps {
    achievements: Achievement[]
}

// Component helper đã được tách ra
const AchievementItem: React.FC<Achievement> = ({ icon: Icon, text, count, unit }) => (
    <div className="flex flex-col items-center p-4 border rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 hover:shadow-lg transition-all duration-300 hover:scale-105">
        <Icon className="w-8 h-8 text-indigo-600 mb-3" />
        <p className="text-2xl font-bold text-gray-800">{count}{unit}</p>
        <p className="text-sm text-gray-600 text-center font-medium">{text}</p>
    </div>
)

export const AchievementsGrid: React.FC<AchievementsGridProps> = ({ achievements }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Thành Tích & Số Liệu Nổi Bật</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {achievements.map((item, index) => (
                <AchievementItem key={index} {...item} />
            ))}
        </div>
    </div>
)