/* bowlfit.js: how high and how big a dog's or cat's food bowl should be.
   Made by PawsOnMe (https://www.etsy.com/shop/PawsOnMePet). MIT License. */
(function (root) {
  "use strict";
  var CUP_ML = 236.6;            // 1 US cup in millilitres
  var IN_CM = 2.54;
  var BELOW_ELBOW_CM = 7.5;      // rule of thumb: the top edge of the bowl from elbow height down to 2-3 in (5-7.5 cm) below it
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
  // The two sentences that close the large-dog tip for a pet that brings food back up; the page cites each one.
  var MEGA_RAISE = "If it's megaesophagus (a widened food pipe), vet guides advise a raised bowl so gravity helps food reach the stomach.",
    BLOAT_RAISE = "For a large dog, raising the bowl for this is your vet's call, because raised bowls have been linked to bloat in large breeds.";
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

  // Our bowls, sizes as listed in our Etsy shop (November 2026). rimCm = how tall the bowl is: the floor to its top edge,
  // the same point the bowl height in the result is measured to. The page says "tall", never "rim", because "rim" read
  // as two different heights (owner 2026-11-20).
  // url = the bowl's own listing in our Etsy shop; img = the photo picked for its card, copied into img/ (2026-11-16)
  // top = its place in the list shown before anything is typed: our best sellers, in the owner's order. It is a
  // static list, the same six for a cat or a dog (owner 2026-11-19: lilac plate, two-tone raised flower, the big-dog
  // Pink Planet third, raised lilac pedestal, sage, and the butter yellow line-and-dots plate sixth).
  // ml: null = no capacity known, so nothing is claimed either way; mlAbout = an estimate, shown as "about".
  // dogOnly = made for dogs, not cats. slow = a slow feeder.
  // Every bowl we sell is here, with every option that changes its size or height, sold-out ones too (owner
  // 2026-11-20). Colours and feet don't change the fit, so they share
  // the bowl. options = the listing's other sizes or heights. Each becomes a bowl of its own in PRODUCTS, from the same
  // listing, and its url picks that option on Etsy (pick = the option's value; variation1 = the listing's second choice).
  // Its photo follows optionPhoto below. rimAbout = the height is an estimate, shown as "about"; on = what the height is
  // measured with; adds = the add-on that changes the height; shows = the add-on the card photo already shows.
  var BOWLS = [
    { name: "Lilac flower ceramic slow feeder plate", listing: 4517774070, slow: true, tilted: false, widthCm: 14.8, rimCm: 3.5, ml: 310, top: 1,
      url: "https://www.etsy.com/listing/4517774070/ceramic-slow-feeder-cat-bowl-lilac", img: "img/lilac-flower-plate.jpg" },
    // The line-and-dots plate: medium 15.5 cm across, 4 cm tall, 400 ml; large 19.1 cm, 4 cm, 650 ml (the listing's two
    // size charts), each in butter yellow or pink. The large one's photo is the listing's photo of the large plate,
    // which is pink, so its name says both colours.
    { name: "Butter yellow ceramic slow feeder plate, medium", listing: 4517744488, slow: true, tilted: false, widthCm: 15.5, rimCm: 4, ml: 400, top: 6,
      url: "https://www.etsy.com/listing/4517744488/ceramic-slow-feeder-cat-bowl-butter", img: "img/butter-yellow-plate.jpg",
      options: [{ name: "Pink or butter yellow ceramic slow feeder plate, large", widthCm: 19.1, ml: 650, pick: 6778088974, img: "img/line-dots-plate-large.jpg" }] },
    { name: "Lilac flower slow feeder on a pedestal", listing: 4533246949, slow: true, tilted: false, widthCm: 14.8, rimCm: 8.5, ml: 310, top: 4,
      url: "https://www.etsy.com/listing/4533246949/lilac-elevated-slow-feeder-ceramic-pet", img: "img/lilac-flower-pedestal.jpg" },
    { name: "Sage green raised tilted slow feeder", listing: 4517348136, slow: true, tilted: true, widthCm: 14.8, rimCm: 11, ml: 200, top: 5,
      url: "https://www.etsy.com/listing/4517348136/sage-green-ceramic-slow-feeder-bowl", img: "img/sage-green-raised-tilted.jpg" },
    { name: "Two-tone raised tilted flower slow feeder", listing: 4504867658, slow: true, tilted: true, widthCm: 14.5, rimCm: 10.5, ml: 200, top: 2,
      url: "https://www.etsy.com/listing/4504867658/raised-flower-ceramic-slow-feeder-bowl", img: "img/two-tone-raised-tilted-flower.jpg" },
    // Plate 21.6 cm across, 3.5 cm tall; the optional bamboo stand is 7 cm tall (listing, measured by hand by the maker).
    // About 650 ml: the estimate on the listing's size chart (2026-11-16, from its size; the maker gives none).
    // Made for medium to large dogs (owner 2026-11-10). Photo: the one the owner picked for it, a tricolor Rough Collie
    // eating from it on its bamboo stand, so the size reads at a glance (owner 2026-11-19). The name is the owner's:
    // "Large dog ceramic slow feeder pink planet style" (2026-11-19), "large dog" first, about four lines on the card.
    // On its stand (the listing's other style) the plate sits down into the stand, so its top edge is about 7.5 cm from
    // the floor, not 3.5 + 7 cm: measured on the owner's side photo of it, with the stand's 7 cm as the scale.
    { name: "Large dog ceramic slow feeder Pink Planet style", listing: 4614433467, slow: true, tilted: false, widthCm: 21.6, rimCm: 3.5, ml: 650, mlAbout: true, top: 3,
      dogOnly: true, extra: "Optional bamboo stand, 7 cm (2.8 in) tall", shows: "stand",
      url: "https://www.etsy.com/listing/4614433467/pink-planet-ceramic-slow-feeder-dog-bowl", img: "img/pink-planet-plate.jpg",
      options: [{ adds: "stand", rimCm: 7.5, rimAbout: true, on: "on its bamboo stand", pick: 7406742080 }] },
    // The two waffle cone bowls, 13 cm across and about 350 ml. On the raised foot the tilted food bowl is 11.5 cm tall
    // and the flat water bowl 10 cm: the maker's size chart draws both from the floor to the top. (Its table and our
    // listings say 5 and 6.5 cm, which is the bowl alone, not the height with the foot.) The smooth pink foot is the
    // same size, and so are the sold-out colours.
    { name: "Pink raised tilted food bowl, waffle cone foot", listing: 4517778769, slow: false, tilted: true, widthCm: 13, rimCm: 11.5, ml: 350, mlAbout: true,
      url: "https://www.etsy.com/listing/4517778769/hand-painted-pink-ceramic-pet-bowl", img: "img/waffle-tilted-food-bowl.jpg" },
    { name: "Yellow raised water bowl, waffle cone foot", listing: 4517775646, slow: false, tilted: false, widthCm: 13, rimCm: 10, ml: 350, mlAbout: true,
      url: "https://www.etsy.com/listing/4517775646/ceramic-pet-water-bowl-raised-waffle", img: "img/waffle-flat-water-bowl.jpg" }
  ];

  // The photo on an option's card (owner 2026-11-20): the bowl's own card photo, whatever the colour, feet or other
  // option, except
  //  - a different size (across or holds): that size's photo, so the card shows the size it describes;
  //  - a different height from an add-on, like a stand: that option's photo, unless the bowl's photo shows the add-on
  //    already. The Pink Planet's photo, the one picked for it, shows its stand, so the plate on its stand keeps it.
  // In any other case an option's own photo is not used, even when one is set.
  function optionPhoto(b, o) {
    var size = (o.widthCm !== undefined && o.widthCm !== b.widthCm) || (o.ml !== undefined && o.ml !== b.ml);
    var height = o.rimCm !== undefined && o.rimCm !== b.rimCm && !(o.adds && o.adds === b.shows);
    return (size || height) && o.img ? o.img : b.img;
  }
  // Each bowl, then each of its options as a bowl of its own: the bowl's details, the option's changes, its own link
  // and photo. An option is not in the static list (top) and doesn't repeat the note about the add-on it is (extra).
  var PRODUCTS = [];
  BOWLS.forEach(function (b) {
    var base = {}, k;
    for (k in b) if (k !== "options") base[k] = b[k];
    PRODUCTS.push(base);
    (b.options || []).forEach(function (o) {
      var p = {};
      for (k in base) if (k !== "top" && k !== "extra") p[k] = base[k];
      for (k in o) if (k !== "pick" && k !== "img") p[k] = o[k];
      p.url = b.url + "?variation1=" + o.pick;
      p.img = optionPhoto(b, o);
      // a bowl sold with or without an add-on (the stand): each card knows the other one's height, for its note
      if (o.adds) { base.addOn = p.addOn = o.adds; base.withAddOn = false; p.withAddOn = true; base.otherRimCm = p.rimCm; p.otherRimCm = b.rimCm; }
      PRODUCTS.push(p);
    });
  });

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
                tips: [], nutritionTips: [], cautions: [], products: [], productNote: "", shop: SHOP,
                // the Bowl line each bowl tip is about, so the page puts that line's "*" there, not always on Slow
                // feeder (owner 2026-11-20): height = Bowl height, width = Dish width, holds = Holds at least,
                // slow = Slow feeder, tilted = Tilted bowl
                tipRows: {},
                // tips that only ask for something still to fill in; they also stay in tips, but a page that counts
                // what is ready (owner 2026-11-20) leaves them out
                asks: [] };
    function tip(t, row) { out.tips.push(t); out.tipRows[t] = row; }

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

    // size: "small" (under 10 kg) or "medium" (10-23 kg), which get the usual elbow rule, "large" (23-45 kg) or "giant"
    // (over 45 kg); the old flag largeBreed means one of the two. Small and medium are two choices on the page because
    // owners think of their dog that way (owner 2026-11-20), though the result is the same. Small under 10 kg as in
    // veterinary studies that sort dogs by size; medium up to 23 kg, where the bloat study's "large" starts.
    var size = !dog ? "" : (i.size === "large" || i.size === "giant") ? i.size : (i.largeBreed ? "both" : "");
    var big = size !== "";
    // A large breed with an elbow height goes by the elbow, like any dog, with the large-breed note beside it as a
    // reference, and no raised bowl ruled out (owner 2026-11-20). Without an elbow height, the 1 ft rule below.
    var byElbow = size === "large" && !!elbow;
    // a flat face or long ears: a tilted bowl is worth trying, and the result says so in a row of its own (owner
    // 2026-11-20), and our tilted bowls come first in the cards
    out.tilted = !!(i.flatFace || (dog && i.longEars));
    var lo = elbow ? Math.max(0, elbow - BELOW_ELBOW_CM) : null, hi = elbow;
    if (big && !byElbow) {
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
      out.height = { minCm: r1(lo), maxCm: r1(hi), text: "Between " + show(lo) + " and " + show(hi) + " off the floor, measured to the top edge.",
        // the sum behind it, written out under the page's picture of how the height is worked out (owner 2026-11-20)
        sum: { elbow: show(hi), less: show(BELOW_ELBOW_CM), low: lo > 0 ? show(lo) : null } };
      if (lo < 3) tip("A flat plate on the floor already sits in this range.", "height");
      if (i.senior) tip("Older or stiff: aim for the higher end, so the head doesn't have to drop as far.", "height");
      if (byElbow) out.cautions.push(NOTES.large);
    } else {
      tip("Measure from the floor to your pet's elbow, standing, to get a height.", "height");
      out.asks.push(out.tips[out.tips.length - 1]);
      out.elbowAsk = out.tips[out.tips.length - 1];   // the page shows this one as a note to its Bowl height line
    }
    if (whisker) {
      out.minWidthCm = r1(whisker);
      tip("Pick a dish at least " + show(whisker) + " across, so the whiskers don't brush the sides.", "width");
    } else if (!dog) {
      tip("Optional: measure your cat's whisker span, tip to tip, and pick a dish at least that wide.", "holds");   // no Dish width line yet: the bowl's size line
      out.asks.push(out.tips[out.tips.length - 1]);
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
    if (i.fastEater) tip(dog ? "A slow feeder makes each meal take longer. Eating very fast is a bloat risk factor, and VCA's vets suggest a puzzle feeder or slow-down bowl for large and giant dogs."
      : "A slow feeder or puzzle feeder spreads the meal out. A feline vet consensus recommends small meals from puzzle feeders, partly because cats that gorge may vomit.", "slow");
    // Brings food back up without retching: that is regurgitation, a passive motion with no effort from the belly,
    // often undigested food from the food pipe (esophagus), not vomiting (Merck, Vomiting in Dogs; The Digestive
    // System in Animals). Gravity helps: for megaesophagus Merck has dogs fed with the forelimbs higher than the
    // hindlimbs and held there 10-15 minutes, with frequent small meals; for reflux in the food pipe, small frequent
    // meals of soft, low-fat food (Merck, Esophagitis). A slow feeder is for eating fast, so it stays as it was.
    // For a large dog the tip says outright that vets do advise a raised bowl when it's megaesophagus, before the bloat
    // caution, so the caution doesn't read as the page saying never raise it (owner 2026-11-20). Merck, Dilatation of the
    // Esophagus: "Feeding from an elevated position with the forelimbs higher than the hindlimbs ... allows gravity to
    // assist food passage into the stomach"; Hill's (Wooten, DVM, 2020): food bowls "must be elevated enough from the
    // floor so that the dog does not have to bend down at all to eat". Research is thin: one study of 12 dogs fed
    // upright in Bailey chairs (Haines 2019, JAAHA) found food cleared very differently from dog to dog.
    if (i.regurgitates) tip("Brings food back up: that's usually the food pipe (esophagus), not the stomach, so have your vet check it. " +
      (size ? "Smaller meals, more often, help. " + MEGA_RAISE + " " + BLOAT_RAISE
        : elbow ? "Aim for the top of the range so gravity helps, and give smaller meals more often."
        : "A higher bowl lets gravity help, and smaller meals more often help too."), "height");
    // The page cites these after a tip's text, as source numbers linked to its Sources list: raised bowls and bloat in
    // large breeds are in Glickman 2000, Cornell's Riney Canine Health Center ("Using a raised food bowl" is a risk
    // factor; "Avoid raised food bowls") and a SurgerySTAT column of the American College of Veterinary Surgeons ("not
    // feeding from an elevated food bowl") (owner 2026-11-20: add these sources). A key can be a whole tip or one of its
    // sentences; the page puts each one's sources before that sentence's full stop.
    // tipStrong: sentences the page shows in bold. The megaesophagus sentence is bold wherever it shows (owner
    // 2026-11-20); its source numbers stay as they are.
    out.tipSources = {}; out.tipStrong = [];
    if (i.regurgitates && size) {
      out.tipSources[MEGA_RAISE] = ["merck-megaesophagus", "hills-megaesophagus"];
      out.tipSources[BLOAT_RAISE] = ["glickman-gdv", "cornell-gdv", "acvs-gdv"];
      out.tipStrong.push(MEGA_RAISE);
    }
    // Sick or lip licking on an empty stomach, often at night or early morning: bilious vomiting, thought to come
    // from bile flowing back into the stomach. Ferguson et al., JAAHA 2016, 20 dogs: treated with more frequent
    // meals, late evening meals, acid reducers and other medicines; 12 of the 17 dogs that kept the diagnosis
    // improved, and it should be a diagnosis of exclusion. Lip licking is a sign of nausea (Merck). No bowl change.
    if (dog && i.emptyStomach) tip("Empty stomach: lip licking can be a sign of nausea. Vets use smaller meals through the day and a small late-evening meal, sometimes with medicine; in one study 12 of 17 dogs improved. Let your vet rule out other causes first.", "holds");   // smaller meals: the amount a meal, so the bowl's size line
    if (i.flatFace) tip("Flat face: a wide, shallow or tilted bowl is easier to eat from.", "tilted");
    if (i.longEars) tip("Long ears: a narrower opening or a tilted bowl keeps the ears out of the food.", "tilted");
    if (dog && i.shortLegs) tip("Short legs, long back: go by the elbow measurement, not by weight. Size charts based on weight don't account for leg length.", "height");

    // Always end with our bowls: the ones that may fit, then the closest ones and how far each is from the numbers.
    // Never a dead end with no bowl (owner 2026-11-16). The list is there before anything is typed and re-ranks with
    // every input; it says "may fit", never "fit" (owner 2026-11-15).
    function card(p, notes) {
      var holds = p.ml ? (p.mlAbout ? "about " : "") + p.ml + " ml" : "";
      var tall = (p.rimAbout ? "about " : "") + show(p.rimCm) + " tall" + (p.on ? " " + p.on : "");
      function cap(t) { return t.replace(/^./, function (c) { return c.toUpperCase(); }); }
      return { name: p.name, size: show(p.widthCm) + " across, " + tall + (holds ? ", holds " + holds : ""),
               note: notes && notes.length ? cap(notes.join(", ")) + "." : "",
               specs: [show(p.widthCm) + " across", cap(tall)].concat(holds ? ["Holds " + holds] : [])
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
    var rankSize = byElbow ? "" : size;
    var ranked = rankProducts(out, rankSize, out.tilted,
                              (!!i.senior || !!i.regurgitates) && !rankSize && !!out.height && out.height.minCm !== undefined, dog, cm(i.elbow, i.unit));
    // One card per listing: its size closest to the numbers, which is the first one in the ranked order (owner
    // 2026-11-20: a big meal gets the large line-and-dots plate, not the medium).
    var seen = {};
    ranked = ranked.filter(function (r) { if (seen[r.p.listing]) return false; seen[r.p.listing] = true; return true; });
    // A flat face or long ears: our tilted bowls come first, then the rest, each in its ranked order (owner 2026-11-20:
    // "make sure the recommended products prioritize the tilted feeders I have from psom store")
    if (out.tilted) ranked = ranked.filter(function (r) { return r.p.tilted; }).concat(ranked.filter(function (r) { return !r.p.tilted; }));
    // The ones that may fit come first, best fit first, then the closest ones fill the row to three, each saying how far
    // off it is (owner 2026-11-20).
    // A raised bowl is needed when the suggested height starts above what a plate on the floor reaches (5 cm). Then
    // the slow feeders that are raised already, on a foot or on their own stand, come before the flat ones wherever
    // slow feeders are picked below (owner 2026-11-20).
    var raise = !!(out.height && out.height.minCm !== undefined && out.height.minCm > FLOOR_RIM_CM);
    function raisedFirst(list) {
      return raise ? list.filter(function (r) { return r.p.rimCm > FLOOR_RIM_CM; })
        .concat(list.filter(function (r) { return r.p.rimCm <= FLOOR_RIM_CM; })) : list;
    }
    var slow = ranked.filter(function (r) { return r.p.slow; }), other = ranked.filter(function (r) { return !r.p.slow; }), picks;
    if (!out.slowFeeder) {
      // A slow feeder optional (the result says "Optional", nothing ticked that calls for one): the first three go by
      // the other numbers alone, then two slow feeders as cards 4 and 5, five cards in all: the closest slow feeders
      // not shown yet, the raised ones first when a raised bowl is needed (owner 2026-11-20).
      picks = ranked.slice(0, 3);
      picks = picks.concat(raisedFirst(slow.filter(function (r) { return picks.indexOf(r) < 0; })).slice(0, 2));
    } else {
      // A slow feeder worth trying: only slow feeders, ranked on everything together, the raised ones first when a
      // raised bowl is needed, then the ones without a foot or a stand (owner 2026-11-20). Bowls that aren't slow
      // feeders (the waffle cone food and water bowls) only come in when there are fewer than three slow feeders to
      // show, the closest of them on all the numbers, saying they aren't slow feeders (owner 2026-11-20).
      picks = raisedFirst(slow).slice(0, 3);
      if (picks.length < 3) picks = picks.concat(other.slice(0, 3 - picks.length).map(function (r) {
        return { p: r.p, score: r.score + 1, notes: r.notes.concat(["not a slow feeder"]) };
      }));
    }
    // At least one of the first two cards is a slow feeder (owner 2026-11-20). If neither is, the closest slow feeder
    // not among them (the raised ones first when a raised bowl is needed) moves up to second place; if it isn't shown
    // yet, it is added there. The row is 3 to 5 cards (owner: "The carousel can be 3 or 4 or 5…as long as you provide
    // more than 3 or equal to 3"), so an added card past five drops the last one.
    if (picks.length > 1 && !picks[0].p.slow && !picks[1].p.slow) {
      var best = raisedFirst(slow.filter(function (r) { return r !== picks[0] && r !== picks[1]; }))[0];
      if (best) {
        picks = picks.filter(function (r) { return r !== best; });
        picks.splice(1, 0, best);
        if (picks.length > 5) picks = picks.slice(0, 5);
      }
    }
    // never fewer than three cards while there are bowls to show
    if (picks.length < 3) picks = picks.concat(ranked.filter(function (r) { return picks.indexOf(r) < 0; }).slice(0, 3 - picks.length));
    out.products = picks.map(function (r) { return card(r.p, r.notes); });
    out.productNote = picks.some(function (r) { return r.score === 0; }) ? "PawsOnMe bowls that may fit these numbers:" : "The closest PawsOnMe bowls to these numbers:";
    return out;
  }

  // How far off, said gently: the numbers are a reference, not a reason not to buy (owner 2026-11-19).
  // Under 1 cm "slightly", otherwise "a bit", never "quite" (owner 2026-11-20); a bowl more than 5 cm shorter than the
  // suggested height also says to use a stand ("suggest using a stand to increase the bowl height", her words).
  // Capacity as an approximate "~". The height note names
  // the suggested height it is compared with ("a bit shorter than the suggested 12.2 cm"), so the gap never reads as a
  // second height of the bowl (owner 2026-11-20: "Rim 1.2 cm" next to "Rim 11 cm high" looked like two different rims).
  function howMuch(d) { return d < 1 ? "slightly" : "a bit"; }

  // How a height compares with the suggested range: null when it is in it, else which way and how far.
  function off(rim, h) {
    if (rim < h.minCm) return { d: h.minCm - rim, way: "shorter", to: h.minCm };
    if (rim > h.maxCm) return { d: rim - h.maxCm, way: "taller", to: h.maxCm };
    return null;
  }
  function said(o) { return howMuch(o.d) + " " + o.way + " than the suggested " + show(o.to); }
  // The height part of a card's note. More than 5 cm short also says to use a stand (owner 2026-11-20: ", suggest using
  // a stand to increase the bowl height"). A bowl sold with or without an add-on that changes its height, like the
  // Pink Planet's bamboo stand, says which of the two the note is about and how the other compares, in a few words
  // (owner 2026-11-20), e.g. "a bit shorter than the suggested 12.2 cm (4.8 in) with the stand, even shorter without
  // it", or "may fit without the stand, a bit taller than the suggested 6 cm (2.4 in) with it".
  // How tall a stand under this bowl would bring its top edge into the suggested range, in whole cm (rounded inwards,
  // so the whole range still lands inside it).
  function standText(rim, h) {
    var lo = h.minCm - rim, hi = h.maxCm - rim, a = Math.ceil(lo), b = Math.floor(hi);
    if (a > b) { a = r1(lo); b = r1(hi); }
    return "a stand about " + a + " to " + b + " cm (" + r1(a / IN_CM) + " to " + r1(b / IN_CM) + " in) tall";
  }
  // The stand tip, with the stand's height in it (owner 2026-11-20): for any bowl more than 5 cm short, and for a flat
  // plate (5 cm or less) whenever the
  // suggested height starts above what a plate on the floor reaches, so a flat slow feeder can still be suggested,
  // with the stand that would make it fit. A large breed's floor-or-1-ft rule has no low end, so it never gets one.
  function heightNote(p, h) {
    var a = off(p.rimCm, h);
    var tip = a && a.way === "shorter" && (a.d > 5 || (h.minCm > FLOOR_RIM_CM && p.rimCm <= FLOOR_RIM_CM))
      ? ", suggest using " + standText(p.rimCm, h) + " to increase the bowl height" : "";
    if (!p.addOn) return a ? said(a) + tip : "";
    var b = off(p.otherRimCm, h), add = "the " + p.addOn;
    var mine = p.withAddOn ? "with " + add : "without " + add, other = p.withAddOn ? "without it" : "with it";
    if (!a && !b) return "";
    if (!a) return "may fit " + mine + ", " + said(b) + " " + other;
    if (!b) return said(a) + " " + mine + tip + ", may fit " + other;
    if (a.way === b.way && b.d > a.d) return said(a) + " " + mine + ", even " + b.way + " " + other + tip;
    return said(a) + " " + mine + ", " + said(b) + " " + other + tip;
  }

  // The note for a large breed without an elbow height, from the bloat study's height bands [Glickman 2000]: on the floor
  // or raised above 1 ft (raised 1 ft or less carried 3.06 times the risk, above 1 ft was not significantly different).
  // The Pink Planet's own bamboo stand puts it under 1 ft, so its card says so, as every note for a bowl with or without
  // a stand says how the other one compares. A large breed with an elbow height goes by the elbow instead, and giant
  // breeds get anything up to 1 ft, which all our bowls are, so neither gets a note here.
  function breedNote(p, size) {
    if (size !== "large" || p.rimCm > FLOOR_RIM_CM) return "";
    if (p.addOn && p.otherRimCm > FLOOR_RIM_CM && p.otherRimCm <= FT_CM)
      return "may fit without the " + p.addOn + ", but the " + p.addOn + " puts it under 1 ft (30.5 cm), the height linked to more bloat in large breeds";
    return "";
  }

  // Our bowls ranked by how far each is from the numbers: 0 = fits. A rim 5 cm off counts like a bowl that holds
  // nothing extra; capacity and width count by the share that's missing. A large breed with an elbow height is ranked
  // by the elbow, like any dog (owner 2026-11-20); without one it gets bowls on the floor or raised above 1 ft, because
  // raised bowls of 1 ft or less carried 3.06 times the bloat risk and above 1 ft was not significantly different (owner
  // 2026-11-20: not every raised bowl ruled out); all our raised bowls are under 1 ft, so the flat plates. Giant breeds:
  // anything up to 1 ft.
  // Ties follow what was ticked: tilted bowls first for a flat face or long ears; for an older or stiff pet, or one
  // that brings food back up, the higher rims first, as the tips say to aim for the higher end of the range;
  // for a large or giant breed the wider plates first. A bowl with no capacity from the maker stays in the
  // "may fit" list, and when capacity matters its card says the capacity isn't listed yet.
  // A bowl that can't hold even one meal comes after every bowl that can, the bigger ones first (owner 2026-11-20:
  // the whole day's food in one meal needs the biggest bowl, the Pink Planet plate, first, whatever its height).
  function rankProducts(out, size, tiltFirst, highFirst, dog, elbowCm) {
    var h = out.height, need = out.capacityMl, meal = out.mealMl, w = out.minWidthCm;
    return PRODUCTS.map(function (p, k) {
      var notes = [], score = 0, d;
      if (p.dogOnly && !dog) return null;
      if (size) {
        // large: on the floor or above 1 ft (and not above the elbow, when it's known), never raised 1 ft or less;
        // giant: up to 1 ft; size unknown ("both"): the floor
        if (size === "large" ? p.rimCm > FLOOR_RIM_CM && (p.rimCm <= FT_CM || (elbowCm && p.rimCm > elbowCm))
            : size === "giant" ? p.rimCm > FT_CM : p.rimCm > FLOOR_RIM_CM) return null;
        d = breedNote(p, size);
        if (d) notes.push(d);
      } else if (h && h.minCm !== undefined) {
        d = off(p.rimCm, h);
        if (d) score += d.d / 5;
        if (heightNote(p, h)) notes.push(heightNote(p, h));
      }
      if (need && p.ml === null) notes.push("capacity not listed yet");
      else if (need && p.ml < need) { score += (need - p.ml) / need; notes.push("holds ~" + (need - p.ml) + " ml less than suggested"); }
      if (w && p.widthCm < w) { d = w - p.widthCm; score += d / w; notes.push(show(d) + " " + howMuch(d) + " narrower than the whisker span"); }
      return { p: p, k: k, score: score, notes: notes, small: need && meal && p.ml !== null && p.ml < meal ? 1 : 0 };
    }).filter(Boolean).sort(function (a, b) {
      return (a.small - b.small) || (a.small ? b.p.ml - a.p.ml : 0) || (a.score - b.score) || (tiltFirst ? (b.p.tilted ? 1 : 0) - (a.p.tilted ? 1 : 0) : 0)
        || (highFirst ? b.p.rimCm - a.p.rimCm : 0) || (size ? b.p.widthCm - a.p.widthCm : 0) || (a.k - b.k);
    });
  }

  var api = { recommend: recommend, feeding: feeding, food: food, foods: foods, rowMl: rowMl, unitName: unitName,
              MER: MER, LEVELS: LEVELS, CONDITIONS: CONDITIONS, SOURCES: SOURCES, PRODUCTS: PRODUCTS, BOWLS: BOWLS, optionPhoto: optionPhoto,
              CUP_ML: CUP_ML, OZ_G: OZ_G, SHOP: SHOP,
              BELOW_ELBOW_CM: BELOW_ELBOW_CM, show: show };
  if (typeof module !== "undefined" && module.exports) module.exports = api; else root.BowlFit = api;
})(this);
