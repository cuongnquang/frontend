'use client'

import { Doctor } from '@/components/admin/doctors/DoctorTypes'
import { DoctorForm } from '@/components/admin/doctors/form/DoctorForm'
import { PatientForm } from '@/components/admin/patients/form/PatientForm'
import { Patient } from '@/components/admin/patients/PatientTypes'
import { Users, UserCheck, Calendar, TrendingUp, Activity } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const mockDoctors: Doctor[] = [
    {
        id: 'BS001',
        name: 'BS. Nguyễn Văn An',
        email: 'nva@youmed.vn',
        phone: '0901234567',
        specialization: 'Tim mạch',
        licenseNumber: 'BS-001-2024',
        qualification: 'Thạc sĩ',
        experience: 15,
        consultationFee: 500000,
        rating: 4.9,
        totalPatients: 1250,
        availability: 'available',
        status: 'active',
        joinDate: '2020-01-15'
    },
    {
        id: 'BS002',
        name: 'BS. Trần Thị Bình',
        email: 'ttb@youmed.vn',
        phone: '0901234568',
        specialization: 'Da liễu',
        licenseNumber: 'BS-002-2023',
        qualification: 'Tiến sĩ',
        experience: 8,
        consultationFee: 750000,
        rating: 4.5,
        totalPatients: 800,
        availability: 'busy',
        status: 'active',
        joinDate: '2021-05-20'
    },
    {
        id: 'BS003',
        name: 'BS. Lê Văn Cường',
        email: 'lvc@youmed.vn',
        phone: '0901234569',
        specialization: 'Nhi khoa',
        licenseNumber: 'BS-003-2022',
        qualification: 'Chuyên khoa I',
        experience: 5,
        consultationFee: 400000,
        rating: 4.2,
        totalPatients: 1500,
        availability: 'off',
        status: 'inactive',
        joinDate: '2022-11-01'
    },
    {
        id: 'BS004',
        name: 'BS. Phạm Thị Duyên',
        email: 'ptd@youmed.vn',
        phone: '0901234570',
        specialization: 'Tim mạch',
        licenseNumber: 'BS-004-2021',
        qualification: 'Bác sĩ',
        experience: 10,
        consultationFee: 500000,
        rating: 4.8,
        totalPatients: 950,
        availability: 'available',
        status: 'active',
        joinDate: '2019-03-10'
    }
]

const calculateAge = (dateOfBirth: string) => {
    const today = new Date()
    const birth = new Date(dateOfBirth)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--
    }
    return age
}
const getRiskColor = (risk: string) => {
    switch (risk) {
        case 'low': return 'bg-green-100 text-green-800'
        case 'medium': return 'bg-yellow-100 text-yellow-800'
        case 'high': return 'bg-red-100 text-red-800'
        default: return 'bg-gray-100 text-gray-800'
    }
}
const getRiskText = (risk: string) => {
    switch (risk) {
        case 'low': return 'Thấp'
        case 'medium': return 'TB'
        case 'high': return 'Cao'
        default: return risk
    }
}

const mockPatients: Patient[] = [
    {
        id: 'BN001',
        name: 'Nguyễn Văn An',
        email: 'nva@email.com',
        phone: '0901234567',
        dateOfBirth: '1985-03-15',
        gender: 'male',
        address: 'Hà Nội',
        insuranceNumber: 'INS001',
        bloodType: 'O+',
        lastVisit: '2024-02-10',
        nextAppointment: '2024-02-20',
        totalVisits: 15,
        status: 'active',
        riskLevel: 'high'
    },
    {
        id: 'BN002',
        name: 'Trần Thị Bình',
        email: 'ttb@email.com',
        phone: '0901234568',
        dateOfBirth: '1990-07-22',
        gender: 'female',
        address: 'TP.HCM',
        insuranceNumber: 'INS002',
        bloodType: 'A+',
        lastVisit: '2024-02-08',
        totalVisits: 8,
        status: 'active',
        riskLevel: 'medium'
    },
    {
        id: 'BN003',
        name: 'Lê Văn Cường',
        email: 'lvc@email.com',
        phone: '0901234569',
        dateOfBirth: '1995-12-05',
        gender: 'male',
        address: 'Đà Nẵng',
        insuranceNumber: 'INS003',
        bloodType: 'B+',
        lastVisit: '2024-02-12',
        totalVisits: 3,
        status: 'active',
        riskLevel: 'low'
    },
    {
        id: 'BN004',
        name: 'Phạm Thị Duyên',
        email: 'ptd@email.com',
        phone: '0901234570',
        dateOfBirth: '1970-01-01',
        gender: 'female',
        address: 'Cần Thơ',
        insuranceNumber: 'INS004',
        bloodType: 'AB-',
        lastVisit: '2024-01-01',
        totalVisits: 25,
        status: 'inactive',
        riskLevel: 'high'
    }
]
export default function AdminDashboard() {
    const route = useRouter()
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [currentDoctor, setCurrentDoctor] = useState<Doctor | undefined>(undefined);
    const [currentPatient, setCurrentPatient] = useState<Patient | undefined>(undefined);
    const [formMode, setFormMode] = useState();
    const [doctors, setDoctors] = useState(mockDoctors);
    const [patients, setPatients] = useState(mockPatients);


    const stats = [
        {
            name: 'Tổng số Bác sĩ',
            value: '156',
            change: '+12%',
            changeType: 'increase',
            icon: UserCheck,
            permission: 'admin:doctors:view',
            color: 'blue'
        },
        {
            name: 'Tổng số Bệnh nhân',
            value: '2,847',
            change: '+18%',
            changeType: 'increase',
            icon: Users,

            color: 'green'
        },
        {
            name: 'Lịch hẹn hôm nay',
            value: '43',
            change: '-5%',
            changeType: 'decrease',
            icon: Calendar,
            color: 'yellow'
        },
        {
            name: 'Doanh thu tháng',
            value: '₫1.2M',
            change: '+25%',
            changeType: 'increase',
            icon: TrendingUp,
            color: 'purple'
        }
    ]

    const recentActivities = [
        {
            id: 1,
            type: 'appointment',
            message: 'Bệnh nhân Nguyễn Văn A đã đặt lịch khám',
            time: '5 phút trước',
            icon: Calendar,
            color: 'text-blue-600 bg-blue-100'
        },
        {
            id: 2,
            type: 'doctor',
            message: 'BS. Trần Thị B đã cập nhật lịch làm việc',
            time: '15 phút trước',
            icon: UserCheck,
            color: 'text-green-600 bg-green-100'
        },
        {
            id: 3,
            type: 'system',
            message: 'Hệ thống đã sao lưu dữ liệu thành công',
            time: '30 phút trước',
            icon: Activity,
            color: 'text-purple-600 bg-purple-100'
        }
    ]

    const hanldeViewActivities = () => {
        route.push('/admin/dashboard/activities')
    }

    const getStatColors = (color: string) => {
        const colors = {
            blue: 'text-blue-600 bg-blue-100',
            green: 'text-green-600 bg-green-100',
            yellow: 'text-yellow-600 bg-yellow-100',
            purple: 'text-purple-600 bg-purple-100'
        }
        return colors[color as keyof typeof colors] || colors.blue
    }
    const handleOpenDoctor = () => {
        setCurrentDoctor(undefined);
        setIsFormOpen(true);
    };
    // Hàm đóng Form
    const handleCloseDoctor = () => {
        setIsFormOpen(false);
        setCurrentDoctor(undefined); // Reset bác sĩ hiện tại khi đóng
    };
    const handleOpenPatient = () => {
        setCurrentDoctor(undefined);
        setIsFormOpen(true);
    };
    // Hàm đóng Form
    const handleClosePatient = () => {
        setIsFormOpen(false);
        setCurrentPatient(undefined); // Reset bác sĩ hiện tại khi đóng
    };

    // --- HÀM XỬ LÝ GỬI DỮ LIỆU (SUBMIT) ---
    const handleDoctorSubmit = (data: any) => {
        console.log('Dữ liệu form đã gửi:', data);

        if (formMode === 'create') {
            // Logic thêm mới
            const newDoctor = { ...data, id: Date.now() } as Doctor;
            setDoctors(prev => [...prev, newDoctor]);
            alert(`Đã thêm bác sĩ: ${data.name}`);
        } else if (formMode === 'edit' && currentDoctor) {
            // Logic chỉnh sửa
            setDoctors(prev => prev.map(d => d.id === currentDoctor.id ? { ...currentDoctor, ...data } : d));
            alert(`Đã cập nhật bác sĩ: ${data.name}`);
        }

        handleCloseDoctor(); // Đóng form sau khi submit thành công
    };
    const handlePatientSubmit = (data: any) => {
        console.log('Dữ liệu form đã gửi:', data);

        if (formMode === 'create') {
            // Logic thêm mới
            const newPatient = { ...data, id: Date.now() } as Patient;
            setPatients(prev => [...prev, newPatient]);
            alert(`Đã thêm bác sĩ: ${data.name}`);
        } else if (formMode === 'edit' && currentPatient) {
            // Logic chỉnh sửa
            setPatients(prev => prev.map(p => p.id === currentPatient.id ? { ...currentPatient, ...data } : p));
            alert(`Đã cập nhật bác sĩ: ${data.name}`);
        }

        handleClosePatient(); // Đóng form sau khi submit thành công
    };

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard Quản trị</h1>
                <p className="text-gray-600 mt-2">
                    Tổng quan hệ thống YouMed - {new Date().toLocaleDateString('vi-VN')}
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, i) => {
                    const IconComponent = stat.icon
                    return (
                        <div key={i} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                                    <div className="flex items-center mt-2">
                                        <span className={`text-sm font-medium ${stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                            {stat.change}
                                        </span>
                                        <span className="text-sm text-gray-500 ml-1">so với tháng trước</span>
                                    </div>
                                </div>
                                <div className={`p-3 rounded-lg ${getStatColors(stat.color)}`}>
                                    <IconComponent className="w-6 h-6" />
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activities */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-sm">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-900">Hoạt động gần đây</h2>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                {recentActivities.map((activity) => {
                                    const IconComponent = activity.icon
                                    return (
                                        <div key={activity.id} className="flex items-start">
                                            <div className={`p-2 rounded-lg ${activity.color} mr-4 flex-shrink-0`}>
                                                <IconComponent className="w-4 h-4" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-gray-900">{activity.message}</p>
                                                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                            <div className="mt-6">
                                <button onClick={hanldeViewActivities} className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                                    Xem tất cả hoạt động →
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h3>
                        <div className="space-y-3">
                            <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors border" onClick={handleOpenDoctor}>
                                <div className="flex items-center">
                                    <UserCheck className="w-5 h-5 text-blue-600 mr-3" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Thêm Bác sĩ</p>
                                        <p className="text-xs text-gray-500">Đăng ký bác sĩ mới</p>
                                    </div>
                                </div>
                            </button>
                            <button onClick={handleOpenPatient} className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors border">
                                <div className="flex items-center">
                                    <Users className="w-5 h-5 text-green-600 mr-3" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Thêm Bệnh nhân</p>
                                        <p className="text-xs text-gray-500">Đăng ký bệnh nhân mới</p>
                                    </div>
                                </div>
                            </button>
                            <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors border">
                                <div className="flex items-center">
                                    <TrendingUp className="w-5 h-5 text-purple-600 mr-3" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Tạo báo cáo</p>
                                        <p className="text-xs text-gray-500">Xuất báo cáo thống kê</p>
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* System Status */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Trạng thái hệ thống</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Máy chủ</span>
                                <div className="flex items-center">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                    <span className="text-sm text-green-600">Hoạt động</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Cơ sở dữ liệu</span>
                                <div className="flex items-center">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                    <span className="text-sm text-green-600">Hoạt động</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Sao lưu</span>
                                <div className="flex items-center">
                                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                                    <span className="text-sm text-yellow-600">Đang xử lý</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {isFormOpen && (
                <DoctorForm
                    doctor={currentDoctor}
                    onClose={handleCloseDoctor}
                    onSubmit={handleDoctorSubmit}
                    mode='create'
                />
            )}
            {isFormOpen && (
                <PatientForm
                    patient={currentPatient}
                    onClose={handleClosePatient}
                    onSubmit={handlePatientSubmit}
                    mode='create'
                />
            )}
        </div>
    )
}

function setPatients(arg0: (prev: any) => any[]) {
    throw new Error('Function not implemented.')
}
