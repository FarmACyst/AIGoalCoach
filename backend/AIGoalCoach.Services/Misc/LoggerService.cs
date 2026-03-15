using AIGoalCoach.Core.Interfaces;
using Newtonsoft.Json;

namespace AIGoalCoach.Services.Misc
{
    public class LoggerService : ILoggerService
    {
        public void Log(string message, object? infoItem = null)
        {
            if (infoItem != null)
            {
                message += ": " + JsonConvert.SerializeObject(infoItem);
            }
            Console.WriteLine(message);
            
        }

        public void LogTokens(string input, string output, int? promptTokens, int? completionTokens, int? totalTokens, long elapsedMs)
        {
            Console.WriteLine("===================================================");
            Console.WriteLine("Input: " + input);
            Console.WriteLine("Output: " + output);
            Console.WriteLine("Prompt Tokens: " + promptTokens);
            Console.WriteLine("Completion Tokens: " + completionTokens);
            Console.WriteLine("Total Tokens Used: " + totalTokens);
            Console.WriteLine("Latency: " + elapsedMs + "ms");
            Console.WriteLine("===================================================");
        }
    }
}
