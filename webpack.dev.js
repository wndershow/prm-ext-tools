const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  devServer: {
    contentBase: "./dist",
    port: "3100",
    inline: true,
    historyApiFallback: true,
    hot: true
  },
  mode: "development"
});
