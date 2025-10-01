'use client'

import { useState } from 'react'
import {
    Star,
    MapPin,
    Phone,
    Clock,
    Bed,
    Users,
    Award,
    Shield,
    Heart,
    Eye,
    Calendar,
    Stethoscope,
    Activity,
    Building2,
    CheckCircle,
    AlertCircle,
    Navigation,
    Wifi,
    Car,
    Coffee,
    Zap,
    HeartHandshake,
    Ambulance,
    ChevronRight,
    ChevronDown,
    ChevronUp
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import Alert from '@/components/ui/Alert'

interface Hospital {
    emergency: any
    averageWait: string
    priceRange: string
    id: number
    name: string
    type: 'Công lập' | 'Tư nhân'
    level: 'Hạng I' | 'Hạng II' | 'Hạng III' | 'Đặc biệt'
    address: string
    district: string
    city: string
    rating: number
    reviews: number
    phone: string
    website?: string
    image: string
    description: string
    specialties: string[]
    beds: number
    doctors: number
    established: number
    certifications: string[]
    facilities: {
        name: string
        icon: any
        available: boolean
    }[]
    services: {
        emergency: boolean
        icu: boolean
        surgery: boolean
        maternity: boolean
        pediatric: boolean
        cardiology: boolean
        oncology: boolean
        imaging: boolean
    }[]
    workingHours: {
        weekday: string
        weekend: string
        emergency: string
    }
    pricing: {
        consultation: {
            min: string
            max: string
        }
        emergency: string
        room: {
            standard: string
            vip: string
        }
    }
    insurance: string[]
    distance?: string
    averageWaitTime: string
    satisfactionRate: number
    isPartner: boolean
    promotions?: string[]
    contactInfo: {
        hotline: string
        email: string
        facebook?: string
        website?: string
    }
}

interface HospitalCardProps {
    hospital: Hospital
    variant?: 'default' | 'compact' | 'featured' | 'detailed' | 'prominent' | 'list'
    showBookButton?: boolean
    showDirections?: boolean
    onBookAppointment?: (hospitalId: number) => void
    onViewDetails?: (hospitalId: number) => void
    onGetDirections?: (hospitalId: number) => void
}

export default function HospitalCard({
    hospital,
    variant = 'default',
    showBookButton = true,
    showDirections = true,
    onBookAppointment,
    onViewDetails,
    onGetDirections
}: HospitalCardProps) {
    const router = useRouter()
    const [showAlert, setShowAlert] = useState(false)
    const [isFavorite, setIsFavorite] = useState(false)
    const [showFullDescription, setShowFullDescription] = useState(false)
    const [showAllSpecialties, setShowAllSpecialties] = useState(false)
    const [showAllFacilities, setShowAllFacilities] = useState(false)
    const [favoriteHospitals, setFavoriteHospitals] = useState<number[]>([])

    const handleBookAppointment = () => {
        const isLoggedIn = true
        if (!isLoggedIn) {
            setShowAlert(true)
            return
        }
        router.push(`/patient/appointments?hospitalId=${hospital.id}`)
    }

    const handleViewDetails = () => {
        router.push(`/patient/hospitals/${hospital.id}`)

    }

    const handleGetDirections = () => {
        if (onGetDirections) {
            onGetDirections(hospital.id)
        }
    }

    const toggleFavorite = () => {
        setIsFavorite(!isFavorite)
    }

    const getTypeColor = (type: string) => {
        return type === 'Công lập'
            ? 'bg-green-100 text-green-800 border-green-200'
            : 'bg-blue-100 text-blue-800 border-blue-200'
    }

    const getLevelColor = (level: string) => {
        switch (level) {
            case 'Đặc biệt':
                return 'bg-purple-100 text-purple-800 border-purple-200'
            case 'Hạng I':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200'
            case 'Hạng II':
                return 'bg-orange-100 text-orange-800 border-orange-200'
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200'
        }
    }

    // Compact variant for list views
    if (variant === 'compact') {
        return (

            <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 border border-gray-100">
                <div className="md:flex">
                    {/* Hospital image */}
                    <div className="md:w-1/3">
                        <div className="h-48 md:h-full bg-gray-200 relative">
                            {hospital.emergency && (
                                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                    Cấp cứu 24/7
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Hospital info */}
                    <div className="md:w-2/3 p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    {hospital.name}
                                </h3>
                                <div className="flex items-center space-x-4 mb-2">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${hospital.type === 'Công lập'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-blue-100 text-blue-800'
                                        }`}>
                                        {hospital.type}
                                    </span>
                                    <div className="flex items-center">
                                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                        <span className="ml-1 font-medium">{hospital.rating}</span>
                                        <span className="ml-1 text-gray-500">({hospital.reviews} đánh giá)</span>
                                    </div>
                                </div>
                                <div className="flex items-center text-gray-600 mb-3">
                                    <MapPin className="w-4 h-4 mr-2" />
                                    <span>{hospital.address}, {hospital.district}</span>
                                </div>
                            </div>
                            {showAlert && (
                                <Alert
                                    message="Bạn cần đăng nhập để thực hiện chức năng này."
                                    type="warning"
                                />
                            )}
                            <button onClick={(e) => { e.stopPropagation(); handleBookAppointment() }} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                Đặt lịch
                            </button>
                        </div>

                        <p className="text-gray-600 mb-4 line-clamp-2">
                            {hospital.description}
                        </p>

                        {/* Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div className="flex items-center">
                                <Bed className="w-4 h-4 text-blue-600 mr-2" />
                                <span className="text-sm text-gray-600">{hospital.beds} giường</span>
                            </div>
                            <div className="flex items-center">
                                <Stethoscope className="w-4 h-4 text-blue-600 mr-2" />
                                <span className="text-sm text-gray-600">{hospital.doctors} bác sĩ</span>
                            </div>
                            <div className="flex items-center">
                                <Award className="w-4 h-4 text-blue-600 mr-2" />
                                <span className="text-sm text-gray-600">Từ {hospital.established}</span>
                            </div>
                            <div className="flex items-center">
                                <Phone className="w-4 h-4 text-blue-600 mr-2" />
                                <span className="text-sm text-gray-600">{hospital.phone}</span>
                            </div>
                        </div>

                        {/* Specialties */}
                        <div className="mb-4">
                            <h4 className="text-sm font-semibold text-gray-900 mb-2">Chuyên khoa:</h4>
                            <div className="flex flex-wrap gap-2">
                                {hospital.specialties.map((specialty, index) => (
                                    <span
                                        key={index}
                                        className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-sm"
                                    >
                                        {specialty}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Working hours */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center text-sm text-gray-600">
                                <Clock className="w-4 h-4 mr-2" />
                                <span>T2-T6: {hospital.workingHours.weekday} | T7-CN: {hospital.workingHours.weekend}</span>
                            </div>
                            <button onClick={handleViewDetails} className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center">
                                Xem chi tiết
                                <ChevronRight className="w-4 h-4 ml-1" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        )
    }

    if (variant === 'list') {
        return (
            <div onClick={handleViewDetails} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all group cursor-pointer">
                <div
                    key={hospital.id}
                    className="bg-white border border-gray-200 rounded-xl p-4 flex items-start justify-between"
                >
                    <div className="flex items-start space-x-4">
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white">
                            <Building2 className="w-8 h-8" />
                        </div>
                        <div>
                            <div className="flex items-center space-x-2">
                                <h4 className="font-semibold text-gray-900">{hospital.name}</h4>
                                {hospital.emergency && (
                                    <span className="px-2 py-0.5 text-xs rounded-full bg-red-50 text-red-700 border border-red-200">
                                        Cấp cứu 24/7
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center space-x-2 mt-1">
                                <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getTypeColor(hospital.type)}`}>
                                    {hospital.type}
                                </span>
                                <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                                    {hospital.level}
                                </span>
                                <span className="text-gray-500 text-xs">{hospital.district}</span>
                            </div>
                            <div className="flex items-center space-x-4 mt-2 text-sm">
                                <span className="flex items-center text-yellow-600">
                                    <Star className="w-4 h-4 mr-1 fill-current" />
                                    {hospital.rating} ({hospital.reviews})
                                </span>
                                <span className="text-gray-500">{hospital.beds} giường</span>
                                <span className="text-gray-500">{hospital.doctors} bác sĩ</span>
                                <span className="text-blue-600 font-medium">{hospital.priceRange}</span>
                            </div>
                            <div className="flex items-center text-sm text-green-600 mt-1">
                                <CheckCircle className="w-4 h-4 mr-1" />
                                {hospital.satisfactionRate}% hài lòng
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() =>
                                setFavoriteHospitals(prev =>
                                    prev.includes(hospital.id) ? prev.filter(id => id !== hospital.id) : [...prev, hospital.id]
                                )
                            }
                            className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                            aria-label="Yêu thích bệnh viện"
                        >
                            <Heart className={`w-5 h-5 ${favoriteHospitals.includes(hospital.id) ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
                        </button>
                        {showAlert && (
                            <Alert
                                message="Bạn cần đăng nhập để thực hiện chức năng này."
                                type="warning"
                            />
                        )}
                        <a
                            onClick={(e) => { e.stopPropagation(); handleBookAppointment() }}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Đặt lịch
                        </a>
                    </div>
                </div>
            </div>
        )
    }

    if (variant === 'prominent') {
        return (
            <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 border border-gray-100">
                <div key={hospital.id} className="bg-gray-50 rounded-xl overflow-hidden">
                    <div className="h-48 bg-gray-200 relative">
                        <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-sm font-medium">
                            {hospital.type}
                        </div>
                    </div>
                    <div className="p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                            {hospital.name}
                        </h3>
                        <div className="flex items-center mb-3">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="ml-1 font-medium">{hospital.rating}</span>
                            <span className="ml-1 text-gray-500 text-sm">({hospital.reviews} đánh giá)</span>
                        </div>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                            {hospital.description}
                        </p>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center text-sm text-gray-600">
                                <MapPin className="w-4 h-4 mr-1" />
                                {hospital.district}
                            </div>
                            <button onClick={handleViewDetails} className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                                Xem chi tiết
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // Featured variant for homepage/special sections
    if (variant === 'featured') {
        return (
            <div onClick={handleViewDetails} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all group cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                        <div className="relative">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                                <Building2 className="w-8 h-8 text-white" />
                            </div>
                            {hospital.emergency && (
                                <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">!</span>
                                </div>
                            )}
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                {hospital.name}
                            </h3>
                            <div className="flex items-center space-x-2 mb-2">
                                <span className={`px-2 py-1 rounded text-xs font-medium border ${getTypeColor(hospital.type)}`}>
                                    {hospital.type}
                                </span>
                                <span className={`px-2 py-1 rounded text-xs font-medium border ${getLevelColor(hospital.level)}`}>
                                    {hospital.level}
                                </span>
                            </div>
                            <div className="flex items-center text-gray-600 text-sm">
                                <MapPin className="w-4 h-4 mr-1" />
                                <span>{hospital.district}</span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={(e) => { e.stopPropagation(); toggleFavorite() }}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <Heart className={`w-5 h-5 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
                    </button>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{hospital.rating}</div>
                        <div className="text-xs text-gray-600">Đánh giá</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{hospital.beds}</div>
                        <div className="text-xs text-gray-600">Giường</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{hospital.doctors}</div>
                        <div className="text-xs text-gray-600">Bác sĩ</div>
                    </div>
                </div>
                <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Chuyên khoa:</h4>
                    <div className="flex flex-wrap gap-1">
                        {hospital.specialties.map((specialty, idx) => (
                            <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                                {specialty}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>Chờ: {hospital.averageWaitTime || hospital.averageWait}</span>
                    </div>
                    <div className="flex items-center">
                        <Award className="w-4 h-4 mr-1" />
                        <span>Từ {hospital.established}</span>
                    </div>
                    <div className="text-green-600 font-medium">
                        {hospital.satisfactionRate}% hài lòng
                    </div>
                </div>
                <div className="border-t pt-4 flex items-center justify-between">
                    <div>
                        <div className="text-lg font-bold text-blue-600">
                            {hospital.pricing?.consultation?.min || hospital.priceRange}
                        </div>
                        <div className="text-xs text-gray-500">Phí khám</div>
                    </div>
                    {showAlert && (
                        <Alert
                            message="Bạn cần đăng nhập để thực hiện chức năng này."
                            type="warning"
                        />
                    )}
                    {showBookButton && (
                        <button
                            onClick={(e) => { e.stopPropagation(); handleBookAppointment() }}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            Đặt lịch
                        </button>
                    )}
                </div>
            </div>
        );
    }

    // Default variant - standard card
    return (
        <div onClick={handleViewDetails} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 overflow-hidden cursor-pointer">
            {/* Header */}
            <div className="p-6 pb-4">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                        {/* Hospital Image */}
                        <div className="relative flex-shrink-0">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                                <Building2 className="w-10 h-10 text-white" />
                            </div>
                            {hospital.services[0]?.emergency && (
                                <div className="absolute -top-1 -right-1 w-7 h-7 bg-red-500 rounded-full flex items-center justify-center">
                                    <Ambulance className="w-4 h-4 text-white" />
                                </div>
                            )}
                            {hospital.isPartner && (
                                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white px-2 py-0.5 rounded-full text-xs font-medium">
                                    Partner
                                </div>
                            )}
                        </div>

                        {/* Hospital Info */}
                        <div className="flex-1">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                        {hospital.name}
                                    </h3>
                                    <div className="flex items-center space-x-2 mb-2">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getTypeColor(hospital.type)}`}>
                                            {hospital.type}
                                        </span>
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getLevelColor(hospital.level)}`}>
                                            {hospital.level}
                                        </span>
                                    </div>
                                    <div className="flex items-center text-gray-600 text-sm mb-3">
                                        <MapPin className="w-4 h-4 mr-2" />
                                        <span>{hospital.address}, {hospital.district}, {hospital.city}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); toggleFavorite() }}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <Heart className={`w-5 h-5 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
                                </button>
                            </div>

                            {/* Rating and stats */}
                            <div className="flex items-center space-x-6 mb-4">
                                <div className="flex items-center">
                                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                                    <span className="ml-1 font-semibold">{hospital.rating}</span>
                                    <span className="ml-1 text-gray-500 text-sm">({hospital.reviews} đánh giá)</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <Bed className="w-4 h-4 mr-1" />
                                    <span>{hospital.beds} giường</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <Stethoscope className="w-4 h-4 mr-1" />
                                    <span>{hospital.doctors} bác sĩ</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <Award className="w-4 h-4 mr-1" />
                                    <span>Từ {hospital.established}</span>
                                </div>
                            </div>

                            {/* Contact info */}
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="flex items-center text-sm text-gray-600">
                                    <Phone className="w-4 h-4 mr-1 text-green-600" />
                                    <span>{hospital.phone}</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <Clock className="w-4 h-4 mr-1 text-blue-600" />
                                    <span>Chờ: {hospital.averageWaitTime}</span>
                                </div>
                                {hospital.distance && (
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Navigation className="w-4 h-4 mr-1 text-purple-600" />
                                        <span>{hospital.distance}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="mb-4">
                    <p className="text-gray-600 text-sm leading-relaxed">
                        {showFullDescription ? hospital.description : `${hospital.description.slice(0, 150)}...`}
                        <button
                            onClick={() => setShowFullDescription(!showFullDescription)}
                            className="text-blue-600 hover:text-blue-700 ml-1"
                        >
                            {showFullDescription ? 'Thu gọn' : 'Xem thêm'}
                        </button>
                    </p>
                </div>

                {/* Specialties */}
                <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Chuyên khoa:</h4>
                    <div className="flex flex-wrap gap-2">
                        {(showAllSpecialties ? hospital.specialties : hospital.specialties.slice(0, 4)).map((specialty, index) => (
                            <span
                                key={index}
                                className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                            >
                                {specialty}
                            </span>
                        ))}
                        {hospital.specialties.length > 4 && (
                            <button
                                onClick={() => setShowAllSpecialties(!showAllSpecialties)}
                                className="px-3 py-1 text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                            >
                                {showAllSpecialties ? (
                                    <>Thu gọn <ChevronUp className="w-4 h-4 ml-1" /></>
                                ) : (
                                    <>+{hospital.specialties.length - 4} khác <ChevronDown className="w-4 h-4 ml-1" /></>
                                )}
                            </button>
                        )}
                    </div>
                </div>

                {/* Facilities */}
                <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Tiện nghi:</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {(showAllFacilities ? hospital.facilities : hospital.facilities.slice(0, 6)).map((facility, index) => (
                            <div key={index} className={`flex items-center text-xs p-2 rounded-lg ${facility.available ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-500'
                                }`}>
                                <facility.icon className="w-4 h-4 mr-2" />
                                <span>{facility.name}</span>
                                {facility.available && <CheckCircle className="w-3 h-3 ml-auto" />}
                            </div>
                        ))}
                    </div>
                    {hospital.facilities.length > 6 && (
                        <button
                            onClick={() => setShowAllFacilities(!showAllFacilities)}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2 flex items-center"
                        >
                            {showAllFacilities ? (
                                <>Thu gọn <ChevronUp className="w-4 h-4 ml-1" /></>
                            ) : (
                                <>Xem thêm tiện nghi <ChevronDown className="w-4 h-4 ml-1" /></>
                            )}
                        </button>
                    )}
                </div>

                {/* Certifications */}
                <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Chứng nhận:</h4>
                    <div className="flex flex-wrap gap-2">
                        {hospital.certifications.map((cert, index) => (
                            <span key={index} className="flex items-center text-xs bg-yellow-50 text-yellow-700 px-2 py-1 rounded-full">
                                <Shield className="w-3 h-3 mr-1" />
                                {cert}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Insurance */}
                <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Bảo hiểm:</h4>
                    <div className="flex flex-wrap gap-2">
                        {hospital.insurance.map((ins, index) => (
                            <span key={index} className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded">
                                {ins}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Working hours */}
                <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Giờ làm việc:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                        <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2 text-blue-600" />
                            <span>T2-T6: {hospital.workingHours.weekday}</span>
                        </div>
                        <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2 text-orange-600" />
                            <span>T7-CN: {hospital.workingHours.weekend}</span>
                        </div>
                        <div className="flex items-center">
                            <AlertCircle className="w-4 h-4 mr-2 text-red-600" />
                            <span>Cấp cứu: {hospital.workingHours.emergency}</span>
                        </div>
                    </div>
                </div>

                {/* Promotions */}
                {hospital.promotions && hospital.promotions.length > 0 && (
                    <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Ưu đãi:</h4>
                        <div className="space-y-1">
                            {hospital.promotions.map((promo, index) => (
                                <div key={index} className="flex items-center text-xs text-orange-700 bg-orange-50 px-2 py-1 rounded">
                                    <Zap className="w-3 h-3 mr-1" />
                                    {promo}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="border-t bg-gray-50 px-6 py-4">
                <div className="flex items-center justify-between mb-3">
                    <div className="space-y-1">
                        <div className="flex items-baseline space-x-2">
                            <span className="text-sm text-gray-600">Khám từ:</span>
                            <span className="text-xl font-bold text-blue-600">
                                {hospital.pricing.consultation.min}
                            </span>
                            <span className="text-sm text-gray-500">- {hospital.pricing.consultation.max}</span>
                        </div>
                        <div className="flex items-baseline space-x-2">
                            <span className="text-sm text-gray-600">Phòng từ:</span>
                            <span className="text-lg font-semibold text-green-600">
                                {hospital.pricing.room.standard}
                            </span>
                            <span className="text-sm text-gray-500">/ đêm</span>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <div className="flex items-center text-sm">
                            <HeartHandshake className="w-4 h-4 text-green-600 mr-1" />
                            <span className="font-medium">{hospital.satisfactionRate}%</span>
                        </div>
                    </div>
                </div>
                {showAlert && (
                    <Alert
                        message="Bạn cần đăng nhập để thực hiện chức năng này."
                        type="warning"
                    />
                )}
                <div className="flex space-x-2">
                    {showBookButton && (
                        <button
                            onClick={(e) => { e.stopPropagation(); handleBookAppointment() }}
                            className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Đặt lịch khám
                        </button>
                    )}
                    <button
                        onClick={(e) => { e.stopPropagation(); handleViewDetails() }}
                        className="px-4 py-2.5 border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center"
                    >
                        <Eye className="w-4 h-4 mr-1" />
                        Chi tiết
                    </button>
                    {showDirections && (
                        <button
                            onClick={handleGetDirections}
                            className="px-4 py-2.5 border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center"
                        >
                            <Navigation className="w-4 h-4 mr-1" />
                            Chỉ đường
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}