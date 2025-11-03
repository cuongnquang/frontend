import { ReactNode } from 'react'
import { LayoutGrid, Users } from 'lucide-react'

interface SpecialtyTabsProps {
    activeTab: 'overview' | 'doctors'
    setActiveTab: (tab: 'overview' | 'doctors') => void
    doctorCount: number
    children: ReactNode
}

export default function SpecialtyTabs({ activeTab, setActiveTab, doctorCount, children }: SpecialtyTabsProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden border border-gray-100">
            <div className="border-b border-gray-100 bg-gray-50">
                <div className="flex">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`flex items-center gap-2 px-6 py-4 font-semibold border-b-2 transition-all ${
                            activeTab === 'overview'
                                ? 'border-blue-600 text-blue-600 bg-white'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        <LayoutGrid className="w-4 h-4" />
                        Tổng quan
                    </button>
                    <button
                        onClick={() => setActiveTab('doctors')}
                        className={`flex items-center gap-2 px-6 py-4 font-semibold border-b-2 transition-all ${
                            activeTab === 'doctors'
                                ? 'border-blue-600 text-blue-600 bg-white'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        <Users className="w-4 h-4" />
                        Bác sĩ
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-xs font-bold rounded-full">
                            {doctorCount}
                        </span>
                    </button>
                </div>
            </div>

            <div className="p-6">
                {children}
            </div>
        </div>
    )
}   