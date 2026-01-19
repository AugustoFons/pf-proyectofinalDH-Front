import { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { HiMenu, HiX, HiPlus, HiCog, HiUserAdd } from "react-icons/hi";
import { FiLogIn, FiLogOut } from "react-icons/fi";
import { BiAddToQueue } from "react-icons/bi";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

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

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = () => setIsMenuOpen(false);

  const handleAdminClick = (e: any) => {
    e.preventDefault();
    if (location.pathname === "/administracion") {
      navigate("/");
    } else {
      navigate("/administracion");
    }
    closeMenu();
  };
  
  /* ===== Button styles (modern / minimal) ===== */
  const btnBase =
    "inline-flex items-center justify-center gap-2 whitespace-nowrap select-none " +
    "rounded-full px-4 py-2 text-sm lg:text-base font-medium " +
    "transition-all duration-200 " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fb-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-fb-surface " +
    "active:translate-y-0";

  const btnPrimary =
    btnBase +
    " bg-fb-primary text-fb-white " +
    "shadow-sm hover:shadow-md hover:-translate-y-[1px] " +
    "hover:bg-fb-primary-hover";

  const btnGhost =
    btnBase +
    " bg-transparent text-fb-primary cursor-pointer " +
    "border border-fb-stroke " +
    "hover:bg-fb-primary/10 hover:border-fb-primary/30";

  const btnDangerGhost =
    btnBase +
    " bg-transparent text-fb-black cursor-pointer " +
    "border border-fb-stroke " +
    "hover:bg-fb-neutral/60 hover:border-fb-neutral";

  const btnSuccess =
    btnBase +
    " bg-[#42B72A] text-fb-white cursor-pointer " +
    "shadow-sm hover:shadow-md hover:-translate-y-[1px] hover:bg-green-600";

  const mobileItem =
    "w-full rounded-xl px-4 py-3 font-medium cursor-pointer " +
    "transition-all duration-200 " +
    "flex items-center justify-between gap-2 " +
    "border border-fb-stroke/70 " +
    "hover:border-fb-primary/25 hover:bg-fb-primary/10";

  return (
    <header className="w-full sticky top-0 left-0 z-50 bg-fb-surface border-b border-fb-stroke shadow-xs">
      <div className="max-w-[96rem] mx-auto px-4 sm:px-6 h-16 sm:h-20 lg:h-28 flex items-center justify-between">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-3" onClick={closeMenu}>
          <div className="bg-fb-primary text-fb-white font-bold rounded-lg text-[28px] w-12 h-11 flex items-center justify-center">
            <span className="-translate-y-[3px]">m</span>
          </div>
          <span className="font-sans text-lg sm:text-xl lg:text-2xl font-semibold text-fb-primary tracking-tight italic skew-x-12 relative -top-0.5">
            marketplease!
          </span>
        </NavLink>

        {/* Mobile toggle */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 rounded-full border border-fb-stroke/70 text-fb-primary hover:bg-fb-primary/10 hover:border-fb-primary/30 transition cursor-pointer"
          aria-label="Menú"
        >
          {isMenuOpen ? <HiX size={22} /> : <HiMenu size={22} />}
        </button>

        {/* Desktop buttons */}
        <div className="hidden md:flex gap-3 relative -top-0.5">
          {devAdmin && (
            <>
              <NavLink to="/administracion/producto/nuevo" className={btnPrimary}>
                <BiAddToQueue size={18} />
                <span>Publicar</span>
              </NavLink>

              <button
                onClick={handleAdminClick}
                className={location.pathname === "/administracion" ? btnPrimary : btnGhost}
                style={{ cursor: "pointer" }}
              >
                <HiCog size={18} />
                <span>Administración</span>
              </button>
            </>
          )}

          {!devAdmin && (
            <>
              <button className={btnGhost} onClick={loginMock}>
                <FiLogIn size={18} />
                <span>Iniciar sesión</span>
              </button>

              <button className={btnSuccess}>
                <HiUserAdd size={18} />
                <span>Crear cuenta</span>
              </button>
            </>
          )}

          {devAdmin && (
            <button className={btnDangerGhost} onClick={logoutMock}>
              <FiLogOut size={18} />
              <span>Cerrar sesión</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div
            className="fixed inset-0 bg-black/20"
            onClick={closeMenu}
            aria-hidden="true"
          />

          <div className="absolute top-16 sm:top-20 left-0 w-full px-4">
            <div className="max-w-[96rem] mx-auto">
              <div className="rounded-2xl border border-fb-stroke bg-fb-surface/95 backdrop-blur shadow-lg p-3">
                <div className="flex flex-col gap-2">
                  {devAdmin && (
                    <>
                      <NavLink
                        to="/administracion/producto/nuevo"
                        onClick={closeMenu}
                        className={btnPrimary + " w-full rounded-xl py-3"}
                      >
                        <HiPlus size={20} />
                        <span>Publicar</span>
                      </NavLink>

                      <button
                        onClick={handleAdminClick}
                        className={
                          (location.pathname === "/administracion" ? btnPrimary : btnGhost) +
                          " w-full rounded-xl py-3 cursor-pointer"
                        }
                      >
                        <HiCog size={20} />
                        <span>Administración</span>
                      </button>
                    </>
                  )}

                  {!devAdmin && (
                    <>
                      <button onClick={loginMock} className={mobileItem}>
                        <span className="inline-flex items-center gap-2">
                          <FiLogIn size={20} />
                          Iniciar sesión
                        </span>
                      </button>

                      <button className={btnSuccess + " w-full rounded-xl py-3"}>
                        <HiUserAdd size={20} />
                        <span>Crear cuenta</span>
                      </button>
                    </>
                  )}

                  {devAdmin && (
                    <button onClick={logoutMock} className={mobileItem}>
                      <span className="inline-flex items-center gap-2">
                        <FiLogOut size={20} />
                        Cerrar sesión
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
