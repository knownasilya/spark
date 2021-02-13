module.exports = {
  singleQuote: true,
  overrides: [
    {
      files: 'client/**/*.hbs',
      options: {
        parser: 'glimmer',
        singleQuote: true,
      },
    },
  ],
};
