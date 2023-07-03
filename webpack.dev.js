const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const NodemonPlugin = require('nodemon-webpack-plugin');

// const clientConfig = merge(common.client, {
//   devtool: 'inline-source-map',
//   mode: "development",
// });

const serverConfig = merge(common.server, {
  devtool: 'inline-source-map',
  mode: "development",
  plugins:[
    new NodemonPlugin({
      ignore: ['*.js.map'],
      // nodeArgs: ['--inspect=9229'],
      restartable: "rs",
      verbose: false,
    }),
  ],
});

// module.exports = [clientConfig, serverConfig];
module.exports = [serverConfig];
