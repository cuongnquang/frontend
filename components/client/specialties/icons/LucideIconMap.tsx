import { Heart, Eye, Award, Stethoscope, Users, LucideIcon } from 'lucide-react'

// Icon mapping for specialties
export const getSpecialtyIcon = (name: string): LucideIcon => {
    const iconMap: Record<string, LucideIcon> = {
        'Tim mạch': Heart,
        'Da liễu': Eye,
        'Nội tiết': Award,
        'Tiêu hóa': Stethoscope,
        'Cơ xương khớp': Users,
        'Thần kinh': Award, // Dùng Award cho Thần kinh, có thể thay đổi
    }
    return iconMap[name] || Stethoscope
}

// Color mapping for specialties (Tailwind classes)
export const getSpecialtyColor = (name: string): string => {
    const colorMap: Record<string, string> = {
        'Tim mạch': 'bg-red-50 text-red-600 border-red-200',
        'Da liễu': 'bg-green-50 text-green-600 border-green-200',
        'Nội tiết': 'bg-purple-50 text-purple-600 border-purple-200',
        'Tiêu hóa': 'bg-orange-50 text-orange-600 border-orange-200',
        'Cơ xương khớp': 'bg-blue-50 text-blue-600 border-blue-200',
        'Thần kinh': 'bg-indigo-50 text-indigo-600 border-indigo-200',
    }
    return colorMap[name] || 'bg-gray-50 text-gray-600 border-gray-200'
}