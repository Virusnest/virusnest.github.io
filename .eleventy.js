const { EleventyRenderPlugin } = require("@11ty/eleventy");
module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPlugin(EleventyRenderPlugin);


  eleventyConfig.amendLibrary("md", (mdLib) => {
      // Override the default renderer for horizontal rules (---)
      mdLib.renderer.rules.hr = function (tokens, idx, options, env, self) {
        return '<div class="divider"></div>\n';
      };
    });
  eleventyConfig.addFilter("moonPhase", (date) => {
      const synodicMonth = 29.53058867;
      const knownNewMoon = new Date("2000-01-06T18:14:00Z");
      const daysSince = (new Date(date) - knownNewMoon) / 86400000;
      const phase = (((daysSince % synodicMonth) + synodicMonth) % synodicMonth) / synodicMonth;
      const glyphs = ["🌑\uFE0E", "🌒\uFE0E", "🌓\uFE0E", "🌔\uFE0E", "🌕\uFE0E", "🌖\uFE0E", "🌗\uFE0E", "🌘\uFE0E"];
      return glyphs[Math.round(phase * 8) % 8];
  });
  return {
    dir: {
      input: "content",
      output: "_site",
      includes: "../_includes",
      data: "../_data",
    },
    htmlTemplateEngine: "njk",
  };
};
