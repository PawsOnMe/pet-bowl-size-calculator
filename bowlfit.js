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
  // Calories a day = a factor x the resting energy requirement (RER), and RER = 70 x kg^0.75 kcal a day: the energy
  // a pet burns at rest. Every factor is an estimate; pets can vary by as much as 50% (Pet Nutrition Alliance).
  // - Pet Nutrition Alliance (PNA), "Calculating Calories Based on Pet Needs": dogs 1.0 weight loss or in hospital,
  //   1.2-1.4 overweight-prone or inactive, 1.6 neutered adult, 1.8 intact adult, 1.6-2.0 gestation, 2-6 lactation,
  //   2-3 growth; cats 0.8-1.0 weight loss, 1.0 overweight-prone or inactive, 1.2 neutered, 1.4 intact,
  //   2-3 gestation, 2-6 lactation, 2-3 growth.
  // - Merck Veterinary Manual, "Nutritional Requirements of Small Animals", same factors, with puppies split into
  //   3 (under 4 months) and 2 (older), and kittens 2.5.
  // - National Research Council, "Your Dog's Nutritional Needs" (2006), calories a day by weight: active adult dogs
  //   130 x kg^0.75 = 1.86 x RER, inactive dogs 95 x kg^0.75 = 1.36, older active dogs 105 x kg^0.75 = 1.5, young
  //   adult active dogs 140 x kg^0.75 = 2.0 (at 30 lb: 922, 674, 745 and 993 kcal, against an RER of 496).
  // - Working detection dogs: about 2 x RER (Mullis, Witzel and Price, PeerJ 2015, 20 dogs over six months).
  // - Very active cats, like ones that go outdoors (owner 2026-11-19): FEDIAF Nutritional Guidelines (September 2025),
  //   Table VII-9, puts adult cats at 52-75 kcal per kg^0.67 a day if neutered and/or indoor and 100 if active, so an
  //   active cat needs about a third more (100 / 75). A third more than the 1.2 x RER of a neutered adult is 1.6 x RER.
  var MER = {
    dog: { young: [2, 3], neutered: [1.6, 1.6], intact: [1.8, 1.8], inactive: [1.2, 1.4], active: [1.86, 1.86], working: [2, 2] },
    cat: { young: [2, 3], neutered: [1.2, 1.2], intact: [1.4, 1.4], inactive: [1.0, 1.0], active: [1.6, 1.6] }
  };
  var BASIS = { young: "growth, as a puppy or kitten", neutered: "an adult, spayed or neutered, usual activity",
    intact: "an adult, not spayed or neutered, usual activity", inactive: "a pet that isn't very active or gains weight easily",
    active: "an active adult dog", working: "a working dog", activeCat: "a very active adult cat, like one that goes outdoors" };
  // Which factor applies. stage: "neutered", "intact" or "young" ("inactive" is still accepted); activity: "usual",
  // "low", "active" (dogs and cats) or "working" (dogs). Growth sets the level for puppies and kittens whatever the activity.
  function factorKey(i) {
    var a = i.activity || "usual";
    if (i.stage === "young") return "young";
    if (i.stage === "inactive" || a === "low") return "inactive";
    if (a === "active" || (a === "working" && i.species !== "cat")) return a;
    return i.stage === "intact" ? "intact" : "neutered";
  }
  function factor(i) { var t = MER[i.species === "cat" ? "cat" : "dog"]; return t[factorKey(i)] || t.neutered; }

  // The levels in the page's table, lowest first. key marks the levels a calculation can use; src names the sources
  // in SOURCES below.
  var LEVELS = {
    dog: [
      { lo: 1, hi: 1, who: "At rest, as in hospital, or losing weight", src: ["pna"] },
      { lo: 1.2, hi: 1.4, who: "Not very active, or gains weight easily", key: "inactive", src: ["pna"] },
      { lo: 1.5, hi: 1.5, who: "Older active dogs", src: ["nrc"] },
      { lo: 1.6, hi: 1.6, who: "Adult, spayed or neutered", key: "neutered", src: ["pna", "merck-req"] },
      { lo: 1.6, hi: 2, who: "Pregnant", src: ["pna"] },
      { lo: 1.8, hi: 1.8, who: "Adult, not spayed or neutered", key: "intact", src: ["pna", "merck-req"] },
      { lo: 1.86, hi: 1.86, who: "Active adult dogs, like those with a big yard or other dogs at home", key: "active", src: ["nrc"] },
      { lo: 2, hi: 2, who: "Puppies from 4 months until grown", key: "young", src: ["merck-req"] },
      { lo: 2, hi: 2, who: "Working dogs, such as detection dogs", key: "working", src: ["mullis"] },
      { lo: 3, hi: 3, who: "Puppies under 4 months", key: "young", src: ["merck-req"] },
      { lo: 2, hi: 6, who: "Nursing mothers", src: ["pna"] }
    ],
    cat: [
      { lo: 0.8, hi: 1, who: "Losing weight", src: ["pna"] },
      { lo: 1, hi: 1, who: "Not very active, or gains weight easily", key: "inactive", src: ["pna", "merck-req"] },
      { lo: 1.2, hi: 1.2, who: "Adult, spayed or neutered", key: "neutered", src: ["pna", "merck-req"] },
      { lo: 1.4, hi: 1.4, who: "Adult, not spayed or neutered", key: "intact", src: ["pna", "merck-req"] },
      { lo: 1.6, hi: 1.6, who: "Very active, like cats that go outdoors", key: "active", src: ["fediaf", "merck-req"] },
      { lo: 2, hi: 3, who: "Kittens (Merck uses 2.5)", key: "young", src: ["pna", "merck-req"] },
      { lo: 2, hi: 3, who: "Pregnant", src: ["pna"] },
      { lo: 2, hi: 6, who: "Nursing mothers", src: ["pna"] }
    ]
  };
  var SLED = { text: "Racing sled dogs: about 9,000 to 13,800 kcal a day in the Yukon Quest race.", src: ["loftus"] };

  // Health things a person can tick, and what vet sources say about feeding with each. text is per species
  // where the advice differs. A vet's own plan comes first. Worded gently: no "disease" in what people read
  // (owner 2026-11-16: pet parents are already under a lot of pressure).
  var CONDITIONS = {
    kidney: { title: "Kidney values to watch", src: ["merck-renal"],
      text: "If your vet puts the kidneys at stage 2 or higher: a kidney (renal) diet, with less phosphorus and a modest amount of good protein. Pets on one live longer." },
    liver: { title: "Liver values to watch", src: ["merck-liver"],
      text: "Most don't need less fat. Cut protein only if your vet finds hepatic encephalopathy. Copper building up in the liver calls for a low-copper liver diet. Small, frequent meals help." },
    pancreatitis: { title: "Pancreatitis", src: ["merck-pancreas"],
      dog: "Under 20 g of fat per 1,000 kcal. Treatment depends on it.",
      cat: "Moderately less fat is enough." },
    lipids: { title: "High triglycerides or cholesterol", src: ["weeth"],
      text: "24 g of fat per 1,000 kcal or less (about 20% of calories). If it stays high, ask your vet about fiber or fish oil.",
      dogExtra: { text: "Triglycerides of 500 mg/dL and up also raise the risk of pancreatitis.", src: ["merck-pancreas"] } },
    overweight: { title: "Weight loss", src: ["merck-obesity"],
      dog: "Start at about 60% of the calories a day and aim to lose about 1% of body weight a week, on a weight-loss food.",
      cat: "Start at about 70% and aim to lose about 1% a week. Never starve a cat: it can cause hepatic lipidosis." }
  };
  var LOSS_SHARE = { dog: 0.6, cat: 0.7 };   // Merck: start weight loss at 60% of MER for dogs, 70% for cats
  function conditionNotes(species, list) {
    var cat = species === "cat", out = [];
    ["kidney", "liver", "pancreatitis", "lipids", "overweight"].forEach(function (k) {
      if (!list || list.indexOf(k) < 0) return;
      var c = CONDITIONS[k], text = c.text || (cat ? c.cat : c.dog), src = c.src.slice();
      if (!cat && c.dogExtra) { text += " " + c.dogExtra.text; src = src.concat(c.dogExtra.src); }
      out.push({ key: k, title: c.title, text: text, src: src });
    });
    return out;
  }
  var SOURCES = {
    "pna": { title: "Pet Nutrition Alliance. Calculating Calories Based on Pet Needs.", url: "https://petnutritionalliance.org/wp-content/uploads/2023/03/MER.RER_.PNA_.pdf" },
    "merck-req": { title: "Merck Veterinary Manual. Nutritional Requirements of Small Animals.", url: "https://www.merckvetmanual.com/management-and-nutrition/nutrition-small-animals/nutritional-requirements-of-small-animals" },
    "nrc": { title: "National Research Council. Your Dog's Nutritional Needs: A Science-Based Guide for Pet Owners. National Academies Press, 2006.", url: "https://nap.nationalacademies.org/resource/10668/dog_nutrition_final_fix.pdf" },
    "fediaf": { title: "FEDIAF. Nutritional Guidelines for Complete and Complementary Pet Food for Cats and Dogs, September 2025, Table VII-9.", url: "https://europeanpetfood.org/wp-content/uploads/2025/09/FEDIAF-Nutritional-Guidelines_2025.pdf" },
    "mullis": { title: "Mullis RA, Witzel AL, Price J. Maintenance energy requirements of odor detection, explosive detection and human detection working dogs. PeerJ, 2015.", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4349026/" },
    "loftus": { title: "Loftus JP, et al. Energy requirements for racing endurance sled dogs. Journal of Nutritional Science, 2014.", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4473159/" },
    "merck-renal": { title: "Merck Veterinary Manual. Renal Dysfunction in Dogs and Cats.", url: "https://www.merckvetmanual.com/urinary-system/noninfectious-diseases-of-the-urinary-system-in-small-animals/renal-dysfunction-in-dogs-and-cats" },
    "merck-liver": { title: "Merck Veterinary Manual. Nutrition in Hepatic Disease in Small Animals.", url: "https://www.merckvetmanual.com/digestive-system/hepatic-disease-in-small-animals/nutrition-in-hepatic-disease-in-small-animals" },
    "merck-pancreas": { title: "Merck Veterinary Manual. Pancreatitis in Dogs and Cats.", url: "https://www.merckvetmanual.com/digestive-system/the-exocrine-pancreas/pancreatitis-in-dogs-and-cats" },
    "weeth": { title: "Weeth LP. Nutritional Management of Hyperlipidemia. Today's Veterinary Practice, 2022.", url: "https://todaysveterinarypractice.com/nutrition/nutritional-management-of-hyperlipidemia/" },
    "merck-obesity": { title: "Merck Veterinary Manual. Nutrition in Disease Management in Small Animals: Obesity.", url: "https://www.merckvetmanual.com/management-and-nutrition/nutrition-small-animals/nutrition-in-disease-management-in-small-animals" }
  };

  // Our bowls, sizes as listed in our Etsy shop (November 2026). rimCm = floor to rim.
  // url = the bowl's own listing in our Etsy shop; img = a clean photo of it, copied into img/ (2026-11-16)
  // top = its place in the list shown before anything is typed: our best sellers, in the owner's order. It is a
  // static list, the same six for a cat or a dog (owner 2026-11-19: lilac plate, two-tone raised flower, the big-dog
  // Pink Planet third, raised lilac pedestal, sage, and the butter yellow line-and-dots plate sixth).
  // ml: null = no capacity known, so nothing is claimed either way; mlAbout = an estimate, shown as "about".
  // dogOnly = made for dogs, not cats.
  var PRODUCTS = [
    { name: "Lilac flower ceramic slow feeder plate", slow: true, tilted: false, widthCm: 14.8, rimCm: 3.5, ml: 310, top: 1,
      url: "https://www.etsy.com/listing/4517774070/ceramic-slow-feeder-cat-bowl-lilac", img: "img/lilac-flower-plate.jpg" },
    { name: "Butter yellow ceramic slow feeder plate, medium", slow: true, tilted: false, widthCm: 15.5, rimCm: 4, ml: 400, top: 6,
      url: "https://www.etsy.com/listing/4517744488/ceramic-slow-feeder-cat-bowl-butter", img: "img/butter-yellow-plate.jpg" },
    { name: "Lilac flower slow feeder on a pedestal", slow: true, tilted: false, widthCm: 14.8, rimCm: 8.5, ml: 310, top: 4,
      url: "https://www.etsy.com/listing/4533246949/lilac-elevated-slow-feeder-ceramic-pet", img: "img/lilac-flower-pedestal.jpg" },
    { name: "Sage green raised tilted slow feeder", slow: true, tilted: true, widthCm: 14.8, rimCm: 11, ml: 200, top: 5,
      url: "https://www.etsy.com/listing/4517348136/sage-green-ceramic-slow-feeder-bowl", img: "img/sage-green-raised-tilted.jpg" },
    { name: "Two-tone raised tilted flower slow feeder", slow: true, tilted: true, widthCm: 14.5, rimCm: 10.5, ml: 200, top: 2,
      url: "https://www.etsy.com/listing/4504867658/raised-flower-ceramic-slow-feeder-bowl", img: "img/two-tone-raised-tilted-flower.jpg" },
    // Plate 21.6 cm across, 3.5 cm tall; the optional bamboo stand is 7 cm tall (listing, measured by hand by the maker).
    // About 650 ml: the estimate on the listing's size chart (2026-11-16, from its size; the maker gives none).
    // Made for medium to large dogs (owner 2026-11-10). Photo: the listing's second photo, a tricolor Rough Collie
    // eating from it, so the size reads at a glance (owner 2026-11-19). The name is the owner's: "Large dog ceramic slow
    // feeder pink planet style" (2026-11-19), "large dog" first, about four lines on the card.
    { name: "Large dog ceramic slow feeder Pink Planet style", slow: true, tilted: false, widthCm: 21.6, rimCm: 3.5, ml: 650, mlAbout: true, top: 3,
      dogOnly: true, extra: "Optional bamboo stand, 7 cm (2.8 in) tall",
      url: "https://www.etsy.com/listing/4614433467/pink-planet-ceramic-slow-feeder-dog-bowl", img: "img/pink-planet-plate.jpg" }
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
    var f = factor(i);
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
  function isWater(row) { var f = food(row && row.id); return !!f && f.form === "water"; }
  // Calories in one of the row's units: from the food list, or from the label the person typed
  // (kcal per kg for grams and ounces, kcal per cup for cups). null means not known.
  // Water or broth mixed in counts as 0 kcal, unless the row carries a broth's calories per 100 ml (kcal100),
  // looked up from the brand the person typed (owner 2026-11-16). 1 g of water or broth is 1 ml.
  function kcalPer(row, f, labelKcal) {
    var u = row.unit;
    if (f && f.form === "water") return u === "unit" ? null : (num(row.kcal100) || 0) / 100 * (u === "cups" ? CUP_ML : u === "oz" ? OZ_G : 1);
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
  // The one food of the meal, if there is just one. Water or broth mixed in doesn't count as a food here.
  function oneFood(rows) {
    var real = rows.filter(function (r) { return !isWater(r); });
    return real.length === 1 ? real[0] : null;
  }
  // How much to feed when the meal is one food: calories a day from weight and life stage, then that food's amount.
  // A broth with known calories takes its share of the day first (its amount x its calories x meals a day).
  function feedingFoods(i, rows) {
    var w = num(i.weight);
    if (!w) return null;
    var kg = i.unit === "in" ? w * LB_KG : w;
    var f = factor(i);
    var rer = 70 * Math.pow(kg, 0.75), meals = num(i.mealsPerDay) || 2;
    var res = { rer: Math.round(rer), kcalLo: Math.round(rer * f[0]), kcalHi: Math.round(rer * f[1]), meals: meals };
    var row = oneFood(rows), fd = row ? food(row.id) : null, per = row ? kcalPer(row, fd, i.labelKcal) : null;
    if (per) {
      var broth = 0;
      rows.forEach(function (r) { if (isWater(r) && num(r.amount)) broth += num(r.amount) * (kcalPer(r, food(r.id)) || 0) * meals; });
      var lo = Math.max(0, rer * f[0] - broth), hi = Math.max(0, rer * f[1] - broth);
      var p = row.unit === "g" ? 1 : row.unit === "oz" ? 10 : 100, rd = function (x) { return Math.round(x * p) / p; };
      res.unit = row.unit; res.dayLo = rd(lo / per); res.dayHi = rd(hi / per); res.meal = rd(hi / per / meals);
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
      var sum = 0, one = oneFood(rows);
      rows.forEach(function (row) {
        // A typed amount wins; a one-food meal with no amount uses the amount worked out from calories.
        var r = num(row && row.amount) ? row : (row === one && feed && feed.meal ? { id: row.id, unit: row.unit, amount: feed.meal } : null);
        var ml = r ? rowMl(r) : 0;
        if (ml === null) needFood = true; else sum += ml;
      });
      mealMl = needFood || !sum ? null : sum;
      // What the pet eats now, from the amounts typed: each food's amount x its calories x meals a day.
      // Only when every food with an amount has known calories (from foods.js, or the label for a single food).
      // Water or broth mixed in is known: 0 kcal, or the calories of the broth that was looked up. It needs a
      // food with an amount next to it, so water alone never reads as "eats 0 kcal".
      var meals = num(i.mealsPerDay) || 2, fed = 0, known = true, typed = false;
      rows.forEach(function (row) {
        var a = num(row && row.amount);
        if (!a) return;
        if (!isWater(row)) typed = true;
        var per = kcalPer(row, food(row.id), row === one ? i.labelKcal : null);
        if (per === null) known = false; else fed += a * per;
      });
      fedKcalDay = typed && known ? Math.round(fed * meals) : null;
    }
    var out = { feeding: feed, height: null, minWidthCm: null, capacityMl: null, mealMl: mealMl ? r1(mealMl) : null, needFood: needFood, fedKcalDay: fedKcalDay,
                needGramsPerCup: !!(grams && gMeal && !gCup), slowFeeder: !!i.fastEater,
                tips: [], nutritionTips: [], cautions: [], products: [], productNote: "", shop: SHOP };

    // The energy behind the calories: resting energy, the factor used and why, and the table of levels for this
    // pet (kcal only when the weight is known). Then what the ticked health conditions mean for feeding.
    var sp = dog ? "dog" : "cat", key = factorKey(i), fx = factor(i), wkg = num(i.weight);
    var kgE = wkg ? (unit === "in" ? wkg * LB_KG : wkg) : null, rerE = kgE ? 70 * Math.pow(kgE, 0.75) : null;
    out.energy = { kg: kgE ? r1(kgE) : null, rer: rerE ? Math.round(rerE) : null, key: key, lo: fx[0], hi: fx[1], basis: (!dog && BASIS[key + "Cat"]) || BASIS[key],
      fedTimesRer: rerE && fedKcalDay ? r1(fedKcalDay / rerE) : null,
      levels: LEVELS[sp].map(function (l) {
        return { lo: l.lo, hi: l.hi, who: l.who, src: l.src, on: l.key === key,
                 kcalLo: rerE ? Math.round(rerE * l.lo) : null, kcalHi: rerE ? Math.round(rerE * l.hi) : null };
      }),
      after: dog ? SLED : null };
    var conds = Array.isArray(i.conditions) ? i.conditions : [];
    out.conditionNotes = conditionNotes(sp, conds);
    if (feed && conds.indexOf("overweight") >= 0) {
      feed.lossShare = LOSS_SHARE[sp];
      feed.lossLo = Math.round(feed.kcalLo * LOSS_SHARE[sp]); feed.lossHi = Math.round(feed.kcalHi * LOSS_SHARE[sp]);
    }

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
    if (feed) out.nutritionTips.push("These calories are a starting point. Pets can differ by up to 50%, so check body condition every few weeks.");
    // Older adult dogs (the "older" box): National Research Council, older active dogs 105 x kg^0.75 = 1.5 x RER,
    // young adult active dogs 140 x kg^0.75 = 2.0 x RER, so a quarter less.
    if (feed && dog && i.senior && key !== "young") out.nutritionTips.push("Older dogs need less: about 1.5 × RER for older active dogs (National Research Council).");
    // Merck: breed differences affect calories independent of body size, eg Newfoundlands need fewer than Great Danes.
    if (feed && dog) out.nutritionTips.push("Breed matters too: Newfoundlands seem to need fewer calories than Great Danes of the same size (Merck).");
    if (big && i.stage === "young") out.nutritionTips.push("Large-breed puppy: choose a growth food whose label says it includes growth of large size dogs.");
    out.tips = out.tips.concat(out.nutritionTips);
    if (i.fastEater) out.tips.push(dog ? "A slow feeder makes each meal take longer. Eating very fast is a bloat risk factor, and VCA's vets suggest a puzzle feeder or slow-down bowl for large and giant dogs."
      : "A slow feeder or puzzle feeder spreads the meal out. A feline vet consensus recommends small meals from puzzle feeders, partly because cats that gorge may vomit.");
    // Brings food back up without retching: that is regurgitation, a passive motion with no effort from the belly,
    // often undigested food from the food pipe (esophagus), not vomiting (Merck, Vomiting in Dogs; The Digestive
    // System in Animals). Gravity helps: for megaesophagus Merck has dogs fed with the forelimbs higher than the
    // hindlimbs and held there 10-15 minutes, with frequent small meals; for reflux in the food pipe, small frequent
    // meals of soft, low-fat food (Merck, Esophagitis). A slow feeder is for eating fast, so it stays as it was.
    if (i.regurgitates) out.tips.push("Brings food back up: that's usually the food pipe (esophagus), not the stomach, so have your vet check it. " +
      (size ? "Smaller meals, more often, help. For a large dog, raising the bowl for this is your vet's call, because of the bloat risk above."
        : elbow ? "Aim for the top of the range so gravity helps, and give smaller meals more often."
        : "A higher bowl lets gravity help, and smaller meals more often help too."));
    // Sick or lip licking on an empty stomach, often at night or early morning: bilious vomiting, thought to come
    // from bile flowing back into the stomach. Ferguson et al., JAAHA 2016, 20 dogs: treated with more frequent
    // meals, late evening meals, acid reducers and other medicines; 12 of the 17 dogs that kept the diagnosis
    // improved, and it should be a diagnosis of exclusion. Lip licking is a sign of nausea (Merck). No bowl change.
    if (dog && i.emptyStomach) out.tips.push("Empty stomach: lip licking can be a sign of nausea. Vets use smaller meals through the day and a small late-evening meal, sometimes with medicine; in one study 12 of 17 dogs improved. Let your vet rule out other causes first.");
    if (i.flatFace) out.tips.push("Flat face: a wide, shallow or tilted bowl is easier to eat from.");
    if (i.longEars) out.tips.push("Long ears: a narrower opening or a tilted bowl keeps the ears out of the food.");
    if (dog && i.shortLegs) out.tips.push("Short legs, long back: go by the elbow measurement, not by weight. Size charts based on weight don't account for leg length.");

    // Always end with our bowls: the ones that may fit, or else the closest ones and how far each is from the numbers.
    // Never a dead end with no bowl (owner 2026-11-16). The list is there before anything is typed and re-ranks with
    // every input; it says "may fit", never "fit" (owner 2026-11-15).
    function card(p, notes) {
      var holds = p.ml ? (p.mlAbout ? "about " : "") + p.ml + " ml" : "";
      return { name: p.name, size: show(p.widthCm) + " across, rim " + show(p.rimCm) + " high" + (holds ? ", holds " + holds : ""),
               note: notes && notes.length ? notes.join(", ").replace(/^./, function (c) { return c.toUpperCase(); }) + "." : "",
               specs: [show(p.widthCm) + " across", "Rim " + show(p.rimCm) + " high"].concat(holds ? ["Holds " + holds] : [])
                 .concat(p.extra ? [p.extra] : []),
               url: p.url, img: p.img };
    }
    // Nothing typed or ticked that changes the ranking: our six best sellers, in the owner's order, the same for any
    // pet (owner 2026-11-19: "empty state 是一个 static state…你要先展示你店里面好的东西").
    if (!out.height && !out.capacityMl && !out.minWidthCm && !out.slowFeeder && !i.flatFace && !i.longEars && !i.senior && !i.regurgitates) {
      out.products = PRODUCTS.filter(function (p) { return p.top; })
        .sort(function (a, b) { return a.top - b.top; }).map(function (p) { return card(p); });
      out.productNote = "PawsOnMe bowls that may fit these numbers:";   // the original heading (owner 2026-11-19)
      return out;
    }
    var ranked = rankProducts(out, size, i.flatFace || i.longEars,
                              (!!i.senior || !!i.regurgitates) && !size && !!out.height && out.height.minCm !== undefined, dog);
    var fits = ranked.filter(function (r) { return r.score === 0; });
    out.products = (fits.length ? fits : ranked).slice(0, 3).map(function (r) { return card(r.p, r.notes); });
    out.productNote = fits.length ? "PawsOnMe bowls that may fit these numbers:" : "The closest PawsOnMe bowls to these numbers:";
    return out;
  }

  // How far off, said gently: the numbers are a reference, not a reason not to buy (owner 2026-11-19).
  // Under 1 cm "slightly", up to 5 cm "a bit", more "quite a bit"; capacity as an approximate "~".
  function howMuch(d) { return d < 1 ? "slightly" : d <= 5 ? "a bit" : "quite a bit"; }

  // Our bowls ranked by how far each is from the numbers: 0 = fits. A rim 5 cm off counts like a bowl that holds
  // nothing extra; capacity and width count by the share that's missing. Large breeds only get the flat plates,
  // because raised bowls of 1 ft or less carried 3.06 times the bloat risk; giant breeds anything up to 1 ft.
  // Ties follow what was ticked: tilted bowls first for a flat face or long ears; for an older or stiff pet, or one
  // that brings food back up, the higher rims first, as the tips say to aim for the higher end of the range;
  // for a large or giant breed the wider plates first. A bowl with no capacity from the maker stays in the
  // "may fit" list, and when capacity matters its card says the capacity isn't listed yet.
  function rankProducts(out, size, tiltFirst, highFirst, dog) {
    var h = out.height, need = out.capacityMl, w = out.minWidthCm;
    return PRODUCTS.map(function (p, k) {
      var notes = [], score = 0, d;
      if (p.dogOnly && !dog) return null;
      if (size) {
        if (p.rimCm > FLOOR_RIM_CM && (size !== "giant" || p.rimCm > FT_CM)) return null;
      } else if (h && h.minCm !== undefined) {
        if (p.rimCm < h.minCm) { d = h.minCm - p.rimCm; score += d / 5; notes.push("rim " + show(d) + " " + howMuch(d) + " lower than the range"); }
        else if (p.rimCm > h.maxCm) { d = p.rimCm - h.maxCm; score += d / 5; notes.push("rim " + show(d) + " " + howMuch(d) + " higher than the range"); }
      }
      if (need && p.ml === null) notes.push("capacity not listed yet");
      else if (need && p.ml < need) { score += (need - p.ml) / need; notes.push("holds ~" + (need - p.ml) + " ml less than suggested"); }
      if (w && p.widthCm < w) { d = w - p.widthCm; score += d / w; notes.push(show(d) + " " + howMuch(d) + " narrower than the whisker span"); }
      if (out.slowFeeder && !p.slow) { score += 1; notes.push("not a slow feeder"); }
      return { p: p, k: k, score: score, notes: notes };
    }).filter(Boolean).sort(function (a, b) {
      return (a.score - b.score) || (tiltFirst ? (b.p.tilted ? 1 : 0) - (a.p.tilted ? 1 : 0) : 0)
        || (highFirst ? b.p.rimCm - a.p.rimCm : 0) || (size ? b.p.widthCm - a.p.widthCm : 0) || (a.k - b.k);
    });
  }

  var api = { recommend: recommend, feeding: feeding, food: food, foods: foods, rowMl: rowMl, unitName: unitName,
              MER: MER, LEVELS: LEVELS, CONDITIONS: CONDITIONS, SOURCES: SOURCES, PRODUCTS: PRODUCTS, CUP_ML: CUP_ML, OZ_G: OZ_G, SHOP: SHOP };
  if (typeof module !== "undefined" && module.exports) module.exports = api; else root.BowlFit = api;
})(this);
