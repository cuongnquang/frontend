'use client'

import { useState } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import {
    Search,
    Star,
    MapPin,
    Phone,
    Clock,
    Users,
    Award,
    Bed,
    Stethoscope,
    Filter,
    ChevronRight,
    Heart,
    Shield,
    Calendar
} from 'lucide-react'
import HospitalCard from '@/components/hospital/HospitalCard'

interface Hospital {
    id: number
    name: string
    type: string
    address: string
    district: string
    city: string
    rating: number
    reviews: number
    phone: string
    image: string
    description: string
    specialties: string[]
    beds: number
    doctors: number
    established: number
    certifications: string[]
    facilities: string[]
    workingHours: {
        weekday: string
        weekend: string
    }
    emergencyAvailable: boolean
}

export default function HospitalsPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedDistrict, setSelectedDistrict] = useState('all')
    const [selectedType, setSelectedType] = useState('all')
    const [selectedSpecialty, setSelectedSpecialty] = useState('all')

    const hospitals: Hospital[] = [
        {
            id: 1,
            name: 'Bệnh viện Chợ Rẫy',
            type: 'Công lập',
            address: '201B Nguyễn Chí Thanh, Phường 12',
            district: 'Quận 5',
            city: 'TP.HCM',
            rating: 4.6,
            reviews: 1250,
            phone: '028 3855 4269',
            image: '/api/placeholder/400/250',
            description: 'Bệnh viện đa khoa hạng I, là trung tâm y tế lớn nhất miền Nam với đội ngũ bác sĩ giàu kinh nghiệm và trang thiết bị hiện đại.',
            specialties: ['Tim mạch', 'Thần kinh', 'Ung bướu', 'Ngoại khoa', 'Nội khoa'],
            beds: 1200,
            doctors: 450,
            established: 1900,
            certifications: ['JCI', 'ISO 9001:2015', 'Bộ Y tế'],
            facilities: ['Phòng cấp cứu 24/7', 'Phòng mổ hiện đại', 'Khoa ICU', 'Chẩn đoán hình ảnh'],
            workingHours: {
                weekday: '6:00 - 20:00',
                weekend: '6:00 - 18:00'
            },
            emergencyAvailable: true
        },
        {
            id: 2,
            name: 'Bệnh viện Đại học Y Dược TP.HCM',
            type: 'Công lập',
            address: '215 Hồng Bàng, Phường 11',
            district: 'Quận 5',
            city: 'TP.HCM',
            rating: 4.5,
            reviews: 980,
            phone: '028 3855 2225',
            image: '/api/placeholder/400/250',
            description: 'Bệnh viện đa khoa tuyến cuối, là trung tâm đào tạo và nghiên cứu y khoa hàng đầu.',
            specialties: ['Nhi khoa', 'Sản phụ khoa', 'Da liễu', 'Mắt', 'Tai mũi họng'],
            beds: 800,
            doctors: 320,
            established: 1947,
            certifications: ['ISO 15189', 'Bộ Y tế', 'Đại học Y Dược'],
            facilities: ['Khoa cấp cứu', 'Phòng thí nghiệm', 'Trung tâm tim mạch', 'Khoa hồi sức'],
            workingHours: {
                weekday: '6:30 - 17:30',
                weekend: '7:00 - 16:00'
            },
            emergencyAvailable: true
        },
        {
            id: 3,
            name: 'Vinmec Central Park',
            type: 'Tư nhân',
            address: '208 Nguyễn Hữu Cảnh, Phường 22',
            district: 'Quận Bình Thạnh',
            city: 'TP.HCM',
            rating: 4.8,
            reviews: 756,
            phone: '028 3622 1166',
            image: '/api/placeholder/400/250',
            description: 'Bệnh viện đa khoa quốc tế với tiêu chuẩn chăm sóc y tế cao cấp và dịch vụ 5 sao.',
            specialties: ['Tim mạch', 'Ung bướu', 'Thẩm mỹ', 'Check-up tổng quát', 'IVF'],
            beds: 500,
            doctors: 280,
            established: 2014,
            certifications: ['JCI', 'ISO 15189', 'CAP'],
            facilities: ['Trung tâm tim mạch', 'Trung tâm ung bướu', 'Spa y tế', 'Phòng VIP'],
            workingHours: {
                weekday: '7:00 - 19:00',
                weekend: '7:00 - 17:00'
            },
            emergencyAvailable: true
        },
        {
            id: 4,
            name: 'Bệnh viện FV',
            type: 'Tư nhân',
            address: '6 Nguyễn Lương Bằng, Phường Tân Phú',
            district: 'Quận 7',
            city: 'TP.HCM',
            rating: 4.7,
            reviews: 892,
            phone: '028 5411 3333',
            image: '/api/placeholder/400/250',
            description: 'Bệnh viện quốc tế Franco-Việt Nam với đội ngũ bác sĩ người Pháp và Việt Nam, tiêu chuẩn châu Âu.',
            specialties: ['Tim mạch', 'Nhi khoa', 'Sản phụ khoa', 'Ngoại khoa', 'Cấp cứu'],
            beds: 350,
            doctors: 180,
            established: 2003,
            certifications: ['JCI', 'HAS', 'ISO 9001'],
            facilities: ['ICU hiện đại', 'Phòng mổ robot', 'Trung tâm tim mạch', 'Nhi khoa quốc tế'],
            workingHours: {
                weekday: '7:00 - 18:00',
                weekend: '8:00 - 17:00'
            },
            emergencyAvailable: true
        },
        {
            id: 5,
            name: 'Bệnh viện Nhi Đồng 1',
            type: 'Công lập',
            address: '341 Sư Vạn Hạnh, Phường 12',
            district: 'Quận 10',
            city: 'TP.HCM',
            rating: 4.4,
            reviews: 1180,
            phone: '028 3865 4270',
            image: '/api/placeholder/400/250',
            description: 'Bệnh viện nhi khoa lớn nhất miền Nam, chuyên điều trị các bệnh lý nhi khoa phức tạp.',
            specialties: ['Nhi khoa', 'Nhi tim mạch', 'Nhi thần kinh', 'Nhi ngoại khoa', 'Sơ sinh'],
            beds: 650,
            doctors: 220,
            established: 1962,
            certifications: ['Bộ Y tế', 'ISO 15189', 'Bệnh viện an toàn'],
            facilities: ['NICU', 'Phòng mổ nhi', 'Khoa cấp cứu nhi', 'Trung tâm tim mạch nhi'],
            workingHours: {
                weekday: '6:00 - 18:00',
                weekend: '6:00 - 16:00'
            },
            emergencyAvailable: true
        },
        {
            id: 6,
            name: 'Bệnh viện Từ Dũ',
            type: 'Công lập',
            address: '284 Cống Quỳnh, Phường Phạm Ngũ Lão',
            district: 'Quận 1',
            city: 'TP.HCM',
            rating: 4.3,
            reviews: 1050,
            phone: '028 3829 5024',
            image: '/api/placeholder/400/250',
            description: 'Bệnh viện sản phụ khoa hàng đầu, chuyên về chăm sóc sức khỏe sinh sản và phụ nữ.',
            specialties: ['Sản khoa', 'Phụ khoa', 'Kế hoạch hóa gia đình', 'Vô sinh hiếm muộn', 'Sơ sinh'],
            beds: 400,
            doctors: 150,
            established: 1956,
            certifications: ['Bộ Y tế', 'WHO', 'UNICEF'],
            facilities: ['Phòng sinh hiện đại', 'Khoa NICU', 'Trung tâm IVF', 'Phòng mổ vô khuẩn'],
            workingHours: {
                weekday: '6:00 - 17:00',
                weekend: '6:00 - 12:00'
            },
            emergencyAvailable: true
        }
    ]

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


    const districts = ['Quận 1', 'Quận 3', 'Quận 5', 'Quận 7', 'Quận 10', 'Quận Bình Thạnh']
    const hospitalTypes = ['Công lập', 'Tư nhân']
    const specialties = ['Tim mạch', 'Nhi khoa', 'Sản phụ khoa', 'Ung bướu', 'Da liễu', 'Thần kinh']

    const filteredHospitals = hospitals.filter(hospital => {
        const matchesSearch = hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            hospital.specialties.some(specialty =>
                specialty.toLowerCase().includes(searchQuery.toLowerCase())
            )
        const matchesDistrict = selectedDistrict === 'all' || hospital.district === selectedDistrict
        const matchesType = selectedType === 'all' || hospital.type === selectedType
        const matchesSpecialty = selectedSpecialty === 'all' ||
            hospital.specialties.includes(selectedSpecialty)

        return matchesSearch && matchesDistrict && matchesType && matchesSpecialty
    })

    return (
        <main className="min-h-screen bg-gray-50">
            <Header />

            {/* Page header */}
            <section className="bg-white border-b py-8">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Tìm bệnh viện
                    </h1>
                    <p className="text-gray-600">
                        Tìm kiếm các bệnh viện uy tín tại TP.HCM với đầy đủ thông tin và dịch vụ
                    </p>
                </div>
            </section>

            {/* Search and filters */}
            <section className="py-6 bg-white border-b">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-5 gap-4">
                        {/* Search */}
                        <div className="relative lg:col-span-2">
                            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Tìm tên bệnh viện, chuyên khoa..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* District filter */}
                        <select
                            value={selectedDistrict}
                            onChange={(e) => setSelectedDistrict(e.target.value)}
                            className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">Tất cả quận/huyện</option>
                            {districts.map(district => (
                                <option key={district} value={district}>{district}</option>
                            ))}
                        </select>

                        {/* Type filter */}
                        <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">Tất cả loại hình</option>
                            {hospitalTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>

                        {/* Specialty filter */}
                        <select
                            value={selectedSpecialty}
                            onChange={(e) => setSelectedSpecialty(e.target.value)}
                            className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">Tất cả chuyên khoa</option>
                            {specialties.map(specialty => (
                                <option key={specialty} value={specialty}>{specialty}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </section>

            {/* Results */}
            <section className="py-8">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center mb-6">
                        <p className="text-gray-600">
                            Tìm thấy <span className="font-semibold">{filteredHospitals.length}</span> bệnh viện
                        </p>
                        <select className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option>Sắp xếp theo</option>
                            <option>Đánh giá cao nhất</option>
                            <option>Khoảng cách gần nhất</option>
                            <option>Tên A-Z</option>
                        </select>
                    </div>

                    <div className="space-y-6">
                        {filteredHospitals.map(hospital => (
                            <HospitalCard
                                key={hospital.id}
                                hospital={toHospitalCardHospital(hospital)}
                                variant="compact"
                            />
                        ))}
                    </div>

                    {filteredHospitals.length === 0 && (
                        <div className="text-center py-12">
                            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                                <Search className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Không tìm thấy bệnh viện
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Thử thay đổi tiêu chí tìm kiếm hoặc bộ lọc
                            </p>
                            <button
                                onClick={() => {
                                    setSearchQuery('')
                                    setSelectedDistrict('all')
                                    setSelectedType('all')
                                    setSelectedSpecialty('all')
                                }}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Xóa bộ lọc
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* Featured hospitals */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                        Bệnh viện nổi bật
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {hospitals.slice(0, 3).map(hospital => (
                            <HospitalCard
                                key={hospital.id}
                                hospital={toHospitalCardHospital(hospital)}
                                variant="prominent"
                            />
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    )
}