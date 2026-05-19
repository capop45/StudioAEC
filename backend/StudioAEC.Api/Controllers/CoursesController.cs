using Microsoft.AspNetCore.Mvc;
using StudioAEC.Api.Services;

namespace StudioAEC.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CoursesController(CourseCatalogService catalog) : ControllerBase
{
    [HttpGet]
    public IActionResult GetAll([FromQuery] string? trackId) => Ok(catalog.GetCourses(trackId));

    [HttpGet("{id}")]
    public IActionResult GetById(string id)
    {
        var course = catalog.GetCourseById(id);
        return course is null ? NotFound() : Ok(course);
    }
}
