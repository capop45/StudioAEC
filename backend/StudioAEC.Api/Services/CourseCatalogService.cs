using StudioAEC.Api.Models;

namespace StudioAEC.Api.Services;

public class CourseCatalogService
{
    private readonly List<CourseTrack> _tracks =
    [
        new("arquitetura", "Arquitetura", "arquitetura",
            "Treinamentos e bibliotecas de Revit para projetos arquitetônicos BIM.",
            "buildings", "#6366f1", 12, 48),
        new("hidraulica", "Hidráulica", "hidraulica",
            "Modelagem, dimensionamento e documentação hidráulica em Revit.",
            "drop", "#0ea5e9", 8, 32),
        new("eletrica", "Elétrica", "eletrica",
            "Projeto elétrico integrado com painéis, circuitos e memorial descritivo.",
            "lightning", "#f59e0b", 10, 40),
        new("preventivo", "Preventivo", "preventivo",
            "Sistemas de combate a incêndio e segurança conforme normas técnicas.",
            "shield", "#ef4444", 6, 24),
        new("climatizacao", "Climatização", "climatizacao",
            "HVAC, dutos, cargas térmicas e compatibilização multidisciplinar.",
            "wind", "#14b8a6", 7, 28),
        new("estruturas", "Estruturas", "estruturas",
            "Estruturas de concreto e aço com detalhamento e quantitativos.",
            "columns", "#8b5cf6", 9, 36)
    ];

    private readonly List<Course> _courses;

    public CourseCatalogService()
    {
        _courses = BuildSampleCourses();
    }

    public IReadOnlyList<CourseTrack> GetTracks() => _tracks;

    public CourseTrack? GetTrackBySlug(string slug) =>
        _tracks.FirstOrDefault(t => t.Slug.Equals(slug, StringComparison.OrdinalIgnoreCase));

    public IReadOnlyList<Course> GetCourses(string? trackId = null) =>
        trackId is null
            ? _courses
            : _courses.Where(c => c.TrackId == trackId).ToList();

    public Course? GetCourseById(string id) => _courses.FirstOrDefault(c => c.Id == id);

    private static List<Course> BuildSampleCourses()
    {
        var levels = new[] { "Iniciante", "Intermediário", "Avançado" };
        var courses = new List<Course>();
        var trackIds = new[] { "arquitetura", "hidraulica", "eletrica", "preventivo", "climatizacao", "estruturas" };

        for (var i = 0; i < 24; i++)
        {
            var track = trackIds[i % trackIds.Length];
            courses.Add(new Course(
                $"course-{i + 1}",
                track,
                $"Revit {track[..1].ToUpper()}{track[1..]} — Módulo {(i % 4) + 1}",
                "Aprenda fluxos BIM com templates, famílias e documentação executiva alinhada ao mercado.",
                levels[i % 3],
                4 + (i % 6),
                4.2 + (i % 8) * 0.1,
                120 + i * 17,
                $"https://picsum.photos/seed/aec{i}/640/360"));
        }

        return courses;
    }
}
