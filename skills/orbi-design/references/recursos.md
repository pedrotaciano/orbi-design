# Recursos da Orbi

`ORBI` é a pasta da Orbi (nesta máquina, `~/Documents/orbi`); `LAB` é a do laboratório (`$ORBI/laboratorio`); `FI=$ORBI/fractal-interface`.

- **Marca:** o guia de temas `$LAB/docs/configuracoes/artefatos/marca/DESIGN.md` e o `DESIGN.md` de cada tema na mesma pasta; na pasta da Orbi, o `DESIGN.md` da raiz, o núcleo `branding/design-evolutivo/nucleo.md`, os temas da geração mais recente, os tokens, a tipografia e o símbolo em `branding/marca/02-identidade/` e os assets em `brand-assets/`. Cada app tem o `DESIGN.md` da pasta dele.
- **Dados:** `references/dados.md`. Sem acesso ao BigQuery, o `consulta.mjs` diz o erro; P1.4 fica `n/a: BigQuery sem acesso (<erro>)` e a entrega declara que os dados não foram consultados.
- **Referências:** `references/arena.md`, pelo `scripts/arena.mjs`, com ou sem o MCP. Sem `ARENA_TOKEN` e sem as ferramentas `mcp__arena_*`, só o público: os canais privados da Orbi ficam `n/a` e a entrega diz. `references/mobbin.md`: sem as ferramentas `mcp__mobbin_*`, a entrega declara que o Mobbin não foi consultado. Sem nenhum dos dois, os conceitos vêm dos sinais, do `DESIGN.md` e do pedido.
- **Sabedorias:** `$ORBI/wisdom.md`.
- **Estrutura:** `$FI` (`bin/fractal.mjs`, `lint.mjs`, `derive.js`, `skill/SKILL.md`). Sem essa pasta, diga que as checagens automáticas não rodaram e faça as manuais equivalentes; nunca marque "passa" sem rodar.
