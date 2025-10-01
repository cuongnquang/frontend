"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthContext";

interface AuthGuardProps {
    children: ReactNode;
    publicRoute?: boolean;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, publicRoute = false }) => {
    const { isAuthenticated, isInitializing } = useAuth();
    const router = useRouter();
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        if (isInitializing) return; // Chưa kiểm tra xong => chờ

        if (!publicRoute && !isAuthenticated) {
            // Nếu vào private route mà chưa login
            router.replace("/auth/login");
        } else if (publicRoute && isAuthenticated) {
            // Nếu vào public route (login/register) mà đã login rồi
            router.replace("/");
        } else {
            // Pass check
            setChecked(true);
        }
    }, [isAuthenticated, isInitializing, publicRoute, router]);

    if (isInitializing || !checked) {
        return (
            <div className="flex items-center justify-center min-h-screen text-lg text-gray-700">
                Đang kiểm tra quyền truy cập...
            </div>
        );
    }

    return <>{children}</>;
};

export default AuthGuard;
