<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { Check, Eye, EyeOff, KeyRound, Loader2, Play, Plus, Settings, Sparkles, Volume2 } from '@lucide/vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { scenes } from '@/data/scenes'
import type { Pattern } from '@/data/scenes'

type Tone = 'casual' | 'polite'
type GeneratedExample = { japanese: string; english: string; naturalNote: string }

const sceneId = ref('first-date')
const tone = ref<Tone>('casual')
const hideEnglish = ref(false)
const saved = ref<string[]>([])
const settingsOpen = ref(false)
const aiEnabled = ref(false)
const apiKey = ref('')
const rememberKey = ref(false)
const generating = ref<string | null>(null)
const generated = ref<Record<string, GeneratedExample[]>>({})
const toast = ref('')
const currentScene = computed(() => scenes.find((scene) => scene.id === sceneId.value) ?? scenes[0]!)
const dialogue = computed(() => currentScene.value[tone.value])
const keyStorage = 'nama-gemini-key'

onMounted(() => {
  saved.value = JSON.parse(localStorage.getItem('nama-saved') || '[]')
  aiEnabled.value = localStorage.getItem('nama-ai-enabled') === 'true'
  rememberKey.value = localStorage.getItem('nama-remember-key') === 'true'
  apiKey.value = rememberKey.value ? localStorage.getItem(keyStorage) || '' : sessionStorage.getItem(keyStorage) || ''
})

watch([aiEnabled, rememberKey, apiKey], () => {
  if (!import.meta.client) return
  localStorage.setItem('nama-ai-enabled', String(aiEnabled.value))
  localStorage.setItem('nama-remember-key', String(rememberKey.value))
  if (rememberKey.value) { localStorage.setItem(keyStorage, apiKey.value); sessionStorage.removeItem(keyStorage) }
  else { sessionStorage.setItem(keyStorage, apiKey.value); localStorage.removeItem(keyStorage) }
})

function notify(message: string) { toast.value = message; window.setTimeout(() => { if (toast.value === message) toast.value = '' }, 2200) }
function toggleSaved(pattern: string) {
  saved.value = saved.value.includes(pattern) ? saved.value.filter((item) => item !== pattern) : [...saved.value, pattern]
  localStorage.setItem('nama-saved', JSON.stringify(saved.value)); notify(saved.value.includes(pattern) ? 'Saved to pocket phrases' : 'Removed')
}
function speak(text: string) {
  if (!('speechSynthesis' in window)) return notify('Audio is not supported in this browser')
  window.speechSynthesis.cancel(); const utterance = new SpeechSynthesisUtterance(text); utterance.lang = 'ja-JP'; utterance.rate = 0.88; window.speechSynthesis.speak(utterance)
}
function playDialogue() {
  window.speechSynthesis.cancel()
  dialogue.value.forEach((line) => { const utterance = new SpeechSynthesisUtterance(line.japanese); utterance.lang = 'ja-JP'; utterance.rate = 0.88; window.speechSynthesis.speak(utterance) })
}
async function generateMore(pattern: Pattern) {
  if (!apiKey.value.trim()) { settingsOpen.value = true; return notify('Add your Gemini API key in settings') }
  generating.value = pattern.japanese
  try {
    const result = await $fetch<{ examples: GeneratedExample[] }>('/api/examples', { method: 'POST', body: { apiKey: apiKey.value.trim(), pattern: pattern.japanese, meaning: pattern.english, scene: currentScene.value.title, tone: tone.value } })
    generated.value[pattern.japanese] = result.examples; notify('Three fresh examples added')
  } catch (error: any) { notify(error?.data?.statusMessage || 'Could not generate examples—check your key') }
  finally { generating.value = null }
}
</script>

<template>
  <div class="min-h-screen overflow-x-hidden bg-[#f4f3ed] text-[#10131a] selection:bg-[#b8f24a]">
    <div class="pointer-events-none fixed -right-24 -top-44 size-[340px] rounded-full bg-[#ffe0d9] opacity-70" />
    <div class="pointer-events-none fixed -left-48 top-[42vh] size-[280px] rounded-full bg-[#e3e8ff] opacity-70" />
    <header class="mx-auto flex h-20 w-[calc(100%_-_2.5rem)] max-w-[1180px] items-center justify-between border-b border-black/10">
      <a href="#" class="flex items-center gap-2.5 font-extrabold tracking-[.06em]"><span class="grid size-9 -rotate-3 place-items-center rounded-xl bg-[#10131a] text-[#ff6b55]">N</span><span>NAMA</span><span class="hidden text-xs font-medium tracking-[.08em] text-[#6f727a] sm:inline">生きた日本語</span></a>
      <Dialog v-model:open="settingsOpen">
        <DialogTrigger><Button variant="outline" size="icon" aria-label="Open settings"><Settings class="size-4" /></Button></DialogTrigger>
        <DialogContent>
          <DialogTitle>Practice settings</DialogTitle><DialogDescription>The researched lessons always work without AI. Generation only adds optional examples.</DialogDescription>
          <div class="mt-6 space-y-5">
            <div class="flex items-start justify-between gap-6 rounded-2xl border border-black/10 bg-white p-4"><div><p class="font-semibold">AI example variations</p><p class="mt-1 text-sm leading-5 text-[#6f727a]">Show a button for three additional examples under each pattern.</p></div><Switch v-model="aiEnabled" aria-label="Enable AI example variations" /></div>
            <div v-if="aiEnabled" class="space-y-3"><label for="api-key" class="flex items-center gap-2 text-sm font-semibold"><KeyRound class="size-4" /> Gemini API key</label><Input id="api-key" v-model="apiKey" type="password" autocomplete="off" placeholder="AIza…" /><div class="flex items-start gap-3 rounded-2xl bg-[#e3e8ff] p-3 text-sm leading-5 text-[#36405f]"><Switch v-model="rememberKey" class="mt-0.5" aria-label="Remember API key on this device" /><span><strong>Remember on this device</strong><br>Off keeps the key only until this browser session ends. It is never saved by NAMA’s server.</span></div></div>
            <Button class="w-full" @click="settingsOpen = false">Save settings</Button>
          </div>
        </DialogContent>
      </Dialog>
    </header>
    <main class="mx-auto mb-24 w-[calc(100%_-_2.5rem)] max-w-[1180px]">
      <section class="flex flex-col items-start justify-between gap-8 py-12 md:min-h-[290px] md:flex-row md:items-end md:py-16"><div><p class="mb-4 text-xs font-bold tracking-[.14em] text-[#6f727a]">NO LEVELS. NO TEXTBOOK VOICE.</p><h1 class="text-[clamp(3.2rem,7vw,6.4rem)] font-bold leading-[.9] tracking-[-.065em]">Say what you’d<br><em class="not-italic text-[#ff6b55]">actually say.</em></h1></div><p class="max-w-[360px] text-lg leading-7 text-[#454850]">Pick a real situation. Hear how the tone changes. Steal the chunks that make conversation flow.</p></section>
      <nav class="mb-4 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none]" aria-label="Choose a situation"><button v-for="scene in scenes" :key="scene.id" class="shrink-0 rounded-full border px-4 py-2.5 text-sm font-semibold transition hover:-translate-y-0.5" :class="sceneId === scene.id ? 'border-[#10131a] bg-[#10131a] text-white' : 'border-[#d9d9d3] bg-white/70'" @click="sceneId = scene.id"><span class="mr-2 text-xs" :class="sceneId === scene.id ? 'text-[#b8f24a]' : 'text-[#6f727a]'">{{ scene.number }}</span>{{ scene.shortTitle }}</button></nav>
      <Card class="overflow-hidden shadow-[0_24px_60px_rgba(16,19,26,.1)]">
        <CardHeader class="flex-col justify-between gap-5 border-b border-[#d9d9d3] p-5 sm:flex-row sm:items-center sm:p-7"><div><div class="flex items-center gap-2 text-xs font-bold tracking-[.09em] text-[#4b68ff]"><span>SCENE {{ currentScene.number }}</span><span>•</span><span>{{ currentScene.length }}</span></div><h2 class="mt-2 text-2xl font-bold tracking-tight">{{ currentScene.title }}</h2><p class="mt-1 text-[#6f727a]">{{ currentScene.goal }}</p></div><div class="flex w-full rounded-xl bg-[#eeeef0] p-1 sm:w-auto" role="group" aria-label="Conversation tone"><button v-for="item in (['casual','polite'] as const)" :key="item" class="flex-1 rounded-lg px-4 py-2 text-sm font-semibold capitalize sm:flex-none" :class="tone === item ? 'bg-white shadow-sm' : ''" @click="tone = item">{{ item }}</button></div></CardHeader>
        <div class="grid lg:grid-cols-[1.55fr_.85fr]">
          <CardContent class="p-5 sm:p-7"><div class="mb-6 flex items-center justify-between gap-3"><div class="flex -space-x-2"><span class="grid size-10 place-items-center rounded-full border-[3px] border-white bg-[#10131a] text-xs font-bold text-white">A</span><span class="grid size-10 place-items-center rounded-full border-[3px] border-white bg-[#ff6b55] text-xs font-bold text-white">M</span></div><div class="flex gap-2"><Button variant="outline" size="icon" :aria-label="hideEnglish ? 'Show English' : 'Hide English'" @click="hideEnglish = !hideEnglish"><EyeOff v-if="!hideEnglish" class="size-4" /><Eye v-else class="size-4" /></Button><Button @click="playDialogue"><Play class="mr-2 size-4 text-[#b8f24a]" />Play dialogue</Button></div></div>
            <div class="space-y-4"><div v-for="(line, index) in dialogue" :key="`${sceneId}-${tone}-${index}`" class="grid grid-cols-[26px_minmax(0,1fr)_36px] items-start gap-2 sm:grid-cols-[35px_minmax(0,1fr)_36px] sm:gap-3"><span class="mt-1 text-xs font-extrabold text-[#6f727a]">{{ line.speaker }}</span><div class="rounded-[4px_18px_18px_18px] px-4 py-3" :class="line.speaker === 'M' ? 'bg-[#e3e8ff]' : 'bg-[#f1f1ee]'"><p lang="ja" class="font-['Noto_Sans_JP'] text-base font-semibold leading-7">{{ line.japanese }}</p><p v-if="!hideEnglish" class="mt-1 text-sm leading-5 text-[#6f727a]">{{ line.english }}</p></div><Button variant="ghost" size="icon" :aria-label="`Play line ${index + 1}`" @click="speak(line.japanese)"><Volume2 class="size-4" /></Button></div></div>
          </CardContent>
          <aside class="bg-[#10131a] p-5 text-white sm:p-7"><div class="mb-5 flex items-center justify-between"><p class="text-xs font-extrabold tracking-[.14em] text-[#b8f24a]">CONVERSATION COACH</p><Badge v-if="aiEnabled" class="bg-white/10 text-[#b8f24a]"><Sparkles class="mr-1 size-3" />AI extras on</Badge></div>
            <div v-for="pattern in currentScene.patterns" :key="pattern.japanese" class="border-t border-white/15 py-5 first:border-t-0 first:pt-0"><div class="flex items-center justify-between gap-3"><h3 lang="ja" class="font-['Noto_Sans_JP'] text-base font-semibold">{{ pattern.japanese }}</h3><button class="grid size-8 shrink-0 place-items-center rounded-full border border-white/25 transition hover:bg-white/10" :aria-label="saved.includes(pattern.japanese) ? 'Remove saved phrase' : 'Save phrase'" @click="toggleSaved(pattern.japanese)"><Check v-if="saved.includes(pattern.japanese)" class="size-4 text-[#b8f24a]" /><Plus v-else class="size-4" /></button></div><p class="mt-1 text-sm text-white/75">{{ pattern.english }}</p><p class="mt-3 border-l-2 border-[#ff6b55] pl-3 text-sm leading-5 text-white/55">{{ pattern.note }}</p>
              <details class="group mt-3"><summary class="cursor-pointer list-none text-sm font-semibold text-[#b8f24a]">Default examples <span class="group-open:hidden">＋</span><span class="hidden group-open:inline">−</span></summary><div class="mt-3 space-y-2"><button v-for="example in pattern.examples" :key="example.japanese" class="block w-full rounded-xl bg-white/[.07] p-3 text-left hover:bg-white/[.1]" @click="speak(example.japanese)"><span lang="ja" class="block text-sm font-medium">{{ example.japanese }}</span><span v-if="!hideEnglish" class="mt-1 block text-xs text-white/55">{{ example.english }}</span></button></div></details>
              <Button v-if="aiEnabled" variant="ghost" size="sm" class="mt-3 w-full border border-white/15 text-white hover:bg-white/10" :disabled="generating === pattern.japanese" @click="generateMore(pattern)"><Loader2 v-if="generating === pattern.japanese" class="mr-2 size-4 animate-spin" /><Sparkles v-else class="mr-2 size-4 text-[#b8f24a]" />{{ generated[pattern.japanese] ? 'Generate different examples' : 'Generate 3 more examples' }}</Button>
              <div v-if="generated[pattern.japanese]" class="mt-3 space-y-2"><button v-for="example in generated[pattern.japanese]" :key="example.japanese" class="block w-full rounded-xl border border-[#b8f24a]/30 bg-[#b8f24a]/10 p-3 text-left" @click="speak(example.japanese)"><span lang="ja" class="block text-sm font-medium">{{ example.japanese }}</span><span v-if="!hideEnglish" class="mt-1 block text-xs text-white/65">{{ example.english }}</span><span class="mt-2 block text-xs leading-4 text-[#b8f24a]/80">{{ example.naturalNote }}</span></button></div>
            </div>
          </aside>
        </div>
      </Card>
      <section class="mt-16 grid gap-7 border-t border-black/10 pt-8 md:grid-cols-[1fr_2fr]"><p class="text-xs font-bold tracking-[.14em] text-[#6f727a]">HOW NAMA CHOOSES WHAT TO TEACH</p><div class="grid gap-7 md:grid-cols-2"><h2 class="text-4xl font-bold leading-[1.02] tracking-[-.045em]">Frequency first.<br>Situation second.<br>Naturalness always.</h2><p class="leading-7 text-[#6f727a]">The core library is researched and built into the app. AI never replaces it—it only supplies optional extra variations for a pattern you choose.</p></div></section>
    </main>
    <Transition enter-active-class="transition" enter-from-class="translate-y-3 opacity-0" leave-active-class="transition" leave-to-class="translate-y-3 opacity-0"><div v-if="toast" class="fixed bottom-7 left-1/2 z-[70] -translate-x-1/2 rounded-full bg-[#10131a] px-4 py-2.5 text-sm font-semibold text-white shadow-xl">{{ toast }}</div></Transition>
  </div>
</template>
