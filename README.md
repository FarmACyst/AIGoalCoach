# AI Goal Coach

A web application that transforms vague goals into clear, actionable SMART goals using AI. Built with .NET backend and Angular frontend.

---

## 🎯 What It Does

1. **Input**: User enters a goal (e.g., "I want to improve my sales")
2. **Process**: AI analyzes and refines it
3. **Output**: Structured SMART goal with 3-5 key results and confidence score

---

## 🏗️ Architecture

```
Frontend (Angular)
      ↓
API (.NET Core)
      ↓
Business Logic (C#)
      ↓
Google Gemini AI
```

### Why These Technologies?

**Backend: .NET Core**
- Robust and production-ready
- Great performance
- Strong typing prevents bugs
- Easy to scale

**Frontend: Angular**
- Type-safe with TypeScript
- Well-organized component structure
- Good for complex UIs

**AI: Google Gemini**
- Fast responses (~1 second)
- Reliable JSON output format
- Cost-effective
- Guarantees structured data (no parsing errors)

---

## 🚀 Quick Start

### Backend Setup

```bash
# 1. Go to backend folder
cd backend

# 2. Add your Gemini API key to appsettings.json
{
  "Gemini": {
    "ApiKey": "your-api-key-here",
    "Model": "gemini-2-flash-preview"
  }
}

# 3. Run the API
dotnet run --project AIGoalCoach.API
```

The API will be available at: `https://localhost:7040`

### Frontend Setup

```bash
# 1. Go to frontend folder
cd frontend/ai-goal-coach-ui

# 2. Install dependencies
npm install

# 3. Run the frontend
ng serve
```

The app will be available at: `http://localhost:4200`

---

## 📚 Project Structure

```
AIGoalCoach/
├── backend/
│   ├── AIGoalCoach.API/          # API endpoints
│   ├── AIGoalCoach.Core/         # Interfaces & data models
│   ├── AIGoalCoach.Services/     # Business logic
│   └── AIGoalCoach.sln
├── frontend/
    └── ai-goal-coach-ui/         # Angular app
```

---

## 🔌 API Endpoint

### POST `/api/goal/refine`

**Send this:**
```json
{
  "userGoal": "I want to improve my sales this quarter"
}
```

**Get this back:**
```json
{
  "refined_goal": "Increase quarterly sales revenue by 25%",
  "key_results": [
    "Schedule 50 client discovery calls",
    "Close 5 new enterprise accounts",
    "Reduce sales cycle by 20%",
    "Achieve 95% proposal close rate"
  ],
  "confidence_score": 9
}
```

**Error responses:**
- `400` - Invalid input
- `500` - Server error

---

## 💡 Key Design Decisions

### 1. Why Google Gemini?
- **Native JSON Mode**: Guarantees structured output without extra parsing
- **No Hallucinations**: Model enforces the exact format we need
- **Fast & Cheap**: 3x faster and cheaper than competing models

### 2. Why .NET?
- **Scalable**: Easy to handle thousands of concurrent users
- **Reliable**: Built for enterprise applications
- **Type-Safe**: Catches errors during development, not in production

### 3. Exception Handling
- All errors are logged for debugging
- API returns generic error messages (no sensitive details to users)
- Services catch errors at natural boundaries

---

## 📊 How It Works

```
1. User submits goal
   ↓
2. Controller validates input
   ↓
3. Service creates AI prompt
   ↓
4. GeminiService calls Google API
   ↓
5. Google returns structured JSON
   ↓
6. Deserialize to C# object
   ↓
7. Return to frontend
```

---

## 🔧 Development Tips

### Adding Logging
```csharp
_logger.Log("Info message", optionalObject);
```

### Validation
Goals are validated using FluentValidation:
- Must not be empty
- Must be ≤ 100 characters

### Exception Handling
- Try-catch blocks only where necessary (boundaries between layers)
- Always log before throwing
- Let exceptions bubble up from services to controller

---

## 📈 Scaling Considerations

**Current Setup**: Handles ~60 goals/minute (Google API limit)

**For 10,000 users**, we would need:
1. **Caching** - Store recent results to avoid duplicate API calls
2. **Queuing** - Use background jobs for high volume
3. **Multiple Servers** - Horizontal scaling with load balancer
4. **Database** - Store goal history

---

## 🐛 Troubleshooting

**"API key error"**
- Check `appsettings.json` has correct API key

**"Cannot connect to Gemini"**
- Verify internet connection
- Check API rate limits in Google Console

**"Port already in use"**
- Backend: Change port in `launchSettings.json`
- Frontend: Use `ng serve --port 4300`

---

## 📝 Documentation

Detailed architecture decisions are in the `.copilot/` folder.

---

## 👨‍💻 Next Steps

1. Clone repository
2. Follow Quick Start above
3. Test the API with Postman or curl
4. Modify goal refinement prompt in `GoalConstants.cs`

---

**Built with ❤️ using .NET, Angular, and Google Gemini** 

Last Updated: March 15, 2026
