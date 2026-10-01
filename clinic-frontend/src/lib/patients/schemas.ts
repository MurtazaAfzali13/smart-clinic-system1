import { z } from "zod";

export const PATIENT_FIELDS = [
  "firstName", "lastName", "fatherName", "nationalId", "dateOfBirth", "gender",
  "maritalStatus", "nationality", "occupation",
  "phone", "altPhone", "country", "stateProvince", "city", "addressLine", "postalCode",
  "bloodType", "heightCm", "weightKg", "smokingStatus", "usesAlcohol", "isPregnant",
  "familyHistory", "additionalNotes",
  "allergies", "chronicConditions", "medications", "surgeries",
  "ecName", "ecRelationship", "ecPhone",
  "insuranceProvider", "insuranceNumber", "insuranceExpiry",
  "consent",
] as const;
export type PatientField = (typeof PATIENT_FIELDS)[number];

/** این فیلدها ممکن است با ارقام فارسی/عربی تایپ شوند */
export const DIGIT_FIELDS: PatientField[] = [
  "nationalId", "phone", "altPhone", "postalCode", "heightCm", "weightKg",
  "ecPhone", "insuranceNumber",
];

export const toAsciiDigits = (s: string) =>
  s
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)))
    .replace(/٫/g, ".");

const req = (max = 100) =>
  z.string().trim().min(1, "patientForm.errors.required").max(max, "patientForm.errors.tooLong");
const opt = (max = 100) => z.string().trim().max(max, "patientForm.errors.tooLong");
const optNum = (min: number, max: number) =>
  z
    .string()
    .trim()
    .refine(
      (v) => v === "" || (Number.isFinite(Number(v)) && Number(v) >= min && Number(v) <= max),
      "patientForm.errors.invalidNumber",
    );
const PHONE = /^[+0-9()\s-]{6,30}$/;
const yn = z.enum(["", "yes", "no"]);

export const patientSchema = z
  .object({
    firstName: req(),
    lastName: req(),
    fatherName: opt(),
    nationalId: opt(40),
    dateOfBirth: z
      .string()
      .trim()
      .refine((v) => {
        const t = Date.parse(v);
        return !Number.isNaN(t) && t <= Date.now() && t >= Date.parse("1900-01-01");
      }, "patientForm.errors.invalidDate"),
    gender: req(30),
    maritalStatus: opt(50),
    nationality: opt(),
    occupation: opt(),

    phone: z.string().trim().refine((v) => PHONE.test(v), "patientForm.errors.invalidPhone"),
    altPhone: z.string().trim().refine((v) => v === "" || PHONE.test(v), "patientForm.errors.invalidPhone"),
    country: opt(),
    stateProvince: opt(),
    city: req(),
    addressLine: req(300),
    postalCode: opt(20),

    bloodType: opt(20),
    heightCm: optNum(30, 272),
    weightKg: optNum(1, 500),
    smokingStatus: opt(50),
    usesAlcohol: yn,
    isPregnant: yn,
    familyHistory: opt(1000),
    additionalNotes: opt(1000),

    allergies: opt(3000),
    chronicConditions: opt(3000),
    medications: opt(3000),
    surgeries: opt(3000),

    ecName: opt(),
    ecRelationship: opt(),
    ecPhone: z.string().trim().refine((v) => v === "" || PHONE.test(v), "patientForm.errors.invalidPhone"),

    insuranceProvider: opt(),
    insuranceNumber: opt(),
    insuranceExpiry: z
      .string()
      .trim()
      .refine((v) => v === "" || !Number.isNaN(Date.parse(v)), "patientForm.errors.invalidDate"),

    consent: z.string().refine((v) => v === "on", "patientForm.errors.consentRequired"),
  })
  .superRefine((d, ctx) => {
    if (d.ecName || d.ecRelationship || d.ecPhone) {
      for (const k of ["ecName", "ecRelationship", "ecPhone"] as const) {
        if (!d[k]) {
          ctx.addIssue({ code: "custom", path: [k], message: "patientForm.errors.emergencyIncomplete" });
        }
      }
    }
  });