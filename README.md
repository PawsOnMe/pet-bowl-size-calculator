# Pet Nutrition & Bowl Calculator

A healthy nutrition plan starts with how much and what your pet eats. Enter your dog's or cat's weight and food, and this free calculator gives you daily calories and how much to feed, for any breed or mix, then the right bowl: a bowl height (floor to the top edge), a dish width and a capacity. It tells you where each number comes from.

**Use it:** https://pawsonme.github.io/pet-bowl-size-calculator/

Made by **PawsOnMe**, an Etsy shop of ceramic slow feeder bowls for cats and dogs: https://www.etsy.com/shop/PawsOnMePet

## Quick answers

**Slow feeder or regular bowl, raised or not: which one?**
A plain bowl on the floor suits most healthy dogs and cats. We found no vet guideline saying they need more. A slow feeder suits dogs that gulp [4], and for cats a vet consensus recommends food puzzles and several small meals a day [21]. For large and giant breeds, height matters: in the one study that measured it, the extra bloat risk came with bowls raised 1 ft (30.5 cm) or less in large breeds and above 1 ft in giant breeds (details below) [1][2]. A raised bowl does help some dogs, on a vet's plan: dogs with megaesophagus eat with their front legs up and stay upright for at least 10 to 15 minutes after meals [22], and an arthritis site run by a veterinary surgeon and rehab specialist suggests about shoulder height for dogs with front-leg or neck arthritis, which is expert advice rather than a study result [23]. More detail, with sources, is in [`SKILL.md`](SKILL.md).

**Ceramic, stainless steel (304), titanium or plastic?**
How you wash the bowl matters more than what it's made of. On 68 dog dishes, a week of FDA's hygiene steps cut bacteria, and water hotter than 71 °C (160 °F) beat cold or lukewarm water [24]. Studies on material disagree: in 96 dog bowls from homes, metal carried more bacteria than plastic [25], while in a small test of new water bowls plastic ended with the highest average count, though not significantly, and ceramic had the most kinds of bacteria [26]. With ceramic, the glaze touches the food, and FDA says lead in pottery may leach into food [27], so pick ceramic sold as food safe with a lead and cadmium test. With steel, ask the grade: type 201 has less nickel and more manganese and was first made to save nickel [28]. We found no study on titanium pet bowls.

**How high should my dog's food bowl be?**
No veterinary guideline sets a height. A common rule of thumb from pet-product guides puts the top edge of the bowl between your dog's elbow height and about 2 to 3 inches (5 to 7.5 cm) below it, measured with the dog standing on a flat floor. A floor bowl is fine for most healthy dogs [52]. For large and giant breeds, a study found the bloat risk depended on whether the bowl was above or below 1 ft (30.5 cm); see the next answer.

**Are raised bowls safe for large dogs?**
It depends on the height and on how big the breed is. A study followed 1,637 dogs of 11 large and giant breeds and asked whether the bowl was on the floor, raised 1 ft (30.5 cm) or less, or raised more than 1 ft [1][2]. In this study, large meant breeds of 23 to 45 kg (50 to 99 lb) and giant meant over 45 kg (99 lb) [30]. Bloat (GDV) cases per 1,000 dog-years:

| Breed size | Floor | Raised 1 ft (30.5 cm) or less | Raised more than 1 ft |
|---|---|---|---|
| Large, 23 to 45 kg | 18 | 56, 3.06 times the risk | 29, not a significant difference |
| Giant, over 45 kg | 17 | 15, not a significant difference | 39, 2.29 times the risk |

So going by this study, a raised bowl for a large breed would sit above 30.5 cm and for a giant breed at 30.5 cm or lower. It is one study with 98 bloat cases split into small groups; a review says the height results could be chance, and the authors didn't explain them [2]. An internet survey with 1,114 bloat cases found no clear effect of bowl height, though it published no numbers on this [2][29]. Dogs with megaesophagus are fed from a raised position on purpose [53]: front legs higher than back legs, then upright for at least 10 to 15 minutes after meals [22]. If you're unsure, ask your vet.

**How tall should a cat's bowl be?**
Most healthy cats eat fine from the floor. For an older or stiff cat, a small lift, with the top edge of the bowl a little below the elbow, can make meals easier. No study has measured this.

**How wide should a cat's bowl be? Is whisker fatigue real?**
In a study of 38 cats, whisker-friendly dishes made no difference to time spent eating, food dropped or food eaten, though 63% of owners said their cat preferred the wider dish [3]. A wide, shallow dish at least as wide as the whisker span is a cheap thing to try.

**Do slow feeder bowls work?**
Yes, at slowing a fast eater down. In a study of 10 pet dogs, meals took significantly longer from a slow feeder than from a plain bowl, and the dogs were still slower after nine days of practice [4]. Vet sources recommend slow feeders and puzzle feeders for three reasons:

- Bloat (GDV) in big dogs: eating fast was a risk factor in two Purdue studies [1][20], and VCA Animal Hospitals advises feeding large and giant dogs from the floor with a puzzle feeder or slow-down bowl [31].
- Gulping, vomiting and gas: Veterinary Partner, the Veterinary Information Network's site for pet owners, says small meals in feeders prevent gulping and may lessen vomiting in cats [34]. Its article on gas in dogs says dogs swallow more air when they feel they must eat quickly, and suggests puzzle feeding bowls to slow them down [35].
- Cats: a feline vet consensus recommends frequent small meals from puzzle feeders, which it says increase activity and help weight control, and notes that cats that gorge may vomit [21]. In vet case reports, overweight cats lost 6 to 20% of their body weight with food puzzles [32].

Owners say the same in their own words, though these are personal reports, not research. In a 2026 Reddit thread about slow feeders, a reply with 170 upvotes says the poster's small dog throws up without one, and another says it "immediately stopped the problem" for a dog that gulped its food and vomited [36].

Mealtime also gets more interesting: in a small study of 4 dogs, a feeding toy made meals last longer and kept the dogs more active, and their stress hormone (cortisol) was lower after a week than on the first day [33]. No trial has yet tested whether a slow feeder prevents bloat itself; VCA lists it alongside smaller, more frequent meals [31].

**How big should the bowl be?**
Big enough for one meal with room to spare: 1.5 times the meal volume for a regular bowl, 2 times for a slow feeder, because the ridges take up space. 1 US cup is 236.6 ml. If you weigh your pet's food or feed it by the can, pick the food in the calculator and it turns grams, ounces or cans into volume (see [Foods the calculator knows](#foods-the-calculator-knows)). The 1.5 and 2 are our rule of thumb.

**How much should I feed my dog or cat?**
Start with the chart on the food bag, or work it out: resting energy is 70 × (weight in kg)^0.75 kcal a day, times a life-stage factor, for example 1.6 for a spayed or neutered adult dog, 1.2 for a spayed or neutered adult cat, and 2 to 3 for puppies and kittens [5]. Very active cats, like ones that go outdoors, need about a third more than indoor or neutered cats (100 against 75 kcal per kg^0.67 a day) [51], so the calculator uses 1.6 for them instead of 1.2 [38]. Divide by the calories per cup on the bag (or, if you weigh food, by the calories per kg, times 1,000 for grams), then pick a bowl that holds one meal with room to spare. Pets can differ from these estimates by as much as 50%, so check body condition and adjust [5]. For weight loss, ask your vet for a plan.

**What should I feed?**
A food whose label says it is complete and balanced for your pet's life stage: growth, adult maintenance or all life stages. For a puppy that will be a large dog, the label should say the food includes growth of large size dogs [6]. That rule exists because large-breed puppies need tighter calcium limits [7].

**Dry, wet, freeze-dried, fresh or raw: what should my dog eat?**
Any type can work if the label says complete and balanced for your dog's life stage [8]. For most healthy dogs, canned or dry doesn't matter, so go by your dog, your budget and your routine [9]. Treat freeze-dried food as raw unless the pack says it was cooked, because freeze-drying only reduces germs [10][11]. Vet groups advise against raw diets because of Salmonella, Listeria and drug-resistant bacteria [11][12]. Homemade food needs a recipe from a board-certified veterinary nutritionist; in one study 95% of 200 published recipes fell short on at least one nutrient [13]. Switch foods over at least 3 days [14]. More detail, with sources, is in [`SKILL.md`](SKILL.md).

**Should I add water to my dog's kibble?**
It's fine, and it helps dogs that need more water, such as dogs prone to some bladder stones [15], and dogs with sore or missing teeth [9]. It won't help with weight loss, because dogs eat more to make up for it [16], and it didn't improve digestion in a puppy study [17]. In large and giant breeds, soaked kibble with citric acid in the ingredients was linked to bloat in one study [18], so check the label and feed two or more meals a day. Pick up soaked leftovers and refrigerate or throw them out [19].

**Short legs, long ears or a flat face?**
Short-legged dogs (dachshund, corgi, basset): measure the elbow height, because size charts based on weight don't account for leg length. Long-eared dogs often dip their ears in the bowl, so a narrower opening or a tilted bowl helps. Flat-faced pets usually find wide, shallow or tilted bowls easier. These are practical tips, not study results.

## How the numbers are worked out

| Output | Formula | Evidence |
|---|---|---|
| Bowl height (floor to the top edge) | from elbow height down to 7.5 cm (3 in) below it | rule of thumb |
| Large breed, adults 23 to 45 kg | floor, or a bowl whose top edge is above 30.5 cm (1 ft) and up to elbow height | cohort study [1][30], review [2] |
| Giant breed, adults over 45 kg | floor, or a bowl whose top edge is at 30.5 cm (1 ft) or lower | cohort study [1][30], review [2] |
| Cat dish width | at least the whisker span | 38-cat study [3] |
| Calories a day | resting energy (RER) = 70 × kg^0.75, times a factor set by life stage and activity: dog 1.6 spayed or neutered, 1.8 intact, 1.2–1.4 not very active, 1.86 active adult, 2.0 working, 2–3 growing; cat 1.2, 1.4, 1.0, 1.6 very active or outdoors, 2–3. Divided by kcal per cup, or for grams by kcal per kg × 1,000. A tap-to-open table on the page lists every level with the calories for the pet | Pet Nutrition Alliance [5]; Merck [38]; National Research Council [39] (its calories by weight work out to 1.36 × RER inactive, 1.86 active adult, 1.5 older active, 2.0 young adult active); working detection dogs [40]; racing sled dogs [41]; very active cats [51]: 100 kcal per kg^0.67 against 75 for indoor or neutered cats, a third more, so 1.2 × 4/3 = 1.6 |
| Anything your vet is watching (optional, folded away) | what vet sources say about feeding for kidney values to watch (renal diet from stage 2) [42], liver values to watch (most need no fat cut; protein cut only with hepatic encephalopathy; low-copper diet for copper build-up) [43], pancreatitis (dogs under 20 g fat per 1,000 kcal; cats moderately less fat) [44], high triglycerides or cholesterol (no more than 24 g fat per 1,000 kcal) [45], and weight loss (start at 60% of the calories for dogs, 70% for cats; lose about 1% of body weight a week) [46] | as listed |
| Brings food back up without retching (regurgitation) | its own tip: that is usually the food pipe (esophagus), not the stomach, so a vet should check it; aim for the top of the height range so gravity helps, and give smaller meals more often; higher rims come first among equally good bowls. No slow feeder and no change to bowl size, because this is not eating fast. For a large or giant dog the tip first says that for megaesophagus vet guides advise a raised bowl so gravity helps food reach the stomach [22][53], then that raising it is the vet's call because raised bowls have been linked to bloat in large breeds [1]. The one study of upright feeding (12 dogs with megaesophagus in Bailey chairs) found food cleared very differently from dog to dog [Haines 2019, see SKILL.md] | Merck [47][22][48], Hill's [53], Glickman [1] |
| Lip licking, dry heaving or being sick on an empty stomach for too long (e.g. often after overnight) (dogs) | its own tip: lip licking can be a sign of nausea [49]; vets use smaller meals through the day and a small late-evening meal, sometimes with medicine, and 12 of 17 dogs improved in a study of 20 [50]. No bowl change | [49][50] |
| What your pet eats now | each food's amount × its calories (the maker's figures) × meals a day, shown next to the calories a day. Water or broth mixed in counts as 0 kcal. For a broth, type which one in the box under that line: if USDA FoodData Central has a ready-to-serve broth that matches, its calories are counted (amount × kcal per 100 ml × meals a day) and the entry is named and linked. If nothing matches, pick "Homemade bone broth" and type the calories in one cup | maker calorie statements; broth calories from [USDA FoodData Central](https://fdc.nal.usda.gov/), branded foods, with a link to the entry used |
| Capacity | meal volume × 1.5 (× 2 for a slow feeder), rounded up to 50 ml. Meal volume = cups × 236.6 ml, or grams ÷ the food's grams in one cup × 236.6 ml (1 oz = 28.35 g; a can is its net weight), added up over the foods in the meal. Change the meals a day after the amounts are in and the calculator keeps the food a day: one meal instead of three puts three times as much in that meal, so the bowl has to hold three times as much. | rule of thumb; grams per cup from the makers (below) |

Everything is in [`bowlfit.js`](bowlfit.js), with no dependencies, the foods are in [`foods.js`](foods.js), and both are tested in [`test/`](test). The rules and sources are also in [`data/guidance.json`](data/guidance.json).

```js
const { recommend } = require("./bowlfit.js");
recommend({ species: "dog", unit: "cm", elbow: 11, cupsPerMeal: 0.5, fastEater: true, shortLegs: true });
// bowl height 3.5 to 11 cm (floor to top edge), holds at least 250 ml, slow feeder worth trying
recommend({ species: "dog", elbow: 65, size: "giant" });
// on the floor, or raised no higher than 30.5 cm (1 ft)
recommend({ species: "dog", unit: "in", elbow: 9, foods: [
  { id: "hills-pd-id-turkey-can-dog", amount: 150, unit: "g" },   // unit: "g", "oz", "cups" or "unit" (cans)
  { id: "nomnom-turkey-fare", amount: 40, unit: "g" }] });
// bowl height 15.4 to 22.9 cm (floor to top edge), holds at least 350 ml
```

## Foods the calculator knows

The bowl size depends on volume, so a meal weighed in grams or ounces, or fed by the can, is turned into cups with the food's weight per cup. Nobody has to weigh a cup of food: pick the food, or its type if the brand isn't listed. [`foods.js`](foods.js) links every food to where its numbers came from, checked on the makers' US websites on 15 November 2026.

| Food | Grams in one level US cup (236.6 ml) | Why |
|---|---|---|
| Dry food on the list | the maker's kcal per cup ÷ kcal per kg × 1,000, or the cup weight printed on the label | US labels state both calorie figures. Hill's also prints the weight of one cup, and it matches the calorie figures within 0.2% on all 14 Hill's dry foods listed. Purina labels that print grams per cup match too. |
| Dry food not on the list | 86.1 g, the 10th percentile of the 50 listed dry foods (they range from 77 to 125 g) | Nine in ten weigh more per cup, so the bowl comes out a little big rather than too small. |
| Wet food (can, pouch, tray) | 236.6 g, that is 1.0 g per ml | No maker we checked gives a cup weight for canned food; Hill's says cups are estimated from grams. Canned food is mostly water and weighs about 1.05 to 1.10 g per ml with no air in it (composition model of Choi and Okos [37]; Hill's i/d Low Fat canned at 75% water works out to 1.08). Rounding down to 1.0 allows for some air, so the bowl errs big. |
| Fresh-cooked food on the list | from the maker: JustFoodForDogs' feeding guide gives cups next to ounces (165 to 181 g a cup), Nom Nom prints 188 g, Freshpet's kcal per cup ÷ kcal per kg gives 146.5 g | Chunks hold air, so fresh food weighs less per cup than water: 0.62 to 0.79 g per ml. |
| Fresh-cooked, raw or homemade food not on the list | 146.5 g, the 10th percentile of the listed fresh foods | No raw food maker we could read gives a cup weight, so raw uses the fresh figure, which errs big for dense ground raw. |
| Freeze-dried food | 45 g: Stella & Chewy's Meal Mixers, 4,440 kcal per kg and 50 kcal per ¼ cup | The one freeze-dried food whose maker gives calories per cup. This is dry from the bag; add any water you mix in as its own line. |
| Water or broth mixed in | 236.6 g (1 g per ml) | Mostly water. It counts as 0 kcal unless the broth typed in is found at USDA FoodData Central. Only a ready-to-serve liquid broth counts as a match (a serving in ml, or of 100 g and up, at 60 kcal per 100 ml or less, with broth or stock in its name), not a powder or concentrate, because the amount typed is what goes in the bowl. |
| Homemade bone broth | 236.6 g (1 g per ml) | Counts as 0 kcal until the calories in one cup are typed in. |
| One can, pouch or tray | its net weight from the maker; when only ounces are printed, × 28.35 g; when neither, kcal per can ÷ kcal per kg | |

Foods aren't listed when the maker's own numbers disagree (Hill's k/d dry cat food: 408 kcal per cup, but a cup weighing 4.5 oz would hold 521 kcal), or when the maker's site gives no calorie statement or cup figure we could read (Instinct, Sheba, Fancy Feast adult pâté, The Farmer's Dog, Ollie, Primal). Pick the type for those.

## Use it with an AI agent

`SKILL.md` makes this folder an agent skill. In Claude Code, copy the folder into `~/.claude/skills/` and ask "what size bowl does my dog need?". `llms.txt` has a short summary for AI crawlers.

## Second skill: low-fat and low-copper diet math

[`skills/dog-diet-fat-copper`](skills/dog-diet-fat-copper/SKILL.md) is for dogs whose vet has prescribed a low-fat or copper-restricted diet. It works out calories from body weight, a daily fat budget in grams (24 g per 1000 kcal), fat and copper per 1000 kcal, copper on a dry-matter basis, and what one topper does to the whole day, with a source for every reference line. The math is in [`dietmath.js`](skills/dog-diet-fat-copper/dietmath.js), tested in [`test/`](test). It also has a one-page feeding plan template and a checker that adds every total up again from the rows. Not veterinary advice; the vet's targets win.

## Our bowls

The calculator also checks your numbers against the bowls we make, every size of each, sold-out ones included. Sizes as listed in our shop, November 2026:

| Bowl | Across | Tall | Holds |
|---|---|---|---|
| Lilac flower ceramic slow feeder plate | 14.8 cm (5.8 in) | 3.5 cm (1.4 in) | 310 ml |
| Butter yellow ceramic slow feeder plate, medium | 15.5 cm (6.1 in) | 4 cm (1.6 in) | 400 ml |
| Pink or butter yellow ceramic slow feeder plate, large | 19.1 cm (7.5 in) | 4 cm (1.6 in) | 650 ml |
| Lilac flower slow feeder on a pedestal | 14.8 cm (5.8 in) | 8.5 cm (3.3 in) | 310 ml |
| Sage green raised tilted slow feeder | 14.8 cm (5.8 in) | 11 cm (4.3 in) | 200 ml |
| Two-tone raised tilted flower slow feeder | 14.5 cm (5.7 in) | 10.5 cm (4.1 in) | 200 ml |
| Large dog ceramic slow feeder Pink Planet style (optional bamboo stand, 7 cm / 2.8 in tall) | 21.6 cm (8.5 in) | 3.5 cm (1.4 in) | about 650 ml (our estimate from its size) |
| The same Pink Planet plate on its bamboo stand | 21.6 cm (8.5 in) | about 7.5 cm (3 in), as the plate sits down into the stand | about 650 ml |
| Pink raised tilted food bowl, waffle cone foot (also with a smooth pink foot) | 13 cm (5.1 in) | 11.5 cm (4.5 in) | about 350 ml |
| Yellow raised water bowl, waffle cone foot (also with a smooth pink foot) | 13 cm (5.1 in) | 10 cm (3.9 in) | about 350 ml |

Most are made for cats and small to medium dogs; the Pink Planet plate is made for medium to large dogs. Colours of the same size fit the same, so they count as one. Before you type anything, the calculator shows our six best sellers, the same for a cat or a dog (lilac plate, two-tone raised flower, Pink Planet, lilac pedestal, sage green, butter yellow). Then it shows three bowls and re-ranks them with every number you add: first the ones that may fit, then the closest, each saying roughly how far it is from your numbers, as a reference. When a slow feeder is optional (no fast eating ticked), those three go by the other numbers alone and the two closest slow feeders follow, five bowls in all. When one is worth trying, it shows three slow feeders, ranked on all the numbers together; bowls that aren't slow feeders only come in if there are fewer than three slow feeders to show. Whenever slow feeders are picked and the suggested height starts above 5 cm, where a plate on the floor can't reach, the raised ones (on a foot or on their own stand) come before the flat ones. At least one of the first two bowls is always a slow feeder, and it shows three to five bowls. A flat plate can still come up when the bowl has to be raised: its note says how tall a stand would bring it into your range ("suggest using a stand about 9 to 15 cm (3.5 to 5.9 in) tall to increase the bowl height"), and so does any bowl more than 5 cm short. For a bowl sold with or without its stand, the note says which of the two it means and how the other compares ("a bit shorter than the suggested 12.2 cm with the stand, even shorter without it"). It shows one size of each bowl, the size closest to your numbers, and the card opens the bowl on Etsy with that size picked. A card keeps the bowl's own photo whatever the colour; only a different size shows that size's photo, and a stand shows its own photo only when the bowl's photo doesn't show the stand already. A bowl too small for one meal always comes after the bowls that can hold one, the bigger ones first, so the whole day's food in one meal puts our biggest bowls first. For a large breed with an elbow height, the elbow rule decides, as for any dog. Without an elbow height, it suggests bowls on the floor or raised above 1 ft, because raised bowls of 1 ft or less were linked to bloat and above 1 ft was not significantly different [1]; all our raised bowls are under 1 ft, so that's the flat plates. A giant breed gets anything up to 1 ft. With a flat face or long ears ticked, the result adds "Tilted bowl: Worth trying" after the slow feeder line, and our tilted bowls come first.

Shop: https://www.etsy.com/shop/PawsOnMePet

## Sources

1. Glickman LT, et al. Non-dietary risk factors for gastric dilatation-volvulus in large and giant breed dogs. JAVMA, 2000. https://pubmed.ncbi.nlm.nih.gov/11128539/
2. Buckley L. Are dogs that are fed from a raised bowl at an increased risk of gastric dilation volvulus compared with floor-fed dogs? Veterinary Evidence. https://www.pure.ed.ac.uk/ws/portalfiles/portal/59772063/57_599_1_PB.pdf
3. Slovak JE, Foster TE. Evaluation of whisker stress in cats. Journal of Feline Medicine and Surgery, 2021. https://pmc.ncbi.nlm.nih.gov/articles/PMC10812207/
4. Buckley LA, Lees J. Go slow feeding bowls: how effective are they at getting dogs to eat more slowly? Veterinary Evidence Today conference poster, 2016. https://hau.repository.guildhe.ac.uk/id/eprint/15072/

5. Pet Nutrition Alliance. Calculating Calories Based on Pet Needs. https://petnutritionalliance.org/wp-content/uploads/2023/03/MER.RER_.PNA_.pdf
6. Merck Veterinary Manual. Dog and Cat Foods. https://www.merckvetmanual.com/management-and-nutrition/nutrition-small-animals/dog-and-cat-foods
7. Whole Dog Journal. In the Fine Print: Nutritional Adequacy Statements. https://www.whole-dog-journal.com/food/in-the-fine-print-nutritional-adequacy-statements/
8. AAFCO. Reading Labels. https://www.aafco.org/consumers/understanding-pet-food/reading-labels/
9. Tufts Petfoodology. Should I feed canned or dry food? 2016. https://sites.tufts.edu/petfoodology/2016/03/22/should-i-feed-canned-or-dry-food/
10. Reboul et al. Cornell study of 112 commercial cat foods, 2025. https://pmc.ncbi.nlm.nih.gov/articles/PMC12460818/
11. CDC. Pet Food Safety. https://www.cdc.gov/healthy-pets/about/pet-food-safety.html
12. AVMA. Raw or undercooked animal-source protein in cat and dog diets. https://www.avma.org/resources-tools/avma-policies/raw-or-undercooked-animal-source-protein-cat-and-dog-diets
13. Stockman et al. 200 homemade dog food recipes, JAVMA 2013 (UC Davis summary). https://ccah.vetmed.ucdavis.edu/sites/g/files/dgvnsk4586/files/local_resources/pdfs/Homemade_dog_food_recipes_July-15-2013_UCD-News.pdf
14. WSAVA. Frequently Asked Questions and Myths. https://wsava.org/wp-content/uploads/2020/01/Frequently-Asked-Questions-and-Myths.pdf
15. Lulich et al. ACVIM small animal consensus on the treatment and prevention of uroliths in dogs and cats. Journal of Veterinary Internal Medicine, 2016. https://pmc.ncbi.nlm.nih.gov/articles/PMC5032870/
16. Alexander et al. Hydrated kibble and food intake in 46 dogs, 2017. https://pubmed.ncbi.nlm.nih.gov/29152246/
17. Zhang et al. Soaked vs dry kibble in 20 beagle puppies. Metabolites, 2022. https://pmc.ncbi.nlm.nih.gov/articles/PMC9697261/
18. Raghavan M. PhD dissertation, Purdue University, 2002 (106 bloat cases, 212 controls). https://docs.lib.purdue.edu/dissertations/AAI3099198
19. FDA. Tips for Safe Handling of Pet Food and Treats. https://www.fda.gov/animal-veterinary/animal-health-literacy/tips-safe-handling-pet-food-and-treats
20. Glickman LT, et al. Multiple risk factors for the gastric dilatation-volvulus syndrome in dogs: a practitioner/owner case-control study. JAAHA, 1997. https://pubmed.ncbi.nlm.nih.gov/9138229/
21. Sadek T, et al. Feline feeding programs: addressing behavioural needs to improve feline health and wellbeing. AAFP consensus statement, Journal of Feline Medicine and Surgery, 2018. https://pmc.ncbi.nlm.nih.gov/articles/PMC11343346/
22. Merck Veterinary Manual. Dilatation of the Esophagus in Small Animals. https://www.merckvetmanual.com/digestive-system/diseases-of-the-esophagus-in-small-animals/dilatation-of-the-esophagus-in-small-animals
23. Canine Arthritis Resources and Education (CARE). Food bowls: How can I make it easier for my dog to eat? https://caninearthritis.org/article/food-bowls-raised-feeding-stations/
24. Luisana E, et al. Survey evaluation of dog owners' feeding practices and dog bowls' hygiene assessment in domestic settings. PLOS ONE, 2022. https://pubmed.ncbi.nlm.nih.gov/35385485/
25. Raspa F, et al. Pet feeding habits and the microbiological contamination of dog food bowls: effect of feed type, cleaning method and bowl material. BMC Veterinary Research, 2023. https://pmc.ncbi.nlm.nih.gov/articles/PMC10701922/
26. Wright C, Carroll A. Microbiological assessment of canine drinking water and the impact of bowl construction material. Poster, 69th Annual Meeting of the European Federation of Animal Science, 2018. https://pure.hartpury.ac.uk/en/publications/microbiological-assessment-of-canine-drinking-water-and-the-impac/
27. FDA. Lead in Food and Foodwares. https://www.fda.gov/food/environmental-contaminants-food/lead-food-and-foodwares
28. Cleveland-Cliffs. Type 201 stainless steel product data. https://d1io3yog0oux5.cloudfront.net/_464c1f648dd1e0c96c45d68cdce1cf31/clevelandcliffs/db/1190/10507/file/CLF_ProductData_201SS_052021.pdf
29. Pipan M, et al. An Internet-based survey of risk factors for surgical gastric dilatation-volvulus in dogs. JAVMA, 2012. https://pubmed.ncbi.nlm.nih.gov/22657929/
30. Glickman LT, et al. Incidence of and breed-related risk factors for gastric dilatation-volvulus in dogs. JAVMA, 2000. https://pubmed.ncbi.nlm.nih.gov/10638316/
31. VCA Animal Hospitals. Nutritional considerations for large and giant breed dogs. https://vcahospitals.com/know-your-pet/nutritional-considerations-for-large-and-giant-breed-dogs
32. Dantas LM, et al. Food puzzles for cats: feeding for physical and emotional wellbeing. Journal of Feline Medicine and Surgery, 2016. https://pmc.ncbi.nlm.nih.gov/articles/PMC11148901/
33. Boonhoh W, et al. Effect of feeding toy and the presence of a dog owner during the feeding time on dog welfare. Veterinary World, 2023. https://pubmed.ncbi.nlm.nih.gov/37766708/
34. Yuschak S. Mealtime Enrichment for Cats. Veterinary Partner (VIN), revised 2024. https://veterinarypartner.vin.com/default.aspx?pid=19239&catId=102901&Id=9956352
35. Brooks W. Flatulence in Dogs. Veterinary Partner (VIN), revised 2026. https://veterinarypartner.vin.com/default.aspx?pid=19239&catId=254092&id=4952806
36. r/dogs. Slow Feeders Everywhere. Reddit owner discussion, 166 comments, 2026. https://www.reddit.com/r/dogs/comments/1vjyw4w/
37. Choi Y, Okos MR. Effects of temperature and composition on the thermal properties of foods. In: Food Engineering and Process Applications, vol. 1, 1986. Equations for density from water, protein, fat, carbohydrate, fiber and ash, as given in the ASHRAE Handbook chapter Thermal Properties of Foods (copy: https://www.slideshare.net/miguemeneses/thermophysical).
38. Merck Veterinary Manual. Nutritional Requirements of Small Animals. https://www.merckvetmanual.com/management-and-nutrition/nutrition-small-animals/nutritional-requirements-of-small-animals
39. National Research Council. Your Dog's Nutritional Needs: A Science-Based Guide for Pet Owners. National Academies Press, 2006. https://nap.nationalacademies.org/resource/10668/dog_nutrition_final_fix.pdf
40. Mullis RA, Witzel AL, Price J. Maintenance energy requirements of odor detection, explosive detection and human detection working dogs. PeerJ, 2015. https://pmc.ncbi.nlm.nih.gov/articles/PMC4349026/
41. Loftus JP, et al. Energy requirements for racing endurance sled dogs. Journal of Nutritional Science, 2014. https://pmc.ncbi.nlm.nih.gov/articles/PMC4473159/
42. Merck Veterinary Manual. Renal Dysfunction in Dogs and Cats. https://www.merckvetmanual.com/urinary-system/noninfectious-diseases-of-the-urinary-system-in-small-animals/renal-dysfunction-in-dogs-and-cats
43. Merck Veterinary Manual. Nutrition in Hepatic Disease in Small Animals. https://www.merckvetmanual.com/digestive-system/hepatic-disease-in-small-animals/nutrition-in-hepatic-disease-in-small-animals
44. Merck Veterinary Manual. Pancreatitis in Dogs and Cats. https://www.merckvetmanual.com/digestive-system/the-exocrine-pancreas/pancreatitis-in-dogs-and-cats
45. Weeth LP. Nutritional Management of Hyperlipidemia. Today's Veterinary Practice, 2022. https://todaysveterinarypractice.com/nutrition/nutritional-management-of-hyperlipidemia/
46. Merck Veterinary Manual. Nutrition in Disease Management in Small Animals: Obesity. https://www.merckvetmanual.com/management-and-nutrition/nutrition-small-animals/nutrition-in-disease-management-in-small-animals
47. Merck Veterinary Manual. Vomiting in Dogs. https://www.merckvetmanual.com/dog-owners/digestive-disorders-of-dogs/vomiting-in-dogs
48. Merck Veterinary Manual. Esophagitis in Small Animals. https://www.merckvetmanual.com/digestive-system/diseases-of-the-esophagus-in-small-animals/esophagitis-in-small-animals
49. Merck Veterinary Manual. Overview of Motion Sickness (signs of nausea). https://www.merckvetmanual.com/nervous-system/motion-sickness/overview-of-motion-sickness
50. Ferguson L, Wennogle SA, Webb CB. Bilious vomiting syndrome in dogs: retrospective study of 20 cases (2002–2012). Journal of the American Animal Hospital Association, 2016. https://pubmed.ncbi.nlm.nih.gov/27008323/
51. FEDIAF. Nutritional Guidelines for Complete and Complementary Pet Food for Cats and Dogs, September 2025, Table VII-9. https://europeanpetfood.org/wp-content/uploads/2025/09/FEDIAF-Nutritional-Guidelines_2025.pdf
52. Bailey J. All About Elevated Dog Bowls. Whole Dog Journal, 2022. https://www.whole-dog-journal.com/lifestyle/dog-gear/all-about-elevated-dog-bowls/
53. Wooten S. Managing Megaesophagus in Dogs. Hill's Pet Nutrition, 2020. https://www.hillspet.com/dog-care/healthcare/megaesophagus-in-dogs

Not veterinary advice. If your pet has a medical condition, follow your vet's feeding plan.

## License

MIT
