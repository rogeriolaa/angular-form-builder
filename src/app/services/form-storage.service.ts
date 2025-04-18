import { Injectable } from '@angular/core';
import { FormDefinition } from '../shared/models/form-definition.model';
import { FormResponse } from '../shared/models/form-response.model';

export { FormDefinition } from '../shared/models/form-definition.model';
export { FormResponse } from '../shared/models/form-response.model';

@Injectable({
  providedIn: 'root',
})
export class FormStorageService {
  private readonly DB_NAME = 'FormBuilderDB';
  private readonly DB_VERSION = 1;
  private db: IDBDatabase | null = null;

  constructor() {
    this.initDatabase();
  }

  private initDatabase(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create forms store
        if (!db.objectStoreNames.contains('forms')) {
          const formStore = db.createObjectStore('forms', {
            keyPath: 'id',
            autoIncrement: true,
          });
          formStore.createIndex('name', 'name', { unique: false });
          formStore.createIndex('createdAt', 'createdAt', { unique: false });
        }

        // Create responses store
        if (!db.objectStoreNames.contains('responses')) {
          const responseStore = db.createObjectStore('responses', {
            keyPath: 'id',
            autoIncrement: true,
          });
          responseStore.createIndex('formId', 'formId', { unique: false });
          responseStore.createIndex('submittedAt', 'submittedAt', {
            unique: false,
          });
        }
      };
    });
  }

  async saveForm(form: FormDefinition): Promise<number> {
    await this.ensureDbConnection();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction('forms', 'readwrite');
      const store = transaction.objectStore('forms');

      // Remove id if it's undefined (new form case)
      const formToSave = { ...form };
      if (formToSave.id === undefined) {
        delete formToSave.id;
      }

      const request = store.put({
        ...formToSave,
        updatedAt: new Date(),
        createdAt: form.createdAt || new Date(),
      });

      request.onsuccess = () => resolve(request.result as number);
      request.onerror = () => reject(request.error);
    });
  }

  async getAllForms(): Promise<FormDefinition[]> {
    await this.ensureDbConnection();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction('forms', 'readonly');
      const store = transaction.objectStore('forms');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getFormById(id: number): Promise<FormDefinition | null> {
    await this.ensureDbConnection();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction('forms', 'readonly');
      const store = transaction.objectStore('forms');
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async saveResponse(response: FormResponse): Promise<number> {
    await this.ensureDbConnection();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction('responses', 'readwrite');
      const store = transaction.objectStore('responses');

      const request = store.put({
        ...response,
        submittedAt: new Date(),
      });

      request.onsuccess = () => resolve(request.result as number);
      request.onerror = () => reject(request.error);
    });
  }

  async getResponsesByFormId(formId: number): Promise<FormResponse[]> {
    await this.ensureDbConnection();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction('responses', 'readonly');
      const store = transaction.objectStore('responses');
      const index = store.index('formId');
      const request = index.getAll(formId);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async deleteForm(id: number): Promise<void> {
    await this.ensureDbConnection();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(
        ['forms', 'responses'],
        'readwrite'
      );

      // Delete the form
      const formStore = transaction.objectStore('forms');
      const deleteFormRequest = formStore.delete(id);

      // Delete associated responses
      const responseStore = transaction.objectStore('responses');
      const index = responseStore.index('formId');
      const getResponsesRequest = index.getAll(id);

      getResponsesRequest.onsuccess = () => {
        const responses = getResponsesRequest.result;
        responses.forEach((response: FormResponse) => {
          responseStore.delete(response.id!);
        });
      };

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async exportResponsesToCSV(formId: number): Promise<string> {
    const form = await this.getFormById(formId);
    const responses = await this.getResponsesByFormId(formId);

    if (!form || !responses.length) {
      return '';
    }

    // Create headers from form fields
    const headers = form.fields.map((field) => field.label || field.id);

    // Convert responses to CSV rows
    const rows = responses.map((response) => {
      return form.fields.map((field) => {
        const value = response.answers[field.id] || '';
        // Escape quotes and wrap in quotes if contains comma
        return value.toString().includes(',')
          ? `"${value.replace(/"/g, '""')}"`
          : value;
      });
    });

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.join(',')),
    ].join('\n');

    return csvContent;
  }

  private async ensureDbConnection(): Promise<void> {
    if (!this.db) {
      await this.initDatabase();
    }
  }
}
