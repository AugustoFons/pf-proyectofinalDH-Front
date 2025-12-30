import { useEffect, useState } from "react";
import { categoryService, type CategoryRes } from "../../services/categoryService";

type SidebarProps = {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategoryId: number | null;
  onCategorySelect: (id: number | null) => void;
};


export const Sidebar = ({ searchQuery, onSearchChange, selectedCategoryId, onCategorySelect }: SidebarProps) => {
  const [categories, setCategories] = useState<CategoryRes[]>([]);


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

  return (
    <aside className="col-span-3 bg-fb-surface border border-fb-stroke rounded-lg overflow-hidden shadow-sm p-4 h-[76vh] sticky top-32 self-start overflow-y-auto">
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
          <li className="text-xs text-gray-400">Cargando.</li>
        )}
      </ul>
    </aside>
  )
}