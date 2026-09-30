import { z } from "zod";

export const bookingSchema = z.object({
  doctorId: z.string().uuid("booking.errors.generic"),
  startAt: z
    .string()
    .refine((v) => !Number.isNaN(Date.parse(v)), "booking.errors.slotRequired"),
  isFirstVisit: z.string().transform((v) => v !== "false"),
  reason: z
    .string()
    .trim()
    .min(3, "booking.errors.reasonShort")
    .max(500, "booking.errors.reasonLong"),
  symptoms: z.string().trim().max(1000, "booking.errors.textLong"),
  symptomDuration: z.string().trim().max(100, "booking.errors.textLong"),
  patientNotes: z.string().trim().max(1000, "booking.errors.textLong"),
});