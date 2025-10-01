'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from './AuthContext'
import { Role } from '@/types/emuns'
import { hasPermission, hasRole, canAccessRoute } from './permissions'

interface AuthGuardProps {
  children: React.ReactNode
  requiredRoles?: Role[]
  requiredPermissions?: string[]
  fallbackUrl?: string
  requireAuth?: boolean
  requireAll?: boolean
}

export function AuthGuard({
  children,
  requiredRoles = [],
  requiredPermissions = [],
  fallbackUrl = '/login',
  requireAuth = true,
  requireAll = false
}: AuthGuardProps) {
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    if (isLoading) return

    setIsChecking(false)

    // If auth is not required, allow access
    if (!requireAuth) return

    // If not authenticated, redirect to login
    if (!isAuthenticated || !user) {
      const loginUrl = `${fallbackUrl}?redirect=${encodeURIComponent(pathname)}`
      router.replace(loginUrl)
      return
    }

    // Check if user account is active
    if (!user.isActive) {
      router.replace('/account-disabled')
      return
    }

    // Check route-level access
    if (!canAccessRoute(user.role, pathname)) {
      router.replace('/unauthorized')
      return
    }

    // Check role-based access
    if (requiredRoles.length > 0) {
      const hasRequiredRole = requiredRoles.some(role => hasRole(user.role, role))
      if (!hasRequiredRole) {
        router.replace('/unauthorized')
        return
      }
    }

    // Check permission-based access
    if (requiredPermissions.length > 0) {
      const checkPermissions = requireAll
        ? requiredPermissions.every(permission => hasPermission(user.role, permission))
        : requiredPermissions.some(permission => hasPermission(user.role, permission))

      if (!checkPermissions) {
        router.replace('/unauthorized')
        return
      }
    }
  }, [
    user,
    isLoading,
    isAuthenticated,
    requiredRoles,
    requiredPermissions,
    router,
    pathname,
    fallbackUrl,
    requireAuth,
    requireAll
  ])

  if (isLoading || isChecking) {
    return <LoadingScreen />
  }

  if (requireAuth && (!isAuthenticated || !user)) {
    return null // Will redirect in useEffect
  }

  if (user && !user.isActive) {
    return null // Will redirect in useEffect
  }

  // Final permission check
  if (requiredRoles.length > 0 && user) {
    const hasRequiredRole = requiredRoles.some(role => hasRole(user.role, role))
    if (!hasRequiredRole) {
      return null // Will redirect in useEffect
    }
  }

  if (requiredPermissions.length > 0 && user) {
    const checkPermissions = requireAll
      ? requiredPermissions.every(permission => hasPermission(user.role, permission))
      : requiredPermissions.some(permission => hasPermission(user.role, permission))

    if (!checkPermissions) {
      return null // Will redirect in useEffect
    }
  }

  return <>{children}</>
}

// Hook for checking permissions in components
export function usePermissions() {
  const { user, checkPermission, checkRole } = useAuth()

  const hasPermissionCheck = (permission: string): boolean => {
    return checkPermission(permission)
  }

  const hasAnyPermission = (permissions: string[]): boolean => {
    return permissions.some(p => checkPermission(p))
  }

  const hasAllPermissions = (permissions: string[]): boolean => {
    return permissions.every(p => checkPermission(p))
  }

  const hasRoleCheck = (role: Role): boolean => {
    return checkRole(role)
  }

  const hasAnyRole = (roles: Role[]): boolean => {
    return roles.some(role => checkRole(role))
  }

  const canAccess = (route: string): boolean => {
    if (!user) return false
    return canAccessRoute(user.role, route)
  }

  return {
    hasPermission: hasPermissionCheck,
    hasAnyPermission,
    hasAllPermissions,
    hasRole: hasRoleCheck,
    hasAnyRole,
    canAccess,
    Role: user?.role,
    isAuthenticated: !!user
  }
}

// Component for conditional rendering based on permissions
interface PermissionGateProps {
  children: React.ReactNode
  permission?: string
  permissions?: string[]
  role?: Role
  roles?: Role[]
  requireAll?: boolean
  requireAuth?: boolean
  fallback?: React.ReactNode
}

export function PermissionGate({
  children,
  permission,
  permissions = [],
  role,
  roles = [],
  requireAll = false,
  requireAuth = true,
  fallback = null
}: PermissionGateProps) {
  const {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
    isAuthenticated
  } = usePermissions()

  // Check authentication requirement
  if (requireAuth && !isAuthenticated) {
    return <>{fallback}</>
  }

  let hasAccess = true

  // Check single permission
  if (permission && !hasPermission(permission)) {
    hasAccess = false
  }

  // Check multiple permissions
  if (permissions.length > 0) {
    if (requireAll) {
      hasAccess = hasAccess && hasAllPermissions(permissions)
    } else {
      hasAccess = hasAccess && hasAnyPermission(permissions)
    }
  }

  // Check single role
  if (role && !hasRole(role)) {
    hasAccess = false
  }

  // Check multiple roles
  if (roles.length > 0) {
    hasAccess = hasAccess && hasAnyRole(roles)
  }

  return hasAccess ? <>{children}</> : <>{fallback}</>
}

// Loading screen component
function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">YouMed</h2>
        <p className="text-gray-600">Đang kiểm tra quyền truy cập...</p>
      </div>
    </div>
  )
}