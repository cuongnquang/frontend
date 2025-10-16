// components/admin/specialties/SpecialtyForm.tsx

import React, { useState, useEffect, useRef } from "react";
import { Microscope, FileText, Upload, X, Save, Edit, Image } from "lucide-react";
import { Specialty } from "@/contexts/SpecialtyContext";

// Dữ liệu form (gửi JSON)
type SpecialtyFormData = {
  name: string;
  description: string;
  image?: string | null; // base64 string (nếu có)
};

interface SpecialtyFormProps {
  initialData: Specialty | null;
  isEditMode: boolean;
  onSave: (data: SpecialtyFormData) => void;
  onCancel: () => void;
}

const initialFormData: SpecialtyFormData = {
  name: "",
  description: "",
  image: null,
};

// Hàm chuyển File → Base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export default function SpecialtyForm({
  initialData,
  isEditMode,
  onSave,
  onCancel,
}: SpecialtyFormProps) {
  const [formData, setFormData] = useState<SpecialtyFormData>(initialFormData);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditMode && initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description || "",
        image: initialData.image || null,
      });
      setImagePreview(initialData.image || "");
    } else {
      setFormData(initialFormData);
      setImagePreview("");
    }
  }, [initialData, isEditMode]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const processFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chỉ chọn tệp ảnh.");
      return;
    }

    const base64 = await fileToBase64(file);
    setFormData((prev) => ({ ...prev, image: base64 }));
    setImagePreview(base64);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, image: null }));
    setImagePreview("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Vui lòng nhập tên chuyên khoa.");
      return;
    }

    onSave(formData);
  };

  const title = isEditMode ? "Sửa chuyên khoa" : "Thêm chuyên khoa mới";
  const icon = isEditMode ? Edit : Microscope;
  const buttonText = isEditMode ? "Lưu thay đổi" : "Thêm chuyên khoa";

  return (
    <div className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl mx-auto w-full max-h-screen overflow-y-auto">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-8">
        <div className="p-2 bg-indigo-100 rounded-lg">
          {React.createElement(icon, { className: "w-6 h-6 text-indigo-600" })}
        </div>
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tên chuyên khoa */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-semibold text-gray-700 flex items-center mb-2 uppercase tracking-wide"
          >
            <Microscope className="w-4 h-4 mr-2 text-indigo-600" />
            Tên chuyên khoa <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400 outline-none" // THÊM outline-none
            placeholder="Ví dụ: Tim mạch"
            required
          />
        </div>

        {/* Mô tả */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-semibold text-gray-700 flex items-center mb-2 uppercase tracking-wide"
          >
            <FileText className="w-4 h-4 mr-2 text-blue-600" />
            Mô tả
          </label>
          <textarea
            id="description"
            name="description"
            rows={8}
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400 resize-none outline-none" // THÊM outline-none
            placeholder="Mô tả chi tiết về chuyên khoa..."
          />
        </div>

        {/* Ảnh chuyên khoa */}
        <div>
          <label
            htmlFor="image"
            className="block text-sm font-semibold text-gray-700 flex items-center mb-2 uppercase tracking-wide"
          >
            <Upload className="w-4 h-4 mr-2 text-green-600" />
            Ảnh chuyên khoa
          </label>

          {!imagePreview ? (
            /* Upload area */
            <div
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 transition cursor-pointer ${isDragActive
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-gray-300 bg-gray-50 hover:bg-indigo-50 hover:border-indigo-400"
                }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                id="image"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex flex-col items-center justify-center"
              >
                <Upload className="w-12 h-12 text-indigo-600 mb-3" />
                <span className="text-base font-medium text-gray-700">
                  Nhấn để chọn ảnh hoặc kéo thả vào
                </span>
                <span className="text-sm text-gray-500 mt-2">
                  PNG, JPG, GIF, WebP (Max. 5MB)
                </span>
              </button>
            </div>
          ) : (
            /* Image preview */
            <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <Image className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">
                      Xem trước ảnh
                    </p>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-40 h-40 object-cover rounded-lg border border-gray-200 shadow-sm"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="text-red-600 hover:text-red-900 hover:bg-red-50 p-2 rounded transition flex-shrink-0 mt-1"
                  title="Xóa ảnh"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Nút hành động */}
        <div className="flex justify-end space-x-3 pt-6 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 flex items-center transition font-medium"
          >
            <X className="w-4 h-4 mr-2" />
            Hủy
          </button>
          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 flex items-center transition font-medium"
          >
            <Save className="w-4 h-4 mr-2" />
            {buttonText}
          </button>
        </div>
      </form>
    </div>
  );
}