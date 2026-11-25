### Sintaxe

**Você é dona da estrutura. Ela é rígida: qualquer falha nela é um design bugado.**

Rodada por Design novo.

1. Defina a fonte única da sintaxe e escreva qual é. Nunca as duas ao mesmo tempo:
   - **projeto fractal:** `fractal.config.json` na raiz, com os tokens de `node $FI/bin/fractal.mjs sintaxe` (ou `sintaxe --da-matriz`). A referência máxima é um bloco do (sinco)—sintaxe ou de um (beautiful web)—… lido na Semântica (`references/arena.md`); a captura e o contrato seguem `$FI/skill/SKILL.md`, passos 3 a 6;
   - **sistema existente** (o tema da marca, o `web/sala.css` do laboratório, os tokens de um app): o arquivo de tokens dele.
2. Liste os componentes da peça e, para cada um, os estados de `craft-states`, numa tabela componente × estado. O sinal de aparelho e de conteúdo longo da Semântica entra na tabela.
3. Peça que o sistema não tem (componente, cor, tamanho) → `craft-system`, em modo de adicionar, antes de usar.
4. Desenhe o estado principal e depois os outros, só com peças e tokens do sistema. Componentes antes das telas. Movimento por último, com `animate`.
5. Renderize cada tela a 1440 e a 390 e rode `craft-critique` em autoavaliação. Corrija e renderize de novo.
6. Rode as S1–S12 de `../vignelli/references/checagens-sintaxe.md` e cole a saída de cada uma. Uma falha é bug: corrija no token ou no componente, nunca na página, e rode todas de novo.
7. Escreva a porta.

**Porta 2:** S1–S12 passam, cada uma com a saída que prova. Uma checagem que não se aplica fica `n/a: <motivo>`; nunca some. Uma exceção declarada (`fractal-lint-ignore`) passa só com o motivo dela no relatório, para o humano ver na Pragmática.
