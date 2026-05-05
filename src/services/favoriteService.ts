import { api } from "./api";

export const favoriteService = {
  /**
   * Obtiene la lista de IDs de productos marcados como favoritos por el usuario.
   */
  async getFavorites(email: string): Promise<number[]> {
    return api.get<number[]>(`/users/${encodeURIComponent(email)}/favorites`);
  },

  /**
   * Agrega un producto a la lista de favoritos.
   */
  async addFavorite(email: string, productId: number): Promise<void> {
    return api.post<void>(`/users/${encodeURIComponent(email)}/favorites/${productId}`, {});
  },

  /**
   * Elimina un producto de la lista de favoritos.
   */
  async removeFavorite(email: string, productId: number): Promise<void> {
    return api.delete<void>(`/users/${encodeURIComponent(email)}/favorites/${productId}`);
  }
};
