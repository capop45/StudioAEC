import Link, { type LinkProps } from 'next/link';
import type { ComponentProps } from 'react';

type AppLinkProps = LinkProps & Omit<ComponentProps<'a'>, keyof LinkProps>;

/** Internal navigation — uses Next.js default scroll restoration (top on route change). */
export function AppLink({ scroll = true, ...props }: AppLinkProps) {
  return <Link scroll={scroll} {...props} />;
}
