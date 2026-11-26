# Are.na · o hyper—index e a árvore da Orbi, ao vivo

Duas partes, lidas ao vivo em cada sessão; os canais, a contagem e a descrição de cada um ("Use para …") vêm de lá, não desta página.

- **O índice:** o canal [hyper—index](https://www.are.na/sinco-institute/hyper-index) da conta sinco institute (slug `hyper-index`, id 6033506): referências de fora, por peça e por estilo.
- **A árvore da Orbi:** os canais da conta com orbi ou mec no título e os subcanais deles. É o que a Orbi já juntou para cada app e para a marca, e quase tudo é privado.

Só leitura: nada se cria, conecta, muda ou apaga.

## Como ler

Toda leitura passa por `node <esta pasta>/scripts/arena.mjs`, que só faz GET na API v3 e imprime uma linha por item, com `https://www.are.na/block/<id>`, a fonte, a imagem e a descrição.

| Comando | O que lê |
|---|---|
| `indice` | os subcanais do hyper—index, com a contagem e a descrição |
| `arvore --app <enem, idiomas, livros, dados ou orbi>` | os canais cujo título começa por `mec / <app>` (ou por orbi, para a marca e o laboratório) e os subcanais deles. Desce só pelos canais da conta; o canal de outra pessoa entra sem os subcanais dele. Sem `--app`, a árvore inteira |
| `canal <slug ou id> [--paginas 1]` | os blocos de um canal, 24 por página |
| `buscar <termo>… --canal <slug ou id>[,…]` ou `--arvore --app <app>` | a busca do Are.na em cada canal, por termo; os blocos que batem mais termos primeiro |
| `bloco <id>` | um bloco |

- **O token.** `ARENA_TOKEN` é um token pessoal da conta sinco institute, só de leitura ([are.na/developers/personal-access-tokens](https://www.are.na/developers/personal-access-tokens)). Com ele o script lê o privado e busca. Sem ele, lê só o público e o fechado (o índice e os subcanais dele), a 30 leituras por minuto, e a busca não roda.
- **Sem token:** leia os canais privados e busque pelo MCP. `getChannelContents` com `per: 10` (com mais, a validação do MCP falha em alguns canais, como o `orbi`), `search` com `query` e `channel_id`. Chame pelo `eval`, `await tool.mcp__arena_getchannelcontents({...})`, e leia `json.loads(r['text'])['result']['data']`; pela shell a saída longa vem cortada. Nunca uma ferramenta `mcp__arena_*` que cria, conecta, muda ou apaga.
- **Sem token e sem o MCP:** os canais privados ficam `n/a: Are.na privado sem acesso`, e a entrega diz.
- **Canal grande** (os (sinco)—…, com milhares de blocos, e os de outras pessoas na árvore): busque, não pagine nem baixe o canal inteiro. A API proíbe a coleta em massa.

## Qual parte, para quê

| Parte | Serve para | Onde |
|---|---|---|
| árvore do app (`arvore --app <app>`) | o que a Orbi já juntou para o app: tela, mascote, lançamento, cidades, dados | Semântica, passo 3, em toda peça de app: os canais da conta inteiros, os de outras pessoas por `buscar` |
| árvore da marca (`arvore --app orbi`) | marca, landing page, deck, laboratório, e as referências de educação do canal `orbi` | Semântica, passo 3, sempre por `buscar` com os termos do sentido; na peça da marca ou do laboratório, os canais `orbi / …` inteiros |
| (components)—… | a peça que se desenha: chat, painel, formulário, menu, cartão, modal, estado vazio, tela de app | Semântica, passo 3, até 3 subcanais |
| (beautiful web)—… | o estilo da página: minimalista claro, escuro, editorial, terminal, 3D | Semântica, passo 3, até 3 subcanais |
| [(sinco)—semântica](https://www.are.na/sinco-institute/sinco-semantica) (id 6048770) | o sentido: ideia, valor, processo, memória afetiva | Semântica, passo 3, `buscar` com os termos da peça |
| [(sinco)—sintaxe](https://www.are.na/sinco-institute/sinco-sintaxe) (id 6048771) | a forma: layout, composição, tipografia, corte, cor; a referência máxima | Sintaxe, passo 1, `buscar` com a forma pedida |
| (roupas)—… | peça de vestir da marca (camiseta, boné, bolsa) | só quando a peça é roupa |
| (game)—… | cenário e mundo de jogo | só quando a peça é de jogo |

O bloco que vale pelo sentido e pela forma está nos dois (sinco)—…. Os blocos dos (sinco)—…, dos (roupas)—… e da árvore da Orbi continuam nos canais de origem; cite sempre o id do bloco, não o canal.
