import Image from 'next/image';
import { AppLink } from '@/components/AppLink';

interface LogoProps {
  variant?: 'default' | 'inverse';
}

export function Logo({ variant = 'default' }: LogoProps) {
  return (
    <AppLink
      href="/"
      className="logo"
      aria-label="Estúdio AEC — Página inicial"
      data-variant={variant}
    >
      <Image
        src="/images/brand/logo-horizontal.png"
        alt=""
        width={200}
        height={48}
        className="logo__image"
        priority
      />
    </AppLink>
  );
}
