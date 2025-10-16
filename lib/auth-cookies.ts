import { NextResponse } from "next/server";

const COOKIE_NAMES = {
    REFRESH_TOKEN: "nestjs_refresh_token",
    ACCESS_TOKEN: "accessToken",
    CSRF_TOKEN: "csrfToken",
};

const commonCookieOptions = {
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const, 
    path: "/",
};


export function clearAuthCookies(response: NextResponse): NextResponse {
    console.log("Clearing all authentication cookies.");
    response.cookies.set(COOKIE_NAMES.REFRESH_TOKEN, "", { ...commonCookieOptions, httpOnly: true, maxAge: 0 });
    response.cookies.set(COOKIE_NAMES.ACCESS_TOKEN, "", { ...commonCookieOptions, httpOnly: false, maxAge: 0 });
    response.cookies.set(COOKIE_NAMES.CSRF_TOKEN, "", { ...commonCookieOptions, httpOnly: false, maxAge: 0 });
    return response;
}

interface BackendAuthData {
    data?: {
        accessToken: string;
        csrfToken: string;
        expiresAt: number; // Unix timestamp tính bằng giây
    };
}


export function setAuthCookies(response: NextResponse, backendRes: Response, data: BackendAuthData): NextResponse {
    const backendSetCookie = backendRes.headers.get("set-cookie");
    if (backendSetCookie) {
        console.log("Forwarding Set-Cookie header from backend.");
        response.headers.set("Set-Cookie", backendSetCookie);
    }

    if (data.data) {
        const { accessToken, csrfToken, expiresAt } = data.data;
        const maxAgeInSeconds = Math.floor((expiresAt * 1000 - Date.now()) / 1000);
        
        if (maxAgeInSeconds > 0) {
            response.cookies.set(COOKIE_NAMES.ACCESS_TOKEN, accessToken, {
                ...commonCookieOptions,
                httpOnly: false,
                maxAge: maxAgeInSeconds,
            });

            response.cookies.set(COOKIE_NAMES.CSRF_TOKEN, csrfToken, {
                ...commonCookieOptions,
                httpOnly: false,
                maxAge: maxAgeInSeconds,
            });
        }
    }

    return response;
}