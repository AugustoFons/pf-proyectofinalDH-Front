import { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { productService } from "../../services/productService";
import { categoryService, type CategoryRes } from "../../services/categoryService";
import type { ProductRes } from "../../types/product";

type Props = { mode: "create" | "edit" };

//type Category = { id: number; name: string };

export default function AdminProductForm({ mode }: Props) {
  const { id } = useParams();
  const navigate = useNavigate();

  const isEdit = mode === "edit";

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [categories, setCategories] = useState<CategoryRes[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<string>("");
  const [imageUrls, setImageUrls] = useState<string[]>([""]);
  const [categoryIds, setCategoryIds] = useState<number[]>([]);

  useEffect(() => {
    categoryService.list().then(setCategories).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    if (!isEdit || !id) return;

    setLoading(true);
    productService
      .getById(id)
      .then((p: ProductRes) => {
        setName(p.name ?? "");
        setDescription(p.description ?? "");
        setPrice(p.price != null ? String(p.price) : "");
        setImageUrls(p.images?.length ? p.images : [""]);
        setCategoryIds(p.categories ?? []);
      })
      .catch((e: any) => setError(e?.message ?? "Error cargando producto"))
      .finally(() => setLoading(false));
  }, [isEdit, id]);

  const toggleCategory = (catId: number) => {
    setCategoryIds((prev) =>
      prev.includes(catId) ? prev.filter((x) => x !== catId) : [...prev, catId]
    );
  };

  const setImgAt = (idx: number, value: string) =>
    setImageUrls((prev) => prev.map((v, i) => (i === idx ? value : v)));

  const addImg = () => setImageUrls((prev) => [...prev, ""]);
  const removeImg = (idx: number) =>
    setImageUrls((prev) => {
      const next = prev.filter((_, i) => i !== idx);
      return next.length ? next : [""];
    });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }

    const payload = {
      name: name.trim() || null,
      description: description.trim() || null,
      price: price.trim() ? Number(price) : null,
      imageUrls: imageUrls.map((x) => x.trim()).filter(Boolean),
      categoryIds,
    };

    setSaving(true);
    try {
      if (isEdit) {
        await productService.update(Number(id), payload as any);
      } else {
        await productService.create(payload as any);
      }
      navigate("/administracion");
    } catch (e: any) {
      setError(e?.message ?? "No se pudo guardar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="pt-1 bg-fb-background min-h-screen">
      <div className="max-w-[70rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-fb-surface border border-fb-stroke rounded-xl p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="font-sans text-xl font-semibold text-fb-text">
                {isEdit ? "Editar producto" : "Nuevo producto"}
              </h1>
              <p className="mt-1 text-sm black">
                Cargá datos, imágenes y categorías para publicar tu producto.
              </p>
            </div>

            <NavLink
              to="/administracion"
              className="px-4 py-2 rounded-md font-sans font-medium transition bg-fb-surface text-fb-primary border border-fb-primary hover:bg-fb-primary/10"
            >
              Volver
            </NavLink>
          </div>

          {error && <p className="mt-4 text-red-700">{error}</p>}

          {loading ? (
            <p className="mt-6 text-fb-text-secondary">Cargando...</p>
          ) : (
            <form
              onSubmit={onSubmit} 
              className="mt-6 grid grid-cols-12 gap-6">
              <div className="col-span-12 lg:col-span-7 space-y-5">

                <div>
                  <label className="block text-sm font-semibold text-fb-text mb-1">Nombre</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-fb-stroke rounded-lg focus:outline-none focus:ring-2 focus:ring-fb-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-fb-text mb-1">Precio</label>
                  <input
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    inputMode="decimal"
                    className="w-full px-3 py-2 border border-fb-stroke rounded-lg focus:outline-none focus:ring-2 focus:ring-fb-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-fb-text mb-1">Descripción</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-fb-stroke rounded-lg focus:outline-none focus:ring-2 focus:ring-fb-primary min-h-28"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-semibold text-fb-text mb-1">
                      Imágenes (URLs)
                    </label>
                    <button
                      type="button"
                      onClick={addImg}
                      className="px-3 py-1.5 rounded-md font-sans font-medium transition bg-fb-surface text-fb-primary border border-fb-primary hover:bg-fb-primary/10 text-sm"
                    >
                      + Agregar
                    </button>
                  </div>

                  <div className="mt-2 space-y-2">
                    {imageUrls.map((img, idx) => (
                      <div key={idx} className="flex gap-2">
                        <input
                          value={img}
                          onChange={(e) => setImgAt(idx, e.target.value)}
                          className="flex-1 px-3 py-2 border border-fb-stroke rounded-lg focus:outline-none focus:ring-2 focus:ring-fb-primary"
                          placeholder="https://..."
                        />
                        <button
                          type="button"
                          onClick={() => removeImg(idx)}
                          className="px-3 py-2 rounded-lg border border-fb-stroke hover:bg-black/5 transition text-fb-text-secondary"
                          title="Quitar"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-fb-primary hover:bg-fb-primary-hover text-fb-white font-sans font-medium px-4 py-2 rounded-md transition disabled:opacity-60"
                  >
                    {saving ? "Guardando..." : isEdit ? "Guardar" : "Crear"}
                  </button>

                  <NavLink
                    to="/administracion"
                    className="bg-fb-neutral hover:bg-fb-neutral-hover text-fb-black font-sans font-medium px-4 py-2 rounded-md transition"
                  >
                    Cancelar
                  </NavLink>
                </div>
              </div>

              {/* Categorías (col derecha) */}
              <aside className="col-span-12 lg:col-span-5">
                <div className="bg-fb-surface border border-fb-stroke rounded-xl p-4">
                  <h2 className="font-sans text-sm font-semibold text-fb-text mb-2">
                    Categorías
                  </h2>

                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((c) => {
                      const active = categoryIds.includes(c.id);
                      return (
                        <button
                          type="button"
                          key={c.id}
                          onClick={() => toggleCategory(c.id)}
                          className={[
                            "text-left cursor-pointer rounded-md px-2 py-2 transition border",
                            active
                              ? "bg-fb-primary/10 text-fb-primary font-semibold border-fb-primary"
                              : "hover:text-fb-primary hover:bg-black/5 border-fb-stroke text-fb-text-secondary",
                          ].join(" ")}
                        >
                          {c.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </aside>
            </form>
          )}
        </div>
      </div>
    </main>
  )
}