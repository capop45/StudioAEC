'use client';

import { useEffect, useState } from 'react';
import { AppLink } from '@/components/AppLink';
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
                <AppLink
                  key={item.href}
                  href={item.href}
                  className={active ? 'active' : undefined}
                >
                  {item.label}
                </AppLink>
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
                <AppLink href="/admin/planejamento" className="btn btn-ghost btn-sm">
                  Planejamento
                </AppLink>
              )}
              <AppLink href="/dashboard" className="btn btn-ghost btn-sm">
                Minha área
              </AppLink>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: 'header-user-button__avatar',
                  },
                }}
              />
            </Show>
            <Show when="signed-out">
              <AppLink href="/sign-in" className="btn btn-ghost btn-sm">
                Entrar
              </AppLink>
              <AppLink href="/sign-up" className="btn btn-primary btn-sm">
                Cadastrar
                <Icon name="arrow-right" size={14} />
              </AppLink>
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
            <AppLink key={item.href} href={item.href} className={active ? 'active' : undefined}>
              {item.label}
            </AppLink>
          );
        })}
        <div className="mobile-drawer__actions">
          <Show when="signed-in">
            <AppLink href="/dashboard" className="btn btn-primary">
              Minha área
            </AppLink>
            {isAdmin && (
              <AppLink href="/admin/planejamento" className="btn btn-ghost">
                Planejamento
              </AppLink>
            )}
            <button type="button" className="btn btn-ghost" onClick={() => signOut({ redirectUrl: '/' })}>
              Sair
            </button>
          </Show>
          <Show when="signed-out">
            <AppLink href="/sign-in" className="btn btn-ghost">
              Entrar
            </AppLink>
            <AppLink href="/sign-up" className="btn btn-primary">
              Cadastrar
            </AppLink>
          </Show>
        </div>
      </div>
    </>
  );
}
