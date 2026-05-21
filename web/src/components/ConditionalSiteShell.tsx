'use client';

import { usePathname } from 'next/navigation';
import { SiteShell } from '@/components/SiteShell';

const BARE_PATHS = ['/sign-in', '/sign-up'];

export function ConditionalSiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isBare = BARE_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  if (isBare) {
    return <>{children}</>;
  }

  return <SiteShell>{children}</SiteShell>;
}
