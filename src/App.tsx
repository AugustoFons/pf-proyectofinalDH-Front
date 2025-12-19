import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/layout/Header'
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import Footer from './components/layout/Footer'

function App() {

  return (
    <BrowserRouter>
      <div className="font-sans">
        <Header />
        <main className='py-14 bg-fb-background min-h-screen'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path="/producto/:id" element={<ProductDetail />} />
            <Route path='/admin' element={<p>Hola</p>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
