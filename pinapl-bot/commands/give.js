const db = require('../db.js');

module.exports = {
	name: 'give',
	type: 'Shop',
    description: 'Give some of your pp to another user!',
    args: true,
    usage: '<user> | <amount>',
	execute(message, args) {
        const taggedUser = message.mentions.users.first();
        if (taggedUser === undefined) return message.channel.send('You didn\'t specify a user!');
        if (taggedUser === message.author) return message.channel.send('You can\'t send <:pp:772971222119612416> to yourself.');
        const send_amt = parseInt(args[1]);
        if (!Number.isInteger(send_amt)) return message.channel.send('Invalid number of <:pp:772971222119612416> to send.');

        let authorBal = db.backpack.get(message.author.id);
        if (authorBal < send_amt) return message.channel.send(`You don't have this much <:pp:772971222119612416>!\nCurrent balance: ${authorBal}`);
        let taggedUserBal = db.backpack.get(taggedUser.id);

        authorBal -= send_amt;
        taggedUserBal += send_amt;

        db.backpack.set(message.author.id, authorBal);
        db.backpack.set(taggedUser.id, taggedUserBal);

        message.channel.send(`Sent ${send_amt} <:pp:772971222119612416> to ${taggedUser}.`);
	},
};