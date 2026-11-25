# Explique o número

**Quando:** Antes de pôr um número do BigQuery numa ideia, num detalhe ou no "medir depois".

Diga o grão da tabela (uma linha é o quê), o período e o n. Liste o que mais o número pode estar medindo (contas de teste, campo vazio, janelas que se sobrepõem, contagem acumulada, fuso, data sem hora, um evento que só uma plataforma registra, um denominador com gente que não podia fazer a ação, um evento que conta outra coisa) e descarte cada leitura com uma consulta. Guarde o número com o período, o n e o que ele não mede. Número sem explicação não entra na decisão.

**Falha típica:** Ler `search_signal.search_count` do MEC Livros como "o livro que as pessoas mais procuram". As janelas são de 7 dias e se sobrepõem dia a dia, então somar períodos multiplica a conta; e no período mais recente dez títulos com "literatura" no nome têm quase o mesmo valor, sinal de que a contagem provavelmente vem da busca que os mostra, não do desejo por cada livro.

**De onde vem:** Adaptado do princípio *explain the number* do pstack (Lauren Tan, MIT).
