'use strict';
// ============================================================
//  TREINOS — Dojo (treinos sem tempo de cada assunto do app de estudo),
//  Biblioteca (ler as histórias e responder) e o Doutor das Charadas.
// ============================================================
// XP fora da batalha (sem mensagens na caixa da batalha)
function gainXPQuiet(inst, amt) {
  const ups = [];
  inst.xp += amt;
  while (inst.xp >= xpToNext(inst.lv)) {
    inst.xp -= xpToNext(inst.lv);
    const before = statsOf(inst).maxhp; inst.lv++;
    inst.hp = Math.max(0, inst.hp) + statsOf(inst).maxhp - before;
    ups.push(inst.lv);
    movesFor(inst.sp).filter(m => m.lv === inst.lv).forEach(m => ups.push(m));
  }
  return ups;
}
function rewardLead(xp) {
  const lead = G.save.party[0]; if (!lead) return '';
  const ups = gainXPQuiet(lead, xp);
  const lv = ups.filter(u => typeof u === 'number'), mv = ups.filter(u => typeof u === 'object');
  if (lv.length) sfx('levelup');
  return `<b class="jp">${esc(lead.sp)}</b> ganhou ${xp} XP${lv.length ? ` · ⭐ subiu pro nível ${lv[lv.length - 1]}!` : ''}${mv.map(m => `<br>✨ aprendeu <b class="jp">${jpHTML(m.label, true)}</b> (${esc(CATS[m.cat].pt)})`).join('')}`;
}
// uma pergunta dentro de um painel, sem tempo, com a resposta revelada no fim
function panelQuestion(box, q, onNext, nextLabel = 'Próxima ▸') {
  askQuestion(box, q, {
    seconds: Infinity,
    onDone: r => {
      sfx(r.ok ? 'confirm' : 'wrong');
      speak(q.speak);
      box.insertAdjacentHTML('beforeend', `<div class="reveal ${r.ok ? 'ok' : 'no'}">${r.ok ? '✅ ' : '❌ '}${r.close ? '<span class="close">Quase! Pequeno erro de digitação.</span> ' : ''}${q.answer}</div>
        <div class="brow"><button class="btn" id="pq-next">${nextLabel}</button></div>`);
      const nb = $('#pq-next', box);
      nb.onclick = () => onNext(r);
      try { nb.focus(); } catch (e) {}
    },
  });
}

const DOJO_CATS = ['vocab', 'kanji', 'word', 'verb', 'adj', 'part', 'count', 'sent', 'order', 'listen', 'read', 'write'];
const DOJO_LEN = { write: 5, order: 6 };
Object.assign(UI, {
  openDojo() {
    Music.play('dojo');
    const best = G.save.dojo || (G.save.dojo = {});
    const cats = DOJO_CATS.filter(catAvailable);
    const b = this.panel('道場 · Dojo', `
      <p class="jp">どうじょうへ ようこそ！ たくさん れんしゅうしましょう。</p>
      <p class="dim">Treinos <b>sem tempo</b>, com a resposta explicada no fim de cada pergunta. Cada acerto dá 円 e XP pro kotodama da frente (★ = seu recorde).</p>
      <div class="dojo-grid">${cats.map(c => `<button class="dojo-b" data-c="${c}"><span class="dic jp">${CATS[c].ic}</span><span>${esc(CATS[c].pt)}</span><small>${best[c] ? '★ ' + best[c].best + '/' + (DOJO_LEN[c] || 10) : 'novo'}</small></button>`).join('')}
        <button class="dojo-b mix" data-c="mix"><span class="dic">🎲</span><span>Misto (tudo)</span><small>${best.mix ? '★ ' + best.mix.best + '/10' : 'novo'}</small></button></div>`,
      { onClose: () => Music.play(W.map.music) });
    $$('.dojo-b', b).forEach(x => x.onclick = () => { sfx('confirm'); this.runDrill(x.dataset.c); });
  },
  runDrill(cat) {
    const total = DOJO_LEN[cat] || 10, cats = DOJO_CATS.filter(c => c !== 'write' && catAvailable(c));
    const st = { n: 0, ok: 0 };
    const step = () => {
      if (st.n >= total) return this.drillEnd(cat, st.ok, total);
      const c = cat === 'mix' ? pick(cats) : cat;
      const q = qForCat(c);
      const b = this.panel(`道場 · <span class="jp">${cat === 'mix' ? '🎲' : CATS[cat].ic}</span> ${cat === 'mix' ? 'Misto' : esc(CATS[cat].pt)}`, `
        <div class="dojo-prog"><span>${st.n + 1}/${total}</span><span>✅ ${st.ok}</span><div class="dojo-bar"><div style="width:${st.n / total * 100}%"></div></div></div>
        <div class="dojo-q" id="dq"></div>`, { wide: true, onClose: () => Music.play(W.map.music) });
      panelQuestion($('#dq', b), q, r => { st.n++; if (r.ok) st.ok++; step(); }, st.n + 1 >= total ? 'Ver resultado ▸' : 'Próxima ▸');
    };
    step();
  },
  drillEnd(cat, ok, total) {
    const perfect = ok === total;
    const money = ok * 4 + (perfect ? 25 : 0);
    const xp = Math.round((ok * 5 + (perfect ? 15 : 0)) * (1 + (G.save.party[0] ? G.save.party[0].lv : 1) * 0.12));
    G.save.money += money;
    const d = G.save.dojo || (G.save.dojo = {}), rec = d[cat] || (d[cat] = { best: 0, runs: 0 });
    const newBest = ok > rec.best; rec.best = Math.max(rec.best, ok); rec.runs++;
    const xpMsg = rewardLead(xp);
    sfx(perfect ? 'victory' : 'coin'); saveGame(); refreshHUD();
    const b = this.panel('道場 · Resultado', `
      <div class="center dojo-res">
        <div class="big">${perfect ? '🏆' : ok >= total * .7 ? '🎉' : '💪'} ${ok}/${total}</div>
        <p class="jp">${perfect ? 'かんぺき！ すばらしい！' : ok >= total * .7 ? 'よく できました！' : 'がんばりましたね。もう いちど！'}</p>
        <p>💰 +${money}円${perfect ? ' (bônus de perfeito!)' : ''}${newBest ? ' · 🌟 novo recorde!' : ''}</p>
        <p>${xpMsg}</p>
      </div>
      <div class="brow"><button class="btn" id="dr-again">🔁 De novo</button><button class="btn sec" id="dr-back">↩ Outros treinos</button></div>`,
      { onClose: () => Music.play(W.map.music) });
    $('#dr-again', b).onclick = () => { sfx('confirm'); this.runDrill(cat); };
    $('#dr-back', b).onclick = () => { sfx('cancel'); this.openDojo(); };
  },

  // ----- Biblioteca -----
  openLibrary() {
    const list = window.READINGS || [], done = G.save.readDone || (G.save.readDone = {});
    const b = this.panel('としょかん · Biblioteca', `
      <p class="jp">しずかに よんで くださいね。</p>
      <p class="dim">Leia as histórias do app (frase por frase, com botões de romaji e tradução) e responda 3 perguntas no fim. Primeira leitura de cada história dá um prêmio!</p>
      <div class="plist">${list.map((r, k) => `<button class="prow lib" data-k="${k}"><span class="lib-ic">${done[r.id] ? '✅' : '📖'}</span>
        <span class="pinfo"><b class="jp">${esc(r.title)}</b><small class="dim">${esc(r.sub || '')} · ${esc(r.level || '')} · ${r.lines.length} frases</small></span></button>`).join('') || '<p class="dim">Nenhuma história no app ainda.</p>'}</div>`);
    $$('.prow.lib', b).forEach(x => x.onclick = () => { sfx('confirm'); this.readStory(list[+x.dataset.k]); });
  },
  readStory(r) {
    this.close();
    Dialog.show(r.lines.map(l => ({ jp: l.jp, pt: l.pt })), { name: r.title, look: 'noble', onDone: () => this.storyQuiz(r) });
  },
  storyQuiz(r) {
    const lines = shuffle(allLines().filter(L => L.r === r)).slice(0, 3);
    const st = { n: 0, ok: 0 };
    const step = () => {
      if (st.n >= lines.length) {
        const done = G.save.readDone || (G.save.readDone = {}), first = !done[r.id];
        const money = first ? 80 : 15 + st.ok * 5;
        done[r.id] = true; G.save.money += money;
        if (first) G.save.items.kusuri = (G.save.items.kusuri || 0) + 2;
        const xpMsg = rewardLead(first ? 60 : 20 + st.ok * 6);
        sfx('coin'); saveGame(); refreshHUD();
        const b = this.panel('📖 História completa!', `<div class="center dojo-res"><div class="big">${st.ok}/${lines.length}</div>
          <p class="jp">よく よみました！</p><p>💰 +${money}円${first ? ' · 🎁 くすり ×2 (primeira leitura!)' : ''}</p><p>${xpMsg}</p></div>
          <div class="brow"><button class="btn" id="lb-back">📚 Outras histórias</button></div>`);
        $('#lb-back', b).onclick = () => { sfx('confirm'); this.openLibrary(); };
        return;
      }
      const b = this.panel(`📖 <span class="jp">${esc(r.title)}</span> · ${st.n + 1}/${lines.length}`, `<div class="dojo-q" id="lq"></div>`, { wide: true });
      panelQuestion($('#lq', b), Q.readLine(lines[st.n]), res => { st.n++; if (res.ok) st.ok++; step(); });
    };
    step();
  },

  // ----- Doutor das charadas: uma pergunta surpresa por conversa -----
  openRiddle(n) {
    const cats = DOJO_CATS.filter(c => c !== 'write' && catAvailable(c));
    const q = qForCat(pick(cats));
    const b = this.panel(`❓ ${esc(n.name)}`, `<div class="dojo-q" id="rq"></div>`, { wide: true });
    askQuestion($('#rq', b), q, {
      seconds: Infinity,
      onDone: r => {
        speak(q.speak);
        if (r.ok) { G.save.money += 20; sfx('coin'); } else sfx('wrong');
        $('#rq', b).insertAdjacentHTML('beforeend', `<div class="reveal ${r.ok ? 'ok' : 'no'}">${r.ok ? '✅ せいかい！ +20円' : '❌ ざんねん…'} ${q.answer}</div>
          <div class="brow"><button class="btn" id="rq-more">❓ Outra!</button><button class="btn sec" id="rq-bye">Tchau</button></div>`);
        refreshHUD(); saveGame();
        $('#rq-more', b).onclick = () => { sfx('confirm'); this.openRiddle(n); };
        $('#rq-bye', b).onclick = () => { sfx('cancel'); this.close(); };
      },
    });
  },
});
