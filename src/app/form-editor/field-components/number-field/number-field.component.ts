import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../../material.module';
import { FormField } from '../../../shared/models/form-field.model';

@Component({
  selector: 'app-number-field',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule],
  template: `
    <mat-form-field appearance="outline">
      <mat-label>{{ field.label }} {{ field.required ? '*' : '' }}</mat-label>
      <input
        matInput
        type="number"
        [(ngModel)]="field.value"
        [min]="field.config?.min ?? null"
        [max]="field.config?.max ?? null"
        [step]="field.config?.step"
        [required]="field.required"
      />
      <button
        *ngIf="!preview"
        mat-icon-button
        matSuffix
        (click)="configureField.emit(field)"
      >
        <mat-icon>settings</mat-icon>
      </button>
      <mat-error *ngIf="field.required && !field.value"
        >This field is required</mat-error
      >
    </mat-form-field>
  `,
  styles: [
    `
      mat-form-field {
        width: 100%;
      }
    `,
  ],
})
export class NumberFieldComponent {
  @Input() field!: FormField;
  @Input() preview = false;
  @Output() configureField = new EventEmitter<FormField>();
}
