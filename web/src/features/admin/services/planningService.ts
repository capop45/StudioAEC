export interface PlanningListDto {
  id: string;
  name: string;
  order: number;
}

export interface PlanningTaskDto {
  id: string;
  title: string;
  status: string;
  priority: string;
  assignee: string;
  startDate: string;
  endDate: string;
  progressPercent: number;
  listId: string;
}

export interface WorkloadEntryDto {
  assignee: string;
  taskCount: number;
  hoursEstimated: number;
  capacityHours: number;
}

export interface GanttItemDto {
  id: string;
  title: string;
  assignee: string;
  start: string;
  end: string;
  color: string;
}

const LISTS: PlanningListDto[] = [
  { id: 'backlog', name: 'Backlog', order: 0 },
  { id: 'sprint', name: 'Em andamento', order: 1 },
  { id: 'review', name: 'Revisão', order: 2 },
  { id: 'done', name: 'Concluído', order: 3 },
];

const TASKS: PlanningTaskDto[] = [
  {
    id: 't1',
    title: 'Gravar módulo Revit Arquitetura — Fachadas',
    status: 'sprint',
    priority: 'Alta',
    assignee: 'Raniere',
    startDate: new Date(Date.now() - 5 * 86400000).toISOString().slice(0, 10),
    endDate: new Date(Date.now() + 4 * 86400000).toISOString().slice(0, 10),
    progressPercent: 65,
    listId: 'sprint',
  },
  {
    id: 't2',
    title: 'Atualizar biblioteca de famílias hidráulicas',
    status: 'sprint',
    priority: 'Média',
    assignee: 'Equipe BIM',
    startDate: new Date(Date.now() - 2 * 86400000).toISOString().slice(0, 10),
    endDate: new Date(Date.now() + 8 * 86400000).toISOString().slice(0, 10),
    progressPercent: 40,
    listId: 'sprint',
  },
  {
    id: 't3',
    title: 'Revisar template elétrico v3.2',
    status: 'review',
    priority: 'Alta',
    assignee: 'Marina',
    startDate: new Date(Date.now() - 10 * 86400000).toISOString().slice(0, 10),
    endDate: new Date(Date.now() + 1 * 86400000).toISOString().slice(0, 10),
    progressPercent: 90,
    listId: 'review',
  },
  {
    id: 't4',
    title: 'Planejar trilha Preventivo 2026',
    status: 'backlog',
    priority: 'Baixa',
    assignee: 'Raniere',
    startDate: new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10),
    endDate: new Date(Date.now() + 20 * 86400000).toISOString().slice(0, 10),
    progressPercent: 10,
    listId: 'backlog',
  },
  {
    id: 't5',
    title: 'Publicar curso Climatização — Dutos',
    status: 'done',
    priority: 'Média',
    assignee: 'Lucas',
    startDate: new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10),
    endDate: new Date(Date.now() - 2 * 86400000).toISOString().slice(0, 10),
    progressPercent: 100,
    listId: 'done',
  },
];

export function getPlanningLists(): PlanningListDto[] {
  return LISTS;
}

export function getPlanningTasks(): PlanningTaskDto[] {
  return TASKS;
}

export function getWorkload(): WorkloadEntryDto[] {
  return [
    { assignee: 'Raniere', taskCount: 3, hoursEstimated: 32, capacityHours: 40 },
    { assignee: 'Marina', taskCount: 2, hoursEstimated: 24, capacityHours: 40 },
    { assignee: 'Equipe BIM', taskCount: 2, hoursEstimated: 28, capacityHours: 40 },
    { assignee: 'Lucas', taskCount: 1, hoursEstimated: 16, capacityHours: 40 },
    { assignee: 'Ana', taskCount: 2, hoursEstimated: 30, capacityHours: 40 },
    { assignee: 'Design', taskCount: 1, hoursEstimated: 12, capacityHours: 40 },
  ];
}

export function getGantt(): GanttItemDto[] {
  const colors: Record<string, string> = {
    done: '#22c55e',
    review: '#f59e0b',
    sprint: '#6366f1',
  };
  return TASKS.map((t) => ({
    id: t.id,
    title: t.title,
    assignee: t.assignee,
    start: t.startDate,
    end: t.endDate,
    color: colors[t.status] ?? '#94a3b8',
  }));
}
