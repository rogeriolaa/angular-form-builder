import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../../material.module';
import {
  FormField,
  SelectOption,
} from '../../../shared/models/form-field.model';

@Component({
  selector: 'app-select-field',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule],
  template: `
    <ng-container *ngIf="!preview">
      <mat-form-field appearance="outline">
        <mat-label>{{ field.label }} {{ field.required ? '*' : '' }}</mat-label>
        <mat-select [(ngModel)]="field.value" [required]="field.required">
          <mat-option
            *ngFor="let option of field.options"
            [value]="option.value"
          >
            {{ option.label }}
          </mat-option>
        </mat-select>
        <mat-error *ngIf="field.required && !field.value"
          >This field is required</mat-error
        >
      </mat-form-field>

      <div class="options-editor">
        <h4>Options</h4>
        <div
          *ngFor="let option of field.options; let i = index"
          class="option-row"
        >
          <mat-form-field appearance="outline" class="option-label">
            <mat-label>Option Label {{ i + 1 }}</mat-label>
            <input matInput [(ngModel)]="option.label" />
          </mat-form-field>
          <mat-form-field appearance="outline" class="option-value">
            <mat-label>Option Value {{ i + 1 }}</mat-label>
            <input matInput [(ngModel)]="option.value" />
          </mat-form-field>
          <button
            mat-icon-button
            color="primary"
            (click)="addConditionalField.emit(option)"
          >
            <mat-icon>add_circle</mat-icon>
          </button>
          <button mat-icon-button color="warn" (click)="removeOption.emit(i)">
            <mat-icon>delete</mat-icon>
          </button>
        </div>
        <button mat-stroked-button color="primary" (click)="addOption.emit()">
          <mat-icon>add</mat-icon> Add Option
        </button>
      </div>
    </ng-container>

    <ng-container *ngIf="preview">
      <mat-form-field appearance="outline">
        <mat-label>{{ field.label }} {{ field.required ? '*' : '' }}</mat-label>
        <mat-select
          [(ngModel)]="field.value"
          [required]="field.required"
          (selectionChange)="selectionChange.emit($event.value)"
        >
          <mat-option
            *ngFor="let option of field.options"
            [value]="option.value"
          >
            {{ option.label }}
          </mat-option>
        </mat-select>
        <mat-error *ngIf="field.required && !field.value"
          >This field is required</mat-error
        >
      </mat-form-field>
    </ng-container>
  `,
  styles: [
    `
      mat-form-field {
        width: 100%;
      }

      .options-editor {
        margin-top: 16px;
        padding: 16px;
        background-color: #f8f8f8;
        border-radius: 8px;
        border: 1px solid #eee;

        h4 {
          margin: 0 0 16px 0;
          color: #666;
          font-size: 14px;
          font-weight: 500;
        }

        .option-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;

          .option-label,
          .option-value {
            flex: 1;
          }

          button {
            margin-top: -20px;
          }
        }

        button[mat-stroked-button] {
          margin-top: 8px;
        }
      }
    `,
  ],
})
export class SelectFieldComponent {
  @Input() field!: FormField;
  @Input() preview = false;
  @Output() addOption = new EventEmitter<void>();
  @Output() removeOption = new EventEmitter<number>();
  @Output() addConditionalField = new EventEmitter<SelectOption>();
  @Output() selectionChange = new EventEmitter<string>();
}
