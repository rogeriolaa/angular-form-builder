import { FieldConfig } from './field-config.model';
import { SelectOption } from './select-option.model';

export type FieldType =
  | 'text'
  | 'select'
  | 'checkbox'
  | 'number'
  | 'date'
  | 'masked';

export type FieldWidth = '25' | '50' | '75' | '100';

export interface FormField {
  id: string;
  label: string;
  type: string;
  required: boolean;
  width?: FieldWidth;
  value?: any;
  options?: SelectOption[];
  parentField?: string;
  parentOption?: string;
  conditionalFields?: FormField[];
  config?: FieldConfig;
  mask?: string;
}

export { SelectOption } from './select-option.model';
