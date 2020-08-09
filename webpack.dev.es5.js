const webpackConfig = require("./webpack.dev");

webpackConfig.module.rules.forEach((rule) => {
  const useIndex = rule.use.findIndex(u => u.loader === "ts-loader");
  if(useIndex > -1){
    rule.use[useIndex].options.configFile = "tsconfig.es5.json";
  }
});

webpackConfig.output.filename = "fetch-xhr-hook.es5.js";

module.exports = webpackConfig;