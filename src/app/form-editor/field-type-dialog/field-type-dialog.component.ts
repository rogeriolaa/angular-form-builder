import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../material.module';

@Component({
  selector: 'app-field-type-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule],
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content>
      <mat-form-field appearance="outline">
        <mat-label>Field Type</mat-label>
        <mat-select [(ngModel)]="selectedType">
          <mat-option *ngFor="let type of data.fieldTypes" [value]="type.value">
            {{ type.label }}
          </mat-option>
        </mat-select>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button
        mat-raised-button
        color="primary"
        [disabled]="!selectedType"
        [mat-dialog-close]="{ type: selectedType }"
      >
        Add Field
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      mat-form-field {
        width: 100%;
      }
    `,
  ],
})
export class FieldTypeDialogComponent {
  selectedType: string = '';

  constructor(
    public dialogRef: MatDialogRef<FieldTypeDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      title: string;
      fieldTypes: { value: string; label: string }[];
    }
  ) {}
}
