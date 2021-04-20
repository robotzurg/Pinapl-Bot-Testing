const db = require("../db");
const { add_role, updateGameStatus, updateSponsorList, updateUserStatus } = require("../func");
// const { add_role } = require("../func");

module.exports = {
	name: 'startgame',
	type: 'Games',
    description: 'Start a game of Pinapl Murder Royale.',
    //args: true,
    //usage: '<cap>',
	execute(message) {

        let dateISO = new Date().toISOString();
		let dateISOsplit = dateISO.split('T');
		dateISOsplit[1] = '13:00:00.000Z';
		let dateISOsplit2 = dateISOsplit[0].split('-');
		dateISOsplit2[2] = parseInt(dateISOsplit2[2]) + 1;
		dateISOsplit2 = dateISOsplit2.join('-');
		dateISOsplit[0] = dateISOsplit2;
		dateISO = dateISOsplit.join('T');

        const filter = (reaction, user) => {
            return (reaction.emoji.name === '💀') && user.id != '818709319084015616';
        };

        message.channel.send('𝕿𝖍𝖊 𝕽𝖊𝖆𝖕𝖎𝖓𝖌 𝖍𝖆𝖘 𝖇𝖊𝖌𝖚𝖓!\nReact to the skull below to join!**\n*(Even with auto-enter, you MUST react for this game. Future games will not require this.)\n\n' + 
        'Don\'t forget you can sponsor items for the cornucopia in <#834091745909145610>! Just use `-sponsor <item>` to sponsor.').then(msg => {
            msg.react('💀');
            msg.awaitReactions(filter, { time: new Date(dateISO).getTime() - Date.now(), errors: ['time'] })
            .catch(collected => {
                const reaction = collected.first();
                /*let role = message.mentions.roles.first();
                if(!role) role = message.guild.roles.cache.find(r => r.id == args[0]);
                if(!role) message.reply('that role does not exist!');
                
                role.members.forEach(user => {
                    users.push(`${user.user.id}`);
                });*/

                const users = [];
                reaction.users.cache.forEach(function(val, key) {
                    users.push(`${key}`);
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
                        add_role(message, key, '771373653454880848');
                        updateGameStatus(message);
                        updateSponsorList(message);
                        updateUserStatus(message);
                    }
                });

                users.shift();

                message.channel.send(`**𝕿𝖍𝖊 𝕽𝖊𝖆𝖕𝖎𝖓𝖌**\n\n${users.join('\n')}\n\n**The games will now begin!**\n`);
            });
        });
        db.stats.set('Game Status', 'Corn Sponsors');
        message.delete();
	},
};