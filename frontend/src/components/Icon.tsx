import type { SVGProps } from 'react';

type IconName =
  | 'instagram'
  | 'youtube'
  | 'linkedin'
  | 'mail'
  | 'phone'
  | 'pin'
  | 'arrow-right'
  | 'menu'
  | 'close'
  | 'check'
  | 'sparkles'
  | 'play'
  | 'download'
  | 'book'
  | 'clock'
  | 'star'
  | 'shield-check';

const PATHS: Record<IconName, JSX.Element> = {
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </>
  ),
  youtube: (
    <>
      <rect x="2" y="5" width="20" height="14" rx="4" />
      <path d="m10 9 5 3-5 3z" fill="currentColor" />
    </>
  ),
  linkedin: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="m3 7 9 6 9-6" />
    </>
  ),
  phone: (
    <path d="M4 4h4l2 5-3 1.5a11 11 0 0 0 6.5 6.5L15 14l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 2 6a2 2 0 0 1 2-2z" />
  ),
  pin: (
    <>
      <path d="M12 21s7-6 7-12a7 7 0 1 0-14 0c0 6 7 12 7 12z" />
      <circle cx="12" cy="9" r="2.5" />
    </>
  ),
  'arrow-right': <path d="M5 12h14m-6-6 6 6-6 6" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6l-12 12" />,
  check: <path d="m5 13 4 4L19 7" />,
  sparkles: (
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6" />
  ),
  play: <path d="M7 5v14l12-7z" fill="currentColor" />,
  download: <path d="M12 4v12m-5-5 5 5 5-5M5 20h14" />,
  book: (
    <>
      <path d="M4 5a2 2 0 0 1 2-2h12v16H6a2 2 0 0 0-2 2z" />
      <path d="M4 5v14a2 2 0 0 0 2 2" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  star: (
    <path d="m12 3 2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3-5.4 3 1.3-6L3.3 9.2l6.1-.6z" />
  ),
  'shield-check': (
    <>
      <path d="M12 3 4 6v6c0 5 4 8 8 9 4-1 8-4 8-9V6z" />
      <path d="m9 12 2 2 4-4" />
    </>
  )
};

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
}

export function Icon({ name, size = 20, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {PATHS[name]}
    </svg>
  );
}
