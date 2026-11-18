import { NavLink, Outlet } from "react-router-dom";
import { useState } from "react";

export function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <a className="skip-link" href="#main">
        Перейти к содержимому
      </a>

      <header className="site-header">
        <div className="container nav-wrap">
          <NavLink
            className="brand"
            to="/"
            aria-label="BookTracker — поиск книг"
          >
            <span className="brand-mark">
              b<span>.</span>
            </span>
            <span>BookTracker</span>
          </NavLink>

          <nav className="main-nav" aria-label="Главная навигация">
            <NavLink to="/" end>
              Поиск книг
            </NavLink>
            <NavLink to="/library">Моя библиотека</NavLink>
          </nav>

          <button
            className="menu-toggle"
            type="button"
            aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((value) => !value)}
          >
            <span />
            <span />
          </button>
        </div>

        {menuOpen && (
          <nav className="mobile-menu" aria-label="Мобильная навигация">
            <NavLink to="/" onClick={() => setMenuOpen(false)}>
              Поиск книг
            </NavLink>
            <NavLink to="/library" onClick={() => setMenuOpen(false)}>
              Моя библиотека
            </NavLink>
          </nav>
        )}
      </header>

      <main id="main">
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <NavLink className="brand" to="/">
            <span className="brand-mark">
              b<span>.</span>
            </span>
            <span>BookTracker</span>
          </NavLink>
          <p>Каждая книга найдёт своё место.</p>
          <span>Frontend MVP · локальные данные</span>
        </div>
      </footer>
    </>
  );
}
