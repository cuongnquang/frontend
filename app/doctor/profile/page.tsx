'use client'

import { useState } from 'react'
import { PermissionGate } from '@/lib/AuthGuard'
import { useAuth } from '@/lib/AuthContext'
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Stethoscope,
    GraduationCap,
    Award,
    Clock,
    Edit,
    Save,
    X,
    Camera,
    Shield,
    Star
} from 'lucide-react'

export default function DoctorProfile() {
    const { user } = useAuth()
    const [isEditing, setIsEditing] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [activeTab, setActiveTab] = useState('personal')

    // Mock doctor profile data
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.profile?.phone || '',
        specialization: user?.profile?.specialization || 'Tim mạch',
        licenseNumber: user?.profile?.licenseNumber || 'BS-2024-001',
        hospitalId: user?.profile?.hospitalId || 'hospital-1',
        dateOfBirth: '1985-03-15',
        gender: 'male',
        address: 'Hà Nội, Việt Nam',
        education: [
            {
                degree: 'Bác sĩ Y khoa',
                institution: 'Đại học Y Hà Nội',
                year: '2008',
                gpa: '8.5/10'
            },
            {
                degree: 'Thạc sĩ Tim mạch',
                institution: 'Viện Tim mạch Quốc gia',
                year: '2012',
                gpa: '9.2/10'
            }
        ],
        certifications: [
            {
                name: 'Chứng chỉ Tim mạch Can thiệp',
                issuer: 'Hội Tim mạch Việt Nam',
                date: '2015',
                validUntil: '2025'
            },
            {
                name: 'Chứng chỉ Siêu âm tim',
                issuer: 'Bệnh viện Bạch Mai',
                date: '2018',
                validUntil: '2028'
            }
        ],
        experience: [
            {
                position: 'Bác sĩ trưởng khoa Tim mạch',
                hospital: 'Bệnh viện Bạch Mai',
                duration: '2020 - Hiện tại',
                description: 'Điều trị các bệnh lý tim mạch phức tạp, can thiệp tim mạch'
            },
            {
                position: 'Bác sĩ điều trị',
                hospital: 'Viện Tim mạch Quốc gia',
                duration: '2015 - 2020',
                description: 'Khám và điều trị các bệnh lý tim mạch thông thường'
            }
        ],
        workingHours: {
            monday: { start: '08:00', end: '17:00', isWorking: true },
            tuesday: { start: '08:00', end: '17:00', isWorking: true },
            wednesday: { start: '08:00', end: '17:00', isWorking: true },
            thursday: { start: '08:00', end: '17:00', isWorking: true },
            friday: { start: '08:00', end: '17:00', isWorking: true },
            saturday: { start: '08:00', end: '12:00', isWorking: true },
            sunday: { start: '', end: '', isWorking: false }
        },
        consultationFee: 500000,
        languages: ['Tiếng Việt', 'English'],
        bio: 'Bác sĩ chuyên khoa Tim mạch với hơn 15 năm kinh nghiệm. Chuyên điều trị các bệnh lý tim mạch và can thiệp tim mạch. Tốt nghiệp xuất sắc Đại học Y Hà Nội và có thạc sĩ chuyên ngành Tim mạch.'
    })

    const handleSave = async () => {
        setIsLoading(true)
        try {
            // In real app, this would be an API call
            await updateProfile({
                name: profileData.name,
                profile: {
                    ...user?.profile,
                    phone: profileData.phone,
                    specialization: profileData.specialization
                }
            })
            setIsEditing(false)
        } catch (error) {
            console.error('Error updating profile:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const tabs = [
        { id: 'personal', name: 'Thông tin cá nhân', icon: User },
        { id: 'professional', name: 'Thông tin nghề nghiệp', icon: Stethoscope },
        { id: 'education', name: 'Học vấn & Chứng chỉ', icon: GraduationCap },
        { id: 'schedule', name: 'Lịch làm việc', icon: Clock }
    ]

    const dayNameMap: { [key: string]: string } = {
        monday: 'Thứ Hai',
        tuesday: 'Thứ Ba',
        wednesday: 'Thứ Tư',
        thursday: 'Thứ Năm',
        friday: 'Thứ Sáu',
        saturday: 'Thứ Bảy',
        sunday: 'Chủ Nhật',
    }

    return (
        // <PermissionGate permission="doctor:profile:view">
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6">
                            <div className="relative">
                                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                                    <User className="w-12 h-12 text-blue-600" />
                                </div>
                                <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700">
                                    <Camera className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="text-white">
                                <h1 className="text-3xl font-bold">{profileData.name}</h1>
                                <p className="text-blue-100 text-lg">{profileData.specialization}</p>
                                <p className="text-blue-200 text-sm">ID: {profileData.licenseNumber}</p>
                                <div className="flex items-center mt-2">
                                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                                    <span className="text-sm">4.9/5 (248 đánh giá)</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            {!isEditing ? (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center"
                                >
                                    <Edit className="w-4 h-4 mr-2" />
                                    Chỉnh sửa
                                </button>
                            ) : (
                                <div className="flex space-x-2">
                                    <button
                                        onClick={handleSave}
                                        disabled={isLoading}
                                        className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center disabled:opacity-50"
                                    >
                                        <Save className="w-4 h-4 mr-2" />
                                        {isLoading ? 'Đang lưu...' : 'Lưu'}
                                    </button>
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center"
                                    >
                                        <X className="w-4 h-4 mr-2" />
                                        Hủy
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="px-6 py-4 bg-gray-50 border-b">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">15+</div>
                            <div className="text-sm text-gray-600">Năm kinh nghiệm</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">2,500+</div>
                            <div className="text-sm text-gray-600">Bệnh nhân điều trị</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600">98%</div>
                            <div className="text-sm text-gray-600">Tỷ lệ hài lòng</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-orange-600">50+</div>
                            <div className="text-sm text-gray-600">Ca phẫu thuật/tháng</div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="px-6">
                    <nav className="flex space-x-8">
                        {tabs.map((tab) => {
                            const IconComponent = tab.icon
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    <IconComponent className="w-4 h-4 mr-2" />
                                    {tab.name}
                                </button>
                            )
                        })}
                    </nav>
                </div>
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                {/* Personal Information Tab */}
                {activeTab === 'personal' && (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-900">Thông tin cá nhân</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Họ và tên
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={profileData.name}
                                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                ) : (
                                    <p className="text-gray-900">{profileData.name}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>
                                <div className="flex items-center">
                                    <Mail className="w-4 h-4 text-gray-400 mr-2" />
                                    <p className="text-gray-900">{profileData.email}</p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Số điện thoại
                                </label>
                                {isEditing ? (
                                    <input
                                        type="tel"
                                        value={profileData.phone}
                                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                ) : (
                                    <div className="flex items-center">
                                        <Phone className="w-4 h-4 text-gray-400 mr-2" />
                                        <p className="text-gray-900">{profileData.phone}</p>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Ngày sinh
                                </label>
                                <div className="flex items-center">
                                    <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                                    <p className="text-gray-900">
                                        {new Date(profileData.dateOfBirth).toLocaleDateString('vi-VN')}
                                    </p>
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Địa chỉ
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={profileData.address}
                                        onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                ) : (
                                    <div className="flex items-center">
                                        <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                                        <p className="text-gray-900">{profileData.address}</p>
                                    </div>
                                )}
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Giới thiệu
                                </label>
                                {isEditing ? (
                                    <textarea
                                        rows={4}
                                        value={profileData.bio}
                                        onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                ) : (
                                    <p className="text-gray-900">{profileData.bio}</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Professional Information Tab */}
                {activeTab === 'professional' && (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-900">Thông tin nghề nghiệp</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Chuyên khoa
                                </label>
                                {isEditing ? (
                                    <select
                                        value={profileData.specialization}
                                        onChange={(e) => setProfileData({ ...profileData, specialization: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="Tim mạch">Tim mạch</option>
                                        <option value="Nhi khoa">Nhi khoa</option>
                                        <option value="Sản phụ khoa">Sản phụ khoa</option>
                                        <option value="Ngoại khoa">Ngoại khoa</option>
                                        <option value="Nội khoa">Nội khoa</option>
                                    </select>
                                ) : (
                                    <div className="flex items-center">
                                        <Stethoscope className="w-4 h-4 text-gray-400 mr-2" />
                                        <p className="text-gray-900">{profileData.specialization}</p>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Số chứng chỉ hành nghề
                                </label>
                                <div className="flex items-center">
                                    <Shield className="w-4 h-4 text-gray-400 mr-2" />
                                    <p className="text-gray-900">{profileData.licenseNumber}</p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phí khám
                                </label>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        value={profileData.consultationFee}
                                        onChange={(e) => setProfileData({ ...profileData, consultationFee: parseInt(e.target.value) })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                ) : (
                                    <p className="text-gray-900">{profileData.consultationFee.toLocaleString('vi-VN')} VNĐ</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Ngôn ngữ
                                </label>
                                <p className="text-gray-900">{profileData.languages.join(', ')}</p>
                            </div>
                        </div>

                        {/* Experience */}
                        <div>
                            <h4 className="text-md font-semibold text-gray-900 mb-4">Kinh nghiệm làm việc</h4>
                            <div className="space-y-4">
                                {profileData.experience.map((exp, index) => (
                                    <div key={index} className="border rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <h5 className="font-medium text-gray-900">{exp.position}</h5>
                                            <span className="text-sm text-blue-600">{exp.duration}</span>
                                        </div>
                                        <p className="text-gray-600 mb-2">{exp.hospital}</p>
                                        <p className="text-sm text-gray-500">{exp.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Education & Certifications Tab */}
                {activeTab === 'education' && (
                    <div className="space-y-8">
                        {/* Education */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <GraduationCap className="w-5 h-5 mr-2 text-blue-600" />
                                Học vấn
                            </h3>
                            <div className="space-y-6 border-l-2 border-gray-200 pl-6">
                                {profileData.education.map((edu, index) => (
                                    <div key={index} className="relative">
                                        <div className="absolute w-3 h-3 bg-blue-600 rounded-full mt-1 -left-7 border-4 border-white"></div>
                                        <h4 className="font-semibold text-gray-900">{edu.degree}</h4>
                                        <p className="text-sm text-gray-600 italic">{edu.institution}</p>
                                        <p className="text-xs text-gray-500">{edu.year}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Certifications */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <Award className="w-5 h-5 mr-2 text-blue-600" />
                                Chứng chỉ & Giải thưởng
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {profileData.certifications.map((cert, index) => (
                                    <div key={index} className="bg-gray-50 p-4 rounded-lg border flex items-start space-x-3">
                                        <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                                        <div>
                                            <h4 className="font-medium text-gray-900">{cert.name}</h4>
                                            <p className="text-sm text-gray-600">Phát hành bởi: {cert.issuer}</p>
                                            <p className="text-xs text-gray-500">
                                                Ngày: {cert.date} | Hết hạn: {cert.validUntil}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Schedule Tab */}
                {activeTab === 'schedule' && (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-900">Lịch làm việc & Phí</h3>

                        {/* Working Hours */}
                        <div className="border rounded-xl p-4">
                            <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                                <Clock className="w-4 h-4 mr-2 text-blue-600" />
                                Thời gian làm việc
                            </h4>
                            <div className="space-y-2">
                                {Object.entries(profileData.workingHours).map(([day, hours]) => (
                                    <div key={day} className="flex justify-between items-center py-1 border-b last:border-b-0">
                                        <span className="capitalize font-medium text-gray-700 w-1/3">
                                            {dayNameMap[day] || day}
                                        </span>
                                        {hours.isWorking ? (
                                            <span className="text-green-600 font-medium">
                                                {hours.start} - {hours.end}
                                            </span>
                                        ) : (
                                            <span className="text-red-500 italic">Nghỉ</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Consultation Fee */}
                        <div className="border rounded-xl p-4 bg-blue-50">
                            <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                                <User className="w-4 h-4 mr-2 text-blue-600" />
                                Phí tư vấn
                            </h4>
                            <p className="text-xl font-bold text-blue-700">
                                {profileData.consultationFee.toLocaleString('vi-VN')} VNĐ
                            </p>
                            <p className="text-sm text-gray-500 mt-1">Phí áp dụng cho 30 phút khám ban đầu.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
        // </PermissionGate>
    )
}