const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  mode: "production",
  entry: "./src/index.ts",
  plugins: [
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {loader: "ts-loader", options: {transpileOnly: true}}
        ],
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", "js"],
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "fetch-xhr-hook.min.js",
    library: "fetchXhrHook",
    libraryExport: "default",
    libraryTarget: "umd",
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          mangle: {
            properties: {
              regex: /^_.+/,
            }
          },
        }
      }),
    ]
  }
};