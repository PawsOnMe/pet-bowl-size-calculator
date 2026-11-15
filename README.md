# Pet Bowl Size Calculator

How high and how big should your dog's or cat's food bowl be? Measure your pet once and this free calculator gives you a rim height, a dish width, a capacity and a starting amount to feed, and tells you where each number comes from.

**Use it:** https://pawsonme.github.io/pet-bowl-size-calculator/

Made by **PawsOnMe**, an Etsy shop of ceramic slow feeder bowls for cats and small to medium dogs: https://www.etsy.com/shop/PawsOnMePet

## Quick answers

**Plain bowl, slow feeder or raised bowl: which one?**
A plain bowl on the floor suits most healthy dogs and cats. We found no vet guideline saying they need more. A slow feeder suits dogs that gulp [4], and for cats a vet consensus recommends food puzzles and several small meals a day [22]. Skip raised bowls for large and giant breeds unless your vet says otherwise [1][2][23]. A raised bowl does help some dogs, on a vet's plan: dogs with megaesophagus eat with their front legs up and stay upright for 10 to 15 minutes after meals [24], and an arthritis site run by a veterinary surgeon and rehab specialist suggests about shoulder height for dogs with front-leg or neck arthritis, which is expert advice rather than a study result [25]. More detail, with sources, is in [`SKILL.md`](SKILL.md).

**How high should my dog's food bowl be?**
No veterinary guideline sets a height. A common rule of thumb from pet-product guides puts the rim between your dog's elbow height and about 2 to 3 inches (5 to 7.5 cm) below it, measured with the dog standing on a flat floor. A floor bowl is fine for most healthy dogs.

**Are raised bowls safe for large dogs?**
In a study of more than 1,600 large and giant breed dogs, raised bowls were linked to about 20% of bloat (GDV) cases in large breeds and 52% in giant breeds [1]. A later evidence review found no study showing raised bowls lower that risk [2]. Ask your vet before raising a large or giant breed's bowl.

**How tall should a cat's bowl be?**
Most healthy cats eat fine from the floor. For an older or stiff cat, a small lift with the rim a little below the elbow can make meals easier. No study has measured this.

**How wide should a cat's bowl be? Is whisker fatigue real?**
In a study of 38 cats, whisker-friendly dishes made no difference to time spent eating, food dropped or food eaten, though 63% of owners said their cat preferred the wider dish [3]. A wide, shallow dish at least as wide as the whisker span is a cheap thing to try.

**Do slow feeder bowls work?**
In a study of 10 pet dogs, a slow feeder made them eat more slowly. They got quicker with practice but stayed slower than with a plain bowl, and they preferred the plain bowl when given the choice [4]. Eating fast was a bloat (GDV) risk factor in two Purdue studies [1][20] but not in a study of 74 Irish setters [21]. No trial has shown that slow feeders prevent bloat.

**How big should the bowl be?**
Big enough for one meal with room to spare: 1.5 times the meal volume for a regular bowl, 2 times for a slow feeder, because the ridges take up space. 1 US cup is 236.6 ml. This is our rule of thumb.

**How much should I feed my dog or cat?**
Start with the chart on the food bag, or work it out: resting energy is 70 × (weight in kg)^0.75 kcal a day, times a life-stage factor, for example 1.6 for a spayed or neutered adult dog, 1.2 for a spayed or neutered adult cat, and 2 to 3 for puppies and kittens [5]. Divide by the calories per cup on the bag, then pick a bowl that holds one meal with room to spare. Pets can differ from these estimates by as much as 50%, so check body condition and adjust [5]. For weight loss, ask your vet for a plan.

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
| Rim height | from elbow height down to 7.5 cm (3 in) below it | rule of thumb |
| Large or giant breed | floor level unless a vet advises otherwise | cohort study [1], review [2] |
| Cat dish width | at least the whisker span | 38-cat study [3] |
| Calories a day | 70 × kg^0.75 × life-stage factor (dog 1.6 / 1.8 / 1.2–1.4 / 2–3; cat 1.2 / 1.4 / 1.0 / 2–3 for spayed or neutered, intact, inactive, young), divided by kcal per cup | Pet Nutrition Alliance table [5] |
| Capacity | cups per meal × 236.6 ml × 1.5 (× 2 for a slow feeder), rounded up to 50 ml | rule of thumb |

Everything is in [`bowlfit.js`](bowlfit.js), with no dependencies, and tested in [`test/`](test). The rules and sources are also in [`data/guidance.json`](data/guidance.json).

```js
const { recommend } = require("./bowlfit.js");
recommend({ species: "dog", unit: "cm", elbow: 11, cupsPerMeal: 0.5, fastEater: true, shortLegs: true });
// rim 3.5 to 11 cm off the floor, holds at least 250 ml, slow feeder worth trying
```

## Use it with an AI agent

`SKILL.md` makes this folder an agent skill. In Claude Code, copy the folder into `~/.claude/skills/` and ask "what size bowl does my dog need?". `llms.txt` has a short summary for AI crawlers.

## Second skill: low-fat and low-copper diet math

[`skills/dog-diet-fat-copper`](skills/dog-diet-fat-copper/SKILL.md) is for dogs whose vet has prescribed a low-fat or copper-restricted diet. It works out calories from body weight, a daily fat budget in grams (24 g per 1000 kcal), fat and copper per 1000 kcal, copper on a dry-matter basis, and what one topper does to the whole day, with a source for every reference line. The math is in [`dietmath.js`](skills/dog-diet-fat-copper/dietmath.js), tested in [`test/`](test). It also has a one-page feeding plan template and a checker that adds every total up again from the rows. Not veterinary advice; the vet's targets win.

## Our bowls

The calculator also checks your numbers against the bowls we make. Sizes as listed in our shop, November 2026:

| Bowl | Across | Rim height | Holds |
|---|---|---|---|
| Lilac flower ceramic slow feeder plate | 14.8 cm (5.8 in) | 3.5 cm (1.4 in) | 310 ml |
| Butter yellow ceramic slow feeder plate, medium | 15.5 cm (6.1 in) | 4 cm (1.6 in) | 400 ml |
| Lilac flower slow feeder on a pedestal | 14.8 cm (5.8 in) | 8.5 cm (3.3 in) | 310 ml |
| Sage green raised tilted slow feeder | 14.8 cm (5.8 in) | 11 cm (4.3 in) | 200 ml |
| Two-tone raised tilted flower slow feeder | 14.5 cm (5.7 in) | 10.5 cm (4.1 in) | 200 ml |

They're made for cats and small to medium dogs. When none of them fits, the calculator says so. Take the measurements and shop anywhere.

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
21. Elwood CM. Risk factors for gastric dilatation in Irish setter dogs. Journal of Small Animal Practice, 1998. https://pubmed.ncbi.nlm.nih.gov/9577760/
22. Sadek T, et al. Feline feeding programs: addressing behavioural needs to improve feline health and wellbeing. AAFP consensus statement, Journal of Feline Medicine and Surgery, 2018. https://pmc.ncbi.nlm.nih.gov/articles/PMC11343346/
23. Merck Veterinary Manual. Gastric Dilation and Volvulus in Small Animals. https://www.merckvetmanual.com/digestive-system/diseases-of-the-stomach-and-intestines-in-small-animals/gastric-dilation-and-volvulus-in-small-animals
24. Merck Veterinary Manual. Dilatation of the Esophagus in Small Animals. https://www.merckvetmanual.com/digestive-system/diseases-of-the-esophagus-in-small-animals/dilatation-of-the-esophagus-in-small-animals
25. Canine Arthritis Resources and Education (CARE). Food bowls: How can I make it easier for my dog to eat? https://caninearthritis.org/article/food-bowls-raised-feeding-stations/

Not veterinary advice. If your pet has a medical condition, follow your vet's feeding plan.

## License

MIT
