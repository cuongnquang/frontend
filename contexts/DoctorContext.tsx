'use client';


import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { apiClient } from "@/lib/api";

export interface Doctor {
    id: string;
    user_id: string;
    specialty_name: string;
    full_name: string;
    title: string | null;
    experience_years: number | null;
    specializations: string | null;
    position: string | null;
    workplace: string | null;
    clinic_address: string | null;
    introduction: string | null;
    achievements: string | null;
    avatar_url: string | null;
    is_available: boolean;
    created_at: string;
    updated_at: string;
}

export type CreateDoctorData = {
    email: string;
    specialty_name: string;
    full_name: string;
    title: string;
    experience_years: number;
    specializations: string;
    position:  string;
    workplace:  string;
    clinic_address:  string;
    introduction: string;
    achievements: string;
    avatar_url: string;
    is_available: boolean;
};

export type UpdateDoctorData = Partial<Omit<CreateDoctorData, 'email'>>;

interface DoctorContextType {
    doctors: Doctor[];
    selectedDoctor: Doctor | null;
    loading: boolean;
    error: string | null;
    fetchDoctors: () => Promise<void>;
    fetchDoctorById: (id: string) => Promise<void>;
    fetchActiveDoctorById: (id: string) => Promise<{ success: boolean; message: string }>;
    createDoctor: (data: CreateDoctorData) => Promise<{ success: boolean; message: string }>;
    updateDoctor: (id: string, data: UpdateDoctorData) => Promise<{ success: boolean; message: string }>;
    patchDoctor: (id: string, data: UpdateDoctorData) => Promise<{ success: boolean; message: string }>;
}

const DoctorContext = createContext<DoctorContextType | undefined>(undefined);

export function DoctorProvider({ children }: { children: ReactNode }) {

    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDoctors = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await apiClient<Doctor[]>("/api/doctors", { skipRedirect: true });
            if (res.status && res.data) {
                setDoctors(res.data);
            } else {
                setError(res.message || "Không thể tải danh sách bác sĩ.");
            }
        } catch (err) {
            setError("Lỗi kết nối đến server.");
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchDoctorById = useCallback(async (id: string) => {
        setError(null);
        setSelectedDoctor(null);
        try {
            const res = await apiClient<Doctor>(`/api/doctors/${id}`);
            if (res.status && res.data) {
                setSelectedDoctor(res.data);
            } else {
                setError(res.message || `Không thể tìm thấy bác sĩ với ID: ${id}.`);
            }
        } catch (err) {
            setError("Lỗi kết nối đến server.");
        }
    }, []);

    const fetchActiveDoctorById = useCallback(async (id: string) => {
        setError(null);
        try {
            const res = await apiClient(`/api/doctors/${id}/actions/active`, {
                method: "POST",
            });

            if (!res.status) {
                setError(res.message || "Kích hoạt bác sĩ thất bại.");
                return { success: false, message: res.message || "Kích hoạt bác sĩ thất bại." };
            }

            await fetchDoctors();
            return { success: true, message: res.message || "Kích hoạt bác sĩ thành công!" };

        } catch (err) {
            setError("Đã có lỗi không mong muốn xảy ra.");
            return { success: false, message: "Đã có lỗi không mong muốn xảy ra." };
        }
    }, []);

    const createDoctor = async (data: CreateDoctorData): Promise<{ success: boolean; message: string }> => {
        setError(null);
        try {
            const res = await apiClient("/api/doctors", {
                method: "POST",
                body: JSON.stringify(data),
            });

            if (!res.status) {
                setError(res.message || "Thêm bác sĩ thất bại.");
                return { success: false, message: res.message || "Thêm bác sĩ thất bại." };
            }

            await fetchDoctors();
            return { success: true, message: res.message || "Thêm bác sĩ thành công!" };
        } catch (err) {
            setError("Đã có lỗi không mong muốn xảy ra.");
            return { success: false, message: "Đã có lỗi không mong muốn xảy ra." };
        }
    };

    const updateDoctor = async (id: string, data: UpdateDoctorData): Promise<{ success: boolean; message: string }> => {
        setError(null);
        try {
            const res = await apiClient(`/api/doctors/${id}`, {
                method: "PUT",
                body: JSON.stringify(data),
            });

            if (!res.status) {
                setError(res.message || "Cập nhật bác sĩ thất bại.");
                return { success: false, message: res.message || "Cập nhật bác sĩ thất bại." };
            }

            await fetchDoctors();
            return { success: true, message: res.message || "Cập nhật bác sĩ thành công!" };
        } catch (err) {
            setError("Đã có lỗi không mong muốn xảy ra khi cập nhật.");
            return { success: false, message: "Đã có lỗi không mong muốn xảy ra khi cập nhật." };
        }
    };

    const patchDoctor = async (id: string, data: UpdateDoctorData): Promise<{ success: boolean; message: string }> => {
        setError(null);
        try {
            const res = await apiClient(`/api/doctors/${id}`, {
                method: "PATCH",
                body: JSON.stringify(data),
            });

            if (!res.status) {
                setError(res.message || "Cập nhật bác sĩ thất bại.");
                return { success: false, message: res.message || "Cập nhật bác sĩ thất bại." };
            }

            await fetchDoctors();
            return { success: true, message: res.message || "Cập nhật bác sĩ thành công!" };
        } catch (err) {
            setError("Đã có lỗi không mong muốn xảy ra khi cập nhật.");
            return { success: false, message: "Đã có lỗi không mong muốn xảy ra khi cập nhật." };
        }
    };

    useEffect(() => {
        fetchDoctors();
    }, [fetchDoctors]);

    return (
        <DoctorContext.Provider
            value={{
                doctors,
                selectedDoctor,
                loading,
                error,
                fetchDoctors,
                fetchDoctorById,
                fetchActiveDoctorById,
                createDoctor,
                updateDoctor,
                patchDoctor,
            }}
        >
            {children}
        </DoctorContext.Provider>
    );
}

export function useDoctor() {
    const context = useContext(DoctorContext);
    if (context === undefined) {
        throw new Error("useDoctor must be used within a DoctorProvider");
    }
    return context;

}