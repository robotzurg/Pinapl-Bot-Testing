// const db = require('../db.js');
// const Discord = require('discord.js');

module.exports = {
	name: 'leaderboard',
	type: 'Shop',
    description: 'See whats in the shop!',
	execute(message) {
        message.channel.send('This is currently not functional, however I should have this set up within a day or 2. Sorry for the inconvenience! -Jeff');
        /*let userArray = db.balances.keyArray();
        let moneyArray = [];
        let balance;

        for (let i = 0; i < userArray.length; i++) {
           balance = db.balances.get(userArray[i]);
           moneyArray.push(balance);
        }

        moneyArray = moneyArray.sort(function(a, b) {
            return b[0] - a[0];
        });

        const shopEmbed = new Discord.MessageEmbed()
        .setColor('#ffff00')
        .setTitle(`Citrus Shop!`);
        for (let i = 0; i < shopItemArray.length; i++) {
            const i_name = shopItemArray[i];
            const i_cost = db.shop.get(shopItemArray[i], 'cost');
            const i_desc = db.shop.get(shopItemArray[i], 'desc');
            const i_emoji = db.shop.get(shopItemArray[i], 'emoji');
            shopEmbed.addField(`${i_emoji} ${i_name} ${i_emoji}`, `Description: **${i_desc}**\nPrice: **${i_cost}**`, true);
        }

        message.channel.send(shopEmbed);*/
	},
};