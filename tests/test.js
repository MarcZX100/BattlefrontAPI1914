const { BytroFront } = require("../dist/index.js");
// const config = require("./sup.config.js");

// let client = new BytroFront(config);

// client.Users.sendMail(48035824, "hola", "test API").then((response) => {
//   console.log(response);
// });

// client.Users.getRanking("monthRank", 0, 6).then((response) => {
//   console.log(response);
// });


// client.Games.getNewspaper(9551352, 2).then(result=>{
//   console.log(result)
// })

// console.log(client.Util.contentItems)
// client.Util.loadContentItems().then(result=>{
//   console.log(Object.keys(client.Util.contentItems))
// })

// client.Games.getOverviewOld(9536344).then(map=>{
//   console.log((map.result.logins).map(x=>parseInt(x.siteUserID)))
// })


// client.Users.getDetails(48035824).then((response) => {
//   console.log(response);
// });

async function test() {
  console.log("Hola")
  config = undefined;
  while (!config) {
    console.log("Voy a entrar a testear")
    config = await BytroFront.generateConfig("USERNAME", "PASSWORD", "supremacy1914.com");
    console.log("Salgo de testear")
    console.log(config)
    let client = new BytroFront(config);

  }

}

test()