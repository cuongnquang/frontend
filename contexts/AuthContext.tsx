"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { apiClient } from "@/lib/api";
import { useRouter } from "next/navigation";

interface User {
    user_id: string;
    email: string;
    full_name?: string;
    role: string;
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
    register: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    loading: boolean;
    refreshUser: () => Promise<void>;
    error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const fetchUser = useCallback(async () => {
        const res = await apiClient<User>("/api/auth/me", { skipRedirect: true });

        if (res.status && res.data) {
            setUser(res.data);
            return res.data;
        } else {
            setUser(null);
            return null;
        }
    }, []);

    const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
        setError(null);
        setLoading(true);
        try {
            const res = await apiClient<User>("/api/auth/login", {
                method: "POST",
                body: JSON.stringify({ email, password }),
            });
            
            if (!res.status) {
                setError(res.message || "Đăng nhập thất bại");
                return { success: false, message: res.message || "Đăng nhập thất bại" };
            }

            await fetchUser();
            router.push("/");
            return { success: true, message: res.message || "Đăng nhập thành công" };
        } catch (e) {
            setError("Đã có lỗi không mong muốn xảy ra.");
            return { success: false, message: "Đã có lỗi không mong muốn xảy ra." };
        } finally {
            setLoading(false);
        }
    };

    const register = async (email: string, password: string) => {
        setError(null);
        setLoading(true);
        try {
            const res = await apiClient("/api/auth/register", {
                method: "POST",
                body: JSON.stringify({ email, password }),
            });

            if (!res.status) {
                setError(res.message || "Đăng ký thất bại");
                return;
            }

            router.push("/auth/login");
        } catch (e) {
            setError("Đã có lỗi không mong muốn xảy ra.");
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        setLoading(true);
        try {
            await apiClient("/api/auth/logout", { method: "POST", skipRedirect: true });
        } finally {
            setUser(null);
            setError(null);
            setLoading(false);
            router.push("/auth/login");
        }
    };

    const refreshUser = async () => {
        setLoading(true);
        try {
            await fetchUser();
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                await fetchUser();
            } catch (err) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
    }, [fetchUser]);

    useEffect(() => {
        const handleTokenRefresh = () => {
            console.log("Token refreshed, reloading user data...");
            fetchUser();
        };
        window.addEventListener("token-refreshed", handleTokenRefresh);
        return () => {
            window.removeEventListener("token-refreshed", handleTokenRefresh);
        };
    }, [fetchUser]);

    return (
        <AuthContext.Provider
            value={{ user, login, register, logout, loading, refreshUser, error }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
}

export function useRequireAuth(redirectTo = "/auth/login") {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push(redirectTo);
        }
    }, [user, loading, router, redirectTo]);

    return { user, loading };
}