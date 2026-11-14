const assert = require("assert");
const { recommend } = require("../bowlfit.js");
const names = (r) => r.products.map((p) => p.name);

// Dachshund-type dog: elbow 11 cm, half a cup per meal, fast eater
let r = recommend({ species: "dog", unit: "cm", elbow: 11, cupsPerMeal: 0.5, fastEater: true, shortLegs: true });
assert.deepStrictEqual([r.height.minCm, r.height.maxCm], [3.5, 11]);
assert.strictEqual(r.capacityMl, 250);               // 0.5 x 236.6 x 2 = 236.6 -> 250
assert.ok(names(r).includes("Lilac flower slow feeder on a pedestal"));
assert.ok(!names(r).includes("Sage green raised tilted slow feeder")); // 200 ml < 250 ml
assert.ok(!names(r).includes("Two-tone raised tilted flower slow feeder")); // 200 ml < 250 ml

// Large breed: floor, caution, no products
r = recommend({ species: "dog", elbow: 50, largeBreed: true, cupsPerMeal: 2 });
assert.ok(r.height.floor && r.cautions.length === 1 && r.products.length === 0);

// Inches: elbow 10 in = 25.4 cm -> 17.9 to 25.4 cm, too tall for our bowls
r = recommend({ species: "dog", unit: "in", elbow: 10, cupsPerMeal: 1 });
assert.deepStrictEqual([r.height.minCm, r.height.maxCm], [17.9, 25.4]);
assert.strictEqual(r.capacityMl, 400);               // 1 x 236.6 x 1.5 = 354.9 -> 400
assert.strictEqual(r.products.length, 0);

// Cat: elbow 12, whisker 14, a third of a cup, flat face -> tilted first
r = recommend({ species: "cat", elbow: 12, whisker: 14, cupsPerMeal: 0.33, flatFace: true });
assert.strictEqual(r.minWidthCm, 14);
assert.strictEqual(names(r)[0], "Sage green raised tilted slow feeder");
assert.strictEqual(names(r)[1], "Two-tone raised tilted flower slow feeder"); // also tilted; 14.5 cm >= 14 cm whisker span

// No measurements: still answers with what to measure
r = recommend({ species: "cat" });
assert.strictEqual(r.height, null);
assert.ok(r.tips.length >= 2);
console.log("all bowlfit tests passed");

// Feeding: 10 kg spayed/neutered dog, 400 kcal per cup, 2 meals
r = recommend({ species: "dog", weight: 10, stage: "neutered", kcalPerCup: 400, mealsPerDay: 2 });
assert.strictEqual(r.feeding.rer, 394);                   // 70 x 10^0.75 = 393.6
assert.strictEqual(r.feeding.kcalHi, 630);                // x 1.6
assert.strictEqual(r.feeding.cupsMeal, 0.79);             // 629.8 / 400 / 2
assert.strictEqual(r.capacityMl, 300);                    // 0.787 x 236.6 x 1.5 = 279 -> 300

// Feeding in US units: 22 lb = 9.98 kg
r = recommend({ species: "dog", unit: "in", weight: 22, stage: "neutered", kcalPerCup: 400 });
assert.strictEqual(r.feeding.rer, 393);

// Cat: 4.5 kg spayed/neutered, 450 kcal per cup
r = recommend({ species: "cat", weight: 4.5, stage: "neutered", kcalPerCup: 450 });
assert.strictEqual(r.feeding.kcalHi, 260);                // 70 x 4.5^0.75 = 216.3, x 1.2
assert.strictEqual(r.capacityMl, 150);

// Puppy range and the large-breed food tip
r = recommend({ species: "dog", weight: 8, stage: "young", kcalPerCup: 400, largeBreed: false });
assert.ok(r.feeding.kcalHi > r.feeding.kcalLo);
r = recommend({ species: "dog", weight: 8, stage: "young", kcalPerCup: 400, largeBreed: true });
assert.ok(r.tips.some((t) => t.includes("large size dogs")));

// A typed-in meal size wins over the calculated one
r = recommend({ species: "dog", weight: 10, kcalPerCup: 400, cupsPerMeal: 2 });
assert.strictEqual(r.capacityMl, 750);                    // 2 x 236.6 x 1.5 = 709.8 -> 750
console.log("feeding tests passed");
