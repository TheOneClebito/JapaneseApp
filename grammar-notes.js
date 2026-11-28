// ============================================================
//  REVISÃO — explicações de gramática (sem exercícios), por Básico.
//  Compartilhado entre o app de estudo (aba 📘 Revisão) e o jogo
//  (Dojo → Revisão). Para adicionar: copie uma nota e troque o conteúdo.
//  Blocos:  p = texto · f = fórmula · ex = [japonês, romaji, tradução]
//           tip = dica/atenção · tbl = tabela (1ª linha = cabeçalho) · tree = texto pré-formatado
// ============================================================
window.GRAMMAR_NOTES = [
  // ======================= Básico 1 =======================
  { id:'b1-desu', level:1, title:'A wa B desu — "A é B"', sub:'です / じゃ ありません / ですか', blocks:[
    { f:'A は B です。' },
    { p:'<b>wa (は)</b> marca o assunto, e <b>desu</b> = "é". Pra negar: <b>ja arimasen</b>. Pra perguntar: põe <b>ka</b> no fim.' },
    { ex:['わたしは がくせいです。', 'watashi wa gakusei desu.', 'Eu sou estudante.'] },
    { ex:['わたしは せんせいじゃ ありません。', 'watashi wa sensei ja arimasen.', 'Eu não sou professor.'] },
    { ex:['たなかさんは にほんじんですか。', 'Tanaka-san wa nihonjin desu ka.', 'O Sr. Tanaka é japonês?'] },
    { tip:'A partícula は se escreve "ha", mas se lê <b>wa</b>.' },
  ]},
  { id:'b1-kosoado', level:1, title:'kore / sore / are — isto, isso, aquilo', sub:'これ・それ・あれ・どれ / この・その・あの', blocks:[
    { tbl:[['', 'perto de mim', 'perto de você', 'longe dos dois', 'pergunta'],
           ['coisa (sozinho)', 'これ kore', 'それ sore', 'あれ are', 'どれ dore'],
           ['+ substantivo', 'この kono', 'その sono', 'あの ano', 'どの dono'],
           ['lugar', 'ここ koko', 'そこ soko', 'あそこ asoko', 'どこ doko']] },
    { ex:['これは ほんです。', 'kore wa hon desu.', 'Isto é um livro.'] },
    { ex:['この ほんは たかいです。', 'kono hon wa takai desu.', 'Este livro é caro.'] },
    { tip:'<b>kore</b> fica sozinho; <b>kono</b> sempre vem grudado num substantivo (kono hon).' },
  ]},
  { id:'b1-no', level:1, title:'no (の) — "de" (posse, ligação)', sub:'わたしの ほん', blocks:[
    { f:'A の B = "o B de A"' },
    { ex:['わたしの ほん', 'watashi no hon', 'o meu livro'] },
    { ex:['にほんごの せんせい', 'nihongo no sensei', 'o professor de japonês'] },
    { tip:'A ordem é ao contrário do português: o dono vem primeiro.' },
  ]},

  // ======================= Básico 2 =======================
  { id:'b2-masu', level:2, title:'Verbos em ます — presente, negativo, passado', sub:'ます・ません・ました・ませんでした', blocks:[
    { tbl:[['', 'afirmativo', 'negativo'],
           ['presente / futuro', 'tabe<b>masu</b> (como)', 'tabe<b>masen</b> (não como)'],
           ['passado', 'tabe<b>mashita</b> (comi)', 'tabe<b>masen deshita</b> (não comi)']] },
    { ex:['あした がっこうへ いきます。', 'ashita gakkou he ikimasu.', 'Amanhã vou à escola.'] },
    { ex:['きのう テレビを みませんでした。', 'kinou terebi wo mimasen deshita.', 'Ontem não vi TV.'] },
    { p:'Convite: <b>〜masen ka</b> ("não quer…?") e <b>〜mashou</b> ("vamos…!").' },
    { ex:['いっしょに えいがを みませんか。', 'issho ni eiga wo mimasen ka.', 'Não quer ver um filme junto?'] },
  ]},
  { id:'b2-ikimasu', level:2, title:'Ir, vir, voltar — com quem, como, para onde', sub:'いきます・きます・かえります + へ／で／と', blocks:[
    { f:'[quando] [com quem]と [como]で [para onde]へ いきます。' },
    { tbl:[['partícula', 'função', 'exemplo'],
           ['へ (ou に)', 'para onde', 'がっこう<b>へ</b> いきます'],
           ['で', 'meio de transporte', 'でんしゃ<b>で</b> いきます'],
           ['と', 'com quem', 'ともだち<b>と</b> いきます'],
           ['に', 'horário', '７じ<b>に</b> かえります']] },
    { ex:['ともだちと でんしゃで がっこうへ いきます。', 'tomodachi to densha de gakkou he ikimasu.', 'Vou à escola de trem com um amigo.'] },
    { tip:'Partícula へ se lê <b>e</b>. A pé = <b>aruite</b> (sem で): aruite ikimasu.' },
  ]},
  { id:'b2-particulas', level:2, title:'Partículas を・に・で・へ', sub:'objeto, hora, lugar da ação, direção', blocks:[
    { tbl:[['partícula', 'para quê', 'exemplo'],
           ['を (wo/o)', 'objeto direto', 'パン<b>を</b> たべる'],
           ['に', 'hora, destino, onde algo está', '７じ<b>に</b> · いす<b>に</b> すわる · うち<b>に</b> いる'],
           ['で', 'lugar da ação, meio / instrumento', 'こうえん<b>で</b> あそぶ · ペン<b>で</b> かく'],
           ['へ (e)', 'direção (≈ に)', 'がっこう<b>へ</b> いく']] },
    { p:'Verbos que "puxam" <b>に</b>: <b>au</b> (encontrar), <b>noru</b> (embarcar), <b>suwaru</b> (sentar), <b>sumu</b> (morar), <b>hairu</b> (entrar).' },
    { ex:['こうえんで あそびます。', 'kouen de asobimasu.', 'Brinco no parque. (lugar da AÇÃO → で)'] },
    { ex:['こうえんに ねこが います。', 'kouen ni neko ga imasu.', 'Há um gato no parque. (onde ESTÁ → に)'] },
  ]},
  { id:'b2-arimasu', level:2, title:'arimasu / imasu — "ter, haver, estar"', sub:'あります (coisas) · います (seres vivos)', blocks:[
    { f:'[lugar]に [coisa]が あります。 / [lugar]に [pessoa/animal]が います。' },
    { ex:['つくえの うえに ほんが あります。', 'tsukue no ue ni hon ga arimasu.', 'Há um livro em cima da mesa.'] },
    { ex:['へやに ねこが います。', 'heya ni neko ga imasu.', 'Há um gato no quarto.'] },
    { tbl:[['posição', 'romaji', ''], ['うえ', 'ue', 'em cima'], ['した', 'shita', 'embaixo'], ['なか', 'naka', 'dentro'], ['まえ', 'mae', 'na frente'], ['うしろ', 'ushiro', 'atrás'], ['となり', 'tonari', 'ao lado']] },
    { tip:'Se mexe sozinho (pessoa, animal) → <b>imasu</b>. Objeto, planta, lugar → <b>arimasu</b>.' },
  ]},
  { id:'b2-adj', level:2, title:'Adjetivos い e な', sub:'negativo, passado, ligação', blocks:[
    { tbl:[['', 'い (takai)', 'な (shizuka)'],
           ['negativo', 'taka<b>kunai</b>', 'shizuka <b>janai</b>'],
           ['passado', 'taka<b>katta</b>', 'shizuka <b>datta</b>'],
           ['passado neg.', 'taka<b>kunakatta</b>', 'shizuka <b>janakatta</b>'],
           ['ligação (e…)', 'taka<b>kute</b>', 'shizuka <b>de</b>'],
           ['+ substantivo', 'takai hon', 'shizuka <b>na</b> machi']] },
    { tip:'<b>ii</b> (いい, bom) é irregular: yokunai · yokatta · yokute.' },
    { ex:['この へやは ひろくて しずかです。', 'kono heya wa hirokute shizuka desu.', 'Este quarto é amplo e silencioso.'] },
  ]},
  { id:'b2-shika', level:2, title:'shika / mo — "só" e "também"', sub:'〜しか + negativo · 〜も', blocks:[
    { p:'<b>shika</b> = "só, apenas" e o verbo fica sempre no <b>negativo</b>. <b>mo</b> = "também" (substitui は, が e を).' },
    { ex:['１０００えんしか ありません。', 'sen en shika arimasen.', 'Só tenho 1000 ienes.'] },
    { ex:['わたしも がくせいです。', 'watashi mo gakusei desu.', 'Eu também sou estudante.'] },
    { ex:['コーヒーも のみます。', 'koohii mo nomimasu.', 'Também bebo café.'] },
  ]},
  { id:'b2-contadores', level:2, title:'Contadores', sub:'つ・人・本・枚・匹・冊・台・杯・個', blocks:[
    { tbl:[['contador', 'para', '1', '3', '6', '8', '10'],
           ['〜つ', 'coisas (genérico)', 'ひとつ', 'みっつ', 'むっつ', 'やっつ', 'とお'],
           ['〜にん', 'pessoas', '<b>ひとり</b>', 'さんにん', 'ろくにん', 'はちにん', 'じゅうにん'],
           ['〜ほん', 'longos/finos', 'い<b>っぽ</b>ん', 'さん<b>ぼ</b>ん', 'ろ<b>っぽ</b>ん', 'は<b>っぽ</b>ん', 'じゅ<b>っぽ</b>ん'],
           ['〜まい', 'planos/finos', 'いちまい', 'さんまい', 'ろくまい', 'はちまい', 'じゅうまい'],
           ['〜ひき', 'animais pequenos', 'い<b>っぴ</b>き', 'さん<b>び</b>き', 'ろ<b>っぴ</b>き', 'は<b>っぴ</b>き', 'じゅ<b>っぴ</b>き'],
           ['〜さつ', 'livros', 'い<b>っ</b>さつ', 'さんさつ', 'ろくさつ', 'は<b>っ</b>さつ', 'じゅ<b>っ</b>さつ'],
           ['〜はい', 'copos', 'い<b>っぱ</b>い', 'さん<b>ば</b>い', 'ろ<b>っぱ</b>い', 'は<b>っぱ</b>い', 'じゅ<b>っぱ</b>い'],
           ['〜こ', 'objetos pequenos', 'い<b>っ</b>こ', 'さんこ', 'ろ<b>っ</b>こ', 'は<b>っ</b>こ', 'じゅ<b>っ</b>こ']] },
    { p:'2 pessoas = <b>futari</b> · 4 pessoas = <b>yonin</b>. Pergunta: <b>ikutsu</b> (〜つ), <b>nannin</b>, <b>nanbon</b>, <b>nanmai</b>, <b>nanbiki</b>…' },
    { tip:'1, 6, 8 e 10 costumam "dobrar" a consoante (いっ・ろっ・はっ・じゅっ), e 3 costuma ficar sonoro (さんぼん, さんびき, さんばい).' },
    { ex:['りんごを みっつ ください。', 'ringo wo mittsu kudasai.', 'Me dê três maçãs, por favor.'] },
  ]},

  // ======================= Básico 3 =======================
  { id:'b3-te', level:3, title:'Forma て — como conjugar', sub:'kaku → kaite · nomu → nonde · taberu → tabete', blocks:[
    { tbl:[['Grupo 1 (pela terminação)', 'vira', 'exemplo'],
           ['-u · -tsu · -ru', '-tte', 'kau → katte · matsu → matte · kaeru → kaette'],
           ['-mu · -bu · -nu', '-nde', 'nomu → nonde · asobu → asonde'],
           ['-ku', '-ite', 'kaku → kaite (⚠️ iku → itte)'],
           ['-gu', '-ide', 'oyogu → oyoide'],
           ['-su', '-shite', 'hanasu → hanashite']] },
    { p:'<b>Grupo 2</b> (ru): tira -ru e põe -te → taberu → tabete, miru → mite.<br><b>Grupo 3</b> (irregulares): suru → shite · kuru → kite · iku → itte.' },
    { tree:'Verbo termina em -ru?\n├─ NÃO → Grupo 1\n└─ SIM → olha a vogal antes do ru:\n    ├─ i / e (oki-ru, tabe-ru) → Grupo 2\n    ├─ a / u / o (no-ru, tsuku-ru) → Grupo 1\n    └─ exceções (kaeru, hairu, hashiru,\n        shiru, kiru) → Grupo 1' },
  ]},
  { id:'b3-te-padroes', level:3, title:'て + ください / もいいですか / はいけません', sub:'pedir, pedir permissão, proibir', blocks:[
    { tbl:[['padrão', 'significado', 'exemplo'],
           ['〜て ください', 'por favor, faça…', 'まって ください (matte kudasai)'],
           ['〜ても いいですか', 'posso…?', 'しゃしんを とっても いいですか'],
           ['〜ては いけません', 'não pode…', 'ここで たべては いけません']] },
    { ex:['なまえを かいて ください。', 'namae wo kaite kudasai.', 'Por favor, escreva seu nome.'] },
    { ex:['ここに すわっても いいですか。', 'koko ni suwatte mo ii desu ka.', 'Posso sentar aqui?'] },
    { p:'Resposta pra "posso?": <b>ee, ii desu yo</b> (sim, pode) · <b>sumimasen, chotto…</b> (desculpe, é que…).' },
  ]},
  { id:'b3-nai', level:3, title:'Forma ない — negativo informal', sub:'kaku → kakanai · taberu → tabenai', blocks:[
    { tbl:[['Grupo 1: troca -u por -a + nai', 'exemplo'],
           ['-ku → -kanai', 'kaku → kakanai'], ['-gu → -ganai', 'oyogu → oyoganai'], ['-su → -sanai', 'kesu → kesanai'],
           ['-tsu → -tanai', 'matsu → matanai'], ['-mu/-bu/-nu → -manai/-banai/-nanai', 'nomu → nomanai'], ['-ru → -ranai', 'kaeru → kaeranai'],
           ['⚠️ -u → <b>-wanai</b>', 'kau → kawanai · suu → suwanai']] },
    { p:'<b>Grupo 2:</b> tira -ru + nai → taberu → tabenai.<br><b>Grupo 3:</b> suru → shinai · kuru → <b>konai</b>. ⚠️ aru → <b>nai</b>.' },
  ]},
  { id:'b3-jujuu', level:3, title:'Dar e receber — agemasu / kuremasu / moraimasu', sub:'coisas e favores (〜て あげます…)', blocks:[
    { tbl:[['verbo', 'quem é o assunto (は/が)', 'o に marca', 'exemplo'],
           ['あげます', 'quem DÁ (eu → outro)', 'quem recebe ("para")', 'ははに ケーキを あげました'],
           ['くれます', 'quem DÁ (outro → mim)', '(eu, geralmente omitido)', 'ともだちが CDを くれました'],
           ['もらいます', 'quem RECEBE (eu)', 'quem deu ("de")', 'ちちに とけいを もらいました']] },
    { p:'O mesmo vale pra <b>favores</b>: verbo na forma て + agemasu/kuremasu/moraimasu.' },
    { ex:['ともだちに まちを あんないして あげました。', 'tomodachi ni machi wo annai shite agemashita.', 'Mostrei a cidade para um amigo.'] },
    { ex:['ちちは びじゅつかんへ つれて いって くれました。', 'chichi wa bijutsukan he tsurete itte kuremashita.', 'Meu pai me levou ao museu de arte.'] },
    { ex:['ちちに びじゅつかんへ つれて いって もらいました。', 'chichi ni bijutsukan he tsurete itte moraimashita.', '(o mesmo, do meu ponto de vista: recebi o favor do meu pai)'] },
    { tip:'A pegadinha é o <b>ni</b>: com agemasu = "<b>para</b>"; com moraimasu = "<b>de</b>". Quando VOCÊ faz o favor, use agemasu (e não "outro wa watashi ni … moraimashita", que soa estranho).' },
  ]},
  { id:'b3-suki', level:3, title:'suki / kirai — gostar e não gostar', sub:'〜が すき · 〜ことが すき · だいすき', blocks:[
    { f:'[coisa] が すきです。 / [verbo no dicionário] ことが すきです。' },
    { tbl:[['', '', ''], ['だいすき', 'daisuki', 'adoro'], ['すき', 'suki', 'gosto'], ['あまり すきじゃ ありません', 'amari suki ja arimasen', 'não gosto muito'], ['きらい', 'kirai', 'não gosto'], ['だいきらい', 'daikirai', 'detesto']] },
    { ex:['ねこが だいすきです。', 'neko ga daisuki desu.', 'Adoro gatos.'] },
    { ex:['おさらを あらう ことが だいきらいです。', 'osara wo arau koto ga daikirai desu.', 'Detesto lavar a louça.'] },
    { tip:'A partícula é <b>ga</b> (e não を). <b>koto</b> transforma o verbo em "o ato de…": oyogu koto = "nadar".' },
  ]},
  { id:'b3-jouzu', level:3, title:'jouzu / heta — bom e ruim em algo', sub:'〜が じょうず · へた · だめ', blocks:[
    { f:'[coisa] が じょうずです。 / [verbo] ことが へたです。' },
    { ex:['うたが すこし じょうずです。', 'uta ga sukoshi jouzu desu.', 'Canto um pouco bem.'] },
    { ex:['えを かく ことが へたです。', 'e wo kaku koto ga heta desu.', 'Sou ruim em desenhar.'] },
    { ex:['スポーツは ぜんぜん だめです。', 'supootsu wa zenzen dame desu.', 'Em esporte sou péssimo.'] },
    { tip:'Também com <b>ga</b>. Kanji: 上手 (じょうず) e 下手 (へた).' },
  ]},
  { id:'b3-shumi', level:3, title:'shumi wa 〜 koto desu — meu hobby é…', sub:'しゅみは 〜ことです', blocks:[
    { f:'しゅみは [verbo no dicionário] ことです。' },
    { ex:['しゅみは えいがを みる ことです。', 'shumi wa eiga wo miru koto desu.', 'Meu hobby é ver filmes.'] },
    { ex:['A：しゅみは なんですか。 B：サッカーを する ことです。', 'shumi wa nan desu ka. — sakkaa wo suru koto desu.', 'Qual é seu hobby? — Jogar futebol.'] },
  ]},
  { id:'b3-frequencia', level:3, title:'Frequência — quantas vezes, quantas horas', sub:'一日に 〜かい · 一週間に · 〜じかん', blocks:[
    { f:'[período] に [número]かい 〜ます。' },
    { tbl:[['período', ''], ['いちにち (一日)', '1 dia'], ['いっしゅうかん (一週間)', '1 semana'], ['いっかげつ (一か月)', '1 mês'], ['いちねん (一年)', '1 ano']] },
    { p:'〜かい (vezes): ikkai · nikai · sankai · yonkai · gokai · <b>rokkai</b> · nanakai · <b>hakkai</b> · kyuukai · <b>jukkai</b>. Pergunta: <b>nankai</b>.<br>〜じかん (horas de duração): ichijikan… pergunta <b>nanjikan</b>.' },
    { ex:['いちにちに さんかい たべます。', 'ichinichi ni sankai tabemasu.', 'Como três vezes por dia.'] },
    { ex:['いっしゅうかんに いっかい そうじします。', 'isshuukan ni ikkai souji shimasu.', 'Faço faxina uma vez por semana.'] },
    { ex:['いちにちに いちじかん にほんごを べんきょうします。', 'ichinichi ni ichijikan nihongo wo benkyou shimasu.', 'Estudo japonês uma hora por dia.'] },
    { tip:'Não faz nunca: <b>zenzen shimasen</b>.' },
  ]},
  { id:'b3-kara', level:3, title:'doushite? → 〜kara desu (por quê / porque)', sub:'どうして · 〜から', blocks:[
    { ex:['どうして そうじが きらいですか。', 'doushite souji ga kirai desu ka.', 'Por que você não gosta de faxina?'] },
    { ex:['たいへんですから。', 'taihen desu kara.', 'Porque é trabalhoso.'] },
    { ex:['さむいですから、こたつを かいました。', 'samui desu kara, kotatsu wo kaimashita.', 'Como é frio, comprei um kotatsu.'] },
    { tip:'<b>kara</b> vem DEPOIS do motivo (ao contrário do "porque" em português).' },
  ]},

  // ======================= Básico 4 =======================
  { id:'b4-onaji', level:4, title:'onaji desu / onaji ja arimasen — igual / não é igual', sub:'おなじです · おなじじゃ ありません', blocks:[
    { f:'A と B は おなじです。 / A と B は [aspecto] が おなじです。' },
    { ex:['ブラジルと にほんの さいじつは おなじですね。', 'burajiru to nihon no saijitsu wa onaji desu ne.', 'Os feriados do Brasil e do Japão são iguais, né.'] },
    { ex:['ふたりは たいじゅうが おなじです。', 'futari wa taijuu ga onaji desu.', 'Os dois têm o mesmo peso.'] },
    { ex:['ふたりは せいかくが おなじじゃ ありません。', 'futari wa seikaku ga onaji ja arimasen.', 'Os dois não têm a mesma personalidade.'] },
    { p:'Coisas que costumam vir com <b>ga</b>: <b>taijuu</b> (peso), <b>nagasa</b> (comprimento), <b>seikaku</b> (personalidade), <b>kikou</b> (clima), <b>se</b> (altura).' },
    { tip:'Antes de substantivo, <b>onaji</b> vai direto, SEM な: <b>onaji kuni</b> (o mesmo país), e não "onaji na kuni".' },
  ]},
  { id:'b4-dochira', level:4, title:'dochira / no hou ga / yori — comparar duas coisas', sub:'〜と〜と どちらが · 〜のほうが · 〜より', blocks:[
    { f:'A と B と どちらが [adjetivo] ですか。 → A の ほうが [adjetivo] です。' },
    { tbl:[['peça', 'significado', 'papel'],
           ['どちら (dochira)', 'qual (dos dois)?', 'a pergunta'],
           ['〜の ほうが (no hou ga)', '"o A é que é mais…"', 'marca quem VENCE'],
           ['〜より (yori)', '"do que…"', 'marca com quem você compara (quem perde)']] },
    { ex:['バスと ちかてつと どちらが はやいですか。', 'basu to chikatetsu to dochira ga hayai desu ka.', 'Entre ônibus e metrô, qual é mais rápido?'] },
    { ex:['ちかてつの ほうが はやいです。', 'chikatetsu no hou ga hayai desu.', 'O metrô é mais rápido.'] },
    { ex:['ちかてつの ほうが バスより はやいです。', 'chikatetsu no hou ga basu yori hayai desu.', 'O metrô é mais rápido que o ônibus.'] },
    { ex:['バスより ちかてつの ほうが はやいです。', 'basu yori chikatetsu no hou ga hayai desu.', '(o mesmo — a ordem pode trocar)'] },
    { p:'Pra dizer "<b>MUITO</b> mais", coloque <b>ずっと (zutto)</b> antes do adjetivo:' },
    { ex:['ピアノは ははの ほうが ずっと じょうずです。', 'piano wa haha no hou ga zutto jouzu desu.', 'No piano, minha mãe é muito melhor.'] },
    { p:'Pra só AFIRMAR uma comparação, sem ter sido perguntado: <b>A wa B yori 〜 desu</b>.' },
    { ex:['ブラジルは にほんより おおきいです。', 'burajiru wa nihon yori ookii desu.', 'O Brasil é maior que o Japão.'] },
    { p:'Juntando dois adjetivos (い → 〜くて): <b>takai + osoi → takakute osoi</b>.' },
    { ex:['でんしゃは バスより たかくて おそいです。', 'densha wa basu yori takakute osoi desu.', 'O trem é mais caro e mais lento que o ônibus.'] },
    { p:'Se não der pra escolher um dos dois:' },
    { ex:['どちらも すきです。', 'dochira mo suki desu.', 'Gosto dos dois. (dochira mo = ambos)'] },
    { ex:['どちらも すきですから、きめられません。', 'dochira mo suki desu kara, kimeraremasen.', 'Gosto dos dois, então não consigo escolher.'] },
    { tip:'Em japonês não existe uma palavra pra "mais": quem dá essa ideia é o <b>no hou ga</b> (ou o <b>yori</b>). Outras saídas: <b>hito ni yorimasu</b> (depende da pessoa) · <b>sansei desu</b> (concordo).' },
  ]},
  { id:'b4-koto', level:4, title:'〜こと と 〜こと と どちらが — comparar duas AÇÕES', sub:'うちで たべる ことと そとで たべる ことと', blocks:[
    { p:'Pra comparar <b>ações</b> (verbos), transforme cada uma em substantivo com <b>koto</b> e use o mesmo esquema do dochira.' },
    { f:'[verbo] ことと [verbo] ことと どちらが [adj.] ですか。 → [verbo] ことの ほうが [adj.] です。' },
    { ex:['うちで たべる ことと そとで たべる ことと どちらが やすいですか。', 'uchi de taberu koto to soto de taberu koto to dochira ga yasui desu ka.', 'O que é mais barato: comer em casa ou comer fora?'] },
    { ex:['うちで たべる ことの ほうが やすいです。', 'uchi de taberu koto no hou ga yasui desu.', 'Comer em casa é mais barato.'] },
    { ex:['ほんを よむ ことの ほうが おもしろいです。', 'hon wo yomu koto no hou ga omoshiroi desu.', 'Ler livros é mais interessante.'] },
    { ex:['グループで りょこうする ことの ほうが すきです。', 'guruupu de ryokou suru koto no hou ga suki desu.', 'Gosto mais de viajar em grupo.'] },
    { p:'Também dá pra usar <b>より</b> com ações: <b>A ことより B ことの ほうが</b> = "B mais do que A".' },
    { ex:['バイオリンを ひく ことより えを かく ことの ほうが すきです。', 'baiorin wo hiku koto yori e wo kaku koto no hou ga suki desu.', 'Gosto mais de desenhar do que de tocar violino.'] },
    { tip:'O verbo antes de <b>koto</b> fica na forma de <b>dicionário</b> (taberu, yomu, suru), nunca na forma ます.' },
  ]},
  { id:'b4-ichiban', level:4, title:'ichiban — "o mais" (3 ou mais coisas / um grupo)', sub:'〜が いちばん · 〜の なかで', blocks:[
    { f:'A と B と C と(では) [何／どこ／だれ] が いちばん [adj.] ですか。' },
    { f:'[grupo] の 中で [何／どこ／だれ] が いちばん [adj.] ですか。' },
    { f:'Resposta: [escolhido] が いちばん [adj.] です。' },
    { tbl:[['é sobre…', 'pergunta com'], ['coisa', 'なに (nani) / どれ (dore)'], ['lugar', 'どこ (doko)'], ['pessoa', 'だれ (dare)'], ['tempo / época', 'いつ (itsu)']] },
    { ex:['ぎゅうにくと とりにくと ぶたにくと なにが いちばん すきですか。', 'gyuuniku to toriniku to butaniku to nani ga ichiban suki desu ka.', 'Entre carne de boi, frango e porco, de qual gosta mais?'] },
    { ex:['とりにくが いちばん すきです。', 'toriniku ga ichiban suki desu.', 'Gosto mais de frango.'] },
    { ex:['いちねんの なかで いつが いちばん あついですか。', 'ichinen no naka de itsu ga ichiban atsui desu ka.', 'Qual época do ano é a mais quente?'] },
    { ex:['いちがつが いちばん あついです。', 'ichigatsu ga ichiban atsui desu.', 'Janeiro é o mais quente.'] },
    { ex:['かぞくの なかで だれが いちばん せが たかいですか。', 'kazoku no naka de dare ga ichiban se ga takai desu ka.', 'Na sua família, quem é o mais alto?'] },
    { tip:'Cuidado: <b>なんにん</b> (何人) = "QUANTAS pessoas", não "quem". Pra "quem" use <b>だれ</b>. E <b>何+substantivo</b> ("何くつ") não existe: pra "qual (coisa)" entre várias, use <b>どれ</b> → くつの なかで どれが いちばん やすいですか。' },
    { tip:'Na resposta, repita o que veio na pergunta (りょうりが, せが…): <b>〜が いちばん りょうりが じょうずです</b>. E não use さん pra gente da sua própria família.' },
    { tbl:[['quantos itens', 'pergunta', 'resposta'],
           ['2', 'A と B と <b>どちら</b>が…?', 'A <b>の ほうが</b>…'],
           ['3 ou mais', 'A と B と C と <b>なに／どこ／だれ</b>が <b>いちばん</b>…?', 'A <b>が いちばん</b>…'],
           ['um grupo', '[grupo]<b>の なかで</b> なにが <b>いちばん</b>…?', 'A <b>が いちばん</b>…']] },
  ]},
  { id:'b4-wa-ga', level:4, title:'〜は 〜が [adjetivo] — características (corpo, aparência)', sub:'エルザさんは 目が あおいです', blocks:[
    { f:'[pessoa/animal] は [parte] が [adjetivo] です。' },
    { p:'O <b>は</b> marca de quem você está falando (o tema). O <b>が</b> marca a parte que tem a característica. O foco é a pessoa, não a parte.' },
    { ex:['エルザさんは 目が あおいです。', 'eruza-san wa me ga aoi desu.', 'A Elsa tem olhos azuis.'] },
    { ex:['私は あたまが いたいです。', 'watashi wa atama ga itai desu.', 'Estou com dor de cabeça (minha cabeça dói).'] },
    { ex:['うさぎは 耳が 長いです。', 'usagi wa mimi ga nagai desu.', 'O coelho tem orelhas compridas.'] },
    { ex:['ねこは 毛が みじかいです。', 'neko wa ke ga mijikai desu.', 'O gato tem pelo curto.'] },
    { tip:'É o mesmo molde de <b>あには せが たかいです</b> (meu irmão é alto) e <b>ちちは あしが はやいです</b> (meu pai corre rápido).' },
  ]},
  { id:'b4-hoshii', level:4, title:'〜が ほしい — querer uma COISA', sub:'ほしい · ほしくない · ほしかった · ほしくなかった', blocks:[
    { f:'(私は) [substantivo] が ほしいです。' },
    { p:'<b>ほしい</b> = "é desejável" → querer <b>uma coisa</b>. A coisa leva <b>が</b>. Só se usa para <b>eu</b> (afirmando) e <b>você</b> (perguntando).' },
    { tbl:[['forma', 'japonês', 'sentido'], ['afirmativa', '〜が ほし<b>い</b>です', 'quero'], ['negativa', '〜が ほし<b>くない</b>です ／ ほし<b>くありません</b>', 'não quero'], ['passado', '〜が ほし<b>かった</b>です', 'queria'], ['passado negativo', '〜が ほし<b>くなかった</b>です ／ ほし<b>くありませんでした</b>', 'não queria']] },
    { ex:['私は 新しい 車が ほしいです。', 'watashi wa atarashii kuruma ga hoshii desu.', 'Quero um carro novo.'] },
    { ex:['あなたは ペットが ほしいですか。— いいえ、ほしくないです。', 'anata wa petto ga hoshii desu ka. — iie, hoshikunai desu.', 'Você quer um pet? — Não, não quero.'] },
    { ex:['わかい とき、外車が ほしかったです。', 'wakai toki, gaisha ga hoshikatta desu.', 'Quando jovem, eu queria um carro importado.'] },
    { tip:'ほしい conjuga igual a um adjetivo い (たかい → たかくない → たかかった → たかくなかった).' },
  ]},
  { id:'b4-tai', level:4, title:'〜たい — querer FAZER algo', sub:'verbo (ます) + たい · たくない · たかった · たくなかった', blocks:[
    { f:'verbo na forma ます, tira ます, põe たい' },
    { tbl:[['dicionário', 'ます', 'たい'], ['ならう', 'ならいます', 'ならい<b>たい</b>'], ['食べる', '食べます', '食べ<b>たい</b>'], ['する', 'します', 'し<b>たい</b>'], ['行く', '行きます', '行き<b>たい</b>'], ['はたらく', 'はたらきます', 'はたらき<b>たい</b>']] },
    { tbl:[['forma', 'final', 'sentido'], ['afirmativa', '〜た<b>い</b>です', 'quero fazer'], ['negativa', '〜た<b>くない</b>です ／ た<b>くありません</b>', 'não quero fazer'], ['passado', '〜た<b>かった</b>です', 'queria fazer'], ['passado negativo', '〜た<b>くなかった</b>です ／ た<b>くありませんでした</b>', 'não queria fazer']] },
    { p:'O objeto pode levar <b>が</b> (como no livro) ou <b>を</b>: 本が かきたい ／ 本を かきたい. As outras partículas não mudam: <b>へ</b> (destino), <b>と</b> (com quem), <b>で</b> (onde a ação acontece).' },
    { ex:['私は シュラスコが 食べたいです。', 'watashi wa shurasuko ga tabetai desu.', 'Quero comer churrasco.'] },
    { ex:['来年の 夏休み どこへ 行きたいですか。— きょうとへ 行きたいです。', 'rainen no natsuyasumi doko e ikitai desu ka. — kyouto e ikitai desu.', 'Aonde quer ir nas férias de verão do ano que vem? — Quero ir a Kyoto.'] },
    { ex:['だれと けっこんしたいですか。', 'dare to kekkon shitai desu ka.', 'Com quem você quer se casar?'] },
    { ex:['わかい とき、あの 会社で はたらきたかったです。', 'wakai toki, ano kaisha de hatarakitakatta desu.', 'Quando jovem, eu queria trabalhar naquela empresa.'] },
    { ex:['子どもの とき、やさいが 食べたくなかったです。', 'kodomo no toki, yasai ga tabetakunakatta desu.', 'Quando criança, eu não queria comer vegetais.'] },
    { tbl:[['quero…', 'use', 'exemplo'], ['uma COISA', '〜が <b>ほしい</b>', '本が ほしいです (quero um livro)'], ['FAZER algo', 'verbo + <b>たい</b>', '本が かきたいです (quero escrever um livro)']] },
  ]},
];

// ---------- renderização (usada pelos dois apps) ----------
window.GRAMMAR_LEVEL_NAMES = { 1: 'Básico 1', 2: 'Básico 2', 3: 'Básico 3', 4: 'Básico 4' };
window.grammarNoteHTML = function (n) {
  const b = (n.blocks || []).map(x => {
    if (x.f) return `<div class="gn-f">${x.f}</div>`;
    if (x.p) return `<p class="gn-p">${x.p}</p>`;
    if (x.tip) return `<div class="gn-tip">💡 ${x.tip}</div>`;
    if (x.tree) return `<pre class="gn-tree">${x.tree}</pre>`;
    if (x.ex) return `<div class="gn-ex"><div class="gn-jp">${x.ex[0]}</div><div class="gn-ro">${x.ex[1]}</div><div class="gn-pt">${x.ex[2]}</div></div>`;
    if (x.tbl) return `<div class="gn-tw"><table class="gn-tbl">${x.tbl.map((r, i) => `<tr>${r.map(c => i ? `<td>${c}</td>` : `<th>${c}</th>`).join('')}</tr>`).join('')}</table></div>`;
    return '';
  }).join('');
  return `<details class="gn"><summary><span class="gn-t">${n.title}</span><span class="gn-s">${n.sub || ''}</span></summary><div class="gn-b">${b}</div></details>`;
};
window.grammarListHTML = function (levels) {
  const L = (levels && levels.length) ? levels : [1, 2, 3, 4];
  return L.slice().sort().map(lv => {
    const ns = window.GRAMMAR_NOTES.filter(n => n.level === lv);
    if (!ns.length) return '';
    return `<h3 class="gn-lv">${window.GRAMMAR_LEVEL_NAMES[lv]} <small>${ns.length} ${ns.length === 1 ? 'tópico' : 'tópicos'}</small></h3>` + ns.map(window.grammarNoteHTML).join('');
  }).join('') || '<p>Nada aqui ainda.</p>';
};
