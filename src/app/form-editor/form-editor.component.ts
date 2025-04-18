import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { MaterialModule } from '../material.module';
import { FormStateService } from '../services/form-state.service';
import { FormDefinition } from '../shared/models/form-definition.model';
import { FormField } from '../shared/models/form-field.model';
import { FormResponse } from '../shared/models/form-response.model';
import { SelectOption } from '../shared/models/select-option.model';
import { CheckboxFieldComponent } from './field-components/checkbox-field/checkbox-field.component';
import { DateFieldComponent } from './field-components/date-field/date-field.component';
import { MaskedFieldComponent } from './field-components/masked-field/masked-field.component';
import { NumberFieldComponent } from './field-components/number-field/number-field.component';
import { SelectFieldComponent } from './field-components/select-field/select-field.component';
import { TextFieldComponent } from './field-components/text-field/text-field.component';
import { FieldTypeDialogComponent } from './field-type-dialog/field-type-dialog.component';
import { MaskConfigDialogComponent } from './mask-config-dialog/mask-config-dialog.component';
import { NumberConfigDialogComponent } from './number-config-dialog/number-config-dialog.component';
import { TextConfigDialogComponent } from './text-config-dialog/text-config-dialog.component';

@Component({
  selector: 'app-form-editor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    TextFieldComponent,
    NumberFieldComponent,
    SelectFieldComponent,
    CheckboxFieldComponent,
    DateFieldComponent,
    MaskedFieldComponent,
    MatMenuModule,
  ],
  templateUrl: './form-editor.component.html',
  styleUrls: ['./form-editor.component.scss'],
})
export class FormEditorComponent implements OnInit, OnDestroy {
  fields: FormField[] = [];
  isPreviewMode = false;
  formName = 'New Form';
  formId?: number;
  availableFieldTypes = [
    { value: 'text', label: 'Text' },
    { value: 'number', label: 'Number' },
    { value: 'select', label: 'Select' },
    { value: 'checkbox', label: 'Checkbox' },
    { value: 'date', label: 'Date' },
    { value: 'masked', label: 'Masked' },
  ];
  responses: FormResponse[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private dialog: MatDialog,
    private formState: FormStateService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    try {
      const formId = this.route.snapshot.paramMap.get('id');
      if (formId && formId !== 'new') {
        const form = await this.formState.getFormById(Number(formId));
        if (form) {
          this.formId = form.id;
          this.formName = form.name;
          this.fields = form.fields;
          if (typeof this.formId === 'number') {
            this.responses = await this.formState.getResponsesForForm(
              this.formId
            );
          }
        } else {
          this.router.navigate(['/']);
        }
      }
    } catch (error) {
      console.error('Error loading form:', error);
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  togglePreview(): void {
    if (this.isPreviewMode && !this.validateForm()) {
      return;
    }
    this.isPreviewMode = !this.isPreviewMode;
  }

  trackByIndex(index: number): number {
    return index;
  }

  addField(type: string): void {
    const newField: FormField = {
      id: this.generateId(),
      label: 'New Field',
      type: type as any,
      required: false,
      // Add id to the initial option
      options:
        type === 'select'
          ? [{ id: this.generateId(), value: '', label: '' }]
          : undefined,
    };
    this.fields.push(newField);
  }

  removeField(id: string): void {
    this.fields = this.fields.filter((field) => field.id !== id);
  }

  addOption(field: FormField): void {
    if (!field.options) field.options = [];
    // Add id when pushing a new option
    field.options.push({ id: this.generateId(), value: '', label: '' });
  }

  removeOption(field: FormField, index: number): void {
    if (field.options) {
      // Remove any conditional fields associated with this option
      const removedOption = field.options[index];
      if (removedOption.conditionalFields) {
        this.fields = this.fields.filter(
          (f) => !removedOption.conditionalFields?.includes(f.id)
        );
      }
      field.options.splice(index, 1);
    }
  }

  addConditionalField(parentField: FormField, option: SelectOption): void {
    const dialog = this.dialog.open(FieldTypeDialogComponent, {
      width: '400px',
      data: {
        title: 'Add Conditional Field',
        fieldTypes: this.availableFieldTypes,
      },
    });

    dialog.afterClosed().subscribe((result) => {
      if (result) {
        const newField: FormField = {
          id: this.generateId(),
          label: 'New Conditional Field',
          type: result.type,
          required: false,
          parentField: parentField.id,
          parentOption: option.value,
          options: result.type === 'select' ? [] : undefined,
        };
        this.fields.push(newField);
      }
    });
  }

  shouldShowField(field: FormField): boolean {
    if (!field.parentField || !field.parentOption) {
      return true;
    }

    const parentField = this.fields.find((f) => f.id === field.parentField);
    if (!parentField) {
      return false;
    }

    return this.isPreviewMode ? parentField.value === field.parentOption : true;
  }

  getParentOptionLabel(field: FormField): string {
    if (!field.parentField || !field.parentOption) {
      return '';
    }
    const parentField = this.fields.find((f) => f.id === field.parentField);
    if (!parentField || !parentField.options) {
      return '';
    }
    const parentOption = parentField.options.find(
      (o) => o.value === field.parentOption
    );
    return parentOption?.label || '';
  }

  onSelectChange(selectedValue: string, field: FormField): void {
    // Clear values of all conditional fields when parent selection changes
    this.fields
      .filter((f) => f.parentField === field.id)
      .forEach((f) => (f.value = undefined));
  }

  openNumberConfig(field: FormField): void {
    const dialogRef = this.dialog.open(NumberConfigDialogComponent, {
      data: {
        min: field.config?.min || 0,
        max: field.config?.max || 100,
        step: field.config?.step || 1,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (!field.config) field.config = {};
        Object.assign(field.config, result);
      }
    });
  }

  openMaskConfig(field: FormField): void {
    const dialogRef = this.dialog.open(MaskConfigDialogComponent, {
      data: {
        mask: field.mask || '(00) 00000-0000',
        placeholder: field.config?.placeholder || '(99) 99999-9999',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        field.mask = result.mask;
        if (!field.config) field.config = {};
        field.config.placeholder = result.placeholder;
      }
    });
  }

  openTextConfig(field: FormField): void {
    const dialogRef = this.dialog.open(TextConfigDialogComponent, {
      data: {
        minLength: field.config?.minLength,
        maxLength: field.config?.maxLength,
        placeholder: field.config?.placeholder,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (!field.config) field.config = {};
        Object.assign(field.config, result);
      }
    });
  }

  async saveForm(): Promise<void> {
    if (!this.formName.trim()) {
      this.dialog.open(TextConfigDialogComponent, {
        data: { message: 'Please enter a form name' },
      });
      return;
    }
    if (!this.fields.length) {
      this.dialog.open(TextConfigDialogComponent, {
        data: { message: 'Please add at least one field to the form' },
      });
      return;
    }
    try {
      const form: FormDefinition = {
        id: this.formId || undefined, // explicitly set undefined for new forms
        name: this.formName.trim(),
        fields: this.fields,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const savedId = await this.formState.saveForm(form);
      this.formId = savedId; // always update the form ID with the saved ID
      this.dialog.open(TextConfigDialogComponent, {
        data: { message: 'Form saved successfully!' },
      });
      await this.router.navigate(['/']);
    } catch (error) {
      console.error('Error saving form:', error);
      this.dialog.open(TextConfigDialogComponent, {
        data: { message: 'Error saving form. Please try again.' },
      });
    }
  }

  clearForm(): void {
    this.fields.forEach((field) => {
      field.value = undefined;
    });
  }

  validateForm(): boolean {
    if (!this.formName.trim()) {
      return false;
    }
    return !this.fields.some(
      (field) =>
        field.required &&
        (field.value === undefined ||
          field.value === null ||
          field.value === '' ||
          (Array.isArray(field.value) && field.value.length === 0))
    );
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  fieldHasResponses(fieldId: string): boolean {
    return this.responses.some(
      (resp) => resp.answers && resp.answers[fieldId] !== undefined
    );
  }

  editField(field: FormField) {
    // For now, just log the action
    console.log('Editing field:', field);
    // TODO: Implement field editing logic
  }

  deleteField(field: FormField) {
    if (
      confirm(`Are you sure you want to delete the field "${field.label}"?`)
    ) {
      const index = this.fields.indexOf(field);
      if (index !== -1) {
        this.fields.splice(index, 1);
      }
    }
  }
}
