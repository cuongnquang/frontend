'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useRouter } from 'next/navigation';
import { User } from '@/types/types';

// Định nghĩa kiểu dữ liệu cho Context
interface AuthContextType {
    isAuthenticated: boolean;
    currentUser: User | null;
    setCurrentUser: (user: User) => void
    login: (token: string, userData: User) => void;
    logout: () => void;
    isInitializing: boolean;
}

// Tạo Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Props cho AuthProvider
interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isInitializing, setIsInitializing] = useState(true);
    const router = useRouter();

    // 1. Kiểm tra trạng thái đăng nhập ban đầu bằng cách xác thực token qua API
    useEffect(() => {
        const checkAuthStatus = async () => {
            const token = localStorage.getItem('authToken');
            if (token) {
                try {
                    const response = await fetch('/api/users/profile', {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    if (!response.ok) {
                        throw new Error('Failed to fetch user profile');
                    }
                    const userData: User = await response.json();
                    setCurrentUser(userData);
                    setIsAuthenticated(true);
                } catch (error) {
                    console.error('Failed to authenticate token:', error);
                    // Token không hợp lệ hoặc đã hết hạn, xóa nó đi
                    localStorage.removeItem('authToken');
                    setIsAuthenticated(false);
                    setCurrentUser(null);
                }
            }
            setIsInitializing(false);
        };

        checkAuthStatus();
    }, []);

    const login = (token: string, userData: User) => {
        // Sau khi gọi API đăng nhập thành công, lưu token và user data
        localStorage.setItem('authToken', token);
        setCurrentUser(userData);
        setIsAuthenticated(true);
    };

    const logout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
        } catch (error) {
            console.error('Logout API call failed, but clearing local state.', error);
        } finally {
            localStorage.removeItem('authToken');
            setCurrentUser(null);
            setIsAuthenticated(false);
            router.replace('/auth/login'); // Chuyển hướng về trang đăng nhập sau khi đăng xuất
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, currentUser, setCurrentUser, login, logout, isInitializing }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};