import { useEffect, useState, useRef } from "react";
import { NavLink } from "react-router-dom";
import { categoryService, type CategoryRes } from "../../services/categoryService";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import '../../styles/scrollbars.css';

type SidebarProps = {
  adminMode?: boolean;
  selectedCategoryId: number | null;
  onCategorySelect: (id: number | null) => void;
};

export const Sidebar = ({ adminMode = false, selectedCategoryId, onCategorySelect }: SidebarProps) => {
  const [categories, setCategories] = useState<CategoryRes[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  useEffect(() => {
    categoryService.list()
      .then((data) => {
        setCategories(data);
      })
      .catch((error) => {
        console.error("Error al cargar categorías:", error);
      });
  }, []);

  // Detectar si se pueden mostrar flechas
  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    // Esperar a que el DOM se actualice
    const timer = setTimeout(() => {
      checkScroll();
    }, 100);

    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', checkScroll);
      // Verificar cuando cambia el tamaño de la ventana
      window.addEventListener('resize', checkScroll);
      return () => {
        clearTimeout(timer);
        scrollContainer.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
    return () => clearTimeout(timer);
  }, [categories]);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = 200;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {/* VISTA MÓVIL - Categorías Horizontales */}
      <div className="lg:hidden col-span-full space-y-3">
        {/* Categorías en horizontal con flechas */}
        <div className="flex items-center gap-2">
          {showLeftArrow && (
            <button
              onClick={() => scroll('left')}
              className="flex-shrink-0 rounded-full p-1.5 transition text-fb-text-secondary hover:text-fb-primary hover:bg-fb-primary/5 cursor-pointer"
              aria-label="Scroll left"
            >
              <HiChevronLeft className="w-4 h-4" />
            </button>
          )}

          {/* Contenedor de categorías */}
          <div
            ref={scrollRef}
            className="hide-scrollbar flex gap-2 overflow-x-auto flex-1"
          >
            <button
              onClick={() => onCategorySelect(null)}
              className={[
                "flex-shrink-0 px-4 py-2 rounded-full text-sm transition whitespace-nowrap",
                selectedCategoryId == null
                  ? "bg-fb-primary/10 text-fb-primary font-semibold"
                  : "text-fb-text-secondary hover:text-fb-primary hover:bg-black/5"
              ].join(" ")}
            >
              Todas
            </button>

            {categories.map((category) => {
              const active = selectedCategoryId === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => onCategorySelect(active ? null : category.id)}
                  className={[
                    "flex-shrink-0 px-4 py-2 rounded-full text-sm transition whitespace-nowrap",
                    active
                      ? "bg-fb-primary/10 text-fb-primary font-semibold"
                      : "text-fb-text-secondary hover:text-fb-primary hover:bg-black/5"
                  ].join(" ")}
                >
                  {category.name}
                </button>
              );
            })}
          </div>

          {showRightArrow && (
            <button
              onClick={() => scroll('right')}
              className="flex-shrink-0 rounded-full p-1.5 transition text-fb-text-secondary hover:text-fb-primary hover:bg-fb-primary/5 cursor-pointer"
              aria-label="Scroll right"
            >
              <HiChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* VISTA DESKTOP - Sidebar */}
      <aside className="
        modern-scrollbar 
        hidden lg:block
        col-span-3 
        bg-fb-surface 
        border border-fb-stroke 
        rounded-lg 
        overflow-hidden 
        shadow-sm 
        p-4 
        h-[76vh] 
        sticky top-32 
        self-start 
        overflow-y-auto
      ">      
        {adminMode && (
          <NavLink
            to="/administracion/categorias"
            className="mb-4 inline-flex w-full justify-center rounded-md bg-fb-primary px-3 py-2 text-sm font-semibold text-fb-white hover:bg-fb-primary-hover transition"
          >
            Editar categorías
          </NavLink>
        )}

        {/* Categorías */}
        <h2 className="font-sans text-sm font-semibold text-fb-text mb-2">
          Categorías
        </h2>
        <ul className="space-y-2 text-fb-text-secondary">
          <li
            onClick={() => onCategorySelect(null)}
            className={[
              "cursor-pointer rounded-md px-2 py-1",
              selectedCategoryId == null
                ? "bg-fb-primary/10 text-fb-primary font-semibold"
                : "hover:text-fb-primary hover:bg-black/5"
            ].join(" ")}
          >
            Todas
          </li>
          {categories.map((category) => {
            const active = selectedCategoryId === category.id;
            return (
              <li
                key={category.id}
                onClick={() => onCategorySelect(active ? null : category.id)}
                className={[
                  "cursor-pointer rounded-md px-2 py-1",
                  active
                    ? "bg-fb-primary/10 text-fb-primary font-semibold"
                    : "hover:text-fb-primary hover:bg-black/5"
                ].join(" ")}
              >
                {category.name}
              </li>
            );
          })}

          {categories.length === 0 && (
            <li className="text-xs text-gray-400">Cargando...</li>
          )}
        </ul>
      </aside>
    </>
  );
};