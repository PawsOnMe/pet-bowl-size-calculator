/* bowlfit.js: how high and how big a dog's or cat's food bowl should be.
   Made by PawsOnMe (https://www.etsy.com/shop/PawsOnMePet). MIT License. */
(function (root) {
  "use strict";
  var CUP_ML = 236.6;            // 1 US cup in millilitres
  var IN_CM = 2.54;
  var BELOW_ELBOW_CM = 7.5;      // rule of thumb: rim from elbow height down to 2-3 in (5-7.5 cm) below it
  var ROOM = { regular: 1.5, slow: 2 }; // rule of thumb: the bowl holds one meal with room to spare
  var SHOP = "https://www.etsy.com/shop/PawsOnMePet";
  var LB_KG = 0.45359237;
  var FT_CM = 30.48;             // 1 ft = 12 in x 2.54 cm
  // Glickman et al., JAVMA 2000 (numbers as summarised by Buckley, Veterinary Evidence 2017): bloat (GDV) cases
  // per 1,000 dog-years by bowl height. Large breeds (23-45 kg): floor 18, raised 1 ft or less 56 (RR 3.06),
  // raised more than 1 ft 29 (not significant). Giant breeds (over 45 kg): floor 17, 1 ft or less 15 (not
  // significant), more than 1 ft 39 (RR 2.29). One study, 98 GDV cases in all.
  var MEGA = "Dogs with megaesophagus are fed from a raised position on purpose, on their vet's plan. If you're unsure, ask your vet.";
  var GUIDE = "It is one study with 98 bloat cases, so treat the cut-off as a guide. ";
  var NOTES = {
    large: "Height matters for large breeds (adults 23 to 45 kg). In the one study that measured it, bloat (GDV) cases per 1,000 dog-years were 18 with a floor bowl, 56 with a bowl raised 1 ft (30.5 cm) or less, which is 3.06 times the risk, and 29 above 1 ft, which was not a significant difference. " + GUIDE + MEGA,
    giant: "Height matters for giant breeds (adults over 45 kg). In the one study that measured it, bloat (GDV) cases per 1,000 dog-years were 17 with a floor bowl, 15 with a bowl raised 1 ft (30.5 cm) or less, which was not a significant difference, and 39 above 1 ft, which is 2.29 times the risk. " + GUIDE + MEGA,
    both: "Height matters, and differently by size. In the one study that measured it, large breeds (23 to 45 kg) had 3.06 times the bloat (GDV) risk with a bowl raised 1 ft (30.5 cm) or less and no significant difference above it; giant breeds (over 45 kg) had 2.29 times the risk above 1 ft and no significant difference at or below it. " + GUIDE + MEGA
  };
  // Pet Nutrition Alliance, "Calculating Calories Based on Pet Needs":
  // RER (kcal/day) = 70 x kg^0.75, MER = factor x RER. Estimates only; pets can vary by as much as 50%.
  var MER = {
    dog: { young: [2, 3], neutered: [1.6, 1.6], intact: [1.8, 1.8], inactive: [1.2, 1.4] },
    cat: { young: [2, 3], neutered: [1.2, 1.2], intact: [1.4, 1.4], inactive: [1.0, 1.0] }
  };

  // Our bowls, sizes as listed in our Etsy shop (November 2026). rimCm = floor to rim.
  var PRODUCTS = [
    { name: "Lilac flower ceramic slow feeder plate", slow: true, tilted: false, widthCm: 14.8, rimCm: 3.5, ml: 310 },
    { name: "Butter yellow ceramic slow feeder plate, medium", slow: true, tilted: false, widthCm: 15.5, rimCm: 4, ml: 400 },
    { name: "Lilac flower slow feeder on a pedestal", slow: true, tilted: false, widthCm: 14.8, rimCm: 8.5, ml: 310 },
    { name: "Sage green raised tilted slow feeder", slow: true, tilted: true, widthCm: 14.8, rimCm: 11, ml: 200 },
    { name: "Two-tone raised tilted flower slow feeder", slow: true, tilted: true, widthCm: 14.5, rimCm: 10.5, ml: 200 }
  ];

  function num(v) { var n = parseFloat(v); return isFinite(n) && n > 0 ? n : null; }
  function cm(v, unit) { var n = num(v); return n === null ? null : (unit === "in" ? n * IN_CM : n); }
  function r1(x) { return Math.round(x * 10) / 10; }
  function r2(x) { return Math.round(x * 100) / 100; }
  function show(c) { return r1(c) + " cm (" + r1(c / IN_CM) + " in)"; }

  // How much to feed: calories a day from weight and life stage, then cups from the bag's kcal per cup.
  function feeding(i) {
    var grams = i.foodUnit === "g";                // weighing food: use kcal per kg instead of kcal per cup
    var w = num(i.weight), energy = grams ? num(i.kcalPerKg) : num(i.kcalPerCup);
    if (!w || !energy) return null;
    var kg = i.unit === "in" ? w * LB_KG : w;     // unit "in" means US units: inches and pounds
    var table = MER[i.species === "cat" ? "cat" : "dog"], f = table[i.stage] || table.neutered;
    var rer = 70 * Math.pow(kg, 0.75), meals = num(i.mealsPerDay) || 2;
    var res = { rer: Math.round(rer), kcalLo: Math.round(rer * f[0]), kcalHi: Math.round(rer * f[1]), meals: meals, grams: grams };
    if (grams) {                                   // grams a day = kcal a day / kcal per kg x 1000
      res.gDayLo = Math.round(rer * f[0] / energy * 1000); res.gDayHi = Math.round(rer * f[1] / energy * 1000);
      res.gMeal = Math.round(rer * f[1] / energy * 1000 / meals);
    } else {
      res.cupsDayLo = r2(rer * f[0] / energy); res.cupsDayHi = r2(rer * f[1] / energy);
      res.cupsMeal = r2(rer * f[1] / energy / meals);
    }
    return res;
  }

  function recommend(input) {
    var i = input || {};
    var dog = i.species !== "cat";
    var unit = i.unit === "in" ? "in" : "cm";
    var elbow = cm(i.elbow, unit);
    var whisker = dog ? null : cm(i.whisker, unit);
    var feed = feeding(i);
    var grams = i.foodUnit === "g";
    // The bowl size depends on volume: grams per meal / grams in one cup of that food = cups per meal
    var gMeal = grams ? (num(i.gramsPerMeal) || (feed ? feed.gMeal : null)) : null, gCup = grams ? num(i.gramsPerCup) : null;
    var cups = grams ? (gMeal && gCup ? gMeal / gCup : null) : (num(i.cupsPerMeal) || (feed ? feed.cupsMeal : null));
    var out = { feeding: feed, height: null, minWidthCm: null, capacityMl: null, needGramsPerCup: !!(grams && gMeal && !gCup), slowFeeder: !!i.fastEater,
                tips: [], cautions: [], products: [], productNote: "", shop: SHOP };

    // size: "large" (23-45 kg) or "giant" (over 45 kg); the old flag largeBreed means one of the two
    var size = !dog ? "" : (i.size === "large" || i.size === "giant") ? i.size : (i.largeBreed ? "both" : "");
    var big = size !== "";
    var lo = elbow ? Math.max(0, elbow - BELOW_ELBOW_CM) : null, hi = elbow;
    if (big) {
      out.height = { floor: true, text: "" };
      if (size === "large") {
        if (!elbow) out.height.text = "On the floor, or raised above " + show(FT_CM) + ". Add the elbow height for the upper limit.";
        else if (hi <= FT_CM) out.height.text = "On the floor. The elbow rule gives " + show(lo) + " to " + show(hi) + ", which is at or below 1 ft, the height linked to extra risk for large breeds.";
        else {
          out.height.minCm = r1(Math.max(lo, FT_CM)); out.height.maxCm = r1(hi);
          out.height.text = lo >= FT_CM ? "On the floor, or between " + show(lo) + " and " + show(hi) + " off the floor."
            : "On the floor, or above " + show(FT_CM) + " and up to " + show(hi) + " off the floor.";
        }
      } else if (size === "giant") {
        if (elbow && lo <= FT_CM) {
          out.height.minCm = r1(lo); out.height.maxCm = r1(Math.min(hi, FT_CM));
          out.height.text = "On the floor, or between " + show(lo) + " and " + show(Math.min(hi, FT_CM)) + " off the floor.";
        } else {
          out.height.maxCm = r1(FT_CM);
          out.height.text = "On the floor, or raised no higher than " + show(FT_CM) + (elbow ? ", lower than the usual elbow rule of " + show(lo) + " to " + show(hi) + "." : ".");
        }
      } else {
        out.height.text = "On the floor, or raised: above " + show(FT_CM) + " for a large breed, " + show(FT_CM) + " or lower for a giant breed.";
      }
      out.cautions.push(NOTES[size]);
    } else if (elbow) {
      out.height = { minCm: r1(lo), maxCm: r1(hi), text: "Between " + show(lo) + " and " + show(hi) + " off the floor." };
      if (lo < 3) out.tips.push("A flat plate on the floor already sits in this range.");
      if (i.senior) out.tips.push("Older or stiff: aim for the higher end, so the head doesn't have to drop as far.");
    } else {
      out.tips.push("Measure from the floor to your pet's elbow, standing, to get a height.");
    }
    if (whisker) {
      out.minWidthCm = r1(whisker);
      out.tips.push("Pick a dish at least " + show(whisker) + " across, so the whiskers don't brush the sides.");
    } else if (!dog) {
      out.tips.push("Optional: measure your cat's whisker span, tip to tip, and pick a dish at least that wide.");
    }
    if (cups) out.capacityMl = Math.ceil(cups * CUP_ML * (out.slowFeeder ? ROOM.slow : ROOM.regular) / 50) * 50;
    if (feed) out.tips.push("The calories are a starting point. Pets can differ from these estimates by as much as 50%, so check your pet's body condition every few weeks and adjust.");
    if (big && i.stage === "young") out.tips.push("Large-breed puppy: choose a growth food whose label says it includes growth of large size dogs.");
    if (i.fastEater) out.tips.push("A slow feeder makes each meal take longer. It hasn't been shown to prevent bloat.");
    if (i.flatFace) out.tips.push("Flat face: a wide, shallow or tilted bowl is easier to eat from.");
    if (i.longEars) out.tips.push("Long ears: a narrower opening or a tilted bowl keeps the ears out of the food.");
    if (dog && i.shortLegs) out.tips.push("Short legs, long back: go by the elbow measurement, not by weight. Size charts based on weight don't account for leg length.");

    if (big) {
      out.productNote = "We only make bowls for cats and small to medium dogs, so none of ours is the right size for a large or giant breed.";
      return out;
    }
    var picks = PRODUCTS.filter(function (p) {
      if (out.height && (p.rimCm < out.height.minCm || p.rimCm > out.height.maxCm)) return false;
      if (out.capacityMl && p.ml < out.capacityMl) return false;
      if (out.minWidthCm && p.widthCm < out.minWidthCm) return false;
      if (out.slowFeeder && !p.slow) return false;
      return true;
    });
    if (i.flatFace || i.longEars) picks.sort(function (a, b) { return (b.tilted ? 1 : 0) - (a.tilted ? 1 : 0); });
    out.products = picks.slice(0, 3).map(function (p) {
      return { name: p.name, size: show(p.widthCm) + " across, rim " + show(p.rimCm) + " high, holds " + p.ml + " ml" };
    });
    out.productNote = picks.length ? "PawsOnMe bowls that fit these numbers:"
      : "None of our bowls fits these numbers. Take the measurements above with you and shop anywhere.";
    return out;
  }

  var api = { recommend: recommend, feeding: feeding, MER: MER, PRODUCTS: PRODUCTS, CUP_ML: CUP_ML, SHOP: SHOP };
  if (typeof module !== "undefined" && module.exports) module.exports = api; else root.BowlFit = api;
})(this);
