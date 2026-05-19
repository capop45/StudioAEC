using Microsoft.AspNetCore.Mvc;
using StudioAEC.Api.Services;

namespace StudioAEC.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TracksController(CourseCatalogService catalog) : ControllerBase
{
    [HttpGet]
    public IActionResult GetAll() => Ok(catalog.GetTracks());

    [HttpGet("{slug}")]
    public IActionResult GetBySlug(string slug)
    {
        var track = catalog.GetTrackBySlug(slug);
        return track is null ? NotFound() : Ok(track);
    }

    [HttpGet("{slug}/courses")]
    public IActionResult GetCourses(string slug)
    {
        var track = catalog.GetTrackBySlug(slug);
        if (track is null) return NotFound();
        return Ok(catalog.GetCourses(track.Id));
    }
}
