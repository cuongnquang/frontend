"use client";

import React, { useEffect, useState, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "./AuthContext";
import { Role } from "@/types/emuns";
import { hasPermission, canAccessRoute } from "./permissions";

interface AuthGuardProps {
    children: ReactNode;
    requiredRoles?: Role[];
    requiredPermissions?: string[];
    fallbackUrl?: string;
    requireAuth?: boolean;
    requireAll?: boolean; // true = cần tất cả permission, false = chỉ cần 1
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
    children,
    requiredRoles = [],
    requiredPermissions = [],
    fallbackUrl = "/auth/login",
    requireAuth = true,
    requireAll = false,
}) => {
    const { user, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        if (isLoading) return;

        let redirectUrl: string | null = null;

        // 1. Check auth
        if (requireAuth && (!isAuthenticated || !user)) {
            redirectUrl = `${fallbackUrl}?redirect=${encodeURIComponent(pathname)}`;
        }

        // 2. Check active
        else if (user && !user.is_active) {
            // redirectUrl = "/account-disabled";
            redirectUrl = "/"
        }

        // 3. Check route access
        else if (user && !canAccessRoute(user.role, pathname)) {
            redirectUrl = "/unauthorized";
        }

        // 4. Check role
        else if (user && requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
            redirectUrl = "/unauthorized";
        }

        // 5. Check permissions
        else if (user && requiredPermissions.length > 0) {
            const checkPermissions = requireAll
                ? requiredPermissions.every((p) => hasPermission(user.role, p))
                : requiredPermissions.some((p) => hasPermission(user.role, p));

            if (!checkPermissions) {
                redirectUrl = "/unauthorized";
            }
        }

        if (redirectUrl) {
            router.replace(redirectUrl);
        } else {
            setChecked(true);
        }
    }, [
        user,
        isAuthenticated,
        isLoading,
        pathname,
        requiredRoles,
        requiredPermissions,
        requireAuth,
        requireAll,
        fallbackUrl,
        router,
    ]);

    if (isLoading || !checked) {
        return (
            <div className="flex items-center justify-center min-h-screen text-lg text-gray-700">
                Đang kiểm tra quyền truy cập...
            </div>
        );
    }

    return <>{children}</>;
};
