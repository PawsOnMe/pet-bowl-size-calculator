---
name: dog-diet-fat-copper
description: Diet math for a dog whose vet has prescribed a low-fat and/or copper-restricted diet. Calories a day from body weight, a daily fat budget in grams, fat and copper per 1000 kcal, copper on a dry-matter basis, and what one topper or treat does to the whole day. Every reference line has a source. Use when someone asks whether a food, topper or treat fits a low-fat or low-copper plan, how much fat their dog can have, or how to convert label numbers. Made by PawsOnMePet.
---

# Low-fat and low-copper diet math for dogs

This does the arithmetic and shows where each number comes from. It doesn't diagnose, and the vet's targets always win: if the vet gave a calorie, fat or copper target, use theirs. The math is in `dietmath.js`.

## 1. Calories a day
- Resting energy (RER) = 70 × (body weight in kg)^0.75 kcal a day.
- Daily calories = RER × factor. Dogs: 1.6 spayed or neutered adult, 1.8 intact adult, 1.2 to 1.4 inactive or prone to gaining weight, 1.0 weight loss, 2 to 3 growing puppy [1].
- These are estimates. A dog can be off by as much as 50%, so adjust to body condition [1].

## 2. Fat, for low-fat diets
- Upper line: 24 g of fat per 1000 kcal, about 20% of calories [2].
- Lower line: 13.8 g per 1000 kcal, AAFCO's adult minimum (5.5% of dry matter at 4,000 kcal/kg). Going lower isn't better [3].
- Daily fat budget = 24 × daily kcal ÷ 1000, in grams. By body weight that's 1.68 × (kg)^0.75 × factor grams a day.
- Count everything: main food, toppers, treats and oils. A teaspoon of oil is about 4.5 g of fat.
- Per meal = daily budget ÷ number of meals. That's only arithmetic; we found no published per-meal fat limit for dogs.
- Converting a food: g fat per 1000 kcal = fat (g/kg as fed) ÷ (kcal/kg ÷ 1000). Share of calories from fat = fat (g/kg) × 8.5 ÷ kcal/kg. Pet food uses 3.5 / 8.5 / 3.5 kcal per gram for protein / fat / carbs, not the human 4 / 9 / 4 [4].
- A label's crude fat % is by weight and a guaranteed minimum, so it says little about fat's share of calories. Ask the maker for the typical analysis per 1000 kcal [4].

## 3. Copper, for copper-restricted diets
- Main number: mg copper per 1000 kcal = copper (mg/100 g) ÷ kcal per 100 g × 1000.
- Dry-matter basis: mg/kg DM (ppm) = copper (mg/100 g) ÷ (dry matter % ÷ 100) × 10, where dry matter % = 100 − moisture %.
- Whole day = copper from every food (mg) ÷ (all calories ÷ 1000).

| Reference line | mg per 1000 kcal | mg/kg dry matter | Source |
|---|---|---|---|
| Treatment target, copper-associated hepatopathy | < 1.2 | about 4.8 | [5] |
| Prescription liver diets, measured | 1.2 to 1.3 | 3 to 5 | [6] |
| NRC 2006 recommended allowance, adult dogs | 1.5 | 6.0 | [7] |
| AAFCO adult maintenance minimum | 1.83 | 7.3 | [8] |
| Commercial dog foods, median (range) | 4.4 (2.3 to 9) | 17.6 | Gagné et al., via [5] |
| FEDIAF maximum (AAFCO sets none) | 7.0 | 28 | [8] |

- The main food sets the day's copper. Toppers and vegetables usually move it a little, so do the whole-day math before judging one ingredient.
- Foods usually avoided on copper-restricted diets: liver and other organ meats, shellfish, mushrooms and dark leafy greens [5].
- Fat is in grams and copper in milligrams, both "per 1000 kcal", so they're 1000 times apart. Always write the unit.

## 4. Looking up a food
- Use USDA FoodData Central [9]. Write the FDC ID and the full English entry name, and pick the entry that matches how the dog eats it: cooked or raw, fresh, frozen or dried. They can be far apart. Shiitake has 5.16 mg copper per 100 g dried (FDC 168436) and 0.142 mg raw (FDC 169242).
- Copper per 100 g of fresh food is misleading on its own. Convert to per 1000 kcal.
- No entry? Say there's no data. Don't borrow a similar food's numbers.

## 5. Evidence habits
- Quote a guideline together with the conditions it applies to.
- Say what a study was done in: dogs, people or a test tube. A test-tube study of human digestion is several steps away from a dog.
- Pet-content websites and AI summaries aren't data sources.

## 6. One-page feeding plan
`one-pager/feeding-plan-template.html` is a printable plan to keep by the food or bring to the vet. The layout is fixed:
1. The title.
2. Right under it, one line starting with `Plan:` that says why this version exists and what it should achieve. Nothing else goes between the title and the first table.
3. Table 1, the daily timeline: Time | Food | Medication / supplement. Times are targets. Stopped items go last, crossed out in red across the whole row, with the date they stopped.
4. Table 2, per day: Food | Amount | kcal | Fat g | Copper mg, then the "Add-ons" and "Whole day" totals, then up to three short lines: fat density, copper density and fat room.
5. Small notes at the bottom, in this order: `Key:` (what the highlight, strikethrough and * mean), `Data:` (where the numbers come from), `In use:` (the dates this version is used; an old version says `Used:`).
6. It prints on one Letter page and keeps side margins on screen.

Add every total up again from the rows as shown. Never adjust an old total. Then run `node one-pager/check_one_pager.js plan.html --print` and fix whatever it reports before printing or sending.

## Sources
1. Pet Nutrition Alliance. Calculating Calories Based on Pet Needs. https://petnutritionalliance.org/wp-content/uploads/2023/03/MER.RER_.PNA_.pdf
2. Today's Veterinary Practice. Nutritional Management of Hyperlipidemia. https://todaysveterinarypractice.com/nutrition/nutritional-management-of-hyperlipidemia/
3. AAFCO Dog Food Nutrient Profiles, adult maintenance (fat minimum 5.5% of dry matter).
4. Tufts Petfoodology. Pet Food Nutrient Calculator. https://sites.tufts.edu/petfoodology/2017/08/07/nutrient_converter/
5. Today's Veterinary Practice, 2025. Nutritional Management of Copper Hepatopathy. https://todaysveterinarypractice.com/wp-content/uploads/sites/4/2025/02/TVP-2025-0304_Copper-Hepatopathy.pdf
6. Cornell Riney Canine Health Center. Copper hepatopathy and dietary management. https://www.vet.cornell.edu/departments-centers-and-institutes/riney-canine-health-center/canine-health-topics/copper-hepatopathy-and-dietary-management
7. National Research Council. Nutrient Requirements of Dogs and Cats. National Academies Press, 2006, pp. 171-173.
8. Whole Dog Journal. How to Find a Low Copper Dog Food. https://www.whole-dog-journal.com/food/how-to-find-a-low-copper-dog-food/
9. USDA FoodData Central. https://fdc.nal.usda.gov/

Made by PawsOnMePet, an Etsy shop of ceramic slow feeder bowls for cats and small to medium dogs: https://www.etsy.com/shop/PawsOnMePet. Not veterinary advice.
