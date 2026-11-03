const CHAT_MAX_MESSAGE_LENGTH = 4000;
const ROADMAP_MAX_MESSAGE_LENGTH = 12000;
const CHAT_MODEL = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
const ROADMAP_MODEL = process.env.GEMINI_ROADMAP_MODEL || 'gemini-3.5-flash-lite';

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

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
  const contents = history.slice(-8).flatMap((item) => {
    if (!item || typeof item.text !== 'string') return [];
    const role = item.role === 'model' || item.role === 'assistant' ? 'model' : 'user';
    return [{ role, parts: [{ text: item.text.slice(0, MAX_MESSAGE_LENGTH) }] }];
  });
  contents.push({ role: 'user', parts: [{ text: message }] });

  const isRoadmapRequest = req.body?.mode === 'roadmap';
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
      maxOutputTokens: isRoadmapRequest ? 2600 : 500,
      ...(isRoadmapRequest ? { responseMimeType: 'application/json' } : {})
    }
  };

  try {
    let upstream;
    let data;
    const maxAttempts = isRoadmapRequest ? 2 : 2;

    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      try {
        upstream = await fetch(
          'https://generativelanguage.googleapis.com/v1beta/models/' + encodeURIComponent(model) + ':generateContent?key=' + encodeURIComponent(apiKey),
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
            signal: AbortSignal.timeout(isRoadmapRequest ? 25000 : 18000)
          }
        );
        data = await upstream.json().catch(() => null);
        if (upstream.ok) break;

        const retryable = [429, 500, 502, 503, 504].includes(upstream.status);
        if (!retryable || attempt === maxAttempts - 1) break;
        console.warn(`Gemini returned ${upstream.status}; retrying once with ${model}.`);
      } catch (requestError) {
        if (requestError?.name === 'TimeoutError' || requestError?.name === 'AbortError') throw requestError;
        if (attempt === maxAttempts - 1) throw requestError;
        console.warn('Gemini network request failed; retrying once.');
      }
      await wait(300);
    }

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
