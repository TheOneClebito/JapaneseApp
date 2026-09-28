'use strict';
// ============================================================
//  DADOS DO JOGO — elementos, espíritos (gerados dos seus kanji),
//  golpes (palavras do seu vocabulário), fusões, itens, insígnias,
//  mapas, NPCs e falas. Tudo que você adicionar no app de estudo
//  (kanji-list.js, kanji-words.js, vocab-decks.js, verbs.js) entra aqui.
// ============================================================

// ---------- Elementos (五行) ----------
const ELEM = {
  '火': { pt: 'Fogo',    c1: '#ff6a3a', c2: '#ffd35a', dark: '#7a2410' },
  '水': { pt: 'Água',    c1: '#3a86ff', c2: '#9ae6ff', dark: '#10357a' },
  '木': { pt: 'Madeira', c1: '#3cbf58', c2: '#c2f27e', dark: '#145a26' },
  '金': { pt: 'Metal',   c1: '#d6aa2c', c2: '#fff4b8', dark: '#6a500c' },
  '土': { pt: 'Terra',   c1: '#b27a3c', c2: '#ecc890', dark: '#56360f' },
};
// ciclo de controle: A vence BEATS[A]
const BEATS = { '木': '土', '土': '水', '水': '火', '火': '金', '金': '木' };
function typeMult(att, def) { if (BEATS[att] === def) return 1.5; if (BEATS[def] === att) return 0.67; return 1; }
const ELEM_FLAVOR = {
  '火': 'Esquentado e cheio de energia. Adora quando a plateia vibra.',
  '水': 'Calmo como um rio, mas imprevisível na batalha.',
  '木': 'Cresce um pouco a cada dia. Muito paciente.',
  '金': 'Brilhante e resistente como metal polido.',
  '土': 'Firme e teimoso. Difícil de derrubar.',
};
// números seguem a associação tradicional 1/6 水, 2/7 火, 3/8 木, 4/9 金, 5/10 土
const KANJI_ELEMENT = {
  '日':'火','月':'水','木':'木','山':'土','川':'水','田':'土','人':'土','口':'金','車':'金','門':'金',
  '火':'火','水':'水','金':'金','土':'土','子':'木','女':'水','学':'木','生':'木','先':'火','私':'水',
  '一':'水','二':'火','三':'木','四':'金','五':'土','六':'水','七':'火','八':'木','九':'金','十':'土',
  '百':'火','千':'水','万':'木','円':'金','年':'木','上':'火','下':'水','中':'土','大':'土','小':'水',
  '本':'木','半':'金','分':'金','力':'火','何':'水','明':'火','休':'木','体':'土','好':'火','男':'土',
  '林':'木','森':'木','間':'金','畑':'火','岩':'土',
};
const ELEM_KEYS = ['火', '水', '木', '金', '土'];
function elementOf(c) { return KANJI_ELEMENT[c] || ELEM_KEYS[hashStr(c) % 5]; }
function strokesOf(c) { const d = window.KANJI_STROKES && KANJI_STROKES[c]; return d ? d.strokes.length : 6; }

// ---------- Espíritos (um por kanji aprendido) ----------
const SPECIES = {};
(window.KANJI_DEX || []).forEach(k => {
  const reads = (k.kun || []).concat(k.on || []);
  const first = reads.length ? cleanReading(reads[0]) : k.c;
  const nm = kanaToRomaji(first);
  SPECIES[k.c] = {
    id: k.c, kanji: k.c, el: elementOf(k.c), strokes: strokesOf(k.c),
    mean: k.mean, on: k.on || [], kun: k.kun || [], week: k.week || 1,
    name: nm.charAt(0).toUpperCase() + nm.slice(1),
  };
});
const spName = c => SPECIES[c] ? `${c} ${SPECIES[c].name}` : c;

// ---------- Golpes = o próprio kanji + palavras que usam ele ----------
const _moveCache = {};
function movesFor(c) {
  if (_moveCache[c]) return _moveCache[c];
  const list = [{ id: 'k:' + c, kind: 'kanji', ref: c, label: c, power: 14, lv: 1 }];
  const words = (window.KANJI_WORDS || []).filter(w => { const b = markupBase(w.w); return b.includes(c) && b !== c; });
  words.sort((a, b) => markupBase(a.w).length - markupBase(b.w).length);
  const lvls = [3, 7, 12];
  words.slice(0, 3).forEach((w, i) => list.push({
    id: 'w:' + w.read, kind: 'word', ref: w, label: w.w,
    power: Math.min(26, 16 + 3 * markupBase(w.w).length), lv: lvls[i],
  }));
  return (_moveCache[c] = list);
}
function movesKnown(inst) { return movesFor(inst.sp).filter(m => m.lv <= inst.lv).slice(-4); }

// ---------- Status ----------
function statsOf(inst) {
  const s = SPECIES[inst.sp].strokes, lv = inst.lv;
  return { maxhp: Math.round(20 + s * 2 + lv * 4), atk: Math.round(5 + s + lv * 2), def: Math.round(5 + s * 0.5 + lv * 1.5) };
}
function xpToNext(lv) { return 12 + lv * lv * 3; }
let _uid = Date.now() % 100000;
function makeInst(sp, lv) { const i = { uid: 'k' + (_uid++), sp, lv, xp: 0, hp: 0 }; i.hp = statsOf(i).maxhp; return i; }

// ---------- Fusões (composição de kanji) ----------
const FUSIONS = [
  { a: '木', b: '木', r: '林', pt: 'Duas árvores juntas formam um bosque: 木 + 木 = 林 (はやし).' },
  { a: '林', b: '木', r: '森', pt: 'Um bosque com mais uma árvore vira floresta: 林 + 木 = 森 (もり).' },
  { a: '日', b: '月', r: '明', pt: 'O sol e a lua juntos: brilho! 日 + 月 = 明 (あかるい).' },
  { a: '女', b: '子', r: '好', pt: 'Mulher + criança = carinho, gostar: 女 + 子 = 好 (すき).' },
  { a: '田', b: '力', r: '男', pt: 'Força (力) no arrozal (田): o homem que trabalha no campo. 田 + 力 = 男 (おとこ).' },
  { a: '人', b: '木', r: '休', pt: 'Uma pessoa (亻) encostada numa árvore: descanso! 人 + 木 = 休 (やすむ).' },
  { a: '人', b: '本', r: '体', pt: 'Pessoa (亻) + raiz/origem (本) = corpo: 人 + 本 = 体 (からだ).' },
  { a: '門', b: '日', r: '間', pt: 'O sol aparecendo na fresta do portão = intervalo, espaço: 門 + 日 = 間 (あいだ).' },
  { a: '火', b: '田', r: '畑', pt: 'Campo preparado com fogo = horta: 火 + 田 = 畑 (はたけ).' },
  { a: '木', b: '一', r: '本', pt: 'Um traço na base da árvore marca a raiz/origem: 木 + 一 = 本 (ほん・もと).' },
  { a: '一', b: '人', r: '大', pt: 'Uma pessoa de braços abertos = grande: 一 + 人 = 大 (おおきい).' },
  { a: '口', b: '十', r: '田', pt: 'Um cercado dividido em quatro = arrozal: 口 + 十 = 田 (た).' },
].filter(f => SPECIES[f.a] && SPECIES[f.b] && SPECIES[f.r]);
const FUSION_ONLY = new Set(['林', '森', '明', '好', '休', '体', '間', '畑']);
const FUSION_MIN_LV = 3;

// ---------- Itens (nomes com vocabulário que você já sabe) ----------
const ITEMS = {
  ofuda:   { jp: 'おふだ',   pt: 'Talismã: sela um espírito selvagem', price: 30, capture: true },
  kusuri:  { jp: 'くすり',   pt: 'Remédio: recupera 30 HP', price: 25, heal: 30 },
  onigiri: { jp: 'おにぎり', pt: 'Bolinho de arroz: recupera todo o HP', price: 60, healFull: true },
  okashi:  { jp: 'おかし',   pt: 'Doces: a plateia adora! Enche a torcida', price: 50, crowd: 100 },
};

// ---------- Insígnias (ajudas opcionais: tiram um pouco de XP) ----------
const BADGES = {
  romaji: { name: 'Romaji',      icon: 'Aa', pt: 'Mostra romaji embaixo das falas e das opções em kana.', pen: 0.10 },
  furi:   { name: 'Furigana',    icon: 'ふ', pt: 'Mostra a leitura em cima de todos os kanji (menos na pergunta de leitura).', pen: 0.15 },
  trad:   { name: 'Tradução',    icon: '訳', pt: 'Mostra a tradução das falas automaticamente.', pen: 0.10 },
  tempo:  { name: 'Tempo Lento', icon: '⏳', pt: 'Dá 50% mais tempo nos desafios.', pen: 0.15 },
  dica:   { name: 'Dica',        icon: '💡', pt: 'Mostra a primeira letra da resposta quando é pra digitar.', pen: 0.10 },
};

// ---------- Visual dos personagens ----------
const LOOKS = {
  hero:     { skin: '#f5c9a0', hair: '#2a1c14', shirt: '#d8383a', pants: '#2c3e78', style: 'cap', hat: '#d8383a' },
  sensei:   { skin: '#f0c29a', hair: '#d8d8d8', shirt: '#f4f4f4', pants: '#6b5a4a', style: 'bald' },
  kid:      { skin: '#f7cda8', hair: '#1a1a1a', shirt: '#3aa0e8', pants: '#e8c83a', style: 'short' },
  granny:   { skin: '#efc19c', hair: '#bdbdbd', shirt: '#8a5aa8', pants: '#6a3a88', style: 'bun' },
  priest:   { skin: '#f0c39c', hair: '#1a1a1a', shirt: '#fafafa', pants: '#c8303a', style: 'eboshi' },
  girl:     { skin: '#f7cfae', hair: '#6a3a1a', shirt: '#f08ab0', pants: '#c85a88', style: 'long' },
  traveler: { skin: '#e8b890', hair: '#3a2a1a', shirt: '#6a8a3a', pants: '#5a4a3a', style: 'hat', hat: '#c8a060' },
  hiker:    { skin: '#e8b890', hair: '#4a2a1a', shirt: '#c86a2a', pants: '#4a4a5a', style: 'short' },
  badgeguy: { skin: '#e8b890', hair: '#2a2a3a', shirt: '#8a3a3a', pants: '#3a3a4a', style: 'short' },
  girl2:    { skin: '#f3c6a4', hair: '#1e1e3a', shirt: '#4ac0a0', pants: '#2a6a6a', style: 'long' },
  trainer:  { skin: '#f5c9a0', hair: '#e8a02a', shirt: '#2a8a5a', pants: '#2a2a2a', style: 'spiky' },
  boss:     { skin: '#c89a78', hair: '#5a5a5a', shirt: '#6a6070', pants: '#3a3440', style: 'bald' },
};

// ---------- Falas (japonês com leitura marcada: {漢字|よみ}) ----------
const DLG = {
  intro: [
    { jp: 'やあ！ こんにちは！', pt: 'Ei! Olá!' },
    { jp: 'わたしは この むらの {先生|せんせい}です。', pt: 'Eu sou o professor desta vila.' },
    { jp: 'ここは 「はじまりの むら」です。', pt: 'Aqui é a "Vila do Começo".' },
    { jp: 'この せかいには 「ことだま」が います。', pt: 'Neste mundo existem os "kotodama".' },
    { jp: 'ことだまは ことばの せいれいです。{漢字|かんじ}の せいれいも います。', pt: 'Kotodama são espíritos das palavras. Também existem espíritos de kanji.' },
    { jp: 'あなたに ことだまを ひとつ あげます。', pt: 'Vou te dar um kotodama.' },
    { jp: 'どれが すきですか。', pt: 'De qual você gosta?' },
  ],
  intro2: [
    { jp: 'くさの なかに やせいの ことだまが います。', pt: 'No meio do mato há kotodama selvagens.' },
    { jp: 'この おふだを あげます。よわい ことだまを つかまえて ください。', pt: 'Te dou estes talismãs (ofuda). Capture kotodama enfraquecidos.' },
    { jp: 'それから、バッジも あげます。', pt: 'Além disso, te dou insígnias também.' },
    { jp: 'メニューで バッジを つけても いいですよ。', pt: 'Pode equipar as insígnias no menu.' },
    { jp: 'でも、バッジを つけない ほうが XPが おおいです。', pt: 'Mas sem insígnias você ganha mais XP.' },
    { jp: 'じゃ、いって らっしゃい！', pt: 'Então, boa viagem!' },
  ],
  sensei: [
    { jp: 'たかい くさの なかを あるいて ください。ことだまが でます。', pt: 'Ande pelo mato alto. Kotodama aparecem.' },
    { jp: 'つかれた とき、やどやで やすんで ください。', pt: 'Quando cansar, descanse na pousada.' },
    { jp: 'じんじゃで ことだまを あわせる ことが できます。', pt: 'No santuário você pode fundir kotodama.' },
  ],
  kid: [
    { jp: 'ぼくは ケンタです。ななさいです！', pt: 'Eu sou o Kenta. Tenho 7 anos!' },
    { jp: 'ぼくは {水|みず}の ことだまが だいすきです。', pt: 'Eu adoro kotodama de água.' },
    { jp: 'でも、{火|ひ}の ことだまは きらいです。あついですから。', pt: 'Mas não gosto dos de fogo. Porque são quentes.' },
  ],
  granny: [
    { jp: 'こんにちは。きのう まごに おかしを もらいました。', pt: 'Olá. Ontem ganhei doces do meu neto.' },
    { jp: 'まごが くれました。やさしい まごです。', pt: 'Meu neto me deu. É um neto gentil.' },
    { jp: 'みせで おかしを かって ください。バトルで つかっても いいですよ。', pt: 'Compre doces na loja. Pode usar na batalha.' },
  ],
  priest: [
    { jp: 'ここは じんじゃです。', pt: 'Aqui é o santuário.' },
    { jp: 'ふたつの ことだまを あわせて、あたらしい {漢字|かんじ}を つくります。', pt: 'Juntando dois kotodama, criamos um kanji novo.' },
    { jp: 'たとえば、{木|き}と {木|き}で {林|はやし}です。', pt: 'Por exemplo: árvore e árvore = bosque.' },
  ],
  girl: [
    { jp: 'やどやで やすんでも いいですよ。ただです！', pt: 'Pode descansar na pousada. É de graça!' },
    { jp: 'やどやで トランプも できます。', pt: 'Na pousada dá pra jogar cartas também.' },
  ],
  traveler: [
    { jp: 'わたしは りょこうを しています。', pt: 'Estou viajando.' },
    { jp: 'みなみの どうくつに いわの ばんにんが います。とても つよいです。', pt: 'Na caverna ao sul há o Guardião da Rocha. Ele é muito forte.' },
    { jp: 'どうくつに はいっては いけません…。うそです！ がんばって ください。', pt: 'É proibido entrar na caverna... mentira! Boa sorte.' },
  ],
  hiker: [
    { jp: 'たかい くさの なかに ことだまが います。', pt: 'Há kotodama no meio do mato alto.' },
    { jp: 'ことだまが よわい とき、おふだを つかって ください。', pt: 'Quando o kotodama estiver fraco, use o talismã.' },
  ],
  girl2: [
    { jp: 'わたしの ことだまは {林|はやし}です。', pt: 'Meu kotodama é o 林 (bosque).' },
    { jp: '{木|き}と {木|き}から うまれました！ じんじゃで あわせました。', pt: 'Nasceu de árvore + árvore! Fundi no santuário.' },
  ],
  badgeguy: [
    { jp: 'バッジを しっていますか。', pt: 'Você conhece as insígnias?' },
    { jp: 'バッジは たすけて くれます。でも、XPが すくなく なります。', pt: 'As insígnias te ajudam. Mas o XP diminui.' },
  ],
  taroPre: [
    { jp: 'おい！ ぼくと バトルを しませんか！', pt: 'Ei! Não quer batalhar comigo?' },
  ],
  taroPost: [
    { jp: 'まけました…。きみは つよいですね。', pt: 'Perdi... Você é forte, hein.' },
  ],
  bossPre: [
    { jp: 'わたしは いわの ばんにん。', pt: 'Eu sou o Guardião da Rocha.' },
    { jp: 'ここを とおりたいですか。', pt: 'Quer passar por aqui?' },
    { jp: 'では、わたしと たたかって ください！', pt: 'Então lute comigo!' },
  ],
  bossWin: [
    { jp: '…まけました。あなたは ほんとうに つよいです。', pt: '...Perdi. Você é realmente forte.' },
    { jp: 'この おふだと おかねを あげます。', pt: 'Te dou estes talismãs e dinheiro.' },
    { jp: 'だい いっしょう クリア！ つづきは また こんど…。', pt: 'Capítulo 1 completo! A continuação fica pra próxima...' },
  ],
  bossPost: [
    { jp: 'また きて ください。もっと つよく なって くださいね。', pt: 'Volte sempre. Fique ainda mais forte, tá?' },
  ],
  signVillage: [{ jp: 'みなみ：ルート１', pt: 'Sul: Rota 1' }],
  signRoute: [{ jp: 'くさむらに ことだまが います。ちゅうい！', pt: 'Há kotodama no mato. Cuidado!' }],
  house: [{ jp: 'かぎが かかっています。', pt: 'Está trancado.' }],
  profDoor: [{ jp: '{先生|せんせい}の うちです。{先生|せんせい}は そとに います。', pt: 'É a casa do professor. Ele está lá fora.' }],
  chestEmpty: [{ jp: 'からっぽです。', pt: 'Está vazio.' }],
};

// ---------- Mapas ----------
// . grama  , mato alto  f flores  = caminho  T árvore  ~ água  # rocha  _ chão de caverna  R pedra
// S placa  C baú  a/b/c/d/s telhados  w parede  I pousada  M loja  J santuário  P casa do professor  H casa
// L entrada da caverna  X saída da caverna
const MAPS = {
  village: {
    name: 'はじまりの むら', pt: 'Vila do Começo', theme: 'grass',
    rows: [
      'TTTTTTTTTTTTTTTTTTTTTTTT',
      'T.f....k...==......f..kT',
      'T.cccc.....==.....aaaa.T',
      'T.cccc.....==.....aaaa.T',
      'T.wPww.....==.....wIww.T',
      'T..=...u...==......=...T',
      'T..=================...T',
      'T.f........==....f..u..T',
      'T.ssss..k..==.....bbbb.T',
      'T.ssss.....==.....bbbb.T',
      'T.wJww.....==.....wMww.T',
      'T..=.......==......=...T',
      'T.o=o===============...T',
      'T..=.......==..........T',
      'T..=..ff...==...~~~~...T',
      'Tk.=.......==S..~~~~.k.T',
      'T..==========..........T',
      'TTTTTTTTTTT==TTTTTTTTTTT',
    ],
    objs: [{ k: 'torii', x: 2, y: 11 }],
    warps: [
      { x: 11, y: 17, to: 'route1', tx: 9, ty: 1, dir: 'down' },
      { x: 12, y: 17, to: 'route1', tx: 10, ty: 1, dir: 'down' },
    ],
    signs: { '13,15': 'signVillage' },
    npcs: [
      { id: 'sensei', x: 5, y: 5, dir: 'down', look: 'sensei', dlg: 'sensei', name: '先生' },
      { id: 'kid', x: 15, y: 13, dir: 'down', look: 'kid', dlg: 'kid', name: 'ケンタ', wander: true },
      { id: 'granny', x: 16, y: 11, dir: 'down', look: 'granny', dlg: 'granny', name: 'おばあさん' },
      { id: 'priest', x: 6, y: 11, dir: 'left', look: 'priest', dlg: 'priest', name: 'かんぬし' },
      { id: 'girl', x: 21, y: 5, dir: 'down', look: 'girl', dlg: 'girl', name: 'ユキ' },
      { id: 'traveler', x: 8, y: 1, dir: 'down', look: 'traveler', dlg: 'traveler', name: 'たびびと', wander: true },
    ],
  },
  route1: {
    name: 'ルート１', pt: 'Rota 1', theme: 'grass',
    enc: { rate: 0.14, lv: [2, 5], pool: ['日','月','木','山','川','田','人','口','火','水','金','土','子','女','一','二','三','四','五'] },
    rows: [
      'TTTTTTTTT==TTTTTTTTT',
      'T........==........T',
      'T.,,,,...==...,,,,.T',
      'T.,,,,...==...,,,,.T',
      'T.,,,,...==...,,,,.T',
      'T........==S.......T',
      'TTT......==......TTT',
      'T....,,,,==,,,,....T',
      'T....,,,,==,,,,....T',
      'T..TT,,,,==,,,,TT..T',
      'T..TT....==....TT..T',
      'Tk.......==........T',
      'T.~~~....==....,,,.T',
      'T.~~~....==....,,,.T',
      'T.~~~....==....,,,.T',
      'T........==......q.T',
      'TTTTT....==....TTTTT',
      'T,,,,,...==...,,,,,T',
      'T,,,,,...==...,,,,,T',
      'T,,,C,...==...,,,,,T',
      'T,,,,,...==...,,,,,T',
      'T.q......==.....u..T',
      'TTT.TT...==...TT.TTT',
      'T....,,,,==,,,,....T',
      'T....,,,,==,,,,....T',
      'T....,,,,==,,,,....T',
      'T........==......k.T',
      'T..TTT...==...TTT..T',
      'T.u......==......u.T',
      '#########LL#########',
    ],
    warps: [
      { x: 9, y: 0, to: 'village', tx: 11, ty: 16, dir: 'up' },
      { x: 10, y: 0, to: 'village', tx: 12, ty: 16, dir: 'up' },
      { x: 9, y: 29, to: 'cave', tx: 10, ty: 15, dir: 'up' },
      { x: 10, y: 29, to: 'cave', tx: 11, ty: 15, dir: 'up' },
    ],
    signs: { '11,5': 'signRoute' },
    chests: { '4,19': { flag: 'chestR1', items: { ofuda: 2 }, badge: 'dica' } },
    npcs: [
      { id: 'hiker', x: 13, y: 11, dir: 'left', look: 'hiker', dlg: 'hiker', name: 'やまのぼり' },
      { id: 'girl2', x: 6, y: 15, dir: 'down', look: 'girl2', dlg: 'girl2', name: 'ハナ' },
      { id: 'badgeguy', x: 12, y: 21, dir: 'down', look: 'badgeguy', dlg: 'badgeguy', name: 'おにいさん' },
      { id: 'taro', x: 6, y: 26, dir: 'right', look: 'trainer', name: 'タロウ',
        trainer: { flag: 'taroBeaten', pre: 'taroPre', post: 'taroPost', team: [['川', 4], ['山', 5]], reward: 120 } },
    ],
  },
  cave: {
    name: 'いわやの どうくつ', pt: 'Caverna Iwaya', theme: 'cave', dark: true,
    enc: { rate: 0.09, lv: [5, 9], pool: ['六','七','八','九','十','百','千','万','円','年','上','下','中','大','小','本','半','分','力','何','先','生','学','私','車','門'], rare: [['岩', 0.4], ['男', 0.4]] },
    rows: [
      '######################',
      '#########____#########',
      '########______########',
      '#######________#######',
      '#######________#######',
      '##########__##########',
      '###______________R__##',
      '###_R______________###',
      '###________##______###',
      '###__C_____##__R___###',
      '###________##______###',
      '#####__######__#######',
      '###________________###',
      '###__R__________R__###',
      '###________________###',
      '#########____#########',
      '#########_XX_#########',
      '######################',
    ],
    warps: [
      { x: 10, y: 16, to: 'route1', tx: 9, ty: 28, dir: 'up' },
      { x: 11, y: 16, to: 'route1', tx: 10, ty: 28, dir: 'up' },
    ],
    chests: { '5,9': { flag: 'chestCave', items: { onigiri: 1 }, badge: 'tempo' } },
    npcs: [
      { id: 'boss', x: 11, y: 2, dir: 'down', look: 'boss', name: 'いわの ばんにん',
        trainer: { flag: 'bossBeaten', pre: 'bossPre', post: 'bossPost', win: 'bossWin', team: [['土', 7], ['山', 8], ['岩', 10]], reward: 500, items: { ofuda: 5 }, boss: true } },
    ],
  },
};

// kanji novos (adicionados no app depois) entram automaticamente na caverna
(function autoPool() {
  const placed = new Set([...MAPS.route1.enc.pool, ...MAPS.cave.enc.pool, ...MAPS.cave.enc.rare.map(r => r[0]), ...FUSION_ONLY]);
  Object.keys(SPECIES).forEach(c => { if (!placed.has(c)) MAPS.cave.enc.pool.push(c); });
})();

// onde cada espírito aparece (para o 図鑑)
function whereFound(c) {
  const out = [];
  if (MAPS.route1.enc.pool.includes(c)) out.push('Rota 1 (mato alto)');
  if (MAPS.cave.enc.pool.includes(c)) out.push('Caverna Iwaya');
  if (MAPS.cave.enc.rare.some(r => r[0] === c)) out.push('Caverna Iwaya (raro)');
  FUSIONS.filter(f => f.r === c).forEach(f => out.push(`Fusão: ${f.a} + ${f.b}`));
  if (['火', '水', '木'].includes(c)) out.push('Presente do professor');
  return out.length ? out.join(' · ') : '???';
}
