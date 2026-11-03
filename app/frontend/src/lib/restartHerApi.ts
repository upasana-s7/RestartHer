export interface CompanionReply { reply: string; }
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');
const COMPANION_ACTION = API_BASE_URL
  ? API_BASE_URL + '/odata/v4/restart-her/chatWithCompanion'
  : '/api/chat';

export async function sendCompanionMessage(message: string, history: Array<{ role: 'user' | 'assistant'; text: string }> = [], mode: 'chat' | 'roadmap' = 'chat'): Promise<string> {
  const trimmed = message.trim();
  if (!trimmed) throw new Error('Please enter a message.');
  if (trimmed.length > 4000) throw new Error('Please keep messages under 4,000 characters.');
  const response = await fetch(COMPANION_ACTION, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      message: trimmed,
      mode,
      history: JSON.stringify(history.slice(-10).map((item) => ({ role: item.role === 'assistant' ? 'model' : 'user', text: item.text }))),
    }),
  });
  const payload: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const errorMessage = typeof payload === 'object' && payload !== null && 'error' in payload &&
      typeof (payload as { error?: unknown }).error === 'string'
      ? (payload as { error: string }).error
      : 'The AI companion is temporarily unavailable. Please try again.';
    throw new Error(errorMessage);
  }
  if (typeof payload !== 'object' || payload === null || !('reply' in payload) ||
      typeof (payload as { reply?: unknown }).reply !== 'string') {
    throw new Error('The AI companion returned an unexpected response.');
  }
  return (payload as CompanionReply).reply;
}
