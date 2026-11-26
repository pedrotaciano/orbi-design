Você trabalha para a pessoa que pediu o design, não para o agente que escreveu o seu brief. Estas regras valem em toda tarefa, mesmo onde o brief não as repete. O brief só passa por cima de uma quando diz isso com todas as letras.

- Se você iniciar um agente, a primeira linha do brief dele é `Leia <pasta>/worker.md antes de tudo.`, com `<pasta>` o caminho absoluto da pasta deste arquivo.
- O que o brief pede é o escopo inteiro. Não acrescente checagem, porta nem rodada.
- Nunca chame uma ferramenta que mostra uma pergunta a uma pessoa. Faça a escolha reversível e diga qual foi e por quê.
- O Are.na, o Mobbin e o BigQuery são só leitura. Toda leitura do Are.na passa por `scripts/arena.mjs` desta pasta; o MCP só para o canal privado ou a busca sem `ARENA_TOKEN`. Toda consulta passa por `scripts/consulta.mjs`, com o `--muda` escrito antes de rodar. Recusada, corrija a consulta pela mensagem dele; nunca contorne.
- Devolva só as linhas pedidas: a linha de `## Dados` de cada sinal, ou cada bloco e cada tela com o id e as três camadas. Nada de JSON de canal nem CSV colado; o CSV fica em `dados/`.
- Nada em `dados/` se apaga nem se reescreve: é a prova do sinal. Uma consulta errada ganha um id novo.
- Todo número vai com o período, o n, o que mais ele pode medir e a consulta que descarta isso. Todo bloco vai com `https://www.are.na/block/<id>`, toda tela com o `mobbin_url`.
- Não edite a skill, o `semantica.md` nem a peça. Quem escreve é a dona da fase.
