// ============================================================
//  DICIONÁRIO BASE (JP -> PT) para o lookup por toque na leitura.
//  Cobre partículas, palavras comuns e o vocabulário dos textos.
//  É mesclado ao vocabulário dos decks (os decks têm prioridade).
//  Para ampliar: é só acrescentar pares "palavra":"significado".
// ============================================================
window.JP_DICT = {
  // ---- partículas / gramática ----
  "は":"partícula de tópico (indica o assunto)","が":"partícula de sujeito",
  "を":"partícula de objeto (complemento)","に":"partícula: em / a / para (lugar, tempo, alvo)",
  "へ":"partícula: para (direção)","で":"partícula: em / com (lugar da ação, meio)",
  "と":"e / com","も":"também","の":"de (posse/relação)","や":"e (lista parcial)",
  "から":"de / a partir de / porque","まで":"até","ね":"né? (concordância)","よ":"(ênfase)",
  "か":"(partícula de pergunta)","です":"é / ser (polido)","ます":"(verbo, forma polida)",
  "ました":"(passado polido)","ません":"(negativo polido)","でした":"era / foi (polido)",
  "ましょう":"vamos ~","ませんか":"não quer ~?","ください":"por favor / me dê",
  // ---- demonstrativos / interrogativos ----
  "これ":"isto","それ":"isso","あれ":"aquilo","この":"este","その":"esse","あの":"aquele",
  "ここ":"aqui","そこ":"aí","あそこ":"ali","どこ":"onde","どこも":"em lugar nenhum",
  "なに":"o que","なん":"o que / quantos","いつ":"quando","だれ":"quem","どう":"como",
  "どうですか":"que tal? / como está?","どちら":"qual / onde (formal)","いくら":"quanto custa?",
  "いくつ":"quantos?","なんじ":"que horas?","どんな":"que tipo de",
  // ---- conectivos / advérbios ----
  "そして":"e / além disso","それから":"depois disso","それで":"por isso / então",
  "それじゃ":"então (transição)","でも":"mas","しかし":"mas / porém","だから":"por isso",
  "とても":"muito","よく":"bem / com frequência","たくさん":"muito(s)","あまり":"não muito",
  "すこし":"um pouco","ちょっと":"um pouco / (recusa educada)","もう":"já","まだ":"ainda",
  "いつも":"sempre","ときどき":"às vezes","まず":"primeiramente","ぜんぶで":"ao todo",
  "ずいぶん":"bastante","しか":"só / apenas (+ negativo)","いっしょに":"juntos","ひとりで":"sozinho",
  "あるいて":"a pé","まっすぐ":"em frente","ありがとうございます":"obrigado(a)",
  "いらっしゃいませ":"seja bem-vindo(a)","どういたしまして":"de nada","ざんねん":"que pena",
  // ---- verbos (dicionário e formas comuns) ----
  "あります":"haver / ter (coisas)","ある":"haver / ter (coisas)","います":"haver / estar (seres vivos)","いる":"estar (ser vivo)",
  "いきます":"ir","いく":"ir","いって":"indo / vá (te-form de ir)","いきましょう":"vamos (ir)","いきませんか":"não quer ir?",
  "きます":"vir","かえります":"voltar (pra casa)","します":"fazer","する":"fazer","みます":"ver / assistir","みる":"ver",
  "たべます":"comer","たべて":"comendo (te-form)","のみます":"beber","のんで":"bebendo (te-form)",
  "おきます":"acordar / levantar","おきて":"acordando (te-form)","ねます":"dormir","はたらきます":"trabalhar",
  "かいます":"comprar","かって":"comprando (te-form)","かいました":"comprei","かきます":"escrever","かいて":"escrevendo (te-form)",
  "よみます":"ler","よんで":"lendo (te-form)","おくります":"enviar","かります":"pegar emprestado",
  "のります":"embarcar / pegar (transporte)","おります":"descer / desembarcar","おりて":"descendo (te-form)",
  "あるきます":"andar / caminhar","あいます":"encontrar (alguém)","あって":"encontrando / havendo (te-form)",
  "まちます":"esperar","わかります":"entender","わかりました":"entendi","わたります":"atravessar",
  "あそびます":"brincar / divertir-se","あびます":"tomar (ducha)","みがきます":"escovar","みがいて":"escovando (te-form)",
  "はいります":"entrar","はいって":"entrando (te-form)","でます":"sair","はじまります":"começar","おわります":"terminar",
  "つかいます":"usar","とまります":"hospedar-se","かいものします":"fazer compras","べんきょうします":"estudar",
  "べんきょうして":"estudando (te-form)","さんぽします":"passear","つかれます":"cansar-se","つかれました":"fiquei cansado",
  "やすみます":"descansar","しにます":"morrer","ききます":"ouvir / perguntar","きいて":"ouvindo / perguntando (te-form)",
  // ---- tempo ----
  "あさ":"manhã","ひる":"meio-dia / tarde","ばん":"noite","ごぜん":"de manhã (AM)","ごご":"à tarde (PM)",
  "きょう":"hoje","あした":"amanhã","あさって":"depois de amanhã","きのう":"ontem","おととい":"anteontem",
  "けさ":"esta manhã","こんばん":"esta noite","ゆうべ":"ontem à noite","ゆうがた":"fim de tarde",
  "まいあさ":"toda manhã","まいにち":"todo dia","まいばん":"toda noite","まいしゅう":"toda semana",
  "せんしゅう":"semana passada","らいしゅう":"semana que vem","せんげつ":"mês passado","らいげつ":"mês que vem",
  "ことし":"este ano","なつやすみ":"férias de verão","やすみ":"folga / descanso","つぎ":"próximo",
  "じかん":"hora / tempo","いっしゅうかん":"uma semana","ぷん":"minuto(s)","じ":"hora (contador)",
  "にちようび":"domingo","どようび":"sábado","もくようび":"quinta-feira","はじめ":"início","すえ":"fim",
  "ごろ":"por volta de","はん":"meia (e meia)",
  // ---- números ----
  "ひとつ":"um (unidade)","ふたつ":"dois","みっつ":"três","よっつ":"quatro","いつつ":"cinco",
  "いち":"um","さん":"três","よん":"quatro","ご":"cinco","ろく":"seis","なな":"sete","はち":"oito",
  "じゅっぽん":"dez (objetos longos)","えん":"iene",
  // ---- lugares / cidade ----
  "まち":"cidade","うち":"casa","いえ":"casa","へや":"quarto","アパート":"apartamento","マンション":"apartamento (prédio)",
  "ビル":"prédio","かいしゃ":"empresa","がっこう":"escola","だいがく":"universidade","えき":"estação",
  "こうえん":"parque","としょかん":"biblioteca","きっさてん":"cafeteria","レストラン":"restaurante",
  "スーパー":"mercado","コンビニ":"loja de conveniência","びじゅつかん":"museu de arte","どうぶつえん":"zoológico",
  "やっきょく":"farmácia","ゆうびんきょく":"correio","ぎんこう":"banco","はなや":"floricultura","パンや":"padaria",
  "ぶんぼうぐや":"papelaria","ラーメンや":"restaurante de lámen","やおや":"quitanda","しょくどう":"refeitório",
  "おふろ":"banho","いけ":"lago","みち":"caminho / rua","となり":"ao lado","ちかく":"perto","まわり":"ao redor",
  "あいだ":"entre","なか":"dentro","まえ":"frente","うしろ":"atrás","うえ":"em cima","した":"embaixo","がわ":"lado",
  "うみ":"mar","やま":"montanha","かわ":"rio","そら":"céu","くに":"país","がいこく":"exterior","ちず":"mapa",
  "おおさか":"Osaka","こうべ":"Kobe","きょうと":"Kyoto","なら":"Nara","にほん":"Japão","ちゅうごく":"China",
  "ベレン":"Belém","マナウス":"Manaus","フラメンゴ":"Flamengo","うえの":"Ueno (bairro de Tóquio)",
  // ---- comida / bebida ----
  "あさごはん":"café da manhã","ひるごはん":"almoço","ばんごはん":"jantar","ごはん":"comida / arroz",
  "コーヒー":"café","おちゃ":"chá","みず":"água","ビール":"cerveja","ジュース":"suco","ミルク":"leite",
  "トースト":"torrada","ケーキ":"bolo","チーズケーキ":"cheesecake","くだもの":"frutas","さかな":"peixe",
  "りんご":"maçã","バナナ":"banana","サンドイッチ":"sanduíche","たまごサンド":"sanduíche de ovo","ささのは":"folha de bambu",
  // ---- pessoas / animais ----
  "ひと":"pessoa","ともだち":"amigo(a)","かぞく":"família","おきゃくさん":"cliente","せんせい":"professor(a)",
  "がくせい":"estudante","おとこ":"homem","おんな":"mulher","こ":"criança","こども":"criança",
  "どうぶつ":"animal","いぬ":"cachorro","ねこ":"gato","とり":"pássaro","さる":"macaco","とら":"tigre",
  "パンダ":"panda","キリン":"girafa","しか":"cervo",
  // ---- objetos / outros ----
  "ほん":"livro","しんぶん":"jornal","てがみ":"carta","メール":"e-mail","かばん":"bolsa","くつ":"sapato",
  "カメラ":"câmera","コンピューター":"computador","パソコン":"computador","でんわ":"telefone","とけい":"relógio",
  "くるま":"carro","でんしゃ":"trem","ちかてつ":"metrô","バス":"ônibus","ひこうき":"avião","ふね":"barco",
  "きっぷ":"passagem","シャワー":"ducha","え":"pintura / desenho","はな":"flor","き":"árvore",
  "レポート":"relatório","かいぎ":"reunião","しごと":"trabalho","じゅぎょう":"aula",
  "オンライン":"online","ゲーム":"jogo","えいが":"filme / cinema","おんがく":"música","スポーツ":"esporte",
  "にほんご":"japonês (idioma)","かこう":"foz (do rio)","じょうりゅう":"montante / rio acima","りょこう":"viagem",
  "さんぽ":"passeio","かいもの":"compras","ざんぎょう":"hora extra","びょう":"segundo(s)",
  // ---- adjetivos ----
  "おおきい":"grande","ちいさい":"pequeno","たかい":"alto / caro","やすい":"barato","あたらしい":"novo",
  "ふるい":"antigo / velho","おおい":"muito / numeroso","すくない":"pouco","ちかい":"perto","とおい":"longe",
  "ひろい":"amplo / espaçoso","せまい":"estreito","あつい":"quente","さむい":"frio","すずしい":"fresco (clima)",
  "あたたかい":"morno / quente","おいしい":"gostoso","まずい":"ruim de gosto","おもしろい":"interessante",
  "たのしい":"divertido","いそがしい":"ocupado","はやい":"rápido","ながい":"longo","みじかい":"curto",
  "わかい":"jovem","かわいい":"fofo","きれい":"bonito / limpo","にぎやか":"movimentado / animado",
  "しずか":"calmo / tranquilo","ゆうめい":"famoso","しんせつ":"gentil","べんり":"prático / conveniente",
  "すてき":"encantador / maravilhoso","めずらしい":"raro / curioso","あかるい":"claro / alegre"
};
