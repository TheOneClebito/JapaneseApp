// ============================================================
//  PALAVRAS com os 25 kanji aprendidos (modo "Palavras" do quiz).
//  w = forma escrita; furigana {kanji|leitura} SÓ nos kanji ainda
//  não aprendidos (os 25 aparecem "pelados" para você treinar).
//  read = leitura completa da palavra | mean = significado.
//  Objetivo: forçar leituras específicas (ex.: 金 = kane / kin).
// ============================================================
window.KANJI_WORDS = [
  // 日
  { w:'日{本|ほん}', read:'にほん', mean:'Japão' },
  { w:'{毎|まい}日', read:'まいにち', mean:'todo dia' },
  // 月
  { w:'{今|こん}月', read:'こんげつ', mean:'este mês' },
  { w:'月{曜|よう}日', read:'げつようび', mean:'segunda-feira' },
  { w:'月', read:'つき', mean:'lua' },
  // 木
  { w:'木{曜|よう}日', read:'もくようび', mean:'quinta-feira' },
  { w:'木', read:'き', mean:'árvore' },
  // 山
  { w:'火山', read:'かざん', mean:'vulcão' },
  { w:'{富|ふ}{士|じ}山', read:'ふじさん', mean:'Monte Fuji' },
  { w:'山', read:'やま', mean:'montanha' },
  // 川
  { w:'川', read:'かわ', mean:'rio' },
  // 田
  { w:'田中', read:'たなか', mean:'Tanaka (sobrenome)' },
  // 人
  { w:'一人', read:'ひとり', mean:'uma pessoa / sozinho' },
  { w:'二人', read:'ふたり', mean:'duas pessoas' },
  { w:'日{本|ほん}人', read:'にほんじん', mean:'japonês (pessoa)' },
  // 口
  { w:'{入|いり}口', read:'いりぐち', mean:'entrada' },
  { w:'人口', read:'じんこう', mean:'população' },
  { w:'口', read:'くち', mean:'boca' },
  // 車
  { w:'{自|じ}{転|てん}車', read:'じてんしゃ', mean:'bicicleta' },
  { w:'{電|でん}車', read:'でんしゃ', mean:'trem' },
  { w:'車', read:'くるま', mean:'carro' },
  // 門
  { w:'{専|せん}門', read:'せんもん', mean:'especialidade' },
  { w:'門', read:'もん', mean:'portão' },
  // 火
  { w:'火{曜|よう}日', read:'かようび', mean:'terça-feira' },
  { w:'{花|はな}火', read:'はなび', mean:'fogos de artifício' },
  // 水
  { w:'水{曜|よう}日', read:'すいようび', mean:'quarta-feira' },
  { w:'水', read:'みず', mean:'água' },
  // 金 (kane vs kin)
  { w:'お金', read:'おかね', mean:'dinheiro' },
  { w:'金{曜|よう}日', read:'きんようび', mean:'sexta-feira' },
  // 土
  { w:'土{曜|よう}日', read:'どようび', mean:'sábado' },
  { w:'土', read:'つち', mean:'terra / solo' },
  // 子
  { w:'子{供|ども}', read:'こども', mean:'criança' },
  { w:'女子', read:'じょし', mean:'feminino / garota' },
  // 女
  { w:'女', read:'おんな', mean:'mulher' },
  { w:'{彼|かの}女', read:'かのじょ', mean:'ela / namorada' },
  // 学
  { w:'大学', read:'だいがく', mean:'universidade' },
  { w:'学{校|こう}', read:'がっこう', mean:'escola' },
  { w:'学生', read:'がくせい', mean:'estudante' },
  // 生 (sei / i)
  { w:'先生', read:'せんせい', mean:'professor(a)' },
  { w:'生きる', read:'いきる', mean:'viver' },
  // 先
  { w:'先月', read:'せんげつ', mean:'mês passado' },
  // 私
  { w:'私', read:'わたし', mean:'eu' },
  // 一〜五
  { w:'一{時|じ}', read:'いちじ', mean:'uma hora (1h)' },
  { w:'一つ', read:'ひとつ', mean:'um (coisa)' },
  { w:'三人', read:'さんにん', mean:'três pessoas' },
  { w:'四月', read:'しがつ', mean:'abril' },
  { w:'五月', read:'ごがつ', mean:'maio' },
  { w:'二つ', read:'ふたつ', mean:'dois (coisas)' },
  // 六〜十 (novos)
  { w:'六つ', read:'むっつ', mean:'seis (coisas)' },
  { w:'六{時|じ}', read:'ろくじ', mean:'seis horas (6h)' },
  { w:'七つ', read:'ななつ', mean:'sete (coisas)' },
  { w:'八つ', read:'やっつ', mean:'oito (coisas)' },
  { w:'九つ', read:'ここのつ', mean:'nove (coisas)' },
  { w:'九{時|じ}', read:'くじ', mean:'nove horas (9h)' },
  { w:'十', read:'とお', mean:'dez' },
  { w:'十{時|じ}', read:'じゅうじ', mean:'dez horas (10h)' },
  // 百 千 万 円 年 (novos)
  { w:'百', read:'ひゃく', mean:'cem (100)' },
  { w:'三百', read:'さんびゃく', mean:'trezentos (300)' },
  { w:'千', read:'せん', mean:'mil (1000)' },
  { w:'三千', read:'さんぜん', mean:'três mil (3000)' },
  { w:'一万', read:'いちまん', mean:'dez mil (10.000)' },
  { w:'円', read:'えん', mean:'iene' },
  { w:'百円', read:'ひゃくえん', mean:'100 ienes' },
  { w:'千円', read:'せんえん', mean:'1000 ienes' },
  { w:'一年', read:'いちねん', mean:'um ano' },
  { w:'年', read:'とし', mean:'ano / idade' },
  // 上 下 中 大 小 (novos)
  { w:'上', read:'うえ', mean:'em cima' },
  { w:'上{手|ず}', read:'じょうず', mean:'habilidoso / bom em' },
  { w:'下', read:'した', mean:'embaixo' },
  { w:'{地|ち}下{鉄|てつ}', read:'ちかてつ', mean:'metrô' },
  { w:'下{手|た}', read:'へた', mean:'ruim em (pouco habilidoso)' },
  { w:'中', read:'なか', mean:'dentro / meio' },
  { w:'中{国|ごく}', read:'ちゅうごく', mean:'China' },
  { w:'大きい', read:'おおきい', mean:'grande' },
  { w:'大{変|へん}', read:'たいへん', mean:'difícil / trabalhoso' },
  { w:'小さい', read:'ちいさい', mean:'pequeno' },
  { w:'小学生', read:'しょうがくせい', mean:'aluno do primário' }
];
