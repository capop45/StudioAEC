import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { apiGet } from '../api/client';
import { TrackIcon } from '../components/TrackIcon';
import { Icon } from '../components/Icon';
import type { Course, CourseTrack } from '../types';

export function TrackDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [track, setTrack] = useState<CourseTrack | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    Promise.all([
      apiGet<CourseTrack>(`/api/tracks/${slug}`),
      apiGet<Course[]>(`/api/tracks/${slug}/courses`)
    ])
      .then(([t, c]) => {
        setTrack(t);
        setCourses(c);
      })
      .catch(() => setTrack(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <p className="page-loading">— Carregando trilha —</p>;
  if (!track) return <p className="page-error">Trilha não encontrada.</p>;

  return (
    <>
      <header className="page-header">
        <div className="page-header__grid" aria-hidden="true" />
        <div className="page-header__hatch" aria-hidden="true" />
        <div className="container">
          <div className="page-header__bar">
            <span>
              <strong>AEC.{track.slug.toUpperCase()}</strong>
            </span>
            <span>R.TD · Trilha técnica</span>
          </div>
          <nav className="track-detail__breadcrumb" aria-label="Trilha atual">
            <Link to="/treinamentos">← Voltar às trilhas</Link>
          </nav>
          <div className="track-detail__header">
            <span
              className="track-detail__icon"
              style={{ color: track.color, borderColor: track.color }}
            >
              <TrackIcon name={track.icon} />
            </span>
            <div>
              <span className="eyebrow eyebrow--on-dark">
                <span className="eyebrow__line" />
                <span className="eyebrow__code">§ TD</span> · Trilha técnica
              </span>
              <h1 className="page-header__title" style={{ marginBlockStart: 'var(--space-3)' }}>
                {track.title}
              </h1>
              <p className="page-header__lead">{track.description}</p>
            </div>
          </div>
          <div className="page-header__cartouche">
            <div>
              <strong>{track.courseCount}</strong>
              Cursos
            </div>
            <div>
              <strong>{track.totalHours}h</strong>
              Conteúdo
            </div>
            <div>
              <strong>LOD 100→500</strong>
              Cobertura
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
                <span className="eyebrow__code">§ TD.01</span> · Módulos
              </span>
              <h2 className="section-title">Cursos da trilha.</h2>
            </div>
            <div className="section-head__aside">
              <span>{courses.length} módulos · sequenciais</span>
            </div>
          </div>

          <div className="courses-grid">
            {courses.map((course, idx) => (
              <article key={course.id} className="course-card">
                <div className="course-card__media">
                  <img src={course.thumbnail} alt="" loading="lazy" />
                  <span className="badge badge--brand course-card__plate">
                    M.{String(idx + 1).padStart(2, '0')}
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
