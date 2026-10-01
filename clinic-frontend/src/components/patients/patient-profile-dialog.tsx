"use client";

import { useActionState, useEffect, type ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FieldError } from "@/components/auth/field-error";
import { useI18n } from "@/lib/i18n/i18n-provider";
import { savePatientProfileAction } from "@/lib/patients/actions";
import { optionLabel } from "@/lib/patients/labels";
import type { PatientDraft, PatientEnumOptions, PatientFormState } from "@/lib/patients/types";

const initialState: PatientFormState = {};

const selectClass =
  "border-input bg-background h-9 w-full rounded-md border px-3 text-sm shadow-xs outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="space-y-3">
      <legend className="mb-1 text-sm font-bold text-primary">{title}</legend>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}

export function PatientProfileDialog({
  open,
  onOpenChange,
  doctorSlug,
  initial,
  options,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  doctorSlug: string;
  initial: PatientDraft;
  options: PatientEnumOptions;
}) {
  const { locale, dir, t } = useI18n();
  const [state, formAction, pending] = useActionState(savePatientProfileAction, initialState);

  useEffect(() => {
    if (state.ok) onOpenChange(false);
  }, [state.ok, onOpenChange]);

  // بعد از خطا مقدارهای فرستاده‌شده برمی‌گردند؛ وگرنه پیش‌نویس سرور
  const val = (n: string) => state.values?.[n] ?? initial[n] ?? "";
  const err = (n: string) => (state.fieldErrors?.[n] ? t(state.fieldErrors[n]) : undefined);
  const label = (n: string) => t(`patientForm.fields.${n}`);

  const Field = ({
    name,
    required,
    wide,
    children,
  }: {
    name: string;
    required?: boolean;
    wide?: boolean;
    children: ReactNode;
  }) => (
    <div className={`space-y-1.5 ${wide ? "sm:col-span-2" : ""}`}>
      <Label htmlFor={`pf-${name}`}>
        {label(name)}
        {required && <span className="text-red-500"> *</span>}
      </Label>
      {children}
      <FieldError id={`pf-${name}-error`} message={err(name)} />
    </div>
  );

  const text = (
    name: string,
    o: { required?: boolean; type?: string; ltr?: boolean; wide?: boolean; inputMode?: "text" | "decimal" | "tel" } = {},
  ) => (
    <Field name={name} required={o.required} wide={o.wide}>
      <Input
        id={`pf-${name}`}
        name={name}
        type={o.type ?? "text"}
        inputMode={o.inputMode}
        dir={o.ltr ? "ltr" : undefined}
        defaultValue={val(name)}
        aria-invalid={!!err(name)}
        aria-describedby={`pf-${name}-error`}
      />
    </Field>
  );

  const select = (name: string, group: string, values: string[], required?: boolean) => (
    <Field name={name} required={required}>
      <select
        id={`pf-${name}`}
        name={name}
        defaultValue={val(name)}
        aria-invalid={!!err(name)}
        className={selectClass}
      >
        <option value="">—</option>
        {values.map((v) => (
          <option key={v} value={v}>
            {optionLabel(t, group, v)}
          </option>
        ))}
      </select>
    </Field>
  );

  const yesNo = (name: string) => (
    <Field name={name}>
      <select id={`pf-${name}`} name={name} defaultValue={val(name)} className={selectClass}>
        <option value="">—</option>
        <option value="yes">{t("patientForm.options.yesno.yes")}</option>
        <option value="no">{t("patientForm.options.yesno.no")}</option>
      </select>
    </Field>
  );

  const area = (name: string, rows = 2, hint?: string) => (
    <Field name={name} wide>
      <Textarea id={`pf-${name}`} name={name} rows={rows} defaultValue={val(name)} />
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </Field>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir={dir} className="max-h-[92vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t("patientForm.title")}</DialogTitle>
          <DialogDescription>{t("patientForm.subtitle")}</DialogDescription>
        </DialogHeader>

        <form action={formAction} className="space-y-7" noValidate>
          <input type="hidden" name="locale" value={locale} />
          <input type="hidden" name="doctorSlug" value={doctorSlug} />

          <Section title={t("patientForm.sections.identity")}>
            {text("firstName", { required: true })}
            {text("lastName", { required: true })}
            {text("fatherName")}
            {text("nationalId", { ltr: true })}
            {text("dateOfBirth", { required: true, type: "date", ltr: true })}
            {select("gender", "gender", options.gender, true)}
            {select("maritalStatus", "marital", options.marital_status)}
            {text("nationality")}
            {text("occupation")}
          </Section>

          <Section title={t("patientForm.sections.contact")}>
            {text("phone", { required: true, type: "tel", ltr: true, inputMode: "tel" })}
            {text("altPhone", { type: "tel", ltr: true, inputMode: "tel" })}
            {text("country")}
            {text("stateProvince")}
            {text("city", { required: true })}
            {text("postalCode", { ltr: true })}
            {text("addressLine", { required: true, wide: true })}
          </Section>

          <Section title={t("patientForm.sections.medical")}>
            {select("bloodType", "blood", options.blood_type)}
            {select("smokingStatus", "smoking", options.smoking_status)}
            {text("heightCm", { ltr: true, inputMode: "decimal" })}
            {text("weightKg", { ltr: true, inputMode: "decimal" })}
            {yesNo("usesAlcohol")}
            {yesNo("isPregnant")}
            {area("familyHistory")}
            {area("additionalNotes")}
          </Section>

          <Section title={t("patientForm.sections.history")}>
            {area("allergies", 2, t("patientForm.linesHint"))}
            {area("chronicConditions", 2, t("patientForm.linesHint"))}
            {area("medications", 2, t("patientForm.linesHint"))}
            {area("surgeries", 2, t("patientForm.linesHint"))}
          </Section>

          <Section title={t("patientForm.sections.emergency")}>
            {text("ecName")}
            {text("ecRelationship")}
            {text("ecPhone", { type: "tel", ltr: true, inputMode: "tel" })}
          </Section>

          <Section title={t("patientForm.sections.insurance")}>
            {text("insuranceProvider")}
            {text("insuranceNumber", { ltr: true })}
            {text("insuranceExpiry", { type: "date", ltr: true })}
          </Section>

          <div className="space-y-1.5">
            <label className="flex cursor-pointer items-start gap-3 text-sm">
              <input
                type="checkbox"
                name="consent"
                defaultChecked={val("consent") === "on"}
                className="mt-1 size-4 accent-[var(--primary)]"
              />
              <span>{t("patientForm.consent")}</span>
            </label>
            <FieldError id="pf-consent-error" message={err("consent")} />
          </div>

          {state.formError && (
            <p role="alert" className="rounded-xl bg-red-500/10 p-3 text-sm text-red-500">
              {t(state.formError)}
            </p>
          )}

          <div className="sticky bottom-0 -mx-6 bg-background/95 px-6 py-3 backdrop-blur">
            <button
              type="submit"
              disabled={pending}
              className="gradient-surface w-full rounded-full py-3 text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.01] disabled:opacity-50"
            >
              {pending ? t("patientForm.saving") : t("patientForm.submit")}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}