const baseURL = (import.meta.env.VITE_API_BASE_URL as string);

async function request<T>(path: string, options: RequestInit): Promise<T> {
  const token = localStorage.getItem("authToken");
  const { headers: customHeaders, ...restOptions } = options;

  const res = await fetch(`${baseURL}${path}`, {
    ...restOptions,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(customHeaders || {}),
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const msg = body?.message || body?.error || `${res.status} ${res.statusText}`;
    throw new Error(msg);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  // Some endpoints may return 200/202 with an empty body; avoid JSON parse errors in those cases.
  const text = await res.text();
  if (!text.trim()) {
    return undefined as T;
  }

  return JSON.parse(text) as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path, { method: "GET" }),
  post: <T>(path: string, body: any) => request<T>(path, { method: "POST", body: JSON.stringify(body) }),
  put: <T>(path: string, body: any) => request<T>(path, { method: "PUT", body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
}