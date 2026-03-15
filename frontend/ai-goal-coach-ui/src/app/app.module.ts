import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GoalCoachComponent } from './components/goal-coach/goal-coach.component';
import { GoalDetailsModalComponent } from './components/goal-details-modal/goal-details-modal.component';
import { GoalRefinementService } from './services/goal-refinement.service';
import { GoalStorageService } from './services/goal-storage.service';

@NgModule({
  declarations: [AppComponent, GoalCoachComponent, GoalDetailsModalComponent],
  imports: [BrowserModule, CommonModule, AppRoutingModule, FormsModule, HttpClientModule],
  providers: [GoalRefinementService, GoalStorageService],
  bootstrap: [AppComponent]
})
export class AppModule {}
