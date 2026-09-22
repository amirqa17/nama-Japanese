import { readFile, writeFile } from 'node:fs/promises'
import KuroshiroModule from 'kuroshiro'
import KuromojiAnalyzerModule from 'kuroshiro-analyzer-kuromoji'

const Kuroshiro = KuroshiroModule.default ?? KuroshiroModule
const KuromojiAnalyzer = KuromojiAnalyzerModule.default ?? KuromojiAnalyzerModule

const source = await readFile(new URL('../app/data/curriculum.ts', import.meta.url), 'utf8')
const strings = [...source.matchAll(/'([^'\n]*[一-龯々ヶぁ-んァ-ンー][^'\n]*)'/g)].map((match) => match[1])
const unique = [...new Set(strings)]
const kuroshiro = new Kuroshiro()
await kuroshiro.init(new KuromojiAnalyzer())

const readings = {}
for (const text of unique) {
  readings[text] = await kuroshiro.convert(text, { mode: 'furigana', to: 'hiragana' })
}

await writeFile(
  new URL('../app/data/furigana.generated.json', import.meta.url),
  `${JSON.stringify(readings, null, 2)}\n`,
)

console.log(`Generated furigana for ${unique.length} Japanese strings.`)
