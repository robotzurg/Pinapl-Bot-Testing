const db = require('../db.js');
const { updateSponsorList } = require('../func.js');

module.exports = {
	name: 'sponsor',
	type: 'Games',
    description: 'Sponsor an item for the games',
    args: true,
    usage: '<sponsor_item>',
	execute(message, args) {

        const item = args[0];

        if (db.stats.get('Game Status') === "Closed") {
            return message.channel.send('There\'s currently no game happening, so you can\'t sponsor.');
        } else if (db.stats.get('Game Status') != 'Sponsors' && db.stats.get('Game Status') != 'In-Game Sponsors') {
            return message.channel.send('The time period for sponsoring has passed for today.');
        }

        if (message.mentions.users.first() != undefined) return message.channel.send('You cannot sponsor a person.');
        if (item.includes('<#') || item.includes('<!#')) return message.channel.send('You cannot sponsor a text channel.');
        if (item.toLowerCase().includes('error') || item.toLowerCase().includes('undefined') || item.toLowerCase().includes('null') || item.toLowerCase().includes('invalid event type')) {
            return message.channel.send('This cannot be sponsored.');
        }
        if (item.includes('‎') || item === '** **') return message.channel.send('You can\'t sponsor an empty space.');
        if (item.charAt(0) === '!') return message.channel.send('You can\'t sponsor a command.');
        if (item.charAt(0) === '@' || item.charAt(0) === '<') return message.channel.send('Don\'t even try it.');

        if (item.length > 40) return message.channel.send('You\'ve breached the 40 character limit. Please shorten your sponsor\'s character length!');

        if (db.airdrop.keyArray().includes(item) || db.priority_airdrop.keyArray().includes(item)) return message.channel.send('This item has already been sponsored. Please sponsor something else!');

        if (db.stats.get('Game Status') != 'Corn Sponsors') {
            const old_sponsor = db.backpack.get(message.author.id, 'sponsored_item');
            if (old_sponsor != false) {

                const filter = (reaction, user) => {
                    return (reaction.emoji.name === '✅' || reaction.emoji.name === '❌') && user.id === message.author.id;
                };

                message.channel.send(`You've already sponsored today! Would you like to replace your current sponsor?\nCurrent Sponsor: \`${old_sponsor}\``).then(msg => {
                    msg.react('✅');
                    msg.react('❌');
                    msg.awaitReactions(filter, { max: 1, time: 15000, errors: ['time'] })
                    .then(collected => {
                        const reaction = collected.first();
                        if (reaction.emoji.name === '✅') {

                            db.priority_airdrop.delete(old_sponsor);
                            db.priority_airdrop.set(item, message.author.id);
                            updateSponsorList(message);
                            db.backpack.set(message.author.id, item, 'sponsored_item');
                            message.channel.send(`Added ${item} to the sponsor list.`);

                        } else if (reaction.emoji.name === '❌') {
                            message.channel.send(`Left your current sponsor: \`${old_sponsor}\` in the list.`);
                        }
                        
                    });
                });

            } else {
                db.priority_airdrop.set(item, message.author.id);
                db.backpack.set(message.author.id, item, 'sponsored_item');
                updateSponsorList(message);
                message.channel.send(`Added ${item} to the sponsor list.`);
            }
            
        } else {
            db.airdrop.set(item, message.author.id);
            updateSponsorList(message);
            message.channel.send(`Added ${item} to the sponsor list.`);
        }

	},
};