import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiGet } from '../api/client';
import { TrackIcon } from '../components/TrackIcon';
import { Icon } from '../components/Icon';
import type { Course, CourseTrack } from '../types';

export function TreinamentosPage() {
  const [tracks, setTracks] = useState<CourseTrack[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    Promise.all([apiGet<CourseTrack[]>('/api/tracks'), apiGet<Course[]>('/api/courses')])
      .then(([t, c]) => {
        setTracks(t);
        setCourses(c);
      })
      .finally(() => setLoading(false));
  }, []);

  const visibleCourses = useMemo(
    () => (filter === 'all' ? courses : courses.filter((c) => c.trackId === filter)),
    [filter, courses]
  );

  if (loading) return <p className="page-loading">— Carregando trilhas —</p>;

  return (
    <>
      <header className="page-header">
        <div className="page-header__grid" aria-hidden="true" />
        <div className="page-header__hatch" aria-hidden="true" />
        <div className="container">
          <div className="page-header__bar">
            <span>
              <strong>AEC.T01</strong> · Treinamentos
            </span>
            <span>R.01 · Catálogo {new Date().getFullYear()}</span>
          </div>
          <span className="eyebrow eyebrow--on-dark">
            <span className="eyebrow__line" />
            <span className="eyebrow__code">§ T01</span> · Trilhas técnicas
          </span>
          <h1 className="page-header__title">
            Trilhas Revit por <em>especialidade</em>.
          </h1>
          <p className="page-header__lead">
            Cada trilha agrupa cursos, projetos práticos, templates e bibliotecas correlatas. Estude
            sequencialmente para virar referência na disciplina escolhida — não fragmentado.
          </p>
          <div className="page-header__cartouche">
            <div>
              <strong>{tracks.length}</strong>
              Trilhas
            </div>
            <div>
              <strong>{courses.length}+</strong>
              Cursos
            </div>
            <div>
              <strong>LOD 100→500</strong>
              ISO 19650
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
                <span className="eyebrow__code">§ T02</span> · Por disciplina
              </span>
              <h2 className="section-title">Disciplinas técnicas.</h2>
            </div>
            <div className="section-head__aside">
              <span>R.T02 · {tracks.length} trilhas</span>
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

      <section className="section section--muted">
        <div className="container">
          <div className="section-head">
            <div className="section-head__copy">
              <span className="eyebrow">
                <span className="eyebrow__line" />
                <span className="eyebrow__code">§ T03</span> · Catálogo completo
              </span>
              <h2 className="section-title">Todos os cursos disponíveis.</h2>
              <p className="section-lead">Filtre por disciplina para encontrar o módulo certo.</p>
            </div>
            <div className="section-head__aside">
              <span>R.T03</span>
            </div>
          </div>

          <div className="filters-bar" role="tablist" aria-label="Filtrar por trilha">
            <button
              type="button"
              role="tab"
              aria-pressed={filter === 'all'}
              onClick={() => setFilter('all')}
            >
              Todos
            </button>
            {tracks.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-pressed={filter === t.id}
                onClick={() => setFilter(t.id)}
              >
                {t.title}
              </button>
            ))}
          </div>

          <div className="courses-grid">
            {visibleCourses.map((course, idx) => (
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
                  <p className="course-card__summary">{course.summary}</p>
                  <div className="course-card__meta">
                    <span>
                      <Icon name="clock" size={13} /> {course.durationHours}h
                    </span>
                    <span>
                      <Icon name="star" size={13} /> {course.rating.toFixed(1)}
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
