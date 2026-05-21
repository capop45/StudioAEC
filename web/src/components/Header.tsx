'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Show, UserButton, useClerk, useUser } from '@clerk/nextjs';
import { PRIMARY_NAV } from '@/content/site';
import { Logo } from '@/components/Logo';
import { Icon } from '@/components/Icon';
import { resolveIsAdmin } from '@/lib/roles';

export function Header() {
  const pathname = usePathname();
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isAdmin =
    isLoaded &&
    user &&
    resolveIsAdmin({
      clerkUserId: user.id,
      username: user.username,
      publicRole: user.publicMetadata?.role as string | undefined,
      email: user.primaryEmailAddress?.emailAddress,
    });

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
            <Show when="signed-in">
              {user?.fullName && (
                <span className="user-chip" title={user.fullName}>
                  <span className="user-chip__dot" />
                  <span className="user-chip__name">{user.fullName}</span>
                </span>
              )}
              {isAdmin && (
                <Link href="/admin/planejamento" className="btn btn-ghost btn-sm">
                  Planejamento
                </Link>
              )}
              <Link href="/dashboard" className="btn btn-ghost btn-sm">
                Minha área
              </Link>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: 'header-user-button__avatar',
                  },
                }}
              />
            </Show>
            <Show when="signed-out">
              <Link href="/sign-in" className="btn btn-ghost btn-sm">
                Entrar
              </Link>
              <Link href="/sign-up" className="btn btn-primary btn-sm">
                Cadastrar
                <Icon name="arrow-right" size={14} />
              </Link>
            </Show>

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
          <Show when="signed-in">
            <Link href="/dashboard" className="btn btn-primary">
              Minha área
            </Link>
            {isAdmin && (
              <Link href="/admin/planejamento" className="btn btn-ghost">
                Planejamento
              </Link>
            )}
            <button type="button" className="btn btn-ghost" onClick={() => signOut({ redirectUrl: '/' })}>
              Sair
            </button>
          </Show>
          <Show when="signed-out">
            <Link href="/sign-in" className="btn btn-ghost">
              Entrar
            </Link>
            <Link href="/sign-up" className="btn btn-primary">
              Cadastrar
            </Link>
          </Show>
        </div>
      </div>
    </>
  );
}
