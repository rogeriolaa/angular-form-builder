import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../../material.module';
import { FormField } from '../../../shared/models/form-field.model';

@Component({
  selector: 'app-date-field',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule],
  template: `
    <mat-form-field appearance="outline">
      <mat-label>{{ field.label }} {{ field.required ? '*' : '' }}</mat-label>
      <input
        matInput
        [matDatepicker]="picker"
        [(ngModel)]="field.value"
        [required]="field.required"
      />
      <mat-datepicker-toggle
        matIconSuffix
        [for]="picker"
      ></mat-datepicker-toggle>
      <mat-datepicker #picker></mat-datepicker>
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
export class DateFieldComponent {
  @Input() field!: FormField;
  @Input() preview = false;
}
