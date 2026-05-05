import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../auth/AuthContext';
import { favoriteService } from '../services/favoriteService';

type FavoritesContextType = {
  favoriteIds: number[];
  isFavorite: (productId: number) => boolean;
  toggleFavorite: (productId: number) => Promise<void>;
  isLoadingFavorites: boolean;
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: import("react").ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(false);

  const fetchFavorites = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setFavoriteIds([]);
      return;
    }
    
    setIsLoadingFavorites(true);
    try {
      const ids = await favoriteService.getFavorites(user.email);
      setFavoriteIds(ids);
    } catch (error) {
      console.error("Error al obtener los favoritos", error);
    } finally {
      setIsLoadingFavorites(false);
    }
  }, [user, isAuthenticated]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const isFavorite = useCallback((productId: number) => {
    return favoriteIds.includes(productId);
  }, [favoriteIds]);

  const toggleFavorite = useCallback(async (productId: number) => {
    if (!isAuthenticated || !user) {
      alert("Por favor, inicia sesión para guardar en favoritos.");
      return;
    }

    const currentIsFav = favoriteIds.includes(productId);
    
    // Optimistic UI update
    setFavoriteIds(prev => 
      currentIsFav ? prev.filter(id => id !== productId) : [...prev, productId]
    );

    try {
      if (currentIsFav) {
        await favoriteService.removeFavorite(user.email, productId);
      } else {
        await favoriteService.addFavorite(user.email, productId);
      }
    } catch (error) {
      console.error("Error al modificar favoritos", error);
      // Revert on error
      setFavoriteIds(prev => 
        currentIsFav ? [...prev, productId] : prev.filter(id => id !== productId)
      );
      alert("Hubo un problema al modificar favoritos");
    }
  }, [isAuthenticated, user, favoriteIds]);

  const value = useMemo(() => ({
    favoriteIds,
    isFavorite,
    toggleFavorite,
    isLoadingFavorites
  }), [favoriteIds, isFavorite, toggleFavorite, isLoadingFavorites]);

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites debe usarse dentro de FavoritesProvider');
  }
  return context;
}
