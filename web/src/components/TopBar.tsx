import { BRAND } from '@/content/site';
import { Icon } from '@/components/Icon';

const SOCIAL_ICON = { instagram: 'instagram', youtube: 'youtube', linkedin: 'linkedin' } as const;

export function TopBar() {
  return (
    <div className="top-bar">
      <div className="container top-bar__inner">
        <div className="top-bar__contact">
          <a href={`mailto:${BRAND.email}`}>
            <Icon name="mail" size={14} /> {BRAND.email}
          </a>
          <span>
            <Icon name="pin" size={14} /> {BRAND.location}
          </span>
        </div>
        <div className="top-bar__socials" aria-label="Redes sociais">
          {BRAND.socials.map((s) => (
            <a
              key={s.href}
              href={s.href}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={s.label}
            >
              <Icon
                name={SOCIAL_ICON[s.icon as keyof typeof SOCIAL_ICON] ?? 'instagram'}
                size={16}
              />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
