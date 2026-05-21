import type { Metadata } from 'next';
import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { ABOUT_TIMELINE, ABOUT_VALUES } from '@/content/about';

export const metadata: Metadata = {
  title: 'Quem somos',
  description: 'Engenharia BIM construída por quem entrega projeto — Estúdio AEC desde 2010.',
};

export default function QuemSomosPage() {
  return (
    <>
      <section className="section">
        <div className="container">
          <div
            className="page-header__bar"
            style={{
              borderColor: 'var(--rule)',
              color: 'var(--text-muted)',
              marginBlockEnd: 'var(--space-12)',
            }}
          >
            <span>
              <strong style={{ color: 'var(--ink-900)' }}>AEC.QS01</strong> · Quem somos
            </span>
            <span>R.QS · Estúdio desde 2010</span>
          </div>

          <div className="about-hero">
            <div className="about-hero__photo">
              <img
                src="/images/people/raniere.jpg"
                alt="Raniere Kuehl, fundador do Estúdio AEC"
              />
              <span className="about-hero__photo-plate">Fundador · R.K</span>
            </div>
            <div className="about-hero__copy">
              <span className="eyebrow">
                <span className="eyebrow__line" />
                <span className="eyebrow__code">§ QS01</span> · Manifesto
              </span>
              <h1>
                Engenharia BIM construída por quem entrega <em>projeto</em>.
              </h1>
              <p>
                O Estúdio AEC nasce da prática diária do projeto, não da sala de aula. Nossa
                missão é transformar a forma como escritórios e construtoras brasileiras entregam
                projetos — BIM aplicado à realidade da obra, com método e padrão de mercado.
              </p>
              <p>
                Atendemos profissionais e equipes de Arquitetura, Engenharia e Construção desde
                2010, com mais de 200 projetos modelados em Revit e centenas de alunos formados em
                todo o país.
              </p>
              <div className="hero__cta" style={{ marginBlockStart: 'var(--space-8)' }}>
                <Link href="/portfolio" className="btn btn-primary">
                  Ver portfólio <Icon name="arrow-right" size={14} />
                </Link>
                <Link href="/contato" className="btn btn-ghost">
                  Falar conosco
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--muted">
        <div className="container">
          <div className="section-head">
            <div className="section-head__copy">
              <span className="eyebrow">
                <span className="eyebrow__line" />
                <span className="eyebrow__code">§ QS02</span> · Princípios
              </span>
              <h2 className="section-title">O que nos guia.</h2>
            </div>
            <div className="section-head__aside">
              <span>R.QS02</span>
            </div>
          </div>

          <div className="stats">
            {ABOUT_VALUES.map((v, idx) => (
              <article key={v.title} className="stat">
                <span className="stat__num">
                  0<em>{idx + 1}</em>
                </span>
                <h3>{v.title}</h3>
                <p>{v.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container container--narrow">
          <div className="section-head">
            <div className="section-head__copy">
              <span className="eyebrow">
                <span className="eyebrow__line" />
                <span className="eyebrow__code">§ QS03</span> · Trajetória
              </span>
              <h2 className="section-title">Como chegamos até aqui.</h2>
            </div>
            <div className="section-head__aside">
              <span>R.QS03</span>
            </div>
          </div>

          <div className="timeline">
            {ABOUT_TIMELINE.map((t) => (
              <div key={t.year} className="timeline__item">
                <div className="timeline__year">{t.year}</div>
                <h3>{t.title}</h3>
                <p>{t.description}</p>
              </div>
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
                <span className="eyebrow__code">§ QS04</span> · Stack BIM
              </span>
              <h2 className="section-title">
                Ferramentas que dominamos no <em>dia a dia</em>.
              </h2>
            </div>
            <div className="section-head__aside">
              <span>R.QS04</span>
            </div>
          </div>

          <div className="tools-row">
            <img src="/images/brand/revit-pro.png" alt="Autodesk Revit Professional" />
            <img src="/images/brand/aci-standard.png" alt="Autodesk Certified Instructor" />
            <img src="/images/brand/enscape.png" alt="Enscape" />
            <img src="/images/brand/prosheets.png" alt="ProSheets" />
          </div>
        </div>
      </section>
    </>
  );
}
