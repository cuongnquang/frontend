'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import {
    User, Calendar, Settings, LogOut, CheckCircle, FileText, Camera
} from 'lucide-react'

import ProfileDetails from '@/components/profile/ProfileDetails'
import AppointmentsList from '@/components/profile/AppointmentsList'
import MedicalRecordsList from '@/components/profile/MedicalRecordsList'
import SettingsManagement from '@/components/profile/SettingsManagement'
import ChangePasswordModal from '@/components/profile/ChangePasswordModal'
import CancelAppointmentModal from '@/components/profile/CancelAppointmentModal'
import DeleteAccountModal from '@/components/profile/DeleteAccountModal'
import { useDeleteAccount } from '@/hooks/useDeleteAccount';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';

interface UserProfile {
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

export default function ProfilePage() {
    const searchParams = useSearchParams();
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState<'profile' | 'appointments' | 'records' | 'settings'>('profile')
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showCancelModal, setShowCancelModal] = useState<number | null>(null)
    const [showChangePassword, setShowChangePassword] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    // const [error, setError] = useState<string | null>(null);
    const { isDeleting, deleteAccount } = useDeleteAccount();
    
    const [userProfile, setUserProfile] = useState<User>({
        id: 0,
        fullName: '',
        email: '',
        phone: '',
        birthDate: '',
        gender: 'other',
        address: '',
        avatar: '',
        joinDate: '',
        emailVerified: false,
        phoneVerified: false,
        insuranceNumber: '',
        emergencyContact: {
            name: '',
            phone: '',
            relationship: ''
        }
    })

    useEffect(() => {
        // Ưu tiên tham số 'tab' từ URL
        const tab = searchParams.get('tab');
        if (tab === 'settings' || tab === 'appointments' || tab === 'records' || tab === 'profile') {
            setActiveTab(tab);
            // Xóa tab đã lưu trong localStorage nếu có để tránh xung đột
            localStorage.removeItem('activeProfileTab');
            return;
        }

        // Nếu không có tham số URL, kiểm tra localStorage
        const savedTab = localStorage.getItem('activeProfileTab');
        if (savedTab === 'settings' || savedTab === 'appointments' || savedTab === 'records' || savedTab === 'profile') {
            setActiveTab(savedTab);
            localStorage.removeItem('activeProfileTab'); // Xóa sau khi sử dụng
        }
    }, [searchParams]);
    useEffect(() => {
        if (user) {
            setUserProfile(prevProfile => ({
                ...prevProfile,
                id: user.user_id || 0,
                fullName: user.full_name || '',
                email: user.email || '',
                phone: user.phone || '',
                birthDate: user.birthDate || prevProfile.birthDate,
                gender: user.gender || prevProfile.gender,
                address: user.address || prevProfile.address,
                avatar: user.avatar || prevProfile.avatar,
                joinDate: user.joinDate || prevProfile.joinDate,
                emailVerified: user.emailVerified || false,
                phoneVerified: user.phoneVerified || false,
                insuranceNumber: user.insuranceNumber || '',
                emergencyContact: user.emergencyContact || prevProfile.emergencyContact,
            }));
        }
    }, [user]);

    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;
            setIsLoading(true);
            setError(null);
            try {
                const [appointmentsRes, recordsRes] = await Promise.all([
                    apiClient.get<Appointment[]>('/api/appointments'),
                    apiClient.get<MedicalRecord[]>('/api/medical-records')
                ]);

                if (appointmentsRes.status && appointmentsRes.data) {
                    setAppointments(appointmentsRes.data);
                } else {
                    setError(appointmentsRes.message || 'Không thể tải lịch hẹn.');
                }

                if (recordsRes.status && recordsRes.data) {
                    setMedicalRecords(recordsRes.data);
                } else {
                    setError(prev => `${prev ? prev + ' ' : ''}${recordsRes.message || 'Không thể tải hồ sơ y tế.'}`);
                }
            } catch (err) {
                setError('Đã xảy ra lỗi khi tải dữ liệu trang hồ sơ.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [user]);

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

    const handleUpdateProfile = async (profileData: UserProfile) => {
        setIsLoading(true);
        try {
            const res = await apiClient(`/api/user/profile`, {
                method: 'PUT',
                body: JSON.stringify(profileData),
            });

            if (!res.status) {
                alert(res.message || 'Cập nhật thất bại!');
                return false;
            } else {
                await fetchProfile(); // Tải lại thông tin user trong context
                alert('Cập nhật thông tin thành công!');
                return true;
            }
        } catch (error) {
            alert('Có lỗi xảy ra khi cập nhật.');
            return false;
        } finally {
            setIsLoading(false);
        }
    }

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
            const res = await apiClient('/api/user/change-password', {
                method: 'POST',
                body: JSON.stringify(passwordForm)
            });
            if (!res.status) throw new Error(res.message || 'Đổi mật khẩu thất bại');

            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
            setShowChangePassword(false)
            alert('Đổi mật khẩu thành công!')
        } catch (error) {
            alert('Có lỗi xảy ra. Vui lòng thử lại.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleCancelAppointment = async (appointmentId: number) => {
        setIsLoading(true)
        try {
            const res = await apiClient(`/api/appointments/${appointmentId}/cancel`, {
                method: 'PATCH'
            });
            if (res.status) {
                setAppointments(prev =>
                    prev.map(apt =>
                        apt.id === appointmentId ? { ...apt, status: 'cancelled' } : apt
                    )
                )
                setShowCancelModal(null)
                alert('Đã hủy lịch hẹn thành công!')
            } else { throw new Error(res.message || 'Hủy lịch hẹn thất bại'); }
        } catch (error) {
            alert('Có lỗi xảy ra. Vui lòng thử lại.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleDeleteAccount = async () => {
        setIsLoading(true)
        try {
            const userId = userProfile.id;
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
        <div className='bg-gray-50'>
            <Header />

            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="lg:w-1/4">
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                            <div className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                                <div className="text-center">
                                    <div className="relative inline-block">
                                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold">
                                            {userProfile.fullName.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center border-2 border-white hover:bg-blue-700 transition-colors">
                                            <Camera className="w-3 h-3 text-white" />
                                        </button>
                                    </div>
                                    <h2 className="text-xl font-bold mt-3">{userProfile.fullName}</h2>
                                    <p className="text-blue-100 text-sm">{userProfile.email}</p>
                                    <div className="flex items-center justify-center mt-2">
                                        <div className="flex items-center text-sm">
                                            {userProfile.emailVerified && (<CheckCircle className="w-4 h-4 mr-1" />)}
                                            <span>Đã xác thực</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

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
                                    <button onClick={logout} className="w-full flex items-center px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                        <LogOut className="w-5 h-5 mr-3" /> Đăng xuất
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:w-3/4">
                        {activeTab === 'profile' && (
                            <ProfileDetails
                                userProfile={userProfile}
                                setUserProfile={setUserProfile}
                                isLoading={isLoading}
                                onUpdateProfile={handleUpdateProfile}
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

            <CancelAppointmentModal
                showCancelModal={showCancelModal}
                setShowCancelModal={setShowCancelModal}
                isLoading={isLoading}
                handleCancelAppointment={handleCancelAppointment}
            />

            <DeleteAccountModal
                showDeleteModal={showDeleteModal}
                setShowDeleteModal={setShowDeleteModal}
                isDeleting={isDeleting}
                handleDeleteAccount={handleDeleteAccount}
            />
        </div>
    )
}