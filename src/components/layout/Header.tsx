import { Link } from "react-router-dom"

export default function Header() {
  return (
    <header className="w-full fixed top-0 left-0 z-50 bg-fb-surface border-b border-fb-stroke">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-28 flex items-center justify-between">

        {/* Logo + Lema */}
        <Link to="/" className="flex items-center gap-4">

          <div className="bg-fb-primary text-fb-white font-bold rounded-lg text-[28px] w-12 h-11 flex items-center justify-center">
            <span className="transform -translate-y-[3px]">m</span>
          </div>
          <span className="font-sans text-2xl font-semibold text-fb-primary tracking-tight italic skew-x-12 relative -top-0.5">
            marketplease!
          </span>
        </Link>

        {/* Botones */}
        <div className="flex gap-4 relative -top-0.5">
          <button className="bg-fb-primary hover:bg-fb-primary-hover text-fb-white font-sans font-medium px-4 py-2 rounded-md transition">
            Iniciar sesión
          </button>
          <button className="bg-[#42B72A] hover:bg-green-600 text-fb-white font-sans font-medium px-4 py-2 rounded-md transition">
            Crear cuenta
          </button>
        </div>
      </div>
    </header>
  )
}
