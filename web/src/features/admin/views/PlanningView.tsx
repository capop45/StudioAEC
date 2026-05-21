'use client';

import { useMemo, useState } from 'react';
import type {
  GanttItemDto,
  PlanningListDto,
  PlanningTaskDto,
  WorkloadEntryDto,
} from '@/features/admin/services/planningService';
import '@/styles/planning.css';

type ViewMode = 'list' | 'gantt' | 'workload';

function parseDate(s: string) {
  return new Date(`${s}T12:00:00`);
}

function daysBetween(a: Date, b: Date) {
  return Math.max(1, Math.round((b.getTime() - a.getTime()) / 86400000));
}

interface PlanningViewProps {
  lists: PlanningListDto[];
  tasks: PlanningTaskDto[];
  workload: WorkloadEntryDto[];
  gantt: GanttItemDto[];
}

export function PlanningView({ lists, tasks, workload, gantt }: PlanningViewProps) {
  const [view, setView] = useState<ViewMode>('list');

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
                        background: item.color,
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
