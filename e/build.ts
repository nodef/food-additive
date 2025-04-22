// Copyright (C) 2025 Subhajit Sahu
// SPDX-License-Identifier: AGPL-3.0-or-later
// See LICENSE for full terms
import * as path from "jsr:@std/path@1.0.8";
import * as csv  from "jsr:@std/csv@1.0.5";


type OnRead = (record: Record<string, string>) => void;


interface ENumber {
  code: string;
  names: string;
  type: string;
  status: string;
};


function read(file: string, fn: OnRead) {
  const pth  = path.join(import.meta.dirname || "", "assets", file);
  const data = Deno.readTextFileSync(pth);
  const records = csv.parse(data, {skipFirstRow: true, comment: "#"});
  for (const r of records)
    fn(r);
}


function convert(record: Record<string, string>) {
  const r = record;
  const code  = r["Code"];
  const names = r["Name(s)"];
  const color = (r["Colour"] || "").replace("(", ", ").replace(")", "");
  const type  = r["Purpose"] != null? r["Purpose"] : `color (${color})`;
  let status  = r["Status"].search(/Approved in (the EU|\d+)/) >= 0? "e " : "";
  status += r["Status"].search(/Approved in the US/) >= 0? "u " : "";
  return {code, names, type, status: status.trim()};
}


function load() {
  const a: ENumber[] = [];
  for (let i=100; i<=1000; i+=100) {
    try { read(`e${i}.csv`, (record) => { a.push(convert(record)); }); }
    catch { console.warn(`WARN: e${i}.csv not found`); }
  }
  return a;
}


function main() {
  const rows = load();
  let a = "code,names,type,status\n";
  rows.sort((a, b) => parseInt(a.code.substring(1), 10) - parseInt(b.code.substring(1), 10));
  for (const row of rows)
    a += `${row.code},"${row.names}","${row.type}",${row.status}\n`;
  Deno.writeTextFileSync(path.join(import.meta.dirname || "", "index.csv"), a);
}
main();
