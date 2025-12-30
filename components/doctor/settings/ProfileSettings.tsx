'use client';
import { useEffect, useMemo, useState } from "react";
import { User, Briefcase, Upload, Save, Camera, Mail, Phone, MapPin, Award, GraduationCap, DollarSign } from "lucide-react";
import { FormInput } from "@/components/ui/FormInput";
import { FormTextarea } from "@/components/ui/FormTextarea";
import { doctorProfile, allSpecializations } from "@/app/doctor/data";
import { useAuth } from "@/contexts/AuthContext";
import { useDoctor } from "@/contexts/DoctorContext";

export const ProfileSettings = () => {
  const { user } = useAuth();
  const { doctors, fetchDoctors, loading, error } = useDoctor();

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  const doctorFromContext = useMemo(
    () => doctors.find((doc) => doc.user_id === user?.user_id) || null,
    [doctors, user?.user_id]
  );

  const parsedSpecializations = useMemo(() => {
    if (doctorFromContext?.specializations) {
      return doctorFromContext.specializations.split(",").map((s) => s.trim()).filter(Boolean);
    }
    return doctorProfile.specializations;
  }, [doctorFromContext]);

  const [selectedSpecializations, setSelectedSpecializations] = useState<string[]>(parsedSpecializations);

  useEffect(() => {
    setSelectedSpecializations(parsedSpecializations);
  }, [parsedSpecializations]);

  const profileData = useMemo(() => ({
    full_name: doctorFromContext?.full_name || user?.full_name || doctorProfile.full_name,
    title: doctorFromContext?.title || doctorProfile.title,
    specializations: parsedSpecializations,
    introduction: doctorFromContext?.introduction || doctorProfile.introduction,
    avatar_url: doctorFromContext?.avatar_url || doctorProfile.avatar_url,
    experience_years: doctorFromContext?.experience_years ?? doctorProfile.experience_years,
    email: user?.email || doctorProfile.email,
    phone: doctorFromContext?.phone || doctorProfile.phone, // phone không có trong Doctor type, fallback mock
    address: doctorFromContext?.clinic_address || doctorProfile.address,
    consultation_fee: doctorFromContext?.consultation_fee || doctorProfile.consultation_fee, // field không có, fallback
    education: doctorProfile.education,
    certifications: doctorProfile.certifications,
  }), [doctorFromContext, parsedSpecializations, user]);

  const toggleSpecialization = (spec) => {
    setSelectedSpecializations(prev => prev.includes(spec) ? prev.filter(s => s !== spec) : [...prev, spec]);
  };

  return (
    <form className="bg-white rounded-lg border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Thông tin hồ sơ chuyên môn</h2>
        <p className="text-sm text-gray-600 mt-1">Thông tin này sẽ hiển thị công khai cho bệnh nhân</p>
      </div>
      <div className="p-6 space-y-6">
        {/* Avatar Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Ảnh đại diện</label>
          <div className="flex items-center space-x-6">
            <div className="relative">
              <img
                className="h-24 w-24 rounded-full ring-4 ring-gray-100 object-cover"
                src={profileData.avatar_url}
                alt="Avatar"
              />
              <button
                type="button"
                className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 shadow-lg"
              >
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <div>
              <button
                type="button"
                className="flex items-center px-4 py-2 border border-gray-300 bg-white rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <Upload className="h-4 w-4 mr-2" />
                Tải ảnh lên
              </button>
              <p className="text-xs text-gray-500 mt-2">JPG, PNG hoặc GIF. Tối đa 2MB.</p>
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label="Họ tên"
            type="text"
            name="full_name"
            icon={User}
            defaultValue={profileData.full_name}
            required
          />
          <FormInput
            label="Chức danh"
            type="text"
            name="title"
            icon={Award}
            defaultValue={profileData.title || ""}
            required
          />
        </div>

        {/* Specializations */}
        <div>
          <label className="text-black block text-sm font-medium mb-3">
            Chuyên môn <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {allSpecializations.map(spec => (
              <label
                key={spec}
                className={`flex items-center px-4 py-3 border-2 rounded-lg cursor-pointer transition-all ${selectedSpecializations.includes(spec)
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
                  }`}
              >
                <input
                  type="checkbox"
                  checked={selectedSpecializations.includes(spec)}
                  onChange={() => toggleSpecialization(spec)}
                  className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-black text-sm font-medium">{spec}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Experience & Fee */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label="Số năm kinh nghiệm"
            type="number"
            name="experience_years"
            icon={Briefcase}
            defaultValue={profileData.experience_years ?? ""}
            min="0"
            required
          />
          <FormInput
            label="Phí tư vấn (VNĐ)"
            type="number"
            name="consultation_fee"
            icon={DollarSign}
            defaultValue={profileData.consultation_fee ?? ""}
            min="0"
            required
          />
        </div>

        {/* Introduction */}
        <FormTextarea
          label="Giới thiệu bản thân"
          name="introduction"
          rows={5}
          defaultValue={profileData.introduction || ""}
          placeholder="Mô tả về kinh nghiệm, chuyên môn và phương pháp điều trị..."
        />

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label="Email"
            type="email"
            name="email"
            icon={Mail}
            defaultValue={profileData.email}
            required
          />
          <FormInput
            label="Số điện thoại"
            type="tel"
            name="phone"
            icon={Phone}
            defaultValue={profileData.phone}
            required
          />
        </div>

        <FormInput
          label="Địa chỉ phòng khám"
          type="text"
          name="address"
          icon={MapPin}
          defaultValue={profileData.address}
        />

        {/* Education */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Học vấn
          </label>
          <div className="space-y-3">
            {profileData.education.map((edu, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <GraduationCap className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">{edu.degree}</p>
                    <p className="text-sm text-gray-600">{edu.institution} • {edu.year}</p>
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-gray-400 hover:text-gray-700"
            >
              + Thêm học vấn
            </button>
          </div>
        </div>

        {/* Certifications */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Chứng chỉ
          </label>
          <div className="space-y-3">
            {profileData.certifications.map((cert, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Award className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">{cert.name}</p>
                    <p className="text-sm text-gray-600">{cert.org} • {cert.year}</p>
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-gray-400 hover:text-gray-700"
            >
              + Thêm chứng chỉ
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
        <button
          type="submit"
          className="flex items-center px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
        >
          <Save className="h-4 w-4 mr-2" />
          Lưu thay đổi
        </button>
      </div>
    </form>
  )
};