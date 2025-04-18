import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';
import { MaterialModule } from '../material.module';
import { FormField } from '../shared/models/form-field.model';

@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    NgxMaskDirective,
  ],
  templateUrl: './form-field.component.html',
  styleUrls: ['./form-field.component.scss'],
})
export class FormFieldComponent {
  @Input() field!: FormField;
  @Input() form!: FormGroup;
  @Input() mode: 'edit' | 'fill' = 'fill';
}
