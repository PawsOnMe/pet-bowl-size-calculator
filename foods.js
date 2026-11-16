/* foods.js: foods the bowl calculator knows, so nobody has to weigh a cup of food to size a bowl.
   Made by PawsOnMe (https://www.etsy.com/shop/PawsOnMePet). MIT License.

   gCup is the weight of one level US cup (236.6 ml) of the food. The bowl size depends on volume,
   so a meal weighed in grams, ounces or cans is turned into cups with it.
   How gCup is found:
   - Dry food: from the maker's own calorie statement. US labels give calories per kg and per cup, so
     gCup = kcal per cup / kcal per kg x 1000 (Hill's Science Diet Adult: 365 / 3675 x 1000 = 99.3 g).
     Where the label prints the cup weight itself (Purina ONE, 95 g), that is used. Hill's also prints
     the weight of one cup in ounces (cupOz); the tests check it against the calorie figures.
   - Wet food (cans, pouches, trays): 1.0 g per ml (236.6 g a cup). No maker we checked gives a cup weight
     for canned food. It is mostly water and weighs about 1.05 to 1.10 g per ml with no air in it (Choi and
     Okos 1986 composition model; Hill's i/d Low Fat canned at 75% water works out to 1.08). Rounding down
     allows for some air and keeps the bowl from coming out too small.
   - Fresh-cooked food: from the maker (cup weight on the label, kcal per cup / kcal per kg, or a feeding chart
     with cups next to ounces). Chunks hold air, so these come out at 0.62 to 0.79 g per ml.
   - Freeze-dried food: kcal per cup / kcal per kg, dry from the bag.
   - A type that isn't listed (dry, fresh-cooked, freeze-dried): the 10th percentile of the listed foods of
     that type, so nine in ten weigh more and the bowl comes out a little big rather than too small. Raw and
     homemade food use the fresh-cooked figure.
   - A can, pouch or tray (unit): the maker's net weight and calories. When only ounces are printed,
     1 oz = 28.35 g; when neither, the weight is kcal per can / kcal per kg.
   Calories, sizes and links checked on the makers' US websites on 15 November 2026. */
(function (root) {
  "use strict";
  var CUP_ML = 236.6;
  var WET_G_PER_ML = 1.0;
  var FOODS = [
    // Brand not in the list: pick the type.
    { id: "any-dry", generic: true, species: "both", form: "dry", name: "Dry food (kibble), brand not in the list" },
    { id: "any-wet", generic: true, species: "both", form: "wet", name: "Wet food (can, pouch or tray), brand not in the list" },
    { id: "any-fresh", generic: true, species: "both", form: "fresh", name: "Fresh-cooked food, brand not in the list" },
    { id: "any-raw", generic: true, species: "both", form: "raw", name: "Raw food, thawed, brand not in the list" },
    { id: "any-freeze-dried", generic: true, species: "both", form: "freeze-dried", name: "Freeze-dried food, dry from the bag, brand not in the list" },
    { id: "homemade", generic: true, species: "both", form: "homemade", name: "Homemade cooked food" },
    { id: "water", generic: true, species: "both", form: "water", name: "Water or broth mixed in", gCup: 236.6 },

    // Dog, dry: Hill's
    { id: "hills-sd-adult-chicken-barley-dry", species: "dog", form: "dry", brand: "Hill's Science Diet", name: "Adult Chicken & Barley Recipe, dry",
      kcalKg: 3675, kcalCup: 365, cupOz: 3.5, src: "https://www.hillspet.com/dog-food/science-diet-adult-original-dry" },
    { id: "hills-sd-adult-small-bites-dry", species: "dog", form: "dry", brand: "Hill's Science Diet", name: "Adult Small Bites Chicken & Barley Recipe, dry",
      kcalKg: 3683, kcalCup: 365, cupOz: 3.5, src: "https://www.hillspet.com/dog-food/science-diet-adult-small-bites-dry" },
    { id: "hills-sd-adult-small-mini-dry", species: "dog", form: "dry", brand: "Hill's Science Diet", name: "Adult Small & Mini Chicken & Brown Rice Recipe, dry", alias: "small paws",
      kcalKg: 3699, kcalCup: 357, cupOz: 3.4, src: "https://www.hillspet.com/dog-food/science-diet-adult-small-paws-breed-dry" },
    { id: "hills-sd-sensitive-stomach-skin-dry", species: "dog", form: "dry", brand: "Hill's Science Diet", name: "Adult Sensitive Stomach & Skin Chicken & Barley Recipe, dry",
      kcalKg: 3732, kcalCup: 391, cupOz: 3.7, src: "https://www.hillspet.com/dog-food/science-diet-canine-adult-sensitive-stomach-skin-chicken-dry" },
    { id: "hills-sd-perfect-weight-dry", species: "dog", form: "dry", brand: "Hill's Science Diet", name: "Adult Perfect Weight Chicken & Brown Rice Recipe, dry",
      kcalKg: 3189, kcalCup: 298, cupOz: 3.3, src: "https://www.hillspet.com/dog-food/science-diet-adult-perfect-weight-dry" },
    { id: "hills-pd-id-dry-dog", species: "dog", form: "dry", brand: "Hill's Prescription Diet", name: "i/d Digestive Care Chicken Flavor, dry",
      kcalKg: 3589, kcalCup: 356, cupOz: 3.5, src: "https://www.hillspet.com/dog-food/prescription-diet-id-digestive-care-dry" },
    { id: "hills-pd-id-low-fat-dry-dog", species: "dog", form: "dry", brand: "Hill's Prescription Diet", name: "i/d Low Fat Digestive Care Chicken Flavor, dry", alias: "lowfat",
      kcalKg: 3511, kcalCup: 319, cupOz: 3.2, src: "https://www.hillspet.com/dog-food/prescription-diet-id-low-fat-digestive-care-dry" },
    { id: "hills-pd-wd-dry-dog", species: "dog", form: "dry", brand: "Hill's Prescription Diet", name: "w/d Multi-Benefit Chicken Flavor, dry",
      kcalKg: 3087, kcalCup: 254, cupOz: 2.9, src: "https://www.hillspet.com/dog-food/prescription-diet-wd-glucose-management-dry" },
    { id: "hills-pd-kd-dry-dog", species: "dog", form: "dry", brand: "Hill's Prescription Diet", name: "k/d Kidney Care with Chicken, dry",
      kcalKg: 3991, kcalCup: 419, cupOz: 3.7, src: "https://www.hillspet.com/dog-food/prescription-diet-kd-kidney-care-dry" },
    { id: "hills-pd-zd-dry-dog", species: "dog", form: "dry", brand: "Hill's Prescription Diet", name: "z/d Food Sensitivities, dry",
      kcalKg: 3505, kcalCup: 348, cupOz: 3.5, src: "https://www.hillspet.com/dog-food/prescription-diet-zd-food-sensitivities-dry" },
    { id: "hills-pd-metabolic-dry-dog", species: "dog", form: "dry", brand: "Hill's Prescription Diet", name: "Metabolic Weight Management Chicken Flavor, dry",
      kcalKg: 3124, kcalCup: 257, cupOz: 2.9, src: "https://www.hillspet.com/dog-food/prescription-diet-metabolic-weight-management-dry" },

    // Dog, dry: Royal Canin
    { id: "rc-xsmall-adult-dry", species: "dog", form: "dry", brand: "Royal Canin", name: "X-Small Adult, dry", alias: "size health nutrition",
      kcalKg: 3840, kcalCup: 369, src: "https://www.royalcanin.com/us/dogs/products/retail-products/x-small-adult-1003" },
    { id: "rc-small-adult-dry", species: "dog", form: "dry", brand: "Royal Canin", name: "Small Adult, dry", alias: "size health nutrition",
      kcalKg: 3744, kcalCup: 359, src: "https://www.royalcanin.com/us/dogs/products/retail-products/small-adult-3001" },
    { id: "rc-medium-adult-dry", species: "dog", form: "dry", brand: "Royal Canin", name: "Medium Adult, dry", alias: "size health nutrition",
      kcalKg: 3616, kcalCup: 340, src: "https://www.royalcanin.com/us/dogs/products/retail-products/medium-adult-3004" },
    { id: "rc-vd-gi-low-fat-dry-dog", species: "dog", form: "dry", brand: "Royal Canin Veterinary Diet", name: "Gastrointestinal Low Fat, dry", alias: "gi lowfat",
      kcalKg: 3210, kcalCup: 247, src: "https://www.royalcanin.com/us/dogs/products/vet-products/gastrointestinal-low-fat-3932" },
    { id: "rc-vd-hp-dry-dog", species: "dog", form: "dry", brand: "Royal Canin Veterinary Diet", name: "Hydrolyzed Protein Adult HP, dry",
      kcalKg: 3855, kcalCup: 324, src: "https://www.royalcanin.com/us/dogs/products/vet-products/hydrolyzed-protein-hp-3910" },
    { id: "rc-vd-hepatic-dry-dog", species: "dog", form: "dry", brand: "Royal Canin Veterinary Diet", name: "Hepatic, dry", alias: "liver",
      kcalKg: 3751, kcalCup: 323, src: "https://www.royalcanin.com/us/dogs/products/vet-products/hepatic-3927" },

    // Dog, dry: Purina veterinary diets (the label also gives grams per cup: EN about 106 g, HA about 88 g)
    { id: "purina-ppvd-en-dry-dog", species: "dog", form: "dry", brand: "Purina Pro Plan Veterinary Diets", name: "EN Gastroenteric, dry",
      kcalKg: 3503, kcalCup: 372, src: "https://live.purina.com/sites/default/files/product-label-deck-file/2026-02/2624_e262423_pro_plan_veterinary_diets_en_gastroenteric_canine_formula_dog_food_b91_1.pdf" },
    { id: "purina-ppvd-ha-chicken-dry-dog", species: "dog", form: "dry", brand: "Purina Pro Plan Veterinary Diets", name: "HA Hydrolyzed Chicken Flavor, dry",
      kcalKg: 3563, kcalCup: 315, src: "https://live.purina.com/sites/default/files/product-label-deck-file/2025-07/c262721_pro_plan_veterinary_diets_ha_hydrolyzed_chicken_flavor_canine_formula_dog_food.pdf" },

    // Dog, dry: other brands
    // Labels from Purina's site; each also says how many grams one cup holds (Pro Plan Small Breed 111 g, Sensitive Skin & Stomach 115 g,
    // Beneful 101 g, Dog Chow 116 g). Purina ONE's 2026 labels print the cup weight and kcal per cup only, so kcal/kg = kcal per cup / grams per cup x 1000.
    { id: "purina-pro-plan-small-breed-chicken-rice-dry", species: "dog", form: "dry", brand: "Purina Pro Plan", name: "Adult Small Breed Chicken & Rice Formula, dry",
      kcalKg: 4053, kcalCup: 452, src: "https://live.purina.com/sites/default/files/product-label-deck-file/2025-03/4450_j445024_pro_plan_small_breed_chicken_rice_dry_dog_food_544.pdf" },
    { id: "purina-pro-plan-sensitive-salmon-rice-dry", species: "dog", form: "dry", brand: "Purina Pro Plan", name: "Adult Sensitive Skin & Stomach Salmon & Rice Formula, dry",
      kcalKg: 3903, kcalCup: 449, src: "https://live.purina.com/sites/default/files/product-label-deck-file/2024-10/4449_m444922_pro_plan_sensitive_skin_stomach_salmon_rice_formula_dog_food_dry_kk7.pdf" },
    { id: "purina-one-lamb-rice-dry", species: "dog", form: "dry", brand: "Purina ONE", name: "Lamb & Rice Formula, dry",
      kcalKg: 3884, kcalCup: 369, gCup: 95, src: "https://live.purina.com/sites/default/files/product-label-deck-file/2026-04/4162_z416225_pone_lamb_rice_dry_dog_food_ns1.pdf" },
    { id: "purina-one-chicken-rice-dry", species: "dog", form: "dry", brand: "Purina ONE", name: "Chicken & Rice Formula, dry",
      kcalKg: 4032, kcalCup: 383, gCup: 95, src: "https://live.purina.com/sites/default/files/product-label-deck-file/2026-04/4154_b415425_pone_chicken_rice_dry_dog_food_ns2.pdf" },
    { id: "purina-beneful-originals-beef-dry", species: "dog", form: "dry", brand: "Purina Beneful", name: "Originals with Farm-Raised Beef, dry",
      kcalKg: 3631, kcalCup: 366, src: "https://live.purina.com/sites/default/files/product-label-deck-file/2025-05/4090_u409024_beneful_originals_w_farm-raised_beef_natural_dry_dog_food_su5_1.pdf" },
    { id: "purina-dog-chow-complete-adult-dry", species: "dog", form: "dry", brand: "Purina Dog Chow", name: "Complete Adult Chicken Flavor, dry",
      kcalKg: 3469, kcalCup: 405, src: "https://live.purina.com/sites/default/files/products/files/4101_-_G410122_Dog_Chow_Complete_Adult_Chicken_Flavor_Dog_Food_Dry_DN7.pdf" },
    { id: "pedigree-adult-roasted-chicken-vegetable-dry", species: "dog", form: "dry", brand: "Pedigree", name: "Adult Roasted Chicken & Vegetable, dry", alias: "complete nutrition",
      kcalKg: 3305, kcalCup: 324, src: "https://www.pedigree.com/products/dry/adult-dry-dog-food-roasted-chicken-vegetable" },
    { id: "iams-minichunks-chicken-dry", species: "dog", form: "dry", brand: "IAMS", name: "Proactive Health Adult Minichunks Chicken & Whole Grain, dry", alias: "small kibble",
      kcalKg: 3657, kcalCup: 381, src: "https://www.iams.com/products/dry/iams-minichunks-chicken-whole-grains" },
    { id: "blue-life-protection-chicken-brown-rice-dry", species: "dog", form: "dry", brand: "Blue Buffalo", name: "Life Protection Formula Adult Chicken & Brown Rice, dry", alias: "blue",
      kcalKg: 3633, kcalCup: 379, src: "https://www.bluebuffalo.com/dry-dog-food/life-protection-formula/chicken-brown-rice-recipe/" },
    { id: "blue-life-protection-small-breed-dry", species: "dog", form: "dry", brand: "Blue Buffalo", name: "Life Protection Formula Small Breed Adult Chicken & Brown Rice, dry", alias: "blue",
      kcalKg: 3682, kcalCup: 398, src: "https://www.bluebuffalo.com/dry-dog-food/life-protection-formula/small-breed-chicken-brown-rice-recipe/" },
    { id: "kirkland-adult-chicken-rice-vegetable-dry", species: "dog", form: "dry", brand: "Kirkland Signature", name: "Adult Formula Chicken, Rice & Vegetable, dry", alias: "costco",
      kcalKg: 3754, kcalCup: 393, src: "https://www.costco.com/p/-/kirkland-signature-adult-formula-chicken-rice-and-vegetable-dog-food-25-lbs/4000399008" },
    { id: "nutrish-real-chicken-veggies-dry", species: "dog", form: "dry", brand: "Rachael Ray Nutrish", name: "Real Chicken & Veggies Recipe, dry",
      kcalKg: 3575, kcalCup: 340, src: "https://nutrish.com/product/nutrish-real-chicken-veggies-recipe-dry-dog-food" },
    { id: "totw-high-prairie-dry", species: "dog", form: "dry", brand: "Taste of the Wild", name: "High Prairie Canine Recipe with Roasted Bison & Venison, dry",
      kcalKg: 3719, kcalCup: 422, src: "https://www.tasteofthewildpetfood.com/dog/grain-free/high-prairie-with-roasted-bison-roasted-venison/" },
    { id: "nutro-natural-choice-chicken-brown-rice-dry", species: "dog", form: "dry", brand: "Nutro", name: "Natural Choice Adult Chicken & Brown Rice, dry",
      kcalKg: 3631, kcalCup: 357, src: "https://www.nutro.com/products/dry/adult-farm-raised-chicken-brown-rice-recipe" },
    { id: "merrick-gf-beef-sweet-potato-dry", species: "dog", form: "dry", brand: "Merrick", name: "Grain Free Real Beef & Sweet Potato, dry", alias: "texas",
      kcalKg: 3676, kcalCup: 455, src: "https://www.merrickpetcare.com/shop/grain-free-texas-beef-sweet-potato-dry-dog-food" },
    // Wellness: from the nutrient profile PDF linked on https://www.wellnesspetfood.com/product-catalog/wellness-complete-health-grained-chicken-oatmeal/
    { id: "wellness-complete-health-chicken-oatmeal-dry", species: "dog", form: "dry", brand: "Wellness", name: "Complete Health Adult Deboned Chicken & Oatmeal, dry",
      kcalKg: 3584, kcalCup: 427, src: "https://images.salsify.com/image/upload/s--EhtN0f6e--/w_500/rqth9gubbnyaz0ir4oh7.pdf" },
    { id: "orijen-original-dog-dry", species: "dog", form: "dry", brand: "ORIJEN", name: "Original, dry (US recipe)",
      kcalKg: 3940, kcalCup: 473, src: "https://www.orijenpetfoods.com/en-US/dogs/dog-food/original/ds-ori-original-dog.html" },

    // Cat, dry
    { id: "purina-cat-chow-complete", species: "cat", form: "dry", brand: "Purina Cat Chow", name: "Complete, dry",
      kcalKg: 3688, kcalCup: 411, src: "https://live.purina.com/sites/default/files/product-label-deck-file/2025-08/4501_o450123_cat_chow_complete_dry_cat_food_cb6.pdf" },
    { id: "purina-cat-chow-indoor", species: "cat", form: "dry", brand: "Purina Cat Chow", name: "Indoor Hairball & Healthy Weight, dry",
      kcalKg: 3372, kcalCup: 358, src: "https://live.purina.com/sites/default/files/product-label-deck-file/2024-05/4500-o450023-cat-chow-indoor-hairball-healthy-weight-dry-cat-food-cb7-1.pdf" },
    { id: "friskies-surfin-turfin-dry", species: "cat", form: "dry", brand: "Friskies", name: "Surfin' & Turfin' Favorites, dry", alias: "purina",
      kcalKg: 3573, kcalCup: 392, src: "https://live.purina.com/sites/default/files/product-label-deck-file/2025-05/6001_n600123_friskies_surfin_turfin_favorites_dry_cat_food_vp8.pdf" },
    // The label also says one cup holds about 113 g.
    { id: "purina-pro-plan-cat-chicken-rice-dry", species: "cat", form: "dry", brand: "Purina Pro Plan", name: "Adult Complete Essentials Chicken & Rice, dry",
      kcalKg: 4358, kcalCup: 494, src: "https://live.purina.com/sites/default/files/product-label-deck-file/2025-10/4623_m462325_pro_plan_adult_ce_chicken_rice_dry_cat_food_528.pdf" },
    { id: "hills-sd-cat-adult-indoor-dry", species: "cat", form: "dry", brand: "Hill's Science Diet", name: "Adult Indoor Chicken Recipe, dry",
      kcalKg: 3492, kcalCup: 327, cupOz: 3.3, src: "https://www.hillspet.com/cat-food/sd-feline-adult-indoor-dry" },
    { id: "hills-sd-cat-adult-dry", species: "cat", form: "dry", brand: "Hill's Science Diet", name: "Adult Chicken Recipe, dry",
      kcalKg: 3873, kcalCup: 483, cupOz: 4.4, src: "https://www.hillspet.com/cat-food/sd-feline-adult-dry" },
    { id: "hills-pd-cd-multicare-dry-cat", species: "cat", form: "dry", brand: "Hill's Prescription Diet", name: "c/d Multicare with Chicken, dry", alias: "urinary",
      kcalKg: 3896, kcalCup: 353, cupOz: 3.2, src: "https://www.hillspet.com/cat-food/prescription-diet-cd-multicare-chicken-urinary-care-dry" },
    { id: "rc-indoor-adult-cat-dry", species: "cat", form: "dry", brand: "Royal Canin", name: "Indoor Adult, dry", alias: "feline health nutrition",
      kcalKg: 3534, kcalCup: 325, src: "https://www.royalcanin.com/us/cats/products/retail-products/indoor-adult-dry-cat-food" },
    { id: "rc-vd-urinary-so-dry-cat", species: "cat", form: "dry", brand: "Royal Canin Veterinary Diet", name: "Urinary SO, dry",
      kcalKg: 3659, kcalCup: 315, src: "https://www.royalcanin.com/us/cats/products/vet-products/urinary-so-3901" },
    { id: "iams-indoor-weight-hairball-dry-cat", species: "cat", form: "dry", brand: "IAMS", name: "Proactive Health Adult Indoor Weight & Hairball Care, dry",
      kcalKg: 3364, kcalCup: 302, src: "https://www.iams.com/products/dry/iams-proactive-health-adult-indoor-weight-hairball-care-chicken-turkey" },
    { id: "meow-mix-original-choice-dry", species: "cat", form: "dry", brand: "Meow Mix", name: "Original Choice, dry",
      kcalKg: 3496, kcalCup: 308, src: "https://www.meowmix.com/cat-food/dry/original-choice" },
    { id: "kirkland-cat-chicken-rice-dry", species: "cat", form: "dry", brand: "Kirkland Signature", name: "Chicken & Rice Cat Food, dry", alias: "costco",
      kcalKg: 4008, kcalCup: 443, src: "https://www.costco.com/kirkland-signature-chicken-and-rice-cat-food-25-lbs.product.100334973.html" },

    // Older Purina labels (codes N418620, A414721); they say one cup holds about 113 g and 102 g.
    { id: "purina-one-sensitive-skin-stomach-cat-dry", species: "cat", form: "dry", brand: "Purina ONE", name: "Sensitive Skin & Stomach, dry",
      kcalKg: 3781, kcalCup: 429, src: "https://live.purina.com/sites/default/files/products/files/N418620_Purina_ONE_Sensitive_Skin_Stomach_Formula_Natural_Cat_Food.pdf" },
    { id: "purina-one-indoor-advantage-salmon-cat-dry", species: "cat", form: "dry", brand: "Purina ONE", name: "+Plus Indoor Advantage Real Salmon, dry",
      kcalKg: 3838, kcalCup: 394, src: "https://live.purina.com/sites/default/files/products/files/4147_-_A414721_Purina_ONE_Plus_Indoor_Advantage_Real_Salmon_Natural_Cat_Food_Dry_2E9.pdf" },

    // Dog, wet (a can's weight and calories come from the maker; its volume uses 1.0 g per ml, see the top)
    { id: "hills-pd-id-low-fat-can-dog", species: "dog", form: "wet", brand: "Hill's Prescription Diet", name: "i/d Low Fat Digestive Care, canned 13 oz", alias: "id lowfat",
      kcalKg: 887, unit: { name: "can", g: 370, kcal: 328 }, src: "https://www.hillspet.com/dog-food/prescription-diet-id-low-fat-digestive-care-canned" },
    { id: "hills-pd-id-turkey-can-dog", species: "dog", form: "wet", brand: "Hill's Prescription Diet", name: "i/d Digestive Care Turkey Recipe, canned 13 oz",
      kcalKg: 1013, unit: { name: "can", g: 370, kcal: 374 }, src: "https://www.hillspet.com/dog-food/prescription-diet-id-digestive-care-canned" },
    // The page gives 369 kcal per 13 oz (370 g) can only, so kcal/kg = 369 / 0.370.,
    { id: "hills-sd-adult-chicken-barley-can-dog", species: "dog", form: "wet", brand: "Hill's Science Diet", name: "Adult Chicken & Barley Entrée, canned 13 oz",
      kcalKg: 997, unit: { name: "can", g: 370, kcal: 369 }, src: "https://www.hillspet.com/dog-food/sd-canine-adult-chicken-barley-entree-canned" },
    // 13.5 oz = 383 g; the page doesn't print grams.,
    { id: "rc-vd-gi-low-fat-loaf-can-dog", species: "dog", form: "wet", brand: "Royal Canin Veterinary Diet", name: "Gastrointestinal Low Fat Loaf, canned 13.5 oz", alias: "gi lowfat",
      kcalKg: 895, unit: { name: "can", g: 383, kcal: 345 }, src: "https://www.royalcanin.com/us/dogs/products/vet-products/gastrointestinal-low-fat-loaf-4029" },
    // Purina's labels give kcal/kg and kcal per can; the can's weight is kcal per can / kcal per kg (EN 442 / 1164 = 380 g = 13.4 oz, Pro Plan 437 / 1186 = 368 g = 13 oz).,
    { id: "purina-ppvd-en-can-dog", species: "dog", form: "wet", brand: "Purina Pro Plan Veterinary Diets", name: "EN Gastroenteric, canned 13.4 oz",
      kcalKg: 1164, unit: { name: "can", g: 380, kcal: 442 }, src: "https://live.purina.com/sites/default/files/product-label-deck-file/2025-07/2590_f259023_ppvd_en_gastroenteric_canine_formula_canned_dog_food_b92.pdf" },
    { id: "purina-pro-plan-chicken-rice-entree-can-dog", species: "dog", form: "wet", brand: "Purina Pro Plan", name: "Complete Essentials Chicken & Rice Entrée Classic, canned 13 oz",
      kcalKg: 1186, unit: { name: "can", g: 368, kcal: 437 }, src: "https://live.purina.com/sites/default/files/products/files/4433_-_F443322_Pro_Plan_Complete_Essentials_Chicken_Rice_Entree_Classic_Dog_Food_Wet_DA4.pdf" },
    // 13.2 oz = 374 g and 3.5 oz = 99 g; the pages don't print grams.,
    { id: "pedigree-chopped-ground-dinner-chicken-can", species: "dog", form: "wet", brand: "Pedigree", name: "Chopped Ground Dinner with Chicken, canned 13.2 oz",
      kcalKg: 1171, unit: { name: "can", g: 374, kcal: 439 }, src: "https://www.pedigree.com/products/wet/chopped-ground-dinner-adult-wet-dog-food-can-chicken" },
    { id: "cesar-classic-loaf-filet-mignon-tray", species: "dog", form: "wet", brand: "Cesar", name: "Classic Loaf in Sauce Filet Mignon Flavor, 3.5 oz tray",
      kcalKg: 900, unit: { name: "tray", g: 99, kcal: 90 }, src: "https://www.cesar.com/products/wet/classic-loaf-sauce-filet-mignon" },

    // Cat, wet
    // 5.5 oz = 156 g as printed by Hill's and Wellness; Friskies: 180 / 1156 = 156 g; Royal Canin 5.1 oz = 145 g.,
    { id: "friskies-pate-mixed-grill-can", species: "cat", form: "wet", brand: "Friskies", name: "Paté Mixed Grill, canned 5.5 oz", alias: "purina",
      kcalKg: 1156, unit: { name: "can", g: 156, kcal: 180 }, src: "https://live.purina.com/sites/default/files/product-label-deck-file/2023-05/6055-g605522-friskies-pate-mixed-grill-cat-food-385.pdf" },
    { id: "hills-sd-cat-savory-chicken-can", species: "cat", form: "wet", brand: "Hill's Science Diet", name: "Adult Savory Chicken Entrée, canned 5.5 oz",
      kcalKg: 1164, unit: { name: "can", g: 156, kcal: 181 }, src: "https://www.hillspet.com/cat-food/sd-feline-adult-savory-chicken-entree-canned" },
    { id: "hills-pd-kd-chicken-pate-can-cat", species: "cat", form: "wet", brand: "Hill's Prescription Diet", name: "k/d Kidney Care Pâté with Chicken, canned 5.5 oz",
      kcalKg: 1165, unit: { name: "can", g: 156, kcal: 181 }, src: "https://www.hillspet.com/cat-food/prescription-diet-kd-chicken-kidney-care-canned" },
    { id: "rc-vd-urinary-so-loaf-can-cat", species: "cat", form: "wet", brand: "Royal Canin Veterinary Diet", name: "Urinary SO Loaf in Sauce, canned 5.1 oz",
      kcalKg: 820, unit: { name: "can", g: 145, kcal: 119 }, src: "https://www.royalcanin.com/us/cats/products/vet-products/urinary-so-1254" },
    // Wellness: from the nutrient profile PDF linked on https://www.wellnesspetfood.com/product-catalog/wellness-complete-health-pate-chicken-entree/,
    { id: "wellness-ch-pate-chicken-can-cat", species: "cat", form: "wet", brand: "Wellness", name: "Complete Health Pâté Chicken Entrée, canned 5.5 oz",
      kcalKg: 1393, unit: { name: "can", g: 156, kcal: 217 }, src: "https://images.salsify.com/image/upload/s--pwUHQjSs--/w_500/tacoznabvtnpas5zdxmh.pdf" },

    // Dog, fresh-cooked. Chunks hold air, so these weigh less per cup than water.
    // JustFoodForDogs: kcal from its vet product pages and VetGuide; grams per cup from its feeding guide (Rev 26.3.1,
    // https://cdn.shopify.com/s/files/1/0955/4057/6571/files/Fresh_Feeding_Guide-26.3.1-FreshFrozen.pdf), which gives cups next to ounces in every cell: total ounces / total cups over the medium,
    // large and extra-large cells x 28.35 (Turkey 362.5 oz / 58 cups = 177.2 g; Chicken & Rice 413.25 / 71 = 165.0 g;
    // Beef & Russet Potato 405 / 63.5 = 180.8 g). The guide says cups are an estimate and to weigh the food.
    { id: "jffd-turkey-whole-wheat-macaroni", species: "dog", form: "fresh", brand: "JustFoodForDogs", name: "Turkey & Whole Wheat Macaroni", alias: "jffd just food for dogs",
      kcalKg: 1741, gCup: 177.2, src: "https://vets.justfoodfordogs.com/products/freshfrozen-turkey-whole-wheat-macaroni" },
    { id: "jffd-chicken-rice", species: "dog", form: "fresh", brand: "JustFoodForDogs", name: "Chicken & White Rice", alias: "jffd just food for dogs",
      kcalKg: 1532, gCup: 165.0, src: "https://vets.justfoodfordogs.com/products/freshfrozen-chicken-rice" },
    { id: "jffd-beef-russet-potato", species: "dog", form: "fresh", brand: "JustFoodForDogs", name: "Beef & Russet Potato", alias: "jffd just food for dogs",
      kcalKg: 1559, gCup: 180.8, src: "https://vets.justfoodfordogs.com/products/freshfrozen-beef-russet-potato" },
    // Nom Nom prints "1 cup (8oz measuring cup) = 188 g" and 244 kcal per cup, so kcal/kg = 244 / 188 x 1000.
    { id: "nomnom-turkey-fare", species: "dog", form: "fresh", brand: "Nom Nom", name: "Turkey Fare", alias: "nomnom",
      kcalKg: 1298, kcalCup: 244, gCup: 188, src: "https://www.nomnomnow.com/meals/turkey" },
    { id: "freshpet-roasted-meals-tender-chicken", species: "dog", form: "fresh", brand: "Freshpet", name: "Roasted Meals Tender Chicken", alias: "select",
      kcalKg: 2020, kcalCup: 296, src: "https://www.freshpet.com/products/roasted-meals-tender-chicken-recipe-with-garden-vegetables" },

    // Dog, freeze-dried: 50 kcal per 1/4 cup = 200 kcal per cup
    { id: "stella-chewys-chicken-meal-mixers", species: "dog", form: "freeze-dried", brand: "Stella & Chewy's", name: "Chewy's Chicken Meal Mixers, freeze-dried", alias: "stella and chewys",
      kcalKg: 4440, kcalCup: 200, src: "https://www.stellaandchewys.com/products/chewys-chicken-meal-mixers" }
  ];
  FOODS.forEach(function (f) {
    if (f.gCup) return;
    if (f.kcalCup && f.kcalKg) f.gCup = Math.round(f.kcalCup / f.kcalKg * 10000) / 10;  // kcal per cup / kcal per kg x 1000
    else if (f.form === "wet") f.gCup = Math.round(WET_G_PER_ML * CUP_ML * 10) / 10;
  });
  // A type that isn't listed takes the 10th percentile of the listed foods of that type: nine in ten weigh more
  // per cup, so the meal's volume, and the bowl, come out a little big rather than too small. Raw and homemade
  // food use the fresh-cooked figure, since no raw maker we could read gives a cup weight.
  function p10(form) {
    var g = FOODS.filter(function (f) { return f.form === form && !f.generic; })
      .map(function (f) { return f.gCup; }).sort(function (a, b) { return a - b; });
    return g[Math.floor((g.length - 1) * 0.1)];
  }
  var LIKE = { dry: "dry", fresh: "fresh", raw: "fresh", homemade: "fresh", "freeze-dried": "freeze-dried" };
  FOODS.forEach(function (f) { if (f.generic && LIKE[f.form]) f.gCup = p10(LIKE[f.form]); });
  var api = { FOODS: FOODS, WET_G_PER_ML: WET_G_PER_ML };
  if (typeof module !== "undefined" && module.exports) module.exports = api; else root.BowlFitFoods = api;
})(this);
