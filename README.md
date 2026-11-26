# Orbi design

O jeito Orbi de desenhar os apps dela (MEC Enem, MEC Idiomas, MEC Livros, MEC Dados), como uma skill para agentes (Claude Code, Codex, Cursor, omp e outros). É o processo da [`vignelli`](https://github.com/pedrotaciano/vignelli) com o uso medido e as referências da Orbi no sentido da peça, e um número para fechar cada entrega:

1. **Semântica:** o que a peça significa. O uso medido no BigQuery entra no sentido ao lado das referências do Are.na (o canal [hyper—index](https://www.are.na/sinco-institute/hyper-index) e os canais orbi e mec da conta, com os subcanais) e das telas de apps em produção do [Mobbin](https://mobbin.com). Dados e referências vão para dois subagentes em paralelo, que devolvem só as linhas da tabela.
2. **Sintaxe:** o sistema de design aplicado sem exceção. As doze checagens S1–S12 da `vignelli`; uma falha é bug e se corrige no token ou no componente, nunca na página.
3. **Pragmática:** o veredito é de um humano. A entrega traz o bloco de revisão e um "medir depois": o sinal que deve mudar se a peça for entendida, com a linha de base medida.

Toda consulta ao BigQuery passa por `scripts/consulta.mjs`, que recusa o que quebra as regras: só leitura, só datasets `_curated`, só agregado, nenhum grupo abaixo de 20 pessoas, nenhuma coluna pessoal, teto de 10 GB. A decisão que o número muda (`--muda`) é escrita antes de rodar e fica gravada em `dados/<id>.json`, com o job do BigQuery. O `scripts/medir.mjs` roda de novo cada "medir depois" na data marcada.

## Instalar

```bash
npx skills add pedrotaciano/vignelli
npx skills add pedrotaciano/orbi-design
```

A `orbi-design` lê os princípios e as checagens da `vignelli` por caminho (`../vignelli/`); as duas ficam lado a lado na pasta de skills do agente (`~/.claude/skills/`, `~/.agents/skills/`).

Para usar, chame `/orbi-design` ou peça algo como "desenha a tela de lição do MEC Idiomas".

## Precisa de

- Node e o `bq` (Google Cloud SDK) com leitura no projeto `orbi-edu-prd`. Sem acesso, o script diz o erro e a entrega declara que os dados não foram consultados.
- Para o Are.na, o `scripts/arena.mjs` (API v3, só leitura) com `ARENA_TOKEN`, um [token pessoal](https://www.are.na/developers/personal-access-tokens) da conta sinco institute, ou o MCP do Are.na. Sem nenhum dos dois, só os canais públicos, sem busca, e a entrega diz o que ficou de fora.
- O MCP do [Mobbin](https://mobbin.com). Sem ele, a entrega declara que o Mobbin não foi consultado.
- A pasta da Orbi (`$ORBI`, `references/recursos.md`): a marca, o `DESIGN.md` de cada app e o `wisdom.md`.

## Melhor com

- [`diego3g/craft`](https://github.com/diego3g/craft): estados, variações, sistema de design e crítica.
- [`emilkowalski/skills`](https://github.com/emilkowalski/skills): movimento e polimento de interação.

## Fontes

A estrutura (inegociáveis, princípios em arquivos, roteiros, scripts) vem do `poteto-mode` do [pstack](https://github.com/cursor/plugins/tree/9e278fe4d4ecd8bfe98b1b79bf4be662efb338cc/pstack), de Lauren Tan (MIT). O processo e os princípios do Canon vêm da `vignelli`. Os detalhes estão em `skills/orbi-design/references/fontes.md`.

## Licença

[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/), Orbi. Pode usar, adaptar e redistribuir, desde que dê o crédito.
