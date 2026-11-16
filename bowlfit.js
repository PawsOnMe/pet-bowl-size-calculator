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
  var OZ_G = 28.349523125;       // 1 oz in grams
  var FT_CM = 30.48;             // 1 ft = 12 in x 2.54 cm
  var FLOOR_RIM_CM = 5;          // a flat plate on the floor counts as a floor bowl
  // Foods people can pick instead of weighing a cup themselves (foods.js: grams in one level cup, calories,
  // can sizes, and the source of each). Looked up when needed, so the script order on a page doesn't matter.
  var FOOD_LIST = null;
  function foods() {
    if (FOOD_LIST) return FOOD_LIST;
    var src = null;
    if (typeof module !== "undefined" && module.exports) { try { src = require("./foods.js"); } catch (e) { src = null; } }
    else src = root.BowlFitFoods || null;
    if (src && src.FOODS) FOOD_LIST = src.FOODS;
    return FOOD_LIST || [];
  }
  function food(id) { var l = foods(); for (var k = 0; k < l.length; k++) if (l[k].id === id) return l[k]; return null; }
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
  // url = the bowl's own listing in our Etsy shop; img = that listing's main photo, copied into img/ (2026-11-16)
  var PRODUCTS = [
    { name: "Lilac flower ceramic slow feeder plate", slow: true, tilted: false, widthCm: 14.8, rimCm: 3.5, ml: 310,
      url: "https://www.etsy.com/listing/4517774070/ceramic-slow-feeder-cat-bowl-lilac", img: "img/lilac-flower-plate.jpg" },
    { name: "Butter yellow ceramic slow feeder plate, medium", slow: true, tilted: false, widthCm: 15.5, rimCm: 4, ml: 400,
      url: "https://www.etsy.com/listing/4517744488/ceramic-slow-feeder-cat-bowl-butter", img: "img/butter-yellow-plate.jpg" },
    { name: "Lilac flower slow feeder on a pedestal", slow: true, tilted: false, widthCm: 14.8, rimCm: 8.5, ml: 310,
      url: "https://www.etsy.com/listing/4533246949/lilac-elevated-slow-feeder-ceramic-pet", img: "img/lilac-flower-pedestal.jpg" },
    { name: "Sage green raised tilted slow feeder", slow: true, tilted: true, widthCm: 14.8, rimCm: 11, ml: 200,
      url: "https://www.etsy.com/listing/4517348136/sage-green-ceramic-slow-feeder-bowl", img: "img/sage-green-raised-tilted.jpg" },
    { name: "Two-tone raised tilted flower slow feeder", slow: true, tilted: true, widthCm: 14.5, rimCm: 10.5, ml: 200,
      url: "https://www.etsy.com/listing/4504867658/raised-flower-ceramic-slow-feeder-bowl", img: "img/two-tone-raised-tilted-flower.jpg" }
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

  // A food in the meal: { id, amount, unit }, unit "g", "oz", "cups" or "unit" (one can, pouch or tray of that food).
  // Volume in ml: cups are volume already; a weight is divided by the food's grams in one level cup.
  function rowMl(row) {
    var a = num(row && row.amount);
    if (!a) return 0;
    if (row.unit === "cups") return a * CUP_ML;
    var f = food(row.id);
    if (!f || !f.gCup) return null;
    var g = row.unit === "oz" ? a * OZ_G : row.unit === "unit" ? (f.unit ? a * f.unit.g : null) : a;
    return g === null ? null : g / f.gCup * CUP_ML;
  }
  // Calories in one of the row's units: from the food list, or from the label the person typed
  // (kcal per kg for grams and ounces, kcal per cup for cups).
  function kcalPer(row, f, labelKcal) {
    var u = row.unit;
    if (f && f.kcalKg) {
      if (u === "cups") return f.kcalCup || f.kcalKg * f.gCup / 1000;
      if (u === "unit") return f.unit ? (f.unit.kcal || f.kcalKg * f.unit.g / 1000) : null;
      return f.kcalKg / 1000 * (u === "oz" ? OZ_G : 1);
    }
    var k = num(labelKcal);
    if (!k || u === "unit") return null;
    return u === "cups" ? k : k / 1000 * (u === "oz" ? OZ_G : 1);
  }
  function unitName(u, f, n) {
    if (u === "unit") { var w = f && f.unit ? f.unit.name : "can"; return n === 1 ? w : w + (/(ch|sh|s|x)$/.test(w) ? "es" : "s"); }
    return u === "cups" ? (n === 1 ? "cup" : "cups") : u === "oz" ? "oz" : "g";
  }
  // How much to feed when the meal is one food: calories a day from weight and life stage, then that food's amount.
  function feedingFoods(i, rows) {
    var w = num(i.weight);
    if (!w) return null;
    var kg = i.unit === "in" ? w * LB_KG : w;
    var table = MER[i.species === "cat" ? "cat" : "dog"], f = table[i.stage] || table.neutered;
    var rer = 70 * Math.pow(kg, 0.75), meals = num(i.mealsPerDay) || 2;
    var res = { rer: Math.round(rer), kcalLo: Math.round(rer * f[0]), kcalHi: Math.round(rer * f[1]), meals: meals };
    var row = rows.length === 1 ? rows[0] : null, fd = row ? food(row.id) : null, per = row ? kcalPer(row, fd, i.labelKcal) : null;
    if (per) {
      var p = row.unit === "g" ? 1 : row.unit === "oz" ? 10 : 100, rd = function (x) { return Math.round(x * p) / p; };
      res.unit = row.unit; res.dayLo = rd(rer * f[0] / per); res.dayHi = rd(rer * f[1] / per); res.meal = rd(rer * f[1] / per / meals);
      res.unitName = unitName(row.unit, fd, res.dayHi);
    }
    return res;
  }
  // Round up to the next 50 ml; the rounding to 0.01 ml first keeps 300.00000000000006 at 300.
  function up50(ml) { return Math.ceil(Math.round(ml * 100) / 100 / 50) * 50; }

  function recommend(input) {
    var i = input || {};
    var dog = i.species !== "cat";
    var unit = i.unit === "in" ? "in" : "cm";
    var elbow = cm(i.elbow, unit);
    var whisker = dog ? null : cm(i.whisker, unit);
    var rows = Array.isArray(i.foods) ? i.foods : null;   // the foods in one meal, each picked from foods.js
    var feed = rows ? feedingFoods(i, rows) : feeding(i);
    var grams = !rows && i.foodUnit === "g";
    // The bowl size depends on volume: grams per meal / grams in one cup of that food = cups per meal
    var gMeal = grams ? (num(i.gramsPerMeal) || (feed ? feed.gMeal : null)) : null, gCup = grams ? num(i.gramsPerCup) : null;
    var cups = rows ? null : grams ? (gMeal && gCup ? gMeal / gCup : null) : (num(i.cupsPerMeal) || (feed ? feed.cupsMeal : null));
    var mealMl = cups ? cups * CUP_ML : null, needFood = false, fedKcalDay = null;
    if (rows) {
      var sum = 0;
      rows.forEach(function (row, k) {
        // A typed amount wins; a one-food meal with no amount uses the amount worked out from calories.
        var r = num(row && row.amount) ? row : (k === 0 && feed && feed.meal ? { id: row.id, unit: row.unit, amount: feed.meal } : null);
        var ml = r ? rowMl(r) : 0;
        if (ml === null) needFood = true; else sum += ml;
      });
      mealMl = needFood || !sum ? null : sum;
      // What the pet eats now, from the amounts typed: each food's amount x its calories x meals a day.
      // Only when every food with an amount has known calories (from foods.js, or the label for a single food).
      var meals = num(i.mealsPerDay) || 2, fed = 0, known = true, typed = false;
      rows.forEach(function (row) {
        var a = num(row && row.amount);
        if (!a) return;
        typed = true;
        var per = kcalPer(row, food(row.id), rows.length === 1 ? i.labelKcal : null);
        if (per) fed += a * per; else known = false;
      });
      fedKcalDay = typed && known ? Math.round(fed * meals) : null;
    }
    var out = { feeding: feed, height: null, minWidthCm: null, capacityMl: null, mealMl: mealMl ? r1(mealMl) : null, needFood: needFood, fedKcalDay: fedKcalDay,
                needGramsPerCup: !!(grams && gMeal && !gCup), slowFeeder: !!i.fastEater,
                tips: [], nutritionTips: [], cautions: [], products: [], productNote: "", shop: SHOP };

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
    if (mealMl) out.capacityMl = up50(mealMl * (out.slowFeeder ? ROOM.slow : ROOM.regular));
    // Nutrition tips also go in nutritionTips, so a page can show them with the calories
    if (feed) out.nutritionTips.push("The calories are a starting point. Pets can differ from these estimates by as much as 50%, so check your pet's body condition every few weeks and adjust.");
    if (big && i.stage === "young") out.nutritionTips.push("Large-breed puppy: choose a growth food whose label says it includes growth of large size dogs.");
    out.tips = out.tips.concat(out.nutritionTips);
    if (i.fastEater) out.tips.push(dog ? "A slow feeder makes each meal take longer. Eating very fast is a bloat risk factor, and VCA's vets suggest a puzzle feeder or slow-down bowl for large and giant dogs."
      : "A slow feeder or puzzle feeder spreads the meal out. A feline vet consensus recommends small meals from puzzle feeders, partly because cats that gorge may vomit.");
    if (i.flatFace) out.tips.push("Flat face: a wide, shallow or tilted bowl is easier to eat from.");
    if (i.longEars) out.tips.push("Long ears: a narrower opening or a tilted bowl keeps the ears out of the food.");
    if (dog && i.shortLegs) out.tips.push("Short legs, long back: go by the elbow measurement, not by weight. Size charts based on weight don't account for leg length.");

    // Always end with our bowls: the ones that may fit, or else the closest ones and how far each is from the numbers.
    // Never a dead end with no bowl (owner 2026-11-16). The list is there before anything is typed and re-ranks with
    // every input; it says "may fit", never "fit" (owner 2026-11-15).
    var ranked = rankProducts(out, size, i.flatFace || i.longEars,
                              !!i.senior && !size && !!out.height && out.height.minCm !== undefined);
    var fits = ranked.filter(function (r) { return r.score === 0; });
    out.products = (fits.length ? fits : ranked).slice(0, 3).map(function (r) {
      return { name: r.p.name, size: show(r.p.widthCm) + " across, rim " + show(r.p.rimCm) + " high, holds " + r.p.ml + " ml",
               note: r.notes.length ? r.notes.join(", ").replace(/^./, function (c) { return c.toUpperCase(); }) + "." : "",
               specs: [show(r.p.widthCm) + " across", "Rim " + show(r.p.rimCm) + " high", "Holds " + r.p.ml + " ml"],
               url: r.p.url, img: r.p.img };
    });
    out.productNote = big ? "Our bowls are made for cats and small to medium dogs. The closest ones for yours:"
      : fits.length ? "PawsOnMe bowls that may fit these numbers:" : "The closest PawsOnMe bowls to these numbers:";
    return out;
  }

  // Our bowls ranked by how far each is from the numbers: 0 = fits. A rim 5 cm off counts like a bowl that holds
  // nothing extra; capacity and width count by the share that's missing. Large breeds only get the flat plates,
  // because raised bowls of 1 ft or less carried 3.06 times the bloat risk; giant breeds anything up to 1 ft.
  // Ties follow what was ticked: tilted bowls first for a flat face or long ears; for an older or stiff pet the
  // higher rims first, as the tip says to aim for the higher end of the range.
  function rankProducts(out, size, tiltFirst, highFirst) {
    var h = out.height, need = out.capacityMl, w = out.minWidthCm;
    return PRODUCTS.map(function (p, k) {
      var notes = [], score = 0, d;
      if (size) {
        if (p.rimCm > FLOOR_RIM_CM && (size !== "giant" || p.rimCm > FT_CM)) return null;
      } else if (h && h.minCm !== undefined) {
        if (p.rimCm < h.minCm) { d = h.minCm - p.rimCm; score += d / 5; notes.push("rim " + show(d) + " lower than the range"); }
        else if (p.rimCm > h.maxCm) { d = p.rimCm - h.maxCm; score += d / 5; notes.push("rim " + show(d) + " higher than the range"); }
      }
      if (need && p.ml < need) { score += (need - p.ml) / need; notes.push("holds " + (need - p.ml) + " ml less than suggested"); }
      if (w && p.widthCm < w) { d = w - p.widthCm; score += d / w; notes.push(show(d) + " narrower than the whisker span"); }
      if (out.slowFeeder && !p.slow) { score += 1; notes.push("not a slow feeder"); }
      return { p: p, k: k, score: score, notes: notes };
    }).filter(Boolean).sort(function (a, b) {
      return (a.score - b.score) || (tiltFirst ? (b.p.tilted ? 1 : 0) - (a.p.tilted ? 1 : 0) : 0)
        || (highFirst ? b.p.rimCm - a.p.rimCm : 0) || (a.k - b.k);
    });
  }

  var api = { recommend: recommend, feeding: feeding, food: food, foods: foods, rowMl: rowMl, unitName: unitName,
              MER: MER, PRODUCTS: PRODUCTS, CUP_ML: CUP_ML, OZ_G: OZ_G, SHOP: SHOP };
  if (typeof module !== "undefined" && module.exports) module.exports = api; else root.BowlFit = api;
})(this);
