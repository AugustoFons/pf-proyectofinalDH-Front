import { useMemo, useState, type FormEvent } from "react";
import { NavLink } from "react-router-dom";
import { TbArrowLeft } from "react-icons/tb";
import { useAuth } from "../auth/AuthContext";
import { authService, type ApiError } from "../services/authService";
import type { ChangePasswordReq } from "../types/user";

type FieldErrors = {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
};

export default function ProfilePage() {
  const { user, token } = useAuth();

  const [form, setForm] = useState<ChangePasswordReq>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const fullName = useMemo(() => {
    if (!user) return "";
    return `${user.firstName} ${user.lastName}`.trim();
  }, [user]);

  const clearStatus = () => {
    setGeneralError(null);
    setSuccessMessage(null);
  };

  const setFieldValue = (key: keyof ChangePasswordReq, value: string) => {
    clearStatus();
    setFieldErrors((prev) => ({ ...prev, [key]: undefined }));
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validate = () => {
    const errors: FieldErrors = {};

    if (!form.currentPassword.trim()) {
      errors.currentPassword = "La contraseña actual es obligatoria";
    } else if (form.currentPassword.trim().length < 6) {
      errors.currentPassword = "La contraseña actual debe tener al menos 6 caracteres";
    }

    if (!form.newPassword.trim()) {
      errors.newPassword = "La nueva contraseña es obligatoria";
    } else if (form.newPassword.trim().length < 6) {
      errors.newPassword = "La nueva contraseña debe tener al menos 6 caracteres";
    }

    if (!form.confirmPassword.trim()) {
      errors.confirmPassword = "La confirmacion es obligatoria";
    } else if (form.confirmPassword.trim().length < 6) {
      errors.confirmPassword = "La confirmacion debe tener al menos 6 caracteres";
    }

    if (
      form.currentPassword.trim() &&
      form.newPassword.trim() &&
      form.currentPassword.trim() === form.newPassword.trim()
    ) {
      errors.newPassword = "La nueva contraseña debe ser diferente a la actual";
    }

    if (
      form.newPassword.trim() &&
      form.confirmPassword.trim() &&
      form.newPassword.trim() !== form.confirmPassword.trim()
    ) {
      errors.confirmPassword = "La confirmacion no coincide con la nueva contraseña";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const applyApiErrors = (err: ApiError) => {
    if (err.fieldErrors) {
      setFieldErrors((prev) => ({ ...prev, ...err.fieldErrors }));
      return;
    }

    setGeneralError(err.message || "No se pudo actualizar la contraseña");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearStatus();

    if (!validate()) return;
    if (!token) {
      setGeneralError("Tu sesión no es valida. Inicia sesión nuevamente.");
      return;
    }

    setLoading(true);
    try {
      const res = await authService.changePassword(token, {
        currentPassword: form.currentPassword.trim(),
        newPassword: form.newPassword.trim(),
        confirmPassword: form.confirmPassword.trim(),
      });
      setSuccessMessage(res.message || "Contraseña actualizada exitosamente");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setFieldErrors({});
    } catch (error) {
      applyApiErrors(error as ApiError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="pt-1 bg-fb-background min-h-screen">
      <div className="max-w-[50rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-fb-surface border border-fb-stroke rounded-xl p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="font-sans text-xl font-semibold text-fb-text">Mi perfil</h1>
              <p className="mt-1 text-sm text-fb-text-secondary">Revisa tus datos y actualiza tu contraseña cuando lo necesites.</p>
            </div>

            <NavLink
              to="/"
              className="px-4 py-2 rounded-md font-sans font-medium transition bg-fb-surface text-fb-primary border border-fb-primary hover:bg-fb-primary/10 flex items-center gap-[0.5px]"
            >
              <TbArrowLeft size={18} strokeWidth={2.5} />
              Volver
            </NavLink>
          </div>

          <div className="mt-6 rounded-lg border border-fb-stroke bg-fb-neutral p-4">
            <p className="text-xs uppercase tracking-wide text-fb-text-secondary">Datos de la cuenta</p>
            <p className="mt-1 text-base font-semibold text-fb-text">{fullName || "Usuario"}</p>
            <p className="text-sm text-fb-text-secondary">{user?.email ?? ""}</p>
          </div>

          {generalError && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{generalError}</p>}
          {successMessage && <p className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">{successMessage}</p>}

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="mb-1 block text-sm font-medium text-fb-text">Contraseña actual</label>
              <input
                type="password"
                value={form.currentPassword}
                onChange={(e) => setFieldValue("currentPassword", e.target.value)}
                className="w-full rounded-lg border border-fb-stroke bg-fb-surface px-3 py-2 focus:outline-none focus:ring-2 focus:ring-fb-primary"
              />
              {fieldErrors.currentPassword && <p className="mt-1 text-xs text-red-600">{fieldErrors.currentPassword}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-fb-text">Nueva contraseña</label>
              <input
                type="password"
                value={form.newPassword}
                onChange={(e) => setFieldValue("newPassword", e.target.value)}
                className="w-full rounded-lg border border-fb-stroke bg-fb-surface px-3 py-2 focus:outline-none focus:ring-2 focus:ring-fb-primary"
              />
              {fieldErrors.newPassword && <p className="mt-1 text-xs text-red-600">{fieldErrors.newPassword}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-fb-text">Confirmar nueva contraseña</label>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(e) => setFieldValue("confirmPassword", e.target.value)}
                className="w-full rounded-lg border border-fb-stroke bg-fb-surface px-3 py-2 focus:outline-none focus:ring-2 focus:ring-fb-primary"
              />
              {fieldErrors.confirmPassword && <p className="mt-1 text-xs text-red-600">{fieldErrors.confirmPassword}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-lg bg-fb-primary px-4 py-2.5 font-medium text-fb-white transition hover:bg-fb-primary-hover disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
