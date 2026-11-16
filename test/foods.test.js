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

// A mixed meal, 180 g Hill's i/d Low Fat canned + 10 g JFFD Turkey & Whole Wheat Macaroni, elbow 7.75 in:
// 190 g at 1.0 g/ml = 190 ml -> x 1.5 = 285 -> 300 ml; slow feeder x 2 = 380 -> 400 ml
const mixed = { species: "dog", unit: "in", elbow: 7.75, foods: [
  { id: "hills-pd-id-low-fat-can-dog", amount: 180, unit: "g" },
  { id: "jffd-turkey-whole-wheat-macaroni", amount: 10, unit: "g" }] };
assert.strictEqual(recommend(mixed).capacityMl, 300);
assert.strictEqual(recommend({ ...mixed, fastEater: true }).capacityMl, 400);

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
console.log("foods tests passed (" + FOODS.length + " foods)");
