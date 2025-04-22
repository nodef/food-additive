import {assertEquals} from "jsr:@std/assert";
import {
  loadE,
  loadIns,
  e,
  ins,
} from "./index.ts";




//#region TEST E NUMBERS
Deno.test("E Numbers", async () => {
  await loadE();
  const a = e("E101a");
  assertEquals(a, [{
    code: "E101a",
    names: "Riboflavin-5'-Phosphate",
    type: "color (Yellow-orange)",
    status: "e",
  }]);
  const b = e("E101 a");
  assertEquals(b, [{
    code: "E101a",
    names: "Riboflavin-5'-Phosphate",
    type: "color (Yellow-orange)",
    status: "e",
  }]);
  const c = e("riboflavin");
  assertEquals(c[0], {
    code: "E101a",
    names: "Riboflavin-5'-Phosphate",
    type: "color (Yellow-orange)",
    status: "e",
  });
  assertEquals(c[1], {
    code: "E106",
    names: "Riboflavin-5-Sodium Phosphate",
    type: "color (Yellow)",
    status: "",
  });
});
//#endregion




//#region TEST INS NUMBERS
Deno.test("INS Numbers", async () => {
  await loadIns();
  const a = ins("ins 102");
  assertEquals(a, [{
    code: "102",
    names: "tartrazine",
    type: "colour (yellow and orange) (FDA: FD&C Yellow #5)",
    status: "a e",
  }]);
  const b = ins("ins 102");
  assertEquals(b, [{
    code: "102",
    names: "tartrazine",
    type: "colour (yellow and orange) (FDA: FD&C Yellow #5)",
    status: "a e",
  }]);
  const c = ins("ins 160 d (iii)");
  assertEquals(c[0], {
    code: "160d(iii)",
    names: "lycopene, Blakeslea trispora",
    type: "colour",
    status: "a e",
  });
  assertEquals(c[1], {
    code: "160d",
    names: "lycopenes",
    type: "",
    status: "a e",
  });
});
//#endregion
