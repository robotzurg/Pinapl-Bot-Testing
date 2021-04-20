const db = require('../db.js');
const Discord = require('discord.js');

module.exports = {
	name: 'leaderboard',
    aliases: ['leaderboard', 'lb'],
	type: 'Shop',
    description: 'See whats in the shop!',
	execute(message) {
        // Gives you an array
        const keyArray = db.backpack.keyArray();
        let leaderboardArray = [];
        for (let i = 0; i < keyArray.length; i++) {
            leaderboardArray.push([keyArray[i], db.backpack.get(keyArray[i])]);
        }

        const yourBalance = db.backpack.get(message.author.id);
        let yourPlacement = 0;

        leaderboardArray = leaderboardArray.sort((a, b) => b[1] - a[1]);
        for (let i = 0; i < leaderboardArray.length; i++) {
            if (leaderboardArray[i][0] === message.author.id) {
                yourPlacement = i + 1;
            }
        }

        leaderboardArray = leaderboardArray.slice(0, 10);
        let embedLBArray = [];
        let username;

        for (let i = 0; i < leaderboardArray.length; i++) {
            username = message.guild.members.cache.get(leaderboardArray[i][0]).displayName;
            embedLBArray.push(`**${i + 1}**. <:pp:772971222119612416> **${leaderboardArray[i][1]}**  ${username}`);
        }

        embedLBArray = embedLBArray.join('\n\n');

        const leaderboard = new Discord.MessageEmbed()

        .setColor('#ffff00')
        .setTitle(`Pinapl's Murder Royale Leaderboard`)
        .setDescription(embedLBArray)
        .addField('══════════════════════════', `**${yourPlacement}**. <:pp:772971222119612416> **${yourBalance}** ${message.member.displayName}`);

        message.channel.send(leaderboard);
	},
};