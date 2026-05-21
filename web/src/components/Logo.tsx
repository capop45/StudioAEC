import Link from 'next/link';

interface LogoProps {
  variant?: 'default' | 'inverse';
}

export function Logo({ variant = 'default' }: LogoProps) {
  return (
    <Link
      href="/"
      className="logo"
      aria-label="Estúdio AEC — Página inicial"
      data-variant={variant}
    >
      <span className="logo__mark" aria-hidden="true">
        EA
      </span>
      <span className="logo__type">
        <b>Estúdio AEC</b>
        <span>Manual de prática BIM</span>
      </span>
    </Link>
  );
}
