import { Injectable, computed, signal } from '@angular/core';
import { FormDefinition } from '../shared/models/form-definition.model';
import { FormResponse } from '../shared/models/form-response.model';
import { FormStorageService } from './form-storage.service';

@Injectable({
  providedIn: 'root',
})
export class FormStateService {
  private forms = signal<FormDefinition[]>([]);
  private responses = signal<FormResponse[]>([]);

  public readonly formsList = computed(() => this.forms());
  public readonly responsesList = computed(() => this.responses());

  constructor(private formStorageService: FormStorageService) {
    this.loadForms();
    this.loadResponses();
  }

  public async loadForms() {
    try {
      const storedForms = await this.formStorageService.getAllForms();
      this.forms.set(storedForms);
    } catch (error) {
      console.error('Error loading forms:', error);
      this.forms.set([]);
    }
  }

  private async loadResponses() {
    const allForms = await this.formStorageService.getAllForms();
    const allResponses: FormResponse[] = [];

    for (const form of allForms) {
      if (form.id) {
        const responses = await this.formStorageService.getResponsesByFormId(
          form.id
        );
        allResponses.push(...responses);
      }
    }

    this.responses.set(allResponses);
  }

  async getFormById(id: number): Promise<FormDefinition | undefined> {
    const form = await this.formStorageService.getFormById(id);
    return form || undefined;
  }

  async getResponsesForForm(formId: number): Promise<FormResponse[]> {
    return this.formStorageService.getResponsesByFormId(formId);
  }

  async saveForm(form: FormDefinition): Promise<number> {
    const savedId = await this.formStorageService.saveForm(form);
    await this.loadForms(); // Refresh the forms list
    return savedId;
  }

  async saveResponse(response: FormResponse): Promise<number> {
    const savedId = await this.formStorageService.saveResponse(response);
    await this.loadResponses(); // Refresh the responses list
    return savedId;
  }

  async deleteForm(id: number): Promise<void> {
    await this.formStorageService.deleteForm(id);
    // Update the forms list signal after deletion
    const updatedForms = this.formsList().filter((form) => form.id !== id);
    this.forms.set(updatedForms);
  }

  async deleteResponse(id: number): Promise<void> {
    const updatedResponses = this.responses().filter((r) => r.id !== id);
    this.responses.set(updatedResponses);
    await this.loadResponses();
  }
}
