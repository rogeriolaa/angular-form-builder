export interface FormResponse {
  id?: number;
  formId: number;
  answers: { [key: string]: any };
  submittedAt: Date;
}
