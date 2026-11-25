# Dados do BigQuery

O uso dos apps da Orbi está no projeto `orbi-edu-prd` (região `southamerica-east1`). Use só os datasets `_curated`; os `_staging` são da carga. Tudo aqui é leitura. Cada consulta desta página rodou em 25/11/2026; os números mudam, então meça de novo em cada sessão.

## Mapa

| App | Pasta | Dataset | O que responde |
|---|---|---|---|
| MEC Enem | `$ORBI/mec-enem` | `enem_curated` | onde moram e que curso querem, quando estudam, o que fazem (quiz, competência, redação), quem volta (coortes), quanto acertam |
| MEC Idiomas | `$ORBI/mec-idiomas` | `idiomas_curated` | que língua, por que e quanto tempo por dia (onboarding), sequência, dia da semana, a nota da lição e o motivo dela, onde o conteúdo quebra |
| MEC Livros | `$ORBI/mec-livros` | `livros_curated` | plataforma, a hora em que abrem um livro, quanto leem, o que aparece nas buscas, por que pedem ajuda e o que dizem ao suporte |
| MEC Dados | `$ORBI/mec-dados` | `ideb_curated`, `censo_escolar_curated`, `cad_unico_curated` | o conteúdo público que a tela mostra (por município e ano), não quem usa o app: os sinais dizem o que cabe na tela, não o público |
| Marca Orbi, sites, Orbi Laboratório | | nenhum | P1.4 fica `n/a: sem dataset de uso` |

`ibge_censo_curated` existe e está sem tabelas.

## Regras

O `scripts/consulta.mjs` recusa a consulta que quebra uma das cinco primeiras, com a mensagem do conserto.

- **Só leitura e só `_curated`.** Um SELECT só, nas tabelas do `orbi-edu-prd` nomeadas inteiras entre crases. O dry run confere as tabelas que o próprio BigQuery resolveu.
- **Só agregado.** A saída tem contagens, proporções, medianas e faixas, nunca uma linha por registro nem `*`. Um id de pessoa só entra dentro de `COUNT(DISTINCT …)` ou de um `JOIN`.
- **Nenhum grupo abaixo de 20 pessoas.** Toda consulta agrupada sobre pessoas ou eventos delas leva `HAVING <contagem> >= 20`. Uma faixa que some por isso é dita, não reconstruída. O dado público por município (MEC Dados) e o `INFORMATION_SCHEMA` ficam fora desta regra.
- **Nenhuma coluna pessoal**, nem no `WHERE`: nome, nome social, apelido, e-mail, CPF, documento, número de inscrição, telefone, data de nascimento exata, endereço, coordenada, id de login externo (`cognito_sub`, `gov_br_id`, `ExternalUserId`), user agent, comentário. Também não as tabelas de texto livre (`chatbot_message`, `contact_message`) nem as de endereço e local.
- **Teto de 10 GB por consulta**, lido no dry run antes de rodar.
- **Esquema antes da consulta.** Leia os tipos: ``SELECT column_name, data_type FROM `orbi-edu-prd.<dataset>.INFORMATION_SCHEMA.COLUMNS` WHERE table_name = '<tabela>'``. Data pode ser `DATE` sem hora e booleano pode ser `STRING`.
- **Fuso e janela.** Hora no fuso `America/Sao_Paulo`. Janela padrão de 28 dias até hoje; outra janela vai escrita na pergunta.
- **Nada de pessoa no artefato.** Em `semantica.md`, no HTML e na resposta vão só a consulta e o agregado.

## Como rodar

Toda consulta passa pelo script, que roda o `bq` no `orbi-edu-prd` (o MCP do BigQuery pode ter subido com outro projeto; o script não depende dele):

```
node <esta pasta>/scripts/consulta.mjs --pasta <pasta do semantica.md> --id D1 \
  --pergunta "Em que aparelho abrem o livro?" \
  --muda "Android acima de 60% → a leitura nasce em 390 e a mesa vira variante" \
  consulta.sql
```

- O `--muda` é o resultado que mudaria qual decisão de desenho, escrito antes de rodar. O script grava a hora dele (`escritoEm`) e recusa rodar de novo um id já medido: um sinal novo ganha outro id.
- Grava `dados/<id>.csv` e `dados/<id>.json` (pergunta, muda, a consulta com o sha256 dela, job do BigQuery, bytes, quando) e imprime o resultado em tabela. Nada em `dados/` se apaga nem se reescreve à mão: é a prova do sinal.
- Uma coluna de contagem fora do `HAVING` com grupos abaixo de 20 sai como "Atenção" e fica em `avisos` no json. Esses valores não se citam; ponha a condição no `HAVING` (`HAVING a >= 20 AND b >= 20`) ou agregue mais.
- `--olhar-em AAAA-MM-DD` faz do sinal um "medir depois" (id `M1`, `M2`…), que o `scripts/medir.mjs` roda de novo na data.
- `--checar` só confere as regras, sem rodar. A consulta também pode vir pela entrada, com `-`.
- Sem `bq` ou sem acesso, o erro sai do script; P1.4 fica `n/a: BigQuery sem acesso (<erro>)`.

## Sinais

Receitas prontas, que rodaram e passam no script. O id daqui (`E1`, `I1`, `L1`, `G1`) é o da receita; o sinal da sessão ganha o seu (`D1`, `D2`…) e cita a receita. As receitas de "voz" (`I5`, `I6`, `I7`, `L6`) contam o que as pessoas disseram por categoria, nunca o texto delas.

### MEC Enem (`enem_curated`)

**E1 · Onde moram.** Grão: uma conta.

```sql
SELECT State AS estado, COUNT(*) AS pessoas
FROM `orbi-edu-prd.enem_curated.Users`
GROUP BY 1 HAVING pessoas >= 20 ORDER BY pessoas DESC LIMIT 10
```

**E2 · Que curso querem.** Grão: uma conta que respondeu.

```sql
SELECT TRIM(CourseOfInterest) AS curso, COUNT(*) AS pessoas
FROM `orbi-edu-prd.enem_curated.Users`
WHERE TRIM(CourseOfInterest) != ''
GROUP BY 1 HAVING pessoas >= 20 ORDER BY pessoas DESC LIMIT 10
```

**E3 · A hora em que estudam.** Grão: um evento de atividade.

```sql
SELECT EXTRACT(HOUR FROM DATETIME(DateOccurred, 'America/Sao_Paulo')) AS hora, COUNT(*) AS eventos
FROM `orbi-edu-prd.enem_curated.UserActivityLogs`
WHERE DateOccurred >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 28 DAY)
GROUP BY 1 HAVING eventos >= 20 ORDER BY 1
```

**E4 · O que fazem.** Grão: um evento de atividade.

```sql
SELECT ActivityType AS atividade, COUNT(*) AS eventos
FROM `orbi-edu-prd.enem_curated.UserActivityLogs`
WHERE DateOccurred >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 28 DAY)
GROUP BY 1 HAVING eventos >= 20 ORDER BY eventos DESC
```

**E5 · Quem volta.** Grão: coorte semanal × semanas desde o cadastro. Pondere pelas pessoas da coorte, nunca a média das taxas.

```sql
SELECT weeks_since_signup AS semana, ROUND(SUM(active_users) / SUM(cohort_users), 3) AS retencao
FROM `orbi-edu-prd.enem_curated.cohort_retention_weekly`
WHERE weeks_since_signup IN (0, 1, 4, 8, 12)
GROUP BY 1 HAVING SUM(cohort_users) >= 20 ORDER BY 1
```

**E6 · Quanto acertam.** Grão: um dia.

```sql
SELECT ROUND(AVG(users_answering_questions)) AS pessoas_por_dia, ROUND(AVG(accuracy_rate), 3) AS acerto, SUM(essays_submitted) AS redacoes
FROM `orbi-edu-prd.enem_curated.daily_engagement_volume`
WHERE activity_date >= DATE_SUB(CURRENT_DATE('America/Sao_Paulo'), INTERVAL 28 DAY)
```

### MEC Idiomas (`idiomas_curated`)

**I1 · Que língua.** Grão: uma pessoa numa língua.

```sql
SELECT l.name AS lingua, COUNT(*) AS pessoas
FROM `orbi-edu-prd.idiomas_curated.user_languages` ul
JOIN `orbi-edu-prd.idiomas_curated.languages` l ON l.id = ul.language_id
GROUP BY 1 HAVING pessoas >= 20 ORDER BY pessoas DESC
```

**I2 · Por que estudam e quanto tempo por dia** (onboarding). Grão: uma resposta; a pergunta de motivo aceita várias.

```sql
SELECT a.question_id AS pergunta, r AS resposta, COUNT(*) AS pessoas
FROM `orbi-edu-prd.idiomas_curated.onboarding_form_answers` a,
UNNEST(IF(NULLIF(a.value_option, '') IS NOT NULL, [a.value_option], SPLIT(TRIM(a.value_options, '{}'), ','))) r
GROUP BY 1, 2 HAVING pessoas >= 20 ORDER BY 1, pessoas DESC
```

**I3 · Sequência.** Grão: uma pessoa.

```sql
SELECT CASE WHEN current_streak = 0 THEN '0' WHEN current_streak < 3 THEN '1-2' WHEN current_streak < 7 THEN '3-6' WHEN current_streak < 30 THEN '7-29' ELSE '30+' END AS faixa, COUNT(*) AS pessoas
FROM `orbi-edu-prd.idiomas_curated.user_streaks`
GROUP BY 1 HAVING pessoas >= 20 ORDER BY 1
```

**I4 · O dia da semana.** Grão: um progresso de lição atualizado. Sem hora: as datas daqui são `DATE`.

```sql
SELECT FORMAT_DATE('%a', updated_at) AS dia, COUNT(*) AS progressos
FROM `orbi-edu-prd.idiomas_curated.lesson_progresses`
WHERE updated_at >= DATE_SUB(CURRENT_DATE('America/Sao_Paulo'), INTERVAL 28 DAY)
GROUP BY 1 HAVING progressos >= 20 ORDER BY progressos DESC
```

**I5 · A nota da lição** (voz). Grão: uma avaliação. A escala do app: 1 ruim, 2 bom, 3 ótimo (`app/src/controllers/lessonFeedback/index.ts`).

```sql
SELECT CASE rating WHEN 1 THEN 'ruim' WHEN 2 THEN 'bom' WHEN 3 THEN 'ótimo' END AS nota, COUNT(*) AS avaliacoes
FROM `orbi-edu-prd.idiomas_curated.lesson_feedback`
GROUP BY 1 HAVING avaliacoes >= 20 ORDER BY avaliacoes DESC
```

**I6 · Onde o conteúdo quebra** (voz). Grão: um relato do botão "reportar problema". As categorias são as do enum `ContentReportCategory` da API.

```sql
SELECT CASE category WHEN 1 THEN 'áudio não toca' WHEN 2 THEN 'não consegue completar' WHEN 3 THEN 'erro de tradução ou conteúdo' WHEN 4 THEN 'fala não reconhecida' WHEN 5 THEN 'conteúdo inadequado' WHEN 6 THEN 'outro' END AS problema,
  step AS etapa, COUNT(*) AS relatos
FROM `orbi-edu-prd.idiomas_curated.content_problem_reports`
GROUP BY 1, 2 HAVING relatos >= 20 ORDER BY relatos DESC LIMIT 10
```

**I7 · Por que avaliaram assim** (voz). Grão: um motivo marcado numa avaliação; a maioria das avaliações não marca nenhum. Os motivos são os de `LESSON_FEEDBACK_REASONS` no app.

```sql
SELECT CASE m WHEN '1' THEN 'não entendi' WHEN '2' THEN 'fácil demais' WHEN '3' THEN 'difícil demais' WHEN '4' THEN 'o vídeo ou o áudio' WHEN '5' THEN 'encontrei um erro' END AS motivo, COUNT(*) AS avaliacoes
FROM `orbi-edu-prd.idiomas_curated.lesson_feedback`, UNNEST(SPLIT(TRIM(reasons, '{}'), ',')) m
WHERE m != ''
GROUP BY 1 HAVING avaliacoes >= 20 ORDER BY avaliacoes DESC
```

### MEC Livros (`livros_curated`)

**L1 · Plataforma.** Grão: uma conta que não é de teste; a plataforma é a do último acesso.

```sql
SELECT COALESCE(NULLIF(last_platform, ''), '(vazio)') AS plataforma, COUNT(*) AS pessoas
FROM `orbi-edu-prd.livros_curated.user`
WHERE is_test_user = 'false'
GROUP BY 1 HAVING pessoas >= 20 ORDER BY pessoas DESC
```

**L2 · A hora em que abrem um livro.** Grão: uma visualização da página do livro.

```sql
SELECT EXTRACT(HOUR FROM DATETIME(created_at, 'America/Sao_Paulo')) AS hora, COUNT(*) AS aberturas
FROM `orbi-edu-prd.livros_curated.book_view`
WHERE created_at >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 28 DAY)
GROUP BY 1 HAVING aberturas >= 20 ORDER BY 1
```

**L3 · Quanto leem.** Grão: uma pessoa num livro; `progress` vai de 0 a 100.

```sql
SELECT COUNT(*) AS leituras, COUNTIF(completed_at IS NOT NULL) AS concluidas,
  APPROX_QUANTILES(progress, 2)[OFFSET(1)] AS progresso_mediano,
  ROUND(APPROX_QUANTILES(reading_time_ms / 60000, 2)[OFFSET(1)], 1) AS minutos_medianos
FROM `orbi-edu-prd.livros_curated.user_reading_progress`
```

**L4 · O que aparece nas buscas.** Grão: um livro numa janela de 7 dias. Só a janela mais recente (veja Armadilhas).

```sql
SELECT b.title AS titulo, MAX(s.search_count) AS buscas
FROM `orbi-edu-prd.livros_curated.search_signal` s
JOIN `orbi-edu-prd.livros_curated.book` b ON CAST(b.id AS STRING) = CAST(s.entity_id AS STRING)
WHERE s.entity_type = 'book'
  AND s.period_end = (SELECT MAX(period_end) FROM `orbi-edu-prd.livros_curated.search_signal`)
GROUP BY 1 HAVING buscas >= 20 ORDER BY buscas DESC LIMIT 10
```

**L5 · Por que pedem ajuda.** Grão: um ticket do Zendesk. Sem a satisfação: ela quase nunca é oferecida, e as contagens dela ficam abaixo de 20.

```sql
SELECT COALESCE(NULLIF(problem_type, ''), '(vazio)') AS tipo, COUNT(*) AS tickets
FROM `orbi-edu-prd.livros_curated.support_ticket`
GROUP BY 1 HAVING tickets >= 20 ORDER BY tickets DESC
```

**L6 · O que dizem ao suporte** (voz). Grão: uma etiqueta de um ticket; um ticket tem várias. As de `mec_emprestimo_motivo_*` dizem o assunto, as de `sentiment__*` o tom que o Zendesk leu. Use `STARTS_WITH`: no `LIKE`, o `_` vale qualquer letra e `'mec_%'` pega `meclivros`.

```sql
SELECT tag AS etiqueta, COUNT(*) AS tickets
FROM `orbi-edu-prd.livros_curated.support_ticket`, UNNEST(SPLIT(TRIM(tags, '{}'), ',')) tag
WHERE STARTS_WITH(tag, 'mec_emprestimo_motivo_') OR STARTS_WITH(tag, 'sentiment__') OR STARTS_WITH(tag, 'intent__')
GROUP BY 1 HAVING tickets >= 20 ORDER BY tickets DESC LIMIT 20
```

### MEC Dados (`ideb_curated`)

**G1 · Que anos e etapas a tela tem.** Grão: um município × etapa × rede × ano.

```sql
SELECT reference_year AS ano, education_stage AS etapa, COUNT(DISTINCT municipality_ibge_code) AS municipios
FROM `orbi-edu-prd.ideb_curated.municipality_year`
WHERE ideb_score IS NOT NULL
GROUP BY 1, 2 ORDER BY 1 DESC, 2
```

## Armadilhas

Medidas em 25/11/2026. Cada uma já enganou uma leitura; confira se ainda vale.

- **MEC Livros · busca.** `search_history.query` é um hash SHA-256: o termo buscado não é legível. `search_signal` tem uma janela de 7 dias por dia, sobrepostas: somar períodos multiplica a conta. Na janela mais recente, títulos com "literatura" no nome empatam perto do mesmo valor; provavelmente a contagem é da busca que mostra o livro, não do desejo por ele (inferido).
- **MEC Livros · `book_view` é quase só Android.** Nos 28 dias até 25/11/2026, das contas logadas com abertura, 112.840 eram Android, 1.591 web e 773 iOS, quando iOS e web têm perto de 20% das contas cada (L1). O evento mede o app Android, não o público: L2 e todo sinal sobre `book_view` falam de quem usa Android, e a entrega diz isso. Achado no eval de 25/11/2026, onde um sinal "75% no celular" decidiu a largura por esse viés.
- **MEC Livros · campos.** `is_test_user` é `STRING` (`'true'`, `'false'`). `last_platform` vem vazio em cerca de 37% das contas. `problem_type` vem vazio em 57% dos tickets, e a satisfação quase nunca é oferecida (`unoffered`).
- **MEC Livros · etiquetas do suporte.** As etiquetas mudam com o tempo: a de fila tem tickets no histórico e nenhum nos últimos 28 dias. Some etiquetas só dentro de uma janela escrita (`zendesk_created_at`), nunca o histórico inteiro contra um corte de hoje.
- **MEC Enem · cadastro.** `SchoolType` está vazio em todas as contas. `State` falta em cerca de 36% e `CourseOfInterest` em 96%, com espaço no fim (use `TRIM`). `BirthDate` é `INT64`. Um sinal sobre quem respondeu não fala de todo o público: diga o n.
- **MEC Idiomas · datas e códigos.** As colunas de data são `DATE`: não existe hora do dia; use o dia da semana. `category`, `rating` e `reasons` são códigos; o nome de cada um está nas receitas I5 a I7, tirado do código do app em 25/11/2026.
