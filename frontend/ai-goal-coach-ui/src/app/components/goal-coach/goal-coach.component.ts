import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GoalRefinementService } from '../../services/goal-refinement.service';
import { GoalStorageService } from '../../services/goal-storage.service';
import { IGoalCoachState, GoalStatus, IRefinedGoalResponse, IGlobalGoal } from '../../models/goal.models';

@Component({
  selector: 'app-goal-coach',
  templateUrl: './goal-coach.component.html',
  styleUrls: ['./goal-coach.component.css']
})
export class GoalCoachComponent implements OnInit, OnDestroy {
  // State management
  state: IGoalCoachState = {
    status: GoalStatus.Idle,
    goalQuery: '',
    refinedGoal: null,
    errorMessage: null,
    savedGoals: []
  };

  // Modal state
  selectedGoal: IGlobalGoal | null = null;
  isModalOpen: boolean = false;

  // UI state
  readonly GoalStatus = GoalStatus;
  private destroy$ = new Subject<void>();

  constructor(
    private goalRefinementService: GoalRefinementService,
    private goalStorageService: GoalStorageService
  ) {}

  ngOnInit(): void {
    this.initializeComponent();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Handles the refine button click
   */
  onRefineClick(): void {
    if (!this.validateInput()) {
      return;
    }

    this.refineGoal();
  }

  /**
   * Handles Enter key press in input
   */
  onInputKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !this.isLoading) {
      this.onRefineClick();
    }
  }

  /**
   * Saves the current refined goal
   */
  onSaveGoal(): void {
    if (!this.state.refinedGoal) {
      this.setError('No refined goal to save.');
      return;
    }

    try {
      this.goalStorageService.saveGoal(this.state.goalQuery, this.state.refinedGoal);
      this.loadSavedGoals();
      this.state = {
        ...this.state,
        goalQuery: '',
        refinedGoal: null,
        errorMessage: null,
        status: GoalStatus.Idle
      };
    } catch (error) {
      this.setError('Failed to save goal. Please try again.');
    }
  }

  /**
   * Clears the current query and results
   */
  onClear(): void {
    this.state = {
      ...this.state,
      goalQuery: '',
      refinedGoal: null,
      errorMessage: null,
      status: GoalStatus.Idle
    };
  }

  /**
   * Deletes a saved goal
   */
  onDeleteGoal(goalId: string): void {
    if (confirm('Are you sure you want to delete this goal?')) {
      this.goalStorageService.deleteGoal(goalId);
      this.loadSavedGoals();
    }
  }

  /**
   * Open the goal details modal
   */
  onViewGoalDetails(goal: IGlobalGoal): void {
    this.selectedGoal = goal;
    this.isModalOpen = true;
  }

  /**
   * Close the goal details modal
   */
  onCloseModal(): void {
    this.isModalOpen = false;
    this.selectedGoal = null;
  }

  /**
   * Delete goal from modal and close
   */
  onDeleteGoalFromModal(goalId: string): void {
    this.goalStorageService.deleteGoal(goalId);
    this.loadSavedGoals();
    this.onCloseModal();
  }

  // Private methods

  private initializeComponent(): void {
    this.loadSavedGoals();
  }

  private loadSavedGoals(): void {
    this.state = {
      ...this.state,
      savedGoals: this.goalStorageService.getSavedGoals()
    };
  }

  private validateInput(): boolean {
    const trimmedQuery = this.state.goalQuery.trim();

    if (!trimmedQuery) {
      this.setError('Please enter a goal or prompt to refine.');
      return false;
    }

    if (trimmedQuery.length < 3) {
      this.setError('Goal must be at least 3 characters long.');
      return false;
    }

    if (trimmedQuery.length > 500) {
      this.setError('Goal must not exceed 500 characters.');
      return false;
    }

    return true;
  }

  private refineGoal(): void {
    this.state = {
      ...this.state,
      status: GoalStatus.Loading,
      errorMessage: null,
      refinedGoal: null
    };

    this.goalRefinementService
      .refineGoal(this.state.goalQuery.trim())
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => this.handleSuccess(response),
        error: (error) => this.handleError(error)
      });
  }

  private handleSuccess(refinedGoal: IRefinedGoalResponse): void {
    this.state = {
      ...this.state,
      status: GoalStatus.Success,
      refinedGoal,
      errorMessage: null
    };
  }

  private handleError(error: Error): void {
    this.setError(error.message);
  }

  private setError(message: string): void {
    this.state = {
      ...this.state,
      status: GoalStatus.Error,
      errorMessage: message,
      refinedGoal: null
    };
  }

  // Getters for template

  get isLoading(): boolean {
    return this.state.status === GoalStatus.Loading;
  }

  get hasError(): boolean {
    return this.state.status === GoalStatus.Error;
  }

  get hasResults(): boolean {
    return this.state.refinedGoal !== null;
  }

  get refineButtonLabel(): string {
    return this.isLoading ? 'Refining...' : 'Refine';
  }

  get confidenceLevel(): string {
    if (!this.state.refinedGoal) return '';
    const score = this.state.refinedGoal.confidenceScore;
    if (score >= 8) return '🟢 High Confidence';
    if (score >= 5) return '🟡 Medium Confidence';
    return '🔴 Low Confidence';
  }
}
