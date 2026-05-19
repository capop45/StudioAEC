import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PRIMARY_NAV } from '../content/site';
import { Logo } from './Logo';
import { Icon } from './Icon';

export function Header() {
  const { isAuthenticated, isAdmin, name, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

  return (
    <>
      <header className="site-header" data-scrolled={scrolled}>
        <div className="container site-header__inner">
          <Logo />

          <nav className="primary-nav" aria-label="Navegação principal">
            {PRIMARY_NAV.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                end={item.href === '/'}
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="header-actions">
            {isAuthenticated && name && (
              <span className="user-chip">
                <span className="user-chip__dot" />
                {name}
              </span>
            )}
            {isAdmin && (
              <NavLink to="/admin/planejamento" className="btn btn-ghost btn-sm">
                Planejamento
              </NavLink>
            )}
            {isAuthenticated ? (
              <button type="button" className="btn btn-ghost btn-sm" onClick={logout}>
                Sair
              </button>
            ) : (
              <NavLink to="/login" className="btn btn-primary btn-sm">
                Área do aluno
                <Icon name="arrow-right" size={14} />
              </NavLink>
            )}

            <button
              type="button"
              className="nav-toggle"
              aria-label={drawerOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={drawerOpen}
              aria-controls="mobile-drawer"
              onClick={() => setDrawerOpen((v) => !v)}
            >
              <Icon name={drawerOpen ? 'close' : 'menu'} />
            </button>
          </div>
        </div>
      </header>

      <div id="mobile-drawer" className="mobile-drawer" data-open={drawerOpen} aria-hidden={!drawerOpen}>
        {PRIMARY_NAV.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            end={item.href === '/'}
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            {item.label}
          </NavLink>
        ))}
        <div className="mobile-drawer__actions">
          {isAuthenticated ? (
            <button type="button" className="btn btn-primary" onClick={logout}>
              Sair
            </button>
          ) : (
            <NavLink to="/login" className="btn btn-primary">
              Área do aluno
            </NavLink>
          )}
          {isAdmin && (
            <NavLink to="/admin/planejamento" className="btn btn-ghost">
              Planejamento
            </NavLink>
          )}
        </div>
      </div>
    </>
  );
}
