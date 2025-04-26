/* eslint-disable @typescript-eslint/no-var-requires */
// eslint-disable-next-line import/no-extraneous-dependencies
const withTM = require('next-transpile-modules')(['three', '@react-three/fiber', '@react-three/drei']);

module.exports = withTM({
  i18n: {
    locales: ['en-US'],
    defaultLocale: 'en-US'
  },
  eslint: {
    dirs: ['pages', 'src/components']
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.(gltf)$/i,
      use: {
        loader: 'file-loader',
        options: {
          publicPath: '/_next/static/images/',
          outputPath: 'static/images/'
        }
      }
    });
    config.module.rules.push({
      test: /\.(bin)$/i,
      use: {
        loader: 'file-loader',
        options: {
          publicPath: '/_next/static/images/',
          outputPath: 'static/images/',
          name: '[name].[ext]' // keep the original name
        }
      }
    });
    return config;
  }
});
