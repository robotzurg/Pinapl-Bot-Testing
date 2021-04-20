const db = require("../db");

module.exports = {
	name: 'noping',
	type: 'Games',
    description: 'Change your ping preference.',
    args: true,
	usage: '<preference>',
	execute(message, args) {
        let pref;

        if (args[0].includes('true')) {
            pref = true;
        } else if (args[0].includes('false')) {
            pref = false;
        } else {
            return message.channel.send('Invalid preference type. Preference types are true or false.');
        }

        db.backpack.set(message.author.id, pref, 'no_ping');
        if (pref === true) {
            message.channel.send('Set your ping preference to **no pings.**');
        } else {
            message.channel.send('Set your ping preference to **will ping.**');
        }
	},
};