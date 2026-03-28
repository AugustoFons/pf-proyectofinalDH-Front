import { useEffect, useState, useRef } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { productService } from "../../services/productService";
import { categoryService, type CategoryRes } from "../../services/categoryService";
import type { ProductRes, FeatureReq } from "../../types/product";
import { TbArrowLeft, TbPlus, TbTrash, TbEdit, TbCheck, TbX } from "react-icons/tb";
import { FEATURE_ICONS, getFeatureIcon } from "../../constants/featureIcons";

type Props = { mode: "create" | "edit" };

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
  const [productType, setProductType] = useState<"RESERVA" | "VENTA">("VENTA");

  // ── Features state ──
  const [features, setFeatures] = useState<FeatureReq[]>([]);
  const [showFeatureEditor, setShowFeatureEditor] = useState(false);
  const [editingFeatureIdx, setEditingFeatureIdx] = useState<number | null>(null);
  const [featureIcon, setFeatureIcon] = useState("");
  const [featureLabel, setFeatureLabel] = useState("");
  const [iconSearch, setIconSearch] = useState("");
  const featureEditorRef = useRef<HTMLDivElement>(null);

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
        setProductType(p.productType === "RESERVA" ? "RESERVA" : "VENTA");
        setFeatures(p.features?.map(f => ({ icon: f.icon, label: f.label })) ?? []);
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

  // ── Feature helpers ──
  const openNewFeature = () => {
    setFeatureIcon("");
    setFeatureLabel("");
    setIconSearch("");
    setEditingFeatureIdx(null);
    setShowFeatureEditor(true);
    setTimeout(() => featureEditorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 100);
  };

  const openEditFeature = (idx: number) => {
    const f = features[idx];
    setFeatureIcon(f.icon);
    setFeatureLabel(f.label);
    setIconSearch("");
    setEditingFeatureIdx(idx);
    setShowFeatureEditor(true);
    setTimeout(() => featureEditorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 100);
  };

  const saveFeature = () => {
    if (!featureIcon || !featureLabel.trim()) return;
    const entry: FeatureReq = { icon: featureIcon, label: featureLabel.trim() };
    if (editingFeatureIdx !== null) {
      setFeatures(prev => prev.map((f, i) => i === editingFeatureIdx ? entry : f));
    } else {
      setFeatures(prev => [...prev, entry]);
    }
    setShowFeatureEditor(false);
    setEditingFeatureIdx(null);
  };

  const removeFeature = (idx: number) => {
    setFeatures(prev => prev.filter((_, i) => i !== idx));
    if (editingFeatureIdx === idx) {
      setShowFeatureEditor(false);
      setEditingFeatureIdx(null);
    }
  };

  const cancelFeatureEditor = () => {
    setShowFeatureEditor(false);
    setEditingFeatureIdx(null);
  };

  const filteredIcons = iconSearch.trim()
    ? FEATURE_ICONS.filter(ic =>
        ic.label.toLowerCase().includes(iconSearch.toLowerCase()) ||
        ic.id.toLowerCase().includes(iconSearch.toLowerCase())
      )
    : FEATURE_ICONS;

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
      productType,
      features,
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
              className="px-4 py-2 rounded-md font-sans font-medium transition bg-fb-surface text-fb-primary border border-fb-primary hover:bg-fb-primary/10 flex items-center gap-[0.5px]"
            >
              <TbArrowLeft size={18} strokeWidth={2.5} />
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
                  <label className="block text-sm font-semibold text-fb-text mb-1">
                    Tipo de producto
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setProductType("VENTA")}
                      className={[
                        "flex-1 px-4 py-2 rounded-lg font-medium transition border cursor-pointer",
                        productType === "VENTA"
                          ? "bg-fb-primary text-fb-white border-fb-primary"
                          : "bg-fb-surface text-fb-text-secondary border-fb-stroke hover:bg-black/5"
                      ].join(" ")}
                    >
                      Venta
                    </button>
                    <button
                      type="button"
                      onClick={() => setProductType("RESERVA")}
                      className={[
                        "flex-1 px-4 py-2 rounded-lg font-medium transition border cursor-pointer",
                        productType === "RESERVA"
                          ? "bg-fb-primary text-fb-white border-fb-primary"
                          : "bg-fb-surface text-fb-text-secondary border-fb-stroke hover:bg-black/5"
                      ].join(" ")}
                    >
                      Reserva
                    </button>
                  </div>
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
                      className="px-3 py-1.5 rounded-md font-sans font-medium transition bg-fb-surface text-fb-primary border border-fb-primary hover:bg-fb-primary/10 text-sm cursor-pointer"
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
                          className="px-3 py-2 rounded-lg border border-fb-stroke hover:bg-black/5 transition text-fb-text-secondary cursor-pointer"
                          title="Quitar"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ════════════════════════════════════════════════
                    CARACTERÍSTICAS
                   ════════════════════════════════════════════════ */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-semibold text-fb-text">
                      Características
                    </label>
                    <button
                      type="button"
                      onClick={openNewFeature}
                      className="px-3 py-1.5 rounded-md font-sans font-medium transition bg-fb-surface text-fb-primary border border-fb-primary hover:bg-fb-primary/10 text-sm cursor-pointer flex items-center gap-1"
                    >
                      <TbPlus size={15} strokeWidth={2.5} />
                      Agregar
                    </button>
                  </div>

                  {/* Lista de features actuales */}
                  {features.length > 0 && (
                    <div className="space-y-2 mb-3">
                      {features.map((feat, idx) => {
                        const iconEntry = getFeatureIcon(feat.icon);
                        const IconComp = iconEntry?.icon;
                        return (
                          <div
                            key={idx}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-fb-stroke bg-fb-background/60 group"
                          >
                            <div className="w-8 h-8 rounded-lg bg-fb-primary/10 flex items-center justify-center shrink-0">
                              {IconComp ? (
                                <IconComp size={18} className="text-fb-primary" />
                              ) : (
                                <span className="text-xs text-fb-text-secondary">?</span>
                              )}
                            </div>
                            <span className="flex-1 text-sm text-fb-text font-medium truncate">
                              {feat.label}
                            </span>
                            <button
                              type="button"
                              onClick={() => openEditFeature(idx)}
                              className="p-1.5 rounded-md hover:bg-fb-primary/10 text-fb-text-secondary hover:text-fb-primary transition cursor-pointer opacity-0 group-hover:opacity-100"
                              title="Editar"
                            >
                              <TbEdit size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeFeature(idx)}
                              className="p-1.5 rounded-md hover:bg-red-50 text-fb-text-secondary hover:text-red-600 transition cursor-pointer opacity-0 group-hover:opacity-100"
                              title="Eliminar"
                            >
                              <TbTrash size={16} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {features.length === 0 && !showFeatureEditor && (
                    <p className="text-sm text-fb-text-secondary italic">
                      Sin características. Hacé clic en "Agregar" para crear una.
                    </p>
                  )}

                  {/* Editor inline */}
                  {showFeatureEditor && (
                    <div
                      ref={featureEditorRef}
                      className="border border-fb-primary/30 rounded-xl p-4 bg-fb-primary/[0.03] space-y-3 animate-in"
                    >
                      <h3 className="text-sm font-semibold text-fb-text">
                        {editingFeatureIdx !== null ? "Editar característica" : "Nueva característica"}
                      </h3>

                      {/* Input texto */}
                      <div>
                        <label className="block text-xs font-medium text-fb-text-secondary mb-1">
                          Texto descriptivo
                        </label>
                        <input
                          value={featureLabel}
                          onChange={(e) => setFeatureLabel(e.target.value)}
                          placeholder="Ej: WiFi de alta velocidad"
                          className="w-full px-3 py-2 border border-fb-stroke rounded-lg focus:outline-none focus:ring-2 focus:ring-fb-primary text-sm"
                          maxLength={200}
                        />
                      </div>

                      {/* Buscador de iconos */}
                      <div>
                        <label className="block text-xs font-medium text-fb-text-secondary mb-1">
                          Icono
                        </label>
                        <input
                          value={iconSearch}
                          onChange={(e) => setIconSearch(e.target.value)}
                          placeholder="Buscar icono..."
                          className="w-full px-3 py-2 border border-fb-stroke rounded-lg focus:outline-none focus:ring-2 focus:ring-fb-primary text-sm mb-2"
                        />
                        <div className="grid grid-cols-6 sm:grid-cols-8 gap-1.5 max-h-40 overflow-y-auto p-1">
                          {filteredIcons.map((ic) => {
                            const selected = featureIcon === ic.id;
                            return (
                              <button
                                key={ic.id}
                                type="button"
                                onClick={() => setFeatureIcon(ic.id)}
                                title={ic.label}
                                className={[
                                  "flex flex-col items-center justify-center p-2 rounded-lg transition cursor-pointer border",
                                  selected
                                    ? "bg-fb-primary/15 border-fb-primary text-fb-primary ring-1 ring-fb-primary/30"
                                    : "border-transparent hover:bg-black/5 text-fb-text-secondary hover:text-fb-text",
                                ].join(" ")}
                              >
                                <ic.icon size={20} />
                                <span className="text-[9px] mt-0.5 leading-tight text-center truncate w-full">
                                  {ic.label}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Preview + actions */}
                      <div className="flex items-center justify-between pt-1">
                        {featureIcon && featureLabel.trim() ? (
                          <div className="flex items-center gap-2 text-sm text-fb-text">
                            {(() => {
                              const Ic = getFeatureIcon(featureIcon)?.icon;
                              return Ic ? <Ic size={18} className="text-fb-primary" /> : null;
                            })()}
                            <span className="font-medium">{featureLabel.trim()}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-fb-text-secondary italic">
                            Seleccioná un icono y escribí un texto
                          </span>
                        )}
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={cancelFeatureEditor}
                            className="px-3 py-1.5 rounded-md text-sm font-medium border border-fb-stroke hover:bg-black/5 transition cursor-pointer flex items-center gap-1 text-fb-text-secondary"
                          >
                            <TbX size={14} />
                            Cancelar
                          </button>
                          <button
                            type="button"
                            onClick={saveFeature}
                            disabled={!featureIcon || !featureLabel.trim()}
                            className="px-3 py-1.5 rounded-md text-sm font-medium bg-fb-primary text-white hover:bg-fb-primary-hover transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
                          >
                            <TbCheck size={14} />
                            {editingFeatureIdx !== null ? "Guardar" : "Agregar"}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-4 pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-fb-primary hover:bg-fb-primary-hover text-fb-white font-sans font-medium px-4 py-2 rounded-md transition disabled:opacity-60 cursor-pointer"
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