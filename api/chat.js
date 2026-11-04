const CHAT_MAX_MESSAGE_LENGTH = 4000;
const ROADMAP_MAX_MESSAGE_LENGTH = 12000;
const CHAT_MODEL = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite';
const ROADMAP_MODEL = process.env.GEMINI_ROADMAP_MODEL || 'gemini-3.5-flash-lite';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(503).json({ error: 'The AI companion has not been configured yet.' });

  const isRoadmapRequest = req.body?.mode === 'roadmap';
  const maxMessageLength = isRoadmapRequest ? ROADMAP_MAX_MESSAGE_LENGTH : CHAT_MAX_MESSAGE_LENGTH;
  const message = typeof req.body?.message === 'string' ? req.body.message.trim() : '';
  if (!message) return res.status(400).json({ error: 'Please enter a message.' });
  if (message.length > maxMessageLength) return res.status(400).json({ error: isRoadmapRequest ? 'Your roadmap request is too long. Please shorten the extra details and try again.' : 'Please keep messages under 4,000 characters.' });

  let history = req.body?.history ?? [];
  if (typeof history === 'string') {
    try { history = JSON.parse(history); } catch { history = []; }
  }
  if (!Array.isArray(history)) history = [];
  const contents = history.slice(-8).flatMap((item) => {
    if (!item || typeof item.text !== 'string') return [];
    const role = item.role === 'model' || item.role === 'assistant' ? 'model' : 'user';
    return [{ role, parts: [{ text: item.text.slice(0, CHAT_MAX_MESSAGE_LENGTH) }] }];
  });
  contents.push({ role: 'user', parts: [{ text: message }] });

  const model = isRoadmapRequest ? ROADMAP_MODEL : CHAT_MODEL;
  const requestBody = {
    systemInstruction: {
      parts: [{
        text: isRoadmapRequest
          ? 'You are RestartHER, a practical career learning planner. Follow the supplied assessment and return concise, realistic, supportive guidance. Do not invent courses, certificates, jobs, salaries, or guarantees.'
          : 'You are RestartHER, a supportive, practical career re-entry companion. Give concise, useful answers and manageable next steps. Do not invent job openings, salaries, credentials, course links, or facts.'
      }]
    },
    contents,
    generationConfig: {
      temperature: isRoadmapRequest ? 0.2 : 0.5,
      maxOutputTokens: isRoadmapRequest ? 2400 : 350,
      ...(isRoadmapRequest ? { responseMimeType: 'application/json' } : {})
    }
  };

  try {
    const upstream = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/' + encodeURIComponent(model) + ':generateContent?key=' + encodeURIComponent(apiKey),
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
        signal: AbortSignal.timeout(isRoadmapRequest ? 20000 : 13000)
      }
    );
    const data = await upstream.json().catch(() => null);

    if (!upstream?.ok) {
      const status = upstream?.status;
      console.error('Gemini request failed:', status || 'network error', data?.error?.message || 'Unknown provider error');
      if (status === 429 || status === 503) {
        return res.status(503).json({ error: 'The AI service is busy right now. Please try again shortly.' });
      }
      return res.status(502).json({ error: 'The AI could not complete that response. Please try again.' });
    }

    const reply = data?.candidates?.[0]?.content?.parts
      ?.map((part) => typeof part.text === 'string' ? part.text : '')
      .join('')
      .trim();
    if (!reply) return res.status(502).json({ error: 'The AI returned an empty response. Please try again.' });
    return res.status(200).json({ reply });
  } catch (error) {
    if (error?.name === 'TimeoutError' || error?.name === 'AbortError') {
      console.error('Gemini request timed out:', model);
      return res.status(504).json({ error: 'The AI service took too long to respond. Please try again.' });
    }
    console.error('RestartHER Gemini function error:', error);
    return res.status(500).json({ error: 'The AI companion is temporarily unavailable. Please try again.' });
  }
}
