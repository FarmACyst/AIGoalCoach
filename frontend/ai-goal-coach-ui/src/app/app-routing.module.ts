import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GoalCoachComponent } from './components/goal-coach/goal-coach.component';

export const routes: Routes = [
  { path: '', redirectTo: '/goal-coach', pathMatch: 'full' },
  { path: 'goal-coach', component: GoalCoachComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
