const db = require("../db");
const { add_role } = require("../func");

module.exports = {
	name: 'startgame',
	type: 'Games',
    description: 'Start a game of Pinapl Murder Royale.',
	usage: false,
	execute(message) {
        if (message.channel.id === '818547774567612483') {

            const filter = (reaction, user) => {
                return (reaction.emoji.name === '💀') && user.id != '818709319084015616';
            };

            message.channel.send('𝕿𝖍𝖊 𝕽𝖊𝖆𝖕𝖎𝖓𝖌 𝖍𝖆𝖘 𝖇𝖊𝖌𝖚𝖓!\nReact to the skull below to join!\n**The Reaping selection will last for 30 minutes. Please react fast!**').then(msg => {
                msg.react('💀');
                msg.awaitReactions(filter, { time: 1.8e+6, errors: ['time'] })
                .catch(collected => {
                    const reaction = collected.first();
                    const users = [];
                    reaction.users.cache.forEach(function(val, key) {
                        users.push(`<@${key}>`);
                        if (key != '818709319084015616') {
                            db.tributes.set(key, {
                                health: 4,
                                kill_num: 0,
                                in_corn: true,
                                action: false,
                                inventory: [],
                                status: "Alive",
                            });
                            db.tributes.push('Alive', key);
                            db.tributes.set('Dead', []);
                            db.stats.math('Players Left', '+', 1);
                            add_role(message, key, '818547773828759584');
                        }
                    });
                    users.shift();

                    message.channel.send(`**𝕿𝖍𝖊 𝕽𝖊𝖆𝖕𝖎𝖓𝖌**\n\n${users.join('\n')}\n\n**The games will begin soon.**\n***Don't forget to sponsor items to the cornucopia before the games begin!***\n`);
                });
            });
            db.stats.set('Game Status', 'Sponsors');
            message.delete();
        } else {
            message.delete();
            return message.channel.send('Incorrect channel.');
        }
	},
};