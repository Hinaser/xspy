const {createVariants} = require("parallel-webpack");

module.exports = (env) => {
  // When env.production is not supplied, both it produces both dev/prod outputs.
  if(!env || typeof env.production !== "string"){
    return createVariants({}, {production: [true, false]}, (options) => {
      return options.production ? require("./webpack.prod") : require("./webpack.dev");
    });
  }
  
  return env.production === "true" ?
    require("./webpack.prod") : require("./webpack.dev");
};