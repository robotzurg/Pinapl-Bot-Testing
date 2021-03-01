const db = require('../db.js');

module.exports = {
	name: 'addmoney',
	aliases: ['addmoney', 'am'],
	type: 'Admin',
    description: 'Add money to someones account.',
	args: true,
	usage: `<user> | <amount>`,
	execute(message, args) {
		if (message.member.hasPermission('ADMINISTRATOR')) {

			if (message.mentions.users.first() === undefined) return message.channel.send('You didn\'t specify a user!');
			args[0] = message.mentions.users.first();
			args[1] = parseInt(args[1]);
			if (isNaN(args[1])) return message.channel.send('You didn\'t input a number!');
			let prevBalance = db.balances.get(args[0].id);
			if (prevBalance === undefined) prevBalance = false;

			if (prevBalance === false) {
				db.balances.set(args[0].id, args[1]);
			} else {
				db.balances.set(args[0].id, prevBalance + args[1]);
			}
			message.channel.send(`Added ${args[1]}<:pp:772971222119612416> to ${args[0]}'s account.`);
			message.channel.send(`Money in account: \`${db.balances.get(args[0].id)}\``);

		}
	},
};