import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/layout/Header'
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'

function App() {

  return (
    <BrowserRouter>
      <div className="font-sans">
        <Header />
        <main className='pt-14 bg-fb-background min-h-screen'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path="/producto/:id" element={<ProductDetail />} />
            <Route path='/admin' element={<p>Hola</p>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
