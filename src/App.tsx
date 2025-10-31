import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/layout/Header'
import Home from './pages/Home'

function App() {

  return (
    <BrowserRouter>
      <div className="font-sans">
        <Header />
        <main className='pt-14 bg-fb-background min-h-screen'>
          <Routes>
            <Route path='/' element={<Home />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
