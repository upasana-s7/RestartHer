const MAX_MESSAGE_LENGTH = 4000;
const MODEL = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
const MAX_ATTEMPTS = 3;

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
  const contents = history.slice(-10).flatMap((item) => {
    if (!item || typeof item.text !== 'string') return [];
    const role = item.role === 'model' || item.role === 'assistant' ? 'model' : 'user';
    return [{ role, parts: [{ text: item.text.slice(0, MAX_MESSAGE_LENGTH) }] }];
  });
  contents.push({ role: 'user', parts: [{ text: message }] });

  const isRoadmapRequest = req.body?.mode === 'roadmap';
  const requestBody = {
    systemInstruction: {
      parts: [{
        text: 'You are RestartHER, a supportive, practical career re-entry companion. Help users identify transferable skills, explore realistic career paths, prepare for interviews, build skills, and plan manageable next steps. Be encouraging without making guarantees. Do not invent job openings, salaries, credentials, course links, or facts. Ask a focused follow-up only when essential information is missing. When a user requests a learning plan or roadmap, make it genuinely actionable: state the goal and assumed weekly time, break the plan into clear weeks or phases, specify what to learn and practise, give a concrete deliverable or milestone for each phase, and finish with a realistic next step. Adapt the length and difficulty to the user; do not give a vague list of topics.'
      }]
    },
    contents,
    generationConfig: { temperature: isRoadmapRequest ? 0.4 : 0.6, maxOutputTokens: isRoadmapRequest ? 1800 : 700 }
  };

  try {
    let upstream;
    let data;

    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
      try {
        upstream = await fetch(
          'https://generativelanguage.googleapis.com/v1beta/models/' + encodeURIComponent(MODEL) + ':generateContent?key=' + encodeURIComponent(apiKey),
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
          }
        );
        data = await upstream.json().catch(() => null);

        if (upstream.ok) break;

        const retryable = [429, 500, 502, 503, 504].includes(upstream.status);
        if (!retryable || attempt === MAX_ATTEMPTS - 1) break;

        console.warn(`Gemini returned ${upstream.status}; retrying attempt ${attempt + 2}/${MAX_ATTEMPTS}.`);
      } catch (requestError) {
        if (attempt === MAX_ATTEMPTS - 1) throw requestError;
        console.warn(`Gemini network request failed; retrying attempt ${attempt + 2}/${MAX_ATTEMPTS}.`);
      }

      await wait(500 * (2 ** attempt));
    }

    if (!upstream?.ok) {
      const status = upstream?.status;
      console.error('Gemini request failed after retries:', status || 'network error', data?.error?.message || 'Unknown provider error');
      if (status === 429 || status === 503) {
        return res.status(503).json({ error: 'Gemini is busy right now. Your message is okay—please try again in a moment.' });
      }
      return res.status(502).json({ error: 'Gemini could not complete that response. Please try again.' });
    }

    const reply = data?.candidates?.[0]?.content?.parts
      ?.map((part) => typeof part.text === 'string' ? part.text : '')
      .join('')
      .trim();
    if (!reply) return res.status(502).json({ error: 'Gemini returned an empty response. Please try again.' });
    return res.status(200).json({ reply });
  } catch (error) {
    console.error('RestartHER Gemini function error:', error);
    return res.status(500).json({ error: 'The AI companion is temporarily unavailable. Please try again.' });
  }
}
