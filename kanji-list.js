// ============================================================
//  KANJIDEX — lista de kanji aprendidos.
//  Para adicionar novos toda semana: copie um item, troque os
//  dados e aumente "week". Os traços (stroke order) precisam
//  existir em kanji-strokes.js (ou serão buscados online).
//  on = leitura on'yomi (katakana) | kun = kun'yomi (hiragana)
// ============================================================
window.KANJI_DEX = [
  { c:'日', on:['ニチ','ジツ'], kun:['ひ','-び','-か'], mean:'dia, sol', week:1 },
  { c:'月', on:['ゲツ','ガツ'], kun:['つき'], mean:'lua, mês', week:1 },
  { c:'木', on:['モク','ボク'], kun:['き','こ'], mean:'árvore', week:1 },
  { c:'山', on:['サン'], kun:['やま'], mean:'montanha', week:1 },
  { c:'川', on:['セン'], kun:['かわ'], mean:'rio', week:1 },
  { c:'田', on:['デン'], kun:['た','だ'], mean:'arrozal', week:1 },
  { c:'人', on:['ジン','ニン'], kun:['ひと'], mean:'pessoa', week:1 },
  { c:'口', on:['コウ','ク'], kun:['くち','-ぐち'], mean:'boca', week:1 },
  { c:'車', on:['シャ'], kun:['くるま'], mean:'carro, automóvel', week:1 },
  { c:'門', on:['モン'], kun:['かど'], mean:'portão', week:1 },
  { c:'火', on:['カ'], kun:['ひ','-び'], mean:'fogo', week:1 },
  { c:'水', on:['スイ'], kun:['みず'], mean:'água', week:1 },
  { c:'金', on:['キン','コン'], kun:['かね','かな'], mean:'ouro, dinheiro', week:1 },
  { c:'土', on:['ド','ト'], kun:['つち'], mean:'terra, solo', week:1 },
  { c:'子', on:['シ','ス'], kun:['こ'], mean:'criança, filho', week:1 },
  { c:'女', on:['ジョ'], kun:['おんな'], mean:'mulher', week:1 },
  { c:'学', on:['ガク'], kun:['まな(ぶ)'], mean:'aprender, estudo', week:1 },
  { c:'生', on:['セイ','ショウ'], kun:['い(きる)','う(まれる)','なま'], mean:'viver, nascer', week:1 },
  { c:'先', on:['セン'], kun:['さき','ま(ず)'], mean:'antes, ponta', week:1 },
  { c:'私', on:['シ'], kun:['わたし','わたくし'], mean:'eu, privativo', week:1 },
  { c:'一', on:['イチ','イツ'], kun:['ひと(つ)'], mean:'um', week:1 },
  { c:'二', on:['ニ'], kun:['ふた(つ)'], mean:'dois', week:1 },
  { c:'三', on:['サン'], kun:['み(っつ)'], mean:'três', week:1 },
  { c:'四', on:['シ'], kun:['よん','よ(っつ)'], mean:'quatro', week:1 },
  { c:'五', on:['ゴ'], kun:['いつ(つ)'], mean:'cinco', week:1 },
  { c:'六', on:['ロク'], kun:['む(つ)','むっ(つ)','むい'], mean:'seis', week:2 },
  { c:'七', on:['シチ'], kun:['なな','なな(つ)','なの'], mean:'sete', week:2 },
  { c:'八', on:['ハチ'], kun:['や(つ)','やっ(つ)','よう'], mean:'oito', week:2 },
  { c:'九', on:['キュウ','ク'], kun:['ここの(つ)'], mean:'nove', week:2 },
  { c:'十', on:['ジュウ','ジッ'], kun:['とお','と'], mean:'dez', week:2 },
  { c:'百', on:['ヒャク'], kun:[], mean:'cem (100)', week:3 },
  { c:'千', on:['セン'], kun:['ち'], mean:'mil (1000)', week:3 },
  { c:'万', on:['マン','バン'], kun:[], mean:'dez mil (10.000)', week:3 },
  { c:'円', on:['エン'], kun:['まる(い)'], mean:'iene / círculo', week:3 },
  { c:'年', on:['ネン'], kun:['とし'], mean:'ano', week:3 }
];
