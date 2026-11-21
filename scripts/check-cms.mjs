// Run with: npm run check:cms
// Compares Sveltia config fields with the content files: reports file keys the CMS doesn't know
// (they would be dropped on save) and required CMS fields missing from files.
import yaml from "js-yaml"; import fs from "fs"; import path from "path";
const root = process.argv[2] || ".";
const c = yaml.load(fs.readFileSync(path.join(root, "sites/laura/src/admin/config.yml"), "utf8"));
const read = (f) => { const t = fs.readFileSync(f, "utf8"); if (f.endsWith(".md")) { const m = t.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/); const d = yaml.load(m[1]) || {}; if (m[2].trim()) d.body = m[2]; return d; } return yaml.load(t); };
const problems = [];
function cmp(fields, data, where) {
  if (data == null) return;
  const names = new Set(fields.map((f) => f.name));
  for (const k of Object.keys(data)) if (!names.has(k)) problems.push(`${where}: key "${k}" not in CMS config`);
  for (const f of fields) {
    const v = data[f.name];
    if (v === undefined) { if (f.required !== false && f.widget !== "hidden" && f.widget !== "boolean") problems.push(`${where}: required field "${f.name}" missing`); continue; }
    if (f.widget === "object") cmp(f.fields, v, `${where}.${f.name}`);
    if (f.widget === "list" && f.fields) v.forEach((it, i) => cmp(f.fields, it, `${where}.${f.name}[${i}]`));
    if (f.widget === "list" && !f.fields && !v.every((x) => typeof x === "string")) problems.push(`${where}.${f.name}: simple list with non-strings`);
    if (f.widget === "select") { const opts = f.options.map((o) => (typeof o === "object" ? o.value : o)); if (!opts.includes(v)) problems.push(`${where}.${f.name}: "${v}" not an option`); }
    if (f.widget === "image" && v && !fs.existsSync(path.join(root, "content/media", String(v).replace(/^\/media\//, "")))) problems.push(`${where}.${f.name}: image ${v} not found`);
  }
}
let n = 0;
for (const col of c.collections) {
  if (col.files) for (const f of col.files) { cmp(f.fields, read(path.join(root, f.file)), `${col.name}/${f.name}`); n++; }
  if (col.folder) for (const file of fs.readdirSync(path.join(root, col.folder)).filter((x) => x.endsWith(".md"))) { cmp(col.fields, read(path.join(root, col.folder, file)), `${col.name}/${file}`); n++; }
}
console.log(`${n} entries checked, ${problems.length} problems`); problems.forEach((p) => console.log(" - " + p));
process.exitCode = problems.length ? 1 : 0;
