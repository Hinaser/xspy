const webpackConfig = require("./webpack.prod");

webpackConfig.module.rules.forEach((rule) => {
  const useIndex = rule.use.findIndex(u => u.loader === "ts-loader");
  if(useIndex > -1){
    rule.use[useIndex].options.configFile = "tsconfig.es5.json";
  }
});

webpackConfig.output.filename = "xspy.es5.min.js";

module.exports = webpackConfig;