import Link from 'next/link';
import { BRAND, FOOTER_COLUMNS } from '@/content/site';
import { Icon } from '@/components/Icon';

const SOCIAL_ICON = { instagram: 'instagram', youtube: 'youtube', linkedin: 'linkedin' } as const;
const ISSUE_YEAR = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__head">
          <h2>
            Do papel <em>à obra</em>,<br />
            com rigor.
          </h2>
          <div className="site-footer__meta">
            <strong>AEC.{ISSUE_YEAR}</strong>
            <span>Edição {ISSUE_YEAR} · São Paulo BR</span>
          </div>
        </div>

        <div className="footer-grid">
          <div className="footer-brand">
            <span className="eyebrow eyebrow--on-dark">
              <span className="eyebrow__line" />
              Sobre o estúdio
            </span>
            <p>{BRAND.description}</p>
            <div className="footer-brand__socials">
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
                    size={20}
                  />
                </a>
              ))}
            </div>
          </div>

          {FOOTER_COLUMNS.map((col, idx) => (
            <div key={col.title} className="footer-column">
              <h4>
                {String(idx + 1).padStart(2, '0')} · {col.title}
              </h4>
              <ul>
                {col.items.map((it) => {
                  const href = it.href === '/login' ? '/sign-in' : it.href;
                  return (
                    <li key={`${col.title}-${it.label}-${href}`}>
                      <Link href={href}>{it.label}</Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer-bottom">
          <span className="footer-bottom__plate">
            © {ISSUE_YEAR} · Estúdio AEC · Todos os direitos reservados
          </span>
          <span>Arquitetura · Engenharia · Construção</span>
        </div>
      </div>
    </footer>
  );
}
