const moment = require("moment");

function sortProjects(projects) {
  return projects.sort((a, b) => {
    if (a.data.endDate === 'Present' || a.data.endDate > b.data.endDate) {
      return -1;
    }

    return 1;
  });
}

/**
 *
 * @param {import('@11ty/eleventy').UserConfig} eleventyConfig
 * @returns
 */
module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy('images');

  eleventyConfig.setLiquidOptions({
    dynamicPartials: false,
  });

  eleventyConfig.addCollection('showcaseProjects', collectionApi =>
    collectionApi.getFilteredByTags('project', 'showcase'));

  eleventyConfig.addCollection('designProjects', collectionApi =>
    sortProjects(collectionApi.getFilteredByTags('project', 'design')));

  eleventyConfig.addCollection('webDevProjects', collectionApi =>
    sortProjects(collectionApi.getFilteredByTags('project', 'webDev')));

  eleventyConfig.addCollection('artProjects', collectionApi =>
    sortProjects(collectionApi.getFilteredByTags('project', 'art')));

  eleventyConfig.addCollection('gameDevProjects', collectionApi =>
    sortProjects(collectionApi.getFilteredByTags('project', 'gameDev')));

  eleventyConfig.addNunjucksFilter('limit', function(array, limit) {
    return array.slice(0, limit);
  });

  eleventyConfig.addNunjucksFilter('date', function(date, format) {
    return moment(date).format(format);
  });

  eleventyConfig.addPairedShortcode('codepen', function(content, url, name) {
    const urlObject = new URL(url);

    if (urlObject.origin !== 'https://codepen.io') {
      return '';
    }

    const matches = urlObject.pathname.match(/^\/([a-zA-Z0-9_\-]+)\/pen\/([a-zA-Z0-9]+)$/);
    const [, username, pen] = matches;

    return `
<codepen-embed username="${username}" pen="${pen}" name="${name}">
  ${content}

  <p>
    <a href="${url}">View on CodePen</a>
  </p>
</codepen-embed>
    `;
  });

  eleventyConfig.addPairedShortcode('attentionbox', function(content) {
    return `
<div class="a-attention-box">
  ${content}
</div>
    `;
  });

  return {
    dir: {
      input: 'views',
      output: 'dist',
      includes: 'includes',
      layouts: 'layouts',
      data: 'data',
    },

    passthroughFileCopy: true,

    markdownTemplateEngine: 'njk',
  };
};
