const db = require("../db");

module.exports = {
	name: 'autoenter',
	type: 'Games',
    description: 'Change your auto enter preference.',
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

        db.backpack.set(message.author.id, pref, 'auto_enter');
        if (pref === true) {
            message.channel.send('Set your auto enter preference to **always put me in the game!**');
        } else {
            message.channel.send('Set your auto enter preference to **only put me in when I react.**');
        }
	},
};