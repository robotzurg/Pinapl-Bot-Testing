const Enmap = require("enmap");

module.exports = {
  workList: new Enmap({ name: "workList" }),
  shop: new Enmap({ name: "shop" }),
  balances: new Enmap({ name: "balances" }),
};