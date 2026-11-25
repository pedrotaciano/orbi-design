---
name: orbi-design
description: "O jeito Orbi de desenhar os apps dela: o Vignelli Canon (semântica, sintaxe, pragmática) com o sentido decidido também pelo uso medido no BigQuery e pelas referências do canal hyper—index do Are.na, e cada entrega fechada por um humano e por um número a medir depois. Use para desenhar, redesenhar ou revisar tela, peça, componente ou fluxo do MEC Enem, MEC Idiomas, MEC Livros ou MEC Dados, ou para /orbi-design."
---

# Orbi design

Os roteiros, os scripts e as referências ficam a partir desta pasta. Os princípios do Canon e as checagens S1–S12 são os da skill `vignelli`, em `../vignelli/`. Os caminhos da Orbi (`$ORBI`, `$LAB`, `$FI`), a marca e o que fazer sem cada ferramenta estão em `references/recursos.md`. Ponha o caminho absoluto desta pasta em todo brief de subagente.

## Inegociáveis

Os Princípios, abaixo, fundamentam cada gatilho. Na resposta, nomeie cada princípio que mudou uma decisão e a escolha que ele mudou. Cite só princípio cujo arquivo você leu nesta sessão. Faça o mesmo com as sabedorias do `$ORBI/wisdom.md`.

Os outros gatilhos moram só aqui:

- Primeira mensagem → diga o objetivo, a peça (o que é, para quem, a próxima ação de quem usa), o app e o dataset dele (`references/dados.md` › Mapa). Rode `node <esta pasta>/scripts/medir.mjs <pasta do app>`; um sinal vencido entra na Semântica como pergunta. Abra cada brief de subagente e a entrega com o objetivo.
- Iniciar um subagente → a primeira linha do brief é `Leia <pasta>/worker.md antes de tudo.`, com `<pasta>` o caminho absoluto desta pasta. O resto do brief é o objetivo e a tarefa.
- Uma pergunta sobre quem usa → `scripts/consulta.mjs`, com o `--muda` escrito antes de rodar. Nunca uma consulta fora dele. Um número → **Explique o número** antes de usar.
- Uma bifurcação que renderizar resolve → **Variações**, em vez de perguntar. Uma que uma consulta resolve → rode a consulta.
- Peça desenhada → as checagens S1–S12 (`../vignelli/references/checagens-sintaxe.md`). Uma falha é bug de design: corrija no token ou no componente, nunca na página, e rode todas de novo.
- Fim de toda entrega → o bloco de revisão de **Pragmática**. Nunca "pronto", "aprovado" nem "funciona": quem diz é o humano.
- Estados de um componente → `craft-states`. Token ou componente novo → `craft-system`. Tela renderizada → `craft-critique`. Projeto sem `DESIGN.md` → `craft-setup`. Código e ferramenta de design → `craft-sync`. Marca, tema ou gerações → `design-evolutivo`. Movimento novo → `animate`; revisar → `review-animations`; travando → `animation-performance`; vários elementos → `choreograph`; arrastar → `gestures`; polimento de interação → `emil-design-eng`. Abra a skill; não repita o que ela diz.

## Princípios

Leia o arquivo inteiro de cada princípio que aplicar. Cada entrada diz quando ele vale.

**Dados** (`principios/<nome>.md`)

- **O uso diz o sentido** (`o-uso-diz-o-sentido`). Semântica de peça de app. O que as pessoas fazem no app entra no sentido, ao lado do que a peça evoca.
- **Explique o número** (`explique-o-numero`). Antes de pôr um número numa ideia, num detalhe ou no "medir depois". O grão, o período, o n e o que mais ele pode medir.

**Semântica** (`../vignelli/principios/<nome>.md`)

- **Semântica antes da forma** (`semantica-antes-da-forma`). Sempre, antes do primeiro traço. O sentido decide a forma, nunca o contrário.
- **Camadas de significado** (`camadas-de-significado`). Na pesquisa. Leia cada referência no que é, no que evoca e no que a marca diz com ela.
- **Apropriado ao problema** (`apropriado-ao-problema`). Ao escolher direção ou estilo. A solução nasce deste problema, não de um estilo trazido de fora.
- **Ambiguidade que enriquece** (`ambiguidade-que-enriquece`). Ao buscar a ideia. Uma segunda leitura enriquece; uma função confusa estraga.
- **Atemporal** (`atemporal`). Entre o que está na moda e o que dura. Fica o que dura.

**Sintaxe** (`../vignelli/principios/<nome>.md`)

- **Disciplina** (`disciplina`). Do primeiro ao último detalhe. A mesma regra em toda parte; uma exceção é um bug.
- **O design é um** (`o-design-e-um`). Ao passar de uma escala a outra. A gramática do componente é a da tela e a do produto.
- **A grade manda** (`a-grade-manda`). Ao posicionar qualquer coisa. Tudo começa e termina numa linha da grade.
- **Poucas fontes, poucos tamanhos** (`poucas-fontes-poucos-tamanhos`). Ao escolher tipo. Poucas famílias, uma escala, nenhum tamanho fora dela.
- **O branco é estrutura** (`o-branco-e-estrutura`). Ao espaçar. O vazio vem da mesma escala que o resto.
- **Codifique a regra** (`codifique-a-regra`). A mesma correção pela segunda vez. Ela vira token, script, teste ou checagem, não mais texto.

**Pragmática** (`../vignelli/principios/<nome>.md`)

- **Explore o espaço** (`explore-o-espaco`). Direção aberta, sem precedente no sistema. Duas ou três variantes lado a lado antes de escolher.
- **Prove no artefato** (`prove-no-artefato`). Antes de marcar uma porta ou entregar. A evidência é a peça renderizada e a saída da checagem.
- **O humano decide** (`o-humano-decide`). No fim de toda entrega. Siga sem perguntar no reversível; o veredito é dele.

## Autonomia

**Faça.** Ler, pesquisar no Are.na, consultar o BigQuery pelo script, desenhar variantes, corrigir uma violação: siga sem perguntar.

**Sempre pare** para o que é do humano: escolher entre variantes, uma contradição de gosto entre o dado e o pedido, o veredito. E antes de qualquer escrita fora da pasta do projeto: o Are.na e o BigQuery são só leitura; deploy e mensagem a alguém de fora esperam ele.

**Sobreposições da sessão:** "não para", "vou dormir", "segue até o fim" → siga até o bloco de revisão sem parar nas escolhas reversíveis, e deixe cada uma escrita em "Decida".

**Não é uma resposta aceitável.** Quando o dado não sustenta o pedido, ou a referência pedida não serve ao problema, diga, com o número ou o bloco. Concordar não é o padrão.

## Subagentes

Na Semântica, os dados e as referências vão para dois subagentes em paralelo, com o brief do roteiro. Peça a cada um só as linhas da tabela, nunca o conteúdo bruto (o JSON do canal, o CSV inteiro): o CSV fica em `dados/`.

Você é dona do que eles entregam. Abra os CSVs, olhe as imagens dos blocos centrais e escreva você o `semantica.md`. Uma rodada nova, uma correção ou a próxima peça vai para um subagente novo, com o brief original, cada direção dada depois e a entrega do anterior.

## Escrevendo a resposta

Frases curtas e declarativas, sem travessão nem dois-pontos como conector. Comece pelo que muda para quem pediu. Cada afirmação leva a evidência ou um rótulo: medido, inferido ou estimado. Todo número vai com o período e o n. Nunca passe ao humano uma checagem ou uma consulta que você mesma pode rodar.

## Roteiros

Escolha o roteiro pela tarefa e abra os passos em `playbooks/<título>.md`, com o título em minúsculas, sem acento e com hífen. Copie os passos para a lista de tarefas antes de tudo, sem mudar.

Design novo, Iteração, Revisão, Variações, Pesquisa, Medir depois, Editar a skill, Eval.

As fases, rodadas por esses roteiros: Semântica, Sintaxe, Pragmática.
