// Copyright (C) 2025 Subhajit Sahu
// SPDX-License-Identifier: AGPL-3.0-or-later
// See LICENSE for full terms
import * as csv  from "jsr:@std/csv@1.0.5";
import lunr from "npm:lunr@2.3.9";  // @deno-types="npm:@types/lunr@2.3.7"
import {type RowData, type SetupTableOptions, setupTable} from "jsr:@nodef/extra-sql@0.1.2";




//#region TYPES
/** Represents a food additive, with its associated INS number. */
export interface INS {
  /** INS number/code of the additive, e.g., 101(i). */
  code: string;
  /** Names of the additive, e.g., "riboflavin, synthetic (vitamin B2)". */
  names: string;
  /** Type of the additive, e.g., "colour (yellow and orange)". */
  type: string;
  /** Approval status of the additive, e.g., "a e u" (Approved in Australia & New Zealand, EU, USA). */
  status: string;
};
//#endregion




//#region GLOBALS
let corpus: Map<string, INS> | null = null;
let index: lunr.Index | null = null;
//#endregion




//#region FUNCTIONS
/**
 * Load the INS number corpus from CSV file.
 * @param file CSV file URL
 * @returns INS number corpus
 */
async function loadFromCsv(file: string): Promise<Map<string, INS>> {
  const map  = new Map<string, INS>();
  const data = await (await fetch(file)).text();
  const records = csv.parse(data, {skipFirstRow: true, comment: "#"});
  for (const r of records)
    map.set(r.code, r as unknown as INS);
  return map;
}


/**
 * Setup the lunr index for the INS number corpus.
 * @returns lunr index
 */
function setupIndex(corpus: Map<string, INS>) {
  return lunr(function(this: lunr.Builder) {
    this.ref('key');
    this.field('code');
    this.field('names');
    this.field('type');
    this.field('status');
    // this.pipeline.remove(lunr.stopWordFilter);
    for (const r of corpus.values())
      this.add({key: r.code, code: r.code.replace(/[\(\)]/g, ' '), names: r.names, type: r.type, status: r.status.replace(/(\w)/g, 'status_$1')});
  });
}


/**
 * Load the INS number corpus from the file.
 * @returns INS number corpus {key ⇒ {abbr, full}}
 */
export async function loadIns(): Promise<Map<string, INS>> {
  if (corpus) return corpus;
  corpus = await loadFromCsv(insCsv());
  index  = setupIndex(corpus);
  return corpus;
}


/**
 * Get the path to the INS number CSV file.
 * @returns CSV file URL
 */
export function insCsv(): string {
  return import.meta.resolve("./index.csv");
}


/**
 * Obtain SQL command to create and populate the INS number table.
 * @param tab table name
 * @param opt options for the table
 * @returns CREATE TABLE, INSERT, CREATE VIEW, CREATE INDEX statements
 */
export async function insSql(tab: string="ins", opt: SetupTableOptions={}): Promise<string> {
  return setupTable(tab, {code: "TEXT", names: "TEXT", type: "TEXT", status: "TEXT"},
    (await loadIns()).values() as Iterable<RowData>,
    Object.assign({pk: "code", index: true, tsvector: {code: "A", names: "B", type: "C", status: "C"}}, opt));
}


/**
 * Find matching food additives with a code/names/type/status query (INS number).
 * @param txt code/names/type/status query (code = INS number)
 * @returns matches `[{code, names, type, status}]`
 * @example
 * ```javascript
 * foodAdditive.ins('102');
 * // → [ { code: '102',
 * // →     names: 'tartrazine',
 * // →     type: 'colour (yellow and orange) (FDA: FD&C Yellow #5)',
 * // →     status: 'a e' } ]
 *
 * foodAdditive.ins('ins 102');
 * // → [ { code: '102',
 * // →     names: 'tartrazine',
 * // →     type: 'colour (yellow and orange) (FDA: FD&C Yellow #5)',
 * // →     status: 'a e' } ]
 *
 * foodAdditive.ins('ins 160 d (iii)');
 * // → [ { code: '160d(iii)',
 * // →     names: 'lycopene, Blakeslea trispora',
 * // →     type: 'colour',
 * // →     status: 'a e' },
 * // →   { code: '160d', names: 'lycopenes', type: '', status: 'a e' },
 * // →   ... ]
 * ```
 */
export function ins(txt: string): INS[] {
  txt = txt.replace(/(^|\s+)(ins\s*)?(\d\d\d+)\s*([a-z])?\s*(\([ivx]+\))?(\s+?|$)/gi, ' $3$4$5 ').replace(/[\(\)]/g, ' ');
  const mats = index!.search(txt), a: INS[] = [];
  for (const mat of mats)
    a.push(corpus!.get(mat.ref) as INS);
  return a;
}
//#endregion
