// ============================================================
//  TEXTOS DE LEITURA — Básico 3 (ICBJ)
//  Furigana no formato {kanji|leitura}. Texto fora das chaves é normal.
//  lines: pares jp/pt (frase a frase). vocab e questions opcionais.
//  Para adicionar mais: copie um bloco e troque o conteúdo.
// ============================================================
window.READINGS = [
  {
    id:'b2-erika', title:'エリカさんの まいにち', sub:'O dia a dia da Erika', level:'Básico 2',
    lines:[
      { jp:'エリカさんは まいあさ ６じはんに おきます。', pt:'A Erika acorda toda manhã às 6h30.' },
      { jp:'あさごはんは いつも コーヒーを のみます。そして、トーストを たべます。', pt:'No café da manhã, sempre bebe café. E come torrada.' },
      { jp:'ちかてつで かいしゃへ いきます。９じから ６じまで はたらきます。', pt:'Vai de metrô para a empresa. Trabalha das 9h às 18h.' },
      { jp:'ごぜん メールを おくります。そして、レポートを かきます。', pt:'De manhã envia e-mails. E escreve relatórios.' },
      { jp:'１２じに かいしゃの しょくどうで ひるごはんを たべます。ときどき、ラーメンやで たべます。', pt:'Às 12h almoça no refeitório da empresa. Às vezes come num restaurante de lámen.' },
      { jp:'ごご おきゃくさんと かいぎを します。', pt:'À tarde tem reunião com clientes.' },
      { jp:'６じはんごろ うちへ かえります。７じはんに かぞくと ばんごはんを たべます。', pt:'Por volta das 18h30 volta para casa. Às 19h30 janta com a família.' },
      { jp:'それから、にほんごを べんきょうします。じゅぎょうは オンラインです。', pt:'Depois estuda japonês. A aula é online.' },
      { jp:'９じに おわります。それから、１０じに ねます。', pt:'Termina às 21h. Depois dorme às 22h.' },
      { jp:'どようびと にちようびに はたらきません。', pt:'Sábado e domingo não trabalha.' },
      { jp:'どようびの あさ スーパーで かいものします。ごご ともだちと オンラインゲームを します。', pt:'No sábado de manhã faz compras no mercado. À tarde joga online com amigos.' },
      { jp:'にちようびに どこも いきません。やすみます。', pt:'No domingo não vai a lugar nenhum. Descansa.' }
    ],
    vocab:[
      { jp:'いつも', pt:'sempre' }, { jp:'ちかてつ', pt:'metrô' }, { jp:'しょくどう', pt:'refeitório' },
      { jp:'ときどき', pt:'às vezes' }, { jp:'ラーメンや', pt:'restaurante de lámen' }, { jp:'かいぎ', pt:'reunião' },
      { jp:'おきゃくさん', pt:'cliente' }, { jp:'じゅぎょう', pt:'aula' }, { jp:'かぞく', pt:'família' }, { jp:'レポート', pt:'relatório' }
    ],
    questions:[
      { q:'A que horas a Erika acorda?', a:'Às 6h30 (６じはん).' },
      { q:'Como ela vai ao trabalho?', a:'De metrô (ちかてつ).' },
      { q:'O que ela faz no domingo?', a:'Não vai a lugar nenhum; descansa (やすみます).' }
    ]
  },
  {
    id:'b2-uchi', title:'わたしの うち', sub:'Minha casa e o bairro', level:'Básico 2',
    lines:[
      { jp:'わたしの うちは マンションです。５かいに あります。', pt:'Minha casa é um apartamento. Fica no 5º andar.' },
      { jp:'ビルの となりに こうえんが あります。こうえんは ひろいです。', pt:'Ao lado do prédio há um parque. O parque é amplo.' },
      { jp:'きが たくさん あります。はなも たくさん あります。', pt:'Há muitas árvores. Também há muitas flores.' },
      { jp:'こうえんの まえに としょかんと きっさてんが あります。', pt:'Em frente ao parque há uma biblioteca e uma cafeteria.' },
      { jp:'わたしは としょかんで ほんを かります。そして、こうえんで よみます。', pt:'Eu pego livros emprestados na biblioteca. E leio no parque.' },
      { jp:'ときどき きっさてんで よみます。きっさてんの コーヒーと チーズケーキは おいしいです。', pt:'Às vezes leio na cafeteria. O café e o cheesecake da cafeteria são gostosos.' },
      { jp:'うちの ちかくに ゆうびんきょくと ぎんこうが あります。', pt:'Perto de casa há um correio e um banco.' },
      { jp:'ゆうびんきょくと ぎんこうの あいだに スーパーが あります。', pt:'Entre o correio e o banco há um mercado.' },
      { jp:'スーパーの なかに はなやや パンやが あります。とても べんりです。', pt:'Dentro do mercado há floricultura, padaria, etc. É muito prático.' }
    ],
    vocab:[
      { jp:'マンション', pt:'apartamento (prédio)' }, { jp:'となり', pt:'ao lado' }, { jp:'ひろい', pt:'amplo, espaçoso' },
      { jp:'き', pt:'árvore' }, { jp:'としょかん', pt:'biblioteca' }, { jp:'きっさてん', pt:'cafeteria' },
      { jp:'かります', pt:'pegar emprestado' }, { jp:'ゆうびんきょく', pt:'correio' }, { jp:'ぎんこう', pt:'banco' },
      { jp:'あいだ', pt:'entre' }, { jp:'べんり', pt:'prático, conveniente' }
    ],
    questions:[
      { q:'Que tipo de casa é a dela?', a:'Um apartamento (マンション), no 5º andar.' },
      { q:'O que há ao lado do prédio?', a:'Um parque (こうえん).' },
      { q:'O que há em frente ao parque?', a:'Uma biblioteca e uma cafeteria.' },
      { q:'Onde fica o mercado?', a:'Entre o correio e o banco.' },
      { q:'O que há dentro do mercado?', a:'Floricultura (はなや) e padaria (パンや).' }
    ]
  },
  {
    id:'b2-karina', title:'カリナさんの にっき', sub:'O diário da Karina (passado)', level:'Básico 2',
    lines:[
      { jp:'せんしゅうの にちようびに かおるさんと うえのへ いきました。', pt:'No domingo passado fui a Ueno com a Kaoru.' },
      { jp:'うえのは とても にぎやかでした。', pt:'Ueno estava muito movimentado.' },
      { jp:'びじゅつかんは うえのえきから ちかいです。あるいて １０ぷんです。', pt:'O museu de arte é perto da estação de Ueno. São 10 minutos a pé.' },
      { jp:'びじゅつかんで えを みました。きれいでした。', pt:'No museu vi pinturas. Eram lindas.' },
      { jp:'ひるに うえのこうえんで サンドイッチを たべました。', pt:'No almoço comi sanduíche no Parque de Ueno.' },
      { jp:'コンビニで たまごサンドを かいました。かおるさんも サンドイッチを かいました。', pt:'Comprei sanduíche de ovo na loja de conveniência. A Kaoru também comprou sanduíche.' },
      { jp:'とても おいしかったです。', pt:'Estava muito gostoso.' },
      { jp:'それから さんぽしました。こうえんは すずしかったです。とても よかったです。', pt:'Depois passeamos. O parque estava fresco. Foi muito bom.' },
      { jp:'せんしゅうの にちようびは あさから ばんまで あそびました。つかれましたが、たのしかったです。', pt:'No domingo passado me diverti de manhã até a noite. Fiquei cansada, mas foi divertido.' }
    ],
    vocab:[
      { jp:'せんしゅう', pt:'semana passada' }, { jp:'びじゅつかん', pt:'museu de arte' }, { jp:'あるいて', pt:'a pé' },
      { jp:'え', pt:'pintura, desenho' }, { jp:'たまごサンド', pt:'sanduíche de ovo' }, { jp:'コンビニ', pt:'loja de conveniência' },
      { jp:'さんぽします', pt:'passear' }, { jp:'すずしい', pt:'fresco (clima)' }, { jp:'つかれます', pt:'cansar-se' }, { jp:'たのしい', pt:'divertido' }
    ],
    questions:[
      { q:'Com quem e para onde a Karina foi?', a:'Com a Kaoru, para Ueno.' },
      { q:'O que ela viu no museu?', a:'Pinturas (え).' },
      { q:'O que comeu no almoço?', a:'Sanduíche (de ovo).' },
      { q:'Como estava o parque?', a:'Fresco e agradável (すずしかった / よかった).' }
    ]
  },
  {
    id:'b2-cinema', title:'えいがへ いきませんか', sub:'Diálogo — convite ao cinema', level:'Básico 2',
    lines:[
      { jp:'たなか：みどりさん、えいがへ いきませんか。', pt:'Tanaka: Midori, não quer ir ao cinema?' },
      { jp:'みどり：いつ ですか。', pt:'Midori: Quando?' },
      { jp:'たなか：あしたは どうですか。', pt:'Tanaka: Que tal amanhã?' },
      { jp:'みどり：あしたは ちょっと…', pt:'Midori: Amanhã está meio… (não dá).' },
      { jp:'たなか：らいしゅうの もくようびは？', pt:'Tanaka: E na quinta-feira que vem?' },
      { jp:'みどり：ええ、いきましょう。', pt:'Midori: Sim, vamos!' }
    ],
    vocab:[
      { jp:'えいが', pt:'cinema, filme' }, { jp:'〜ませんか', pt:'não quer…? (convite)' }, { jp:'どうですか', pt:'que tal?' },
      { jp:'ちょっと…', pt:'(recusa educada) “é meio…”' }, { jp:'らいしゅう', pt:'semana que vem' }, { jp:'もくようび', pt:'quinta-feira' }
    ],
    questions:[
      { q:'O que o Tanaka convida a Midori a fazer?', a:'Ir ao cinema.' },
      { q:'Por que ela recusa amanhã?', a:'“あしたは ちょっと…” — uma recusa educada (não pode).' },
      { q:'Quando combinam de ir?', a:'Na quinta-feira da semana que vem.' }
    ]
  },
  {
    id:'b2-kuruma', title:'やまださんの うちへ', sub:'Diálogo — com quem e como foi', level:'Básico 2',
    lines:[
      { jp:'きむら：たなかさん、にちようび どこへ いきましたか。', pt:'Kimura: Tanaka, aonde você foi domingo?' },
      { jp:'たなか：やまださんの うちへ いきました。', pt:'Tanaka: Fui à casa do Yamada.' },
      { jp:'きむら：ひとりで いきましたか。', pt:'Kimura: Foi sozinho?' },
      { jp:'たなか：いいえ、やまかわさんと いきました。', pt:'Tanaka: Não, fui com o Yamakawa.' },
      { jp:'きむら：やまださんの うちは どこですか。', pt:'Kimura: Onde fica a casa do Yamada?' },
      { jp:'たなか：フラメンゴ です。', pt:'Tanaka: É no Flamengo.' },
      { jp:'きむら：じゃ、ちかてつで いきましたか。', pt:'Kimura: Então foi de metrô?' },
      { jp:'たなか：いいえ、やまかわさんの くるまで いきました。', pt:'Tanaka: Não, fui no carro do Yamakawa.' }
    ],
    vocab:[
      { jp:'ひとりで', pt:'sozinho' }, { jp:'〜と', pt:'com (alguém)' }, { jp:'ちかてつ', pt:'metrô' }, { jp:'くるま', pt:'carro' }
    ],
    questions:[
      { q:'Aonde o Tanaka foi domingo?', a:'À casa do Yamada (no Flamengo).' },
      { q:'Com quem e como ele foi?', a:'Com o Yamakawa, de carro (くるまで).' }
    ]
  },
  {
    id:'b2-zangyo', title:'きょうは ざんぎょうです', sub:'Diálogo — hora extra', level:'Básico 2',
    lines:[
      { jp:'みどり：たなかさん、きょう えいがに いきませんか。', pt:'Midori: Tanaka, não quer ir ao cinema hoje?' },
      { jp:'たなか：きょうは ９じまで ざんぎょうです。', pt:'Tanaka: Hoje tenho hora extra até as 21h.' },
      { jp:'みどり：ざんねんですね。まいにち なんじまで はたらきますか。', pt:'Midori: Que pena. Até que horas você trabalha todo dia?' },
      { jp:'たなか：まいばん ８じごろまで はたらきます。それから、１２じごろまで べんきょうします。', pt:'Tanaka: Toda noite trabalho até cerca das 20h. Depois estudo até por volta da meia-noite.' },
      { jp:'みどり：そうですか。じゃ、たいへんですね。', pt:'Midori: É mesmo? Então é puxado, né.' }
    ],
    vocab:[
      { jp:'ざんぎょう', pt:'hora extra' }, { jp:'ざんねんですね', pt:'que pena' }, { jp:'〜ごろ', pt:'por volta de' },
      { jp:'まいばん', pt:'toda noite' }, { jp:'たいへんですね', pt:'que puxado/difícil' }
    ],
    questions:[
      { q:'Por que o Tanaka não pode ir ao cinema?', a:'Tem hora extra (ざんぎょう) até as 21h.' },
      { q:'O que ele faz depois do trabalho?', a:'Estuda até por volta da meia-noite.' }
    ]
  },
  {
    id:'b2-densha', title:'でんしゃで いきます', sub:'Diálogo — como vai ao trabalho', level:'Básico 2',
    lines:[
      { jp:'まさき：たなかさんは バスで しごとに いきますか。', pt:'Masaki: Tanaka, você vai ao trabalho de ônibus?' },
      { jp:'たなか：いいえ、でんしゃで いきます。いけぶくろえきで でんしゃに のります。', pt:'Tanaka: Não, vou de trem. Embarco no trem na estação de Ikebukuro.' },
      { jp:'まさき：そうですか。', pt:'Masaki: Ah, sim.' },
      { jp:'たなか：そして、しんじゅくえきで おります。それから、かいしゃまで あるいて いきます。１０ぷんです。', pt:'Tanaka: E desço na estação de Shinjuku. Depois vou a pé até a empresa. São 10 minutos.' },
      { jp:'まさき：はやいですね。', pt:'Masaki: É rápido, né.' }
    ],
    vocab:[
      { jp:'でんしゃ', pt:'trem' }, { jp:'のります', pt:'embarcar' }, { jp:'おります', pt:'descer (do transporte)' },
      { jp:'えき', pt:'estação' }, { jp:'あるいて', pt:'a pé' }, { jp:'はやい', pt:'rápido' }
    ],
    questions:[
      { q:'Como o Tanaka vai ao trabalho?', a:'De trem (embarca em Ikebukuro, desce em Shinjuku).' },
      { q:'Quanto tempo ele anda a pé até a empresa?', a:'10 minutos.' }
    ]
  },
  {
    id:'b2-yakkyoku', title:'やっきょくが ありますか', sub:'Diálogo — onde tem farmácia', level:'Básico 2',
    lines:[
      { jp:'ジュリア：あのう、すみません。この ちかくに やっきょくが ありますか。', pt:'Julia: Com licença. Há uma farmácia aqui por perto?' },
      { jp:'たなか：やっきょくですか。あそこに スーパーが ありますね。やっきょくは あのスーパーの となりです。', pt:'Tanaka: Farmácia? Ali há um mercado, né. A farmácia é ao lado daquele mercado.' },
      { jp:'たなか：でも、きょうは にちようび ですから、１２じまで です。ざんねんですね。', pt:'Tanaka: Mas, como hoje é domingo, fica aberta só até as 12h. Que pena.' },
      { jp:'ジュリア：ええ、どうも すみませんでした。', pt:'Julia: Sim, muito obrigada.' },
      { jp:'たなか：いいえ、どういたしまして。', pt:'Tanaka: De nada.' }
    ],
    vocab:[
      { jp:'ちかく', pt:'perto, redondeza' }, { jp:'やっきょく', pt:'farmácia' }, { jp:'となり', pt:'ao lado' },
      { jp:'〜から', pt:'porque, já que' }, { jp:'どういたしまして', pt:'de nada' }
    ],
    questions:[
      { q:'O que a Julia procura?', a:'Uma farmácia (やっきょく).' },
      { q:'Onde fica a farmácia?', a:'Ao lado do mercado (スーパーの となり).' },
      { q:'Por que ela fecha cedo hoje?', a:'Porque é domingo (abre só até as 12h).' }
    ]
  },
  {
    id:'b2-yaoya', title:'やおやで かいもの', sub:'Diálogo — comprando frutas (contadores)', level:'Básico 2',
    lines:[
      { jp:'やおや：いらっしゃいませ。', pt:'Quitandeiro: Seja bem-vinda!' },
      { jp:'きゃく：すみません、この りんごは いくらですか。', pt:'Cliente: Com licença, quanto custa esta maçã?' },
      { jp:'やおや：それは ひとつ ５０えんです。', pt:'Quitandeiro: Essa é 50 ienes cada.' },
      { jp:'きゃく：じゃ、これを いつつ ください。それから、この バナナを じゅっぽん ください。', pt:'Cliente: Então me dê cinco destas. E me dê dez destas bananas.' },
      { jp:'やおや：はい、ありがとうございます。ぜんぶで ４００えんです。', pt:'Quitandeiro: Certo, obrigado. No total são 400 ienes.' }
    ],
    vocab:[
      { jp:'やおや', pt:'quitanda, feirante' }, { jp:'いらっしゃいませ', pt:'seja bem-vindo' }, { jp:'いくら', pt:'quanto custa?' },
      { jp:'ひとつ', pt:'uma unidade' }, { jp:'いつつ', pt:'cinco unidades' }, { jp:'じゅっぽん', pt:'dez (objetos longos)' },
      { jp:'〜ください', pt:'me dê…, por favor' }, { jp:'ぜんぶで', pt:'ao todo' }
    ],
    questions:[
      { q:'Quanto custa uma maçã?', a:'50 ienes (ひとつ ５０えん).' },
      { q:'O que e quanto o cliente comprou?', a:'5 maçãs (いつつ) e 10 bananas (じゅっぽん).' },
      { q:'Qual foi o total?', a:'400 ienes (ぜんぶで).' }
    ]
  },
  {
    id:'b2-panda', title:'パンダは なにを たべますか', sub:'Diálogo — o panda', level:'Básico 2',
    lines:[
      { jp:'リー：マリアさん、これは パンダですよ。', pt:'Lee: Maria, isto é um panda!' },
      { jp:'マリア：かわいいですね。パンダは なにを たべますか。', pt:'Maria: Que fofo! O que o panda come?' },
      { jp:'リー：ささのはを たべます。', pt:'Lee: Come folha de bambu.' },
      { jp:'マリア：えっ、ささのは ですか。めずらしい ですね。', pt:'Maria: Hã, folha de bambu? Que curioso.' },
      { jp:'リー：パンダは ちゅうごくに しか いません。', pt:'Lee: Pandas só existem na China.' },
      { jp:'マリア：そうですか。', pt:'Maria: Ah, é?' }
    ],
    vocab:[
      { jp:'かわいい', pt:'fofo, adorável' }, { jp:'ささのは', pt:'folha de bambu' }, { jp:'めずらしい', pt:'raro, curioso' },
      { jp:'〜しか いません', pt:'só existe… (nada além de)' }, { jp:'ちゅうごく', pt:'China' }
    ],
    questions:[
      { q:'O que o panda come?', a:'Folha de bambu (ささのは).' },
      { q:'Onde só existem pandas?', a:'Na China (ちゅうごく).' }
    ]
  },
  {
    id:'b3-cidades',
    title:'大阪・神戸・京都・奈良',
    sub:'As cidades do Kansai',
    level:'Básico 3',
    lines:[
      { jp:'{大阪|おおさか}は{大|おお}きくて、にぎやかな{町|まち}です。', pt:'Osaka é uma cidade grande e movimentada.' },
      { jp:'おもしろい{人|ひと}がたくさんいて、{食|た}べ{物|もの}がおいしいです。', pt:'Há muitas pessoas interessantes, e a comida é deliciosa.' },
      { jp:'{神戸|こうべ}と{京都|きょうと}と{奈良|なら}は{大阪|おおさか}から{近|ちか}いです。', pt:'Kobe, Kyoto e Nara ficam perto de Osaka.' },
      { jp:'{奈良|なら}はとても{古|ふる}い{町|まち}です。', pt:'Nara é uma cidade muito antiga.' },
      { jp:'{奈良|なら}と{京都|きょうと}は{古|ふる}いお{寺|てら}や{神社|じんじゃ}が{多|おお}いですから、{外国人|がいこくじん}もよく{行|い}きます。', pt:'Nara e Kyoto têm muitos templos e santuários antigos, por isso muitos estrangeiros também as visitam.' },
      { jp:'{奈良|なら}{公園|こうえん}にはしかがたくさんいます。', pt:'No Parque de Nara há muitos cervos.' },
      { jp:'{神戸|こうべ}はすてきな{町|まち}です。', pt:'Kobe é uma cidade encantadora.' },
      { jp:'{前|まえ}に{海|うみ}があって、うしろに{山|やま}があります。', pt:'Na frente há o mar e, atrás, montanhas.' },
      { jp:'{神戸|こうべ}には{若|わか}い{人|ひと}がたくさんいます。', pt:'Em Kobe há muitos jovens.' }
    ],
    vocab:[
      { jp:'にぎやか', pt:'movimentado, animado' },
      { jp:'食べ物（たべもの）', pt:'comida' },
      { jp:'近い（ちかい）', pt:'perto' },
      { jp:'古い（ふるい）', pt:'antigo, velho' },
      { jp:'お寺（てら）', pt:'templo (budista)' },
      { jp:'神社（じんじゃ）', pt:'santuário (xintoísta)' },
      { jp:'多い（おおい）', pt:'muito, numeroso' },
      { jp:'外国人（がいこくじん）', pt:'estrangeiro' },
      { jp:'よく', pt:'com frequência' },
      { jp:'しか', pt:'cervo' },
      { jp:'すてきな', pt:'encantador, maravilhoso' },
      { jp:'若い（わかい）', pt:'jovem' }
    ],
    questions:[
      { q:'Qual cidade é grande, animada e tem comida gostosa?', a:'大阪 (Osaka)' },
      { q:'Por que muitos estrangeiros visitam Nara e Kyoto?', a:'Porque têm muitos templos (お寺) e santuários (神社) antigos.' },
      { q:'O que há em grande quantidade no Parque de Nara?', a:'Cervos (しか).' },
      { q:'Como é a localização de Kobe?', a:'Tem o mar (海) na frente e montanhas (山) atrás.' },
      { q:'Qual cidade tem muitos jovens?', a:'神戸 (Kobe).' }
    ]
  },
  {
    id:'b3-natsuyasumi',
    title:'なつ{休|やす}みのりょこう',
    sub:'Diálogo — viagem de férias',
    level:'Básico 3',
    lines:[
      { jp:'{大川|おおかわ}：マリオさん、なつ{休|やす}みはいつからですか。', pt:'Ōkawa: Mário, a partir de quando são as suas férias de verão?' },
      { jp:'マリオ：なつ{休|やす}みは{12月|じゅうにがつ}はじめにはじまって、{2月|にがつ}すえにおわります。', pt:'Mário: As férias começam no início de dezembro e terminam no fim de fevereiro.' },
      { jp:'{大川|おおかわ}：なつ{休|やす}みはどこかへりょこうしますか。', pt:'Ōkawa: Você vai viajar para algum lugar nas férias?' },
      { jp:'マリオ：ええ、ベレンとマナウスへいきます。まず、ひこうきでベレンへいって、それからふねでマナウスまでいきます。', pt:'Mário: Sim, vou para Belém e Manaus. Primeiro vou de avião até Belém e, depois, de barco até Manaus.' },
      { jp:'{大川|おおかわ}：ベレンはどこにありますか。', pt:'Ōkawa: Onde fica Belém?' },
      { jp:'マリオ：ベレンはアマゾン{川|がわ}のかこうです。マナウスはベレンから１７００キロメートル{上流|じょうりゅう}にあります。', pt:'Mário: Belém fica na foz do rio Amazonas. Manaus fica 1.700 km rio acima de Belém.' },
      { jp:'{大川|おおかわ}：ずいぶんとおいですね。', pt:'Ōkawa: Nossa, é bem longe, não é?' }
    ],
    vocab:[
      { jp:'なつ休み（なつやすみ）', pt:'férias de verão' },
      { jp:'〜はじめ', pt:'início de (mês)' },
      { jp:'〜すえ', pt:'fim de (mês)' },
      { jp:'まず', pt:'primeiramente' },
      { jp:'それから', pt:'depois disso' },
      { jp:'ひこうき', pt:'avião' },
      { jp:'ふね', pt:'barco' },
      { jp:'かこう', pt:'foz (do rio)' },
      { jp:'上流（じょうりゅう）', pt:'curso superior, rio acima' },
      { jp:'ずいぶん', pt:'bastante, consideravelmente' },
      { jp:'とおい', pt:'longe' },
      { jp:'アマゾン川（がわ）', pt:'rio Amazonas' }
    ],
    questions:[
      { q:'Quando começam e terminam as férias do Mário?', a:'Começam no início de dezembro e terminam no fim de fevereiro.' },
      { q:'Para onde ele vai viajar?', a:'Para Belém e Manaus.' },
      { q:'Como ele vai até Belém e até Manaus?', a:'De avião até Belém e, depois, de barco até Manaus.' },
      { q:'Onde fica Belém?', a:'Na foz do rio Amazonas (アマゾン川のかこう).' },
      { q:'A que distância Manaus fica de Belém?', a:'1.700 km rio acima (上流).' }
    ]
  }
];
