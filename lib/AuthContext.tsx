"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Role } from "@/types/emuns";
import { User } from "@/types/types"

interface AuthContextProps {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (userData: User) => void;
    logout: () => void;
    checkRole: (role: Role) => boolean;
    checkPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// ✅ Provider
export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Giả lập fetch user từ localStorage hoặc API
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    const login = (userData: User) => {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
    };

    const checkRole = (role: Role): boolean => {
        return user?.role === role;
    };

    const checkPermission = (permission: string): boolean => {
        if (!user) return false;
        // Import động để tránh vòng lặp
        const { hasPermission } = require("./permissions");
        return hasPermission(user.role, permission);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading,
                login,
                logout,
                checkRole,
                checkPermission,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// ✅ Hook để dùng AuthContext
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
