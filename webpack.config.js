const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

// Use export as a function to inspect `--mode`
module.exports = (env, argv) => {
  const is_production = argv.mode == "production";

  return {
    entry: {
      // For browsers
      "readthedocs-doc-diff": ["./src/script.js"],
      // Library for import
      "doc-diff": ["./src/extension.js"],
    },
    output: {
      filename: "[name].js?[fullhash]",
      chunkFilename: "[name].js?[chunkhash]",
      path: path.join(__dirname, "dist"),
      library: {
        name: "doc_diff",
        type: "umd",
      },
      globalObject: "this",
    },
    optimization: {
      minimize: is_production,
      minimizer: [new TerserPlugin()],
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules)/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
        },
        {
          test: /\.css$/,
          use: {
            loader: "css-loader",
            options: {
              exportType: "css-style-sheet",
            },
          },
        },
      ],
    },
    plugins: [],

    // Development options
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000,
      ignored: ["./node_modules/"],
    },
    devServer: {
      open: false,
      hot: false,
      liveReload: true,
      client: {
        logging: "verbose",
      },
    },
  };
};
