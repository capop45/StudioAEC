import { GUIDANCE_ARTICLES, FAQ_ITEMS } from '../content/guidance';

const DATE_FMT = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'long',
  year: 'numeric'
});

export function OrientacoesPage() {
  return (
    <>
      <header className="page-header">
        <div className="page-header__grid" aria-hidden="true" />
        <div className="page-header__hatch" aria-hidden="true" />
        <div className="container">
          <div className="page-header__bar">
            <span>
              <strong>AEC.OR01</strong> · Orientações técnicas
            </span>
            <span>R.OR · Diário de bordo</span>
          </div>
          <span className="eyebrow eyebrow--on-dark">
            <span className="eyebrow__line" />
            <span className="eyebrow__code">§ OR01</span> · Conhecimento aplicado
          </span>
          <h1 className="page-header__title">
            Diário de bordo de quem entrega <em>projeto</em>.
          </h1>
          <p className="page-header__lead">
            Artigos práticos, boas práticas e estudos de caso retirados da rotina real de projeto.
            Conhecimento aplicado — sem teoria desconectada da obra.
          </p>
          <div className="page-header__cartouche">
            <div>
              <strong>{GUIDANCE_ARTICLES.length}</strong>
              Artigos
            </div>
            <div>
              <strong>{FAQ_ITEMS.length}</strong>
              FAQ
            </div>
            <div>
              <strong>Atualização contínua</strong>
              Periodicidade
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
                <span className="eyebrow__code">§ OR02</span> · Artigos
              </span>
              <h2 className="section-title">Estudos de caso recentes.</h2>
            </div>
            <div className="section-head__aside">
              <span>R.OR02 · {GUIDANCE_ARTICLES.length} artigos</span>
            </div>
          </div>

          <div className="article-grid">
            {GUIDANCE_ARTICLES.map((a, idx) => (
              <article key={a.id} className="article-card">
                <div className="article-card__media">
                  <img src={a.image} alt="" loading="lazy" />
                </div>
                <div className="article-card__body">
                  <span className="article-card__meta">
                    OR.{String(idx + 1).padStart(2, '0')} · {a.category} ·{' '}
                    {DATE_FMT.format(new Date(a.date))} · {a.readMinutes} min
                  </span>
                  <h3>{a.title}</h3>
                  <p>{a.excerpt}</p>
                  <a className="article-card__read" href="#" onClick={(e) => e.preventDefault()}>
                    Ler artigo →
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--muted">
        <div className="container container--narrow">
          <div className="section-head" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
            <div className="section-head__copy">
              <span className="eyebrow">
                <span className="eyebrow__line" />
                <span className="eyebrow__code">§ OR03</span> · Perguntas frequentes
              </span>
              <h2 className="section-title">Dúvidas comuns sobre nossos treinamentos.</h2>
            </div>
          </div>

          <div className="faq">
            {FAQ_ITEMS.map((q) => (
              <details key={q.question}>
                <summary>{q.question}</summary>
                <p>{q.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
