#!/usr/bin/env node
// Copyright (C) 2025 Subhajit Sahu
// SPDX-License-Identifier: AGPL-3.0-or-later
// See LICENSE for full terms
import * as path from "jsr:@std/path@1.0.8";
import {e, ins} from "./index.ts";


const OPTIONS = {
  help: false,
  silent: boolean(Deno.env.get('FOOD_ADDITIVE_E_SILENT') || '0'),
  text: '',
  command: '',
};
const ISTTY = Deno.stdout.isTerminal();
const CRESET = ISTTY? '\x1b[0m' : '';
const CTEXT1 = ISTTY? '\x1b[0;33m' : '';
const CERROR = ISTTY? '\x1b[35m' : '';


// Parse text to boolean.
function boolean(str: string) {
  const fal = str.search(/(negati|never|refus|wrong|fal|off)|\b(f|n|0)\b/gi) < 0? 0 : 1;
  const not = (str.match(/\b(nay|nah|no|dis|un|in)/gi)||[]).length & 1;
  return !(fal ^ not);
}

function main(a: string[]) {
  const o = Object.assign({}, OPTIONS);
  for (let i=2, I=a.length; i<I;)
    i = options(o, a[i], a, i);
  if (o.help) return new Deno.Command('less', {args: ['README.md'], cwd: path.fromFileUrl(import.meta.url)}).output();
  if (/^(ins|e)$/.test(o.command)===false) return error(new Error('Invalid command'), o);
  const rows = o.command==='ins'? ins(o.text) : e(o.text);
  if (rows.length===0) return error(new Error('No such food additives'), o);
  for (const r of rows) {
    console.log(r.code + ': ' + r.names);
    console.log(CTEXT1 + '.type: ' + r.type + '; .status: ' + r.status + CRESET);
    console.log();
  }
}

function options(o: Record<string, string | boolean>, k: string, a: string[], i: number) {
  if (k==='--help') o.help = true;
  else if (k==='--silent') o.silent = true;
  else if (o.command) o.text = a[i];
  else o.command = k;
  return i+1;
}

function error(err: Error, o: Record<string, string | boolean>) {
  if (o.silent) return console.log(-1);
  console.error(`${CERROR}error:${CRESET}`, err.message);
}
if (import.meta.main) main(Deno.args);
