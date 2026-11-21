import { configureSite } from "../../shared/eleventy/site-config.js";

export default function (eleventyConfig) {
  const config = configureSite(eleventyConfig, "laura");

  // Sveltia CMS lives only on the laura site (it edits content for both sites).
  // Copied as-is: not processed as templates.
  eleventyConfig.addPassthroughCopy({ "sites/laura/src/admin": "admin" });
  eleventyConfig.ignores.add("sites/laura/src/admin/**");

  // Files uploaded through the CMS (media_folder in admin/config.yml)
  eleventyConfig.addPassthroughCopy({ "content/laura/uploads": "uploads" });

  return config;
}
