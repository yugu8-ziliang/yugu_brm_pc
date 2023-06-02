const path = require("path");
const webpack = require("webpack");

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  // 部署生产环境和开发环境下的URL。
  publicPath: "./",
  lintOnSave: false,
  pwa: {
    iconPaths: {
      favicon32: "favicon.ico",
      favicon16: "favicon.ico",
      appleTouchIcon: "favicon.ico",
      maskIcon: "favicon.ico",
      msTileImage: "favicon.ico",
    },
  },
  configureWebpack: {
    // resolve: {
    //   extensions: [".js", ".vue", ".json"],
    // },
    plugins: [
      new webpack.ProvidePlugin({
        "window.Quill": "quill/dist/quill.js",
        Quill: "quill/dist/quill.js",
      }),
    ],
  },
  pluginOptions: {
    "style-resources-loader": {
      preProcessor: "scss",
      patterns: [
        // 这个是绝对路径,不能使用 alias 中配置的别名路径，如@表示的src
        path.resolve(__dirname, "./src/assets/style/mixin.scss"),
      ],
    },
  },
  chainWebpack(config) {
    // set svg-sprite-loader
    config.module.rule("svg").exclude.add(resolve("src/icons")).end();
    config.module
      .rule("icons")
      .test(/\.svg$/)
      .include.add(resolve("src/icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]",
      })
      .end();
  },
};
