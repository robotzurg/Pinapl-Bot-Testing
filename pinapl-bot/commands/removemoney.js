const db = require('../db.js');

module.exports = {
	name: 'removemoney',
	aliases: ['removemoney', 'rm'],
	type: 'Admin',
    description: 'Remove money from someones account.',
	args: true,
	usage: `<user> | <amount>`,
	execute(message, args) {
		if (message.member.hasPermission('ADMINISTRATOR') || message.author.id === 122568101995872256) {

			if (message.mentions.users.first() === undefined) return message.channel.send('You didn\'t specify a user!');
			args[0] = message.mentions.users.first();
			args[1] = parseInt(args[1]);
			if (isNaN(args[1])) return message.channel.send('You didn\'t input a number!');
			let prevBalance = db.balances.get(args[0].id);
			if (prevBalance === undefined) prevBalance = false;

			if (prevBalance === false) {
				return message.channel.send('No balance for this user exists. Make an account for them!');
			} else {
				db.balances.set(args[0].id, prevBalance - args[1]);
			}
			message.channel.send(`Removed ${args[1]}<:pp:772971222119612416> from ${args[0]}'s account.`);
			message.channel.send(`Money in account: \`${db.balances.get(args[0].id)}\``);
			
		}
	},
};