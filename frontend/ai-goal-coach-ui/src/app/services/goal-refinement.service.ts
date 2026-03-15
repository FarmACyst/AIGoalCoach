/**
 * Goal Refinement Service
 * Integrates with backend AI API to refine user goals
 * Validates responses against schema and handles errors gracefully
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, timeout, tap } from 'rxjs/operators';
import { IRefinedGoalResponse, IRefinementRequest } from '../models/goal.models';

@Injectable({
  providedIn: 'root'
})
export class GoalRefinementService {
  private readonly API_ENDPOINT = 'http://localhost:5099/api/goal/refine';
  private readonly REQUEST_TIMEOUT = 30000; // 30 seconds

  constructor(private httpClient: HttpClient) {}

  /**
   * Refine a user's vague goal into a structured SMART goal with key results
   * @param userGoal The user's input goal
   * @returns Observable of refined goal with key results and confidence score
   */
  refineGoal(userGoal: string): Observable<IRefinedGoalResponse> {
    const request: IRefinementRequest = { userGoal };

    return this.httpClient.post<IRefinedGoalResponse>(this.API_ENDPOINT, request).pipe(
      timeout(this.REQUEST_TIMEOUT),
      tap((response) => {
        this.validateResponse(response);
      }),
      catchError((error) => {
        return this.handleError(error);
      })
    );
  }

  // Private methods

  /**
   * Validate response against schema
   * Expected format:
   * {
   *   refinedGoal: string,
   *   keyResults: string[],
   *   confidenceScore: number (1-10)
   * }
   */
  private validateResponse(response: any): void {
    if (!response) {
      throw new Error('Empty response from AI service');
    }

    if (typeof response.refinedGoal !== 'string' || !response.refinedGoal.trim()) {
      throw new Error('Invalid refinedGoal: must be a non-empty string');
    }

    if (!Array.isArray(response.keyResults)) {
      throw new Error('Invalid keyResults: must be an array');
    }

    if (
      response.keyResults.length === 0 ||
      response.keyResults.length > 5 ||
      !response.keyResults.every((kr: any) => typeof kr === 'string' && kr.trim().length > 0)
    ) {
      throw new Error('Invalid keyResults: must contain 1-5 non-empty strings');
    }

    if (
      typeof response.confidenceScore !== 'number' ||
      response.confidenceScore < 1 ||
      response.confidenceScore > 10 ||
      !Number.isInteger(response.confidenceScore)
    ) {
      throw new Error('Invalid confidenceScore: must be an integer between 1 and 10');
    }
  }

  /**
   * Handle API errors gracefully
   */
  private handleError(error: any): Observable<never> {
    const errorMessage = this.getErrorMessage(error);
    return throwError(() => new Error(errorMessage));
  }

  /**
   * Get user-friendly error messages
   */
  private getErrorMessage(error: any): string {
    if (error.status === 0) {
      return 'Unable to connect to server. Please check your connection and try again.';
    }

    if (error.status === 400) {
      return error.error?.message || 'Invalid input. Please enter a valid goal and try again.';
    }

    if (error.status === 429) {
      return 'Too many requests. Please wait a moment and try again.';
    }

    if (error.status === 500 || error.status === 503) {
      return 'Server error. Please try again later.';
    }

    if (error.name === 'TimeoutError') {
      return 'Request timeout. The AI service is taking too long to respond. Please try again.';
    }

    if (error.message && error.message.includes('Invalid')) {
      return `Validation error: ${error.message}`;
    }

    return error.error?.message || 'An unexpected error occurred. Please try again.';
  }
}
