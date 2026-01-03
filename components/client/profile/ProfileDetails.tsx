import { User, Mail, Phone, MapPin, Calendar, CreditCard, Edit3, X, CheckCircle, Save, Eye, EyeOff, Camera } from 'lucide-react'
import { useState, Dispatch, SetStateAction, useEffect } from 'react'
import { vietnamProvinces, Province, District, Ward } from '@/lib/vietnam-address-data'
import { vietnamEthnicities } from '@/lib/vietnam-ethnicities'

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

interface ProfileDetailsProps {
    userProfile: UserProfile
    setUserProfile: Dispatch<SetStateAction<UserProfile>>
    isLoading: boolean
    onUpdateProfile: (profileData: UserProfile) => Promise<boolean>
}

export default function ProfileDetails({ userProfile, setUserProfile, isLoading, onUpdateProfile }: ProfileDetailsProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState(userProfile)
    const [isUpdating, setIsUpdating] = useState(false);
    
    // Address selection state
    const [selectedProvince, setSelectedProvince] = useState<string>('')
    const [selectedDistrict, setSelectedDistrict] = useState<string>('')
    const [selectedWard, setSelectedWard] = useState<string>('')
    const [customEthnicity, setCustomEthnicity] = useState(false)
    const [ethnicityInput, setEthnicityInput] = useState('')

    useEffect(() => {
        setEditForm(userProfile);
        if (userProfile.ethnicity && !vietnamEthnicities.includes(userProfile.ethnicity)) {
            setCustomEthnicity(true);
            setEthnicityInput(userProfile.ethnicity);
        } else {
            setCustomEthnicity(false);
        }
    }, [userProfile]);

    const parseAddress = (address: string) => {
        // Try to parse address format: "Phường/Xóm, Quận/Huyện/Xã, Tỉnh/TP"
        const parts = address.split(',').map(s => s.trim());
        if (parts.length >= 3) {
            const wardName = parts[0];
            const districtName = parts[1];
            const provinceName = parts[2];
            
            // Find matching province
            const province = vietnamProvinces.find(p => p.name === provinceName);
            if (province) {
                setSelectedProvince(province.code);
                const district = province.districts.find(d => d.name === districtName);
                if (district) {
                    setSelectedDistrict(district.code);
                    const ward = district.wards.find(w => w.name === wardName);
                    if (ward) {
                        setSelectedWard(ward.code);
                    }
                }
            }
        }
    }

    const validateForm = (): string | null => {
        if (!editForm.fullName || editForm.fullName.trim() === '') {
            return 'Vui lòng nhập họ và tên';
        }
        if (!editForm.phone || editForm.phone.trim() === '') {
            return 'Vui lòng nhập số điện thoại';
        }
        if (!editForm.address || editForm.address.trim() === '') {
            return 'Vui lòng nhập địa chỉ';
        }
        if (!editForm.gender) {
            return 'Vui lòng chọn giới tính';
        }
        if (!editForm.birthDate || editForm.birthDate.trim() === '') {
            return 'Vui lòng nhập ngày sinh';
        }
        return null;
    }

    // Handle address selection
    const handleProvinceChange = (provinceCode: string) => {
        setSelectedProvince(provinceCode);
        setSelectedDistrict('');
        setSelectedWard('');
        // Clear address when province changes
        setEditForm(prev => ({ ...prev, address: '' }));
    }

    const handleDistrictChange = (districtCode: string) => {
        setSelectedDistrict(districtCode);
        setSelectedWard('');
        // Clear address when district changes (will be updated when ward is selected)
        if (!districtCode) {
            setEditForm(prev => ({ ...prev, address: '' }));
        }
    }

    const handleWardChange = (wardCode: string) => {
        setSelectedWard(wardCode);
    }

    // Auto-update address when all three selections are made
    useEffect(() => {
        if (isEditing && selectedProvince && selectedDistrict && selectedWard) {
            const province = vietnamProvinces.find(p => p.code === selectedProvince);
            const district = province?.districts.find(d => d.code === selectedDistrict);
            const ward = district?.wards.find(w => w.code === selectedWard);
            
            if (province && district && ward) {
                const fullAddress = `${ward.name}, ${district.name}, ${province.name}`;
                setEditForm(prev => ({ ...prev, address: fullAddress }));
            }
        }
    }, [selectedProvince, selectedDistrict, selectedWard, isEditing]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault()
        if (isUpdating) return;

        // Validate required fields
        const validationError = validateForm();
        if (validationError) {
            alert(validationError);
            return;
        }

        setIsUpdating(true);
        const success = await onUpdateProfile(editForm);
        setIsUpdating(false);

        if (success) {
            setIsEditing(false);
        }
    }

    const selectedProvinceData = vietnamProvinces.find(p => p.code === selectedProvince);
    const selectedDistrictData = selectedProvinceData?.districts.find(d => d.code === selectedDistrict);
    const availableDistricts = selectedProvinceData?.districts || [];
    const availableWards = selectedDistrictData?.wards || [];

    return (
        <div className="bg-white text-black rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Thông tin cá nhân
                    </h1>
                    <button
                        onClick={() => {
                            if (isEditing) {
                                // Cancel editing - reset form
                                setIsEditing(false);
                                setEditForm(userProfile);
                                setSelectedProvince('');
                                setSelectedDistrict('');
                                setSelectedWard('');
                                setCustomEthnicity(false);
                                setEthnicityInput('');
                            } else {
                                // Start editing
                                setIsEditing(true);
                                setEditForm(userProfile);
                                // Try to parse existing address
                                if (userProfile.address) {
                                    parseAddress(userProfile.address);
                                }
                            }
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
                {isEditing && (!userProfile.birthDate || !userProfile.address) && (
                    <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
                        Vui lòng hoàn tất thông tin cá nhân của bạn để có trải nghiệm tốt nhất.
                    </div>
                )}
                <form onSubmit={handleUpdateProfile}>
                    <div className="grid md:grid-cols-2 text-black gap-6">
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

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <input
                                    type="email"
                                    value={editForm.email}
                                    disabled={true}
                                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 border-gray-200`}
                                />
                                {userProfile.emailVerified && (
                                    <CheckCircle className="absolute right-3 top-3 h-5 w-5 text-green-500" />
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <input
                                    type="tel"
                                    value={editForm.phone}
                                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                    disabled={!isEditing}
                                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isEditing ? 'border-gray-300' : 'bg-gray-50 border-gray-200'}`}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Ngày sinh <span className="text-red-500">*</span></label>
                            <input
                                type="date"
                                value={editForm.birthDate}
                                onChange={(e) => setEditForm({ ...editForm, birthDate: e.target.value })}
                                disabled={!isEditing}
                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isEditing ? 'border-gray-300' : 'bg-gray-50 border-gray-200'}`}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Giới tính <span className="text-red-500">*</span></label>
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

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Số CMND/CCCD</label>
                            <div className="relative">
                                <CreditCard className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={editForm.identityNumber || ''}
                                    onChange={(e) => setEditForm({ ...editForm, identityNumber: e.target.value || null })}
                                    disabled={!isEditing}
                                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isEditing ? 'border-gray-300' : 'bg-gray-50 border-gray-200'}`}
                                    placeholder="Nhập số CMND/CCCD"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Dân tộc</label>
                            <div className="space-y-2">
                                <select
                                    value={customEthnicity ? 'custom' : (editForm.ethnicity || '')}
                                    onChange={(e) => {
                                        if (e.target.value === 'custom') {
                                            setCustomEthnicity(true);
                                            setEthnicityInput(editForm.ethnicity || '');
                                        } else {
                                            setCustomEthnicity(false);
                                            setEditForm({ ...editForm, ethnicity: e.target.value });
                                        }
                                    }}
                                    disabled={!isEditing}
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isEditing ? 'border-gray-300' : 'bg-gray-50 border-gray-200'}`}
                                >
                                    <option value="">-- Chọn dân tộc --</option>
                                    {vietnamEthnicities.map((ethnicity) => (
                                        <option key={ethnicity} value={ethnicity}>
                                            {ethnicity}
                                        </option>
                                    ))}
                                    <option value="custom">Khác (Nhập tay)</option>
                                </select>
                                {customEthnicity && (
                                    <input
                                        type="text"
                                        value={ethnicityInput}
                                        onChange={(e) => {
                                            setEthnicityInput(e.target.value);
                                            setEditForm({ ...editForm, ethnicity: e.target.value });
                                        }}
                                        disabled={!isEditing}
                                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isEditing ? 'border-gray-300' : 'bg-gray-50 border-gray-200'}`}
                                        placeholder="Nhập dân tộc"
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ <span className="text-red-500">*</span></label>
                        {!isEditing ? (
                            // Display mode: show address as text
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <div className="w-full pl-10 pr-4 py-3 border rounded-lg bg-gray-50 border-gray-200 text-gray-700">
                                    {editForm.address || 'Chưa có địa chỉ'}
                                </div>
                            </div>
                        ) : (
                            // Edit mode: show dropdown selectors
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">Tỉnh/Thành phố</label>
                                        <select
                                            value={selectedProvince}
                                            onChange={(e) => handleProvinceChange(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">-- Chọn Tỉnh/TP --</option>
                                            {vietnamProvinces.map((province) => (
                                                <option key={province.code} value={province.code}>
                                                    {province.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">Quận/Huyện/Xã</label>
                                        <select
                                            value={selectedDistrict}
                                            onChange={(e) => handleDistrictChange(e.target.value)}
                                            disabled={!selectedProvince}
                                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${selectedProvince ? 'border-gray-300' : 'bg-gray-50 border-gray-200'}`}
                                        >
                                            <option value="">-- Chọn Quận/Huyện/Xã --</option>
                                            {availableDistricts.map((district) => (
                                                <option key={district.code} value={district.code}>
                                                    {district.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">Phường/Xóm</label>
                                        <select
                                            value={selectedWard}
                                            onChange={(e) => handleWardChange(e.target.value)}
                                            disabled={!selectedDistrict}
                                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${selectedDistrict ? 'border-gray-300' : 'bg-gray-50 border-gray-200'}`}
                                        >
                                            <option value="">-- Chọn Phường/Xóm --</option>
                                            {availableWards.map((ward) => (
                                                <option key={ward.code} value={ward.code}>
                                                    {ward.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                {editForm.address && (
                                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                        <p className="text-sm text-gray-700">
                                            <MapPin className="inline w-4 h-4 mr-1" />
                                            <strong>Địa chỉ đã chọn:</strong> {editForm.address}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

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
                                disabled={isUpdating || isLoading}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
                            >
                                {isUpdating ? (
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