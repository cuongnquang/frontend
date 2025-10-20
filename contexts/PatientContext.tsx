"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { apiClient } from "@/lib/api";

export interface Patient {
    id: string;
    user_id: string;
    full_name: string;
    identity_number: string | null;
    phone_number: string;
    date_of_birth: string;
    gender: 'male' | 'female' | 'other';
    address: string | null;
    ethnicity: string | null;
    health_insurance_number: string | null;
    referral_code: string | null;
    occupation: string | null;
    createdAt: string;
    updatedAt: string;
}

export type CreatePatientData = {
    user_id: string;
    full_name: string;
    identity_number?: string;
    phone_number: string;
    date_of_birth: string;
    gender: 'male' | 'female' | 'other';
    address?: string;
    ethnicity?: string;
    health_insurance_number?: string;
    referral_code?: string;
    occupation?: string;
};

export type UpdatePatientData = Partial<Omit<CreatePatientData, 'user_id'>>;

interface PatientContextType {
    patients: Patient[];
    selectedPatient: Patient | null;
    loading: boolean;
    error: string | null;
    fetchPatients: () => Promise<void>;
    fetchPatientById: (id: string) => Promise<void>;
    createPatient: (data: CreatePatientData) => Promise<{ success: boolean; message: string }>;
    updatePatient: (id: string, data: UpdatePatientData) => Promise<{ success: boolean; message: string }>;
    patchPatient: (id: string, data: UpdatePatientData) => Promise<{ success: boolean; message: string }>;
    deletePatient: (id: string) => Promise<{ success: boolean; message: string }>;
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);

export function PatientProvider({ children }: { children: ReactNode }) {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPatients = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await apiClient<Patient[]>("/api/patients");
            if (res.status && res.data) {
                setPatients(res.data);
            } else {
                setError(res.message || "Không thể tải danh sách bệnh nhân.");
            }
        } catch (err) {
            setError("Lỗi kết nối đến server.");
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchPatientById = useCallback(async (id: string) => {
        setError(null);
        setSelectedPatient(null);
        try {
            const res = await apiClient<Patient>(`/api/patients/${id}`);
            if (res.status && res.data) {
                setSelectedPatient(res.data);
            } else {
                setError(res.message || `Không thể tìm thấy bệnh nhân với ID: ${id}.`);
            }
        } catch (err) {
            setError("Lỗi kết nối đến server.");
        }
    }, []);

    const createPatient = async (data: CreatePatientData): Promise<{ success: boolean; message: string }> => {
        setError(null);
        try {
            const res = await apiClient("/api/patients", {
                method: "POST",
                body: JSON.stringify(data),
            });

            if (!res.status) {
                setError(res.message || "Thêm bệnh nhân thất bại.");
                return { success: false, message: res.message || "Thêm bệnh nhân thất bại." };
            }

            await fetchPatients();
            return { success: true, message: res.message || "Thêm bệnh nhân thành công!" };
        } catch (err) {
            setError("Đã có lỗi không mong muốn xảy ra.");
            return { success: false, message: "Đã có lỗi không mong muốn xảy ra." };
        }
    };

    const updatePatient = async (id: string, data: UpdatePatientData): Promise<{ success: boolean; message: string }> => {
        setError(null);
        try {
            const res = await apiClient(`/api/patients/${id}`, {
                method: "PUT",
                body: JSON.stringify(data),
            });

            if (!res.status) {
                setError(res.message || "Cập nhật bệnh nhân thất bại.");
                return { success: false, message: res.message || "Cập nhật bệnh nhân thất bại." };
            }

            await fetchPatients();
            return { success: true, message: res.message || "Cập nhật bệnh nhân thành công!" };
        } catch (err) {
            setError("Đã có lỗi không mong muốn xảy ra khi cập nhật.");
            return { success: false, message: "Đã có lỗi không mong muốn xảy ra khi cập nhật." };
        }
    };

    const patchPatient = async (id: string, data: UpdatePatientData): Promise<{ success: boolean; message: string }> => {
        setError(null);
        try {
            const res = await apiClient(`/api/patients/${id}`, {
                method: "PATCH",
                body: JSON.stringify(data),
            });

            if (!res.status) {
                setError(res.message || "Cập nhật bệnh nhân thất bại.");
                return { success: false, message: res.message || "Cập nhật bệnh nhân thất bại." };
            }

            await fetchPatients();
            return { success: true, message: res.message || "Cập nhật bệnh nhân thành công!" };
        } catch (err) {
            setError("Đã có lỗi không mong muốn xảy ra khi cập nhật.");
            return { success: false, message: "Đã có lỗi không mong muốn xảy ra khi cập nhật." };
        }
    };

    const deletePatient = async (id: string): Promise<{ success: boolean; message: string }> => {
        setError(null);
        try {
            const res = await apiClient(`/api/patients/${id}`, {
                method: "DELETE",
            });

            if (!res.status) {
                setError(res.message || "Xóa bệnh nhân thất bại.");
                return { success: false, message: res.message || "Xóa bệnh nhân thất bại." };
            }

            setPatients(prev => prev.filter(patient => patient.id !== id));
            return { success: true, message: res.message || "Xóa bệnh nhân thành công!" };
        } catch (err) {
            setError("Đã có lỗi không mong muốn xảy ra khi xóa.");
            return { success: false, message: "Đã có lỗi không mong muốn xảy ra khi xóa." };
        }
    };

    useEffect(() => {
        fetchPatients();
    }, [fetchPatients]);

    return (
        <PatientContext.Provider
            value={{
                patients,
                selectedPatient,
                loading,
                error,
                fetchPatients,
                fetchPatientById,
                createPatient,
                updatePatient,
                patchPatient,
                deletePatient,
            }}
        >
            {children}
        </PatientContext.Provider>
    );
}

export function usePatient() {
    const context = useContext(PatientContext);
    if (context === undefined) {
        throw new Error("usePatient must be used within a PatientProvider");
    }
    return context;
}