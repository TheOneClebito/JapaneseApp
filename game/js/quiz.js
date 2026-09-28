'use strict';
// ============================================================
//  QUIZ — desafios gerados dos seus dados do app de estudo
//  (kanji, palavras, vocabulário, verbos, adjetivos, partículas,
//  contadores, frases, montar frase, ouvir, leitura, escrever).
//  Repetição adaptativa: o que você mais erra aparece mais, e o
//  que acabou de sair não volta logo em seguida.
// ============================================================
function qstats() { return G.save.stats || (G.save.stats = {}); }
function qWeight(key) {
  const s = qstats()[key]; if (!s) return 1.6;
  const miss = (s.s - s.ok) / Math.max(1, s.s);
  const ageMin = (Date.now() - (s.t || 0)) / 60000;
  return 0.5 + miss * 3 + Math.min(1, ageMin / 30) * 0.7;
}
function qRecord(key, ok) { const st = qstats(); const s = st[key] || (st[key] = { s: 0, ok: 0, t: 0 }); s.s++; if (ok) s.ok++; s.t = Date.now(); }
function badgeOn(k) { return !!(G.save && G.save.badges.eq[k]); }

// ---------- memória curta: evita repetir a mesma pergunta ----------
const RECENT = [];
function noteRecent(key) { RECENT.push(key); if (RECENT.length > 16) RECENT.shift(); }
const isRecent = key => RECENT.includes(key);

// ---------- Categorias ----------
const CATS = {
  kanji:  { ic: '漢', pt: 'Kanji' },
  word:   { ic: '語', pt: 'Palavras com kanji' },
  vocab:  { ic: '単', pt: 'Vocabulário' },
  verb:   { ic: '動', pt: 'Verbos (formas)' },
  adj:    { ic: '形', pt: 'Adjetivos' },
  part:   { ic: '助', pt: 'Partículas' },
  count:  { ic: '数', pt: 'Contadores' },
  sent:   { ic: '文', pt: 'Frases' },
  order:  { ic: '並', pt: 'Montar frase' },
  listen: { ic: '聞', pt: 'Ouvir' },
  read:   { ic: '読', pt: 'Leitura (textos)' },
  write:  { ic: '書', pt: 'Escrever kanji' },
};

// ---------- Fontes de conteúdo (tudo vem do app de estudo) ----------
const kanjiReadings = c => { const sp = SPECIES[c]; return [...new Set((sp.kun || []).concat(sp.on || []).map(cleanReading).filter(Boolean))]; };
let _vocab = null;
function allVocab() {
  if (_vocab) return _vocab;
  const seen = new Set(); _vocab = [];
  (window.VOCAB_DECKS || []).forEach(d => d.cards.forEach(c => {
    if (/[A-Za-z]/.test(c.jp) || seen.has(c.jp)) return;
    seen.add(c.jp); _vocab.push({ jp: c.jp, kana: c.kana || c.jp, mean: c.mean, ex: c.ex, exTr: c.exTr });
  }));
  return _vocab;
}
const allWords = () => window.KANJI_WORDS || [];
const allVerbs = () => window.VERBS_DATA || [];
const allAdj = () => window.ADJ_DATA || [];
const allParts = () => window.PARTICLES_DATA || [];
const allCounters = () => window.COUNTERS_DATA || [];
const allKaki = () => window.KAKI_DATA || [];
const allSents = () => window.KANJI_SENTENCES || [];
const allWriting = () => (window.WRITING || []).filter(w => w.accept && w.accept.length);
const allTatoeba = () => window.TATOEBA || [];
let _lines = null;
function allLines() {
  if (_lines) return _lines;
  _lines = [];
  (window.READINGS || []).forEach(r => (r.lines || []).forEach((l, i) => { if (l.jp && l.pt) _lines.push({ r, i, jp: l.jp, pt: l.pt }); }));
  return _lines;
}
const plainK = s => markupBase(String(s || '').replace(/\[([^|\]]+)\|([^\]]+)\]/g, '$1'));

function mcOptions(correct, pool, n = 4) {
  const opts = [correct];
  for (const c of shuffle(pool.slice())) { if (opts.length >= n) break; if (c && !opts.includes(c)) opts.push(c); }
  return shuffle(opts);
}
const readHTML = c => {
  const sp = SPECIES[c];
  const kun = (sp.kun || []).map(esc).join('・'), on = (sp.on || []).map(esc).join('・');
  return [kun, on].filter(Boolean).join(' / ');
};
// grafias falsas trocando um kanji aprendido por outro (pra "qual é a escrita certa?")
function fakeSpellings(s, n = 3) {
  const ks = Object.keys(SPECIES), chars = [...s], idx = chars.map((ch, i) => SPECIES[ch] ? i : -1).filter(i => i >= 0);
  const out = new Set();
  for (let t = 0; t < 40 && out.size < n && idx.length; t++) {
    const c = chars.slice(), i = pick(idx); c[i] = pick(ks);
    const f = c.join(''); if (f !== s) out.add(f);
  }
  return [...out];
}
// frase com [kanji|leitura] perguntado (sublinhado) e {kanji|leitura} com furigana
function sentHTML(s, furi) {
  const marked = String(s).replace(/\[([^|\]]+)\|([^\]]+)\]/g, '⟦$1⟧');
  return jpHTML(marked, furi).replace(/⟦([^⟧]+)⟧/g, '<u class="qu">$1</u>');
}

// ---------- Construtores de perguntas ----------
const Q = {
  kanjiRead(c) {
    const reads = kanjiReadings(c), shown = pick(reads);
    const others = Object.keys(SPECIES).filter(k => k !== c).flatMap(kanjiReadings).filter(r => !reads.includes(r));
    const stems = (SPECIES[c].kun || []).map(readingStem).filter(s => s && s.length >= 2);
    return {
      key: 'kr:' + c, cat: 'kanji', ask: 'Qual é uma leitura deste kanji?',
      prompt: `<span class="qk">${esc(c)}</span>`, typed: true,
      accept: [...new Set(reads.concat(stems))], okVals: reads,
      options: mcOptions(shown, others).map(v => ({ v, html: esc(v), ro: kanaToRomaji(v) })),
      answer: `<b class="jp">${esc(c)}</b> = ${readHTML(c)} <span class="dim">— ${esc(SPECIES[c].mean)}</span>`,
      speak: toHira(reads[0]),
    };
  },
  kanjiMean(c) {
    const m = SPECIES[c].mean;
    const others = Object.keys(SPECIES).filter(k => k !== c).map(k => SPECIES[k].mean).filter(x => x !== m);
    return {
      key: 'km:' + c, cat: 'kanji', ask: 'O que significa?', prompt: `<span class="qk">${esc(c)}</span>`, typed: false,
      okVals: [m], options: mcOptions(m, others).map(v => ({ v, html: esc(v) })),
      answer: `<b class="jp">${esc(c)}</b> = ${esc(m)} <span class="dim">(${readHTML(c)})</span>`,
      speak: toHira(kanjiReadings(c)[0]),
    };
  },
  // ao contrário: dado o significado (ou a leitura), escolha o kanji
  kanjiPick(c) {
    const byRead = Math.random() < .45, r = pick(kanjiReadings(c));
    const others = Object.keys(SPECIES).filter(k => k !== c && (!byRead || !kanjiReadings(k).includes(r)));
    return {
      key: 'kp:' + c, cat: 'kanji', ask: byRead ? 'Qual kanji tem esta leitura?' : 'Qual kanji significa…',
      prompt: byRead ? `<span class="qj">${esc(r)}</span>` : `<span class="qpt">${esc(SPECIES[c].mean)}</span>`, typed: false,
      okVals: [c], options: mcOptions(c, others).map(v => ({ v, html: `<span class="qkopt">${esc(v)}</span>` })),
      answer: `<b class="jp">${esc(c)}</b> = ${esc(SPECIES[c].mean)} <span class="dim">(${readHTML(c)})</span>`,
      speak: toHira(r),
    };
  },
  wordRead(w) {
    const others = allWords().filter(x => x.read !== w.read).map(x => x.read);
    const near = others.filter(r => Math.abs(r.length - w.read.length) <= 1);
    return {
      key: 'wr:' + w.read, cat: 'word', ask: 'Como se lê?', prompt: `<span class="qj">${jpHTML(w.w, false)}</span>`, typed: true,
      accept: [w.read], okVals: [w.read],
      options: mcOptions(w.read, near.length >= 3 ? near : others).map(v => ({ v, html: esc(v), ro: kanaToRomaji(v) })),
      answer: `<b class="jp">${jpHTML(w.w, true)}</b> = ${esc(w.read)} <span class="dim">— ${esc(w.mean)}</span>`,
      speak: w.read,
    };
  },
  wordMean(w) {
    const others = allWords().filter(x => x.mean !== w.mean).map(x => x.mean);
    return {
      key: 'wm:' + w.read, cat: 'word', ask: 'O que significa?', prompt: `<span class="qj">${jpHTML(w.w, badgeOn('furi'))}</span>`, typed: false,
      okVals: [w.mean], options: mcOptions(w.mean, others).map(v => ({ v, html: esc(v) })),
      answer: `<b class="jp">${jpHTML(w.w, true)}</b> (${esc(w.read)}) = ${esc(w.mean)}`,
      speak: w.read,
    };
  },
  // leitura + significado → escolha a escrita certa (書きましょう em versão de escolha)
  spellPick(item) { // item: { base, read, mean, key }
    const fakes = fakeSpellings(item.base);
    if (fakes.length < 2) return null;
    return {
      key: 'sp:' + item.read, cat: 'word', ask: 'Qual é a escrita certa?',
      prompt: `<span class="qj">${esc(item.read)}</span><div class="qsub">${esc(item.mean)}</div>`, typed: false,
      okVals: [item.base], options: mcOptions(item.base, fakes).map(v => ({ v, html: `<span class="qkopt">${esc(v)}</span>` })),
      answer: `${esc(item.read)} = <b class="jp">${esc(item.base)}</b> <span class="dim">— ${esc(item.mean)}</span>`,
      speak: item.read,
    };
  },
  // frase com a parte sublinhada: como se lê?
  sentRead(s) {
    const m = s.s.match(/\[([^|\]]+)\|([^\]]+)\]/); if (!m) return null;
    const ans = m[2];
    const others = allSents().map(x => (x.s.match(/\[[^|\]]+\|([^\]]+)\]/) || [])[1]).filter(r => r && r !== ans);
    const near = others.filter(r => Math.abs(r.length - ans.length) <= 1);
    return {
      key: 'sr:' + s.s, cat: 'sent', ask: 'Como se lê a parte sublinhada?', extra: 4,
      prompt: `<span class="qs">${sentHTML(s.s, badgeOn('furi'))}</span>${badgeOn('trad') ? `<div class="qsub">${esc(s.pt)}</div>` : ''}`, typed: true,
      accept: [ans], okVals: [ans],
      options: mcOptions(ans, near.length >= 3 ? near : others).map(v => ({ v, html: esc(v), ro: kanaToRomaji(v) })),
      answer: `<b class="jp">${esc(m[1])}</b> = ${esc(ans)}<div class="dim">${esc(s.pt)}</div>`,
      speak: markupKana(s.s.replace(/\[([^|\]]+)\|([^\]]+)\]/g, '$2')),
    };
  },
  vocabMean(v) {
    const others = allVocab().filter(x => x.mean !== v.mean).map(x => x.mean);
    const sub = (v.kana !== v.jp) ? `<div class="qsub">${esc(v.kana)}</div>` : (badgeOn('romaji') ? `<div class="qsub">${esc(kanaToRomaji(v.kana))}</div>` : '');
    return {
      key: 'vm:' + v.jp, cat: 'vocab', ask: 'O que significa?', prompt: `<span class="qj">${esc(v.jp)}</span>${sub}`, typed: false,
      okVals: [v.mean], options: mcOptions(v.mean, others).map(x => ({ v: x, html: esc(x) })),
      answer: `<b class="jp">${esc(v.jp)}</b>${v.kana !== v.jp ? ' (' + esc(v.kana) + ')' : ''} = ${esc(v.mean)}`,
      speak: v.kana,
    };
  },
  vocabRev(v) {
    const others = allVocab().filter(x => x.kana !== v.kana).map(x => x.kana);
    return {
      key: 'vr:' + v.jp, cat: 'vocab', ask: 'Como se diz em japonês?', prompt: `<span class="qpt">${esc(v.mean)}</span>`, typed: true,
      accept: [v.kana], okVals: [v.kana],
      options: mcOptions(v.kana, others).map(x => ({ v: x, html: esc(x), ro: kanaToRomaji(x) })),
      answer: `${esc(v.mean)} = <b class="jp">${esc(v.kana)}</b> <span class="dim">(${esc(kanaToRomaji(v.kana))})</span>`,
      speak: v.kana,
    };
  },
  // frase de exemplo do card de vocabulário → tradução
  vocabEx(v) {
    if (!v.ex || !v.exTr) return null;
    const others = allVocab().filter(x => x.exTr && x.exTr !== v.exTr).map(x => x.exTr);
    return {
      key: 've:' + v.jp, cat: 'sent', ask: 'O que a frase quer dizer?', extra: 4,
      prompt: `<span class="qs">${jpHTML(v.ex, badgeOn('furi'))}</span>${badgeOn('romaji') ? `<div class="qsub">${esc(romajiLine(v.ex))}</div>` : ''}`, typed: false,
      okVals: [v.exTr], options: mcOptions(v.exTr, others).map(x => ({ v: x, html: esc(x), small: true })),
      answer: `<b class="jp">${esc(v.ex)}</b><div>${esc(v.exTr)}</div><div class="dim">${esc(v.jp)} = ${esc(v.mean)}</div>`,
      speak: markupKana(v.ex),
    };
  },
  verbForm(v, form) {
    const k = v.kana, stem = k.slice(0, -1), iRow = I_ROW[k.slice(-1)] || '';
    const F = { te: ['て', teForm], nai: ['ない', naiForm], ta: ['た (passado)', taForm], masu: ['ます', masuForm] }[form];
    const ok = F[1](v);
    let wrong = [];
    if (form === 'te' || form === 'ta') {
      const t = form === 'te' ? ['て', 'って', 'んで', 'いて', 'して'] : ['た', 'った', 'んだ', 'いた', 'した'];
      wrong = t.map(x => stem + x).concat([stem + iRow + t[0]]);
      if (k.endsWith('くる')) wrong.push(k.slice(0, -2) + 'き' + (form === 'te' ? 'って' : 'った'), k.slice(0, -2) + 'く' + (form === 'te' ? 'って' : 'った'));
      if (k.endsWith('いく')) wrong.push(k.slice(0, -2) + (form === 'te' ? 'いいて' : 'いいた'));
      if (k.endsWith('する')) wrong.push(k.slice(0, -2) + (form === 'te' ? 'すって' : 'すった'));
    } else if (form === 'nai') {
      wrong = [stem + 'ない', stem + 'らない', stem + 'わない', stem + iRow + 'ない', k + 'ない'];
      if (k.endsWith('くる')) wrong.push(k.slice(0, -2) + 'きない', k.slice(0, -2) + 'くない');
      if (k.endsWith('する')) wrong.push(k.slice(0, -2) + 'さない', k.slice(0, -2) + 'すない');
    } else {
      wrong = [stem + 'ます', stem + 'ります', stem + iRow + 'ます', k + 'ます'];
      if (k.endsWith('くる')) wrong.push(k.slice(0, -2) + 'くります', k.slice(0, -2) + 'こます');
      if (k.endsWith('する')) wrong.push(k.slice(0, -2) + 'すります', k.slice(0, -2) + 'さます');
    }
    wrong = [...new Set(wrong)].filter(x => x !== ok && x !== k);
    return {
      key: 'v' + form + ':' + k, cat: 'verb', strict: true, ask: `Coloque na forma ${F[0]}:`,
      prompt: `<span class="qj">${esc(v.jp)}</span><div class="qsub">${esc(v.kana)} · ${esc(v.meaning)}</div>`, typed: true,
      accept: [ok], okVals: [ok],
      options: mcOptions(ok, wrong).map(x => ({ v: x, html: esc(x), ro: kanaToRomaji(x) })),
      answer: `${esc(v.jp)} → <b class="jp">${esc(ok)}</b> <span class="dim">(${esc(kanaToRomaji(ok))})</span>`,
      speak: ok,
    };
  },
  adjForm(a, form) {
    const F = { neg: 'negativo (não é…)', past: 'passado (era…)', pastneg: 'passado negativo (não era…)', te: 'ligação て (…e…)' };
    const ok = conjAdj(a, form);
    const fake = { ...a, type: a.type === 'i' ? 'na' : 'i', irr: false };
    const wrong = [conjAdj(fake, form), ...Object.keys(F).filter(f => f !== form).map(f => conjAdj(a, f))];
    if (a.type === 'i') wrong.push(a.kana + 'じゃない', a.kana + 'くない');
    if (a.irr) wrong.push('いくない', 'いかった');
    const dict = a.type === 'na' ? a.kana + '（な）' : a.kana;
    return {
      key: 'a' + form + ':' + a.kana, cat: 'adj', strict: true, ask: `Adjetivo na forma: ${F[form]}`,
      prompt: `<span class="qj">${esc(dict)}</span><div class="qsub">${esc(a.mean)} · adjetivo ${a.type === 'i' ? 'い' : 'な'}</div>`, typed: true,
      accept: [ok], okVals: [ok],
      options: mcOptions(ok, [...new Set(wrong)].filter(x => x !== ok)).map(x => ({ v: x, html: esc(x), ro: kanaToRomaji(x) })),
      answer: `${esc(dict)} → <b class="jp">${esc(ok)}</b> <span class="dim">(${esc(kanaToRomaji(ok))})</span>`,
      speak: ok,
    };
  },
  particle(it) {
    const full = it.s[0] + it.ans + it.s[1];
    return {
      key: 'pa:' + it.s.join('_'), cat: 'part', ask: 'Qual partícula completa a frase?', extra: 3,
      prompt: `<span class="qs">${esc(it.s[0])}<span class="qgap">？</span>${esc(it.s[1])}</span><div class="qsub">${esc(it.pt)}</div>`, typed: false,
      okVals: [it.ans].concat(it.also || []), options: shuffle(it.opts.slice()).map(x => ({ v: x, html: `<span class="qkopt">${esc(x)}</span>` })),
      answer: `<b class="jp">${esc(full)}</b><div class="dim">${esc(it.note || '')}</div>`,
      speak: full,
    };
  },
  counter(c, n) {
    const ok = c.readings[n - 1];
    const base = c.readings[1].replace(/^に/, ''); // leitura "sem mudança de som"
    const naive = ['いち', 'に', 'さん', 'よん', 'ご', 'ろく', 'なな', 'はち', 'きゅう', 'じゅう'][n - 1] + base;
    const wrong = [naive, c.readings[n % 10], c.readings[(n + 8) % 10]].concat(allCounters().filter(x => x !== c).map(x => x.readings[n - 1]));
    return {
      key: 'ct:' + c.key + n, cat: 'count', strict: true, ask: 'Como se lê a quantidade?',
      prompt: `<span class="qk qnum">${n} ${c.icon}</span><div class="qsub">${esc(c.label)}</div>`, typed: true,
      accept: [ok], okVals: [ok],
      options: mcOptions(ok, [...new Set(wrong)].filter(x => x && x !== ok)).map(x => ({ v: x, html: esc(x), ro: kanaToRomaji(x) })),
      answer: `${n} ${c.icon} = <b class="jp">${esc(ok)}</b> <span class="dim">(${esc(kanaToRomaji(ok))})</span>`,
      speak: ok,
    };
  },
  // "passe para o japonês" — versão de escolha
  composeMC(w) {
    const ok = w.accept[0];
    const same = allWriting().filter(x => x !== w && x.level === w.level).map(x => x.accept[0]);
    const swaps = [['に', 'を'], ['を', 'に'], ['で', 'に'], ['は', 'が'], ['に', 'で'], ['て', 'た']];
    const muts = swaps.map(([a, b]) => { const i = ok.indexOf(a); return i > 0 ? ok.slice(0, i) + b + ok.slice(i + 1) : null; }).filter(x => x && x !== ok);
    const pool = shuffle(muts).slice(0, 1).concat(shuffle(same.length >= 3 ? same : allWriting().map(x => x.accept[0])));
    return {
      key: 'cm:' + w.id, cat: 'sent', ask: 'Como fica em japonês?', extra: 6,
      prompt: `<span class="qpt">${esc(w.pt)}</span>`, typed: false,
      okVals: [ok], options: mcOptions(ok, pool.filter(x => x !== ok)).map(x => ({ v: x, html: esc(x), small: true, ro: romajiLine(x) })),
      answer: `<b class="jp">${esc(ok)}</b><div class="dim">${esc(romajiLine(ok))}</div>`,
      speak: ok,
    };
  },
  // montar a frase com os blocos (ordem das palavras + partículas)
  composeOrder(w) {
    const PART = /^(.+?)(は|が|を|に|で|へ|と|も|の|から|まで)$/;
    const toks = [];
    w.accept[0].replace(/[。！？]/g, '').split(/\s+/).filter(Boolean).forEach(t => {
      const m = t.length > 2 && t.match(PART);
      if (m && m[1].length >= 2) toks.push(m[1], m[2]); else toks.push(t);
    });
    if (toks.length < 3) return null;
    return {
      key: 'co:' + w.id, cat: 'order', mode: 'order', ask: 'Monte a frase em japonês:',
      prompt: `<span class="qpt">${esc(w.pt)}</span>`, typed: false,
      tiles: toks, accept: w.accept, okVals: [],
      extra: 8 + toks.length * 2,
      answer: `<b class="jp">${esc(w.accept[0])}</b><div class="dim">${esc(romajiLine(w.accept[0]))}</div>`,
      speak: w.accept[0],
    };
  },
  // linha de um texto de leitura → tradução
  readLine(L) {
    const same = allLines().filter(x => x.r === L.r && x.pt !== L.pt).map(x => x.pt);
    const pool = same.length >= 3 ? same : allLines().filter(x => x.pt !== L.pt).map(x => x.pt);
    return {
      key: 'rl:' + L.r.id + ':' + L.i, cat: 'read', ask: `Leia (${L.r.title}) — o que significa?`, extra: 6,
      prompt: `<span class="qs">${jpHTML(L.jp, badgeOn('furi'))}</span>${badgeOn('romaji') ? `<div class="qsub">${esc(romajiLine(markupKana(L.jp)))}</div>` : ''}`, typed: false,
      okVals: [L.pt], options: mcOptions(L.pt, pool).map(x => ({ v: x, html: esc(x), small: true })),
      answer: `<b class="jp">${jpHTML(L.jp, true)}</b><div>${esc(L.pt)}</div>`,
      speak: markupKana(L.jp),
    };
  },
  // ouvir: áudio nativo (Tatoeba) ou voz do aparelho
  listenTatoeba(t) {
    const others = allTatoeba().filter(x => x.pt !== t.pt).map(x => x.pt);
    return {
      key: 'lt:' + t.id, cat: 'listen', mode: 'listen', ask: 'Ouça — o que foi dito?', extra: 6,
      audio: { url: '../audio/tatoeba/' + t.id + '.mp3', text: t.jp },
      prompt: '', typed: false,
      okVals: [t.pt], options: mcOptions(t.pt, others).map(x => ({ v: x, html: esc(x), small: true })),
      answer: `<b class="jp">${esc(t.jp)}</b><div>${esc(t.pt)}</div><div class="dim">🎙 áudio: ${esc(t.by)} (Tatoeba, ${esc(t.lic)})</div>`,
      speak: null,
    };
  },
  listenVocab(v) {
    const others = allVocab().filter(x => x.mean !== v.mean).map(x => x.mean);
    return {
      key: 'lv:' + v.jp, cat: 'listen', mode: 'listen', ask: 'Ouça — o que significa?', extra: 4,
      audio: { text: v.kana }, prompt: '', typed: false,
      okVals: [v.mean], options: mcOptions(v.mean, others).map(x => ({ v: x, html: esc(x) })),
      answer: `<b class="jp">${esc(v.jp)}</b>${v.kana !== v.jp ? ' (' + esc(v.kana) + ')' : ''} = ${esc(v.mean)}`,
      speak: v.kana,
    };
  },
  // escrever o kanji com o dedo
  write(c) {
    return {
      key: 'wk:' + c, cat: 'write', mode: 'draw', ask: 'Escreva o kanji, traço por traço:', char: c,
      prompt: `<span class="qpt">${esc(SPECIES[c].mean)}</span><div class="qsub">${esc(kanjiReadings(c).slice(0, 3).join('・'))}</div>`,
      typed: false, okVals: [], extra: 10 + SPECIES[c].strokes * 2.5,
      answer: `<b class="jp">${esc(c)}</b> = ${esc(SPECIES[c].mean)} <span class="dim">(${SPECIES[c].strokes} traços)</span>`,
      speak: toHira(kanjiReadings(c)[0]),
    };
  },
};
function conjAdj(adj, form) {
  if (adj.type === 'i') {
    const base = adj.irr ? 'よ' : adj.kana.slice(0, -1);
    return base + { neg: 'くない', past: 'かった', pastneg: 'くなかった', te: 'くて' }[form];
  }
  return adj.kana + { neg: 'じゃない', past: 'だった', pastneg: 'じゃなかった', te: 'で' }[form];
}

// ---------- Escolha adaptativa (evitando repetição) ----------
function adaptivePick(pool, keyFn) {
  if (!pool.length) return null;
  let cand = pool.filter(it => !isRecent(keyFn(it)));
  if (!cand.length) cand = pool;
  const sample = cand.length > 40 ? shuffle(cand.slice()).slice(0, 40) : cand;
  return wpick(sample, it => qWeight(keyFn(it)));
}
const kanjiKeys = () => Object.keys(SPECIES);
const wordItems = () => allWords().map(w => ({ base: markupBase(w.w), read: w.read, mean: w.mean }))
  .concat(allKaki().map(k => ({ base: markupBase(k.k), read: k.r, mean: k.m })));

// gera uma pergunta de uma categoria (conteúdo geral)
function qForCat(cat) {
  for (let t = 0; t < 4; t++) {
    const q = buildCat(cat);
    if (q && (!isRecent(q.key) || t === 3)) return q;
  }
  return Q.kanjiMean(pick(kanjiKeys()));
}
function buildCat(cat) {
  const r = Math.random();
  switch (cat) {
    case 'kanji': {
      const c = adaptivePick(kanjiKeys(), c => 'kr:' + c);
      return r < .45 ? Q.kanjiRead(c) : r < .75 ? Q.kanjiPick(c) : Q.kanjiMean(c);
    }
    case 'word': {
      if (r < .4) return Q.wordRead(adaptivePick(allWords(), w => 'wr:' + w.read));
      if (r < .7) return Q.wordMean(adaptivePick(allWords(), w => 'wm:' + w.read));
      return Q.spellPick(adaptivePick(wordItems(), i => 'sp:' + i.read)) || Q.wordRead(pick(allWords()));
    }
    case 'vocab': {
      if (r < .6) return Q.vocabMean(adaptivePick(allVocab(), v => 'vm:' + v.jp));
      return Q.vocabRev(adaptivePick(allVocab(), v => 'vr:' + v.jp));
    }
    case 'verb': {
      const form = wpick([['te', 3], ['nai', 2.5], ['ta', 2], ['masu', 1.5]], x => x[1])[0];
      return Q.verbForm(adaptivePick(allVerbs(), v => 'v' + form + ':' + v.kana), form);
    }
    case 'adj': {
      const form = pick(['neg', 'past', 'pastneg', 'te']);
      return Q.adjForm(adaptivePick(allAdj(), a => 'a' + form + ':' + a.kana), form);
    }
    case 'part': return Q.particle(adaptivePick(allParts(), p => 'pa:' + p.s.join('_')));
    case 'count': {
      const c = adaptivePick(allCounters(), c => 'ct:' + c.key), n = rint(1, 10);
      return Q.counter(c, n);
    }
    case 'sent': {
      if (r < .4 && allSents().length) return Q.sentRead(adaptivePick(allSents(), s => 'sr:' + s.s));
      if (r < .7 && allWriting().length) return Q.composeMC(adaptivePick(allWriting(), w => 'cm:' + w.id));
      return Q.vocabEx(adaptivePick(allVocab().filter(v => v.ex && v.exTr), v => 've:' + v.jp));
    }
    case 'order': return Q.composeOrder(adaptivePick(allWriting(), w => 'co:' + w.id));
    case 'listen': {
      if (r < .55 && allTatoeba().length) return Q.listenTatoeba(adaptivePick(allTatoeba(), t => 'lt:' + t.id));
      return Q.listenVocab(adaptivePick(allVocab(), v => 'lv:' + v.jp));
    }
    case 'read': return Q.readLine(adaptivePick(allLines(), L => 'rl:' + L.r.id + ':' + L.i));
    case 'write': return Q.write(adaptivePick(kanjiKeys(), c => 'wk:' + c));
  }
  return null;
}
// categorias disponíveis (dependem dos dados que existem)
function catAvailable(cat) {
  switch (cat) {
    case 'word': return allWords().length > 4;
    case 'vocab': return allVocab().length > 4;
    case 'verb': return allVerbs().length > 2;
    case 'adj': return allAdj().length > 2;
    case 'part': return allParts().length > 2;
    case 'count': return allCounters().length > 1;
    case 'sent': return allSents().length + allWriting().length > 4;
    case 'order': return allWriting().length > 2;
    case 'listen': return allVocab().length > 4 || allTatoeba().length > 4;
    case 'read': return allLines().length > 4;
    default: return true;
  }
}

// golpe do kanji: varia entre leitura, significado, escolher o kanji, frase e palavras com ele
function qKanjiFamily(c) {
  const words = allWords().filter(w => markupBase(w.w).includes(c) && markupBase(w.w) !== c);
  const sents = allSents().filter(s => { const m = s.s.match(/\[([^|\]]+)\|/); return m && m[1].includes(c); });
  const kaki = wordItems().filter(i => i.base.includes(c) && i.base !== c);
  const opts = [
    [() => Q.kanjiRead(c), 3], [() => Q.kanjiMean(c), 1.2], [() => Q.kanjiPick(c), 1.6],
  ];
  if (sents.length) opts.push([() => Q.sentRead(adaptivePick(sents, s => 'sr:' + s.s)), 2.2]);
  if (words.length) opts.push([() => Q.wordRead(adaptivePick(words, w => 'wr:' + w.read)), 1.8], [() => Q.wordMean(adaptivePick(words, w => 'wm:' + w.read)), 1]);
  if (kaki.length) opts.push([() => Q.spellPick(adaptivePick(kaki, i => 'sp:' + i.read)), 1.4]);
  for (let t = 0; t < 5; t++) {
    const q = wpick(opts, o => o[1])[0]();
    if (q && (!isRecent(q.key) || t === 4)) return q;
  }
  return Q.kanjiRead(c);
}
function qWordFamily(w) {
  const base = markupBase(w.w);
  const sents = allSents().filter(s => plainK(s.s).includes(base));
  const opts = [[() => Q.wordRead(w), 2.4], [() => Q.wordMean(w), 1.4], [() => Q.spellPick({ base, read: w.read, mean: w.mean }), 1.6]];
  if (sents.length) opts.push([() => Q.sentRead(pick(sents)), 1.5]);
  for (let t = 0; t < 5; t++) {
    const q = wpick(opts, o => o[1])[0]();
    if (q && (!isRecent(q.key) || t === 4)) return q;
  }
  return Q.wordRead(w);
}
function qForMove(move) {
  if (move.kind === 'kanji') return qKanjiFamily(move.ref);
  if (move.kind === 'word') return qWordFamily(move.ref);
  if (move.kind === 'write') return Q.write(move.ref);
  return qForCat(move.cat);
}
// defesa: mistura de tudo (menos montar frase e escrever, que são longos)
const DEF_MIX = [['vocab', 3], ['verb', 2.2], ['adj', 1.3], ['part', 1.6], ['count', 1.1], ['kanji', 1.4], ['word', 1], ['sent', 1.2], ['listen', 1], ['read', .7]];
function qForDefense() {
  const cats = DEF_MIX.filter(([c]) => catAvailable(c));
  return qForCat(wpick(cats, x => x[1])[0]);
}
// peso de encontro: kanji que você erra aparecem mais no mato
function kanjiMissWeight(c) {
  const st = qstats(); let s = 0, ok = 0;
  ['kr:' + c, 'km:' + c, 'kp:' + c].forEach(k => { if (st[k]) { s += st[k].s; ok += st[k].ok; } });
  return s ? 1 + ((s - ok) / s) * 2 : 1;
}

// ---------- Interface de pergunta ----------
// opts: { seconds (Infinity = sem tempo), onDone(result) }  result: { ok, close, grade:'ex'|'ok'|'miss', frac }
function askQuestion(box, q, opts) {
  const mode = q.mode || 'mc';
  const typedMode = mode === 'mc' && G.save.opts.answer === 'type' && q.typed;
  const tSec = opts.seconds, timed = isFinite(tSec);
  const romajiB = badgeOn('romaji'), dica = badgeOn('dica');
  let done = false, start = performance.now(), raf = 0, cleanup = [];
  let capOk = false; // no "ouvir", ver o texto limita a nota a BOM
  G.lastQ = q; noteRecent(q.key);
  const optsHTML = () => `<div class="qopts ${q.options.some(o => o.small) ? 'long' : ''}">${q.options.map((o, i) => `<button class="qo" data-i="${i}"><span class="qn">${i + 1}</span><span class="qv jp">${o.html}</span>${romajiB && o.ro ? `<span class="qro">${esc(o.ro)}</span>` : ''}</button>`).join('')}</div>`;
  let body = '';
  if (mode === 'order') body = `<div class="qline" id="q-line"></div><div class="qtiles" id="q-tiles"></div>
      <div class="qrow"><button class="btn tiny sec" id="q-undo">⌫ apagar</button><button class="btn tiny" id="q-send" disabled>OK</button><button class="qskip">não sei</button></div>`;
  else if (mode === 'draw') body = `<div class="hwbox qdraw"><div id="q-hw"></div></div><div class="qrow"><button class="btn tiny sec" id="q-hint">👁 ver o kanji</button><button class="qskip">não sei</button></div>`;
  else if (mode === 'listen') body = `<div class="qlisten"><button class="btn qplay" id="q-play">🔊 Ouvir</button><button class="qskip" id="q-cap">ver texto</button></div><div class="qcap" id="q-captxt"></div>${optsHTML()}`;
  else if (typedMode) body = `
        <div class="qtype">
          <input class="qin" type="text" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="romaji ou kana">
          <button class="btn qok">OK</button>
        </div>
        <div class="qhint">${dica && q.accept ? 'Começa com: <b>' + esc(kanaToRomaji(q.accept[0]).charAt(0)) + '</b>' : ''}</div>
        <button class="qskip">não sei</button>`;
  else body = optsHTML();
  box.innerHTML = `
    <div class="q">
      <div class="qask">${q.cat ? `<span class="qcat">${CATS[q.cat].ic}</span>` : ''}${esc(q.ask)}</div>
      ${q.prompt ? `<div class="qprompt">${q.prompt}</div>` : ''}
      ${timed ? '<div class="qtimer"><div class="qbar"></div></div>' : ''}
      ${body}
    </div>`;
  const bar = $('.qbar', box);
  function finish(ok, close, picked, forceGrade) {
    if (done) return; done = true;
    cancelAnimationFrame(raf); document.removeEventListener('keydown', onKey);
    cleanup.forEach(f => { try { f(); } catch (e) {} });
    const frac = timed ? Math.min(1, (performance.now() - start) / 1000 / tSec) : 0.5;
    let grade = forceGrade || (ok ? ((!close && frac < 0.4 && !capOk) ? 'ex' : 'ok') : 'miss');
    if (!timed && ok && !forceGrade) grade = close ? 'ok' : 'ex';
    qRecord(q.key, ok);
    if (mode === 'mc' || mode === 'listen') {
      if (!typedMode) $$('.qo', box).forEach((b, i) => {
        b.disabled = true;
        if (q.okVals.includes(q.options[i].v)) b.classList.add('right');
        else if (i === picked) b.classList.add('wrong');
      });
      else { const inp = $('.qin', box); if (inp) { inp.disabled = true; inp.classList.add(ok ? 'right' : 'wrong'); } }
    }
    $$('button', box).forEach(b => { if (!b.classList.contains('qo')) b.disabled = true; });
    opts.onDone({ ok, close, grade, frac, typed: typedMode });
  }
  function tick() {
    if (!timed) return;
    const el = (performance.now() - start) / 1000, f = Math.max(0, 1 - el / tSec);
    bar.style.width = (f * 100) + '%';
    bar.style.background = f > .6 ? '#5ad16a' : f > .3 ? '#f2c14e' : '#ef5a5a';
    if (el >= tSec) { finish(false, false, -1); return; }
    raf = requestAnimationFrame(tick);
  }
  function onKey(e) {
    if (done) return;
    if ((mode === 'mc' || mode === 'listen') && !typedMode && /^[1-4]$/.test(e.key)) { const i = +e.key - 1; if (q.options[i]) { e.preventDefault(); choose(i); } }
  }
  function choose(i) { sfx('select'); const ok = q.okVals.includes(q.options[i].v); finish(ok, false, i); }
  const skip = $('.qskip:not(#q-cap)', box); if (skip) skip.onclick = () => finish(false, false, -1);

  if (mode === 'order') {
    const tiles = shuffle(q.tiles.map((t, i) => ({ t, i }))), line = [];
    const norm = s => String(s).replace(/[\s。、！？]/g, '');
    const okSet = new Set(q.accept.map(norm));
    const draw = () => {
      $('#q-line', box).innerHTML = line.length ? line.map(x => `<span class="qtok on">${esc(x.t)}</span>`).join('') : '<span class="dim">toque nos blocos na ordem certa</span>';
      $('#q-tiles', box).innerHTML = tiles.map((x, k) => `<button class="qtok" data-k="${k}" ${line.includes(x) ? 'disabled' : ''}>${esc(x.t)}</button>`).join('');
      $$('#q-tiles .qtok', box).forEach(b => b.onclick = () => { if (done) return; sfx('select'); line.push(tiles[+b.dataset.k]); draw(); if (line.length === tiles.length) submit(); });
      $('#q-send', box).disabled = line.length < tiles.length;
    };
    const submit = () => { const s = norm(line.map(x => x.t).join('')); finish(okSet.has(s), false, -1); };
    $('#q-undo', box).onclick = () => { if (!done && line.length) { line.pop(); draw(); } };
    $('#q-send', box).onclick = submit;
    q.solve = () => { line.length = 0; q.tiles.forEach(t => line.push(tiles.find(x => x.t === t && !line.includes(x)))); submit(); };
    draw();
  } else if (mode === 'draw') {
    const size = Math.min(230, box.clientWidth - 40, window.innerHeight * .3);
    // de memória: o contorno só aparece depois de 2 erros (aí vale no máximo BOM)
    const hw = makeWriter($('#q-hw', box), q.char, Math.max(150, size), true, false);
    let misses = 0;
    if (!hw) { setTimeout(() => finish(false, false, -1), 50); }
    else {
      hw.quiz({
        showHintAfterMisses: 2,
        onMistake: () => { misses++; if (misses === 2) { try { hw.showOutline(); } catch (e) {} } },
        onComplete: s => {
          const m = (s && s.totalMistakes != null) ? s.totalMistakes : misses;
          const st = SPECIES[q.char] ? SPECIES[q.char].strokes : 6;
          if (m <= 1) finish(true, false, -1, 'ex');
          else if (m <= 2 + Math.ceil(st / 3)) finish(true, false, -1, 'ok');
          else finish(false, false, -1);
        },
      });
      // dica: mostra a animação e recomeça (acertando depois disso vale só BOM)
      $('#q-hint', box).onclick = () => {
        if (done) return;
        try {
          hw.cancelQuiz(); hw.showOutline();
          hw.animateCharacter({ onComplete: () => { if (!done) hw.quiz({ showHintAfterMisses: 1, onComplete: () => finish(true, false, -1, 'ok') }); } });
        } catch (e) {}
      };
      cleanup.push(() => { try { hw.cancelQuiz(); } catch (e) {} });
    }
    q.solve = () => finish(true, false, -1, 'ok');
  } else if (mode === 'listen') {
    let au = null;
    const play = () => {
      sfx('select');
      if (q.audio.url) {
        try { if (!au) { au = new Audio(q.audio.url); au.onerror = () => speakForce(q.audio.text); } au.currentTime = 0; au.play().catch(() => speakForce(q.audio.text)); }
        catch (e) { speakForce(q.audio.text); }
      } else speakForce(q.audio.text);
    };
    $('#q-play', box).onclick = play;
    $('#q-cap', box).onclick = () => { capOk = true; $('#q-captxt', box).innerHTML = `<span class="jp">${esc(q.audio.text)}</span>`; $('#q-cap', box).disabled = true; };
    $$('.qo', box).forEach(b => b.onclick = () => choose(+b.dataset.i));
    cleanup.push(() => { if (au) au.pause(); });
    setTimeout(play, 250);
  } else if (typedMode) {
    const inp = $('.qin', box);
    // em conjugação uma letra muda a gramática (かいて ≠ かきて): só vale resposta exata
    const submit = () => { if (!inp.value.trim()) return; const r = checkTyped(inp.value, q.accept); const ok = q.strict ? r === 'exact' : r !== 'wrong'; finish(ok, ok && r === 'close', -1); };
    $('.qok', box).onclick = submit;
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); submit(); } e.stopPropagation(); });
    setTimeout(() => { try { inp.focus(); } catch (e) {} }, 30);
  } else {
    $$('.qo', box).forEach(b => b.onclick = () => choose(+b.dataset.i));
  }
  document.addEventListener('keydown', onKey);
  raf = requestAnimationFrame(tick);
  return { cancel() { done = true; cancelAnimationFrame(raf); document.removeEventListener('keydown', onKey); cleanup.forEach(f => { try { f(); } catch (e) {} }); } };
}
// fala mesmo com a voz de pronúncia desligada (no "ouvir" o áudio é a pergunta)
function speakForce(text) {
  if (!text || !window.speechSynthesis) return;
  const was = G.save.opts.voice; G.save.opts.voice = true; speak(text); G.save.opts.voice = was;
}
function qSeconds(q, phase) {
  const typed = G.save.opts.answer === 'type' && q.typed && (!q.mode || q.mode === 'mc');
  let s = phase === 'def' ? (typed ? 11 : 7) : (typed ? 13 : 9);
  if (typed && isTouch()) s += 4;
  s += q.extra || 0;
  if (badgeOn('tempo')) s *= 1.5;
  return s;
}
