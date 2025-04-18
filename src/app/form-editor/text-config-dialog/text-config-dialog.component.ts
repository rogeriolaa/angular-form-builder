import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

interface TextConfig {
  minLength?: number;
  maxLength?: number;
  placeholder?: string;
}

@Component({
  selector: 'app-text-config-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
  ],
  template: `
    <h2 mat-dialog-title>Text Field Configuration</h2>
    <mat-dialog-content>
      <div class="config-form">
        <mat-form-field appearance="outline">
          <mat-label>Minimum Length</mat-label>
          <input
            matInput
            type="number"
            [(ngModel)]="config.minLength"
            min="0"
          />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Maximum Length</mat-label>
          <input
            matInput
            type="number"
            [(ngModel)]="config.maxLength"
            min="0"
          />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Placeholder</mat-label>
          <input matInput [(ngModel)]="config.placeholder" />
        </mat-form-field>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-raised-button color="primary" (click)="save()">Save</button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      .config-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
        min-width: 300px;
        padding: 16px 0;
      }
    `,
  ],
})
export class TextConfigDialogComponent {
  config: TextConfig;

  constructor(
    private dialogRef: MatDialogRef<TextConfigDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: TextConfig
  ) {
    this.config = { ...data };
  }

  save(): void {
    this.dialogRef.close(this.config);
  }
}
