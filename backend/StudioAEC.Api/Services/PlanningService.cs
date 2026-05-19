using StudioAEC.Api.Models;

namespace StudioAEC.Api.Services;

public class PlanningService
{
    private readonly List<PlanningList> _lists =
    [
        new("backlog", "Backlog", 0),
        new("sprint", "Em andamento", 1),
        new("review", "Revisão", 2),
        new("done", "Concluído", 3)
    ];

    private readonly List<PlanningTask> _tasks =
    [
        new("t1", "Gravar módulo Revit Arquitetura — Fachadas", "sprint", "Alta", "Raniere", DateOnly.FromDateTime(DateTime.Today.AddDays(-5)), DateOnly.FromDateTime(DateTime.Today.AddDays(4)), 65, "sprint"),
        new("t2", "Atualizar biblioteca de famílias hidráulicas", "sprint", "Média", "Equipe BIM", DateOnly.FromDateTime(DateTime.Today.AddDays(-2)), DateOnly.FromDateTime(DateTime.Today.AddDays(8)), 40, "sprint"),
        new("t3", "Revisar template elétrico v3.2", "review", "Alta", "Marina", DateOnly.FromDateTime(DateTime.Today.AddDays(-10)), DateOnly.FromDateTime(DateTime.Today.AddDays(1)), 90, "review"),
        new("t4", "Planejar trilha Preventivo 2026", "backlog", "Baixa", "Raniere", DateOnly.FromDateTime(DateTime.Today.AddDays(3)), DateOnly.FromDateTime(DateTime.Today.AddDays(20)), 10, "backlog"),
        new("t5", "Publicar curso Climatização — Dutos", "done", "Média", "Lucas", DateOnly.FromDateTime(DateTime.Today.AddDays(-30)), DateOnly.FromDateTime(DateTime.Today.AddDays(-2)), 100, "done"),
        new("t6", "Compatibilização estrutural com arquitetura", "sprint", "Alta", "Ana", DateOnly.FromDateTime(DateTime.Today), DateOnly.FromDateTime(DateTime.Today.AddDays(12)), 25, "sprint"),
        new("t7", "Landing page novos treinamentos", "backlog", "Média", "Design", DateOnly.FromDateTime(DateTime.Today.AddDays(5)), DateOnly.FromDateTime(DateTime.Today.AddDays(15)), 0, "backlog")
    ];

    public IReadOnlyList<PlanningList> GetLists() => _lists;

    public IReadOnlyList<PlanningTask> GetTasks() => _tasks;

    public IReadOnlyList<WorkloadEntry> GetWorkload() =>
    [
        new("Raniere", 3, 32, 40),
        new("Marina", 2, 24, 40),
        new("Equipe BIM", 2, 28, 40),
        new("Lucas", 1, 16, 40),
        new("Ana", 2, 30, 40),
        new("Design", 1, 12, 40)
    ];

    public IReadOnlyList<GanttItem> GetGantt() =>
        _tasks.Select(t => new GanttItem(
            t.Id,
            t.Title,
            t.Assignee,
            t.StartDate,
            t.EndDate,
            t.Status switch
            {
                "done" => "#22c55e",
                "review" => "#f59e0b",
                "sprint" => "#6366f1",
                _ => "#94a3b8"
            })).ToList();
}
