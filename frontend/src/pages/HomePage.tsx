import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiGet } from '../api/client';
import { TrackIcon } from '../components/TrackIcon';
import { Icon } from '../components/Icon';
import type { Course, CourseTrack } from '../types';
import { BIM_DIMENSIONS } from '../content/bimDimensions';
import { TESTIMONIALS } from '../content/testimonials';
import { PORTFOLIO } from '../content/portfolio';

const STRIP_BUILDINGS = PORTFOLIO.filter((p) => p.category === 'Edifício').slice(0, 14);
const ISSUE = new Date().getFullYear();

export function HomePage() {
  const [tracks, setTracks] = useState<CourseTrack[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([apiGet<CourseTrack[]>('/api/tracks'), apiGet<Course[]>('/api/courses')])
      .then(([t, c]) => {
        setTracks(t);
        setCourses(c.slice(0, 6));
      })
      .catch(() => setError('Não foi possível carregar o catálogo.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="page-loading">— Carregando catálogo —</p>;
  if (error) return <p className="page-error">{error}</p>;

  const totalCourses = tracks.reduce((s, t) => s + t.courseCount, 0);
  const totalHours = tracks.reduce((s, t) => s + t.totalHours, 0);

  return (
    <>
      {/* HERO — capa de monografia ━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="hero">
        <div className="hero__grid-bg" aria-hidden="true" />
        <div className="hero__hatch" aria-hidden="true" />
        <div className="container">
          <div className="hero__plate" aria-hidden="true">
            <span>
              Edição <strong>{ISSUE}</strong>
            </span>
            <span className="hero__plate__rule" />
            <span>
              <strong>AEC.001</strong> · R.01
            </span>
          </div>

          <div className="hero__layout">
            <div className="hero__copy">
              <span className="eyebrow eyebrow--on-dark">
                <span className="eyebrow__line" />
                <span className="eyebrow__code">§ 01</span> · Manual de prática BIM
              </span>
              <h1>
                Do papel <em>à obra</em>,<br />
                com rigor de detalhamento.
              </h1>
              <p className="hero__lead">
                O escritório que ensina como escritório. Trilhas, templates e bibliotecas Revit
                construídos por engenheiros e arquitetos atuantes — método aplicado do conceito ao
                "as-built", no padrão de mercado brasileiro.
              </p>
              <div className="hero__cta">
                <Link to="/treinamentos" className="btn btn-primary btn-lg">
                  Explorar trilhas <Icon name="arrow-right" size={14} />
                </Link>
                <Link to="/templates" className="btn btn-on-dark btn-lg">
                  Templates &amp; bibliotecas
                </Link>
              </div>

              <div className="hero__trust" role="list">
                <div role="listitem">
                  <strong>{String(tracks.length).padStart(2, '0')}</strong>
                  <span>Trilhas técnicas</span>
                </div>
                <div role="listitem">
                  <strong>{totalCourses}+</strong>
                  <span>Cursos disponíveis</span>
                </div>
                <div role="listitem">
                  <strong>{totalHours}h</strong>
                  <span>Conteúdo em vídeo</span>
                </div>
                <div role="listitem">
                  <strong>4,9<em>★</em></strong>
                  <span>Avaliação média</span>
                </div>
              </div>
            </div>

            <div className="hero__visual" aria-hidden="true">
              <div className="hero__visual-plate">
                <span>Plano federado</span>
                <span>Rev. 04 · {ISSUE}</span>
              </div>
              <img src="/images/hero/modelo-bim.png" alt="" loading="eager" />
              <div className="hero__visual-overlay">
                <div>
                  <strong>BIM federado</strong>
                  <span>Arq · Estr · MEP</span>
                </div>
                <div>
                  <strong>Revit 2023+</strong>
                  <span>ISO 19650 · NBR 15965</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PORTFÓLIO ATIVO — marquee de fitas técnicas ━━━━━━━━━ */}
      <div className="building-strip" aria-hidden="true">
        <div className="building-strip__track">
          {[...STRIP_BUILDINGS, ...STRIP_BUILDINGS].map((b, i) => (
            <img key={`${b.id}-${i}`} src={b.image} alt="" loading="lazy" />
          ))}
        </div>
      </div>

      {/* § 02 · DIMENSÕES BIM ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div className="section-head__copy">
              <span className="eyebrow">
                <span className="eyebrow__line" />
                <span className="eyebrow__code">§ 02</span> · Dimensões BIM
              </span>
              <h2 className="section-title">
                Do modelo 3D<br /> à <em>operação 7D</em>.
              </h2>
              <p className="section-lead">
                BIM como ciclo completo de informação. Cada dimensão adiciona uma camada — geometria,
                cronograma, custo, desempenho — que agrega valor real ao empreendimento.
              </p>
            </div>
            <div className="section-head__aside">
              <span>R.02 · AEC.002</span>
              <span>05 dimensões</span>
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
        </div>
      </section>

      {/* § 03 · TRILHAS POR DISCIPLINA ━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="section section--muted">
        <div className="container">
          <div className="section-head">
            <div className="section-head__copy">
              <span className="eyebrow">
                <span className="eyebrow__line" />
                <span className="eyebrow__code">§ 03</span> · Especialização vertical
              </span>
              <h2 className="section-title">
                Trilhas por <em>disciplina</em> técnica.
              </h2>
              <p className="section-lead">
                Navegação clara por área evita a sobrecarga típica de catálogos. Você estuda o que
                precisa no ritmo do projeto — não no ritmo da prateleira.
              </p>
            </div>
            <div className="section-head__aside">
              <span>R.03 · AEC.003</span>
              <span>{tracks.length} disciplinas</span>
            </div>
          </div>

          <div className="tracks-grid">
            {tracks.map((track, idx) => (
              <Link
                key={track.id}
                to={`/treinamentos/${track.slug}`}
                className="track-card"
                data-num={`T.${String(idx + 1).padStart(2, '0')}`}
                style={{ ['--track-color' as string]: track.color }}
              >
                <span className="track-card__icon">
                  <TrackIcon name={track.icon} />
                </span>
                <h3>{track.title}</h3>
                <p>{track.description}</p>
                <div className="track-card__meta">
                  <span>
                    <strong>{track.courseCount}</strong>
                    cursos
                  </span>
                  <span>
                    <strong>{track.totalHours}h</strong>
                    conteúdo
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* § 04 · CURSOS EM DESTAQUE ━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div className="section-head__copy">
              <span className="eyebrow">
                <span className="eyebrow__line" />
                <span className="eyebrow__code">§ 04</span> · Catálogo recente
              </span>
              <h2 className="section-title">
                Conteúdo recém-publicado.
              </h2>
              <p className="section-lead">
                Atualizações regulares da biblioteca corporativa, com módulos novos por trimestre.
              </p>
            </div>
            <div className="section-head__aside">
              <Link to="/treinamentos" className="link-underline">Ver todos →</Link>
            </div>
          </div>

          <div className="courses-grid">
            {courses.map((course, idx) => (
              <article key={course.id} className="course-card">
                <div className="course-card__media">
                  <img src={course.thumbnail} alt="" loading="lazy" />
                  <span className="badge badge--brand course-card__plate">
                    C.{String(idx + 1).padStart(3, '0')}
                  </span>
                </div>
                <div className="course-card__body">
                  <span className="badge">{course.level}</span>
                  <h3>{course.title}</h3>
                  <div className="course-card__meta">
                    <span>
                      <Icon name="clock" size={13} /> {course.durationHours}h
                    </span>
                    <span>
                      <Icon name="star" size={13} /> {course.rating.toFixed(1)}
                    </span>
                    <span>{course.enrolledCount} alunos</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* § 05 · DEPOIMENTOS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="section section--muted">
        <div className="container">
          <div className="section-head">
            <div className="section-head__copy">
              <span className="eyebrow">
                <span className="eyebrow__line" />
                <span className="eyebrow__code">§ 05</span> · Quem confia
              </span>
              <h2 className="section-title">
                Profissionais que mudaram a forma de <em>projetar</em>.
              </h2>
            </div>
            <div className="section-head__aside">
              <span>R.05 · AEC.005</span>
            </div>
          </div>

          <div className="testimonials">
            {TESTIMONIALS.map((t) => (
              <article key={t.id} className="testimonial">
                <blockquote>{t.quote}</blockquote>
                <div className="testimonial__author">
                  <span className="testimonial__avatar">{t.initials}</span>
                  <div>
                    <strong>{t.name}</strong>
                    <span>{t.role}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* § 06 · CTA FINAL ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="section">
        <div className="container">
          <div className="cta-strip">
            <div>
              <span className="eyebrow eyebrow--on-dark">
                <span className="eyebrow__line" />
                <span className="eyebrow__code">§ 06</span> · Comece agora
              </span>
              <h2>
                Acelere sua transição BIM com <em>método</em> e templates prontos.
              </h2>
              <p>
                Trilhas, templates e bibliotecas em um único hub. Mentoria mensal ao vivo para
                dúvidas reais de projeto.
              </p>
            </div>
            <div className="cta-strip__actions">
              <Link to="/treinamentos" className="btn btn-accent btn-lg">
                Ver treinamentos <Icon name="arrow-right" size={14} />
              </Link>
              <Link to="/contato" className="btn btn-on-dark btn-lg">
                Falar com o studio
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
