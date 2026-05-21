import Link from 'next/link';
import type { ReactNode } from 'react';

interface AuthShellProps {
  mode: 'sign-in' | 'sign-up';
  children: ReactNode;
}

const COPY = {
  'sign-in': {
    plate: 'AEC.LG · Entrar',
    title: (
      <>
        Biblioteca completa do <em>Estúdio AEC</em>.
      </>
    ),
    description:
      'Trilhas, templates, bibliotecas Revit e mentorias mensais ao vivo. Um único hub pensado para profissionais AEC.',
    switchLabel: 'Ainda não tem conta?',
    switchHref: '/sign-up',
    switchAction: 'Criar conta',
  },
  'sign-up': {
    plate: 'AEC.LG · Cadastro',
    title: (
      <>
        Comece sua jornada no <em>Estúdio AEC</em>.
      </>
    ),
    description:
      'Cadastre-se para acessar cursos, downloads protegidos e acompanhar seu progresso nas trilhas BIM.',
    switchLabel: 'Já tem conta?',
    switchHref: '/sign-in',
    switchAction: 'Entrar',
  },
} as const;

export function AuthShell({ mode, children }: AuthShellProps) {
  const copy = COPY[mode];

  return (
    <div className="auth-page auth-page--clerk">
      <aside className="auth-page__pane" aria-hidden="true">
        <span className="eyebrow eyebrow--on-dark">
          <span className="eyebrow__line" />
          <span className="eyebrow__code">{copy.plate}</span>
        </span>
        <div>
          <h2>{copy.title}</h2>
          <p>{copy.description}</p>
        </div>
        <div className="auth-page__cartouche">
          <div>
            <strong>R.LG</strong>
            Plate code
          </div>
          <div>
            <strong>{new Date().getFullYear()}</strong>
            Edição
          </div>
        </div>
      </aside>

      <section className="auth-page__form-pane">
        <div className="auth-form__switch">
          <span>{copy.switchLabel}</span>
          <Link href={copy.switchHref} className="link-underline">
            {copy.switchAction}
          </Link>
        </div>
        {children}
      </section>
    </div>
  );
}
