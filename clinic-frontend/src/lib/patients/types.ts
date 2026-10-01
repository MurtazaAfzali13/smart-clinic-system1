export type PatientEnumOptions = {
  gender: string[];
  blood_type: string[];
  marital_status: string[];
  smoking_status: string[];
};

/** نام فیلد فرم -> مقدار رشته‌ای پیش‌فرض */
export type PatientDraft = Record<string, string>;

export type PatientFormState = {
  ok?: boolean;
  formError?: string;
  fieldErrors?: Record<string, string>;
  values?: Record<string, string>;
};