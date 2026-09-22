<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { ArrowLeft, Bookmark, Check, ChevronRight, Eye, EyeOff, KeyRound, Library, Loader2, Pause, Play, Search, Settings, Sparkles, Volume2 } from '@lucide/vue'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import furiganaReadings from '@/data/furigana.generated.json'
import { conversationCount, topics } from '@/data/curriculum'
import type { Conversation, DialogueLine, Tone, Topic } from '@/data/curriculum'

type Screen = 'topics' | 'topic' | 'practice'
type GeneratedExample = { japanese: string; english: string; naturalNote: string }

const screen = ref<Screen>('topics')
const selectedTopicId = ref(topics[0]!.id)
const selectedConversationId = ref(topics[0]!.conversations[0]!.id)
const tone = ref<Tone>('casual')
const showFurigana = ref(false)
const hideEnglish = ref(false)
const query = ref('')
const saved = ref<string[]>([])
const settingsOpen = ref(false)
const aiEnabled = ref(false)
const apiKey = ref('')
const rememberKey = ref(false)
const generating = ref(false)
const generated = ref<GeneratedExample[]>([])
const toast = ref('')
const playing = ref(false)
const activeLine = ref<number | null>(null)
let playbackRun = 0

const keyStorage = 'nama-gemini-key'
const selectedTopic = computed<Topic>(() => topics.find((item) => item.id === selectedTopicId.value) ?? topics[0]!)
const selectedConversation = computed<Conversation>(() => selectedTopic.value.conversations.find((item) => item.id === selectedConversationId.value) ?? selectedTopic.value.conversations[0]!)
const dialogue = computed<DialogueLine[]>(() => selectedConversation.value[tone.value])
const filteredTopics = computed(() => {
  const value = query.value.trim().toLowerCase()
  return value ? topics.filter((item) => `${item.title} ${item.japanese} ${item.description}`.toLowerCase().includes(value)) : topics
})
const isSaved = computed(() => saved.value.includes(selectedConversation.value.id))

onMounted(() => {
  saved.value = JSON.parse(localStorage.getItem('nama-saved-v2') || '[]')
  aiEnabled.value = localStorage.getItem('nama-ai-enabled') === 'true'
  rememberKey.value = localStorage.getItem('nama-remember-key') === 'true'
  apiKey.value = rememberKey.value ? localStorage.getItem(keyStorage) || '' : sessionStorage.getItem(keyStorage) || ''
})
onBeforeUnmount(stopAudio)

watch([aiEnabled, rememberKey, apiKey], () => {
  if (!import.meta.client) return
  localStorage.setItem('nama-ai-enabled', String(aiEnabled.value))
  localStorage.setItem('nama-remember-key', String(rememberKey.value))
  if (rememberKey.value) { localStorage.setItem(keyStorage, apiKey.value); sessionStorage.removeItem(keyStorage) }
  else { sessionStorage.setItem(keyStorage, apiKey.value); localStorage.removeItem(keyStorage) }
})
watch([selectedConversationId, tone], () => { stopAudio(); generated.value = [] })

function notify(message: string) { toast.value = message; window.setTimeout(() => { if (toast.value === message) toast.value = '' }, 2200) }
function furiganaHtml(text: string) { return showFurigana.value ? (furiganaReadings as Record<string, string>)[text] ?? text : text }
function chooseTopic(item: Topic) { selectedTopicId.value = item.id; selectedConversationId.value = item.conversations[0]!.id; screen.value = 'topic'; window.scrollTo({ top: 0, behavior: 'smooth' }) }
function chooseConversation(item: Conversation) { selectedConversationId.value = item.id; screen.value = 'practice'; window.scrollTo({ top: 0, behavior: 'smooth' }) }
function goBack() { stopAudio(); screen.value = screen.value === 'practice' ? 'topic' : 'topics'; window.scrollTo({ top: 0, behavior: 'smooth' }) }
function toggleSaved() {
  const id = selectedConversation.value.id
  saved.value = saved.value.includes(id) ? saved.value.filter((item) => item !== id) : [...saved.value, id]
  localStorage.setItem('nama-saved-v2', JSON.stringify(saved.value)); notify(saved.value.includes(id) ? 'Saved' : 'Removed from saved')
}

function stopAudio() {
  playbackRun += 1
  if (import.meta.client && 'speechSynthesis' in window) window.speechSynthesis.cancel()
  playing.value = false; activeLine.value = null
}
function japaneseVoice() {
  const voices = window.speechSynthesis.getVoices()
  return voices.find((voice) => voice.lang === 'ja-JP') ?? voices.find((voice) => voice.lang.toLowerCase().startsWith('ja'))
}
function utter(text: string, lineIndex: number, run: number) {
  return new Promise<void>((resolve) => {
    if (run !== playbackRun) return resolve()
    const speech = new SpeechSynthesisUtterance(text)
    speech.lang = 'ja-JP'; speech.rate = 0.82; speech.pitch = 1
    const voice = japaneseVoice(); if (voice) speech.voice = voice
    activeLine.value = lineIndex
    speech.onend = () => resolve(); speech.onerror = () => resolve()
    window.speechSynthesis.speak(speech)
  })
}
async function speakLine(text: string, lineIndex: number) {
  if (!('speechSynthesis' in window)) return notify('Speech is not supported in this browser')
  stopAudio(); const run = playbackRun; playing.value = true
  await utter(text, lineIndex, run)
  if (run === playbackRun) { playing.value = false; activeLine.value = null }
}
async function playDialogue() {
  if (!('speechSynthesis' in window)) return notify('Speech is not supported in this browser')
  if (playing.value) return stopAudio()
  window.speechSynthesis.cancel(); playbackRun += 1; const run = playbackRun; playing.value = true
  for (let index = 0; index < dialogue.value.length; index += 1) {
    if (run !== playbackRun) break
    await utter(dialogue.value[index]!.japanese, index, run)
    if (run === playbackRun && index < dialogue.value.length - 1) await new Promise((resolve) => window.setTimeout(resolve, 280))
  }
  if (run === playbackRun) { playing.value = false; activeLine.value = null }
}
async function generateMore() {
  if (!apiKey.value.trim()) { settingsOpen.value = true; return notify('Add your Gemini API key in settings') }
  generating.value = true
  try {
    const result = await $fetch<{ examples: GeneratedExample[] }>('/api/examples', { method: 'POST', body: { apiKey: apiKey.value.trim(), pattern: selectedConversation.value.keyPhrase, meaning: selectedConversation.value.keyMeaning, scene: `${selectedTopic.value.title}: ${selectedConversation.value.title}`, tone: tone.value } })
    generated.value = result.examples; notify('Three extra examples added')
  } catch (error: any) { notify(error?.data?.statusMessage || 'Could not generate examples—check your key') }
  finally { generating.value = false }
}
</script>

<template>
  <div class="min-h-screen bg-[#f6f5f0] text-[#15171d] selection:bg-[#d5f56c]">
    <header class="sticky top-0 z-40 border-b border-black/10 bg-[#f6f5f0]/95 backdrop-blur">
      <div class="mx-auto flex h-16 w-[calc(100%_-_2rem)] max-w-[1200px] items-center justify-between gap-3">
        <button class="flex items-center gap-2.5" aria-label="Back to topics" @click="screen = 'topics'; stopAudio()"><span class="grid size-9 -rotate-2 place-items-center rounded-xl bg-[#15171d] font-black text-[#ff705c]">N</span><span class="font-extrabold tracking-[.08em]">NAMA</span></button>
        <div class="flex items-center gap-2">
          <label class="hidden items-center gap-2 rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold sm:flex"><span>ふりがな</span><Switch v-model="showFurigana" aria-label="Show furigana" /></label>
          <Button class="sm:hidden" variant="outline" size="icon" :aria-label="showFurigana ? 'Hide furigana' : 'Show furigana'" @click="showFurigana = !showFurigana"><span class="text-xs font-bold">あ</span></Button>
          <Dialog v-model:open="settingsOpen">
            <DialogTrigger><Button variant="outline" size="icon" aria-label="Open settings"><Settings class="size-4" /></Button></DialogTrigger>
            <DialogContent><DialogTitle>Settings</DialogTitle><DialogDescription>The 300 built-in conversations work without AI. A Gemini key only adds optional examples.</DialogDescription>
              <div class="mt-6 space-y-5"><div class="flex items-start justify-between gap-6 rounded-2xl border border-black/10 bg-white p-4"><div><p class="font-semibold">Extra AI examples</p><p class="mt-1 text-sm leading-5 text-[#6d7079]">Generate three variations for the phrase in the current lesson.</p></div><Switch v-model="aiEnabled" aria-label="Enable AI examples" /></div>
                <div v-if="aiEnabled" class="space-y-3"><label for="api-key" class="flex items-center gap-2 text-sm font-semibold"><KeyRound class="size-4" /> Gemini API key</label><Input id="api-key" v-model="apiKey" type="password" autocomplete="off" placeholder="AIza…" /><label class="flex items-start gap-3 rounded-2xl bg-[#e9ecff] p-3 text-sm leading-5"><Switch v-model="rememberKey" class="mt-0.5" /><span><strong>Remember on this device</strong><br><span class="text-[#606574]">Off keeps it only for this browser session.</span></span></label></div>
                <Button class="w-full" @click="settingsOpen = false">Done</Button></div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>

    <main class="mx-auto w-[calc(100%_-_2rem)] max-w-[1200px] pb-24 pt-8 sm:pt-12">
      <template v-if="screen === 'topics'">
        <div class="mb-8 grid gap-6 md:grid-cols-[1fr_380px] md:items-end"><div><p class="mb-2 text-sm font-bold text-[#5f6370]">{{ topics.length }} topics · {{ conversationCount }} short conversations</p><h1 class="text-4xl font-black tracking-[-.045em] sm:text-6xl">What do you want<br class="hidden sm:block"> to practice?</h1></div><label class="relative block"><Search class="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#757983]" /><Input v-model="query" class="h-13 rounded-2xl bg-white pl-12 text-base" placeholder="Search topics…" /></label></div>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <button v-for="item in filteredTopics" :key="item.id" class="group min-h-[190px] rounded-[26px] border border-black/10 bg-white p-6 text-left shadow-[0_8px_28px_rgba(20,22,28,.05)] transition hover:-translate-y-1 hover:shadow-[0_16px_34px_rgba(20,22,28,.1)]" @click="chooseTopic(item)">
            <div class="flex items-start justify-between"><span class="grid size-12 place-items-center rounded-2xl text-2xl" :style="{ backgroundColor: `${item.color}22` }">{{ item.icon }}</span><span class="text-xs font-bold text-[#8b8e96]">{{ item.number }}</span></div>
            <div class="mt-6 flex items-end justify-between gap-4"><div><p lang="ja" class="text-sm font-bold" :style="{ color: item.color }">{{ item.japanese }}</p><h2 class="mt-1 text-xl font-extrabold">{{ item.title }}</h2><p class="mt-2 text-sm leading-5 text-[#6c7079]">{{ item.description }}</p></div><ChevronRight class="mb-1 size-5 shrink-0 transition group-hover:translate-x-1" /></div>
          </button>
        </div><p v-if="!filteredTopics.length" class="rounded-3xl border border-dashed border-black/20 p-12 text-center text-[#6c7079]">No matching topics.</p>
      </template>

      <template v-else-if="screen === 'topic'">
        <button class="mb-7 flex items-center gap-2 text-sm font-bold text-[#60636d] hover:text-black" @click="goBack"><ArrowLeft class="size-4" /> All topics</button>
        <div class="mb-8 flex items-start gap-5"><span class="grid size-16 shrink-0 place-items-center rounded-3xl text-3xl" :style="{ backgroundColor: `${selectedTopic.color}22` }">{{ selectedTopic.icon }}</span><div><p lang="ja" class="font-bold" :style="{ color: selectedTopic.color }">{{ selectedTopic.japanese }}</p><h1 class="mt-1 text-4xl font-black tracking-[-.04em]">{{ selectedTopic.title }}</h1><p class="mt-2 max-w-2xl text-[#686c75]">Choose one of the 10 short conversations.</p></div></div>
        <div class="grid gap-3 md:grid-cols-2">
          <button v-for="(item, index) in selectedTopic.conversations" :key="item.id" class="group flex min-h-[118px] items-center gap-4 rounded-2xl border border-black/10 bg-white p-5 text-left transition hover:-translate-y-0.5 hover:border-black/25" @click="chooseConversation(item)">
            <span class="grid size-10 shrink-0 place-items-center rounded-xl bg-[#f0efe9] text-sm font-black">{{ String(index + 1).padStart(2, '0') }}</span><div class="min-w-0 flex-1"><h2 class="font-extrabold">{{ item.title }}</h2><p lang="ja" class="mt-2 truncate font-['Noto_Sans_JP'] text-sm text-[#646873]">{{ item.casual[0]?.japanese }}</p></div><Check v-if="saved.includes(item.id)" class="size-4 text-[#6d8c00]" /><ChevronRight v-else class="size-5 text-[#9a9ca2] transition group-hover:translate-x-1" />
          </button>
        </div>
      </template>

      <template v-else>
        <button class="mb-7 flex items-center gap-2 text-sm font-bold text-[#60636d] hover:text-black" @click="goBack"><ArrowLeft class="size-4" /> {{ selectedTopic.title }}</button>
        <div class="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside class="order-2 lg:order-1"><div class="sticky top-24 rounded-3xl border border-black/10 bg-white p-3"><p class="px-3 pb-3 pt-2 text-xs font-extrabold uppercase tracking-[.12em] text-[#797c85]">10 conversations</p><button v-for="(item, index) in selectedTopic.conversations" :key="item.id" class="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition" :class="item.id === selectedConversation.id ? 'bg-[#15171d] font-bold text-white' : 'hover:bg-[#f3f2ed]'" @click="chooseConversation(item)"><span class="text-xs opacity-55">{{ String(index + 1).padStart(2, '0') }}</span><span class="truncate">{{ item.title }}</span></button></div></aside>
          <section class="order-1 min-w-0 lg:order-2">
            <div class="overflow-hidden rounded-[28px] border border-black/10 bg-white shadow-[0_18px_50px_rgba(20,22,28,.08)]">
              <div class="flex flex-col gap-5 border-b border-black/10 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7"><div><div class="flex items-center gap-2 text-xs font-bold" :style="{ color: selectedTopic.color }"><span>{{ selectedTopic.icon }}</span><span>{{ selectedTopic.japanese }}</span></div><h1 class="mt-2 text-3xl font-black tracking-[-.035em]">{{ selectedConversation.title }}</h1></div><div class="flex gap-2"><Button variant="outline" size="icon" :aria-label="isSaved ? 'Remove saved lesson' : 'Save lesson'" @click="toggleSaved"><Check v-if="isSaved" class="size-4" /><Bookmark v-else class="size-4" /></Button><Button variant="outline" size="icon" :aria-label="hideEnglish ? 'Show English' : 'Hide English'" @click="hideEnglish = !hideEnglish"><Eye v-if="hideEnglish" class="size-4" /><EyeOff v-else class="size-4" /></Button><Button @click="playDialogue"><Pause v-if="playing" class="mr-2 size-4" /><Play v-else class="mr-2 size-4" />{{ playing ? 'Stop' : 'Play dialogue' }}</Button></div></div>
              <div class="border-b border-black/10 bg-[#faf9f5] p-4 sm:px-7"><div class="inline-flex rounded-xl bg-[#e9e8e3] p-1" role="group" aria-label="Conversation tone"><button v-for="item in (['casual', 'polite'] as const)" :key="item" class="rounded-lg px-5 py-2 text-sm font-bold capitalize" :class="tone === item ? 'bg-white shadow-sm' : 'text-[#747780]'" @click="tone = item">{{ item }}</button></div></div>
              <div class="space-y-5 p-5 sm:p-8"><div v-for="(line, index) in dialogue" :key="`${selectedConversation.id}-${tone}-${index}`" class="grid grid-cols-[34px_minmax(0,1fr)_42px] items-start gap-3"><span class="grid size-8 place-items-center rounded-full text-xs font-black text-white" :style="{ backgroundColor: line.speaker === 'A' ? '#15171d' : selectedTopic.color }">{{ line.speaker }}</span><div class="rounded-[5px_20px_20px_20px] p-4 sm:p-5" :class="activeLine === index ? 'ring-2 ring-[#a9cc33]' : ''" :style="{ backgroundColor: line.speaker === 'A' ? '#f0efe9' : `${selectedTopic.color}16` }"><p lang="ja" class="furigana-line font-['Noto_Sans_JP'] text-lg font-semibold leading-9" v-html="furiganaHtml(line.japanese)" /><p v-if="!hideEnglish" class="mt-2 text-sm leading-5 text-[#656a74]">{{ line.english }}</p></div><Button variant="ghost" size="icon" :aria-label="`Pronounce line ${index + 1}`" @click="speakLine(line.japanese, index)"><Volume2 class="size-5" :class="activeLine === index ? 'text-[#799500]' : ''" /></Button></div></div>
            </div>
            <div class="mt-5 rounded-3xl bg-[#15171d] p-5 text-white sm:p-7"><div class="flex items-start justify-between gap-4"><div><p class="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[.12em] text-[#d5f56c]"><Library class="size-4" /> Key phrase</p><p lang="ja" class="furigana-line mt-4 font-['Noto_Sans_JP'] text-xl font-bold" v-html="furiganaHtml(selectedConversation.keyPhrase)" /><p class="mt-2 text-sm text-white/65">{{ selectedConversation.keyMeaning }}</p></div><Button v-if="aiEnabled" variant="ghost" size="sm" class="border border-white/15 text-white hover:bg-white/10" :disabled="generating" @click="generateMore"><Loader2 v-if="generating" class="mr-2 size-4 animate-spin" /><Sparkles v-else class="mr-2 size-4 text-[#d5f56c]" />More examples</Button></div><div v-if="generated.length" class="mt-6 grid gap-3 sm:grid-cols-3"><button v-for="example in generated" :key="example.japanese" class="rounded-2xl bg-white/[.08] p-4 text-left hover:bg-white/[.12]" @click="speakLine(example.japanese, -1)"><span lang="ja" class="furigana-line block font-semibold" v-html="furiganaHtml(example.japanese)" /><span v-if="!hideEnglish" class="mt-2 block text-xs leading-4 text-white/60">{{ example.english }}</span><span class="mt-3 block text-xs leading-4 text-[#d5f56c]/80">{{ example.naturalNote }}</span></button></div></div>
          </section>
        </div>
      </template>
    </main>
    <Transition enter-active-class="transition" enter-from-class="translate-y-3 opacity-0" leave-active-class="transition" leave-to-class="translate-y-3 opacity-0"><div v-if="toast" class="fixed bottom-7 left-1/2 z-[70] -translate-x-1/2 rounded-full bg-[#15171d] px-4 py-2.5 text-sm font-semibold text-white shadow-xl">{{ toast }}</div></Transition>
  </div>
</template>

<style>
.furigana-line ruby { ruby-position: over; }
.furigana-line rt { color: #737780; font-size: .55em; font-weight: 600; }
</style>
