export interface SelectOption {
  id: string;
  value: string;
  label: string;
  conditionalFields?: string[]; // Store field IDs instead of FormField objects
}
