import { FormField } from './form-field.model';

export interface FormDefinition {
  id?: number;
  name: string;
  description?: string;
  fields: FormField[];
  createdAt: Date;
  updatedAt: Date;
}
