'use strict';
// ============================================================
//  CAPÍTULOS 2 e 3 — Rota 2, Sakuramachi (dojo, biblioteca, gatos),
//  Floresta-labirinto (Tengu), Trilha da montanha e o Santuário do cume.
// ============================================================
Object.assign(DLG, {
  // ----- Rota 2 -----
  signRoute2: [{ jp: 'きた：さくらまち　みなみ：いわやの どうくつ', pt: 'Norte: Sakuramachi · Sul: Caverna Iwaya' }],
  fisher: [
    { jp: 'わたしは まいにち ここで つりを します。', pt: 'Eu pesco aqui todo dia.' },
    { jp: 'きのうは さかなを さんびき つりました。', pt: 'Ontem pesquei três peixes.' },
    { jp: 'さかなは すきですか。わたしは だいすきです！', pt: 'Você gosta de peixe? Eu adoro!' },
  ],
  walker: [
    { jp: 'さくらまちには ねこが たくさん います。', pt: 'Em Sakuramachi há muitos gatos.' },
    { jp: 'ねこは かわいいですね。でも、いぬも すきです。', pt: 'Gatos são fofos, né? Mas também gosto de cachorros.' },
  ],
  renPre: [{ jp: 'ぼくの ことだまは おかねが だいすきです！ バトルを しましょう！', pt: 'Meus kotodama adoram dinheiro! Vamos batalhar!' }],
  renPost: [{ jp: 'まけました…。おかねを ぜんぶ つかいました。', pt: 'Perdi... Gastei todo o dinheiro.' }],
  akiPre: [{ jp: 'まいあさ はしって います。つよいですよ！', pt: 'Eu corro toda manhã. Sou forte!' }],
  akiPost: [{ jp: 'あしたも はしります。また あいましょう。', pt: 'Amanhã corro de novo. Até a próxima.' }],
  kenPre: [{ jp: 'ここを とおっては いけません！ …バトルで かったら いいですよ。', pt: 'Não pode passar por aqui! ...Se ganhar a batalha, pode.' }],
  kenPost: [{ jp: 'どうぞ、とおって ください。', pt: 'Pode passar, por favor.' }],
  // ----- Sakuramachi -----
  signTown2: [{ jp: 'さくらまち　きた：もりの めいろ', pt: 'Sakuramachi · Norte: Labirinto da floresta' }],
  yuna: [
    { jp: 'すみません、ここで しゃしんを とっても いいですか。', pt: 'Com licença, posso tirar uma foto aqui?' },
    { jp: '…はい、いいですよ！ さくらが きれいですね。', pt: '...Sim, pode! As cerejeiras são lindas, né?' },
  ],
  noble: [
    { jp: 'としょかんで ほんを よむ ことが できます。', pt: 'Na biblioteca dá pra ler livros.' },
    { jp: 'はなしを ぜんぶ よんだら、プレゼントを もらえますよ。', pt: 'Se ler as histórias inteiras, você ganha presentes.' },
  ],
  kid2: [
    { jp: 'ねこが なんびき いるか しっていますか。', pt: 'Sabe quantos gatos tem aqui?' },
    { jp: 'にひき です！ ミケと クロ です。', pt: 'São dois! A Mike e o Kuro.' },
  ],
  neko1: [{ jp: 'にゃー。', pt: 'Miau. (A Mike parece feliz.)' }],
  neko2: [{ jp: 'にゃあ…。', pt: 'Miaau... (O Kuro quer carinho.)' }],
  riddleIntro: [{ jp: 'なぞなぞを だします。こたえて ください！', pt: 'Vou te fazer uma charada. Responda!' }],
  // ----- Floresta -----
  hermit: [
    { jp: 'この もりの ぬしは てんぐです。', pt: 'O senhor desta floresta é o Tengu.' },
    { jp: 'てんぐは {木|き}の ことだまが すきです。{火|ひ}の ことだまで たたかって ください。', pt: 'O Tengu gosta de kotodama de madeira. Lute com kotodama de fogo.' },
  ],
  kaedePre: [{ jp: 'もりで まいごに なりましたか。わたしが あんないしますよ… バトルの あとで！', pt: 'Se perdeu na floresta? Eu te guio... depois da batalha!' }],
  kaedePost: [{ jp: 'きたへ いって ください。てんぐが います。', pt: 'Vá para o norte. O Tengu está lá.' }],
  souPre: [{ jp: 'きの ことだまは まけません！', pt: 'Kotodama de madeira não perdem!' }],
  souPost: [{ jp: '…まけました。{火|ひ}は つよいですね。', pt: '...Perdi. Fogo é forte, hein.' }],
  tenguPre: [
    { jp: 'わしは この もりの ぬし、てんぐ じゃ。', pt: 'Eu sou o senhor desta floresta, o Tengu.' },
    { jp: 'やまへ いきたいか。では、わしに かって みなさい！', pt: 'Quer ir para a montanha? Então tente me vencer!' },
  ],
  tenguWin: [
    { jp: 'みごと じゃ！ おぬしは つよい。', pt: 'Esplêndido! Você é forte.' },
    { jp: 'この おまもりを あげよう。やまの うえに じんじゃが ある。', pt: 'Te dou este amuleto. No alto da montanha há um santuário.' },
    { jp: 'だい にしょう クリア！', pt: 'Capítulo 2 completo!' },
  ],
  tenguPost: [{ jp: 'やまは さむいぞ。きを つけて いきなさい。', pt: 'A montanha é fria. Vá com cuidado.' }],
  // ----- Montanha -----
  climber: [
    { jp: 'やまの うえに じんじゃが あります。', pt: 'No alto da montanha há um santuário.' },
    { jp: 'そこに かげの にんじゃが いる そうです。こわいですね…。', pt: 'Dizem que lá está o Ninja das Sombras. Que medo...' },
  ],
  goroPre: [{ jp: 'やまの ことだまは おもいぞ！', pt: 'Os kotodama da montanha são pesados!' }],
  goroPost: [{ jp: 'まけた…。いわより かたい ひとですね。', pt: 'Perdi... Você é mais duro que pedra.' }],
  rinPre: [{ jp: 'ここまで きましたか。でも、わたしは まけません！', pt: 'Chegou até aqui? Mas eu não vou perder!' }],
  rinPost: [{ jp: 'すごいです。じんじゃは もう すぐですよ。', pt: 'Incrível. O santuário já está perto.' }],
  // ----- Cume -----
  healer: [{ jp: 'つかれて いますね。ことだまを げんきに して あげましょう。', pt: 'Você está cansado. Vou deixar seus kotodama bem dispostos.' }],
  sage: [
    { jp: 'ことだまは ことばの ちからです。', pt: 'Kotodama é o poder das palavras.' },
    { jp: 'まいにち すこしずつ べんきょうすれば、だれでも つよく なれます。', pt: 'Estudando um pouquinho todo dia, qualquer um fica forte.' },
  ],
  kagePre: [
    { jp: '…よく ここまで きたな。', pt: '...Você chegou longe.' },
    { jp: 'わたしは かげの にんじゃ。ことばを ぬすむ ものだ。', pt: 'Sou o Ninja das Sombras. Aquele que rouba as palavras.' },
    { jp: 'おまえの ことばを ためして やろう！', pt: 'Vou testar as suas palavras!' },
  ],
  kageWin: [
    { jp: '…まさか。おまえの ことばは ほんものだ。', pt: '...Não pode ser. Suas palavras são de verdade.' },
    { jp: 'おめでとう！ だい さんしょう クリア！', pt: 'Parabéns! Capítulo 3 completo!' },
    { jp: 'これからも まいにち ことだまと いっしょに べんきょうして ください。', pt: 'Continue estudando todo dia junto com os kotodama.' },
  ],
  kagePost: [{ jp: 'また たたかおう。もっと ことばを おぼえて こい。', pt: 'Vamos lutar de novo. Volte sabendo mais palavras.' }],
});

// ---------- Mapas novos ----------
Object.assign(MAPS, {
  route2: {
    name: 'さくらの みち', pt: 'Rota 2 · Caminho das Cerejeiras', theme: 'grass', music: 'route2',
    enc: { rate: 0.13, lv: [8, 12], pool: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '百', '千', '万', '円', '年', '上', '下', '中', '大', '小', '口', '人'], rare: [['好', 0.3], ['明', 0.3]] },
    rows: [
      'TTTTTTTTT==TTTTTTTTT',
      'Tk.......==.......kT',
      'T.,,,,...==...,,,,.T',
      'T.,,,,...==...,,,,.T',
      'T.,,,,...==S..,,,,.T',
      'T........==........T',
      'TTTk.....==.....kTTT',
      'T~~~~....=====.....T',
      'T~~~~........==....T',
      'T~~~~..,,,,..==..u.T',
      'T......,,,,..==....T',
      'Tk.....,,,,..==...kT',
      'T.....=========....T',
      'T..u..==...........T',
      'TTT...==....,,,,.TTT',
      'T.....==....,,,,...T',
      'T.,,,,==....,,,,...T',
      'T.,,,,==.......C...T',
      'T.,,,,=======......T',
      'T...........==..k..T',
      'Tk..q.......==.....T',
      'TTTTT..,,,,.==.TTTTT',
      'T......,,,,.==.....T',
      'T..~~~.,,,,.==..,,.T',
      'T..~~~......==..,,.T',
      'T......=======..,,.T',
      'T.u....==.......u..T',
      'Tk.....==.........kT',
      'T......==..........T',
      'TTTTTTT==TTTTTTTTTTT',
    ],
    warps: [
      { x: 9, y: 0, to: 'town2', tx: 11, ty: 16, dir: 'up' },
      { x: 10, y: 0, to: 'town2', tx: 12, ty: 16, dir: 'up' },
      { x: 7, y: 29, to: 'cave', tx: 11, ty: 1, dir: 'down' },
      { x: 8, y: 29, to: 'cave', tx: 11, ty: 1, dir: 'down' },
    ],
    signs: { '11,4': 'signRoute2' },
    chests: { '15,17': { flag: 'chestR2', items: { kusuri: 3, omamori: 1 } } },
    npcs: [
      { id: 'fisher', x: 5, y: 9, dir: 'left', look: 'oldman2', dlg: 'fisher', name: 'つりびと' },
      { id: 'walker', x: 14, y: 5, dir: 'down', look: 'villager', dlg: 'walker', name: 'さんぽの ひと', wander: true },
      { id: 'ren', x: 5, y: 10, dir: 'right', look: 'trainer2', name: 'レン',
        trainer: { flag: 'renBeaten', pre: 'renPre', post: 'renPost', team: [['金', 9], ['円', 10]], reward: 200 } },
      { id: 'aki', x: 15, y: 19, dir: 'left', look: 'fighter', name: 'アキ',
        trainer: { flag: 'akiBeaten', pre: 'akiPre', post: 'akiPost', team: [['火', 10], ['日', 10], ['力', 11]], reward: 240 } },
      { id: 'ken', x: 5, y: 22, dir: 'right', look: 'trainer3', name: 'ケン',
        trainer: { flag: 'kenBeaten', pre: 'kenPre', post: 'kenPost', team: [['木', 11], ['本', 12]], reward: 260 } },
    ],
  },
  town2: {
    name: 'さくらまち', pt: 'Sakuramachi', theme: 'grass', music: 'town',
    rows: [
      'TTTTTTTTTTT==TTTTTTTTTTT',
      'Tk...f....k==k...f....kT',
      'T.aaaa.....==.....ccc..T',
      'T.aaaa.....==.....ccc..T',
      'T.wIww..u..==..u..wNw..T',
      'T..=================...T',
      'T..f.......==.......f..T',
      'T.....~~~..==..k.......T',
      'Tk....~~~..==......k...T',
      'T.bbb......==.....sss..T',
      'T.bbb......==.....sss..T',
      'T.wDw......==.....wYw..T',
      'T..=================...T',
      'T.....f....==...f..u...T',
      'Tk..u......==.....S...kT',
      'T....ff....==..........T',
      'T.........k==k.........T',
      'TTTTTTTTTTT==TTTTTTTTTTT',
    ],
    warps: [
      { x: 11, y: 17, to: 'route2', tx: 9, ty: 1, dir: 'down' },
      { x: 12, y: 17, to: 'route2', tx: 10, ty: 1, dir: 'down' },
      { x: 11, y: 0, to: 'forest', tx: 10, ty: 24, dir: 'up' },
      { x: 12, y: 0, to: 'forest', tx: 11, ty: 24, dir: 'up' },
    ],
    signs: { '18,14': 'signTown2' },
    npcs: [
      { id: 'yuna', x: 7, y: 6, dir: 'down', look: 'villager3', dlg: 'yuna', name: 'ユナ' },
      { id: 'noble', x: 14, y: 13, dir: 'left', look: 'noble', dlg: 'noble', name: 'しょさい' },
      { id: 'riddle', x: 8, y: 14, dir: 'down', look: 'inspector', name: 'なぞなぞ はかせ' },
      { id: 'kid2', x: 20, y: 14, dir: 'left', look: 'villager4', dlg: 'kid2', name: 'ソラ' },
      { id: 'neko1', x: 17, y: 7, dir: 'down', look: 'cat', dlg: 'neko1', name: 'ミケ', wander: true },
      { id: 'neko2', x: 6, y: 15, dir: 'down', look: 'cat2', dlg: 'neko2', name: 'クロ', wander: true },
    ],
  },
  forest: {
    name: 'もりの めいろ', pt: 'Labirinto da Floresta', theme: 'forest', music: 'forest',
    enc: { rate: 0.12, lv: [11, 15], pool: ['木', '本', '子', '女', '学', '生', '先', '私', '何', '水', '川', '月', '日', '火', '体'], rare: [['林', 0.5], ['休', 0.4], ['森', 0.15]] },
    rows: [
      'TTTTTTTTTT=TTTTTTTTTTT',
      'TTTTTTTTTT=TTTTTTTTTTT',
      'TTTTTTTk.....kTTTTTTTT',
      'TTTTTT.........TTTTTTT',
      'TTTTTT..,,,,...TTTTTTT',
      'TTTTTTTT,,,,.TTTTTTTTT',
      'TT....TT,,,,.TT.....TT',
      'TT.,,.TT.....TT.,,,.TT',
      'TT.,,..........,,C,.TT',
      'TT.,,.TTTT.TTTT.,,,.TT',
      'TT....TTTT.TTTT.....TT',
      'TTTT.TTTTT.TTTTTTT.TTT',
      'T....,,,,.....,,,,...T',
      'T.u..,,,,..u..,,,,.k.T',
      'T....,,,,.....,,,,...T',
      'TTTTTTT.TTTTTTTT.TTTTT',
      'TT,,,,,.......,,,,,.TT',
      'TT,,C,,..TTT..,,,,,.TT',
      'TT,,,,,..TTT..,,,,,.TT',
      'TT.......TTT........TT',
      'TTTT..TTTTTTTTTT..TTTT',
      'T.....,,,,..,,,,.....T',
      'T..k..,,,,..,,,,..u..T',
      'T.....,,,,..,,,,.....T',
      'T.........==.........T',
      'TTTTTTTTTT==TTTTTTTTTT',
    ],
    warps: [
      { x: 10, y: 25, to: 'town2', tx: 11, ty: 1, dir: 'down' },
      { x: 11, y: 25, to: 'town2', tx: 12, ty: 1, dir: 'down' },
      { x: 10, y: 0, to: 'mountain', tx: 10, ty: 19, dir: 'up' },
    ],
    chests: { '17,8': { flag: 'chestF1', items: { onigiri: 2, ofuda: 3 } }, '4,17': { flag: 'chestF2', items: { omamori: 1, okashi: 2 } } },
    npcs: [
      { id: 'hermit', x: 8, y: 3, dir: 'down', look: 'oldman2', dlg: 'hermit', name: 'せんにん' },
      { id: 'sou', x: 11, y: 12, dir: 'down', look: 'samurai2', name: 'ソウ',
        trainer: { flag: 'souBeaten', pre: 'souPre', post: 'souPost', team: [['林', 13], ['木', 14]], reward: 320 } },
      { id: 'kaede', x: 16, y: 19, dir: 'left', look: 'trainer2', name: 'カエデ',
        trainer: { flag: 'kaedeBeaten', pre: 'kaedePre', post: 'kaedePost', team: [['水', 14], ['川', 14], ['月', 15]], reward: 340 } },
      { id: 'tengu', x: 10, y: 2, dir: 'down', look: 'tengu', name: 'てんぐ', after: { flag: 'tenguBeaten', x: 12, y: 3, dir: 'left' },
        trainer: { flag: 'tenguBeaten', pre: 'tenguPre', post: 'tenguPost', win: 'tenguWin', team: [['木', 15], ['林', 16], ['森', 18]], reward: 900, items: { omamori: 2 }, boss: 2 } },
    ],
  },
  mountain: {
    name: 'やまみち', pt: 'Trilha da Montanha', theme: 'mountain', music: 'temple',
    enc: { rate: 0.12, lv: [15, 20], pool: ['山', '川', '田', '力', '男', '人', '口', '車', '門', '半', '分', '土', '金', '上', '下', '大'], rare: [['岩', 0.5], ['畑', 0.3], ['間', 0.2]] },
    rows: [
      '#########==#########',
      '#TT.....,==,.....TT#',
      '#T..,,,,.==..,,,..T#',
      '#...,,,,.==..,,,...#',
      '#.q......=====....q#',
      '####.........==.####',
      '#TT.,,,,.....==..TT#',
      '#...,,,,...q.==....#',
      '#......=======.....#',
      '#..q...==.....,,,,.#',
      '####...==...q.,,,,##',
      '#T.....==.....,,,,T#',
      '#..,,,,======.....T#',
      '#..,,,,.....==..q..#',
      '#.C,,,,.....==.....#',
      '#####.......==.#####',
      '#T..,,,,....==...TT#',
      '#...,,,,..=====....#',
      '#.q.......==....q..#',
      '#.........==.......#',
      '##########==########',
    ],
    warps: [
      { x: 10, y: 20, to: 'forest', tx: 10, ty: 1, dir: 'down' },
      { x: 11, y: 20, to: 'forest', tx: 10, ty: 1, dir: 'down' },
      { x: 9, y: 0, to: 'summit', tx: 10, ty: 12, dir: 'up' },
      { x: 10, y: 0, to: 'summit', tx: 11, ty: 12, dir: 'up' },
    ],
    chests: { '2,14': { flag: 'chestM1', items: { onigiri: 2, omamori: 1 } } },
    npcs: [
      { id: 'climber', x: 16, y: 17, dir: 'left', look: 'villager', dlg: 'climber', name: 'やまのぼり' },
      { id: 'goro', x: 5, y: 8, dir: 'right', look: 'samurai2', name: 'ゴロウ',
        trainer: { flag: 'goroBeaten', pre: 'goroPre', post: 'goroPost', team: [['山', 16], ['岩', 17]], reward: 420 } },
      { id: 'rin', x: 15, y: 13, dir: 'left', look: 'trainer3', name: 'リン',
        trainer: { flag: 'rinBeaten', pre: 'rinPre', post: 'rinPost', team: [['明', 17], ['日', 17], ['火', 18]], reward: 460 } },
    ],
  },
  summit: {
    name: 'さんちょうの じんじゃ', pt: 'Santuário do Cume', theme: 'mountain', music: 'temple',
    rows: [
      '####################',
      '#T.......k........T#',
      '#..k..ssss....k....#',
      '#.....ssss.........#',
      '#.....wJww.........#',
      '#......=...........#',
      '#T.....=.......u..T#',
      '#......====........#',
      '#.u.......=....f...#',
      '#.........=........#',
      '#k.......o=o......k#',
      '#.........==.......#',
      '#.........==.......#',
      '##########==########',
    ],
    objs: [{ k: 'torii', x: 9, y: 9 }],
    warps: [
      { x: 10, y: 13, to: 'mountain', tx: 9, ty: 1, dir: 'down' },
      { x: 11, y: 13, to: 'mountain', tx: 10, ty: 1, dir: 'down' },
    ],
    npcs: [
      { id: 'healer', x: 4, y: 7, dir: 'right', look: 'monk2', name: 'おぼうさん' },
      { id: 'sage', x: 15, y: 8, dir: 'left', look: 'shaman', dlg: 'sage', name: 'けんじゃ' },
      { id: 'kage', x: 12, y: 3, dir: 'down', look: 'masked', name: 'かげの にんじゃ',
        trainer: { flag: 'kageBeaten', pre: 'kagePre', post: 'kagePost', win: 'kageWin', team: [['森', 19], ['岩', 20], ['明', 20], ['間', 22]], reward: 2000, items: { omamori: 3, onigiri: 3 }, boss: 3 } },
    ],
  },
});

// kanji novos (adicionados no app depois) entram automaticamente na caverna e na montanha
(function autoPool() {
  const placed = new Set(FUSION_ONLY);
  Object.values(MAPS).forEach(m => { if (m.enc) { m.enc.pool.forEach(c => placed.add(c)); (m.enc.rare || []).forEach(r => placed.add(r[0])); } });
  Object.keys(SPECIES).forEach(c => { if (!placed.has(c)) { MAPS.cave.enc.pool.push(c); MAPS.mountain.enc.pool.push(c); } });
})();

// onde cada espírito aparece (para o 図鑑)
function whereFound(c) {
  const out = [];
  Object.values(MAPS).forEach(m => {
    if (!m.enc) return;
    if (m.enc.pool.includes(c)) out.push(m.pt);
    else if ((m.enc.rare || []).some(r => r[0] === c)) out.push(m.pt + ' (raro)');
  });
  FUSIONS.filter(f => f.r === c).forEach(f => out.push(`Fusão: ${f.a} + ${f.b}`));
  if (['火', '水', '木'].includes(c)) out.push('Presente do professor');
  return out.length ? out.join(' · ') : '???';
}
