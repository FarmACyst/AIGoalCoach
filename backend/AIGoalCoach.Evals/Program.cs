using AIGoalCoach.Core.Interfaces;
using AIGoalCoach.Services.AIServices;
using AIGoalCoach.Services.AppServices;
using AIGoalCoach.Services.Misc;
using GoalCoach.Evals;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

var configuration = new ConfigurationBuilder()
    .AddJsonFile("appsettings.json")
    .Build();

var services = new ServiceCollection();

services.AddSingleton<IConfiguration>(configuration);
services.AddSingleton<ILoggerService, LoggerService>();
services.AddSingleton<IGoalService, GoalService>();
services.AddScoped<IAIService, GeminiService>();

services.AddTransient<EvalRunner>();

var provider = services.BuildServiceProvider();

var runner = provider.GetRequiredService<EvalRunner>();

await runner.RunAsync();