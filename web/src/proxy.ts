import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/treinamentos(.*)',
  '/templates(.*)',
  '/bibliotecas(.*)',
  '/orientacoes(.*)',
  '/portfolio(.*)',
  '/quem-somos(.*)',
  '/contato(.*)',
  '/privacidade(.*)',
  '/termos(.*)',
  '/trilhas(.*)',
  '/quem-sou',
  '/portifolio',
  '/api/tracks(.*)',
  '/api/courses(.*)',
  '/api/webhooks(.*)',
  '/api/health',
]);

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) {
    return;
  }

  const { userId } = await auth();

  if (!userId && req.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!userId) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/__clerk/(.*)',
    '/(api|trpc)(.*)',
  ],
};
