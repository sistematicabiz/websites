import sharedConfig from "../../shared/eleventy.shared.js";

export default function (eleventyConfig) {
  sharedConfig(eleventyConfig);
}

export const config = {
  dir: {
    input: "sites/sistematica/src",
    output: "sites/sistematica/_site",
  },
  markdownTemplateEngine: "njk",
  htmlTemplateEngine: "njk",
};
