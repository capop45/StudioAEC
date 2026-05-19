using System.ComponentModel.DataAnnotations;

namespace StudioAEC.Api.Models;

public record LoginRequest
{
    [Required(ErrorMessage = "E-mail é obrigatório.")]
    [EmailAddress(ErrorMessage = "Informe um e-mail válido.")]
    [StringLength(120, MinimumLength = 5)]
    public string Email { get; init; } = string.Empty;

    [Required(ErrorMessage = "Senha é obrigatória.")]
    [StringLength(128, MinimumLength = 6, ErrorMessage = "Senha deve ter pelo menos 6 caracteres.")]
    public string Password { get; init; } = string.Empty;
}

public record LoginResponse(string Token, string Name, string Email, string Role);

public record CourseTrack(
    string Id,
    string Title,
    string Slug,
    string Description,
    string Icon,
    string Color,
    int CourseCount,
    int TotalHours);

public record Course(
    string Id,
    string TrackId,
    string Title,
    string Summary,
    string Level,
    int DurationHours,
    double Rating,
    int EnrolledCount,
    string Thumbnail);

public record PlanningTask(
    string Id,
    string Title,
    string Status,
    string Priority,
    string Assignee,
    DateOnly StartDate,
    DateOnly EndDate,
    int ProgressPercent,
    string ListId);

public record PlanningList(string Id, string Name, int Order);

public record WorkloadEntry(string Assignee, int TaskCount, int HoursEstimated, int CapacityHours);

public record GanttItem(string Id, string Title, string Assignee, DateOnly Start, DateOnly End, string Color);
