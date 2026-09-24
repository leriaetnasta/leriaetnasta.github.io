/**
 * Flattens public/i18n/<locale>.json into the fact sheet the assistant is allowed
 * to answer from, so the site copy stays the single source of truth.
 *
 *   node scripts/build-knowledge.mjs [outfile]
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const LOCALES = ["en", "fr"];
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = resolve(process.cwd(), process.argv[2] ?? "worker/src/knowledge.json");

const clean = (s) => String(s).replace(/\s+/g, " ").trim();
const join = (...parts) => parts.filter(Boolean).map(clean).join(". ").replace(/\.\./g, ".");

function docsFor(c) {
  const docs = [];
  const add = (id, section, title, text) => {
    const body = clean(text);
    if (body) docs.push({ id, section, title: clean(title), text: body });
  };

  add("profile.summary", "profile", c.brand.name,
    join(c.hero.lede, c.hero.badge, c.brand.tagline, c.meta.pageDescription, c.hero.stats.join(", ")));

  for (const s of c.itinerary.stops) {
    add(`itinerary.${clean(s.org).toLowerCase().replace(/\s+/g, "-")}`, "itinerary", `${s.org}, ${s.roleShort}`,
      join(`${s.role} at ${s.org}`, s.place, s.dateShort, s.body, s.tags.join(", ")));
  }

  for (const w of c.work.items) {
    add(`work.${clean(w.title).toLowerCase().replace(/[^a-z0-9]+/g, "-")}`, "work", w.title,
      join(w.desc, w.tags.join(", ")));
  }

  for (const p of c.projects.items) {
    add(`project.${p.code.toLowerCase()}`, "projects", p.title,
      join(p.desc, p.tags.join(", "), p.links.map((l) => l.href).join(" ")));
  }

  add("writing.posts", "writing", c.writing.title,
    c.writing.items.map((a) => `${clean(a.title)} (${clean(a.read)})`).join("; "));
  add("writing.darija", "writing", c.writing.darija.title,
    join(c.writing.darija.desc, c.writing.darija.tags.join(", ")));

  add("teaching.lessons", "teaching", c.teaching.title,
    c.teaching.lessons.map((l) => `${clean(l.name)} (${clean(l.level)})`).join("; "));
  add("teaching.languages", "teaching", c.teaching.languagesEyebrow, c.teaching.languages.join("; "));
  add("teaching.note", "teaching", c.teaching.title,
    join(c.teaching.note, c.teaching.stats.map((s) => `${clean(s.num)} ${clean(s.label)}`).join(", ")));

  add("certs.list", "certs", c.certs.title,
    c.certs.items.map((i) => `${clean(i.name)}, ${clean(i.org)}, ${clean(i.year)}`).join("; "));

  add("contact.details", "contact", c.contact.title,
    join(c.contact.desc, c.contact.links.map((l) => `${clean(l.label)}: ${clean(l.value)}`).join(", ")));

  // her own curated answers: the most authoritative phrasing available
  c.ask.answers.forEach((a, i) => add(`faq.${i + 1}`, "ask", a.keywords.slice(0, 3).join(", "), a.text));

  return docs;
}

/**
 * Markdown in knowledge/ becomes extra facts, one per `##` heading. Written in
 * English only: the model answers in the visitor's language either way. Sections
 * still holding TODO are skipped so the files can be filled in gradually.
 */
function docsFromMarkdown() {
  const dir = resolve(ROOT, "knowledge");
  if (!existsSync(dir)) return [];

  const docs = [];
  for (const file of readdirSync(dir).filter((f) => f.endsWith(".md") && f !== "README.md")) {
    const source = readFileSync(resolve(dir, file), "utf8");
    const area = file.replace(/\.md$/, "");
    for (const chunk of source.split(/^## /m).slice(1)) {
      const [heading, ...rest] = chunk.split("\n");
      const body = rest.join(" ");
      if (/TODO/.test(body)) continue;
      const text = clean(body);
      if (text.length < 40) continue;
      const slug = clean(heading).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      docs.push({ id: `${area}.${slug}`, section: area, title: clean(heading), text });
    }
  }
  return docs;
}

let version = "local";
try {
  version = execSync("git rev-parse --short HEAD", { cwd: ROOT, stdio: ["ignore", "pipe", "ignore"] })
    .toString()
    .trim();
} catch {}

const extra = docsFromMarkdown();
const bundle = { version, generatedAt: new Date().toISOString(), locales: {} };
for (const locale of LOCALES) {
  const content = JSON.parse(readFileSync(resolve(ROOT, `public/i18n/${locale}.json`), "utf8"));
  bundle.locales[locale] = [...docsFor(content), ...extra];
}

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(bundle, null, 2) + "\n");

for (const [locale, docs] of Object.entries(bundle.locales)) {
  const chars = docs.reduce((n, d) => n + d.text.length, 0);
  console.log(`${locale}: ${docs.length} docs, ${chars} chars (~${Math.round(chars / 4)} tokens)`);
}
console.log(`${extra.length} extra docs from knowledge/*.md`);
console.log(`wrote ${OUT} @ ${version}`);
