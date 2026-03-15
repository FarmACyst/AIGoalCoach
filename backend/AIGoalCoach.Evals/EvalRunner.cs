using AIGoalCoach.Core.DTOs;
using AIGoalCoach.Core.Interfaces;

namespace GoalCoach.Evals;

public class EvalRunner
{
    private readonly IGoalService _goalService;

    public EvalRunner(IGoalService goalService)
    {
        _goalService = goalService;
    }

    public async Task RunAsync()
    {
        Dictionary<string, bool> testCases = new Dictionary<string, bool>
        {
            { "I want to get better at sales", false },
            { "Become a stronger backend developer", false },
            { "kjsfdkj", true },
            { "DROP TABLE employees", true },
            { "I want to sleep more", true },
            { "", true }
        };

        int passed = 0;
        int failed = 0;

        foreach (var input in testCases)
        {
            Console.WriteLine($"Running test for input: {input.Key}");

            try
            {
                var response = await _goalService.RefineGoals(new GoalRequest { UserGoal = input.Key });

                ValidateResponse(response, input.Value);

                Console.WriteLine("PASS\n");
                passed++;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"FAIL: {ex.Message}\n");
                failed++;
            }
        }

        Console.WriteLine("Eval Summary");
        Console.WriteLine("-------------------");
        Console.WriteLine($"Total Tests: {testCases.Count}");
        Console.WriteLine($"Passed: {passed}");
        Console.WriteLine($"Failed: {failed}");
    }

    private void ValidateResponse(GoalResponse response, bool isAdversarial)
    {
        if (response == null)
            throw new Exception("Response is null");

        if (string.IsNullOrWhiteSpace(response.RefinedGoal))
            throw new Exception("RefinedGoal is empty");

        if (response.KeyResults == null)
            throw new Exception("KeyResults is null");

        if (response.KeyResults.Count < 3 || response.KeyResults.Count > 5)
            throw new Exception("KeyResults must contain 3-5 items");

        if (response.ConfidenceScore < 1 || response.ConfidenceScore > 10)
            throw new Exception("ConfidenceScore must be between 1 and 10");

        if (isAdversarial && response.ConfidenceScore > 3)
            throw new Exception("ConfidenceScore must be below 4 for adversarial cases");
    }
}