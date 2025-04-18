import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';
import { MaterialModule } from '../../../material.module';
import { FormField } from '../../../shared/models/form-field.model';

@Component({
  selector: 'app-masked-field',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule, NgxMaskDirective],
  template: `
    <mat-form-field appearance="outline">
      <mat-label>{{ field.label }} {{ field.required ? '*' : '' }}</mat-label>
      <input
        matInput
        [(ngModel)]="field.value"
        [mask]="field.mask || ''"
        [placeholder]="field.config?.placeholder || ''"
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
export class MaskedFieldComponent {
  @Input() field!: FormField;
  @Input() preview = false;
  @Output() configureField = new EventEmitter<FormField>();
}
