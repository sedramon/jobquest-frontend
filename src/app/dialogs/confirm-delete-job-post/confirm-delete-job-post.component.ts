import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../app.material.module';

@Component({
  selector: 'app-confirm-delete-job-post',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './confirm-delete-job-post.component.html',
  styleUrl: './confirm-delete-job-post.component.scss'
})
export class ConfirmDeleteJobPostComponent {
  constructor(public dialogRef: MatDialogRef<ConfirmDeleteJobPostComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string }
  ) {}

  confirmDelete(): void {
    this.dialogRef.close(true); // Close the dialog and return true
  }

  cancel(): void {
    this.dialogRef.close(false); // Close the dialog and return false
  }
}
