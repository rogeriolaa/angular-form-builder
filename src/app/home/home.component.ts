import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material.module';
import { FormStateService } from '../services/form-state.service';
import { ConfirmDialogComponent } from '../shared/components/confirm-dialog/confirm-dialog.component';
import { FormDefinition } from '../shared/models/form-definition.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MaterialModule, RouterModule],
  template: `
    <div class="container">
      <header class="header-section">
        <div class="header-content">
          <h1>Form Builder</h1>
          <p class="header-subtitle">
            Create, manage and collect responses to your forms
          </p>
        </div>
        <div class="action-bar">
          <button
            mat-raised-button
            color="primary"
            [routerLink]="['/form/new']"
            class="create-button"
          >
            <mat-icon>add</mat-icon>
            Create New Form
          </button>
        </div>
      </header>

      <mat-tab-group
        animationDuration="0ms"
        mat-stretch-tabs="false"
        mat-align-tabs="start"
      >
        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon class="tab-icon">description</mat-icon>
            All Forms
          </ng-template>

          <ng-container *ngIf="forms().length; else noForms">
            <div class="forms-list">
              <mat-card
                *ngFor="let form of forms()"
                class="form-card"
                appearance="outlined"
              >
                <mat-card-header>
                  <mat-card-title-group>
                    <mat-card-title>{{ form.name }}</mat-card-title>
                    <mat-card-subtitle>
                      Created: {{ form.createdAt | date : 'medium' }}
                    </mat-card-subtitle>
                    <mat-icon class="header-icon">description</mat-icon>
                  </mat-card-title-group>
                </mat-card-header>

                <mat-card-content *ngIf="getFormDescription(form)">
                  <p class="description">{{ getFormDescription(form) }}</p>
                </mat-card-content>

                <mat-divider></mat-divider>

                <mat-card-actions>
                  <button
                    mat-icon-button
                    color="primary"
                    [routerLink]="['/form/edit', form.id]"
                    matTooltip="Edit form"
                  >
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button
                    mat-icon-button
                    color="accent"
                    [routerLink]="['/form/fill', form.id]"
                    matTooltip="Fill out form"
                  >
                    <mat-icon>assignment</mat-icon>
                  </button>
                  <button
                    mat-icon-button
                    color="primary"
                    [routerLink]="['/form/responses', form.id]"
                    matTooltip="View responses"
                  >
                    <mat-icon>analytics</mat-icon>
                  </button>
                  <button
                    mat-icon-button
                    color="warn"
                    (click)="confirmDelete(form.id!, form.name)"
                    matTooltip="Delete form"
                  >
                    <mat-icon>delete</mat-icon>
                  </button>
                </mat-card-actions>
              </mat-card>
            </div>
          </ng-container>
        </mat-tab>
      </mat-tab-group>

      <ng-template #noForms>
        <div class="empty-state">
          <mat-icon class="empty-icon">note_add</mat-icon>
          <h2>No Forms Yet</h2>
          <p>Create your first form to get started!</p>
          <button
            mat-raised-button
            color="primary"
            [routerLink]="['/form/new']"
          >
            <mat-icon>add</mat-icon>
            Create New Form
          </button>
        </div>
      </ng-template>
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
      }

      .header-content {
        flex: 1;
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

      .create-button {
        padding: 0 24px;
        height: 48px;
        font-size: 1.1rem;
        background-color: white !important;
        color: #6200ee !important;
      }

      .forms-list {
        margin-top: 24px;
        display: grid;
        gap: 24px;
        grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      }

      .form-card {
        transition: transform 0.2s, box-shadow 0.2s;
        cursor: pointer;
        border: none;
        background-color: white;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
      }

      mat-card-header {
        padding: 16px;
      }

      .header-icon {
        color: #6200ee;
        font-size: 32px;
        height: 32px;
        width: 32px;
      }

      mat-card-content {
        padding: 0 16px;
      }

      .description {
        color: rgba(0, 0, 0, 0.6);
        margin: 8px 0;
      }

      mat-card-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        padding: 16px;
        justify-content: flex-start;
      }

      mat-icon {
        margin-right: 8px;
      }

      .tab-icon {
        margin-right: 8px;
        margin-bottom: 4px;
      }

      .empty-state {
        text-align: center;
        padding: 48px 24px;
        background-color: white;
        border-radius: 8px;
        margin-top: 24px;
      }

      .empty-icon {
        font-size: 64px;
        height: 64px;
        width: 64px;
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

      ::ng-deep {
        .mat-mdc-tab-header {
          margin-bottom: 16px;
        }
      }
    `,
  ],
})
export class HomeComponent {
  forms = this.formState.formsList;

  constructor(private formState: FormStateService, private dialog: MatDialog) {}

  getFormDescription(form: FormDefinition): string | undefined {
    return form.description;
  }

  async confirmDelete(id: number, formName: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Form',
        message: `Are you sure you want to delete "${formName}"? This action cannot be undone.`,
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        try {
          await this.formState.deleteForm(id);
          // Force refresh the forms list
          await this.formState.loadForms();
        } catch (error) {
          console.error('Error deleting form:', error);
        }
      }
    });
  }
}
