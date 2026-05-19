using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StudioAEC.Api.Services;

namespace StudioAEC.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class PlanningController(PlanningService planning) : ControllerBase
{
    [HttpGet("lists")]
    public IActionResult GetLists() => Ok(planning.GetLists());

    [HttpGet("tasks")]
    public IActionResult GetTasks() => Ok(planning.GetTasks());

    [HttpGet("workload")]
    public IActionResult GetWorkload() => Ok(planning.GetWorkload());

    [HttpGet("gantt")]
    public IActionResult GetGantt() => Ok(planning.GetGantt());
}
