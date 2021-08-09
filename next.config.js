// eslint-disable-next-line import/no-extraneous-dependencies
const withTM = require('next-transpile-modules')(['three']);

module.exports = withTM({
  i18n: {
    locales: ['en-US'],
    defaultLocale: 'en-US'
  },
  eslint: {
    dirs: ['pages', 'src/components']
  }
});
