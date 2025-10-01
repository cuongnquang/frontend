'use client'

import { useState } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import {
    User, Calendar, Settings, LogOut, CheckCircle, FileText, Camera
} from 'lucide-react'


import ProfileDetails from '@/components/profile/ProfileDetails'
import AppointmentsList from '@/components/profile/AppointmentsList'
import MedicalRecordsList from '@/components/profile/MedicalRecordsList'
import SettingsManagement from '@/components/profile/SettingsManagement'
// Import Modals
import ChangePasswordModal from '@/components/profile/ChangePasswordModal'
import CancelAppointmentModal from '@/components/profile/CancelAppointmentModal'
import DeleteAccountModal from '@/components/profile/DeleteAccountModal'
// Import hooks
import { useDeleteAccount } from '@/hooks/useDeleteAccount';
import AuthGuard from '@/components/auth/AuthGuard'

// Interface Data (Được giữ lại ở đây để dễ quản lý state)
interface Userprofile {
    id: number
    fullName: string
    email: string
    phone: string
    birthDate: string
    gender: 'male' | 'female' | 'other'
    address: string
    avatar: string
    joinDate: string
    emailVerified: boolean
    phoneVerified: boolean
    insuranceNumber?: string
    emergencyContact?: {
        name: string
        phone: string
        relationship: string
    }
}

interface Appointment {
    id: number
    doctorName: string
    doctorSpecialty: string
    hospital: string
    date: string
    time: string
    status: 'confirmed' | 'pending' | 'completed' | 'cancelled'
    price: string
    notes?: string
}

interface MedicalRecord {
    id: number
    date: string
    doctorName: string
    diagnosis: string
    treatment: string
    hospital: string
    files: string[]
}


export default function profilePage() {
    const [activeTab, setActiveTab] = useState<'profile' | 'appointments' | 'records' | 'settings'>('profile')
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showCancelModal, setShowCancelModal] = useState<number | null>(null)
    const [showChangePassword, setShowChangePassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const { isDeleting, error, deleteAccount } = useDeleteAccount();
    // User data (Kept here for global state management)
    const [userprofile, setUserprofile] = useState<Userprofile>({
        id: 1,
        fullName: 'Nguyễn Văn Nam',
        email: 'nguyen.van.nam@email.com',
        phone: '0912345678',
        birthDate: '1990-05-15',
        gender: 'male',
        address: '123 Nguyễn Văn Cừ, Quận 1, TP.HCM',
        avatar: '/api/placeholder/150/150',
        joinDate: '2023-01-15',
        emailVerified: true,
        phoneVerified: false,
        insuranceNumber: 'BH123456789',
        emergencyContact: {
            name: 'Nguyễn Thị Mai',
            phone: '0987654321',
            relationship: 'Vợ'
        }
    })

    // Appointments data (Kept here for global state management)
    const [appointments, setAppointments] = useState<Appointment[]>([
        { id: 1, doctorName: 'PGS.TS. Nguyễn Văn An', doctorSpecialty: 'Tim mạch', hospital: 'Bệnh viện Chợ Rẫy', date: '2024-10-15', time: '09:00', status: 'confirmed', price: '500.000đ', notes: 'Khám tổng quát tim mạch' },
        { id: 2, doctorName: 'BS. Trần Thị Bình', doctorSpecialty: 'Da liễu', hospital: 'Bệnh viện Da liễu TP.HCM', date: '2024-10-20', time: '14:30', status: 'pending', price: '350.000đ' },
        { id: 3, doctorName: 'TS.BS Lê Minh Châu', doctorSpecialty: 'Nhi khoa', hospital: 'Bệnh viện Nhi Đồng 1', date: '2024-09-28', time: '10:15', status: 'completed', price: '300.000đ' }
    ])

    // Medical records data (Kept here for global state management)
    const [medicalRecords] = useState<MedicalRecord[]>([
        { id: 1, date: '2024-09-28', doctorName: 'TS.BS Lê Minh Châu', diagnosis: 'Viêm họng cấp', treatment: 'Kháng sinh + nghỉ ngơi', hospital: 'Bệnh viện Nhi Đồng 1', files: ['prescription.pdf', 'lab_results.pdf'] },
        { id: 2, date: '2024-08-15', doctorName: 'PGS.TS. Nguyễn Văn An', diagnosis: 'Kiểm tra sức khỏe định kỳ', treatment: 'Bình thường, theo dõi', hospital: 'Bệnh viện Chợ Rẫy', files: ['health_check.pdf'] }
    ])

    // Password Form State (Moved to page.tsx to manage modal state, or could be moved to modal component)
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    })

    // Handle password change (Function kept here)
    const handleChangePassword = async () => {
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            alert('Mật khẩu xác nhận không khớp!')
            return
        }
        if (passwordForm.newPassword.length < 8) {
            alert('Mật khẩu mới phải có ít nhất 8 ký tự!')
            return
        }

        setIsLoading(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 1000))
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
            setShowChangePassword(false)
            alert('Đổi mật khẩu thành công!')
        } catch (error) {
            alert('Có lỗi xảy ra. Vui lòng thử lại.')
        } finally {
            setIsLoading(false)
        }
    }

    // Handle appointment cancellation (Function kept here)
    const handleCancelAppointment = async (appointmentId: number) => {
        setIsLoading(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 1000))
            setAppointments(prev =>
                prev.map(apt =>
                    apt.id === appointmentId ? { ...apt, status: 'cancelled' } : apt
                )
            )
            setShowCancelModal(null)
            alert('Đã hủy lịch hẹn thành công!')
        } catch (error) {
            alert('Có lỗi xảy ra. Vui lòng thử lại.')
        } finally {
            setIsLoading(false)
        }
    }

    // Handle account deletion (Function kept here)
    const handleDeleteAccount = async () => {
        setIsLoading(true)
        try {
            const userId = userprofile.id;
            const success = await deleteAccount(userId);

            if (success) {
                alert('Đã xóa tài khoản thành công.')
                setShowDeleteModal(false);
                //router.push('/login')
            } else {
                alert('Có lỗi xảy ra. Vui lòng thử lại.')
            }

        } catch (error) {
            alert('Có lỗi xảy ra. Vui lòng thử lại.')
        } finally {
            setIsLoading(false)
        }
    }

    // Utility functions (Kept here for shared use)
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed': return 'bg-green-100 text-green-800'
            case 'pending': return 'bg-yellow-100 text-yellow-800'
            case 'completed': return 'bg-blue-100 text-blue-800'
            case 'cancelled': return 'bg-red-100 text-red-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    const getStatusText = (status: string) => {
        switch (status) {
            case 'confirmed': return 'Đã xác nhận'
            case 'pending': return 'Chờ xác nhận'
            case 'completed': return 'Đã hoàn thành'
            case 'cancelled': return 'Đã hủy'
            default: return status
        }
    }

    return (
        <AuthGuard publicRoute={true}>
            <Header />

            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar (Kept here) */}
                    <div className="lg:w-1/4">
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                            {/* User Avatar & Basic Info */}
                            <div className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                                <div className="text-center">
                                    <div className="relative inline-block">
                                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold">
                                            {userprofile.fullName.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center border-2 border-white hover:bg-blue-700 transition-colors">
                                            <Camera className="w-3 h-3 text-white" />
                                        </button>
                                    </div>
                                    <h2 className="text-xl font-bold mt-3">{userprofile.fullName}</h2>
                                    <p className="text-blue-100 text-sm">{userprofile.email}</p>
                                    <div className="flex items-center justify-center mt-2">
                                        <div className="flex items-center text-sm">
                                            {userprofile.emailVerified && (<CheckCircle className="w-4 h-4 mr-1" />)}
                                            <span>Đã xác thực</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Navigation Menu */}
                            <div className="p-4">
                                <nav className="space-y-1">
                                    <button onClick={() => setActiveTab('profile')} className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors ${activeTab === 'profile' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}>
                                        <User className="w-5 h-5 mr-3" /> Thông tin cá nhân
                                    </button>
                                    <button onClick={() => setActiveTab('appointments')} className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors ${activeTab === 'appointments' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}>
                                        <Calendar className="w-5 h-5 mr-3" />
                                        <div className="flex-1">Lịch hẹn
                                            <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">
                                                {appointments.filter(apt => apt.status === 'confirmed' || apt.status === 'pending').length}
                                            </span>
                                        </div>
                                    </button>
                                    <button onClick={() => setActiveTab('records')} className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors ${activeTab === 'records' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}>
                                        <FileText className="w-5 h-5 mr-3" /> Hồ sơ y tế
                                    </button>
                                    <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors ${activeTab === 'settings' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}>
                                        <Settings className="w-5 h-5 mr-3" /> Cài đặt
                                    </button>
                                </nav>
                                <div className="mt-6 pt-4 border-t">
                                    <button className="w-full flex items-center px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                        <LogOut className="w-5 h-5 mr-3" /> Đăng xuất
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content (Uses new components) */}
                    <div className="lg:w-3/4">
                        {activeTab === 'profile' && (
                            <ProfileDetails
                                userProfile={userprofile}
                                setUserProfile={setUserprofile}
                                isLoading={isLoading}
                            />
                        )}

                        {activeTab === 'appointments' && (
                            <AppointmentsList
                                appointments={appointments}
                                setShowCancelModal={setShowCancelModal}
                                isLoading={isLoading}
                                getStatusColor={getStatusColor}
                                getStatusText={getStatusText}
                            />
                        )}

                        {activeTab === 'records' && (
                            <MedicalRecordsList
                                medicalRecords={medicalRecords}
                            />
                        )}

                        {activeTab === 'settings' && (
                            <SettingsManagement
                                setShowChangePassword={setShowChangePassword}
                                setShowDeleteModal={setShowDeleteModal}
                            />
                        )}
                    </div>
                </div>
            </div>

            <Footer />

            {/* Change Password Modal */}
            <ChangePasswordModal
                showChangePassword={showChangePassword}
                setShowChangePassword={setShowChangePassword}
                isLoading={isLoading}
                handleChangePassword={handleChangePassword}
                passwordForm={passwordForm}
                setPasswordForm={setPasswordForm}
                showPasswords={showPasswords}
                setShowPasswords={setShowPasswords}
            />

            {/* Cancel Appointment Modal */}
            <CancelAppointmentModal
                showCancelModal={showCancelModal}
                setShowCancelModal={setShowCancelModal}
                isLoading={isLoading}
                handleCancelAppointment={handleCancelAppointment}
            />

            {/* Delete Account Modal */}
            <DeleteAccountModal
                showDeleteModal={showDeleteModal}
                setShowDeleteModal={setShowDeleteModal}
                isDeleting={isDeleting}
                handleDeleteAccount={handleDeleteAccount}
            />
        </AuthGuard>
    )
}