import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import type { GanttItem, PlanningList, PlanningTask, WorkloadEntry } from '../../types';
import '../../styles/planning.css';

type ViewMode = 'list' | 'gantt' | 'workload';

function parseDate(s: string) {
  return new Date(s + 'T12:00:00');
}

function daysBetween(a: Date, b: Date) {
  return Math.max(1, Math.round((b.getTime() - a.getTime()) / 86400000));
}

export function PlanningPage() {
  const { token } = useAuth();
  const [view, setView] = useState<ViewMode>('list');
  const [lists, setLists] = useState<PlanningList[]>([]);
  const [tasks, setTasks] = useState<PlanningTask[]>([]);
  const [workload, setWorkload] = useState<WorkloadEntry[]>([]);
  const [gantt, setGantt] = useState<GanttItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    const base = import.meta.env.VITE_API_URL ?? '';
    const headers = { Authorization: `Bearer ${token}` };

    const fetchAuth = <T,>(path: string) =>
      fetch(`${base}${path}`, { headers }).then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.json() as Promise<T>;
      });

    Promise.all([
      fetchAuth<PlanningList[]>('/api/planning/lists'),
      fetchAuth<PlanningTask[]>('/api/planning/tasks'),
      fetchAuth<WorkloadEntry[]>('/api/planning/workload'),
      fetchAuth<GanttItem[]>('/api/planning/gantt')
    ])
      .then(([l, t, w, g]) => {
        setLists(l.sort((a, b) => a.order - b.order));
        setTasks(t);
        setWorkload(w);
        setGantt(g);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const ganttRange = useMemo(() => {
    if (!gantt.length) {
      const start = new Date();
      return { start, days: 14 };
    }
    const starts = gantt.map((g) => parseDate(g.start));
    const ends = gantt.map((g) => parseDate(g.end));
    const min = new Date(Math.min(...starts.map((d) => d.getTime())));
    const max = new Date(Math.max(...ends.map((d) => d.getTime())));
    min.setDate(min.getDate() - 2);
    max.setDate(max.getDate() + 2);
    return { start: min, days: daysBetween(min, max) };
  }, [gantt]);

  const timelineLabels = useMemo(() => {
    const labels: string[] = [];
    const d = new Date(ganttRange.start);
    const step = Math.max(1, Math.floor(ganttRange.days / 14));
    for (let i = 0; i <= ganttRange.days; i += step) {
      const copy = new Date(d);
      copy.setDate(copy.getDate() + i);
      labels.push(copy.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }));
    }
    return labels;
  }, [ganttRange]);

  if (loading) return <p className="page-loading">— Carregando planejamento —</p>;

  return (
    <div className="planning-app">
      <div className="planning-topbar">
        <h1>AEC.AD · Planejamento</h1>
        <div className="view-tabs" role="tablist">
          {(['list', 'gantt', 'workload'] as const).map((v) => (
            <button
              key={v}
              type="button"
              role="tab"
              aria-selected={view === v}
              className={view === v ? 'active' : ''}
              onClick={() => setView(v)}
            >
              {v === 'list' ? 'Lista' : v === 'gantt' ? 'Gantt' : 'Workload'}
            </button>
          ))}
        </div>
      </div>

      <div className="planning-body">
        {view === 'list' && (
          <div className="board">
            {lists.map((list) => {
              const columnTasks = tasks.filter((t) => t.listId === list.id);
              return (
                <div key={list.id} className="board-column">
                  <div className="board-column__head">
                    {list.name}
                    <span className="board-column__count">{columnTasks.length}</span>
                  </div>
                  {columnTasks.map((task) => (
                    <article key={task.id} className="task-card">
                      <p className="task-card__title">{task.title}</p>
                      <div className="task-card__meta">
                        <span className={`priority priority--${task.priority.toLowerCase()}`}>
                          {task.priority}
                        </span>
                        <span className="assignee-pill">{task.assignee}</span>
                      </div>
                      <div className="progress-bar" aria-label={`Progresso ${task.progressPercent}%`}>
                        <span style={{ width: `${task.progressPercent}%` }} />
                      </div>
                    </article>
                  ))}
                </div>
              );
            })}
          </div>
        )}

        {view === 'gantt' && (
          <div className="gantt-wrap">
            <div className="gantt-header">
              <span>Tarefa</span>
              <div className="gantt-timeline">
                {timelineLabels.map((label, i) => (
                  <span key={i}>{label}</span>
                ))}
              </div>
            </div>
            {gantt.map((item) => {
              const start = parseDate(item.start);
              const end = parseDate(item.end);
              const offset = daysBetween(ganttRange.start, start) - 1;
              const width = daysBetween(start, end);
              const leftPct = (offset / ganttRange.days) * 100;
              const widthPct = (width / ganttRange.days) * 100;
              return (
                <div key={item.id} className="gantt-row">
                  <div className="gantt-row__label" title={item.title}>
                    {item.title}
                  </div>
                  <div className="gantt-row__track">
                    <div
                      className="gantt-bar"
                      style={{
                        left: `${leftPct}%`,
                        width: `${Math.max(widthPct, 2)}%`,
                        background: item.color
                      }}
                      title={`${item.assignee} · ${item.start} → ${item.end}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {view === 'workload' && (
          <div className="workload-grid">
            {workload.map((w) => {
              const pct = Math.round((w.hoursEstimated / w.capacityHours) * 100);
              const level = pct > 100 ? 'over' : pct > 85 ? 'warn' : 'ok';
              return (
                <div key={w.assignee} className="workload-card">
                  <div className="workload-card__head">
                    <span>{w.assignee}</span>
                    <span>{pct}% capacidade</span>
                  </div>
                  <div className="workload-bar">
                    <div
                      className={`workload-bar__fill ${level}`}
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                  <div className="workload-stats">
                    <span>{w.taskCount} tarefas</span>
                    <span>{w.hoursEstimated}h estimadas</span>
                    <span>{w.capacityHours}h capacidade</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
