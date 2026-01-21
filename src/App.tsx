import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/layout/Header'
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import Footer from './components/layout/Footer'
import AdminProductForm from "./pages/admin/AdminProductForm";
import ProtectedRoute from "./auth/ProtectedRoute";

function App() {

  return (
    <BrowserRouter>
      <div className="font-sans">
        <Header />
        <main className='py-14 bg-fb-background min-h-screen'>
          <Routes>
            <Route path='/' element={<Home adminMode={false} />} />
            <Route path="/producto/:id" element={<ProductDetail />} />
            <Route path='/administracion' element={<ProtectedRoute><Home adminMode={true} /></ProtectedRoute>} />
            <Route path='/administracion/producto/nuevo' element={<ProtectedRoute><AdminProductForm mode="create" /></ProtectedRoute>} />
            <Route path='/administracion/producto/:id/editar' element={<ProtectedRoute><AdminProductForm mode="edit" /></ProtectedRoute>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
