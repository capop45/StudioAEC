import { PlanningView } from '@/features/admin/views/PlanningView';
import {
  getGantt,
  getPlanningLists,
  getPlanningTasks,
  getWorkload,
} from '@/features/admin/services/planningService';

export const metadata = {
  title: 'Planejamento',
};

export default function PlanningPage() {
  const lists = getPlanningLists().sort((a, b) => a.order - b.order);
  const tasks = getPlanningTasks();
  const workload = getWorkload();
  const gantt = getGantt();

  return <PlanningView lists={lists} tasks={tasks} workload={workload} gantt={gantt} />;
}
