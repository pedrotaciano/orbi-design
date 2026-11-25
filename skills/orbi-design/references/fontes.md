# Fontes

## O molde: pstack

Lauren Tan (poteto), [cursor/plugins › pstack](https://github.com/cursor/plugins/tree/9e278fe4d4ecd8bfe98b1b79bf4be662efb338cc/pstack), commit `9e278fe4d4ecd8bfe98b1b79bf4be662efb338cc` (24/11/2026). Licença MIT, Copyright (c) 2026 Lauren Tan.

A orbi-design é o `poteto-mode` refeito para o design da Orbi. A estrutura e o jeito de mandar vêm de lá; o texto é nosso.

| pstack | orbi-design |
|---|---|
| `skills/poteto-mode/SKILL.md`: Non-negotiables (gatilho → ação), Principles (índice, uma linha cada), Autonomy, Subagents, Writing the reply, Playbooks | `SKILL.md`: Inegociáveis, Princípios, Autonomia, Subagentes, Escrevendo a resposta, Roteiros |
| `skills/poteto-mode/worker.md`, a primeira linha de todo brief | `worker.md` |
| `skills/poteto-mode/playbooks/<título>.md`: "You own…", passos copiados para a lista de tarefas, "Reply:" | `playbooks/<título>.md`: "Você é dona…", passos, "Resposta:" |
| *Opening a PR*, roteiro que os outros rodam | Semântica, Sintaxe e Pragmática, as fases que os roteiros rodam, cada uma com a sua porta |
| *Feature*, *Prototype*, *Investigation*, *Babysit*, *Authoring a skill*, *Eval* | Design novo, Variações, Pesquisa e Revisão, Medir depois, Editar a skill, Eval |
| `skills/poteto-mode/scripts/` | `scripts/consulta.mjs`, `scripts/medir.mjs` |
| `skills/principle-<título>/SKILL.md` | `principios/<nome>.md` e `../vignelli/principios/<nome>.md` |
| `principle-explain-the-number` | `principios/explique-o-numero.md` |
| `principle-build-the-lever`, `principle-encode-lessons-in-structure`, `correct` | as regras de dados como script (`consulta.mjs`) e como teste, não como texto |
| `principle-guard-the-context-window` | Semântica, passo 3: dados e referências em subagentes que devolvem só as linhas |
| `sharpen` ("the rawest material") | as receitas de voz (`I5`–`I7`, `L6`) |
| `show-me-your-work` | `dados/<id>.json`, com o job do BigQuery e a hora do `--muda` |

Uma diferença declarada: no pstack cada princípio é uma skill (`principle-*`). Aqui os princípios do Canon ficam na `vignelli`, que também os usa, e esta skill os lê por caminho, sem cópia.

## Vignelli

O processo (semântica, sintaxe, pragmática), os princípios do Canon e as checagens S1–S12 são os da skill `vignelli` (Orbi, CC-BY-4.0). As fontes deles estão em `../vignelli/references/fontes.md`.

## Orbi

- Dados: o projeto BigQuery `orbi-edu-prd`, datasets `_curated` dos apps. As receitas de `references/dados.md` rodaram em 25/11/2026. Os nomes dos códigos do MEC Idiomas vêm do código do app (`ContentReportCategory`, `LESSON_FEEDBACK_REASONS`).
- Referências: o canal [hyper—index](https://www.are.na/sinco-institute/hyper-index) do Are.na, da conta sinco institute, e os (sinco)—semântica e (sinco)—sintaxe da triagem de 23/11/2026.
- Sabedorias: `wisdom.md` da pasta da Orbi; `o-uso-diz-o-sentido` usa a sinergia (sabedoria 4).

Texto da skill: Orbi, CC-BY-4.0.
