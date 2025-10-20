"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { apiClient } from "@/lib/api";

export interface Schedule {
    id: string;
    doctor_name: string;
    schedule_date: string;
    start_time: string;
    end_time: string;
    is_available: boolean;
    createdAt: string;
    updatedAt: string;
}

export type CreateScheduleData = {
    schedule_date: string;
    start_time: string;
    end_time: string;
};

export type CreateManySchedulesData = CreateScheduleData[];

interface ScheduleContextType {
    schedules: Schedule[];
    selectedSchedule: Schedule | null;
    loading: boolean;
    error: string | null;
    fetchSchedules: () => Promise<void>;
    fetchScheduleById: (id: string) => Promise<void>;
    createSchedule: (data: CreateScheduleData) => Promise<{ success: boolean; message: string }>;
    createManySchedules: (data: CreateManySchedulesData) => Promise<{ success: boolean; message: string }>;
    deleteSchedule: (id: string) => Promise<{ success: boolean; message: string }>;
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

export function ScheduleProvider({ children }: { children: ReactNode }) {
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchSchedules = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await apiClient<Schedule[]>("/api/schedules");
            if (res.status && res.data) {
                setSchedules(res.data);
            } else {
                setError(res.message || "Không thể tải danh sách lịch làm việc.");
            }
        } catch (err) {
            setError("Lỗi kết nối đến server.");
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchScheduleById = useCallback(async (id: string) => {
        setError(null);
        setSelectedSchedule(null);
        try {
            const res = await apiClient<Schedule>(`/api/schedules/${id}`);
            if (res.status && res.data) {
                setSelectedSchedule(res.data);
            } else {
                setError(res.message || `Không thể tìm thấy lịch với ID: ${id}.`);
            }
        } catch (err) {
            setError("Lỗi kết nối đến server.");
        }
    }, []);

    const createSchedule = async (data: CreateScheduleData): Promise<{ success: boolean; message: string }> => {
        setError(null);
        try {
            const res = await apiClient("/api/schedules", {
                method: "POST",
                body: JSON.stringify(data),
            });

            if (!res.status) {
                setError(res.message || "Thêm lịch thất bại.");
                return { success: false, message: res.message || "Thêm lịch thất bại." };
            }

            await fetchSchedules();
            return { success: true, message: res.message || "Thêm lịch thành công!" };
        } catch (err) {
            setError("Đã có lỗi không mong muốn xảy ra.");
            return { success: false, message: "Đã có lỗi không mong muốn xảy ra." };
        }
    };

    const createManySchedules = async (data: CreateManySchedulesData): Promise<{ success: boolean; message: string }> => {
        setError(null);
        try {
            const res = await apiClient("/api/schedules/many", {
                method: "POST",
                body: JSON.stringify(data),
            });

            if (!res.status) {
                setError(res.message || "Thêm nhiều lịch thất bại.");
                return { success: false, message: res.message || "Thêm nhiều lịch thất bại." };
            }

            await fetchSchedules();
            return { success: true, message: res.message || `Thêm ${data.length} lịch thành công!` };
        } catch (err) {
            setError("Đã có lỗi không mong muốn xảy ra.");
            return { success: false, message: "Đã có lỗi không mong muốn xảy ra." };
        }
    };

    const deleteSchedule = async (id: string): Promise<{ success: boolean; message: string }> => {
        setError(null);
        try {
            const res = await apiClient(`/api/schedules/${id}`, {
                method: "DELETE",
            });

            if (!res.status) {
                setError(res.message || "Xóa lịch thất bại.");
                return { success: false, message: res.message || "Xóa lịch thất bại." };
            }

            await fetchSchedules();
            return { success: true, message: res.message || "Xóa lịch thành công!" };
        } catch (err) {
            setError("Đã có lỗi không mong muốn xảy ra.");
            return { success: false, message: "Đã có lỗi không mong muốn xảy ra." };
        }
    };

    return (
        <ScheduleContext.Provider
            value={{
                schedules,
                selectedSchedule,
                loading,
                error,
                fetchSchedules,
                fetchScheduleById,
                createSchedule,
                createManySchedules,
                deleteSchedule,
            }}
        >
            {children}
        </ScheduleContext.Provider>
    );
}

export function useSchedule() {
    const context = useContext(ScheduleContext);
    if (context === undefined) {
        throw new Error("useSchedule must be used within a ScheduleProvider");
    }
    return context;
}