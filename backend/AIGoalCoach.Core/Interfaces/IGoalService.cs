using AIGoalCoach.Core.DTOs;

namespace AIGoalCoach.Core.Interfaces
{
    public interface IGoalService
    {
        Task<GoalResponse> RefineGoals(GoalRequest goalRequest);
    }
}
