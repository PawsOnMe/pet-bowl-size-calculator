const assert = require("assert");
const d = require("../skills/dog-diet-fat-copper/dietmath.js");
const near = (a, b, tol = 0.01) => assert.ok(Math.abs(a - b) <= tol, `${a} vs ${b}`);

near(d.rer(10), 393.6, 0.1);                       // 70 x 10^0.75
near(d.fatPctCalories(24, 1000), 20.4);            // 24 g per 1000 kcal = about 20% of calories
near(d.fatPer1000(55, 4000), 13.75);               // AAFCO 5.5% DM at 4,000 kcal/kg DM
near(d.copperPer1000(0.73, 400), 1.825);           // AAFCO 7.3 mg/kg DM at 4,000 kcal/kg DM
near(d.copperPpmDM(0.142, 90), 14.2);              // 0.142 mg/100 g fresh, 90% water
near(d.fatBudgetG(600), 14.4);                     // 24 x 600 / 1000
near(d.fatBudgetG(600), 1.68 * Math.pow(600 / 70, 1) / 1, 0.01); // same line written as 1.68 x kcal/70

const r = d.day([{ name: "main food", kcal: 500, fatG: 11, cuMg: 2 }, { name: "topper", kcal: 40, fatG: 0.5, cuMg: 0.05 }]);
near(r.fatPer1000, 21.30);                         // 11.5 g / 0.54
near(r.copperPer1000, 3.80);                       // 2.05 mg / 0.54
near(r.fatLeftG, 1.46);                            // 24 x 0.54 = 12.96 - 11.5
console.log("dietmath tests passed");
