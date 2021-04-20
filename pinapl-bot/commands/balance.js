const db = require('../db.js');

module.exports = {
	name: 'balance',
	aliases: ['balance', 'bal'],
	type: 'Shop',
    description: 'Check a shop balance.',
	execute(message) {
		let taggedUser;

		if ((message.mentions.users.first()) != undefined) {
			taggedUser = message.mentions.users.first();
			message.channel.send(`${taggedUser} has **${db.backpack.get(taggedUser.id)}** <:pp:772971222119612416> in their account.`);
		} else {
			taggedUser = message.author.id;
			message.channel.send(`You have **${db.backpack.get(taggedUser)}** <:pp:772971222119612416> in your account.`);
		}
	},
};