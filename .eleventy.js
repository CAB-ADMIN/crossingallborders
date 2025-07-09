module.exports = function(eleventyConfig) {
  // Add Passthrough Copy for CSS & JS
  eleventyConfig.addPassthroughCopy("src/assets/css");
  eleventyConfig.addPassthroughCopy("src/assets/js"); 
  eleventyConfig.addPassthroughCopy("src/_redirects");
  eleventyConfig.addPassthroughCopy("src/assets/images");
  

  eleventyConfig.addCollection("all", function(collection) {
    return collection.getAll();
  });

  return {
    dir: {
      input: "src",  // Source folder
      output: "_site", // Output folder
      includes: "_includes", // Includes folder
      data: "_data" // Data folder
    }
  };
};