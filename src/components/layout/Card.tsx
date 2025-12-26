import { NavLink, useNavigate } from "react-router-dom";
import { productService } from "../../services/productService";

type CardProps = {
  id: number;
  title: string;
  image?: string;
  description?: string;
  price?: number;
  adminMode?: boolean;
  onDeleted?: () => void;
}

export function Card({ id, title, image, price, adminMode = false, onDeleted }: CardProps) {

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.location.href = `/administracion/productos/${id}/editar`;
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const ok = window.confirm(`¿Eliminar "${title}"?`);
    if (!ok) return;

    try {
      await productService.delete(id);
      onDeleted?.();
    } catch (err: any) {
      alert(err?.message ?? "No se pudo eliminar");
    }
  };

  return (
    <NavLink to={`/producto/${id}`}>
      <article className="relative bg-fb-surface border border-fb-stroke rounded-lg overflow-hidden shadow-sm">
        {adminMode && (
          <div className="absolute top-3 right-3 z-10 flex gap-2">
            <button
              onClick={handleEdit}
              className="px-3 py-1.5 rounded-md text-xs font-semibold border border-fb-stroke bg-fb-surface hover:bg-black/5 transition"
            >
              Editar
            </button>
            <button
              onClick={handleDelete}
              className="px-3 py-1.5 rounded-md text-xs font-semibold border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition"
            >
              Eliminar
            </button>
          </div>
        )}

        <img
          src={image || "/placeholder.png"}
          alt={title}
          className="w-full object-cover h-80"
        />
        <div className="p-3">
          <h2 className="font-sans text-sm font-bold text-fb-text">{title}</h2>
          <p className="text-fb-text-secondary text-sm">${price?.toFixed(2)}</p>
        </div>
      </article>
    </NavLink>
  )
}
