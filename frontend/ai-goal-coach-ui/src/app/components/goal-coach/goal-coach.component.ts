import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-goal-coach',
  templateUrl: './goal-coach.component.html',
  styleUrls: ['./goal-coach.component.css']
})
export class GoalCoachComponent {
  query: string = '';
  results: string[] = [];
  loading = false;
  error: string | null = null;

  private readonly endpoint = 'http://localhost:5099/api/goal/refine';

  constructor(private http: HttpClient) {}

  refine(): void {
    const userInput = (this.query || '').trim();
    if (!userInput) {
      this.error = 'Please enter a goal or prompt to refine.';
      this.results = [];
      return;
    }

    this.loading = true;
    this.error = null;
    this.results = [];

    this.http.post<string[]>(this.endpoint, { userGoal: userInput }).subscribe({
      next: (res) => {
        this.results = Array.isArray(res) ? res : [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Refine API error', err);
        this.error = err?.message || 'Failed to refine. Please try again.';
        this.loading = false;
      }
    });
  }

}
