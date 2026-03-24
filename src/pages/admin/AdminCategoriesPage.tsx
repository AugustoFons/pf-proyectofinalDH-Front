import { useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import { TbArrowLeft } from "react-icons/tb";
import { categoryService, type CategoryRes } from "../../services/categoryService";
import { PopUp } from "../../components/utils/PopUp";

type EditCategoryState = {
  id: number;
  originalName: string;
};

type ToastState = {
  id: number;
  message: string;
};

const PAGE_SIZE = 8;

function parseError(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryRes[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);

  const [createName, setCreateName] = useState("");
  const [creating, setCreating] = useState(false);

  const [editing, setEditing] = useState<EditCategoryState | null>(null);
  const [editName, setEditName] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  const [categoryToDelete, setCategoryToDelete] = useState<CategoryRes | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteModalError, setDeleteModalError] = useState<string | null>(null);
  const [page, setPage] = useState(0);

  const sortedCategories = useMemo(
    () => [...categories].sort((a, b) => a.name.localeCompare(b.name, "es", { sensitivity: "base" })),
    [categories]
  );

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(sortedCategories.length / PAGE_SIZE)),
    [sortedCategories.length]
  );

  const canGoPrev = useMemo(() => page > 0, [page]);
  const canGoNext = useMemo(() => page + 1 < totalPages, [page, totalPages]);

  const pagedCategories = useMemo(() => {
    const start = page * PAGE_SIZE;
    return sortedCategories.slice(start, start + PAGE_SIZE);
  }, [page, sortedCategories]);

  const showToast = (message: string) => {
    setToast({ id: Date.now(), message });
  };

  const fetchCategories = () => {
    setLoading(true);
    setError(null);

    categoryService
      .list()
      .then((data) => setCategories(data))
      .catch((e: unknown) => setError(parseError(e, "No se pudo cargar el listado de categorias")))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (page + 1 > totalPages) {
      setPage(Math.max(totalPages - 1, 0));
    }
  }, [page, totalPages]);

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = createName.trim();

    if (!name) {
      setError("El nombre de la categoria es obligatorio");
      return;
    }

    setCreating(true);
    setError(null);

    try {
      const created = await categoryService.create(name);
      setCategories((prev) => [...prev, created]);
      setCreateName("");
      showToast("Categoria creada con exito");
    } catch (e: unknown) {
      setError(parseError(e, "No se pudo crear la categoria"));
    } finally {
      setCreating(false);
    }
  };

  const openEdit = (category: CategoryRes) => {
    setEditing({ id: category.id, originalName: category.name });
    setEditName(category.name);
    setError(null);
  };

  const closeEdit = () => {
    if (savingEdit) return;
    setEditing(null);
    setEditName("");
  };

  const onSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;

    const name = editName.trim();

    if (!name) {
      setError("El nombre de la categoria es obligatorio");
      return;
    }

    if (name === editing.originalName) {
      closeEdit();
      return;
    }

    setSavingEdit(true);
    setError(null);

    try {
      const updated = await categoryService.update(editing.id, name);
      setCategories((prev) => prev.map((item) => (item.id === editing.id ? updated : item)));
      closeEdit();
    } catch (e: unknown) {
      setError(parseError(e, "No se pudo editar la categoria"));
    } finally {
      setSavingEdit(false);
    }
  };

  const onDelete = async () => {
    if (!categoryToDelete) return;

    setDeletingId(categoryToDelete.id);
    setDeleteModalError(null);

    try {
      await categoryService.delete(categoryToDelete.id);
      setCategories((prev) => prev.filter((item) => item.id !== categoryToDelete.id));
      setCategoryToDelete(null);
      setDeleteModalError(null);
      showToast("Categoria eliminada con exito");
    } catch (e: unknown) {
      setDeleteModalError(parseError(e, "No se pudo eliminar la categoria"));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="pt-1 bg-fb-background min-h-screen">
      {toast && (
        <div className="fixed top-5 right-5 z-[70] rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-800 shadow-lg">
          {toast.message}
        </div>
      )}

      <div className="max-w-[70rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-fb-surface border border-fb-stroke rounded-xl p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="font-sans text-xl font-semibold text-fb-text">Gestión de categorias</h1>
              <p className="mt-1 text-sm text-fb-text-secondary">
                Crea, edita y elimina categorias. Si una categoria tiene productos, el sistema bloqueara su eliminacion.
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

          <form onSubmit={onCreate} className="mt-6 flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={createName}
              onChange={(e) => setCreateName(e.target.value)}
              placeholder="Nombre de nueva categoria"
              className="w-full sm:flex-1 rounded-lg border border-fb-stroke bg-fb-surface px-3 py-2 focus:outline-none focus:ring-2 focus:ring-fb-primary"
              maxLength={100}
              disabled={creating}
            />
            <button
              type="submit"
              disabled={creating}
              className="px-4 py-2 rounded-md bg-fb-primary text-fb-white hover:bg-fb-primary-hover transition disabled:opacity-60 cursor-pointer"
            >
              {creating ? "Guardando..." : "Agregar categoria"}
            </button>
          </form>

          {loading ? (
            <p className="mt-6 text-fb-text-secondary">Cargando categorias...</p>
          ) : (
            <>
              <div className="mt-6 overflow-x-auto rounded-lg border border-fb-stroke">
                <table className="w-full text-sm">
                  <thead className="bg-fb-neutral">
                    <tr>
                      <th className="text-left px-4 py-3 text-fb-text">Nombre</th>
                      <th className="text-right px-4 py-3 text-fb-text">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagedCategories.map((category) => {
                      const isDeleting = deletingId === category.id;
                      return (
                        <tr key={category.id} className="border-t border-fb-stroke">
                          <td className="px-4 py-3 text-fb-text">{category.name}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => openEdit(category)}
                                className="px-3 py-2 rounded-md text-sm font-medium transition cursor-pointer bg-fb-primary/10 text-fb-primary hover:bg-fb-primary/20"
                              >
                                Editar
                              </button>
                              <button
                                type="button"
                                disabled={isDeleting}
                                onClick={() => {
                                  setDeleteModalError(null);
                                  setCategoryToDelete(category);
                                }}
                                className="px-3 py-2 rounded-md text-sm font-medium transition cursor-pointer disabled:opacity-60 bg-red-100 text-red-700 hover:bg-red-200"
                              >
                                {isDeleting ? "Eliminando..." : "Eliminar"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}

                    {sortedCategories.length === 0 && (
                      <tr>
                        <td colSpan={2} className="px-4 py-8 text-center text-fb-text-secondary">
                          No hay categorias para mostrar.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {sortedCategories.length > 0 && (
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-sm text-fb-text-secondary">
                    Pagina {page + 1} de {totalPages}
                  </p>
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
              )}
            </>
          )}
        </div>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={closeEdit} />

          <div className="flex min-h-full items-center justify-center p-4">
            <div
              className="relative bg-white rounded-xl shadow-2xl max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <form onSubmit={onSaveEdit} className="p-6">
                <h3 className="text-lg font-semibold text-gray-900">Editar categoria</h3>
                <p className="mt-1 text-sm text-gray-600">Actualiza el nombre y guarda los cambios.</p>

                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="mt-4 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-fb-primary"
                  maxLength={100}
                  disabled={savingEdit}
                  autoFocus
                />

                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={closeEdit}
                    disabled={savingEdit}
                    className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition focus:outline-none focus:ring-2 focus:ring-gray-300 cursor-pointer disabled:opacity-60"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={savingEdit}
                    className="flex-1 px-4 py-2.5 text-sm font-medium text-white rounded-lg transition focus:outline-none focus:ring-2 bg-fb-primary hover:bg-fb-primary-hover cursor-pointer disabled:opacity-60"
                  >
                    {savingEdit ? "Guardando..." : "Guardar"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <PopUp
        isOpen={Boolean(categoryToDelete)}
        onClose={() => {
          if (deletingId) return;
          setDeleteModalError(null);
          setCategoryToDelete(null);
        }}
        onConfirm={onDelete}
        title="Eliminar categoria"
        message={`Esta accion no se puede deshacer. Categoria: ${categoryToDelete?.name ?? ""}`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
        closeOnConfirm={false}
        isConfirming={Boolean(deletingId)}
        errorMessage={deleteModalError}
      />
    </main>
  );
}