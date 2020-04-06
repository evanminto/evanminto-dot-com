const moment = require("moment");

module.exports = function(eleventyConfig) {
  eleventyConfig.addCollection('mainNav', collection => {
    return collection.getAll()
      .filter(item => item.data.mainNav)
      .sort((a, b) => {
        const [orderA, orderB] = [a, b].map(
          item => parseInt(item.data.mainNavOrder, 10)
        );

        if (orderA === null || orderA === undefined) {
          return false;
        }

        if (orderB === null || orderB === undefined) {
          return true;
        }

        return orderA > orderB;
      });
  });

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
