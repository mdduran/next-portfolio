const withTM = require('next-transpile-modules')(['three']);
module.exports = withTM({
  i18n: {
    locales: ['en-US'],
    defaultLocale: 'en-US'
  }
});
