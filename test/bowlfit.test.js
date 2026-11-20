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
// Never a dead end, and for a large breed only the flat plates (raised 1 ft or less = 3.06x bloat risk). The Pink Planet
// plate is made for medium to large dogs and holds about 650 ml (listing estimate), so it is the closest for 750 ml.
assert.deepStrictEqual(names(r), ["Large dog ceramic slow feeder Pink Planet style", "Butter yellow ceramic slow feeder plate, medium", "Lilac flower ceramic slow feeder plate"]);
assert.deepStrictEqual(r.products.map((p) => p.note), ["Holds ~100 ml less than suggested.", "Holds ~350 ml less than suggested.", "Holds ~440 ml less than suggested."]);
assert.ok(recommend({ species: "dog" }).products[2].specs.includes("Holds about 650 ml"));   // an estimate says "about"
// a smaller meal fits the other flat plates too, the widest plate first for a large breed
assert.deepStrictEqual(names(recommend({ species: "dog", elbow: 50, size: "large", cupsPerMeal: 0.5 })),
  ["Large dog ceramic slow feeder Pink Planet style", "Butter yellow ceramic slow feeder plate, medium", "Lilac flower ceramic slow feeder plate"]);
// when nothing else fits, the capacity gap is said gently: 1 cup for a cat x 1.5 = 400 ml, raised elbow
assert.ok(recommend({ species: "cat", elbow: 20, cupsPerMeal: 2 }).products.every((p) => /holds ~\d+ ml less than suggested/.test(p.note)));
r = recommend({ species: "dog", elbow: 35, size: "large" });
assert.deepStrictEqual([r.height.minCm, r.height.maxCm], [30.5, 35]);   // elbow rule 27.5-35 cm, cut at 30.5
r = recommend({ species: "dog", elbow: 28, size: "large" });
assert.ok(r.height.floor && r.height.minCm === undefined);              // whole elbow range is at or below 1 ft

// Giant breed (over 45 kg): floor, or raised no higher than 1 ft (30.5 cm), even with a tall elbow
r = recommend({ species: "dog", elbow: 65, size: "giant" });
assert.ok(r.height.floor && r.height.maxCm === 30.5 && r.height.minCm === undefined && r.cautions.length === 1 && r.products.length === 3);

// Old flag largeBreed (size unknown): both cut-offs explained, no products
r = recommend({ species: "dog", elbow: 50, largeBreed: true });
assert.ok(r.height.floor && r.cautions.length === 1 && r.products.length === 3 && r.products.every((p) => /ceramic slow feeder/.test(p.name)));

// Inches: elbow 10 in = 25.4 cm -> 17.9 to 25.4 cm, too tall for our bowls
r = recommend({ species: "dog", unit: "in", elbow: 10, cupsPerMeal: 1 });
assert.deepStrictEqual([r.height.minCm, r.height.maxCm], [17.9, 25.4]);
assert.strictEqual(r.capacityMl, 400);               // 1 x 236.6 x 1.5 = 354.9 -> 400
// None fits, so the 3 closest, each saying how far off it is: the tallest rims first
assert.deepStrictEqual(names(r), ["Sage green raised tilted slow feeder", "Two-tone raised tilted flower slow feeder", "Lilac flower slow feeder on a pedestal"]);
assert.ok(r.productNote.startsWith("The closest") && r.products[0].note.startsWith("Rim 6.9 cm (2.7 in) quite a bit lower than the range"));

// Cat: elbow 12, whisker 14, a third of a cup, flat face -> tilted first
r = recommend({ species: "cat", elbow: 12, whisker: 14, cupsPerMeal: 0.33, flatFace: true });
assert.strictEqual(r.minWidthCm, 14);
assert.strictEqual(names(r)[0], "Sage green raised tilted slow feeder");
assert.strictEqual(names(r)[1], "Two-tone raised tilted flower slow feeder"); // also tilted; 14.5 cm >= 14 cm whisker span

// No measurements: still answers with what to measure
r = recommend({ species: "cat" });
assert.strictEqual(r.height, null);
assert.ok(r.tips.length >= 2);

// Before anything is typed: our six best sellers in the owner's order, no notes, the same static list for a cat or a
// dog (owner 2026-11-19)
const TOP = ["Lilac flower ceramic slow feeder plate", "Two-tone raised tilted flower slow feeder", "Large dog ceramic slow feeder Pink Planet style",
  "Lilac flower slow feeder on a pedestal", "Sage green raised tilted slow feeder", "Butter yellow ceramic slow feeder plate, medium"];
assert.strictEqual(r.productNote, "PawsOnMe bowls that may fit these numbers:");   // the original heading, not "best-selling" (owner 2026-11-19)
assert.deepStrictEqual(names(r), TOP);
assert.deepStrictEqual(names(recommend({ species: "dog" })), TOP);
assert.ok(recommend({ species: "dog", weight: 10 }).products.every((p) => !p.note));   // weight alone doesn't rank bowls
// After that, the list says "may fit", never "fit" (owner 2026-11-15)
const MAY = "PawsOnMe bowls that may fit these numbers:";
// It re-ranks with every input. A low elbow keeps the two flat plates:
r = recommend({ species: "cat", elbow: 6 });
assert.deepStrictEqual(names(r), ["Lilac flower ceramic slow feeder plate", "Butter yellow ceramic slow feeder plate, medium"]);
// a higher elbow swaps in the raised ones (range 4.5 to 12 cm, the 3.5 and 4 cm plates are below it):
r = recommend({ species: "cat", elbow: 12 });
assert.strictEqual(r.productNote, MAY);
assert.deepStrictEqual(names(r), ["Lilac flower slow feeder on a pedestal", "Sage green raised tilted slow feeder", "Two-tone raised tilted flower slow feeder"]);
// older or stiff: same three, the higher rims first (11, 10.5, 8.5 cm)
r = recommend({ species: "cat", elbow: 12, senior: true });
assert.deepStrictEqual(names(r), ["Sage green raised tilted slow feeder", "Two-tone raised tilted flower slow feeder", "Lilac flower slow feeder on a pedestal"]);
// a bigger meal drops the 200 ml bowls: 1 cup x 236.6 x 1.5 = 354.9 -> 400 ml, only the 400 ml plate holds it, and its rim (4 cm) is in 0 to 7 cm
r = recommend({ species: "cat", elbow: 7, cupsPerMeal: 1 });
assert.deepStrictEqual(names(r), ["Butter yellow ceramic slow feeder plate, medium"]);
// and when nothing fits any more the wording changes to the closest ones
r = recommend({ species: "cat", elbow: 20 });
assert.ok(r.productNote.startsWith("The closest") && r.products.length === 3 && r.products.every((p) => p.note));
// Each bowl is a card: it links to its own Etsy listing and shows that listing's main photo (owner 2026-11-16)
const fs = require("fs"), path = require("path");
const { PRODUCTS } = require("../bowlfit.js");
PRODUCTS.forEach((p) => {
  assert.ok(/^https:\/\/www\.etsy\.com\/listing\/\d{9,}\/[a-z0-9-]+$/.test(p.url), p.name + " url");
  assert.ok(/^img\/[a-z0-9-]+\.jpg$/.test(p.img) && fs.statSync(path.join(__dirname, "..", p.img)).size > 5000, p.name + " img");
});
assert.strictEqual(new Set(PRODUCTS.map((p) => p.url)).size, PRODUCTS.length);
assert.strictEqual(new Set(PRODUCTS.map((p) => p.img)).size, PRODUCTS.length);
r = recommend({ species: "cat", elbow: 12 });
assert.ok(r.products.length === 3 && r.products.every((p) => p.url && p.img));
assert.deepStrictEqual(r.products[0].specs, ["14.8 cm (5.8 in) across", "Rim 8.5 cm (3.3 in) high", "Holds 310 ml"]);
assert.strictEqual(r.products[0].url, "https://www.etsy.com/listing/4533246949/lilac-elevated-slow-feeder-ceramic-pet");
// no result ever says "that fit"
[{ species: "cat" }, { species: "cat", elbow: 12 }, { species: "dog", elbow: 11, cupsPerMeal: 0.5 }, { species: "dog", elbow: 50, size: "large" }]
  .forEach((v) => assert.ok(!/that fit\b/.test(recommend(v).productNote)));
// Card notes are a gentle reference (owner 2026-11-19): "slightly" under 1 cm, "a bit" up to 5 cm, "quite a bit"
// beyond, and an approximate "~" on capacity
r = recommend({ species: "dog", unit: "cm", elbow: 19.7, cupsPerMeal: 1 });
assert.strictEqual(r.products[0].note, "Rim 1.2 cm (0.5 in) a bit lower than the range, holds ~200 ml less than suggested.");
assert.strictEqual(recommend({ species: "dog", unit: "cm", elbow: 19, cupsPerMeal: 0.25 }).products[0].note, "Rim 0.5 cm (0.2 in) slightly lower than the range.");
assert.ok(r.products.every((p) => !/\) (lower|higher) than the range|holds \d/.test(p.note)));
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

// Energy behind the calories (Pet Nutrition Alliance, Merck, National Research Council, Mullis et al. 2015).
// 10 kg dog: RER = 70 x 10^0.75 = 393.6 -> 394 kcal a day
r = recommend({ species: "dog", weight: 10, stage: "intact", kcalPerCup: 400 });
assert.deepStrictEqual([r.energy.rer, r.energy.key, r.feeding.kcalHi], [394, "intact", 709]);   // x 1.8
assert.deepStrictEqual(r.energy.levels.filter((l) => l.on).map((l) => l.who), ["Adult, not spayed or neutered"]);
assert.strictEqual(r.energy.levels.length, 11);
// Activity: low 1.2-1.4 = 472-551; high (NRC active adult) 1.86 = 732; working 2.0 = 787
r = recommend({ species: "dog", weight: 10, stage: "neutered", activity: "low", kcalPerCup: 400 });
assert.deepStrictEqual([r.feeding.kcalLo, r.feeding.kcalHi, r.energy.key], [472, 551, "inactive"]);
r = recommend({ species: "dog", weight: 10, stage: "neutered", activity: "active", kcalPerCup: 400 });
assert.deepStrictEqual([r.feeding.kcalHi, r.energy.key], [732, "active"]);
r = recommend({ species: "dog", weight: 10, stage: "intact", activity: "working", kcalPerCup: 400 });
assert.deepStrictEqual([r.feeding.kcalHi, r.energy.key], [787, "working"]);
// Growth sets the level for a puppy whatever the activity; both puppy rows light up
r = recommend({ species: "dog", weight: 10, stage: "young", activity: "working", kcalPerCup: 400 });
assert.deepStrictEqual([r.feeding.kcalLo, r.feeding.kcalHi, r.energy.levels.filter((l) => l.on).length], [787, 1181, 2]);
// The old stage "inactive" still works
assert.strictEqual(recommend({ species: "dog", weight: 10, stage: "inactive", kcalPerCup: 400 }).energy.key, "inactive");
// Cats have no "working" level (an "active" one, yes: see below): 4 kg neutered cat, RER 198, x 1.2 = 238
r = recommend({ species: "cat", weight: 4, stage: "neutered", activity: "working", kcalPerCup: 400 });
assert.deepStrictEqual([r.energy.rer, r.feeding.kcalHi, r.energy.key, r.energy.levels.length, r.energy.after], [198, 238, "neutered", 8, null]);
// No weight: the levels are still there, without calories
r = recommend({ species: "dog" });
assert.ok(r.energy.rer === null && r.energy.levels.length === 11 && r.energy.levels.every((l) => l.kcalLo === null));
// Health conditions add what vet sources say; overweight also gives a starting point to lose weight
// (Merck: 60% of the calories a day for dogs, 70% for cats): 630 x 0.6 = 378; cat 238 x 0.7 = 167
r = recommend({ species: "dog", weight: 10, stage: "neutered", kcalPerCup: 400, conditions: ["overweight", "kidney", "lipids", "liver", "pancreatitis"] });
assert.deepStrictEqual(r.conditionNotes.map((c) => c.key), ["kidney", "liver", "pancreatitis", "lipids", "overweight"]);
assert.deepStrictEqual([r.feeding.lossLo, r.feeding.lossHi], [378, 378]);
assert.ok(/under 20 g of fat per 1,000 kcal/i.test(r.conditionNotes[2].text));
assert.deepStrictEqual(r.conditionNotes[3].src, ["weeth", "merck-pancreas"]);   // dogs: pancreatitis risk added
assert.ok(/don't need less fat/.test(r.conditionNotes[1].text));                 // Merck: most liver disease needs no fat cut
r = recommend({ species: "cat", weight: 4, stage: "neutered", kcalPerCup: 400, conditions: ["pancreatitis", "lipids", "overweight"] });
assert.ok(/moderately less fat/i.test(r.conditionNotes[0].text) && r.conditionNotes[1].src.length === 1);
assert.deepStrictEqual([r.feeding.lossHi], [167]);
assert.ok(/hepatic lipidosis/.test(r.conditionNotes[2].text));
// Older dogs: a note from the National Research Council's guide
assert.ok(recommend({ species: "dog", weight: 10, stage: "neutered", kcalPerCup: 400, senior: true }).nutritionTips.some((t) => /1\.5 × RER/.test(t)));
// Every source named by a level or a condition is listed
const B = require("../bowlfit.js");
const ids = new Set();
Object.values(B.LEVELS).forEach((ls) => ls.forEach((l) => l.src.forEach((id) => ids.add(id))));
Object.values(B.CONDITIONS).forEach((c) => { c.src.forEach((id) => ids.add(id)); if (c.dogExtra) c.dogExtra.src.forEach((id) => ids.add(id)); });
ids.add("loftus");
ids.forEach((id) => assert.ok(B.SOURCES[id] && /^https:\/\//.test(B.SOURCES[id].url), "source " + id));
// Brings food back up (regurgitation) and being sick on an empty stomach are not "eats fast" (owner 2026-11-16):
// their own tips, no slow feeder, the same bowl size; regurgitation puts the higher rims first.
const reg = { species: "dog", unit: "in", elbow: 9, weight: 30, stage: "neutered", mealsPerDay: 2,   // the made-up example dog
  foods: [{ id: "hills-pd-id-turkey-can-dog", amount: 150, unit: "g" }, { id: "nomnom-turkey-fare", amount: 40, unit: "g" }] };
r = recommend({ ...reg, regurgitates: true, emptyStomach: true });
assert.ok(r.tips.some((t) => /^Brings food back up/.test(t) && /Aim for the top of the range/.test(t)));
assert.ok(r.tips.some((t) => /^Empty stomach: lip licking can be a sign of nausea/.test(t) && /12 of 17/.test(t)));
assert.deepStrictEqual([r.slowFeeder, r.capacityMl], [false, recommend(reg).capacityMl]);
assert.ok(!r.tips.some((t) => /^A slow feeder/.test(t)));
// A large dog: the bowl height is the vet's call because of bloat; no elbow: a higher bowl in general
assert.ok(recommend({ species: "dog", size: "large", elbow: 40, regurgitates: true }).tips.some((t) => /your vet's call/.test(t)));
assert.ok(recommend({ species: "dog", regurgitates: true }).tips.some((t) => /A higher bowl lets gravity help/.test(t)));
// The empty-stomach advice comes from a study in dogs, so a cat gets none
assert.ok(!recommend({ species: "cat", emptyStomach: true }).tips.some((t) => /^Empty stomach/.test(t)));
// Ties go to the higher rim for regurgitation: 1 cm elbow-to-rim difference between equal-scoring bowls
const flat = recommend({ species: "dog", unit: "cm", elbow: 9, cupsPerMeal: 0.5 }).products.map((p) => p.name);
const high = recommend({ species: "dog", unit: "cm", elbow: 9, cupsPerMeal: 0.5, regurgitates: true }).products.map((p) => p.name);
assert.notDeepStrictEqual(flat, high);
// What people read never says "disease"
Object.values(B.CONDITIONS).forEach((c) => assert.ok(!/disease/i.test([c.title, c.text, c.dog, c.cat].join(" ")), c.title));
// A very active cat, like one that goes outdoors: 1.6 x RER, a third more than a neutered adult's 1.2 (FEDIAF 2025:
// active cats 100 against 75 kcal/kg^0.67 for indoor or neutered cats). "working" stays for dogs only.
r = recommend({ species: "cat", weight: 4, stage: "neutered", activity: "active", kcalPerCup: 400 });
assert.deepStrictEqual([r.energy.key, r.energy.lo, r.energy.basis], ["active", 1.6, "a very active adult cat, like one that goes outdoors"]);
assert.strictEqual(r.feeding.kcalLo, Math.round(70 * Math.pow(4, 0.75) * 1.6));   // 317 kcal
assert.ok(r.energy.levels.some((l) => l.on && l.lo === 1.6 && l.src.includes("fediaf")));
assert.strictEqual(recommend({ species: "cat", weight: 4, stage: "neutered", activity: "working" }).energy.key, "neutered");
assert.strictEqual(recommend({ species: "cat", weight: 4, stage: "young", activity: "active" }).energy.key, "young");   // kittens go by growth
console.log("energy and condition tests passed");
