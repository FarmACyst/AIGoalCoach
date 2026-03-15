using AIGoalCoach.Core.Interfaces;
using AIGoalCoach.Core.DTOs;
using AIGoalCoach.Core.Constants;

namespace AIGoalCoach.Services.AppServices
{
    /// <summary>
    /// Service for refining user goals using AI.
    /// </summary>
    public class GoalService : IGoalService
    {
        public readonly IAIService _aiService;

        public GoalService(IAIService aiService)
        {
            _aiService = aiService;
        }

        /// <summary>
        /// Refines user goal into a SMART goal with key results and confidence score.
        /// </summary>
        /// <param name="goalRequest">The user's goal request containing the goal description</param>
        /// <returns>Refined goal response with key results and confidence score</returns>
        public async Task<GoalResponse> RefineGoals(GoalRequest goalRequest)
        {
            try
            {
                // Replace placeholder in template with user's actual goal
                string prompt = GoalConstants.Prompt.Replace("USER_GOAL", goalRequest.UserGoal);
                GoalResponse response = await _aiService.GetResponseAsJson(prompt);
                return response;
            }
            catch (Exception ex)
            {
                throw new Exception("Error refining goal: " + ex.Message, ex);
            }
        }
    }
}
