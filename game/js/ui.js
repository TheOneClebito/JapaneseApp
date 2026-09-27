'use strict';
// ============================================================
//  UI — diálogos, menus, equipe, 図鑑, itens, insígnias, loja,
//  pousada, santuário (fusão com escrita do kanji), introdução.
// ============================================================

// romaji "de leitura": は/へ/を como partículas viram wa/e/o
function romajiLine(s) {
  return String(s).split(/[ 　]+/).map(tok => {
    let r = kanaToRomaji(markupKana(tok));
    if (tok.length > 1 && /は[、。！？!?」…]*$/.test(tok)) r = r.replace(/ha([,.!?"、。！？」…]*)$/, 'wa$1');
    if (tok.length > 1 && /へ[、。！？!?」…]*$/.test(tok)) r = r.replace(/he([,.!?"、。！？」…]*)$/, 'e$1');
    if (tok.includes('を')) r = r.replace(/wo/g, 'o');
    return r;
  }).join(' ').replace(/、/g, ', ').replace(/。/g, '. ').replace(/！/g, '! ').replace(/？/g, '? ').replace(/[「」]/g, '"').replace(/…/g, '... ').replace(/：/g, ': ').replace(/\s+/g, ' ').trim();
}

// ---------- Diálogo ----------
const Dialog = {
  open: false, lines: [], i: 0, opts: {}, showTr: false,
  show(lines, opts = {}) {
    if (!lines || !lines.length) { opts.onDone && opts.onDone(); return; }
    this.open = true; this.lines = lines; this.i = 0; this.opts = opts; this.showTr = false;
    G.busy = true; this.render();
  },
  render() {
    const L = this.lines[this.i], el = $('#dialog');
    const tr = this.showTr || badgeOn('trad') || this.opts.forceTrad;
    el.innerHTML = `
      <div class="dlg">
        ${this.opts.name ? `<div class="dlg-name jp">${esc(this.opts.name)}</div>` : ''}
        <div class="dlg-jp jp">${jpHTML(L.jp, badgeOn('furi'))}</div>
        ${badgeOn('romaji') ? `<div class="dlg-ro">${esc(romajiLine(L.jp))}</div>` : ''}
        <div class="dlg-pt" style="display:${tr ? 'block' : 'none'}">${esc(L.pt)}</div>
        <div class="dlg-bar">
          <button class="dlg-tr">${tr ? '訳 ✓' : '訳 traduzir'}</button>
          <button class="dlg-say">🔊</button>
          <span class="dlg-next">${this.i < this.lines.length - 1 ? '▼' : '■'}</span>
        </div>
      </div>`;
    el.classList.add('show');
    $('.dlg-tr', el).onclick = e => { e.stopPropagation(); this.showTr = !this.showTr; sfx('select'); this.render(); };
    $('.dlg-say', el).onclick = e => { e.stopPropagation(); speak(markupKana(L.jp)); };
    $('.dlg', el).onclick = () => this.next();
  },
  next() {
    if (!this.open) return;
    sfx('select');
    if (this.i < this.lines.length - 1) { this.i++; this.render(); return; }
    this.close();
  },
  close() {
    this.open = false; $('#dialog').classList.remove('show'); $('#dialog').innerHTML = '';
    G.busy = false; Input.clearHold();
    const cb = this.opts.onDone; this.opts = {};
    if (cb) cb();
  },
};

// ---------- Painéis ----------
const UI = {
  stack: [],
  panel(title, html, opts = {}) {
    const el = $('#panel');
    el.innerHTML = `<div class="pwin ${opts.wide ? 'wide' : ''}">
        <div class="phead"><span class="ptitle">${title}</span>${opts.noClose ? '' : '<button class="pclose">✕</button>'}</div>
        <div class="pbody">${html}</div></div>`;
    el.classList.add('show'); G.busy = true;
    this.onClose = opts.onClose || null;
    if (!opts.noClose) $('.pclose', el).onclick = () => { sfx('cancel'); this.close(); };
    return $('.pbody', el);
  },
  close() {
    const el = $('#panel'); el.classList.remove('show'); el.innerHTML = '';
    G.busy = false; Input.clearHold();
    const cb = this.onClose; this.onClose = null; if (cb) cb();
    refreshHUD(); saveGame();
  },
  get isOpen() { return $('#panel').classList.contains('show'); },

  // ----- Menu principal -----
  openMenu() {
    if (G.busy) return;
    sfx('confirm');
    const b = this.panel('メニュー · Menu', `
      <div class="mgrid">
        <button class="mbtn" data-a="party">👾<span>Kotodama</span></button>
        <button class="mbtn" data-a="dex">📖<span>図鑑 Kotodex</span></button>
        <button class="mbtn" data-a="items">🎒<span>Itens</span></button>
        <button class="mbtn" data-a="badges">🏅<span>Insígnias</span></button>
        <button class="mbtn" data-a="save">💾<span>Salvar</span></button>
        <button class="mbtn" data-a="opts">⚙️<span>Opções</span></button>
        <button class="mbtn" data-a="help">❓<span>Como jogar</span></button>
        <button class="mbtn" data-a="study">📚<span>App de estudo</span></button>
      </div>
      <div class="mfoot">💰 ${G.save.money}円 · ⏱ ${Math.floor(G.save.play / 60)} min de jogo</div>`);
    $$('.mbtn', b).forEach(x => x.onclick = () => {
      sfx('select');
      const a = x.dataset.a;
      if (a === 'party') this.openParty();
      else if (a === 'dex') this.openDex();
      else if (a === 'items') this.openItems();
      else if (a === 'badges') this.openBadges();
      else if (a === 'save') { saveGame(); toast('💾 Jogo salvo!'); }
      else if (a === 'opts') this.openOptions();
      else if (a === 'help') this.openHelp();
      else if (a === 'study') location.href = '../';
    });
  },

  // ----- Equipe -----
  openParty(back) {
    const P = G.save.party, Bx = G.save.box;
    const row = (i, where, idx) => {
      const st = statsOf(i), f = clamp(i.hp / st.maxhp, 0, 1);
      return `<button class="prow" data-w="${where}" data-i="${idx}">
        <img class="pico" src="${spiritIcon(i.sp, 48)}">
        <span class="pinfo"><span>${elChip(SPECIES[i.sp].el)} <b class="jp">${esc(i.sp)}</b> ${esc(SPECIES[i.sp].name)} <small>Nv${i.lv}</small></span>
        <span class="mini-hp"><span style="width:${f * 100}%;background:${f > .5 ? '#5ad16a' : f > .2 ? '#f2c14e' : '#ef5a5a'}"></span></span>
        <small class="dim">${i.hp}/${st.maxhp} HP · ${esc(SPECIES[i.sp].mean)}</small></span>
        ${where === 'p' && idx === 0 ? '<span class="lead">★</span>' : ''}</button>`;
    };
    const b = this.panel('ことだま · Equipe', `
      <div class="plist">${P.map((i, k) => row(i, 'p', k)).join('') || '<p class="dim">Nenhum kotodama ainda.</p>'}</div>
      <h4>📦 Caixa (${Bx.length})</h4>
      <div class="plist">${Bx.map((i, k) => row(i, 'b', k)).join('') || '<p class="dim">Vazia. Capturas com a equipe cheia (6) vêm pra cá.</p>'}</div>`,
      { onClose: back });
    $$('.prow', b).forEach(x => x.onclick = () => { sfx('select'); this.openSpirit(x.dataset.w, +x.dataset.i, back); });
  },
  openSpirit(where, idx, back) {
    const list = where === 'p' ? G.save.party : G.save.box, i = list[idx];
    const sp = SPECIES[i.sp], st = statsOf(i);
    const b = this.panel(`<span class="jp">${esc(i.sp)}</span> ${esc(sp.name)}`, `
      <div class="sdet">
        <img class="sbig" src="${spiritIcon(i.sp, 96)}">
        <div>
          <div>${elChip(sp.el)} <b>${ELEM[sp.el].pt}</b> · Nv${i.lv}</div>
          <div class="kinfo"><b>Significado:</b> ${esc(sp.mean)}</div>
          <div class="kinfo"><b>kun:</b> <span class="jp">${esc(sp.kun.join('・') || '—')}</span> · <b>on:</b> <span class="jp">${esc(sp.on.join('・') || '—')}</span></div>
          <div class="kinfo"><b>Traços:</b> ${sp.strokes}</div>
          <div class="kinfo dim">HP ${i.hp}/${st.maxhp} · ATQ ${st.atk} · DEF ${st.def} · XP ${i.xp}/${xpToNext(i.lv)}</div>
        </div>
      </div>
      <h4>Golpes</h4>
      <div class="moves">${movesFor(i.sp).map(m => `<div class="mv ${m.lv > i.lv ? 'locked' : ''}"><span class="jp">${jpHTML(m.label, true)}</span>
        <small>${m.kind === 'word' ? esc(m.ref.mean) : 'kanji'} · poder ${m.power} ${m.lv > i.lv ? '· 🔒 Nv' + m.lv : ''}</small></div>`).join('')}</div>
      <div class="hwbox"><div id="hw-anim"></div></div>
      <div class="brow">
        <button class="btn" id="s-anim">✍️ Ver traços</button>
        ${where === 'p' && idx > 0 ? '<button class="btn" id="s-lead">★ Colocar na frente</button>' : ''}
        ${where === 'p' && G.save.party.length > 1 ? '<button class="btn sec" id="s-box">📦 Guardar</button>' : ''}
        ${where === 'b' && G.save.party.length < 6 ? '<button class="btn" id="s-take">⬆ Levar na equipe</button>' : ''}
        <button class="btn sec" id="s-back">↩ Voltar</button>
      </div>`, { onClose: back });
    const hw = makeWriter($('#hw-anim', b), i.sp, 150, false);
    $('#s-anim', b).onclick = () => { if (hw) hw.animateCharacter(); speak(toHira(kanjiReadings(i.sp)[0])); };
    const lead = $('#s-lead', b); if (lead) lead.onclick = () => { G.save.party.splice(idx, 1); G.save.party.unshift(i); sfx('confirm'); this.openParty(back); };
    const bx = $('#s-box', b); if (bx) bx.onclick = () => { G.save.party.splice(idx, 1); G.save.box.push(i); sfx('confirm'); this.openParty(back); };
    const tk = $('#s-take', b); if (tk) tk.onclick = () => { G.save.box.splice(idx, 1); G.save.party.push(i); sfx('confirm'); this.openParty(back); };
    $('#s-back', b).onclick = () => { sfx('cancel'); this.openParty(back); };
  },

  // ----- 図鑑 -----
  openDex() {
    const all = Object.keys(SPECIES);
    const seen = all.filter(c => G.save.dex[c] && G.save.dex[c].seen).length;
    const caught = all.filter(c => G.save.dex[c] && G.save.dex[c].caught).length;
    const b = this.panel('図鑑 · Kotodex', `
      <div class="dexsum">Vistos <b>${seen}</b> · Capturados <b>${caught}</b> / ${all.length}</div>
      <div class="dexgrid">${all.map(c => {
        const d = G.save.dex[c] || {};
        if (!d.seen) return `<div class="dexc unk">？</div>`;
        return `<button class="dexc ${d.caught ? '' : 'seen'}" data-c="${c}"><img src="${spiritIcon(c, 40)}"><span class="jp">${esc(c)}</span></button>`;
      }).join('')}</div>`, { wide: true });
    $$('.dexc[data-c]', b).forEach(x => x.onclick = () => { sfx('select'); this.openDexEntry(x.dataset.c); });
  },
  openDexEntry(c) {
    const sp = SPECIES[c], d = G.save.dex[c] || {};
    const recipes = FUSIONS.filter(f => f.a === c || f.b === c || f.r === c);
    const b = this.panel(`図鑑 · <span class="jp">${esc(c)}</span> ${esc(sp.name)}`, `
      <div class="sdet">
        <img class="sbig ${d.caught ? '' : 'gray'}" src="${spiritIcon(c, 96)}">
        <div>
          <div>${elChip(sp.el)} <b>${ELEM[sp.el].pt}</b> ${d.caught ? '· ✅ capturado' : '· 👀 visto'}</div>
          <div class="kinfo"><b>Significado:</b> ${esc(sp.mean)}</div>
          <div class="kinfo"><b>kun:</b> <span class="jp">${esc(sp.kun.join('・') || '—')}</span> · <b>on:</b> <span class="jp">${esc(sp.on.join('・') || '—')}</span></div>
          <div class="kinfo"><b>Traços:</b> ${sp.strokes} · <b>Onde:</b> ${esc(whereFound(c))}</div>
          <div class="kinfo dim">${esc(ELEM_FLAVOR[sp.el])}</div>
        </div>
      </div>
      ${recipes.length ? `<h4>Fusões</h4>${recipes.map(f => `<div class="recipe"><span class="jp">${f.a} + ${f.b} = ${(G.save.flags['fuse_' + f.r] || (G.save.dex[f.r] || {}).caught) ? f.r : '？'}</span></div>`).join('')}` : ''}
      <div class="hwbox"><div id="hw-anim"></div></div>
      <div class="brow"><button class="btn" id="d-anim">✍️ Ver traços</button><button class="btn sec" id="d-back">↩ Voltar</button></div>`, { wide: true });
    const hw = makeWriter($('#hw-anim', b), c, 150, false);
    $('#d-anim', b).onclick = () => { if (hw) hw.animateCharacter(); speak(toHira(kanjiReadings(c)[0])); };
    $('#d-back', b).onclick = () => { sfx('cancel'); this.openDex(); };
  },

  // ----- Itens -----
  openItems() {
    const inv = G.save.items;
    const b = this.panel('どうぐ · Itens', `
      <div class="ilist">${Object.keys(ITEMS).map(k => `<div class="irow"><b class="jp">${ITEMS[k].jp}</b> ×${inv[k] || 0}
        <small class="dim">${esc(ITEMS[k].pt)}</small>
        ${(ITEMS[k].heal || ITEMS[k].healFull) && inv[k] > 0 ? `<button class="btn tiny" data-k="${k}">Usar</button>` : ''}</div>`).join('')}</div>
      <p class="dim">💰 ${G.save.money}円</p>`);
    $$('[data-k]', b).forEach(x => x.onclick = () => this.pickTarget(x.dataset.k));
  },
  pickTarget(k) {
    const b = this.panel(`Usar ${ITEMS[k].jp} em quem?`, `<div class="plist">${G.save.party.map((i, idx) => `<button class="prow" data-i="${idx}"><img class="pico" src="${spiritIcon(i.sp, 48)}">
      <span class="pinfo"><b class="jp">${esc(i.sp)}</b> Nv${i.lv} <small>${i.hp}/${statsOf(i).maxhp} HP</small></span></button>`).join('')}</div>`, { onClose: () => {} });
    $$('.prow', b).forEach(x => x.onclick = () => {
      const i = G.save.party[+x.dataset.i], st = statsOf(i), it = ITEMS[k];
      if (i.hp >= st.maxhp) { toast('HP já está cheio!'); return; }
      i.hp = it.healFull ? st.maxhp : Math.min(st.maxhp, i.hp + it.heal);
      G.save.items[k]--; sfx('heal'); toast(`${esc(i.sp)} recuperou HP!`);
      this.openItems();
    });
  },

  // ----- Insígnias -----
  openBadges() {
    const own = G.save.badges.owned, eq = G.save.badges.eq;
    const keys = Object.keys(BADGES).filter(k => own[k]);
    let pen = 0; keys.forEach(k => { if (eq[k]) pen += BADGES[k].pen; });
    const mult = Math.max(.4, 1 - pen);
    const b = this.panel('バッジ · Insígnias', `
      <p class="dim">Insígnias ajudam, mas tiram XP. Estilo Paper Mario: você escolhe a dificuldade.</p>
      <div class="blist">${keys.map(k => `<button class="brow2 ${eq[k] ? 'on' : ''}" data-k="${k}">
        <span class="bic">${BADGES[k].icon}</span><span><b>${BADGES[k].name}</b> <small>(−${Math.round(BADGES[k].pen * 100)}% XP)</small><br><small class="dim">${esc(BADGES[k].pt)}</small></span>
        <span class="btog">${eq[k] ? 'ON' : 'OFF'}</span></button>`).join('')}</div>
      <div class="mfoot">XP das batalhas: <b>×${mult.toFixed(2)}</b>${G.save.opts.answer === 'type' ? ' · modo Digitar: <b>×1.5</b>' : ''}</div>
      <p class="dim">Mais insígnias estão escondidas em baús pelo mundo…</p>`);
    $$('.brow2', b).forEach(x => x.onclick = () => { const k = x.dataset.k; eq[k] = !eq[k]; sfx(eq[k] ? 'confirm' : 'cancel'); this.openBadges(); });
  },

  // ----- Opções -----
  openOptions() {
    const o = G.save.opts;
    const b = this.panel('せってい · Opções', `
      <div class="opt"><b>Como responder</b>
        <div class="seg"><button data-v="mc" class="${o.answer === 'mc' ? 'on' : ''}">🔘 Escolher</button><button data-v="type" class="${o.answer === 'type' ? 'on' : ''}">⌨️ Digitar (+50% XP)</button></div>
        <small class="dim">Digitar aceita romaji ou kana e tolera 1 errinho. Perguntas de significado são sempre de escolha.</small></div>
      <div class="opt"><b>Som</b> <button class="btn tiny" id="o-snd">${o.sound ? '🔊 Ligado' : '🔇 Desligado'}</button></div>
      <div class="opt"><b>Voz (pronúncia)</b> <button class="btn tiny" id="o-voice">${o.voice ? '🗣 Ligada' : '🤐 Desligada'}</button></div>
      <div class="opt"><b>Apagar progresso</b> <button class="btn tiny danger" id="o-reset">🗑 Recomeçar</button></div>`);
    $$('.seg button', b).forEach(x => x.onclick = () => { o.answer = x.dataset.v; sfx('confirm'); this.openOptions(); });
    $('#o-snd', b).onclick = () => { o.sound = !o.sound; sfx('confirm'); this.openOptions(); };
    $('#o-voice', b).onclick = () => { o.voice = !o.voice; sfx('confirm'); this.openOptions(); };
    $('#o-reset', b).onclick = () => { if (confirm('Apagar TODO o progresso do jogo? (o app de estudo não é afetado)')) { localStorage.removeItem(SAVE_KEY); location.reload(); } };
  },
  openHelp() {
    this.panel('❓ Como jogar', `<div class="help">
      <p>🕹 <b>Andar:</b> setas / WASD ou o direcional na tela. <b>Falar/interagir:</b> Z, Enter, Espaço ou <b>A</b>. <b>Menu:</b> X, Esc ou ☰.</p>
      <p>⚔️ <b>Atacar:</b> cada golpe é um desafio de japonês. Responda rápido pra tirar <b>EXCELENTE</b> (dano ×1.5).</p>
      <p>🛡 <b>Defender:</b> quando o inimigo ataca, um talismã voa até você: responda antes dele chegar! Bem rápido = <b>SUPERGUARDA</b> (bloqueia tudo e contra-ataca).</p>
      <p>⭐ <b>Torcida:</b> acertos enchem as estrelas. Com 5, libera o <b>ESPECIAL</b> (3 desafios seguidos).</p>
      <p>🧿 <b>Capturar:</b> use <b class="jp">おふだ</b> num kotodama enfraquecido e diga a leitura do kanji dele.</p>
      <p>⛩ <b>Fusão:</b> no santuário, junte dois kotodama pra formar um kanji novo (<span class="jp">木+木=林</span>!). Você escreve o kanji com o dedo.</p>
      <p>🔥 <b>Elementos:</b> <span class="jp">木</span> vence <span class="jp">土</span>, <span class="jp">土</span> vence <span class="jp">水</span>, <span class="jp">水</span> vence <span class="jp">火</span>, <span class="jp">火</span> vence <span class="jp">金</span>, <span class="jp">金</span> vence <span class="jp">木</span> (×1.5).</p>
      <p>🏅 <b>Insígnias</b> ajudam mas reduzem o XP. O modo <b>Digitar</b> dá +50% XP.</p>
      <p>🧠 O que você mais erra aparece mais (nas perguntas e nos encontros).</p>
      <p>📚 Tudo que você adicionar no app de estudo (kanji, palavras, verbos, vocabulário) entra no jogo automaticamente.</p></div>`);
  },

  // ----- Loja -----
  openShop() {
    const b = this.panel('みせ · Loja', `
      <p class="jp">いらっしゃいませ！</p><p class="dim">(Bem-vindo!) · 💰 <b id="sh-money">${G.save.money}</b>円</p>
      <div class="ilist">${Object.keys(ITEMS).map(k => `<div class="irow"><b class="jp">${ITEMS[k].jp}</b> <span class="price">${ITEMS[k].price}円</span>
        <small class="dim">${esc(ITEMS[k].pt)} · você tem ${G.save.items[k] || 0}</small>
        <span><button class="btn tiny" data-k="${k}" data-n="1">×1</button><button class="btn tiny" data-k="${k}" data-n="5">×5</button></span></div>`).join('')}</div>`);
    $$('[data-k]', b).forEach(x => x.onclick = () => {
      const k = x.dataset.k, n = +x.dataset.n, cost = ITEMS[k].price * n;
      if (G.save.money < cost) { sfx('wrong'); toast('Dinheiro insuficiente!'); return; }
      G.save.money -= cost; G.save.items[k] = (G.save.items[k] || 0) + n; sfx('coin');
      toast(`Comprou ${ITEMS[k].jp} ×${n}!`); this.openShop();
    });
  },

  // ----- Pousada -----
  openInn() {
    const b = this.panel('やどや · Pousada', `
      <p class="jp">いらっしゃいませ。ゆっくり やすんで ください。</p><p class="dim">(Bem-vindo. Descanse à vontade.)</p>
      <div class="brow col">
        <button class="btn" id="inn-rest">😴 Descansar (grátis): recupera todo mundo</button>
        <button class="btn" id="inn-cards">🃏 Paciência dos Números (ganhe 円)</button>
        <button class="btn sec" id="inn-box">📦 Organizar equipe e caixa</button>
      </div>`);
    $('#inn-rest', b).onclick = () => { healAll(); sfx('heal'); toast('💤 Todos os kotodama estão descansados!'); refreshHUD(); saveGame(); };
    $('#inn-cards', b).onclick = () => { this.close(); Solitaire.open(); };
    $('#inn-box', b).onclick = () => this.openParty(() => {});
  },

  // ----- Santuário (fusão) -----
  openShrine() {
    const all = G.save.party.concat(G.save.box);
    const count = c => all.filter(i => i.sp === c && i.lv >= FUSION_MIN_LV).length;
    const has = c => all.some(i => i.sp === c);
    const rows = FUSIONS.map((f, k) => {
      const disc = G.save.flags['fuse_' + f.r];
      const okA = f.a === f.b ? count(f.a) >= 2 : count(f.a) >= 1, okB = f.a === f.b ? okA : count(f.b) >= 1;
      const can = okA && okB;
      const show = disc || has(f.a) || has(f.b);
      return `<div class="recipe ${can ? 'can' : ''}">
        <span class="jp rbig">${show ? f.a : '？'} + ${show ? f.b : '？'} = ${disc ? f.r : '？'}</span>
        ${can ? `<button class="btn tiny" data-k="${k}">⛩ Fundir</button>` : `<small class="dim">${show ? `precisa ${f.a === f.b ? '2× ' + f.a : f.a + ' e ' + f.b} (Nv${FUSION_MIN_LV}+)` : 'receita desconhecida'}</small>`}
      </div>`;
    }).join('');
    const b = this.panel('じんじゃ · Santuário ⛩', `
      <p class="jp">ふたつの ことだまを あわせて、あたらしい {漢字|かんじ}を つくります。</p>
      <p class="dim">Junte dois kotodama (Nv${FUSION_MIN_LV}+) pra formar um kanji novo. Os dois se unem num só, mais forte.</p>
      <div class="rlist">${rows}</div>`.replace('{漢字|かんじ}', jpHTML('{漢字|かんじ}')), { wide: true });
    $$('[data-k]', b).forEach(x => x.onclick = () => this.fuse(FUSIONS[+x.dataset.k]));
  },
  fuse(f) {
    const all = G.save.party.concat(G.save.box).filter(i => i.lv >= FUSION_MIN_LV);
    const byLv = c => all.filter(i => i.sp === c).sort((a, b) => b.lv - a.lv);
    const a = byLv(f.a)[0], b2 = f.a === f.b ? byLv(f.b)[1] : byLv(f.b)[0];
    if (!a || !b2) return;
    const b = this.panel('⛩ Ritual de fusão', `
      <div class="fuse-line"><img src="${spiritIcon(a.sp, 64)}"><span class="plus">+</span><img src="${spiritIcon(b2.sp, 64)}"><span class="plus">=</span><span class="q jp">？</span></div>
      <p>Pra completar o ritual, escreva o novo kanji com o dedo (ou mouse), traço por traço.<br>
      <small class="dim">Significado: <b>${esc(SPECIES[f.r].mean)}</b> · leitura: <span class="jp">${esc(kanjiReadings(f.r).slice(0, 2).join('・'))}</span></small></p>
      <div class="hwbox big"><div id="hw-quiz"></div></div>
      <div class="brow"><button class="btn sec" id="f-hint">👁 Mostrar ordem</button><button class="btn sec" id="f-cancel">Cancelar</button></div>`,
      { noClose: true });
    const hw = makeWriter($('#hw-quiz', b), f.r, Math.min(260, window.innerWidth - 90), true);
    $('#f-cancel', b).onclick = () => { sfx('cancel'); this.openShrine(); };
    $('#f-hint', b).onclick = () => { if (hw) hw.animateCharacter({ onComplete: () => startQuiz() }); };
    const startQuiz = () => { if (hw) hw.quiz({ showHintAfterMisses: 2, onComplete: () => setTimeout(() => this.fuseDone(f, a, b2), 500) }); };
    startQuiz();
  },
  fuseDone(f, a, b2) {
    const rm = i => { let k = G.save.party.indexOf(i); if (k >= 0) G.save.party.splice(k, 1); else { k = G.save.box.indexOf(i); if (k >= 0) G.save.box.splice(k, 1); } };
    rm(a); rm(b2);
    const inst = makeInst(f.r, Math.max(a.lv, b2.lv) + 1);
    if (G.save.party.length < 6) G.save.party.push(inst); else G.save.box.push(inst);
    G.save.flags['fuse_' + f.r] = true; markDex(f.r, 'caught');
    sfx('capture'); speak(toHira(kanjiReadings(f.r)[0])); saveGame();
    const b = this.panel('✨ Fusão completa!', `
      <div class="fuse-res"><img src="${spiritIcon(f.r, 110)}"></div>
      <h3 class="center"><span class="jp">${esc(f.r)}</span> ${esc(SPECIES[f.r].name)} · Nv${inst.lv}</h3>
      <p class="center">${esc(f.pt)}</p>
      <div class="brow"><button class="btn" id="f-ok">Incrível!</button></div>`);
    $('#f-ok', b).onclick = () => { sfx('confirm'); this.openShrine(); };
  },
};

// ---------- Escrita de kanji (Hanzi Writer) ----------
function makeWriter(el, ch, size, quiz) {
  if (!el || !window.HanziWriter) return null;
  try {
    return HanziWriter.create(el, ch, {
      width: size, height: size, padding: 8, showOutline: true, showCharacter: !quiz,
      strokeColor: '#2a1a3a', outlineColor: '#d9d2ea', drawingColor: '#c0282a', highlightColor: '#f2c14e',
      strokeAnimationSpeed: 1.2, delayBetweenStrokes: 180,
      charDataLoader: (c, onLoad, onErr) => {
        const d = window.KANJI_STROKES && KANJI_STROKES[c];
        if (d) return onLoad(d);
        fetch('https://cdn.jsdelivr.net/npm/hanzi-writer-data-jp@latest/' + encodeURIComponent(c) + '.json').then(r => r.json()).then(onLoad).catch(onErr);
      },
    });
  } catch (e) { console.warn(e); return null; }
}

// ---------- HUD ----------
function refreshHUD() {
  const h = $('#hud'); if (!h || !G.save) return;
  const lead = G.save.party[0];
  let html = `<div class="hud-money">💰 ${G.save.money}円</div>`;
  if (lead) {
    const st = statsOf(lead), f = clamp(lead.hp / st.maxhp, 0, 1);
    html += `<div class="hud-lead"><img src="${spiritIcon(lead.sp, 36)}"><div><b class="jp">${esc(lead.sp)}</b> Nv${lead.lv}
      <div class="mini-hp"><span style="width:${f * 100}%;background:${f > .5 ? '#5ad16a' : f > .2 ? '#f2c14e' : '#ef5a5a'}"></span></div></div></div>`;
  }
  h.innerHTML = html;
}

// ---------- Introdução ----------
function startIntro() {
  Dialog.show(DLG.intro, { name: '先生', onDone: chooseStarter });
}
function chooseStarter() {
  const opts = ['火', '水', '木'].filter(c => SPECIES[c]);
  const b = UI.panel('Escolha seu primeiro kotodama', `
    <div class="starters">${opts.map(c => `<button class="starter" data-c="${c}" style="border-color:${ELEM[SPECIES[c].el].c1}">
      <img src="${spiritIcon(c, 80)}"><div class="jp big">${c}</div><div><b>${esc(SPECIES[c].name)}</b> · ${ELEM[SPECIES[c].el].pt}</div>
      <small class="dim">${esc(SPECIES[c].mean)}</small><small>${esc(ELEM_FLAVOR[SPECIES[c].el])}</small></button>`).join('')}</div>
    <p class="dim center">Dica: <span class="jp">水</span> vence <span class="jp">火</span>, <span class="jp">火</span> vence <span class="jp">金</span>, <span class="jp">木</span> vence <span class="jp">土</span>…</p>`,
    { noClose: true, wide: true });
  $$('.starter', b).forEach(x => x.onclick = () => {
    const c = x.dataset.c;
    G.save.party.push(makeInst(c, 5)); markDex(c, 'caught');
    G.save.flags.starter = true;
    G.save.items.ofuda = (G.save.items.ofuda || 0) + 5;
    Object.assign(G.save.badges.owned, { romaji: true, furi: true, trad: true });
    sfx('capture'); speak(toHira(kanjiReadings(c)[0]));
    UI.close();
    const r = toHira(kanjiReadings(c)[0]);
    Dialog.show([{ jp: `{${c}|${r}}ですね！ いい ことだまです。`, pt: `O ${c}! É um ótimo kotodama.` }].concat(DLG.intro2), {
      name: '先生', onDone: () => { saveGame(); refreshHUD(); toast('Dica: vá para o sul (ルート１) e ande no mato alto!', 3500); },
    });
  });
}
