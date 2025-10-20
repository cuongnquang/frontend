"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { apiClient } from "@/lib/api";
import { Specialty } from "@/types/types";


export type CreateSpecialtyData = {
  name: string;
  description?: string;
  image_url?: string;
};

export type UpdateSpecialtyData = Partial<CreateSpecialtyData>;

interface SpecialtyContextType {
    specialties: Specialty[];
    selectedSpecialty: Specialty | null;
    loading: boolean;
    error: string | null;
    fetchSpecialties: () => Promise<void>;
    fetchSpecialtyById: (id: string) => Promise<void>;
    createSpecialty: (data: CreateSpecialtyData) => Promise<{ success: boolean; message: string }>;
    updateSpecialty: (id: string, data: UpdateSpecialtyData) => Promise<{ success: boolean; message: string }>;
    deleteSpecialty: (id: string) => Promise<{ success: boolean; message: string }>;
}

const SpecialtyContext = createContext<SpecialtyContextType | undefined>(undefined);

export function SpecialtyProvider({ children }: { children: ReactNode }) {
    const [specialties, setSpecialties] = useState<Specialty[]>([]);
    const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSpecialties = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Append a query flag so the server proxy can optionally retry using a
            // server-side BACKEND_SERVICE_TOKEN for read-only public lists if the
            // user's token lacks permission. This is safe because the service token
            // is only used server-side and never exposed to the browser.
            const res = await apiClient<Specialty[]>('/api/specialties?service_token=1');
            if (res.status && res.data) {
                setSpecialties(res.data);
            } else {
                setError(res.message || "Không thể tải danh sách chuyên khoa.");
            }
        } catch {
            setError("Lỗi kết nối đến server.");
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchSpecialtyById = useCallback(async (id: string) => {
        setError(null);
        setSelectedSpecialty(null);
        try {
            const res = await apiClient<Specialty>(`/api/specialties/${id}`);
            if (res.status && res.data) {
                setSelectedSpecialty(res.data);
            } else {
                setError(res.message || `Không thể tìm thấy chuyên khoa với ID: ${id}.`);
            }
        } catch {
            setError("Lỗi kết nối đến server.");
        }
    }, []);

    const createSpecialty = async (data: CreateSpecialtyData): Promise<{ success: boolean; message: string }> => {
        setError(null);
        try {
            const res = await apiClient("/api/specialties", {
                method: "POST",
                body: JSON.stringify(data),
            });

            if (!res.status) {
                setError(res.message || "Thêm chuyên khoa thất bại.");
                return { success: false, message: res.message || "Thêm chuyên khoa thất bại." };
            }

            await fetchSpecialties(); // Tải lại danh sách sau khi thêm thành công
            return { success: true, message: res.message || "Thêm chuyên khoa thành công!" };
        } catch {
            setError("Đã có lỗi không mong muốn xảy ra.");
            return { success: false, message: "Đã có lỗi không mong muốn xảy ra." };
        }
    };

    const updateSpecialty = async (id: string, data: UpdateSpecialtyData): Promise<{ success: boolean; message: string }> => {
        setError(null);
        try {
            const res = await apiClient(`/api/specialties/${id}`, {
                method: "PATCH",
                body: JSON.stringify(data),
            });

            if (!res.status) {
                setError(res.message || "Cập nhật chuyên khoa thất bại.");
                return { success: false, message: res.message || "Cập nhật chuyên khoa thất bại." };
            }

            await fetchSpecialties();
            return { success: true, message: res.message || "Cập nhật chuyên khoa thành công!" };
        } catch {
            setError("Đã có lỗi không mong muốn xảy ra khi cập nhật.");
            return { success: false, message: "Đã có lỗi không mong muốn xảy ra khi cập nhật." };
        }
    };

    const deleteSpecialty = async (id: string): Promise<{ success: boolean; message: string }> => {
        setError(null);
        try {
            const res = await apiClient(`/api/specialties/${id}`, { method: "DELETE" });
            
            if (!res.status) {
                setError(res.message || "Xóa chuyên khoa thất bại.");
                return { success: false, message: res.message || "Xóa chuyên khoa thất bại." };
            }

            setSpecialties((prev) => prev.filter((s) => s.id !== id));
            return { success: true, message: res.message || "Xóa chuyên khoa thành công!" };
        } catch {
            setError("Đã có lỗi không mong muốn xảy ra khi xóa.");
            return { success: false, message: "Đã có lỗi không mong muốn xảy ra khi xóa." };
        }
    };

    useEffect(() => {
        fetchSpecialties();
    }, [fetchSpecialties]);

    return (
        <SpecialtyContext.Provider
            value={{
                specialties,
                selectedSpecialty,
                loading,
                error,
                fetchSpecialties,
                fetchSpecialtyById,
                createSpecialty,
                updateSpecialty,
                deleteSpecialty,
            }}
        >
            {children}
        </SpecialtyContext.Provider>
    );
}

export function useSpecialty() {
    const context = useContext(SpecialtyContext);
    if (context === undefined) {
        throw new Error("useSpecialty must be used within a SpecialtyProvider");
    }
    return context;
}