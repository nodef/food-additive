// Copyright (C) 2025 Subhajit Sahu
// SPDX-License-Identifier: AGPL-3.0-or-later
// See LICENSE for full terms
import * as csv  from "jsr:@std/csv@1.0.5";
import lunr from "npm:lunr@2.3.9";
import {type RowData, type SetupTableOptions, setupTable} from "jsr:@nodef/extra-sql@0.1.2";




//#region TYPES
/** Represents a food additive, with its associated E number. */
export interface E {
  /** E number/code of the additive, e.g., E100. */
  code: string;
  /** Names of the additive, e.g., "Curcumin (from turmeric)". */
  names: string;
  /** Type of the additive, e.g., "color (yellow-orange)". */
  type: string;
  /** Approval status of the additive, e.g., "e u" (Approved in EU and USA). */
  status: string;
};
//#endregion




//#region GLOBALS
let corpus: Map<string, E> | null = null;
let index: lunr.Index | null = null;
//#endregion




//#region FUNCTIONS
/**
 * Load the E number corpus from CSV file.
 * @param file CSV file URL
 * @returns E number corpus
 */
async function loadFromCsv(file: string): Promise<Map<string, E>> {
  const map  = new Map<string, E>();
  const data = await (await fetch(file)).text();
  const records = csv.parse(data, {skipFirstRow: true, comment: "#"});
  for (const r of records)
    map.set(r.code, r as unknown as E);
  return map;
}


/**
 * Setup the lunr index for the E number corpus.
 * @returns lunr index
 */
function setupIndex(corpus: Map<string, E>) {
  return lunr(function(this: lunr.Builder) {
    this.ref('code');
    this.field('code');
    this.field('names');
    this.field('type');
    this.field('status');
    // this.pipeline.remove(lunr.stopWordFilter);
    for (const r of corpus.values())
      this.add({code: r.code, names: r.names, type: r.type, status: r.status.replace(/(\w)/g, 'status_$1')});
  });
}


/**
 * Load the E number corpus from the file.
 * @returns E number corpus {key ⇒ {code, names, type, status}}
 */
export async function loadE(): Promise<Map<string, E>> {
  if (corpus) return corpus;
  corpus = await loadFromCsv(eCsv());
  index  = setupIndex(corpus);
  return corpus;
}


/**
 * Get the path to the E number CSV file.
 * @returns CSV file URL
 */
export function eCsv(): string {
  return import.meta.resolve("./index.csv");
}


/**
 * Obtain SQL command to create and populate the E number table.
 * @param tab table name
 * @param opt options for the table
 * @returns CREATE TABLE, INSERT, CREATE VIEW, CREATE INDEX statements
 */
export async function eSql(tab: string="e", opt: SetupTableOptions={}): Promise<string> {
  return setupTable(tab, {code: "TEXT", names: "TEXT", type: "TEXT", status: "TEXT"},
    (await loadE()).values() as Iterable<RowData>,
    Object.assign({pk: "code", index: true, tsvector: {code: "A", names: "B", type: "C", status: "C"}}, opt));
}


/**
 * Find matching food additives with a code/names/type/status query (E number).
 * @param txt code/names/type/status query (code = E number)
 * @returns matches `[{code, names, type, status}]`
 * @example
 * ```javascript
 * foodAdditive.e('E101a');
 * // → [ { code: 'E101a',
 * // →     names: 'Riboflavin-5\'-Phosphate',
 * // →     type: 'color (Yellow-orange)',
 * // →     status: 'e' } ]
 *
 * foodAdditive.e('101 a');
 * // → [ { code: 'E101a',
 * // →     names: 'Riboflavin-5\'-Phosphate',
 * // →     type: 'color (Yellow-orange)',
 * // →     status: 'e' } ]
 *
 * foodAdditive.e('riboflavin');
 * // → [ { code: 'E101a',
 * // →     names: 'Riboflavin-5\'-Phosphate',
 * // →     type: 'color (Yellow-orange)',
 * // →     status: 'e' },
 * // →   { code: 'E106',
 * // →     names: 'Riboflavin-5-Sodium Phosphate',
 * // →     type: 'color (Yellow)',
 * // →     status: '' },
 * // →   ... ]
 * ```
 */
export function e(txt: string): E[] {
  txt = txt.replace(/(^|\s+)e?\s*(\d\d\d+)\s*([a-z])?(\s+|$)/gi, " e$2$3 ");
  const mats = index!.search(txt), a: E[] = [];
  for (const mat of mats)
    a.push(corpus!.get(mat.ref) as E);
  return a;
}
//#endregion
