#!/usr/bin/env node
/* Check a one-page feeding plan: layout rules and that every total is re-added from the rows.
   Usage: node check_one_pager.js plan.html [--print]   (--print also checks it prints on 1 Letter page with Chrome)
   Made by PawsOnMePet. MIT License. */
const fs = require("fs"), path = require("path");
const file = process.argv[2]; if (!file) { console.error("usage: node check_one_pager.js plan.html [--print]"); process.exit(2); }
const html = fs.readFileSync(file, "utf8"), errs = [];
const text = (s) => s.replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
const num = (s) => { const m = text(s).replace(/,/g, "").match(/-?\d+(\.\d+)?/); return m ? parseFloat(m[0]) : 0; };
const near = (a, b, tol) => Math.abs(a - b) <= tol;

// Layout
const body = html.split(/<body[^>]*>/i)[1] || "";
const h1 = body.indexOf("<h1"), firstTable = body.indexOf("<table");
if (h1 < 0) errs.push("no title (h1)");
const gists = body.match(/<div class="gist">([\s\S]*?)<\/div>/g) || [];
if (gists.length !== 1) errs.push(`need exactly one Plan line, found ${gists.length}`);
else if (!/^Plan:/.test(text(gists[0]))) errs.push("the line under the title must start with 'Plan:'");
const between = body.slice(body.indexOf("</h1>") + 5, firstTable).replace(/<div class="gist">[\s\S]*?<\/div>/, "").replace(/<h2[\s\S]*?<\/h2>/g, "");
if (text(between)) errs.push("extra text between the title and the first table: " + text(between).slice(0, 60));
const tables = body.match(/<table[\s\S]*?<\/table>/g) || [];
if (tables.length !== 2) errs.push(`need exactly two tables, found ${tables.length}`);
const notes = (body.match(/<div class="notes">([\s\S]*?)<\/div>/) || [])[1] || "";
const nk = text(notes).search(/Key:/), nd = text(notes).search(/Data:/), nu = text(notes).search(/(In use|Used):/);
if (!notes || nk < 0 || nd < 0 || nu < 0 || !(nk < nd && nd < nu)) errs.push("small notes must have Key:, Data:, then In use: or Used:, in that order");
if (body.indexOf('class="notes"') < body.lastIndexOf("</table>")) errs.push("notes must come after the tables");
if (!/@media screen\s*{\s*body\s*{[^}]*padding[^}]*max-width:\s*8\.5in/.test(html)) errs.push("missing the screen side-padding rule");
if (/class="stopped"/.test(html) && !/tr\.stopped td,\s*tr\.stopped td \*\s*{[^}]*line-through/.test(html)) errs.push("stopped rows need a full-row strikethrough rule");

// Sums: re-add every total from the rows as printed
if (tables[1]) {
  const rows = tables[1].match(/<tr[\s\S]*?<\/tr>/g).map((r) => ({ cls: (r.match(/class="([^"]+)"/) || [])[1] || "", cells: (r.match(/<td[^>]*>[\s\S]*?<\/td>/g) || []) }));
  const foods = rows.filter((r) => r.cells.length >= 5 && !/total|density|room/.test(r.cls));
  const sum = (list, i) => list.reduce((a, r) => a + num(r.cells[i]), 0);
  const whole = rows.find((r) => /whole/.test(r.cls)), add = rows.find((r) => /addons/.test(r.cls));
  const W = { kcal: sum(foods, 2), fat: sum(foods, 3), cu: sum(foods, 4) };
  const adds = foods.filter((r) => !/main/.test(r.cls)), A = { kcal: sum(adds, 2), fat: sum(adds, 3), cu: sum(adds, 4) };
  if (!whole) errs.push("no 'Whole day' row");
  else [["kcal", 2, 1], ["fat", 3, 0.11], ["cu", 4, 0.011]].forEach(([k, i, t]) => { if (!near(num(whole.cells[i]), W[k], t)) errs.push(`Whole day ${k} shows ${num(whole.cells[i])}, rows add up to ${+W[k].toFixed(3)}`); });
  if (add) [["kcal", 2, 1], ["fat", 3, 0.11], ["cu", 4, 0.011]].forEach(([k, i, t]) => { if (!near(num(add.cells[i]), A[k], t)) errs.push(`Add-ons ${k} shows ${num(add.cells[i])}, rows add up to ${+A[k].toFixed(3)}`); });
  const line = (cls) => { const r = rows.find((x) => x.cls === cls); return r ? num(r.cells[0]) : null; };
  const fd = line("density-fat"), cd = line("density-cu"), room = line("fat-room");
  if (fd !== null && !near(fd, W.fat / (W.kcal / 1000), 0.11)) errs.push(`fat density shows ${fd}, should be ${(W.fat / (W.kcal / 1000)).toFixed(1)}`);
  if (cd !== null && !near(cd, W.cu / (W.kcal / 1000), 0.011)) errs.push(`copper density shows ${cd}, should be ${(W.cu / (W.kcal / 1000)).toFixed(2)}`);
  if (room !== null && !near(room, 24 * W.kcal / 1000 - W.fat, 0.11)) errs.push(`fat room shows ${room}, should be ${(24 * W.kcal / 1000 - W.fat).toFixed(1)}`);
}

// Optional: prints on one Letter page
if (process.argv.includes("--print")) {
  const chrome = process.env.CHROME || ["/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", "/usr/bin/google-chrome", "/usr/bin/chromium"].find((p) => fs.existsSync(p));
  if (!chrome) errs.push("--print: Chrome not found (set CHROME=...)");
  else {
    const os = require("os"), out = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "op-")), "p.pdf");
    require("child_process").execFileSync(chrome, ["--headless=new", "--disable-gpu", "--no-pdf-header-footer", "--user-data-dir=" + path.dirname(out) + "/prof", "--print-to-pdf=" + out, "file://" + path.resolve(file)], { stdio: "ignore" });
    const pages = (fs.readFileSync(out, "latin1").match(/\/Type\s*\/Page[^s]/g) || []).length;
    if (pages !== 1) errs.push(`prints on ${pages} pages, must be 1`);
    fs.rmSync(path.dirname(out), { recursive: true, force: true });
  }
}
console.log(errs.length ? "FAIL " + path.basename(file) + "\n  - " + errs.join("\n  - ") : "OK " + path.basename(file));
process.exit(errs.length ? 1 : 0);
