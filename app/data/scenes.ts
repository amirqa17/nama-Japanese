export type DialogueLine = { speaker: 'A' | 'M'; japanese: string; english: string }
export type Pattern = { japanese: string; english: string; note: string; examples: { japanese: string; english: string }[] }
export type Scene = {
  id: string; number: string; shortTitle: string; title: string; goal: string; length: string
  casual: DialogueLine[]; polite: DialogueLine[]; patterns: Pattern[]
}

export const scenes: Scene[] = [
  {
    id: 'first-date', number: '01', shortTitle: 'First date', title: 'Getting past small talk', length: '2 min',
    goal: 'Move from safe questions into a conversation that feels personal.',
    casual: [
      { speaker: 'A', japanese: 'この辺よく来る？', english: 'Do you come around here often?' },
      { speaker: 'M', japanese: 'ううん、実はあんまり。今日は久しぶりかも。', english: 'Not really, actually. Today might be my first time in a while.' },
      { speaker: 'A', japanese: 'そうなんだ。じゃあ、普段はどの辺で遊ぶことが多い？', english: 'Oh, really? Then where do you usually hang out?' },
      { speaker: 'M', japanese: '最近は中目黒とか。でも、静かなところのほうが好きかな。', english: 'Lately, places like Nakameguro. But I think I prefer somewhere quiet.' },
      { speaker: 'A', japanese: '分かる。俺も話しやすい店のほうが好き。ここ選んでよかった。', english: 'I get that. I prefer places where it’s easy to talk too. Glad we chose this place.' },
      { speaker: 'M', japanese: 'ね。思ったより落ち着いてて、いい感じ。', english: 'Yeah. It’s calmer than I expected—nice vibe.' },
    ],
    polite: [
      { speaker: 'A', japanese: 'この辺はよく来ますか？', english: 'Do you come around here often?' },
      { speaker: 'M', japanese: 'いえ、実はあまり。今日は久しぶりかもしれません。', english: 'No, not really, actually. Today might be my first time in a while.' },
      { speaker: 'A', japanese: 'そうなんですね。普段はどの辺に行くことが多いですか？', english: 'I see. What area do you usually go to?' },
      { speaker: 'M', japanese: '最近は中目黒とかですね。でも、静かなところのほうが好きです。', english: 'Recently, places like Nakameguro. But I prefer somewhere quiet.' },
      { speaker: 'A', japanese: '分かります。僕も話しやすいお店のほうが好きなので、ここにしてよかったです。', english: 'I understand. I prefer places where it’s easy to talk too, so I’m glad we chose this place.' },
    ],
    patterns: [
      { japanese: '実はあんまり', english: 'Not really, actually', note: '実は makes the answer feel candid; あんまり leaves the obvious verb unsaid, which is normal in speech.', examples: [
        { japanese: '実はあんまり詳しくないんだ。', english: 'Actually, I don’t know much about it.' },
        { japanese: 'そこ、実はあんまり行ったことない。', english: 'Actually, I haven’t really been there much.' },
      ] },
      { japanese: '〜ことが多い？', english: 'Do you often…?', note: 'Asks about someone’s real pattern without sounding like an interview question.', examples: [
        { japanese: '休みの日は何してることが多い？', english: 'What do you usually do on your days off?' },
        { japanese: '普段は外で食べることが多い？', english: 'Do you usually eat out?' },
      ] },
      { japanese: '〜のほうが好きかな', english: 'I think I prefer…', note: 'かな softens the opinion and leaves space for the other person to respond.', examples: [
        { japanese: 'どっちかというと、海のほうが好きかな。', english: 'If I had to choose, I think I prefer the sea.' },
        { japanese: 'にぎやかすぎない店のほうが好きかな。', english: 'I think I prefer places that aren’t too loud.' },
      ] },
      { japanese: '思ったより〜', english: 'More … than I expected', note: 'A high-use comparison chunk that naturally creates a shared observation.', examples: [
        { japanese: '思ったより駅から近かった。', english: 'It was closer to the station than I expected.' },
        { japanese: '思ったより辛くないね。', english: 'It’s not as spicy as I expected.' },
      ] },
    ],
  },
  {
    id: 'follow-up', number: '02', shortTitle: 'Text after', title: 'Texting after the date', length: '1 min',
    goal: 'Show clear interest without sounding heavy or formal.',
    casual: [
      { speaker: 'A', japanese: '今日はありがとう！思ってた以上にあっという間だった笑', english: 'Thanks for today! Time went even faster than I expected lol.' },
      { speaker: 'M', japanese: 'こちらこそ！私も楽しかった〜', english: 'Likewise! I had fun too.' },
      { speaker: 'A', japanese: 'よかった。また今度、話してたタイ料理行かない？', english: 'Glad to hear it. Want to try that Thai place we talked about next time?' },
      { speaker: 'M', japanese: '行きたい！来週なら水曜か金曜空いてるよ', english: 'I’d love to! I’m free Wednesday or Friday next week.' },
    ],
    polite: [
      { speaker: 'A', japanese: '今日はありがとうございました！思っていた以上にあっという間でした。', english: 'Thank you for today! Time went even faster than I expected.' },
      { speaker: 'M', japanese: 'こちらこそ、ありがとうございました。私も楽しかったです！', english: 'Thank you too. I had fun!' },
      { speaker: 'A', japanese: 'よかったです。また今度、話していたタイ料理のお店に行きませんか？', english: 'I’m glad. Would you like to try the Thai restaurant we talked about next time?' },
      { speaker: 'M', japanese: 'ぜひ！来週でしたら、水曜日か金曜日が空いています。', english: 'Definitely! If it’s next week, I’m free Wednesday or Friday.' },
    ],
    patterns: [
      { japanese: 'あっという間だった', english: 'It went by so quickly', note: 'A warm, indirect way to say you enjoyed the time together.', examples: [{ japanese: '話してたら、ほんとあっという間だった。', english: 'Once we got talking, time really flew.' }, { japanese: '二時間があっという間だったね。', english: 'Those two hours went by so fast, didn’t they?' }] },
      { japanese: 'また今度〜行かない？', english: 'Want to go … next time?', note: 'Concrete and easy to answer; more natural than a vague promise to meet again.', examples: [{ japanese: 'また今度、あのカフェ行かない？', english: 'Want to try that café next time?' }, { japanese: '今度は一緒にライブ行かない？', english: 'Want to go to a concert together next time?' }] },
      { japanese: '〜なら空いてる', english: 'If it’s…, I’m free', note: 'A compact way to offer availability without overexplaining.', examples: [{ japanese: '平日の夜なら空いてるよ。', english: 'I’m free on weekday evenings.' }, { japanese: '土曜なら午後から空いてる。', english: 'If it’s Saturday, I’m free from the afternoon.' }] },
    ],
  },
  {
    id: 'friends', number: '03', shortTitle: 'With friends', title: 'Catching up naturally', length: '2 min',
    goal: 'React, follow up, and avoid turning the chat into questions only.',
    casual: [
      { speaker: 'A', japanese: '最近どう？仕事まだ忙しい？', english: 'How have you been? Is work still busy?' },
      { speaker: 'M', japanese: 'いや、やっと落ち着いた。先月はほんとやばかったけど。', english: 'No, it finally calmed down. Last month was honestly crazy, though.' },
      { speaker: 'A', japanese: 'お疲れ。なんかずっと残業してたもんね。', english: 'That sounds rough. You were working late all the time, right.' },
      { speaker: 'M', japanese: 'そうそう。今は逆に暇すぎる笑', english: 'Exactly. Now it’s almost too quiet, haha.' },
      { speaker: 'A', japanese: 'じゃあ今度こそどっか行こうよ。', english: 'Then let’s finally go somewhere this time.' },
    ],
    polite: [
      { speaker: 'A', japanese: '最近どうですか？お仕事はまだ忙しいですか？', english: 'How have you been? Is work still busy?' },
      { speaker: 'M', japanese: 'いえ、やっと落ち着きました。先月は本当に大変でしたけど。', english: 'No, it finally calmed down. Last month was really tough, though.' },
      { speaker: 'A', japanese: 'お疲れさまです。ずっと残業されていましたもんね。', english: 'That sounds exhausting. You were working late all the time, weren’t you.' },
      { speaker: 'M', japanese: 'そうなんです。今は逆に暇すぎるくらいです。', english: 'Exactly. Now it’s almost too quiet.' },
    ],
    patterns: [
      { japanese: 'やっと落ち着いた', english: 'It finally calmed down', note: 'やっと carries the feeling that the change took longer than hoped.', examples: [{ japanese: '引っ越しが終わって、やっと落ち着いた。', english: 'The move is over and I’ve finally settled down.' }, { japanese: '最近やっと仕事に慣れてきた。', english: 'I’m finally getting used to the job.' }] },
      { japanese: '〜してたもんね', english: 'You were …, after all', note: 'もんね shows shared context and empathy when both people know the situation.', examples: [{ japanese: '毎日遅くまで働いてたもんね。', english: 'You were working late every day, after all.' }, { japanese: '前から行きたいって言ってたもんね。', english: 'You’d been saying you wanted to go for ages.' }] },
      { japanese: '逆に', english: 'Actually / on the other hand', note: 'Common in modern conversation for introducing an unexpected contrast.', examples: [{ japanese: '忙しいほうが逆に集中できる。', english: 'Oddly, I can focus better when I’m busy.' }, { japanese: '静かすぎると逆に落ち着かない。', english: 'If it’s too quiet, it actually makes me restless.' }] },
    ],
  },
  {
    id: 'restaurant', number: '04', shortTitle: 'Restaurant', title: 'Ordering without textbook stiffness', length: '1 min',
    goal: 'Ask, decide, and order smoothly at a casual restaurant.',
    casual: [
      { speaker: 'A', japanese: 'これ、けっこう辛いですか？', english: 'Is this pretty spicy?' },
      { speaker: 'M', japanese: '少し辛いですけど、そこまでじゃないですよ。', english: 'It’s a little spicy, but not extremely.' },
      { speaker: 'A', japanese: 'じゃあ、それにします。あと、このサラダも一つお願いします。', english: 'Then I’ll have that. And one of these salads, please.' },
      { speaker: 'M', japanese: 'かしこまりました。お飲み物はどうされますか？', english: 'Certainly. What would you like to drink?' },
    ],
    polite: [
      { speaker: 'A', japanese: 'こちらは、けっこう辛いですか？', english: 'Is this fairly spicy?' },
      { speaker: 'M', japanese: '少し辛いですが、そこまでではないですよ。', english: 'It’s a little spicy, but not extremely.' },
      { speaker: 'A', japanese: 'では、こちらにします。あと、このサラダも一つお願いします。', english: 'Then I’ll have this. And one of these salads, please.' },
      { speaker: 'M', japanese: 'かしこまりました。お飲み物はどうされますか？', english: 'Certainly. What would you like to drink?' },
    ],
    patterns: [
      { japanese: 'そこまでじゃない', english: 'Not that much', note: 'A natural soft denial used constantly in everyday replies.', examples: [{ japanese: '駅から近いけど、そこまでうるさくないよ。', english: 'It’s near the station, but it isn’t that noisy.' }, { japanese: '難しいけど、そこまで時間はかからない。', english: 'It’s difficult, but it won’t take that long.' }] },
      { japanese: 'それにします', english: 'I’ll go with that', note: 'Useful whenever choosing from options—not only food.', examples: [{ japanese: 'じゃあ、黒いほうにします。', english: 'Then I’ll go with the black one.' }, { japanese: 'おすすめなら、それにします。', english: 'If that’s your recommendation, I’ll have that.' }] },
    ],
  },
  {
    id: 'work', number: '05', shortTitle: 'Work chat', title: 'A quick work check-in', length: '2 min',
    goal: 'Raise a concern without sounding blunt or over-formal.',
    casual: [
      { speaker: 'A', japanese: 'ちょっと確認なんだけど、この仕様ってもう確定してる？', english: 'Quick check—is this specification already final?' },
      { speaker: 'M', japanese: 'たぶん。でも、一応PJMにも聞いたほうがいいかも。', english: 'Probably. But it might be better to check with the PJM too, just in case.' },
      { speaker: 'A', japanese: 'だよね。あとで聞いてみる。', english: 'Right. I’ll ask later.' },
      { speaker: 'M', japanese: 'もし変わりそうなら、早めに共有するね。', english: 'If it looks likely to change, I’ll let you know early.' },
    ],
    polite: [
      { speaker: 'A', japanese: '少し確認ですが、この仕様はもう確定していますか？', english: 'A quick check: is this specification already final?' },
      { speaker: 'M', japanese: 'おそらく。ただ、念のためPJMにも確認したほうがいいかもしれません。', english: 'Probably. However, it may be better to confirm with the PJM just in case.' },
      { speaker: 'A', japanese: 'そうですね。あとで確認してみます。', english: 'That makes sense. I’ll check later.' },
      { speaker: 'M', japanese: '変更になりそうでしたら、早めに共有します。', english: 'If it looks likely to change, I’ll share that early.' },
    ],
    patterns: [
      { japanese: 'ちょっと確認なんだけど', english: 'Just a quick check', note: 'A soft runway before a question. Very useful with teammates.', examples: [{ japanese: 'ちょっと確認なんだけど、期限って金曜だよね？', english: 'Quick check—the deadline is Friday, right?' }, { japanese: 'ちょっと確認ですが、こちらで合っていますか？', english: 'Just to confirm, is this correct?' }] },
      { japanese: '一応', english: 'For now / just in case', note: 'One of the most useful workplace words; it marks caution without drama.', examples: [{ japanese: '一応、資料も送っておきます。', english: 'I’ll send the document too, just in case.' }, { japanese: '一応動くけど、まだ確認が必要。', english: 'It works for now, but it still needs checking.' }] },
      { japanese: '〜たほうがいいかも', english: 'It might be better to…', note: 'かも turns direct advice into a collaborative suggestion.', examples: [{ japanese: '先に共有したほうがいいかも。', english: 'It might be better to share it first.' }, { japanese: '一回聞いてみたほうがいいかも。', english: 'It might be worth asking once.' }] },
    ],
  },
]
