export function mapUrl(address: string): string {
  const query = encodeURIComponent(`${address}, Wrocław`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}
