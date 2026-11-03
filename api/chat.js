const MAX_MESSAGE_LENGTH = 4000;
const MODEL = process.env.GEMINI_MODEL || 'gemini-3.8-flash';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(503).json({ error: 'The AI companion has not been configured yet.' });

  const message = typeof req.body?.message === 'string' ? req.body.message.trim() : '';
  if (!message) return res.status(400).json({ error: 'Please enter a message.' });
  if (message.length > MAX_MESSAGE_LENGTH) return res.status(400).json({ error: 'Please keep messages under 4,000 characters.' });

  let history = req.body?.history ?? [];
  if (typeof history === 'string') {
    try { history = JSON.parse(history); } catch { history = []; }
  }
  if (!Array.isArray(history)) history = [];
  const contents = history.slice(-10).flatMap((item) => {
    if (!item || typeof item.text !== 'string') return [];
    const role = item.role === 'model' || item.role === 'assistant' ? 'model' : 'user';
    return [{ role, parts: [{ text: item.text.slice(0, MAX_MESSAGE_LENGTH) }] }];
  });
  contents.push({ role: 'user', parts: [{ text: message }] });

  try {
    const upstream = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/' + encodeURIComponent(MODEL) + ':generateContent?key=' + encodeURIComponent(apiKey),
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: 'You are RestartHER, a supportive and practical career re-entry companion. Help users identify transferable skills, explore realistic career paths, prepare for interviews, and plan manageable next steps. Be encouraging without making guarantees. Do not invent job openings, salaries, credentials, or facts. Ask a focused follow-up when needed.' }]
          },
          contents,
          generationConfig: { temperature: 0.7, maxOutputTokens: 700 }
        })
      }
    );
    const data = await upstream.json().catch(() => null);
    if (!upstream.ok) {
      console.error('Gemini request failed:', upstream.status, data?.error?.message || 'Unknown provider error');
      return res.status(502).json({ error: 'Gemini could not respond right now. Please try again.' });
    }
    const reply = data?.candidates?.[0]?.content?.parts
      ?.map((part) => typeof part.text === 'string' ? part.text : '')
      .join('')
      .trim();
    if (!reply) return res.status(502).json({ error: 'Gemini returned an empty response. Please try again.' });
    return res.status(200).json({ reply });
  } catch (error) {
    console.error('RestartHER Gemini function error:', error);
    return res.status(500).json({ error: 'The AI companion is temporarily unavailable.' });
  }
}
