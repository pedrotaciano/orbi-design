### Semântica

**Você é dona do sentido. Nenhum traço antes de saber o que a peça quer dizer e quem a usa de verdade.**

Rodada por Design novo e Pesquisa.

1. Escreva a peça em uma linha: o que é, para quem, a próxima ação de quem usa, o app. Leia o `DESIGN.md` do projeto e `$ORBI/wisdom.md`. Peça da marca: o tema pelo guia de `references/recursos.md`.
2. Escreva de 2 a 4 perguntas sobre quem usa a peça (quem chega, quando, em que aparelho, o que faz antes e depois, onde para, o que diz) e, antes de rodar qualquer uma, o resultado que mudaria qual decisão de desenho. Junte os sinais vencidos do `medir.mjs` e as perguntas que a rodada anterior deixou.
3. Dispare dois subagentes em paralelo:
   - **Dados:** as perguntas e o "muda se" do passo 2, o dataset do app (`references/dados.md` › Mapa) e a pasta do projeto. Cada pergunta roda por `scripts/consulta.mjs`, de uma receita de `references/dados.md` › Sinais ou nova, e volta como uma linha de `## Dados`. App sem dataset: não dispare; P1.4 fica `n/a`.
   - **Referências:** a peça, o app, o estilo e de 2 a 3 termos do sentido. Lê o Are.na ao vivo pelo `scripts/arena.mjs` (`references/arena.md`): a árvore do app inteira e a busca dos termos na árvore da marca; até 3 (components)—… e 3 (beautiful web)—…; a busca no (sinco)—semântica; a fonte viva de até 5 blocos centrais. Vê no Mobbin de 3 a 5 telas, ou um fluxo, de apps do mesmo tipo (`references/mobbin.md`). Volta de 10 a 15 blocos lidos, pelo menos 3 da árvore da Orbi, e as telas do Mobbin, cada um com o id ou o `mobbin_url` e as camadas é, evoca e a marca diz, e os que leu e descartou, com o porquê.
4. Confira o que voltou. Abra os CSVs de `dados/` e explique cada número (**Explique o número**); o que não se explica fica fora das ideias, e é dito. Olhe a imagem dos blocos centrais e das telas do Mobbin.
5. Escreva `semantica.md` na pasta do projeto (em projeto fractal, `fractal/semantica.md`):
   - uma abertura de um parágrafo;
   - `## Conceitos`: `| id | Conceito | O que significa aqui | De onde vem |`, de 5 a 9, cada um com um bloco, uma tela do Mobbin ou um sinal;
   - `## Dados`: `| id | Pergunta | Muda se | Número | Período · n | Pode medir também | Descartado por | Job |`;
   - `## Camadas`: é, evoca, a marca diz e o uso mostra (o que os sinais dizem de quem usa e como);
   - `## Anti-referências`;
   - `## Ideias`: de 1 a 3, cada uma com o conceito, o bloco, a tela ou o sinal e a decisão de desenho que ela muda; pelo menos uma vem de um sinal. Ideia que não muda nada sai.
6. Um sinal contradiz o pedido ou uma referência → escreva os dois lados e a decisão. O dado decide o fato (quem, quando, onde, quanto). A contradição de gosto vai para o humano, na Pragmática.
7. Aplique as sabedorias do `wisdom.md` às ideias. Escreva qual mudou qual decisão.
8. Escreva a porta.

**Porta 1** (cada critério passa, falha ou fica `n/a: <motivo>`; o que falha volta ao passo dele):

- P1.1 Cada conceito cita um bloco lido, uma tela do Mobbin vista ou um sinal medido nesta sessão.
- P1.2 As quatro camadas da peça estão escritas, sem frase repetida entre elas.
- P1.3 Há uma ideia que muda uma decisão de desenho, com a decisão escrita.
- P1.4 App com dataset: uma ideia vem de um sinal cujo "muda se" foi escrito antes de rodar (`escritoEm` em `dados/<id>.json`).
- P1.5 Cada sinal usado tem o grão, uma leitura alternativa e a consulta que a descarta.
- P1.6 Toda consulta passou pelo `scripts/consulta.mjs`: cada `D…` tem o seu `dados/<id>.json` com o job, e nenhum valor de um aviso de grupo pequeno é citado.
- P1.7 Há uma anti-referência.
- P1.8 Uma sabedoria está nomeada com a decisão que ela mudou.
- P1.9 O tema, ou a marca do pedido, está nomeado.
