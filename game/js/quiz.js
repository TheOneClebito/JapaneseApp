'use strict';
// ============================================================
//  QUIZ — desafios gerados dos seus dados + repetição adaptativa
//  (o que você mais erra aparece mais)
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

// ---------- Fontes de conteúdo ----------
const kanjiReadings = c => { const sp = SPECIES[c]; return [...new Set((sp.kun || []).concat(sp.on || []).map(cleanReading).filter(Boolean))]; };
let _vocab = null;
function allVocab() {
  if (_vocab) return _vocab;
  const seen = new Set(); _vocab = [];
  (window.VOCAB_DECKS || []).forEach(d => d.cards.forEach(c => {
    if (/[A-Za-z]/.test(c.jp) || seen.has(c.jp)) return;
    seen.add(c.jp); _vocab.push({ jp: c.jp, kana: c.kana || c.jp, mean: c.mean });
  }));
  return _vocab;
}
const allWords = () => window.KANJI_WORDS || [];
const allVerbs = () => window.VERBS_DATA || [];

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

// ---------- Construtores ----------
const Q = {
  kanjiRead(c) {
    const reads = kanjiReadings(c), shown = pick(reads);
    const others = Object.keys(SPECIES).filter(k => k !== c).flatMap(kanjiReadings).filter(r => !reads.includes(r));
    const stems = (SPECIES[c].kun || []).map(readingStem).filter(s => s && s.length >= 2);
    return {
      key: 'kr:' + c, kind: 'kanjiRead', ask: 'Qual é uma leitura deste kanji?',
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
      key: 'km:' + c, kind: 'kanjiMean', ask: 'O que significa?', prompt: `<span class="qk">${esc(c)}</span>`, typed: false,
      okVals: [m], options: mcOptions(m, others).map(v => ({ v, html: esc(v) })),
      answer: `<b class="jp">${esc(c)}</b> = ${esc(m)} <span class="dim">(${readHTML(c)})</span>`,
      speak: toHira(kanjiReadings(c)[0]),
    };
  },
  wordRead(w) {
    const others = allWords().filter(x => x.read !== w.read).map(x => x.read);
    const near = others.filter(r => Math.abs(r.length - w.read.length) <= 1);
    return {
      key: 'wr:' + w.read, kind: 'wordRead', ask: 'Como se lê?', prompt: `<span class="qj">${jpHTML(w.w, false)}</span>`, typed: true,
      accept: [w.read], okVals: [w.read],
      options: mcOptions(w.read, near.length >= 3 ? near : others).map(v => ({ v, html: esc(v), ro: kanaToRomaji(v) })),
      answer: `<b class="jp">${jpHTML(w.w, true)}</b> = ${esc(w.read)} <span class="dim">— ${esc(w.mean)}</span>`,
      speak: w.read,
    };
  },
  wordMean(w) {
    const others = allWords().filter(x => x.mean !== w.mean).map(x => x.mean);
    return {
      key: 'wm:' + w.read, kind: 'wordMean', ask: 'O que significa?', prompt: `<span class="qj">${jpHTML(w.w, badgeOn('furi'))}</span>`, typed: false,
      okVals: [w.mean], options: mcOptions(w.mean, others).map(v => ({ v, html: esc(v) })),
      answer: `<b class="jp">${jpHTML(w.w, true)}</b> (${esc(w.read)}) = ${esc(w.mean)}`,
      speak: w.read,
    };
  },
  vocabMean(v) {
    const others = allVocab().filter(x => x.mean !== v.mean).map(x => x.mean);
    const sub = (v.kana !== v.jp) ? `<div class="qsub">${esc(v.kana)}</div>` : (badgeOn('romaji') ? `<div class="qsub">${esc(kanaToRomaji(v.kana))}</div>` : '');
    return {
      key: 'vm:' + v.jp, kind: 'vocabMean', ask: 'O que significa?', prompt: `<span class="qj">${esc(v.jp)}</span>${sub}`, typed: false,
      okVals: [v.mean], options: mcOptions(v.mean, others).map(x => ({ v: x, html: esc(x) })),
      answer: `<b class="jp">${esc(v.jp)}</b>${v.kana !== v.jp ? ' (' + esc(v.kana) + ')' : ''} = ${esc(v.mean)}`,
      speak: v.kana,
    };
  },
  vocabRev(v) {
    const others = allVocab().filter(x => x.kana !== v.kana).map(x => x.kana);
    return {
      key: 'vr:' + v.jp, kind: 'vocabRev', ask: 'Como se diz em japonês?', prompt: `<span class="qpt">${esc(v.mean)}</span>`, typed: true,
      accept: [v.kana], okVals: [v.kana],
      options: mcOptions(v.kana, others).map(x => ({ v: x, html: esc(x), ro: kanaToRomaji(x) })),
      answer: `${esc(v.mean)} = <b class="jp">${esc(v.kana)}</b> <span class="dim">(${esc(kanaToRomaji(v.kana))})</span>`,
      speak: v.kana,
    };
  },
  verbForm(v, form) {
    const ok = form === 'te' ? teForm(v) : naiForm(v);
    const k = v.kana, stem = k.slice(0, -1);
    const iRow = { 'う': 'い', 'く': 'き', 'ぐ': 'ぎ', 'す': 'し', 'つ': 'ち', 'ぬ': 'に', 'ぶ': 'び', 'む': 'み', 'る': 'り' }[k.slice(-1)] || '';
    let wrong;
    if (form === 'te') {
      wrong = [stem + 'て', stem + 'って', stem + 'んで', stem + 'いて', stem + 'して', stem + iRow + 'て'];
      if (k.endsWith('くる')) wrong.push(k.slice(0, -2) + 'きって', k.slice(0, -2) + 'くって');
      if (k.endsWith('いく')) wrong.push(k.slice(0, -2) + 'いいて', k.slice(0, -2) + 'いきて');
      if (k.endsWith('する')) wrong.push(k.slice(0, -2) + 'すって', k.slice(0, -2) + 'さて');
    } else {
      wrong = [stem + 'ない', stem + 'らない', stem + 'わない', stem + iRow + 'ない', k + 'ない'];
      if (k.endsWith('くる')) wrong.push(k.slice(0, -2) + 'きない', k.slice(0, -2) + 'くない');
      if (k.endsWith('する')) wrong.push(k.slice(0, -2) + 'さない', k.slice(0, -2) + 'すない');
    }
    wrong = [...new Set(wrong)].filter(x => x !== ok && x !== k);
    const label = form === 'te' ? 'て' : 'ない';
    return {
      key: (form === 'te' ? 'vt:' : 'vn:') + k, kind: 'verb', strict: true, ask: `Coloque na forma ${label}:`,
      prompt: `<span class="qj">${esc(v.jp)}</span><div class="qsub">${esc(v.kana)} · ${esc(v.meaning)}</div>`, typed: true,
      accept: [ok], okVals: [ok],
      options: mcOptions(ok, wrong).map(x => ({ v: x, html: esc(x), ro: kanaToRomaji(x) })),
      answer: `${esc(v.jp)} → <b class="jp">${esc(ok)}</b> <span class="dim">(${esc(kanaToRomaji(ok))})</span>`,
      speak: ok,
    };
  },
};

// ---------- Escolha adaptativa ----------
function adaptivePick(pool, keyFn) {
  if (!pool.length) return null;
  const sample = pool.length > 40 ? shuffle(pool.slice()).slice(0, 40) : pool;
  return wpick(sample, it => qWeight(keyFn(it)));
}
function qForMove(move) {
  if (move.kind === 'kanji') return Math.random() < .6 ? Q.kanjiRead(move.ref) : Q.kanjiMean(move.ref);
  return Math.random() < .6 ? Q.wordRead(move.ref) : Q.wordMean(move.ref);
}
function qForDefense() {
  const kinds = [];
  if (allVocab().length > 4) kinds.push(['vm', 3], ['vr', 1.5]);
  if (allVerbs().length) kinds.push(['vt', 2], ['vn', 1.5]);
  kinds.push(['km', 1.5]);
  if (allWords().length > 4) kinds.push(['wm', 1]);
  const k = wpick(kinds, x => x[1])[0];
  if (k === 'vm') return Q.vocabMean(adaptivePick(allVocab(), v => 'vm:' + v.jp));
  if (k === 'vr') return Q.vocabRev(adaptivePick(allVocab(), v => 'vr:' + v.jp));
  if (k === 'vt') return Q.verbForm(adaptivePick(allVerbs(), v => 'vt:' + v.kana), 'te');
  if (k === 'vn') return Q.verbForm(adaptivePick(allVerbs(), v => 'vn:' + v.kana), 'nai');
  if (k === 'wm') return Q.wordMean(adaptivePick(allWords(), w => 'wm:' + w.read));
  return Q.kanjiMean(adaptivePick(Object.keys(SPECIES), c => 'km:' + c));
}
function qForSpecial() {
  const r = Math.random();
  if (r < .35) return Q.kanjiRead(adaptivePick(Object.keys(SPECIES), c => 'kr:' + c));
  if (r < .6) return Q.wordRead(adaptivePick(allWords(), w => 'wr:' + w.read));
  return qForDefense();
}
// peso de encontro: kanji que você erra aparecem mais no mato
function kanjiMissWeight(c) {
  const st = qstats(); let s = 0, ok = 0;
  ['kr:' + c, 'km:' + c].forEach(k => { if (st[k]) { s += st[k].s; ok += st[k].ok; } });
  return s ? 1 + ((s - ok) / s) * 2 : 1;
}

// ---------- Interface de pergunta (timer + resposta) ----------
// opts: { seconds, onDone(result) }  result: { ok, close, grade:'ex'|'ok'|'miss', frac }
function askQuestion(box, q, opts) {
  const typedMode = G.save.opts.answer === 'type' && q.typed;
  const tSec = opts.seconds;
  const romajiB = badgeOn('romaji'), dica = badgeOn('dica');
  let done = false, start = performance.now(), raf = 0;
  G.lastQ = q;
  box.innerHTML = `
    <div class="q">
      <div class="qask">${esc(q.ask)}</div>
      <div class="qprompt">${q.prompt}</div>
      <div class="qtimer"><div class="qbar"></div></div>
      ${typedMode ? `
        <div class="qtype">
          <input class="qin" type="text" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="romaji ou kana">
          <button class="btn qok">OK</button>
        </div>
        <div class="qhint">${dica && q.accept ? 'Começa com: <b>' + esc(kanaToRomaji(q.accept[0]).charAt(0)) + '</b>' : ''}</div>
        <button class="qskip">não sei</button>`
      : `<div class="qopts">${q.options.map((o, i) => `<button class="qo" data-i="${i}"><span class="qn">${i + 1}</span><span class="qv jp">${o.html}</span>${romajiB && o.ro ? `<span class="qro">${esc(o.ro)}</span>` : ''}</button>`).join('')}</div>`}
    </div>`;
  const bar = $('.qbar', box);
  function finish(ok, close, picked) {
    if (done) return; done = true;
    cancelAnimationFrame(raf); document.removeEventListener('keydown', onKey);
    const frac = Math.min(1, (performance.now() - start) / 1000 / tSec);
    const grade = ok ? ((!close && frac < 0.4) ? 'ex' : 'ok') : 'miss';
    qRecord(q.key, ok);
    if (!typedMode) {
      $$('.qo', box).forEach((b, i) => {
        b.disabled = true;
        if (q.okVals.includes(q.options[i].v)) b.classList.add('right');
        else if (i === picked) b.classList.add('wrong');
      });
    } else { const inp = $('.qin', box); if (inp) { inp.disabled = true; inp.classList.add(ok ? 'right' : 'wrong'); } }
    opts.onDone({ ok, close, grade, frac, typed: typedMode });
  }
  function tick() {
    const el = (performance.now() - start) / 1000, f = Math.max(0, 1 - el / tSec);
    bar.style.width = (f * 100) + '%';
    bar.style.background = f > .6 ? '#5ad16a' : f > .3 ? '#f2c14e' : '#ef5a5a';
    if (el >= tSec) { finish(false, false, -1); return; }
    raf = requestAnimationFrame(tick);
  }
  function onKey(e) {
    if (done) return;
    if (!typedMode && /^[1-4]$/.test(e.key)) { const i = +e.key - 1; if (q.options[i]) { e.preventDefault(); choose(i); } }
  }
  function choose(i) { sfx('select'); const ok = q.okVals.includes(q.options[i].v); finish(ok, false, i); }
  if (typedMode) {
    const inp = $('.qin', box);
    // em conjugação uma letra muda a gramática (かいて ≠ かきて): só vale resposta exata
    const submit = () => { if (!inp.value.trim()) return; const r = checkTyped(inp.value, q.accept); const ok = q.strict ? r === 'exact' : r !== 'wrong'; finish(ok, ok && r === 'close', -1); };
    $('.qok', box).onclick = submit;
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); submit(); } e.stopPropagation(); });
    $('.qskip', box).onclick = () => finish(false, false, -1);
    setTimeout(() => { try { inp.focus(); } catch (e) {} }, 30);
  } else {
    $$('.qo', box).forEach(b => b.onclick = () => choose(+b.dataset.i));
  }
  document.addEventListener('keydown', onKey);
  raf = requestAnimationFrame(tick);
  return { cancel() { done = true; cancelAnimationFrame(raf); document.removeEventListener('keydown', onKey); } };
}
function qSeconds(q, phase) {
  const typed = G.save.opts.answer === 'type' && q.typed;
  let s = phase === 'def' ? (typed ? 11 : 7) : (typed ? 13 : 9);
  if (typed && isTouch()) s += 4;
  if (badgeOn('tempo')) s *= 1.5;
  return s;
}
