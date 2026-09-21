import { createError, readBody } from 'h3'

type RequestBody = { apiKey?: string; pattern?: string; meaning?: string; scene?: string; tone?: 'casual' | 'polite' }

export default defineEventHandler(async (event) => {
  const body = await readBody<RequestBody>(event)
  if (!body.apiKey || body.apiKey.length < 20) throw createError({ statusCode: 400, statusMessage: 'Enter a valid Gemini API key' })
  if (!body.pattern || !body.meaning) throw createError({ statusCode: 400, statusMessage: 'Pattern is required' })

  const prompt = `Create exactly 3 original examples of natural contemporary spoken Japanese using the pattern: ${body.pattern} (${body.meaning}).
Situation: ${body.scene || 'everyday conversation'}. Register: ${body.tone || 'casual'}.

Requirements:
- Sound like real adult conversation in contemporary standard Japanese, not a JLPT textbook.
- Use omitted subjects or particles, contractions, fillers, aizuchi, softeners, and sentence endings only where genuinely natural.
- Avoid anime speech, caricatured slang, pickup lines, translated-English phrasing, and excessive politeness.
- Make the three contexts meaningfully different and short enough to say aloud.
- Include a concise English translation and one brief note identifying the specific spoken-language feature that makes each example natural.
- Return JSON only: {"examples":[{"japanese":"...","english":"...","naturalNote":"..."}]}`

  const result = await $fetch<any>(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(body.apiKey)}`, {
    method: 'POST', body: { contents: [{ parts: [{ text: prompt }] }], generationConfig: { responseMimeType: 'application/json', temperature: 0.8 } },
  }).catch(() => { throw createError({ statusCode: 502, statusMessage: 'Gemini rejected the request—check the API key' }) })

  const text = result?.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) throw createError({ statusCode: 502, statusMessage: 'Gemini returned no examples' })
  const parsed = JSON.parse(text)
  if (!Array.isArray(parsed.examples) || parsed.examples.length !== 3) throw createError({ statusCode: 502, statusMessage: 'Gemini returned an unexpected format' })
  return { examples: parsed.examples }
})
