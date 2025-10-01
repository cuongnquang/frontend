'use client'

import { useState } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Search, Star, MapPin, Calendar, Filter, CheckCircle } from 'lucide-react'
import DoctorCard from '@/components/doctor/DoctorCard'

interface Doctor {
    id: number
    name: string
    specialty: string
    hospital: string
    location: string
    rating: number
    reviews: number
    price: string
    image: string
    experience: string
    availability: string[]
}

export default function DoctorsPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedSpecialty, setSelectedSpecialty] = useState('all')
    const [selectedLocation, setSelectedLocation] = useState('all')

    const doctors: Doctor[] = [
        {
            id: 1,
            name: 'BS. Nguyễn Văn An',
            specialty: 'Tim mạch',
            hospital: 'Bệnh viện Chợ Rẫy',
            location: 'Quận 5, TP.HCM',
            rating: 4.8,
            reviews: 127,
            price: '500.000đ',
            image: '/api/placeholder/150/150',
            experience: '15 năm kinh nghiệm',
            availability: ['Thứ 2', 'Thứ 4', 'Thứ 6']
        },
        {
            id: 2,
            name: 'PGS.TS. Trần Thị Bình',
            specialty: 'Nhi khoa',
            hospital: 'Bệnh viện Nhi Đồng 1',
            location: 'Quận 3, TP.HCM',
            rating: 4.9,
            reviews: 203,
            price: '600.000đ',
            image: '/api/placeholder/150/150',
            experience: '20 năm kinh nghiệm',
            availability: ['Thứ 3', 'Thứ 5', 'Thứ 7']
        },
        {
            id: 3,
            name: 'BS. Lê Minh Châu',
            specialty: 'Da liễu',
            hospital: 'Bệnh viện Da liễu TP.HCM',
            location: 'Quận 1, TP.HCM',
            rating: 4.7,
            reviews: 89,
            price: '450.000đ',
            image: '/api/placeholder/150/150',
            experience: '12 năm kinh nghiệm',
            availability: ['Thứ 2', 'Thứ 3', 'Thứ 5']
        },
        {
            id: 4,
            name: 'TS.BS. Phạm Văn Dũng',
            specialty: 'Thần kinh',
            hospital: 'Bệnh viện Thống Nhất',
            location: 'Quận Tân Bình, TP.HCM',
            rating: 4.6,
            reviews: 156,
            price: '700.000đ',
            image: '/api/placeholder/150/150',
            experience: '18 năm kinh nghiệm',
            availability: ['Thứ 4', 'Thứ 6', 'Thứ 7']
        },
        {
            id: 5,
            name: 'BS. Võ Thị Hoa',
            specialty: 'Sản phụ khoa',
            hospital: 'Bệnh viện Từ Dũ',
            location: 'Quận 1, TP.HCM',
            rating: 4.8,
            reviews: 234,
            price: '550.000đ',
            image: '/api/placeholder/150/150',
            experience: '16 năm kinh nghiệm',
            availability: ['Thứ 2', 'Thứ 4', 'Thứ 6']
        },
        {
            id: 6,
            name: 'BS. Nguyễn Thanh Kiên',
            specialty: 'Ngoại khoa',
            hospital: 'Bệnh viện 175',
            location: 'Quận Gò Vấp, TP.HCM',
            rating: 4.5,
            reviews: 98,
            price: '650.000đ',
            image: '/api/placeholder/150/150',
            experience: '14 năm kinh nghiệm',
            availability: ['Thứ 3', 'Thứ 5', 'Thứ 7']
        }
    ]

    const specialties = [
        'Tim mạch', 'Nhi khoa', 'Da liễu', 'Thần kinh',
        'Sản phụ khoa', 'Ngoại khoa', 'Nội khoa', 'Mắt'
    ]

    const locations = [
        'Quận 1', 'Quận 3', 'Quận 5', 'Quần 7',
        'Quận Tân Bình', 'Quận Gò Vấp', 'Quận Phú Nhuận'
    ]

    const filteredDoctors = doctors.filter(doctor => {
        const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesSpecialty = selectedSpecialty === 'all' || doctor.specialty === selectedSpecialty
        const matchesLocation = selectedLocation === 'all' || doctor.location.includes(selectedLocation)

        return matchesSearch && matchesSpecialty && matchesLocation
    })

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

    return (
        <main className="min-h-screen bg-gray-50">
            <Header />

            {/* Page header */}
            <section className="bg-white border-b py-8">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Tìm bác sĩ
                    </h1>
                    <p className="text-gray-600">
                        Tìm kiếm và đặt lịch với các bác sĩ uy tín tại TP.HCM
                    </p>
                </div>
            </section>

            {/* Search and filters */}
            <section className="py-6 bg-white border-b">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-4 gap-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Tìm tên bác sĩ, chuyên khoa..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

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

                        {/* Location filter */}
                        <select
                            value={selectedLocation}
                            onChange={(e) => setSelectedLocation(e.target.value)}
                            className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">Tất cả địa điểm</option>
                            {locations.map(location => (
                                <option key={location} value={location}>{location}</option>
                            ))}
                        </select>

                        {/* Sort */}
                        <select className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            <option>Sắp xếp theo</option>
                            <option>Đánh giá cao nhất</option>
                            <option>Giá thấp nhất</option>
                            <option>Giá cao nhất</option>
                            <option>Kinh nghiệm</option>
                        </select>
                    </div>
                </div>
            </section>

            {/* Results */}
            <section className="py-8">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center mb-6">
                        <p className="text-gray-600">
                            Tìm thấy <span className="font-semibold">{filteredDoctors.length}</span> bác sĩ
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredDoctors.map(doctor => (
                            <DoctorCard
                                key={doctor.id}
                                variant="compact"
                                doctor={toDoctorCardDoctor(doctor)}
                            />
                        ))}
                    </div>

                    {filteredDoctors.length === 0 && (
                        <div className="text-center py-12">
                            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                                <Search className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Không tìm thấy bác sĩ
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Thử thay đổi tiêu chí tìm kiếm hoặc bộ lọc
                            </p>
                            <button
                                onClick={() => {
                                    setSearchQuery('')
                                    setSelectedSpecialty('all')
                                    setSelectedLocation('all')
                                }}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Xóa bộ lọc
                            </button>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </main>
    )
}