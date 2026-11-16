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

// Large breed (23-45 kg): floor, or above 1 ft (30.5 cm) up to the elbow; one note; no products
r = recommend({ species: "dog", elbow: 50, size: "large", cupsPerMeal: 2 });
assert.ok(r.height.floor && r.height.minCm === 42.5 && r.height.maxCm === 50 && r.cautions.length === 1);
// Never a dead end: the closest bowls, and for a large breed only the flat plates (raised 1 ft or less = 3.06x bloat risk)
assert.deepStrictEqual(names(r), ["Butter yellow ceramic slow feeder plate, medium", "Lilac flower ceramic slow feeder plate"]);
assert.ok(r.products[0].note.includes("350 ml less"));        // 750 - 400
r = recommend({ species: "dog", elbow: 35, size: "large" });
assert.deepStrictEqual([r.height.minCm, r.height.maxCm], [30.5, 35]);   // elbow rule 27.5-35 cm, cut at 30.5
r = recommend({ species: "dog", elbow: 28, size: "large" });
assert.ok(r.height.floor && r.height.minCm === undefined);              // whole elbow range is at or below 1 ft

// Giant breed (over 45 kg): floor, or raised no higher than 1 ft (30.5 cm), even with a tall elbow
r = recommend({ species: "dog", elbow: 65, size: "giant" });
assert.ok(r.height.floor && r.height.maxCm === 30.5 && r.height.minCm === undefined && r.cautions.length === 1 && r.products.length === 3);

// Old flag largeBreed (size unknown): both cut-offs explained, no products
r = recommend({ species: "dog", elbow: 50, largeBreed: true });
assert.ok(r.height.floor && r.cautions.length === 1 && r.products.length === 2 && r.products.every((p) => /ceramic slow feeder plate/.test(p.name)));

// Inches: elbow 10 in = 25.4 cm -> 17.9 to 25.4 cm, too tall for our bowls
r = recommend({ species: "dog", unit: "in", elbow: 10, cupsPerMeal: 1 });
assert.deepStrictEqual([r.height.minCm, r.height.maxCm], [17.9, 25.4]);
assert.strictEqual(r.capacityMl, 400);               // 1 x 236.6 x 1.5 = 354.9 -> 400
// None fits, so the 3 closest, each saying how far off it is: the tallest rims first
assert.deepStrictEqual(names(r), ["Sage green raised tilted slow feeder", "Two-tone raised tilted flower slow feeder", "Lilac flower slow feeder on a pedestal"]);
assert.ok(r.productNote.startsWith("The closest") && r.products[0].note.startsWith("Rim 6.9 cm (2.7 in) lower than the range"));

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

// Grams: 200 g a meal, 100 g in one level cup -> 2 cups -> 2 x 236.6 x 1.5 = 709.8 -> 750 ml
r = recommend({ species: "dog", elbow: 40, foodUnit: "g", gramsPerMeal: 200, gramsPerCup: 100 });
assert.strictEqual(r.capacityMl, 750);
// Grams without the weight of one cup: no bowl size yet, and the page asks for it
r = recommend({ species: "dog", elbow: 40, foodUnit: "g", gramsPerMeal: 200 });
assert.ok(r.capacityMl === null && r.needGramsPerCup === true);
// Grams feeding: 10 kg neutered dog, 3,500 kcal/kg -> 70 x 10^0.75 x 1.6 = 629.8 kcal -> 180 g a day, 90 g a meal
r = recommend({ species: "dog", weight: 10, stage: "neutered", foodUnit: "g", kcalPerKg: 3500, mealsPerDay: 2 });
assert.deepStrictEqual([r.feeding.gDayLo, r.feeding.gDayHi, r.feeding.gMeal], [180, 180, 90]);
