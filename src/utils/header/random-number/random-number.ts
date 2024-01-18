export function extractClientId(data: any | null): string {
  return data['clientId'] || Math.random().toString(36).substring(7);
}
