'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import {
    User, Calendar, Settings, LogOut, CheckCircle, FileText, Camera
} from 'lucide-react'

import ProfileDetails from '@/components/client/profile/ProfileDetails'
import AppointmentsList from '@/components/client/profile/AppointmentsList'
import MedicalRecordsList from '@/components/client/profile/MedicalRecordsList'
import SettingsManagement from '@/components/client/profile/SettingsManagement'
import ChangePasswordModal from '@/components/client/profile/ChangePasswordModal'
import CancelAppointmentModal from '@/components/client/profile/CancelAppointmentModal'
import DeleteAccountModal from '@/components/client/profile/DeleteAccountModal'
import { useDeleteAccount } from '@/hooks/useDeleteAccount';
import { PatientAppointment } from '@/hooks/usePatientAppointments';
import { useAuth } from '@/contexts/AuthContext';
import { usePatient, UpdatePatientData } from '@/contexts/PatientContext';
import { apiClient } from '@/lib/api';
import { useAlert } from '@/components/ui/AlertContainer';

interface UserProfile {
    id: string
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
    identityNumber?: string | null
    ethnicity?: string
    referralCode?: string
    occupation?: string
    emergencyContact?: {
        name: string
        phone: string
        relationship: string
    }
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
    const { user, logout, refreshUser } = useAuth();
    const { selectedPatient, fetchPatientById, patchPatient } = usePatient();
    const { showAlert } = useAlert();
    const [activeTab, setActiveTab] = useState<'profile' | 'appointments' | 'records' | 'settings'>('profile')
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showCancelModal, setShowCancelModal] = useState<string | number | null>(null)
    const [showChangePassword, setShowChangePassword] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null);
    const { isDeleting, deleteAccount } = useDeleteAccount();
    
    const [userProfile, setUserProfile] = useState<UserProfile>({
        id: '',
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
        identityNumber: null,
        ethnicity: '',
        referralCode: '',
        occupation: '',
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
    // Fetch patient data when user is available
    useEffect(() => {
        const loadPatientData = async () => {
            if (user && user.patientId) {
                try {
                    await fetchPatientById(user.patientId);
                } catch (err) {
                    console.error('Error fetching patient data:', err);
                }
            }
        };
        loadPatientData();
    }, [user?.patientId, fetchPatientById]);

    // Update userProfile when selectedPatient is loaded
    useEffect(() => {
        if (selectedPatient) {
            // Format date_of_birth from ISO string to YYYY-MM-DD
            const formatDateToInput = (dateString: string) => {
                if (!dateString) return '';
                const date = new Date(dateString);
                if (isNaN(date.getTime())) return '';
                return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
            };

            setUserProfile(prevProfile => ({
                ...prevProfile,
                id: selectedPatient.id || '',
                fullName: selectedPatient.full_name || '',
                email: selectedPatient.email || '',
                phone: selectedPatient.phone_number || '',
                birthDate: formatDateToInput(selectedPatient.date_of_birth) || prevProfile.birthDate,
                gender: selectedPatient.gender || prevProfile.gender,
                address: selectedPatient.address || prevProfile.address || '',
                avatar: '',
                joinDate: selectedPatient.createdAt || prevProfile.joinDate,
                emailVerified: false,
                phoneVerified: false,
                insuranceNumber: selectedPatient.health_insurance_number || '',
                identityNumber: selectedPatient.identity_number || null,
                ethnicity: selectedPatient.ethnicity || '',
                referralCode: selectedPatient.referral_code || '',
                occupation: selectedPatient.occupation || '',
                emergencyContact: prevProfile.emergencyContact,
            }));
        } else if (user) {
            // Fallback to user data if patient data is not available
            setUserProfile(prevProfile => ({
                ...prevProfile,
                id: user.patientId || user.user_id || '',
                fullName: user.full_name || '',
                email: user.email || '',
                phone: '',
                birthDate: '',
                gender: 'other',
                address: '',
                avatar: '',
                joinDate: user.createdAt || prevProfile.joinDate,
                emailVerified: false,
                phoneVerified: false,
                insuranceNumber: '',
                identityNumber: null,
                ethnicity: '',
                referralCode: '',
                occupation: '',
                emergencyContact: prevProfile.emergencyContact,
            }));
        }
    }, [selectedPatient, user]);

    const [appointments, setAppointments] = useState<PatientAppointment[]>([]);
    const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;
            setIsLoading(true);
            setError(null);
            try {
                // First fetch current patient's profile to obtain patient_id
                const patientRes = await apiClient('/api/patients/me');

                let appointmentsRes: any = { status: true, data: [] };
                if (patientRes.status && patientRes.data) {
                    const patientId = (patientRes.data as any).id || (patientRes.data as any).patient_id || (patientRes.data as any).patientId || '';
                    console.debug('Profile: current patient id', patientId);
                    // Use patient-specific endpoint which enforces access control server-side
                    appointmentsRes = await apiClient('/api/appointments/patient-medical-history');
                } else {
                    // Fallback: try generic appointments endpoint (may be paginated or restricted)
                    appointmentsRes = await apiClient('/api/appointments/patient-medical-history');
                }

                const recordsRes = await apiClient('/api/medical-records');

                console.debug('Profile: appointments raw response', appointmentsRes);

                if (appointmentsRes.status && appointmentsRes.data) {
                    // Backend may return either an array or a paginated object { data: AppointmentDTO[], pagination }
                    let rawList: any[] = [];
                    if (Array.isArray(appointmentsRes.data)) {
                        rawList = appointmentsRes.data;
                    } else if (appointmentsRes.data && Array.isArray((appointmentsRes.data as any).data)) {
                        rawList = (appointmentsRes.data as any).data;
                    }

                    const normalized = rawList.map((a: any) => ({
                        id: a.id || a.appointment_id || String(a.appointment_id || a.id || ''),
                        patient_id: a.patient_id || '',
                        patient_name: a.patient_name || '',
                        doctor_id: a.doctor_id || (a.Doctor && a.Doctor.id) || '',
                        doctor_name: a.doctor_name || (a.Doctor && a.Doctor.full_name) || '',
                        doctor_specialty: a.doctor_specialty || (a.Doctor && a.Doctor.Specialty && a.Doctor.Specialty.name) || '',
                        doctor_avatar: a.doctor_avatar || (a.Doctor && a.Doctor.avatar_url) || '',
                        schedule_date: a.schedule_date || a.appointment_date || '',
                        start_time: a.start_time || '',
                        end_time: a.end_time || '',
                        hospital: a.doctor_workplace || (a.Doctor && (a.Doctor.workplace || a.Doctor.clinic_address)) || a.hospital || '',
                        symptoms: a.symptoms || '',
                        notes: a.notes || '',
                        status: a.status || 'pending',
                        price: a.price ? String(a.price) : undefined,
                        createdAt: a.created_at || '',
                        updatedAt: a.updated_at || ''
                    }));

                    setAppointments(normalized);
                } else {
                    setError(appointmentsRes.message || 'Không thể tải lịch hẹn.');
                }

                if (recordsRes.status && recordsRes.data) {
                    setMedicalRecords(recordsRes.data);
                } else {
                    setError(prev => `${prev ? prev + ' ' : ''}${recordsRes.message || 'Không thể tải hồ sơ y tế.'}`);
                }
            } catch (err) {
                console.error('Error loading profile data', err);
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
        if (!user?.patientId) {
            alert('Không tìm thấy thông tin bệnh nhân. Vui lòng đăng nhập lại.');
            return false;
        }

        setIsLoading(true);
        try {
            // Map UserProfile to Patient update data
            // UpdatePatientData doesn't accept null, only undefined
            const updateData: UpdatePatientData = {
                full_name: profileData.fullName,
                email: profileData.email,
                phone_number: profileData.phone,
                date_of_birth: profileData.birthDate,
                gender: profileData.gender,
                address: profileData.address !== '' ? profileData.address : undefined,
                health_insurance_number: profileData.insuranceNumber ? profileData.insuranceNumber : undefined,
                identity_number: profileData.identityNumber ? profileData.identityNumber : undefined,
                ethnicity: profileData.ethnicity ? profileData.ethnicity : undefined,
            };

            // Use patchPatient with patientId from AuthContext
            const result = await patchPatient(user.patientId, updateData);

            if (!result.success) {
                alert(result.message || 'Cập nhật thất bại!');
                return false;
            } else {
                // Refresh patient data
                await fetchPatientById(user.patientId);
                await refreshUser(); // Tải lại thông tin user trong context
                alert('Cập nhật thông tin thành công!');
                return true;
            }
        } catch (error) {
            console.error('Error updating profile:', error);
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

    const handleCancelAppointment = async (appointmentId: string | number) => {
        setIsLoading(true)
        try {
            const idStr = String(appointmentId)
            const idNum = parseInt(idStr, 10)
            const res = await apiClient(`/api/appointments/${idStr}/actions/cancel`, {
                method: 'POST'
            });
            if (res.status) {
                setAppointments(prev =>
                    prev.map(apt =>
                        apt.id === idNum ? { ...apt, status: 'cancelled' } : apt
                    )
                )
                setShowCancelModal(null)
                showAlert('Đã hủy lịch hẹn thành công!', 'success')
            } else { throw new Error(res.message || 'Hủy lịch hẹn thất bại'); }
        } catch (error) {
            showAlert('Có lỗi xảy ra. Vui lòng thử lại.', 'error')
        } finally {
            setIsLoading(false)
        }
    }

    const handleDeleteAccount = async () => {
        setIsLoading(true)
        try {
            // deleteAccount expects a number, but user_id might be string
            // Use user.user_id if available, otherwise try to parse userProfile.id
            const userId = user?.user_id ? parseInt(user.user_id, 10) : parseInt(userProfile.id, 10);
            if (isNaN(userId)) {
                alert('Không tìm thấy ID người dùng hợp lệ.');
                return;
            }
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