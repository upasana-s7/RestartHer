export interface CompanionReply { reply: string; }
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');
const COMPANION_ACTION = API_BASE_URL
  ? API_BASE_URL + '/odata/v4/restart-her/chatWithCompanion'
  : '/api/chat';

export async function sendCompanionMessage(message: string, history: Array<{ role: 'user' | 'assistant'; text: string }> = [], mode: 'chat' | 'roadmap' = 'chat'): Promise<string> {
  const trimmed = message.trim();
  if (!trimmed) throw new Error('Please enter a message.');
  const maxLength = mode === 'roadmap' ? 12000 : 4000;
  if (trimmed.length > maxLength) throw new Error(mode === 'roadmap' ? 'Your roadmap request is too long. Please shorten the extra details and try again.' : 'Please keep messages under 4,000 characters.');
  let response: Response;
  try {
    response = await fetch(COMPANION_ACTION, {
      method: 'POST',
      signal: AbortSignal.timeout(mode === 'roadmap' ? 22000 : 15000),
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        message: trimmed,
        mode,
        history: JSON.stringify(history.slice(-8).map((item) => ({ role: item.role === 'assistant' ? 'model' : 'user', text: item.text }))),
      }),
    });
  } catch (cause) {
    if (cause instanceof Error && (cause.name === 'TimeoutError' || cause.name === 'AbortError')) {
      throw new Error(mode === 'roadmap' ? 'The AI service took too long to build your roadmap. Please try again.' : 'The AI is taking too long to respond. Please try again.');
    }
    throw new Error('Could not reach the AI service. Please check your connection and try again.');
  }
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
