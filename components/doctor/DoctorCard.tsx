'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
    Star,
    MapPin,
    Calendar,
    Clock,
    Users,
    Award,
    Heart,
    Phone,
    Video,
    MessageCircle,
    CheckCircle,
    ThumbsUp,
    Eye,
    BookOpen,
    ChevronRight
} from 'lucide-react'
import Alert from '@/components/ui/Alert'

interface Doctor {
    id: number
    name: string
    title: string
    specialty: string
    hospital: string
    location: string
    rating: number
    reviews: number
    totalPatients: number
    experience: number
    price: {
        consultation: string
        online: string
    }
    image: string
    description: string
    education: string[]
    certifications: string[]
    languages: string[]
    availableDays: string[]
    nextAvailable: string
    services: {
        inPerson: boolean
        online: boolean
        homeVisit: boolean
    }
    achievements: {
        icon: any
        text: string
        count?: number
    }[]
    isVerified: boolean
    responseTime: string
    acceptsInsurance: boolean
}

interface DoctorCardProps {
    doctor: Doctor
    variant?: 'default' | 'compact' | 'featured' | 'list'
    showBookButton?: boolean
    onBookAppointment?: (doctorId: number) => void
    onViewProfile?: (doctorId: number) => void
}

export default function DoctorCard({
    doctor,
    variant = 'default',
    showBookButton = true,
}: DoctorCardProps) {
    const router = useRouter()
    const [showAlert, setShowAlert] = useState(false)
    const [isFavorite, setIsFavorite] = useState(false)
    const [showFullDescription, setShowFullDescription] = useState(false)
    const [favoriteDoctors, setFavoriteDoctors] = useState<number[]>([])


    const handleBookAppointment = () => {
        const isLoggedIn = true
        if (!isLoggedIn) {
            setShowAlert(true)
            return
        }
        router.push(`/client/appointments?doctorId=${doctor.id}`)
    }

    const handleViewProfile = () => {
        router.push(`/client/doctors/${doctor.id}`)

    }

    const toggleFavorite = () => {
        setIsFavorite(!isFavorite)
    }

    // Compact variant for list views
    if (variant === 'compact') {
        return (
            <div onClick={handleViewProfile} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 border border-gray-100 cursor-pointer">
                <div key={doctor.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6">
                    <div className="flex items-start space-x-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex-shrink-0"></div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-lg text-gray-900 mb-1">
                                {doctor.name}
                            </h3>
                            <p className="text-blue-600 font-medium mb-1">
                                {doctor.specialty}
                            </p>
                            <p className="text-sm text-gray-600 mb-2">
                                {doctor.hospital}
                            </p>
                            <div className="flex items-center text-sm text-gray-500 mb-3">
                                <MapPin className="w-4 h-4 mr-1" />
                                {doctor.location}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="ml-1 text-sm font-medium">{doctor.rating}</span>
                            <span className="ml-1 text-sm text-gray-500">({doctor.reviews} đánh giá)</span>
                        </div>
                        <div className="text-right">
                            <p className="text-lg font-semibold text-blue-600">{doctor.price.consultation}</p>
                            <p className="text-xs text-gray-500">/ lần khám</p>
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <p className="text-sm text-gray-600 mb-2">{doctor.experience}</p>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center text-sm text-gray-500">
                                <Calendar className="w-4 h-4 mr-1" />
                                <span>{doctor.availableDays.join(', ')}</span>
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
                                    className="w-50 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                >
                                    Đặt lịch khám
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (variant === 'list') {
        return (
            <div onClick={handleViewProfile} className="bg-white border border-gray-100 rounded-xl p-6 hover:shadow-lg transition-all group cursor-pointer">
                <div
                    key={doctor.id}
                    className="bg-white border border-gray-200 rounded-xl p-4 flex items-start justify-between"
                >
                    <div className="flex items-start space-x-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
                            {doctor.name.split(' ').slice(-2).map(n => n[0]).join('')}
                        </div>
                        <div>
                            <div className="flex items-center space-x-2">
                                <h4 className="font-semibold text-gray-900">{doctor.name}</h4>
                                {doctor.isVerified && (
                                    <span className="px-2 py-0.5 text-xs rounded-full bg-green-50 text-green-700 border border-green-200">
                                        Online
                                    </span>
                                )}
                            </div>
                            <p className="text-blue-600 text-sm">{doctor.specialty}</p>
                            <p className="text-gray-600 text-sm">{doctor.hospital} • {doctor.location}</p>
                            <div className="flex items-center space-x-4 mt-2 text-sm">
                                <span className="flex items-center text-yellow-600">
                                    <Star className="w-4 h-4 mr-1 fill-current" />
                                    {doctor.rating} ({doctor.reviews})
                                </span>
                                <span className="text-gray-500">{doctor.experience} năm KN</span>
                                <span className="text-blue-600 font-medium">{doctor.price.consultation}</span>
                            </div>
                            <div className="flex items-center text-sm text-green-600 mt-1">
                                <Calendar className="w-4 h-4 mr-1" />
                                Sớm nhất: {doctor.nextAvailable}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() =>
                                setFavoriteDoctors(prev =>
                                    prev.includes(doctor.id) ? prev.filter(id => id !== doctor.id) : [...prev, doctor.id]
                                )
                            }
                            className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                            aria-label="Yêu thích bác sĩ"
                        >
                            <Heart className={`w-5 h-5 ${favoriteDoctors.includes(doctor.id) ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
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
    // Featured variant for homepage/special sections
    if (variant === 'featured') {
        return (
            <div onClick={handleViewProfile} className="bg-white border border-gray-100 rounded-xl p-6 hover:shadow-lg transition-all group cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                    <div className="relative">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-lg">
                                {doctor.name.split(' ').slice(-2).map(n => n[0]).join('')}
                            </span>
                        </div>
                        {doctor.isVerified && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                    </div>
                    <button
                        onClick={(e) => { e.stopPropagation(); toggleFavorite() }}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <Heart className={`w-5 h-5 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
                    </button>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                    {doctor.name}
                </h3>
                <p className="text-blue-600 font-medium text-sm mb-1">
                    {doctor.specialty}
                </p>
                <p className="text-gray-600 text-sm mb-3">
                    {doctor.hospital}
                </p>
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm font-medium">{doctor.rating}</span>
                        <span className="ml-1 text-sm text-gray-500">({doctor.reviews})</span>
                    </div>
                    <span className="text-sm text-gray-500">{doctor.experience} năm KN</span>
                </div>
                <div className="mb-4">
                    <div className="text-lg font-bold text-blue-600 mb-1">
                        {doctor.price.consultation}
                    </div>
                    <div className="flex items-center text-sm text-green-600">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>Sớm nhất: {doctor.nextAvailable}</span>
                    </div>
                </div>

                <div className="space-y-1 mb-4">
                    {doctor.achievements.slice(0, 2).map((achievement, idx) => (
                        <div key={idx} className="flex items-center text-xs text-gray-600">
                            <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                            <span>{achievement.text}</span>
                        </div>
                    ))}
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
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        Đặt lịch khám
                    </button>
                )}
            </div>
        );
    }

    // Default variant - detailed card
    return (
        <div onClick={handleViewProfile} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 overflow-hidden cursor-pointer">
            {/* Header */}
            <div className="p-6 pb-4">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                        {/* Doctor Image */}
                        <div className="relative flex-shrink-0">
                            <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-2xl">
                                    {doctor.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                </span>
                            </div>
                            {doctor.isVerified && (
                                <div className="absolute -top-1 -right-1 w-7 h-7 bg-green-500 rounded-full flex items-center justify-center">
                                    <CheckCircle className="w-4 h-4 text-white" />
                                </div>
                            )}
                            {doctor.acceptsInsurance && (
                                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                                    BHYT
                                </div>
                            )}
                        </div>

                        {/* Doctor Info */}
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                                {doctor.title} {doctor.name}
                            </h3>
                            <p className="text-blue-600 font-semibold mb-1">
                                {doctor.specialty}
                            </p>
                            <div className="flex items-center text-gray-600 text-sm mb-2">
                                <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                                <span>{doctor.hospital}, {doctor.location}</span>
                            </div>

                            {/* Rating and stats */}
                            <div className="flex items-center space-x-4 mb-3">
                                <div className="flex items-center">
                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                    <span className="ml-1 font-semibold">{doctor.rating}</span>
                                    <span className="ml-1 text-gray-500 text-sm">({doctor.reviews} đánh giá)</span>
                                </div>
                                <span className="text-gray-300">•</span>
                                <div className="flex items-center text-sm text-gray-600">
                                    <Users className="w-4 h-4 mr-1" />
                                    <span>{doctor.totalPatients}+ bệnh nhân</span>
                                </div>
                                <span className="text-gray-300">•</span>
                                <div className="flex items-center text-sm text-gray-600">
                                    <Award className="w-4 h-4 mr-1" />
                                    <span>{doctor.experience} năm KN</span>
                                </div>
                            </div>

                            {/* Services */}
                            <div className="flex items-center space-x-3">
                                {doctor.services.inPerson && (
                                    <div className="flex items-center text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                                        <Users className="w-3 h-3 mr-1" />
                                        <span>Khám tại viện</span>
                                    </div>
                                )}
                                {doctor.services.online && (
                                    <div className="flex items-center text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full">
                                        <Video className="w-3 h-3 mr-1" />
                                        <span>Tư vấn online</span>
                                    </div>
                                )}
                                {doctor.services.homeVisit && (
                                    <div className="flex items-center text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded-full">
                                        <MapPin className="w-3 h-3 mr-1" />
                                        <span>Khám tại nhà</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Favorite button */}
                    <button
                        onClick={(e) => { e.stopPropagation(); toggleFavorite() }}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <Heart className={`w-5 h-5 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
                    </button>
                </div>

                {/* Description */}
                <div className="mb-4">
                    <p className="text-gray-600 text-sm leading-relaxed">
                        {showFullDescription ? doctor.description : `${doctor.description.slice(0, 120)}...`}
                        <button
                            onClick={() => setShowFullDescription(!showFullDescription)}
                            className="text-blue-600 hover:text-blue-700 ml-1"
                        >
                            {showFullDescription ? 'Thu gọn' : 'Xem thêm'}
                        </button>
                    </p>
                </div>

                {/* Education & Certifications */}
                <div className="space-y-2 mb-4">
                    <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-1">Học vấn:</h4>
                        <div className="flex flex-wrap gap-1">
                            {doctor.education.slice(0, 2).map((edu, index) => (
                                <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                    {edu}
                                </span>
                            ))}
                            {doctor.education.length > 2 && (
                                <span className="text-xs text-blue-600">+{doctor.education.length - 2} khác</span>
                            )}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-1">Chứng chỉ:</h4>
                        <div className="flex flex-wrap gap-1">
                            {doctor.certifications.slice(0, 3).map((cert, index) => (
                                <span key={index} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                                    {cert}
                                </span>
                            ))}
                            {doctor.certifications.length > 3 && (
                                <span className="text-xs text-blue-600">+{doctor.certifications.length - 3} khác</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Languages */}
                <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">Ngôn ngữ:</h4>
                    <div className="flex flex-wrap gap-1">
                        {doctor.languages.map((lang, index) => (
                            <span key={index} className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
                                {lang}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Availability */}
                <div className="mb-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="text-sm font-semibold text-gray-900">Lịch khám:</h4>
                            <p className="text-xs text-gray-600">{doctor.availableDays.join(', ')}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-medium text-green-600">
                                Sớm nhất: {doctor.nextAvailable}
                            </p>
                            <p className="text-xs text-gray-500">
                                Phản hồi trong {doctor.responseTime}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Achievements */}
                <div className="mb-4">
                    <div className="grid grid-cols-2 gap-2">
                        {doctor.achievements.slice(0, 4).map((achievement, index) => (
                            <div key={index} className="flex items-center text-xs text-gray-600">
                                <achievement.icon className="w-3 h-3 mr-1 text-blue-600" />
                                <span>{achievement.text}</span>
                                {achievement.count && (
                                    <span className="ml-1 font-semibold">({achievement.count})</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="border-t bg-gray-50 px-6 py-4">
                <div className="flex items-center justify-between mb-3">
                    <div className="space-y-1">
                        <div className="flex items-baseline space-x-2">
                            <span className="text-2xl font-bold text-blue-600">
                                {doctor.price.consultation}
                            </span>
                            <span className="text-sm text-gray-500">/ lần khám</span>
                        </div>
                        {doctor.services.online && (
                            <div className="flex items-baseline space-x-2">
                                <span className="text-lg font-semibold text-green-600">
                                    {doctor.price.online}
                                </span>
                                <span className="text-sm text-gray-500">/ tư vấn online</span>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center space-x-2">
                        {doctor.services.online && (
                            <button className="p-2 border border-green-200 text-green-600 rounded-lg hover:bg-green-50 transition-colors">
                                <Video className="w-4 h-4" />
                            </button>
                        )}
                        <button className="p-2 border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                            <MessageCircle className="w-4 h-4" />
                        </button>
                        <button className="p-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
                            <Phone className="w-4 h-4" />
                        </button>
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
                            className="flex-1 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Đặt lịch khám
                        </button>
                    )}
                    <button
                        onClick={(e) => { e.stopPropagation(); handleViewProfile() }}
                        className="px-4 py-2 border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center"
                    >
                        <Eye className="w-4 h-4 mr-1" />
                        Xem hồ sơ
                    </button>
                </div>
            </div>
        </div>
    )
}