const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function login(email: string, name: string) {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
    });
    const data = await res.json();
    if (!res.ok) {
        const message = data?.error?.message || data?.error || "Login failed";
        throw new Error(message);
    }
    return data;
}

export async function register(email: string, name: string) {
    const res = await fetch(`${API_URL}/auth/sign-up`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
    });
    const data = await res.json();
    if (!res.ok) {
        const message = data?.error?.message || data?.error || "Registration failed";
        throw new Error(message);
    }
    return data;
}
