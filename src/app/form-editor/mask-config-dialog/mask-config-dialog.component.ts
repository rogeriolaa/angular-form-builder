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
import { MatSelectModule } from '@angular/material/select';

interface MaskConfig {
  mask: string;
  placeholder: string;
}

@Component({
  selector: 'app-mask-config-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
  ],
  template: `
    <h2 mat-dialog-title>Mask Configuration</h2>
    <mat-dialog-content>
      <div class="config-form">
        <mat-form-field appearance="outline">
          <mat-label>Select Mask Type</mat-label>
          <mat-select
            [(ngModel)]="selectedMask"
            (selectionChange)="updateMask()"
          >
            <mat-option value="phone">(99) 99999-9999</mat-option>
            <mat-option value="cpf">999.999.999-99</mat-option>
            <mat-option value="date">99/99/9999</mat-option>
            <mat-option value="custom">Custom Mask</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" *ngIf="selectedMask === 'custom'">
          <mat-label>Custom Mask</mat-label>
          <input
            matInput
            [(ngModel)]="config.mask"
            placeholder="Ex: (99) 9999-9999"
          />
          <mat-hint
            >Use 9 for digits, A for letters, * for alphanumeric</mat-hint
          >
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
export class MaskConfigDialogComponent {
  config: MaskConfig;
  selectedMask: string = 'phone';

  constructor(
    private dialogRef: MatDialogRef<MaskConfigDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: MaskConfig
  ) {
    this.config = { ...data };
  }

  updateMask(): void {
    switch (this.selectedMask) {
      case 'phone':
        this.config.mask = '(00) 00000-0000';
        this.config.placeholder = '(99) 99999-9999';
        break;
      case 'cpf':
        this.config.mask = '000.000.000-00';
        this.config.placeholder = '999.999.999-99';
        break;
      case 'date':
        this.config.mask = '00/00/0000';
        this.config.placeholder = 'DD/MM/YYYY';
        break;
    }
  }

  save(): void {
    this.dialogRef.close(this.config);
  }
}
