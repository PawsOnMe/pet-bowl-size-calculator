# Pet Bowl Size Calculator

How high and how big should your dog's or cat's food bowl be? Measure your pet once and this free calculator gives you a rim height, a dish width, a capacity and a starting amount to feed, and tells you where each number comes from.

**Use it:** https://pawsonmepet.github.io/pet-bowl-size-calculator/

Made by **PawsOnMePet**, an Etsy shop of ceramic slow feeder bowls for cats and small to medium dogs: https://www.etsy.com/shop/PawsOnMePet

## Quick answers

**How high should my dog's food bowl be?**
No veterinary guideline sets a height. A common rule of thumb from pet-product guides puts the rim between your dog's elbow height and about 2 to 3 inches (5 to 7.5 cm) below it, measured with the dog standing on a flat floor. A floor bowl is fine for most healthy dogs.

**Are raised bowls safe for large dogs?**
In a study of more than 1,600 large and giant breed dogs, raised bowls were linked to about 20% of bloat (GDV) cases in large breeds and 52% in giant breeds [1]. A later evidence review found no study showing raised bowls lower that risk [2]. Ask your vet before raising a large or giant breed's bowl.

**How tall should a cat's bowl be?**
Most healthy cats eat fine from the floor. For an older or stiff cat, a small lift with the rim a little below the elbow can make meals easier. No study has measured this.

**How wide should a cat's bowl be? Is whisker fatigue real?**
In a study of 38 cats, whisker-friendly dishes made no difference to time spent eating, food dropped or food eaten, though 63% of owners said their cat preferred the wider dish [3]. A wide, shallow dish at least as wide as the whisker span is a cheap thing to try.

**Do slow feeder bowls work?**
In a small study of five dogs, a slow feeder lowered eating speed [4]. Eating fast was one of the bloat risk factors in the large-breed study [1]. No trial has shown that slow feeders prevent bloat.

**How big should the bowl be?**
Big enough for one meal with room to spare: 1.5 times the meal volume for a regular bowl, 2 times for a slow feeder, because the ridges take up space. 1 US cup is 236.6 ml. This is our rule of thumb.

**How much should I feed my dog or cat?**
Start with the chart on the food bag, or work it out: resting energy is 70 × (weight in kg)^0.75 kcal a day, times a life-stage factor, for example 1.6 for a spayed or neutered adult dog, 1.2 for a spayed or neutered adult cat, and 2 to 3 for puppies and kittens [5]. Divide by the calories per cup on the bag, then pick a bowl that holds one meal with room to spare. Pets can differ from these estimates by as much as 50%, so check body condition and adjust [5]. For weight loss, ask your vet for a plan.

**What should I feed?**
A food whose label says it is complete and balanced for your pet's life stage: growth, adult maintenance or all life stages. For a puppy that will be a large dog, the label should say the food includes growth of large size dogs [6]. That rule exists because large-breed puppies need tighter calcium limits [7].

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
4. Buckley L. "Go slow" feeding bowls: how effective are they? Conference poster, Harper Adams University, 2016. https://hau.repository.guildhe.ac.uk/id/eprint/15072/

5. Pet Nutrition Alliance. Calculating Calories Based on Pet Needs. https://petnutritionalliance.org/wp-content/uploads/2023/03/MER.RER_.PNA_.pdf
6. Merck Veterinary Manual. Dog and Cat Foods. https://www.merckvetmanual.com/management-and-nutrition/nutrition-small-animals/dog-and-cat-foods
7. Whole Dog Journal. In the Fine Print: Nutritional Adequacy Statements. https://www.whole-dog-journal.com/food/in-the-fine-print-nutritional-adequacy-statements/

Not veterinary advice. If your pet has a medical condition, follow your vet's feeding plan.

## License

MIT
