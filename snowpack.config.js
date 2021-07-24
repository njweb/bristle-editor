// eslint-disable-next-line no-undef
module.exports = {
  mount: {
    public: '/',
    src: '/_dist_',
  },
  alias: {
    '@app': './src/scripts',
  },
  devOptions: {
    port: 3020,
  },
  buildOptions: {
    clean: true,
  },
  plugins: [
    '@snowpack/plugin-dotenv',
    '@prefresh/snowpack',
    ['@snowpack/plugin-build-script', { cmd: 'stylus -I src --import \'src/styles/**/*\'', input: ['.styl'], output: ['.css'] }],
    '@snowpack/plugin-webpack',
  ],
};
