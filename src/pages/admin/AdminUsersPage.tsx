import { useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import { TbArrowLeft } from "react-icons/tb";
import { userService } from "../../services/userService";
import type { UserListItem } from "../../types/user";

const PAGE_SIZE = 10;

function toggleAdminRole(roles: string[]): string[] {
  const unique = Array.from(new Set(roles));
  const hasAdmin = unique.includes("ROLE_ADMIN");

  if (hasAdmin) {
    return unique.filter((role) => role !== "ROLE_ADMIN");
  }

  return [...unique, "ROLE_ADMIN"];
}

export default function AdminUsersPage() {
  const [page, setPage] = useState(0);
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingUserId, setUpdatingUserId] = useState<number | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    userService
      .list(page, PAGE_SIZE)
      .then((res) => {
        setUsers(res.content);
        setTotalPages(Number.isFinite(res.totalPages) ? res.totalPages : 0);
      })
      .catch((e: unknown) => {
        const message = e instanceof Error ? e.message : "No se pudo cargar el listado de usuarios";
        setError(message);
      })
      .finally(() => setLoading(false));
  }, [page]);

  const canGoPrev = useMemo(() => page > 0, [page]);
  const canGoNext = useMemo(() => page + 1 < totalPages, [page, totalPages]);

  const onToggleAdmin = async (user: UserListItem) => {
    setError(null);
    setUpdatingUserId(user.id);

    try {
      const nextRoles = toggleAdminRole(user.roles);
      const updated = await userService.updateRoles(user.id, { roles: nextRoles });

      setUsers((prev) => prev.map((item) => (item.id === user.id ? updated : item)));
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "No se pudo actualizar el rol";
      setError(message);
    } finally {
      setUpdatingUserId(null);
    }
  };

  return (
    <main className="pt-1 bg-fb-background min-h-screen">
      <div className="max-w-[70rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-fb-surface border border-fb-stroke rounded-xl p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="font-sans text-xl font-semibold text-fb-text">Gestión de usuarios</h1>
              <p className="mt-1 text-sm text-fb-text-secondary">
                Agregá o quitá permisos de administrador a usuarios registrados.
              </p>
            </div>

            <NavLink
              to="/administracion"
              className="px-4 py-2 rounded-md font-sans font-medium transition bg-fb-surface text-fb-primary border border-fb-primary hover:bg-fb-primary/10 flex items-center gap-[0.5px]"
            >
              <TbArrowLeft size={18} strokeWidth={2.5} />
              Volver
            </NavLink>
          </div>

          {error && <p className="mt-4 text-red-700">{error}</p>}

          {loading ? (
            <p className="mt-6 text-fb-text-secondary">Cargando usuarios...</p>
          ) : (
            <>
              <div className="mt-6 overflow-x-auto rounded-lg border border-fb-stroke">
                <table className="w-full text-sm">
                  <thead className="bg-fb-neutral">
                    <tr>
                      <th className="text-left px-4 py-3 text-fb-text">Nombre</th>
                      <th className="text-left px-4 py-3 text-fb-text">Email</th>
                      <th className="text-left px-4 py-3 text-fb-text">Roles</th>
                      <th className="text-left px-4 py-3 text-fb-text">Estado</th>
                      <th className="text-right px-4 py-3 text-fb-text">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => {
                      const hasAdmin = user.roles.includes("ROLE_ADMIN");
                      const isUpdating = updatingUserId === user.id;

                      return (
                        <tr key={user.id} className="border-t border-fb-stroke">
                          <td className="px-4 py-3 text-fb-text">
                            {`${user.firstName} ${user.lastName}`.trim() || "Sin nombre"}
                          </td>
                          <td className="px-4 py-3 text-fb-text-secondary">{user.email}</td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-2">
                              {user.roles.length ? (
                                user.roles.map((role) => (
                                  <span
                                    key={role}
                                    className="inline-flex items-center rounded-full border border-fb-stroke px-2.5 py-1 text-xs text-fb-text"
                                  >
                                    {role}
                                  </span>
                                ))
                              ) : (
                                <span className="text-fb-text-secondary">Sin roles</span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={[
                                "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
                                user.enabled
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-600",
                              ].join(" ")}
                            >
                              {user.enabled ? "Activo" : "Inactivo"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              type="button"
                              disabled={isUpdating}
                              onClick={() => onToggleAdmin(user)}
                              className={[
                                "px-3 py-2 rounded-md text-sm font-medium transition cursor-pointer disabled:opacity-60",
                                hasAdmin
                                  ? "bg-red-100 text-red-700 hover:bg-red-200"
                                  : "bg-fb-primary text-fb-white hover:bg-fb-primary-hover",
                              ].join(" ")}
                            >
                              {isUpdating ? "Guardando..." : hasAdmin ? "Quitar admin" : "Agregar admin"}
                            </button>
                          </td>
                        </tr>
                      );
                    })}

                    {users.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-fb-text-secondary">
                          No hay usuarios para mostrar.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-fb-text-secondary">Página {page + 1} de {Number.isFinite(totalPages) ? Math.max(totalPages, 1) : 1}</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={!canGoPrev}
                    onClick={() => setPage((p) => Math.max(p - 1, 0))}
                    className="px-3 py-2 rounded-md border border-fb-stroke text-fb-text hover:bg-fb-neutral transition disabled:opacity-50 cursor-pointer"
                  >
                    Anterior
                  </button>
                  <button
                    type="button"
                    disabled={!canGoNext}
                    onClick={() => setPage((p) => p + 1)}
                    className="px-3 py-2 rounded-md border border-fb-stroke text-fb-text hover:bg-fb-neutral transition disabled:opacity-50 cursor-pointer"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}