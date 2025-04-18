import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../../material.module';
import { FormField } from '../../../shared/models/form-field.model';

@Component({
  selector: 'app-checkbox-field',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule],
  template: `
    <div class="checkbox-container" [class.required]="field.required">
      <mat-checkbox
        color="primary"
        [(ngModel)]="field.value"
        [required]="field.required"
      >
        {{ field.label }} {{ field.required ? '*' : '' }}
      </mat-checkbox>
      <mat-error
        *ngIf="field.required && field.value === false"
        class="checkbox-error"
      >
        This field is required
      </mat-error>
    </div>
  `,
  styles: [
    `
      .checkbox-container {
        margin: 8px 0;
        display: block;

        &.required mat-checkbox {
          color: rgba(0, 0, 0, 0.87);
        }

        .checkbox-error {
          margin-top: 4px;
          font-size: 12px;
        }
      }
    `,
  ],
})
export class CheckboxFieldComponent {
  @Input() field!: FormField;
  @Input() preview = false;
}
