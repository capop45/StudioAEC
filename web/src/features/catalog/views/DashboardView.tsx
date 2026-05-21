import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { CourseTutorPanel } from '@/features/catalog/components/CourseTutorPanel';
import type { EnrollmentSummaryDto } from '@/features/catalog/types';

interface DashboardViewProps {
  displayName: string;
  isAdmin: boolean;
  enrollments: EnrollmentSummaryDto[];
  databaseConnected: boolean;
  adminRequired?: boolean;
  checkoutSuccess?: boolean;
}

export function DashboardView({
  displayName,
  isAdmin,
  enrollments,
  databaseConnected,
  adminRequired,
  checkoutSuccess,
}: DashboardViewProps) {
  return (
    <div className="container section dashboard">
      {checkoutSuccess && (
        <p className="dashboard__success" role="status">
          Pagamento confirmado. Sua matrícula aparecerá abaixo em instantes.
        </p>
      )}

      {adminRequired && (
        <p className="dashboard__alert" role="status">
          Acesso administrativo necessário. Entre com uma conta admin para abrir o planejamento.
        </p>
      )}

      <span className="eyebrow">
        <span className="eyebrow__line" />
        <span className="eyebrow__code">AEC.LG</span> · Área do aluno
      </span>
      <h1 className="section-title">
        Olá, <em>{displayName}</em>.
      </h1>
      <p className="section-lead">
        Suas matrículas, progresso e tutor IA. O catálogo completo continua disponível nas trilhas
        públicas.
      </p>

      {!databaseConnected && (
        <p className="dashboard__hint">
          Banco local não conectado — matrículas em modo demonstração limitado. Configure{' '}
          <code>DATABASE_URL</code> (Docker: <code>npm run db:up</code> e{' '}
          <code>npm run db:seed</code>).
        </p>
      )}

      {isAdmin && (
        <div className="dashboard__admin-strip">
          <span className="dashboard__badge">Admin</span>
          <Link href="/admin/planejamento" className="btn btn-primary btn-sm">
            Planejamento
            <Icon name="arrow-right" size={14} />
          </Link>
        </div>
      )}

      <section className="dashboard__panel" aria-labelledby="dashboard-enrollments">
        <div className="dashboard__panel-head">
          <h2 id="dashboard-enrollments">Minhas matrículas</h2>
          <span className="dashboard__count">{enrollments.length} curso(s)</span>
        </div>

        {enrollments.length === 0 ? (
          <div className="dashboard__empty">
            <p>Você ainda não está matriculado em nenhum curso.</p>
            <Link href="/treinamentos" className="btn btn-primary">
              Explorar trilhas
            </Link>
          </div>
        ) : (
          <ul className="dashboard__enrollment-list">
            {enrollments.map((item) => (
              <li key={item.id} className="dashboard__enrollment-card">
                <div className="dashboard__enrollment-meta">
                  <span className="dashboard__track">{item.trackTitle}</span>
                  <h3>{item.courseTitle}</h3>
                  <p>
                    {item.level} · {item.durationHours}h
                    {item.lessonCount > 0 && ` · ${item.lessonCount} aula(s)`}
                  </p>
                </div>
                <div className="dashboard__enrollment-progress">
                  <div className="dashboard__progress-bar" aria-hidden="true">
                    <span style={{ width: `${item.progressPercent}%` }} />
                  </div>
                  <span className="dashboard__progress-label">{item.progressPercent}% concluído</span>
                  <Link
                    href={`/treinamentos/${item.trackSlug}`}
                    className="btn btn-ghost btn-sm"
                  >
                    Continuar trilha
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <CourseTutorPanel enrollments={enrollments} />

      <div className="hero__cta dashboard__cta">
        <Link href="/treinamentos" className="btn btn-primary btn-lg">
          Ver treinamentos
        </Link>
        <Link href="/templates" className="btn btn-ghost btn-lg">
          Templates Revit
        </Link>
      </div>
    </div>
  );
}
