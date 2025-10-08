'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import {
    Search,
    Star,
    MapPin,
    Users,
    Building2,
    Filter,
    ChevronDown,
    ChevronUp,
    Heart,
    Calendar,
    Award,
    Stethoscope,
    Eye,
    Phone,
    Clock,
    CheckCircle,
    ArrowRight,
    BookOpen
} from 'lucide-react'
import DoctorCard from '@/components/doctor/DoctorCard'

interface Specialty {
    id: number
    name: string
    icon: any
    description: string
    commonConditions: string[]
    doctorCount: number
    hospitalCount: number
    averagePrice: string
    color: string
    category: 'internal' | 'surgical' | 'diagnostic' | 'emergency'
}

interface Doctor {
    id: number
    name: string
    title: string
    specialty: string
    specialtyId: number
    hospital: string
    location: string
    rating: number
    reviews: number
    experience: number
    price: string
    nextAvailable: string
    isOnline: boolean
    achievements: string[]
}


export default function SpecialtiesPage() {
    const searchParams = useSearchParams()
    const specialtyIdParam = searchParams.get('specialtyId')
    const tabParam = searchParams.get('tab')

    useEffect(() => {
        if (specialtyIdParam) setSelectedSpecialty(Number(specialtyIdParam))
        if (tabParam === 'doctors' || tabParam === 'hospitals' || tabParam === 'overview') setActiveTab(tabParam)
    }, [specialtyIdParam, tabParam])

    const [selectedSpecialty, setSelectedSpecialty] = useState<number | null>(null)
    const [activeTab, setActiveTab] = useState<'overview' | 'doctors' | 'hospitals'>('overview')
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedLocation, setSelectedLocation] = useState('all')
    const [priceFilter, setPriceFilter] = useState('all')
    const [sortBy, setSortBy] = useState('rating')
    const [showFilters, setShowFilters] = useState(false)
    const [favoriteDoctors, setFavoriteDoctors] = useState<number[]>([])
    

    // Specialties data
    const specialties: Specialty[] = [
        {
            id: 1,
            name: 'Tim mạch',
            icon: Heart,
            description: 'Chuyên khoa điều trị các bệnh lý về tim và mạch máu, bao gồm bệnh mạch vành, tăng huyết áp, rối loạn nhịp tim và các bệnh lý tim bẩm sinh.',
            commonConditions: ['Tăng huyết áp', 'Bệnh mạch vành', 'Rối loạn nhịp tim', 'Suy tim', 'Bệnh van tim'],
            doctorCount: 85,
            hospitalCount: 12,
            averagePrice: '400.000đ',
            color: 'bg-red-50 text-red-600 border-red-200',
            category: 'internal'
        },
        {
            id: 2,
            name: 'Nhi khoa',
            icon: Users,
            description: 'Chăm sóc sức khỏe toàn diện cho trẻ em từ sơ sinh đến 16 tuổi, bao gồm khám định kỳ, tiêm chủng và điều trị các bệnh lý nhi khoa.',
            commonConditions: ['Sốt', 'Tiêu chảy', 'Viêm đường hô hấp', 'Dị ứng', 'Rối loạn phát triển'],
            doctorCount: 120,
            hospitalCount: 8,
            averagePrice: '300.000đ',
            color: 'bg-blue-50 text-blue-600 border-blue-200',
            category: 'internal'
        },
        {
            id: 3,
            name: 'Da liễu',
            icon: Eye,
            description: 'Điều trị các bệnh lý về da, tóc, móng và niêm mạc, từ các vấn đề thẩm mỹ đến các bệnh da nghiêm trọng.',
            commonConditions: ['Mụn trứng cá', 'Eczema', 'Nấm da', 'Viêm da', 'Psoriasis'],
            doctorCount: 45,
            hospitalCount: 6,
            averagePrice: '350.000đ',
            color: 'bg-green-50 text-green-600 border-green-200',
            category: 'diagnostic'
        },
        {
            id: 4,
            name: 'Thần kinh',
            icon: Award,
            description: 'Chẩn đoán và điều trị các bệnh lý hệ thần kinh trung ương và ngoại biên, bao gồm đột quỵ, Parkinson và các rối loạn thần kinh.',
            commonConditions: ['Đau đầu', 'Đột quỵ', 'Parkinson', 'Động kinh', 'Mất trí nhớ'],
            doctorCount: 38,
            hospitalCount: 5,
            averagePrice: '500.000đ',
            color: 'bg-purple-50 text-purple-600 border-purple-200',
            category: 'internal'
        },
        {
            id: 5,
            name: 'Sản phụ khoa',
            icon: Heart,
            description: 'Chăm sóc sức khỏe sinh sản và phụ nữ, từ thai sản, sinh đẻ đến các vấn đề phụ khoa.',
            commonConditions: ['Thai sản', 'Viêm phụ khoa', 'Rối loạn kinh nguyệt', 'Vô sinh', 'U xơ tử cung'],
            doctorCount: 67,
            hospitalCount: 9,
            averagePrice: '250.000đ',
            color: 'bg-pink-50 text-pink-600 border-pink-200',
            category: 'internal'
        },
        {
            id: 6,
            name: 'Ngoại khoa',
            icon: Stethoscope,
            description: 'Phẫu thuật điều trị các bệnh lý cần can thiệp ngoại khoa, từ phẫu thuật nhỏ đến các ca phức tạp.',
            commonConditions: ['Sỏi thận', 'Viêm ruột thừa', 'Thoát vị', 'U nang', 'Chấn thương'],
            doctorCount: 92,
            hospitalCount: 15,
            averagePrice: '450.000đ',
            color: 'bg-orange-50 text-orange-600 border-orange-200',
            category: 'surgical'
        },
        {
            id: 7,
            name: 'Tai Mũi Họng',
            icon: Eye,
            description: 'Điều trị các bệnh lý về tai, mũi, họng và các cấu trúc liên quan ở vùng đầu cổ.',
            commonConditions: ['Viêm xoang', 'Viêm họng', 'Ù tai', 'Polyp mũi', 'Viêm amidan'],
            doctorCount: 34,
            hospitalCount: 7,
            averagePrice: '280.000đ',
            color: 'bg-indigo-50 text-indigo-600 border-indigo-200',
            category: 'internal'
        },
        {
            id: 8,
            name: 'Mắt',
            icon: Eye,
            description: 'Chẩn đoán và điều trị các bệnh lý về mắt, từ khúc xạ đơn giản đến phẫu thuật mắt phức tạp.',
            commonConditions: ['Cận thị', 'Viêm kết mạc', 'Đục thủy tinh thể', 'Tăng nhãn áp', 'Võng mạc'],
            doctorCount: 41,
            hospitalCount: 8,
            averagePrice: '320.000đ',
            color: 'bg-teal-50 text-teal-600 border-teal-200',
            category: 'diagnostic'
        }
    ]

    // Sample doctors data
    const doctors: Doctor[] = [
        {
            id: 1,
            name: 'PGS.TS. Nguyễn Văn An',
            title: 'Phó Giáo sư, Tiến sĩ',
            specialty: 'Tim mạch can thiệp',
            specialtyId: 1,
            hospital: 'Bệnh viện Chợ Rẫy',
            location: 'Quận 5, TP.HCM',
            rating: 4.8,
            reviews: 127,
            experience: 15,
            price: '500.000đ',
            nextAvailable: 'Thứ 2, 25/09',
            isOnline: true,
            achievements: ['2000+ ca can thiệp', 'Giải thưởng y khoa 2023']
        },
        {
            id: 2,
            name: 'BS.CKI Trần Thị Bình',
            title: 'Bác sĩ Chuyên khoa I',
            specialty: 'Nhi khoa tổng quát',
            specialtyId: 2,
            hospital: 'Bệnh viện Nhi Đồng 1',
            location: 'Quận 10, TP.HCM',
            rating: 4.9,
            reviews: 203,
            experience: 20,
            price: '300.000đ',
            nextAvailable: 'Thứ 3, 26/09',
            isOnline: false,
            achievements: ['Chuyên gia đầu ngành', 'Top bác sĩ nhi 2023']
        },
        {
            id: 3,
            name: 'TS.BS Lê Minh Châu',
            title: 'Tiến sĩ, Bác sĩ',
            specialty: 'Da liễu thẩm mỹ',
            specialtyId: 3,
            hospital: 'Bệnh viện Da liễu TP.HCM',
            location: 'Quận 1, TP.HCM',
            rating: 4.7,
            reviews: 89,
            experience: 12,
            price: '400.000đ',
            nextAvailable: 'Thứ 4, 27/09',
            isOnline: true,
            achievements: ['Chứng chỉ quốc tế', '5000+ ca điều trị']
        }
    ]



    const locations = ['Quận 1', 'Quận 3', 'Quận 5', 'Quận 7', 'Quận 10', 'Quận Bình Thạnh', 'Quận Tân Bình']
    const priceRanges = ['Dưới 200k', '200k - 400k', '400k - 600k', 'Trên 600k']

    const selectedSpecialtyData = specialties.find(s => s.id === selectedSpecialty)
    const filteredDoctors = doctors.filter(doctor =>
        (!selectedSpecialty || doctor.specialtyId === selectedSpecialty) &&
        (searchQuery === '' || doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()))
    )

    const toggleDoctorFavorite = (doctorId: number) => {
        setFavoriteDoctors(prev =>
            prev.includes(doctorId) ? prev.filter(id => id !== doctorId) : [...prev, doctorId]
        )
    }

    const getTypeColor = (type: string) => {
        return type === 'Công lập'
            ? 'bg-green-100 text-green-800 border-green-200'
            : 'bg-blue-100 text-blue-800 border-blue-200'
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            {/* Page Header */}
            <section className="bg-white border-b py-8">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Chuyên khoa y tế
                    </h1>
                    <p className="text-gray-600">
                        Tìm kiếm bác sĩ và bệnh viện theo chuyên khoa phù hợp với nhu cầu của bạn
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar - Specialty List */}
                    <div className="lg:w-1/3">
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">
                                Danh sách chuyên khoa
                            </h2>

                            {/* Search specialties */}
                            <div className="mb-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Tìm chuyên khoa..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <button
                                    onClick={() => {
                                        setSelectedSpecialty(null)
                                        setActiveTab('overview')
                                    }}
                                    className={`w-full text-left p-3 rounded-lg transition-colors ${selectedSpecialty === null
                                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                        : 'hover:bg-gray-50 text-gray-700'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium">Tất cả chuyên khoa</span>
                                        <span className="text-sm text-gray-500">
                                            {specialties.reduce((sum, s) => sum + s.doctorCount, 0)} bác sĩ
                                        </span>
                                    </div>
                                </button>

                                {specialties.map((specialty) => (
                                    <button
                                        key={specialty.id}
                                        onClick={() => {
                                            setSelectedSpecialty(specialty.id)
                                            setActiveTab('overview')
                                        }}
                                        className={`w-full text-left p-3 rounded-lg transition-colors ${selectedSpecialty === specialty.id
                                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                            : 'hover:bg-gray-50 text-gray-700'
                                            }`}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className={`w-10 h-10 ${specialty.color} rounded-lg flex items-center justify-center`}>
                                                <specialty.icon className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <span className="font-medium">{specialty.name}</span>
                                                    <span className="text-sm text-gray-500">{specialty.doctorCount}</span>
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    {specialty.hospitalCount} bệnh viện • {specialty.averagePrice}
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
                            <h3 className="font-semibold text-gray-900 mb-4">Thống kê tổng quan</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Tổng số bác sĩ:</span>
                                    <span className="font-semibold text-blue-600">
                                        {specialties.reduce((sum, s) => sum + s.doctorCount, 0)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Tổng số bệnh viện:</span>
                                    <span className="font-semibold text-green-600">
                                        {specialties.reduce((sum, s) => sum + s.hospitalCount, 0)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Giá trung bình:</span>
                                    <span className="font-semibold text-orange-600">300k - 500k</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:w-2/3">
                        {/* Overview Tab - All Specialties Grid */}
                        {selectedSpecialty === null && (
                            <div>
                                <div className="mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                        Tất cả chuyên khoa
                                    </h2>
                                    <p className="text-gray-600">
                                        Khám phá các chuyên khoa y tế với đội ngũ bác sĩ chuyên nghiệp
                                    </p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    {specialties.map((specialty) => (
                                        <div
                                            key={specialty.id}
                                            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-100"
                                            onClick={() => setSelectedSpecialty(specialty.id)}
                                        >
                                            <div className="flex items-start space-x-4">
                                                <div className={`w-12 h-12 ${specialty.color} rounded-lg flex items-center justify-center`}>
                                                    <specialty.icon className="w-6 h-6" />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-gray-900 mb-1">
                                                        {specialty.name}
                                                    </h3>
                                                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                                        {specialty.description}
                                                    </p>

                                                    <div className="flex items-center justify-between text-sm mb-3">
                                                        <div className="flex items-center space-x-4">
                                                            <span className="text-blue-600 font-medium">
                                                                {specialty.doctorCount} bác sĩ
                                                            </span>
                                                            <span className="text-green-600 font-medium">
                                                                {specialty.hospitalCount} bệnh viện
                                                            </span>
                                                        </div>
                                                        <span className="text-orange-600 font-medium">
                                                            {specialty.averagePrice}
                                                        </span>
                                                    </div>

                                                    <div className="mb-3">
                                                        <p className="text-xs font-medium text-gray-900 mb-1">
                                                            Bệnh thường gặp:
                                                        </p>
                                                        <div className="flex flex-wrap gap-1">
                                                            {specialty.commonConditions.slice(0, 3).map((condition, idx) => (
                                                                <span key={idx} className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                                                                    {condition}
                                                                </span>
                                                            ))}
                                                            {specialty.commonConditions.length > 3 && (
                                                                <span className="px-2 py-0.5 text-blue-600 text-xs font-medium">
                                                                    +{specialty.commonConditions.length - 3} khác
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-between">
                                                        <span className="text-blue-600 font-medium text-sm">
                                                            Xem chi tiết
                                                        </span>
                                                        <ArrowRight className="w-4 h-4 text-blue-600" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Selected Specialty Detail */}
                        {selectedSpecialty && selectedSpecialtyData && (
                            <div>
                                {/* Specialty Header */}
                                <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
                                    <div className="flex items-start space-x-4">
                                        <div className={`w-16 h-16 ${selectedSpecialtyData.color} rounded-xl flex items-center justify-center`}>
                                            <selectedSpecialtyData.icon className="w-8 h-8" />
                                        </div>
                                        <div className="flex-1">
                                            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                                Chuyên khoa {selectedSpecialtyData.name}
                                            </h1>
                                            <p className="text-gray-600 mb-4">
                                                {selectedSpecialtyData.description}
                                            </p>

                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                                <div className="text-center p-3 bg-blue-50 rounded-lg">
                                                    <div className="text-2xl font-bold text-blue-600">
                                                        {selectedSpecialtyData.doctorCount}
                                                    </div>
                                                    <div className="text-sm text-gray-600">Bác sĩ</div>
                                                </div>
                                                <div className="text-center p-3 bg-green-50 rounded-lg">
                                                    <div className="text-2xl font-bold text-green-600">
                                                        {selectedSpecialtyData.hospitalCount}
                                                    </div>
                                                    <div className="text-sm text-gray-600">Bệnh viện</div>
                                                </div>
                                                <div className="text-center p-3 bg-orange-50 rounded-lg">
                                                    <div className="text-2xl font-bold text-orange-600">
                                                        {selectedSpecialtyData.averagePrice}
                                                    </div>
                                                    <div className="text-sm text-gray-600">Giá TB</div>
                                                </div>
                                                <div className="text-center p-3 bg-purple-50 rounded-lg">
                                                    <div className="text-2xl font-bold text-purple-600">4.7</div>
                                                    <div className="text-sm text-gray-600">Đánh giá</div>
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="font-medium text-gray-900 mb-2">
                                                    Bệnh thường gặp:
                                                </h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedSpecialtyData.commonConditions.map((condition, idx) => (
                                                        <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                                            {condition}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Tabs */}
                                <div className="bg-white rounded-xl shadow-sm mb-6">
                                    <div className="border-b">
                                        <div className="flex">
                                            <button
                                                onClick={() => setActiveTab('overview')}
                                                className={`px-6 py-4 font-medium border-b-2 transition-colors ${activeTab === 'overview'
                                                    ? 'border-blue-600 text-blue-600'
                                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                                    }`}
                                            >
                                                Tổng quan
                                            </button>
                                            <button
                                                onClick={() => setActiveTab('doctors')}
                                                className={`px-6 py-4 font-medium border-b-2 transition-colors ${activeTab === 'doctors'
                                                    ? 'border-blue-600 text-blue-600'
                                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                                    }`}
                                            >
                                                Bác sĩ ({filteredDoctors.length})
                                            </button>
                                            
                                        </div>
                                    </div>

                                    {/* Tab Content */}
                                    <div className="p-6">
                                        {/* Overview Tab */}
                                        {activeTab === 'overview' && (
                                            <div className="space-y-6">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                                        Giới thiệu chuyên khoa
                                                    </h3>
                                                    <p className="text-gray-600 leading-relaxed">
                                                        {selectedSpecialtyData.description} Đây là một trong những chuyên khoa
                                                        quan trọng nhất trong hệ thống y tế, đòi hỏi sự chuyên môn cao và
                                                        trang thiết bị hiện đại để đảm bảo chất lượng điều trị tốt nhất.
                                                    </p>
                                                </div>

                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                                        Khi nào cần khám chuyên khoa {selectedSpecialtyData.name}?
                                                    </h3>
                                                    <div className="grid md:grid-cols-2 gap-4">
                                                        {selectedSpecialtyData.commonConditions.map((condition, idx) => (
                                                            <div key={idx} className="flex items-center p-3 bg-gray-50 rounded-lg">
                                                                <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
                                                                <span className="text-gray-700">{condition}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                                        Thông tin hữu ích
                                                    </h3>
                                                    <div className="grid md:grid-cols-2 gap-6">
                                                        <div className="p-4 border border-gray-200 rounded-lg">
                                                            <h4 className="font-medium text-gray-900 mb-2">
                                                                Chi phí khám
                                                            </h4>
                                                            <p className="text-gray-600 text-sm mb-2">
                                                                Giá khám trung bình: <span className="font-semibold text-orange-600">
                                                                    {selectedSpecialtyData.averagePrice}
                                                                </span>
                                                            </p>
                                                            <p className="text-gray-600 text-sm">
                                                                Chi phí có thể thay đổi tùy bác sĩ/bệnh viện và gói dịch vụ.
                                                            </p>
                                                        </div>

                                                        <div className="p-4 border border-gray-200 rounded-lg">
                                                            <h4 className="font-medium text-gray-900 mb-2">
                                                                Chuẩn bị trước khi khám
                                                            </h4>
                                                            <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                                                                <li>Mang theo CMND/CCCD và thẻ bảo hiểm (nếu có)</li>
                                                                <li>Chuẩn bị hồ sơ/bệnh án và các xét nghiệm gần đây</li>
                                                                <li>Đến sớm 10-15 phút để làm thủ tục</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Doctors Tab */}
                                        {activeTab === 'doctors' && (
                                            <div className="space-y-4">
                                                {filteredDoctors.map((doctor) => (
                                                    <DoctorCard key={doctor.id} variant='list' doctor={doctor} />
                                                ))}
                                                {filteredDoctors.length === 0 && (
                                                    <div className="text-center text-gray-500 text-sm py-8">
                                                        Không có bác sĩ phù hợp
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}