import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/layout/Header'
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import Footer from './components/layout/Footer'
import AdminProductForm from "./pages/admin/AdminProductForm";

function App() {

  return (
    <BrowserRouter>
      <div className="font-sans">
        <Header />
        <main className='py-14 bg-fb-background min-h-screen'>
          <Routes>
            <Route path='/' element={<Home adminMode={false} />} />
            <Route path="/producto/:id" element={<ProductDetail />} />
            <Route path='/administracion' element={<Home adminMode={true} />} /> {/* todo: borrar referencias a ruta admin en navbar */}
            <Route path='/administracion/producto/nuevo' element={<AdminProductForm mode="create" />} />
            <Route path='/administracion/producto/:id/editar' element={<AdminProductForm mode="edit" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
