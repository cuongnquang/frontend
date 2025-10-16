import { ReactNode } from 'react'

interface SpecialtyTabsProps {
    activeTab: 'overview' | 'doctors'
    setActiveTab: (tab: 'overview' | 'doctors') => void
    doctorCount: number
    children: ReactNode
}

export default function SpecialtyTabs({ activeTab, setActiveTab, doctorCount, children }: SpecialtyTabsProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm mb-6">
            <div className="border-b">
                <div className="flex">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`px-6 py-4 font-medium border-b-2 transition-colors ${
                            activeTab === 'overview'
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Tổng quan
                    </button>
                    <button
                        onClick={() => setActiveTab('doctors')}
                        className={`px-6 py-4 font-medium border-b-2 transition-colors ${
                            activeTab === 'doctors'
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Bác sĩ ({doctorCount})
                    </button>
                </div>
            </div>

            {/* Tab Content */}
            <div className="p-6">
                {children}
            </div>
        </div>
    )
}