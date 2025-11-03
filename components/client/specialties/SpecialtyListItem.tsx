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

    return (
        <button
            onClick={onClick}
            className={`w-full text-left px-4 py-3 rounded-lg transition-all group ${
                isSelected 
                    ? 'bg-gradient-to-r from-blue-50 to-blue-100 shadow-sm' 
                    : 'hover:bg-gray-50'
            }`}
        >
            <div className="flex items-center gap-3">
                <div className={`w-9 h-9 ${colorClasses} rounded-lg flex items-center justify-center flex-shrink-0 ${
                    isSelected ? 'ring-2 ring-blue-200' : ''
                }`}>
                    <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                        <span className={`font-medium text-sm truncate ${
                            isSelected ? 'text-blue-700' : 'text-gray-700'
                        }`}>
                            {specialty.name}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ${
                            isSelected 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-gray-200 text-gray-600'
                        }`}>
                            {doctorCount}
                        </span>
                    </div>
                </div>
            </div>
        </button>
    )
}