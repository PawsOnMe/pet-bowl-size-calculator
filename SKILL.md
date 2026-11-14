---
name: pet-bowl-size
description: Work out how high and how big a dog's or cat's food bowl should be from the pet's elbow height, meal size and needs (large breed, fast eater, short legs, long ears, flat face, older), and say how solid each number is. Use when someone asks what size or height of bowl, raised bowl or slow feeder their dog or cat needs. Made by PawsOnMe.
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

Made by PawsOnMe, an Etsy shop of ceramic slow feeder bowls for cats and small to medium dogs: https://www.etsy.com/shop/PawsOnMePet
