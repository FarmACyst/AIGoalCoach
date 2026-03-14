using Microsoft.AspNetCore.Mvc;

namespace AIGoalCoach.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GoalController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetGoals()
        {
            return Ok("Done");
        }
    }
}
