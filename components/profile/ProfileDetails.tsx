import { User, Mail, Phone, MapPin, Calendar, CreditCard, Edit3, X, CheckCircle, Save, Eye, EyeOff, Camera } from 'lucide-react'
import { useState, Dispatch, SetStateAction } from 'react'

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

interface ProfileDetailsProps {
    userProfile: UserProfile
    setUserProfile: Dispatch<SetStateAction<UserProfile>>
    isLoading: boolean
}

export default function ProfileDetails({ userProfile, setUserProfile, isLoading }: ProfileDetailsProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [editForm, setEditForm] = useState(userProfile)

    // Handle profile update (Same logic as in original page.tsx)
    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault()
        // Simulate API call and state update
        await new Promise(resolve => setTimeout(resolve, 1000))
        setUserProfile(editForm)
        setIsEditing(false)
        alert('Cập nhật thông tin thành công!')
    }

    return (
        <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Thông tin cá nhân
                    </h1>
                    <button
                        onClick={() => {
                            setIsEditing(!isEditing)
                            if (!isEditing) setEditForm(userProfile)
                        }}
                        className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${isEditing
                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                    >
                        {isEditing ? (
                            <>
                                <X className="w-4 h-4 mr-2" />
                                Hủy
                            </>
                        ) : (
                            <>
                                <Edit3 className="w-4 h-4 mr-2" />
                                Chỉnh sửa
                            </>
                        )}
                    </button>
                </div>
            </div>

            <div className="p-6">
                <form onSubmit={handleUpdateProfile}>
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Full Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={editForm.fullName}
                                    onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                                    disabled={!isEditing}
                                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isEditing ? 'border-gray-300' : 'bg-gray-50 border-gray-200'}`}
                                />
                            </div>
                        </div>

                        {/* Email (Read-only for editing, but shows verification status) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <input
                                    type="email"
                                    value={editForm.email}
                                    disabled={true} // Email is often not editable here
                                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 border-gray-200`}
                                />
                                {userProfile.emailVerified && (
                                    <CheckCircle className="absolute right-3 top-3 h-5 w-5 text-green-500" />
                                )}
                            </div>
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <input
                                    type="tel"
                                    value={editForm.phone}
                                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                    disabled={!isEditing}
                                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isEditing ? 'border-gray-300' : 'bg-gray-50 border-gray-200'}`}
                                />
                                {!userProfile.phoneVerified && (
                                    <button type="button" className="absolute right-3 top-3 text-xs text-blue-600 hover:text-blue-700">
                                        Xác thực
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Birth Date, Gender, Insurance Number */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Ngày sinh</label>
                            <input
                                type="date"
                                value={editForm.birthDate}
                                onChange={(e) => setEditForm({ ...editForm, birthDate: e.target.value })}
                                disabled={!isEditing}
                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isEditing ? 'border-gray-300' : 'bg-gray-50 border-gray-200'}`}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Giới tính</label>
                            <select
                                value={editForm.gender}
                                onChange={(e) => setEditForm({ ...editForm, gender: e.target.value as any })}
                                disabled={!isEditing}
                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isEditing ? 'border-gray-300' : 'bg-gray-50 border-gray-200'}`}
                            >
                                <option value="male">Nam</option>
                                <option value="female">Nữ</option>
                                <option value="other">Khác</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Số BHYT</label>
                            <div className="relative">
                                <CreditCard className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={editForm.insuranceNumber || ''}
                                    onChange={(e) => setEditForm({ ...editForm, insuranceNumber: e.target.value })}
                                    disabled={!isEditing}
                                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isEditing ? 'border-gray-300' : 'bg-gray-50 border-gray-200'}`}
                                    placeholder="Nhập số thẻ BHYT"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Address */}
                    <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <textarea
                                value={editForm.address}
                                onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                                disabled={!isEditing}
                                rows={3}
                                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isEditing ? 'border-gray-300' : 'bg-gray-50 border-gray-200'}`}
                            />
                        </div>
                    </div>

                    {/* Emergency Contact */}
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Liên hệ khẩn cấp</h3>
                        <div className="grid md:grid-cols-3 gap-4">
                            {/* ... (Emergency Contact fields similar to above) ... */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Họ tên</label>
                                <input
                                    type="text"
                                    value={editForm.emergencyContact?.name || ''}
                                    onChange={(e) => setEditForm({
                                        ...editForm,
                                        emergencyContact: { ...editForm.emergencyContact!, name: e.target.value }
                                    })}
                                    disabled={!isEditing}
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isEditing ? 'border-gray-300' : 'bg-gray-50 border-gray-200'}`}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
                                <input
                                    type="tel"
                                    value={editForm.emergencyContact?.phone || ''}
                                    onChange={(e) => setEditForm({
                                        ...editForm,
                                        emergencyContact: { ...editForm.emergencyContact!, phone: e.target.value }
                                    })}
                                    disabled={!isEditing}
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isEditing ? 'border-gray-300' : 'bg-gray-50 border-gray-200'}`}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Mối quan hệ</label>
                                <input
                                    type="text"
                                    value={editForm.emergencyContact?.relationship || ''}
                                    onChange={(e) => setEditForm({
                                        ...editForm,
                                        emergencyContact: { ...editForm.emergencyContact!, relationship: e.target.value }
                                    })}
                                    disabled={!isEditing}
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isEditing ? 'border-gray-300' : 'bg-gray-50 border-gray-200'}`}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Save Button */}
                    {isEditing && (
                        <div className="mt-8 flex items-center justify-end space-x-4">
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Đang lưu...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        Lưu thay đổi
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    )
}