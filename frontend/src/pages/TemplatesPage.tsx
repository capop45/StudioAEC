import { Link } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { TEMPLATES } from '../content/templates';
import { BIM_DIMENSIONS } from '../content/bimDimensions';

export function TemplatesPage() {
  return (
    <>
      <header className="page-header">
        <div className="page-header__grid" aria-hidden="true" />
        <div className="page-header__hatch" aria-hidden="true" />
        <div className="container">
          <div className="page-header__bar">
            <span>
              <strong>AEC.TP01</strong> · Templates Revit
            </span>
            <span>R.TP · NBR 6492 + ISO 19650</span>
          </div>
          <span className="eyebrow eyebrow--on-dark">
            <span className="eyebrow__line" />
            <span className="eyebrow__code">§ TP01</span> · Templates de escritório
          </span>
          <h1 className="page-header__title">
            Templates que viram <em>padrão</em> do seu escritório.
          </h1>
          <p className="page-header__lead">
            Vistas configuradas, materiais, anotações e legendas prontas para entregar documentação
            com padrão executivo desde o primeiro projeto — sem retrabalho.
          </p>
          <div className="page-header__cartouche">
            <div>
              <strong>{TEMPLATES.length}</strong>
              Templates
            </div>
            <div>
              <strong>Revit 2023+</strong>
              Compatibilidade
            </div>
            <div>
              <strong>NBR 6492</strong>
              Padrão técnico
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
                <span className="eyebrow__code">§ TP02</span> · Catálogo
              </span>
              <h2 className="section-title">Templates por disciplina.</h2>
            </div>
            <div className="section-head__aside">
              <span>R.TP02</span>
            </div>
          </div>

          <div className="asset-grid">
            {TEMPLATES.map((tpl, idx) => (
              <article
                key={tpl.id}
                className="asset-card"
                data-code={`TP.${String(idx + 1).padStart(2, '0')}`}
              >
                <div className="asset-card__media">
                  <img src={tpl.image} alt={tpl.title} loading="lazy" />
                </div>
                <div className="asset-card__body">
                  <span className="badge badge--brand">{tpl.discipline}</span>
                  <h3>{tpl.title}</h3>
                  <p>{tpl.description}</p>
                  <div className="asset-card__footer">
                    <span>{tpl.format}</span>
                    <span className="asset-card__action">
                      <Icon name="download" size={13} /> Baixar
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--muted">
        <div className="container">
          <div className="section-head">
            <div className="section-head__copy">
              <span className="eyebrow">
                <span className="eyebrow__line" />
                <span className="eyebrow__code">§ TP03</span> · Anatomia do template
              </span>
              <h2 className="section-title">
                Configuração de <em>escritório</em>,<br /> não pacote genérico.
              </h2>
              <p className="section-lead">
                Cada template foi construído após dezenas de projetos entregues. Você economiza
                meses de configuração e ganha consistência entre projetos.
              </p>
            </div>
            <div className="section-head__aside">
              <span>R.TP03 · 03 dossiês</span>
            </div>
          </div>

          <div className="feature-row">
            <div className="feature-row__media">
              <img src="/images/hero/gerenciamento.png" alt="Gerenciamento de projeto BIM" />
            </div>
            <div className="feature-row__copy">
              <div className="feature-row__num">01 / Vistas e folhas</div>
              <h3>Vistas e folhas pré-configuradas.</h3>
              <p>
                Plantas, cortes, fachadas, detalhes e folhas A1 prontos. Carimbo dinâmico, padrão
                de cotagem e anotação alinhados à NBR 6492.
              </p>
            </div>
          </div>

          <div className="feature-row">
            <div className="feature-row__media">
              <img src="/images/hero/cubos.png" alt="Famílias e materiais" />
            </div>
            <div className="feature-row__copy">
              <div className="feature-row__num">02 / Materiais e famílias</div>
              <h3>Materiais e famílias inclusas.</h3>
              <p>
                Materiais com renderização Enscape e Revit, biblioteca essencial de portas,
                janelas, pisos e equipamentos por disciplina.
              </p>
            </div>
          </div>

          <div className="feature-row">
            <div className="feature-row__media">
              <img src="/images/hero/revit.png" alt="Padronização de quantitativos" />
            </div>
            <div className="feature-row__copy">
              <div className="feature-row__num">03 / Tabelas e quantitativos</div>
              <h3>Tabelas e quantitativos auditáveis.</h3>
              <p>
                Quadros de áreas, ambientes, esquadrias e materiais já formatados. Pronto para
                integrar com BIM 5D quando necessário.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div className="section-head__copy">
              <span className="eyebrow">
                <span className="eyebrow__line" />
                <span className="eyebrow__code">§ TP04</span> · Compatibilidade
              </span>
              <h2 className="section-title">Pensado para o ciclo BIM completo.</h2>
              <p className="section-lead">
                Os templates suportam ampliação para outras dimensões BIM.
              </p>
            </div>
            <div className="section-head__aside">
              <span>R.TP04 · 05 dimensões</span>
            </div>
          </div>

          <div className="dim-grid">
            {BIM_DIMENSIONS.map((d) => (
              <article key={d.id} className="dim-card">
                <span className="dim-card__num">
                  {d.number}
                  <span>{d.letter}</span>
                </span>
                <h3>{d.title}</h3>
                <p>{d.description}</p>
              </article>
            ))}
          </div>

          <div className="cta-strip" style={{ marginBlockStart: 'var(--space-20)' }}>
            <div>
              <span className="eyebrow eyebrow--on-dark">
                <span className="eyebrow__line" />
                <span className="eyebrow__code">§ TP05</span> · Sob medida
              </span>
              <h2>
                Customização de template para o seu <em>escritório</em>.
              </h2>
              <p>
                Adaptamos legendas, carimbo, padrão visual e materiais ao seu manual de identidade
                e ao manual de projeto interno.
              </p>
            </div>
            <div className="cta-strip__actions">
              <Link to="/contato" className="btn btn-accent btn-lg">
                Pedir orçamento <Icon name="arrow-right" size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
