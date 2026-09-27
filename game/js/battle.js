'use strict';
// ============================================================
//  BATALHA — palco estilo Paper Mario: ataque = comando de ação,
//  defesa = talismã voando (responda antes de chegar), plateia/torcida,
//  captura com おふだ, ataque especial quando a torcida enche.
// ============================================================
const sleep = ms => new Promise(r => setTimeout(r, ms));
let B = null;

const Battle = {
  get active() { return !!B; },
  startWild(sp, lv) {
    const enemy = makeInst(sp, lv);
    markDex(sp, 'seen');
    begin({ kind: 'wild', enemy, queue: [], npc: null });
  },
  startTrainer(npc) {
    const team = npc.trainer.team.filter(([c]) => SPECIES[c]).map(([c, lv]) => makeInst(c, lv));
    team.forEach(i => markDex(i.sp, 'seen'));
    begin({ kind: 'trainer', enemy: team.shift(), queue: team, npc });
  },
  update(dt) { if (B) updateTweens(dt); },
  render(g, w, h, t) { if (B) renderBattle(g, w, h, t); },
};

function markDex(c, what) {
  const d = G.save.dex[c] || (G.save.dex[c] = {});
  d.seen = true; if (what === 'caught') d.caught = true;
}
function party() { return G.save.party; }
function activeP() { return party()[B.pIdx]; }

// ---------- Tweens ----------
// animações pelo relógio real: a lógica nunca emperra, mesmo com poucos quadros por segundo
function tween(obj, prop, to, dur, ease) {
  return new Promise(res => {
    const tw = { obj, prop, from: obj[prop], to, start: performance.now(), dur, ease: ease || (x => x) };
    const bt = B; bt.tweens.push(tw);
    setTimeout(() => { obj[prop] = to; bt.tweens = bt.tweens.filter(x => x !== tw); res(); }, dur * 1000);
  });
}
function updateTweens() {
  const now = performance.now();
  B.tweens.forEach(tw => { const f = Math.min(1, (now - tw.start) / 1000 / tw.dur); tw.obj[tw.prop] = lerp(tw.from, tw.to, tw.ease(f)); });
}
const easeOut = x => 1 - (1 - x) * (1 - x);

// ---------- Início / fim ----------
function begin(cfg) {
  const idx = party().findIndex(i => i.hp > 0);
  if (idx < 0) { G.busy = false; return; }
  G.busy = true;
  B = {
    ...cfg, pIdx: idx, crowd: 0, cheer: 0, fx: [], tweens: [], proj: null, seal: null, lay: null, t0: performance.now(),
    anim: { p: { dx: 0, dy: 0, flash: 0, alpha: 1, scale: 1 }, e: { dx: 0, dy: 0, flash: 0, alpha: 1, scale: 1 } },
  };
  sfx('encounter');
  G.scene = 'battle';
  buildBattleUI();
  runBattle().catch(err => { console.error(err); endBattle('ran'); });
}
function buildBattleUI() {
  const ui = $('#battle-ui');
  ui.innerHTML = `
    <div class="plate enemy" id="pl-e"></div>
    <div class="crowd" id="crowd"></div>
    <div class="bwrap">
      <div class="plate me" id="pl-p"></div>
      <div class="bbox" id="bbox"><div class="bmsg" id="bmsg"></div><div class="bmain" id="bmain"></div></div>
    </div>`;
  ui.classList.add('show');
  refreshPlates(true);
}
function plateHTML(inst, me) {
  const st = statsOf(inst), sp = SPECIES[inst.sp], f = clamp(inst.hp / st.maxhp, 0, 1);
  const col = f > .5 ? '#5ad16a' : f > .2 ? '#f2c14e' : '#ef5a5a';
  return `<div class="pl-row">${elChip(sp.el)}<span class="pl-name"><b class="jp">${esc(inst.sp)}</b> ${esc(sp.name)}</span><span class="pl-lv">Nv${inst.lv}</span></div>
    <div class="hp"><span>HP</span><div class="hpbar"><div class="hpfill" style="width:${f * 100}%;background:${col}"></div></div></div>
    ${me ? `<div class="pl-hpn">${inst.hp}/${st.maxhp}</div><div class="xpbar"><div class="xpfill" style="width:${clamp(inst.xp / xpToNext(inst.lv), 0, 1) * 100}%"></div></div>` : ''}`;
}
function refreshPlates() {
  if (!B) return;
  $('#pl-e').innerHTML = plateHTML(B.enemy, false);
  $('#pl-p').innerHTML = plateHTML(activeP(), true);
  const stars = Math.floor(B.crowd / 20);
  $('#crowd').innerHTML = `<div class="cr-l">TORCIDA</div><div class="cr-s">${'★'.repeat(stars)}<span>${'★'.repeat(5 - stars)}</span></div>`;
  $('#crowd').classList.toggle('full', B.crowd >= 100);
}
function crowdAdd(n) { B.crowd = clamp(B.crowd + n, 0, 100); if (n > 0) B.cheer = 1; refreshPlates(); }

async function endBattle(result) {
  if (!B) return;
  const b = B;
  if (result === 'win') {
    let money = 0;
    if (b.kind === 'wild') money = rint(5, 12) + b.enemy.lv * 3;
    else {
      const tr = b.npc.trainer; money = tr.reward || 0;
      G.save.flags[tr.flag] = true;
      if (tr.items) for (const k in tr.items) G.save.items[k] = (G.save.items[k] || 0) + tr.items[k];
    }
    G.save.money += money; sfx('coin');
    await say(`Vitória! Você ganhou ${money}円.`, 1400);
  } else if (result === 'lose') {
    const lost = Math.floor(G.save.money * 0.1);
    G.save.money -= lost;
    await say(`Todos os seus kotodama desmaiaram... Você volta para a pousada. (−${lost}円)`, 2200);
    healAll();
    loadMap('village', 19, 5, 'up');
  }
  $('#battle-ui').classList.remove('show');
  $('#battle-ui').innerHTML = '';
  B = null; G.scene = 'world'; G.busy = false;
  Input.clearHold();
  saveGame();
  if (result === 'win' && b.kind === 'trainer') {
    const tr = b.npc.trainer;
    if (tr.win) Dialog.show(DLG[tr.win], { name: b.npc.name, onDone: () => { if (tr.boss) toast('🏆 Capítulo 1 completo!', 3500); } });
    else Dialog.show(DLG[tr.post], { name: b.npc.name });
  }
  refreshHUD();
}
function healAll() { party().concat(G.save.box).forEach(i => { i.hp = statsOf(i).maxhp; }); }

// ---------- Mensagens e escolhas ----------
function say(text, auto = 1100) {
  return new Promise(res => {
    const m = $('#bmsg'), main = $('#bmain');
    if (!m) return res();
    m.innerHTML = text; main.innerHTML = '';
    let done = false;
    const fin = () => { if (done) return; done = true; m.onclick = null; document.removeEventListener('keydown', key); res(); };
    const key = e => { if (e.key === 'Enter' || e.key === ' ' || e.key === 'z') fin(); };
    m.onclick = fin; document.addEventListener('keydown', key);
    if (auto) setTimeout(fin, auto);
  });
}
function waitTap(label = 'Toque para continuar ▸') {
  return new Promise(res => {
    const main = $('#bmain');
    main.insertAdjacentHTML('beforeend', `<button class="btn tapnext">${label}</button>`);
    const b = $('.tapnext', main);
    const fin = () => { document.removeEventListener('keydown', key); res(); };
    const key = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fin(); } };
    b.onclick = fin; setTimeout(() => document.addEventListener('keydown', key), 250);
    try { b.focus(); } catch (e) {}
  });
}
function choose(msg, buttons) {
  return new Promise(res => {
    $('#bmsg').innerHTML = msg;
    const main = $('#bmain');
    main.innerHTML = `<div class="bgrid">${buttons.map((b, i) => `<button class="bbtn ${b.cls || ''}" data-i="${i}" ${b.disabled ? 'disabled' : ''}>${b.html}</button>`).join('')}</div>`;
    const key = e => { const i = +e.key - 1; if (buttons[i] && !buttons[i].disabled) { e.preventDefault(); fin(i); } if (e.key === 'Escape') { const back = buttons.findIndex(b => b.back); if (back >= 0) fin(back); } };
    const fin = i => { document.removeEventListener('keydown', key); sfx('select'); res(buttons[i].v); };
    $$('.bbtn', main).forEach(b => b.onclick = () => fin(+b.dataset.i));
    document.addEventListener('keydown', key);
  });
}

// ---------- Pergunta + feedback ----------
function runQuestion(q, phase) {
  return new Promise(res => {
    const box = $('#bmain'); $('#bmsg').innerHTML = '';
    const secs = phase === 'special' ? qSeconds(q, 'def') * 0.85 : qSeconds(q, phase);
    if (phase === 'def') B.proj = { q, start: performance.now(), dur: secs * 1000 };
    askQuestion(box, q, { seconds: secs, onDone: r => { B.proj = null; res(r); } });
  });
}
async function showFeedback(q, r, phase) {
  const lay = B.lay;
  const label = r.grade === 'ex' ? (phase === 'def' ? 'SUPERGUARDA!' : 'EXCELENTE!') : r.grade === 'ok' ? (phase === 'def' ? 'DEFENDEU!' : 'BOM!') : 'ERROU…';
  const color = r.grade === 'ex' ? '#ffd84a' : r.grade === 'ok' ? '#7ef08a' : '#ff7a7a';
  if (lay) B.fx.push({ kind: 'text', text: label, x: lay.w / 2, y: lay.stageH * .3, color, t0: performance.now(), dur: 1100, big: true });
  if (r.grade === 'ex') sfx(phase === 'def' ? 'superguard' : 'crit'); else if (r.grade === 'ok') sfx(phase === 'def' ? 'guard' : 'confirm'); else sfx('wrong');
  speak(q.speak);
  const box = $('#bmain');
  box.insertAdjacentHTML('beforeend', `<div class="reveal ${r.ok ? 'ok' : 'no'}">${r.close ? '<div class="close">Quase! Pequeno erro de digitação.</div>' : ''}${q.answer}</div>`);
  if (r.ok) await sleep(1200); else await waitTap();
}

// ---------- Dano ----------
function calcDamage(att, def, power, grade) {
  const sa = statsOf(att), sd = statsOf(def);
  const tm = typeMult(SPECIES[att.sp].el, SPECIES[def.sp].el);
  const gm = grade === 'ex' ? 1.5 : grade === 'ok' ? 1 : 0.4;
  return { dmg: Math.max(1, Math.round(power * sa.atk / (sd.def + 10) * tm * gm * rnd(.9, 1.1))), tm };
}
async function hit(side, dmg, crit) {
  const a = B.anim[side], lay = B.lay;
  const target = side === 'e' ? B.enemy : activeP();
  target.hp = Math.max(0, target.hp - dmg);
  sfx(crit ? 'crit' : 'hit');
  if (lay) {
    const x = side === 'e' ? lay.eX : lay.pX;
    B.fx.push({ kind: 'num', text: '-' + dmg, x, y: lay.floorY - lay.size, color: crit ? '#ffd84a' : '#fff', t0: performance.now(), dur: 900 });
    for (let i = 0; i < 8; i++) B.fx.push({ kind: 'spark', x, y: lay.floorY - lay.size * .5, vx: rnd(-1, 1), vy: rnd(-1.2, .2), color: crit ? '#ffd84a' : '#ffffff', t0: performance.now(), dur: 500 });
  }
  a.flash = 1; tween(a, 'flash', 0, .35);
  for (let i = 0; i < 3; i++) { await tween(a, 'dx', (i % 2 ? -1 : 1) * 8, .04); }
  await tween(a, 'dx', 0, .05);
  refreshPlates();
}
async function lunge(side) {
  const a = B.anim[side], dir = side === 'p' ? 1 : -1, d = (B.lay ? B.lay.size : 80) * .45;
  await tween(a, 'dx', dir * d, .14, easeOut);
  tween(a, 'dx', 0, .22);
}

// ---------- Loop principal ----------
async function runBattle() {
  const e = B.enemy;
  await sleep(350);
  if (B.kind === 'wild') await say(`Um <b class="jp">${esc(e.sp)}</b> ${esc(SPECIES[e.sp].name)} selvagem apareceu! <span class="dim">(${esc(SPECIES[e.sp].mean)})</span>`, 1600);
  else await say(`${esc(B.npc.name)} quer batalhar! Envia <b class="jp">${esc(e.sp)}</b> ${esc(SPECIES[e.sp].name)}!`, 1600);
  await say(`Vai, <b class="jp">${esc(activeP().sp)}</b> ${esc(SPECIES[activeP().sp].name)}!`, 900);
  while (B) {
    const r = await playerAction();
    if (r === 'ran' || r === 'captured') return endBattle(r === 'captured' ? 'captured' : 'ran');
    if (B.enemy.hp <= 0) { const more = await enemyFainted(); if (!more) return endBattle('win'); continue; }
    if (r !== 'free') await enemyTurn();
    if (activeP().hp <= 0) { const ok = await playerFainted(); if (!ok) return endBattle('lose'); }
  }
}

async function playerAction() {
  while (true) {
    refreshPlates();
    const canSpecial = B.crowd >= 100;
    const act = await choose(`O que <b class="jp">${esc(activeP().sp)}</b> vai fazer?`, [
      { html: '⚔️ Atacar', v: 'atk' },
      { html: '🎒 Itens', v: 'item' },
      { html: '🔄 Trocar', v: 'switch' },
      { html: B.kind === 'wild' ? '🏃 Fugir' : '🏃 —', v: 'run', disabled: B.kind !== 'wild' },
      ...(canSpecial ? [{ html: '✨ ESPECIAL!', v: 'special', cls: 'special' }] : []),
    ]);
    if (act === 'atk') {
      const mv = await choose('Escolha um golpe (cada golpe é um desafio):', movesKnown(activeP()).map(m => ({
        html: `<span class="jp mv">${jpHTML(m.label, false)}</span><span class="mvp">${m.kind === 'kanji' ? 'kanji' : 'palavra'} · ${m.power}</span>`, v: m,
      })).concat([{ html: '↩ Voltar', v: null, back: true }]));
      if (!mv) continue;
      await doAttack(mv); return 'done';
    }
    if (act === 'special') { await doSpecial(); return 'done'; }
    if (act === 'item') { const r = await useItemMenu(); if (r) return r; continue; }
    if (act === 'switch') { const ok = await chooseSwitch(false); if (ok) return 'done'; continue; }
    if (act === 'run') {
      const chance = clamp(.75 + (activeP().lv - B.enemy.lv) * .05, .3, 1);
      if (Math.random() < chance) { sfx('door'); await say('Você fugiu!', 900); return 'ran'; }
      await say('Não conseguiu fugir!', 900); return 'done';
    }
  }
}

async function doAttack(mv) {
  await say(`<b class="jp">${esc(activeP().sp)}</b> prepara <b class="jp">${jpHTML(mv.label, false)}</b>!`, 700);
  const q = qForMove(mv);
  const r = await runQuestion(q, 'atk');
  await showFeedback(q, r, 'atk');
  crowdAdd(r.grade === 'ex' ? 20 : r.grade === 'ok' ? 10 : -10);
  await lunge('p');
  const { dmg, tm } = calcDamage(activeP(), B.enemy, mv.power, r.grade);
  await hit('e', dmg, r.grade === 'ex');
  if (tm > 1) await say('É super eficaz! 🔥', 900);
  else if (tm < 1) await say('Não é muito eficaz...', 900);
}

async function doSpecial() {
  B.crowd = 0; refreshPlates(); sfx('cheer');
  await say('A plateia está em êxtase! ✨ <b>CHUVA DE PALAVRAS</b>: 3 desafios seguidos!', 1500);
  for (let i = 0; i < 3 && B.enemy.hp > 0; i++) {
    const q = qForSpecial();
    const r = await runQuestion(q, 'special');
    await showFeedback(q, r, 'atk');
    if (r.ok) { await lunge('p'); const { dmg } = calcDamage(activeP(), B.enemy, 18, r.grade); await hit('e', dmg, r.grade === 'ex'); }
  }
}

async function enemyTurn() {
  const e = B.enemy, mv = pick(movesKnown(e));
  await say(`<b class="jp">${esc(e.sp)}</b> ataca com <b class="jp">${jpHTML(mv.label, false)}</b>! Responda antes do talismã chegar!`, 1100);
  const q = qForDefense();
  const r = await runQuestion(q, 'def');
  await showFeedback(q, r, 'def');
  const { dmg, tm } = calcDamage(e, activeP(), mv.power, 'ok');
  await lunge('e');
  if (r.grade === 'ex') {
    crowdAdd(15);
    const c = calcDamage(activeP(), e, 10, 'ok');
    await say('SUPERGUARDA! Você bloqueou tudo e contra-atacou!', 800);
    await hit('e', c.dmg, true);
  } else if (r.ok) {
    crowdAdd(5);
    await hit('p', Math.max(1, Math.round(dmg * .3)), false);
  } else {
    crowdAdd(-5);
    await hit('p', dmg, false);
    if (tm > 1) await say('Foi super eficaz...', 800);
  }
}

async function enemyFainted() {
  const e = B.enemy;
  sfx('fail');
  await Promise.all([tween(B.anim.e, 'alpha', 0, .5), tween(B.anim.e, 'dy', 30, .5)]);
  await say(`<b class="jp">${esc(e.sp)}</b> desmaiou!`, 900);
  const mult = xpMult();
  const xp = Math.max(1, Math.round((8 + e.lv * 7) * (B.kind === 'trainer' ? 1.4 : 1) * mult));
  await gainXP(activeP(), xp, true);
  for (const i of party()) if (i !== activeP() && i.hp > 0) await gainXP(i, Math.round(xp * .3), false);
  if (B.queue.length) {
    B.enemy = B.queue.shift();
    B.anim.e = { dx: 0, dy: 0, flash: 0, alpha: 1, scale: 1 };
    refreshPlates();
    await say(`${esc(B.npc.name)} envia <b class="jp">${esc(B.enemy.sp)}</b> ${esc(SPECIES[B.enemy.sp].name)}!`, 1300);
    return true;
  }
  return false;
}
function xpMult() {
  let pen = 0; for (const k in G.save.badges.eq) if (G.save.badges.eq[k] && BADGES[k]) pen += BADGES[k].pen;
  return Math.max(.4, 1 - pen) * (G.save.opts.answer === 'type' ? 1.5 : 1);
}
async function gainXP(inst, amt, show) {
  inst.xp += amt;
  if (show) await say(`<b class="jp">${esc(inst.sp)}</b> ganhou ${amt} XP.`, 900);
  while (inst.xp >= xpToNext(inst.lv)) {
    inst.xp -= xpToNext(inst.lv);
    const before = statsOf(inst).maxhp;
    inst.lv++;
    inst.hp += statsOf(inst).maxhp - before;
    sfx('levelup');
    if (B) refreshPlates();
    await say(`⭐ <b class="jp">${esc(inst.sp)}</b> subiu para o nível ${inst.lv}!`, 1300);
    const learnedNow = movesFor(inst.sp).filter(m => m.lv === inst.lv);
    for (const m of learnedNow) await say(`<b class="jp">${esc(inst.sp)}</b> aprendeu <b class="jp">${jpHTML(m.label, true)}</b>!`, 1500);
    if (inst.lv === FUSION_MIN_LV && FUSIONS.some(f => f.a === inst.sp || f.b === inst.sp)) await say(`<b class="jp">${esc(inst.sp)}</b> já pode ser fundido no santuário ⛩!`, 1500);
  }
  if (B) refreshPlates();
}

async function playerFainted() {
  sfx('fail');
  await tween(B.anim.p, 'alpha', 0, .45);
  await say(`<b class="jp">${esc(activeP().sp)}</b> desmaiou!`, 1000);
  if (!party().some(i => i.hp > 0)) return false;
  await chooseSwitch(true);
  return true;
}

async function chooseSwitch(forced) {
  const opts = party().map((i, idx) => ({ i, idx })).filter(o => o.idx !== B.pIdx && o.i.hp > 0);
  if (!opts.length) { await say('Não há outro kotodama em condições!', 1000); return false; }
  const btns = opts.map(o => ({ html: `<img class="bico" src="${spiritIcon(o.i.sp, 40)}"><span><b class="jp">${esc(o.i.sp)}</b> Nv${o.i.lv}<br><small>${o.i.hp}/${statsOf(o.i).maxhp} HP</small></span>`, v: o.idx }));
  if (!forced) btns.push({ html: '↩ Voltar', v: null, back: true });
  const v = await choose(forced ? 'Escolha o próximo kotodama:' : 'Trocar para qual kotodama?', btns);
  if (v == null) return false;
  B.pIdx = v; B.anim.p = { dx: 0, dy: 0, flash: 0, alpha: 1, scale: 1 };
  refreshPlates();
  await say(`Vai, <b class="jp">${esc(activeP().sp)}</b> ${esc(SPECIES[activeP().sp].name)}!`, 900);
  return true;
}

async function useItemMenu() {
  const inv = G.save.items;
  const keys = Object.keys(ITEMS).filter(k => inv[k] > 0);
  if (!keys.length) { await say('Você não tem itens!', 900); return null; }
  const k = await choose('Usar qual item?', keys.map(k => ({ html: `<b class="jp">${ITEMS[k].jp}</b> ×${inv[k]}<br><small>${esc(ITEMS[k].pt)}</small>`, v: k })).concat([{ html: '↩ Voltar', v: null, back: true }]));
  if (!k) return null;
  const it = ITEMS[k];
  if (it.capture) {
    if (B.kind !== 'wild') { await say('Não dá pra selar o kotodama de outra pessoa!', 1200); return null; }
    inv[k]--;
    const res = await doCapture();
    return res ? 'captured' : 'done';
  }
  inv[k]--;
  const p = activeP(), st = statsOf(p);
  if (it.heal || it.healFull) {
    const before = p.hp; p.hp = it.healFull ? st.maxhp : Math.min(st.maxhp, p.hp + it.heal);
    sfx('heal'); refreshPlates();
    await say(`<b class="jp">${it.jp}</b>! <b class="jp">${esc(p.sp)}</b> recuperou ${p.hp - before} HP.`, 1200);
  } else if (it.crowd) {
    crowdAdd(100); sfx('cheer');
    await say(`<b class="jp">${it.jp}</b>! A plateia adorou! Torcida no máximo!`, 1200);
  }
  return 'done';
}

async function doCapture() {
  const e = B.enemy, lay = B.lay;
  await say('Você lançou uma <b class="jp">おふだ</b>!', 700);
  const q = Q.kanjiRead(e.sp);
  q.ask = 'Para selar, diga uma leitura do kanji:';
  const r = await runQuestion(q, 'atk');
  await showFeedback(q, r, 'atk');
  if (!r.ok) { sfx('fail'); await say('O selo não funcionou!', 1000); return false; }
  const hpf = e.hp / statsOf(e).maxhp;
  const chance = clamp(.3 + .6 * (1 - hpf) + (r.grade === 'ex' ? .15 : 0), .1, .97);
  const ok = Math.random() < chance;
  B.seal = { shake: 0, t0: performance.now() };
  await tween(B.anim.e, 'scale', 0.05, .35);
  const shakes = ok ? 3 : rint(1, 2);
  for (let i = 0; i < shakes; i++) { sfx('shake'); B.seal.shake = 1; await sleep(180); B.seal.shake = 0; await sleep(420); }
  if (ok) {
    sfx('capture'); B.seal.done = true;
    const inst = { ...e, uid: 'k' + (_uid++) };
    markDex(e.sp, 'caught');
    let where = 'na equipe';
    if (party().length < 6) party().push(inst); else { G.save.box.push(inst); where = 'na caixa (equipe cheia)'; }
    await say(`✨ Selado! <b class="jp">${esc(e.sp)}</b> ${esc(SPECIES[e.sp].name)} agora é seu! (${where})`, 1800);
    const xp = Math.round((6 + e.lv * 5) * xpMult());
    await gainXP(activeP(), xp, true);
    return true;
  }
  B.seal = null;
  await tween(B.anim.e, 'scale', 1, .25);
  sfx('fail');
  await say('Ah não! Ele escapou do selo!', 1000);
  return false;
}

// ---------- Desenho do palco ----------
function renderBattle(g, w, h, t) {
  const bbox = $('#bbox');
  const stageH = Math.max(170, h - (bbox ? bbox.offsetHeight : h * .4));
  const theme = (W.map && W.map.theme) || 'grass';
  drawStage(g, w, stageH, t, theme);
  const size = Math.min(w * .26, stageH * .4);
  const floorY = stageH * .82;
  const pX = w * .28, eX = w * .72;
  B.lay = { w, stageH, size, floorY, pX, eX };
  [[pX, 'p'], [eX, 'e']].forEach(([x]) => {
    const gr = g.createRadialGradient(x, floorY, 5, x, floorY, size * .9);
    gr.addColorStop(0, 'rgba(255,245,200,.35)'); gr.addColorStop(1, 'rgba(255,245,200,0)');
    g.fillStyle = gr; g.beginPath(); g.ellipse(x, floorY, size * .9, size * .22, 0, 0, Math.PI * 2); g.fill();
  });
  const pa = B.anim.p, ea = B.anim.e;
  drawSpirit(g, pX + pa.dx, floorY - size * .47 + pa.dy, size, activeP().sp, t, { flash: pa.flash, alpha: pa.alpha, scale: pa.scale });
  drawSpirit(g, eX + ea.dx, floorY - size * .47 + ea.dy, size, B.enemy.sp, t, { flip: true, flash: ea.flash, alpha: ea.alpha, scale: ea.scale });
  if (B.seal) drawTalisman(g, eX + (B.seal.shake ? rnd(-5, 5) : 0), floorY - size * .45, size * .35, '封', B.seal.done ? t : 0);
  if (B.proj) {
    const f = clamp((performance.now() - B.proj.start) / B.proj.dur, 0, 1);
    const x = lerp(eX - size * .3, pX + size * .3, f), y = floorY - size * .7 - Math.sin(f * Math.PI) * size * .25;
    drawTalisman(g, x, y, size * .3, '言', 0, f * 12);
  }
  drawAudience(g, w, stageH, t, B.crowd, B.cheer);
  B.cheer = Math.max(0, B.cheer - 0.02);
  const now = performance.now();
  B.fx = B.fx.filter(f => now - f.t0 < f.dur);
  B.fx.forEach(f => drawFx(g, f, now));
}
function drawTalisman(g, x, y, s, ch, glow, rot = 0) {
  g.save(); g.translate(x, y); g.rotate(Math.sin(rot) * .3);
  if (glow) { g.shadowColor = '#ffe27a'; g.shadowBlur = 20; }
  g.fillStyle = '#fff6dc'; g.strokeStyle = '#8a1e1e'; g.lineWidth = 2;
  g.fillRect(-s * .32, -s * .6, s * .64, s * 1.2); g.strokeRect(-s * .32, -s * .6, s * .64, s * 1.2);
  g.shadowBlur = 0;
  g.fillStyle = '#c0282a'; g.font = `900 ${s * .5}px ${JP_FONT}`; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText(ch, 0, 0);
  g.restore();
}
function drawStage(g, w, h, t, theme) {
  g.fillStyle = '#140a1c'; g.fillRect(0, 0, w, h);
  const fy = h * .66;
  const sx = w * .06, sw = w * .88, sy = h * .1;
  const sky = g.createLinearGradient(0, sy, 0, fy);
  if (theme === 'cave') { sky.addColorStop(0, '#2c2238'); sky.addColorStop(1, '#4a3a58'); }
  else { sky.addColorStop(0, '#79c3ff'); sky.addColorStop(1, '#d8f0ff'); }
  g.fillStyle = sky; g.fillRect(sx, sy, sw, fy - sy);
  const cut = (fill, drawPath) => { g.save(); drawPath(); g.fillStyle = fill; g.fill(); g.lineWidth = 4; g.strokeStyle = '#fff'; g.stroke(); g.lineWidth = 1.5; g.strokeStyle = 'rgba(0,0,0,.35)'; g.stroke(); g.restore(); };
  if (theme === 'cave') {
    for (let i = 0; i < 7; i++) { const x = sx + sw * (i + .5) / 7; cut(i % 2 ? '#5a4a66' : '#6a5a78', () => { g.beginPath(); g.moveTo(x - sw * .06, sy); g.lineTo(x + sw * .06, sy); g.lineTo(x, sy + h * (.14 + (i % 3) * .05)); g.closePath(); }); }
    cut('#3e3148', () => { g.beginPath(); g.ellipse(sx + sw * .25, fy, sw * .3, h * .22, 0, Math.PI, 0); g.closePath(); });
    cut('#4a3b56', () => { g.beginPath(); g.ellipse(sx + sw * .78, fy, sw * .28, h * .18, 0, Math.PI, 0); g.closePath(); });
  } else {
    const sunY = sy + h * .12 + Math.sin(t * .8) * 3;
    cut('#ffd23a', () => { g.beginPath(); g.arc(sx + sw * .82, sunY, h * .075, 0, Math.PI * 2); });
    g.fillStyle = '#6a4a10'; g.beginPath(); g.arc(sx + sw * .82 - h * .025, sunY - h * .01, h * .008, 0, Math.PI * 2); g.arc(sx + sw * .82 + h * .025, sunY - h * .01, h * .008, 0, Math.PI * 2); g.fill();
    g.strokeStyle = '#6a4a10'; g.lineWidth = 2; g.beginPath(); g.arc(sx + sw * .82, sunY + h * .01, h * .025, .2, Math.PI - .2); g.stroke();
    cut('#fff', () => { const cx = sx + sw * (.22 + ((t * .01) % .3)); g.beginPath(); g.ellipse(cx, sy + h * .12, sw * .07, h * .035, 0, 0, Math.PI * 2); g.ellipse(cx + sw * .05, sy + h * .1, sw * .05, h * .035, 0, 0, Math.PI * 2); });
    cut('#58b04a', () => { g.beginPath(); g.ellipse(sx + sw * .28, fy, sw * .34, h * .24, 0, Math.PI, 0); g.closePath(); });
    cut('#6fc45c', () => { g.beginPath(); g.ellipse(sx + sw * .74, fy, sw * .32, h * .19, 0, Math.PI, 0); g.closePath(); });
  }
  const fl = g.createLinearGradient(0, fy, 0, h);
  fl.addColorStop(0, '#a36a36'); fl.addColorStop(1, '#6e4220');
  g.fillStyle = fl; g.fillRect(0, fy, w, h - fy);
  g.strokeStyle = 'rgba(60,30,10,.45)'; g.lineWidth = 2;
  for (let i = 1; i < 6; i++) { const y = fy + (h - fy) * (i / 6) * (i / 6) * 1.1; g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
  g.fillStyle = '#4a2a12'; g.fillRect(0, fy - 3, w, 4);
  const cw = w * .1;
  [0, 1].forEach(side => {
    g.save(); if (side) { g.translate(w, 0); g.scale(-1, 1); }
    const cg = g.createLinearGradient(0, 0, cw, 0);
    cg.addColorStop(0, '#7a0e18'); cg.addColorStop(.5, '#c0202c'); cg.addColorStop(1, '#8a121c');
    g.fillStyle = cg; g.beginPath(); g.moveTo(0, 0); g.lineTo(cw, 0);
    for (let y = 0; y <= h; y += 10) g.lineTo(cw * (.85 + Math.sin(y * .05 + t) * .05) - (y / h) * cw * .2, y);
    g.lineTo(0, h); g.closePath(); g.fill();
    g.strokeStyle = 'rgba(0,0,0,.25)'; g.lineWidth = 2;
    for (let k = 1; k < 4; k++) { g.beginPath(); g.moveTo(cw * k / 4, 0); g.lineTo(cw * k / 4 - 4, h); g.stroke(); }
    g.restore();
  });
  g.fillStyle = '#b01c28'; g.fillRect(0, 0, w, h * .06);
  g.fillStyle = '#b01c28';
  for (let x = 0; x < w; x += 36) { g.beginPath(); g.arc(x + 18, h * .06, 18, 0, Math.PI); g.fill(); }
  g.fillStyle = '#e8c040'; g.fillRect(0, h * .06 - 3, w, 3);
}
function drawAudience(g, w, h, t, crowd, cheer) {
  const n = Math.ceil(w / 34) + 1, amp = 2 + crowd / 100 * 9 + cheer * 10;
  for (let row = 0; row < 2; row++) {
    for (let i = 0; i < n; i++) {
      const x = i * 34 + (row ? 17 : 0) - 8, ph = hashStr(i * 7 + row) % 100 / 16;
      const y = h - (row ? 6 : 20) - Math.abs(Math.sin(t * (5 + crowd / 30) + ph)) * amp * (row ? 1 : .7);
      g.fillStyle = row ? '#150c1e' : '#231632';
      g.beginPath(); g.arc(x, y, 12, 0, Math.PI * 2); g.fill();
      g.fillRect(x - 16, y + 8, 32, 30);
    }
  }
}
function drawFx(g, f, now) {
  const p = (now - f.t0) / f.dur;
  g.save();
  if (f.kind === 'text') {
    const s = p < .2 ? lerp(.3, 1.15, p / .2) : p < .3 ? lerp(1.15, 1, (p - .2) / .1) : 1;
    g.globalAlpha = p > .75 ? 1 - (p - .75) / .25 : 1;
    g.translate(f.x, f.y); g.scale(s, s);
    g.font = `900 ${f.big ? 34 : 22}px "Press Start 2P", system-ui, sans-serif`;
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.lineWidth = 7; g.strokeStyle = '#2a1030'; g.strokeText(f.text, 0, 0);
    g.fillStyle = f.color; g.fillText(f.text, 0, 0);
  } else if (f.kind === 'num') {
    g.globalAlpha = 1 - p; g.font = '900 22px "Press Start 2P", system-ui, sans-serif'; g.textAlign = 'center';
    g.lineWidth = 5; g.strokeStyle = '#2a1030'; g.strokeText(f.text, f.x, f.y - p * 40);
    g.fillStyle = f.color; g.fillText(f.text, f.x, f.y - p * 40);
  } else if (f.kind === 'spark') {
    g.globalAlpha = 1 - p; g.fillStyle = f.color;
    g.fillRect(f.x + f.vx * p * 80, f.y + f.vy * p * 80 + p * p * 40, 5, 5);
  }
  g.restore();
}
