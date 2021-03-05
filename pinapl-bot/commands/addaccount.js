const db = require('../db.js');

module.exports = {
	name: 'addaccount',
	aliases: ['addaccount', 'addac'],
	type: 'Admin',
    description: 'Add a new money account for a user.',
	args: true,
	usage: `<discord_tag> | <starting_amt>`,
	execute(message, args) {
		if (message.member.hasPermission('ADMINISTRATOR') || message.author.id === '122568101995872256') {
			const user = args[0];
			const amt = parseInt(args[1]);

			db.balances.set(user, amt);

			message.channel.send(`Made <@${user}> an account.`);
		}
	},
};