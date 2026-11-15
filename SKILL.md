---
name: pet-bowl-size
description: Work out how high and how big a dog's or cat's food bowl should be from the pet's elbow height, meal size and needs (large breed, fast eater, short legs, long ears, flat face, older), how many calories and cups of food a dog of any breed needs a day, and which kind of food fits (dry, wet, freeze-dried, fresh, raw or homemade, and whether to add water to kibble), and say how solid each answer is. Use when someone asks what size or height of bowl, raised bowl or slow feeder their dog or cat needs, how much to feed, or what type of food to choose. Made by PawsOnMe.
---

# Pet bowl size and height

1. Ask for: dog or cat; elbow height (floor to elbow, pet standing on a flat floor); food per meal in US cups; and whether the pet is a large or giant breed, eats very fast, has short legs and a long back, long ears, a flat face, or is older. For cats the whisker span is optional.
2. Work it out, or run `bowlfit.js`:
   - Rim height: from elbow height down to 7.5 cm (3 in) below it.
   - Large or giant breed dogs: floor level unless their vet says otherwise.
   - Capacity: cups per meal × 236.6 ml × 1.5, or × 2 for a slow feeder, rounded up to the next 50 ml.
   - Cats: a dish at least as wide as the whisker span.
   - Food per meal, if the owner doesn't know it: 70 × (weight in kg)^0.75 kcal a day × life-stage factor (dog: 1.6 spayed or neutered adult, 1.8 intact, 1.2–1.4 inactive, 2–3 puppy; cat: 1.2, 1.4, 1.0, 2–3), divided by the kcal per cup on the bag and by the number of meals. Say it is a starting point and to adjust to body condition (Pet Nutrition Alliance).
3. Say how solid each number is. Rim height and capacity are rules of thumb. The large-breed caution comes from a cohort study of more than 1,600 dogs (Glickman et al., JAVMA 2000). Whisker-friendly dishes made no measurable difference in a 38-cat study (Slovak and Foster, 2021).
4. Don't diagnose. If the pet has a medical condition, tell the owner to follow their vet's feeding plan.
5. In code: `node -e "console.log(require('./bowlfit.js').recommend({species:'dog',unit:'cm',elbow:30,cupsPerMeal:1,fastEater:true}))"`

## Which kind of food: dry, wet, freeze-dried, fresh, raw or homemade

Use this when someone asks what type of food to feed a dog or whether to add water to kibble. Give the reason and say how solid it is. The tags in brackets point to the sources at the end of this section.

1. **Label first, format second.** The main food should say it is complete and balanced for the dog's life stage. In the US that is an AAFCO statement for growth, adult maintenance or all life stages [AAFCO]. In the EU it is "complete" [FEDIAF]. In China it is 全价 or 宠物配合饲料 with the species and life stage, and treats must say 宠物零食 [MARA]. Foods for intermittent or supplementary feeding, toppers and treats should stay at 10% of the diet or less [WSAVA-select]. A puppy that will weigh 70 lb (32 kg) or more as an adult needs a growth food that includes large-size dogs [Merck].
2. **Ask the maker.** WSAVA suggests asking whether the company employs a nutritionist with a PhD in animal nutrition or ACVN/ECVCN board certification, who formulates the food, what quality control it runs and how many calories it has. Be cautious with a brand that won't answer [WSAVA-select].
3. **Dry or wet.** For most healthy dogs either works, and so does a mix. Choose by the dog's needs, the budget and the routine [Tufts-canned]. Dry food is about 10% water and canned food about 68–78% [Merck]. China's standard calls food under 14% water dry and 60% or more wet [GB/T 31216]. So compare foods per 1000 kcal or on a dry-matter basis, not by the label percentages [Tufts-converter].
   - Water: in a 10-dog crossover run by a fresh-food company, dogs on a 71% moisture food drank less but took in 88 g more water a day than on kibble [Sires 2025].
   - Weight: wet food is not a proven weight tool. When kibble was soaked to 72% water and offered freely, 46 dogs ate more and fully made up the calories [Alexander 2017].
   - Teeth: plain kibble means slightly less plaque and tartar, and soaked kibble loses that effect. For a real dental benefit, look for a VOHC seal and keep brushing [VOHC] [Tufts-canned].
   - Cost: for a 55 lb dog, all-wet feeding cost about 5 times dry, and fresh food 4–6 times the priciest dry, in a 2022 price check [Tufts-cost].
   - Storage: refrigerate an opened can and use it within 48–72 hours. Use an opened bag within 2–3 months [WSAVA-FAQ] [Tufts-storage].
4. **Freeze-dried: treat it as raw unless the pack says it was cooked.** None of 49 freeze-dried cat products in a Cornell survey was fully cooked before freeze-drying, and few said raw on the pack; no dog survey was found [Reboul 2025]. Freezing, freeze-drying and dehydrating only reduce germs [CDC] [Merck], and high-pressure processing (HPP) is not sterile [AAHA-raw]. Hong Kong's government guidance treats freeze-dried raw as raw food and says to avoid it for puppies, older, pregnant or immunocompromised dogs unless a vet directs [AFCD 2026].
5. **Raw.** AVMA discourages feeding raw or undercooked animal protein [AVMA], AAHA does not endorse raw or dehydrated nonsterilized foods [AAHA-raw], and CDC does not recommend raw pet food [CDC].
   - FDA testing found Salmonella in 15 and Listeria in 32 of 196 raw samples, against 2 positives in 480 dry or semimoist samples [Nemser 2014].
   - Dogs can carry Salmonella without looking sick: 7 of 16 shed it after one contaminated meal [Finley 2007]. Raw-fed dogs carried more multidrug-resistant E. coli, 25% against 4% [Groat 2022].
   - 60% of 95 BARF rations analysed in Germany had at least one imbalance [Dillitzer 2011].
   - Claimed benefits come from owner surveys, such as a 4,022-dog questionnaire, partly funded by raw-food makers, whose authors say it does not prove cause [Hemida 2021].
   - Don't feed raw in a home with young children or older or immunocompromised people [WSAVA-FAQ]. In Los Angeles, 19 cats fell ill after raw milk, raw meat or raw pet food; 9 tested positive for bird flu (H5N1) and 14 died or were put down [CDC-MMWR 2026]. Dogs usually show mild signs [FDA-H5N1].
6. **Fresh-cooked commercial.** Fine if it passes step 1. No long-term health studies were found; the short trials are small and often run by the makers [Sires 2025]. It costs about 4–6 times the priciest dry food [Tufts-cost]. If fat matters, for example after pancreatitis, compare fat per 1000 kcal [Tufts-converter].
7. **Homemade.** Only with a recipe from a board-certified veterinary nutritionist, updated every year [AAHA-home]. 95% of 200 published recipes fell short on at least one nutrient [Stockman 2013], so did all 106 Portuguese-language recipes in another study [Pedrinelli 2017], and only 13% of owners followed their prescribed recipe exactly [Johnson 2016].
8. **Grain-free or pulse-heavy.** FDA's last update (December 2022) said the reports don't establish cause [FDA-DCM]. AAHA calls avoiding grain-free or legume-heavy diets the most conservative approach [AAHA 2021]. Tufts (June 2026) links diet-associated heart disease (DCM) to pulse-heavy diets, grain-free or not, with the cause still unknown [Tufts-DCM].
9. **Adding water to kibble.**
   - It helps when the dog needs more water. For calcium oxalate, urate or cystine bladder stones, the ACVIM consensus recommends food over 75% water or enough water added to kibble, aiming for a urine specific gravity of 1.020 or lower [ACVIM 2016]. Soft food also suits dogs with sore or missing teeth [Tufts-canned].
   - It doesn't improve digestion. 20 beagle puppies on kibble soaked at 1.5 ml of water per gram for 21 days digested it no better, grew no differently and had higher cortisol (one food, 10 dogs a group) [Zhang 2022]. It won't help weight loss on its own, because dogs eat more to make up for it [Alexander 2017].
   - Large and giant breeds: moistening alone wasn't linked to bloat (GDV), but moistened kibble with citric acid in its ingredients was, with an odds ratio of 4.19, in a 106-case study [Raghavan 2002]. Check the ingredient list, and feed two or more meals a day, since one meal a day and fast eating raised the risk [Glickman 1997] [Raghavan 2004]. A later review rated the evidence on kibble and bloat as insufficient [Buckley 2017].
   - Soaked kibble spoils like wet food. Pick up leftovers and refrigerate or throw them out promptly [FDA-handling]. No pet-specific time limit was found; CDC's rule for perishable human food is 2 hours, or 1 hour above 90°F (32°C) [CDC-food].
10. **Switching.** Mix the new food into the old over at least 3 days (25, 50, 75, then 100%) [WSAVA-FAQ], or over about a week, and longer for dogs with health problems or a sensitive stomach [Tufts-switch].
11. **Traditional Chinese veterinary medicine.** Practitioners describe kibble as warming and drying, and some advise against dry food in hot weather [Basko 2009] [Morgan 2017]. This is theory and clinical experience, not trial data. The classical texts, such as the Tang-dynasty 司牧安骥集 and the Ming-dynasty 元亨疗马集, were written for horses and stress regular, measured meals rather than any type of food [Si Mu An Ji Ji] [Yuan Heng Liao Ma Ji].
12. **When the vet should choose.** Raw, homemade or other unconventional diets, treats over 10% of calories, and a body condition score below 4 or above 5 out of 9 are all reasons for a fuller nutrition check by a vet [WSAVA 2011]. For a dog with a medical condition, the vet's feeding plan comes first.

### Sources for this section

- [AAFCO] AAFCO, Reading Labels. https://www.aafco.org/consumers/understanding-pet-food/reading-labels/
- [FEDIAF] FEDIAF Nutritional Guidelines, 2024. https://europeanpetfood.org/wp-content/uploads/2024/09/FEDIAF-Nutritional-Guidelines_2024.pdf
- [MARA] China Ministry of Agriculture and Rural Affairs, Pet Feed Labelling Rules (宠物饲料标签规定), 2018. https://faolex.fao.org/docs/pdf/chn176389.pdf
- [GB/T 31216] GB/T 31216-2014, Complete pet food: dog food (全价宠物食品 犬粮). https://openstd.samr.gov.cn/bzgk/std/newGbInfo?hcno=A8758F9C4633B2CCBEE9C82CC3F4A4D1
- [WSAVA-select] WSAVA Global Nutrition Toolkit, Selecting a pet food for your pet, 2021. https://wsava.org/wp-content/uploads/2021/04/Selecting-a-pet-food-for-your-pet-updated-2021_WSAVA-Global-Nutrition-Toolkit.pdf
- [WSAVA-FAQ] WSAVA, Frequently Asked Questions and Myths. https://wsava.org/wp-content/uploads/2020/01/Frequently-Asked-Questions-and-Myths.pdf
- [WSAVA 2011] WSAVA Nutritional Assessment Guidelines, 2011. https://wsava.org/wp-content/uploads/2020/01/WSAVA-Nutrition-Assessment-Guidelines-2011-JSAP.pdf
- [Merck] Merck Veterinary Manual, Dog and Cat Foods. https://www.merckvetmanual.com/management-and-nutrition/nutrition-small-animals/dog-and-cat-foods
- [Tufts-canned] Tufts Petfoodology, Should I feed canned or dry food?, 2016. https://sites.tufts.edu/petfoodology/2016/03/22/should-i-feed-canned-or-dry-food/
- [Tufts-converter] Tufts Petfoodology, nutrient converter, 2017. https://sites.tufts.edu/petfoodology/2017/08/07/nutrient_converter/
- [Tufts-cost] Tufts Petfoodology, Pet food costs by type, 2022. https://sites.tufts.edu/petfoodology/2022/03/21/pet-food-costs-by-type/
- [Tufts-storage] Tufts Petfoodology, The scoop on storing pet food, 2020. https://sites.tufts.edu/petfoodology/2020/10/26/the-scoop-on-storing-pet-food/
- [Tufts-switch] Tufts Petfoodology, How do I switch my pet's food?, 2019. https://sites.tufts.edu/petfoodology/2019/11/24/how-do-i-switch-my-pets-food/
- [Tufts-DCM] Tufts Petfoodology, Update on diet-associated dilated cardiomyopathy, June 2026. https://sites.tufts.edu/petfoodology/2026/06/22/update-on-diet-associated-dilated-cardiomyopathy-june-2026/
- [Sires 2025] Sires et al., 2025, water intake on fresh food vs kibble, 10 dogs, authors employed by a fresh-food company. https://pubmed.ncbi.nlm.nih.gov/41280431/
- [Alexander 2017] Alexander et al., 2017, hydrated kibble and food intake, 46 dogs (Waltham). https://pubmed.ncbi.nlm.nih.gov/29152246/
- [VOHC] Veterinary Oral Health Council, trial protocol requirements. https://vohc.org/trial-protocol-requirements/
- [Reboul 2025] Reboul et al., 2025, Cornell study of 112 commercial cat foods. https://pmc.ncbi.nlm.nih.gov/articles/PMC12460818/
- [CDC] CDC, Pet food safety. https://www.cdc.gov/healthy-pets/about/pet-food-safety.html
- [AAHA-raw] AAHA 2021 Nutrition and Weight Management Guidelines, Raw protein diet. https://www.aaha.org/resources/2021-aaha-nutrition-and-weight-management-guidelines/raw-protein-diet/
- [AAHA-home] AAHA 2021 Nutrition and Weight Management Guidelines, Home-prepared diets. https://www.aaha.org/resources/2021-aaha-nutrition-and-weight-management-guidelines/home-prepared-diets/
- [AAHA 2021] AAHA Nutrition and Weight Management Guidelines for Dogs and Cats, 2021 (funded by educational grants from pet-food companies). https://pubmed.ncbi.nlm.nih.gov/34228790/
- [AFCD 2026] Hong Kong Agriculture, Fisheries and Conservation Department, Pet food safety guidelines for pet owners, June 2026. https://www.afcd.gov.hk/tc_chi/quarantine/qua_petfood/files/PetFoodSafetyGuidelines_PetOwners_tc.pdf
- [AVMA] AVMA policy, Raw or undercooked animal-source protein in cat and dog diets. https://www.avma.org/resources-tools/avma-policies/raw-or-undercooked-animal-source-protein-cat-and-dog-diets
- [Nemser 2014] Nemser et al., 2014, FDA testing of raw and other pet foods. https://pubmed.ncbi.nlm.nih.gov/24824368/ and https://www.fda.gov/animal-veterinary/animal-health-literacy/get-facts-raw-pet-food-diets-can-be-dangerous-you-and-your-pet
- [Finley 2007] Finley et al., 2007, Salmonella shedding in dogs after a contaminated raw meal. https://pubmed.ncbi.nlm.nih.gov/17310625/
- [Groat 2022] Groat et al., 2022, raw-fed vs non-raw-fed dogs and resistant E. coli. https://pubmed.ncbi.nlm.nih.gov/35191029/
- [Dillitzer 2011] Dillitzer et al., 2011, 95 BARF rations. https://pubmed.ncbi.nlm.nih.gov/22005436/
- [Hemida 2021] Hemida et al., 2021, puppy diet and later skin signs, 4,022 dogs. https://pubmed.ncbi.nlm.nih.gov/34258795/
- [CDC-MMWR 2026] CDC MMWR, H5N1 in cats, Los Angeles County, May 2026. https://www.cdc.gov/mmwr/volumes/75/wr/mm7517a1.htm
- [FDA-H5N1] FDA, Ways to reduce the risk of H5N1 in cats (notes on dogs). https://www.fda.gov/animal-veterinary/cvm-updates/fda-outlines-ways-reduce-risk-hpai-cats
- [Stockman 2013] Stockman et al., JAVMA 2013, 200 homemade dog food recipes (UC Davis summary). https://ccah.vetmed.ucdavis.edu/sites/g/files/dgvnsk4586/files/local_resources/pdfs/Homemade_dog_food_recipes_July-15-2013_UCD-News.pdf
- [Pedrinelli 2017] Pedrinelli et al., 2017, 106 Portuguese-language homemade recipes. https://pubmed.ncbi.nlm.nih.gov/29152237/
- [Johnson 2016] Johnson et al., 2016, owner adherence to homemade recipes (Tufts). https://pubmed.ncbi.nlm.nih.gov/26493128/
- [FDA-DCM] FDA, Investigation into potential link between certain diets and canine dilated cardiomyopathy. https://www.fda.gov/animal-veterinary/outbreaks-and-advisories/fda-investigation-potential-link-between-certain-diets-and-canine-dilated-cardiomyopathy
- [ACVIM 2016] Lulich et al., ACVIM small animal consensus on the treatment and prevention of uroliths in dogs and cats, JVIM 2016. https://pmc.ncbi.nlm.nih.gov/articles/PMC5032870/
- [Zhang 2022] Zhang et al., Metabolites 2022, soaked vs dry kibble in 20 beagle puppies. https://pmc.ncbi.nlm.nih.gov/articles/PMC9697261/
- [Raghavan 2002] Raghavan M., PhD dissertation, Purdue University, 2002 (106 cases, 212 controls, 11 large and giant breeds). https://docs.lib.purdue.edu/dissertations/AAI3099198
- [Glickman 1997] Glickman et al., JAAHA 1997, GDV risk factors, 101 cases and 101 controls. https://pubmed.ncbi.nlm.nih.gov/9138229/
- [Raghavan 2004] Raghavan et al., JAAHA 2004, meal size and feeding frequency and GDV. https://pubmed.ncbi.nlm.nih.gov/15131099/
- [Buckley 2017] Buckley, Veterinary Evidence 2017, knowledge summary on kibble and GDV. https://doi.org/10.18849/ve.v2i2.63
- [FDA-handling] FDA, Tips for safe handling of pet food and treats. https://www.fda.gov/animal-veterinary/animal-health-literacy/tips-safe-handling-pet-food-and-treats
- [CDC-food] CDC, Food safety prevention (human food). https://www.cdc.gov/food-safety/prevention/index.html
- [Basko 2009] Basko, American Journal of Traditional Chinese Veterinary Medicine 4(1):77, 2009. https://ajtcvm.scholasticahq.com/article/83752.pdf
- [Morgan 2017] Morgan, IVC Journal, Chinese food therapy in the veterinary clinic, 2017. https://ivcjournal.com/chinese-food-therapy-veterinary-clinic/
- [Si Mu An Ji Ji] 司牧安骥集 (Tang dynasty), volume 2. https://www.shidianguji.com/book/NCM011X411999021550/chapter/1miqaome0a1wz
- [Yuan Heng Liao Ma Ji] 元亨疗马集 (Ming dynasty), volume 1, 刍水论. https://www.shidianguji.com/book/NA06352/chapter/1m62k3dw6pv62

Not veterinary advice. If the dog has a medical condition, follow the vet's feeding plan.

Made by PawsOnMe, an Etsy shop of ceramic slow feeder bowls for cats and small to medium dogs: https://www.etsy.com/shop/PawsOnMePet
