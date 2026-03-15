import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IGlobalGoal } from '../../models/goal.models';

/**
 * Goal Details Modal Component
 * Displays complete details of a saved goal in a modal/popup
 */
@Component({
  selector: 'app-goal-details-modal',
  templateUrl: './goal-details-modal.component.html',
  styleUrls: ['./goal-details-modal.component.css']
})
export class GoalDetailsModalComponent {
  @Input() goal: IGlobalGoal | null = null;
  @Input() isOpen: boolean = false;
  @Output() onClose = new EventEmitter<void>();
  @Output() onDelete = new EventEmitter<string>();

  /**
   * Close the modal
   */
  closeModal(): void {
    this.onClose.emit();
  }

  /**
   * Handle backdrop click to close modal
   */
  onBackdropClick(): void {
    this.closeModal();
  }

  /**
   * Prevent event bubbling when clicking inside modal
   */
  onModalClick(event: MouseEvent): void {
    event.stopPropagation();
  }

  /**
   * Delete the goal and close modal
   */
  deleteGoal(): void {
    if (this.goal && confirm('Are you sure you want to delete this goal?')) {
      this.onDelete.emit(this.goal.id);
      this.closeModal();
    }
  }

  /**
   * Copy text to clipboard
   */
  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!');
    });
  }

  /**
   * Handle Escape key press
   */
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.closeModal();
    }
  }
}
