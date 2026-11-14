/* dietmath.js: diet arithmetic for dogs on a vet-prescribed low-fat and/or copper-restricted diet.
   Made by PawsOnMePet (https://www.etsy.com/shop/PawsOnMePet). MIT License. Not veterinary advice. */
(function (root) {
  "use strict";
  // Fat lines are grams per 1000 kcal. Copper lines are milligrams per 1000 kcal. g vs mg: 1000x apart.
  var LINES = {
    fatMaxPer1000: 24,   // Today's Veterinary Practice, Nutritional Management of Hyperlipidemia (about 20% of calories)
    fatMinPer1000: 13.8, // AAFCO adult maintenance minimum: 5.5% of dry matter at 4,000 kcal/kg dry matter
    copper: [
      { line: "Treatment target, copper-associated hepatopathy", mgPer1000kcal: "< 1.2", ppmDM: "about 4.8", source: "Today's Veterinary Practice 2025" },
      { line: "Prescription liver diets, measured", mgPer1000kcal: "1.2 to 1.3", ppmDM: "3 to 5", source: "Cornell Riney Canine Health Center" },
      { line: "NRC 2006 recommended allowance, adult dogs", mgPer1000kcal: "1.5", ppmDM: "6.0", source: "NRC 2006" },
      { line: "AAFCO adult maintenance minimum", mgPer1000kcal: "1.83", ppmDM: "7.3", source: "AAFCO, via Whole Dog Journal" },
      { line: "Commercial dog foods, median (range)", mgPer1000kcal: "4.4 (2.3 to 9)", ppmDM: "17.6", source: "Gagné et al., via Today's Veterinary Practice 2025" },
      { line: "FEDIAF maximum (AAFCO sets no maximum)", mgPer1000kcal: "7.0", ppmDM: "28", source: "FEDIAF, via Whole Dog Journal" }
    ]
  };
  var ATWATER = { protein: 3.5, fat: 8.5, carb: 3.5 }; // modified Atwater factors used for pet food, kcal per g

  function rer(kg) { return 70 * Math.pow(kg, 0.75); }
  function fatBudgetG(kcalPerDay, gPer1000) { return (gPer1000 || LINES.fatMaxPer1000) * kcalPerDay / 1000; }
  function fatPer1000(fatGPerKg, kcalPerKg) { return fatGPerKg / (kcalPerKg / 1000); }
  function fatPctCalories(fatGPerKg, kcalPerKg) { return fatGPerKg * ATWATER.fat / kcalPerKg * 100; }
  function copperPer1000(cuMgPer100g, kcalPer100g) { return cuMgPer100g / kcalPer100g * 1000; }
  function copperPpmDM(cuMgPer100g, moisturePct) { return cuMgPer100g / ((100 - moisturePct) / 100) * 10; }

  // One day's food. items: [{ name, kcal, fatG, cuMg }]
  function day(items, gPer1000) {
    var t = { kcal: 0, fatG: 0, cuMg: 0 };
    items.forEach(function (i) { t.kcal += i.kcal || 0; t.fatG += i.fatG || 0; t.cuMg += i.cuMg || 0; });
    var budget = fatBudgetG(t.kcal, gPer1000);
    return { kcal: t.kcal, fatG: t.fatG, cuMg: t.cuMg,
             fatPer1000: t.fatG / (t.kcal / 1000), copperPer1000: t.cuMg / (t.kcal / 1000),
             fatBudgetG: budget, fatLeftG: budget - t.fatG };
  }

  var api = { LINES: LINES, ATWATER: ATWATER, rer: rer, fatBudgetG: fatBudgetG, fatPer1000: fatPer1000,
              fatPctCalories: fatPctCalories, copperPer1000: copperPer1000, copperPpmDM: copperPpmDM, day: day };
  if (typeof module !== "undefined" && module.exports) module.exports = api; else root.DietMath = api;
})(this);
