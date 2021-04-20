const Discord = require('discord.js');
const db = require('../db.js');

module.exports = {
	name: 'setupadmin',
	type: 'Admin',
    description: 'sets up admin panels',
	usage: false,
	execute(message) {
        const statusPanel = new Discord.MessageEmbed()
        .setColor('#FFFF00')
        .setTitle('Current Status of the Game')
        .setDescription(`**Game Status:** ${db.stats.get('Game Status')}\n**Day:** ${db.stats.get('Day')}\n**In-Game Time:** ${db.stats.get('Time')}\n` + 
        `**Players Left:** ${db.stats.get('Players Left')}`);
        message.channel.send(statusPanel);        

        const alivePanel = new Discord.MessageEmbed()
        .setColor('#FFFF00')
        .setTitle('Current Status of the Players in the Game');

        let playerList = db.tributes.keyArray();
        playerList = playerList.filter(s => s !== 'Alive' && s !== 'Dead');
        playerList = playerList.map(tribute => `<@${tribute}>\n**Status:** ${db.tributes.get(tribute, 'status')}` + 
        `\n**Health:** ${db.tributes.get(tribute, 'health')}\n**Has Done Action:** ${db.tributes.get(tribute, 'action')}\n**Number of Kills:** ${db.tributes.get(tribute, 'kill_num')}\n`);
        alivePanel.setDescription(playerList);
        message.channel.send(alivePanel);

        const sponsorPanel = new Discord.MessageEmbed()
        .setColor('#FFFF00')
        .setTitle('Current list of sponsors')
        .setDescription(`${db.airdrop.keyArray().join('\n')}`);
        message.channel.send(sponsorPanel);
	},
};