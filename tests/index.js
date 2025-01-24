const { BytroFront } = require("../dist/index.js");
const {username, password} = require("./config.js")

async function test() {
  console.log("Hola")
  config = undefined;
  while (!config) {
    console.log("Voy a entrar a testear")
    config = await BytroFront.generateConfig(username, password, "supremacy1914.com");
    console.log("Salgo de testear")
    console.log(config)
    // let client = new BytroFront(config);
  }
}

test()