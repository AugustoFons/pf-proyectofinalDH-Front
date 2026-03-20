const baseURL = (import.meta.env.VITE_API_BASE_URL as string);

async function request<T>(path: string, options: RequestInit): Promise<T> {
  const token = localStorage.getItem("authToken");

  const res = await fetch(`${baseURL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options?.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const msg = body?.message || body?.error || `${res.status} ${res.statusText}`;
    throw new Error(msg);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json();
}

export const api = {
  get: <T>(path: string) => request<T>(path, { method: "GET" }),
  post: <T>(path: string, body: any) => request<T>(path, { method: "POST", body: JSON.stringify(body) }),
  put: <T>(path: string, body: any) => request<T>(path, { method: "PUT", body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
}