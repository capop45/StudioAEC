import Link from 'next/link';
import type { LegalDocument } from '@/content/legal';

interface LegalDocumentViewProps {
  document: LegalDocument;
  sibling?: { href: string; label: string };
}

function LegalBlocks({
  paragraphs,
  bullets,
  subsections,
}: {
  paragraphs?: string[];
  bullets?: string[];
  subsections?: LegalDocument['sections'][0]['subsections'];
}) {
  return (
    <>
      {paragraphs?.map((text) => (
        <p key={text.slice(0, 48)}>{text}</p>
      ))}
      {bullets && bullets.length > 0 && (
        <ul>
          {bullets.map((item) => (
            <li key={item.slice(0, 48)}>{item}</li>
          ))}
        </ul>
      )}
      {subsections?.map((sub) => (
        <div key={sub.title} className="legal-doc__subsection">
          <h3>{sub.title}</h3>
          {sub.paragraphs?.map((text) => (
            <p key={text.slice(0, 48)}>{text}</p>
          ))}
          {sub.bullets && sub.bullets.length > 0 && (
            <ul>
              {sub.bullets.map((item) => (
                <li key={item.slice(0, 48)}>{item}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </>
  );
}

export function LegalDocumentView({ document, sibling }: LegalDocumentViewProps) {
  return (
    <>
      <header className="page-header">
        <div className="page-header__grid" aria-hidden="true" />
        <div className="page-header__hatch" aria-hidden="true" />
        <div className="container">
          <div className="page-header__bar">
            <span>
              <strong>{document.plateCode}</strong> · {document.title}
            </span>
            <span>LGPD · Documento vigente</span>
          </div>
          <span className="eyebrow eyebrow--on-dark">
            <span className="eyebrow__line" />
            <span className="eyebrow__code">{document.plateCode}</span> · Legal
          </span>
          <h1 className="page-header__title">{document.title}</h1>
          <p className="page-header__lead">{document.lead}</p>
          {sibling && (
            <p className="page-header__lead" style={{ marginBlockStart: 'var(--space-4)' }}>
              <Link href={sibling.href} className="link-underline" style={{ color: 'inherit' }}>
                {sibling.label}
              </Link>
            </p>
          )}
        </div>
      </header>

      <section className="section">
        <div className="container container--narrow">
          <nav className="legal-doc__toc" aria-label="Índice do documento">
            <span className="legal-doc__toc-label">Índice</span>
            <ol>
              {document.sections.map((section) => (
                <li key={section.id}>
                  <a href={`#${section.id}`}>{section.title}</a>
                </li>
              ))}
            </ol>
          </nav>

          <article className="legal-doc">
            <div className="legal-doc__intro">
              {document.intro.map((text) => (
                <p key={text.slice(0, 48)}>{text}</p>
              ))}
            </div>

            {document.sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="legal-doc__section"
                aria-labelledby={`${section.id}-title`}
              >
                <header className="legal-doc__section-head">
                  <span className="legal-doc__section-code">{section.code}</span>
                  <h2 id={`${section.id}-title`}>{section.title}</h2>
                </header>
                <LegalBlocks
                  paragraphs={section.paragraphs}
                  bullets={section.bullets}
                  subsections={section.subsections}
                />
              </section>
            ))}
          </article>
        </div>
      </section>
    </>
  );
}
