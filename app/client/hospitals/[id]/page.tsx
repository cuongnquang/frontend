'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
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
    ChevronLeft,
    Share2,
    Bookmark,
    Camera,
    Mail,
    Globe,
    Facebook,
    Instagram,
    Youtube,
    ExternalLink,
    Download,
    Upload,
    FileText,
    ThumbsUp,
    MessageCircle,
    CreditCard
} from 'lucide-react'

interface HospitalDetail {
    id: number
    name: string
    type: 'Công lập' | 'Tư nhân'
    level: 'Hạng I' | 'Hạng II' | 'Hạng III' | 'Đặc biệt'
    address: string
    district: string
    city: string
    coordinates: { lat: number, lng: number }
    rating: number
    reviews: number
    totalReviews: number
    phone: string
    hotline: string
    email: string
    website: string
    socialMedia: {
        facebook?: string
        instagram?: string
        youtube?: string
    }
    images: string[]
    description: string
    history: string
    mission: string
    specialties: Array<{
        id: number
        name: string
        icon: any
        doctorCount: number
        description: string
    }>
    beds: number
    doctors: number
    nurses: number
    established: number
    certifications: string[]
    facilities: Array<{
        name: string
        icon: any
        available: boolean
        description?: string
    }>
    services: {
        emergency: boolean
        icu: boolean
        surgery: boolean
        maternity: boolean
        pediatric: boolean
        cardiology: boolean
        oncology: boolean
        imaging: boolean
        pharmacy: boolean
        laboratory: boolean
    }
    workingHours: {
        weekday: string
        weekend: string
        emergency: string
    }
    pricing: {
        consultation: { min: string, max: string }
        emergency: string
        room: { standard: string, vip: string, suite: string }
        procedures: Array<{ name: string, price: string }>
    }
    insurance: string[]
    departments: Array<{
        name: string
        head: string
        doctorCount: number
        location: string
    }>
    achievements: Array<{
        year: number
        title: string
        description: string
    }>
    news: Array<{
        id: number
        title: string
        date: string
        summary: string
        image: string
    }>
    distance?: string
    averageWaitTime: string
    satisfactionRate: number
    isPartner: boolean
    promotions?: Array<{
        title: string
        description: string
        validUntil: string
    }>
}

interface Review {
    id: number
    userName: string
    rating: number
    date: string
    comment: string
    helpful: number
    department: string
    verified: boolean
}

interface Doctor {
    id: number
    name: string
    specialty: string
    title: string
    rating: number
    reviews: number
    experience: number
    price: string
    image: string
    nextAvailable: string
}

export default function HospitalDetailPage() {
    const params = useParams()
    const [activeTab, setActiveTab] = useState<'overview' | 'doctors' | 'services' | 'reviews' | 'contact'>('overview')
    const [selectedImageIndex, setSelectedImageIndex] = useState(0)
    const [showAllFacilities, setShowAllFacilities] = useState(false)
    const [showAllReviews, setShowAllReviews] = useState(false)
    const [isBookmarked, setIsBookmarked] = useState(false)
    const [showShareModal, setShowShareModal] = useState(false)
    const [showDirections, setShowDirections] = useState(false)

    // Sample hospital data
    const hospital: HospitalDetail = {
        id: 1,
        name: 'Bệnh viện Chợ Rẫy',
        type: 'Công lập',
        level: 'Hạng I',
        address: '201B Nguyễn Chí Thanh, Phường 12',
        district: 'Quận 5',
        city: 'TP.HCM',
        coordinates: { lat: 10.7558, lng: 106.6621 },
        rating: 4.6,
        reviews: 1250,
        totalReviews: 1250,
        phone: '028 3855 4269',
        hotline: '1900 2115',
        email: 'info@choray.vn',
        website: 'https://choray.vn',
        socialMedia: {
            facebook: 'BenhvienChoRay',
            instagram: 'choray_hospital',
            youtube: 'ChoRayHospital'
        },
        images: [
            '/api/placeholder/800/400',
            '/api/placeholder/800/400',
            '/api/placeholder/800/400',
            '/api/placeholder/800/400'
        ],
        description: 'Bệnh viện Chợ Rẫy là một trong những bệnh viện đa khoa hạng I lớn nhất miền Nam, với hơn 120 năm lịch sử phục vụ nhân dân. Bệnh viện được trang bị hệ thống máy móc, thiết bị y tế hiện đại cùng đội ngũ y bác sĩ giàu kinh nghiệm.',
        history: 'Bệnh viện Chợ Rẫy được thành lập vào năm 1900, ban đầu là Hôpital Indigène. Qua hơn một thế kỷ phát triển, bệnh viện đã trở thành trung tâm y tế hàng đầu của miền Nam, không ngừng đổi mới và nâng cao chất lượng dịch vụ y tế.',
        mission: 'Cung cấp dịch vụ y tế chất lượng cao, an toàn và nhân văn cho mọi tầng lớp nhân dân, đồng thời là trung tâm đào tạo y tế uy tín của khu vực.',
        specialties: [
            {
                id: 1,
                name: 'Tim mạch',
                icon: Heart,
                doctorCount: 25,
                description: 'Chuyên khoa tim mạch với đầy đủ các dịch vụ từ khám, chẩn đoán đến can thiệp và phẫu thuật tim'
            },
            {
                id: 2,
                name: 'Thần kinh',
                icon: Award,
                doctorCount: 18,
                description: 'Điều trị các bệnh lý thần kinh từ cơ bản đến phức tạp với trang thiết bị hiện đại'
            },
            {
                id: 3,
                name: 'Ung bướu',
                icon: Shield,
                doctorCount: 20,
                description: 'Trung tâm ung bướu với công nghệ xạ trị và hóa trị tiên tiến'
            },
            {
                id: 4,
                name: 'Ngoại khoa',
                icon: Stethoscope,
                doctorCount: 30,
                description: 'Các phẫu thuật từ cơ bản đến phức tạp với tỷ lệ thành công cao'
            }
        ],
        beds: 1200,
        doctors: 450,
        nurses: 800,
        established: 1900,
        certifications: ['JCI', 'ISO 9001:2015', 'Bộ Y tế', 'WHO'],
        facilities: [
            { name: 'Phòng cấp cứu 24/7', icon: Ambulance, available: true, description: 'Cấp cứu đa khoa với trang thiết bị hiện đại' },
            { name: 'Phòng mổ hiện đại', icon: Activity, available: true, description: '20 phòng mổ với hệ thống điều hòa áp suất âm' },
            { name: 'Khoa ICU', icon: HeartHandshake, available: true, description: 'Hồi sức tích cực với 50 giường' },
            { name: 'Chẩn đoán hình ảnh', icon: Eye, available: true, description: 'MRI, CT Scanner, X-Ray kỹ thuật số' },
            { name: 'WiFi miễn phí', icon: Wifi, available: true },
            { name: 'Bãi đỗ xe', icon: Car, available: true, description: '300 chỗ đỗ xe ô tô và xe máy' },
            { name: 'Cafeteria', icon: Coffee, available: true },
            { name: 'Nhà thuốc 24/7', icon: Building2, available: true }
        ],
        services: {
            emergency: true,
            icu: true,
            surgery: true,
            maternity: true,
            pediatric: true,
            cardiology: true,
            oncology: true,
            imaging: true,
            pharmacy: true,
            laboratory: true
        },
        workingHours: {
            weekday: '6:00 - 20:00',
            weekend: '6:00 - 18:00',
            emergency: '24/7'
        },
        pricing: {
            consultation: { min: '50.000đ', max: '500.000đ' },
            emergency: '200.000đ',
            room: {
                standard: '800.000đ/đêm',
                vip: '2.500.000đ/đêm',
                suite: '5.000.000đ/đêm'
            },
            procedures: [
                { name: 'Siêu âm tim', price: '350.000đ' },
                { name: 'Nội soi dạ dày', price: '800.000đ' },
                { name: 'Chụp CT', price: '1.200.000đ' },
                { name: 'Chụp MRI', price: '2.500.000đ' }
            ]
        },
        insurance: ['BHYT', 'Bảo Việt', 'Prudential', 'AIA', 'Dai-ichi', 'MB Ageas Life'],
        departments: [
            { name: 'Khoa Tim mạch', head: 'PGS.TS. Nguyễn Văn An', doctorCount: 25, location: 'Tòa A, Tầng 3' },
            { name: 'Khoa Thần kinh', head: 'GS.TS. Trần Thị Bình', doctorCount: 18, location: 'Tòa B, Tầng 2' },
            { name: 'Khoa Ung bướu', head: 'PGS.TS. Lê Minh Châu', doctorCount: 20, location: 'Tòa C, Tầng 4' },
            { name: 'Khoa Cấp cứu', head: 'BS.CKII Phạm Văn Dũng', doctorCount: 35, location: 'Tòa A, Tầng 1' }
        ],
        achievements: [
            {
                year: 2023,
                title: 'Top 10 bệnh viện tốt nhất Việt Nam',
                description: 'Được bình chọn bởi Bộ Y tế dựa trên chất lượng dịch vụ và tỷ lệ hài lòng của bệnh nhân'
            },
            {
                year: 2022,
                title: 'Chứng nhận JCI lần thứ 3',
                description: 'Duy trì chứng nhận chất lượng quốc tế JCI về an toàn bệnh nhân'
            },
            {
                year: 2021,
                title: 'Trung tâm đào tạo xuất sắc',
                description: 'Được công nhận là trung tâm đào tạo y tế hàng đầu khu vực miền Nam'
            }
        ],
        news: [
            {
                id: 1,
                title: 'Khánh thành Trung tâm Tim mạch hiện đại',
                date: '2024-09-15',
                summary: 'Trung tâm Tim mạch mới với công nghệ robot phẫu thuật Da Vinci Xi',
                image: '/api/placeholder/300/200'
            },
            {
                id: 2,
                title: 'Chương trình khám sức khỏe miễn phí',
                date: '2024-08-20',
                summary: 'Khám sức khỏe miễn phí cho 1000 người cao tuổi trong tháng 9',
                image: '/api/placeholder/300/200'
            }
        ],
        distance: '2.5km',
        averageWaitTime: '45 phút',
        satisfactionRate: 92,
        isPartner: true,
        promotions: [
            {
                title: 'Giảm 20% gói khám sức khỏe tổng quát',
                description: 'Áp dụng cho khách hàng từ 40 tuổi trở lên',
                validUntil: '2024-12-31'
            }
        ]
    }

    // Sample doctors data
    const doctors: Doctor[] = [
        {
            id: 1,
            name: 'PGS.TS. Nguyễn Văn An',
            specialty: 'Tim mạch',
            title: 'Trưởng khoa Tim mạch',
            rating: 4.8,
            reviews: 127,
            experience: 15,
            price: '500.000đ',
            image: '/api/placeholder/80/80',
            nextAvailable: 'Thứ 2, 25/09'
        },
        {
            id: 2,
            name: 'GS.TS. Trần Thị Bình',
            specialty: 'Thần kinh',
            title: 'Giáo sư, Bác sĩ',
            rating: 4.9,
            reviews: 203,
            experience: 25,
            price: '600.000đ',
            image: '/api/placeholder/80/80',
            nextAvailable: 'Thứ 3, 26/09'
        }
    ]

    // Sample reviews data
    const reviews: Review[] = [
        {
            id: 1,
            userName: 'Nguyễn Văn A',
            rating: 5,
            date: '2024-09-20',
            comment: 'Bệnh viện rất tốt, bác sĩ tận tình, nhân viên chu đáo. Cơ sở vật chất hiện đại.',
            helpful: 15,
            department: 'Tim mạch',
            verified: true
        },
        {
            id: 2,
            userName: 'Trần Thị B',
            rating: 4,
            date: '2024-09-15',
            comment: 'Khám bệnh nhanh chóng, chuyên nghiệp. Chỉ có điều thời gian chờ hơi lâu.',
            helpful: 8,
            department: 'Ngoại khoa',
            verified: true
        }
    ]

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

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            {/* Hero Section */}
            <section className="bg-white">
                <div className="container mx-auto px-4 py-8">
                    {/* Breadcrumb */}
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
                        <a href="/" className="hover:text-blue-600">Trang chủ</a>
                        <ChevronRight className="w-4 h-4" />
                        <a href="/hospitals" className="hover:text-blue-600">Bệnh viện</a>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-gray-900">{hospital.name}</span>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Main Info */}
                        <div className="lg:col-span-2">
                            {/* Image Gallery */}
                            <div className="relative mb-6">
                                <div className="aspect-video bg-gray-200 rounded-xl overflow-hidden">
                                    <img
                                        src={hospital.images[selectedImageIndex]}
                                        alt={hospital.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                {hospital.images.length > 1 && (
                                    <div className="flex space-x-2 mt-4">
                                        {hospital.images.map((image, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setSelectedImageIndex(index)}
                                                className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${selectedImageIndex === index
                                                    ? 'border-blue-500'
                                                    : 'border-transparent hover:border-gray-300'
                                                    }`}
                                            >
                                                <img
                                                    src={image}
                                                    alt={`${hospital.name} ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Hospital Info */}
                            <div>
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                            {hospital.name}
                                        </h1>
                                        <div className="flex items-center space-x-3 mb-3">
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getTypeColor(hospital.type)}`}>
                                                {hospital.type}
                                            </span>
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getLevelColor(hospital.level)}`}>
                                                {hospital.level}
                                            </span>
                                            {hospital.isPartner && (
                                                <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium border border-orange-200">
                                                    Đối tác
                                                </span>
                                            )}
                                            {hospital.services.emergency && (
                                                <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium border border-red-200">
                                                    Cấp cứu 24/7
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => setIsBookmarked(!isBookmarked)}
                                            className={`p-2 rounded-full transition-colors ${isBookmarked
                                                ? 'bg-blue-100 text-blue-600'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }`}
                                        >
                                            <Bookmark className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => setShowShareModal(true)}
                                            className="p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
                                        >
                                            <Share2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-6 mb-6">
                                    <div className="flex items-center">
                                        <Star className="w-5 h-5 text-yellow-400 fill-current mr-1" />
                                        <span className="font-semibold text-lg">{hospital.rating}</span>
                                        <span className="text-gray-600 ml-1">({hospital.reviews} đánh giá)</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <MapPin className="w-4 h-4 mr-1" />
                                        <span>{hospital.distance}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <Clock className="w-4 h-4 mr-1" />
                                        <span>Chờ TB: {hospital.averageWaitTime}</span>
                                    </div>
                                </div>

                                <div className="flex items-center text-gray-600 mb-6">
                                    <MapPin className="w-5 h-5 mr-2" />
                                    <span>{hospital.address}, {hospital.district}, {hospital.city}</span>
                                </div>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                                        <div className="text-2xl font-bold text-blue-600">{hospital.rating}</div>
                                        <div className="text-sm text-gray-600">Đánh giá</div>
                                    </div>
                                    <div className="text-center p-4 bg-green-50 rounded-lg">
                                        <div className="text-2xl font-bold text-green-600">{hospital.beds}</div>
                                        <div className="text-sm text-gray-600">Giường bệnh</div>
                                    </div>
                                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                                        <div className="text-2xl font-bold text-orange-600">{hospital.doctors}</div>
                                        <div className="text-sm text-gray-600">Bác sĩ</div>
                                    </div>
                                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                                        <div className="text-2xl font-bold text-purple-600">{hospital.satisfactionRate}%</div>
                                        <div className="text-sm text-gray-600">Hài lòng</div>
                                    </div>
                                </div>

                                <p className="text-gray-600 leading-relaxed">
                                    {hospital.description}
                                </p>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    Thông tin liên hệ
                                </h3>

                                <div className="space-y-4 mb-6">
                                    <div className="flex items-center">
                                        <Phone className="w-5 h-5 text-blue-600 mr-3" />
                                        <div>
                                            <p className="font-medium text-gray-900">Điện thoại</p>
                                            <p className="text-blue-600">{hospital.phone}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <Phone className="w-5 h-5 text-red-600 mr-3" />
                                        <div>
                                            <p className="font-medium text-gray-900">Hotline</p>
                                            <p className="text-red-600">{hospital.hotline}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <Mail className="w-5 h-5 text-green-600 mr-3" />
                                        <div>
                                            <p className="font-medium text-gray-900">Email</p>
                                            <p className="text-green-600">{hospital.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <Globe className="w-5 h-5 text-purple-600 mr-3" />
                                        <div>
                                            <p className="font-medium text-gray-900">Website</p>
                                            <a
                                                href={hospital.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-purple-600 hover:underline flex items-center"
                                            >
                                                choray.vn
                                                <ExternalLink className="w-3 h-3 ml-1" />
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                {/* Working Hours */}
                                <div className="mb-6">
                                    <h4 className="font-semibold text-gray-900 mb-3">Giờ làm việc</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Thứ 2 - Thứ 6:</span>
                                            <span className="font-medium">{hospital.workingHours.weekday}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Thứ 7 - Chủ nhật:</span>
                                            <span className="font-medium">{hospital.workingHours.weekend}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Cấp cứu:</span>
                                            <span className="font-medium text-red-600">{hospital.workingHours.emergency}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Price Range */}
                                <div className="mb-6">
                                    <h4 className="font-semibold text-gray-900 mb-3">Giá khám</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Khám bệnh:</span>
                                            <span className="font-medium text-blue-600">
                                                {hospital.pricing.consultation.min} - {hospital.pricing.consultation.max}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Cấp cứu:</span>
                                            <span className="font-medium text-red-600">{hospital.pricing.emergency}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="space-y-3">
                                    <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                                        Đặt lịch khám
                                    </button>

                                    <button
                                        onClick={() => setShowDirections(true)}
                                        className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center"
                                    >
                                        <Navigation className="w-4 h-4 mr-2" />
                                        Chỉ đường
                                    </button>

                                    <div className="grid grid-cols-2 gap-2">
                                        <button className="flex items-center justify-center py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                                            <Phone className="w-4 h-4 mr-1" />
                                            Gọi
                                        </button>
                                        <button className="flex items-center justify-center py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                                            <MessageCircle className="w-4 h-4 mr-1" />
                                            Chat
                                        </button>
                                    </div>
                                </div>

                                {/* Social Media */}
                                {hospital.socialMedia && (
                                    <div className="mt-6">
                                        <h4 className="font-semibold text-gray-900 mb-3">Theo dõi chúng tôi</h4>
                                        <div className="flex space-x-3">
                                            {hospital.socialMedia.facebook && (
                                                <a
                                                    href={`https://facebook.com/${hospital.socialMedia.facebook}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                                                >
                                                    <Facebook className="w-5 h-5" />
                                                </a>
                                            )}
                                            {hospital.socialMedia.instagram && (
                                                <a
                                                    href={`https://instagram.com/${hospital.socialMedia.instagram}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center hover:opacity-90 transition-opacity"
                                                >
                                                    <Instagram className="w-5 h-5" />
                                                </a>
                                            )}
                                            {hospital.socialMedia.youtube && (
                                                <a
                                                    href={`https://youtube.com/c/${hospital.socialMedia.youtube}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
                                                >
                                                    <Youtube className="w-5 h-5" />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tabs Navigation */}
            <section className="bg-white border-b sticky top-0 z-10">
                <div className="container mx-auto px-4">
                    <div className="flex overflow-x-auto">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`px-6 py-4 font-medium border-b-2 whitespace-nowrap transition-colors ${activeTab === 'overview'
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Tổng quan
                        </button>
                        <button
                            onClick={() => setActiveTab('doctors')}
                            className={`px-6 py-4 font-medium border-b-2 whitespace-nowrap transition-colors ${activeTab === 'doctors'
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Đội ngũ bác sĩ ({hospital.doctors})
                        </button>
                        <button
                            onClick={() => setActiveTab('services')}
                            className={`px-6 py-4 font-medium border-b-2 whitespace-nowrap transition-colors ${activeTab === 'services'
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Dịch vụ & Tiện ích
                        </button>
                        <button
                            onClick={() => setActiveTab('reviews')}
                            className={`px-6 py-4 font-medium border-b-2 whitespace-nowrap transition-colors ${activeTab === 'reviews'
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Đánh giá ({hospital.reviews})
                        </button>
                        <button
                            onClick={() => setActiveTab('contact')}
                            className={`px-6 py-4 font-medium border-b-2 whitespace-nowrap transition-colors ${activeTab === 'contact'
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Liên hệ & Bản đồ
                        </button>
                    </div>
                </div>
            </section>

            {/* Tab Content */}
            <section className="py-8">
                <div className="container mx-auto px-4">
                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                        <div className="space-y-8">
                            {/* About */}
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Giới thiệu</h2>
                                <div className="grid lg:grid-cols-2 gap-8">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Lịch sử</h3>
                                        <p className="text-gray-600 leading-relaxed mb-6">{hospital.history}</p>

                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Sứ mệnh</h3>
                                        <p className="text-gray-600 leading-relaxed">{hospital.mission}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Thông tin cơ bản</h3>
                                        <div className="space-y-3">
                                            <div className="flex justify-between py-2 border-b border-gray-100">
                                                <span className="text-gray-600">Năm thành lập:</span>
                                                <span className="font-medium">{hospital.established}</span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b border-gray-100">
                                                <span className="text-gray-600">Số giường:</span>
                                                <span className="font-medium">{hospital.beds}</span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b border-gray-100">
                                                <span className="text-gray-600">Số bác sĩ:</span>
                                                <span className="font-medium">{hospital.doctors}</span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b border-gray-100">
                                                <span className="text-gray-600">Số điều dưỡng:</span>
                                                <span className="font-medium">{hospital.nurses}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Specialties */}
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Chuyên khoa</h2>
                                <div className="grid md:grid-cols-2 gap-6">
                                    {hospital.specialties.map((specialty) => (
                                        <div key={specialty.id} className="border border-gray-200 rounded-lg p-4">
                                            <div className="flex items-start space-x-4">
                                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                                    <specialty.icon className="w-6 h-6 text-blue-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <h3 className="font-semibold text-gray-900">{specialty.name}</h3>
                                                        <span className="text-sm text-blue-600 font-medium">
                                                            {specialty.doctorCount} bác sĩ
                                                        </span>
                                                    </div>
                                                    <p className="text-gray-600 text-sm">{specialty.description}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Achievements */}
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Thành tựu nổi bật</h2>
                                <div className="space-y-4">
                                    {hospital.achievements.map((achievement, index) => (
                                        <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                                            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                <Award className="w-6 h-6 text-yellow-600" />
                                            </div>
                                            <div>
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <h3 className="font-semibold text-gray-900">{achievement.title}</h3>
                                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                                                        {achievement.year}
                                                    </span>
                                                </div>
                                                <p className="text-gray-600">{achievement.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Certifications */}
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Chứng nhận</h2>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {hospital.certifications.map((cert, index) => (
                                        <div key={index} className="text-center p-4 border border-gray-200 rounded-lg">
                                            <Shield className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                                            <p className="font-medium text-gray-900">{cert}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Doctors Tab */}
                    {activeTab === 'doctors' && (
                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Đội ngũ bác sĩ</h2>
                                <div className="flex items-center space-x-4">
                                    <select className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="">Tất cả chuyên khoa</option>
                                        {hospital.specialties.map(specialty => (
                                            <option key={specialty.id} value={specialty.name}>{specialty.name}</option>
                                        ))}
                                    </select>
                                    <select className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="rating">Sắp xếp theo đánh giá</option>
                                        <option value="experience">Sắp xếp theo kinh nghiệm</option>
                                        <option value="price">Sắp xếp theo giá</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid lg:grid-cols-2 gap-6">
                                {doctors.map((doctor) => (
                                    <div key={doctor.id} className="border border-gray-200 rounded-lg p-6">
                                        <div className="flex items-start space-x-4">
                                            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                                {doctor.name.split(' ').slice(-2).map(n => n[0]).join('')}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-900 mb-1">{doctor.name}</h3>
                                                <p className="text-blue-600 font-medium text-sm mb-1">{doctor.specialty}</p>
                                                <p className="text-gray-600 text-sm mb-2">{doctor.title}</p>

                                                <div className="flex items-center justify-between text-sm mb-3">
                                                    <div className="flex items-center">
                                                        <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                                                        <span className="font-medium">{doctor.rating}</span>
                                                        <span className="text-gray-500 ml-1">({doctor.reviews})</span>
                                                    </div>
                                                    <span className="text-gray-500">{doctor.experience} năm KN</span>
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <div className="text-lg font-bold text-blue-600">{doctor.price}</div>
                                                        <div className="text-xs text-gray-500">/ lần khám</div>
                                                    </div>
                                                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                                                        Đặt lịch
                                                    </button>
                                                </div>

                                                <div className="text-xs text-green-600 mt-2">
                                                    Sớm nhất: {doctor.nextAvailable}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="text-center mt-8">
                                <button className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                                    Xem thêm bác sĩ
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Services Tab */}
                    {activeTab === 'services' && (
                        <div className="space-y-8">
                            {/* Facilities */}
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Tiện nghi và dịch vụ</h2>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {(showAllFacilities ? hospital.facilities : hospital.facilities.slice(0, 9)).map((facility, index) => (
                                        <div
                                            key={index}
                                            className={`flex items-center p-4 rounded-lg border ${facility.available
                                                ? 'bg-green-50 border-green-200'
                                                : 'bg-gray-50 border-gray-200'
                                                }`}
                                        >
                                            <facility.icon className={`w-6 h-6 mr-3 ${facility.available ? 'text-green-600' : 'text-gray-400'
                                                }`} />
                                            <div className="flex-1">
                                                <p className={`font-medium ${facility.available ? 'text-gray-900' : 'text-gray-500'
                                                    }`}>
                                                    {facility.name}
                                                </p>
                                                {facility.description && (
                                                    <p className="text-sm text-gray-600 mt-1">{facility.description}</p>
                                                )}
                                            </div>
                                            {facility.available && (
                                                <CheckCircle className="w-5 h-5 text-green-600" />
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {hospital.facilities.length > 9 && (
                                    <div className="text-center mt-6">
                                        <button
                                            onClick={() => setShowAllFacilities(!showAllFacilities)}
                                            className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium"
                                        >
                                            {showAllFacilities ? 'Thu gọn' : `Xem thêm ${hospital.facilities.length - 9} tiện nghi khác`}
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Departments */}
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Các khoa phòng</h2>
                                <div className="grid md:grid-cols-2 gap-6">
                                    {hospital.departments.map((dept, index) => (
                                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-gray-900 mb-2">{dept.name}</h3>
                                                    <p className="text-gray-600 text-sm mb-2">Trưởng khoa: {dept.head}</p>
                                                    <p className="text-gray-600 text-sm mb-2">Vị trí: {dept.location}</p>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-lg font-bold text-blue-600">{dept.doctorCount}</div>
                                                    <div className="text-xs text-gray-500">Bác sĩ</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Pricing */}
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Bảng giá dịch vụ</h2>

                                <div className="grid md:grid-cols-2 gap-8">
                                    {/* General Pricing */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Dịch vụ cơ bản</h3>
                                        <div className="space-y-3">
                                            <div className="flex justify-between py-2 border-b border-gray-100">
                                                <span className="text-gray-600">Khám bệnh thường:</span>
                                                <span className="font-medium">{hospital.pricing.consultation.min} - {hospital.pricing.consultation.max}</span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b border-gray-100">
                                                <span className="text-gray-600">Cấp cứu:</span>
                                                <span className="font-medium">{hospital.pricing.emergency}</span>
                                            </div>
                                        </div>

                                        <h4 className="text-md font-semibold text-gray-900 mt-6 mb-3">Phòng nội trú</h4>
                                        <div className="space-y-3">
                                            <div className="flex justify-between py-2 border-b border-gray-100">
                                                <span className="text-gray-600">Phòng thường:</span>
                                                <span className="font-medium">{hospital.pricing.room.standard}</span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b border-gray-100">
                                                <span className="text-gray-600">Phòng VIP:</span>
                                                <span className="font-medium">{hospital.pricing.room.vip}</span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b border-gray-100">
                                                <span className="text-gray-600">Phòng Suite:</span>
                                                <span className="font-medium">{hospital.pricing.room.suite}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Procedures */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Thủ thuật & Xét nghiệm</h3>
                                        <div className="space-y-3">
                                            {hospital.pricing.procedures.map((procedure, index) => (
                                                <div key={index} className="flex justify-between py-2 border-b border-gray-100">
                                                    <span className="text-gray-600">{procedure.name}:</span>
                                                    <span className="font-medium">{procedure.price}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                                    <div className="flex items-start">
                                        <AlertCircle className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                                        <div className="text-sm text-blue-800">
                                            <p className="font-medium mb-1">Lưu ý:</p>
                                            <ul className="list-disc list-inside space-y-1">
                                                <li>Giá có thể thay đổi tùy theo tình trạng bệnh lý</li>
                                                <li>Bảo hiểm y tế được chấp nhận cho một số dịch vụ</li>
                                                <li>Liên hệ trực tiếp để được tư vấn chi tiết</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Insurance */}
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Bảo hiểm được chấp nhận</h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                    {hospital.insurance.map((insurance, index) => (
                                        <div key={index} className="text-center p-4 border border-gray-200 rounded-lg">
                                            <CreditCard className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                                            <p className="font-medium text-gray-900 text-sm">{insurance}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Reviews Tab */}
                    {activeTab === 'reviews' && (
                        <div className="space-y-8">
                            {/* Review Summary */}
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Đánh giá từ bệnh nhân</h2>

                                <div className="grid md:grid-cols-3 gap-8">
                                    <div className="text-center">
                                        <div className="text-4xl font-bold text-blue-600 mb-2">{hospital.rating}</div>
                                        <div className="flex items-center justify-center mb-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    className={`w-5 h-5 ${star <= hospital.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        <p className="text-gray-600">Dựa trên {hospital.reviews} đánh giá</p>
                                    </div>

                                    <div className="md:col-span-2">
                                        <div className="space-y-2">
                                            {[5, 4, 3, 2, 1].map((rating) => (
                                                <div key={rating} className="flex items-center">
                                                    <span className="w-8 text-sm text-gray-600">{rating}★</span>
                                                    <div className="flex-1 mx-4 bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className="bg-yellow-400 h-2 rounded-full"
                                                            style={{
                                                                width: `${rating === 5 ? 60 : rating === 4 ? 30 : rating === 3 ? 8 : rating === 2 ? 2 : 0}%`
                                                            }}
                                                        ></div>
                                                    </div>
                                                    <span className="w-12 text-sm text-gray-600 text-right">
                                                        {rating === 5 ? '60%' : rating === 4 ? '30%' : rating === 3 ? '8%' : rating === 2 ? '2%' : '0%'}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Individual Reviews */}
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-semibold text-gray-900">Bình luận từ bệnh nhân</h3>
                                    <select className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="newest">Mới nhất</option>
                                        <option value="highest">Đánh giá cao nhất</option>
                                        <option value="lowest">Đánh giá thấp nhất</option>
                                        <option value="helpful">Hữu ích nhất</option>
                                    </select>
                                </div>

                                <div className="space-y-6">
                                    {(showAllReviews ? reviews : reviews.slice(0, 3)).map((review) => (
                                        <div key={review.id} className="border-b border-gray-100 pb-6">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-start space-x-3">
                                                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                                                        {review.userName.split(' ').map(n => n[0]).join('')}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center space-x-2">
                                                            <h4 className="font-medium text-gray-900">{review.userName}</h4>
                                                            {review.verified && (
                                                                <CheckCircle className="w-4 h-4 text-green-500" aria-label="Đã xác thực" />
                                                            )}
                                                        </div>
                                                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                            <span>{review.department}</span>
                                                            <span>•</span>
                                                            <span>{review.date}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <Star
                                                            key={star}
                                                            className={`w-4 h-4 ${star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                                                }`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>

                                            <p className="text-gray-700 leading-relaxed mb-3">{review.comment}</p>

                                            <div className="flex items-center space-x-4">
                                                <button className="flex items-center text-sm text-gray-600 hover:text-gray-900">
                                                    <ThumbsUp className="w-4 h-4 mr-1" />
                                                    Hữu ích ({review.helpful})
                                                </button>
                                                <button className="text-sm text-gray-600 hover:text-gray-900">
                                                    Trả lời
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {reviews.length > 3 && (
                                    <div className="text-center mt-6">
                                        <button
                                            onClick={() => setShowAllReviews(!showAllReviews)}
                                            className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                                        >
                                            {showAllReviews ? 'Thu gọn' : `Xem thêm ${reviews.length - 3} đánh giá`}
                                        </button>
                                    </div>
                                )}

                                {/* Write Review */}
                                <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Viết đánh giá của bạn</h4>
                                    <p className="text-gray-600 mb-4">
                                        Chia sẻ trải nghiệm của bạn để giúp những bệnh nhân khác
                                    </p>
                                    <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                        Viết đánh giá
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Contact Tab */}
                    {activeTab === 'contact' && (
                        <div className="space-y-8">
                            {/* Contact Information */}
                            <div className="grid lg:grid-cols-2 gap-8">
                                <div className="bg-white rounded-xl p-6 shadow-sm">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Thông tin liên hệ</h2>

                                    <div className="space-y-6">
                                        <div className="flex items-start space-x-4">
                                            <MapPin className="w-6 h-6 text-blue-600 mt-1" />
                                            <div>
                                                <h3 className="font-semibold text-gray-900 mb-1">Địa chỉ</h3>
                                                <p className="text-gray-600">
                                                    {hospital.address}<br />
                                                    {hospital.district}, {hospital.city}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-4">
                                            <Phone className="w-6 h-6 text-green-600 mt-1" />
                                            <div>
                                                <h3 className="font-semibold text-gray-900 mb-1">Điện thoại</h3>
                                                <p className="text-gray-600">
                                                    Tổng đài: <a href={`tel:${hospital.phone}`} className="text-green-600 hover:underline">{hospital.phone}</a><br />
                                                    Hotline: <a href={`tel:${hospital.hotline}`} className="text-red-600 hover:underline">{hospital.hotline}</a>
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-4">
                                            <Mail className="w-6 h-6 text-purple-600 mt-1" />
                                            <div>
                                                <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                                                <p className="text-gray-600">
                                                    <a href={`mailto:${hospital.email}`} className="text-purple-600 hover:underline">
                                                        {hospital.email}
                                                    </a>
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-4">
                                            <Globe className="w-6 h-6 text-blue-600 mt-1" />
                                            <div>
                                                <h3 className="font-semibold text-gray-900 mb-1">Website</h3>
                                                <p className="text-gray-600">
                                                    <a
                                                        href={hospital.website}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:underline flex items-center"
                                                    >
                                                        {hospital.website.replace('https://', '')}
                                                        <ExternalLink className="w-4 h-4 ml-1" />
                                                    </a>
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-4">
                                            <Clock className="w-6 h-6 text-orange-600 mt-1" />
                                            <div>
                                                <h3 className="font-semibold text-gray-900 mb-1">Giờ làm việc</h3>
                                                <div className="text-gray-600 space-y-1">
                                                    <p>Thứ 2 - Thứ 6: {hospital.workingHours.weekday}</p>
                                                    <p>Thứ 7 - Chủ nhật: {hospital.workingHours.weekend}</p>
                                                    <p className="text-red-600 font-medium">Cấp cứu: {hospital.workingHours.emergency}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Transportation */}
                                    <div className="mt-8">
                                        <h3 className="font-semibold text-gray-900 mb-4">Phương tiện di chuyển</h3>
                                        <div className="space-y-3 text-sm">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <Car className="w-4 h-4 text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">Ô tô:</p>
                                                    <p className="text-gray-600">Bãi đỗ xe 300 chỗ, phí 15.000đ/giờ</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                                    <Users className="w-4 h-4 text-green-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">Xe buýt:</p>
                                                    <p className="text-gray-600">Tuyến 03, 19, 93 - Dừng trước cổng chính</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Map */}
                                <div className="bg-white rounded-xl p-6 shadow-sm">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Bản đồ</h2>

                                    {/* Map Placeholder */}
                                    <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                                        <div className="text-center">
                                            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                            <p className="text-gray-500">Bản đồ Google Maps</p>
                                            <p className="text-sm text-gray-400 mt-1">
                                                {hospital.coordinates.lat}, {hospital.coordinates.lng}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <button
                                            onClick={() => setShowDirections(true)}
                                            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                                        >
                                            <Navigation className="w-5 h-5 mr-2" />
                                            Chỉ đường
                                        </button>

                                        <div className="grid grid-cols-2 gap-3">
                                            <button className="py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                                                Lưu địa điểm
                                            </button>
                                            <button className="py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                                                Chia sẻ
                                            </button>
                                        </div>
                                    </div>

                                    {/* Distance info */}
                                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600">Khoảng cách từ vị trí của bạn:</span>
                                            <span className="font-medium text-blue-600">{hospital.distance}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm mt-2">
                                            <span className="text-gray-600">Thời gian di chuyển (ước tính):</span>
                                            <span className="font-medium text-green-600">12-15 phút</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Contact Form */}
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Gửi câu hỏi</h2>
                                <p className="text-gray-600 mb-6">
                                    Bạn có thắc mắc gì? Hãy gửi câu hỏi cho chúng tôi, chúng tôi sẽ phản hồi trong vòng 24 giờ.
                                </p>

                                <form className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Họ và tên <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Nhập họ và tên"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Số điện thoại <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Nhập số điện thoại"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Nhập email"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Chuyên khoa quan tâm
                                        </label>
                                        <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                            <option value="">Chọn chuyên khoa</option>
                                            {hospital.specialties.map(specialty => (
                                                <option key={specialty.id} value={specialty.name}>
                                                    {specialty.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Câu hỏi <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            rows={4}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Nhập câu hỏi của bạn..."
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <button
                                            type="submit"
                                            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                        >
                                            Gửi câu hỏi
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Related Hospitals */}
            <section className="py-16 bg-gray-100">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                        Bệnh viện khác trong khu vực
                    </h2>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[1, 2, 3].map((item) => (
                            <div key={item} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center space-x-4 mb-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <Building2 className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Bệnh viện {item === 1 ? 'Thống Nhất' : item === 2 ? 'Từ Dũ' : '175'}</h3>
                                        <p className="text-sm text-gray-600">Quận {item === 1 ? 'Tân Bình' : item === 2 ? '1' : 'Gò Vấp'}</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between text-sm mb-4">
                                    <div className="flex items-center">
                                        <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                                        <span>4.{item + 2}</span>
                                    </div>
                                    <span className="text-gray-500">{item + 1}.{item}km</span>
                                </div>

                                <button className="w-full py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm">
                                    Xem chi tiết
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}