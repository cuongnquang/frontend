export async function apiRequest(endpoint: string, options: RequestInit = {}) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
        ...options,
        credentials: "include", // để gửi kèm cookie refresh token
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {})
        }
    })

    if (!res.ok) {
        throw new Error(await res.text())
    }
    return res.json()
}
