export function formatPhoneDisplay(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  const withoutCountryCode = digits.startsWith("48") ? digits.slice(2) : digits;
  const groups = withoutCountryCode.match(/.{1,3}/g) ?? [];
  return `+48 ${groups.join(" ")}`;
}

export function formatPhoneHref(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  const withCountryCode = digits.startsWith("48") ? digits : `48${digits}`;
  return `+${withCountryCode}`;
}
