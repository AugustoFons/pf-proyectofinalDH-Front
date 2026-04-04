import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import type { ApiError } from "../services/authService";

type Tab = "login" | "register";

type FieldErrors = {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
};

const tabBtn =
  "w-full rounded-xl py-2 text-sm font-semibold transition cursor-pointer border";

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, isAuthenticated, isAdmin } = useAuth();

  const locationTab = (location.state as { tab?: Tab } | null)?.tab;
  const [tab, setTab] = useState<Tab>(locationTab === "register" ? "register" : "login");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  useEffect(() => {
    if (isAuthenticated) {
      navigate(isAdmin ? "/administracion" : "/", { replace: true });
    }
  }, [isAdmin, isAuthenticated, navigate]);

  const clearErrors = () => {
    setGeneralError(null);
    setFieldErrors({});
  };

  const validateLogin = () => {
    const errors: FieldErrors = {};

    if (!loginEmail.trim()) errors.email = "El email es obligatorio";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginEmail.trim())) {
      errors.email = "El email no tiene un formato valido";
    }

    if (!loginPassword.trim()) errors.password = "La contraseña es obligatoria";
    else if (loginPassword.trim().length < 6) errors.password = "La contraseña debe tener al menos 6 caracteres";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateRegister = () => {
    const errors: FieldErrors = {};

    if (!firstName.trim()) errors.firstName = "El nombre es obligatorio";
    else if (firstName.trim().length < 2) errors.firstName = "El nombre debe tener al menos 2 caracteres";

    if (!lastName.trim()) errors.lastName = "El apellido es obligatorio";
    else if (lastName.trim().length < 2) errors.lastName = "El apellido debe tener al menos 2 caracteres";

    if (!registerEmail.trim()) errors.email = "El email es obligatorio";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerEmail.trim())) {
      errors.email = "El email no tiene un formato valido";
    }

    if (!registerPassword.trim()) errors.password = "La contraseña es obligatoria";
    else if (registerPassword.trim().length < 6) errors.password = "La contraseña debe tener al menos 6 caracteres";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const applyApiErrors = (err: ApiError) => {
    if (err.fieldErrors) {
      setFieldErrors(err.fieldErrors);
      return;
    }
    setGeneralError(err.message || "No se pudo completar la operacion");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();

    if (!validateLogin()) return;

    setLoading(true);
    try {
      await login({ email: loginEmail.trim(), password: loginPassword.trim() });
      navigate("/", { replace: true });
    } catch (error) {
      applyApiErrors(error as ApiError);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();

    if (!validateRegister()) return;

    setLoading(true);
    try {
      await register({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: registerEmail.trim(),
        password: registerPassword.trim(),
      });
      navigate("/", { replace: true });
    } catch (error) {
      applyApiErrors(error as ApiError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-[78vh] px-4 py-10 sm:py-14 bg-fb-background">
      <div className="mx-auto max-w-xl rounded-2xl border border-fb-stroke bg-fb-surface p-6 sm:p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-fb-text">Acceso a tu cuenta</h1>
        <p className="mt-1 text-sm text-fb-text-secondary">
          Inicia sesión o crea tu cuenta para acceder a la plataforma.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-2 rounded-xl bg-fb-neutral p-1">
          <button
            type="button"
            className={`${tabBtn} ${tab === "login" ? "bg-fb-surface border-fb-stroke text-fb-primary" : "border-transparent text-fb-text-secondary"}`}
            onClick={() => {
              clearErrors();
              setTab("login");
            }}
          >
            Iniciar sesion
          </button>
          <button
            type="button"
            className={`${tabBtn} ${tab === "register" ? "bg-fb-surface border-fb-stroke text-fb-primary" : "border-transparent text-fb-text-secondary"}`}
            onClick={() => {
              clearErrors();
              setTab("register");
            }}
          >
            Crear cuenta
          </button>
        </div>

        {generalError && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{generalError}</p>}

        {tab === "login" ? (
          <form className="mt-6 space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="mb-1 block text-sm font-medium text-fb-text">Email</label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full rounded-lg border border-fb-stroke bg-fb-surface px-3 py-2 focus:outline-none focus:ring-2 focus:ring-fb-primary"
              />
              {fieldErrors.email && <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-fb-text">Contraseña</label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full rounded-lg border border-fb-stroke bg-fb-surface px-3 py-2 focus:outline-none focus:ring-2 focus:ring-fb-primary"
              />
              {fieldErrors.password && <p className="mt-1 text-xs text-red-600">{fieldErrors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer mt-2 w-full rounded-lg bg-fb-primary px-4 py-2.5 font-medium text-fb-white transition hover:bg-fb-primary-hover disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Ingresando..." : "Ingresar"}
            </button>
          </form>
        ) : (
          <form className="mt-6 space-y-4" onSubmit={handleRegister}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-fb-text">Nombre</label>
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full rounded-lg border border-fb-stroke bg-fb-surface px-3 py-2 focus:outline-none focus:ring-2 focus:ring-fb-primary"
                />
                {fieldErrors.firstName && <p className="mt-1 text-xs text-red-600">{fieldErrors.firstName}</p>}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-fb-text">Apellido</label>
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full rounded-lg border border-fb-stroke bg-fb-surface px-3 py-2 focus:outline-none focus:ring-2 focus:ring-fb-primary"
                />
                {fieldErrors.lastName && <p className="mt-1 text-xs text-red-600">{fieldErrors.lastName}</p>}
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-fb-text">Email</label>
              <input
                type="email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                className="w-full rounded-lg border border-fb-stroke bg-fb-surface px-3 py-2 focus:outline-none focus:ring-2 focus:ring-fb-primary"
              />
              {fieldErrors.email && <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-fb-text">Contraseña</label>
              <input
                type="password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                className="w-full rounded-lg border border-fb-stroke bg-fb-surface px-3 py-2 focus:outline-none focus:ring-2 focus:ring-fb-primary"
              />
              {fieldErrors.password && <p className="mt-1 text-xs text-red-600">{fieldErrors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer mt-2 w-full rounded-lg bg-[#42B72A] px-4 py-2.5 font-medium text-fb-white transition hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Creando cuenta..." : "Crear cuenta"}
            </button>
          </form>
        )}

        <NavLink to="/" className="mt-6 inline-block text-sm text-fb-primary hover:underline">
          Volver al inicio
        </NavLink>
      </div>
    </section>
  );
}
