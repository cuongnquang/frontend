"use client"
import { createContext, useContext, useState, ReactNode } from "react"
import { apiRequest } from "./api"

interface AuthContextType {
    user: any | null
    login: (email: string, password: string) => Promise<void>
    register: (data: any) => Promise<void>
    logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<any | null>(null)

    const login = async (email: string, password: string) => {
        const data = await apiRequest("/v1/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password })
        })
        setUser(data.user)
        localStorage.setItem("accessToken", data.accessToken) // store access token
    }

    const register = async (formData: any) => {
        const data = await apiRequest("/v1/auth/register", {
            method: "POST",
            body: JSON.stringify(formData)
        })
        setUser(data.user)
    }

    const logout = async () => {
        await apiRequest("/v1/auth/logout", { method: "POST" })
        setUser(null)
        localStorage.removeItem("accessToken")
    }

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) throw new Error("useAuth must be used within AuthProvider")
    return context
}
