export interface CompanionReply { reply: string; }
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\\/$/, '');
const COMPANION_ACTION = API_BASE_URL + '/odata/v4/restart-her/chatWithCompanion';

export async function sendCompanionMessage(message: string): Promise<string> {
  const trimmed = message.trim();
  if (!trimmed) throw new Error('Please enter a message.');
  if (trimmed.length > 4000) throw new Error('Please keep messages under 4,000 characters.');
  const response = await fetch(COMPANION_ACTION, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ message: trimmed }),
  });
  const payload: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const errorMessage = typeof payload === 'object' && payload !== null && 'error' in payload &&
      typeof (payload as { error?: { message?: unknown } }).error?.message === 'string'
      ? (payload as { error: { message: string } }).error.message
      : 'The AI companion is temporarily unavailable. Please try again.';
    throw new Error(errorMessage);
  }
  if (typeof payload !== 'object' || payload === null || !('reply' in payload) ||
      typeof (payload as { reply?: unknown }).reply !== 'string') {
    throw new Error('The AI companion returned an unexpected response.');
  }
  return (payload as CompanionReply).reply;
}