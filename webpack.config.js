const webpack = require("webpack");
const WebpackModules = require("webpack-modules");
const path = require("path");
const config = require("sapper/config/webpack.js");
const pkg = require("./package.json");
const sveltePreprocess = require("svelte-preprocess");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

const featureFlags = require("./featureFlags.json");

const deploy = process.env.DEPLOY || "dev";

const mode = process.env.NODE_ENV;
const dev = mode === "development";
const sourceMap = dev ? "inline-cheap-module-source-map" : "source-map";

const alias = {
  "~": path.resolve(__dirname, "src/"),
  content: path.resolve(__dirname, "content"),
  scss: path.resolve(__dirname, "src/scss"),
  static: path.resolve(__dirname, "static"),
  svelte: path.resolve("node_modules", "svelte"),
};
const extensions = [".mjs", ".js", ".json", ".svelte", ".html"];
const mainFields = ["svelte", "module", "browser", "main"];
const fileLoaderRule = {
  test: /\.(png|jpe?g|gif)$/i,
  use: ["file-loader"],
};
const svgLoaderRule = {
  test: /\.svg$/,
  use: ["raw-loader"],
};
const htmlLoaderRule = {
  test: /\.html$/i,
  loader: "html-loader",
  options: {
    esModule: false,
  },
};
const {
  optimizeCarbonImports,
} = require("carbon-components-svelte/preprocess");

const preprocessOptions = {
  scss: {
    includePaths: ["src", "node_modules"],
  },
  /*  postcss: {
    plugins: [require('autoprefixer')],
  },*/
};

module.exports = {
  client: {
    entry: config.client.entry(),
    output: config.client.output(),
    resolve: { alias, extensions, mainFields },
    module: {
      rules: [
        {
          test: /\.(svelte|html)$/,
          use: {
            loader: "svelte-loader",
            options: {
              dev,
              hydratable: true,
              hotReload: false, // pending https://github.com/sveltejs/svelte/issues/2377
              preprocess: [
                sveltePreprocess(preprocessOptions),
                optimizeCarbonImports(),
              ],
            },
          },
        },
        fileLoaderRule,
        svgLoaderRule,
        htmlLoaderRule,
      ],
    },
    mode,
    plugins: [
      // pending https://github.com/sveltejs/svelte/issues/2377
      // dev && new webpack.HotModuleReplacementPlugin(),
      new webpack.DefinePlugin({
        "process.browser": true,
        "process.env": {
          NODE_ENV: JSON.stringify(mode),
          DEPLOY: JSON.stringify(deploy),
          ...featureFlags[deploy],
        },
      }),
      new BundleAnalyzerPlugin({
        openAnalyzer: false,
        analyzerMode: mode !== "development" ? "disabled" : "server",
      }),
    ].filter(Boolean),
    devtool: process.env.SOURCE_MAPS && sourceMap,
  },

  server: {
    entry: config.server.entry(),
    output: config.server.output(),
    target: "node",
    resolve: { alias, extensions, mainFields },
    externals: Object.keys(pkg.dependencies).concat("encoding"),
    module: {
      rules: [
        {
          test: /\.(svelte|html)$/,
          use: {
            loader: "svelte-loader",
            options: {
              emitCss: false,
              hotReload: false,
              generate: "ssr",
              hydratable: true,
              dev,
              preprocess: [
                sveltePreprocess(preprocessOptions),
                optimizeCarbonImports(),
              ],
            },
          },
        },
        fileLoaderRule,
        svgLoaderRule,
      ],
    },
    mode,
    plugins: [
      new webpack.DefinePlugin({
        "process.cal_adapt_features": {
          ...featureFlags[deploy],
        },
      }),
      new WebpackModules(),
    ],
    performance: {
      hints: false, // it doesn't matter if server.js is large
    },
  },

  serviceworker: {
    entry: config.serviceworker.entry(),
    output: config.serviceworker.output(),
    mode,
  },
};
