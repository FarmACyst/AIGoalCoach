using AIGoalCoach.Core.Interfaces;
using AIGoalCoach.Core.DTOs;
using AIGoalCoach.Core.Constants;

namespace AIGoalCoach.Services.AppServices
{
    public class GoalService : IGoalService
    {
        public readonly IAIService _aiService;
        public GoalService (IAIService aiService)
        {
            _aiService = aiService;
        }
        public async Task<GoalResponse> RefineGoals(GoalRequest goalRequest)
        {
            string prompt = GoalConstants.Prompt.Replace("USER_GOAL", goalRequest.UserGoal);
            GoalResponse response = await _aiService.GetResponseAsJson(prompt);
            return response;
        }
    }
}
