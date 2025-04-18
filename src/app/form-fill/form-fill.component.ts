import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { FormFieldComponent } from '../form-field/form-field.component';
import { MaterialModule } from '../material.module';
import { FormStateService } from '../services/form-state.service';
import { FormDefinition } from '../shared/models/form-definition.model';
import { FormField } from '../shared/models/form-field.model';

@Component({
  selector: 'app-form-fill',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormFieldComponent,
    MaterialModule,
  ],
  template: `
    <div class="container">
      <header class="header-section">
        <div class="header-content">
          <button
            mat-icon-button
            color="white"
            (click)="goBack()"
            class="back-button"
          >
            <mat-icon>arrow_back</mat-icon>
          </button>
          <h1>Fill Form</h1>
          <p class="header-subtitle" *ngIf="formDefinition">
            {{ formDefinition.name }}
          </p>
        </div>
      </header>

      <div class="content-container">
        <mat-card
          *ngIf="!loading; else loadingTpl"
          class="form-card"
          appearance="outlined"
        >
          <ng-container *ngIf="formDefinition; else noForm">
            <mat-card-content>
              <form [formGroup]="form" (ngSubmit)="onSubmit()">
                <div class="fields-container">
                  @for (field of getVisibleFields(); track field.id) {
                  <app-form-field
                    [field]="field"
                    [form]="form"
                    [mode]="'fill'"
                  ></app-form-field>
                  }
                </div>

                <mat-divider></mat-divider>

                <div class="form-actions">
                  <button mat-button type="button" (click)="goBack()">
                    Cancel
                  </button>
                  <button
                    mat-raised-button
                    color="primary"
                    type="submit"
                    [disabled]="!form.valid"
                  >
                    Submit Response
                  </button>
                </div>
              </form>
            </mat-card-content>
          </ng-container>
        </mat-card>

        <ng-template #loadingTpl>
          <mat-card class="form-card">
            <mat-card-content>
              <div class="loading-container">
                <mat-spinner diameter="48"></mat-spinner>
                <p>Loading form...</p>
              </div>
            </mat-card-content>
          </mat-card>
        </ng-template>

        <ng-template #noForm>
          <mat-card class="form-card">
            <mat-card-content>
              <div class="empty-state">
                <mat-icon class="empty-icon">error_outline</mat-icon>
                <h2>Form Not Found</h2>
                <p>
                  The form you're looking for doesn't exist or has been deleted.
                </p>
                <button mat-raised-button color="primary" (click)="goBack()">
                  Go Back to Home
                </button>
              </div>
            </mat-card-content>
          </mat-card>
        </ng-template>
      </div>
    </div>
  `,
  styles: [
    `
      .container {
        padding: 24px;
        width: 90%;
        max-width: 1200px;
        margin: 0 auto;
        min-height: 100vh;
        background-color: #fafafa;
      }

      .header-section {
        margin-bottom: 32px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 24px;
        padding: 24px;
        background: linear-gradient(135deg, #6200ee 0%, #3700b3 100%);
        border-radius: 8px;
        color: white;
        width: 100%;
      }

      .header-content {
        flex: 1;
        display: flex;
        align-items: center;
        gap: 16px;
      }

      .back-button {
        color: white;
      }

      h1 {
        margin: 0;
        font-size: 2.5rem;
        font-weight: 300;
        letter-spacing: -0.5px;
      }

      .header-subtitle {
        margin: 8px 0 0;
        font-size: 1.1rem;
        opacity: 0.9;
      }

      .content-container {
        max-width: 800px;
        margin: 0 auto;
        padding: 0;
      }

      .form-card {
        background: white;
        margin-bottom: 24px;
        border-radius: 8px;
        transition: transform 0.2s, box-shadow 0.2s;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
      }

      .fields-container {
        display: flex;
        flex-direction: column;
        gap: 16px;
        margin-bottom: 24px;
      }

      mat-card-content {
        padding: 24px;
      }

      .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        margin-top: 24px;
      }

      .loading-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
        padding: 48px 24px;
        color: rgba(0, 0, 0, 0.6);
      }

      .empty-state {
        text-align: center;
        padding: 48px 24px;
      }

      .empty-icon {
        font-size: 48px;
        height: 48px;
        width: 48px;
        color: #6200ee;
        margin-bottom: 16px;
      }

      .empty-state h2 {
        margin: 0 0 8px;
        font-size: 1.5rem;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.87);
      }

      .empty-state p {
        margin: 0 0 24px;
        color: rgba(0, 0, 0, 0.6);
      }

      mat-divider {
        margin: 24px -24px;
      }
    `,
  ],
})
export class FormFillComponent implements OnInit, OnDestroy {
  formDefinition?: FormDefinition;
  form: FormGroup;
  loading = true;
  private destroy$ = new Subject<void>();

  constructor(
    private formState: FormStateService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({});
  }

  async ngOnInit() {
    try {
      const formId = this.route.snapshot.paramMap.get('id');
      if (!formId) {
        this.loading = false;
        return;
      }

      this.formDefinition = await this.formState.getFormById(Number(formId));

      if (this.formDefinition) {
        this.initForm();
        this.setupConditionalFieldsSubscriptions();
      }
    } catch (error) {
      console.error('Error loading form:', error);
    } finally {
      this.loading = false;
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initForm() {
    if (!this.formDefinition) return;

    const group: { [key: string]: any } = {};
    this.formDefinition.fields.forEach((field) => {
      group[field.id] = [field.value ?? '', field.required ? ['required'] : []];
    });

    this.form = this.fb.group(group);
  }

  private setupConditionalFieldsSubscriptions() {
    if (!this.formDefinition) return;

    // Find all select fields that have conditional fields
    const selectFields = this.formDefinition.fields.filter(
      (field) =>
        field.type === 'select' &&
        field.options?.some((opt) => opt.conditionalFields?.length)
    );

    // Subscribe to changes in each select field
    selectFields.forEach((field) => {
      this.form
        .get(field.id)
        ?.valueChanges.pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          // Force template to re-evaluate visible fields
          this.form.updateValueAndValidity();
        });
    });
  }

  getVisibleFields(): FormField[] {
    if (!this.formDefinition) return [];

    return this.formDefinition.fields.filter((field) => {
      // If field has no parent, it's always visible
      if (!field.parentField) return true;

      // Get the parent field's current value
      const parentValue = this.form.get(field.parentField)?.value;

      // Field is visible if parent value matches its parentOption
      return field.parentOption === parentValue;
    });
  }

  async onSubmit() {
    if (this.form.valid && this.formDefinition?.id) {
      try {
        await this.formState.saveResponse({
          formId: this.formDefinition.id,
          answers: this.form.value,
          submittedAt: new Date(),
        });
        this.goBack();
      } catch (error) {
        console.error('Error saving form response:', error);
      }
    }
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
