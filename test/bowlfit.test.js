const assert = require("assert");
const { recommend } = require("../bowlfit.js");
const names = (r) => r.products.map((p) => p.name);

// Dachshund-type dog: elbow 11 cm, half a cup per meal, fast eater
let r = recommend({ species: "dog", unit: "cm", elbow: 11, cupsPerMeal: 0.5, fastEater: true, shortLegs: true });
assert.deepStrictEqual([r.height.minCm, r.height.maxCm], [3.5, 11]);
// the sum the page writes out under its picture: elbow - 7.5 cm = the low end
assert.deepStrictEqual(r.height.sum, { elbow: "11 cm (4.3 in)", less: "7.5 cm (3 in)", low: "3.5 cm (1.4 in)" });
// an elbow lower than 7.5 cm: the low end is the floor, so there is no subtraction to show
assert.strictEqual(recommend({ species: "cat", unit: "cm", elbow: 6 }).height.sum.low, null);
assert.strictEqual(r.capacityMl, 250);               // 0.5 x 236.6 x 2 = 236.6 -> 250
assert.ok(names(r).includes("Lilac flower slow feeder on a pedestal"));
assert.ok(!names(r).includes("Sage green raised tilted slow feeder")); // 200 ml < 250 ml
assert.ok(!names(r).includes("Two-tone raised tilted flower slow feeder")); // 200 ml < 250 ml

// Large breed (23-45 kg) with an elbow height: the elbow rule decides, as for any dog, with the large-breed note beside
// it as a reference, and no raised bowl left out (owner 2026-11-20)
const { PRODUCTS: PL } = require("../bowlfit.js");
const rimOf = (n) => PL.find((p) => p.name === n).rimCm;
r = recommend({ species: "dog", elbow: 50, size: "large", cupsPerMeal: 2 });
assert.ok(!r.height.floor && r.height.minCm === 42.5 && r.height.maxCm === 50 && r.cautions.length === 1 && /^Height matters for large breeds/.test(r.cautions[0]));
assert.deepStrictEqual(r.height.sum, { elbow: "50 cm (19.7 in)", less: "7.5 cm (3 in)", low: "42.5 cm (16.7 in)" });
// 750 ml: the two 650 ml bowls first (the Pink Planet on its stand, the large plate), then the tallest; raised ones in
assert.deepStrictEqual(names(r), ["Large dog ceramic slow feeder Pink Planet style", "Pink or butter yellow ceramic slow feeder plate, large",
  "Pink raised tilted food bowl, waffle cone foot", "Lilac flower slow feeder on a pedestal", "Sage green raised tilted slow feeder"]);
assert.ok(r.products[0].specs.includes("About 7.5 cm (3 in) tall on its bamboo stand"));
// an elbow of 1 ft or less (28 cm) goes by the elbow too: 20.5 to 28 cm, raised bowls among the cards
r = recommend({ species: "dog", elbow: 28, size: "large", cupsPerMeal: 2 });
assert.deepStrictEqual([r.height.minCm, r.height.maxCm, !!r.height.floor, r.cautions.length], [20.5, 28, false, 1]);
assert.ok(names(r).some((n) => rimOf(n) > 5));
r = recommend({ species: "dog", elbow: 35, size: "large" });
assert.deepStrictEqual([r.height.minCm, r.height.maxCm], [27.5, 35]);   // the elbow rule, not cut at 1 ft
// a smaller meal: the tallest first, as every bowl is well under 42.5 cm
assert.deepStrictEqual(names(recommend({ species: "dog", elbow: 50, size: "large", cupsPerMeal: 0.5 })).slice(0, 3),
  ["Pink raised tilted food bowl, waffle cone foot", "Sage green raised tilted slow feeder", "Two-tone raised tilted flower slow feeder"]);
// Large breed without an elbow height: the bloat study's bands, on the floor or raised above 1 ft, never raised 1 ft or
// less (3.06 times the risk; above 1 ft was not significantly different). All our raised bowls are under 1 ft, so the
// flat plates; the Pink Planet's bamboo stand would put it under 1 ft, so its card is the plate alone and says so
r = recommend({ species: "dog", size: "large", cupsPerMeal: 2 });
assert.ok(r.height.floor && r.cautions.length === 1);
assert.deepStrictEqual(r.products.map((p) => [p.name, p.note]), [
  ["Large dog ceramic slow feeder Pink Planet style", "May fit without the stand, but the stand puts it under 1 ft (30.5 cm), the height linked to more bloat in large breeds, holds ~100 ml less than suggested."],
  ["Pink or butter yellow ceramic slow feeder plate, large", "Holds ~100 ml less than suggested."],
  ["Lilac flower ceramic slow feeder plate", "Holds ~440 ml less than suggested."]]);
assert.ok(r.products[0].specs.includes("3.5 cm (1.4 in) tall"));
// the bands, on made-up heights: the pedestal raised 20 cm (1 ft or less), sage raised 35 cm (above 1 ft). A large breed
// with no elbow keeps the floor and above 1 ft; a giant breed keeps up to 1 ft (giant breeds unchanged, owner
// 2026-11-20); a large breed with an elbow goes by the elbow, so the 20 cm pedestal can come in
{
  const ped = PL.find((p) => p.name === "Lilac flower slow feeder on a pedestal"), sage = PL.find((p) => p.name === "Sage green raised tilted slow feeder");
  const was = [ped.rimCm, sage.rimCm];
  ped.rimCm = 20; sage.rimCm = 35;
  const lg = names(recommend({ species: "dog", size: "large", cupsPerMeal: 0.2 }));
  const gi = names(recommend({ species: "dog", elbow: 60, size: "giant", cupsPerMeal: 0.2 }));
  const lgElbow = names(recommend({ species: "dog", elbow: 28, size: "large", cupsPerMeal: 0.2 }));
  ped.rimCm = was[0]; sage.rimCm = was[1];
  assert.ok(lg.includes(sage.name) && !lg.includes(ped.name), "large, no elbow: above 1 ft kept, 1 ft or less dropped " + lg);
  assert.ok(gi.includes(ped.name) && !gi.includes(sage.name), "giant: 1 ft or less kept, above 1 ft dropped " + gi);
  assert.ok(lgElbow.includes(ped.name), "large, elbow 28 cm: by the elbow, the 20 cm pedestal comes in " + lgElbow);
}
// when nothing else fits, the capacity gap is said gently: 1 cup for a cat x 1.5 = 400 ml, raised elbow
assert.ok(recommend({ species: "cat", elbow: 20, cupsPerMeal: 2 }).products.every((p) => /holds ~\d+ ml less than suggested/.test(p.note)));
assert.ok(recommend({ species: "dog" }).products[2].specs.includes("Holds about 650 ml"));   // an estimate says "about"

// Giant breed (over 45 kg): floor, or raised no higher than 1 ft (30.5 cm), even with a tall elbow
r = recommend({ species: "dog", elbow: 65, size: "giant" });
assert.ok(r.height.floor && r.height.maxCm === 30.5 && r.height.minCm === undefined && r.cautions.length === 1);
// no fast eating ticked, so a slow feeder is optional: the three best by the other numbers (the widest plates first for
// a giant breed), then two slow feeders as cards 4 and 5, five in all (owner 2026-11-20)
assert.deepStrictEqual(names(r), ["Large dog ceramic slow feeder Pink Planet style", "Pink or butter yellow ceramic slow feeder plate, large",
  "Lilac flower ceramic slow feeder plate", "Lilac flower slow feeder on a pedestal", "Sage green raised tilted slow feeder"]);

// Old flag largeBreed (size unknown): both cut-offs explained, no products
r = recommend({ species: "dog", elbow: 50, largeBreed: true });
assert.ok(r.height.floor && r.cautions.length === 1 && r.products.length === 3 && r.products.every((p) => /ceramic slow feeder/.test(p.name)));

// Inches: elbow 10 in = 25.4 cm -> 17.9 to 25.4 cm, too tall for our bowls
r = recommend({ species: "dog", unit: "in", elbow: 10, cupsPerMeal: 1 });
assert.deepStrictEqual([r.height.minCm, r.height.maxCm], [17.9, 25.4]);
assert.strictEqual(r.capacityMl, 400);               // 1 x 236.6 x 1.5 = 354.9 -> 400
// None fits, so the 3 closest, each saying how far off it is. The two 200 ml bowls can't hold one 237 ml meal, so they
// come after the bowls that can, whatever their height (owner 2026-11-20); then the closest: the tallest bowls first,
// the waffle cone ones (11.5 and 10 cm, about 350 ml), then the Pink Planet plate on its stand (about 7.5 cm, 650 ml)
// (then, a slow feeder being optional, two slow feeders as cards 4 and 5; the bowl has to be raised, so raised ones).
// The first two would both be waffle cone bowls, which aren't slow feeders, so the closest slow feeder, the Pink Planet
// plate on its stand, moves up to second place (owner 2026-11-20: at least one slow feeder in the first two)
assert.deepStrictEqual(names(r), ["Pink raised tilted food bowl, waffle cone foot", "Large dog ceramic slow feeder Pink Planet style", "Yellow raised water bowl, waffle cone foot",
  "Lilac flower slow feeder on a pedestal", "Sage green raised tilted slow feeder"]);
assert.ok(r.productNote.startsWith("The closest") && r.products[0].note === "A bit shorter than the suggested 17.9 cm (7 in), suggest using a stand about 7 to 13 cm (2.8 to 5.1 in) tall to increase the bowl height, holds ~50 ml less than suggested.");
assert.ok(r.products[1].specs.includes("About 7.5 cm (3 in) tall on its bamboo stand"));

// One big meal, 2.5 cups (592 ml): the 650 ml bowls hold it, so they come first, the bigger first and then the closest
// height: the Pink Planet plate on its stand, then the large line-and-dots plate, which holds more and gets its height
// from a stand (owner 2026-11-20); the rest can't hold one meal and follow
r = recommend({ species: "dog", unit: "cm", elbow: 30, cupsPerMeal: 2.5 });
assert.strictEqual(r.capacityMl, 900);               // 2.5 x 236.6 x 1.5 = 887.3 -> 900
assert.deepStrictEqual(names(r), ["Large dog ceramic slow feeder Pink Planet style", "Pink or butter yellow ceramic slow feeder plate, large", "Pink raised tilted food bowl, waffle cone foot",
  "Lilac flower slow feeder on a pedestal", "Sage green raised tilted slow feeder"]);
assert.deepStrictEqual(r.products[0].specs, ["21.6 cm (8.5 in) across", "About 7.5 cm (3 in) tall on its bamboo stand", "Holds about 650 ml"]);
assert.strictEqual(r.products[0].url, "https://www.etsy.com/listing/4614433467/pink-planet-ceramic-slow-feeder-dog-bowl?variation1=7406742080");
// the large plate shows the large plate, not the medium one, and opens the listing with Large picked (owner 2026-11-20)
assert.deepStrictEqual([r.products[1].img, r.products[1].url, r.products[1].specs],
  ["img/line-dots-plate-large.jpg", "https://www.etsy.com/listing/4517744488/ceramic-slow-feeder-cat-bowl-butter?variation1=6778088974",
   ["19.1 cm (7.5 in) across", "4 cm (1.6 in) tall", "Holds 650 ml"]]);
// a cat can't have the Pink Planet plate (made for dogs): the biggest of the rest first
assert.strictEqual(names(recommend({ species: "cat", unit: "cm", elbow: 15, cupsPerMeal: 2.5 }))[0], "Pink or butter yellow ceramic slow feeder plate, large");

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
// It re-ranks with every input. A low elbow keeps the two flat plates, and the closest other bowl fills the row to
// three, saying how far off it is (owner 2026-11-20: the best first, then 2 or 3 close ones):
r = recommend({ species: "cat", elbow: 6 });
assert.deepStrictEqual(names(r), ["Lilac flower ceramic slow feeder plate", "Butter yellow ceramic slow feeder plate, medium", "Lilac flower slow feeder on a pedestal",
  "Two-tone raised tilted flower slow feeder", "Sage green raised tilted slow feeder"]);
assert.deepStrictEqual(r.products.map((p) => p.note), ["", "", "A bit taller than the suggested 6 cm (2.4 in).", "A bit taller than the suggested 6 cm (2.4 in).", "A bit taller than the suggested 6 cm (2.4 in)."]);
// a higher elbow swaps in the raised ones (range 4.5 to 12 cm, the 3.5 and 4 cm plates are below it):
r = recommend({ species: "cat", elbow: 12 });
assert.strictEqual(r.productNote, MAY);
assert.deepStrictEqual(names(r), ["Lilac flower slow feeder on a pedestal", "Sage green raised tilted slow feeder", "Two-tone raised tilted flower slow feeder",
  "Butter yellow ceramic slow feeder plate, medium", "Lilac flower ceramic slow feeder plate"]);
// older or stiff: the higher rims first (the waffle cone food bowl 11.5, sage 11, two-tone 10.5 cm)
r = recommend({ species: "cat", elbow: 12, senior: true });
assert.deepStrictEqual(names(r), ["Pink raised tilted food bowl, waffle cone foot", "Sage green raised tilted slow feeder", "Two-tone raised tilted flower slow feeder",
  "Lilac flower slow feeder on a pedestal", "Butter yellow ceramic slow feeder plate, medium"]);
// a bigger meal drops the 200 ml bowls: 1 cup x 236.6 x 1.5 = 354.9 -> 400 ml; in 0 to 7 cm only the line-and-dots
// plate holds it, and of its two sizes the card shows the medium one, which is enough (one card per listing)
r = recommend({ species: "cat", elbow: 7, cupsPerMeal: 1 });
assert.deepStrictEqual(names(r), ["Butter yellow ceramic slow feeder plate, medium", "Lilac flower ceramic slow feeder plate", "Lilac flower slow feeder on a pedestal",
  "Two-tone raised tilted flower slow feeder", "Sage green raised tilted slow feeder"]);
assert.deepStrictEqual(r.products.map((p) => p.note), ["", "Holds ~90 ml less than suggested.", "A bit taller than the suggested 7 cm (2.8 in), holds ~90 ml less than suggested.",
  "A bit taller than the suggested 7 cm (2.8 in), holds ~200 ml less than suggested.", "A bit taller than the suggested 7 cm (2.8 in), holds ~200 ml less than suggested."]);
// and when nothing fits any more the wording changes to the closest ones
r = recommend({ species: "cat", elbow: 20 });
assert.ok(r.productNote.startsWith("The closest") && r.products.length === 5 && r.products.every((p) => p.note));
// Each bowl is a card: it links to its own Etsy listing and shows that listing's main photo (owner 2026-11-16)
const fs = require("fs"), path = require("path");
const { PRODUCTS } = require("../bowlfit.js");
PRODUCTS.forEach((p) => {
  assert.ok(/^https:\/\/www\.etsy\.com\/listing\/(\d{9,})\/[a-z0-9-]+(\?variation1=\d+)?$/.test(p.url), p.name + " url");
  assert.strictEqual(p.url.split("/")[4], String(p.listing), p.name + " listing");
  assert.ok(/^img\/[a-z0-9-]+\.jpg$/.test(p.img) && fs.statSync(path.join(__dirname, "..", p.img)).size > 5000, p.name + " img");
});
assert.strictEqual(new Set(PRODUCTS.map((p) => p.url)).size, PRODUCTS.length);
// every bowl we sell, every size (owner 2026-11-20: all variations, sold-out ones too)
assert.deepStrictEqual([...new Set(PRODUCTS.map((p) => p.listing))].sort(),
  [4504867658, 4517348136, 4517744488, 4517774070, 4517775646, 4517778769, 4533246949, 4614433467]);
// a size that looks different has its own photo; two listings never share a photo
PRODUCTS.forEach((p) => PRODUCTS.forEach((q) => { if (p.img === q.img) assert.strictEqual(p.listing, q.listing, p.name + " / " + q.name); }));
assert.notStrictEqual(PRODUCTS.find((p) => /medium$/.test(p.name)).img, PRODUCTS.find((p) => /large$/.test(p.name)).img);
// one card per listing, whatever the numbers
[{ species: "dog", unit: "cm", elbow: 30, cupsPerMeal: 2.5 }, { species: "cat", elbow: 6 }, { species: "dog", elbow: 65, size: "giant" },
 { species: "cat", elbow: 12, cupsPerMeal: 0.2 }, { species: "dog", unit: "in", elbow: 10, cupsPerMeal: 1 }].forEach((input) => {
  const urls = recommend(input).products.map((p) => p.url.split("?")[0]);
  assert.strictEqual(new Set(urls).size, urls.length, JSON.stringify(input));
});
r = recommend({ species: "cat", elbow: 12 });
assert.ok(r.products.length === 5 && r.products.every((p) => p.url && p.img));
assert.deepStrictEqual(r.products[0].specs, ["14.8 cm (5.8 in) across", "8.5 cm (3.3 in) tall", "Holds 310 ml"]);
assert.strictEqual(r.products[0].url, "https://www.etsy.com/listing/4533246949/lilac-elevated-slow-feeder-ceramic-pet");
// no result ever says "that fit"
[{ species: "cat" }, { species: "cat", elbow: 12 }, { species: "dog", elbow: 11, cupsPerMeal: 0.5 }, { species: "dog", elbow: 50, size: "large" }]
  .forEach((v) => assert.ok(!/that fit\b/.test(recommend(v).productNote)));
// Card notes are a gentle reference (owner 2026-11-19): "slightly" under 1 cm, otherwise "a bit", never "quite"
// (owner 2026-11-20), and a bowl over 5 cm shorter also says "suggest using a stand … to increase the bowl height", with the
// stand's height in it (owner 2026-11-20);
// an approximate "~" on capacity
r = recommend({ species: "dog", unit: "cm", elbow: 19.7, cupsPerMeal: 1 });
// (the 200 ml bowls can't hold this 237 ml meal, owner 2026-11-20, so the waffle cone bowls come first: the food bowl
// 0.7 cm short of 12.2 cm, the water bowl 2.2 cm; the closest slow feeder moves up between them, at least one slow
// feeder in the first two)
assert.deepStrictEqual([0, 2].map((i) => r.products[i].note), ["Slightly shorter than the suggested 12.2 cm (4.8 in), holds ~50 ml less than suggested.",
  "A bit shorter than the suggested 12.2 cm (4.8 in), holds ~50 ml less than suggested."]);
// elbow 19.2 cm: the low end is 11.7 cm, the 11.5 cm waffle cone food bowl is 0.2 cm short
assert.strictEqual(recommend({ species: "dog", unit: "cm", elbow: 19.2, cupsPerMeal: 0.25 }).products[0].note, "Slightly shorter than the suggested 11.7 cm (4.6 in).");
// elbow 19 cm: the low end is 11.5 cm, and that bowl is just that tall, so it may fit, with no note; two close ones follow
assert.deepStrictEqual(recommend({ species: "dog", unit: "cm", elbow: 19, cupsPerMeal: 0.25 }).products.slice(0, 3).map((p) => p.note),
  ["", "Slightly shorter than the suggested 11.5 cm (4.5 in).", "A bit shorter than the suggested 11.5 cm (4.5 in)."]);
assert.ok(r.products.every((p) => !/than the range|holds \d|\brim\b|quite/i.test(p.note)));   // no "rim" in a note (owner 2026-11-20)
// The slow feeder rule (owner 2026-11-20): when the result says "Optional" (no fast eating ticked), five cards: the
// three best by the other numbers, then the two closest slow feeders not shown yet as cards 4 and 5. When a slow feeder
// is worth trying, three cards, and the ones that aren't slow feeders drop back.
const { PRODUCTS: ALL } = require("../bowlfit.js");
const isSlow = (name) => ALL.find((p) => p.name === name).slow;
[{ species: "dog", unit: "cm", elbow: 30, cupsPerMeal: 2.5 }, { species: "dog", unit: "in", elbow: 10, cupsPerMeal: 1 }, { species: "cat", elbow: 12 },
 { species: "cat", elbow: 20 }, { species: "cat", unit: "cm", elbow: 15, cupsPerMeal: 2.5 }, { species: "dog", elbow: 65, size: "giant" }].forEach((input) => {
  r = recommend(input);
  assert.strictEqual(r.slowFeeder, false);
  assert.strictEqual(r.products.length, 5, JSON.stringify(input));
  assert.ok(names(r).slice(3).every(isSlow), JSON.stringify(input) + " cards 4 and 5 are slow feeders");
});
// the first three go by the other numbers alone, so they can be bowls that aren't slow feeders (the waffle cone bowls),
// but at least one of the first two is a slow feeder: the closest one moves up to second place (owner 2026-11-20)
assert.deepStrictEqual(names(recommend({ species: "dog", unit: "in", elbow: 10, cupsPerMeal: 1 })).slice(0, 3).map(isSlow), [false, true, false]);
// whatever is typed or ticked: a slow feeder among the first two cards, and three to five cards
const SWEEP = [];
["dog", "cat"].forEach((species) => [6, 9, 12, 15, 18, 19.7, 25, 30].forEach((elbow) => [0, 0.25, 0.82, 1, 2.5].forEach((cupsPerMeal) =>
  [{}, { fastEater: true }, { senior: true }, { regurgitates: true }, { flatFace: true }].forEach((extra) =>
    SWEEP.push(Object.assign({ species: species, unit: "cm", elbow: elbow }, cupsPerMeal ? { cupsPerMeal: cupsPerMeal } : {}, extra))))));
["large", "giant"].forEach((size) => [30, 50, 65].forEach((elbow) => [{}, { fastEater: true }].forEach((extra) =>
  SWEEP.push(Object.assign({ species: "dog", unit: "cm", elbow: elbow, size: size, cupsPerMeal: 2 }, extra)))));
SWEEP.forEach((input) => {
  const n = names(recommend(input));
  assert.ok(n.length >= 3 && n.length <= 5, JSON.stringify(input) + " " + n.length + " cards");
  assert.ok(isSlow(n[0]) || isSlow(n[1]), JSON.stringify(input) + " a slow feeder in the first two");
  assert.strictEqual(new Set(n.map((x) => ALL.find((p) => p.name === x).listing)).size, n.length, JSON.stringify(input) + " one card per listing");
});
// Every bowl tip names the Bowl line it is about, so the page can put that line's "*" there (owner 2026-11-20: not
// always on Slow feeder, "be contextually correct")
const ROW_OF = { "Older or stiff": "height", "A flat plate": "height", "Measure from the floor": "height", "Brings food back up": "height",
  "Short legs": "height", "Pick a dish": "width", "Optional: measure your cat's whisker": "holds", "Empty stomach": "holds",
  "A slow feeder": "slow", "Flat face": "tilted", "Long ears": "tilted" };
const EVERY_TICK = [{}, { fastEater: true }, { senior: true }, { regurgitates: true }, { flatFace: true }, { longEars: true }, { emptyStomach: true }, { shortLegs: true },
  { fastEater: true, senior: true, regurgitates: true, emptyStomach: true, flatFace: true, longEars: true }];
["dog", "cat"].forEach((species) => [0, 12, 19.7, 40].forEach((elbow) => [0, 13].forEach((whisker) => ["", "small", "large", "giant"].forEach((size) =>
  EVERY_TICK.forEach((extra) => {
    const input = Object.assign({ species: species, unit: "cm", weight: species === "dog" ? 20 : 4, cupsPerMeal: 1 }, elbow ? { elbow: elbow } : {}, whisker ? { whisker: whisker } : {},
      size && species === "dog" ? { size: size } : {}, extra), rr = recommend(input);
    rr.tips.filter((t) => rr.nutritionTips.indexOf(t) < 0).forEach((t) => {
      const want = Object.keys(ROW_OF).find((k) => t.indexOf(k) === 0);
      assert.ok(want, "a tip with no line: " + t);
      assert.strictEqual(rr.tipRows[t], ROW_OF[want], JSON.stringify(input) + " " + t);
    });
  })))));
// A large dog that brings food back up: the megaesophagus sentence is the one shown in bold (owner 2026-11-20)
r = recommend({ species: "dog", unit: "cm", weight: 32, size: "large", regurgitates: true, cupsPerMeal: 2 });
assert.deepStrictEqual(r.tipStrong, ["If it's megaesophagus (a widened food pipe), vet guides advise a raised bowl so gravity helps food reach the stomach."]);
assert.ok(r.tips.some((t) => t.indexOf(r.tipStrong[0]) > 0));
assert.deepStrictEqual(recommend({ species: "dog", unit: "cm", weight: 8, elbow: 20, regurgitates: true, cupsPerMeal: 1 }).tipStrong, []);   // a small dog: no such sentence
r = recommend({ species: "dog", unit: "cm", weight: 18, elbow: 27, senior: true, cupsPerMeal: 1 });   // her case: older, nothing about eating fast
assert.deepStrictEqual(r.tips.filter((t) => r.nutritionTips.indexOf(t) < 0).map((t) => r.tipRows[t]), ["height"]);
r = recommend({ species: "cat", elbow: 20, fastEater: true });
assert.ok(r.slowFeeder && r.products.length === 3 && names(r).every(isSlow));
// A slow feeder worth trying: every card is a slow feeder, the waffle cone food and water bowls never show (owner
// 2026-11-20), whatever else was typed, even when they would be the closest
[{ species: "dog", unit: "in", elbow: 10, cupsPerMeal: 1 }, { species: "cat", elbow: 12 }, { species: "cat", elbow: 12, senior: true },
 { species: "dog", unit: "cm", elbow: 19.7, cupsPerMeal: 2.5 }, { species: "cat", elbow: 6 }, { species: "dog", elbow: 65, size: "giant" },
 { species: "cat", elbow: 12, flatFace: true }, { species: "dog", unit: "cm", elbow: 19, cupsPerMeal: 0.25 }].forEach((input) => {
  const without = names(recommend(input)), withFast = names(recommend(Object.assign({}, input, { fastEater: true })));
  assert.ok(withFast.length > 0 && withFast.every(isSlow), JSON.stringify(input));
  assert.ok(!withFast.some((n) => /waffle/.test(n)), JSON.stringify(input));
  if (input.elbow === 12 && input.senior) assert.ok(without.some((n) => /waffle/.test(n)));   // they do show when it's optional
});
// Raised first (owner 2026-11-20): when the suggested height starts above 5 cm, a plate on the floor can't reach it, so
// wherever slow feeders are picked, the raised ones (on a foot, or on their own stand) come before the flat ones.
const RAISED = (name, input) => { const p = ALL.filter((x) => x.name === name); return p.some((x) => x.rimCm > 5); };
// optional: cards 4 and 5 are the closest raised slow feeders, never a flat plate while a raised one is left (her
// screenshot: the example at 1 meal had the flat lilac plate as card 5)
r = recommend({ species: "dog", unit: "cm", elbow: 19.7, cupsPerMeal: 2.5 });
assert.deepStrictEqual(names(r).slice(3), ["Lilac flower slow feeder on a pedestal", "Sage green raised tilted slow feeder"]);
assert.ok(names(r).slice(3).every((n) => RAISED(n)));
// no raised bowl needed (a cat, elbow 7: 0 to 7 cm): cards 4 and 5 go by how close they are, flat or not
assert.deepStrictEqual(names(recommend({ species: "cat", elbow: 6 })).slice(3), ["Two-tone raised tilted flower slow feeder", "Sage green raised tilted slow feeder"]);
// raised ones run out (a cat, elbow 20: the three raised slow feeders a cat can have are shown already): then the flat
// ones, the closest first
assert.deepStrictEqual(names(recommend({ species: "cat", elbow: 20 })).slice(3), ["Lilac flower slow feeder on a pedestal", "Butter yellow ceramic slow feeder plate, medium"]);
// worth trying, a raised bowl needed: slow feeders only, the raised ones first on everything together, so the large flat
// plate gives way to the raised pedestal and sage even though it holds more
r = recommend({ species: "dog", unit: "cm", elbow: 19.7, cupsPerMeal: 2.5, fastEater: true });
assert.deepStrictEqual(names(r), ["Large dog ceramic slow feeder Pink Planet style", "Lilac flower slow feeder on a pedestal", "Sage green raised tilted slow feeder"]);
assert.ok(r.products[0].specs.includes("About 7.5 cm (3 in) tall on its bamboo stand"));
// the example's numbers (3 meals, eats very fast): sage, two-tone, and the Pink Planet plate on its stand
assert.deepStrictEqual(names(recommend({ species: "dog", unit: "cm", elbow: 19.7, cupsPerMeal: 0.82, fastEater: true })),
  ["Sage green raised tilted slow feeder", "Two-tone raised tilted flower slow feeder", "Large dog ceramic slow feeder Pink Planet style"]);
// worth trying with fewer than three slow feeders to show: the closest bowls that aren't fill the row to three, saying
// so (owner 2026-11-20). Our shop always has three; try it with all but two of them taken as not slow feeders.
const keep = ALL.map((p) => p.slow);
ALL.forEach((p) => { if (!/Sage|Two-tone/.test(p.name)) p.slow = false; });
r = recommend({ species: "cat", elbow: 12, fastEater: true });
assert.deepStrictEqual([r.products.length, r.products.slice(0, 2).map((p) => p.note), /not a slow feeder\.$/i.test(r.products[2].note)], [3, ["", ""], true]);
ALL.forEach((p, i) => { p.slow = keep[i]; });
assert.ok(recommend({ species: "cat", elbow: 12, fastEater: true }).products.every((p) => !/not a slow feeder/i.test(p.note)));
// A bowl sold with or without its stand (the Pink Planet plate): the note says which one it is about and how the
// other compares, in a few words (owner 2026-11-20)
const note = (input) => recommend(input).products.find((p) => /Pink Planet/.test(p.name)).note;
// both shorter: the card is the plate on its stand
assert.strictEqual(note({ species: "dog", unit: "cm", elbow: 19.7, cupsPerMeal: 2.5 }),
  "A bit shorter than the suggested 12.2 cm (4.8 in) with the stand, even shorter without it, holds ~250 ml less than suggested.");
// the stand version may fit, the plate alone is short
assert.strictEqual(note({ species: "dog", unit: "cm", elbow: 12, cupsPerMeal: 2 }),
  "May fit with the stand, a bit shorter than the suggested 4.5 cm (1.8 in) without it, holds ~100 ml less than suggested.");
// the plate alone may fit, the stand makes it too tall
assert.strictEqual(note({ species: "dog", unit: "cm", elbow: 6, cupsPerMeal: 2 }),
  "May fit without the stand, a bit taller than the suggested 6 cm (2.4 in) with it, holds ~100 ml less than suggested.");
// more than 5 cm short even on the stand: her words, ", suggest using a stand … to increase the bowl height", with how tall
assert.strictEqual(note({ species: "dog", unit: "cm", elbow: 30, cupsPerMeal: 2.5 }),
  "A bit shorter than the suggested 22.5 cm (8.9 in) with the stand, even shorter without it, suggest using a stand about 15 to 22 cm (5.9 to 8.7 in) tall to increase the bowl height, holds ~250 ml less than suggested.");
// both in the range: no height note
assert.ok(!/stand|shorter|taller/.test(recommend({ species: "dog", unit: "cm", elbow: 9, cupsPerMeal: 2 }).products.find((p) => /Pink Planet/.test(p.name)).note));
// bowls without a stand option never mention one, except the "suggest using a stand" tip
recommend({ species: "dog", unit: "cm", elbow: 19.7, cupsPerMeal: 2.5 }).products.filter((p) => !/Pink Planet/.test(p.name))
  .forEach((p) => assert.ok(!/with the stand|without the stand|with it|without it/.test(p.note), p.name));
// A flat slow feeder can still be suggested when the bowl has to be raised: its note says how tall a stand would make it
// fit (owner 2026-11-20). The stand is the range
// minus the plate's height, in whole cm, rounded inwards: 12.2 to 19.7 cm with a 4 cm plate is 8.2 to 15.7, so 9 to 15.
const noteOf = (input, name) => recommend(input).products.find((p) => p.name === name).note;
assert.strictEqual(noteOf({ species: "dog", unit: "cm", elbow: 19.7, cupsPerMeal: 2.5 }, "Pink or butter yellow ceramic slow feeder plate, large"),
  "A bit shorter than the suggested 12.2 cm (4.8 in), suggest using a stand about 9 to 15 cm (3.5 to 5.9 in) tall to increase the bowl height, holds ~250 ml less than suggested.");
// only a little raising needed (elbow 14 cm: 6.5 to 14 cm): a flat plate 2.5 cm short still gets the stand, 3 to 10 cm
assert.strictEqual(noteOf({ species: "dog", unit: "cm", elbow: 14, cupsPerMeal: 0.5 }, "Butter yellow ceramic slow feeder plate, medium"),
  "A bit shorter than the suggested 6.5 cm (2.6 in), suggest using a stand about 3 to 10 cm (1.2 to 3.9 in) tall to increase the bowl height.");
// a raised bowl a few cm short doesn't get a stand tip (the pedestal, 3.7 cm short of 12.2 cm)
assert.ok(!/stand/.test(noteOf({ species: "dog", unit: "cm", elbow: 19.7, cupsPerMeal: 2.5 }, "Lilac flower slow feeder on a pedestal")));
// no raising needed (elbow 9 cm: 1.5 to 9 cm): flat plates may fit as they are, no stand anywhere, and they can be
// cards 4 and 5 (raised ones only come first when raising helps)
r = recommend({ species: "dog", unit: "cm", elbow: 9, cupsPerMeal: 0.5 });
assert.ok(r.products.every((p) => !/stand about/.test(p.note)));
assert.ok(r.products.some((p, i) => i >= 3 && ALL.find((x) => x.name === p.name && x.rimCm <= 5)));
// a large breed with an elbow height goes by the elbow, so its too-short bowls get the stand tip like any dog's
// (42.5 to 50 cm, the 4 cm plate needs about 39 to 46 cm); without an elbow height there's no range, so no stand tip
r = recommend({ species: "dog", elbow: 50, size: "large", cupsPerMeal: 2 });
assert.ok(/suggest using a stand about 39 to 46 cm \(15.4 to 18.1 in\) tall to increase the bowl height/.test(r.products[1].note));
assert.ok(recommend({ species: "dog", size: "large", cupsPerMeal: 2 }).products.every((p) => !/stand about/.test(p.note)));
// a dog that needs the height right (brings food back up, elbow 15 cm: 7.5 to 15 cm): the Pink Planet plate on its own
// stand may fit and comes first, and the flat plate after it says which stand would do (owner 2026-11-20)
r = recommend({ species: "dog", unit: "cm", elbow: 15, cupsPerMeal: 1.5, regurgitates: true });
assert.deepStrictEqual([r.products[0].note, r.products[1].note], ["May fit with the stand, a bit shorter than the suggested 7.5 cm (3 in) without it.",
  "A bit shorter than the suggested 7.5 cm (3 in), suggest using a stand about 4 to 11 cm (1.6 to 4.3 in) tall to increase the bowl height."]);
assert.ok(r.products[0].specs.includes("About 7.5 cm (3 in) tall on its bamboo stand"));
// The photo rule (owner 2026-11-20): an option's card shows the bowl's own photo, except a different size, which shows
// that size's photo, and a different height from an add-on the bowl's photo doesn't already show.
const { BOWLS, optionPhoto } = require("../bowlfit.js");
BOWLS.forEach((b) => (b.options || []).forEach((o) => {
  const p = ALL.find((x) => x.url === b.url + "?variation1=" + o.pick);
  const size = (o.widthCm !== undefined && o.widthCm !== b.widthCm) || (o.ml !== undefined && o.ml !== b.ml);
  const height = o.rimCm !== undefined && o.rimCm !== b.rimCm && o.adds !== b.shows;
  assert.ok(p, b.name + " option");
  if (size || height) assert.ok(o.img && p.img === o.img && p.img !== b.img, p.name + ": its own photo");
  else assert.strictEqual(p.img, b.img, p.name + ": the bowl's photo");
}));
const base = { widthCm: 15, rimCm: 4, ml: 400, img: "img/a.jpg", shows: "stand" };
assert.strictEqual(optionPhoto(base, { widthCm: 19, ml: 650, img: "img/b.jpg" }), "img/b.jpg");   // a bigger size: its own photo
assert.strictEqual(optionPhoto(base, { colour: "pink", img: "img/c.jpg" }), "img/a.jpg");        // a colour: the bowl's photo, even if one is set
assert.strictEqual(optionPhoto(base, { adds: "stand", rimCm: 8, img: "img/d.jpg" }), "img/a.jpg"); // a stand the photo shows: the bowl's photo
assert.strictEqual(optionPhoto({ widthCm: 15, rimCm: 4, ml: 400, img: "img/a.jpg" }, { adds: "stand", rimCm: 8, img: "img/d.jpg" }), "img/d.jpg"); // a stand it doesn't show
// the Pink Planet plate on its stand keeps the photo picked for it, the Rough Collie eating from it on the stand
assert.strictEqual(ALL.find((p) => /variation1=7406742080$/.test(p.url)).img, "img/pink-planet-plate.jpg");
assert.strictEqual(ALL.find((p) => /variation1=6778088974$/.test(p.url)).img, "img/line-dots-plate-large.jpg");
// A flat face or long ears (owner 2026-11-20): the result says a tilted bowl is worth trying, in a row of its own, only
// then, and our tilted bowls come first in the cards (sage, two-tone and the waffle cone food bowl)
const TILTED = (n) => ALL.find((p) => p.name === n).tilted;
assert.strictEqual(recommend({ species: "cat", elbow: 12 }).tilted, false);
assert.strictEqual(recommend({ species: "cat", elbow: 12, flatFace: true }).tilted, true);
assert.strictEqual(recommend({ species: "dog", elbow: 20, longEars: true }).tilted, true);
assert.strictEqual(recommend({ species: "cat", elbow: 12, longEars: true }).tilted, false);   // long ears is a dog's box
[{ species: "cat", elbow: 12, flatFace: true, cupsPerMeal: 0.33 }, { species: "dog", unit: "cm", elbow: 19.7, cupsPerMeal: 0.82, longEars: true },
 { species: "dog", unit: "cm", elbow: 19.7, cupsPerMeal: 2.5, longEars: true }, { species: "dog", unit: "cm", elbow: 9, flatFace: true }].forEach((input) => {
  const n = names(recommend(input));
  const k = n.filter(TILTED).length;
  assert.ok(n.slice(0, k).every(TILTED) && k >= 2, JSON.stringify(input) + " tilted first " + n);
});
// eats very fast too: slow feeders only, the tilted slow feeders first
assert.deepStrictEqual(names(recommend({ species: "dog", unit: "cm", elbow: 19.7, cupsPerMeal: 0.82, longEars: true, fastEater: true })).slice(0, 2),
  ["Sage green raised tilted slow feeder", "Two-tone raised tilted flower slow feeder"]);
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

// The takeaway under "Eats now" (owner 2026-11-21): what the pet eats against what it needs, "increase", "reduce" or
// "keep", within about 10% counting as keep (Today's Veterinary Nurse, Olson 2022: amounts adjusted in steps of about 10%)
{
  const base = { species: "dog", unit: "cm", stage: "neutered", activity: "usual", mealsPerDay: "3", size: "small", weight: "7.5" };
  // 7.5 kg neutered: 1.6 x 70 x 7.5^0.75 = 508 kcal; 0.35 cup x 452 kcal x 3 = 475 kcal, 94%: keep, the amount a meal kept
  let t = recommend(Object.assign({}, base, { foods: [{ id: "purina-pro-plan-small-breed-chicken-rice-dry", amount: "0.35", unit: "cups" }] })).takeaway;
  assert.deepStrictEqual([t.status, t.fed, t.kcalHi, t.unit, t.now], ["keep", 475, 508, "cups", 0.35]);
  // working on weight loss: the target is 60% of the calories a day (Merck), 1.3 cups twice a day of 369 kcal is far above
  t = recommend({ species: "dog", unit: "cm", stage: "neutered", activity: "low", mealsPerDay: "2", size: "medium", weight: "22.5", conditions: ["overweight"],
    foods: [{ id: "purina-one-lamb-rice-dry", amount: "1.3", unit: "cups" }] }).takeaway;
  assert.deepStrictEqual([t.status, t.loss, t.kcalLo, t.kcalHi, t.mealLo, t.mealHi], ["reduce", true, 521, 607, 0.71, 0.82]);
  // two foods: no single amount, so calories a day; 531 of 671 kcal (79%) is more than 10% under: increase
  t = recommend({ species: "dog", unit: "cm", stage: "intact", activity: "usual", mealsPerDay: "3", weight: "9.3",
    foods: [{ id: "hills-pd-id-low-fat-can-dog", amount: "180", unit: "g" }, { id: "jffd-turkey-whole-wheat-macaroni", amount: "10", unit: "g" }] }).takeaway;
  assert.deepStrictEqual([t.status, t.fed, t.kcalHi, t.unit], ["increase", 531, 671, undefined]);
  // the 10% edges: 90% of the target is still keep, under it is increase; 110% is keep, over it is reduce
  const at = (kcal) => recommend(Object.assign({}, base, { mealsPerDay: "1", foods: [{ id: "any-dry", amount: String(kcal / 400), unit: "cups" }], labelKcal: "400" })).takeaway.status;
  assert.deepStrictEqual([at(508 * 0.9 + 1), at(508 * 0.9 - 2), at(508 * 1.1 - 1), at(508 * 1.1 + 2)], ["keep", "increase", "keep", "reduce"]);
  // nothing to compare without a weight or without amounts
  assert.strictEqual(recommend(Object.assign({}, base, { weight: "", foods: [{ id: "any-dry", amount: "0.5", unit: "cups" }], labelKcal: "400" })).takeaway, undefined);
  assert.strictEqual(recommend(Object.assign({}, base, { foods: [{ id: "any-dry", amount: "", unit: "cups" }], labelKcal: "400" })).takeaway, undefined);
}
console.log("takeaway tests passed");

// Meals a day advice (owner 2026-11-21): by age, a large or giant dog on one meal, weight loss on one meal; each on
// Holds at least ("holds"), with its sources; none for healthy adults
{
  const meal = (inp) => { const r = recommend(inp); const t = r.tips.filter((x) => /^(Puppy|Kitten|One meal a day|Weight loss: split)/.test(x)); return { t, rows: t.map((x) => r.tipRows[x]), src: r.tipSources }; };
  let m = meal({ species: "dog", weight: 5, stage: "young", mealsPerDay: 2 });
  assert.deepStrictEqual(m.t, ["Puppy: 3 meals a day until about 6 months, then 2 until 12 months; small breeds may need more than 3."]);
  assert.deepStrictEqual([m.rows, m.src[m.t[0]]], [["holds"], ["merck-feeding"]]);
  assert.deepStrictEqual(recommend({ species: "dog", weight: 5, stage: "young", mealsPerDay: 2 }).tipAlso[m.t[0]], ["food", "eats"]);   // its "*" after "in N meals" and on Eats now too (owner 2026-11-21)
  m = meal({ species: "cat", weight: 1.5, stage: "young", mealsPerDay: 4 });
  assert.deepStrictEqual([m.t, m.rows, m.src[m.t[0]]], [["Kitten: 3 meals a day until 6 months, then 2 until a year."], ["holds"], ["cornell-cat-meals"]]);
  m = meal({ species: "dog", weight: 32, stage: "intact", size: "large", mealsPerDay: 1 });
  assert.strictEqual(m.t.length, 1); assert.ok(/^One meal a day: for a large or giant dog, vets advise 2 or more smaller meals instead\. In a study of breeds at risk of bloat/.test(m.t[0]));
  assert.deepStrictEqual([m.src["One meal a day: for a large or giant dog, vets advise 2 or more smaller meals instead."], m.src["In a study of breeds at risk of bloat, the risk rose with the size of each meal and was highest with one large meal a day."]], [["merck-gdv"], ["raghavan"]]);
  assert.strictEqual(meal({ species: "dog", weight: 60, stage: "neutered", size: "giant", mealsPerDay: 1 }).t.length, 1);
  assert.strictEqual(meal({ species: "dog", weight: 32, stage: "intact", size: "large", mealsPerDay: 2 }).t.length, 0);   // 2 meals: nothing to add
  assert.strictEqual(meal({ species: "dog", weight: 8, stage: "neutered", size: "small", mealsPerDay: 1 }).t.length, 0);   // a small adult: once a day is fine
  assert.strictEqual(meal({ species: "cat", weight: 4, stage: "neutered", mealsPerDay: 1 }).t.length, 0);   // an adult cat: once or twice is fine
  m = meal({ species: "dog", weight: 22.5, stage: "neutered", size: "medium", mealsPerDay: 1, conditions: ["overweight"] });
  assert.deepStrictEqual([m.t, m.src[m.t[0]]], [["Weight loss: split the day's food into 2 or more meals rather than one large one."], ["merck-obesity"]]);
  m = meal({ species: "cat", weight: 6, stage: "neutered", mealsPerDay: 1, conditions: ["overweight"] });
  assert.deepStrictEqual([m.t, m.src["In cats, 6 meals a day didn't speed weight loss compared with 2."]], [["Weight loss: split the day's food into 2 or more meals rather than one large one. In cats, 6 meals a day didn't speed weight loss compared with 2."], ["witzel"]]);
  assert.strictEqual(meal({ species: "dog", weight: 22.5, stage: "neutered", size: "medium", mealsPerDay: 2, conditions: ["overweight"] }).t.length, 0);
  m = meal({ species: "dog", weight: 32, stage: "neutered", size: "large", mealsPerDay: 1, conditions: ["overweight"] });   // one tip, not two saying the same
  assert.deepStrictEqual(m.t.map((x) => x.slice(0, 14)), ["One meal a day"]);
  m = meal({ species: "dog", weight: 20, stage: "young", size: "large", mealsPerDay: 1 });   // a puppy gets the puppy advice
  assert.deepStrictEqual(m.t.map((x) => x.slice(0, 6)), ["Puppy:"]);
}
console.log("meal advice tests passed");

// Food a day for two or more foods (owner 2026-11-21): the typed mix scaled to the calories a day
{
  const exDog = { species: "dog", unit: "cm", weight: 9.3, stage: "intact", activity: "usual", mealsPerDay: 3,
    foods: [{ id: "hills-pd-id-low-fat-can-dog", amount: "180", unit: "g" }, { id: "jffd-turkey-whole-wheat-macaroni", amount: "10", unit: "g" }] };
  let mix = recommend(exDog).feeding.mix;
  assert.deepStrictEqual(mix.map((m) => [m.id, m.dayLo, m.dayHi, m.mealHi, m.unitName]), [["hills-pd-id-low-fat-can-dog", 682, 682, 227, "g"], ["jffd-turkey-whole-wheat-macaroni", 38, 38, 13, "g"]]);
  assert.strictEqual(recommend(exDog).feeding.unit, undefined);   // not the one-food line
  mix = recommend(Object.assign({}, exDog, { stage: "neutered", activity: "low" })).feeding.mix;   // a range of calories: a range of amounts
  // 447 to 522 kcal, the numbers the page shows; one meal as typed is 177.07 kcal: 180 g x 447 / 177.07 = 454 g ... 531 g
  assert.deepStrictEqual(mix.map((m) => [m.dayLo, m.dayHi]), [[454, 531], [25, 29]]);
  assert.strictEqual(recommend(Object.assign({}, exDog, { foods: [exDog.foods[0], { id: exDog.foods[1].id, amount: "", unit: "g" }] })).feeding.mix, undefined);   // an amount missing: no mix
  assert.strictEqual(recommend(Object.assign({}, exDog, { foods: [exDog.foods[0], { id: "any-dry", amount: "0.2", unit: "cups" }] })).feeding.mix, undefined);   // calories unknown: no mix
  assert.ok(recommend(Object.assign({}, exDog, { foods: [exDog.foods[0]] })).feeding.unit);   // one food: the one-food line as before
}
console.log("mixed food a day tests passed");

// Food a day is a recommendation (owner 2026-11-21): the weight-loss calories when losing weight, the meals advised
{
  const tux = { species: "cat", unit: "cm", weight: 6.4, stage: "neutered", activity: "low", mealsPerDay: 1, elbow: 13, whisker: 14, fastEater: true, conditions: ["overweight"],
    foods: [{ id: "purina-cat-chow-complete", amount: "1", unit: "cups" }] };
  let f = recommend(tux).feeding;
  assert.deepStrictEqual([f.lossLo, f.dayLo, f.dayHi, f.meals, f.mealsRec], [197, 0.48, 0.48, 1, 2]);   // 197 kcal / 411 a cup, in 2 meals
  f = recommend(Object.assign({}, tux, { conditions: [] })).feeding;   // not losing weight: the calories a day, the meals typed
  assert.deepStrictEqual([f.dayLo, f.mealsRec], [0.69, undefined]);
  f = recommend({ species: "dog", unit: "cm", weight: 32, stage: "intact", activity: "usual", mealsPerDay: 1, size: "large", foods: [{ id: "purina-pro-plan-sensitive-salmon-rice-dry", amount: "3.75", unit: "cups" }] }).feeding;
  assert.strictEqual(f.mealsRec, 2);   // a large dog on 1 meal: 2 advised
  f = recommend({ species: "cat", unit: "cm", weight: 2, stage: "young", activity: "usual", mealsPerDay: 2, labelKcal: "420", foods: [{ id: "any-dry", amount: "0.2", unit: "cups" }] }).feeding;
  assert.strictEqual(f.mealsRec, 3);   // a kitten on 2 meals: 3 advised
  f = recommend({ species: "cat", unit: "cm", weight: 2, stage: "young", activity: "usual", mealsPerDay: 4, labelKcal: "420", foods: [{ id: "any-dry", amount: "0.2", unit: "cups" }] }).feeding;
  assert.strictEqual(f.mealsRec, undefined);   // already 4: as typed
  // Food a day goes by the number on the "To lose weight" line when that line shows, else by the number on the "Calories
  // a day" line (owner 2026-11-21), the numbers as shown: the border collie, 521 to 607 kcal / 369 a cup = 1.41 to 1.64
  const bc = { species: "dog", unit: "cm", weight: 22.5, stage: "neutered", activity: "low", senior: true, mealsPerDay: 2, size: "medium", conditions: ["overweight"],
    foods: [{ id: "purina-one-lamb-rice-dry", amount: "1.3", unit: "cups" }] };
  f = recommend(bc).feeding;
  assert.deepStrictEqual([f.kcalLo, f.kcalHi, f.lossLo, f.lossHi, f.dayLo, f.dayHi], [868, 1012, 521, 607, 1.41, 1.64]);
  f = recommend(Object.assign({}, bc, { conditions: [] })).feeding;   // no "To lose weight" line: 868 to 1012 / 369 = 2.35 to 2.74
  assert.deepStrictEqual([f.lossLo, f.dayLo, f.dayHi], [undefined, 2.35, 2.74]);
  // and for any pet and food, Food a day = the number shown / the food's calories, and the same numbers as Eats now's target
  [bc, Object.assign({}, bc, { conditions: [] }), tux, Object.assign({}, tux, { conditions: [] }), Object.assign({}, bc, { weight: 31.7 }), Object.assign({}, tux, { weight: 5.1, species: "cat" })].forEach((p) => {
    const r = recommend(p), fd = r.feeding, lo = fd.lossLo || fd.kcalLo, hi = fd.lossHi || fd.kcalHi, per = p.species === "cat" ? 411 : 369;
    assert.deepStrictEqual([fd.dayLo, fd.dayHi, r.takeaway.kcalLo, r.takeaway.kcalHi], [Math.round(lo / per * 100) / 100, Math.round(hi / per * 100) / 100, lo, hi]);
  });
  // Working on weight loss, the bowl goes by the recommendation (owner 2026-11-21): one meal of Food a day, its high end
  // as shown / the meals Food a day gives, with any water or broth typed for a meal; what it eats now stays as typed
  let r = recommend(tux);   // 0.48 cups / 2 = 0.24 cup = 56.8 ml, x 2 for a slow feeder = 113.6, so 150 ml
  assert.deepStrictEqual([r.mealMl, r.capacityMl, r.mealRec, r.fedKcalDay], [56.8, 150, true, 411]);
  r = recommend(Object.assign({}, tux, { conditions: [] }));   // not losing weight: the 1 cup typed, 236.6 x 2 = 473.2, so 500
  assert.deepStrictEqual([r.mealMl, r.capacityMl, r.mealRec], [236.6, 500, undefined]);
  r = recommend(Object.assign({}, tux, { foods: [{ id: "purina-cat-chow-complete", amount: "", unit: "cups" }] }));   // no amount typed: the same
  assert.deepStrictEqual([r.mealMl, r.capacityMl], [56.8, 150]);
  r = recommend(bc);   // 1.64 cups / 2 = 0.82 cup = 194 ml, x 1.5 = 291, so 300 ml (from the 1.3 cups typed it was 500)
  assert.deepStrictEqual([r.mealMl, r.capacityMl, r.fedKcalDay], [194, 300, 959]);
  assert.deepStrictEqual(recommend(Object.assign({}, bc, { conditions: [] })).capacityMl, 500);
  const exDogLoss = { species: "dog", unit: "cm", weight: 9.3, stage: "intact", activity: "usual", mealsPerDay: 3, fastEater: true, conditions: ["overweight"],
    foods: [{ id: "hills-pd-id-low-fat-can-dog", amount: "180", unit: "g" }, { id: "jffd-turkey-whole-wheat-macaroni", amount: "10", unit: "g" }] };
  r = recommend(exDogLoss);   // two foods: 410 g + 23 g a day / 3 meals = 136.7 ml + 10.3 ml = 146.9 ml, x 2 = 293.9, so 300 ml
  assert.deepStrictEqual([r.feeding.lossHi, r.feeding.mix.map((m) => m.dayHi), r.mealMl, r.capacityMl], [403, [410, 23], 146.9, 300]);
  r = recommend(Object.assign({}, exDogLoss, { foods: exDogLoss.foods.concat([{ id: "water", amount: "60", unit: "g" }]) }));   // 60 ml of water a meal stays in
  assert.deepStrictEqual([r.mealMl, r.capacityMl], [206.9, 450]);
  // and when the meals advised differ from the meals typed (owner 2026-11-21): a large dog with its whole day, 3.75 cups,
  // in 1 meal: 3.78 cups / 2 = 1.89 cups = 447.2 ml, x 1.5 = 670.8, so 700 ml (from the 3.75 cups typed it was 1350)
  const bigDog = { species: "dog", unit: "cm", weight: 32, stage: "intact", activity: "usual", mealsPerDay: 1, size: "large", foods: [{ id: "purina-pro-plan-sensitive-salmon-rice-dry", amount: "3.75", unit: "cups" }] };
  r = recommend(bigDog);
  assert.deepStrictEqual([r.feeding.dayHi, r.feeding.mealsRec, r.mealMl, r.capacityMl, r.mealRec], [3.78, 2, 447.2, 700, true]);
  assert.strictEqual(recommend(Object.assign({}, bigDog, { mealsPerDay: 2 })).capacityMl, 1350);   // 2 meals as advised: what is typed, 3.75 cups a meal
  // a kitten on 2 meals: 0.84 cups / 3 = 0.28 cup = 66.2 ml, x 2 for a slow feeder = 132.5, so 150 ml (the 0.2 cup typed: 100)
  const kit2 = { species: "cat", unit: "cm", weight: 2, stage: "young", activity: "usual", mealsPerDay: 2, labelKcal: "420", fastEater: true, foods: [{ id: "any-dry", amount: "0.2", unit: "cups" }] };
  r = recommend(kit2);
  assert.deepStrictEqual([r.feeding.dayHi, r.feeding.mealsRec, r.mealMl, r.capacityMl], [0.84, 3, 66.2, 150]);
  r = recommend(Object.assign({}, kit2, { mealsPerDay: 4 }));   // already 4 meals, nothing to follow: what is typed
  assert.deepStrictEqual([r.mealMl, r.capacityMl, r.mealRec], [47.3, 100, undefined]);
}
console.log("food a day recommendation tests passed");
