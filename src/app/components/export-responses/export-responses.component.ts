import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormStorageService } from '../../services/form-storage.service';

@Component({
  selector: 'app-export-responses',
  template: `
    <button
      mat-raised-button
      color="primary"
      (click)="exportToCSV()"
      matTooltip="Export responses to CSV"
      class="export-button"
    >
      <mat-icon>download</mat-icon>
      Export CSV
    </button>
  `,
  styles: [
    `
      .export-button {
        margin: 8px;
      }
    `,
  ],
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatTooltipModule],
})
export class ExportResponsesComponent {
  @Input() formId!: number;

  constructor(private formStorage: FormStorageService) {}

  async exportToCSV() {
    const csv = await this.formStorage.exportResponsesToCSV(this.formId);
    if (!csv) {
      return;
    }

    // Create and trigger download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `form-responses-${this.formId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
