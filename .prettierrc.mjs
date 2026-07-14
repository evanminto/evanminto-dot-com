/** @type {import('prettier').Config} */
export default {
  plugins: ['prettier-plugin-astro'],
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro',
      },
    },
    {
      files: '*.jsx',
      options: {
        singleQuote: true,
      },
    },
  ],
  singleQuote: true,
};
