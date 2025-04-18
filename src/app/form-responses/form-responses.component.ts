import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { ActivatedRoute, Router } from '@angular/router';
import { ExportResponsesComponent } from '../components/export-responses/export-responses.component';
import { MaterialModule } from '../material.module';
import {
  FormDefinition,
  FormResponse,
  FormStorageService,
} from '../services/form-storage.service';

@Component({
  selector: 'app-form-responses',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    MatExpansionModule,
    ExportResponsesComponent,
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
          <div class="header-text">
            <h1>Form Responses</h1>
            <p class="header-subtitle" *ngIf="form">
              {{ form.name }}
              <span class="response-count" *ngIf="responses.length > 0">
                · {{ responses.length }}
                {{ responses.length === 1 ? 'response' : 'responses' }}
              </span>
            </p>
          </div>
        </div>
        <app-export-responses
          *ngIf="form?.id"
          [formId]="form?.id || 0"
          class="export-button"
        ></app-export-responses>
      </header>

      <div class="content-container">
        <mat-card
          class="form-card"
          *ngIf="form && responses.length > 0; else emptyOrLoading"
        >
          <mat-card-content>
            <div class="responses-list">
              <mat-accordion multi>
                <mat-expansion-panel
                  *ngFor="let response of responses; let i = index"
                  class="response-panel"
                >
                  <mat-expansion-panel-header class="panel-header">
                    <mat-panel-title>
                      <div class="panel-title-content">
                        <mat-icon class="response-icon">description</mat-icon>
                        <span>Response #{{ i + 1 }}</span>
                      </div>
                    </mat-panel-title>
                    <mat-panel-description>
                      <div class="submission-info">
                        <mat-icon class="time-icon">schedule</mat-icon>
                        {{ response.submittedAt | date : 'MMM d, y, h:mm a' }}
                      </div>
                    </mat-panel-description>
                  </mat-expansion-panel-header>

                  <div class="response-fields">
                    <div class="response-grid">
                      <div *ngFor="let field of form.fields" class="field-item">
                        <div class="field-label">{{ field.label }}</div>
                        <div
                          class="field-value"
                          [class.empty-value]="!response.answers[field.id]"
                        >
                          {{ response.answers[field.id] || '-' }}
                        </div>
                      </div>
                    </div>
                  </div>
                </mat-expansion-panel>
              </mat-accordion>
            </div>
          </mat-card-content>
        </mat-card>

        <ng-template #emptyOrLoading>
          <mat-card class="form-card">
            <mat-card-content>
              <div *ngIf="!form" class="loading-container">
                <mat-spinner diameter="48"></mat-spinner>
                <p>Loading responses...</p>
              </div>
              <div *ngIf="form && responses.length === 0" class="empty-state">
                <div class="empty-state-content">
                  <mat-icon class="empty-icon">inbox</mat-icon>
                  <h2>No Responses Yet</h2>
                  <p>
                    This form hasn't received any responses. Get started by
                    filling it out!
                  </p>
                  <button
                    mat-raised-button
                    color="primary"
                    (click)="fillForm()"
                  >
                    <mat-icon>add</mat-icon>
                    Submit First Response
                  </button>
                </div>
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
        padding: 32px;
        background: linear-gradient(135deg, #6200ee 0%, #3700b3 100%);
        border-radius: 16px;
        color: white;
        box-shadow: 0 4px 20px rgba(98, 0, 238, 0.2);
      }

      .header-content {
        flex: 1;
        display: flex;
        align-items: center;
        gap: 24px;
      }

      .header-text {
        display: flex;
        flex-direction: column;
        gap: 4px;
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
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .response-count {
        opacity: 0.8;
      }

      .back-button {
        color: white;
        background: rgba(255, 255, 255, 0.1);

        &:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      }

      .content-container {
        max-width: 1200px;
        margin: 0 auto;
      }

      .form-card {
        background: white;
        margin-bottom: 24px;
        border-radius: 16px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        overflow: hidden;
      }

      mat-card-content {
        padding: 24px;
      }

      .responses-list {
        mat-expansion-panel {
          margin-bottom: 16px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          border: 1px solid rgba(0, 0, 0, 0.05);

          &:last-child {
            margin-bottom: 0;
          }

          &.mat-expanded {
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          }
        }
      }

      .panel-header {
        height: 64px !important;
      }

      .panel-title-content {
        display: flex;
        align-items: center;
        gap: 12px;

        .response-icon {
          color: #6200ee;
          opacity: 0.8;
        }
      }

      .submission-info {
        display: flex;
        align-items: center;
        gap: 8px;
        color: rgba(0, 0, 0, 0.6);
        font-size: 0.9rem;

        .time-icon {
          font-size: 18px;
          height: 18px;
          width: 18px;
          opacity: 0.7;
        }
      }

      .response-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 24px;
        padding: 16px 0;
      }

      .field-item {
        background: #f8f9fa;
        padding: 16px;
        border-radius: 8px;
        transition: transform 0.2s, box-shadow 0.2s;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }
      }

      .field-label {
        font-size: 0.9rem;
        color: rgba(0, 0, 0, 0.6);
        margin-bottom: 8px;
        font-weight: 500;
      }

      .field-value {
        font-size: 1rem;
        color: rgba(0, 0, 0, 0.87);
        word-break: break-word;

        &.empty-value {
          color: rgba(0, 0, 0, 0.38);
          font-style: italic;
        }
      }

      .loading-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
        padding: 64px 24px;
        color: rgba(0, 0, 0, 0.6);
      }

      .empty-state {
        text-align: center;
        padding: 64px 24px;
      }

      .empty-state-content {
        max-width: 400px;
        margin: 0 auto;
      }

      .empty-icon {
        font-size: 64px;
        height: 64px;
        width: 64px;
        color: #6200ee;
        margin-bottom: 24px;
        opacity: 0.9;
      }

      .empty-state h2 {
        margin: 0 0 12px;
        font-size: 1.75rem;
        font-weight: 300;
        color: rgba(0, 0, 0, 0.87);
      }

      .empty-state p {
        margin: 0 0 32px;
        color: rgba(0, 0, 0, 0.6);
        font-size: 1.1rem;
        line-height: 1.5;
      }

      .empty-state button {
        padding: 0 32px;
        height: 48px;
        font-size: 1rem;

        mat-icon {
          margin-right: 8px;
        }
      }

      mat-divider {
        margin: 24px 0;
      }

      .export-button {
        margin-left: auto;
      }
    `,
  ],
})
export class FormResponsesComponent implements OnInit {
  form: FormDefinition | null = null;
  responses: FormResponse[] = [];
  displayedColumns: string[] = ['submittedAt'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formStorage: FormStorageService
  ) {}

  async ngOnInit() {
    const formId = Number(this.route.snapshot.paramMap.get('id'));
    if (!isNaN(formId)) {
      await this.loadData(formId);
    } else {
      this.router.navigate(['/']);
    }
  }

  private async loadData(formId: number) {
    this.form = await this.formStorage.getFormById(formId);
    if (!this.form) {
      this.router.navigate(['/']);
      return;
    }

    this.responses = await this.formStorage.getResponsesByFormId(formId);
    this.displayedColumns = [
      'submittedAt',
      ...this.form.fields.map((f: { id: string }) => f.id),
    ];
  }

  goBack() {
    this.router.navigate(['/']);
  }

  fillForm() {
    if (this.form?.id) {
      this.router.navigate(['/form/fill', this.form.id]);
    }
  }
}
