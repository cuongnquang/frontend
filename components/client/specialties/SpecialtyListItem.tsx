import { Specialty } from '@/types/types'
import { getSpecialtyIcon, getSpecialtyColor } from './icons/LucideIconMap'

interface SpecialtyListItemProps {
    specialty: Specialty
    doctorCount: number
    isSelected: boolean
    onClick: () => void
}

export default function SpecialtyListItem({ specialty, doctorCount, isSelected, onClick }: SpecialtyListItemProps) {
    const Icon = getSpecialtyIcon(specialty.name)
    const colorClasses = getSpecialtyColor(specialty.name)

    const baseClasses = 'w-full text-left p-3 rounded-lg transition-colors'
    const selectedClasses = 'bg-blue-50 text-blue-700 border border-blue-200'
    const hoverClasses = 'hover:bg-gray-50 text-gray-700'

    return (
        <button
            onClick={onClick}
            className={`${baseClasses} ${isSelected ? selectedClasses : hoverClasses}`}
        >
            <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 ${colorClasses} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <span className="font-medium">{specialty.name}</span>
                        <span className="text-sm text-gray-500">{doctorCount}</span>
                    </div>
                </div>
            </div>
        </button>
    )
}