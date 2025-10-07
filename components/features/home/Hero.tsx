'use client'

import { Search, Calendar, Users, Heart } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Hero() {
    const [searchType, setSearchType] = useState('doctor')
    const [searchValue, setSearchValue] = useState('')
    const router = useRouter()

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        let path = ''
        if (searchType === 'doctor') path = `/client/doctors`
        else if (searchType === 'hospital') path = `/client/hospitals`
        else path = `/client/specialties`
        router.push(path)
    }

    return (
        <section className="bg-gradient-to-br from-blue-50 to-white py-16">
            <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left content */}
                    <div>
                        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                            Đặt lịch khám bệnh
                            <span className="text-blue-600"> dễ dàng</span> và
                            <span className="text-blue-600"> nhanh chóng</span>
                        </h1>
                        <p className="text-xl text-gray-600 mb-8">
                            Kết nối với hàng nghìn bác sĩ và bệnh viện uy tín trên toàn quốc.
                            Đặt lịch khám chỉ trong vài phút.
                        </p>

                        {/* Search form */}
                        <div className="bg-white p-6 rounded-2xl shadow-lg">
                            {/* Search type tabs */}
                            <div className="flex mb-4 bg-gray-100 rounded-lg p-1">
                                <button
                                    onClick={() => setSearchType('doctor')}
                                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${searchType === 'doctor'
                                        ? 'bg-white text-blue-600 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    Tìm bác sĩ
                                </button>
                                <button
                                    onClick={() => setSearchType('hospital')}
                                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${searchType === 'hospital'
                                        ? 'bg-white text-blue-600 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    Tìm bệnh viện
                                </button>
                                <button
                                    onClick={() => setSearchType('specialty')}
                                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${searchType === 'specialty'
                                        ? 'bg-white text-blue-600 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    Chuyên khoa
                                </button>
                            </div>

                            {/* Search inputs */}
                            <form onSubmit={handleSearch}>
                                <div className="space-y-4">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                        <input
                                            type="text"
                                            value={searchValue}
                                            onChange={e => setSearchValue(e.target.value)}
                                            placeholder={
                                                searchType === 'doctor' ? 'Tìm tên bác sĩ...' :
                                                    searchType === 'hospital' ? 'Tìm tên bệnh viện...' :
                                                        'Tìm chuyên khoa...'
                                            }
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <select className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                            <option>Chọn tỉnh/thành</option>
                                            <option>Hồ Chí Minh</option>
                                            <option>Hà Nội</option>
                                            <option>Đà Nẵng</option>
                                            <option>Cần Thơ</option>
                                        </select>
                                        <select className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                            <option>Chọn quận/huyện</option>
                                            <option>Quận 1</option>
                                            <option>Quận 3</option>
                                            <option>Quận 7</option>
                                        </select>
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                    >
                                        Tìm kiếm
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Right content - Image */}
                    <div className="relative">
                        <div className="bg-blue-100 rounded-3xl p-8">
                            <div className="bg-white rounded-2xl p-8 text-center">
                                <div className="w-24 h-24 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                                    <Heart className="w-12 h-12 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    Chăm sóc sức khỏe toàn diện
                                </h3>
                                <p className="text-gray-600">
                                    Với đội ngũ bác sĩ giàu kinh nghiệm và trang thiết bị hiện đại
                                </p>
                            </div>
                        </div>

                        {/* Floating stats */}
                        <div className="absolute -top-4 -right-4 bg-white p-4 rounded-xl shadow-lg">
                            <div className="flex items-center space-x-2">
                                <Users className="w-5 h-5 text-blue-600" />
                                <span className="text-sm font-medium">1000+ Bác sĩ</span>
                            </div>
                        </div>

                        <div className="absolute -bottom-4 -left-4 bg-white p-4 rounded-xl shadow-lg">
                            <div className="flex items-center space-x-2">
                                <Calendar className="w-5 h-5 text-green-600" />
                                <span className="text-sm font-medium">50k+ Lượt khám</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}