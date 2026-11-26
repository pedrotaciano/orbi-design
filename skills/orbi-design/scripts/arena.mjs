#!/usr/bin/env node
// O Are.na da orbi-design (references/arena.md) pela API v3, com ou sem o MCP. Só GET: o script não
// tem como criar, conectar nem apagar nada. Lê o índice hyper—index, a árvore da Orbi (os canais da conta com
// orbi ou mec no título e os subcanais deles), um canal, uma busca e um bloco, e imprime uma linha
// por item, com o endereço do bloco; nunca o JSON. Com ARENA_TOKEN (token pessoal do Are.na, só
// leitura) lê também o privado e busca; sem ele, só o público e o fechado, a 30 leituras por minuto.
// A busca é a do Are.na (/v3/search, conta Premium), nunca o canal inteiro baixado e filtrado aqui:
// a API proíbe a coleta em massa.
//
//   node arena.mjs indice
//   node arena.mjs arvore [--app enem|idiomas|livros|dados|orbi]
//   node arena.mjs canal <slug|id> [--paginas 1]
//   node arena.mjs buscar <termo> [<termo>…] (--canal <slug|id>[,…] | --arvore [--app <app>]) [--max 40]
//   node arena.mjs bloco <id>
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

export const API = 'https://api.are.na/v3';
export const CONTA = 'sinco-institute';
export const INDICE = 'hyper-index';
const APPS = ['enem', 'idiomas', 'livros', 'dados', 'orbi'];
const LOTE = 3;

export const normalizar = (s) => String(s ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

/** Uma raiz da árvore da Orbi: sem app, todo título com orbi ou mec; com app, o título que começa por `mec / <app>` ou, para `orbi`, por orbi. */
export function raiz(titulo, app) {
  const t = normalizar(titulo).trim();
  if (!app) return /\b(orbi|mec)\b/.test(t);
  return app === 'orbi' ? /^orbi\b/.test(t) : t.startsWith(`mec / ${app}`);
}

/**
 * A árvore a partir das raízes, em profundidade e sem repetir canal. Desce só pelos canais da conta:
 * o canal de outra pessoa entra, mas os subcanais dele não (de outra forma a árvore vira o Are.na inteiro).
 */
export async function arvore(raizes, subcanais, conta = CONTA) {
  const vistos = new Map();
  async function andar(c, nivel) {
    if (vistos.has(c.id)) return;
    vistos.set(c.id, { ...c, nivel });
    if (c.owner?.slug !== conta || !c.counts?.channels) return;
    for (const s of await subcanais(c)) await andar(s, nivel + 1);
  }
  for (const r of raizes) await andar(r, 0);
  return [...vistos.values()];
}

/** Os resultados de cada busca (um termo num canal) num só ranking: cada bloco uma vez, os que bateram mais termos primeiro. */
export function juntar(buscas) {
  const achados = new Map();
  for (const { termo, data } of buscas) {
    for (const x of data) {
      if (x.type === 'Channel') continue;
      const a = achados.get(x.id) ?? { x, termos: new Set() };
      a.termos.add(termo);
      achados.set(x.id, a);
    }
  }
  return [...achados.values()].sort((p, q) => q.termos.size - p.termos.size);
}

/** Uma linha por item: o canal com id, slug, contagem e dono; o bloco com o endereço, a fonte, a imagem e a descrição. */
export function linha(x) {
  if (x.type === 'Channel') return `canal ${x.id} ${x.slug} · ${x.title} · ${x.counts?.contents ?? '?'} itens · ${x.owner?.slug ?? '?'} · ${x.visibility ?? '?'}`;
  const desc = String(x.description?.plain ?? x.description ?? x.content?.plain ?? '').replace(/\s+/g, ' ').trim().slice(0, 240);
  const cab = [`https://www.are.na/block/${x.id} · ${x.type} · ${x.title || '(sem título)'}`, x.source?.url && `fonte ${x.source.url}`, x.image?.src && `imagem ${x.image.src}`];
  return cab.filter(Boolean).join(' · ') + (desc ? `\n  ${desc}` : '');
}

export async function get(caminho, params = {}, tentativas = 3) {
  const token = process.env.ARENA_TOKEN;
  const url = new URL(API + caminho);
  for (const [k, v] of Object.entries(params)) if (v != null) url.searchParams.set(k, v);
  const r = await fetch(url, { headers: { Accept: 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) } });
  if (r.status === 429 && tentativas > 1) {
    const espera = Number((await r.json().catch(() => ({}))).error?.retry_after ?? 60);
    console.error(`Limite de leituras do Are.na (${token ? 'conta' : 'sem token, 30 por minuto'}): esperando ${espera} s.`);
    await new Promise((ok) => setTimeout(ok, Math.min(espera, 61) * 1000));
    return get(caminho, params, tentativas - 1);
  }
  if (r.status === 401 || r.status === 403) {
    if (caminho === '/search') throw new Error(`A busca do Are.na pede ARENA_TOKEN de uma conta Premium${token ? '; este token não tem' : ''}. Sem ele, use o search do MCP.`);
    throw new Error(`${caminho}: ${token ? 'o ARENA_TOKEN não lê este canal' : 'canal privado; defina ARENA_TOKEN (token pessoal do Are.na) ou leia pelo MCP'}.`);
  }
  if (!r.ok) throw new Error(`${caminho}: ${r.status} ${(await r.text()).slice(0, 200)}`);
  return r.json();
}

async function emLotes(itens, f) {
  const out = [];
  for (let i = 0; i < itens.length; i += LOTE) out.push(...(await Promise.all(itens.slice(i, i + LOTE).map(f))));
  return out;
}

/** Os itens de um caminho paginado, até `max` páginas. */
async function itens(caminho, { per = 100, max = Infinity, ...params } = {}) {
  const primeira = await get(caminho, { ...params, per, page: 1 });
  const total = Math.min(primeira.meta?.total_pages ?? 1, max);
  const resto = await emLotes(Array.from({ length: Math.max(0, total - 1) }, (_, i) => i + 2), (page) => get(caminho, { ...params, per, page }));
  return [primeira, ...resto].flatMap((r) => r.data ?? []);
}

const conteudo = (canal, opcoes) => itens(`/channels/${encodeURIComponent(canal)}/contents`, opcoes);

async function daOrbi(app) {
  const daConta = (await itens(`/users/${CONTA}/contents`, { type: 'Channel' })).filter((c) => c.type === 'Channel');
  const raizes = daConta.filter((c) => raiz(c.title, app));
  const subcanais = async (c) => (await conteudo(c.id)).filter((x) => x.type === 'Channel');
  return arvore(raizes, subcanais);
}

function args(argv) {
  const a = { pos: [] };
  for (let i = 0; i < argv.length; i++) {
    const k = argv[i];
    if (k === '--arvore') a.arvore = true;
    else if (k.startsWith('--')) a[k.slice(2)] = argv[++i];
    else a.pos.push(k);
  }
  return a;
}

function sair(msg) {
  console.error(msg);
  process.exit(2);
}

async function main() {
  const [comando, ...resto] = process.argv.slice(2);
  const a = args(resto);
  if (a.app && !APPS.includes(a.app)) sair(`--app é um de: ${APPS.join(', ')}.`);
  if (comando === 'indice') {
    for (const x of await conteudo(INDICE)) console.log(x.type === 'Channel' ? `${linha(x)}${x.description?.plain ? `\n  ${x.description.plain.replace(/\s+/g, ' ').trim()}` : ''}` : `— ${x.title}`);
  } else if (comando === 'arvore') {
    if (!process.env.ARENA_TOKEN) console.error('Sem ARENA_TOKEN: só o público e o fechado. Os canais privados da Orbi ficam de fora; leia-os pelo MCP.');
    for (const c of await daOrbi(a.app)) console.log(`${'  '.repeat(c.nivel)}${linha(c)}`);
  } else if (comando === 'canal') {
    if (!a.pos[0]) sair('Falta o canal: o slug ou o id.');
    for (const x of await conteudo(a.pos[0], { per: 24, max: Number(a.paginas ?? 1) })) console.log(linha(x));
  } else if (comando === 'buscar') {
    if (!process.env.ARENA_TOKEN) sair('A busca do Are.na pede ARENA_TOKEN de uma conta Premium. Sem ele, use o search do MCP.');
    if (!a.pos.length) sair('Falta o termo: cada palavra, ou expressão entre aspas, é um termo.');
    const canais = a.arvore ? (await daOrbi(a.app)).map((c) => c.id) : await Promise.all((a.canal ?? '').split(',').filter(Boolean).map(async (c) => (/^\d+$/.test(c) ? Number(c) : (await get(`/channels/${encodeURIComponent(c)}`)).id)));
    if (!canais.length) sair('Diga onde: --canal <slug|id>[,…] ou --arvore [--app <app>].');
    const pares = canais.flatMap((canal) => a.pos.map((termo) => ({ canal, termo })));
    const buscas = await emLotes(pares, async ({ canal, termo }) => ({ termo, data: (await get('/search', { query: termo, channel_id: canal, type: 'Block', per: 24 })).data ?? [] }));
    const max = Number(a.max ?? 40);
    const ordem = juntar(buscas);
    for (const { x, termos } of ordem.slice(0, max)) console.log(`${termos.size}/${a.pos.length} ${linha(x)}`);
    console.log(`${ordem.length} blocos em ${canais.length} canais${ordem.length > max ? `; mostrando ${max} (--max)` : ''}.`);
  } else if (comando === 'bloco') {
    if (!a.pos[0]) sair('Falta o id do bloco.');
    console.log(linha(await get(`/blocks/${a.pos[0]}`)));
  } else sair('Comandos: indice · arvore [--app <app>] · canal <slug|id> [--paginas n] · buscar <termo>… (--canal <slug|id>[,…] | --arvore [--app <app>]) [--max 40] · bloco <id>');
}

if (process.argv[1] && fs.realpathSync(process.argv[1]) === fs.realpathSync(fileURLToPath(import.meta.url))) main().catch((e) => sair(e.message));
