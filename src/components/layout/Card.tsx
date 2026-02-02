import { NavLink } from "react-router-dom";
import { productService } from "../../services/productService";
import { HiPencil, HiTrash } from "react-icons/hi";
import { PopUp } from "../utils/PopUp";
import { useState } from "react";

type CardProps = {
  id: number;
  title: string;
  image?: string;
  description?: string;
  price?: number;
  adminMode?: boolean;
  onDeleted?: (id: number) => void;
}

export function Card({ id, title, image, price, adminMode = false, onDeleted }: CardProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.location.href = `/administracion/producto/${id}/editar`;
  };

  const handleDelete = async () => {
    try {
      await productService.delete(id);
      onDeleted?.(id);
    } catch (err: any) {
      alert(err?.message ?? "No se pudo eliminar");
    }
  };

  return (
    <>
      <NavLink to={`/producto/${id}`}>
        <article className="relative bg-fb-surface border border-fb-stroke rounded-lg overflow-hidden shadow-sm">
          {adminMode && (
            <div className="absolute top-3 right-3 z-10 flex gap-1.5  transition-opacity duration-200">
              <button
                onClick={handleEdit}
                className="p-2 rounded-full bg-white/90 backdrop-blur-sm border border-fb-stroke shadow-sm hover:bg-white hover:border-blue-300 hover:text-fb-primary transition-all cursor-pointer"
                aria-label="Editar producto"
              >
                <HiPencil className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowConfirm(true);
                }}
                className="p-2 rounded-full bg-white/90 backdrop-blur-sm border border-fb-stroke shadow-sm hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all cursor-pointer"
                aria-label="Eliminar producto"
              >
                <HiTrash className="w-4 h-4" />
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

      <PopUp
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleDelete}
        title="¿Eliminar producto?"
        message={`¿Estás seguro de que deseas eliminar "${title}"? Esta acción no se puede deshacer.`}
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        variant="danger"
      />
    </>
  )
}
