import { NavLink } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-fb-surface border-t border-fb-stroke">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col items-center gap-3">
          
          {/* Isologotipo centrado */}
          <NavLink to="/" className="flex items-center gap-3 group">
            <div className="bg-fb-primary group-hover:bg-fb-primary-hover transition text-fb-white font-bold rounded-lg text-2xl w-10 h-9 flex items-center justify-center">
              <span className="transform -translate-y-[2px]">m</span>
            </div>
            <span className="font-sans text-xl font-semibold text-fb-primary group-hover:text-fb-primary-hover transition tracking-tight italic skew-x-12">
              marketplease!
            </span>
          </NavLink>

          {/* Copyright */}
          <div className="text-fb-text-secondary text-sm font-sans text-center">
            © {currentYear} marketplease! · Todos los derechos reservados
          </div>
        </div>
      </div>
    </footer>
  );
}