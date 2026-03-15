using AIGoalCoach.Core.Interfaces;
using AIGoalCoach.Core.DTOs;
using Google.GenAI;
using Newtonsoft.Json;
using AIGoalCoach.Core.Utilities;
using Microsoft.Extensions.Configuration;
using System.Diagnostics;

namespace AIGoalCoach.Services.AIServices
{
    /// <summary>
    /// Service for calling Gemini AI API to refine goals.
    /// </summary>
    public class GeminiService : IAIService
    {
        private readonly IConfiguration _configuration;
        private readonly ILoggerService _logger;
        private readonly Client _client;

        public GeminiService(IConfiguration configuration, ILoggerService logger)
        {
            _configuration = configuration;
            _client = new Client(apiKey: _configuration["Gemini:ApiKey"]);
            _logger = logger;
        }

        /// <summary>
        /// Calls Gemini API to generate a JSON response for goal refinement.
        /// </summary>
        /// <param name="prompt">The prompt to send to Gemini API</param>
        /// <returns>Parsed GoalResponse object</returns>
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

                // Measure API call performance
                Stopwatch stopwatch = Stopwatch.StartNew();

                var response = await _client.Models.GenerateContentAsync(model, prompt, config);

                stopwatch.Stop();

                if (response == null || string.IsNullOrEmpty(response.Text))
                {
                    throw new Exception("Gemini API returned empty response");
                }

                // Log token usage and latency metrics
                _logger.LogTokens(
                    prompt,
                    response.Text,
                    response.UsageMetadata?.PromptTokenCount,
                    response.UsageMetadata?.CandidatesTokenCount,
                    response.UsageMetadata?.TotalTokenCount,
                    stopwatch.ElapsedMilliseconds
                );

                try
                {
                    return JsonConvert.DeserializeObject<GoalResponse>(response.Text)!;
                }
                catch (JsonSerializationException jex)
                {
                    _logger.Log("JSON deserialization error: " + jex.Message, jex);
                    throw;
                }
            }
            catch (HttpRequestException hex)
            {
                _logger.Log("API call failed: " + hex.Message, hex);
                throw new Exception("Failed to connect to Gemini API", hex);
            }
            catch (Exception ex)
            {
                _logger.Log("Unexpected error in GetResponseAsJson: " + ex.Message, ex);
                throw;
            }
        }
    }
}
