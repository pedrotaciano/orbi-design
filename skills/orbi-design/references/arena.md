# Are.na · hyper—index ao vivo

O índice das referências é o canal [hyper—index](https://www.are.na/sinco-institute/hyper-index) da conta sinco institute (slug `hyper-index`, id 6033506). Leia-o ao vivo em cada sessão: os subcanais, a contagem e a descrição de cada um ("Use para …") vêm de lá, não desta página. Esta página só diz qual parte serve a qual fase. Só leitura: nada se cria, conecta ou apaga.

## Como ler

- **O índice:** `getChannelContents` com `id: hyper-index` e `per: 100`. Cada subcanal traz `slug`, `title`, `description` e a contagem.
- **Um subcanal:** `getChannelContents` com o `slug` dele, `per: 24`, uma ou duas páginas.
- **Um canal grande** (os (sinco)—…, com milhares de blocos): não pagine. Use `search` com `query` e `channel_id`.
- **Pela shell a saída longa vem cortada** (`[…ln elided…]`) e o JSON não abre. Pelo `eval`, chame `await tool.mcp__arena_getchannelcontents({...})` e leia `json.loads(r['text'])['result']['data']`.

## Qual parte, para quê

| Parte do índice | Serve para | Onde |
|---|---|---|
| (components)—… | a peça que se desenha: chat, painel, formulário, menu, cartão, modal, estado vazio, tela de app | Semântica, passo 3, até 3 subcanais |
| (beautiful web)—… | o estilo da página: minimalista claro, escuro, editorial, terminal, 3D | Semântica, passo 3, até 3 subcanais |
| [(sinco)—semântica](https://www.are.na/sinco-institute/sinco-semantica) (id 6048770) | o sentido: ideia, valor, processo, memória afetiva | Semântica, passo 3, `search` com os termos da peça |
| [(sinco)—sintaxe](https://www.are.na/sinco-institute/sinco-sintaxe) (id 6048771) | a forma: layout, composição, tipografia, corte, cor; a referência máxima | Sintaxe, passo 1, `search` com a forma pedida |
| (roupas)—… | peça de vestir da marca (camiseta, boné, bolsa) | só quando a peça é roupa |
| (game)—… | cenário e mundo de jogo | só quando a peça é de jogo |

O bloco que vale pelo sentido e pela forma está nos dois (sinco)—…. Os blocos dos (sinco)—… e dos (roupas)—… continuam nos canais de origem; cite sempre o id do bloco, não o canal.
