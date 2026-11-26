### Pragmática

**Você é dona do teste; o veredito é de um humano. Quem diz se funciona é ele, e o número de depois diz se o público entendeu.**

Rodada por Design novo. Revisão usa o passo 3; Iteração usa o bloco.

1. Ponha a peça onde o humano consegue abrir: o link da prévia, o arquivo HTML, o quadro na ferramenta de design. Diga como abrir em uma linha.
2. Escreva o roteiro de teste, de 3 a 6 passos, cada um com uma tarefa real e "Deve ver:" com o resultado esperado: a tarefa principal do começo ao fim; um estado difícil forçado (vazio, erro, conteúdo longo); o aparelho mais usado segundo os sinais, com o `D…`, e a tela de 390 sempre; só teclado e movimento reduzido, quando houver interação ou movimento.
3. Faça o review dos **10 detalhes** (sabedoria 3, o micro espelha o macro) na entrega de um design novo, sobre a peça renderizada e a tela que ela toca, e ponha a seção "10 detalhes" na entrega (no artefato HTML, um bloco por detalhe). Numa iteração sobre a mesma peça, um ajuste pedido depois do outro, pule este passo e tire a linha "10 detalhes" do bloco:
   - dez melhorias concretas, nem mais nem menos (peça pequena: olhe também a tela vizinha), em ordem do maior ganho para quem usa ao menor esforço, cada uma com o ganho (alto, médio, baixo) e o esforço (P, M, G); o ganho que um sinal mede (quantas pessoas passam ali, onde param) cita o `D…`;
   - cada uma com o problema em uma frase e onde está (arquivo, função, seletor ou componente); a referência, que é um bloco do Are.na lido nesta sessão, com `https://www.are.na/block/<id>`, uma tela do Mobbin vista nesta sessão, com o `mobbin_url`, ou outra referência de produto marcada como tal; o antes e o depois desenhados lado a lado com os tokens da casa, nas medidas reais; e o trecho exato do que muda (o valor, o seletor, a linha de código ou o token);
   - olhe de perto: espaço e alinhamento, estados, palavras, hover e foco, noite, tela estreita, ícones e anexos, movimento;
   - o que já está feito, ou em outra branch, sai da lista e é dito; entra outro no lugar;
   - o que muda token, componente compartilhado ou decisão do `DESIGN.md` › Registro de decisões fica para o humano decidir (aceito, passa por `craft-system`);
   - os dez são proposta: implemente só os que o pedido inclui e diga quais.
4. Escreva o "medir depois": o sinal que deve mudar se a peça for entendida. Rode-o por `scripts/consulta.mjs --id M<n> --olhar-em <data>`; a saída é a linha de base, com o período e o n, e a direção esperada vai no `--muda`. Sem dataset: `n/a: <motivo>`.
5. Liste o que o humano decide (a variante, a dúvida do `DESIGN.md`, a contradição de gosto, a exceção da sintaxe, os detalhes marcados) e o que você não verificou (captura, leitor de tela, dados reais, número sem explicação).
6. Termine a resposta com o bloco e pare. Não escreva "funciona", "pronto" nem "aprovado".
7. Com a resposta do humano: registre o veredito, o porquê e o "medir depois" no `DESIGN.md` › Registro de decisões. "Não funciona" volta à fase de onde o problema vem: sentido ou público → Semântica; estrutura → Sintaxe. "Funciona" fecha a peça.

**Porta 3:** a seção "10 detalhes" está na entrega quando ela é de um design novo, com os dez completos (referência, antes e depois, trecho); o "medir depois" tem o `dados/M<n>.json`, ou `n/a`; o bloco de revisão foi enviado; e o veredito é do humano. Sem veredito, a peça está "esperando revisão", não pronta.

**Bloco de revisão** (o fim da resposta):

```
Para você revisar: <peça> — <onde abrir>
10 detalhes: <onde está a seção> · implementados: <quais, ou nenhum>
Medir depois: <M…> · hoje <valor> (<período>, n=<n>) · olhar de novo em <data>
Teste:
1. <tarefa> · Deve ver: <resultado>
2. …
Decida: <variante / dúvida / contradição / exceção>
Não verifiquei: <o que ficou de fora>
Só você diz se funciona. Funciona? Se não, o que falhou?
```
