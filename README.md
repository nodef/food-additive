<!-- Copyright (C) 2025 Subhajit Sahu -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<!-- See LICENSE for full terms -->

This is a package that allows you to programmatically access [E number][E-number] and [INS number][INS-number] data for food additives, including their names, types, and (approval) status.

▌
📦 [JSR](https://jsr.io/@nodef/food-additive),
📰 [Docs](https://jsr.io/@nodef/food-additive/doc).


<br>
<br>


### Reference

| Method              | Action
|---------------------|-------
| [e]                 | Find matching food additives with a code/names/type/status query (E number).
| [ins]               | Find matching food additives with a code/names/type/status query (INS number).

[e]: https://jsr.io/@nodef/food-additive/doc/~/e
[ins]: https://jsr.io/@nodef/food-additive/doc/~/ins

<br>
<br>


## E numbers

[E numbers][E-number] are codes for substances that are permitted to be used as [food additives] for use within the [European Union] and [EFTA]. Commonly found on [food labels], their safety assessment and approval are the responsibility of the [European Food Safety Authority].

Having a single unified list for food additives was first agreed upon in 1962 with [food colouring]. In 1964, the directives for preservatives were added, 1970 for antioxidants and 1974 for the emulsifiers, stabilisers, thickeners and gelling agents.

<br>

```javascript
import * as foodAdditive from "jsr:@nodef/food-additive";
// foodAdditive.loadE() → corpus
// foodAdditive.eSql([table], [options]) → SQL statements
// foodAdditive.eCsv() → Path of CSV file
// foodAdditive.e(query)
// → matching [{code, names, type, status}]

await foodAdditive.loadE();
// Load corpus first

foodAdditive.e('E101a');
// → [ { code: 'E101a',
// →     names: 'Riboflavin-5\'-Phosphate',
// →     type: 'color (Yellow-orange)',
// →     status: 'e' } ]

foodAdditive.e('101 a');
// → [ { code: 'E101a',
// →     names: 'Riboflavin-5\'-Phosphate',
// →     type: 'color (Yellow-orange)',
// →     status: 'e' } ]

foodAdditive.e('riboflavin');
// → [ { code: 'E101a',
// →     names: 'Riboflavin-5\'-Phosphate',
// →     type: 'color (Yellow-orange)',
// →     status: 'e' },
// →   { code: 'E106',
// →     names: 'Riboflavin-5-Sodium Phosphate',
// →     type: 'color (Yellow)',
// →     status: '' },
// →   ... ]
```

<br>
<br>


## INS numbers

The **International Numbering System for Food Additives** ([INS][INS-number]) is a [European]-based naming system for [food additives]. It is defined by [Codex Alimentarius], the [WHO], and the [FAO].

*Class Names and the International Numbering System for Food Additives*, was first published in 1989, with revisions in 2008 and 2011. The INS is an open list, "subject to the inclusion of additional additives or removal of existing ones on an ongoing basis".

<br>

```javascript
import * as foodAdditive from "jsr:@nodef/food-additive";

await foodAdditive.loadI();
// Load corpus first

foodAdditive.ins('102');
// → [ { code: '102',
// →     names: 'tartrazine',
// →     type: 'colour (yellow and orange) (FDA: FD&C Yellow #5)',
// →     status: 'a e' } ]

foodAdditive.ins('ins 102');
// → [ { code: '102',
// →     names: 'tartrazine',
// →     type: 'colour (yellow and orange) (FDA: FD&C Yellow #5)',
// →     status: 'a e' } ]

foodAdditive.ins('ins 160 d (iii)');
// → [ { code: '160d(iii)',
// →     names: 'lycopene, Blakeslea trispora',
// →     type: 'colour',
// →     status: 'a e' },
// →   { code: '160d', names: 'lycopenes', type: '', status: 'a e' },
// →   ... ]
```

<br>
<br>


## License

As of 23 April 2025, this project is licensed under AGPL-3.0. Previous versions remain under MIT.

<br>
<br>


[![](https://raw.githubusercontent.com/qb40/designs/gh-pages/0/image/11.png)](https://wolfram77.github.io)<br>
[![ORG](https://img.shields.io/badge/org-nodef-green?logo=Org)](https://nodef.github.io)
![](https://ga-beacon.deno.dev/G-RC63DPBH3P:SH3Eq-NoQ9mwgYeHWxu7cw/github.com/nodef/food-additive)


[E-number]: https://en.wikipedia.org/wiki/E_number
[INS-number]: https://en.wikipedia.org/wiki/International_Numbering_System_for_Food_Additives
[EFTA]: https://en.wikipedia.org/wiki/European_Free_Trade_Association
[WHO]: https://en.wikipedia.org/wiki/World_Health_Organisation
[FAO]: https://en.wikipedia.org/wiki/Food_and_Agriculture_Organization
[UN]: https://en.wikipedia.org/wiki/United_Nations
[European]: https://en.wikipedia.org/wiki/Europe
[European Union]: https://en.wikipedia.org/wiki/European_Union
[European Food Safety Authority]: https://en.wikipedia.org/wiki/European_Food_Safety_Authority
[Codex Alimentarius]: https://en.wikipedia.org/wiki/Codex_Alimentarius
[food additives]: https://en.wikipedia.org/wiki/Food_additive
[food labels]: https://en.wikipedia.org/wiki/Food_label
[food colouring]: https://en.wikipedia.org/wiki/Food_colouring
