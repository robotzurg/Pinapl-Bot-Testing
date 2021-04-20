const Enmap = require("enmap");

module.exports = {
  workList: new Enmap({ name: "workList" }),
  shop: new Enmap({ name: "shop" }),
  backpack: new Enmap({ name: "backpack" }),
  tributes: new Enmap({ name: "tributes" }),
  inventory: new Enmap({ name: "inventory" }),
  stats: new Enmap({ name: "stats" }),
  airdrop: new Enmap({ name: "airdrop" }),
  priority_airdrop: new Enmap({ name: "priority_airdrop" }),
  leaderboard: new Enmap({ name: "leaderboard" }),
};