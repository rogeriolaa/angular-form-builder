import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../../material.module';
import { FormField } from '../../../shared/models/form-field.model';

@Component({
  selector: 'app-text-field',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule],
  template: `
    <mat-form-field appearance="outline">
      <mat-label>{{ field.label }} {{ field.required ? '*' : '' }}</mat-label>
      <input
        matInput
        type="text"
        [(ngModel)]="field.value"
        [placeholder]="field.config?.placeholder || field.label"
        [minlength]="field.config?.minLength ?? null"
        [maxlength]="field.config?.maxLength ?? null"
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
      <mat-hint *ngIf="field.config?.maxLength">
        {{ getValueLength() }}/{{ field.config?.maxLength }}
      </mat-hint>
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
export class TextFieldComponent {
  @Input() field!: FormField;
  @Input() preview = false;
  @Output() configureField = new EventEmitter<FormField>();

  getValueLength(): number {
    return (this.field.value as string)?.length || 0;
  }
}
