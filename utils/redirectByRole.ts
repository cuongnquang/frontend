export function getRedirectPathByRole(role: string): string {
    switch (role.toLowerCase()) {
        case "admin":
            return "/admin/dashboard";
        case "doctor":
            return "/doctor/dashboard";
        case "patient":
        default:
            return "/";
    }
}