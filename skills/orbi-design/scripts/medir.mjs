#!/usr/bin/env node
// O "medir depois" da orbi-design: acha cada <pasta>/dados/<id>.json com olharEm vencido e sem
// medição desde essa data, roda de novo a consulta guardada nele (conferida pelo sha256 e pelas
// regras de consulta.mjs), grava <id>.<hoje>.csv e acrescenta a medição ao json. Com --listar, só lista.
//
//   node medir.mjs <pasta do app> [--hoje AAAA-MM-DD] [--listar]
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { checar, rodar, tabela } from './consulta.mjs';

const PULA = new Set(['node_modules', '.git', 'dist', 'build', '.next', 'Archive', 'Pods']);

/** Every "medir depois" under `raiz` due on `hoje` (AAAA-MM-DD): [{ arquivo, registro }]. */
export function vencidos(raiz, hoje, fundo = 8) {
  const achados = [];
  const andar = (dir, nivel) => {
    let entradas = [];
    try { entradas = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
    for (const e of entradas) {
      const p = path.join(dir, e.name);
      if (e.isDirectory() && !PULA.has(e.name) && nivel < fundo) andar(p, nivel + 1);
      else if (e.isFile() && e.name.endsWith('.json') && path.basename(dir) === 'dados') {
        let r;
        try { r = JSON.parse(fs.readFileSync(p, 'utf8')); } catch { continue; }
        if (r?.olharEm && r.consulta && r.olharEm <= hoje && !(r.medicoes ?? []).some((m) => m.em >= r.olharEm)) achados.push({ arquivo: p, registro: r });
      }
    }
  };
  andar(raiz, 0);
  return achados.sort((a, b) => a.registro.olharEm.localeCompare(b.registro.olharEm));
}

function main() {
  const argv = process.argv.slice(2);
  const raiz = argv.find((a, i) => !a.startsWith('--') && argv[i - 1] !== '--hoje');
  if (!raiz) { console.error('Falta a pasta do app.'); process.exit(2); }
  const hoje = argv.includes('--hoje') ? argv[argv.indexOf('--hoje') + 1] : new Date().toISOString().slice(0, 10);
  const lista = vencidos(raiz, hoje);
  if (!lista.length) { console.log(`Nenhum "medir depois" vencido em ${raiz} até ${hoje}.`); return; }
  for (const { arquivo, registro: r } of lista) {
    const dir = path.dirname(arquivo);
    console.log(`\n## ${r.id} · ${r.pergunta}\nOlhar em ${r.olharEm} · linha de base de ${r.rodadoEm.slice(0, 10)} · ${path.relative(process.cwd(), arquivo)}`);
    if (argv.includes('--listar')) continue;
    if (createHash('sha256').update(r.consulta).digest('hex') !== r.sha256) { console.log('A consulta do json não bate com o sha256 dela: alguém a mudou depois de rodar. Não roda de novo.'); continue; }
    const erros = checar(r.consulta);
    if (erros.length) { console.log(`Não roda de novo:\n${erros.map((e) => `- ${e}`).join('\n')}`); continue; }
    let novo;
    try { novo = rodar(r.consulta, `${r.id}m`); } catch (e) { console.log(e.message); continue; }
    const csv = `${r.id}.${hoje}.csv`;
    fs.writeFileSync(path.join(dir, csv), novo.csv + '\n');
    r.medicoes = [...(r.medicoes ?? []), { em: hoje, job: novo.job, bytes: novo.bytes, csv }];
    fs.writeFileSync(arquivo, JSON.stringify(r, null, 2) + '\n');
    console.log(`\nAntes:\n\n${tabela(fs.readFileSync(path.join(dir, r.csv), 'utf8'), 15)}\n\nAgora:\n\n${tabela(novo.csv, 15)}`);
  }
}

if (process.argv[1] && fs.realpathSync(process.argv[1]) === fs.realpathSync(fileURLToPath(import.meta.url))) main();
