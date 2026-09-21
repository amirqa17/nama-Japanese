# NAMA

NAMA is a conversation-first Japanese practice app built with Nuxt 4, Vue 3, TypeScript, Tailwind CSS, and source-owned shadcn-vue-style components on Reka UI.

## Product principles

- The core curriculum is researched, curated, and bundled with the app. It never depends on AI.
- Lessons are organized by situation and conversational purpose, not JLPT level.
- Every situation includes casual/polite dialogue, audio, reusable spoken patterns, explanations, and default examples.
- Optional AI generation adds three new examples to a selected pattern; it never replaces the default content.

## Bring-your-own Gemini key

Users can enable **AI example variations** in Settings and enter their own Gemini API key. The key is sent to the Nuxt server route only for the requested generation and is not saved server-side. By default the browser stores it in `sessionStorage`; users can explicitly choose device persistence in `localStorage`.

## Commands

```bash
npm install
npm run dev
npm run build
```

## Research basis

The curriculum direction is informed by the Corpus of Everyday Japanese Conversation (CEJC), a balanced corpus of naturally occurring daily interactions. All shipped dialogues are original and do not reproduce corpus transcripts or redistribute corpus data.

- Koiso et al. (2022), *Design and Evaluation of the Corpus of Everyday Japanese Conversation*, LREC 2022.
- National Institute for Japanese Language and Linguistics, CEJC project and vocabulary-table documentation.

Confirm licensing before directly incorporating CEJC datasets or transcript material into a commercial release.
