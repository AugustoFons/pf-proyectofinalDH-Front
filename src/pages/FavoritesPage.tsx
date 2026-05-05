import { useEffect, useState, useRef } from "react";
import { NavLink } from "react-router-dom";
import { useFavorites } from "../hooks/useFavorites";
import { productService } from "../services/productService";
import { Card } from "../components/layout/Card";
import { CardSkeleton } from "../components/layout/CardSkeleton";
import type { ProductRes } from "../types/product";

export default function FavoritesPage() {
  const { favoriteIds, isLoadingFavorites } = useFavorites();
  const [fetchedProducts, setFetchedProducts] = useState<ProductRes[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Mantenemos un registro de las IDs que ya pedimos al servidor
  const fetchedIdsRef = useRef<number[]>([]);

  useEffect(() => {
    const loadInitial = async () => {
      if (isLoadingFavorites) return;

      // Buscar IDs que esten en favoritos y que no hayamos cargado
      const idsToFetch = favoriteIds.filter(id => !fetchedIdsRef.current.includes(id));
      
      if (idsToFetch.length === 0) {
        if (loading) setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const promises = idsToFetch.map((id) => productService.getById(id.toString()));
        const newProducts = await Promise.all(promises);
        setFetchedProducts(prev => [...prev, ...newProducts]);
        // Guardar registro para no volver a pedir en el futuro
        fetchedIdsRef.current = [...fetchedIdsRef.current, ...idsToFetch];
      } catch (err: any) {
        setError(err.message || "Error al cargar tus productos favoritos.");
      } finally {
        setLoading(false);
      }
    };

    loadInitial();
  }, [favoriteIds, isLoadingFavorites]);

  const displayProducts = fetchedProducts.filter(p => favoriteIds.includes(p.id));

  return (
    <main className="max-w-[96rem] mx-auto px-4 sm:px-6 lg:px-8 mt-4">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="font-sans text-2xl font-semibold text-fb-text tracking-tight">Mis Favoritos</h1>
          <p className="mt-1 text-sm text-fb-text-secondary">Aquí encontrarás todos los productos que has guardado.</p>
        </div>
      </div>

      {error && (
        <div className="p-4 mb-6 text-red-700 bg-red-50 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : displayProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayProducts.map((p) => (
            <Card
              key={p.id}
              id={p.id}
              title={p.name}
              image={p.images?.[0] || "/placeholder.png"}
              price={p.price}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg border border-fb-stroke shadow-sm">
          <h2 className="text-lg font-medium text-fb-text mb-2">Aún no tienes favoritos</h2>
          <p className="text-sm text-fb-text-secondary max-w-sm mx-auto">Explora nuestro catálogo y guarda los productos que más te gusten haciendo clic en el ícono del corazón.</p>
          <NavLink to="/" className="mt-6 inline-flex px-5 py-2.5 bg-fb-primary text-white font-medium text-sm rounded-lg hover:bg-fb-primary/90 transition-colors shadow-sm">
            Explorar productos
          </NavLink>
        </div>
      )}
    </main>
  );
}