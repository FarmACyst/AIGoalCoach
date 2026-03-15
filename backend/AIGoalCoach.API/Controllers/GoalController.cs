using AIGoalCoach.Core.Interfaces;
using AIGoalCoach.Core.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace AIGoalCoach.API.Controllers
{
    [Route("api/goal")]
    [ApiController]
    public class GoalController : ControllerBase
    {
        private readonly ILoggerService _loggerService;
        private readonly IGoalService _goalService;

        public GoalController(ILoggerService loggerService, IGoalService goalService)
        {
            _loggerService = loggerService;
            _goalService = goalService;
        }

        /// <summary>
        /// Refines the user's goal into a SMART goal with 3-5 key results and confidence score.
        /// </summary>
        /// <param name="goalRequest">User's short goal description</param>
        /// <returns>Refined goal and key results</returns>
        /// <remarks>
        /// Sample request:
        /// 
        ///     POST /api/goal/refine
        ///     {
        ///        "userGoal": "I want to improve my sales this quarter"
        ///     }
        /// </remarks>
        /// <response code="200">Returns the refined goal</response>
        /// <response code="400">If the goal input is invalid</response>
        [HttpPost("refine")]
        public async Task<IActionResult> RefineGoals(GoalRequest goalRequest)
        {
            return Ok("Done");
            _loggerService.Log("Request", goalRequest);
            GoalRequestValidator validator = new GoalRequestValidator();
            var validationResult = validator.Validate(goalRequest);
            if (!validationResult.IsValid)
            {
                _loggerService.Log("Error", validationResult.Errors);
                return BadRequest(validationResult.Errors);
            }

            var goals = await _goalService.RefineGoals(goalRequest);
            _loggerService.Log("Response", goals);
            return Ok(goals);
        }
    }
}
