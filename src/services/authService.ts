export type AuthUser = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
};

export type AuthResponse = {
  token: string;
  user: AuthUser;
};

export type RegisterPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export const AUTH_TOKEN_STORAGE_KEY = "authToken";
export const AUTH_USER_STORAGE_KEY = "authUser";

export type ApiError = Error & {
  status?: number;
  fieldErrors?: Record<string, string>;
};

const apiBase = String(import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
const authBase = apiBase.endsWith("/api/v1")
  ? apiBase.replace(/\/api\/v1$/, "/api/auth")
  : `${apiBase}/api/auth`;

async function parseError(res: Response): Promise<ApiError> {
  const body = await res.json().catch(() => ({}));
  const message = body?.message || body?.error || `${res.status} ${res.statusText}`;
  const err = new Error(message) as ApiError;
  err.status = res.status;
  if (body?.fieldErrors && typeof body.fieldErrors === "object") {
    err.fieldErrors = body.fieldErrors as Record<string, string>;
  }
  return err;
}

async function authRequest<T>(path: string, options: RequestInit): Promise<T> {
  const res = await fetch(`${authBase}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    throw await parseError(res);
  }

  return res.json() as Promise<T>;
}

export const authService = {
  register: (payload: RegisterPayload) =>
    authRequest<AuthResponse>("/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  login: (payload: LoginPayload) =>
    authRequest<AuthResponse>("/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  me: (token: string) =>
    authRequest<AuthUser>("/me", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    }),
};
