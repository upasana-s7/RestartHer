import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Minus, Send, Sparkles } from 'lucide-react';
import { sendCompanionMessage } from '../../lib/restartHerApi';

interface ChatMessage { id: number; role: 'assistant' | 'user'; text: string; }
interface AiCompanionProps { open: boolean; onClose: () => void; }
const GREETING = "Hi! I'm your RestartHER AI companion. I can help you explore career options, build skills and plan your next step. What would you like to talk about?";

export default function AiCompanion({ open, onClose }: AiCompanionProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([{ id: 0, role: 'assistant', text: GREETING }]);
  const [draft, setDraft] = useState('');
  const [thinking, setThinking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const nextId = useRef(1);
  const listRef = useRef<HTMLDivElement>(null);
  useEffect(() => { listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' }); }, [messages, thinking]);
  const send = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text || thinking) return;
    setMessages((current) => [...current, { id: nextId.current++, role: 'user', text }]);
    setDraft(''); setError(null); setThinking(true);
    try {
      const reply = await sendCompanionMessage(text);
      setMessages((current) => [...current, { id: nextId.current++, role: 'assistant', text: reply }]);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'The AI companion is temporarily unavailable.');
    } finally { setThinking(false); }
  };
  return (
    <section id="ai-companion" aria-label="RestartHER AI companion" aria-hidden={!open}
      className={'fixed bottom-24 left-4 right-4 z-40 flex max-h-[min(580px,70vh)] flex-col overflow-hidden rounded-2xl border border-burgundy/20 bg-cream-light shadow-panel transition-all duration-300 ease-out lg:left-80 lg:right-auto lg:w-[380px] ' + (open ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0')}>
      <header className="flex items-center justify-between gap-3 border-b border-burgundy/15 bg-burgundy px-5 py-4 text-cream">
        <div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-cream/15"><Sparkles className="h-4 w-4" aria-hidden="true" /></span><div><p className="font-label text-sm font-semibold">RestartHER AI</p><p className="text-[0.7rem] text-cream/80">Powered by Gemini</p></div></div>
        <button type="button" onClick={onClose} aria-label="Minimise AI companion" className="rounded-full p-2 transition-colors hover:bg-cream/15"><Minus className="h-4 w-4" /></button>
      </header>
      <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-5 py-5" aria-live="polite">
        {messages.map((message) => <div key={message.id} className={'flex ' + (message.role === 'user' ? 'justify-end' : 'justify-start')}><p className={'animate-rise max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-[1.5] ' + (message.role === 'user' ? 'rounded-br-sm bg-burgundy text-cream' : 'rounded-bl-sm border border-burgundy/15 bg-cream text-ink')}>{message.text}</p></div>)}
        {thinking && <div className="flex justify-start" aria-label="RestartHER AI is typing"><span className="rounded-2xl rounded-bl-sm border border-burgundy/15 bg-cream px-4 py-3 text-sm text-muted">Thinking…</span></div>}
        {error && <p role="alert" className="text-sm text-burgundy">{error}</p>}
      </div>
      <form onSubmit={send} className="flex items-center gap-2 border-t border-burgundy/15 bg-cream p-3">
        <label htmlFor="ai-draft" className="sr-only">Message RestartHER AI</label>
        <input id="ai-draft" value={draft} onChange={(event) => setDraft(event.target.value)} maxLength={4000} placeholder="Ask about your career or next step" className="min-w-0 flex-1 rounded-lg border border-burgundy/25 bg-cream-light px-4 py-2.5 text-sm text-ink placeholder:text-muted focus:border-burgundy focus:outline-none focus:ring-2 focus:ring-burgundy/20" />
        <button type="submit" disabled={!draft.trim() || thinking} aria-label="Send message" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-burgundy text-cream transition-all duration-200 hover:bg-burgundy-deep disabled:cursor-not-allowed disabled:opacity-40"><Send className="h-4 w-4" /></button>
      </form>
    </section>
  );
}