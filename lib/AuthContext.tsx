'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { User, AuthState, LoginCredentials, RegisterData, Role, ApiResponse } from './types'

interface AuthContextType extends AuthState {
    login: (credentials: LoginCredentials) => Promise<ApiResponse>
    register: (data: RegisterData) => Promise<ApiResponse>
    logout: () => void
    refreshToken: () => Promise<void>
    updateProfile: (data: Partial<User>) => Promise<ApiResponse>
    checkPermission: (permission: string) => boolean
    checkRole: (role: Role) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users database - In real app, this would be API calls
const MOCK_USERS: (User & { password: string })[] = [
    {
        id: '1',
        email: 'admin@youmed.vn',
        password: 'admin123',
        name: 'Nguyễn Văn Admin',
        role: Role.ADMIN,
        avatar: '/avatars/admin.jpg',
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date(),
        profile: {
            phone: '0901234567',
            address: 'Hà Nội, Việt Nam'
        }
    },
    {
        id: '2',
        email: 'doctor@youmed.vn',
        password: 'doctor123',
        name: 'BS. Trần Thị Bình',
        role: Role.DOCTOR,
        avatar: '/avatars/doctor.jpg',
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date(),
        profile: {
            phone: '0901234568',
            specialization: 'Tim mạch',
            licenseNumber: 'BS-2024-001',
            hospitalId: 'hospital-1'
        }
    },
    {
        id: '3',
        email: 'patient@youmed.vn',
        password: 'patient123',
        name: 'Lê Văn Cường',
        role: Role.PATIENT,
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date(),
        profile: {
            phone: '0901234569',
            address: 'TP.HCM, Việt Nam',
            dateOfBirth: new Date('1990-05-15'),
            gender: 'male',
            insuranceNumber: 'INS-001-2024',
            emergencyContact: {
                name: 'Nguyễn Thị Lan',
                phone: '0901234570',
                relationship: 'Vợ'
            }
        }
    },

]

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<AuthState>({
        user: null,
        isLoading: true,
        isAuthenticated: false
    })

    // Initialize auth state
    useEffect(() => {
        initializeAuth()
    }, [])

    const initializeAuth = useCallback(async () => {
        try {
            const token = localStorage.getItem('youmed_token')
            const userData = localStorage.getItem('youmed_user')

            if (token && userData) {
                const user = JSON.parse(userData)

                // In real app, verify token with server
                if (isTokenValid(token)) {
                    setState({
                        user,
                        isLoading: false,
                        isAuthenticated: true
                    })
                } else {
                    // Token expired, clear storage
                    localStorage.removeItem('youmed_token')
                    localStorage.removeItem('youmed_user')
                    setState({
                        user: null,
                        isLoading: false,
                        isAuthenticated: false
                    })
                }
            } else {
                setState({
                    user: null,
                    isLoading: false,
                    isAuthenticated: false
                })
            }
        } catch (error) {
            console.error('Auth initialization error:', error)
            setState({
                user: null,
                isLoading: false,
                isAuthenticated: false
            })
        }
    }, [])

    const login = async (credentials: LoginCredentials): Promise<ApiResponse> => {
        setState((prev: any) => ({ ...prev, isLoading: true }))

        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000))

            const user = MOCK_USERS.find(u => u.email === credentials.email)

            if (!user) {
                setState((prev: any) => ({ ...prev, isLoading: false }))
                return {
                    success: false,
                    error: 'Email không tồn tại trong hệ thống'
                }
            }

            if (user.password !== credentials.password) {
                setState((prev: any) => ({ ...prev, isLoading: false }))
                return {
                    success: false,
                    error: 'Mật khẩu không đúng'
                }
            }

            if (!user.isActive) {
                setState((prev: any) => ({ ...prev, isLoading: false }))
                return {
                    success: false,
                    error: 'Tài khoản đã bị khóa. Vui lòng liên hệ quản trị viên.'
                }
            }

            // Generate JWT token (mock)
            const token = generateToken(user.id, user.role)
            const userWithoutPassword = { ...user }
            delete (userWithoutPassword as any).password

            // Store auth data
            localStorage.setItem('youmed_token', token)
            localStorage.setItem('youmed_user', JSON.stringify(userWithoutPassword))

            setState({
                user: userWithoutPassword,
                isLoading: false,
                isAuthenticated: true
            })

            return {
                success: true,
                message: 'Đăng nhập thành công',
                data: { user: userWithoutPassword, token }
            }
        } catch (error) {
            setState((prev: any) => ({ ...prev, isLoading: false }))
            return {
                success: false,
                error: 'Có lỗi xảy ra trong quá trình đăng nhập'
            }
        }
    }

    const register = async (data: RegisterData): Promise<ApiResponse> => {
        setState((prev: any) => ({ ...prev, isLoading: true }))

        try {
            // Validate data
            if (data.password !== data.confirmPassword) {
                setState((prev: any) => ({ ...prev, isLoading: false }))
                return { success: false, error: 'Mật khẩu xác nhận không khớp' }
            }

            if (data.password.length < 6) {
                setState((prev: any) => ({ ...prev, isLoading: false }))
                return { success: false, error: 'Mật khẩu phải có ít nhất 6 ký tự' }
            }

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1500))

            // Check if email already exists
            const existingUser = MOCK_USERS.find(u => u.email === data.email)
            if (existingUser) {
                setState((prev: any) => ({ ...prev, isLoading: false }))
                return { success: false, error: 'Email đã được sử dụng' }
            }

            const newUser: User = {
                id: `user_${Date.now()}`,
                email: data.email,
                name: data.name,
                role: data.role,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
                profile: {
                    phone: data.phone
                }
            }

            // Add to mock database
            MOCK_USERS.push({ ...newUser, password: data.password })

            const token = generateToken(newUser.id, newUser.role)
            localStorage.setItem('youmed_token', token)
            localStorage.setItem('youmed_user', JSON.stringify(newUser))

            setState({
                user: newUser,
                isLoading: false,
                isAuthenticated: true
            })

            return {
                success: true,
                message: 'Đăng ký thành công',
                data: { user: newUser, token }
            }
        } catch (error) {
            setState((prev: any) => ({ ...prev, isLoading: false }))
            return { success: false, error: 'Có lỗi xảy ra trong quá trình đăng ký' }
        }
    }

    const logout = () => {
        localStorage.removeItem('youmed_token')
        localStorage.removeItem('youmed_user')
        setState({
            user: null,
            isLoading: false,
            isAuthenticated: false
        })
    }

    const refreshToken = async () => {
        // In real app, call refresh token API
        const token = localStorage.getItem('youmed_token')
        if (token && !isTokenValid(token)) {
            logout()
        }
    }

    const updateProfile = async (data: Partial<User>): Promise<ApiResponse> => {
        if (!state.user) {
            return { success: false, error: 'Chưa đăng nhập' }
        }

        setState((prev: any) => ({ ...prev, isLoading: true }))

        try {
            await new Promise(resolve => setTimeout(resolve, 500))

            const updatedUser = {
                ...state.user,
                ...data,
                updatedAt: new Date()
            }

            localStorage.setItem('youmed_user', JSON.stringify(updatedUser))

            setState({
                user: updatedUser,
                isLoading: false,
                isAuthenticated: true
            })

            return { success: true, message: 'Cập nhật thông tin thành công' }
        } catch (error) {
            setState((prev: any) => ({ ...prev, isLoading: false }))
            return { success: false, error: 'Có lỗi xảy ra khi cập nhật thông tin' }
        }
    }

    const checkPermission = (permission: string): boolean => {
        if (!state.user) return false

        const { hasPermission } = require('./permissions')
        return hasPermission(state.user.role, permission)
    }

    const checkRole = (role: Role): boolean => {
        if (!state.user) return false

        const { hasRole } = require('./permissions')
        return hasRole(state.user.role, role)
    }

    return (
        <AuthContext.Provider value={{
            ...state,
            login,
            register,
            logout,
            refreshToken,
            updateProfile,
            checkPermission,
            checkRole
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

// Helper functions
function generateToken(userId: string, role: Role): string {
    const payload = {
        userId,
        role,
        exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    }
    return `mock_token_${btoa(JSON.stringify(payload))}`
}

function isTokenValid(token: string): boolean {
    try {
        const payload = JSON.parse(atob(token.replace('mock_token_', '')))
        return payload.exp > Date.now()
    } catch {
        return false
    }
}