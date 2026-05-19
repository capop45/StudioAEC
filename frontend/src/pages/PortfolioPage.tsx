import { useMemo, useState } from 'react';
import { PORTFOLIO, PORTFOLIO_CATEGORIES } from '../content/portfolio';

export function PortfolioPage() {
  const [category, setCategory] = useState<(typeof PORTFOLIO_CATEGORIES)[number]>('Todos');

  const visible = useMemo(
    () => (category === 'Todos' ? PORTFOLIO : PORTFOLIO.filter((p) => p.category === category)),
    [category]
  );

  return (
    <>
      <header className="page-header">
        <div className="page-header__grid" aria-hidden="true" />
        <div className="page-header__hatch" aria-hidden="true" />
        <div className="container">
          <div className="page-header__bar">
            <span>
              <strong>AEC.PF01</strong> · Portfólio
            </span>
            <span>R.PF · {PORTFOLIO.length}+ projetos</span>
          </div>
          <span className="eyebrow eyebrow--on-dark">
            <span className="eyebrow__line" />
            <span className="eyebrow__code">§ PF01</span> · Projetos modelados
          </span>
          <h1 className="page-header__title">
            Portfólio no padrão <em>Estúdio AEC</em>.
          </h1>
          <p className="page-header__lead">
            Mais de uma década de projetos modelados em Revit — edifícios, residências, comércio,
            indústria e infraestrutura. Cada peça é um estudo real de aplicação BIM.
          </p>
          <div className="page-header__cartouche">
            <div>
              <strong>{PORTFOLIO.length}+</strong>
              Projetos
            </div>
            <div>
              <strong>{PORTFOLIO_CATEGORIES.length - 1}</strong>
              Categorias
            </div>
            <div>
              <strong>2010 → {new Date().getFullYear()}</strong>
              Período
            </div>
          </div>
        </div>
      </header>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div className="section-head__copy">
              <span className="eyebrow">
                <span className="eyebrow__line" />
                <span className="eyebrow__code">§ PF02</span> · Galeria
              </span>
              <h2 className="section-title">{visible.length} projetos.</h2>
            </div>
            <div className="section-head__aside">
              <span>R.PF02</span>
            </div>
          </div>

          <div className="filters-bar" role="tablist" aria-label="Filtrar portfólio">
            {PORTFOLIO_CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                role="tab"
                aria-pressed={category === c}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="portfolio-grid">
            {visible.map((p, idx) => (
              <article
                key={p.id}
                className={`portfolio-item ${
                  p.category === 'Industrial' || p.category === 'Infraestrutura'
                    ? 'portfolio-item--wide'
                    : ''
                }`}
              >
                <span className="portfolio-item__plate">
                  PF.{String(idx + 1).padStart(3, '0')}
                </span>
                <img src={p.image} alt={p.title} loading="lazy" />
                <div className="portfolio-item__overlay">
                  <div>
                    <strong>{p.title}</strong>
                    <span>
                      {p.category}
                      {p.year ? ` · ${p.year}` : ''}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
