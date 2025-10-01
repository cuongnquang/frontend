import { Role } from '@/types/emuns'

// Role hierarchy - higher number = higher privileges
export const ROLE_HIERARCHY: Record<Role, number> = {

    [Role.ADMIN]: 80,
    [Role.DOCTOR]: 60,
    [Role.PATIENT]: 10
}

// Resource-based permissions
export const PERMISSIONS: Record<Role, string[]> = {
    [Role.ADMIN]: [
        'admin:dashboard:view',
        'admin:doctors:view',
        'admin:doctors:create',
        'admin:doctors:edit',
        'admin:doctors:delete',
        'admin:patients:view',
        'admin:patients:create',
        'admin:patients:edit',
        'admin:appointments:view',
        'admin:appointments:manage',
        'admin:reports:view',
        'admin:reports:export',
        'system:users:view',
        'system:settings:view',
        'system:settings:edit'
    ],
    [Role.DOCTOR]: [
        'doctor:dashboard:view',
        'doctor:profile:view',
        'doctor:profile:edit',
        'doctor:appointments:view',
        'doctor:appointments:manage',
        'doctor:patients:view',
        'doctor:patients:medical-records:view',
        'doctor:patients:medical-records:create',
        'doctor:patients:medical-records:edit',
        'doctor:schedule:view',
        'doctor:schedule:edit'
    ],
    [Role.PATIENT]: [
        'patient:dashboard:view',
        'patient:profile:view',
        'patient:profile:edit',
        'patient:appointments:view',
        'patient:appointments:create',
        'patient:appointments:cancel',
        'patient:medical-records:view',
        'patient:prescriptions:view',
        'patient:billing:view'
    ]
}

// Route-based access control
export const ROUTE_PERMISSIONS: Record<string, { roles: Role[]; permissions?: string[] }> = {
    '/admin': {
        roles: [Role.ADMIN],
        permissions: ['admin:dashboard:view']
    },
    '/admin/doctors': {
        roles: [Role.ADMIN],
        permissions: ['admin:doctors:view']
    },
    '/admin/patients': {
        roles: [Role.ADMIN],
        permissions: ['admin:patients:view']
    },
    '/admin/reports': {
        roles: [Role.ADMIN],
        permissions: ['admin:reports:view']
    },
    '/doctor': {
        roles: [Role.DOCTOR, Role.ADMIN],
        permissions: ['doctor:dashboard:view']
    },
    '/doctor/appointments': {
        roles: [Role.DOCTOR, Role.ADMIN],
        permissions: ['doctor:appointments:view']
    },
    '/doctor/patients': {
        roles: [Role.DOCTOR, Role.ADMIN],
        permissions: ['doctor:patients:view']
    },
    '/client': {
        roles: [Role.PATIENT, Role.DOCTOR, Role.ADMIN],
        permissions: ['patient:dashboard:view']
    },
    '/client/appointments': {
        roles: [Role.PATIENT, Role.DOCTOR, Role.ADMIN],
        permissions: ['patient:appointments:view']
    },
    '/client/medical-records': {
        roles: [Role.PATIENT, Role.DOCTOR, Role.ADMIN],
        permissions: ['patient:medical-records:view']
    }
}

export function hasPermission(Role: Role, permission: string): boolean {
    const userPermissions = PERMISSIONS[Role] || []

    return userPermissions.some(p => {
        if (p.endsWith('*')) {
            const basePermission = p.slice(0, -1)
            return permission.startsWith(basePermission)
        }
        return p === permission
    })
}

export function hasRole(Role: Role, requiredRole: Role): boolean {
    return ROLE_HIERARCHY[Role] >= ROLE_HIERARCHY[requiredRole]
}

export function canAccessRoute(Role: Role, route: string): boolean {
    const routeConfig = ROUTE_PERMISSIONS[route]
    if (!routeConfig) return true // No restrictions

    // Check role-based access
    const hasRequiredRole = routeConfig.roles.some(role => hasRole(Role, role))
    if (!hasRequiredRole) return false

    // Check permission-based access
    if (routeConfig.permissions) {
        return routeConfig.permissions.some(permission => hasPermission(Role, permission))
    }

    return true
}