const { prefix } = require('../config.json');
const Discord = require('discord.js');

module.exports = {
    name: 'help',
    type: 'Support',
	description: 'List all of my commands or info about a specific command.',
	usage: '[command name]',
	cooldown: 1,
	execute(message, args) {
        const data = [];
        const support = [];
        const admin = [];
        const shop = [];
        const botcmds = [];
        const games = [];
        const { commands } = message.client;

        if (!args.length) {
            data.push(commands.map(command => command.name));

            for (let i = 0; i < data[0].length; i++) {
                const cmdtype = commands.get(data[0][i]).type;

                switch (cmdtype) {
                    case "Bot": botcmds.push(data[0][i]); break;
                    case 'Support': support.push(data[0][i]); break;
                    case "Admin": admin.push(data[0][i]); break;
                    case 'Shop': shop.push(data[0][i]); break;
                    case 'Games': games.push(data[0][i]); break;
                }
            }

            const exampleEmbed = new Discord.MessageEmbed()
            .setColor(`${message.member.displayHexColor}`)
            .setTitle(`Pinapl's Murder Royale Bot Commands`)
            .setFooter('You can send !help <command_name> to get info on a specific command.')
            .addField('Support Commands:', support)
            .addField('Shop Commands:', shop)
            // .addField('Admin Commands:', admin)
            .addField('Internal Commands (you shouldn\'t need to use these):', botcmds);

            return message.author.send(exampleEmbed)
                .then(() => {
                    if (message.channel.type === 'dm') return;
                    message.reply('I\'ve sent you a DM with all my commands!');
                })
                .catch(error => {
                    console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
                    message.reply('it seems like I can\'t DM you! Do you have DMs disabled?');
                });
        }

        const name = args[0].toLowerCase();
        const command = commands.get(name);

        if (!command) {
            return message.reply('that\'s not a valid command!');
        }

        data.push(`**Name:** ${command.name}`);

        if (command.description) data.push(`**Description:** ${command.description}`);
        if (command.usage) data.push(`**Usage:** \`${prefix}${command.name} ${command.usage}\``);

        const specCommandEmbed = new Discord.MessageEmbed()
            .setColor(`${message.member.displayHexColor}`)
            .setTitle(`${prefix}${command.name}`);
            specCommandEmbed.setDescription(`${command.description}`);
            if (command.usage != false) {
                specCommandEmbed.addField('Example Usage:', `\`${prefix}${command.name} ${command.usage}\``);
            }

        message.channel.send(specCommandEmbed);

	},
};