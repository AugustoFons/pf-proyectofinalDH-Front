import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

export default function Header() {

  const navigate = useNavigate();
  const [devAdmin, setDevAdmin] = useState(
    () => localStorage.getItem("devAdmin") === "true"
  );

  const loginMock = () => {
    localStorage.setItem("devAdmin", "true");
    setDevAdmin(true);
  };

  const logoutMock = () => {
    localStorage.removeItem("devAdmin");
    setDevAdmin(false);
    navigate("/");
  };

  return (
    <header className="w-full sticky top-0 left-0 z-50 bg-fb-surface border-b border-fb-stroke">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-28 flex items-center justify-between">

        {/* Logo + Lema */}
        <NavLink to="/" className="flex items-center gap-4">
          <div className="bg-fb-primary text-fb-white font-bold rounded-lg text-[28px] w-12 h-11 flex items-center justify-center">
            <span className="transform -translate-y-[3px]">m</span>
          </div>
          <span className="font-sans text-2xl font-semibold text-fb-primary tracking-tight italic skew-x-12 relative -top-0.5">
            marketplease!
          </span>
        </NavLink>

        {/* Botones */}
        <div className="flex gap-4 relative -top-0.5">

          {/* Botón Administración (solo visible si devAdmin = true) */}
          {devAdmin && (
            <>
              <NavLink
                to="/administracion/producto/nuevo"
                className="
                  px-4 py-2 rounded-md font-sans font-medium transition
                  bg-fb-primary text-fb-white shadow-md
                  hover:bg-fb-primary-hover
                "
              >
                + Crear
              </NavLink>
              <NavLink
                to="/administracion"
                className={({ isActive }) =>
                  `
                  px-4 py-2 rounded-md font-sans font-medium transition
                  ${isActive
                    ? "bg-fb-primary text-fb-white shadow-md"
                    : "bg-fb-surface text-fb-primary border border-fb-primary hover:bg-fb-primary/10"
                  }
              `
                }
              >
                Administración
              </NavLink>
            </>

          )}


          {/* Estado público */}
          {!devAdmin && (
            <>
              <button
                className="bg-fb-primary hover:bg-fb-primary-hover text-fb-white font-sans font-medium px-4 py-2 rounded-md transition cursor-pointer"
                onClick={loginMock}
              >
                Iniciar sesión
              </button>

              <button className="bg-[#42B72A] hover:bg-green-600 text-fb-white font-sans font-medium px-4 py-2 rounded-md transition cursor-pointer">
                Crear cuenta
              </button>
            </>
          )}

          {/* Estado admin */}
          {devAdmin && (
            <button
              className="bg-fb-neutral hover:bg-fb-neutral-hover text-fb-black font-sans font-medium px-4 py-2 rounded-md transition cursor-pointer"
              onClick={logoutMock}
            >
              Cerrar sesión
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
