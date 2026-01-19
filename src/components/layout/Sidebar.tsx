import { useEffect, useState, useRef } from "react";
import { categoryService, type CategoryRes } from "../../services/categoryService";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

type SidebarProps = {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategoryId: number | null;
  onCategorySelect: (id: number | null) => void;
};

export const Sidebar = ({ searchQuery, onSearchChange, selectedCategoryId, onCategorySelect }: SidebarProps) => {
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

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
      {/* Estilos del scrollbar */}
      <style>{`
        .modern-scrollbar::-webkit-scrollbar {
          width: 6px; 
        }
        .modern-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .modern-scrollbar::-webkit-scrollbar-thumb {
          background-color: #d1d5db;
          border-radius: 20px;
          border: 1px solid transparent; 
          background-clip: content-box;
        }
        .modern-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #9ca3af;
        }
        .modern-scrollbar::-webkit-scrollbar-button {
          display: block !important;
          height: 3px !important;
          width: 6px; 
          background-color: transparent;
        }

        /* Ocultar scrollbar en móvil para scroll horizontal */
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* VISTA MÓVIL - Buscador + Categorías Horizontales */}
      <div className="lg:hidden col-span-full space-y-3">
        <div className="px-0">
          <input
            type="text"
            placeholder="Buscar en marketplease..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full px-4 py-3 border border-fb-stroke rounded-lg focus:outline-none focus:ring-2 focus:ring-fb-primary bg-fb-surface"
          />
        </div>

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
        {/* Buscador */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Buscar en marketplease..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full px-3 py-2 border border-fb-stroke rounded-lg focus:outline-none focus:ring-2 focus:ring-fb-primary"
          />
        </div>

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