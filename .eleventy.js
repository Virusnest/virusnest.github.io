module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("assets");

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
