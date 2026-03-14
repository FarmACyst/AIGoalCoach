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

  // NOTE: The endpoint below is a reasonable default. Update to match your backend.
  private readonly endpoint = '/api/refine';

  constructor(private http: HttpClient) {}

  refine(): void {
    const q = (this.query || '').trim();
    if (!q) {
      this.error = 'Please enter a goal or prompt to refine.';
      this.results = [];
      return;
    }

    this.loading = true;
    this.error = null;
    this.results = [];

    this.http.post<string[]>(this.endpoint, { input: q }).subscribe({
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
