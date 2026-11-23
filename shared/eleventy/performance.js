// Build-time optimisations, so editors keep uploading plain images and writing plain templates:
// - every /media/ image gets AVIF/WebP versions in several sizes;
// - CSS is minified and inlined, so the first paint waits for no extra request on slow connections;
// - JS is minified into one content-hashed file.
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import Image from "@11ty/eleventy-img";
import { transform } from "esbuild";

const WIDTHS = [320, 480, 640, 800, 1100, 1400];
const DEFAULT_SIZES = "(max-width:1000px) 95vw, (min-width:1440px) 650px, 45vw";
const OPTIMISABLE = /\.(jpe?g|png|webp)$/i;

const attr = (tag, name) => tag.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];
const without = (tag, name) => tag.replace(new RegExp(`\\s${name}="[^"]*"`), "");

export function configurePerformance(eleventyConfig, site) {
  const output = `sites/${site}/_site`;
  const bundles = new Map();
  const inlined = new Map();

  const writeHashed = async (kind, source) => {
    const hash = crypto.createHash("sha256").update(source).digest("hex").slice(0, 10);
    const url = `/${kind}/bundle-${hash}.${kind}`;
    if (!bundles.has(url)) {
      bundles.set(url, (async () => {
        const { code } = await transform(source, { loader: kind, minify: true });
        await fs.promises.mkdir(path.join(output, kind), { recursive: true });
        await fs.promises.writeFile(path.join(output, url), code);
      })());
    }
    await bundles.get(url);
    return url;
  };

  const pictureFor = async (tag, isFirst) => {
    const src = attr(tag, "src");
    const file = path.join("content/media", decodeURIComponent(src.slice("/media/".length)));
    const { width } = (await Image(file, { widths: [null], formats: ["jpeg"], dryRun: true })).jpeg[0];
    const widths = [...WIDTHS.filter((w) => w < width), width];
    const stats = await Image(file, {
      widths,
      formats: ["avif", "webp"],
      outputDir: path.join(output, "media/opt"),
      urlPath: "/media/opt/",
      sharpAvifOptions: { quality: 55, effort: 4 },
      sharpWebpOptions: { quality: 76 },
    });
    const sizes = attr(tag, "data-sizes") || DEFAULT_SIZES;
    const sources = ["avif", "webp"].map((format) =>
      `<source type="image/${format}" srcset="${stats[format].map((s) => s.srcset).join(", ")}" sizes="${sizes}">`
    );
    let img = without(without(without(tag, "data-sizes"), "loading"), "decoding");
    const loading = isFirst ? ' fetchpriority="high" decoding="async"' : ' loading="lazy" decoding="async"';
    img = img.replace(/\s*\/?>$/, `${loading}>`);
    return `<picture>${sources.join("")}${img}</picture>`;
  };

  eleventyConfig.addTransform("performance", async function (html) {
    if (!(this.page.outputPath || "").endsWith(".html")) return html;

    // Images: the first one on the page is the likely main image and loads first, the rest on demand.
    const tags = [...new Set(html.match(/<img\b[^>]*>/g) || [])].filter((t) => {
      const src = attr(t, "src");
      return src?.startsWith("/media/") && OPTIMISABLE.test(src);
    });
    const firstTag = html.match(/<img\b[^>]*>/)?.[0];
    for (const tag of tags) html = html.replaceAll(tag, await pictureFor(tag, tag === firstTag));

    // CSS: same files, same order, inlined in the page.
    const links = [...html.matchAll(/<link rel="stylesheet" href="\/css\/([^"]+)">\s*/g)];
    if (links.length) {
      const css = links.map((l) => fs.readFileSync(`shared/css/${l[1]}`, "utf8")).join("\n");
      if (!inlined.has(css)) inlined.set(css, (await transform(css, { loader: "css", minify: true })).code.trim());
      links.forEach((l, i) => {
        html = html.replace(l[0], () => (i === 0 ? `<style>${inlined.get(css)}</style>\n` : ""));
      });
    }

    // JS
    if (html.includes('src="/js/site.js"')) {
      const url = await writeHashed("js", fs.readFileSync("shared/js/site.js", "utf8"));
      html = html.replace('src="/js/site.js"', `src="${url}"`);
    }
    return html;
  });
}
