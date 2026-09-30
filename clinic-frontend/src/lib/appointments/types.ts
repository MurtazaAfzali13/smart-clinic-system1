export type BookingState = {
  success?: { startAt: string };
  /** کلید ترجمه */
  formError?: string;
  needsProfile?: boolean;
  fieldErrors?: Record<string, string>;
  values?: {
    isFirstVisit?: string;
    reason?: string;
    symptoms?: string;
    symptomDuration?: string;
    patientNotes?: string;
  };
};