namespace AIGoalCoach.Core.Interfaces
{
    public interface ILoggerService
    {
        void Log(string message, object? infoItem);
        void LogTokens(string input, string output, int? promptTokens, int? completionTokens, int? totalTokens, long elapsedMs);
    }
}
