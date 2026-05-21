import type { Metadata } from 'next';
import {
  ClerkProvider,
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from '@clerk/nextjs';
import { IBM_Plex_Mono, IBM_Plex_Sans, Fraunces } from 'next/font/google';
import { SiteShell } from '@/components/SiteShell';
import './globals.css';

const fraunces = Fraunces({
  variable: '--font-display',
  subsets: ['latin'],
  axes: ['SOFT', 'WONK', 'opsz'],
});

const ibmSans = IBM_Plex_Sans({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const ibmMono = IBM_Plex_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  weight: ['400', '500'],
});

export const metadata: Metadata = {
  title: {
    default: 'Estúdio AEC — Treinamentos BIM & Revit',
    template: '%s · Estúdio AEC',
  },
  description:
    'Treinamentos, templates e bibliotecas Revit construídos por engenheiros e arquitetos. Metodologia BIM do projeto à obra.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${fraunces.variable} ${ibmSans.variable} ${ibmMono.variable}`}>
      <body>
        <ClerkProvider>
          <a href="#main-content" className="skip-link">
            Ir para o conteúdo
          </a>
          <header className="clerk-bar">
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button type="button" className="btn btn-ghost btn-sm">
                  Entrar
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button type="button" className="btn btn-primary btn-sm">
                  Cadastrar
                </button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <UserButton />
            </Show>
          </header>
          <SiteShell>{children}</SiteShell>
        </ClerkProvider>
      </body>
    </html>
  );
}
