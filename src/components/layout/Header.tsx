import { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { HiMenu, HiX, HiPlus, HiCog, HiUserAdd, HiUsers, HiTag } from "react-icons/hi";
import { FiLogIn, FiLogOut } from "react-icons/fi";
import { BiAddToQueue } from "react-icons/bi";
import { btnPrimary, btnGhost, btnSuccess, btnDangerGhost, mobileItem } from "../../styles/headerButtons";
import { useAuth } from "../../auth/AuthContext";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const closeMenu = () => setIsMenuOpen(false);

  const fullName = user ? `${user.firstName} ${user.lastName}`.trim() : "";
  const initials = `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`.toUpperCase() || "U";
  const isUsersSection = location.pathname.startsWith("/administracion/usuarios");
  const isCategoriesSection = location.pathname.startsWith("/administracion/categorias");

  const goToAuth = (tab: "login" | "register") => {
    navigate("/acceso", { state: { tab } });
    closeMenu();
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    closeMenu();
    navigate("/");
  };

  const goToProfile = () => {
    setIsUserMenuOpen(false);
    closeMenu();
    navigate("/perfil");
  };

  const handleAdminClick = (e: any) => {
    e.preventDefault();
    if (location.pathname === "/administracion") {
      navigate("/");
    } else {
      navigate("/administracion");
    }
    closeMenu();
  };

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
          className="lg:hidden p-2 rounded-full border border-fb-stroke text-fb-primary hover:bg-fb-primary/10 hover:border-fb-primary/30 transition cursor-pointer"
          aria-label="Menú"
        >
          {isMenuOpen ? <HiX size={22} /> : <HiMenu size={22} />}
        </button>

        {/* Desktop buttons */}
        <div className="hidden lg:flex gap-3 relative -top-0.5">
          {isAdmin && (
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

              <NavLink to="/administracion/usuarios" className={isUsersSection ? btnPrimary : btnGhost}>
                <HiUsers size={18} />
                <span>Usuarios</span>
              </NavLink>

              <NavLink to="/administracion/categorias" className={isCategoriesSection ? btnPrimary : btnGhost}>
                <HiTag size={18} />
                <span>Categorías</span>
              </NavLink>
            </>
          )}

          {!isAuthenticated && (
            <>
              <button className={btnGhost} onClick={() => goToAuth("login")}>
                <FiLogIn size={18} />
                <span>Iniciar sesión</span>
              </button>

              <button className={btnSuccess} onClick={() => goToAuth("register")}>
                <HiUserAdd size={18} />
                <span>Crear cuenta</span>
              </button>
            </>
          )}

          {isAuthenticated && user && (
            <div className="relative">
              <button
                className="inline-flex items-center gap-2.5 rounded-full border border-fb-stroke bg-fb-surface px-2.5 py-1 hover:bg-fb-neutral transition cursor-pointer"
                onClick={() => setIsUserMenuOpen((prev) => !prev)}
              >
                <span className="grid h-8 w-8 place-items-center rounded-full bg-fb-primary text-fb-white text-xs font-semibold">
                  {initials}
                </span>
                <span className="text-sm font-medium text-fb-text">{fullName}</span>
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-fb-stroke bg-fb-surface p-2 shadow-lg">
                  <button
                    type="button"
                    onClick={goToProfile}
                    className="mb-1 w-full rounded-lg bg-fb-neutral px-3 py-2 text-left hover:bg-fb-neutral/80 transition cursor-pointer"
                  >
                    <p className="text-sm font-semibold text-fb-text leading-tight">{fullName}</p>
                    <p className="text-xs text-fb-text-secondary truncate">{user.email}</p>
                  </button>
                  <button className={`${btnDangerGhost} w-full justify-start rounded-lg`} onClick={handleLogout}>
                    <FiLogOut size={18} />
                    <span>Cerrar sesión</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden">
          <div
            className="fixed inset-0 bg-black/20"
            onClick={closeMenu}
            aria-hidden="true"
          />

          <div className="absolute top-16 sm:top-20 left-0 w-full px-4">
            <div className="max-w-[96rem] mx-auto">
              <div className="rounded-2xl border border-fb-stroke bg-fb-surface/95 backdrop-blur shadow-lg p-3">
                <div className="flex flex-col gap-2">
                  {isAdmin && (
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

                      <NavLink
                        to="/administracion/usuarios"
                        onClick={closeMenu}
                        className={(isUsersSection ? btnPrimary : btnGhost) + " w-full rounded-xl py-3"}
                      >
                        <HiUsers size={20} />
                        <span>Usuarios</span>
                      </NavLink>

                      <NavLink
                        to="/administracion/categorias"
                        onClick={closeMenu}
                        className={(isCategoriesSection ? btnPrimary : btnGhost) + " w-full rounded-xl py-3"}
                      >
                        <HiTag size={20} />
                        <span>Categorías</span>
                      </NavLink>
                    </>
                  )}

                  {!isAuthenticated && (
                    <>
                      <button onClick={() => goToAuth("login")} className={mobileItem}>
                        <span className="inline-flex items-center gap-2">
                          <FiLogIn size={20} />
                          Iniciar sesión
                        </span>
                      </button>

                      <button onClick={() => goToAuth("register")} className={btnSuccess + " w-full rounded-xl py-3"}>
                        <HiUserAdd size={20} />
                        <span>Crear cuenta</span>
                      </button>
                    </>
                  )}

                  {isAuthenticated && user && (
                    <div className="rounded-xl border border-fb-stroke bg-fb-surface p-2">
                      <button
                        type="button"
                        onClick={goToProfile}
                        className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left hover:bg-fb-neutral transition cursor-pointer"
                      >
                        <span className="grid h-9 w-9 place-items-center rounded-full bg-fb-primary text-fb-white text-sm font-semibold">
                          {initials}
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-fb-text leading-tight">{fullName}</p>
                          <p className="text-xs text-fb-text-secondary truncate">{user.email}</p>
                        </div>
                      </button>
                      <button onClick={handleLogout} className={mobileItem}>
                        <span className="inline-flex items-center gap-2">
                          <FiLogOut size={20} />
                          Cerrar sesión
                        </span>
                      </button>
                    </div>
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
