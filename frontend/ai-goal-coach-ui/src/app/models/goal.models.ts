/**
 * Goal Refinement Data Models
 * Strictly typed interfaces matching the backend schema
 */

export interface IRefinedGoalResponse {
  refinedGoal: string;
  keyResults: string[];
  confidenceScore: number;
}

export interface IGlobalGoal {
  id: string;
  originalGoal: string;
  refinedGoal: IRefinedGoalResponse;
  createdAt: Date;
}

export interface IRefinementRequest {
  userGoal: string;
}

export enum GoalStatus {
  Idle = 'IDLE',
  Loading = 'LOADING',
  Success = 'SUCCESS',
  Error = 'ERROR'
}

export interface IGoalCoachState {
  status: GoalStatus;
  goalQuery: string;
  refinedGoal: IRefinedGoalResponse | null;
  errorMessage: string | null;
  savedGoals: IGlobalGoal[];
}
