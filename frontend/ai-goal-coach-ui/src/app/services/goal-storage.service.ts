/**
 * Goal Storage Service
 * Manages persistence of saved goals to local storage
 */

import { Injectable } from '@angular/core';
import { IGlobalGoal, IRefinedGoalResponse } from '../models/goal.models';

@Injectable({
  providedIn: 'root'
})
export class GoalStorageService {
  private readonly STORAGE_KEY = 'ai_goal_coach_goals';

  /**
   * Get all saved goals
   */
  getSavedGoals(): IGlobalGoal[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load saved goals:', error);
      return [];
    }
  }

  /**
   * Save a new goal
   */
  saveGoal(originalGoal: string, refinedGoal: IRefinedGoalResponse): IGlobalGoal {
    const goal: IGlobalGoal = {
      id: this.generateId(),
      originalGoal,
      refinedGoal,
      createdAt: new Date()
    };

    const goals = this.getSavedGoals();
    goals.unshift(goal); // Add to beginning
    this.persistGoals(goals);

    console.log('Goal saved:', goal.id);
    return goal;
  }

  /**
   * Delete a goal
   */
  deleteGoal(id: string): boolean {
    const goals = this.getSavedGoals();
    const filtered = goals.filter((g) => g.id !== id);

    if (filtered.length === goals.length) {
      console.warn('Goal not found for deletion:', id);
      return false;
    }

    this.persistGoals(filtered);
    console.log('Goal deleted:', id);
    return true;
  }

  // Private methods

  private persistGoals(goals: IGlobalGoal[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(goals));
    } catch (error) {
      console.error('Failed to save goals to storage:', error);
    }
  }

  private generateId(): string {
    return `goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
