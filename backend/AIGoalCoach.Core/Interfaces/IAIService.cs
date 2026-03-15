using AIGoalCoach.Core.DTOs;

namespace AIGoalCoach.Core.Interfaces
{
    public interface IAIService
    {
        Task<GoalResponse> GetResponseAsJson(string input);
    }
}
