const path = require("path");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

module.exports = {
  mode: "development",
  context: __dirname, // to automatically find tsconfig.json
  entry: "./src/index.ts",
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      eslint: {
        files: './src/**/*.{ts,tsx,js,jsx}' // required - same as command `eslint ./src/**/*.{ts,tsx,js,jsx} --ext .ts,.tsx,.js,.jsx`
      }
    }),
  ],
  devtool: "source-map",
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
    filename: "fetch-xhr-hook.js",
    library: "fetchXhrHook",
    libraryExport: "default",
    libraryTarget: "umd",
  }
};