'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth, useUser } from '@clerk/nextjs';
import { PRIMARY_NAV } from '@/content/site';
import { Logo } from '@/components/Logo';
import { Icon } from '@/components/Icon';

export function Header() {
  const pathname = usePathname();
  const { isSignedIn, signOut } = useAuth();
  const { user } = useUser();
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isAdmin =
    user?.publicMetadata?.role === 'admin' ||
    user?.primaryEmailAddress?.emailAddress?.toLowerCase().includes('admin');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

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
            {PRIMARY_NAV.map((item) => {
              const active =
                item.href === '/'
                  ? pathname === '/'
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={active ? 'active' : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="header-actions">
            {isSignedIn && user?.fullName && (
              <span className="user-chip">
                <span className="user-chip__dot" />
                {user.fullName}
              </span>
            )}
            {isAdmin && (
              <Link href="/admin/planejamento" className="btn btn-ghost btn-sm">
                Planejamento
              </Link>
            )}
            {isSignedIn ? (
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => signOut()}>
                Sair
              </button>
            ) : (
              <Link href="/sign-in" className="btn btn-primary btn-sm">
                Área do aluno
                <Icon name="arrow-right" size={14} />
              </Link>
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

      <div
        id="mobile-drawer"
        className="mobile-drawer"
        data-open={drawerOpen}
        aria-hidden={!drawerOpen}
      >
        {PRIMARY_NAV.map((item) => {
          const active =
            item.href === '/'
              ? pathname === '/'
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link key={item.href} href={item.href} className={active ? 'active' : undefined}>
              {item.label}
            </Link>
          );
        })}
        <div className="mobile-drawer__actions">
          {isSignedIn ? (
            <button type="button" className="btn btn-primary" onClick={() => signOut()}>
              Sair
            </button>
          ) : (
            <Link href="/sign-in" className="btn btn-primary">
              Área do aluno
            </Link>
          )}
          {isAdmin && (
            <Link href="/admin/planejamento" className="btn btn-ghost">
              Planejamento
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
