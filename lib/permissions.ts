import { Role } from "@/types/emuns";

// Gán quyền theo role
const rolePermissions: Record<Role, string[]> = {
    [Role.PATIENT]: ["book_appointment", "cancel_appointment", "view_profile"],
    [Role.DOCTOR]: ["view_schedule", "update_schedule", "view_patient"],
    [Role.ADMIN]: ["manage_users", "manage_doctors", "manage_hospitals"],
    [Role.HOSPITAL]: ["manage_doctors", "manage_departments", "view_statistics"],
};

export function hasPermission(role: Role, permission: string): boolean {
    return rolePermissions[role]?.includes(permission) ?? false;
}

// Map route → role được phép
export function canAccessRoute(role: Role, route: string): boolean {
    const routeAccess: Record<string, Role[]> = {
        "/admin": [Role.ADMIN],
        "/doctor": [Role.DOCTOR],
        "/client": [Role.PATIENT],
        "/hospital": [Role.HOSPITAL],
    };

    for (const [path, roles] of Object.entries(routeAccess)) {
        if (route.startsWith(path)) {
            return roles.includes(role);
        }
    }

    return true; // default allow
}
