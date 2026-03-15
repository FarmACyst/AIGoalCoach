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
    }
}
