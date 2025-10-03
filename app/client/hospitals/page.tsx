'use client'

import { useState } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import HospitalsHeader from '@/components/client/hospitals/HospitalsHeader'
import HospitalsFilterBar from '@/components/client/hospitals/HospitalsFilterBar'
import HospitalsResults from '@/components/client/hospitals/HospitalsResults'
import FeaturedHospitals from '@/components/client/hospitals/FeaturedHospitals'
import { Hospital } from '@/components/client/hospitals/HospitalType'

const ALL_HOSPITALS: Hospital[] = [
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
        workingHours: { weekday: '6:00 - 20:00', weekend: '6:00 - 18:00' },
        emergencyAvailable: true,
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
        workingHours: { weekday: '6:30 - 17:30', weekend: '7:00 - 16:00' },
        emergencyAvailable: true,
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
        workingHours: { weekday: '7:00 - 19:00', weekend: '7:00 - 17:00' },
        emergencyAvailable: true,
    },
    // ... Thêm bệnh viện khác
]

const ALL_DISTRICTS = ['Quận 1', 'Quận 3', 'Quận 5', 'Quận 7', 'Quận 10', 'Quận Bình Thạnh']
const ALL_TYPES = ['Công lập', 'Tư nhân']
const ALL_SPECIALTIES = ['Tim mạch', 'Nhi khoa', 'Sản phụ khoa', 'Ung bướu', 'Da liễu', 'Thần kinh']

export default function HospitalsPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedDistrict, setSelectedDistrict] = useState('all')
    const [selectedType, setSelectedType] = useState('all')
    const [selectedSpecialty, setSelectedSpecialty] = useState('all')

    const filteredHospitals = ALL_HOSPITALS.filter(hospital => {
        const matchesSearch =
            hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            hospital.specialties.some(specialty =>
                specialty.toLowerCase().includes(searchQuery.toLowerCase())
            )
        const matchesDistrict = selectedDistrict === 'all' || hospital.district === selectedDistrict
        const matchesType = selectedType === 'all' || hospital.type === selectedType
        const matchesSpecialty =
            selectedSpecialty === 'all' || hospital.specialties.includes(selectedSpecialty)

        return matchesSearch && matchesDistrict && matchesType && matchesSpecialty
    })

    const resetFilters = () => {
        setSearchQuery('')
        setSelectedDistrict('all')
        setSelectedType('all')
        setSelectedSpecialty('all')
    }

    return (
        <main className="min-h-screen bg-gray-50">
            <Header />
            <HospitalsHeader />

            <HospitalsFilterBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedDistrict={selectedDistrict}
                setSelectedDistrict={setSelectedDistrict}
                selectedType={selectedType}
                setSelectedType={setSelectedType}
                selectedSpecialty={selectedSpecialty}
                setSelectedSpecialty={setSelectedSpecialty}
                districts={ALL_DISTRICTS}
                hospitalTypes={ALL_TYPES}
                specialties={ALL_SPECIALTIES}
            />

            <HospitalsResults
                filteredHospitals={filteredHospitals}
                resetFilters={resetFilters}
            />

            <FeaturedHospitals hospitals={ALL_HOSPITALS.slice(0, 3)} />

            <Footer />
        </main>
    )
}