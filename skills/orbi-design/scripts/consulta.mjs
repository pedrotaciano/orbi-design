#!/usr/bin/env node
// Uma pergunta ao BigQuery nas regras da orbi-design (references/dados.md › Regras): um SELECT só,
// só datasets _curated do orbi-edu-prd, nenhuma coluna pessoal, todo grupo de pessoas com
// HAVING >= 20 e teto de 10 GB lido no dry run. A decisão que o resultado muda vem antes de rodar
// (--muda) e um id já medido não roda de novo: a hipótese não se reescreve depois do número.
// Grava <pasta>/dados/<id>.csv e <id>.json (pergunta, muda, a consulta e o sha256 dela, job, bytes,
// quando, e os avisos de grupo pequeno numa coluna que o HAVING não cobriu).
//
//   node consulta.mjs --pasta <projeto> --id D1 --pergunta "…" --muda "…" [--olhar-em AAAA-MM-DD] <arquivo.sql | ->
//   node consulta.mjs --checar <arquivo.sql | ->
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

export const PROJETO = 'orbi-edu-prd';
export const TETO = 10_000_000_000;
const PUBLICOS = new Set(['ideb_curated', 'censo_escolar_curated', 'cad_unico_curated', 'ibge_censo_curated']);
const PROIBIDAS = new Set(['chatbot_message', 'contact_message', 'addresses', 'UserLastAccess']);
const PESSOAIS = /\b(email|cpf|documentnumber|phonenumber|phone|msisdn|birthdate|date_of_birth|enemregistrationnumber|latitude|longitude|cognito_sub|gov_br_id|externaluserid|last_user_agent|avatar|socialname|social_name|nickname|comment)\b/i;
const ESCRITA = /\b(INSERT|UPDATE|DELETE|MERGE|CREATE|DROP|ALTER|TRUNCATE|EXPORT|CALL|DECLARE|EXECUTE|GRANT|REVOKE)\b/i;
const AGREGADO = /\b(COUNT|COUNTIF|SUM|AVG|MIN|MAX|APPROX_QUANTILES|APPROX_COUNT_DISTINCT)\s*\(/i;

/** The SQL without comments and with every string literal emptied: what the checks read. */
function limpar(sql) {
  return sql.replace(/--[^\n]*/g, '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/'(?:[^'\\]|\\.)*'/g, "''").replace(/"(?:[^"\\]|\\.)*"/g, '""');
}

/** The rules a query breaks, each naming the fix; [] when it can run. */
export function checar(sql) {
  const erros = [];
  const s = limpar(sql).trim().replace(/;\s*$/, '');
  if (s.includes(';')) erros.push('Uma consulta por vez: tire o `;` do meio.');
  if (!/^(SELECT|WITH)\b/i.test(s)) erros.push('Só leitura: a consulta começa com SELECT ou WITH.');
  if (ESCRITA.test(s)) erros.push(`Só leitura: tire o ${s.match(ESCRITA)[1].toUpperCase()}.`);
  if (/\bSELECT\s+(\w+\.)?\*/i.test(s)) erros.push('Nada de `*`: nomeie as colunas agregadas.');
  const refs = [...s.matchAll(/`([^`]+)`/g)].map((m) => m[1].split('.'));
  if (!refs.length) erros.push('Nomeie cada tabela inteira, entre crases: `orbi-edu-prd.<dataset>_curated.<tabela>`.');
  for (const r of refs) {
    if (r.length < 3) erros.push(`\`${r.join('.')}\`: nomeie a tabela inteira, \`${PROJETO}.<dataset>.<tabela>\`.`);
    else if (r[0] !== PROJETO) erros.push(`\`${r.join('.')}\`: só o projeto ${PROJETO}.`);
    else if (!r[1].endsWith('_curated')) erros.push(`\`${r.join('.')}\`: só datasets _curated; o _staging é da carga.`);
    else if (PROIBIDAS.has(r[2])) erros.push(`\`${r.join('.')}\`: a tabela é de dado pessoal ou texto livre; ache o sinal em outra.`);
  }
  const ctes = new Set([...s.matchAll(/(\w+)\s+AS\s*\(/gi)].map((m) => m[1].toLowerCase()));
  const semExtract = s.replace(/\bEXTRACT\s*\(\s*\w+\s+FROM\b/gi, 'EXTRACT(').replace(/\bDISTINCT\s+FROM\b/gi, '=');
  for (const m of semExtract.matchAll(/\b(?:FROM|JOIN)\s+(?![`(]|UNNEST\b)(\w+)/gi)) {
    if (!ctes.has(m[1].toLowerCase())) erros.push(`\`${m[1]}\`: nomeie a tabela inteira, entre crases, \`${PROJETO}.<dataset>.<tabela>\`.`);
  }
  const metadados = refs.length && refs.every((r) => r[2] === 'INFORMATION_SCHEMA' || PUBLICOS.has(r[1]));
  if (!metadados) {
    const semNomes = s.replace(/`[^`]*`/g, '``');
    const pessoal = semNomes.match(PESSOAIS);
    if (pessoal) erros.push(`\`${pessoal[1]}\` é coluna pessoal: nem no SELECT, nem no WHERE.`);
    if (refs.some((r) => /^users?$/i.test(r[2] ?? '')) && /\bname\b/i.test(semNomes)) erros.push('`name` de uma tabela de contas é coluna pessoal.');
    if (/\bGROUP\s+BY\b/i.test(s)) {
      const minimo = s.match(/\bHAVING\b[\s\S]*?>=\s*(\d+)/i);
      if (!minimo || Number(minimo[1]) < 20) erros.push('Todo grupo de pessoas leva `HAVING <contagem> >= 20`.');
    } else if (!AGREGADO.test(s)) erros.push('Só agregado: a saída tem uma linha por registro. Agrupe com GROUP BY e HAVING >= 20, ou agregue numa linha.');
  }
  return erros;
}

const BASE = [`--project_id=${PROJETO}`, '--location=southamerica-east1'];

function bq(args) {
  try {
    return execFileSync('bq', [...BASE, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 64 * 1024 * 1024 });
  } catch (e) {
    throw new Error(`bq falhou: ${(e.stdout || '').trim() || (e.stderr || '').trim() || e.message}`);
  }
}

/** Dry run (bytes and the tables BigQuery itself resolved), then the run under the cap. */
export function rodar(sql, id) {
  const seco = JSON.parse(bq(['--format=json', 'query', '--nouse_legacy_sql', '--dry_run', sql]));
  const bytes = Number(seco.statistics?.totalBytesProcessed ?? seco.statistics?.query?.totalBytesProcessed);
  if (!(bytes <= TETO)) throw new Error(`A consulta leria ${(bytes / 1e9).toFixed(1)} GB; o teto é ${TETO / 1e9} GB. Filtre a janela ou as colunas.`);
  for (const t of seco.statistics?.query?.referencedTables ?? []) {
    if (t.projectId !== PROJETO || !t.datasetId.endsWith('_curated')) throw new Error(`O BigQuery resolveu ${t.projectId}.${t.datasetId}.${t.tableId}: só ${PROJETO}, datasets _curated.`);
  }
  const job = `orbi_design_${id}_${Date.now()}`;
  const csv = bq([`--job_id=${job}`, '--format=csv', 'query', '--nouse_legacy_sql', `--maximum_bytes_billed=${TETO}`, '--max_rows=1000', sql]).trim();
  return { csv, job, bytes };
}

/** CSV as bq writes it → rows of cells. */
export function linhas(csv) {
  const out = [];
  for (const linha of csv.split('\n').filter(Boolean)) {
    const celulas = [];
    let atual = '', aspas = false;
    for (let i = 0; i < linha.length; i++) {
      const c = linha[i];
      if (aspas && c === '"' && linha[i + 1] === '"') { atual += '"'; i++; }
      else if (c === '"') aspas = !aspas;
      else if (c === ',' && !aspas) { celulas.push(atual); atual = ''; }
      else atual += c;
    }
    celulas.push(atual);
    out.push(celulas);
  }
  return out;
}

/** The first `max` rows of a CSV as a Markdown table. */
export function tabela(csv, max = 30) {
  const [cab, ...resto] = linhas(csv);
  if (!cab) return '(sem linhas)';
  const fila = (c) => `| ${c.map((x) => x.replace(/\|/g, '\\|') || '(vazio)').join(' | ')} |`;
  const corpo = resto.slice(0, max).map(fila);
  if (resto.length > max) corpo.push(`| … mais ${resto.length - max} linhas em CSV |`);
  return [fila(cab), `|${cab.map(() => '---').join('|')}|`, ...corpo].join('\n');
}

/**
 * Columns of a grouped result, outside the GROUP BY, whose integer cells go below 20: the HAVING
 * covered one count, not this one. A warning, not a refusal: an integer column can be a median.
 */
export function pequenos(csv, sql) {
  const grupo = limpar(sql).match(/\bGROUP\s+BY\s+([\s\S]+?)(?=\bHAVING\b|\bORDER\b|\bLIMIT\b|\bQUALIFY\b|$)/i);
  if (!grupo) return [];
  const [cab, ...resto] = linhas(csv);
  if (!cab || !resto.length) return [];
  const itens = grupo[1].split(',').map((x) => x.trim().toLowerCase());
  const dimensao = new Set(itens.map((x) => (/^\d+$/.test(x) ? cab[Number(x) - 1] : cab.find((c) => c.toLowerCase() === x.split('.').pop()))).filter(Boolean));
  return cab.filter((c, i) => !dimensao.has(c) && resto.every((l) => /^-?\d+$/.test(l[i] ?? '')) && resto.some((l) => Number(l[i]) > 0 && Number(l[i]) < 20));
}

function args(argv) {
  const a = { arquivo: null };
  for (let i = 0; i < argv.length; i++) {
    const k = argv[i];
    if (k === '--checar') a.checar = true;
    else if (k.startsWith('--')) a[k.slice(2)] = argv[++i];
    else a.arquivo = k;
  }
  return a;
}

function sair(msg) {
  console.error(msg);
  process.exit(2);
}

function main() {
  const a = args(process.argv.slice(2));
  if (!a.arquivo) sair('Falta a consulta: um arquivo .sql, ou - para ler da entrada.');
  const sql = fs.readFileSync(a.arquivo === '-' ? 0 : a.arquivo, 'utf8');
  const erros = checar(sql);
  if (erros.length) sair(`A consulta não roda:\n${erros.map((e) => `- ${e}`).join('\n')}`);
  if (a.checar) { console.log('✓ A consulta segue as regras.'); return; }
  for (const k of ['pasta', 'id', 'pergunta', 'muda']) if (!a[k]) sair(`Falta --${k}. O --muda é o resultado que mudaria qual decisão de desenho, escrito antes de rodar.`);
  if (!/^[A-Z]\d+$/.test(a.id)) sair('O --id é uma letra e um número: D1, D2… para os sinais, M1… para o "medir depois".');
  if (a['olhar-em'] && !/^\d{4}-\d{2}-\d{2}$/.test(a['olhar-em'])) sair('O --olhar-em é uma data AAAA-MM-DD.');
  const dir = path.join(a.pasta, 'dados');
  const json = path.join(dir, `${a.id}.json`);
  if (fs.existsSync(json)) sair(`${a.id} já foi medido (${json}). Um sinal novo ganha outro id; o número não reescreve a hipótese.`);
  fs.mkdirSync(dir, { recursive: true });
  const escritoEm = new Date().toISOString();
  let r;
  try { r = rodar(sql, a.id); } catch (e) { sair(e.message); }
  fs.writeFileSync(path.join(dir, `${a.id}.csv`), r.csv + '\n');
  const avisos = pequenos(r.csv, sql).map((c) => `A coluna ${c} tem grupos abaixo de 20: não cite esses valores; ponha a condição no HAVING ou agregue mais.`);
  const consulta = sql.trim();
  const registro = { id: a.id, pergunta: a.pergunta, muda: a.muda, escritoEm, rodadoEm: new Date().toISOString(), job: r.job, bytes: r.bytes, consulta, sha256: createHash('sha256').update(consulta).digest('hex'), csv: `${a.id}.csv`, linhas: Math.max(0, linhas(r.csv).length - 1), ...(avisos.length ? { avisos } : {}), ...(a['olhar-em'] ? { olharEm: a['olhar-em'], medicoes: [] } : {}) };
  fs.writeFileSync(json, JSON.stringify(registro, null, 2) + '\n');
  console.log(`${a.id} · ${a.pergunta}\nMuda se: ${a.muda}\n\n${tabela(r.csv)}\n\ndados/${a.id}.csv · job ${r.job} · ${(r.bytes / 1e9).toFixed(2)} GB · ${registro.linhas} linhas${registro.olharEm ? ` · olhar de novo em ${registro.olharEm}` : ''}${avisos.map((x) => `\nAtenção: ${x}`).join('')}`);
}

if (process.argv[1] && fs.realpathSync(process.argv[1]) === fs.realpathSync(fileURLToPath(import.meta.url))) main();
