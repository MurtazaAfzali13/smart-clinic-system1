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

export type DoctorActionState = { ok?: boolean; error?: string };

export type DoctorAppointment = {
  id: string;
  startAt: string;
  endAt: string;
  status: string;
  isFirstVisit: boolean;
  reason: string;
  symptoms: string | null;
  symptomDuration: string | null;
  patientNotes: string | null;
  feeAmount: number | null;
  feeCurrency: string | null;
  isFeePaid: boolean;
  feePaidAt: string | null;
  patient: {
    fullName: string;
    phone: string | null;
    age: number | null;
    gender: string | null;
    bloodType: string | null;
    city: string | null;
    allergies: string[];
    conditions: string[];
    medications: string[];
  } | null;
};