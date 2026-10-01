export function optionLabel(
  t: (key: string) => string,
  group: string,
  value: string | null | undefined,
): string {
  if (!value) return "";
  const key = `patientForm.options.${group}.${value}`;
  const out = t(key);
  return out && out !== key ? out : value.replace(/_/g, " ");
}