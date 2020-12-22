const Discord = require('discord.js');
const { prefix, token } = require('./config.json');

const client = new Discord.Client();
let crateID;
let crateUsrID;

client.once('ready', () => {
	console.log('Ready!');
});

setInterval (function () {
	const channel = client.channels.cache.get('771373426664275980');
	(channel.send('📦 PINAPL CRATE 📦\n*React first to claim!*')).then((msg) => {
		crateID = msg.id;
	});
}, Math.floor(Math.random() * 7.2e+7) + 2.88e+7);
	

client.on('message', async message => {

	if (message.content.includes('📦 PINAPL CRATE 📦\n*React first to claim!*')) {
		message.react('🔑');

		const filter = (reaction, user) => {
			crateUsrID = user.id;
			return ['🔑'].includes(reaction.emoji.name) && (user.id != message.author.id)
		};
		
		message.awaitReactions(filter, { max: 1 })
			.then(collected => {
				const reaction = collected.first();
		
				if (reaction.emoji.name === '🔑') {
					message.channel.send(`<@${crateUsrID}> has claimed the crate.\nYou find **${Math.floor(Math.random() * 50) + 1}** <:pp:772971222119612416>'s! Congratulations!`);
				}
			});
	}	
		
	if (message.content === '!ping') {
		message.channel.send('Pong.');
	}

	if (message.content === '!pong') {
		message.channel.send('Ping.');
	}
});


client.login(token);