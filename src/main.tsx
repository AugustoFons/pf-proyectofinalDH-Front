import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './auth/AuthContext'
import { FavoritesProvider } from './hooks/useFavorites'

createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <FavoritesProvider>
      <App />
    </FavoritesProvider>
  </AuthProvider>,
)
