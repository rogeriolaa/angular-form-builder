import { FieldConfig } from './field-config.model';
import { SelectOption } from './select-option.model';

export type FieldType =
  | 'text'
  | 'select'
  | 'checkbox'
  | 'number'
  | 'date'
  | 'masked';

export interface FormField {
  id: string;
  label: string;
  type: string;
  required: boolean;
  value?: any;
  options?: SelectOption[];
  parentField?: string;
  parentOption?: string;
  conditionalFields?: FormField[];
  config?: FieldConfig;
  mask?: string;
}

export { SelectOption } from './select-option.model';
