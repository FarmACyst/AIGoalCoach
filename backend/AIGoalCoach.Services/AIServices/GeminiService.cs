using AIGoalCoach.Core.Interfaces;
using AIGoalCoach.Core.DTOs;
using Google.GenAI;
using Newtonsoft.Json;
using AIGoalCoach.Core.Utilities;
using Microsoft.Extensions.Configuration;

namespace AIGoalCoach.Services.AIServices
{
    public class GeminiService : IAIService
    {
        private readonly IConfiguration _configuration;
        private readonly Client _client;

        public GeminiService(IConfiguration configuration)
        {
            _configuration = configuration;
            _client = new Client(apiKey: _configuration["Gemini:ApiKey"]);
        }

        public async Task<GoalResponse> GetResponseAsJson(string prompt)
        {
            try
            {
                var model = _configuration["Gemini:Model"];
                var schema = JsonHelper.GenerateSchema<GoalResponse>();
                var config = new Google.GenAI.Types.GenerateContentConfig
                {
                    ResponseMimeType = "application/json",
                    ResponseJsonSchema = schema
                };

                var response = await _client.Models.GenerateContentAsync(model, prompt, config);
                return JsonConvert.DeserializeObject<GoalResponse>(response.Text)!;
            }
            catch (Exception ex)
            {
                throw;
            }
        }
    }
}
