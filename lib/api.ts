interface ApiRequestOptions extends RequestInit {
    skipRefresh?: boolean;
    skipRedirect?: boolean;
}

interface ApiResponse<T> {
    status: boolean;
    code?: number;
    data?: T;
    error?: any;
    message?: string;
}

function getCookie(name: string): string | undefined {
    if (typeof document === "undefined") return undefined;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return parts.pop()?.split(";").shift();
    }
    return undefined;
}


export async function apiClient<T = any>(
    endpoint: string,
    options: ApiRequestOptions = {}
): Promise<ApiResponse<T>> {
    const { skipRefresh = false, skipRedirect = false, ...fetchOptions } = options;

    const accessToken = getCookie("accessToken");
    const csrfToken = getCookie("csrfToken");

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };

    if (fetchOptions.headers) Object.assign(headers, fetchOptions.headers as Record<string, string>);
    if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;
    if (csrfToken && fetchOptions.method && fetchOptions.method !== "GET") {
        headers["x-csrf-token"] = csrfToken;
    }

    let res: Response;

    try {
        res = await fetch(endpoint, {
            ...fetchOptions,
            credentials: "include",
            headers,
        });
    } catch (networkError) {
        return {
            status: false,
            message: "Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại đường truyền mạng.",
            error: networkError
        };
    }

    if (res.status === 401 && !skipRefresh) {
        const hasRefreshToken = getCookie("nestjs_refresh_token");

        // Lấy thông báo lỗi từ BE nếu có
        let errorPayload: any = {};
        try {
            errorPayload = await res.clone().json();
        } catch {
            errorPayload = {};
        }

        if (!hasRefreshToken) {
            return {
                status: false,
                code: res.status,
                message: errorPayload.message || "Yêu cầu xác thực không hợp lệ.",
                error: errorPayload
            };
        }

        const refreshRes = await fetch("/api/auth/refresh", {
            method: "POST",
            credentials: "include",
        });

        if (refreshRes.ok) {
            window.dispatchEvent(new Event("token-refreshed"));
            return apiClient<T>(endpoint, { ...options, skipRefresh: true }); // Thử lại yêu cầu
        }

        if (!skipRedirect && typeof window !== "undefined") {
            window.location.href = "/auth/login";
        }

        return {
            status: false,
            code: res.status,
            message: errorPayload.message || "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
            error: errorPayload
        };
    }

    if (!res.ok) {
        try {
            const errorPayload = await res.json();
            return {
                status: false,
                code: res.status,
                message: errorPayload.message || `Yêu cầu thất bại với mã lỗi ${res.status}`,
                error: errorPayload,
            };
        } catch (jsonError) {
            return {
                status: false,
                code: res.status,
                message: `Đã có lỗi xảy ra phía máy chủ (Mã: ${res.status})`,
                error: "Invalid JSON error response"
            };
        }
    }

    try {
        if (res.status === 204) {
            return { status: true, code: res.status, data: {} as T };
        }
        const data = await res.json();
        return {
            status: true,
            code: res.status,
            data: data.data,
            message: data.message,
        };
    } catch (jsonError) {
        return {
            status: false,
            code: res.status,
            message: "Phản hồi từ máy chủ không hợp lệ.",
            error: jsonError
        };
    }
}