module.exports = {
  WebpackDevMiddleWare: (config) => {
    config.watchOptions.poll = 300;
    return config;
  },
};
