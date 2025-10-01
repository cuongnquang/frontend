'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
    Star,
    MapPin,
    Heart,
    ChevronRight,
    Building2,
    Stethoscope,
    Users,
    Award,
    Eye,
    Calendar,
    Phone,
    CheckCircle,
    Clock,
    ArrowRight,
    ThumbsUp
} from 'lucide-react'
import SpecialtyCard from '@/components/specialty/SpecialtyCard'
import DoctorCard from '@/components/doctor/DoctorCard'
import HospitalCard from '@/components/hospital/HospitalCard'

export default function Features() {
    const router = useRouter()
    const [favoriteDocotors, setFavoriteDoctors] = useState<number[]>([])
    const [favoriteHospitals, setFavoriteHospitals] = useState<number[]>([])

    // Featured Doctors Data
    const featuredDoctors = [
        {
            id: 1,
            name: 'PGS.TS. Nguyễn Văn An',
            specialty: 'Tim mạch can thiệp',
            hospital: 'Bệnh viện Chợ Rẫy',
            location: 'Quận 5, TP.HCM',
            rating: 4.8,
            reviews: 127,
            experience: 15,
            price: '500.000đ',
            nextAvailable: 'Thứ 2, 25/09',
            isVerified: true,
            achievements: ['2000+ ca can thiệp', 'Giải thưởng y khoa 2023']
        },
        {
            id: 2,
            name: 'BS.CKI Trần Thị Bình',
            specialty: 'Nhi khoa',
            hospital: 'Bệnh viện Nhi Đồng 1',
            location: 'Quận 10, TP.HCM',
            rating: 4.9,
            reviews: 203,
            experience: 20,
            price: '450.000đ',
            nextAvailable: 'Thứ 3, 26/09',
            isOnline: false,
            achievements: ['Chuyên gia đầu ngành', 'Top bác sĩ nhi 2023']
        },
        {
            id: 3,
            name: 'TS.BS Lê Minh Châu',
            specialty: 'Da liễu thẩm mỹ',
            hospital: 'Bệnh viện Da liễu TP.HCM',
            location: 'Quận 1, TP.HCM',
            rating: 4.7,
            reviews: 89,
            experience: 12,
            price: '400.000đ',
            nextAvailable: 'Thứ 4, 27/09',
            isOnline: true,
            achievements: [
                { icon: ThumbsUp, text: 'Tỷ lệ hài lòng cao', count: 98 },
                { icon: Award, text: 'Chuyên gia thẩm mỹ', count: 15 }
            ]
        },
        {
            id: 4,
            name: 'PGS Phạm Văn Dũng',
            specialty: 'Thần kinh',
            hospital: 'Bệnh viện Thống Nhất',
            location: 'Quận Tân Bình, TP.HCM',
            rating: 4.6,
            reviews: 156,
            experience: 18,
            price: '600.000đ',
            nextAvailable: 'Thứ 5, 28/09',
            isOnline: false,
            achievements: ['Phó Giáo sư', 'Chuyên gia đầu ngành']
        }
    ]

    // Featured Hospitals Data
    const featuredHospitals = [
        {
            id: 1,
            name: 'Bệnh viện Chợ Rẫy',
            type: 'Công lập' as const,
            level: 'Hạng I' as const,
            address: '201B Nguyễn Chí Thanh, Phường 12',
            district: 'Quận 5',
            rating: 4.6,
            reviews: 1250,
            beds: 1200,
            doctors: 450,
            established: 1900,
            emergency: true,
            specialties: ['Tim mạch', 'Thần kinh', 'Ung bướu', 'Ngoại khoa'],
            priceRange: '50.000đ - 500.000đ',
            averageWait: '45 phút',
            satisfactionRate: 92
        },
        {
            id: 2,
            name: 'Vinmec Central Park',
            type: 'Tư nhân' as const,
            level: 'Đặc biệt' as const,
            address: '208 Nguyễn Hữu Cảnh, Phường 22',
            district: 'Quận Bình Thạnh',
            rating: 4.8,
            reviews: 756,
            beds: 500,
            doctors: 280,
            established: 2014,
            emergency: true,
            specialties: ['Tim mạch', 'Ung bướu', 'IVF', 'Check-up'],
            priceRange: '200.000đ - 1.500.000đ',
            averageWait: '20 phút',
            satisfactionRate: 96
        },
        {
            id: 3,
            name: 'Bệnh viện FV',
            type: 'Tư nhân' as const,
            level: 'Hạng I' as const,
            address: '6 Nguyễn Lương Bằng, Phường Tân Phú',
            district: 'Quận 7',
            rating: 4.7,
            reviews: 892,
            beds: 350,
            doctors: 180,
            established: 2003,
            emergency: true,
            specialties: ['Tim mạch', 'Nhi khoa', 'Sản khoa', 'Cấp cứu'],
            priceRange: '150.000đ - 800.000đ',
            averageWait: '30 phút',
            satisfactionRate: 94
        },
        {
            id: 4,
            name: 'Bệnh viện Từ Dũ',
            type: 'Công lập' as const,
            level: 'Hạng I' as const,
            address: '284 Cống Quỳnh, Phường Phạm Ngũ Lão',
            district: 'Quận 1',
            rating: 4.3,
            reviews: 1050,
            beds: 400,
            doctors: 150,
            established: 1956,
            emergency: false,
            specialties: ['Sản khoa', 'Phụ khoa', 'Sơ sinh', 'IVF'],
            priceRange: '30.000đ - 300.000đ',
            averageWait: '60 phút',
            satisfactionRate: 88
        }
    ]

    // Popular Specialties Data
    const popularSpecialties = [
        {
            id: 1,
            name: 'Tim mạch',
            icon: Heart,
            doctors: 85,
            hospitals: 12,
            description: 'Chuyên khoa điều trị các bệnh lý về tim và mạch máu',
            commonConditions: ['Tăng huyết áp', 'Bệnh mạch vành', 'Rối loạn nhịp tim'],
            averagePrice: '400.000đ',
            color: 'bg-red-50 text-red-600'
        },
        {
            id: 2,
            name: 'Nhi khoa',
            icon: Users,
            doctors: 120,
            hospitals: 8,
            description: 'Chăm sóc sức khỏe toàn diện cho trẻ em từ sơ sinh đến 16 tuổi',
            commonConditions: ['Sốt', 'Tiêu chảy', 'Viêm đường hô hấp'],
            averagePrice: '300.000đ',
            color: 'bg-blue-50 text-blue-600'
        },
        {
            id: 3,
            name: 'Da liễu',
            icon: Eye,
            doctors: 45,
            hospitals: 6,
            description: 'Điều trị các bệnh lý về da, tóc, móng và niêm mạc',
            commonConditions: ['Mụn trứng cá', 'Eczema', 'Nấm da'],
            averagePrice: '350.000đ',
            color: 'bg-green-50 text-green-600'
        },
        {
            id: 4,
            name: 'Sản phụ khoa',
            icon: Heart,
            doctors: 67,
            hospitals: 9,
            description: 'Chăm sóc sức khỏe sinh sản và phụ nữ',
            commonConditions: ['Thai sản', 'Viêm phụ khoa', 'Rối loạn kinh nguyệt'],
            averagePrice: '250.000đ',
            color: 'bg-pink-50 text-pink-600'
        },
        {
            id: 5,
            name: 'Thần kinh',
            icon: Award,
            doctors: 38,
            hospitals: 5,
            description: 'Chẩn đoán và điều trị các bệnh lý hệ thần kinh',
            commonConditions: ['Đau đầu', 'Đột quỵ', 'Parkinson'],
            averagePrice: '500.000đ',
            color: 'bg-purple-50 text-purple-600'
        },
        {
            id: 6,
            name: 'Ngoại khoa',
            icon: Stethoscope,
            doctors: 92,
            hospitals: 15,
            description: 'Phẫu thuật điều trị các bệnh lý cần can thiệp ngoại khoa',
            commonConditions: ['Sỏi thận', 'Viêm ruột thừa', 'Thoát vị'],
            averagePrice: '450.000đ',
            color: 'bg-orange-50 text-orange-600'
        }
    ]

    const toggleDoctorFavorite = (doctorId: number) => {
        setFavoriteDoctors(prev =>
            prev.includes(doctorId)
                ? prev.filter(id => id !== doctorId)
                : [...prev, doctorId]
        )
    }

    const toggleHospitalFavorite = (hospitalId: number) => {
        setFavoriteHospitals(prev =>
            prev.includes(hospitalId)
                ? prev.filter(id => id !== hospitalId)
                : [...prev, hospitalId]
        )
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

    function handleBookHospital(hospitalId: number): void {
        router.push(`/client/appointments?hospitalId=${hospitalId}`)
    }

    // Adapters to satisfy detailed card prop types
    const toDoctorCardDoctor = (d: any) => ({
        id: d.id,
        name: d.name,
        title: d.name?.startsWith('PGS') || d.name?.startsWith('TS') ? 'PGS.TS.' : 'BS.',
        specialty: d.specialty,
        hospital: d.hospital,
        location: d.location || '',
        rating: d.rating,
        reviews: d.reviews || 0,
        totalPatients: 1000,
        experience: d.experience || 10,
        price: {
            consultation: d.price || '400.000đ',
            online: '250.000đ'
        },
        image: '/api/placeholder/150/150',
        description: 'Bác sĩ giàu kinh nghiệm, tận tâm với bệnh nhân.',
        education: [],
        certifications: [],
        languages: ['Tiếng Việt'],
        availableDays: ['Thứ 2', 'Thứ 4', 'Thứ 6'],
        nextAvailable: d.nextAvailable || 'Sớm nhất',
        services: { inPerson: true, online: !!d.isOnline, homeVisit: false },
        achievements: Array.isArray(d.achievements)
            ? d.achievements.map((a: any) => ({ icon: a.icon || CheckCircle, text: a.text || a }))
            : [],
        isVerified: !!d.isVerified,
        responseTime: '30 phút',
        acceptsInsurance: true
    })

    const toHospitalCardHospital = (h: any) => ({
        id: h.id,
        name: h.name,
        type: h.type || 'Công lập',
        level: h.level || 'Hạng I',
        address: h.address,
        district: h.district,
        city: 'TP.HCM',
        rating: h.rating,
        reviews: h.reviews || 0,
        phone: '1900 1234',
        website: undefined,
        image: '/api/placeholder/400/250',
        description: 'Bệnh viện uy tín với đội ngũ bác sĩ giàu kinh nghiệm và thiết bị hiện đại.',
        specialties: h.specialties || [],
        beds: h.beds || 200,
        doctors: h.doctors || 100,
        established: h.established || 2000,
        certifications: ['ISO'],
        facilities: [],
        services: [{ emergency: !!h.emergency, icu: true, surgery: true, maternity: true, pediatric: true, cardiology: true, oncology: true, imaging: true }],
        workingHours: { weekday: '6:00 - 20:00', weekend: '6:00 - 18:00', emergency: '24/7' },
        pricing: { consultation: { min: h.priceRange?.split(' - ')[0] || '50.000đ', max: h.priceRange?.split(' - ')[1] || '500.000đ' }, emergency: '200.000đ', room: { standard: '800.000đ', vip: '2.500.000đ' } },
        insurance: ['BHYT'],
        distance: undefined,
        averageWaitTime: h.averageWait || '30 phút',
        satisfactionRate: h.satisfactionRate || 90,
        isPartner: true,
        promotions: [],
        contactInfo: { hotline: '1900 1234', email: 'contact@example.com' },
        emergency: h.emergency,
        averageWait: h.averageWait || '',
        priceRange: h.priceRange || ''
    })

    function handleViewHospital(hospitalId: number): void {
        router.push(`/client/hospitals/${hospitalId}`)
    }

    function handleGetDirections(hospitalId: number): void {
        router.push(`/client/hospitals?hospitalId=${hospitalId}&tab=directions`)
    }

    const goAllDoctors = () => router.push('/client/doctors')
    const goAllHospitals = () => router.push('/client/hospitals')
    const goAllSpecialties = () => router.push('/client/specialties')
    const handleViewSpecialty = () => router.push(`/client/specialties`)

    return (

        <>
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                Bác sĩ nổi bật
                            </h2>
                            <p className="text-gray-600">
                                Đặt lịch với các bác sĩ hàng đầu, giàu kinh nghiệm
                            </p>
                        </div>
                        <button onClick={goAllDoctors} className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                            Xem tất cả
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </button>
                    </div>

                    <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
                        {featuredDoctors.map((doctor) => (
                            <DoctorCard
                                key={doctor.id}
                                doctor={toDoctorCardDoctor(doctor)}
                                variant="featured"
                            />
                        ))}
                    </div>
                </div>
            </section>
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                Bệnh viện uy tín
                            </h2>
                            <p className="text-gray-600">
                                Các bệnh viện hàng đầu với trang thiết bị hiện đại
                            </p>
                        </div>
                        <button onClick={goAllHospitals} className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                            Xem tất cả
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {featuredHospitals.map((hospital) => (
                            <HospitalCard
                                key={hospital.id}
                                hospital={toHospitalCardHospital(hospital)}
                                variant="featured"
                                onGetDirections={handleGetDirections}
                            />
                        ))}
                    </div>
                </div>
            </section>
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                Chuyên khoa phổ biến
                            </h2>
                            <p className="text-gray-600">
                                Tìm kiếm theo chuyên khoa phù hợp với nhu cầu của bạn
                            </p>
                        </div>
                        <button onClick={goAllSpecialties} className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                            Xem tất cả
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </button>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {popularSpecialties.map((specialty) => (
                            <div key={specialty.id} onClick={() => handleViewSpecialty()}>
                                <SpecialtyCard
                                    id={specialty.id}
                                    name={specialty.name}
                                    icon={specialty.icon}
                                    doctors={specialty.doctors}
                                    hospitals={specialty.hospitals}
                                    description={specialty.description}
                                    commonConditions={specialty.commonConditions}
                                    averagePrice={specialty.averagePrice}
                                    color={specialty.color}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}