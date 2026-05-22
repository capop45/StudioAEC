import { AppLink } from '@/components/AppLink';
import { TrackIcon } from '@/components/TrackIcon';
import { TreinamentosCoursesFilter } from '@/features/catalog/components/TreinamentosCoursesFilter';
import type { CourseDto, CourseTrackDto } from '@/features/catalog/types';

interface TreinamentosViewProps {
  tracks: CourseTrackDto[];
  courses: CourseDto[];
  year: number;
}

export function TreinamentosView({ tracks, courses, year }: TreinamentosViewProps) {
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
            <span>R.01 · Catálogo {year}</span>
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
              <AppLink
                key={track.id}
                href={`/treinamentos/${track.slug}`}
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
              </AppLink>
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

          <TreinamentosCoursesFilter tracks={tracks} courses={courses} />
        </div>
      </section>
    </>
  );
}
