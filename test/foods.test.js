const assert = require("assert");
const { FOODS } = require("../foods.js");
const { recommend, food, OZ_G } = require("../bowlfit.js");

// Every entry is complete, and every food from a maker links to where its numbers came from
const ids = new Set();
for (const f of FOODS) {
  assert.ok(!ids.has(f.id), "duplicate id " + f.id); ids.add(f.id);
  assert.ok(["dog", "cat", "both"].includes(f.species), f.id);
  assert.ok(["dry", "wet", "fresh", "raw", "freeze-dried", "homemade", "water"].includes(f.form), f.id);
  assert.ok(f.gCup > 0, "no grams per cup for " + f.id);
  if (f.generic) continue;
  assert.ok(f.brand && f.name && /^https:\/\//.test(f.src), "missing brand, name or source for " + f.id);
  assert.ok(f.kcalKg >= 600 && f.kcalKg <= 6000, "kcal/kg out of range for " + f.id);
  if (f.form === "dry") {
    assert.ok(f.kcalCup >= 200 && f.kcalCup <= 600, "kcal/cup out of range for " + f.id);
    assert.ok(f.gCup >= 60 && f.gCup <= 160, "grams per cup out of range for " + f.id);
  }
  // Hill's prints the weight of one 8 fl oz cup too: it must agree with kcal per cup / kcal per kg
  if (f.cupOz) assert.ok(Math.abs(f.gCup / (f.cupOz * OZ_G) - 1) < 0.02, "cup weight disagrees for " + f.id);
  // A can's calories must agree with its weight and kcal per kg
  if (f.unit && f.unit.kcal) assert.ok(Math.abs(f.kcalKg * f.unit.g / 1000 / f.unit.kcal - 1) < 0.05, "can calories disagree for " + f.id);
}

// Dry food that isn't listed uses the 10th percentile of the listed dry foods, so the bowl errs big
const dry = FOODS.filter((f) => f.form === "dry" && !f.generic).map((f) => f.gCup).sort((a, b) => a - b);
assert.strictEqual(food("any-dry").gCup, dry[Math.floor((dry.length - 1) * 0.1)]);
assert.ok(dry.filter((g) => g >= food("any-dry").gCup).length / dry.length >= 0.9);

// Hill's Science Diet Adult Chicken & Barley: 365 / 3675 x 1000 = 99.3 g a cup
assert.strictEqual(food("hills-sd-adult-chicken-barley-dry").gCup, 99.3);

// A mixed meal, 150 g Hill's i/d Turkey canned + 40 g Nom Nom Turkey Fare, elbow 9 in: 150 g at 1.0 g/ml = 150 ml,
// 40 g / 188 g a cup x 236.6 = 50.3 ml -> 200.3 ml x 1.5 = 300.5 -> 350 ml; slow feeder x 2 = 400.7 -> 450 ml
const mixed = { species: "dog", unit: "in", elbow: 9, foods: [
  { id: "hills-pd-id-turkey-can-dog", amount: 150, unit: "g" },
  { id: "nomnom-turkey-fare", amount: 40, unit: "g" }] };
assert.strictEqual(recommend(mixed).capacityMl, 350);
assert.strictEqual(recommend({ ...mixed, fastEater: true }).capacityMl, 450);

// Cups need no food: 1 cup x 236.6 x 1.5 = 354.9 -> 400 ml
assert.strictEqual(recommend({ species: "dog", foods: [{ amount: 1, unit: "cups" }] }).capacityMl, 400);
// Grams without a food: no size, and the page asks for the food
let r = recommend({ species: "dog", foods: [{ amount: 100, unit: "g" }] });
assert.ok(r.capacityMl === null && r.needFood === true);
// 100 g of Hill's Science Diet Adult = 100 / 99.3 cups = 238.3 ml -> x 1.5 = 357 -> 400 ml
assert.strictEqual(recommend({ species: "dog", foods: [{ id: "hills-sd-adult-chicken-barley-dry", amount: 100, unit: "g" }] }).capacityMl, 400);
// Half a 370 g can = 185 ml -> x 1.5 = 277.5 -> 300 ml
assert.strictEqual(recommend({ species: "dog", foods: [{ id: "hills-pd-id-low-fat-can-dog", amount: 0.5, unit: "unit" }] }).capacityMl, 300);
// Ounces: 6.5 oz of wet food = 184.3 g = 184.3 ml -> x 1.5 = 276.4 -> 300 ml
assert.strictEqual(recommend({ species: "dog", foods: [{ id: "any-wet", amount: 6.5, unit: "oz" }] }).capacityMl, 300);
// Exactly on a step: 200 ml x 1.5 = 300 stays 300, not 350
assert.strictEqual(recommend({ species: "dog", foods: [{ id: "any-wet", amount: 200, unit: "g" }] }).capacityMl, 300);

// How much to feed with a listed food: 10 kg spayed/neutered dog = 629.8 kcal a day;
// Hill's Science Diet Adult at 365 kcal per cup -> 1.73 cups a day, 0.86 a meal
r = recommend({ species: "dog", weight: 10, stage: "neutered", mealsPerDay: 2, foods: [{ id: "hills-sd-adult-chicken-barley-dry", unit: "cups" }] });
assert.deepStrictEqual([r.feeding.dayHi, r.feeding.meal, r.feeding.unitName], [1.73, 0.86, "cups"]);
assert.strictEqual(r.capacityMl, 350);                    // 0.86 x 236.6 x 1.5 = 305.2 -> 350
// ... in grams: 629.8 / 3675 x 1000 = 171 g a day
r = recommend({ species: "dog", weight: 10, stage: "neutered", foods: [{ id: "hills-sd-adult-chicken-barley-dry", unit: "g" }] });
assert.strictEqual(r.feeding.dayHi, 171);
// ... in cans: 629.8 / 328 = 1.92 cans a day
r = recommend({ species: "dog", weight: 10, stage: "neutered", foods: [{ id: "hills-pd-id-low-fat-can-dog", unit: "unit" }] });
assert.deepStrictEqual([r.feeding.dayHi, r.feeding.unitName], [1.92, "cans"]);
// A food that isn't listed uses the calories typed from the label
r = recommend({ species: "dog", weight: 10, stage: "neutered", foods: [{ id: "any-dry", unit: "cups" }], labelKcal: 400 });
assert.strictEqual(r.feeding.meal, 0.79);
// Two foods: calories a day only, no single amount
r = recommend({ species: "dog", weight: 10, foods: [{ id: "any-dry", unit: "cups" }, { id: "any-wet", unit: "g" }], labelKcal: 400 });
assert.ok(r.feeding.kcalHi === 630 && r.feeding.unit === undefined);
// Fresh-cooked food from the makers: JustFoodForDogs' chart, 362.5 oz over 58 cups = 6.25 oz = 177.2 g a cup;
// Nom Nom prints 188 g; Freshpet 296 kcal per cup / 2020 kcal per kg = 146.5 g
assert.deepStrictEqual(["jffd-turkey-whole-wheat-macaroni", "nomnom-turkey-fare", "freshpet-roasted-meals-tender-chicken"].map((id) => food(id).gCup), [177.2, 188, 146.5]);
// Fresh, raw and homemade food that isn't listed: the lightest listed fresh food here, so the bowl errs big
assert.ok(["any-fresh", "any-raw", "homemade"].every((id) => food(id).gCup === 146.5));
// Freeze-dried: 50 kcal per 1/4 cup = 200 kcal per cup / 4440 kcal per kg = 45 g a cup
assert.strictEqual(food("any-freeze-dried").gCup, 45);
// 30 g of freeze-dried = 30 / 45 cups = 157.7 ml, plus 60 g of water = 60 ml -> 217.7 x 1.5 = 326.6 -> 350 ml
assert.strictEqual(recommend({ species: "dog", foods: [{ id: "stella-chewys-chicken-meal-mixers", amount: 30, unit: "g" }, { id: "water", amount: 60, unit: "g" }] }).capacityMl, 350);
// What the pet eats now: 2 meals of 150 g Hill's i/d Turkey canned (1013 kcal/kg) + 40 g Nom Nom Turkey Fare (1298 kcal/kg)
// = 2 x (151.95 + 51.92) = 408 kcal a day; the meal is in US units, so 30 lb = 13.6 kg, and a spayed/neutered
// dog's estimate is 70 x 13.6^0.75 x 1.6 = 794
r = recommend({ ...mixed, weight: 30, stage: "neutered", mealsPerDay: 2 });
assert.deepStrictEqual([r.fedKcalDay, r.feeding.kcalHi], [408, 794]);
// Unknown calories for a food with an amount: no total rather than a wrong one
assert.strictEqual(recommend({ species: "dog", foods: [{ id: "any-dry", amount: 1, unit: "cups" }, { id: "any-wet", amount: 50, unit: "g" }] }).fedKcalDay, null);
// Water or broth mixed in counts as 0 kcal: the same meal with 60 g of it still eats 408 kcal,
// and the bowl counts its 60 ml: (200.3 + 60) x 1.5 = 390.5 -> 400 ml
const day = { ...mixed, weight: 30, stage: "neutered", mealsPerDay: 2 };
r = recommend({ ...day, foods: [...mixed.foods, { id: "water", amount: 60, unit: "g" }] });
assert.deepStrictEqual([r.fedKcalDay, r.capacityMl], [408, 400]);
// A broth found online carries its calories per 100 ml: 60 ml x 16 kcal per 100 ml x 2 meals = 19.2,
// so 407.7 + 19.2 = 426.9 -> 427. In cups: 0.5 cup = 118.3 ml x 0.16 x 2 = 37.9, so 407.7 + 37.9 = 445.6 -> 446
r = recommend({ ...day, foods: [...mixed.foods, { id: "water", amount: 60, unit: "g", kcal100: 16 }] });
assert.strictEqual(r.fedKcalDay, 427);
r = recommend({ ...day, foods: [...mixed.foods, { id: "water", amount: 0.5, unit: "cups", kcal100: 16 }] });
assert.strictEqual(r.fedKcalDay, 446);
// Homemade bone broth at 40 kcal a cup: 60 ml x 40 / 236.6 x 2 meals = 20.3, so 407.7 + 20.3 = 428.0 -> 428
r = recommend({ ...day, foods: [...mixed.foods, { id: "homemade-broth", amount: 60, unit: "g", kcal100: 40 / 236.6 * 100 }] });
assert.strictEqual(r.fedKcalDay, 428);
// One food plus water is still a one-food meal, so how much to feed stays, whichever row comes first:
// 793.5 kcal / 1.013 kcal per g = 783 g a day. A 16 kcal broth, 60 ml x 2 meals = 19.2 kcal, comes off first:
// 774.3 / 1.013 = 764 g. No food amount typed, so there is no "eats now".
const hills = { id: "hills-pd-id-turkey-can-dog", unit: "g" }, pet = { species: "dog", unit: "in", weight: 30, stage: "neutered", mealsPerDay: 2 };
r = recommend({ ...pet, foods: [hills, { id: "water", amount: 60, unit: "g" }] });
assert.deepStrictEqual([r.feeding.dayHi, r.feeding.unit, r.fedKcalDay], [783, "g", null]);
r = recommend({ ...pet, foods: [{ id: "water", amount: 60, unit: "g", kcal100: 16 }, hills] });
assert.strictEqual(r.feeding.dayHi, 764);
// Water alone never reads as "eats 0 kcal"
assert.strictEqual(recommend({ species: "dog", weight: 10, foods: [{ id: "water", amount: 100, unit: "g" }] }).fedKcalDay, null);
console.log("foods tests passed (" + FOODS.length + " foods)");
